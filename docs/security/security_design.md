# Дизайн безопасности Rork-Kiku

## Обзор

Безопасность — критический приоритет для Rork-Kiku, учитывая что платформа работает с данными детей и подпадает под COPPA (Children's Online Privacy Protection Act) и GDPR. Этот документ описывает ключевые аспекты дизайна безопасности системы.

## Принципы безопасности

1. **Defense in Depth** — многоуровневая защита
2. **Least Privilege** — минимальные необходимые права
3. **Zero Trust** — проверка на каждом уровне
4. **Privacy by Design** — безопасность встроена с начала
5. **Transparency** — понятные политики для пользователей

## Шифрование

### В транзите (In Transit)

**External Traffic** (Client ↔ Backend):
- **TLS 1.3** для всех HTTPS соединений
- Сертификаты от Let's Encrypt или AWS ACM
- Perfect Forward Secrecy (PFS)
- HSTS (HTTP Strict Transport Security) enabled

**Internal Traffic** (Service ↔ Service):
- **mTLS** (mutual TLS) между микросервисами
- Service Mesh: Istio или Linkerd
- Автоматическая ротация сертификатов (cert-manager)

**Configuration**:
```yaml
# Nginx/Ingress configuration
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256';
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### В покое (At Rest)

**База данных (PostgreSQL)**:
- AWS RDS encryption enabled
- AES-256 шифрование
- Шифрование backups
- Transparent Data Encryption (TDE)

**Object Storage (S3)**:
```json
{
  "BucketEncryption": {
    "ServerSideEncryptionConfiguration": [
      {
        "ServerSideEncryptionByDefault": {
          "SSEAlgorithm": "aws:kms",
          "KMSMasterKeyID": "arn:aws:kms:region:account:key/key-id"
        },
        "BucketKeyEnabled": true
      }
    ]
  }
}
```

**Application-level encryption**:
- PII (Personally Identifiable Information) шифруется на уровне приложения
- Encryption перед записью в БД
- Используется отдельный KMS ключ для PII

**Пример**:
```typescript
// Шифрование PII перед сохранением
async function encryptPII(data: string): Promise<string> {
  const kms = new AWS.KMS();
  const result = await kms.encrypt({
    KeyId: process.env.PII_KMS_KEY_ID,
    Plaintext: Buffer.from(data, 'utf8')
  }).promise();
  return result.CiphertextBlob.toString('base64');
}

// Расшифровка при чтении
async function decryptPII(encrypted: string): Promise<string> {
  const kms = new AWS.KMS();
  const result = await kms.decrypt({
    CiphertextBlob: Buffer.from(encrypted, 'base64')
  }).promise();
  return result.Plaintext.toString('utf8');
}
```

## Key Management Service (KMS)

### AWS KMS Keys

```
Keys структура:
├── rork-kiku/master                # Master key (CMK)
├── rork-kiku/database              # Database encryption
├── rork-kiku/s3-storage            # S3 bucket encryption
├── rork-kiku/jwt-signing           # JWT token signing
├── rork-kiku/pii-encryption        # PII field-level encryption
└── rork-kiku/backup                # Backup encryption
```

### Ротация ключей

**Автоматическая ротация** (AWS KMS):
- Enabled для всех CMK (Customer Master Keys)
- Частота: каждые 365 дней
- Старые версии сохраняются для расшифровки старых данных

**Manual rotation** (JWT signing keys):
```bash
# Каждые 90 дней
1. Генерация нового ключа
2. Добавление в KMS
3. Обновление конфигурации backend (dual-key период)
4. Переход на новый ключ
5. Деактивация старого ключа через 30 дней
```

**Terraform конфигурация**:
```hcl
resource "aws_kms_key" "rork_kiku_master" {
  description             = "Rork-Kiku Master Key"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Project     = "rork-kiku"
    Environment = "production"
    Compliance  = "COPPA,GDPR"
  }
}

resource "aws_kms_alias" "rork_kiku_master" {
  name          = "alias/rork-kiku/master"
  target_key_id = aws_kms_key.rork_kiku_master.key_id
}
```

### Key Access Control

**IAM Policy** (example):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBackendDecrypt",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:role/rork-kiku-backend"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```

## Аутентификация и авторизация

### OAuth 2.0 + JWT Flow

