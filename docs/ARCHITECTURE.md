# Kids Messenger Backend Architecture

## System Overview

The Kids Messenger backend is a real-time messaging system designed with child safety as the primary concern. It combines WebSocket-based real-time communication with AI-powered content filtering to create a safe digital environment for children.

## Technology Stack

### Core Technologies

- **Runtime**: Node.js
- **Web Framework**: Hono (lightweight, fast HTTP framework)
- **Real-time Communication**: ws (WebSocket library)
- **API Layer**: tRPC (type-safe RPC framework)
- **Language**: TypeScript
- **Package Manager**: npm/bun

### Dependencies

- `hono`: ^4.10.6 - Web framework
- `@hono/node-server`: ^1.13.7 - Node.js server adapter
- `@hono/trpc-server`: ^0.4.0 - tRPC integration
- `@trpc/server`: ^11.7.2 - tRPC server
- `ws`: ^8.18.0 - WebSocket implementation
- `openai`: ^4.77.0 - AI integration (optional)
- `zod`: ^4.1.13 - Schema validation
- `superjson`: ^2.2.5 - JSON serialization

## Architecture Components

```
┌─────────────────────────────────────────────────────────┐
│                    Client Applications                   │
│          (React Native, Web Browser, etc.)              │
└────────────────┬────────────────┬───────────────────────┘
                 │                │
        WebSocket│                │HTTP/tRPC
                 │                │
┌────────────────┴────────────────┴───────────────────────┐
│                    Hono HTTP Server                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │              WebSocket Server                     │   │
│  │  - Connection Management                         │   │
│  │  - Message Routing                               │   │
│  │  - Real-time Broadcasting                        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              tRPC API Layer                      │   │
│  │  - Type-safe Endpoints                           │   │
│  │  - Request Validation                            │   │
│  │  - Response Serialization                        │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────┬────────────────┬───────────────────────┘
                 │                │
    ┌────────────┴───┐   ┌───────┴────────┐
    │  Content       │   │    Message      │
    │  Filter        │   │    Store        │
    │  Service       │   │    Service      │
    └────────────────┘   └────────────────┘
            │                    │
    ┌───────┴────────┐   ┌──────┴────────┐
    │  AI Analysis   │   │   In-Memory   │
    │  (Patterns)    │   │   Storage     │
    └────────────────┘   └───────────────┘
```

## Core Services

### 1. WebSocket Server (`services/websocket-server.ts`)

**Responsibilities:**
- Manage WebSocket connections
- Handle user authentication
- Route messages to appropriate handlers
- Broadcast messages to chat participants
- Maintain connection state

**Key Features:**
- Connection pooling by user ID
- Multi-device support (one user, multiple connections)
- Automatic reconnection handling
- Message type routing
- Real-time broadcasting

**Message Flow:**
```
Client connects → Authentication → Join chat → Send message → 
Content filtering → Broadcast to participants → Store message
```

### 2. Content Filter Service (`services/content-filter.ts`)

**Responsibilities:**
- Analyze message content for safety risks
- Detect inappropriate patterns
- Calculate risk levels
- Provide content sanitization
- Generate risk reports

**Filtering Categories:**
1. Bullying and harassment
2. Profanity and explicit content
3. Violence and threats
4. Predatory behavior
5. Personal information exposure
6. Inappropriate requests

**Risk Assessment Algorithm:**
```
1. Scan text against pattern database
2. Identify matching categories
3. Calculate risk score
4. Determine risk level (safe → critical)
5. Generate detailed reasons
6. Return analysis with confidence score
```

**Extensibility:**
- Rule-based patterns (current implementation)
- OpenAI GPT integration (optional, for advanced analysis)
- Custom ML model integration support
- TensorFlow.js integration support

### 3. Message Store Service (`services/message-store.ts`)

**Responsibilities:**
- Store and retrieve messages
- Manage chat rooms
- Update message analysis results
- Query message history
- Maintain data relationships

