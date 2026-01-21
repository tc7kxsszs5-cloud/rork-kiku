import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateMetrics } from '@/utils/analyticsMetrics';
import { getStoredVersion, saveStoredVersion, needsMigration, APP_DATA_VERSION } from '@/utils/versioning';
import { getMigrationManager } from '@/utils/migrations';
import { logger } from '@/utils/logger';

const ANALYTICS_STORAGE_KEY = '@kiku_analytics';
const CURRENT_ANALYTICS_VERSION = APP_DATA_VERSION; // Используем текущую версию данных

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
  | 'profile_updated'
  | 'app_installed'
  | 'app_first_launch'
  | 'user_activated'
  | 'session_started'
  | 'session_ended'
  | 'feature_used'
  | 'premium_subscribed'
  | 'premium_feature_accessed'
  | 'premium_trial_started'
  | 'premium_trial_ended'
  | 'premium_cancelled'
  | 'alert_notification_sent'
  | 'sos_notification_sent'
  | 'ai_analysis_completed'
  | 'image_analysis_completed'
  | 'false_positive_reported'
  | 'threat_confirmed'
  | 'parent_child_pair_completed'
  | 'screen_viewed'
  | 'user_feedback_submitted'
  | 'sync_failed';

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
  dailyActivity: { date: string; events: number }[];
  // KPI Metrics
  totalInstalls: number;
  totalActivations: number;
  activationRate: number; // totalActivations / totalInstalls
  totalSessions: number;
  averageSessionDuration: number; // in minutes
  retention: {
    d1: number; // Day 1 retention
    d7: number; // Day 7 retention
    d30: number; // Day 30 retention
  };
  featureUsage: Record<string, number>; // e.g., { 'chat_view': 150, 'settings_changed': 20 }
  premiumSubscribers: number;
  premiumTrialUsers: number;
  premiumConversionRate: number; // premiumSubscribers / totalActivations
  // DAU/MAU (calculated from sessions)
  dau: number; // Daily Active Users (unique users with session_started today)
  mau: number; // Monthly Active Users (unique users with session_started in last 30 days)
  // Security KPIs
  threatDetectionRate: number; // Threats detected / Total threats
  falsePositiveRate: number; // False positives / Total alerts
  falseNegativeRate: number; // Missed threats / Total threats
  averageAlertResponseTime: number; // Average time from alert to notification (seconds)
  averageSOSResponseTime: number; // Average time from SOS trigger to notification (seconds)
  aiAnalysisAccuracy: number; // Correct analyses / Total analyses
  aiAnalysisSpeed: number; // Average analysis time (seconds)
  imageAnalysisAccuracy: number; // Correct image analyses / Total
  // Engagement KPIs
  sessionsPerUserWeekly: number; // Average sessions per user per week
  messagesAnalyzedPerDay: number; // Average messages analyzed per day
  featureAdoptionRate: number; // Users using features / Total users
  parentChildPairCompletionRate: number; // Completed pairs / Started pairs
  // Market KPIs
  geographicExpansion: number; // Number of countries with users
  appStoreRating: number; // App Store rating (0-5)
  nps: number; // Net Promoter Score (-100 to 100)
  // Revenue KPIs (calculated from premium data)
  arr: number; // Annual Recurring Revenue
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  ltvCacRatio: number; // LTV / CAC
  userGrowthRate: number; // Monthly growth rate (%)
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
  // KPI Metrics
  totalInstalls: 0,
  totalActivations: 0,
  activationRate: 0,
  totalSessions: 0,
  averageSessionDuration: 0,
  retention: {
    d1: 0,
    d7: 0,
    d30: 0,
  },
  featureUsage: {},
  premiumSubscribers: 0,
  premiumTrialUsers: 0,
  premiumConversionRate: 0,
  dau: 0,
  mau: 0,
  // Security KPIs
  threatDetectionRate: 0,
  falsePositiveRate: 0,
  falseNegativeRate: 0,
  averageAlertResponseTime: 0,
  averageSOSResponseTime: 0,
  aiAnalysisAccuracy: 0,
  aiAnalysisSpeed: 0,
  imageAnalysisAccuracy: 0,
  // Engagement KPIs
  sessionsPerUserWeekly: 0,
  messagesAnalyzedPerDay: 0,
  featureAdoptionRate: 0,
  parentChildPairCompletionRate: 0,
  // Market KPIs
  geographicExpansion: 0,
  appStoreRating: 0,
  nps: 0,
  // Revenue KPIs
  arr: 0,
  cac: 0,
  ltv: 0,
  ltvCacRatio: 0,
  userGrowthRate: 0,
};

