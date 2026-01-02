# Дизайн безопасности Rork-Kiku

## Обзор

Безопасность — критичный приоритет для Rork-Kiku. Данный документ описывает комплексный подход к защите данных пользователей, особенно детей.

**Принципы:**
- Security by Design (безопасность заложена в архитектуру)
- Defense in Depth (многоуровневая защита)
- Zero Trust (не доверяем никому по умолчанию)
- Least Privilege (минимальные необходимые права)

---

## 1. Шифрование

### 1.1 Шифрование в транзите (In Transit)

**TLS 1.3:**
- Все коммуникации между client и server используют TLS 1.3
- HTTP строго запрещён, только HTTPS
- Certificate от Let's Encrypt или AWS Certificate Manager
- Perfect Forward Secrecy (PFS) enabled

**Конфигурация:**
```nginx
# Nginx configuration (placeholder)
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
ssl_ecdh_curve X25519:prime256v1:secp384r1;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

**mTLS между микросервисами (опционально через service mesh):**
- Istio или Linkerd для automatic mTLS
- Каждый сервис имеет собственный certificate
- Certificate rotation каждые 24 часа

### 1.2 Шифрование в покое (At Rest)

**Database (PostgreSQL RDS):**
- AWS RDS encryption enabled (AES-256)
- Automated backups также зашифрованы
- Encryption key managed by AWS KMS

**S3 Storage:**
- SSE-S3 (Server-Side Encryption with S3-managed keys) или
- SSE-KMS (Server-Side Encryption with KMS-managed keys, рекомендуется)
- Bucket policy: deny unencrypted uploads

**Application-level encryption для sensitive fields:**
- PII (personally identifiable information) дополнительно зашифрован на уровне приложения
- Используем envelope encryption: data key encrypted by master key (KMS)

**Пример (Node.js):**
```javascript
// Placeholder: application-level encryption
const AWS = require('aws-sdk');
const kms = new AWS.KMS();

async function encryptSensitiveData(plaintext) {
  const params = {
    KeyId: process.env.KMS_KEY_ID,
    Plaintext: plaintext
  };
  const encrypted = await kms.encrypt(params).promise();
  return encrypted.CiphertextBlob.toString('base64');
}

async function decryptSensitiveData(ciphertext) {
  const params = {
    CiphertextBlob: Buffer.from(ciphertext, 'base64')
  };
  const decrypted = await kms.decrypt(params).promise();
  return decrypted.Plaintext.toString('utf8');
}
```

---

## 2. Key Management Service (KMS)

### 2.1 AWS KMS Configuration

**Customer Master Keys (CMKs):**
- `rork-database-key` — для RDS encryption
- `rork-s3-key` — для S3 bucket encryption
- `rork-secrets-key` — для AWS Secrets Manager
- `rork-application-key` — для application-level encryption

**Key Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM policies",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::ACCOUNT_ID:root"},
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key for encryption/decryption",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::ACCOUNT_ID:role/rork-backend-role"},
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow CloudWatch Logs to use the key",
      "Effect": "Allow",
      "Principal": {"Service": "logs.amazonaws.com"},
      "Action": ["kms:Encrypt", "kms:Decrypt", "kms:GenerateDataKey"],
      "Resource": "*"
    }
  ]
}
```

### 2.2 Key Rotation

**Automatic Key Rotation:**
- Включена для всех CMKs
- Ротация каждые 365 дней
- AWS автоматически сохраняет старые versions для decrypt старых данных

**Manual Key Rotation (для application keys):**
- Rotate каждые 90 дней (более агрессивно)
- Process:
  1. Создать новый key version
  2. Обновить application configuration
  3. Re-encrypt critical data с новым key (фоновая задача)
  4. Disable старый key version через 30 дней
  5. Delete старый key version через 90 дней

### 2.3 Audit Logging

**CloudTrail logging для всех KMS operations:**
- Кто использовал key (IAM principal)
- Когда (timestamp)
- Для какой операции (Encrypt, Decrypt, GenerateDataKey)
- Result (success/failure)

**Alerts:**
- Уведомление при unusual KMS usage patterns
- Alert при failed decrypt attempts (возможная атака)

---

## 3. RBAC (Role-Based Access Control)

### 3.1 Роли пользователей

**Определены в `docs/architecture/architecture.md`, краткое повторение:**

**Parent (родитель):**
- Полный доступ к своим детям и данным
- Настройки модерации
- Родительская панель управления

**Child (ребёнок):**
- Ограниченный доступ
- Может отправлять медиа родителю (с модерацией)
- Просмотр кураторского контента

**Moderator (модератор):**
- Доступ к очереди модерации
- Approve/reject/escalate контента
- Не имеет доступа к PII пользователей (только контент для модерации)

