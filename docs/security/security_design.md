# Security Design для Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Статус**: ТРЕБУЕТ SECURITY AUDIT

---

## Обзор

Security Design описывает архитектуру безопасности Rork-Kiku с focus на защиту данных детей и соответствие COPPA/GDPR.

**Принципы безопасности**:
1. **Security by Design** — безопасность встроена с первого дня
2. **Defense in Depth** — многослойная защита
3. **Least Privilege** — минимальные необходимые права доступа
4. **Zero Trust** — не доверять по умолчанию, всегда проверять

---

## 1. Шифрование данных

### 1.1 Encryption in Transit

**TLS 1.3**:
- Все API endpoints используют HTTPS
- TLS 1.3 для всех внешних соединений
- Certificate от Let's Encrypt или AWS Certificate Manager

**Конфигурация**:
```nginx
ssl_protocols TLSv1.3;
ssl_ciphers 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS';
ssl_prefer_server_ciphers on;
```

**Mobile App**:
- Certificate pinning для защиты от MITM attacks
- Expo SecureStore для хранения tokens

### 1.2 Encryption at Rest

**Database (PostgreSQL)**:
- RDS encryption enabled (AES-256)
- Encrypted backups
- Transparent Data Encryption (TDE)

**Object Storage (S3)**:
- Server-Side Encryption (SSE-KMS)
- AES-256
- Encryption keys managed by AWS KMS

**Application-level**:
- PII fields encrypted в database (AES-256-GCM)
- Детские данные всегда encrypted

**Пример** (Node.js):
```typescript
import crypto from 'crypto';

function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted: string, key: Buffer): string {
  const [ivHex, tagHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## 2. Key Management Service (KMS)

### 2.1 AWS KMS

**Master Keys**:
- CMK (Customer Master Key) для каждого environment (dev/staging/prod)
- Automatic key rotation (annually)

**Data Encryption Keys (DEK)**:
- Generated для каждого encrypted object
- DEK encrypted by CMK

**Access Control**:
- IAM policies restrict кто может использовать keys
- CloudTrail logs всех key operations

**Пример IAM Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:123456789:key/abc-123",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com"
        }
      }
    }
  ]
}
```

### 2.2 Key Rotation

**Автоматическая ротация**:
- CMK: каждые 365 дней (AWS automatic)
- DEK: при каждом новом объекте
- API keys: каждые 90 дней

**Ручная ротация**:
- Application secrets: каждые 90 дней
- Database passwords: каждые 180 дней

---

## 3. Authentication & Authorization

### 3.1 OAuth2 / JWT

**Access Token**:
- JWT format
- Short-lived (15-30 минут)
- Payload: userId, role, exp

**Refresh Token**:
- Opaque token (не JWT)
- Long-lived (7-30 дней)
- Stored в database с userId mapping
- Rotation при каждом refresh

**Token Storage**:
- iOS: Keychain
- Android: Keystore
- Web: HttpOnly cookies (не localStorage)

**Пример JWT payload**:
```json
{
  "sub": "user123",
  "role": "parent",
  "iat": 1704200000,
  "exp": 1704201800
}
```

### 3.2 Multi-Factor Authentication (MFA)

**Для администраторов** (обязательно):
- TOTP (Time-based One-Time Password)
- Authy, Google Authenticator

**Для родителей** (опционально):
- SMS OTP
- Email OTP
- Authenticator app

### 3.3 Role-Based Access Control (RBAC)

**Роли**:
- **Parent**: доступ к детским профилям, настройкам
- **Child**: ограниченный доступ (только свой контент)
- **Moderator**: доступ к moderation dashboard
- **Admin**: полный доступ

**Permissions**:
```typescript
const permissions = {
  parent: ['read:own_children', 'write:own_children', 'delete:own_children'],
  child: ['read:own_content', 'write:own_content'],
  moderator: ['read:all_content', 'write:moderation_decisions'],
  admin: ['*']
};
```

---

## 4. SIEM & Monitoring

### 4.1 Security Information and Event Management

**Tools**:
- **AWS GuardDuty**: Threat detection
- **CloudWatch Logs**: Centralized logging
- **Splunk / ELK**: Log analysis (опционально)

