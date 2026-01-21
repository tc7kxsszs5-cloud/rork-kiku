import React, { useState, useRef } from 'react';
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
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, AlertTriangle, Mic, X, AlertOctagon, Smile } from 'lucide-react-native';
import { EmojiPicker } from '@/components/EmojiPicker';
import { EmojiRenderer } from '@/components/EmojiRenderer';
import { ChatBackgroundPicker } from '@/components/ChatBackgroundPicker';
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
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
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

  const chat = chats.find((c) => c.id === chatId);
  const chatBackground = chatId ? getChatBackground(chatId) : null;

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Чат не найден</Text>
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
          ['#FFD700', '#FFA500'], // Золотой → оранжевый
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
          title: chat.isGroup ? chat.groupName : chat.participantNames.join(' и '),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
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
          data={chat.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          // Оптимизация производительности
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingContainerText}>🔍 Анализ сообщения...</Text>
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
                <Smile size={22} color="#FFD700" />
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
                  <ActivityIndicator size="small" color="#FFD700" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.micButton}
                  onPress={startRecording}
                  onLongPress={startRecording}
                >
                  <Mic size={20} color="#FFD700" />
                </TouchableOpacity>
              )}
              <Animated.View style={{ transform: [{ scale: sendButtonScaleAnim }] }}>
                <TouchableOpacity
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

      {/* Emoji Picker Modal */}
      <EmojiPicker
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />

      {/* Background Picker Modal */}
      <ChatBackgroundPicker
        visible={showBackgroundPicker}
        onClose={() => setShowBackgroundPicker(false)}
        chatId={chatId}
        onSelect={() => {
          setShowBackgroundPicker(false);
        }}
      />
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
    shadowColor: '#FFD700',
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
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
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
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
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
    backgroundColor: '#FFD700',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFA500',
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
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
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
});
