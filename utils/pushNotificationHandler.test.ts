/**
 * Unit тесты для обработчика push-уведомлений
 * Тестируем логику определения маршрутов навигации
 */

import { describe, it, expect } from 'bun:test';

// Копия функции для тестирования (без зависимостей от expo-notifications)
type PushNotificationData = {
  type?: string;
  alertId?: string;
  chatId?: string;
  riskLevel?: string;
  timestamp?: number;
  [key: string]: any;
};

const getRouteFromPushNotification = (data: PushNotificationData): string | null => {
  if (!data || !data.type) {
    return null;
  }

  switch (data.type) {
    case 'risk_alert':
      if (data.chatId) {
        return `/chat/${data.chatId}`;
      }
      if (data.alertId) {
        return '/security-settings';
      }
      return '/(tabs)';
    
    case 'sos_alert':
      return '/security-settings';
    
    case 'diagnostic':
      return '/(tabs)/profile';
    
    default:
      return '/(tabs)';
  }
};

describe('getRouteFromPushNotification', () => {
  it('должен возвращать маршрут к чату для risk_alert с chatId', () => {
    const data: PushNotificationData = {
      type: 'risk_alert',
      chatId: 'chat123',
      alertId: 'alert456',
      riskLevel: 'high',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/chat/chat123');
  });

  it('должен возвращать security-settings для risk_alert без chatId но с alertId', () => {
    const data: PushNotificationData = {
      type: 'risk_alert',
      alertId: 'alert456',
      riskLevel: 'critical',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/security-settings');
  });

  it('должен возвращать главный экран для risk_alert без chatId и alertId', () => {
    const data: PushNotificationData = {
      type: 'risk_alert',
      riskLevel: 'medium',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/(tabs)');
  });

  it('должен возвращать security-settings для sos_alert', () => {
    const data: PushNotificationData = {
      type: 'sos_alert',
      alertId: 'sos123',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/security-settings');
  });

  it('должен возвращать профиль для diagnostic уведомлений', () => {
    const data: PushNotificationData = {
      type: 'diagnostic',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/(tabs)/profile');
  });

  it('должен возвращать главный экран для неизвестного типа', () => {
    const data: PushNotificationData = {
      type: 'unknown_type',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/(tabs)');
  });

  it('должен возвращать null для данных без типа', () => {
    const data: PushNotificationData = {};

    const route = getRouteFromPushNotification(data);

    expect(route).toBeNull();
  });

  it('должен приоритизировать chatId над alertId для risk_alert', () => {
    const data: PushNotificationData = {
      type: 'risk_alert',
      chatId: 'chat123',
      alertId: 'alert456',
    };

    const route = getRouteFromPushNotification(data);

    expect(route).toBe('/chat/chat123');
  });
});

