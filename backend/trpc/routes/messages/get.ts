import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { supabase } from '../../../utils/supabase.js';
import { TRPCError } from '@trpc/server';

export const getMessagesForChatProcedure = protectedProcedure
  .input(
    z.object({
      chatId: z.string().min(1),
      since: z.number().optional(), // Unix timestamp ms — only return messages newer than this
    })
  )
  .query(async ({ input }) => {
    if (!supabase) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not configured',
      });
    }

    const { chatId, since } = input;

    let query = supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true })
      .limit(100);

    if (since !== undefined && since > 0) {
      query = query.gt('timestamp', since);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[messages/get] Query error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch messages',
      });
    }

    const messages = (data ?? []).map((row: any) => ({
      id: row.id,
      chatId: row.chat_id,
      senderId: row.sender,
      senderName: row.sender, // senderName stored in sender field or fallback
      content: row.content,
      text: row.content, // alias for frontend compatibility
      timestamp: row.timestamp,
      messageType: row.message_type ?? 'text',
      riskLevel: row.risk_level ?? 'safe',
      aiAnalysis: row.ai_analysis ?? null,
      createdAt: row.created_at,
      analyzed: row.risk_level !== null && row.risk_level !== undefined,
    }));

    return {
      success: true,
      messages,
      count: messages.length,
    };
  });
