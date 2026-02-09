import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { listDeviceRecords, getDeviceRecord } from './store.js';
import { TRPCError } from '@trpc/server';
import { assertDeviceAccess } from '../../../utils/authz.js';

// Интерфейс для Expo Push Notification
interface ExpoPushMessage {
  to: string;
  sound?: string;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

// Отправка push уведомления через Expo Push API
const sendExpoPushNotification = async (message: ExpoPushMessage): Promise<{ status: 'ok' | 'error'; id?: string; error?: string }> => {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    
    if (result.data?.status === 'ok') {
      return { status: 'ok', id: result.data.id };
    } else {
      return { status: 'error', error: result.data?.message || 'Unknown error' };
    }
  } catch (error) {
    console.error('[send-push] Expo Push API error:', error);
    return { status: 'error', error: error instanceof Error ? error.message : 'Network error' };
  }
};

// Отправка push уведомления одному устройству
export const sendPushToDeviceProcedure = protectedProcedure
  .input(
    z.object({
      deviceId: z.string().min(3),
      title: z.string().min(1),
      body: z.string().min(1),
      data: z.record(z.string(), z.any()).optional(),
      sound: z.string().optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
      channelId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    if (ctx.auth?.role !== 'parent') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    await assertDeviceAccess(ctx, input.deviceId);
    const { deviceId, title, body, data, sound, priority, channelId } = input;

    // Получаем запись устройства
    const device = getDeviceRecord(deviceId);
    if (!device) {
      return {
        success: false,
        error: 'Device not found',
      };
    }

    if (!device.pushToken) {
      return {
        success: false,
        error: 'Device has no push token',
      };
    }

    // Формируем сообщение для Expo Push API
    const message: ExpoPushMessage = {
      to: device.pushToken,
      title,
      body,
      sound: sound || 'default',
      priority: priority || 'high',
      data: data || {},
      ...(channelId && { channelId }),
    };

    // Отправляем через Expo Push API
    const result = await sendExpoPushNotification(message);

    if (result.status === 'ok') {
      return {
        success: true,
        notificationId: result.id,
        deviceId: device.deviceId,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to send notification',
      };
    }
  });

// Отправка push уведомления всем устройствам пользователя (родителям)
export const sendPushToUserProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      title: z.string().min(1),
      body: z.string().min(1),
      data: z.record(z.string(), z.any()).optional(),
      sound: z.string().optional(),
      priority: z.enum(['default', 'normal', 'high']).optional(),
      channelId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    if (ctx.auth?.role !== 'parent') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    if (ctx.auth.userId !== input.userId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    const { userId, title, body, data, sound, priority, channelId } = input;

    // Получаем все устройства пользователя
    const allDevices = listDeviceRecords();
    const userDevices = allDevices.filter((device) => device.userId === userId && device.pushToken);

    if (userDevices.length === 0) {
      return {
        success: false,
        error: 'No devices found for user',
        sent: 0,
        total: 0,
      };
    }

    // Отправляем уведомления на все устройства пользователя
    const results = await Promise.allSettled(
      userDevices.map((device) => {
        const message: ExpoPushMessage = {
          to: device.pushToken!,
          title,
          body,
          sound: sound || 'default',
          priority: priority || 'high',
          data: data || {},
          ...(channelId && { channelId }),
        };
        return sendExpoPushNotification(message);
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.status === 'ok').length;
    const failed = results.length - sent;

    return {
      success: sent > 0,
      sent,
      total: userDevices.length,
      failed,
      results: results.map((r, i) => ({
        deviceId: userDevices[i].deviceId,
        status: r.status === 'fulfilled' ? r.value.status : 'error',
        error: r.status === 'rejected' ? r.reason : (r.status === 'fulfilled' && r.value.status === 'error' ? r.value.error : undefined),
      })),
    };
  });

// Отправка push уведомления при обнаружении риска (для родителей)
export const sendRiskAlertPushProcedure = protectedProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      chatId: z.string().min(1),
      messageId: z.string().min(1),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      reasons: z.array(z.string()).optional(),
      chatName: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    if (ctx.auth?.role !== 'parent') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    if (ctx.auth.userId !== input.userId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    const { userId, chatId, messageId, riskLevel, reasons, chatName } = input;

    const riskLevelLabels: Record<string, string> = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      critical: 'КРИТИЧЕСКИЙ',
    };

    const title = riskLevel === 'critical' 
      ? '🚨 КРИТИЧЕСКИЙ РИСК обнаружен!'
      : `⚠️ Обнаружен ${riskLevelLabels[riskLevel]} риск`;

    const body = chatName 
      ? `В чате "${chatName}": ${reasons?.[0] || 'Обнаружена угроза'}`
      : `В чате: ${reasons?.[0] || 'Обнаружена угроза'}`;

    const sound = riskLevel === 'critical' ? 'default' : 'default';
    const priority = riskLevel === 'critical' ? 'high' : 'normal';

    // Отправляем уведомления родителям
    const allDevices = listDeviceRecords();
    const userDevices = allDevices.filter((device) => device.userId === userId && device.pushToken);

    if (userDevices.length === 0) {
      return {
        success: false,
        error: 'No devices found for user',
        sent: 0,
      };
    }

    const results = await Promise.allSettled(
      userDevices.map((device) => {
        const message: ExpoPushMessage = {
          to: device.pushToken!,
          title,
          body,
          sound,
          priority,
          data: {
            type: 'risk_alert',
            chatId,
            messageId,
            riskLevel,
            reasons: reasons || [],
          },
        };
        return sendExpoPushNotification(message);
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.status === 'ok').length;

    return {
      success: sent > 0,
      sent,
      total: userDevices.length,
    };
  });
