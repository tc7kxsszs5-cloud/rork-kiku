# Security Design — kiku

## Обзор

Безопасность — критичный аспект kiku, так как мы обрабатываем sensitive данные детей. Этот документ описывает security architecture, best practices, и threat model для проекта.

**Принципы безопасности:**
- **Defense in Depth** — многоуровневая защита
- **Least Privilege** — минимальные необходимые permissions
- **Zero Trust** — всегда проверять, никогда не доверять
- **Privacy by Design** — безопасность встроена с начала, а не добавлена потом

---

## 1. Threat Model (Модель угроз)

### Потенциальные threat actors:

**1. Злонамеренные пользователи (External attackers)**
- **Цель:** Получить доступ к детским данным (CSAM distribution, grooming)
- **Методы:** SQL injection, API abuse, credential stuffing
- **Mitigation:** WAF, rate limiting, input validation, MFA

**2. Внутренние угрозы (Insider threats)**
- **Цель:** Неавторизованный доступ к user data (curiosity, malicious intent)
- **Методы:** Abuse of admin privileges
- **Mitigation:** Least privilege access, audit logging, background checks

**3. Компрометация third-party vendors**
- **Цель:** Доступ к данным через OpenAI, AWS, etc.
- **Методы:** Supply chain attack
- **Mitigation:** Vendor due diligence, DPA agreements, monitoring

**4. Абъюзивные родители (Abusive parents)**
- **Цель:** Использовать kiku для чрезмерного контроля (stalking ребёнка)
- **Методы:** Legal use of product, but unethical
- **Mitigation:** Transparency для детей, limits на data retention, educational content

---

## 2. Шифрование данных

### 2.1 Данные в покое (Data at Rest)

**Database (PostgreSQL):**
- **Encryption:** AWS RDS Encryption with AWS KMS
- **Algorithm:** AES-256
- **Key Management:** AWS KMS with automatic rotation (annual)

**Файлы (S3):**
- **Encryption:** Server-Side Encryption (SSE-KMS)
- **Algorithm:** AES-256
- **Metadata:** Encrypted headers

**Локальное хранилище (Mobile):**
- **AsyncStorage:** Encrypted with Expo SecureStore для sensitive data (токены, passwords)
- **Messages:** Хранятся локально, зашифрованные SQLite with SQLCipher (опционально для будущего)

### 2.2 Данные в транзите (Data in Transit)

**API Connections:**
- **Protocol:** TLS 1.3 (минимум TLS 1.2)
- **Certificate Pinning:** Рекомендовано для mobile app (защита от MITM)
  ```typescript
  // Expo app.json
  {
    "expo": {
      "ios": {
        "infoPlist": {
          "NSAppTransportSecurity": {
            "NSPinnedDomains": {
              "api.kiku-app.com": {
                "NSIncludesSubdomains": true,
                "NSPinnedCAIdentities": [
                  {
                    "SPKI-SHA256-BASE64": "[PLACEHOLDER-certificate-hash]"
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
  ```

**Third-Party APIs:**
- OpenAI, AWS Rekognition: TLS 1.3
- Verify SSL certificates (no self-signed certs)

### 2.3 End-to-End Encryption (Future Consideration)

**Опционально для будущих версий:**
- E2E encryption для сообщений (только родитель и ребёнок могут расшифровать)
- Signal Protocol или similar
- **Trade-off:** Усложнит AI анализ (нужно будет расшифровывать на устройстве или использовать Homomorphic Encryption — очень сложно)

---

## 3. Key Management System (KMS)

### AWS KMS Setup

**Ключи:**
1. **Database Encryption Key** — для RDS
2. **S3 Encryption Key** — для медиа файлов
3. **Secrets Manager Key** — для API keys, passwords

**Access Control:**
- IAM policies для ограничения доступа к keys
- Только authorized services (EKS pods с определённым IAM role) могут использовать keys

