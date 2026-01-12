import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { getDeviceRecord, listDeviceRecords } from './store';

// Для production нужно установить: bun add expo-server-sdk
// Для разработки используем простую реализацию через fetch к Expo Push API
const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

interface ExpoPushMessage {
  to: string;
  sound?: 'default' | null;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

export const sendPushProcedure = publicProcedure
  .input(
    z.object({
      deviceIds: z.array(z.string().min(1).max(100)).optional(), // Ограничение для безопасности
      userIds: z.array(z.string().min(1).max(100)).optional(), // Ограничение для безопасности
      title: z.string().min(1).max(200), // Валидация длины
      body: z.string().min(1).max(1000), // Валидация длины
      data: z.record(z.string(), z.any()).optional(),
      sound: z.enum(['default', 'none']).optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { deviceIds, userIds, title, body, data, sound = 'default', priority = 'high' } = input;

    // Получаем все устройства или фильтруем по deviceIds/userIds
    let devices = listDeviceRecords();

    if (deviceIds && deviceIds.length > 0) {
      devices = devices.filter((d) => deviceIds.includes(d.deviceId));
    }

    if (userIds && userIds.length > 0) {
      devices = devices.filter((d) => d.userId && userIds.includes(d.userId));
    }

    // TODO: Для production - добавить фильтрацию по роли (только родители)
    // Требуется: хранить role в NotificationDeviceRecord или делать запрос к UserContext
    // Пример: devices = devices.filter((d) => d.userRole === 'parent');

    if (devices.length === 0) {
      return {
        success: false,
        error: 'No devices found',
        sent: 0,
        failed: 0,
      };
    }

    // Формируем сообщения для Expo Push API
    const messages: ExpoPushMessage[] = devices
      .filter((d) => d.pushToken && d.pushToken.startsWith('ExponentPushToken['))
      .map((device) => ({
        to: device.pushToken,
        sound: sound === 'default' ? 'default' : null,
        title,
        body,
        data: data || {},
        priority,
      }));

    if (messages.length === 0) {
      return {
        success: false,
        error: 'No valid push tokens found',
        sent: 0,
        failed: 0,
      };
    }

    try {
      // Отправляем push через Expo Push API
      const response = await fetch(EXPO_PUSH_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[sendPush] Expo API error:', errorText);
        return {
          success: false,
          error: `Expo API error: ${response.status}`,
          sent: 0,
          failed: messages.length,
        };
      }

      const results = await response.json();
      
      // Expo возвращает массив результатов
      const resultsArray = Array.isArray(results.data) ? results.data : [results];
      
      const sent = resultsArray.filter((r: any) => r.status === 'ok').length;
      const failed = resultsArray.filter((r: any) => r.status === 'error').length;

      return {
        success: true,
        sent,
        failed,
        results: resultsArray,
      };
    } catch (error) {
      console.error('[sendPush] Error sending push notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sent: 0,
        failed: messages.length,
      };
    }
  });

