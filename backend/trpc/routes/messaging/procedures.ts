/**
 * Messaging tRPC Routes
 * API endpoints for messaging operations
 */

import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { messagingService } from '@/backend/messaging/service';
import {
  SendMessageSchema,
  MessageFilterSchema,
  TypingIndicatorSchema,
  ReadReceiptSchema,
} from '@/backend/messaging/types';

/**
 * Send a new message
 */
export const sendMessageProcedure = publicProcedure
  .input(SendMessageSchema.extend({
    senderId: z.string(),
    senderName: z.string(),
  }))
  .mutation(async ({ input }) => {
    const { senderId, senderName, ...messageInput } = input;
    
    const message = await messagingService.sendMessage(
      messageInput,
      senderId,
      senderName
    );
    
    return {
      success: true,
      message,
    };
  });

/**
 * Get messages for a chat
 */
export const getMessagesProcedure = publicProcedure
  .input(MessageFilterSchema)
  .query(async ({ input }) => {
    const messages = await messagingService.getMessages(input);
    
    return {
      messages,
      hasMore: messages.length === input.limit,
    };
  });

/**
 * Get a single message
 */
export const getMessageProcedure = publicProcedure
  .input(z.object({
    messageId: z.string(),
  }))
  .query(async ({ input }) => {
    const message = await messagingService.getMessage(input.messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    return { message };
  });

/**
 * Delete a message
 */
export const deleteMessageProcedure = publicProcedure
  .input(z.object({
    messageId: z.string(),
    userId: z.string(),
  }))
  .mutation(async ({ input }) => {
    const deleted = await messagingService.deleteMessage(
      input.messageId,
      input.userId
    );
    
    return {
      success: deleted,
    };
  });

/**
 * Mark messages as read
 */
export const markAsReadProcedure = publicProcedure
  .input(ReadReceiptSchema)
  .mutation(async ({ input }) => {
    await messagingService.markAsRead(
      input.chatId,
      input.userId,
      input.messageId
    );
    
    return {
      success: true,
    };
  });

/**
 * Get unread count
 */
export const getUnreadCountProcedure = publicProcedure
  .input(z.object({
    chatId: z.string(),
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    const count = await messagingService.getUnreadCount(
      input.chatId,
      input.userId
    );
    
    return { count };
  });

/**
 * Send typing indicator
 */
export const sendTypingProcedure = publicProcedure
  .input(TypingIndicatorSchema)
  .mutation(({ input }) => {
    messagingService.handleTypingIndicator(
      input.chatId,
      input.userId,
      input.isTyping
    );
    
    return { success: true };
  });

/**
 * Get message statistics
 */
export const getMessageStatsProcedure = publicProcedure
  .input(z.object({
    chatId: z.string(),
  }))
  .query(async ({ input }) => {
    const stats = await messagingService.getStats(input.chatId);
    return stats;
  });