export const [AnalyticsProvider, useAnalytics] = createContextHook<AnalyticsContextValue>(() => {
  const [events, setEvents] = useState<AnalyticsEventData[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Загрузка аналитики при инициализации с поддержкой миграций
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const stored = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
        if (!stored) {
          return;
        }

        if (!isMountedRef.current) {
          return;
        }

        let parsed = JSON.parse(stored);
        
        // Проверяем версию данных
        const currentVersion = parsed.version || 1;
        
        // Если нужна миграция
        if (needsMigration(currentVersion, CURRENT_ANALYTICS_VERSION)) {
          console.log(`[AnalyticsContext] Migrating from version ${currentVersion} to ${CURRENT_ANALYTICS_VERSION}`);
          
          try {
            const migrationManager = getMigrationManager();
            const result = await migrationManager.migrate(
              parsed,
              currentVersion,
              CURRENT_ANALYTICS_VERSION
            );

            if (result.success) {
              parsed = result.data;
              
              // Сохраняем мигрированные данные
              await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(parsed));
              await saveStoredVersion(ANALYTICS_STORAGE_KEY, CURRENT_ANALYTICS_VERSION);
              
              logger.info(`Successfully migrated to version ${CURRENT_ANALYTICS_VERSION}`, { context: 'AnalyticsContext', action: 'migrate', toVersion: CURRENT_ANALYTICS_VERSION });
            } else {
              if (result.error) {
                const errorMessage = typeof result.error === 'string' ? result.error : String(result.error);
                const migrationError = new Error(errorMessage);
                logger.error('Migration failed', migrationError, { context: 'AnalyticsContext', action: 'migrate', errorMessage });
              } else {
                logger.error('Migration failed', new Error('Unknown migration error'), { context: 'AnalyticsContext', action: 'migrate' });
              }
              // Продолжаем с исходными данными
            }
          } catch (migrationError) {
            logger.error('Migration error', migrationError instanceof Error ? migrationError : new Error(String(migrationError)), { context: 'AnalyticsContext', action: 'migrate' });
            // Продолжаем с исходными данными
          }
        }

        // Извлекаем события из структуры данных
        const events = parsed.events || parsed; // Поддержка старого формата (массив) и нового (объект с events)
        
        if (isMountedRef.current) {
          setEvents(Array.isArray(events) ? events : []);
        }
      } catch (error) {
        logger.error('Failed to load analytics', error instanceof Error ? error : new Error(String(error)), { context: 'AnalyticsContext', action: 'loadAnalytics' });
      }
    };
    loadAnalytics();
  }, []);

  // Сохранение аналитики при изменении с версионированием
  useEffect(() => {
    const saveAnalytics = async () => {
      try {
        // Сохраняем в новом формате с версией
        const versionedData = {
          version: CURRENT_ANALYTICS_VERSION,
          events,
          updatedAt: Date.now(),
        };
        
        await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(versionedData));
        await saveStoredVersion(ANALYTICS_STORAGE_KEY, CURRENT_ANALYTICS_VERSION);
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

    logger.info('Event tracked', { context: 'AnalyticsContext', action: 'trackEvent', event, properties });
  }, []);

  const clearAnalytics = useCallback(async () => {
    setEvents([]);
    try {
      await AsyncStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear analytics', error instanceof Error ? error : new Error(String(error)), { context: 'AnalyticsContext', action: 'clearAnalytics' });
    }
  }, []);

  const exportAnalytics = useCallback(() => {
    return JSON.stringify(events, null, 2);
  }, [events]);

  // Вычисление метрик (используем чистую функцию для тестируемости)
  const metrics = useMemo((): AnalyticsMetrics => {
    return calculateMetrics(events);
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

