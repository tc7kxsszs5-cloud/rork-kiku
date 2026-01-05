# Архитектура безопасности Rork-Kiku

## Обзор безопасности

Безопасность - критический приоритет для Rork-Kiku. Мы используем defense-in-depth подход с множественными уровнями защиты.

## Модель угроз (Threat Model)

### Threat Actors (Злоумышленники)

1. **Внешние хакеры**
   - Цель: Доступ к данным детей
   - Вектор: Network attacks, API exploits
   - Risk: High

2. **Вредоносные пользователи**
   - Цель: Abuse системы, обход модерации
   - Вектор: Social engineering, adversarial AI
   - Risk: Medium

3. **Инсайдеры**
   - Цель: Кража данных
   - Вектор: Privileged access abuse
   - Risk: Low (local-first architecture)

4. **Государственные структуры**
   - Цель: Surveillance, data requests
   - Вектор: Legal requests, backdoors
   - Risk: Low (прозрачная политика)

### Assets (Защищаемые активы)

1. **Критические**
   - Сообщения детей (текст, изображения, аудио)
   - Геолокация (SOS alerts)
   - Родительские email
   - AI модели и результаты анализа

2. **Важные**
   - User credentials
   - Настройки безопасности
   - Compliance logs
   - Статистика использования

3. **Публичные**
   - Privacy Policy
   - Terms of Service
   - Публичная документация

### Threats (Угрозы)

1. **Confidentiality Threats**
   - Data breach (утечка данных)
   - Unauthorized access (несанкционированный доступ)
   - Data exfiltration (кража данных)
   - Eavesdropping (перехват трафика)

2. **Integrity Threats**
   - Data tampering (изменение данных)
   - AI poisoning (отравление AI модели)
   - Code injection (SQL/XSS)
   - Man-in-the-Middle (MITM)

3. **Availability Threats**
   - DDoS attacks
   - Resource exhaustion
   - Service disruption
   - Data loss/corruption

---

## Архитектура безопасности

### Defense Layers (Уровни защиты)

```
┌─────────────────────────────────────────┐
│         User Interface (L1)             │
│  - Input validation                     │
│  - XSS prevention                       │
│  - CSRF protection                      │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│       Application Logic (L2)            │
│  - Authentication                       │
│  - Authorization                        │
│  - Business rules enforcement           │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         Data Layer (L3)                 │
│  - Encryption at rest                   │
│  - Access control                       │
│  - Audit logging                        │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│      Network Layer (L4)                 │
│  - TLS/HTTPS                            │
│  - Certificate pinning                  │
│  - Firewall rules                       │
└─────────────────────────────────────────┘
```

---

## Безопасность данных

### 1. Data at Rest (Хранение)

#### Local Storage (AsyncStorage)
**Защита**:
- Device encryption (iOS/Android native)
- Sandbox isolation
- Secure file permissions

**Implementation**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveSecureData = async (key: string, value: any) => {
  try {
    // AsyncStorage автоматически использует device encryption
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data', error);
    throw new SecurityError('Data storage failed');
  }
};
```

#### Sensitive Data (expo-secure-store)
**Для**:
- User credentials
- Guardian emails
- API keys
- Encryption keys

**Implementation**:
```typescript
import * as SecureStore from 'expo-secure-store';

const saveSensitiveData = async (key: string, value: string) => {
  try {
    // Использует Keychain (iOS) / Keystore (Android)
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Failed to save to secure store', error);
    throw new SecurityError('Secure storage failed');
  }
};
```

---

### 2. Data in Transit (Передача)

#### HTTPS/TLS
**Для всех API запросов**:
```typescript
// lib/trpc.ts
const baseUrl = 'https://d8v7u672uumlfpscvnbps.rork.live';

// Enforce HTTPS
if (!baseUrl.startsWith('https://') && process.env.NODE_ENV === 'production') {
  throw new Error('HTTPS required in production');
}
```

#### Certificate Pinning (Future)
```typescript
import { setCustomCertificates } from 'expo-ssl-pinning';

