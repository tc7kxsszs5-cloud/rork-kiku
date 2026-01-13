/**
 * Детерминированные модульные тесты для soundNotifications.ts
 * 
 * Только чистые функции:
 * - Нет интеграций
 * - Нет асинхронных операций
 * - Нет сложных моков
 * - Одинаковый вход = одинаковый выход
 */

import {
  getSoundForRiskLevel,
  getSoundForSOS,
  getSoundForRegularNotification,
  getAndroidPriorityForRiskLevel,
  getChannelIdForRiskLevel,
  createNotificationSoundConfig,
  type NotificationSoundType,
} from '@/utils/soundNotifications';
import * as Notifications from 'expo-notifications';
import { RiskLevel } from '@/constants/types';
import { Platform } from 'react-native';

describe('soundNotifications - Детерминированные тесты', () => {
  const originalPlatformOS = Platform.OS;

  beforeEach(() => {
    (Platform as any).OS = originalPlatformOS;
  });

  describe('getSoundForRiskLevel', () => {
    it('должен вернуть true для critical уровня риска', () => {
      const result = getSoundForRiskLevel('critical');
      expect(result).toBe(true);
    });

    it('должен вернуть true для high уровня риска', () => {
      const result = getSoundForRiskLevel('high');
      expect(result).toBe(true);
    });

    it('должен вернуть "default" для medium уровня риска', () => {
      const result = getSoundForRiskLevel('medium');
      expect(result).toBe('default');
    });

    it('должен вернуть "default" для low уровня риска', () => {
      const result = getSoundForRiskLevel('low');
      expect(result).toBe('default');
    });

    it('должен вернуть false для safe уровня риска', () => {
      const result = getSoundForRiskLevel('safe');
      expect(result).toBe(false);
    });

    it('должен быть детерминированным - одинаковый вход = одинаковый выход', () => {
      const result1 = getSoundForRiskLevel('critical');
      const result2 = getSoundForRiskLevel('critical');
      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    it('должен обработать все возможные уровни риска', () => {
      const riskLevels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
      const results = riskLevels.map(level => getSoundForRiskLevel(level));
      expect(results).toEqual([false, 'default', 'default', true, true]);
    });
  });

  describe('getSoundForSOS', () => {
    it('должен вернуть true для SOS уведомлений', () => {
      const result = getSoundForSOS();
      expect(result).toBe(true);
    });

    it('должен быть детерминированным - всегда возвращает true', () => {
      const result1 = getSoundForSOS();
      const result2 = getSoundForSOS();
      const result3 = getSoundForSOS();
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('getSoundForRegularNotification', () => {
    it('должен вернуть "default" для обычных уведомлений', () => {
      const result = getSoundForRegularNotification();
      expect(result).toBe('default');
    });

    it('должен быть детерминированным - всегда возвращает "default"', () => {
      const result1 = getSoundForRegularNotification();
      const result2 = getSoundForRegularNotification();
      expect(result1).toBe('default');
      expect(result2).toBe('default');
      expect(result1).toBe(result2);
    });
  });

  describe('getAndroidPriorityForRiskLevel', () => {
    it('должен вернуть MAX приоритет для critical уровня', () => {
      const result = getAndroidPriorityForRiskLevel('critical');
      expect(result).toBe(Notifications.AndroidNotificationPriority.MAX);
    });

    it('должен вернуть HIGH приоритет для high уровня', () => {
      const result = getAndroidPriorityForRiskLevel('high');
      expect(result).toBe(Notifications.AndroidNotificationPriority.HIGH);
    });

    it('должен вернуть DEFAULT приоритет для medium уровня', () => {
      const result = getAndroidPriorityForRiskLevel('medium');
      expect(result).toBe(Notifications.AndroidNotificationPriority.DEFAULT);
    });

    it('должен вернуть LOW приоритет для low уровня', () => {
      const result = getAndroidPriorityForRiskLevel('low');
      expect(result).toBe(Notifications.AndroidNotificationPriority.LOW);
    });

    it('должен вернуть MIN приоритет для safe уровня', () => {
      const result = getAndroidPriorityForRiskLevel('safe');
      expect(result).toBe(Notifications.AndroidNotificationPriority.MIN);
    });

    it('должен быть детерминированным для всех уровней риска', () => {
      const mappings: Array<[RiskLevel, Notifications.AndroidNotificationPriority]> = [
        ['safe', Notifications.AndroidNotificationPriority.MIN],
        ['low', Notifications.AndroidNotificationPriority.LOW],
        ['medium', Notifications.AndroidNotificationPriority.DEFAULT],
        ['high', Notifications.AndroidNotificationPriority.HIGH],
        ['critical', Notifications.AndroidNotificationPriority.MAX],
      ];

      mappings.forEach(([riskLevel, expectedPriority]) => {
        const result = getAndroidPriorityForRiskLevel(riskLevel);
        expect(result).toBe(expectedPriority);
      });
    });
  });

  describe('getChannelIdForRiskLevel', () => {
    it('должен вернуть "critical" для critical уровня', () => {
      const result = getChannelIdForRiskLevel('critical');
      expect(result).toBe('critical');
    });

    it('должен вернуть "high" для high уровня', () => {
      const result = getChannelIdForRiskLevel('high');
      expect(result).toBe('high');
    });

    it('должен вернуть "default" для medium уровня', () => {
      const result = getChannelIdForRiskLevel('medium');
      expect(result).toBe('default');
    });

    it('должен вернуть "default" для low уровня', () => {
      const result = getChannelIdForRiskLevel('low');
      expect(result).toBe('default');
    });

    it('должен вернуть "default" для safe уровня', () => {
      const result = getChannelIdForRiskLevel('safe');
      expect(result).toBe('default');
    });

    it('должен быть детерминированным - одинаковый вход = одинаковый выход', () => {
      const results = [
        getChannelIdForRiskLevel('critical'),
        getChannelIdForRiskLevel('critical'),
        getChannelIdForRiskLevel('critical'),
      ];
      results.forEach(result => {
        expect(result).toBe('critical');
      });
      expect(results[0]).toBe(results[1]);
      expect(results[1]).toBe(results[2]);
    });
  });

  describe('createNotificationSoundConfig', () => {
    it('должен создать конфигурацию со звуком для iOS', () => {
      (Platform as any).OS = 'ios';
      const result = createNotificationSoundConfig('default');
      expect(result).toEqual({ sound: 'default' });
      expect(result.channelId).toBeUndefined();
    });

    it('должен создать конфигурацию со звуком и каналом для Android', () => {
      (Platform as any).OS = 'android';
      const result = createNotificationSoundConfig('default', 'critical');
      expect(result).toEqual({ sound: 'default', channelId: 'critical' });
    });

    it('должен создать конфигурацию без channelId для iOS даже если передан', () => {
      (Platform as any).OS = 'ios';
      const result = createNotificationSoundConfig('default', 'critical');
      expect(result).toEqual({ sound: 'default' });
      expect(result.channelId).toBeUndefined();
    });

    it('должен быть детерминированным для iOS', () => {
      (Platform as any).OS = 'ios';
      const result1 = createNotificationSoundConfig('default', 'critical');
      const result2 = createNotificationSoundConfig('default', 'critical');
      expect(result1).toEqual(result2);
    });

    it('должен быть детерминированным для Android', () => {
      (Platform as any).OS = 'android';
      const result1 = createNotificationSoundConfig('default', 'critical');
      const result2 = createNotificationSoundConfig('default', 'critical');
      expect(result1).toEqual(result2);
      expect(result1.channelId).toBe('critical');
    });

    it('должен обработать различные типы звуков', () => {
      (Platform as any).OS = 'android';
      const soundTypes: NotificationSoundType[] = ['default', 'alert', true, false];
      soundTypes.forEach(sound => {
        const result = createNotificationSoundConfig(sound, 'default');
        expect(result.sound).toBe(sound);
        expect(result.channelId).toBe('default');
      });
    });
  });
});
