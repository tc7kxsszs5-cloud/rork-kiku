# Kids Messenger Backend API Documentation

## Overview

The Kids Messenger backend provides a secure, real-time messaging platform specifically designed for children's safety. It features AI-based content filtering, secure WebSocket communication, and comprehensive message history storage.

## Architecture

- **HTTP Server**: Hono web framework
- **Real-time Communication**: WebSocket (ws library)
- **API Layer**: tRPC for type-safe APIs
- **Content Filtering**: AI-based pattern matching and optional OpenAI integration
- **Storage**: In-memory storage (can be extended to database)

## Base URLs

- **HTTP API**: `http://localhost:3000`
- **WebSocket**: `ws://localhost:3000/ws`
- **tRPC Endpoint**: `http://localhost:3000/api/trpc`

## Authentication

Currently, the system uses a simple user ID-based authentication. In production, implement proper JWT or OAuth tokens.

### WebSocket Authentication

After connecting to the WebSocket, send an authentication message:

```json
{
  "type": "auth",
  "payload": {
    "userId": "user123",
    "token": "optional-jwt-token"
  }
}
```

## WebSocket API

### Connection

Connect to `ws://localhost:3000/ws`

### Message Types

#### 1. Authentication (`auth`)

**Client → Server**
```json
{
  "type": "auth",
  "payload": {
    "userId": "string",
    "token": "string (optional)"
  }
}
```

**Server → Client (Success)**
```json
{
  "type": "auth_success",
  "payload": {
    "userId": "string",
    "timestamp": 1234567890
  }
}
```

#### 2. Join Chat (`join_chat`)

**Client → Server**
```json
{
  "type": "join_chat",
  "payload": {
    "chatId": "string",
    "participants": ["userId1", "userId2"],
    "participantNames": ["Name1", "Name2"]
  }
}
```

**Server → Client (Success)**
```json
{
  "type": "chat_joined",
  "payload": {
    "chatId": "string",
    "timestamp": 1234567890
  }
}
```

#### 3. Send Message (`message`)

**Client → Server**
```json
{
  "type": "message",
  "payload": {
    "chatId": "string",
    "text": "message content",
    "senderId": "userId",
    "senderName": "User Name",
    "imageUri": "optional-image-url"
  }
}
```

**Server → All Chat Participants**
```json
{
  "type": "new_message",
  "payload": {
    "id": "msg_123",
    "text": "message content",
    "senderId": "userId",
    "senderName": "User Name",
    "timestamp": 1234567890,
    "analyzed": true,
    "riskLevel": "safe",
    "riskReasons": ["Content is safe"]
  }
}
```

**Server → Sender (If Risky Content Detected)**
```json
{
  "type": "message_warning",
  "payload": {
    "messageId": "msg_123",
    "riskLevel": "medium",
    "reasons": ["Detected profanity: 'word'"]
  }
}
```

**Server → Sender (If Blocked)**
```json
{
  "type": "message_blocked",
  "payload": {
    "messageId": "msg_123",
    "riskLevel": "critical",
    "reasons": ["Detected predatory behavior"],
    "timestamp": 1234567890
  }
}
```

#### 4. Typing Indicator (`typing`)

**Client → Server**
```json
{
  "type": "typing",
  "payload": {
    "chatId": "string",
    "isTyping": true
  }
}
```

**Server → Other Participants**
```json
{
  "type": "typing",
  "payload": {
    "chatId": "string",
    "userId": "userId",
    "isTyping": true,
    "timestamp": 1234567890
  }
}
```

#### 5. Get Messages (`get_messages`)

**Client → Server**
```json
{
  "type": "get_messages",
  "payload": {
    "chatId": "string",
    "limit": 50
  }
}
```

**Server → Client**
```json
{
  "type": "messages_history",
  "payload": {
    "chatId": "string",
    "messages": [...],
    "timestamp": 1234567890
  }
}
```

#### 6. Leave Chat (`leave_chat`)

**Client → Server**
```json
{
  "type": "leave_chat",
  "payload": {
    "chatId": "string"
  }
}
```

## tRPC API

### Chat Endpoints

#### `chat.getUserChats`

Get all chats for a specific user.

**Input:**
```typescript
{
  userId: string;
}
```

**Output:**
```typescript
{
  chats: Chat[];
  timestamp: number;
}
```

#### `chat.getChatMessages`

Get message history for a specific chat.

**Input:**
```typescript
{
  chatId: string;
  limit?: number;
}
```

**Output:**
```typescript
{
  chatId: string;
  messages: Message[];
  timestamp: number;
}
```

#### `chat.createChat`

Create a new chat room.

