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
import { chatSyncService, alertSyncService } from '@/utils/syncService';
import { trpcVanillaClient } from '@/lib/trpc';
import { useUser } from './UserContext';
import { logger } from '@/utils/logger';

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

const SIMULATED_DELAY_MS = 120;

const simulateLatency = () => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

// Функция для merge чатов с серверными (обработка конфликтов)
const mergeChatsWithServer = (localChats: Chat[], serverChats: Chat[]): Chat[] => {
  const chatMap = new Map<string, Chat>();

  // Добавляем серверные чаты
  serverChats.forEach((chat) => {
    chatMap.set(chat.id, chat);
  });

  // Объединяем с локальными (last-write-wins для конфликтов)
  localChats.forEach((localChat) => {
    const serverChat = chatMap.get(localChat.id);
    if (!serverChat) {
      // Новый чат с клиента
      chatMap.set(localChat.id, localChat);
    } else {
      // Чат существует - проверяем lastActivity
      const localLastActivity = localChat.lastActivity || 0;
      const serverLastActivity = serverChat.lastActivity || 0;

      if (localLastActivity > serverLastActivity) {
        // Локальный более свежий - объединяем сообщения
        const mergedMessages = mergeMessages(serverChat.messages, localChat.messages);
        chatMap.set(localChat.id, {
          ...localChat,
          messages: mergedMessages,
        });
      } else {
        // Серверный более свежий, но добавляем новые сообщения с клиента
        const mergedMessages = mergeMessages(serverChat.messages, localChat.messages);
        chatMap.set(localChat.id, {
          ...serverChat,
          messages: mergedMessages,
        });
      }
    }
  });

  return Array.from(chatMap.values());
};

// Функция для merge сообщений (уникальные по ID)
const mergeMessages = (serverMessages: Message[], localMessages: Message[]): Message[] => {
  const messageMap = new Map<string, Message>();

  // Добавляем серверные сообщения
  serverMessages.forEach((msg) => {
    messageMap.set(msg.id, msg);
  });

  // Добавляем/обновляем клиентские сообщения
  localMessages.forEach((msg) => {
    const existing = messageMap.get(msg.id);
    if (!existing || (msg.timestamp > existing.timestamp)) {
      messageMap.set(msg.id, msg);
    }
  });

  // Сортируем по timestamp
  return Array.from(messageMap.values()).sort((a, b) => a.timestamp - b.timestamp);
};

