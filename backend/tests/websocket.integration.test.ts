import WebSocket from 'ws';
import { createServer } from 'http';
import { serve } from '@hono/node-server';
import app from '../hono';
import { createWebSocketServer } from '../services/websocket-server';

/**
 * Integration tests for WebSocket functionality
 * These tests verify the complete message flow through the WebSocket server
 */

describe('WebSocket Integration Tests', () => {
  let server: any;
  let wss: any;
  const TEST_PORT = 3001;
  const WS_URL = `ws://localhost:${TEST_PORT}/ws`;

  beforeAll((done) => {
    // Create test server
    server = createServer(serve(app));
    wss = createWebSocketServer(server);
    
    server.listen(TEST_PORT, () => {
      console.log(`Test server started on port ${TEST_PORT}`);
      done();
    });
  });

  afterAll((done) => {
    wss.close(() => {
      server.close(() => {
        console.log('Test server closed');
        done();
      });
    });
  });

  describe('Connection and Authentication', () => {
    test('should establish WebSocket connection', (done) => {
      const ws = new WebSocket(WS_URL);

      ws.on('open', () => {
        ws.close();
        done();
      });

      ws.on('error', (error) => {
        done(error);
      });
    });

    test('should receive welcome message on connection', (done) => {
      const ws = new WebSocket(WS_URL);

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        expect(message.type).toBe('connected');
        expect(message.payload.message).toContain('Connected');
        ws.close();
        done();
      });
    });

    test('should authenticate successfully', (done) => {
      const ws = new WebSocket(WS_URL);
      let messageCount = 0;

      ws.on('message', (data) => {
        messageCount++;
        const message = JSON.parse(data.toString());
        
        if (messageCount === 1) {
          // Skip welcome message
          return;
        }

        if (message.type === 'auth_success') {
          expect(message.payload.userId).toBe('test_user');
          ws.close();
          done();
        }
      });

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'auth',
          payload: { userId: 'test_user' }
        }));
      });
    });

    test('should reject authentication without userId', (done) => {
      const ws = new WebSocket(WS_URL);
      let messageCount = 0;

      ws.on('message', (data) => {
        messageCount++;
        const message = JSON.parse(data.toString());
        
        if (messageCount === 1) {
          return; // Skip welcome
        }

        if (message.type === 'auth_failed') {
          expect(message.payload.message).toContain('User ID is required');
          ws.close();
          done();
        }
      });

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'auth',
          payload: {}
        }));
      });
    });
  });

  describe('Chat Operations', () => {
    test('should join a chat successfully', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          // Welcome message
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          // Auth success, now join chat
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: 'test_chat_1',
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          expect(message.payload.chatId).toBe('test_chat_1');
          ws.close();
          done();
        }
      });
    });

    test('should reject chat join without authentication', (done) => {
      const ws = new WebSocket(WS_URL);
      let messageCount = 0;

      ws.on('message', (data) => {
        messageCount++;
        const message = JSON.parse(data.toString());
        
        if (messageCount === 1) {
          // Skip welcome
          return;
        }

        if (message.type === 'error') {
          expect(message.payload.message).toContain('Not authenticated');
          ws.close();
          done();
        }
      });

      ws.on('open', () => {
        ws.send(JSON.stringify({
          type: 'join_chat',
          payload: {
            chatId: 'test_chat',
            participants: ['user1', 'user2'],
            participantNames: ['Alice', 'Bob']
          }
        }));
      });
    });
  });

  describe('Message Sending and Filtering', () => {
    test('should send and receive safe message', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;
      const testChatId = 'chat_safe_' + Date.now();

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          // Auth
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          // Join chat
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: testChatId,
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          // Send message
          ws.send(JSON.stringify({
            type: 'message',
            payload: {
              chatId: testChatId,
              text: 'Hello, how are you?',
              senderId: 'user1',
              senderName: 'Alice'
            }
          }));
        } else if (message.type === 'new_message') {
          expect(message.payload.text).toBe('Hello, how are you?');
          expect(message.payload.riskLevel).toBe('safe');
          expect(message.payload.analyzed).toBe(true);
          ws.close();
          done();
        }
      });
    });

    test('should block high-risk message', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;
      const testChatId = 'chat_risky_' + Date.now();

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: testChatId,
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          // Send risky message
          ws.send(JSON.stringify({
            type: 'message',
            payload: {
              chatId: testChatId,
              text: 'You are stupid and I hate you',
              senderId: 'user1',
              senderName: 'Alice'
            }
          }));
        } else if (message.type === 'message_blocked') {
          expect(message.payload.riskLevel).toBe('high');
          expect(message.payload.reasons.length).toBeGreaterThan(0);
          ws.close();
          done();
        }
      });
    });

    test('should send warning for medium-risk message', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;
      const testChatId = 'chat_warning_' + Date.now();
      let receivedNewMessage = false;
      let receivedWarning = false;

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: testChatId,
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          ws.send(JSON.stringify({
            type: 'message',
            payload: {
              chatId: testChatId,
              text: 'What the hell is this',
              senderId: 'user1',
              senderName: 'Alice'
            }
          }));
        } else if (message.type === 'new_message') {
          receivedNewMessage = true;
          expect(message.payload.riskLevel).not.toBe('safe');
          
          if (receivedWarning) {
            ws.close();
            done();
          }
        } else if (message.type === 'message_warning') {
          receivedWarning = true;
          expect(message.payload.riskLevel).not.toBe('safe');
          
          if (receivedNewMessage) {
            ws.close();
            done();
          }
        }
      });
    }, 10000); // Increase timeout for this test
  });

  describe('Message History', () => {
    test('should retrieve message history', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;
      const testChatId = 'chat_history_' + Date.now();

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: testChatId,
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          // Send a message first
          ws.send(JSON.stringify({
            type: 'message',
            payload: {
              chatId: testChatId,
              text: 'Test message',
              senderId: 'user1',
              senderName: 'Alice'
            }
          }));
        } else if (message.type === 'new_message') {
          // Now request history
          ws.send(JSON.stringify({
            type: 'get_messages',
            payload: {
              chatId: testChatId
            }
          }));
        } else if (message.type === 'messages_history') {
          expect(message.payload.chatId).toBe(testChatId);
          expect(Array.isArray(message.payload.messages)).toBe(true);
          expect(message.payload.messages.length).toBeGreaterThan(0);
          ws.close();
          done();
        }
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON', (done) => {
      const ws = new WebSocket(WS_URL);
      let messageCount = 0;

      ws.on('message', (data) => {
        messageCount++;
        const message = JSON.parse(data.toString());
        
        if (messageCount === 1) {
          return; // Skip welcome
        }

        if (message.type === 'error') {
          expect(message.payload.message).toContain('Invalid message format');
          ws.close();
          done();
        }
      });

      ws.on('open', () => {
        ws.send('invalid json{');
      });
    });

    test('should handle unknown message type', (done) => {
      const ws = new WebSocket(WS_URL);
      let messageCount = 0;

      ws.on('message', (data) => {
        messageCount++;
        const message = JSON.parse(data.toString());
        
        if (messageCount === 1) {
          // Auth first
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
          return;
        }

        if (messageCount === 2) {
          // Send unknown type
          ws.send(JSON.stringify({
            type: 'unknown_type',
            payload: {}
          }));
          return;
        }

        if (message.type === 'error') {
          expect(message.payload.message).toContain('Unknown message type');
          ws.close();
          done();
        }
      });
    });
  });

  describe('Typing Indicator', () => {
    test('should send typing indicator', (done) => {
      const ws = new WebSocket(WS_URL);
      let step = 0;
      const testChatId = 'chat_typing_' + Date.now();

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        step++;

        if (step === 1) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { userId: 'user1' }
          }));
        } else if (step === 2 && message.type === 'auth_success') {
          ws.send(JSON.stringify({
            type: 'join_chat',
            payload: {
              chatId: testChatId,
              participants: ['user1', 'user2'],
              participantNames: ['Alice', 'Bob']
            }
          }));
        } else if (message.type === 'chat_joined') {
          ws.send(JSON.stringify({
            type: 'typing',
            payload: {
              chatId: testChatId,
              isTyping: true
            }
          }));
          
          // Close after sending typing indicator
          setTimeout(() => {
            ws.close();
            done();
          }, 100);
        }
      });
    });
  });
});
