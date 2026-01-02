# Дизайн безопасности kiku

## Обзор

Безопасность является критическим приоритетом для kiku, так как система работает с чувствительными данными детей и их коммуникациями. Данный документ описывает детальную архитектуру безопасности на всех уровнях системы.

## Принципы безопасности

### Defense in Depth (Эшелонированная защита)
Множественные уровни защиты на каждом слое:
- Клиент (мобильное приложение)
- Сеть (TLS, VPN)
- API Gateway (authentication, authorization)
- Application Layer (input validation, business logic)
- Data Layer (encryption, access control)

### Zero Trust Architecture
- Не доверять никому по умолчанию
- Verify identity на каждом запросе
- Least privilege access
- Microsegmentation в Kubernetes

### Privacy by Design
- Минимизация сбора данных
- Прозрачность в использовании данных
- User control над своими данными
- Data retention policies

### Security by Default
- Безопасные настройки по умолчанию
- Opt-in для опциональных features
- Regular security updates
- Automated patching где возможно

## Шифрование данных

### Шифрование в покое (Data at Rest)

#### 1. Мобильное приложение (Client-side)

**AsyncStorage encryption:**
```typescript
// Библиотека: expo-secure-store или react-native-encrypted-storage
import * as SecureStore from 'expo-secure-store';

// Хранение ключей шифрования
await SecureStore.setItemAsync('encryption_key', generatedKey, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED
});

// Шифрование данных перед сохранением
const encryptedData = await encryptAES256(data, encryptionKey);
await AsyncStorage.setItem('user_data', encryptedData);
```

**Алгоритм:** AES-256-GCM
**Ключи:** Генерируются на устройстве, хранятся в Keychain (iOS) / KeyStore (Android)
**Key derivation:** PBKDF2 с 10,000 iterations для производных ключей

#### 2. Backend базы данных

**PostgreSQL encryption:**
- **Method:** AWS RDS encryption or pgcrypto extension
- **Algorithm:** AES-256
- **Keys:** AWS KMS managed keys с automatic rotation
- **Tables для шифрования:**
  - `users.email` - PII
  - `users.phone` - PII
  - `messages.content` - sensitive content
  - `sos_alerts.location` - геолокация
  - `profiles.sensitive_data` - любые sensitive fields

**Example pgcrypto:**
```sql
-- Создание ключа шифрования (хранится в AWS Secrets Manager)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Шифрование при вставке
INSERT INTO messages (content, encrypted_content)
VALUES ('plain text', pgp_sym_encrypt('plain text', 
  current_setting('app.encryption_key')));

-- Дешифрование при чтении
SELECT pgp_sym_decrypt(encrypted_content, 
  current_setting('app.encryption_key')) as content
FROM messages;
```

#### 3. Object Storage (S3)

**S3 Encryption:**
- **Method:** Server-Side Encryption with KMS (SSE-KMS)
- **Keys:** Customer Managed Keys (CMK) в AWS KMS
- **Bucket policy:** Enforce encryption headers
- **Client-side encryption:** Для особо чувствительных медиа

**S3 Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::kiku-media-prod/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    }
  ]
}
```

### Шифрование в передаче (Data in Transit)

#### 1. Client-Server Communication

**TLS 1.3 Configuration:**
```nginx
# NGINX configuration
ssl_protocols TLSv1.3;
ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Certificate Pinning (Mobile App):**
```typescript
// expo-constants для получения public keys
import { Asset } from 'expo-asset';

const pinnedPublicKeys = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', // Primary cert
  'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=', // Backup cert
];

// Axios configuration with certificate pinning
const axiosInstance = axios.create({
  baseURL: 'https://api.kiku-app.com',
  // В production использовать react-native-ssl-pinning
});
```

**Рекомендация:** Использовать библиотеку `react-native-ssl-pinning` для production

#### 2. Service-to-Service Communication

**mTLS (Mutual TLS) в Kubernetes:**
```yaml
# Istio configuration для mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: kiku-services
spec:
  mtls:
    mode: STRICT # Требовать mTLS для всех сервисов
```

**API Gateway → Backend Services:**
- VPC internal communication только
- Private subnets для backend
- Security groups разрешают трафик только от API Gateway
- Optional: VPN или AWS PrivateLink для дополнительной изоляции

### End-to-End Encryption (E2EE)

