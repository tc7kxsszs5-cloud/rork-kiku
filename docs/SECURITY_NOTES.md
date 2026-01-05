# Security Implementation Notes

## ⚠️ Important Security Considerations

This document outlines security aspects of the messaging module and production requirements.

## Current Implementation Status

### ✅ Implemented Security Features

1. **Input Validation**
   - Message length limits (1-5000 characters)
   - XSS prevention through sanitization
   - Control character filtering
   - Zod schema validation

2. **Content Moderation**
   - Multi-category toxicity detection
   - Severity level classification
   - Pattern-based filtering
   - Flagging system

3. **WebSocket Authentication**
   - Token-based authentication
   - Connection session management
   - Activity tracking

4. **Access Control**
   - User verification for message deletion
   - Sender identification

### ⚠️ Placeholder Implementations (MUST BE UPGRADED)

1. **Encryption (backend/messaging/encryption.ts)**
   - **Current**: Base64 encoding (NOT encryption)
   - **Status**: ⚠️ DEVELOPMENT ONLY
   - **Required**: AES-256-GCM or ChaCha20-Poly1305
   - **Action**: Replace `MessageEncryption` class with proper encryption
   
   ```typescript
   // Production example using Web Crypto API
   async function encryptMessage(text: string, key: CryptoKey): Promise<string> {
     const encoder = new TextEncoder();
     const data = encoder.encode(text);
     const iv = crypto.getRandomValues(new Uint8Array(12));
     
     const encrypted = await crypto.subtle.encrypt(
       { name: 'AES-GCM', iv },
       key,
       data
     );
     
     return JSON.stringify({
       iv: Array.from(iv),
       data: Array.from(new Uint8Array(encrypted))
     });
   }
   ```

2. **Authentication (constants/EnhancedMessagingContext.tsx)**
   - **Current**: Hardcoded demo token
   - **Status**: ⚠️ DEVELOPMENT ONLY
   - **Required**: JWT or OAuth tokens
   - **Action**: Implement proper authentication flow
   
   ```typescript
   // Production example
   const getUserToken = async () => {
     const session = await getAuthSession();
     return session.accessToken; // JWT
   };
   ```

3. **Message Broadcasting (backend/messaging/service.ts)**
   - **Current**: Broadcasts to all connected users
   - **Status**: ⚠️ PRIVACY CONCERN
   - **Required**: Participant-based routing
   - **Action**: Implement chat participant lookup
   
   ```typescript
   // Production example
   private async broadcastMessage(message: Message): Promise<void> {
     const participants = await chatService.getParticipants(message.chatId);
     wsManager.sendToUsers(participants, WS_EVENTS.MESSAGE_RECEIVE, message);
   }
   ```

4. **WebSocket Upgrade (backend/messaging/websocket-handler.ts)**
   - **Current**: Informational endpoint only
   - **Status**: ⚠️ NOT FUNCTIONAL
   - **Required**: Platform-specific WebSocket implementation
   - **Action**: See platform-specific guides below

## Production Requirements

### 1. Encryption System

**Required Changes:**
- Implement proper key management system
- Use established encryption libraries
- Implement key rotation
- Add encrypted field markers in database

**Recommended Libraries:**
- `crypto.subtle` (Web Crypto API)
- `libsodium-wrappers` (NaCl)
- `node-forge` (Node.js)

### 2. WebSocket Implementation

**Platform-Specific Solutions:**

#### Node.js
```typescript
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  // Authenticate
  const token = new URL(req.url, 'http://localhost').searchParams.get('token');
  const auth = authenticateWebSocket(token);
  
  if (!auth) {
    ws.close(1008, 'Unauthorized');
    return;
  }
  
  const connectionId = initWebSocketConnection(
    auth.userId,
    (data) => ws.send(data),
    () => ws.close()
  );
  
  ws.on('message', (data) => {
    const handler = createWebSocketHandler(auth.userId, connectionId);
    handler.onMessage(data.toString());
  });
});
```

#### Bun
```typescript
Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // WebSocket upgrade
    }
    return app.fetch(req);
  },
  websocket: {
    message(ws, message) {
      // Handle message
    },
    open(ws) {
      // Handle connection
    },
    close(ws) {
      // Handle disconnect
    },
  },
});
```

