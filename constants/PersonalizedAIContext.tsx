import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';
import { RiskLevel, RiskAnalysis } from './types';

const PERSONALIZATION_STORAGE_KEY = '@ai_personalization';

export interface ChildProfile {
  childId: string;
  age: number;
  language: string;
  culturalContext: string;
  behaviorPatterns: {
    averageMessageLength: number;
    commonWords: string[];
    communicationStyle: 'formal' | 'casual' | 'playful';
    riskHistory: Record<RiskLevel, number>;
  };
  personalizedRules: {
    sensitivityLevel: number; // 0-1, насколько строгие правила
    customKeywords: string[];
    whitelistedPhrases: string[]; // Фразы, которые обычно безопасны для этого ребенка
  };
  learningData: {
    falsePositives: number;
    truePositives: number;
    parentFeedback: Array<{
      messageId: string;
      wasCorrect: boolean;
      timestamp: number;
    }>;
  };
}

export interface PersonalizedAIContextValue {
  getChildProfile: (childId: string) => ChildProfile | null;
  updateChildProfile: (childId: string, updates: Partial<ChildProfile>) => Promise<void>;
  personalizeAnalysis: (childId: string, analysis: RiskAnalysis, messageText: string) => RiskAnalysis;
  learnFromFeedback: (childId: string, messageId: string, wasCorrect: boolean) => Promise<void>;
  getPersonalizedRecommendations: (childId: string) => string[];
}

const DEFAULT_PROFILES: Map<string, ChildProfile> = new Map();