// Pin specific certificates
await setCustomCertificates({
  'api.rork-kiku.com': 'sha256/ABC123...'
});
```

---

### 3. Data in Use (Обработка)

#### Memory Security
- Не логируем чувствительные данные
- Очистка sensitive variables после использования
- Избегаем plaintext credentials в памяти

```typescript
const processPassword = async (password: string) => {
  try {
    const hash = await hashPassword(password);
    // Clear password from memory
    password = '';
    return hash;
  } finally {
    // Ensure cleanup
    password = '';
  }
};
```

---

## Authentication & Authorization

### Authentication (Кто вы?)

#### Local Authentication
```typescript
// constants/UserContext.tsx
const login = async (email: string, password: string) => {
  // 1. Валидация input
  if (!isValidEmail(email)) {
    throw new AuthError('Invalid email');
  }
  
  // 2. Check stored credentials
  const storedHash = await SecureStore.getItemAsync('password_hash');
  const inputHash = await hashPassword(password);
  
  if (storedHash !== inputHash) {
    throw new AuthError('Invalid credentials');
  }
  
  // 3. Load user profile
  const userStr = await AsyncStorage.getItem('@user_profile');
  const user = JSON.parse(userStr);
  
  // 4. Set authenticated state
  setUser(user);
  
  // 5. Compliance log
  await logCompliance({
    action: 'user_login',
    userId: user.id,
    timestamp: new Date(),
  });
};
```

#### Password Security
- **Hashing**: Argon2 или bcrypt
- **Salt**: Unique per user
- **Min length**: 8 characters
- **Complexity**: Letters + numbers + symbols (recommended)

---

### Authorization (Что вы можете делать?)

#### Role-Based Access Control (RBAC)

```typescript
type UserRole = 'parent' | 'child';

const checkPermission = (user: User, action: string, resource: string) => {
  const permissions: Record<UserRole, string[]> = {
    parent: [
      'view_all_chats',
      'view_all_messages',
      'resolve_alerts',
      'change_settings',
      'delete_data',
    ],
    child: [
      'view_own_chats',
      'send_messages',
      'trigger_sos',
    ],
  };
  
  const userPermissions = permissions[user.role];
  const requiredPermission = `${action}_${resource}`;
  
  if (!userPermissions.includes(requiredPermission)) {
    throw new AuthorizationError('Permission denied');
  }
};
```

#### Data Access Control
- Родитель видит данные своего ребенка
- Ребенок видит только свои данные
- Никто не видит данные других пользователей

---

## Input Validation & Sanitization

### 1. Frontend Validation

```typescript
import { z } from 'zod';

// Zod schema для валидации
const MessageSchema = z.object({
  text: z.string().min(1).max(5000),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
});

const validateMessage = (data: unknown) => {
  try {
    return MessageSchema.parse(data);
  } catch (error) {
    throw new ValidationError('Invalid message data');
  }
};
```

### 2. Sanitization

```typescript
const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JS protocols
    .slice(0, 5000); // Enforce max length
};

const sanitizeImageUri = (uri: string): string => {
  // Ensure it's a valid file:// or https:// URI
  if (!uri.startsWith('file://') && !uri.startsWith('https://')) {
    throw new ValidationError('Invalid image URI');
  }
  return uri;
};
```

---

## API Security

### 1. Rate Limiting (Future)

```typescript
// backend/hono.ts
import { rateLimiter } from 'hono-rate-limiter';

app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests',
}));
```

### 2. CORS Policy

```typescript
// backend/hono.ts
import { cors } from 'hono/cors';