```
1. User Login:
   POST /api/v1/auth/login
   { email, password }
   
2. Backend:
   - Проверка credentials (bcrypt hash)
   - Генерация JWT access token (exp: 15min)
   - Генерация refresh token (exp: 7 days)
   - Сохранение refresh token в Redis
   
3. Response:
   {
     accessToken: "eyJhbGci...",
     refreshToken: "refresh_abc...",
     expiresIn: 900
   }

4. Mobile App:
   - Сохраняет tokens в Expo SecureStore
   - Включает в каждый запрос: Authorization: Bearer <accessToken>
   
5. Token Refresh:
   POST /api/v1/auth/refresh
   { refreshToken }
   → Новый accessToken
```

### JWT Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id-123"
  },
  "payload": {
    "sub": "user_123",
    "role": "parent",
    "permissions": ["read:children", "write:parental_controls"],
    "iat": 1704182400,
    "exp": 1704183300
  }
}
```

**Signing**: RSA-2048 (private key в KMS)

### RBAC (Role-Based Access Control)

**Roles**:
```yaml
parent:
  permissions:
    - read:own_children
    - write:parental_controls
    - read:content_history
    - write:parental_requests

child:
  permissions:
    - read:own_profile
    - write:content_requests
    - read:whitelisted_sites

moderator:
  permissions:
    - read:moderation_queue
    - write:moderation_decisions
    - read:all_content_checks

admin:
  permissions:
    - "*"  # Full access
