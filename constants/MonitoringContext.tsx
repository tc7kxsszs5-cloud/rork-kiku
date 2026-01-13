import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chat, Message, Alert, RiskLevel, RiskAnalysis } from '@/constants/types';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/constants/mockData';
import { HapticFeedback } from '@/constants/haptics';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAnalytics } from './AnalyticsContext';
import {
  getSoundForRiskLevel,
  getAndroidPriorityForRiskLevel,
  getChannelIdForRiskLevel,
  setupNotificationChannels,
} from '@/utils/soundNotifications';
import { analyzeMessageWithAI, analyzeImageWithAI } from './AIModerationService';
import { usePersonalizedAI } from './PersonalizedAIContext';
import { evaluateMessageRisk, evaluateImageRisk } from '@/utils/riskEvaluation';

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

const SIMULATED_DELAY_MS = 120;

const simulateLatency = () => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMountedRef = useRef(true);
  const { trackEvent } = useAnalytics();
  const { personalizeAnalysis } = usePersonalizedAI();

  useEffect(() => {
    // Настройка каналов уведомлений для Android при инициализации
    if (Platform.OS === 'android') {
      setupNotificationChannels().catch((error) => {
        console.error('[MonitoringContext] Failed to setup notification channels:', error);
      });
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const analyzeMessage = useCallback(async (message: Message): Promise<RiskAnalysis> => {
    try {
      await simulateLatency();
      // Используем расширенный AI анализ
      const aiAnalysis = await analyzeMessageWithAI(message.text, {
        useAdvancedAI: true,
        confidenceThreshold: 0.7,
      });
      return aiAnalysis;
    } catch (error) {
      console.error('Error analyzing message:', error);
      // Fallback на базовый анализ
      return evaluateMessageRisk(message);
    }
  }, []);

  const analyzeImage = useCallback(async (imageUri: string): Promise<{ blocked: boolean; reasons: string[] }> => {
    try {
      await simulateLatency();
      // Используем расширенный AI анализ изображений
      const aiAnalysis = await analyzeImageWithAI(imageUri, {
        enableImageAnalysis: true,
      });
      return {
        blocked: aiAnalysis.blocked,
        reasons: aiAnalysis.reasons,
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Fallback на базовый анализ
      return evaluateImageRisk(imageUri);
    }
  }, []);

  const addMessage = useCallback(async (chatId: string, text: string, senderId: string, senderName: string, imageUri?: string) => {
    if (!isMountedRef.current) {
      return;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      text,
      senderId,
      senderName,
      timestamp: Date.now(),
      analyzed: false,
      imageUri,
      imageAnalyzed: false,
      imageBlocked: false,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastActivity: Date.now(),
          };
        }
        return chat;
      })
    );

    // Трекинг отправки сообщения
    trackEvent('message_sent', { chatId, senderId, hasImage: !!imageUri });

    setIsAnalyzing(true);

    try {
      let analysis = await analyzeMessage(newMessage);

      // Применяем персонализированный AI для снижения ложных срабатываний
      // Используем senderId как childId (в реальном приложении нужна правильная связь)
      // Применяем персонализированный AI для снижения ложных срабатываний
      const personalizedAnalysis = personalizeAnalysis(senderId, analysis, newMessage.text);
      analysis = personalizedAnalysis;

      if (!isMountedRef.current) {
        return;
      }

      let imageAnalysis = { blocked: false, reasons: [] as string[] };
      if (imageUri) {
        imageAnalysis = await analyzeImage(imageUri);
        if (!isMountedRef.current) {
          return;
        }
      }

      if (!isMountedRef.current) {
        return;
      }

      if (analysis.riskLevel === 'critical') {
        HapticFeedback.error();
      } else if (analysis.riskLevel === 'high' || analysis.riskLevel === 'medium') {
        HapticFeedback.warning();
      } else if (analysis.riskLevel === 'safe') {
        HapticFeedback.success();
      }

      if (!isMountedRef.current) {
        return;
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            const updatedMessages = chat.messages.map((msg) =>
              msg.id === newMessage.id
                ? {
                    ...msg,
                    riskLevel: analysis.riskLevel,
                    riskReasons: analysis.reasons,
                    analyzed: true,
                    imageAnalyzed: true,
                    imageBlocked: imageAnalysis.blocked,
                    imageRiskReasons: imageAnalysis.reasons,
                  }
                : msg
            );

            const levels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
            const highestRisk = updatedMessages.reduce((max, msg) => {
              const msgLevel = msg.riskLevel || 'safe';
              return levels.indexOf(msgLevel) > levels.indexOf(max) ? msgLevel : max;
            }, 'safe' as RiskLevel);

            const shouldAlert = analysis.riskLevel !== 'safe' && analysis.riskLevel !== 'low';
            const imageRisk = imageAnalysis.blocked;

            if ((shouldAlert || imageRisk) && isMountedRef.current) {
              const newAlert: Alert = {
                id: `alert_${Date.now()}`,
                chatId,
                messageId: newMessage.id,
                riskLevel: analysis.riskLevel,
                timestamp: Date.now(),
                reasons: analysis.reasons,
                resolved: false,
              };
              setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);

              // Трекинг создания алерта
              trackEvent('alert_created', {
                alertId: newAlert.id,
                chatId,
                riskLevel: analysis.riskLevel,
                reasons: analysis.reasons,
              });

              // Отправка push уведомления родителям
              (async () => {
                try {
                  const riskLevelLabels: Record<RiskLevel, string> = {
                    safe: 'Безопасно',
                    low: 'Низкий',
                    medium: 'Средний',
                    high: 'Высокий',
                    critical: 'КРИТИЧЕСКИЙ',
                  };

                  const title = analysis.riskLevel === 'critical' 
                    ? '🚨 КРИТИЧЕСКИЙ РИСК обнаружен!'
                    : `⚠️ Обнаружен ${riskLevelLabels[analysis.riskLevel]} риск`;

                  const body = `В чате "${chat.participants.join(', ')}": ${analysis.reasons[0] || 'Обнаружена угроза'}`;

                  if (Platform.OS !== 'web') {
                    const sound = getSoundForRiskLevel(analysis.riskLevel);
                    const channelId = getChannelIdForRiskLevel(analysis.riskLevel);
                    const priority = getAndroidPriorityForRiskLevel(analysis.riskLevel);

                    await Notifications.scheduleNotificationAsync({
                      content: {
                        title,
                        body,
                        data: {
                          type: 'risk_alert',
                          alertId: newAlert.id,
                          chatId,
                          riskLevel: analysis.riskLevel,
                        },
                        sound,
                        ...(Platform.OS === 'android' && channelId ? { channelId } : {}),
                        priority,
                      },
                      trigger: null,
                    });
                  }
                } catch (error) {
                  console.error('[MonitoringContext] Failed to send push notification:', error);
                }
              })();
            }

            // Трекинг анализа сообщения
            trackEvent('message_analyzed', {
              messageId: newMessage.id,
              chatId,
              riskLevel: analysis.riskLevel,
              hasImage: !!imageUri,
              imageBlocked: imageAnalysis.blocked,
            });

            return {
              ...chat,
              messages: updatedMessages,
              overallRisk: highestRisk,
            };
          }
          return chat;
        })
      );
    } finally {
      if (isMountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, [analyzeMessage, analyzeImage, trackEvent, personalizeAnalysis]);

  const initializeChatMessages = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: INITIAL_MESSAGES[chat.id] || [],
      }))
    );
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      initializeChatMessages();
    }
  }, [initializeChatMessages]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      );
      const resolvedAlert = prev.find((a) => a.id === alertId);
      if (resolvedAlert) {
        trackEvent('alert_resolved', {
          alertId,
          chatId: resolvedAlert.chatId,
          riskLevel: resolvedAlert.riskLevel,
        });
      }
      return updated;
    });
  }, [trackEvent]);

  const unresolvedAlerts = useMemo(
    () => alerts.filter((alert) => !alert.resolved),
    [alerts]
  );

  const criticalAlerts = useMemo(
    () => unresolvedAlerts.filter((alert) => alert.riskLevel === 'critical'),
    [unresolvedAlerts]
  );

  return useMemo(
    () => ({
      chats,
      alerts,
      unresolvedAlerts,
      criticalAlerts,
      isAnalyzing,
      addMessage,
      initializeChatMessages,
      resolveAlert,
    }),
    [chats, alerts, unresolvedAlerts, criticalAlerts, isAnalyzing, addMessage, initializeChatMessages, resolveAlert]
  );
});