**Key Rotation:**
- **Automatic rotation:** Ежегодно для AWS-managed keys
- **Manual rotation:** Для customer-managed keys — по необходимости (при компрометации)

**Monitoring:**
- CloudTrail logs для всех key operations
- Alert на unusual key usage patterns

---

## 4. Аутентификация и авторизация

### 4.1 Аутентификация (Authentication)

**Пользователи:**
- **Email/Password:** Primary authentication method
  - Password requirements: минимум 8 символов, uppercase, lowercase, digit, special char
  - Password hashing: **bcrypt** (cost factor 12)
  - Never store plaintext passwords

**JWT Tokens:**
- **Access Token:** Short-lived (15 минут), содержит user_id, role
- **Refresh Token:** Long-lived (30 дней), хранится в БД (revocable)
- **Algorithm:** RS256 (asymmetric, более secure чем HS256)
- **Token payload (example):**
  ```json
  {
    "sub": "user_id_123",
    "role": "parent",
    "iat": 1672531200,
    "exp": 1672531800
  }
  ```

**Token Refresh Flow:**
1. Client отправляет refresh token в `/api/auth/refresh`
2. Backend проверяет refresh token в БД (не revoked?)
3. Если valid → выдаёт новый access token
4. Если invalid → требует re-login

**MFA (Multi-Factor Authentication):**
- **Опционально для родителей:** TOTP (Time-based One-Time Password) через Google Authenticator
- **Обязательно для admins/moderators**

### 4.2 Авторизация (Authorization)

**RBAC (Role-Based Access Control):**

| Role | Permissions |
|------|-------------|
| **Parent** | Полный доступ к своим детским профилям, чтение алертов, управление настройками |
| **Child** | Только чтение своих сообщений, отправка сообщений, нажатие SOS |
| **Moderator** | Доступ к очереди модерации (review flagged content), но НЕ доступ к raw user data |
| **Admin** | Полный доступ к системе (use with caution) |

**Permissions (примеры):**
- `chat:read:own` — Читать свои чаты
- `chat:read:child` — Читать чаты своих детей (только родитель)
- `alert:create` — Создавать алерты (ML service)
- `alert:resolve` — Решать алерты (родитель)
- `moderation:review` — Ручная модерация (модератор)
- `user:delete:any` — Удалять любого пользователя (только admin)

**Implementation:**
```typescript
// Middleware для проверки permissions
function checkPermission(permission: string) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const hasPermission = rolePermissions[userRole].includes(permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Example usage
app.get('/api/chats/:chatId', 
  authenticate,
  checkPermission('chat:read:own'),
  getChatHandler
);
```

---

## 5. Input Validation и Sanitization

### SQL Injection Protection

**Use Parameterized Queries:**
```typescript
// ❌ BAD: Never concatenate user input
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// ✅ GOOD: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [userInput]);
```

**ORM (Prisma/TypeORM):**
- Use ORM для автоматической защиты от SQL injection

### XSS Protection

**Sanitize user input:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const cleanInput = DOMPurify.sanitize(userInput);
```

**Content Security Policy (CSP) Headers:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';
```

### API Input Validation

**Use Zod или Joi для validation:**
```typescript
import { z } from 'zod';

const createChildSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(0).max(18),
  parentId: z.string().uuid(),
});

app.post('/api/children', async (req, res) => {
  try {
    const validatedData = createChildSchema.parse(req.body);
    // Proceed with validated data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
});
```

---

## 6. Rate Limiting и DDoS Protection

### API Rate Limiting

