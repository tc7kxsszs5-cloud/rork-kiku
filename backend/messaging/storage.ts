/**
 * Message Storage Service
 * In-memory storage with persistence hooks for messages
 */

import { Message, MessageFilter } from './types';
import { MessageEncryption } from './encryption';

/**
 * Message Storage Service
 * Handles message persistence and retrieval
 */
export class MessageStorageService {
  private messages: Map<string, Message[]> = new Map();
  private messageIndex: Map<string, Message> = new Map();
  
  /**
   * Store a new message
   */
  async saveMessage(message: Message): Promise<Message> {
    // Encrypt message if needed
    const storedMessage = { ...message };
    if (message.encrypted) {
      storedMessage.text = MessageEncryption.encrypt(message.text);
    }
    
    // Add to chat messages
    const chatMessages = this.messages.get(message.chatId) || [];
    chatMessages.push(storedMessage);
    this.messages.set(message.chatId, chatMessages);
    
    // Add to message index
    this.messageIndex.set(message.id, storedMessage);
    
    return message; // Return original unencrypted
  }
  
  /**
   * Get message by ID
   */
  async getMessage(messageId: string): Promise<Message | null> {
    const message = this.messageIndex.get(messageId);
    if (!message) return null;
    
    // Decrypt if needed
    if (message.encrypted) {
      return {
        ...message,
        text: MessageEncryption.decrypt(message.text),
      };
    }
    
    return message;
  }
  
  /**
   * Get messages for a chat with filtering and pagination
   */
  async getMessages(filter: MessageFilter): Promise<Message[]> {
    const chatMessages = this.messages.get(filter.chatId) || [];
    
    // Apply time filters
    let filtered = chatMessages;
    if (filter.before) {
      filtered = filtered.filter(m => m.timestamp < filter.before!);
    }
    if (filter.after) {
      filtered = filtered.filter(m => m.timestamp > filter.after!);
    }
    
    // Sort by timestamp descending (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    
    // Apply pagination
    const paginated = filtered.slice(filter.offset, filter.offset + filter.limit);
    
    // Decrypt messages if needed
    return paginated.map(msg => {
      if (msg.encrypted) {
        return {
          ...msg,
          text: MessageEncryption.decrypt(msg.text),
        };
      }
      return msg;
    });
  }
  
  /**
   * Update message status
   */
  async updateMessageStatus(
    messageId: string,
    status: Message['status']
  ): Promise<void> {
    const message = this.messageIndex.get(messageId);
    if (message) {
      message.status = status;
    }
  }
  
  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    const message = this.messageIndex.get(messageId);
    if (!message) return false;
    
    // Remove from chat messages
    const chatMessages = this.messages.get(message.chatId);
    if (chatMessages) {
      const index = chatMessages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        chatMessages.splice(index, 1);
      }
    }
    
    // Remove from index
    this.messageIndex.delete(messageId);
    
    return true;
  }
  
  /**
   * Get total message count for a chat
   */
  async getMessageCount(chatId: string): Promise<number> {
    const messages = this.messages.get(chatId) || [];
    return messages.length;
  }
  
  /**
   * Get unread message count for a user in a chat
   */
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    const messages = this.messages.get(chatId) || [];
    return messages.filter(
      m => m.senderId !== userId && m.status !== 'read'
    ).length;
  }
  
  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string, upToTimestamp: number): Promise<void> {
    const messages = this.messages.get(chatId) || [];
    messages.forEach(msg => {
      if (msg.senderId !== userId && msg.timestamp <= upToTimestamp) {
        msg.status = 'read';
      }
    });
  }
  
  /**
   * Clear all messages (for testing)
   */
  async clear(): Promise<void> {
    this.messages.clear();
    this.messageIndex.clear();
  }
  
  /**
   * Get all chat IDs
   */
  async getChatIds(): Promise<string[]> {
    return Array.from(this.messages.keys());
  }
}

// Export singleton instance
export const messageStorage = new MessageStorageService();
