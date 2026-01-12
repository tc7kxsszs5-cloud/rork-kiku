import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { getDeviceRecord, listDeviceRecords } from './store';

interface ExpoPushMessage {
  to: string;
  sound?: 'default' | null;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

interface ExpoPushResponse {
  data: Array<{
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: any;
  }>;
}

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Отправка push-уведомлений через Expo Push API
 */
async function sendExpoPushNotifications(messages: ExpoPushMessage[]): Promise<ExpoPushResponse> {
  const response = await fetch(EXPO_PUSH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify(messages),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Expo Push API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Отправка push-уведомления одному устройству по deviceId
 */
export const sendPushProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string().min(3),
      title: z.string().min(1),
      body: z.string().min(1),
      data: z.record(z.string(), z.any()).optional(),
      sound: z.enum(['default', 'null']).optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
      badge: z.number().optional(),
      channelId: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const device = getDeviceRecord(input.deviceId);
    if (!device) {
      throw new Error(`Device not found: ${input.deviceId}`);
    }

    const message: ExpoPushMessage = {
      to: device.pushToken,
      title: input.title,
      body: input.body,
      data: input.data,
      sound: input.sound === 'null' ? null : input.sound ?? 'default',
      priority: input.priority ?? 'high',
      badge: input.badge,
      channelId: input.channelId,
    };

    try {
      const result = await sendExpoPushNotifications([message]);
      return {
        success: true,
        result,
        deviceId: input.deviceId,
        sent: result.data[0]?.status === 'ok',
      };
    } catch (error) {
      console.error('[send-push] Error sending push notification:', error);
      throw error;
    }
  });

/**
 * Отправка push-уведомления нескольким устройствам по userId или всем устройствам пользователя
 */
export const sendPushToUserProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      title: z.string().min(1),
      body: z.string().min(1),
      data: z.record(z.string(), z.any()).optional(),
      sound: z.enum(['default', 'null']).optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
      badge: z.number().optional(),
      channelId: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const allDevices = listDeviceRecords();
    const userDevices = allDevices.filter((device) => device.userId === input.userId);

    if (userDevices.length === 0) {
      return {
        success: false,
        message: `No devices found for user: ${input.userId}`,
        sent: 0,
        total: 0,
      };
    }

    const messages: ExpoPushMessage[] = userDevices.map((device) => ({
      to: device.pushToken,
      title: input.title,
      body: input.body,
      data: input.data,
      sound: input.sound === 'null' ? null : input.sound ?? 'default',
      priority: input.priority ?? 'high',
      badge: input.badge,
      channelId: input.channelId,
    }));

    try {
      const result = await sendExpoPushNotifications(messages);
      const sentCount = result.data.filter((r) => r.status === 'ok').length;
      return {
        success: true,
        result,
        userId: input.userId,
        sent: sentCount,
        total: userDevices.length,
      };
    } catch (error) {
      console.error('[send-push] Error sending push notifications to user:', error);
      throw error;
    }
  });

/**
 * Отправка push-уведомления по push token (для прямого использования)
 */
export const sendPushToTokenProcedure = publicProcedure
  .input(
    z.object({
      pushToken: z.string().min(10),
      title: z.string().min(1),
      body: z.string().min(1),
      data: z.record(z.string(), z.any()).optional(),
      sound: z.enum(['default', 'null']).optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
      badge: z.number().optional(),
      channelId: z.string().optional(),
    }),
  )
  .mutation(async ({ input }) => {
    const message: ExpoPushMessage = {
      to: input.pushToken,
      title: input.title,
      body: input.body,
      data: input.data,
      sound: input.sound === 'null' ? null : input.sound ?? 'default',
      priority: input.priority ?? 'high',
      badge: input.badge,
      channelId: input.channelId,
    };

    try {
      const result = await sendExpoPushNotifications([message]);
      return {
        success: true,
        result,
        sent: result.data[0]?.status === 'ok',
      };
    } catch (error) {
      console.error('[send-push] Error sending push notification to token:', error);
      throw error;
    }
  });