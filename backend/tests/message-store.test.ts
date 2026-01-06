import { 
  storeMessage, 
  updateMessageAnalysis, 
  getChatMessages, 
  getChat,
  getUserChats,
  getMessage,
  upsertChat,
  deleteMessage
} from '../services/message-store';

/**
 * Unit tests for message storage service
 */

describe('Message Store Service', () => {
  describe('upsertChat', () => {
    test('should create a new chat', () => {
      const chatId = 'chat_' + Date.now();
      const chat = upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      expect(chat.id).toBe(chatId);
      expect(chat.participants).toEqual(['user1', 'user2']);
      expect(chat.participantNames).toEqual(['Alice', 'Bob']);
      expect(chat.messages).toEqual([]);
      expect(chat.overallRisk).toBe('safe');
    });

    test('should return existing chat if already exists', () => {
      const chatId = 'chat_existing_' + Date.now();
      const chat1 = upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const chat2 = upsertChat(chatId, {
        participants: ['user3', 'user4'],
        participantNames: ['Charlie', 'David'],
      });

      expect(chat1.id).toBe(chat2.id);
      expect(chat2.participants).toEqual(['user1', 'user2']); // Original participants
    });

    test('should create group chat', () => {
      const chatId = 'group_' + Date.now();
      const chat = upsertChat(chatId, {
        participants: ['user1', 'user2', 'user3'],
        participantNames: ['Alice', 'Bob', 'Charlie'],
        isGroup: true,
        groupName: 'Study Group',
        groupType: 'class',
        groupDescription: 'Math study group',
        adminIds: ['user1'],
      });

      expect(chat.isGroup).toBe(true);
      expect(chat.groupName).toBe('Study Group');
      expect(chat.groupType).toBe('class');
      expect(chat.adminIds).toEqual(['user1']);
    });
  });

  describe('storeMessage', () => {
    test('should store a new message', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      const message = storeMessage(messageId, {
        chatId,
        text: 'Hello!',
        senderId: 'user1',
        senderName: 'Alice',
      });

      expect(message.id).toBe(messageId);
      expect(message.text).toBe('Hello!');
      expect(message.senderId).toBe('user1');
      expect(message.analyzed).toBe(false);
      expect(message.timestamp).toBeDefined();
    });

    test('should add message to chat', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      storeMessage(messageId, {
        chatId,
        text: 'Test message',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const chat = getChat(chatId);
      expect(chat).toBeDefined();
      expect(chat!.messages).toHaveLength(1);
      expect(chat!.messages[0].text).toBe('Test message');
    });

    test('should update chat lastActivity', () => {
      const chatId = 'chat_' + Date.now();
      const chat1 = upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const initialActivity = chat1.lastActivity;

      // Wait a bit
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      delay(10);

      const messageId = 'msg_' + Date.now();
      const message = storeMessage(messageId, {
        chatId,
        text: 'New message',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const chat2 = getChat(chatId);
      expect(chat2!.lastActivity).toBe(message.timestamp);
      expect(chat2!.lastActivity).toBeGreaterThanOrEqual(initialActivity);
    });

    test('should store message with image', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      const message = storeMessage(messageId, {
        chatId,
        text: 'Check out this photo!',
        senderId: 'user1',
        senderName: 'Alice',
        imageUri: 'https://example.com/photo.jpg',
      });

      expect(message.imageUri).toBe('https://example.com/photo.jpg');
    });
  });

  describe('updateMessageAnalysis', () => {
    test('should update message with analysis results', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      storeMessage(messageId, {
        chatId,
        text: 'Test message',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const updated = updateMessageAnalysis(messageId, 'safe', ['Content is safe']);

      expect(updated).toBeDefined();
      expect(updated!.analyzed).toBe(true);
      expect(updated!.riskLevel).toBe('safe');
      expect(updated!.riskReasons).toEqual(['Content is safe']);
    });

    test('should update chat overall risk level', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      storeMessage(messageId, {
        chatId,
        text: 'Risky message',
        senderId: 'user1',
        senderName: 'Alice',
      });

      updateMessageAnalysis(messageId, 'high', ['Inappropriate content']);

      const chat = getChat(chatId);
      expect(chat!.overallRisk).toBe('high');
    });

    test('should use highest risk level in chat', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const msg1 = 'msg1_' + Date.now();
      storeMessage(msg1, {
        chatId,
        text: 'Safe message',
        senderId: 'user1',
        senderName: 'Alice',
      });
      updateMessageAnalysis(msg1, 'safe', []);

      const msg2 = 'msg2_' + Date.now();
      storeMessage(msg2, {
        chatId,
        text: 'Medium risk',
        senderId: 'user2',
        senderName: 'Bob',
      });
      updateMessageAnalysis(msg2, 'medium', ['Some concern']);

      const msg3 = 'msg3_' + Date.now();
      storeMessage(msg3, {
        chatId,
        text: 'Low risk',
        senderId: 'user1',
        senderName: 'Alice',
      });
      updateMessageAnalysis(msg3, 'low', ['Minor issue']);

      const chat = getChat(chatId);
      expect(chat!.overallRisk).toBe('medium');
    });

    test('should return undefined for non-existent message', () => {
      const result = updateMessageAnalysis('non_existent', 'safe', []);
      expect(result).toBeUndefined();
    });
  });

  describe('getChatMessages', () => {
    test('should retrieve all messages in chronological order', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const msg1Id = 'msg1_' + Date.now();
      const msg1 = storeMessage(msg1Id, {
        chatId,
        text: 'First',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const msg2Id = 'msg2_' + Date.now();
      const msg2 = storeMessage(msg2Id, {
        chatId,
        text: 'Second',
        senderId: 'user2',
        senderName: 'Bob',
      });

      const messages = getChatMessages(chatId);
      expect(messages).toHaveLength(2);
      expect(messages[0].timestamp).toBeLessThanOrEqual(messages[1].timestamp);
      expect(messages[0].text).toBe('First');
      expect(messages[1].text).toBe('Second');
    });

    test('should limit number of messages returned', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      // Add 10 messages
      for (let i = 0; i < 10; i++) {
        storeMessage(`msg${i}_${Date.now()}`, {
          chatId,
          text: `Message ${i}`,
          senderId: 'user1',
          senderName: 'Alice',
        });
      }

      const messages = getChatMessages(chatId, 5);
      expect(messages).toHaveLength(5);
      // Should return the last 5 messages
      expect(messages[4].text).toContain('9');
    });

    test('should return empty array for non-existent chat', () => {
      const messages = getChatMessages('non_existent_chat');
      expect(messages).toEqual([]);
    });
  });

  describe('getUserChats', () => {
    test('should return all chats for a user', () => {
      const userId = 'user1';
      const chat1Id = 'chat1_' + Date.now();
      const chat2Id = 'chat2_' + Date.now();

      upsertChat(chat1Id, {
        participants: [userId, 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      upsertChat(chat2Id, {
        participants: [userId, 'user3'],
        participantNames: ['Alice', 'Charlie'],
      });

      const chats = getUserChats(userId);
      expect(chats.length).toBeGreaterThanOrEqual(2);
      
      const userChatIds = chats.map(c => c.id);
      expect(userChatIds).toContain(chat1Id);
      expect(userChatIds).toContain(chat2Id);
    });

    test('should sort chats by lastActivity (most recent first)', () => {
      const userId = 'user_test_' + Date.now();
      const oldChatId = 'old_' + Date.now();
      const newChatId = 'new_' + Date.now();

      const oldChat = upsertChat(oldChatId, {
        participants: [userId, 'other1'],
        participantNames: ['User', 'Other1'],
      });

      // Wait a bit
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      delay(10);

      const newChat = upsertChat(newChatId, {
        participants: [userId, 'other2'],
        participantNames: ['User', 'Other2'],
      });

      // Add a message to newChat to update lastActivity
      storeMessage('msg_' + Date.now(), {
        chatId: newChatId,
        text: 'Recent message',
        senderId: userId,
        senderName: 'User',
      });

      const chats = getUserChats(userId);
      const relevantChats = chats.filter(c => c.id === oldChatId || c.id === newChatId);
      
      if (relevantChats.length === 2) {
        expect(relevantChats[0].id).toBe(newChatId); // Most recent first
      }
    });

    test('should not return chats user is not part of', () => {
      const userId = 'isolated_user_' + Date.now();
      const chatId = 'private_chat_' + Date.now();

      upsertChat(chatId, {
        participants: ['other1', 'other2'],
        participantNames: ['Other1', 'Other2'],
      });

      const chats = getUserChats(userId);
      const chatIds = chats.map(c => c.id);
      expect(chatIds).not.toContain(chatId);
    });
  });

  describe('getMessage', () => {
    test('should retrieve a specific message', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      const stored = storeMessage(messageId, {
        chatId,
        text: 'Test message',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const retrieved = getMessage(messageId);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(messageId);
      expect(retrieved!.text).toBe('Test message');
    });

    test('should return undefined for non-existent message', () => {
      const result = getMessage('non_existent_msg');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMessage', () => {
    test('should delete a message', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      storeMessage(messageId, {
        chatId,
        text: 'To be deleted',
        senderId: 'user1',
        senderName: 'Alice',
      });

      const deleted = deleteMessage(messageId);
      expect(deleted).toBe(true);

      const message = getMessage(messageId);
      expect(message).toBeUndefined();
    });

    test('should remove message from chat', () => {
      const chatId = 'chat_' + Date.now();
      upsertChat(chatId, {
        participants: ['user1', 'user2'],
        participantNames: ['Alice', 'Bob'],
      });

      const messageId = 'msg_' + Date.now();
      storeMessage(messageId, {
        chatId,
        text: 'To be deleted',
        senderId: 'user1',
        senderName: 'Alice',
      });

      deleteMessage(messageId);

      const messages = getChatMessages(chatId);
      expect(messages.find(m => m.id === messageId)).toBeUndefined();
    });

    test('should return false for non-existent message', () => {
      const deleted = deleteMessage('non_existent');
      expect(deleted).toBe(false);
    });
  });
});
