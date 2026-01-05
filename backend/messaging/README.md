# Messaging Module Documentation

## Overview

The messaging module provides a secure, AI-enabled text chatting system for the Kids application. It includes real-time WebSocket communication, AI-based content filtering, and end-to-end encryption capabilities.

## Architecture

### Components

1. **Types (`types.ts`)** - Core TypeScript types and Zod schemas
2. **Storage (`storage.ts`)** - In-memory message storage with encryption support
3. **Moderation (`moderation.ts`)** - AI-based content filtering service
4. **Encryption (`encryption.ts`)** - Message encryption/decryption utilities
5. **WebSocket Manager (`websocket-manager.ts`)** - WebSocket connection management
6. **WebSocket Handler (`websocket-handler.ts`)** - WebSocket message routing
7. **Messaging Service (`service.ts`)** - Core messaging orchestration
8. **tRPC Procedures (`procedures.ts`)** - API endpoints

### Flow Diagram

```
Client -> tRPC API -> Messaging Service -> Storage
                          |
                          v
                    Content Moderation
                          |
                          v
                    WebSocket Manager -> Connected Clients
```

## Features

### 1. Real-time Text Messaging

Messages are sent through tRPC API and then broadcasted to connected clients via WebSocket.

**Send Message:**
```typescript
trpc.messaging.send.mutate({
  chatId: 'chat_123',
  text: 'Hello world!',
  senderId: 'user_456',
  senderName: 'John Doe',
  priority: 'normal', // optional: 'low' | 'normal' | 'high'
  replyToId: 'msg_789', // optional
});
```

### 2. AI Content Filtering

All messages are automatically moderated for:
- Profanity and inappropriate language
- Harassment and bullying
- Violence and threats
- Self-harm indicators
- Personal information disclosure
- Scams and fraud attempts
- Grooming patterns

**Moderation Categories:**
- `profanity` - Inappropriate language
- `harassment` - Bullying and threats
- `hate_speech` - Discriminatory content
- `violence` - Violent content
- `sexual_content` - Inappropriate sexual content
- `self_harm` - Self-harm indicators
- `personal_info` - Personal data disclosure
- `scam` - Fraud attempts
- `grooming` - Grooming patterns

**Severity Levels:**
- `SAFE` (0) - No issues detected
- `LOW` (1) - Minor issues
- `MEDIUM` (2) - Moderate concerns
- `HIGH` (3) - Serious issues
- `CRITICAL` (4) - Immediate intervention needed

### 3. Message Status

Messages go through different states:
- `pending` - Message is being processed
- `sent` - Message was sent successfully
- `delivered` - Message was delivered to recipient
- `read` - Message was read by recipient
- `failed` - Message failed to send

### 4. WebSocket Events

**Connection Events:**
- `connection:connect` - Client connected
- `connection:disconnect` - Client disconnected
- `connection:authenticate` - Authentication request

**Message Events:**
- `message:send` - Send a message
- `message:receive` - Receive a message
- `message:update` - Message status updated
- `message:delete` - Message deleted

**Activity Events:**
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `message:read` - Message read receipt

**Error Events:**
- `error` - Error occurred

### 5. Security Features

**Authentication:**
- WebSocket connections require authentication token
- Token format: `user_<userId>` (production: use JWT)

**Rate Limiting:**
- Configurable rate limits per user
- Default: 60 messages per minute

**Encryption:**
- Messages can be encrypted before storage
- Basic implementation included (upgrade to AES-256-GCM in production)

**Input Validation:**
- Text length: 1-5000 characters
- XSS prevention through sanitization
- Control character filtering

## API Reference

### tRPC Procedures

#### `messaging.send`
Send a new message.

**Input:**
```typescript
{
  chatId: string;
  text: string;
  senderId: string;
  senderName: string;
  priority?: 'low' | 'normal' | 'high';
  replyToId?: string;
  attachments?: string[];
}
```

**Output:**
```typescript
{
  success: boolean;
  message: Message;
}
```

#### `messaging.getMessages`
Get messages for a chat with pagination.

**Input:**
```typescript
{
  chatId: string;
  limit?: number; // 1-100, default: 50
  offset?: number; // default: 0
  before?: number; // timestamp
  after?: number; // timestamp
}
```