**Admin (администратор):**
- Полный доступ к системе (для troubleshooting, support)
- Access логируется (audit trail)

**Support (поддержка):**
- Read-only доступ к данным пользователей (для помощи)
- Не может изменять данные
- Access логируется

**Auditor (аудитор):**
- Read-only доступ к audit logs и metrics
- Не имеет доступа к actual user data

### 3.2 Permission Matrix

| Role | Read User Data | Modify User Data | View Content | Moderate Content | System Config | Audit Logs |
|------|---------------|------------------|--------------|------------------|---------------|------------|
| Parent | Own only | Own only | Own children | No | No | No |
| Child | Own only | Own only (limited) | Own + curated | No | No | No |
| Moderator | No (anonymized) | No | Pending moderation | Yes | No | No |
| Admin | All | All | All | Yes | Yes | Yes |
| Support | All (read) | Limited | Limited | No | No | Yes |
| Auditor | Anonymized | No | No | No | No | Yes |

### 3.3 Implementation

**JWT tokens с claims:**
```json
{
  "sub": "user_id",
  "role": "parent",
  "permissions": [
    "read:own_profile",
    "update:own_profile",
    "create:child_profile",
    "read:child_profiles",
    "read:child_media"
  ],
  "iat": 1704189600,
  "exp": 1704190500
}
```

**Middleware для проверки permissions:**
```javascript
// Placeholder: permission check middleware
function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user; // from JWT
    if (!user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage:
app.get('/api/child/:id', 
  requirePermission('read:child_profiles'),
  async (req, res) => {
    // Handler
  }
);
```

**Row-Level Security (PostgreSQL):**
```sql
-- Placeholder: RLS policy
CREATE POLICY parent_child_access ON children
  FOR SELECT
  USING (parent_id = current_user_id());

CREATE POLICY child_own_media ON media
  FOR SELECT
  USING (sender_id = current_user_id() OR recipient_id = current_user_id());
```

---

## 4. Monitoring и Logging

### 4.1 Prometheus + Grafana

**Метрики безопасности:**
- Failed login attempts (по IP, по user)
- Rate of 403 Forbidden responses
- API rate limit violations
- KMS decrypt failures
- Database connection failures
- Unusual traffic patterns

**Dashboards:**
- Security Overview Dashboard
- Authentication Metrics
- API Security Metrics
- Infrastructure Health

**Alerts:**
- 5+ failed logins from same IP за 5 минут → alert
- 10+ rate limit violations за 1 минуту → alert
- KMS decrypt failure → immediate alert
- Sudden spike в API requests → alert

### 4.2 Centralized Logging (ELK Stack или CloudWatch)

**Что логируем:**
- All API requests (method, path, user, IP, timestamp, response code)
- Authentication events (login, logout, password reset)
- Authorization failures (403 Forbidden)
- Data access (who accessed what, when)
- Configuration changes
- Security events (KMS usage, secret access)

**Structured logging (JSON format):**
```json
{
  "timestamp": "2026-01-02T10:30:00Z",
  "level": "info",
  "service": "api-gateway",
  "message": "API request",
  "user_id": "user_123",
  "ip": "192.0.2.1",
  "method": "GET",
  "path": "/api/v1/children",
  "status": 200,
  "duration_ms": 45,
  "trace_id": "abc123"
}
```

**Log Retention:**
- Hot storage (Elasticsearch/CloudWatch): 30 дней
- Warm storage (S3): 1 год
- Cold storage (Glacier): 7 лет (compliance)

**Sensitive Data Masking:**
- PII masked в logs: email → `e***@example.com`, phone → `+1***123`
- Никогда не логируем passwords, tokens, ключи

### 4.3 SIEM (Security Information and Event Management)

**Опции:**
- AWS Security Hub (для AWS-centric)
- Splunk (enterprise)
- Datadog Security Monitoring
- Open-source: OSSEC, Wazuh

**Use Cases:**
- Correlation events из разных источников
- Anomaly detection (machine learning)
- Threat intelligence integration
- Compliance reporting

---

## 5. Audit Trails

### 5.1 Что аудитируется

**User actions:**
- Registration, login, logout
- Profile creation/modification/deletion
- Media uploads
- Settings changes
- Data export requests
- Account deletion

**Admin actions:**
- User data access (support requests)
- System configuration changes
- Permission changes
- Emergency actions (account freeze, content removal)

**System events:**
- Deployments
- Database schema changes
- Certificate rotations
- Secret rotations

### 5.2 Audit Log Format

