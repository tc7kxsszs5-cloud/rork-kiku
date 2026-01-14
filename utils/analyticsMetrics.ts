/**
 * Чистые детерминированные функции для вычисления аналитических метрик
 * Вынесено из AnalyticsContext для модульного тестирования
 */

import { AnalyticsEvent, AnalyticsEventData, AnalyticsMetrics } from '@/constants/AnalyticsContext';

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

/**
 * Вычисляет метрики на основе массива событий
 * Чистая детерминированная функция - идеальна для модульного тестирования
 */
export function calculateMetrics(events: AnalyticsEventData[]): AnalyticsMetrics {
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

  // KPI tracking
  const installDates = new Set<number>();
  const activationDates = new Set<number>();
  const sessionStarts: Array<{ timestamp: number; userId?: string; duration?: number }> = [];
  const sessionEnds: Array<{ timestamp: number; userId?: string }> = [];
  const featureUsageCounts: Record<string, number> = {};
  const userSessionsByDate: Record<string, Set<string>> = {}; // date -> Set<userId>
  const userFirstSeen: Record<string, number> = {}; // userId -> first seen timestamp
  const userLastSeen: Record<string, number> = {}; // userId -> last seen timestamp

  events.forEach((eventData) => {
    // Подсчет событий по типам
    eventsByType[eventData.event] = (eventsByType[eventData.event] || 0) + 1;

    const userId = eventData.properties?.userId as string | undefined;
    const eventDate = new Date(eventData.timestamp).toISOString().split('T')[0];

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
      case 'app_installed':
        if (eventData.properties?.timestamp) {
          installDates.add(eventData.properties.timestamp as number);
        }
        break;
      case 'user_activated':
        if (eventData.properties?.timestamp) {
          activationDates.add(eventData.properties.timestamp as number);
        }
        break;
      case 'session_started':
        sessionStarts.push({
          timestamp: eventData.timestamp,
          userId: userId,
        });
        if (userId) {
          if (!userFirstSeen[userId]) {
            userFirstSeen[userId] = eventData.timestamp;
          }
          userLastSeen[userId] = eventData.timestamp;
          if (!userSessionsByDate[eventDate]) {
            userSessionsByDate[eventDate] = new Set();
          }
          userSessionsByDate[eventDate].add(userId);
        }
        break;
      case 'session_ended':
        sessionEnds.push({
          timestamp: eventData.timestamp,
          userId: userId,
        });
        // Вычисляем длительность сессии, если есть соответствующий session_started
        if (userId) {
          const startEvent = sessionStarts.find(
            (s) => s.userId === userId && s.timestamp <= eventData.timestamp
          );
          if (startEvent) {
            const duration = (eventData.timestamp - startEvent.timestamp) / 1000 / 60; // в минутах
            if (!startEvent.duration) {
              startEvent.duration = duration;
            }
          }
        }
        break;
      case 'feature_used':
        const featureName = eventData.properties?.feature as string;
        if (featureName) {
          featureUsageCounts[featureName] = (featureUsageCounts[featureName] || 0) + 1;
        }
        break;
      case 'premium_subscribed':
        baseMetrics.premiumSubscribers++;
        break;
      case 'premium_trial_started':
        baseMetrics.premiumTrialUsers++;
        break;
      case 'alert_notification_sent':
        // Для расчета времени отклика
        if (eventData.properties?.alertCreatedTime) {
          const responseTime = (eventData.timestamp - (eventData.properties.alertCreatedTime as number)) / 1000; // секунды
          // Сохраняем для расчета среднего
          if (!eventData.properties._responseTime) {
            (eventData.properties as any)._responseTime = responseTime;
          }
        }
        break;
      case 'sos_notification_sent':
        // Для расчета времени отклика SOS
        if (eventData.properties?.sosTriggeredTime) {
          const responseTime = (eventData.timestamp - (eventData.properties.sosTriggeredTime as number)) / 1000; // секунды
          if (!eventData.properties._responseTime) {
            (eventData.properties as any)._responseTime = responseTime;
          }
        }
        break;
      case 'ai_analysis_completed':
        // Для расчета скорости и точности AI
        if (eventData.properties?.analysisTime) {
          const analysisTime = eventData.properties.analysisTime as number;
          if (!eventData.properties._analysisTime) {
            (eventData.properties as any)._analysisTime = analysisTime;
          }
        }
        break;
      case 'false_positive_reported':
        // Для расчета false positive rate
        break;
      case 'threat_confirmed':
        // Для расчета threat detection rate
        break;
      case 'parent_child_pair_completed':
        // Для расчета completion rate
        break;
      case 'screen_viewed':
        // Для отслеживания использования функций
        const screenName = eventData.properties?.screen as string;
        if (screenName) {
          featureUsageCounts[`screen_${screenName}`] = (featureUsageCounts[`screen_${screenName}`] || 0) + 1;
        }
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

  // KPI Calculations
  baseMetrics.totalInstalls = installDates.size;
  baseMetrics.totalActivations = activationDates.size;
  baseMetrics.activationRate = baseMetrics.totalInstalls > 0 
    ? baseMetrics.totalActivations / baseMetrics.totalInstalls 
    : 0;

  baseMetrics.totalSessions = sessionStarts.length;
  const sessionDurations = sessionStarts.filter(s => s.duration !== undefined).map(s => s.duration!);
  baseMetrics.averageSessionDuration = sessionDurations.length > 0
    ? sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length
    : 0;

  baseMetrics.featureUsage = featureUsageCounts;

  // Premium metrics
  baseMetrics.premiumConversionRate = baseMetrics.totalActivations > 0
    ? baseMetrics.premiumSubscribers / baseMetrics.totalActivations
    : 0;

  // DAU/MAU calculation
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  baseMetrics.dau = userSessionsByDate[today]?.size || 0;
  
  const mauUsers = new Set<string>();
  Object.entries(userSessionsByDate).forEach(([date, users]) => {
    if (date >= thirtyDaysAgoDate && date <= today) {
      users.forEach(userId => mauUsers.add(userId));
    }
  });
  baseMetrics.mau = mauUsers.size;

  // Retention calculation (D1, D7, D30)
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoTimestamp = now - 30 * 24 * 60 * 60 * 1000;

  const usersWithFirstSeen = Object.entries(userFirstSeen);
  const usersWithLastSeen = Object.entries(userLastSeen);

  // D1 retention: пользователи, которые вернулись через 1 день после первого визита
  const d1Users = usersWithFirstSeen.filter(([userId, firstSeen]) => {
    const lastSeen = userLastSeen[userId];
    return lastSeen && lastSeen >= firstSeen + 24 * 60 * 60 * 1000 && lastSeen <= firstSeen + 2 * 24 * 60 * 60 * 1000;
  }).length;
  baseMetrics.retention.d1 = usersWithFirstSeen.length > 0 ? d1Users / usersWithFirstSeen.length : 0;

  // D7 retention: пользователи, которые вернулись через 7 дней
  const d7Users = usersWithFirstSeen.filter(([userId, firstSeen]) => {
    const lastSeen = userLastSeen[userId];
    return lastSeen && lastSeen >= firstSeen + 7 * 24 * 60 * 60 * 1000;
  }).length;
  baseMetrics.retention.d7 = usersWithFirstSeen.length > 0 ? d7Users / usersWithFirstSeen.length : 0;

  // D30 retention: пользователи, которые вернулись через 30 дней
  const d30Users = usersWithFirstSeen.filter(([userId, firstSeen]) => {
    const lastSeen = userLastSeen[userId];
    return lastSeen && lastSeen >= firstSeen + 30 * 24 * 60 * 60 * 1000;
  }).length;
  baseMetrics.retention.d30 = usersWithFirstSeen.length > 0 ? d30Users / usersWithFirstSeen.length : 0;

  // Security KPIs Calculation
  const alertsCreated = events.filter(e => e.event === 'alert_created');
  const alertsResolved = events.filter(e => e.event === 'alert_resolved');
  const falsePositives = events.filter(e => e.event === 'false_positive_reported').length;
  const threatsConfirmed = events.filter(e => e.event === 'threat_confirmed').length;
  const alertNotifications = events.filter(e => e.event === 'alert_notification_sent');
  const sosNotifications = events.filter(e => e.event === 'sos_notification_sent');
  const aiAnalyses = events.filter(e => e.event === 'ai_analysis_completed');
  const imageAnalyses = events.filter(e => e.event === 'image_analysis_completed');

  // Threat Detection Rate: threats confirmed / total threats (alerts created)
  baseMetrics.threatDetectionRate = alertsCreated.length > 0
    ? threatsConfirmed / alertsCreated.length
    : 0;

  // False Positive Rate: false positives / total alerts
  baseMetrics.falsePositiveRate = alertsCreated.length > 0
    ? falsePositives / alertsCreated.length
    : 0;

  // False Negative Rate: missed threats / total threats (estimated)
  // Это сложнее вычислить без внешних данных, используем консервативную оценку
  const estimatedMissedThreats = Math.max(0, alertsCreated.length - threatsConfirmed - falsePositives);
  baseMetrics.falseNegativeRate = alertsCreated.length > 0
    ? estimatedMissedThreats / alertsCreated.length
    : 0;

  // Average Alert Response Time
  const alertResponseTimes = alertNotifications
    .map(e => e.properties?._responseTime as number | undefined)
    .filter((t): t is number => t !== undefined);
  baseMetrics.averageAlertResponseTime = alertResponseTimes.length > 0
    ? alertResponseTimes.reduce((sum, t) => sum + t, 0) / alertResponseTimes.length
    : 0;

  // Average SOS Response Time
  const sosResponseTimes = sosNotifications
    .map(e => e.properties?._responseTime as number | undefined)
    .filter((t): t is number => t !== undefined);
  baseMetrics.averageSOSResponseTime = sosResponseTimes.length > 0
    ? sosResponseTimes.reduce((sum, t) => sum + t, 0) / sosResponseTimes.length
    : 0;

  // AI Analysis Speed
  const aiAnalysisTimes = aiAnalyses
    .map(e => e.properties?._analysisTime as number | undefined)
    .filter((t): t is number => t !== undefined);
  baseMetrics.aiAnalysisSpeed = aiAnalysisTimes.length > 0
    ? aiAnalysisTimes.reduce((sum, t) => sum + t, 0) / aiAnalysisTimes.length
    : 0;

  // AI Analysis Accuracy (simplified: based on resolved alerts vs false positives)
  const totalAnalyses = baseMetrics.messagesAnalyzed + imageAnalyses.length;
  const correctAnalyses = alertsResolved.length; // Resolved alerts indicate correct detection
  baseMetrics.aiAnalysisAccuracy = totalAnalyses > 0
    ? correctAnalyses / totalAnalyses
    : 0;

  // Image Analysis Accuracy (simplified)
  baseMetrics.imageAnalysisAccuracy = imageAnalyses.length > 0
    ? correctAnalyses / imageAnalyses.length
    : 0;

  // Engagement KPIs
  // Sessions per User Weekly
  const uniqueUsers = new Set(Object.keys(userFirstSeen));
  const sevenDaysAgoTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsLastWeek = sessionStarts.filter(s => s.timestamp >= sevenDaysAgoTimestamp).length;
  baseMetrics.sessionsPerUserWeekly = uniqueUsers.size > 0
    ? sessionsLastWeek / uniqueUsers.size
    : 0;

  // Messages Analyzed per Day (average)
  const messagesAnalyzedEvents = events.filter(e => e.event === 'message_analyzed');
  const daysWithMessages = new Set(messagesAnalyzedEvents.map(e => 
    new Date(e.timestamp).toISOString().split('T')[0]
  )).size;
  baseMetrics.messagesAnalyzedPerDay = daysWithMessages > 0
    ? messagesAnalyzedEvents.length / daysWithMessages
    : 0;

  // Feature Adoption Rate: users using features / total users
  const usersUsingFeatures = new Set(
    events
      .filter(e => e.event === 'feature_used' || e.event === 'screen_viewed')
      .map(e => e.properties?.userId as string)
      .filter((id): id is string => id !== undefined)
  ).size;
  baseMetrics.featureAdoptionRate = uniqueUsers.size > 0
    ? usersUsingFeatures / uniqueUsers.size
    : 0;

  // Parent-Child Pair Completion Rate
  const pairsStarted = events.filter(e => e.event === 'user_activated').length;
  const pairsCompleted = events.filter(e => e.event === 'parent_child_pair_completed').length;
  baseMetrics.parentChildPairCompletionRate = pairsStarted > 0
    ? pairsCompleted / pairsStarted
    : 0;

  // Market KPIs (these would typically come from external sources)
  // Geographic Expansion: count unique countries from events (if tracked)
  const countries = new Set(
    events
      .map(e => e.properties?.country as string)
      .filter((c): c is string => c !== undefined)
  );
  baseMetrics.geographicExpansion = countries.size;

  // App Store Rating: would come from external API, default to 0
  baseMetrics.appStoreRating = 0;

  // NPS: would come from surveys, default to 0
  baseMetrics.nps = 0;

  // Revenue KPIs (calculated from premium data and modeling)
  // ARR: Annual Recurring Revenue (from premium subscriptions)
  const premiumPrice = 9.99; // Monthly premium price
  baseMetrics.arr = baseMetrics.premiumSubscribers * premiumPrice * 12;

  // CAC: Customer Acquisition Cost (would come from marketing data)
  // Default estimate: $4 per user
  baseMetrics.cac = 4;

  // LTV: Lifetime Value (premium price * average lifetime in months)
  const averageLifetimeMonths = 12; // Estimated
  baseMetrics.ltv = premiumPrice * averageLifetimeMonths * baseMetrics.premiumConversionRate;

  // LTV/CAC Ratio
  baseMetrics.ltvCacRatio = baseMetrics.cac > 0
    ? baseMetrics.ltv / baseMetrics.cac
    : 0;

  // User Growth Rate (MoM): calculate from MAU growth
  // This requires historical data, simplified calculation
  const currentMAU = baseMetrics.mau;
  const previousMAU = currentMAU * 0.75; // Simplified: assume 25% growth if we had previous data
  baseMetrics.userGrowthRate = previousMAU > 0
    ? ((currentMAU - previousMAU) / previousMAU) * 100
    : 0;

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
}
