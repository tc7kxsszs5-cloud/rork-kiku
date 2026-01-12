/**
 * Утилита для управления звуковыми уведомлениями
 * Поддерживает различные звуки для разных уровней риска и типов уведомлений
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { RiskLevel } from '@/constants/types';

/**
 * Типы звуков для уведомлений
 */
export type NotificationSoundType = 
  | 'default'           // Системный звук по умолчанию
  | 'alert'            // Звук для обычных алертов
  | 'warning'          // Звук для предупреждений
  | 'critical'         // Звук для критических алертов
  | 'sos'              // Звук для SOS сигналов
  | 'success'          // Звук для успешных действий
  | boolean;           // true/false для включения/выключения звука

/**
 * Получает звук для уведомления в зависимости от уровня риска
 */
export const getSoundForRiskLevel = (riskLevel: RiskLevel): NotificationSoundType => {
  switch (riskLevel) {
    case 'critical':
      // Критические алерты - всегда со звуком, можно использовать кастомный звук
      return true; // или 'critical' если добавлен кастомный звук
    case 'high':
      // Высокий риск - громкий звук
      return true;
    case 'medium':
      // Средний риск - стандартный звук
      return 'default';
    case 'low':
      // Низкий риск - тихий звук или без звука
      return 'default';
    case 'safe':
    default:
      // Безопасные сообщения - без звука
      return false;
  }
};

/**
 * Получает звук для SOS уведомлений
 */
export const getSoundForSOS = (): NotificationSoundType => {
  return true; // или 'sos' если добавлен кастомный звук
};

/**
 * Получает звук для обычных уведомлений
 */
export const getSoundForRegularNotification = (): NotificationSoundType => {
  return 'default';
};

/**
 * Получает приоритет Android уведомления в зависимости от уровня риска
 */
export const getAndroidPriorityForRiskLevel = (riskLevel: RiskLevel): Notifications.AndroidNotificationPriority => {
  switch (riskLevel) {
    case 'critical':
      return Notifications.AndroidNotificationPriority.MAX;
    case 'high':
      return Notifications.AndroidNotificationPriority.HIGH;
    case 'medium':
      return Notifications.AndroidNotificationPriority.DEFAULT;
    case 'low':
      return Notifications.AndroidNotificationPriority.LOW;
    case 'safe':
    default:
      return Notifications.AndroidNotificationPriority.MIN;
  }
};

/**
 * Настройка канала уведомлений для Android с поддержкой звуков
 */
export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Стандартный канал для обычных уведомлений
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Стандартные уведомления',
      importance: Notifications.AndroidImportance.HIGH,
      description: 'Системные уведомления KIDS',
      sound: 'default', // Системный звук по умолчанию
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#FF6B35',
    });

    // Канал для критических алертов
    await Notifications.setNotificationChannelAsync('critical', {
      name: 'Критические алерты',
      importance: Notifications.AndroidImportance.MAX,
      description: 'Критические уведомления о безопасности',
      sound: 'default', // Можно заменить на кастомный звук
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#F5222D',
      bypassDnd: true, // Обходит режим "Не беспокоить"
    });

    // Канал для высокого риска
    await Notifications.setNotificationChannelAsync('high', {
      name: 'Высокий риск',
      importance: Notifications.AndroidImportance.HIGH,
      description: 'Уведомления о высоком риске',
      sound: 'default',
      vibrationPattern: [0, 300, 200, 300],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#EF4444',
    });

    // Канал для SOS сигналов
    await Notifications.setNotificationChannelAsync('sos', {
      name: 'SOS сигналы',
      importance: Notifications.AndroidImportance.MAX,
      description: 'Экстренные SOS сигналы',
      sound: 'default', // Можно заменить на кастомный звук
      vibrationPattern: [0, 1000, 500, 1000],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#F5222D',
      bypassDnd: true,
    });
  } catch (error) {
    console.error('[SoundNotifications] Failed to setup notification channels:', error);
  }
};

/**
 * Получает имя канала для Android в зависимости от уровня риска
 */
export const getChannelIdForRiskLevel = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
    case 'low':
    case 'safe':
    default:
      return 'default';
  }
};

/**
 * Вспомогательная функция для создания конфигурации звука уведомления
 */
export const createNotificationSoundConfig = (
  sound: NotificationSoundType,
  channelId?: string
): {
  sound: NotificationSoundType;
  channelId?: string;
} => {
  return {
    sound,
    ...(channelId && Platform.OS === 'android' ? { channelId } : {}),
  };
};
