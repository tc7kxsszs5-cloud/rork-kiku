# Messaging Module Setup Guide

## Overview

This guide will help you integrate the messaging module into the Kids application for real-time, secure messaging with AI-based content filtering.

## Architecture Overview

```
┌─────────────────┐      WebSocket       ┌─────────────────┐
│  React Native   │ ◄─────────────────► │  Hono Server    │
│     Client      │                      │   (Backend)     │
│                 │      tRPC API        │                 │
│  - useWebSocket │ ◄─────────────────► │  - WebSocket    │
│  - Context      │                      │  - tRPC Routes  │
│  - Components   │                      │  - Moderation   │
└─────────────────┘                      └─────────────────┘
```

## Prerequisites

- Node.js 18+ or Bun runtime
- Expo CLI
- TypeScript 5+
- React Native project setup

## Installation

### 1. No Additional Dependencies Required

The messaging module uses built-in features:
- **WebSocket**: Native browser/React Native WebSocket API
- **tRPC**: Already included in dependencies
- **Zod**: Already included for validation

### 2. Backend Configuration

The messaging module is already integrated into the backend. Files created:

```
backend/
├── messaging/
│   ├── types.ts              # Type definitions
│   ├── storage.ts            # Message storage
│   ├── moderation.ts         # AI content filtering
│   ├── encryption.ts         # Encryption utilities
│   ├── service.ts            # Core messaging service
│   ├── websocket-manager.ts  # WebSocket connections
│   ├── websocket-handler.ts  # WebSocket handlers
│   ├── index.ts              # Module exports
│   └── README.md             # Module documentation
├── trpc/
│   └── routes/
│       └── messaging/
│           └── procedures.ts  # tRPC API endpoints
└── hono.ts                    # Updated with WebSocket route
```

### 3. Frontend Integration

Frontend hooks and contexts created:

```
hooks/
└── messaging/
    └── useWebSocket.ts        # WebSocket React hook

constants/
└── EnhancedMessagingContext.tsx  # Messaging context
```

## Quick Start

### 1. Wrap Your App with Providers

Update your root layout to include the messaging provider:

```typescript
// app/_layout.tsx
import { EnhancedMessagingProvider } from '@/constants/EnhancedMessagingContext';

export default function RootLayout() {
  return (
    <EnhancedMessagingProvider>
      {/* Your app content */}
    </EnhancedMessagingProvider>
  );
}
```

### 2. Use Messaging in Components

```typescript
import { useEnhancedMessaging } from '@/constants/EnhancedMessagingContext';

function ChatScreen() {
  const {
    messages,
    sendMessage,
    getMessages,
    sendTyping,
    isConnected,
  } = useEnhancedMessaging();

  const handleSend = async () => {
    await sendMessage(
      'chat_123',           // chatId
      'Hello!',             // text
      'user_456',           // senderId
      'John Doe'            // senderName
    );
  };

  return (
    <View>
      <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      {/* Your chat UI */}
    </View>
  );
}
```

### 3. Configure WebSocket URL

Update the WebSocket URL in `constants/EnhancedMessagingContext.tsx`:

```typescript
const ws = useWebSocket({
  url: 'ws://your-server.com/api/ws',  // Update this
  token: userToken,                      // Use actual auth token
  reconnect: true,
});
```

## API Reference

### tRPC Endpoints

All endpoints are available under `trpc.messaging.*`:

#### Send Message
```typescript
const result = await trpc.messaging.send.mutate({
  chatId: 'chat_123',
  text: 'Hello world!',
  senderId: 'user_456',
  senderName: 'Alice',
  priority: 'normal', // optional
});
```

#### Get Messages
```typescript
const result = await trpc.messaging.getMessages.query({
  chatId: 'chat_123',
  limit: 50,
  offset: 0,
});
```

#### Mark as Read
```typescript
await trpc.messaging.markAsRead.mutate({
  chatId: 'chat_123',
  messageId: 'msg_789',
  userId: 'user_456',
  readAt: Date.now(),
});
```

#### Get Unread Count
```typescript
const result = await trpc.messaging.getUnreadCount.query({
  chatId: 'chat_123',
  userId: 'user_456',
});
```

### WebSocket Events

Listen for real-time events:

```typescript
import { useWebSocketEvent, WS_EVENTS } from '@/hooks/messaging/useWebSocket';

// In your component
useWebSocketEvent(ws, WS_EVENTS.MESSAGE_RECEIVE, (message) => {
  console.log('New message:', message);
});

useWebSocketEvent(ws, WS_EVENTS.TYPING_START, (data) => {
  console.log('User typing:', data.userId);
});
```

## Content Moderation

Messages are automatically moderated for:

