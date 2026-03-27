import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RiskLevel } from './types';
import { useMonitoring } from './MonitoringContext';

const PREDICTIVE_DATA_STORAGE_KEY = '@predictive_analytics';

export interface RiskPrediction {
  chatId: string;
  predictedRiskLevel: RiskLevel;
  confidence: number;
  timeframe: '24h' | '7d' | '30d';
  indicators: string[];
  recommendedActions: string[];
  timestamp: number;
}

export interface BehavioralPattern {
  chatId: string;
  pattern: 'escalating' | 'stable' | 'improving' | 'volatile';
  trend: 'increasing' | 'decreasing' | 'stable';
  riskScore: number; // 0-1
  factors: {
    messageFrequency: number;
    riskFrequency: number;
    timePattern: 'morning' | 'afternoon' | 'evening' | 'night';
    contactType: 'known' | 'unknown' | 'mixed';
  };
}

export interface PredictiveAnalyticsContextValue {
  predictions: RiskPrediction[];
  patterns: BehavioralPattern[];
  predictRisk: (chatId: string) => Promise<RiskPrediction | null>;
  analyzePatterns: (chatId: string) => Promise<BehavioralPattern | null>;
  getEarlyWarnings: () => RiskPrediction[];
  getTrendAnalysis: (chatId: string) => {
    trend: 'improving' | 'worsening' | 'stable';
    riskScore: number;
    factors: string[];
  };
}

