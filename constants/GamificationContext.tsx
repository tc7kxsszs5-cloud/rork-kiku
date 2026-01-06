import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';
import { HapticFeedback } from './haptics';

const GAMIFICATION_STORAGE_KEY = '@gamification_data';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress: number; // 0-100
  category: 'safety' | 'education' | 'streak' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyStreak {
  current: number;
  longest: number;
  lastCheckIn: number;
}

export interface GamificationData {
  userId: string;
  points: number;
  level: number;
  achievements: Achievement[];
  dailyStreak: DailyStreak;
  badges: string[];
  stats: {
    safeDays: number;
    lessonsCompleted: number;
    challengesWon: number;
  };
}

export interface GamificationContextValue {
  data: GamificationData | null;
  addPoints: (amount: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  checkIn: () => Promise<boolean>; // Возвращает true если streak продолжен
  getNextLevelPoints: () => number;
  getProgressToNextLevel: () => number;
  completeLesson: (lessonId: string) => void;
  completeChallenge: (challengeId: string) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_safe_week',
    title: 'Неделя безопасности',
    description: '7 дней без тревог',
    icon: '🛡️',
    progress: 0,
    category: 'safety',
    rarity: 'common',
  },
  {
    id: 'safety_master',
    title: 'Мастер безопасности',
    description: '30 дней без критических рисков',
    icon: '👑',
    progress: 0,
    category: 'safety',
    rarity: 'epic',
  },
  {
    id: 'lesson_learner',
    title: 'Ученик',
    description: 'Пройдено 5 уроков безопасности',
    icon: '📚',
    progress: 0,
    category: 'education',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    title: 'Неделя подряд',
    description: '7 дней ежедневных проверок',
    icon: '🔥',
    progress: 0,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    title: 'Месяц подряд',
    description: '30 дней ежедневных проверок',
    icon: '💎',
    progress: 0,
    category: 'streak',
    rarity: 'legendary',
  },
  {
    id: 'community_helper',
    title: 'Помощник сообщества',
    description: 'Помог 10 родителям в сообществе',
    icon: '🤝',
    progress: 0,
    category: 'social',
    rarity: 'rare',
  },
];

const POINTS_PER_LEVEL = 1000;
const POINTS_MULTIPLIER = 1.2; // Каждый уровень требует на 20% больше

