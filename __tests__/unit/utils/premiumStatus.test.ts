/**
 * Модульные тесты для проверки статуса premium подписки
 * Только детерминированные тесты - никаких интеграций/асинхронности
 */

import {
  isTrialExpired,
  isSubscriptionExpired,
  checkSubscriptionStatus,
} from '@/utils/premiumStatus';
import { PremiumStatus } from '@/constants/PremiumContext';

describe('isTrialExpired', () => {
  it('должен возвращать false для free статуса', () => {
    const status: PremiumStatus = {
      tier: 'free',
      features: {
        advancedAnalytics: false,
        extendedHistory: false,
        multipleChildren: false,
        prioritySupport: false,
        customAlerts: false,
        exportData: false,
        aiRecommendations: false,
      },
    };

    expect(isTrialExpired(status, Date.now())).toBe(false);
  });

  it('должен возвращать false если trial еще не истек', () => {
    const futureTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // +7 дней
    const status: PremiumStatus = {
      tier: 'trial',
      trialEndDate: futureTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    expect(isTrialExpired(status, Date.now())).toBe(false);
  });

  it('должен возвращать true если trial истек', () => {
    const pastTime = Date.now() - 1000; // -1 секунда
    const status: PremiumStatus = {
      tier: 'trial',
      trialEndDate: pastTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    expect(isTrialExpired(status, Date.now())).toBe(true);
  });

  it('должен возвращать false если trialEndDate отсутствует', () => {
    const status: PremiumStatus = {
      tier: 'trial',
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    expect(isTrialExpired(status, Date.now())).toBe(false);
  });
});

describe('isSubscriptionExpired', () => {
  it('должен возвращать false для free статуса', () => {
    const status: PremiumStatus = {
      tier: 'free',
      features: {
        advancedAnalytics: false,
        extendedHistory: false,
        multipleChildren: false,
        prioritySupport: false,
        customAlerts: false,
        exportData: false,
        aiRecommendations: false,
      },
    };

    expect(isSubscriptionExpired(status, Date.now())).toBe(false);
  });

  it('должен возвращать false если подписка еще не истекла', () => {
    const futureTime = Date.now() + 30 * 24 * 60 * 60 * 1000; // +30 дней
    const status: PremiumStatus = {
      tier: 'premium',
      subscriptionId: 'sub_123',
      subscriptionStartDate: Date.now(),
      subscriptionEndDate: futureTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    expect(isSubscriptionExpired(status, Date.now())).toBe(false);
  });

  it('должен возвращать true если подписка истекла', () => {
    const pastTime = Date.now() - 1000; // -1 секунда
    const status: PremiumStatus = {
      tier: 'premium',
      subscriptionId: 'sub_123',
      subscriptionStartDate: pastTime - 30 * 24 * 60 * 60 * 1000,
      subscriptionEndDate: pastTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    expect(isSubscriptionExpired(status, Date.now())).toBe(true);
  });
});

describe('checkSubscriptionStatus', () => {
  it('должен возвращать updated: false если статус не изменился', () => {
    const futureTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const status: PremiumStatus = {
      tier: 'trial',
      trialEndDate: futureTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    const result = checkSubscriptionStatus(status, Date.now());

    expect(result.updated).toBe(false);
    expect(result.newStatus.tier).toBe('trial');
  });

  it('должен обновлять статус на free если trial истек', () => {
    const pastTime = Date.now() - 1000;
    const status: PremiumStatus = {
      tier: 'trial',
      trialEndDate: pastTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    const result = checkSubscriptionStatus(status, Date.now());

    expect(result.updated).toBe(true);
    expect(result.newStatus.tier).toBe('free');
    expect(result.newStatus.features.advancedAnalytics).toBe(false);
    expect(result.newStatus.trialEndDate).toBeUndefined();
  });

  it('должен обновлять статус на free если подписка истекла', () => {
    const pastTime = Date.now() - 1000;
    const status: PremiumStatus = {
      tier: 'premium',
      subscriptionId: 'sub_123',
      subscriptionStartDate: pastTime - 30 * 24 * 60 * 60 * 1000,
      subscriptionEndDate: pastTime,
      features: {
        advancedAnalytics: true,
        extendedHistory: true,
        multipleChildren: true,
        prioritySupport: true,
        customAlerts: true,
        exportData: true,
        aiRecommendations: true,
      },
    };

    const result = checkSubscriptionStatus(status, Date.now());

    expect(result.updated).toBe(true);
    expect(result.newStatus.tier).toBe('free');
    expect(result.newStatus.features.advancedAnalytics).toBe(false);
    expect(result.newStatus.subscriptionId).toBeUndefined();
    expect(result.newStatus.subscriptionEndDate).toBeUndefined();
  });
});