```json
{
  "timestamp": "2026-01-02T10:30:00Z",
  "event_type": "media_upload",
  "actor": {
    "user_id": "user_123",
    "role": "child",
    "ip": "192.0.2.1",
    "user_agent": "RorkKiku/1.0 iOS/16.0"
  },
  "resource": {
    "type": "media",
    "id": "media_456",
    "owner_id": "user_123"
  },
  "action": "create",
  "result": "success",
  "metadata": {
    "file_size": 1024000,
    "content_type": "image/jpeg",
    "moderation_score": 0.15
  }
}
```

### 5.3 Immutable Audit Logs

**Хранение:**
- Write-once storage (S3 with Object Lock)
- Нельзя изменить или удалить после записи
- Encryption at rest (KMS)

**Access control:**
- Только auditors и admins могут читать
- Никто не может modify или delete

**Compliance:**
- Retention: минимум 7 лет (GDPR, финансовые регуляции)
- Regular audits (quarterly)

---

## 6. Incident Response

### 6.1 Incident Response Playbook

**Определено подробно в `docs/architecture/architecture.md`, краткая версия:**

**Фазы:**
1. **Detection** (0-5 min) — автоматические alerts
2. **Identification** (5-15 min) — severity assessment
3. **Containment** (15-30 min) — isolate affected systems
4. **Eradication** (30 min - hours) — remove root cause
5. **Recovery** (hours - days) — restore services
6. **Post-Mortem** (1-2 weeks) — lessons learned

**Severity Levels:**
- **P0 (Critical):** data breach, system down, immediate threat
- **P1 (High):** security vulnerability, major functionality broken
- **P2 (Medium):** minor security issue, degraded performance
- **P3 (Low):** cosmetic bugs, minor issues

**Response Times:**
- P0: acknowledge < 15 min, resolve < 4 hours
- P1: acknowledge < 30 min, resolve < 24 hours
- P2: acknowledge < 2 hours, resolve < 1 week
- P3: acknowledge < 1 day, resolve < 1 month

### 6.2 Incident Communication

**Internal:**
- Incident Commander координирует response
- War room (Slack channel или Zoom call)
- Status updates каждые 30 минут

**External:**
- Users: уведомление через in-app banner, email
- Investors: email update (для major incidents)
- Regulators: required notifications (GDPR: < 72 hours)
- PR team: prepared statements (если media attention)

**Templates:**
```
Subject: Security Incident Notification - [DATE]

Dear User,

We are writing to inform you about a security incident that occurred on [DATE].

What happened:
[Brief description]

What information was affected:
[Specific data types]

What we are doing:
- [Action 1]
- [Action 2]

What you should do:
- [Recommendation 1]
- [Recommendation 2]

We take your privacy seriously and apologize for any inconvenience.

Contact: [SECURITY_EMAIL]

Sincerely,
Rork-Kiku Security Team
```

### 6.3 Post-Mortem

**Обязателен для P0 и P1 incidents:**

**Формат:**
- Timeline (что произошло, когда, кто сделал что)
- Root cause analysis (5 Whys)
- Impact assessment (сколько пользователей, какие данные)
- What went well / What didn't go well
- Action items (с assignees и deadlines)
- Process improvements

**Publication:**
- Internal: весь team
- External: public post-mortem (если major outage или breach, для transparency)

---

## 7. Pentesting и Security Audits

### 7.1 Penetration Testing Schedule

**Before launch:**
- Internal security review
- External pentest (hire security firm)

**Post-launch:**
- Quarterly internal security reviews
- Annual external pentests
- Bug bounty program (после Series A)

**Scope:**
- Web application (API)
- Mobile apps (iOS, Android)
- Infrastructure (AWS, Kubernetes)
- Third-party integrations

### 7.2 Vulnerability Disclosure

**Security page:** `https://rorkkiku.com/security`

**Responsible Disclosure Policy:**
```
We welcome security researchers to report vulnerabilities responsibly.

How to report:
- Email: security@rorkkiku.com
- PGP key: [PGP_KEY_ID]

Guidelines:
- Provide detailed steps to reproduce
- Do not exploit vulnerabilities beyond proof-of-concept
- Do not access or modify user data without permission
- Give us reasonable time to fix (90 days)

What to expect:
- Acknowledgment within 24 hours
- Status update within 7 days
- Fix timeline (varies by severity)
- Credit in hall of fame (if desired)
```

**Bug Bounty (future):**
- After Series A funding
- Platform: HackerOne or Bugcrowd
- Rewards: $100 - $10,000 (зависит от severity)

### 7.3 Security Certifications

**MVP/Pilot:**
- Self-assessment GDPR/COPPA compliance

**After Series A:**
- **SOC 2 Type II** — security, availability, confidentiality audit
- **ISO 27001** — information security management system

**After Series B:**
- **PCI DSS** (если processing payments напрямую, а не через Stripe)
- **HIPAA** (если expand в health data)

---

## 8. Compliance и Регуляции

### 8.1 GDPR (General Data Protection Regulation)