**Сценарий использования:** Для будущих features (например, приватные заметки родителей)

**Протокол:** Signal Protocol или libsodium

**Key Exchange:**
1. Каждый пользователь генерирует пару ключей (public/private)
2. Public keys публикуются на сервере
3. Private keys никогда не покидают устройство
4. Для отправки сообщения: шифрование с public key получателя
5. Получатель дешифрует с помощью своего private key

**Библиотека:** `libsodium-wrappers` или `@privacyresearch/ed25519-signal-key-derivation`

## Управление ключами шифрования

### AWS KMS (Key Management Service)

**Архитектура ключей:**

```
KMS Root Key (Customer Master Key)
├── kiku-prod-rds-key (для RDS encryption)
├── kiku-prod-s3-key (для S3 encryption)
├── kiku-prod-backup-key (для backups)
└── kiku-prod-app-key (для application-level encryption)
```

**KMS Key Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key by RDS",
      "Effect": "Allow",
      "Principal": {
        "Service": "rds.amazonaws.com"
      },
      "Action": [
        "kms:Decrypt",
        "kms:CreateGrant"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow application to use the key",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:role/kiku-app-role"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "*"
    }
  ]
}
```

**Key Rotation:**
- Automatic rotation: каждые 365 дней (AWS managed)
- Manual rotation: при подозрении на компрометацию
- Backward compatibility: AWS KMS хранит старые версии ключей

### HashiCorp Vault (Рекомендация для Production)

**Преимущества над KMS:**
- Dynamic secrets (генерация на лету)
- Secret versioning и rollback
- Better audit logging
- Multi-cloud support

**Vault Architecture:**
```
HashiCorp Vault Cluster (High Availability)
├── Secrets Engines:
│   ├── KV (Key-Value) - API keys, credentials
│   ├── Database - Dynamic DB credentials
│   ├── PKI - Certificate generation
│   └── Transit - Encryption as a Service
├── Auth Methods:
│   ├── Kubernetes (для pods)
│   ├── AWS IAM (для EC2 instances)
│   └── JWT (для CI/CD)
└── Audit Backend:
    └── CloudWatch Logs / Elasticsearch
```

**Vault Integration Example:**
```typescript
// Получение dynamic database credentials
import Vault from 'node-vault';

const vault = Vault({
  apiVersion: 'v1',
  endpoint: 'https://vault.kiku-app.com',
  token: process.env.VAULT_TOKEN // Инжектируется в pod
});

// Dynamic credentials с TTL 1 час
const dbCreds = await vault.read('database/creds/kiku-app-role');
const { username, password } = dbCreds.data;

// Использование credentials для подключения к БД
const pool = new Pool({
  user: username,
  password: password,
  host: 'postgres.kiku-app.com',
  database: 'kiku_prod'
});

// Credentials автоматически истекают через 1 час и ревокатся Vault
```

**Transit Secrets Engine (Encryption as a Service):**
```typescript
// Шифрование данных через Vault API
const encryptResponse = await vault.write('transit/encrypt/kiku-app', {
  plaintext: Buffer.from('sensitive data').toString('base64')
});
const ciphertext = encryptResponse.data.ciphertext;