// Функция для merge алертов
const mergeAlertsWithServer = (localAlerts: Alert[], serverAlerts: Alert[]): Alert[] => {
  const alertMap = new Map<string, Alert>();

  // Добавляем серверные алерты
  serverAlerts.forEach((alert) => {
    alertMap.set(alert.id, alert);
  });

  // Объединяем с локальными (last-write-wins)
  localAlerts.forEach((alert) => {
    const existing = alertMap.get(alert.id);
    if (!existing || (alert.timestamp > existing.timestamp)) {
      alertMap.set(alert.id, alert);
    }
  });

  // Сортируем по timestamp (новые сверху)
  return Array.from(alertMap.values()).sort((a, b) => b.timestamp - a.timestamp);
};

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { trackEvent } = useAnalytics();
  const { personalizeAnalysis } = usePersonalizedAI();

  // Функция синхронизации данных
  const syncData = useCallback(async (silent = false) => {
    if (!isMountedRef.current || isSyncing) {
      return;
    }

    if (!silent) {
      setIsSyncing(true);
    }
    setSyncError(null);

    try {
      // Инициализируем сервисы синхронизации
      await chatSyncService.initialize();
      await alertSyncService.initialize();

      // 1. Синхронизация чатов - отправляем локальные данные
      const chatsResult = await chatSyncService.syncChats(chats);
      if (chatsResult.success && chatsResult.data.length > 0) {
        // Объединяем с локальными чатами
        const mergedChats = mergeChatsWithServer(chats, chatsResult.data);
        setChats(mergedChats);
      }

      // 2. Получение изменений чатов с сервера
      const serverChatsResult = await chatSyncService.getChats();
      if (serverChatsResult.success && serverChatsResult.data.length > 0) {
        // Merge с локальными чатами
        const mergedChats = mergeChatsWithServer(chats, serverChatsResult.data);
        setChats(mergedChats);
      }

      // 3. Синхронизация алертов - отправляем локальные данные
      const alertsResult = await alertSyncService.syncAlerts(alerts);
      if (alertsResult.success && alertsResult.data.length > 0) {
        // Объединяем с локальными алертами
        const mergedAlerts = mergeAlertsWithServer(alerts, alertsResult.data);
        setAlerts(mergedAlerts);
      }

      // 4. Получение изменений алертов с сервера
      const serverAlertsResult = await alertSyncService.getAlerts();
      if (serverAlertsResult.success && serverAlertsResult.data.length > 0) {
        // Merge с локальными алертами
        const mergedAlerts = mergeAlertsWithServer(alerts, serverAlertsResult.data);
        setAlerts(mergedAlerts);
      }

      setLastSyncTimestamp(Date.now());
      console.log('[MonitoringContext] Sync completed successfully');
    } catch (error) {
      console.error('[MonitoringContext] Sync error:', error);
      const syncErr = error instanceof Error ? error : new Error('Sync failed');
      setSyncError(syncErr);
      if (!silent) {
        trackEvent('sync_failed', { error: syncErr.message });
      }
    } finally {
      if (!silent) {
        setIsSyncing(false);
      }
    }
  }, [chats, alerts, isSyncing, trackEvent]);

  useEffect(() => {
    // Настройка каналов уведомлений для Android при инициализации
    if (Platform.OS === 'android') {
      setupNotificationChannels().catch((error) => {
        console.error('[MonitoringContext] Failed to setup notification channels:', error);
      });
    }

    // Первая синхронизация при загрузке
    const initialSync = async () => {
      await syncData(true); // Silent sync при загрузке
    };

    if (isMountedRef.current) {
      initialSync();

      // Периодическая синхронизация каждые 30 секунд
      const interval = setInterval(() => {
        if (isMountedRef.current && !isSyncing) {
          syncData(true); // Silent периодическая синхронизация
        }
      }, 30000);

      return () => {
        isMountedRef.current = false;
        clearInterval(interval);
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
  }, [syncData, isSyncing]);

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
            updatedAt: Date.now(), // Добавляем updatedAt для синхронизации
          };
        }
        return chat;
      })
    );

    // Трекинг отправки сообщения
    trackEvent('message_sent', { chatId, senderId, hasImage: !!imageUri });

    // Синхронизация после добавления сообщения (debounce 2 секунды)
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      syncData(true); // Silent sync
    }, 2000);

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

                  const chatName = chat.isGroup ? chat.groupName : chat.participantNames.join(' и ');
                  const body = `В чате "${chatName}": ${analysis.reasons[0] || 'Обнаружена угроза'}`;

                  // Локальное уведомление для текущего устройства
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

                  // Backend отправка push уведомлений на все устройства родителей
                  if (user?.id) {
                    try {
                      await trpcVanillaClient.notifications.sendRiskAlertPush.mutate({
                        userId: user.id,
                        chatId,
                        messageId: newMessage.id,
                        riskLevel: analysis.riskLevel,
                        reasons: analysis.reasons,
                        chatName,
                      });
                      console.log('[MonitoringContext] Push notification sent to parents via backend');
                    } catch (backendError) {
                      console.error('[MonitoringContext] Failed to send push via backend (non-critical):', backendError);
                      // Не критично - локальное уведомление уже отправлено
                    }
                  } else {
                    console.warn('[MonitoringContext] Cannot send push via backend: user.id is missing');
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

    // Синхронизация после разрешения алерта (debounce 2 секунды)
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      syncData(true); // Silent sync
    }, 2000);
  }, [trackEvent, syncData]);

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
      isSyncing,
      lastSyncTimestamp,
      syncError,
      addMessage,
      initializeChatMessages,
      resolveAlert,
      syncData, // Функция для ручной синхронизации
    }),
    [
      chats,
      alerts,
      unresolvedAlerts,
      criticalAlerts,
      isAnalyzing,
      isSyncing,
      lastSyncTimestamp,
      syncError,
      addMessage,
      initializeChatMessages,
      resolveAlert,
      syncData,
    ]
  );
});
