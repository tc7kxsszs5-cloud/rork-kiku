# Kids Messenger Backend

Real-time messaging backend with AI-powered content filtering for child safety.

## Features

✅ **Real-time WebSocket Communication**
- Instant message delivery
- Connection management
- Multi-device support
- Typing indicators

✅ **AI-Based Content Filtering**
- Pattern matching for inappropriate content
- Risk level assessment (safe, low, medium, high, critical)
- Automatic message blocking for high-risk content
- Detailed reason reporting

✅ **Secure Message Storage**
- In-memory message history
- Chat room management
- User isolation and privacy
- Message analysis tracking

✅ **Type-Safe APIs**
- tRPC for full type safety
- Zod schema validation
- Automatic type generation

✅ **Comprehensive Documentation**
- API documentation
- Architecture overview
- Integration examples

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Or with bun
bun install
```

### Running the Server

```bash
# Start the server
npm run start:backend

# Or with ts-node
npx ts-node backend/server.ts
```

The server will start on `http://localhost:3000` with:
- HTTP API: `http://localhost:3000`
- WebSocket: `ws://localhost:3000/ws`
- tRPC: `http://localhost:3000/api/trpc`

## Architecture

```
backend/
├── services/
│   ├── message-store.ts       # Message and chat storage
│   ├── content-filter.ts      # AI content filtering
│   └── websocket-server.ts    # WebSocket management
├── trpc/
│   ├── app-router.ts          # Main tRPC router
│   ├── create-context.ts      # tRPC context
│   └── routes/
│       └── chat/              # Chat-related routes
├── tests/                     # Unit and integration tests
├── hono.ts                    # HTTP server setup
└── server.ts                  # Entry point
```

## API Documentation

### WebSocket API

#### Connect and Authenticate

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    payload: { userId: 'user123' }
  }));
};
```

#### Join a Chat

```javascript
ws.send(JSON.stringify({
  type: 'join_chat',
  payload: {
    chatId: 'chat123',
    participants: ['user123', 'user456'],
    participantNames: ['Alice', 'Bob']
  }
}));
```

#### Send a Message

```javascript
ws.send(JSON.stringify({
  type: 'message',
  payload: {
    chatId: 'chat123',
    text: 'Hello!',
    senderId: 'user123',
    senderName: 'Alice'
  }
}));
```

#### Receive Messages

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch(message.type) {
    case 'new_message':
      console.log('New message:', message.payload);
      break;
    case 'message_blocked':
      console.log('Message blocked:', message.payload.reasons);
      break;
    case 'message_warning':
      console.log('Warning:', message.payload.reasons);
      break;
  }
};
```

### tRPC API

#### Get User Chats

```typescript
const chats = await trpc.chat.getUserChats.query({ 
  userId: 'user123' 
});
```

#### Get Chat Messages

```typescript
const messages = await trpc.chat.getChatMessages.query({
  chatId: 'chat123',
  limit: 50
});
```

#### Create Chat

```typescript
const chat = await trpc.chat.createChat.mutate({
  chatId: 'chat123',
  participants: ['user1', 'user2'],
  participantNames: ['Alice', 'Bob'],
  isGroup: false
});
```

#### Analyze Content

```typescript
const analysis = await trpc.chat.analyzeContent.mutate({
  text: 'Test message'
});
```

## Content Filtering

The content filter analyzes messages for:

### Risk Categories

1. **Bullying and Harassment**
   - Insulting language, threats, aggressive behavior

2. **Profanity**
   - Inappropriate language and explicit terms

3. **Violence and Threats**
   - Mentions of weapons, violent intentions

4. **Predatory Behavior**
   - Requests for personal info, suspicious meetings

5. **Personal Information**
   - Phone numbers, addresses, emails

6. **Inappropriate Content**
   - Romantic advances, adult content

### Risk Levels