**Protect endpoints:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Stricter limit для auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/auth/login', authLimiter);
```

### DDoS Protection

**AWS WAF (Web Application Firewall):**
- Rate-based rules (block IP с > 2000 requests/5min)
- Geo-blocking (если applicable)
- Known bad IP lists (AWS Managed Rules)

**CloudFront:**
- AWS Shield Standard (included, basic DDoS protection)
- AWS Shield Advanced (optional, $3000/month — для больших атак)

---

## 7. Logging и Monitoring

### Security Event Logging

**Что логировать:**
- Все authentication attempts (успешные и failed)
- Все authorization failures (403 errors)
- Все изменения в sensitive data (child profiles, parental settings)
- Все admin actions
- Все API errors (500s)

**Log Format (JSON):**
```json
{
  "timestamp": "2026-01-02T12:34:56Z",
  "level": "info",
  "event": "user_login",
  "user_id": "user_123",
  "ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "success": true
}
```

**⚠️ ВАЖНО:** НЕ логировать sensitive data (passwords, full messages, credit card numbers)

### Centralized Logging

**ELK Stack (Elasticsearch, Logstash, Kibana):**
- Все logs отправляются в Elasticsearch
- Kibana для visualization
- Alerts на suspicious patterns (например, multiple failed logins from same IP)

**AWS CloudWatch Logs:**
- Alternative для AWS-native setup
- Автоматическая интеграция с Lambda, EKS

### Security Monitoring (SIEM)

**Alerts на:**
- Multiple failed login attempts (> 5 в 15 минут) → potential brute force attack
- Unusual API patterns (1000+ requests от одного user в минуту)
- Access к sensitive endpoints от unauthorized IPs
- Data export requests (право на удаление данных) — для audit

**Tools:**
- AWS GuardDuty (AWS-native threat detection)
- Splunk или Datadog (third-party SIEM)

---

## 8. Vulnerability Management

### Dependency Scanning

**Автоматический scanning:**
- **Dependabot** (GitHub) — automatically открывает PRs для vulnerability fixes
- **Snyk** — более продвинутый, интеграция с CI/CD

**npm audit:**
```bash
npm audit
# Или
bun audit
```

**Регулярные reviews:** Quarterly review всех dependencies

### Container Security

**Docker Image Scanning:**
- **Trivy** (open-source scanner)
  ```bash
  trivy image kiku-backend:latest
  ```
- **AWS ECR Scanning** (автоматически сканирует images при push)

**Best Practices:**
- Use minimal base images (Alpine Linux)
- No root user в containers
- Multi-stage builds (не включать build tools в final image)

### Code Security Scanning

**Static Analysis:**
- **SonarQube** — code quality и security vulnerabilities
- **Semgrep** — fast, lightweight SAST (Static Application Security Testing)

**GitHub Advanced Security:**
- CodeQL для automatic vulnerability detection в code

---

## 9. Incident Response Plan

### Runbook для Security Incidents

**1. Обнаружение (Detection)**
- Alert от monitoring system (GuardDuty, CloudWatch, etc.)
- Report от user или security researcher

**2. Анализ (Assessment)**
- **Severity Classification:**
  - **P0 (Critical):** Data breach, CSAM detected, system compromised
  - **P1 (High):** Unauthorized access to user data, DDoS attack
  - **P2 (Medium):** Vulnerability detected, but not exploited
  - **P3 (Low):** Minor security issue, no immediate risk

**3. Containment (Изоляция)**
- **Immediate actions:**
  - Isolate affected systems (например, отключить compromised server от network)
  - Revoke compromised credentials (JWT tokens, API keys)
  - Enable additional logging
- **P0 incidents:** Полная изоляция affected components

**4. Eradication (Удаление угрозы)**
- Patch vulnerability
- Удалить malware/backdoors (если applicable)
- Change all credentials

**5. Recovery (Восстановление)**
- Restore services from backups (если necessary)
- Verify integrity данных
- Gradual rollout (не сразу всё включать)

**6. Post-Incident Review (Post-mortem)**
- **Timeline:** Что произошло, когда, как обнаружили
- **Root cause analysis:** Почему произошло
- **Lessons learned:** Что можно улучшить
- **Action items:** Конкретные шаги для prevention в будущем

**Документ post-mortem:** Public (если appropriate) или internal-only

### Communication Plan

**Internal:**
- **Incident Commander:** Назначается для coordination response
- **Stakeholders:** Notify CEO, CTO, Legal counsel immediately (P0/P1)

**External:**
- **Users:** Notify affected users в течение 72 часов (GDPR requirement)
  - Email notification с описанием incident, что скомпрометировано, какие шаги пользователь должен предпринять
- **Regulators:** Notify Data Protection Authority (если required по GDPR/COPPA)
- **Media:** Prepared statement (если incident станет public)

---

## 10. Penetration Testing

### Regular Pentests

**Frequency:**
- **Annual pentest** от external security firm
- **Ad-hoc pentests** перед major releases (например, перед public launch)

**Scope:**
- Web application (API, admin panel)
- Mobile app (iOS/Android)
- Infrastructure (AWS setup, Kubernetes)

**Common vulnerabilities to test:**
- OWASP Top 10 (SQL Injection, XSS, CSRF, etc.)
- Authentication/Authorization bypasses
- Data exposure (sensitive data в logs, error messages)
- API abuse (rate limiting, data scraping)

**Report:**
- Detailed report с findings, severity, recommended fixes
- Fix critical vulnerabilities ASAP (P0 within 7 days, P1 within 30 days)

### Bug Bounty Program (Future)

**Когда запускать:** После public launch и когда product mature

**Platform:** HackerOne, Bugcrowd

**Scope:** Define что in-scope (API, mobile app) и что out-of-scope (social engineering)

**Rewards:**
- Critical: $1000-5000
- High: $500-1000
- Medium: $200-500
- Low: $50-200

---

## 11. Compliance и Audits

### Security Audits

**Internal Audits:**
- Quarterly review access logs (кто имеет доступ к user data)
- Review user permissions (remove unused accounts, adjust over-privileged users)

**External Audits:**
- Annual security audit для COPPA/GDPR compliance
- ISO 27001 certification (опционально, для enterprise clients)

### Compliance Frameworks

**COPPA (Children's Online Privacy Protection Act):**
- Parental consent logged
- No third-party data sharing without consent
- Secure data storage

**GDPR-K (GDPR for children):**
- Right to access, rectification, erasure
- Data portability
- Clear consent mechanisms

**SOC 2 (Service Organization Control) — Future:**
- Type I or Type II report для enterprise clients
- Security, Availability, Confidentiality controls

---

## 12. Security Best Practices Checklist

- [ ] **Secrets:** No secrets в Git repository (use .gitignore, Secrets Manager)
- [ ] **Encryption:** Data encrypted at rest и in transit (TLS 1.3, AES-256)
- [ ] **Authentication:** Strong passwords, JWT tokens, MFA для admins
- [ ] **Authorization:** RBAC, least privilege
- [ ] **Input Validation:** All user input validated и sanitized
- [ ] **Rate Limiting:** API endpoints protected
- [ ] **Logging:** Security events logged, sensitive data excluded
- [ ] **Monitoring:** Alerts на suspicious activities
- [ ] **Dependency Scanning:** Regular scans для vulnerabilities
- [ ] **Container Security:** Images scanned, no root user
- [ ] **Incident Response Plan:** Documented и tested
- [ ] **Penetration Testing:** Annual external pentest
- [ ] **Compliance:** COPPA/GDPR-K compliant
- [ ] **Backup:** Regular backups, tested restore process

---

## 13. Security Contact

**Security Team:**
- Security Lead: [PLACEHOLDER — Имя, email]
- On-Call rotation: [PLACEHOLDER — PagerDuty/similar]

**Report Vulnerability:**
- Email: [PLACEHOLDER — security@kiku-app.com]
- PGP Key: [PLACEHOLDER — для encrypted communication]

**Bug Bounty:** [PLACEHOLDER — HackerOne link, когда запущен]

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Security Team  
**Статус:** Draft — требуется review и approval от Security Lead
