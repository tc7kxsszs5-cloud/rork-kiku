import React, { useState, useRef, lazy, Suspense } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, AlertTriangle, Mic, X, AlertOctagon, Smile, Phone, Video, ChevronLeft } from 'lucide-react-native';
import { EmojiRenderer } from '@/components/EmojiRenderer';
import { replaceTextSmileys } from '@/utils/emojiUtils';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { useUser } from '@/constants/UserContext';
import { useChatBackgrounds } from '@/constants/ChatBackgroundsContext';
import { useAuth } from '@/constants/AuthContext';
import { Message, RiskLevel } from '@/constants/types';
import { HapticFeedback } from '@/constants/haptics';
import { Audio } from 'expo-av';
import { useIsMounted } from '@/hooks/useIsMounted';
import { logger } from '@/utils/logger';
import { OnlineStatus } from '@/components/OnlineStatus';
import { AnimatedLogo } from '@/components/AnimatedLogo';

// Lazy loading для тяжелых компонентов (загружаются только при открытии)
const EmojiPicker = lazy(() => 
  import('@/components/EmojiPicker').then(module => ({ default: module.EmojiPicker }))
);
const ChatBackgroundPicker = lazy(() => 
  import('@/components/ChatBackgroundPicker').then(module => ({ default: module.ChatBackgroundPicker }))
);

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: '#10b981',
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#991b1b',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  safe: 'Безопасно',
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