app.use('*', cors({
  origin: [
    'https://d8v7u672uumlfpscvnbps.rork.live',
    'exp://localhost:8081', // Expo dev
  ],
  credentials: true,
  maxAge: 3600,
}));
```

### 3. Request Timeout

```typescript
// lib/trpc.ts
fetch: async (url, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw new NetworkError('Request timeout');
  }
}
```

---

## AI Security

### 1. Adversarial Attacks Protection

**Threats**:
- Prompt injection
- Data poisoning
- Model evasion

**Mitigations**:
- Input sanitization перед AI
- Output validation после AI
- Model versioning и rollback
- Human-in-the-loop для critical decisions

```typescript
const analyzeMessageSecure = async (text: string) => {
  // 1. Sanitize input
  const sanitized = sanitizeText(text);
  
  // 2. Check for adversarial patterns
  if (containsAdversarialPatterns(sanitized)) {
    console.warn('Potential adversarial input detected');
    return { level: 'medium', confidence: 0.5 };
  }
  
  // 3. Call AI
  const result = await aiAnalyze(sanitized);
  
  // 4. Validate output
  if (!isValidRiskAnalysis(result)) {
    throw new AIError('Invalid AI response');
  }
  
  return result;
};
```

### 2. Model Security

- **Access Control**: Только authorized code может вызывать AI
- **API Key Security**: Хранение в secure store
- **Rate Limiting**: Предотвращение abuse
- **Monitoring**: Отслеживание anomalous patterns

---

## Error Handling Security

### 1. Error Boundary

```typescript
// app/_layout.tsx
class AppErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 1. Log error (без sensitive data)
    console.error('[ErrorBoundary]', {
      message: error.message,
      stack: error.stack?.split('\n')[0], // Только первая линия
      // НЕ логируем user data, passwords, tokens
    });
    
    // 2. Report to monitoring (future)
    // Sentry.captureException(error);
  }
}
```

### 2. API Error Handling

```typescript
// backend/hono.ts
app.onError((err, c) => {
  console.error('[Hono] Error:', err);
  
  // НЕ раскрываем internal details
  return c.json({
    error: {
      message: 'Internal server error', // Generic message
      // НЕ включаем: stack traces, file paths, DB errors
    }
  }, 500);
});
```

---

## Logging & Monitoring

### 1. Security Logging

**Что логируем**:
- Authentication attempts (успешные и неудачные)
- Authorization failures
- Data access (compliance)
- Settings changes
- Anomalous activity

**Что НЕ логируем**:
- Passwords (даже hashed)
- Full message content (только metadata)
- Personal identifiable information
- API keys или tokens

```typescript
const logSecurityEvent = async (event: SecurityEvent) => {
  const sanitizedEvent = {
    type: event.type,
    userId: event.userId,
    timestamp: new Date(),
    // НЕ включаем sensitive data
    metadata: {
      success: event.success,
      errorCode: event.errorCode,
      // NO user data, passwords, content
    },
  };
  
  await AsyncStorage.setItem(
    `@security_log_${Date.now()}`,
    JSON.stringify(sanitizedEvent)
  );
};
```

### 2. Monitoring (Future)

- **Sentry**: Error tracking
- **DataDog**: Performance monitoring
- **Anomaly Detection**: Unusual activity patterns
- **Alerting**: Security incidents notification

---

## Incident Response

### 1. Incident Response Plan

**Phases**:
1. **Detection**: Identify security incident
2. **Containment**: Limit damage
3. **Eradication**: Remove threat
4. **Recovery**: Restore normal operations
5. **Lessons Learned**: Post-mortem

**Team**:
- Incident Commander: CTO
- Tech Lead: Senior Engineer
- Legal: Counsel
- Communications: CEO

### 2. Data Breach Response

**Within 24 hours**:
1. Assess scope of breach
2. Contain the breach
3. Notify legal team
4. Document everything

**Within 72 hours** (GDPR requirement):
5. Notify data protection authority
6. Notify affected users (if high risk)
7. Provide remediation steps

**Within 1 week**:
8. Implement fixes
9. Security audit
10. Public statement (if needed)

---

## Security Testing

### 1. Regular Audits

**Quarterly**:
- [ ] Code review for security issues
- [ ] Dependency vulnerability scan
- [ ] Penetration testing (internal)

**Annually**:
- [ ] External security audit
- [ ] Compliance certification
- [ ] Red team exercise

### 2. Automated Scanning

**Pre-commit**:
```bash
# ESLint security rules
npm run lint

# TypeScript type checking
npm run tsc

# Dependency audit
npm audit
```

**CI/CD**:
```yaml
# .github/workflows/security.yml
- name: Security Scan
  run: |
    npm audit --audit-level=moderate
    npx snyk test
    npx retire
```

---

## Compliance & Privacy

### 1. Privacy by Design

**Principles**:
- Proactive not reactive
- Privacy as default
- Privacy embedded in design
- Full functionality
- End-to-end security
- Visibility and transparency
- User-centric

### 2. Data Minimization

**Collect only**:
- Data necessary for functionality
- Data consented to by user
- Data with clear retention period

**Do NOT collect**:
- Unnecessary personal data
- Data for undefined purposes
- Data without consent

### 3. Encryption

**At Rest**:
- Device encryption (iOS/Android)
- SecureStore for sensitive data

**In Transit**:
- HTTPS/TLS 1.3
- Certificate pinning (future)

**In Use**:
- Minimal exposure in memory
- No plaintext sensitive data in logs

---

## Security Checklist

### Pre-Launch
- [ ] Security audit completed
- [ ] Penetration testing passed
- [ ] Vulnerability scan clean
- [ ] Error handling reviewed
- [ ] Logging implemented
- [ ] Incident response plan ready
- [ ] Insurance obtained
- [ ] Compliance verified

### Production
- [ ] HTTPS enforced
- [ ] Certificate pinning enabled
- [ ] Rate limiting active
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] DDoS protection enabled
- [ ] WAF configured
- [ ] Security headers set

### Ongoing
- [ ] Monthly security review
- [ ] Quarterly audits
- [ ] Annual pen test
- [ ] Dependency updates weekly
- [ ] Security training for team
- [ ] Incident drills quarterly

---

## Contact

**Security Issues**: security@rork-kiku.com  
**Bug Bounty**: bounty@rork-kiku.com (future)

---

## См. также
- [Compliance](../legal/compliance.md)
- [Privacy Policy](../legal/privacy-policy.md)
- [Operations Security](../operations/security-ops.md)
