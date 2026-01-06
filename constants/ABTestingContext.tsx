import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';

const AB_STORAGE_KEY = '@ab_tests';
const AB_ASSIGNMENTS_KEY = '@ab_assignments';

export type ExperimentName = 
  | 'ui_layout_variant'
  | 'notification_timing'
  | 'risk_display_style'
  | 'onboarding_flow'
  | 'recommendation_algorithm';

export type Variant = 'A' | 'B' | 'C' | 'control';

export interface Experiment {
  name: ExperimentName;
  variants: Variant[];
  trafficSplit: Record<Variant, number>; // Процент трафика для каждого варианта
  enabled: boolean;
  startDate: number;
  endDate?: number;
}

export interface ExperimentAssignment {
  experimentName: ExperimentName;
  variant: Variant;
  assignedAt: number;
  userId?: string;
}

export interface ABTestingContextValue {
  getVariant: (experimentName: ExperimentName) => Variant;
  trackExperimentView: (experimentName: ExperimentName, variant: Variant) => void;
  trackExperimentConversion: (experimentName: ExperimentName, variant: Variant, conversion: string) => void;
  experiments: Experiment[];
  assignments: ExperimentAssignment[];
}

// Определенные эксперименты
const DEFAULT_EXPERIMENTS: Experiment[] = [
  {
    name: 'ui_layout_variant',
    variants: ['A', 'B'],
    trafficSplit: { A: 50, B: 50, C: 0, control: 0 },
    enabled: true,
    startDate: Date.now(),
  },
  {
    name: 'notification_timing',
    variants: ['A', 'B'],
    trafficSplit: { A: 50, B: 50, C: 0, control: 0 },
    enabled: true,
    startDate: Date.now(),
  },
  {
    name: 'risk_display_style',
    variants: ['A', 'B', 'C'],
    trafficSplit: { A: 33, B: 33, C: 34, control: 0 },
    enabled: true,
    startDate: Date.now(),
  },
];

export const [ABTestingProvider, useABTesting] = createContextHook<ABTestingContextValue>(() => {
  const { user } = useUser();
  const [experiments, setExperiments] = useState<Experiment[]>(DEFAULT_EXPERIMENTS);
  const [assignments, setAssignments] = useState<ExperimentAssignment[]>([]);

  // Загрузка назначений при инициализации
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const stored = await AsyncStorage.getItem(AB_ASSIGNMENTS_KEY);
        if (stored) {
          setAssignments(JSON.parse(stored));
        }
      } catch (error) {
        console.error('[ABTesting] Failed to load assignments:', error);
      }
    };
    loadAssignments();
  }, []);

  // Сохранение назначений
  useEffect(() => {
    const saveAssignments = async () => {
      try {
        await AsyncStorage.setItem(AB_ASSIGNMENTS_KEY, JSON.stringify(assignments));
      } catch (error) {
        console.error('[ABTesting] Failed to save assignments:', error);
      }
    };
    if (assignments.length > 0) {
      saveAssignments();
    }
  }, [assignments]);

  /**
   * Получить вариант для эксперимента
   * Использует детерминированное назначение на основе userId или deviceId
   */
  const getVariant = useCallback((experimentName: ExperimentName): Variant => {
    // Проверяем, есть ли уже назначение
    const existing = assignments.find(
      (a) => a.experimentName === experimentName && a.userId === user?.id
    );
    if (existing) {
      return existing.variant;
    }

    // Находим эксперимент
    const experiment = experiments.find((e) => e.name === experimentName);
    if (!experiment || !experiment.enabled) {
      return 'control';
    }

    // Проверяем даты эксперимента
    const now = Date.now();
    if (now < experiment.startDate || (experiment.endDate && now > experiment.endDate)) {
      return 'control';
    }

    // Детерминированное назначение на основе userId или случайного seed
    const seed = user?.id || `device_${Date.now()}`;
    const hash = simpleHash(seed + experimentName);
    const random = hash % 100;

    // Назначаем вариант на основе trafficSplit
    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += experiment.trafficSplit[variant];
      if (random < cumulative) {
        const assignment: ExperimentAssignment = {
          experimentName,
          variant,
          assignedAt: Date.now(),
          userId: user?.id,
        };
        setAssignments((prev) => [...prev, assignment]);
        return variant;
      }
    }

    return 'control';
  }, [experiments, assignments, user?.id]);

  /**
   * Трекинг просмотра эксперимента
   */
  const trackExperimentView = useCallback(
    (experimentName: ExperimentName, variant: Variant) => {
      console.log('[ABTesting] View tracked:', { experimentName, variant, userId: user?.id });
      // Здесь можно отправить событие в аналитику
    },
    [user?.id]
  );

  /**
   * Трекинг конверсии в эксперименте
   */
  const trackExperimentConversion = useCallback(
    (experimentName: ExperimentName, variant: Variant, conversion: string) => {
      console.log('[ABTesting] Conversion tracked:', {
        experimentName,
        variant,
        conversion,
        userId: user?.id,
      });
      // Здесь можно отправить событие в аналитику
    },
    [user?.id]
  );

  return useMemo(
    () => ({
      getVariant,
      trackExperimentView,
      trackExperimentConversion,
      experiments,
      assignments,
    }),
    [getVariant, trackExperimentView, trackExperimentConversion, experiments, assignments]
  );
});

/**
 * Простая хеш-функция для детерминированного назначения
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