### Categories
- **Profanity**: Inappropriate language
- **Harassment**: Bullying, threats
- **Violence**: Violent content
- **Self-harm**: Suicidal thoughts
- **Personal Info**: Address, passwords, credit cards
- **Scams**: Fraud attempts
- **Grooming**: Predatory patterns

### Severity Levels
- **SAFE** (0): No issues
- **LOW** (1): Minor concerns
- **MEDIUM** (2): Moderate issues
- **HIGH** (3): Serious problems
- **CRITICAL** (4): Immediate action needed

### Accessing Moderation Results

```typescript
const result = await trpc.messaging.send.mutate({...});

if (result.message.moderationStatus === 'flagged') {
  console.log('Flags:', result.message.moderationFlags);
  // Take appropriate action
}
```

## Security Features

### 1. Authentication

WebSocket connections require authentication:

```typescript
// Simple token format for demo
const token = `user_${userId}`;

// In production, use JWT
const token = await getAuthToken();
```

### 2. Encryption

Messages can be encrypted:

```typescript
import { MessageEncryption } from '@/backend/messaging';

const encrypted = MessageEncryption.encrypt('Secret message');
const decrypted = MessageEncryption.decrypt(encrypted);
```

### 3. Input Validation

All messages are validated:
- Length: 1-5000 characters
- XSS prevention
- Control character filtering

## Testing

### Run Unit Tests

```bash
bun test tests/messaging/
```

### Test Moderation

```bash
bun test tests/messaging/moderation.test.ts
```

### Test Message Service

```bash
bun test tests/messaging/service.test.ts
```

## Environment Configuration

Create a `.env` file:

```env
# WebSocket Configuration
WS_URL=ws://localhost:3000/api/ws
WS_HEARTBEAT_INTERVAL=60000
WS_TIMEOUT=300000

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=60

# Message Configuration
MAX_MESSAGE_LENGTH=5000
MESSAGE_HISTORY_LIMIT=1000
```

## Production Deployment

### 1. WebSocket Server

The current implementation provides WebSocket infrastructure. For production:

```bash
# Install WebSocket library
npm install ws

# Or use platform-specific solutions
# - Cloudflare Workers: Durable Objects
# - AWS: API Gateway WebSocket
# - Heroku: Native WebSocket support
```

### 2. Database Integration

Replace in-memory storage:

```typescript
// backend/messaging/storage.ts
// Replace MessageStorageService with database implementation
// Options: PostgreSQL, MongoDB, DynamoDB
```

### 3. AI Moderation API

Integrate external services:

```typescript
// backend/messaging/moderation.ts
// Add API calls to:
// - OpenAI Moderation API
// - Perspective API (Google)
// - Azure Content Moderator
```

### 4. Monitoring

Add monitoring:

```typescript
import { wsManager } from '@/backend/messaging';

// Log metrics
console.log('Active connections:', wsManager.getConnectionCount());
console.log('Active users:', wsManager.getActiveUserCount());
```

## Troubleshooting

### WebSocket Connection Issues

**Problem**: Cannot connect to WebSocket

**Solutions**:
1. Check WebSocket URL is correct
2. Verify token is valid
3. Check server is running
4. Check firewall/proxy settings

### Messages Not Appearing

**Problem**: Sent messages don't show up

**Solutions**:
1. Check network connection
2. Verify tRPC configuration
3. Check browser console for errors
4. Ensure WebSocket is connected

### High Moderation False Positives

**Problem**: Safe messages are flagged

**Solutions**:
1. Adjust moderation patterns in `moderation.ts`
2. Lower confidence thresholds
3. Add whitelist for common phrases
4. Implement appeal mechanism

## Performance Optimization

### 1. Message Pagination

```typescript
// Load messages in chunks
const messages = await trpc.messaging.getMessages.query({
  chatId: 'chat_123',
  limit: 20,
  offset: 0,
});

// Load more
const moreMessages = await trpc.messaging.getMessages.query({
  chatId: 'chat_123',
  limit: 20,
  offset: 20,
});
```

### 2. Connection Pooling

```typescript
// Limit concurrent WebSocket connections
const MAX_CONNECTIONS = 100;

if (wsManager.getConnectionCount() >= MAX_CONNECTIONS) {
  // Reject or queue new connections
}
```

### 3. Message Batching

```typescript
// Batch multiple messages for better performance
const messages = ['msg1', 'msg2', 'msg3'];
const results = await Promise.all(
  messages.map(text => trpc.messaging.send.mutate({...}))
);
```

## Support

For issues or questions:
- GitHub Issues: [rork-kiku/issues](https://github.com/tc7kxsszs5-cloud/rork-kiku/issues)
- Documentation: `backend/messaging/README.md`
- Email: support@kiku-app.com

## License

Proprietary - Kids Safety Messenger © 2024
