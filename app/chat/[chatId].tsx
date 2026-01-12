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
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, AlertTriangle, Mic, X, AlertOctagon } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { useUser } from '@/constants/UserContext';
import { Message, RiskLevel } from '@/constants/types';
import { HapticFeedback } from '@/constants/haptics';
import { Audio } from 'expo-av';
import { useIsMounted } from '@/hooks/useIsMounted';

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: '#52C41A',      // СУПЕР ЯРКИЙ зеленый лайм (детская версия)
  low: '#4A90E2',       // СУПЕР ЯРКИЙ голубой (детская версия)
  medium: '#FFD700',    // СУПЕР ЯРКИЙ золотой (детская версия)
  high: '#FF1744',      // СУПЕР ЯРКИЙ красный (детская версия)
  critical: '#E6002E',  // СУПЕР ЯРКИЙ темно-красный (детская версия)
};

const RISK_LABELS: Record<RiskLevel, string> = {
  safe: 'Безопасно',
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { chats, addMessage, isAnalyzing } = useMonitoring();
  const { triggerSOS } = useParentalControls();
  const { user } = useUser();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const micScaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const isMountedRef = useIsMounted();

  const chat = chats.find((c) => c.id === chatId);

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
      console.error('Failed to start recording:', err);
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
      console.error('Failed to cancel recording:', err);
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
      console.error('Failed to trigger SOS:', error);
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

    await addMessage(chatId, inputText.trim(), sender, senderName);
    if (isMountedRef.current) {
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === user?.id;

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.messageRight : styles.messageLeft]}>
        <View style={[styles.messageBubble, isCurrentUser ? styles.bubbleRight : styles.bubbleLeft]}>
          {chat.isGroup && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
          
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
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: chat.isGroup ? chat.groupName : chat.participantNames.join(' и '),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={chat.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted={false}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
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
    padding: 12,
    borderRadius: 16,
  },
  bubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleRight: {
    backgroundColor: '#FFD700',
    borderBottomRightRadius: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.5,
  },
  analyzingBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  analyzingText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '500' as const,
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
  riskText: {
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
  reasonText: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
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
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  sendButton: {
    backgroundColor: '#FFD700',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
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
