import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chat, Message, Alert, RiskLevel, RiskAnalysis } from '@/constants/types';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/constants/mockData';
import { HapticFeedback } from '@/constants/haptics';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAnalytics } from './AnalyticsContext';
import { analyzeMessageWithAI, analyzeImageWithAI } from './AIModerationService';

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

type KeywordRule = {
  level: RiskLevel;
  pattern: RegExp;
  reason: string;
  category: string;
};

const KEYWORD_RULES: KeywordRule[] = [
  {
    level: 'critical',
    pattern: /(убью|убей|поконч|самоуб|умереть|взорв|бомб)/i,
    reason: 'Угроза жизни или суицидальные мотивы',
    category: 'threats',
  },
  {
    level: 'high',
    pattern: /(адрес|домашн|парол|паспорт|номер карты|cvv|секретный код)/i,
    reason: 'Запрос личных данных',
    category: 'privacy',
  },
  {
    level: 'high',
    pattern: /(перевед[ие]|деньг|карта|плати|5000|срочно оплат)/i,
    reason: 'Финансовое давление',
    category: 'fraud',
  },
  {
    level: 'high',
    pattern: /(оруж|пистолет|нож|наркот|взрывчат)/i,
    reason: 'Упоминание оружия или запрещённых веществ',
    category: 'safety',
  },
  {
    level: 'medium',
    pattern: /(никому не говори|встреча без взрослых|секретная встреча|ночью|приди один)/i,
    reason: 'Секретные встречи без взрослых',
    category: 'grooming',
  },
  {
    level: 'medium',
    pattern: /(дурак|тупой|ненавижу тебя|жирный|урод|никчем)/i,
    reason: 'Травля и унижения',
    category: 'bullying',
  },
  {
    level: 'medium',
    pattern: /(страшно|мне плохо|я боюсь|меня преследуют|издеваются)/i,
    reason: 'Запрос помощи или признаки давления',
    category: 'distress',
  },
  {
    level: 'low',
    pattern: /(ночью играть|спорим не расскажешь|скинь фотку|отправь фото)/i,
    reason: 'Подозрительные просьбы',
    category: 'boundaries',
  },
];

const IMAGE_RISK_KEYWORDS = ['weapon', 'blood', 'nsfw', 'violence', 'gun', 'knife'];

const SIMULATED_DELAY_MS = 120;

const simulateLatency = () => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

const evaluateMessageRisk = (message: Message): RiskAnalysis => {
  const normalized = message.text.toLowerCase();
  const matches = KEYWORD_RULES.filter((rule) => rule.pattern.test(normalized));

  if (!matches.length) {
    const emphasisScore = Math.min(0.4, (message.text.match(/!/g)?.length ?? 0) * 0.05);
    return {
      riskLevel: 'safe',
      reasons: [],
      confidence: 0.2 + emphasisScore,
      categories: [],
    };
  }

  const highest = matches.reduce<RiskLevel>((current, rule) => {
    return LEVEL_ORDER.indexOf(rule.level) > LEVEL_ORDER.indexOf(current) ? rule.level : current;
  }, 'safe');

  const reasons = Array.from(new Set(matches.map((match) => match.reason)));
  const categories = Array.from(new Set(matches.map((match) => match.category)));
  const numericPatterns = normalized.match(/\d{4,}/g)?.length ?? 0;
  const confidenceBoost = matches.length * 0.1 + (/[A-ZА-Я]{4,}/.test(message.text) ? 0.05 : 0) + numericPatterns * 0.04;

  return {
    riskLevel: highest,
    reasons,
    confidence: Math.min(0.99, 0.55 + confidenceBoost),
    categories,
  };
};

const evaluateImageRisk = (imageUri: string): { blocked: boolean; reasons: string[] } => {
  const normalized = imageUri.toLowerCase();
  const hit = IMAGE_RISK_KEYWORDS.find((keyword) => normalized.includes(keyword));
  if (!hit) {
    return { blocked: false, reasons: [] };
  }

  return {
    blocked: true,
    reasons: [`Изображение отмечено как рискованное по ключевому слову "${hit}"`],
  };
};

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMountedRef = useRef(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
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
      const analysis = await analyzeMessage(newMessage);

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
                        sound: analysis.riskLevel === 'critical' ? true : 'default',
                        priority: analysis.riskLevel === 'critical' ? Notifications.AndroidNotificationPriority.MAX : Notifications.AndroidNotificationPriority.HIGH,
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
  }, [analyzeMessage, analyzeImage]);

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
