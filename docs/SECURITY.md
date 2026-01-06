# Security Measures and Best Practices

## Overview

This document outlines the security measures implemented in the Kids Messenger backend and provides guidelines for secure deployment and operation.

## Implemented Security Features

### 1. Content Filtering

**AI-Based Message Analysis**
- Real-time analysis of all text messages
- Pattern-based detection of inappropriate content
- Multi-level risk assessment (safe, low, medium, high, critical)
- Automatic blocking of high-risk content

**Filtering Categories:**
- Bullying and harassment detection
- Profanity filtering
- Violence and threat detection
- Predatory behavior detection
- Personal information exposure prevention
- Inappropriate content filtering

**Message Blocking:**
- Messages with `high` or `critical` risk levels are automatically blocked
- Blocked messages are not delivered to recipients
- Sender receives immediate feedback about why the message was blocked
- All blocked messages are logged for review

### 2. Authentication and Authorization

**Current Implementation:**
- User ID-based authentication for WebSocket connections
- Connection-level authentication required before any operations
- Sender verification for all messages
- Participant authorization for chat access

**Authentication Flow:**
```
1. Client connects to WebSocket
2. Server sends connection acknowledgment
3. Client sends auth message with userId
4. Server validates and associates connection with userId
5. All subsequent messages require authenticated connection
```

### 3. Access Control

**Chat-Level Access Control:**
- Users can only join chats where they are participants
- Users can only view messages from their own chats
- Message sender ID is verified against authenticated user
- Chat history restricted to participants

**Data Isolation:**
- Users only access their own chats via tRPC API
- getUserChats() filters by authenticated user ID
- No cross-user data leakage

### 4. Input Validation

**Zod Schema Validation:**
- All tRPC inputs validated with Zod schemas
- Type-safe API with automatic validation
- Invalid inputs rejected before processing

**Message Validation:**
- Required fields enforced (chatId, text, senderId, senderName)
- Sender ID must match authenticated user
- Chat participants must include sender

### 5. WebSocket Security

**Connection Management:**
- Each connection tracked with WeakMap
- User-to-connection mapping for message routing
- Automatic cleanup on disconnect
- Connection state validation before operations

**Message Validation:**
- JSON parsing with error handling
- Message type validation
- Payload structure validation
- Sender verification

### 6. Logging and Monitoring

**Activity Logging:**
- All connections logged (connect, disconnect, auth)
- All messages logged with analysis results
- Security events logged (blocked messages, unauthorized access)
- Error logging for debugging

**Audit Trail:**
- Message history with risk analysis
- Timestamp for all events
- User actions tracked
- Content filtering decisions recorded

## Security Recommendations for Production

### 1. Authentication Enhancement

**Implement JWT Tokens:**
```typescript
// Add JWT verification
import jwt from 'jsonwebtoken';

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// In WebSocket auth handler
const userId = verifyToken(payload.token);
if (!userId) {
  sendToClient(ws, {
    type: 'auth_failed',
    payload: { message: 'Invalid token' }
  });
  ws.close();
  return;
}
```

**Add Session Management:**
- Implement session tokens with expiration
- Refresh token mechanism
- Session invalidation on logout
- Multi-device session tracking

### 2. Transport Security

**Enable HTTPS/WSS:**
```javascript
import https from 'https';
import fs from 'fs';

const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
}, handler);
```

**TLS Configuration:**
- Use TLS 1.2 or higher
- Strong cipher suites only
- Certificate validation
- HSTS headers

### 3. Rate Limiting

