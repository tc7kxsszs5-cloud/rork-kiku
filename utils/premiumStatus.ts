/**
 * Чистые детерминированные функции для проверки статуса premium подписки
 * Вынесено из PremiumContext для модульного тестирования
 */

import { PremiumStatus, PremiumTier } from '@/constants/PremiumContext';

/**
 * Проверяет, истекла ли trial подписка
 * Чистая детерминированная функция
 */
export function isTrialExpired(status: PremiumStatus, currentTime: number): boolean {
  if (status.tier !== 'trial') return false;
  if (!status.trialEndDate) return false;
  return currentTime > status.trialEndDate;
}

/**
 * Проверяет, истекла ли premium подписка
 * Чистая детерминированная функция
 */
export function isSubscriptionExpired(status: PremiumStatus, currentTime: number): boolean {
  if (status.tier !== 'premium') return false;
  if (!status.subscriptionEndDate) return false;
  return currentTime > status.subscriptionEndDate;
}

/**
 * Проверяет статус подписки и возвращает обновленный статус если нужно
 * Чистая детерминированная функция
 */
export function checkSubscriptionStatus(
  status: PremiumStatus,
  currentTime: number
): { updated: boolean; newStatus: PremiumStatus } {
  const newStatus = { ...status };

  // Проверка trial
  if (status.tier === 'trial' && status.trialEndDate) {
    if (currentTime > status.trialEndDate) {
      // Trial истек
      newStatus.tier = 'free';
      newStatus.features = {
        advancedAnalytics: false,
        extendedHistory: false,
        multipleChildren: false,
        prioritySupport: false,
        customAlerts: false,
        exportData: false,
        aiRecommendations: false,
      };
      newStatus.trialEndDate = undefined;
      return { updated: true, newStatus };
    }
  }

  // Проверка subscription
  if (status.tier === 'premium' && status.subscriptionEndDate) {
    if (currentTime > status.subscriptionEndDate) {
      // Подписка истекла
      newStatus.tier = 'free';
      newStatus.features = {
        advancedAnalytics: false,
        extendedHistory: false,
        multipleChildren: false,
        prioritySupport: false,
        customAlerts: false,
        exportData: false,
        aiRecommendations: false,
      };
      newStatus.subscriptionId = undefined;
      newStatus.subscriptionStartDate = undefined;
      newStatus.subscriptionEndDate = undefined;
      return { updated: true, newStatus };
    }
  }

  return { updated: false, newStatus: status };
}