**Output:**
```typescript
{
  messages: Message[];
  hasMore: boolean;
}
```

#### `messaging.getMessage`
Get a single message by ID.

**Input:**
```typescript
{
  messageId: string;
}
```

**Output:**
```typescript
{
  message: Message;
}
```

#### `messaging.delete`
Delete a message (must be sender).

**Input:**
```typescript
{
  messageId: string;
  userId: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

#### `messaging.markAsRead`
Mark messages as read.

**Input:**
```typescript
{
  chatId: string;
  messageId: string;
  userId: string;
  readAt: number;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

#### `messaging.getUnreadCount`
Get unread message count.

**Input:**
```typescript
{
  chatId: string;
  userId: string;
}
```

**Output:**
```typescript
{
  count: number;
}
```

#### `messaging.sendTyping`
Send typing indicator.

**Input:**
```typescript
{
  chatId: string;
  userId: string;
  isTyping: boolean;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

#### `messaging.getStats`
Get message statistics for a chat.

**Input:**
```typescript
{
  chatId: string;
}
```

**Output:**
```typescript
{
  total: number;
  flagged: number;
  approved: number;
}
```

## WebSocket Connection

### Connection

```typescript
// Connect with authentication
const ws = new WebSocket('ws://localhost:3000/api/ws?token=user_123');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};
```

### Sending Messages

```typescript
// Send typing indicator
ws.send(JSON.stringify({
  event: 'typing:start',
  data: { chatId: 'chat_123', userId: 'user_456' },
  timestamp: Date.now(),
}));
```

## Configuration

### Environment Variables

```env
# WebSocket
WS_HEARTBEAT_INTERVAL=60000  # Heartbeat check interval (ms)
WS_TIMEOUT=300000             # Connection timeout (ms)

# Rate Limiting
RATE_LIMIT_WINDOW=60000       # Rate limit window (ms)
RATE_LIMIT_MAX=60             # Max requests per window

# Message Storage
MAX_MESSAGE_LENGTH=5000       # Maximum message length
MESSAGE_HISTORY_LIMIT=1000    # Max messages to keep in memory
```

## Testing

### Unit Tests

Run unit tests:
```bash
bun test backend/messaging
```

### Integration Tests

Test the messaging flow:
```bash
bun test tests/messaging-integration.test.ts
```

## Production Considerations

### 1. WebSocket Implementation
- Use `ws` library or platform-specific WebSocket support
- Implement proper WebSocket upgrade handling
- Add WebSocket clustering for horizontal scaling

### 2. Encryption
- Replace base64 with AES-256-GCM encryption
- Use proper key management (AWS KMS, HashiCorp Vault)
- Implement key rotation

### 3. AI Moderation
- Integrate external AI services (OpenAI Moderation API, Perspective API)
- Add human review queue for flagged content
- Implement appeal mechanism

### 4. Storage
- Replace in-memory storage with database (PostgreSQL, MongoDB)
- Implement message archival
- Add search capabilities

### 5. Monitoring
- Add metrics collection (message count, moderation stats)
- Implement logging aggregation
- Set up alerting for critical issues

### 6. Rate Limiting
- Implement distributed rate limiting (Redis)
- Add per-user quotas
- Implement backoff strategies

## Examples

### Complete Message Flow

```typescript
// 1. Send message via tRPC
const result = await trpc.messaging.send.mutate({
  chatId: 'chat_123',
  text: 'Hello, how are you?',
  senderId: 'user_456',
  senderName: 'Alice',
});

// 2. Message is moderated automatically
// 3. Message is stored
// 4. Message is broadcasted via WebSocket

// 5. Recipient receives via WebSocket
ws.onmessage = (event) => {
  const { event: eventType, data } = JSON.parse(event.data);
  
  if (eventType === 'message:receive') {
    console.log('New message:', data);
    
    // Mark as read
    await trpc.messaging.markAsRead.mutate({
      chatId: data.chatId,
      messageId: data.id,
      userId: 'user_789',
      readAt: Date.now(),
    });
  }
};
```

## Support

For issues or questions:
- Email: support@kiku-app.com
- GitHub Issues: [rork-kiku/issues](https://github.com/tc7kxsszs5-cloud/rork-kiku/issues)

## License

Proprietary - Kids Safety Messenger © 2024