**Data Structures:**
- `chats: Map<chatId, Chat>` - Chat metadata and participants
- `messages: Map<messageId, Message>` - Individual messages

**Operations:**
- `upsertChat()` - Create or update chat
- `storeMessage()` - Save new message
- `updateMessageAnalysis()` - Add AI analysis results
- `getChatMessages()` - Retrieve chat history
- `getUserChats()` - Get user's chats
- `deleteMessage()` - Remove message

### 4. tRPC API Layer (`trpc/`)

**Responsibilities:**
- Provide REST-like endpoints
- Handle HTTP requests
- Validate input schemas
- Serialize responses
- Type-safe client-server communication

**Available Procedures:**
- `chat.getUserChats` - Get user's chat list
- `chat.getChatMessages` - Get message history
- `chat.createChat` - Create new chat room
- `chat.analyzeContent` - Test content filtering

## Security Architecture

### Authentication Flow

```
1. Client connects to WebSocket
2. Server sends connection acknowledgment
3. Client sends auth message with userId (and optional token)
4. Server validates credentials
5. Server associates connection with userId
6. Server sends auth success
7. Client can now send messages
```

### Authorization Layers

1. **Connection Level**: Must authenticate before any operations
2. **Chat Level**: Can only join chats as a participant
3. **Message Level**: Can only send messages as authenticated user

### Content Security

1. **Input Validation**: Zod schemas validate all inputs
2. **Pattern Matching**: Regex-based detection of inappropriate content
3. **Risk Scoring**: Multi-level risk assessment
4. **Automatic Blocking**: High-risk content never delivered
5. **Audit Trail**: All messages logged with analysis results

### Privacy Protection

1. **Data Isolation**: Users only access their own chats
2. **Participant Verification**: Chat access restricted to members
3. **No Cross-Contamination**: Messages never sent to wrong recipients
4. **Minimal Data Exposure**: Only necessary fields returned

## Data Flow

### Message Send Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. Send message
     ▼
┌─────────────────┐
│   WebSocket     │
│    Handler      │
└────┬────────────┘
     │ 2. Validate sender
     ▼
┌─────────────────┐
│ Content Filter  │◄── Pattern Database
└────┬────────────┘
     │ 3. Analyze content
     ▼
┌─────────────────┐
│ Risk Assessment │
└────┬────────────┘
     │ 4. Check risk level
     ├─ High/Critical → Block message
     │                  ↓
     │            Send block notification
     │
     └─ Safe/Low/Medium
            │
            ▼
     ┌──────────────┐
     │ Message Store│
     └──────┬───────┘
            │ 5. Save message
            ▼
     ┌──────────────┐
     │  Broadcast   │
     └──────┬───────┘
            │ 6. Send to participants
            ▼
     ┌──────────────┐
     │   Clients    │
     └──────────────┘
```

### Message Receive Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. Request history
     ▼
┌─────────────────┐
│   tRPC API      │
└────┬────────────┘
     │ 2. Validate access
     ▼
┌─────────────────┐
│ Message Store   │
└────┬────────────┘
     │ 3. Fetch messages
     ▼
┌─────────────────┐
│ Filter results  │
└────┬────────────┘
     │ 4. Return to client
     ▼
┌─────────────────┐
│    Response     │
└─────────────────┘
```

## Scalability Considerations

### Current Implementation (In-Memory)

**Advantages:**
- Fast access
- Simple implementation
- No database setup required
- Good for development/testing

**Limitations:**
- Data lost on restart
- Limited to single server
- Memory constraints
- No persistence

### Production Recommendations

**1. Database Integration**
```typescript
// Replace Map-based storage with:
- PostgreSQL (relational data, ACID compliance)
- MongoDB (flexible document storage)
- Redis (caching, session management)
```

**2. Message Queue**
```typescript
// Add message queue for async processing:
- RabbitMQ (reliable message delivery)
- Apache Kafka (high-throughput streaming)
- Redis Pub/Sub (simple pub/sub)
```

