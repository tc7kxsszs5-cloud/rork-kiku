import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_STORAGE_KEY = '@kiku_analytics';

export type AnalyticsEvent = 
  | 'message_sent'
  | 'message_analyzed'
  | 'alert_created'
  | 'alert_resolved'
  | 'sos_triggered'
  | 'sos_resolved'
  | 'chat_viewed'
  | 'settings_changed'
  | 'contact_added'
  | 'contact_removed'
  | 'time_restriction_added'
  | 'recommendation_viewed'
  | 'statistics_viewed'
  | 'profile_updated';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  timestamp: number;
  properties?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalMessages: number;
  totalAlerts: number;
  totalSOS: number;
  messagesAnalyzed: number;
  alertsResolved: number;
  averageRiskLevel: number;
  mostActiveChat: string | null;
  riskDistribution: {
    safe: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  eventsByType: Record<AnalyticsEvent, number>;
  dailyActivity: Array<{ date: string; events: number }>;
}

export interface AnalyticsContextValue {
  events: AnalyticsEventData[];
  metrics: AnalyticsMetrics;
  trackEvent: (event: AnalyticsEvent, properties?: Record<string, any>) => void;
  clearAnalytics: () => Promise<void>;
  exportAnalytics: () => string;
}

const DEFAULT_METRICS: AnalyticsMetrics = {
  totalMessages: 0,
  totalAlerts: 0,
  totalSOS: 0,
  messagesAnalyzed: 0,
  alertsResolved: 0,
  averageRiskLevel: 0,
  mostActiveChat: null,
  riskDistribution: {
    safe: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  },
  eventsByType: {} as Record<AnalyticsEvent, number>,
  dailyActivity: [],
};

export const [AnalyticsProvider, useAnalytics] = createContextHook<AnalyticsContextValue>(() => {
  const [events, setEvents] = useState<AnalyticsEventData[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Загрузка аналитики при инициализации
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const stored = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
        if (stored && isMountedRef.current) {
          const parsed = JSON.parse(stored);
          setEvents(parsed);
        }
      } catch (error) {
        console.error('[AnalyticsContext] Failed to load analytics:', error);
      }
    };
    loadAnalytics();
  }, []);

  // Сохранение аналитики при изменении
  useEffect(() => {
    const saveAnalytics = async () => {
      try {
        await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
      } catch (error) {
        console.error('[AnalyticsContext] Failed to save analytics:', error);
      }
    };
    if (events.length > 0) {
      saveAnalytics();
    }
  }, [events]);

  const trackEvent = useCallback((event: AnalyticsEvent, properties?: Record<string, any>) => {
    if (!isMountedRef.current) {
      return;
    }

    const eventData: AnalyticsEventData = {
      event,
      timestamp: Date.now(),
      properties,
    };

    setEvents((prev) => {
      const updated = [...prev, eventData];
      // Ограничиваем количество событий (последние 10000)
      return updated.slice(-10000);
    });

    console.log('[Analytics] Event tracked:', event, properties);
  }, []);

  const clearAnalytics = useCallback(async () => {
    setEvents([]);
    try {
      await AsyncStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch (error) {
      console.error('[AnalyticsContext] Failed to clear analytics:', error);
    }
  }, []);

  const exportAnalytics = useCallback(() => {
    return JSON.stringify(events, null, 2);
  }, [events]);

  // Вычисление метрик
  const metrics = useMemo((): AnalyticsMetrics => {
    const baseMetrics = { ...DEFAULT_METRICS };
    const eventsByType: Record<string, number> = {};
    const riskCounts: Record<string, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };
    const chatActivity: Record<string, number> = {};
    let totalRiskScore = 0;
    let riskCount = 0;

    events.forEach((eventData) => {
      // Подсчет событий по типам
      eventsByType[eventData.event] = (eventsByType[eventData.event] || 0) + 1;

      // Специфичная логика для разных событий
      switch (eventData.event) {
        case 'message_sent':
          baseMetrics.totalMessages++;
          break;
        case 'message_analyzed':
          baseMetrics.messagesAnalyzed++;
          if (eventData.properties?.riskLevel) {
            const risk = eventData.properties.riskLevel as string;
            if (risk in riskCounts) {
              riskCounts[risk]++;
            }
            // Вычисление среднего уровня риска (0=safe, 1=low, 2=medium, 3=high, 4=critical)
            const riskScores: Record<string, number> = {
              safe: 0,
              low: 1,
              medium: 2,
              high: 3,
              critical: 4,
            };
            totalRiskScore += riskScores[risk] || 0;
            riskCount++;
          }
          if (eventData.properties?.chatId) {
            const chatId = eventData.properties.chatId as string;
            chatActivity[chatId] = (chatActivity[chatId] || 0) + 1;
          }
          break;
        case 'alert_created':
          baseMetrics.totalAlerts++;
          break;
        case 'alert_resolved':
          baseMetrics.alertsResolved++;
          break;
        case 'sos_triggered':
          baseMetrics.totalSOS++;
          break;
      }
    });

    // Находим самый активный чат
    const mostActiveChatId = Object.entries(chatActivity).reduce(
      (max, [id, count]) => (count > (chatActivity[max] || 0) ? id : max),
      ''
    );

    baseMetrics.averageRiskLevel = riskCount > 0 ? totalRiskScore / riskCount : 0;
    baseMetrics.mostActiveChat = mostActiveChatId || null;
    baseMetrics.riskDistribution = riskCounts as AnalyticsMetrics['riskDistribution'];
    baseMetrics.eventsByType = eventsByType as Record<AnalyticsEvent, number>;

    // Группировка по дням
    const dailyMap: Record<string, number> = {};
    events.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      dailyMap[date] = (dailyMap[date] || 0) + 1;
    });
    baseMetrics.dailyActivity = Object.entries(dailyMap)
      .map(([date, events]) => ({ date, events }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Последние 30 дней

    return baseMetrics;
  }, [events]);

  return useMemo(
    () => ({
      events,
      metrics,
      trackEvent,
      clearAnalytics,
      exportAnalytics,
    }),
    [events, metrics, trackEvent, clearAnalytics, exportAnalytics]
  );
});