export const [GamificationProvider, useGamification] = createContextHook<GamificationContextValue>(() => {
  const { user } = useUser();
  const [data, setData] = useState<GamificationData | null>(null);

  // Загрузка данных при инициализации
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        const stored = await AsyncStorage.getItem(`${GAMIFICATION_STORAGE_KEY}_${user.id}`);
        if (stored) {
          setData(JSON.parse(stored));
        } else {
          // Создаем начальные данные
          const initialData: GamificationData = {
            userId: user.id,
            points: 0,
            level: 1,
            achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
            dailyStreak: {
              current: 0,
              longest: 0,
              lastCheckIn: 0,
            },
            badges: [],
            stats: {
              safeDays: 0,
              lessonsCompleted: 0,
              challengesWon: 0,
            },
          };
          setData(initialData);
        }
      } catch (error) {
        console.error('[Gamification] Failed to load data:', error);
      }
    };
    loadData();
  }, [user?.id]);

  // Сохранение данных
  useEffect(() => {
    const saveData = async () => {
      if (!data || !user?.id) return;

      try {
        await AsyncStorage.setItem(`${GAMIFICATION_STORAGE_KEY}_${user.id}`, JSON.stringify(data));
      } catch (error) {
        console.error('[Gamification] Failed to save data:', error);
      }
    };
    saveData();
  }, [data, user?.id]);

  const addPoints = useCallback((amount: number, reason: string) => {
    if (!data) return;

    setData((prev) => {
      if (!prev) return prev;

      const newPoints = prev.points + amount;
      const currentLevelPoints = POINTS_PER_LEVEL * Math.pow(POINTS_MULTIPLIER, prev.level - 1);
      let newLevel = prev.level;

      // Проверка повышения уровня
      if (newPoints >= currentLevelPoints) {
        newLevel = prev.level + 1;
        HapticFeedback.success();
        console.log(`[Gamification] Level up! New level: ${newLevel}`);
      } else {
        HapticFeedback.warning();
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
    });

    console.log(`[Gamification] +${amount} points: ${reason}`);
  }, [data]);

  const unlockAchievement = useCallback((achievementId: string) => {
    if (!data) return;

    setData((prev) => {
      if (!prev) return prev;

      const achievement = prev.achievements.find((a) => a.id === achievementId);
      if (!achievement || achievement.unlockedAt) {
        return prev; // Уже разблокировано
      }

      achievement.unlockedAt = Date.now();
      achievement.progress = 100;

      HapticFeedback.success();
      console.log(`[Gamification] Achievement unlocked: ${achievement.title}`);

      // Награда за достижение
      const pointsReward = {
        common: 50,
        rare: 100,
        epic: 250,
        legendary: 500,
      }[achievement.rarity];

      return {
        ...prev,
        achievements: [...prev.achievements],
        points: prev.points + pointsReward,
        badges: [...prev.badges, achievementId],
      };
    });
  }, [data]);

  const checkIn = useCallback(async (): Promise<boolean> => {
    if (!data) return false;

    const now = Date.now();
    const lastCheckIn = data.dailyStreak.lastCheckIn;
    const oneDay = 24 * 60 * 60 * 1000;
    const daysSinceLastCheckIn = Math.floor((now - lastCheckIn) / oneDay);

    let newStreak = data.dailyStreak.current;

    if (daysSinceLastCheckIn === 0) {
      // Уже проверяли сегодня
      return false;
    } else if (daysSinceLastCheckIn === 1) {
      // Продолжаем streak
      newStreak = data.dailyStreak.current + 1;
    } else {
      // Streak прерван
      newStreak = 1;
    }

    setData((prev) => {
      if (!prev) return prev;

      const longest = Math.max(prev.dailyStreak.longest, newStreak);

      // Проверка достижений streak
      if (newStreak === 7 && !prev.badges.includes('streak_7')) {
        unlockAchievement('streak_7');
      }
      if (newStreak === 30 && !prev.badges.includes('streak_30')) {
        unlockAchievement('streak_30');
      }

      return {
        ...prev,
        dailyStreak: {
          current: newStreak,
          longest,
          lastCheckIn: now,
        },
      };
    });

    // Награда за check-in
    addPoints(10, 'Ежедневная проверка');
    HapticFeedback.success();

    return daysSinceLastCheckIn === 1; // True если streak продолжен
  }, [data, unlockAchievement, addPoints]);

  const getNextLevelPoints = useCallback((): number => {
    if (!data) return POINTS_PER_LEVEL;
    return Math.floor(POINTS_PER_LEVEL * Math.pow(POINTS_MULTIPLIER, data.level - 1));
  }, [data]);

  const getProgressToNextLevel = useCallback((): number => {
    if (!data) return 0;
    const currentLevelPoints = getNextLevelPoints();
    const previousLevelPoints = data.level > 1 
      ? Math.floor(POINTS_PER_LEVEL * Math.pow(POINTS_MULTIPLIER, data.level - 2))
      : 0;
    const progressInLevel = data.points - previousLevelPoints;
    const pointsNeededForLevel = currentLevelPoints - previousLevelPoints;
    return Math.min(100, (progressInLevel / pointsNeededForLevel) * 100);
  }, [data, getNextLevelPoints]);

  const completeLesson = useCallback((lessonId: string) => {
    if (!data) return;

    setData((prev) => {
      if (!prev) return prev;

      const newLessonsCompleted = prev.stats.lessonsCompleted + 1;

      // Проверка достижения
      if (newLessonsCompleted === 5 && !prev.badges.includes('lesson_learner')) {
        unlockAchievement('lesson_learner');
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          lessonsCompleted: newLessonsCompleted,
        },
      };
    });

    addPoints(25, 'Урок пройден');
  }, [data, unlockAchievement, addPoints]);

  const completeChallenge = useCallback((challengeId: string) => {
    if (!data) return;

    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          challengesWon: prev.stats.challengesWon + 1,
        },
      };
    });

    addPoints(50, 'Челлендж пройден');
  }, [data, addPoints]);

  return useMemo(
    () => ({
      data,
      addPoints,
      unlockAchievement,
      checkIn,
      getNextLevelPoints,
      getProgressToNextLevel,
      completeLesson,
      completeChallenge,
    }),
    [data, addPoints, unlockAchievement, checkIn, getNextLevelPoints, getProgressToNextLevel, completeLesson, completeChallenge]
  );
});

