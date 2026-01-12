/**
 * Обработчик навигации из push-уведомлений
 * Deep linking для перехода к алертам и чатам
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type PushNotificationData = {
  type?: string;
  alertId?: string;
  chatId?: string;
  riskLevel?: string;
  timestamp?: number;
  [key: string]: any;
};

export type NavigationHandler = (route: string) => void;

/**
 * Обрабатывает push-уведомление и возвращает маршрут для навигации
 */
export const getRouteFromPushNotification = (data: PushNotificationData): string | null => {
  if (!data || !data.type) {
    return null;
  }

  switch (data.type) {
    case 'risk_alert':
      // Навигация к чату с алертом, или к security-settings если есть alertId
      if (data.chatId) {
        return `/chat/${data.chatId}`;
      }
      // Если нет chatId, но есть alertId - идем в security-settings
      if (data.alertId) {
        return '/security-settings';
      }
      // По умолчанию - на главный экран
      return '/(tabs)';
    
    case 'sos_alert':
      // SOS алерты ведут в security-settings
      return '/security-settings';
    
    case 'diagnostic':
      // Диагностические уведомления - в профиль
      return '/(tabs)/profile';
    
    default:
      // По умолчанию - на главный экран
      return '/(tabs)';
  }
};

/**
 * Настраивает обработчики входящих push-уведомлений
 */
export const setupPushNotificationHandlers = (
  navigationHandler: NavigationHandler
): (() => void) => {
  // Обработчик уведомлений, полученных когда приложение в foreground
  const notificationReceivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('[PushNotificationHandler] Notification received in foreground:', notification);
      // В foreground просто показываем уведомление, навигация будет при тапе
    }
  );

  // Обработчик тапа по уведомлению (когда приложение открыто или в background)
  const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('[PushNotificationHandler] Notification tapped:', response);
      
      const data = response.notification.request.content.data as PushNotificationData;
      const route = getRouteFromPushNotification(data);
      
      if (route) {
        console.log('[PushNotificationHandler] Navigating to:', route);
        // Небольшая задержка для корректной навигации
        setTimeout(() => {
          navigationHandler(route);
        }, 100);
      } else {
        console.log('[PushNotificationHandler] No route found for notification data:', data);
      }
    }
  );

  // Возвращаем функцию очистки
  return () => {
    notificationReceivedListener.remove();
    notificationResponseListener.remove();
  };
};

/**
 * Обрабатывает уведомление, полученное когда приложение было закрыто
 * (для iOS - вызывается при запуске приложения)
 */
export const handleInitialNotification = async (
  navigationHandler: NavigationHandler
): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      console.log('[PushNotificationHandler] Initial notification found:', response);
      
      const data = response.notification.request.content.data as PushNotificationData;
      const route = getRouteFromPushNotification(data);
      
      if (route) {
        console.log('[PushNotificationHandler] Navigating to initial notification route:', route);
        // Задержка для инициализации навигации
        setTimeout(() => {
          navigationHandler(route);
        }, 500);
      }
    }
  } catch (error) {
    console.error('[PushNotificationHandler] Error handling initial notification:', error);
  }
};