- **safe**: No issues detected - message delivered normally
- **low**: Minor concerns - message delivered with note
- **medium**: Moderate concerns - message delivered, parents notified
- **high**: Serious concerns - **message blocked**
- **critical**: Severe threats - **message blocked**, immediate alert

### Automatic Actions

- Messages with `high` or `critical` risk are automatically blocked
- Medium+ risk messages trigger parental notifications (to be implemented)
- All messages are logged with analysis results

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- content-filter.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage

- ✅ Content filter unit tests
- ✅ Message store unit tests
- ✅ WebSocket integration tests
- ✅ End-to-end message flow tests

## Security

### Current Security Measures

1. **Authentication**: User ID-based authentication (JWT recommended for production)
2. **Authorization**: Users can only access their own chats
3. **Content Filtering**: Real-time analysis of all messages
4. **Message Blocking**: Automatic blocking of high-risk content
5. **Audit Trail**: All messages and actions logged

### Production Recommendations

- [ ] Implement JWT authentication
- [ ] Enable HTTPS/WSS (TLS encryption)
- [ ] Add rate limiting
- [ ] Implement message encryption at rest
- [ ] Add COPPA compliance features
- [ ] Implement parental consent mechanisms
- [ ] Add IP-based blocking
- [ ] Implement session management

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000                          # Server port (default: 3000)
NODE_ENV=production               # Environment (development/production)

# AI Configuration (Optional)
OPENAI_API_KEY=sk-...            # OpenAI API key for advanced filtering

# WebSocket Configuration
WS_MAX_CONNECTIONS=10000         # Maximum WebSocket connections
WS_PING_INTERVAL=30000           # WebSocket ping interval (ms)

# Message Configuration
MESSAGE_MAX_LENGTH=10000         # Maximum message length
MESSAGE_HISTORY_LIMIT=1000       # Maximum messages to store per chat

# Security
ENABLE_CORS=true                 # Enable CORS
CORS_ORIGIN=*                    # CORS origin

# Logging
LOG_LEVEL=info                   # Logging level (debug/info/warn/error)
```

## Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/backend/server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

### Process Management (PM2)

```bash
# Start with PM2
pm2 start backend/server.ts --name kids-messenger

# Monitor
pm2 monit

# Logs
pm2 logs kids-messenger

# Restart
pm2 restart kids-messenger
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/
# Response: {"status":"ok","message":"API is running"}
```

### Active Connections

Currently active WebSocket connections can be monitored through logs.

## Scaling

### Current Implementation

- In-memory storage (single server)
- WebSocket connections on single server
- Good for: Development, testing, small deployments

### Production Scaling

For production, consider:

1. **Database Layer**
   - PostgreSQL for relational data
   - Redis for caching and WebSocket state
   - MongoDB for flexible storage

2. **Message Queue**
   - RabbitMQ or Kafka for async processing
   - Redis Pub/Sub for real-time events

3. **Load Balancing**
   - nginx or HAProxy for HTTP load balancing
   - Sticky sessions for WebSocket
   - Redis for shared session state

4. **Horizontal Scaling**
   - Multiple backend instances
   - Shared Redis for WebSocket state
   - Database connection pooling

## Troubleshooting

### WebSocket Connection Issues

```bash
# Check if server is running
curl http://localhost:3000/

# Test WebSocket connection
wscat -c ws://localhost:3000/ws
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Memory Issues

The in-memory storage will grow over time. For production:
- Implement database storage
- Add message expiration
- Implement pagination
- Add memory limits

## Documentation

- [API Documentation](../docs/API_DOCUMENTATION.md) - Complete API reference
- [Architecture](../docs/ARCHITECTURE.md) - System architecture and design
- [Main README](../README.md) - Project overview

## Contributing

When contributing:

1. Follow TypeScript strict mode
2. Add tests for new features
3. Update documentation
4. Use existing code patterns
5. Consider security implications

## License

See the main project LICENSE file.

## Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a development version using in-memory storage. For production deployment, implement persistent database storage and additional security measures.