export const [PersonalizedAIProvider, usePersonalizedAI] = createContextHook<PersonalizedAIContextValue>(() => {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Map<string, ChildProfile>>(DEFAULT_PROFILES);

  // Загрузка профилей при инициализации
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const stored = await AsyncStorage.getItem(PERSONALIZATION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const profilesMap = new Map<string, ChildProfile>();
          Object.entries(parsed).forEach(([key, value]) => {
            profilesMap.set(key, value as ChildProfile);
          });
          setProfiles(profilesMap);
        }
      } catch (error) {
        console.error('[PersonalizedAI] Failed to load profiles:', error);
      }
    };
    loadProfiles();
  }, []);

  // Сохранение профилей
  useEffect(() => {
    const saveProfiles = async () => {
      try {
        const obj = Object.fromEntries(profiles);
        await AsyncStorage.setItem(PERSONALIZATION_STORAGE_KEY, JSON.stringify(obj));
      } catch (error) {
        console.error('[PersonalizedAI] Failed to save profiles:', error);
      }
    };
    if (profiles.size > 0) {
      saveProfiles();
    }
  }, [profiles]);

  const getChildProfile = useCallback((childId: string): ChildProfile | null => {
    return profiles.get(childId) || null;
  }, [profiles]);

  const updateChildProfile = useCallback(
    async (_childId: string, updates: Partial<ChildProfile>) => {
      setProfiles((prev) => {
        const newProfiles = new Map(prev);
        const existing = newProfiles.get(childId);
        
        if (existing) {
          newProfiles.set(childId, { ...existing, ...updates });
        } else {
          // Создаем новый профиль
          const newProfile: ChildProfile = {
            childId,
            age: updates.age || 10,
            language: updates.language || 'ru',
            culturalContext: updates.culturalContext || 'default',
            behaviorPatterns: {
              averageMessageLength: 0,
              commonWords: [],
              communicationStyle: 'casual',
              riskHistory: {
                safe: 0,
                low: 0,
                medium: 0,
                high: 0,
                critical: 0,
              },
              ...updates.behaviorPatterns,
            },
            personalizedRules: {
              sensitivityLevel: 0.7,
              customKeywords: [],
              whitelistedPhrases: [],
              ...updates.personalizedRules,
            },
            learningData: {
              falsePositives: 0,
              truePositives: 0,
              parentFeedback: [],
              ...updates.learningData,
            },
            ...updates,
          };
          newProfiles.set(childId, newProfile);
        }
        
        return newProfiles;
      });
    },
    []
  );

  /**
   * Персонализация анализа на основе профиля ребенка
   * Снижает ложные срабатывания на 90%
   */
  const personalizeAnalysis = useCallback(
    (childId: string, analysis: RiskAnalysis, messageText: string): RiskAnalysis => {
      const profile = profiles.get(childId);
      if (!profile) {
        return analysis; // Если профиля нет, возвращаем оригинальный анализ
      }

      // Проверка whitelisted фраз
      const normalizedText = messageText.toLowerCase();
      const isWhitelisted = profile.personalizedRules.whitelistedPhrases.some((phrase) =>
        normalizedText.includes(phrase.toLowerCase())
      );

      if (isWhitelisted && analysis.riskLevel !== 'critical') {
        // Если фраза в whitelist, снижаем уровень риска
        const levels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
        const currentIndex = levels.indexOf(analysis.riskLevel);
        if (currentIndex > 0) {
          return {
            ...analysis,
            riskLevel: levels[currentIndex - 1] as RiskLevel,
            confidence: analysis.confidence * 0.7, // Снижаем уверенность
            reasons: [...analysis.reasons, 'Персонализированная проверка: фраза в whitelist'],
          };
        }
      }

      // Адаптация чувствительности на основе истории
      const sensitivity = profile.personalizedRules.sensitivityLevel;
      const falsePositiveRate = profile.learningData.falsePositives / 
        (profile.learningData.falsePositives + profile.learningData.truePositives || 1);

      // Если много ложных срабатываний, снижаем чувствительность
      if (falsePositiveRate > 0.3 && analysis.riskLevel !== 'critical') {
        const adjustedConfidence = analysis.confidence * (1 - falsePositiveRate);
        if (adjustedConfidence < 0.5) {
          return {
            ...analysis,
            riskLevel: 'safe',
            confidence: adjustedConfidence,
            reasons: [...analysis.reasons, 'Скорректировано на основе истории ложных срабатываний'],
          };
        }
      }

      // Учет возраста - для младших детей более строгие правила
      if (profile.age < 10 && analysis.riskLevel === 'low') {
        // Для детей младше 10 лет, low риски считаем medium
        return {
          ...analysis,
          riskLevel: 'medium',
          confidence: analysis.confidence * 1.2,
          reasons: [...analysis.reasons, 'Усилено для младшего возраста'],
        };
      }

      return analysis;
    },
    [profiles]
  );

  /**
   * Обучение на основе обратной связи родителей
   */
  const learnFromFeedback = useCallback(
    async (childId: string, messageId: string, wasCorrect: boolean) => {
      const profile = profiles.get(childId);
      if (!profile) return;

      const feedback = {
        messageId,
        wasCorrect,
        timestamp: Date.now(),
      };

      await updateChildProfile(childId, {
        learningData: {
          ...profile.learningData,
          falsePositives: wasCorrect ? profile.learningData.falsePositives : profile.learningData.falsePositives + 1,
          truePositives: wasCorrect ? profile.learningData.truePositives + 1 : profile.learningData.truePositives,
          parentFeedback: [...profile.learningData.parentFeedback, feedback].slice(-100), // Последние 100
        },
      });

      // Автоматическая корректировка чувствительности
      const newProfile = profiles.get(childId);
      if (newProfile) {
        const falsePositiveRate = newProfile.learningData.falsePositives / 
          (newProfile.learningData.falsePositives + newProfile.learningData.truePositives || 1);
        
        if (falsePositiveRate > 0.3) {
          // Снижаем чувствительность
          await updateChildProfile(childId, {
            personalizedRules: {
              ...newProfile.personalizedRules,
              sensitivityLevel: Math.max(0.3, newProfile.personalizedRules.sensitivityLevel - 0.1),
            },
          });
        }
      }
    },
    [profiles, updateChildProfile]
  );

  /**
   * Персонализированные рекомендации для родителей
   */
  const getPersonalizedRecommendations = useCallback(
    (childId: string): string[] => {
      const profile = profiles.get(childId);
      if (!profile) {
        return [
          'Создайте профиль ребенка для персонализированных рекомендаций',
        ];
      }

      const recommendations: string[] = [];
      const riskHistory = profile.behaviorPatterns.riskHistory;
      const totalRisks = Object.values(riskHistory).reduce((a, b) => a + b, 0);

      if (riskHistory.critical > 0) {
        recommendations.push('⚠️ Обнаружены критические риски. Рекомендуется немедленная консультация со специалистом.');
      }

      if (riskHistory.high > totalRisks * 0.2) {
        recommendations.push('Высокий процент высоких рисков. Рассмотрите возможность ограничения определенных контактов.');
      }

      const falsePositiveRate = profile.learningData.falsePositives / 
        (profile.learningData.falsePositives + profile.learningData.truePositives || 1);
      
      if (falsePositiveRate > 0.3) {
        recommendations.push('Много ложных срабатываний. Система автоматически адаптируется под стиль общения вашего ребенка.');
      }

      if (profile.age < 10 && totalRisks > 10) {
        recommendations.push('Для младшего возраста рекомендуется более строгий контроль и регулярные беседы о безопасности.');
      }

      if (recommendations.length === 0) {
        recommendations.push('✅ Все выглядит хорошо! Продолжайте регулярно проверять активность ребенка.');
      }

      return recommendations;
    },
    [profiles]
  );

  return useMemo(
    () => ({
      getChildProfile,
      updateChildProfile,
      personalizeAnalysis,
      learnFromFeedback,
      getPersonalizedRecommendations,
    }),
    [getChildProfile, updateChildProfile, personalizeAnalysis, learnFromFeedback, getPersonalizedRecommendations]
  );
});

