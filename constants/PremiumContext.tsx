import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PREMIUM_STORAGE_KEY = '@kiku_premium_status';

export type PremiumTier = 'free' | 'premium' | 'trial';

export interface PremiumFeatures {
  advancedAnalytics: boolean; // Extended history, detailed reports
  extendedHistory: boolean; // History beyond 30 days
  multipleChildren: boolean; // More than 3 children
  prioritySupport: boolean; // Priority customer support
  customAlerts: boolean; // Custom alert rules
  exportData: boolean; // Export analytics data
  aiRecommendations: boolean; // Advanced AI recommendations
}

export interface PremiumStatus {
  tier: PremiumTier;
  subscriptionId?: string;
  subscriptionStartDate?: number;
  subscriptionEndDate?: number;
  trialEndDate?: number;
  features: PremiumFeatures;
}

const FREE_FEATURES: PremiumFeatures = {
  advancedAnalytics: false,
  extendedHistory: false,
  multipleChildren: false, // Free: up to 3 children
  prioritySupport: false,
  customAlerts: false,
  exportData: false,
  aiRecommendations: false,
};

const PREMIUM_FEATURES: PremiumFeatures = {
  advancedAnalytics: true,
  extendedHistory: true,
  multipleChildren: true, // Premium: unlimited children
  prioritySupport: true,
  customAlerts: true,
  exportData: true,
  aiRecommendations: true,
};

const TRIAL_DURATION_DAYS = 14; // 14-day free trial

export interface PremiumContextValue {
  premiumStatus: PremiumStatus;
  isPremium: boolean;
  isTrial: boolean;
  hasFeature: (feature: keyof PremiumFeatures) => boolean;
  startTrial: () => Promise<void>;
  subscribe: (subscriptionId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
}

const DEFAULT_PREMIUM_STATUS: PremiumStatus = {
  tier: 'free',
  features: FREE_FEATURES,
};

export const [PremiumProvider, usePremium] = createContextHook<PremiumContextValue>(() => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>(DEFAULT_PREMIUM_STATUS);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Загрузка статуса премиум при инициализации
  useEffect(() => {
    const loadPremiumStatus = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
        if (stored && isMountedRef.current) {
          const parsed = JSON.parse(stored);
          setPremiumStatus(parsed);
          
          // Проверка истечения trial/subscription
          await checkSubscriptionStatus();
        }
      } catch (error) {
        console.error('[PremiumContext] Failed to load premium status:', error);
      }
    };
    loadPremiumStatus();
  }, []);

  // Сохранение статуса премиум
  const savePremiumStatus = useCallback(async (status: PremiumStatus) => {
    try {
      await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(status));
      if (isMountedRef.current) {
        setPremiumStatus(status);
      }
    } catch (error) {
      console.error('[PremiumContext] Failed to save premium status:', error);
    }
  }, []);

  // Проверка статуса подписки (истечение trial/subscription)
  const checkSubscriptionStatus = useCallback(async () => {
    const now = Date.now();
    const status = { ...premiumStatus };

    // Проверка trial
    if (status.tier === 'trial' && status.trialEndDate) {
      if (now > status.trialEndDate) {
        // Trial истек
        status.tier = 'free';
        status.features = FREE_FEATURES;
        status.trialEndDate = undefined;
        await savePremiumStatus(status);
        return;
      }
    }

    // Проверка subscription
    if (status.tier === 'premium' && status.subscriptionEndDate) {
      if (now > status.subscriptionEndDate) {
        // Подписка истекла
        status.tier = 'free';
        status.features = FREE_FEATURES;
        status.subscriptionId = undefined;
        status.subscriptionStartDate = undefined;
        status.subscriptionEndDate = undefined;
        await savePremiumStatus(status);
        return;
      }
    }

    // Если статус изменился, сохраняем
    if (JSON.stringify(status) !== JSON.stringify(premiumStatus)) {
      await savePremiumStatus(status);
    }
  }, [premiumStatus, savePremiumStatus]);

  // Начать trial
  const startTrial = useCallback(async () => {
    const trialEndDate = Date.now() + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
    const newStatus: PremiumStatus = {
      tier: 'trial',
      trialEndDate,
      features: PREMIUM_FEATURES,
    };
    await savePremiumStatus(newStatus);
  }, [savePremiumStatus]);

  // Подписаться на premium
  const subscribe = useCallback(async (subscriptionId: string) => {
    const now = Date.now();
    // Предполагаем месячную подписку (можно расширить)
    const subscriptionEndDate = now + (30 * 24 * 60 * 60 * 1000);
    const newStatus: PremiumStatus = {
      tier: 'premium',
      subscriptionId,
      subscriptionStartDate: now,
      subscriptionEndDate,
      features: PREMIUM_FEATURES,
    };
    await savePremiumStatus(newStatus);
  }, [savePremiumStatus]);

  // Отменить подписку
  const cancelSubscription = useCallback(async () => {
    const newStatus: PremiumStatus = {
      tier: 'free',
      features: FREE_FEATURES,
    };
    await savePremiumStatus(newStatus);
  }, [savePremiumStatus]);

  // Проверка наличия функции
  const hasFeature = useCallback((feature: keyof PremiumFeatures): boolean => {
    return premiumStatus.features[feature] || false;
  }, [premiumStatus.features]);

  const isPremium = premiumStatus.tier === 'premium';
  const isTrial = premiumStatus.tier === 'trial';

  return {
    premiumStatus,
    isPremium,
    isTrial,
    hasFeature,
    startTrial,
    subscribe,
    cancelSubscription,
    checkSubscriptionStatus,
  };
});