// Анимации для сообщений (для детского интерфейса)
const messageAnimations = new Map<string, Animated.Value>();

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ chatId?: string | string[] }>();
  // На веб и в части окружений param может прийти как строка или массив — нормализуем
  const chatId = typeof params.chatId === 'string'
    ? params.chatId
    : Array.isArray(params.chatId)
      ? params.chatId[0]
      : undefined;

  const { chats, addMessage, isAnalyzing } = useMonitoring();
  const { triggerSOS } = useParentalControls();
  const { user } = useUser();
  const { getChatBackground } = useChatBackgrounds();
  const { canChangeChatBackgrounds } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const micScaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const isMountedRef = useIsMounted();

  const chat = chatId ? chats.find((c) => c.id === chatId) : undefined;
  const chatBackground = chatId ? getChatBackground(chatId) : null;
  const chatsLoaded = Array.isArray(chats);

  const goToChatList = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/index' as never);
    }
  };

  if (!chatId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Чат не выбран</Text>
        <TouchableOpacity style={styles.backButton} onPress={goToChatList}>
          <Text style={styles.backButtonText}>← Назад к чатам</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!chat) {
    return (
      <View style={styles.container}>
        {!chatsLoaded || chats.length === 0 ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <>
            <Text style={styles.errorText}>Чат не найден</Text>
            <TouchableOpacity style={styles.backButton} onPress={goToChatList}>
              <Text style={styles.backButtonText}>← Назад к чатам</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Недоступно', 'Запись аудио недоступна в веб-версии приложения');
      return;
    }

    try {
      HapticFeedback.light();
      const permission = await Audio.requestPermissionsAsync();
      
      if (!permission.granted) {
        console.log('Permission to record denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      if (!isMountedRef.current) {
        await newRecording.stopAndUnloadAsync();
        return;
      }

      setRecording(newRecording);
      setIsRecording(true);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(micScaleAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(micScaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (err) {
      logger.error('Failed to start recording', err instanceof Error ? err : new Error(String(err)), { component: 'ChatScreen', action: 'startRecording' });
      HapticFeedback.error();
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      HapticFeedback.medium();
      setIsRecording(false);
      micScaleAnim.setValue(1);
      
      await recording.stopAndUnloadAsync();
      
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
      
      const uri = recording.getURI();
      if (!isMountedRef.current) {
        return;
      }

      setRecording(null);
      
      if (uri) {
        await transcribeAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      HapticFeedback.error();
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;

    try {
      HapticFeedback.light();
      setIsRecording(false);
      micScaleAnim.setValue(1);
      
      await recording.stopAndUnloadAsync();
      
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
      
      if (isMountedRef.current) {
        setRecording(null);
      }
    } catch (err) {
      logger.error('Failed to cancel recording', err instanceof Error ? err : new Error(String(err)), { component: 'ChatScreen', action: 'cancelRecording' });
    }
  };

  const transcribeAudio = async (uri: string) => {
    if (!isMountedRef.current) {
      return;
    }

    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('audio', blob, `recording.${fileType}`);
      } else {
        formData.append('audio', {
          uri,
          name: `recording.${fileType}`,
          type: `audio/${fileType}`,
        } as any);
      }
      
      const sttResponse = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });
      
      if (!sttResponse.ok) {
        throw new Error('Transcription failed');
      }
      
      const result = await sttResponse.json();
      if (!isMountedRef.current) {
        return;
      }

      setInputText(result.text);
      HapticFeedback.success();
    } catch (err) {
      console.error('Transcription error:', err);
      HapticFeedback.error();
    } finally {
      if (isMountedRef.current) {
        setIsTranscribing(false);
      }
    }
  };

  const handleSOSTrigger = async () => {
    if (!user) return;
    
    try {
      HapticFeedback.error();
      await triggerSOS(user.id, user.name, chatId, 'Экстренная помощь из чата');
      Alert.alert(
        '🚨 SOS Активирован',
        'Ваши родители/опекуны были уведомлены. Помощь уже в пути.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      logger.error('Failed to trigger SOS', error instanceof Error ? error : new Error(String(error)), { component: 'ChatScreen', action: 'handleSOSTrigger', chatId });
      Alert.alert('Ошибка', 'Не удалось отправить SOS сигнал');
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    Animated.sequence([
      Animated.timing(sendButtonScaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    HapticFeedback.medium();
    const sender = Math.random() > 0.5 ? chat.participants[0] : chat.participants[1];
    const senderName = sender === chat.participants[0] ? chat.participantNames[0] : chat.participantNames[1];

    // Заменяем текстовые смайлики на эмодзи перед отправкой
    const processedText = replaceTextSmileys(inputText.trim());

    await addMessage(chatId, processedText, sender, senderName);
    if (isMountedRef.current) {
      setInputText('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    HapticFeedback.light();
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderId === user?.id;
    
    // Создаем анимацию для сообщения, если её нет
    if (!messageAnimations.has(item.id)) {
      const animValue = new Animated.Value(0);
      messageAnimations.set(item.id, animValue);
      
      // Анимация появления сообщения (для детей - веселая!)
      Animated.spring(animValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
    
    const messageAnim = messageAnimations.get(item.id) || new Animated.Value(1);
    const scaleAnim = messageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
    const opacityAnim = messageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    // Яркие градиенты для детских сообщений
    const childGradients = isCurrentUser
      ? [
          ['#C9A84C', '#B8923A'], // Золотой → оранжевый
          ['#FF6B9D', '#C44569'], // Розовый → малиновый
          ['#4ECDC4', '#44A08D'], // Бирюзовый → зеленый
        ]
      : [['#E8F4FD', '#D4E9F7']]; // Светло-голубой для других

    const gradientIndex = index % childGradients.length;
    const gradientColors = childGradients[gradientIndex];

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {isCurrentUser ? (
          // Свои сообщения - с ярким градиентом
          <LinearGradient
            colors={gradientColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.messageBubble, styles.bubbleRight, styles.bubbleGradient]}
          >
            {chat.isGroup && <Text style={styles.senderNameWhite}>{item.senderName}</Text>}
            <EmojiRenderer text={item.text} emojiSize={22} style={styles.messageTextWhite} />
            
            {/* Технические детали для мониторинга (как в оригинале) */}
            {!item.analyzed && (
              <View style={styles.analyzingBadgeWhite}>
                <Text style={styles.analyzingTextWhite}>Анализ...</Text>
              </View>
            )}

            {item.analyzed && item.riskLevel && item.riskLevel !== 'safe' && (
              <View style={[styles.riskBadgeWhite, { backgroundColor: RISK_COLORS[item.riskLevel] }]}>
                <AlertTriangle size={12} color="#fff" />
                <Text style={styles.riskTextWhite}>{RISK_LABELS[item.riskLevel]}</Text>
              </View>
            )}

            {item.riskReasons && item.riskReasons.length > 0 && (
              <View style={styles.reasonsContainerWhite}>
                {item.riskReasons.map((reason, index) => (
                  <Text key={index} style={styles.reasonTextWhite}>
                    • {reason}
                  </Text>
                ))}
              </View>
            )}

            <Text style={styles.timestampWhite}>
              {new Date(item.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </LinearGradient>
        ) : (
          // Сообщения других - светлый фон с рамкой
          <View style={[styles.messageBubble, styles.bubbleLeft]}>
            {chat.isGroup && <Text style={styles.senderName}>{item.senderName}</Text>}
            <EmojiRenderer text={item.text} emojiSize={22} style={styles.messageText} />
            
            {/* Технические детали для мониторинга (как в оригинале) */}
            {!item.analyzed && (
              <View style={styles.analyzingBadge}>
                <Text style={styles.analyzingText}>Анализ...</Text>
              </View>
            )}

            {item.analyzed && item.riskLevel && item.riskLevel !== 'safe' && (
              <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[item.riskLevel] }]}>
                <AlertTriangle size={12} color="#fff" />
                <Text style={styles.riskText}>{RISK_LABELS[item.riskLevel]}</Text>
              </View>
            )}

            {item.riskReasons && item.riskReasons.length > 0 && (
              <View style={styles.reasonsContainer}>
                {item.riskReasons.map((reason, index) => (
                  <Text key={index} style={styles.reasonText}>
                    • {reason}
                  </Text>
                ))}
              </View>
            )}

            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <AnimatedLogo size={36} duration={9000} />
              <Text style={styles.headerTitleText} numberOfLines={1}>
                {chat.isGroup ? chat.groupName : chat.participantNames.join(' и ')}
              </Text>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                HapticFeedback.light();
                goToChatList();
              }}
              style={styles.headerBackTouchable}
              testID="chat-header-back"
            >
              <ChevronLeft size={24} color="#4A90E2" />
              <Text style={styles.headerBackLabel}>Назад</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {!chat.isGroup && chat.participants && chat.participants.length > 0 && (
                <>
                  <OnlineStatus userId={chat.participants[0]} size="small" style={styles.onlineStatus} />
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => {
                      HapticFeedback.medium();
                      router.push({
                        pathname: '/call',
                        params: {
                          contactName: chat.participantNames[0] || 'Контакт',
                          phoneNumber: chat.participants[0] || '',
                          type: 'audio',
                        },
                      } as any);
                    }}
                  >
                    <Phone size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => {
                      HapticFeedback.medium();
                      router.push({
                        pathname: '/call',
                        params: {
                          contactName: chat.participantNames[0] || 'Контакт',
                          phoneNumber: chat.participants[0] || '',
                          type: 'video',
                        },
                      } as any);
                    }}
                  >
                    <Video size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </>
              )}
              {canChangeChatBackgrounds() && (
                <TouchableOpacity
                  style={styles.backgroundButton}
                  onPress={() => {
                    HapticFeedback.light();
                    setShowBackgroundPicker(true);
                  }}
                >
                  <Text style={styles.backgroundButtonText}>🎨</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                testID="sos-button"
                style={styles.sosButton}
                onPress={handleSOSTrigger}
              >
                <AlertOctagon size={20} color="#fff" />
              </TouchableOpacity>
              <View style={[styles.overallRiskBadge, { backgroundColor: RISK_COLORS[chat.overallRisk] }]}>
                <Text style={styles.overallRiskText}>{RISK_LABELS[chat.overallRisk]}</Text>
              </View>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={[
          styles.container,
          chatBackground?.type === 'solid' && chatBackground.color
            ? { backgroundColor: chatBackground.color }
            : {},
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {chatBackground && chatBackground.type === 'gradient' && chatBackground.gradient ? (
          <LinearGradient
            colors={chatBackground.gradient as [string, string]}
            start={chatBackground.gradientDirection?.start || { x: 0, y: 0 }}
            end={chatBackground.gradientDirection?.end || { x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}
        <FlatList
          style={styles.messagesListContainer}
          data={Array.isArray(chat.messages) ? chat.messages : []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          extraData={chat.messages?.length ?? 0}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS !== 'web'}
          updateCellsBatchingPeriod={50}
        />

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingContainerText}>🔍 Анализ сообщения...</Text>
          </View>
        )}

        {__DEV__ && (
          <View style={styles.aiTestHint}>
            <Text style={styles.aiTestHintText}>
              Тест ИИ: отправьте сообщение — под ним появится оценка риска (безопасно / низкий / средний / высокий).
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <Animated.View style={{ transform: [{ scale: micScaleAnim }] }}>
                <View style={styles.recordingIndicator}>
                  <Mic size={24} color="#ef4444" />
                </View>
              </Animated.View>
              <Text style={styles.recordingText}>Запись...</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelRecording}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stopRecordingButton}
                onPress={stopRecording}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.emojiButton}
                onPress={() => {
                  setShowEmojiPicker(true);
                  HapticFeedback.light();
                }}
              >
                <Smile size={22} color="#C9A84C" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Введите сообщение..."
                multiline
                maxLength={500}
                editable={!isTranscribing}
              />
              {isTranscribing ? (
                <View style={styles.transcribingButton}>
                  <ActivityIndicator size="small" color="#C9A84C" />
                </View>
              ) : (
              <TouchableOpacity
                testID="mic-button"
                style={styles.micButton}
                onPress={startRecording}
                onLongPress={startRecording}
              >
                <Mic size={20} color="#C9A84C" />
              </TouchableOpacity>
              )}
              <Animated.View style={{ transform: [{ scale: sendButtonScaleAnim }] }}>
                <TouchableOpacity
                  testID="send-button"
                  style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                >
                  <Send size={20} color={inputText.trim() ? '#fff' : '#999'} />
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Emoji Picker Modal - Lazy loaded */}
      {showEmojiPicker && (
        <Suspense fallback={<View style={styles.loadingContainer}><ActivityIndicator size="small" color="#FF6B35" /></View>}>
          <EmojiPicker
            visible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
          />
        </Suspense>
      )}

      {/* Background Picker Modal - Lazy loaded */}
      {showBackgroundPicker && (
        <Suspense fallback={<View style={styles.loadingContainer}><ActivityIndicator size="small" color="#FF6B35" /></View>}>
          <ChatBackgroundPicker
            visible={showBackgroundPicker}
            onClose={() => setShowBackgroundPicker(false)}
            chatId={chatId}
            onSelect={() => {
              setShowBackgroundPicker(false);
            }}
          />
        </Suspense>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0', // Более теплый желтый фон для детей
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesListContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  messageLeft: {
    alignSelf: 'flex-start',
  },
  messageRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    minWidth: 60,
  },
  bubbleGradient: {
    borderBottomRightRadius: 6,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  bubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderWidth: 2,
    borderColor: '#E8F4FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleRight: {
    borderBottomRightRadius: 6,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
    color: '#666',
  },
  messageText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#1a1a1a',
    fontWeight: '500' as const,
  },
  messageTextWhite: {
    fontSize: 17,
    lineHeight: 24,
    color: '#fff',
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.6,
    fontWeight: '500' as const,
  },
  timestampWhite: {
    fontSize: 11,
    marginTop: 6,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600' as const,
  },
  senderNameWhite: {
    fontSize: 13,
    fontWeight: '700' as const,
    marginBottom: 6,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  safeBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  safeBadgeLight: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  analyzingBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  analyzingBadgeWhite: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  analyzingText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '500' as const,
  },
  analyzingTextWhite: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600' as const,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  riskBadgeWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  riskText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600' as const,
  },
  riskTextWhite: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600' as const,
  },
  reasonsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  reasonsContainerWhite: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  reasonText: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  reasonTextWhite: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
    fontWeight: '500' as const,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 200,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flexShrink: 1,
  },
  headerBackTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
    marginLeft: Platform.OS === 'web' ? 0 : 8,
  },
  headerBackLabel: {
    fontSize: 17,
    color: '#4A90E2',
    marginLeft: 4,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  onlineStatus: {
    marginRight: 4,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundButtonText: {
    fontSize: 18,
  },
  sosButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  overallRiskBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  overallRiskText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600' as const,
  },
  analyzingContainer: {
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderTopWidth: 1,
    borderTopColor: '#bae6fd',
  },
  analyzingContainerText: {
    fontSize: 14,
    color: '#0369a1',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  aiTestHint: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderTopWidth: 1,
    borderTopColor: '#fcd34d',
  },
  aiTestHintText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'flex-end',
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFF9C4',
    borderWidth: 2,
    borderColor: '#C9A84C',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 17,
    borderWidth: 2,
    borderColor: '#FFE5B4',
    fontWeight: '500' as const,
  },
  sendButton: {
    backgroundColor: '#C9A84C',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#B8923A',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e5e5',
    shadowOpacity: 0,
    elevation: 0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    gap: 12,
  },
  recordingIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ef4444',
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopRecordingButton: {
    backgroundColor: '#ef4444',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  micButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#C9A84C',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  transcribingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