**3. Horizontal Scaling**
```typescript
// Enable multi-server deployment:
- Redis for shared WebSocket state
- Sticky sessions or connection registry
- Load balancer (nginx, HAProxy)
```

**4. Caching Layer**
```typescript
// Add caching for performance:
- Redis for message caching
- CDN for static assets
- Application-level caching
```

## Performance Optimization

### Current Performance Profile

- **WebSocket Latency**: < 50ms (local)
- **Message Filtering**: < 10ms (pattern matching)
- **Message Storage**: < 5ms (in-memory)
- **Broadcast**: O(n) where n = participants

### Optimization Strategies

1. **Message Batching**: Group broadcasts for efficiency
2. **Lazy Loading**: Paginate message history
3. **Connection Pooling**: Reuse database connections
4. **Caching**: Cache frequently accessed data
5. **Compression**: Enable WebSocket compression
6. **Indexing**: Index messages by chatId, timestamp

## Monitoring and Observability

### Logging

All critical events are logged:
- Connection events (connect, disconnect, auth)
- Message events (send, receive, block)
- Error events (parsing, validation, system)
- Security events (unauthorized access, suspicious activity)

### Metrics to Track

1. **Connection Metrics**
   - Active connections
   - Connection duration
   - Authentication failures

2. **Message Metrics**
   - Messages per second
   - Message filtering latency
   - Blocked message count
   - Risk level distribution

3. **System Metrics**
   - CPU usage
   - Memory usage
   - Network I/O
   - Error rate

### Health Checks

Implement endpoints for:
- `/health` - Basic health check
- `/health/detailed` - Component status
- `/metrics` - Prometheus-compatible metrics

## Testing Strategy

### Unit Tests

- Content filter pattern matching
- Risk level calculation
- Message storage operations
- Utility functions

### Integration Tests

- WebSocket connection flow
- Message send/receive flow
- Chat creation and management
- Content filtering integration

### End-to-End Tests

- Complete user journey
- Multi-user scenarios
- Error handling
- Edge cases

See test files for implementation examples.

## Deployment

### Environment Variables

```bash
PORT=3000                          # Server port
NODE_ENV=production               # Environment
OPENAI_API_KEY=sk-...            # Optional: OpenAI API key
WS_MAX_CONNECTIONS=10000         # Max WebSocket connections
MESSAGE_MAX_LENGTH=10000         # Max message length
ENABLE_CORS=true                 # Enable CORS
LOG_LEVEL=info                   # Logging level
```

### Docker Deployment

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

### Process Management

Recommended: PM2 for process management

```bash
pm2 start backend/server.ts --name kids-messenger-backend
```

## Future Enhancements

### Phase 1: Core Improvements
- [ ] Persistent database storage
- [ ] JWT authentication
- [ ] HTTPS/WSS encryption
- [ ] Rate limiting
- [ ] API documentation generation

### Phase 2: Advanced Features
- [ ] Image content analysis
- [ ] Voice message filtering
- [ ] Video chat moderation
- [ ] AI-powered conversation context analysis
- [ ] Multi-language support

### Phase 3: Compliance & Safety
- [ ] COPPA compliance
- [ ] GDPR compliance
- [ ] Parental control dashboard
- [ ] Automated reporting system
- [ ] Age verification

### Phase 4: Scale & Performance
- [ ] Redis integration
- [ ] Horizontal scaling support
- [ ] CDN integration
- [ ] Advanced caching
- [ ] Load balancing

## Contributing

When contributing to the backend:

1. Follow TypeScript strict mode
2. Add tests for new features
3. Update documentation
4. Use existing patterns (service layer, tRPC procedures)
5. Ensure security considerations
6. Test with multiple clients

## References

- [Hono Documentation](https://hono.dev/)
- [tRPC Documentation](https://trpc.io/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [COPPA Compliance](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)
