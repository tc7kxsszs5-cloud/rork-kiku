/**
 * Messaging Service
 * Core service that orchestrates message operations
 */

import { Message, SendMessageInput, MessageFilter, WS_EVENTS } from './types';
import { messageStorage } from './storage';
import { contentModeration } from './moderation';
import { wsManager } from './websocket-manager';
import { validateMessage, sanitizeInput } from './encryption';

/**
 * Messaging Service
 * Handles all message-related operations
 */
export class MessagingService {
  /**
   * Send a message
   */
  async sendMessage(
    input: SendMessageInput,
    senderId: string,
    senderName: string
  ): Promise<Message> {
    // Validate input
    const validation = validateMessage(input.text);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Sanitize text
    const sanitizedText = sanitizeInput(input.text);
    
    // Moderate content
    const moderationResult = await contentModeration.moderateMessage(sanitizedText);
    
    // Create message
    const message: Message = {
      id: this.generateMessageId(),
      chatId: input.chatId,
      senderId,
      senderName,
      text: sanitizedText,
      timestamp: Date.now(),
      status: 'pending',
      priority: input.priority || 'normal',
      replyToId: input.replyToId,
      attachments: input.attachments,
      moderationStatus: moderationResult.isApproved ? 'approved' : 'flagged',
      moderationFlags: moderationResult.flags,
      encrypted: false,
    };
    
    // Store message
    await messageStorage.saveMessage(message);
    
    // Update status to sent
    message.status = 'sent';
    await messageStorage.updateMessageStatus(message.id, 'sent');
    
    // Broadcast to connected clients
    this.broadcastMessage(message);
    
    // If message is flagged, notify moderators
    if (!moderationResult.isApproved) {
      console.log('[Messaging] Flagged message:', {
        messageId: message.id,
        flags: moderationResult.flags,
        reasons: moderationResult.reasons,
      });
    }
    
    return message;
  }
  
  /**
   * Get messages for a chat
   */
  async getMessages(filter: MessageFilter): Promise<Message[]> {
    return messageStorage.getMessages(filter);
  }
  
  /**
   * Get a single message
   */
  async getMessage(messageId: string): Promise<Message | null> {
    return messageStorage.getMessage(messageId);
  }
  
  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const message = await messageStorage.getMessage(messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    
    // Check if user is the sender
    if (message.senderId !== userId) {
      throw new Error('Unauthorized to delete this message');
    }
    
    const deleted = await messageStorage.deleteMessage(messageId);
    
    if (deleted) {
      // Notify clients about deletion
      wsManager.sendToUsers(
        [message.senderId],
        WS_EVENTS.MESSAGE_DELETE,
        { messageId, chatId: message.chatId }
      );
    }
    
    return deleted;
  }
  
  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string, messageId: string): Promise<void> {
    const message = await messageStorage.getMessage(messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    
    await messageStorage.markAsRead(chatId, userId, message.timestamp);
    
    // Notify sender about read receipt
    wsManager.sendToUser(message.senderId, WS_EVENTS.MESSAGE_READ, {
      chatId,
      messageId,
      userId,
      readAt: Date.now(),
    });
  }
  
  /**
   * Get unread message count
   */
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    return messageStorage.getUnreadCount(chatId, userId);
  }
  
  /**
   * Handle typing indicator
   */
  handleTypingIndicator(chatId: string, userId: string, isTyping: boolean): void {
    const event = isTyping ? WS_EVENTS.TYPING_START : WS_EVENTS.TYPING_STOP;
    
    // Broadcast to other users in the chat
    // Note: In production, we'd look up chat participants
    wsManager.broadcast(event, {
      chatId,
      userId,
      isTyping,
    });
  }
  
  /**
   * Broadcast message to recipients
   * 
   * ⚠️ SECURITY: This is a simplified implementation
   * In production, messages should ONLY be sent to authorized chat participants
   */
  private broadcastMessage(message: Message): void {
    // TODO: In production, look up chat participants from database
    // and only send to authorized users
    // Example:
    // const participants = await chatService.getParticipants(message.chatId);
    // wsManager.sendToUsers(participants, WS_EVENTS.MESSAGE_RECEIVE, message);
    
    // TEMPORARY: Broadcasting to all users (REMOVE IN PRODUCTION)
    console.warn('[Security] Broadcasting to all users - implement proper participant filtering');
    wsManager.broadcast(WS_EVENTS.MESSAGE_RECEIVE, message);
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get message statistics
   */
  async getStats(chatId: string): Promise<{
    total: number;
    flagged: number;
    approved: number;
  }> {
    const messages = await messageStorage.getMessages({
      chatId,
      limit: 1000,
      offset: 0,
    });
    
    return {
      total: messages.length,
      flagged: messages.filter(m => m.moderationStatus === 'flagged').length,
      approved: messages.filter(m => m.moderationStatus === 'approved').length,
    };
  }
}

// Export singleton instance
export const messagingService = new MessagingService();