export const [PredictiveAnalyticsProvider, usePredictiveAnalytics] = createContextHook<PredictiveAnalyticsContextValue>(() => {
  const { chats, alerts } = useMonitoring();
  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([]);

  // Загрузка сохраненных данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREDICTIVE_DATA_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPredictions(parsed.predictions || []);
          setPatterns(parsed.patterns || []);
        }
      } catch (error) {
        console.error('[PredictiveAnalytics] Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Сохранение данных
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          PREDICTIVE_DATA_STORAGE_KEY,
          JSON.stringify({ predictions, patterns })
        );
      } catch (error) {
        console.error('[PredictiveAnalytics] Failed to save data:', error);
      }
    };
    if (predictions.length > 0 || patterns.length > 0) {
      saveData();
    }
  }, [predictions, patterns]);

  /**
   * Предсказание рисков на основе паттернов
   */
  const predictRisk = useCallback(
    async (chatId: string): Promise<RiskPrediction | null> => {
      const chat = chats.find((c) => c.id === chatId);
      if (!chat || chat.messages.length < 10) {
        return null; // Недостаточно данных
      }

      // Анализ последних сообщений
      const recentMessages = chat.messages.slice(-50);
      const recentAlerts = alerts.filter((a) => a.chatId === chatId && !a.resolved);

      // Вычисление метрик
      const riskMessages = recentMessages.filter((m) => m.riskLevel && m.riskLevel !== 'safe');
      const riskRatio = riskMessages.length / recentMessages.length;
      const alertFrequency = recentAlerts.length / (recentMessages.length || 1);

      // Анализ тренда
      const lastWeek = recentMessages.filter((m) => m.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000);
      const olderWeek = recentMessages.filter(
        (m) => m.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000 && m.timestamp <= Date.now() - 7 * 24 * 60 * 60 * 1000
      );

      const recentRiskRatio = lastWeek.filter((m) => m.riskLevel && m.riskLevel !== 'safe').length / (lastWeek.length || 1);
      const olderRiskRatio = olderWeek.filter((m) => m.riskLevel && m.riskLevel !== 'safe').length / (olderWeek.length || 1);

      const isEscalating = recentRiskRatio > olderRiskRatio * 1.2;

      // Предсказание уровня риска
      let predictedLevel: RiskLevel = 'safe';
      let confidence = 0.5;
      const indicators: string[] = [];

      if (riskRatio > 0.4 || alertFrequency > 0.15) {
        predictedLevel = 'critical';
        confidence = 0.9;
        indicators.push('Критическая частота рискованных сообщений');
      } else if (riskRatio > 0.3 || alertFrequency > 0.1) {
        predictedLevel = 'high';
        confidence = 0.8;
        indicators.push('Высокая частота рискованных сообщений');
      } else if (riskRatio > 0.15 || isEscalating) {
        predictedLevel = 'medium';
        confidence = 0.65;
        indicators.push('Увеличивающаяся частота рисков');
      } else if (riskRatio > 0.05) {
        predictedLevel = 'low';
        confidence = 0.5;
        indicators.push('Периодические рисковые сообщения');
      }

      if (isEscalating) {
        indicators.push('Тренд показывает ухудшение ситуации');
      }

      // Рекомендации
      const recommendedActions: string[] = [];
      if (predictedLevel === 'high' || predictedLevel === 'critical') {
        recommendedActions.push('Немедленно обсудите ситуацию с ребенком');
        recommendedActions.push('Рассмотрите возможность ограничения контакта');
        recommendedActions.push('Обратитесь за профессиональной помощью');
      } else if (predictedLevel === 'medium') {
        recommendedActions.push('Усильте мониторинг этого чата');
        recommendedActions.push('Проведите профилактическую беседу');
      }

      const prediction: RiskPrediction = {
        chatId,
        predictedRiskLevel: predictedLevel,
        confidence,
        timeframe: '7d',
        indicators,
        recommendedActions,
        timestamp: Date.now(),
      };

      // Сохраняем предсказание
      setPredictions((prev) => {
        const filtered = prev.filter((p) => p.chatId !== chatId);
        return [...filtered, prediction].slice(-100); // Последние 100 предсказаний
      });

      return prediction;
    },
    [chats, alerts]
  );

  /**
   * Анализ поведенческих паттернов
   */
  const analyzePatterns = useCallback(
    async (chatId: string): Promise<BehavioralPattern | null> => {
      const chat = chats.find((c) => c.id === chatId);
      if (!chat || chat.messages.length < 20) {
        return null;
      }

      const messages = chat.messages;
      const riskMessages = messages.filter((m) => m.riskLevel && m.riskLevel !== 'safe');

      // Анализ частоты сообщений
      const timeSpans = [];
      for (let i = 1; i < messages.length; i++) {
        const span = messages[i].timestamp - messages[i - 1].timestamp;
        timeSpans.push(span);
      }
      const avgTimeSpan = timeSpans.reduce((a, b) => a + b, 0) / timeSpans.length;
      const messageFrequency = 1 / (avgTimeSpan / (60 * 60 * 1000)); // Сообщений в час

      // Анализ временных паттернов
      const hourCounts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      messages.forEach((msg) => {
        const hour = new Date(msg.timestamp).getHours();
        if (hour >= 6 && hour < 12) hourCounts.morning++;
        else if (hour >= 12 && hour < 18) hourCounts.afternoon++;
        else if (hour >= 18 && hour < 22) hourCounts.evening++;
        else hourCounts.night++;
      });

      const dominantTime = Object.entries(hourCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as
        | 'morning'
        | 'afternoon'
        | 'evening'
        | 'night';

      // Определение паттерна
      const riskFrequency = riskMessages.length / messages.length;
      const recentRisks = riskMessages.filter((m) => m.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
      const olderRisks = riskMessages.filter(
        (m) => m.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000 && m.timestamp <= Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;

      let pattern: 'escalating' | 'stable' | 'improving' | 'volatile' = 'stable';
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';

      if (recentRisks > olderRisks * 1.3) {
        pattern = 'escalating';
        trend = 'increasing';
      } else if (recentRisks < olderRisks * 0.7) {
        pattern = 'improving';
        trend = 'decreasing';
      } else if (Math.abs(recentRisks - olderRisks) / (olderRisks || 1) > 0.5) {
        pattern = 'volatile';
        trend = 'stable';
      }

      const riskScore = Math.min(1, riskFrequency * 2 + (recentRisks / messages.length) * 3);

      const behavioralPattern: BehavioralPattern = {
        chatId,
        pattern,
        trend,
        riskScore,
        factors: {
          messageFrequency,
          riskFrequency,
          timePattern: dominantTime,
          contactType: chat.participants.length > 2 ? 'mixed' : 'known',
        },
      };

      // Сохраняем паттерн
      setPatterns((prev) => {
        const filtered = prev.filter((p) => p.chatId !== chatId);
        return [...filtered, behavioralPattern];
      });

      return behavioralPattern;
    },
    [chats]
  );

  /**
   * Ранние предупреждения (риски, которые могут возникнуть)
   */
  const getEarlyWarnings = useCallback((): RiskPrediction[] => {
    return predictions
      .filter((p) => p.predictedRiskLevel === 'high' || p.predictedRiskLevel === 'critical')
      .filter((p) => p.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000) // Последние 7 дней
      .sort((a, b) => b.confidence - a.confidence);
  }, [predictions]);

  /**
   * Анализ трендов для чата
   */
  const getTrendAnalysis = useCallback(
    (chatId: string): { trend: 'improving' | 'worsening' | 'stable'; riskScore: number; factors: string[] } => {
      const pattern = patterns.find((p) => p.chatId === chatId);
      if (!pattern) {
        return { trend: 'stable', riskScore: 0, factors: ['Недостаточно данных для анализа'] };
      }

      const trend = pattern.trend === 'increasing' ? 'worsening' : pattern.trend === 'decreasing' ? 'improving' : 'stable';
      const factors: string[] = [];

      if (pattern.factors.riskFrequency > 0.2) {
        factors.push('Высокая частота рискованных сообщений');
      }
      if (pattern.factors.messageFrequency > 10) {
        factors.push('Очень активное общение');
      }
      if (pattern.pattern === 'escalating') {
        factors.push('Ситуация ухудшается');
      }
      if (pattern.factors.timePattern === 'night') {
        factors.push('Активность в ночное время');
      }

      return {
        trend,
        riskScore: pattern.riskScore,
        factors: factors.length > 0 ? factors : ['Паттерны в норме'],
      };
    },
    [patterns]
  );

  return useMemo(
    () => ({
      predictions,
      patterns,
      predictRisk,
      analyzePatterns,
      getEarlyWarnings,
      getTrendAnalysis,
    }),
    [predictions, patterns, predictRisk, analyzePatterns, getEarlyWarnings, getTrendAnalysis]
  );
});

