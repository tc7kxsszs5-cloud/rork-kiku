#!/usr/bin/env node

/**
 * Simple WebSocket client example for testing the Kids Messenger backend
 * 
 * Usage:
 *   npm run example:client
 * 
 * Or directly:
 *   node backend/examples/websocket-client-example.js
 */

const WebSocket = require('ws');

const WS_URL = process.env.WS_URL || 'ws://localhost:3000/ws';
const USER_ID = process.env.USER_ID || 'test_user_' + Math.floor(Math.random() * 1000);

console.log('🚀 Connecting to Kids Messenger WebSocket...');
console.log('📍 URL:', WS_URL);
console.log('👤 User ID:', USER_ID);
console.log('');

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to server!');
  console.log('');
  
  // Authenticate
  console.log('🔐 Authenticating...');
  ws.send(JSON.stringify({
    type: 'auth',
    payload: { userId: USER_ID }
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  console.log('📨 Received message:');
  console.log('   Type:', message.type);
  console.log('   Payload:', JSON.stringify(message.payload, null, 2));
  console.log('');
  
  // Handle different message types
  switch (message.type) {
    case 'connected':
      console.log('🎉 Welcome message received!');
      console.log('');
      break;
      
    case 'auth_success':
      console.log('✅ Authentication successful!');
      console.log('');
      
      // Join a test chat
      const chatId = 'demo_chat_' + Date.now();
      console.log('💬 Joining chat:', chatId);
      ws.send(JSON.stringify({
        type: 'join_chat',
        payload: {
          chatId: chatId,
          participants: [USER_ID, 'demo_user_2'],
          participantNames: ['You', 'Demo User 2']
        }
      }));
      break;
      
    case 'chat_joined':
      console.log('✅ Successfully joined chat!');
      console.log('');
      
      // Send a test message
      console.log('✍️  Sending test message...');
      ws.send(JSON.stringify({
        type: 'message',
        payload: {
          chatId: message.payload.chatId,
          text: 'Hello from the demo client!',
          senderId: USER_ID,
          senderName: 'Demo User'
        }
      }));
      
      // Send a risky message to test filtering
      setTimeout(() => {
        console.log('⚠️  Sending risky message to test filter...');
        ws.send(JSON.stringify({
          type: 'message',
          payload: {
            chatId: message.payload.chatId,
            text: 'You are stupid',
            senderId: USER_ID,
            senderName: 'Demo User'
          }
        }));
      }, 1000);
      
      // Send typing indicator
      setTimeout(() => {
        console.log('⌨️  Sending typing indicator...');
        ws.send(JSON.stringify({
          type: 'typing',
          payload: {
            chatId: message.payload.chatId,
            isTyping: true
          }
        }));
      }, 2000);
      
      // Close connection after demo
      setTimeout(() => {
        console.log('');
        console.log('👋 Demo complete! Closing connection...');
        ws.close();
      }, 5000);
      break;
      
    case 'new_message':
      console.log('💬 New message received!');
      console.log('   Text:', message.payload.text);
      console.log('   Risk Level:', message.payload.riskLevel);
      console.log('   Analysis:', message.payload.analyzed ? 'Analyzed' : 'Not analyzed');
      console.log('');
      break;
      
    case 'message_blocked':
      console.log('🚫 Message was BLOCKED!');
      console.log('   Risk Level:', message.payload.riskLevel);
      console.log('   Reasons:', message.payload.reasons);
      console.log('');
      break;
      
    case 'message_warning':
      console.log('⚠️  Message warning received!');
      console.log('   Risk Level:', message.payload.riskLevel);
      console.log('   Reasons:', message.payload.reasons);
      console.log('');
      break;
      
    case 'error':
      console.log('❌ Error:', message.payload.message);
      console.log('');
      break;
  }
});

ws.on('close', () => {
  console.log('');
  console.log('👋 Disconnected from server');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  console.error('');
  console.error('Make sure the backend server is running:');
  console.error('  npm run start:backend');
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Closing connection...');
  ws.close();
  process.exit(0);
});
