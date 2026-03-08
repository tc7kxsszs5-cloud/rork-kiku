import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { supabase } from '../../../utils/supabase.js';
import { listDeviceRecords } from '../notifications/store.js';
import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';

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

const sendExpoPushNotification = async (
  message: ExpoPushMessage
): Promise<{ status: 'ok' | 'error'; id?: string; error?: string }> => {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
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
    console.error('[messages/send] Expo Push API error:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const sendMessageProcedure = protectedProcedure
  .input(
    z.object({
      chatId: z.string().min(1),
      content: z.string().min(1).max(5000),
      recipientUserId: z.string().optional(),
      senderName: z.string().min(1),
      messageType: z.enum(['text', 'image', 'voice']).default('text'),
    })
  )
  .mutation(async ({ input, ctx }) => {
    if (!supabase) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not configured',
      });
    }

    const { chatId, content, recipientUserId, senderName, messageType } = input;
    const senderId = ctx.auth!.userId;
    const timestamp = Date.now();
    const messageId = randomUUID();

    // Insert message into Supabase
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        chat_id: chatId,
        sender: senderId,
        content,
        timestamp,
        message_type: messageType,
        risk_level: 'safe',
        ai_analysis: null,
        created_at: timestamp,
        child_id: null,
        device_id: null,
      })
      .select()
      .single();

    if (messageError) {
      console.error('[messages/send] Insert message error:', messageError);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to save message',
      });
    }

    // Update chats table with last message info
    const { error: chatError } = await supabase
      .from('chats')
      .update({
        last_message: content,
        last_message_timestamp: timestamp,
        updated_at: timestamp,
      })
      .eq('id', chatId);

    if (chatError) {
      // Non-critical: log but do not throw — message was saved
      console.error('[messages/send] Update chat error:', chatError);
    }

    // Send push notification to recipient (best-effort)
    if (recipientUserId) {
      try {
        const allDevices = listDeviceRecords();
        const recipientDevices = allDevices.filter(
          (device) => device.userId === recipientUserId && device.pushToken
        );

        if (recipientDevices.length > 0) {
          await Promise.allSettled(
            recipientDevices.map((device) => {
              const pushMsg: ExpoPushMessage = {
                to: device.pushToken!,
                title: senderName,
                body: messageType === 'text' ? content : `[${messageType}]`,
                sound: 'default',
                priority: 'high',
                data: {
                  type: 'new_message',
                  chatId,
                  messageId,
                  senderId,
                  senderName,
                },
              };
              return sendExpoPushNotification(pushMsg);
            })
          );
        }
      } catch (pushError) {
        // Non-critical
        console.error('[messages/send] Push notification error:', pushError);
      }
    }

    const created = messageData ?? {
      id: messageId,
      chat_id: chatId,
      sender: senderId,
      content,
      timestamp,
      message_type: messageType,
      risk_level: 'safe',
      created_at: timestamp,
    };

    return {
      success: true,
      message: {
        id: created.id,
        chatId: created.chat_id,
        senderId: created.sender,
        senderName,
        content: created.content,
        timestamp: created.timestamp,
        messageType: created.message_type,
        riskLevel: created.risk_level,
        createdAt: created.created_at,
      },
    };
  });