**Input:**
```typescript
{
  chatId: string;
  participants: string[];
  participantNames: string[];
  isGroup?: boolean;
  groupName?: string;
  groupType?: 'class' | 'group' | 'club';
  groupDescription?: string;
  adminIds?: string[];
}
```

**Output:**
```typescript
{
  chat: Chat;
  timestamp: number;
}
```

#### `chat.analyzeContent`

Analyze text content for safety (testing purposes).

**Input:**
```typescript
{
  text: string;
}
```

**Output:**
```typescript
{
  analysis: {
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    reasons: string[];
    confidence: number;
    categories: string[];
  };
  timestamp: number;
}
```

## Content Filtering

### AI-Based Filtering

The content filtering system analyzes messages for:

1. **Bullying and Harassment**
   - Insulting language
   - Threats
   - Aggressive behavior

2. **Profanity and Explicit Content**
   - Inappropriate language
   - Explicit terms

3. **Violence and Threats**
   - Mentions of weapons
   - Violent intentions
   - Physical harm

4. **Predatory Behavior**
   - Requests for personal information
   - Suspicious meeting requests
   - Inappropriate relationship attempts

5. **Personal Information**
   - Phone numbers
   - Physical addresses
   - Email addresses

6. **Inappropriate Content**
   - Romantic advances
   - Adult content references

### Risk Levels

- **safe**: No issues detected
- **low**: Minor concerns, message delivered with warning
- **medium**: Moderate concerns, message delivered but parents notified
- **high**: Serious concerns, message blocked
- **critical**: Severe threats or predatory behavior, message blocked and immediate alert

### Message Blocking

Messages with `high` or `critical` risk levels are automatically blocked and not delivered to recipients.

## Security Measures

### 1. WebSocket Security

- **Connection Validation**: All connections must authenticate before sending messages
- **Message Verification**: Sender ID is verified against authenticated user
- **Participant Authorization**: Users can only join chats they're part of

### 2. Content Filtering

- **Real-time Analysis**: Every message is analyzed before delivery
- **Automatic Blocking**: High-risk content is blocked automatically
- **Parental Notifications**: Medium+ risk content triggers parent alerts (to be implemented)

### 3. Privacy Controls

- **User Isolation**: Users only see their own chats
- **Message History**: Access restricted to chat participants
- **Data Minimization**: Only necessary data is stored

### 4. Future Enhancements

- Implement HTTPS/WSS (TLS encryption)
- Add JWT-based authentication
- Implement rate limiting
- Add message encryption at rest
- Add COPPA compliance features
- Implement parental consent mechanisms

## Data Models

### Message

```typescript
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  riskLevel?: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  riskReasons?: string[];
  analyzed: boolean;
  imageUri?: string;
  imageAnalyzed?: boolean;
  imageBlocked?: boolean;
  imageRiskReasons?: string[];
}
```

### Chat

```typescript
interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  messages: Message[];
  overallRisk: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  lastActivity: number;
  isGroup?: boolean;
  groupName?: string;
  groupType?: 'class' | 'group' | 'club';
  groupDescription?: string;
  adminIds?: string[];
}
```

### RiskAnalysis

```typescript
interface RiskAnalysis {
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  confidence: number;
  categories: string[];
}
```

## Error Handling

### WebSocket Errors

**Error Response Format:**
```json
{
  "type": "error",
  "payload": {
    "message": "Error description",
    "error": "Detailed error message"
  }
}
```

### Common Errors

- **Not authenticated**: User must send `auth` message first
- **Not authorized**: User not a participant in the requested chat
- **Invalid message format**: JSON parsing failed or missing required fields
- **Sender ID mismatch**: senderId doesn't match authenticated user

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 messages per minute per user
- 1000 WebSocket connections per IP
- 10 MB maximum message size

## Monitoring and Logging

All messages are logged with:
- Timestamp
- User ID
- Risk analysis results
- Message content (encrypted in production)

High-risk activities trigger:
- Admin alerts
- Parental notifications
- Compliance logs

## Testing

See the test files in `/backend/tests/` for examples of:
- WebSocket connection testing
- Message filtering validation
- API endpoint testing

## Example Client Code

### JavaScript WebSocket Client

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// Authenticate
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    payload: { userId: 'user123' }
  }));
};

// Handle messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

// Join a chat
function joinChat(chatId) {
  ws.send(JSON.stringify({
    type: 'join_chat',
    payload: {
      chatId,
      participants: ['user123', 'user456'],
      participantNames: ['Alice', 'Bob']
    }
  }));
}

// Send a message
function sendMessage(chatId, text) {
  ws.send(JSON.stringify({
    type: 'message',
    payload: {
      chatId,
      text,
      senderId: 'user123',
      senderName: 'Alice'
    }
  }));
}
```

## Support

For issues or questions, please contact the development team or file an issue in the repository.
