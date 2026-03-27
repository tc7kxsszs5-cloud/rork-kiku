import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';
import { Platform } from 'react-native';

const REFERRAL_STORAGE_KEY = '@referral_program';

export interface ReferralData {
  userId: string;
  referralCode: string;
  referredUsers: string[];
  totalReferrals: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  referralHistory: Array<{
    referredUserId: string;
    referredAt: number;
    rewardEarned: number;
    status: 'pending' | 'completed' | 'redeemed';
  }>;
}

export interface ReferralProgramContextValue {
  referralData: ReferralData | null;
  referralCode: string;
  referralLink: string;
  shareReferral: () => Promise<void>;
  checkReferralCode: (code: string) => Promise<boolean>;
  getRewards: () => {
    available: number;
    total: number;
    nextReward: string;
  };
  redeemReward: (amount: number) => Promise<boolean>;
}

/**
 * Генерация уникального реферального кода
 */
function generateReferralCode(userId: string): string {
  // Используем часть userId + случайные символы
  const hash = userId.slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KIKU${hash}${random}`;
}

export const [ReferralProgramProvider, useReferralProgram] = createContextHook<ReferralProgramContextValue>(() => {
  const { user } = useUser();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);

  // Загрузка данных при инициализации
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        const stored = await AsyncStorage.getItem(`${REFERRAL_STORAGE_KEY}_${user.id}`);
        if (stored) {
          setReferralData(JSON.parse(stored));
        } else {
          // Создаем новый реферальный код
          const code = generateReferralCode(user.id);
          const newData: ReferralData = {
            userId: user.id,
            referralCode: code,
            referredUsers: [],
            totalReferrals: 0,
            rewardsEarned: 0,
            rewardsRedeemed: 0,
            referralHistory: [],
          };
          setReferralData(newData);
        }
      } catch (error) {
        console.error('[ReferralProgram] Failed to load data:', error);
      }
    };
    loadData();
  }, [user?.id]);

  // Сохранение данных
  useEffect(() => {
    const saveData = async () => {
      if (!referralData || !user?.id) return;

      try {
        await AsyncStorage.setItem(`${REFERRAL_STORAGE_KEY}_${user.id}`, JSON.stringify(referralData));
      } catch (error) {
        console.error('[ReferralProgram] Failed to save data:', error);
      }
    };
    saveData();
  }, [referralData, user?.id]);

  const referralCode = referralData?.referralCode || '';
  const referralLink = `https://kiku.app/invite/${referralCode}`;

  /**
   * Поделиться реферальной ссылкой
   */
  const shareReferral = useCallback(async () => {
    if (!referralData) return;

    const message = Platform.select({
      ios: `Присоединяйся к KIKU - защите детей в интернете! Используй мой код: ${referralCode}\n${referralLink}`,
      android: `Присоединяйся к KIKU - защите детей в интернете! Используй мой код: ${referralCode}\n${referralLink}`,
      default: `Присоединяйся к KIKU! Код: ${referralCode} - ${referralLink}`,
    });

    try {
      if (Platform.OS !== 'web') {
        // Используем Sharing API
        const { Sharing } = require('expo-sharing');
        await Sharing.shareAsync(referralLink, {
          message,
        });
      } else {
        // Для web используем clipboard
        await navigator.clipboard.writeText(message);
        alert('Реферальная ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('[ReferralProgram] Failed to share:', error);
    }
  }, [referralData, referralCode, referralLink]);

  /**
   * Проверка реферального кода при регистрации
   */
  const checkReferralCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!referralData || code === referralData.referralCode) {
        return false; // Нельзя использовать свой код
      }

      // Проверяем формат кода
      if (!code.startsWith('KIKU') || code.length !== 14) {
        return false;
      }

      // В реальном приложении здесь была бы проверка на сервере
      // Пока просто проверяем формат
      return true;
    },
    [referralData]
  );

  /**
   * Начисление награды за реферала
   */
  const addReferral = useCallback(
    async (referredUserId: string, code: string) => {
      if (!referralData) return;

      // Проверяем, что это новый реферал
      if (referralData.referredUsers.includes(referredUserId)) {
        return;
      }

      const reward = 1; // 1 месяц премиум за каждого реферала

      setReferralData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          referredUsers: [...prev.referredUsers, referredUserId],
          totalReferrals: prev.totalReferrals + 1,
          rewardsEarned: prev.rewardsEarned + reward,
          referralHistory: [
            ...prev.referralHistory,
            {
              referredUserId,
              referredAt: Date.now(),
              rewardEarned: reward,
              status: 'completed',
            },
          ],
        };
      });

      console.log(`[ReferralProgram] New referral! +${reward} months premium`);
    },
    [referralData]
  );

  /**
   * Получение информации о наградах
   */
  const getRewards = useCallback((): { available: number; total: number; nextReward: string } => {
    if (!referralData) {
      return { available: 0, total: 0, nextReward: 'Пригласите друга, чтобы получить награду' };
    }

    const available = referralData.rewardsEarned - referralData.rewardsRedeemed;
    const nextReward = referralData.totalReferrals >= 5 
      ? 'Вы достигли максимума наград!'
      : `Пригласите еще ${5 - referralData.totalReferrals} друзей для бонусной награды`;

    return {
      available,
      total: referralData.rewardsEarned,
      nextReward,
    };
  }, [referralData]);

  /**
   * Использование награды
   */
  const redeemReward = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!referralData) return false;

      const available = referralData.rewardsEarned - referralData.rewardsRedeemed;
      if (available < amount) {
        return false; // Недостаточно наград
      }

      setReferralData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          rewardsRedeemed: prev.rewardsRedeemed + amount,
        };
      });

      // Здесь можно интегрировать с системой подписок
      console.log(`[ReferralProgram] Redeemed ${amount} months premium`);
      return true;
    },
    [referralData]
  );

  return useMemo(
    () => ({
      referralData,
      referralCode,
      referralLink,
      shareReferral,
      checkReferralCode,
      getRewards,
      redeemReward,
    }),
    [referralData, referralCode, referralLink, shareReferral, checkReferralCode, getRewards, redeemReward]
  );
});