```

**Middleware**:
```typescript
// Express middleware для проверки permissions
function requirePermission(permission: string) {
  return async (req, res, next) => {
    const token = extractToken(req);
    const decoded = await verifyJWT(token);
    
    if (!decoded.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    req.user = decoded;
    next();
  };
}

// Использование
app.get('/api/v1/children/:id', 
  requirePermission('read:own_children'),
  async (req, res) => {
    // Handler
  }
);
```

## SIEM (Security Information and Event Management)

### Логирование безопасности

**События для логирования**:
```
1. Authentication:
   - Login attempts (success/failure)
   - Password resets
   - Token refresh
   - Logout

2. Authorization:
   - Permission denied events
   - Role changes
   - Unauthorized access attempts

3. Data Access:
   - PII data access
   - Child profile views/edits
   - Content history queries

4. Suspicious Activity:
   - Rate limit violations
   - Multiple failed login attempts
   - Unusual API patterns
   - GeoIP mismatches (if enabled)
```

**Log Format** (JSON):
```json
{
  "timestamp": "2026-01-02T08:00:00Z",
  "level": "warn",
  "event": "auth.login.failed",
  "userId": "user_123",
  "ip": "192.168.1.100",
  "userAgent": "RorkKiku/1.0.0 iOS",
  "reason": "invalid_password",
  "attemptCount": 3,
  "tags": ["security", "authentication"]
}
```

### Alerting Rules

**PagerDuty / OpsGenie alerts**:
```yaml
- name: "Multiple Failed Logins"
  condition: "count(auth.login.failed) > 5 in 5m per IP"
  severity: "high"
  action: "Block IP for 1h"

- name: "Unauthorized Access Spike"
  condition: "count(http.403) > 100 in 1m"
  severity: "critical"
  action: "Alert security team"

- name: "PII Data Breach Attempt"
  condition: "count(pii.access.denied) > 10 in 10m"
  severity: "critical"
  action: "Alert CISO + Auto-block"

- name: "Unusual Admin Activity"
  condition: "admin.action after_hours"
  severity: "medium"
  action: "Log and notify security team"
```

### Log Retention Policy

```
Tier 1 (Hot - Elasticsearch):
- Duration: 7 days
- Access: Real-time search
- Use: Debugging, real-time alerts

Tier 2 (Warm - Elasticsearch):
- Duration: 30 days
- Access: Searchable (slower)
- Use: Investigations, analytics

Tier 3 (Cold - S3):
- Duration: 1 year
- Access: Archived (restore required)
- Use: Compliance, forensics

Tier 4 (Glacier):
- Duration: 7 years (compliance requirement)
- Access: Rare (legal requests only)
- Use: Legal compliance (GDPR/COPPA)
```

## Incident Response Playbook

### Классификация инцидентов

**Severity Levels**:
```
P0 (Critical):
- Data breach (PII leak)
- Complete system outage
- Active cyber attack
Response: Immediate (< 15 min)

P1 (High):
- Partial data exposure
- Authentication bypass discovered
- Critical service degradation
Response: < 1 hour

P2 (Medium):
- Non-PII data leak
- Suspicious activity pattern
- Security misconfiguration
Response: < 4 hours

P3 (Low):
- Minor vulnerability
- Policy violation
- Security alert (non-critical)
Response: < 24 hours
```

### Response Workflow

```
1. DETECTION
   ├─> Automated alert (SIEM/monitoring)
   ├─> User report
   └─> Security audit finding

2. TRIAGE
   ├─> On-call engineer assesses severity
   ├─> Escalate if P0/P1
   └─> Create incident ticket

3. CONTAINMENT
   ├─> Isolate affected systems
   ├─> Block malicious IPs/users
   ├─> Revoke compromised credentials
   └─> Enable enhanced monitoring

4. INVESTIGATION
   ├─> Analyze logs and metrics
   ├─> Identify root cause
   ├─> Assess impact (data, users)
   └─> Document timeline

5. ERADICATION
   ├─> Patch vulnerability
   ├─> Remove malicious code/access
   ├─> Rotate compromised keys
   └─> Deploy fixes

6. RECOVERY
   ├─> Restore services
   ├─> Verify security posture
   ├─> Resume normal operations
   └─> Monitor closely

7. POST-MORTEM
   ├─> Write detailed report
   ├─> Identify lessons learned
   ├─> Update runbooks
   └─> Implement preventive measures
```

### Contacts (Escalation)

```
[TO BE FILLED WITH ACTUAL CONTACTS]

L1 - On-call Engineer:
- PagerDuty rotation
- Response: All P2/P3, initial triage for P0/P1

L2 - Security Lead:
- Email: [SECURITY_LEAD_EMAIL]
- Phone: [PHONE]
- Response: All P0/P1, escalated P2

L3 - CTO / CISO:
- Email: [CTO_EMAIL]
- Phone: [PHONE]
- Response: P0, critical P1

External:
- Legal Counsel: [LEGAL_EMAIL]
- PR/Communications: [PR_EMAIL]
- Law Enforcement: (if required by law)
```

### Example Playbooks

#### Playbook: Data Breach (P0)

```markdown
1. Immediate Actions (< 15 min):
   - [ ] Alert security team via PagerDuty
   - [ ] Isolate affected systems
   - [ ] Enable detailed logging
   - [ ] Preserve evidence (snapshots)

2. Assessment (< 1 hour):
   - [ ] Identify scope (which data, how many users)
   - [ ] Determine if PII was exposed
   - [ ] Check if data was exfiltrated
   - [ ] Document initial findings

3. Containment (< 2 hours):
   - [ ] Revoke all access tokens (force re-login)
   - [ ] Rotate all secrets and keys
   - [ ] Block attack vectors
   - [ ] Notify affected users (if confirmed)

4. Legal/Compliance (< 24 hours):
   - [ ] Notify legal counsel
   - [ ] Determine notification requirements (GDPR: 72h)
   - [ ] Prepare user communications
   - [ ] File required breach reports

5. Recovery:
   - [ ] Deploy security patches
   - [ ] Enhanced monitoring for 30 days
   - [ ] Conduct security audit
   - [ ] Update security policies
```

## Penetration Testing Plan

### Testing Schedule

```
Pre-Launch:
- Full penetration test before production release
- Scope: All systems (mobile app, backend, infrastructure)
- Duration: 2-3 weeks
- Provider: External security firm (recommend: [LIST_PROVIDERS])

Ongoing:
- Quarterly penetration tests (light)
- Annual comprehensive security audit
- Continuous automated scanning (SAST/DAST)
```

### Testing Scope

**In Scope**:
- Mobile apps (iOS/Android)
- Backend API endpoints
- Admin panel
- Authentication/authorization flows
- Database access controls
- Cloud infrastructure (AWS)
- CI/CD pipeline

**Out of Scope**:
- Social engineering
- Physical security
- DoS/DDoS attacks (координируется отдельно с провайдером)

### Automated Security Scanning

**SAST (Static Application Security Testing)**:
```yaml
# GitHub Actions workflow
- name: SAST Scan
  uses: github/codeql-action/analyze
  with:
    languages: typescript, javascript
    queries: security-extended
```

**DAST (Dynamic Application Security Testing)**:
```yaml
# OWASP ZAP integration
- name: DAST Scan
  run: |
    docker run -v $(pwd):/zap/wrk/:rw \
      owasp/zap2docker-stable zap-baseline.py \
      -t https://staging.rork-kiku.com \
      -r zap-report.html
```

**Dependency Scanning**:
```bash
# Snyk or Dependabot
npm audit
snyk test
```

### Vulnerability Disclosure Policy

**Responsible Disclosure Program**:
1. Создать security@rork-kiku.com
2. Публикация policy на сайте
3. Bug bounty program (после production launch)

**Response Timeline**:
- Critical: 24 hours
- High: 7 days
- Medium: 30 days
- Low: 90 days

## Compliance

### COPPA (Children's Online Privacy Protection Act)

**Requirements**:
- [ ] Parental consent before collecting child data
- [ ] Clear privacy policy
- [ ] Parental access to child's data
- [ ] Option to delete child's data
- [ ] No marketing to children < 13
- [ ] Reasonable security measures

**Implementation**:
- Парент регистрируется и создает child profile = verifiable parental consent
- Privacy policy в app и на сайте
- Parent dashboard с доступом ко всем данным ребенка
- "Delete child account" функция
- Никакой рекламы детям

### GDPR (General Data Protection Regulation)

**Requirements**:
- [ ] Lawful basis for data processing (consent)
- [ ] Right to access (export data)
- [ ] Right to erasure ("right to be forgotten")
- [ ] Data portability
- [ ] Breach notification (72 hours)
- [ ] Data Protection Officer (если > 250 employees)

**Implementation**:
- Explicit consent при регистрации
- "Export my data" функция (JSON format)
- "Delete account" с полным удалением данных
- Data breach playbook (см. выше)

## Secrets Management

### Не хранить в коде

❌ **НИКОГДА**:
```javascript
// ПЛОХО!
const API_KEY = "sk_live_abc123...";
const DB_PASSWORD = "MyPassword123";
```

✅ **Правильно**:
```javascript
// Environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

### Хранение секретов

**Разработка (local)**:
```bash
# .env.local (в .gitignore!)
DATABASE_URL=postgresql://localhost:5432/rork_kiku_dev
JWT_SECRET=dev-secret-key-change-in-prod
```

**Staging/Production**:
```
Option 1: AWS Secrets Manager
- Секреты хранятся зашифрованными
- Автоматическая ротация
- IAM-based access control
- Versioning

Option 2: HashiCorp Vault
- Динамические секреты
- Lease management
- Audit logging

Option 3: Kubernetes Secrets
- Native K8s integration
- Зашифрованы в etcd
- Проще для небольших проектов
```

**GitHub Actions** (CI/CD):
```yaml
# Секреты хранятся в GitHub Secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

### Ротация секретов

**Частота**:
- Database passwords: 90 дней
- API keys: 90 дней
- JWT signing keys: 90 дней
- SSL/TLS certificates: автоматически (Let's Encrypt)

## Security Checklist (Pre-Launch)

### Infrastructure
- [ ] TLS 1.3 для всех соединений
- [ ] KMS keys configured и ротация enabled
- [ ] Database encryption enabled
- [ ] S3 bucket encryption enabled
- [ ] VPC configured с private subnets
- [ ] Security groups configured (least privilege)
- [ ] WAF rules configured (rate limiting, IP blocking)

### Application
- [ ] JWT authentication implemented
- [ ] RBAC permissions проверяются на каждом эндпоинте
- [ ] Input validation на всех inputs
- [ ] SQL injection protection (используется ORM)
- [ ] XSS protection (sanitize user inputs)
- [ ] CSRF protection (если есть web interface)
- [ ] Rate limiting configured

### Monitoring
- [ ] Prometheus + Grafana deployed
- [ ] Security alerts configured
- [ ] Log aggregation (ELK или Cloud Logging)
- [ ] PagerDuty integration
- [ ] Incident response playbook documented

### Compliance
- [ ] Privacy policy published
- [ ] Parental consent flow implemented
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] GDPR breach notification process
- [ ] Security audit completed

### Testing
- [ ] Penetration test completed
- [ ] Security vulnerabilities fixed
- [ ] Load testing passed
- [ ] Backup/restore tested

---

**Автор**: Security Team, Rork-Kiku  
**Версия**: 0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Требует ревью от CISO и юридической команды  
**Следующий ревью**: Перед production launch
