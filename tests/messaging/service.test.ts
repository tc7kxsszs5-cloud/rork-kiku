/**
 * Messaging Service Tests
 * Unit tests for core messaging functionality
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { messagingService } from '../../backend/messaging/service';
import { messageStorage } from '../../backend/messaging/storage';

describe('MessagingService', () => {
  beforeEach(async () => {
    // Clear storage before each test
    await messageStorage.clear();
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const result = await messagingService.sendMessage(
        {
          chatId: 'chat_test_1',
          text: 'Hello world!',
        },
        'user_1',
        'Test User'
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.chatId).toBe('chat_test_1');
      expect(result.text).toBe('Hello world!');
      expect(result.senderId).toBe('user_1');
      expect(result.senderName).toBe('Test User');
      expect(result.status).toBe('sent');
    });

    it('should reject empty messages', async () => {
      await expect(
        messagingService.sendMessage(
          {
            chatId: 'chat_test_1',
            text: '',
          },
          'user_1',
          'Test User'
        )
      ).rejects.toThrow();
    });

    it('should reject messages exceeding max length', async () => {
      const longText = 'a'.repeat(5001);
      
      await expect(
        messagingService.sendMessage(
          {
            chatId: 'chat_test_1',
            text: longText,
          },
          'user_1',
          'Test User'
        )
      ).rejects.toThrow();
    });

    it('should flag inappropriate content', async () => {
      const result = await messagingService.sendMessage(
        {
          chatId: 'chat_test_1',
          text: 'You are stupid and dumb',
        },
        'user_1',
        'Test User'
      );

      expect(result.moderationStatus).toBe('flagged');
      expect(result.moderationFlags).toBeDefined();
      expect(result.moderationFlags!.length).toBeGreaterThan(0);
    });

    it('should approve safe content', async () => {
      const result = await messagingService.sendMessage(
        {
          chatId: 'chat_test_1',
          text: 'Have a great day!',
        },
        'user_1',
        'Test User'
      );

      expect(result.moderationStatus).toBe('approved');
    });
  });

  describe('getMessages', () => {
    it('should retrieve messages for a chat', async () => {
      // Send some messages
      await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Message 1' },
        'user_1',
        'User One'
      );
      await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Message 2' },
        'user_2',
        'User Two'
      );

      const result = await messagingService.getMessages({
        chatId: 'chat_test_1',
        limit: 10,
        offset: 0,
      });

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Message 2'); // Newest first
      expect(result[1].text).toBe('Message 1');
    });

    it('should paginate messages correctly', async () => {
      // Send multiple messages
      for (let i = 1; i <= 5; i++) {
        await messagingService.sendMessage(
          { chatId: 'chat_test_1', text: `Message ${i}` },
          'user_1',
          'Test User'
        );
      }

      const page1 = await messagingService.getMessages({
        chatId: 'chat_test_1',
        limit: 2,
        offset: 0,
      });

      const page2 = await messagingService.getMessages({
        chatId: 'chat_test_1',
        limit: 2,
        offset: 2,
      });

      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(2);
      expect(page1[0].text).not.toBe(page2[0].text);
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message by owner', async () => {
      const message = await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'To be deleted' },
        'user_1',
        'Test User'
      );

      const deleted = await messagingService.deleteMessage(message.id, 'user_1');
      expect(deleted).toBe(true);

      const retrieved = await messagingService.getMessage(message.id);
      expect(retrieved).toBeNull();
    });

    it('should not allow deleting messages by non-owner', async () => {
      const message = await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Protected message' },
        'user_1',
        'Test User'
      );

      await expect(
        messagingService.deleteMessage(message.id, 'user_2')
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('markAsRead', () => {
    it('should mark messages as read', async () => {
      const message = await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Unread message' },
        'user_1',
        'Test User'
      );

      await messagingService.markAsRead('chat_test_1', 'user_2', message.id);

      const unreadCount = await messagingService.getUnreadCount('chat_test_1', 'user_2');
      expect(unreadCount).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Safe message' },
        'user_1',
        'Test User'
      );
      
      await messagingService.sendMessage(
        { chatId: 'chat_test_1', text: 'Stupid idiot' },
        'user_2',
        'Bad User'
      );

      const stats = await messagingService.getStats('chat_test_1');
      
      expect(stats.total).toBe(2);
      expect(stats.approved).toBe(1);
      expect(stats.flagged).toBe(1);
    });
  });
});