// Дешифрование
const decryptResponse = await vault.write('transit/decrypt/kiku-app', {
  ciphertext: ciphertext
});
const plaintext = Buffer.from(decryptResponse.data.plaintext, 'base64').toString();
```

### Key Rotation Strategy

**Rotation Schedule:**
- **Encryption keys:** 12 месяцев (автоматически)
- **API keys:** 90 дней (вручную или автоматически)
- **Database passwords:** 30 дней (dynamic с Vault)
- **JWT signing keys:** 6 месяцев
- **TLS certificates:** 90 дней (Let's Encrypt автоматически)

**Rotation Process:**
1. Генерация нового ключа
2. Dual-key period: старый и новый ключи активны
3. Все новые данные шифруются новым ключом
4. Старые данные остаются зашифрованными старым ключом (lazy re-encryption)
5. Через grace period (30 дней) старый ключ деактивируется
6. Audit log rotation события

## Log Retention и Security Logging

### Типы логов

#### 1. Application Logs
**Содержание:**
- HTTP requests/responses (без sensitive data)
- Service errors и exceptions
- Performance metrics

**Retention:** 30 дней
**Storage:** CloudWatch Logs / ELK Stack

#### 2. Security Audit Logs
**Содержание:**
- Authentication events (успешные/неудачные логины)
- Authorization failures
- API key usage
- Admin actions
- Configuration changes
- Data access (read/write/delete sensitive data)

**Retention:** 7 лет (compliance requirement)
**Storage:** S3 Glacier (immutable, encrypted)

#### 3. Compliance Logs
**Содержание:**
- Parental consent actions
- Data deletion requests (GDPR)
- Data export requests
- Privacy policy acceptances
- Terms of service acceptances

**Retention:** 7 лет minimum (legal requirement)
**Storage:** S3 Glacier (immutable, encrypted, versioned)

#### 4. AI Analysis Logs
**Содержание:**
- AI model requests и responses
- Risk scores calculated
- False positives/negatives feedback
- Model performance metrics

**Retention:** 90 дней (для model retraining)
**Storage:** CloudWatch Logs → S3 (для ML pipeline)

### Sensitive Data в логах

**Правило:** НИКОГДА не логировать:
- Пароли (даже хешированные)
- JWT токены
- API keys
- Encryption keys
- Credit card numbers
- Full email addresses (замаскировать: u***@example.com)
- Детский контент (сообщения, изображения)

**Redaction Strategy:**
```typescript
// Log sanitization middleware
function sanitizeLogData(data: any): any {
  const sensitiveFields = ['password', 'token', 'api_key', 'secret'];
  
  const sanitized = { ...data };
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  // Mask email
  if (sanitized.email) {
    sanitized.email = maskEmail(sanitized.email);
  }
  
  return sanitized;
}

// Usage
logger.info('User login', sanitizeLogData(request.body));
```

### Log Forwarding Architecture

```
Application Pods
    ↓
Fluentd / Fluent Bit (DaemonSet in Kubernetes)
    ↓
    ├─→ CloudWatch Logs (real-time monitoring)
    ├─→ Elasticsearch (search и analysis)
    └─→ S3 (long-term retention, compliance)
        ↓
    S3 Lifecycle Policy
        ↓
    S3 Glacier (after 90 days)