#### Cloudflare Workers
```typescript
export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      const durableObjectId = env.CHAT_ROOM.idFromName('main');
      const durableObject = env.CHAT_ROOM.get(durableObjectId);
      return durableObject.fetch(request);
    }
    return app.fetch(request);
  }
};
```

### 3. Database Integration

**Replace In-Memory Storage:**

```typescript
// Example with PostgreSQL
import { Pool } from 'pg';

export class MessageStorageService {
  private pool: Pool;
  
  async saveMessage(message: Message): Promise<Message> {
    const query = `
      INSERT INTO messages (id, chat_id, sender_id, text, timestamp, encrypted)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      message.id,
      message.chatId,
      message.senderId,
      message.text,
      message.timestamp,
      message.encrypted,
    ]);
    
    return result.rows[0];
  }
}
```

### 4. AI Moderation Service

**Integrate External APIs:**

```typescript
// Example with OpenAI Moderation API
import OpenAI from 'openai';

export class ContentModerationService {
  private openai: OpenAI;
  
  async moderateMessage(text: string): Promise<ModerationResult> {
    const response = await this.openai.moderations.create({
      input: text,
    });
    
    const result = response.results[0];
    
    return {
      isApproved: !result.flagged,
      flags: result.categories
        .filter((cat) => result.category_scores[cat] > 0.5)
        .map((cat) => cat),
      reasons: result.categories
        .filter((cat) => result.category_scores[cat] > 0.5)
        .map((cat) => `${cat} detected`),
      confidence: Math.max(...Object.values(result.category_scores)),
      categories: Object.keys(result.categories),
    };
  }
}
```

### 5. Rate Limiting

**Implement Distributed Rate Limiting:**

```typescript
// Example with Redis
import { Redis } from 'ioredis';

export class RateLimiter {
  private redis: Redis;
  
  async checkRateLimit(userId: string): Promise<boolean> {
    const key = `rate_limit:${userId}`;
    const count = await this.redis.incr(key);
    
    if (count === 1) {
      await this.redis.expire(key, 60); // 60 second window
    }
    
    return count <= 60; // Max 60 messages per minute
  }
}
```

## Security Checklist

Before deploying to production, ensure:

- [ ] Replace base64 encoding with proper encryption (AES-256-GCM)
- [ ] Implement secure key management
- [ ] Set up JWT or OAuth authentication
- [ ] Implement proper WebSocket upgrade handling
- [ ] Add participant-based message routing
- [ ] Integrate database for message persistence
- [ ] Add external AI moderation service
- [ ] Implement distributed rate limiting
- [ ] Set up HTTPS/WSS (TLS encryption)
- [ ] Add request signing/verification
- [ ] Implement audit logging
- [ ] Set up intrusion detection
- [ ] Add DDoS protection
- [ ] Implement backup and recovery
- [ ] Set up monitoring and alerting
- [ ] Conduct security audit
- [ ] Perform penetration testing
- [ ] Review compliance requirements (COPPA, GDPR-K)

## Environment Variables

Required production environment variables:

```env
# Encryption
ENCRYPTION_KEY_ID=key_prod_123
ENCRYPTION_ALGORITHM=AES-256-GCM

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=3600

# WebSocket
WS_URL=wss://api.yourdomain.com/ws
WS_HEARTBEAT_INTERVAL=30000
WS_TIMEOUT=300000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379

# AI Moderation
OPENAI_API_KEY=sk-...
PERSPECTIVE_API_KEY=...

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info
```

## Compliance

### COPPA (Children's Online Privacy Protection Act)
- Obtain verifiable parental consent
- Provide clear privacy policy
- Implement data minimization
- Allow data deletion requests

### GDPR-K (for children)
- Same as COPPA plus:
- Right to be forgotten
- Data portability
- Privacy by design
- Regular data protection assessments

## Incident Response

In case of security incident:

1. **Immediate**: Disconnect affected services
2. **Assess**: Determine scope and impact
3. **Contain**: Isolate affected systems
4. **Notify**: Inform users and authorities if required
5. **Recover**: Restore from secure backups
6. **Review**: Conduct post-mortem analysis
7. **Improve**: Update security measures

## Support

For security concerns:
- Email: security@kiku-app.com
- Report vulnerabilities: security@kiku-app.com (PGP key available)
- Emergency hotline: [to be configured]

## License

Proprietary - Kids Safety Messenger © 2024