**Alerting**:
- Unauthorized access attempts
- Unusual API traffic patterns
- Failed authentication (> 5 attempts)
- Sensitive data access

### 4.2 Log Retention

**Application logs**: 30 дней
**Security logs**: 1 год
**Audit logs** (COPPA): 2 года
**Compliance logs**: 7 лет (если требуется)

**Log format** (JSON):
```json
{
  "timestamp": "2026-01-02T12:00:00Z",
  "level": "INFO",
  "service": "backend",
  "userId": "user123",
  "action": "message.sent",
  "metadata": {
    "messageId": "msg456",
    "recipientId": "user789"
  }
}
```

### 4.3 Security Metrics

**Ключевые метрики**:
- Failed login attempts per hour
- API error rate (4xx, 5xx)
- Database query latency (спайки могут указывать на attack)
- Number of moderation blocks per day

**Dashboards**:
- Grafana для визуализации
- Alerts через PagerDuty / Opsgenie

---

## 5. Incident Response Playbook

### 5.1 Severity Levels

**SEV1 (Critical)**: 
- Data breach (PII leaked)
- Complete service outage
- Security exploit in production

**SEV2 (High)**:
- Partial service outage
- Suspicious activity detected
- Vulnerability discovered

**SEV3 (Medium)**:
- Performance degradation
- Non-critical bug

**SEV4 (Low)**:
- Minor issues

### 5.2 Incident Response Process

**Step 1: Detection** (0-15 minutes)
- Automated alert → PagerDuty → on-call engineer
- Manual report → support team → engineering

**Step 2: Assessment** (15-30 minutes)
- Determine severity
- Identify affected users/systems
- Document initial findings

**Step 3: Containment** (30-60 minutes)
- Isolate affected systems
- Block malicious IPs
- Rotate compromised credentials

**Step 4: Eradication** (1-4 hours)
- Remove malware / patch vulnerability
- Restore from clean backups
- Verify integrity

**Step 5: Recovery** (4-24 hours)
- Restore services
- Monitor for recurrence
- Verify functionality

**Step 6: Post-Mortem** (24-48 hours)
- Root cause analysis
- Document timeline
- Action items (prevent recurrence)
- Communication to stakeholders

### 5.3 Communication Plan

**Internal**:
- Slack #security channel → immediate
- Email to leadership → within 1 hour
- All-hands meeting → within 24 hours (if SEV1)

**External**:
- Users: email notification (if data breach)
- Regulators: FTC notification (COPPA), в течение 72 часов (GDPR)
- PR/Media: через CEO/PR team (if necessary)

**Пример уведомления пользователям**:
```
Subject: Important Security Update

Dear [User],

We recently discovered [issue description]. We have taken immediate action to [what we did].

What happened:
- [Brief explanation]

What we're doing:
- [Actions taken]

What you should do:
- [User actions, if any]

We take your privacy seriously and apologize for any concern this may cause.

Contact us: security@rork-kiku.com

Sincerely,
Rork-Kiku Security Team
```

---

## 6. Penetration Testing

### 6.1 Testing Schedule

**Internal testing**:
- Quarterly automated scans (OWASP ZAP, Burp Suite)
- Monthly manual testing (security team)

**External testing**:
- Annual third-party pentest (перед production launch)
- Bug bounty program (после launch)

### 6.2 Scope

**In Scope**:
- API endpoints
- Web application
- Mobile apps (iOS/Android)
- Infrastructure (AWS, Kubernetes)

**Out of Scope**:
- Social engineering
- Physical security
- DoS attacks (без разрешения)

### 6.3 Bug Bounty Program (после launch)

**Platform**: HackerOne или Bugcrowd

**Rewards**:
- Critical: $500-$2,000
- High: $200-$500
- Medium: $50-$200
- Low: $25-$50

**Rules**:
- No DoS
- No social engineering
- Responsible disclosure (90 days)

---

## 7. Compliance

### 7.1 COPPA Checklist