**Implement Rate Limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const messageLimiter = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = messageLimiter.get(userId);
  
  if (!limit || now > limit.resetTime) {
    messageLimiter.set(userId, {
      count: 1,
      resetTime: now + 60000 // 1 minute
    });
    return true;
  }
  
  if (limit.count >= 100) { // 100 messages per minute
    return false;
  }
  
  limit.count++;
  return true;
}
```

**Rate Limits:**
- 100 messages per minute per user
- 1000 WebSocket connections per IP
- API endpoint rate limiting
- Progressive backoff for violations

### 4. Data Encryption

**Encrypt Sensitive Data:**
```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(parts[2], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

**What to Encrypt:**
- Message content at rest
- User personal information
- Authentication tokens
- Session data

### 5. COPPA Compliance

**Children's Online Privacy Protection Act Requirements:**

**Parental Consent:**
```typescript
interface ParentalConsent {
  childUserId: string;
  parentEmail: string;
  parentName: string;
  consentGiven: boolean;
  consentDate: Date;
  verificationMethod: 'email' | 'phone' | 'credit_card';
  verified: boolean;
}

function requireParentalConsent(age: number): boolean {
  return age < 13; // COPPA requirement
}
```

**Data Collection Minimization:**
- Only collect necessary data
- No personal information without consent
- No location data without explicit permission
- No contact list access without consent

**Privacy Controls:**
- Allow parents to review child's messages
- Enable parents to delete child's data
- Provide data export functionality
- Implement account deletion

### 6. Content Moderation

**Enhanced AI Filtering:**
```typescript
// Integrate OpenAI for advanced filtering
import OpenAI from 'openai';

async function analyzeWithOpenAI(text: string): Promise<RiskAnalysis> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a content moderator for a children's messaging app.
        Analyze messages for: bullying, violence, predatory behavior, 
        inappropriate content, and personal information sharing.
        Respond with JSON: {
          riskLevel: "safe" | "low" | "medium" | "high" | "critical",
          reasons: string[],
          confidence: number,
          categories: string[]
        }`
      },
      {
        role: "user",
        content: text
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

**Human Review:**
- Flag medium+ risk messages for review
- Moderator dashboard for reviewing flagged content
- Appeals process for blocked messages
- Regular audit of AI decisions

### 7. Database Security

**When Implementing Persistent Storage:**

**Secure Database Configuration:**
- Use parameterized queries (prevent SQL injection)
- Encrypt database connections
- Implement database user roles
- Regular backups
- Database access logging

**Example with PostgreSQL:**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca-cert.pem')
  }
});

// Use parameterized queries
async function getMessage(messageId: string) {
  const result = await pool.query(
    'SELECT * FROM messages WHERE id = $1',
    [messageId]
  );
  return result.rows[0];
}
```

### 8. API Security

**CORS Configuration:**
```typescript
app.use("*", cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Request Size Limits:**
```typescript
app.use(bodyParser.json({ limit: '1mb' }));
```

**Security Headers:**
```typescript
app.use((c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Strict-Transport-Security', 'max-age=31536000');
  return next();
});
```

### 9. Monitoring and Alerting

**Security Monitoring:**
- Monitor for unusual message patterns
- Track failed authentication attempts
- Alert on high-risk message volume
- Monitor system resource usage

**Alerting System:**
```typescript
interface SecurityAlert {
  type: 'blocked_message' | 'predatory_behavior' | 'mass_reporting';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  details: any;
  timestamp: Date;
}

async function sendSecurityAlert(alert: SecurityAlert) {
  // Send to monitoring system
  // Email administrators for critical alerts
  // Log for audit trail
}
```

### 10. Incident Response

**Incident Response Plan:**

1. **Detection**: Automated alerts for security events
2. **Analysis**: Review logs and determine scope
3. **Containment**: Block malicious users, disable features
4. **Eradication**: Remove malicious content, patch vulnerabilities
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and improve security

## Environment Variables for Production

```bash
# Server
NODE_ENV=production
PORT=3000

# Authentication
JWT_SECRET=<strong-secret-key>
JWT_EXPIRATION=24h
REFRESH_TOKEN_SECRET=<strong-refresh-secret>

# Encryption
ENCRYPTION_KEY=<256-bit-hex-key>

# Database
DB_HOST=<database-host>
DB_NAME=kids_messenger
DB_USER=<db-user>
DB_PASSWORD=<strong-password>
DB_SSL=true

# AI Services
OPENAI_API_KEY=<openai-api-key>

# Rate Limiting
MAX_MESSAGES_PER_MINUTE=100
MAX_CONNECTIONS_PER_IP=1000

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Monitoring
SENTRY_DSN=<sentry-dsn>
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=<session-secret>
```

## Security Checklist for Production

- [ ] Enable HTTPS/WSS with valid certificates
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Encrypt sensitive data at rest
- [ ] Implement database with encryption
- [ ] Add security headers
- [ ] Configure CORS properly
- [ ] Implement parental consent flow
- [ ] Add human content moderation
- [ ] Set up monitoring and alerting
- [ ] Create incident response plan
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] COPPA compliance review
- [ ] Privacy policy and terms of service
- [ ] Data breach notification plan

## Regular Security Maintenance

**Weekly:**
- Review security alerts
- Check for unusual patterns
- Review blocked messages

**Monthly:**
- Update dependencies
- Review access logs
- Test incident response
- Review AI filtering accuracy

**Quarterly:**
- Security audit
- Penetration testing
- COPPA compliance review
- Privacy policy update

**Annually:**
- Full security assessment
- Third-party security audit
- Disaster recovery test
- Update security documentation

## Contact for Security Issues

For security vulnerabilities or concerns:
- Email: security@yourdomain.com
- Use responsible disclosure
- Allow 90 days for remediation
- Do not publicly disclose until fixed

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [COPPA Compliance](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)
- [WebSocket Security](https://owasp.org/www-community/vulnerabilities/WebSocket_Security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