**Уже покрыто в Privacy Policy, ключевые требования:**
- Lawful basis для processing
- Data minimization
- Right to access, rectification, erasure
- Data portability
- Breach notification < 72 hours
- DPO (Data Protection Officer) если требуется
- Data residency (EU data in EU)

**Implementation:**
- Consent management system
- Data inventory и mapping
- DPIA (Data Protection Impact Assessment) completed
- DPA (Data Processing Agreement) со всеми processors

### 8.2 COPPA (Children's Online Privacy Protection Act)

**Ключевые требования:**
- Verifiable parental consent перед сбором данных детей < 13
- Notice to parents о том, какие данные собираем
- Parental access к данным детей
- Data security
- Data retention minimization

**Implementation:**
- Parental consent flow (см. pilot_plan.md)
- Clear disclosure в Privacy Policy
- Parental dashboard с full access
- Deletion mechanism

### 8.3 California CCPA/CPRA

**Ключевые требования:**
- Right to know, delete, opt-out
- Do Not Sell My Personal Information (мы не продаём данные)
- Non-discrimination

**Implementation:**
- Privacy page с CCPA disclosures
- "Do Not Sell" link (даже если не applicable)
- Request form для California residents

### 8.4 UK Age Appropriate Design Code

**Ключевые требования:**
- High privacy settings by default
- Minimal data collection
- No profiling для детей
- No geolocation tracking (если не необходимо)
- Transparent privacy info

**Implementation:**
- Privacy by default
- No ads
- No location tracking
- Clear, child-friendly language в Privacy Policy

---

## 9. Third-Party Security

### 9.1 Vendor Due Diligence

**Перед использованием third-party service:**
- Security assessment (questionnaire)
- Review privacy policy и terms
- Check certifications (SOC 2, ISO 27001)
- Data Processing Agreement (DPA)

**Критерии:**
- ✅ SOC 2 или ISO 27001 certified
- ✅ GDPR compliant (если EU data)
- ✅ Regular security audits
- ✅ Clear incident response process
- ✅ Encryption at rest и in transit

### 9.2 Data Processing Agreements (DPA)

**Обязательны для всех processors:**
- AWS, Google Cloud, Stripe, SendGrid, Twilio, OpenAI, etc.

**Ключевые clauses:**
- Processor обязуется обрабатывать данные только по инструкциям Controller (Rork-Kiku)
- Security measures (encryption, access control)
- Sub-processor notification
- Data breach notification
- Audit rights
- Data deletion upon termination

### 9.3 Monitoring Third-Party Services

**Alerts при:**
- Third-party service outage
- Unusual API usage
- Security advisories (CVEs)

**Regular reviews:**
- Quarterly: review vendor contracts и compliance
- Annual: re-assess vendor security posture
- Ad-hoc: если vendor has security incident

---

## 10. Security Checklist (Pre-Launch)

**Before launching to production:**

- [ ] TLS 1.3 enabled для всех endpoints
- [ ] Certificate от trusted CA (Let's Encrypt, AWS ACM)
- [ ] HSTS header enabled
- [ ] Database encryption at rest enabled
- [ ] S3 encryption enabled
- [ ] KMS keys созданы и configured
- [ ] IAM roles с least privilege
- [ ] Security groups configured (allow only necessary ports)
- [ ] VPC network segmentation
- [ ] Bastion host для SSH access (не direct access к production)
- [ ] MFA enabled для всех admin accounts
- [ ] Strong password policy (12+ chars, complexity)
- [ ] Rate limiting на API endpoints
- [ ] Input validation на всех endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (content security policy)
- [ ] CSRF protection
- [ ] Secrets stored в AWS Secrets Manager или environment variables (не в code)
- [ ] API keys rotated periodically
- [ ] Audit logging enabled
- [ ] Monitoring и alerts configured
- [ ] Incident response playbook documented
- [ ] Security contact email published
- [ ] Privacy Policy и Terms of Service reviewed by lawyer
- [ ] GDPR compliance assessment completed
- [ ] COPPA compliance assessment completed
- [ ] Penetration test completed (или scheduled post-launch)
- [ ] Code review для security issues
- [ ] Dependency scan для known vulnerabilities
- [ ] Docker images scanned (Trivy, Snyk)
- [ ] Backup и disaster recovery tested
- [ ] Team trained on security best practices

---

## 11. Security Contacts

**Internal:**
- Security Lead: [SECURITY_LEAD_EMAIL]
- CTO: [CTO_EMAIL]
- DPO (если назначен): [DPO_EMAIL]

**External:**
- Security Researchers: security@rorkkiku.com
- User Security Concerns: support@rorkkiku.com

**Emergency:**
- On-call rotation: [PAGERDUTY_LINK] или [PHONE_NUMBER]

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