- [ ] Parental consent перед созданием детского профиля
- [ ] Privacy Policy прозрачна и понятна
- [ ] Минимизация сбора данных о детях
- [ ] Родители могут просмотреть/удалить данные ребёнка
- [ ] Secure data storage и transmission
- [ ] Регулярные security audits

### 7.2 GDPR Checklist (для EU users)

- [ ] Явное согласие на обработку данных
- [ ] Right to access (export data)
- [ ] Right to erasure (delete data)
- [ ] Data portability (JSON/CSV export)
- [ ] Breach notification (в течение 72 часов)
- [ ] DPA (Data Processing Agreement) с vendors

### 7.3 Security Certifications (рекомендуется)

**ISO 27001** (Information Security Management):
- Annually audit
- Demonstrates commitment to security

**SOC 2 Type II** (Service Organization Control):
- Trust Services Criteria (Security, Availability, Confidentiality)
- Required для enterprise sales

**HIPAA** (если будут health data):
- Не применимо для MVP, но возможно в будущем

---

## 8. Security Checklist перед Launch

### 8.1 Code

- [ ] No hardcoded secrets/API keys
- [ ] Input validation на всех endpoints
- [ ] SQL injection protection (prepared statements)
- [ ] XSS protection (sanitize user input)
- [ ] CSRF protection (tokens)
- [ ] Rate limiting на API

### 8.2 Infrastructure

- [ ] Firewall configured (WAF)
- [ ] Intrusion detection enabled
- [ ] DDoS protection (AWS Shield / Cloudflare)
- [ ] SSH keys only (no password auth)
- [ ] Security groups restrictive (least privilege)
- [ ] Regular backups (automated)

### 8.3 Monitoring

- [ ] SIEM configured (GuardDuty)
- [ ] Alerts для suspicious activity
- [ ] Log aggregation (CloudWatch)
- [ ] Uptime monitoring (Datadog, New Relic)
- [ ] Error tracking (Sentry)

### 8.4 Compliance

- [ ] Privacy Policy published
- [ ] ToS published
- [ ] COPPA consent flow tested
- [ ] GDPR data export/delete tested
- [ ] Incident response plan documented

---

## 9. Threat Modeling

### 9.1 Top Threats

**1. Data Breach** (likelihood: Medium, impact: Critical)
- Attacker gains access to database
- Mitigation: Encryption at rest, access controls, monitoring

**2. Account Takeover** (likelihood: High, impact: High)
- Weak passwords, credential stuffing
- Mitigation: MFA, password strength requirements, rate limiting

**3. Content Moderation Bypass** (likelihood: High, impact: High)
- Attacker circumvents ML moderation
- Mitigation: Hybrid AI + human, continuous model improvement

**4. DDoS Attack** (likelihood: Medium, impact: Medium)
- Service unavailable
- Mitigation: CDN (Cloudflare), AWS Shield, rate limiting

**5. Insider Threat** (likelihood: Low, impact: High)
- Employee misuses access
- Mitigation: Least privilege, audit logs, background checks

### 9.2 Attack Vectors

- **API**: Injection attacks, broken auth
- **Web**: XSS, CSRF, clickjacking
- **Mobile**: Insecure storage, weak crypto
- **Network**: MITM, eavesdropping
- **Social Engineering**: Phishing, pretexting

---

## 10. Security Training

### 10.1 Employee Training

**Onboarding** (Day 1):
- Security policies overview
- Secure coding practices
- Incident reporting procedures

**Quarterly** (ongoing):
- Security awareness training
- Phishing simulation
- Latest threats update

**Annual** (certification):
- OWASP Top 10 review
- COPPA/GDPR compliance

### 10.2 Developer Best Practices

**Code Review**:
- All code reviewed by 2+ engineers
- Security checklist per PR
- Automated security scanning (Snyk, Dependabot)

**Secrets Management**:
- Never commit secrets to Git
- Use environment variables
- Rotate credentials regularly

**Dependencies**:
- Keep dependencies up to date
- Automated vulnerability scanning
- Review license compliance

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Security Team

**Next Steps**:
- [ ] Third-party security audit
- [ ] Penetration testing
- [ ] Bug bounty program (post-launch)
- [ ] ISO 27001 / SOC 2 certification (Year 2)