```

### Structured Logging

**Format:** JSON для легкого parsing

```json
{
  "timestamp": "2026-01-02T10:15:30.123Z",
  "level": "INFO",
  "service": "api-gateway",
  "trace_id": "abc123def456",
  "user_id": "user_12345",
  "event": "api_request",
  "method": "POST",
  "path": "/api/v1/chat/analyze",
  "status_code": 200,
  "latency_ms": 145,
  "ip_address": "10.0.1.42"
}
```

## Incident Response Playbook

### Severity Levels

**P0 - Critical (Response: Immediate):**
- Data breach (доступ к детским данным)
- System-wide outage
- Active security attack (DDoS, intrusion)
- Loss of encryption keys

**P1 - High (Response: < 1 hour):**
- Service degradation affecting > 50% users
- Partial data exposure
- Vulnerability exploitation attempts
- Authentication system issues

**P2 - Medium (Response: < 4 hours):**
- Service degradation affecting < 50% users
- Non-critical security vulnerability
- Suspicious activity detected
- Compliance violation risk

**P3 - Low (Response: < 24 hours):**
- Minor bugs not affecting security
- Performance issues
- Configuration issues

### Incident Response Process

#### Phase 1: Detection

**Automated Detection:**
- SIEM alerts (Splunk, Sumo Logic, или AWS Security Hub)
- CloudWatch Alarms
- Prometheus alerts
- Intrusion Detection System (IDS)

**Manual Detection:**
- Bug reports от пользователей
- Security researcher disclosure
- Internal audit findings

**Alert Channels:**
- PagerDuty (для on-call engineers)
- Slack #security-incidents channel
- Email to security@kiku-app.com

#### Phase 2: Assessment (First 15 minutes)

**Incident Commander Checklist:**
```
[ ] Verify incident severity
[ ] Identify affected systems/services
[ ] Estimate number of affected users
[ ] Determine if data breach occurred
[ ] Activate incident response team
[ ] Start incident timeline log
[ ] Create incident Slack channel (#incident-YYYY-MM-DD-brief-description)
```

**Initial Questions:**
- What happened?
- When did it happen?
- What systems are affected?
- Is user data at risk?
- Is the attacker still active?

#### Phase 3: Containment (First 1 hour)

**Immediate Actions:**
```bash
# 1. Изолировать скомпрометированные системы
kubectl scale deployment compromised-service --replicas=0

# 2. Блокировать подозрительные IP
aws waf update-ip-set --ip-set-id XXX --updates Action=INSERT,IPAddress=X.X.X.X/32

# 3. Rotate credentials
aws secretsmanager rotate-secret --secret-id kiku-prod-db-password

# 4. Enable enhanced logging
aws cloudtrail create-trail --name incident-trail --s3-bucket-name incident-logs

# 5. Take snapshots для forensics
aws ec2 create-snapshot --volume-id vol-XXX --description "Incident forensics"
```

**Communication:**
- Update #incident channel every 15 minutes
- Notify executive team (CTO, CEO) для P0/P1
- Prepare holding statement для users (если потребуется)

#### Phase 4: Eradication (Hours 1-4)

**Root Cause Analysis:**
- Review logs (CloudWatch, ELK, Vault audit)
- Check recent deployments (git log, CI/CD history)
- Analyze attack vectors (network logs, WAF logs)
- Interview engineers (who deployed what when)

**Remediation Actions:**
```
[ ] Patch vulnerability
[ ] Update firewall rules
[ ] Revoke compromised credentials
[ ] Re-deploy affected services
[ ] Clear malicious data/code
[ ] Verify integrity of systems
```

#### Phase 5: Recovery (Hours 4-24)

**Service Restoration:**
```
[ ] Restore services in controlled manner
[ ] Verify each service health before proceeding
[ ] Monitor closely for recurrence
[ ] Run security scan post-recovery
[ ] Update runbooks based on learnings
```

**User Communication (если потребуется):**
```
Subject: Security Incident Notification - kiku

Dear kiku users,

We are writing to inform you about a security incident that occurred on [DATE].

What happened:
[Brief description without technical jargon]

What data was affected:
[Specific data types, if any]

What we've done:
[Actions taken to fix and prevent recurrence]

What you should do:
[Actions for users, e.g., reset password]

We sincerely apologize for any inconvenience.

The kiku Security Team
```

#### Phase 6: Post-Mortem (Within 5 business days)

**Post-Mortem Document Template:**
```markdown
# Incident Post-Mortem: [Brief Description]

**Date:** YYYY-MM-DD
**Severity:** P0/P1/P2/P3
**Duration:** X hours
**Affected Users:** X users / X%

## Timeline
- HH:MM - [Event]
- HH:MM - [Event]
...

## Root Cause
[Detailed explanation]

## Impact
- Users affected: X
- Data exposed: [Yes/No - details]
- Downtime: X minutes
- Financial impact: $X

## What went well
- [Point 1]
- [Point 2]

## What went wrong
- [Point 1]
- [Point 2]

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Lessons Learned
[Key takeaways]
```

**Distribution:**
- Internal: All engineering team, executive team
- External: Regulatory bodies (если требуется по GDPR - 72 hours)

### Incident Response Team

**Roles:**

**Incident Commander (IC):**
- Decision maker
- Координирует response efforts
- Owns communication
- Usually: Senior Engineer или Engineering Manager

**Technical Lead:**
- Technical investigation
- Implements fixes
- Coordinates with engineers
Usually: Senior/Staff Engineer

**Communications Lead:**
- Internal communication (Slack, email)
- External communication (users, press если необходимо)
- Regulatory notifications
- Usually: Product Manager or Customer Success Lead

**Security Engineer:**
- Security analysis
- Forensics
- Vulnerability assessment
- Usually: Security Engineer (если есть) or Senior Backend Engineer

**Legal/Compliance:**
- Legal implications
- Regulatory requirements (GDPR, COPPA)
- User privacy concerns
- Usually: Legal counsel or Compliance Officer

### Incident Response Contacts

**Internal:**
```
Incident Commander (On-call): +X-XXX-XXX-XXXX
Security Team: security@kiku-app.com
CTO: cto@kiku-app.com (для P0/P1)
CEO: ceo@kiku-app.com (для P0 data breach)
```

**External:**
```
AWS Support (Enterprise): 1-800-xxx-xxxx
Security Researcher Contact: security@kiku-app.com
Bug Bounty Platform: https://bugcrowd.com/kiku
Law Enforcement (при необходимости): Local cyber crime unit
```

**Regulatory:**
```
GDPR Data Protection Authority: [Contact for your jurisdiction]
COPPA FTC: https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule
```

## Security Testing

### Penetration Testing

**Frequency:** Quarterly (или после major releases)

**Scope:**
- Web application (API)
- Mobile application (iOS/Android)
- Infrastructure (AWS/GCP)
- Social engineering (optional)

**Methodology:** OWASP Testing Guide

**Vendor:** Hire 3rd party security firm (recommended: HackerOne, Cobalt, Synack)

**Deliverable:** Detailed report с vulnerabilities, severity, remediation

### Vulnerability Scanning

**Tools:**
- **Code:** Snyk, Dependabot (для dependencies)
- **Containers:** Trivy, Clair (для Docker images)
- **Infrastructure:** AWS Inspector, Nessus
- **Web App:** OWASP ZAP, Burp Suite

**Frequency:**
- Code: On every commit (CI/CD)
- Containers: On every build
- Infrastructure: Weekly
- Web App: Weekly

**Process:**
```
Scan → Triage → Prioritize → Fix → Verify
```

**SLA для исправления:**
- Critical: 24 hours
- High: 7 days
- Medium: 30 days
- Low: 90 days (или next release)

### Bug Bounty Program

**Platform:** HackerOne или Bugcrowd

**Scope In:**
- *.kiku-app.com
- Mobile apps (iOS/Android)
- API endpoints

**Scope Out:**
- Social engineering
- Physical attacks
- DDoS attacks
- Non-security bugs

**Rewards:**
- Critical: $1,000 - $5,000
- High: $500 - $1,000
- Medium: $250 - $500
- Low: $50 - $250

**Rules:**
- No testing on production without permission
- Do not access user data
- Report findings privately
- Allow reasonable time to fix (90 days)

## Security Training

### Developer Security Training

**Frequency:** Onboarding + quarterly refresher

**Topics:**
- OWASP Top 10
- Secure coding practices
- Common vulnerabilities (SQL injection, XSS, CSRF)
- Cryptography basics
- Authentication/Authorization best practices
- Privacy regulations (GDPR, COPPA)
- Incident response procedures

**Format:**
- Online courses (Pluralsight, Udemy)
- Internal workshops
- Code review sessions
- Capture The Flag (CTF) events

### Security Champions Program

**Goal:** Security advocates в каждой команде

**Responsibilities:**
- Code review с security perspective
- Promote security best practices
- Liaison между engineering и security team
- Stay updated on latest threats

**Training:** Monthly security updates, access to advanced security courses

## Compliance Monitoring

### Automated Compliance Checks

**Tools:**
- AWS Config Rules (для infrastructure compliance)
- OPA (Open Policy Agent) для Kubernetes policies
- SonarQube для code quality и security

**Checks:**
```yaml
# AWS Config Rule example: Ensure S3 buckets are encrypted
- name: s3-bucket-encryption-enabled
  source: AWS_MANAGED_RULE
  trigger:
    - ConfigurationItemChangeNotification
    - OversizedConfigurationItemChangeNotification
  parameters:
    expectedEncryption: AES256
```

**Alerts:** Slack channel #compliance-alerts

### Manual Compliance Audits

**Frequency:** Annually (или перед major fundraising)

**Auditor:** 3rd party compliance firm (SOC 2, ISO 27001)

**Deliverables:**
- Audit report
- Compliance certificate (if passed)
- Remediation plan (if issues found)

## Резюме

**Security Maturity Roadmap:**

**MVP Phase (Months 1-3):**
✅ TLS encryption
✅ Basic authentication (JWT)
✅ Input validation
✅ Dependency scanning
✅ Security logging

**Growth Phase (Months 4-12):**
✅ Enhanced monitoring (SIEM)
✅ Penetration testing
✅ Bug bounty program
✅ Incident response playbook
✅ Security training

**Scale Phase (Months 13-24):**
✅ SOC 2 Type II certification
✅ Advanced threat detection (ML-based)
✅ Red team exercises
✅ Security automation (SOAR)
✅ Zero Trust implementation

---

**Важно:** Безопасность - это непрерывный процесс, требующий постоянного внимания, обновлений и улучшений. Данный документ должен пересматриваться и обновляться ежеквартально.

**Контакты:**
- Security Lead: security@kiku-app.com
- Emergency Hotline: +X-XXX-XXX-XXXX (24/7)

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (Draft)
