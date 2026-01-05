# Дизайн безопасности Rork-Kiku

## Обзор

Безопасность является критическим приоритетом для Rork-Kiku, особенно учитывая работу с детскими данными. Данный документ описывает security архитектуру, угрозы, и меры защиты.

## Принципы безопасности

1. **Defense in Depth**: Многослойная защита
2. **Least Privilege**: Минимальные необходимые права
3. **Zero Trust**: Не доверяем никому по умолчанию
4. **Privacy by Design**: Приватность встроена в архитектуру
5. **Fail Secure**: В случае сбоя — безопасное состояние

## Threat Model (Модель угроз)

### Actors (Актёры)

#### 1. Злоумышленники (External Attackers)
**Цели**:
- Доступ к детским данным
- CSAM distribution
- Data exfiltration
- Service disruption (DoS)

**Capabilities**:
- Internet access
- Basic hacking tools
- Social engineering

#### 2. Недобросовестные пользователи (Malicious Users)
**Цели**:
- Child exploitation
- Abuse platform для распространения illegal content
- Privacy violations

**Capabilities**:
- Registered account
- Upload content
- Access к family group

#### 3. Инсайдеры (Insiders)
**Цели**:
- Data theft
- Sabotage
- Corporate espionage

**Capabilities**:
- Internal system access
- Source code access
- Database access

### Assets (Активы)

**Critical**:
- Детские профили и данные
- Медиа-контент (фото, видео)
- User credentials (passwords, tokens)
- Encryption keys

**High**:
- Parent profiles
- ML models
- Source code
- Infrastructure configs

**Medium**:
- Logs
- Analytics data
- Metadata

### Threats (Угрозы)

| ID | Threat | Asset | Likelihood | Impact | Risk |
|----|--------|-------|------------|--------|------|
| T1 | CSAM upload | Media content | Medium | Critical | High |
| T2 | Data breach (DB) | User data | Low | Critical | High |
| T3 | Account takeover | User credentials | Medium | High | High |
| T4 | SQL injection | Database | Low | Critical | Medium |
| T5 | XSS attack | Web app | Low | Medium | Low |
| T6 | DDoS | Service availability | Medium | Medium | Medium |
| T7 | Insider threat | All data | Low | Critical | Medium |
| T8 | Man-in-the-middle | Credentials, data | Low | High | Low |
| T9 | Brute force | User accounts | High | Medium | Medium |
| T10 | Social engineering | User credentials | Medium | High | Medium |

## Security Architecture

### 1. Transport Layer Security (TLS)

**Implementation**:
- **TLS 1.3** (minimum 1.2)
- **Certificate**: Let's Encrypt или AWS Certificate Manager
- **HSTS**: HTTP Strict Transport Security enabled
- **Certificate pinning**: В мобильных приложениях

**Configuration** (placeholder for nginx/ALB):
```nginx
ssl_protocols TLSv1.3 TLSv1.2;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. Encryption at Rest

**Databases**:
- **PostgreSQL**: Transparent Data Encryption (TDE)
- **Encryption key**: AWS KMS, rotation every 90 days
- **Backups**: Encrypted с separate key

**Object Storage (S3)**:
- **Server-Side Encryption**: SSE-KMS
- **Encryption key**: Customer Master Key (CMK)
- **Versioning**: Enabled для recovery

**Application-level**:
- **Sensitive fields**: Additional encryption (e.g., child date of birth)
- **Algorithm**: AES-256-GCM
- **Key management**: AWS KMS

### 3. Key Management Service (KMS)

**AWS KMS strategy**:
```
Root Key (AWS-managed)
  └── Customer Master Key (CMK) - per environment
      ├── Data Encryption Key (DEK) - database
      ├── Data Encryption Key (DEK) - S3
      └── Data Encryption Key (DEK) - backups
```

**Rotation**:
- CMK: Автоматическая ротация каждые 365 дней
- DEK: Генерируется per-object/per-row

### 4. Authentication

**Methods**:
1. **Email + Password**
   - bcrypt/Argon2 hashing (cost factor 12)
   - Minimum password strength: 8 chars, uppercase, number, symbol
   - Password breach check (HaveIBeenPwned API)

2. **OAuth2 (Apple, Google)**
   - Authorization Code Flow
   - PKCE (Proof Key for Code Exchange)
   - Токены не хранятся plaintext

3. **Multi-Factor Authentication (MFA)** (опционально)
   - TOTP (Time-based One-Time Password)
   - SMS (опционально, менее безопасно)

**JWT Tokens**:
- Access token: Short-lived (1 hour)
- Refresh token: Long-lived (30 days), rotating
- Signature algorithm: RS256 (asymmetric)
- Stored securely: Keychain (iOS), Keystore (Android)

### 5. Authorization (RBAC)

**Roles**:
- **Super Admin**: Full access (founder, CTO)
- **Admin**: User management, content review
- **Moderator**: Content moderation only
- **Support**: Read-only user data, no edit
- **Parent**: Family management, child profiles
- **Child**: Limited (view only family content)

**Permissions** (examples):
```
users:read, users:write, users:delete
content:read, content:write, content:delete, content:moderate
analytics:read
settings:write
```

**Implementation**: Casbin или custom RBAC engine

**Least Privilege**: Users/services имеют минимально необходимые права.

### 6. API Security

**Rate Limiting**:
```
- Login attempts: 5 per 15 minutes per IP
- API calls: 100 per minute per user
- Uploads: 50 per day per family
```

**Input Validation**:
- Server-side validation (не доверяем client)
- Whitelist approach (разрешено только expected input)
- Sanitization для HTML/JS (против XSS)
- Parameterized queries (против SQL injection)

**API Authentication**:
- Bearer token (JWT) в Authorization header
- API keys для server-to-server (hashed в DB)

**CORS**:
```
Access-Control-Allow-Origin: https://www.rork-kiku.com
Access-Control-Allow-Credentials: true
```

### 7. Content Moderation Security

**CSAM Detection**:
- **PhotoDNA**: Microsoft's hash database
- **NCMEC**: Report matches немедленно
- **Automatic block**: Zero tolerance

**ML Model Security**:
- **Model poisoning protection**: Validate training data
- **Adversarial attack defense**: Robustness testing
- **Model versioning**: Rollback при проблемах

**Human Moderators**:
- **Background checks**: Для всех moderators
- **Training**: Child safety protocols
- **Audit logging**: Все moderation actions logged
- **Rotation**: Prevent burnout, insider threats

### 8. Network Security

**Infrastructure**:
- **VPC**: Private subnets для databases, backend
- **Security Groups**: Whitelist-based firewall rules
- **NACLs**: Network Access Control Lists
- **Bastion hosts**: Для SSH access (no direct access)

**DDoS Protection**:
- **AWS Shield** (standard, free)
- **CloudFlare**: Rate limiting, bot detection
- **WAF**: Web Application Firewall (OWASP rules)

**Intrusion Detection**:
- **AWS GuardDuty**: Threat detection
- **CloudTrail**: API call logging
- **VPC Flow Logs**: Network traffic analysis

### 9. Logging & Monitoring

**Security Logs**:
- Authentication attempts (success/failure)
- Authorization violations
- Content moderation decisions
- Admin actions
- Database access
- API calls (high-risk endpoints)

**SIEM (Security Information and Event Management)**:
- **Tool**: Splunk, Elastic Security, или Sumo Logic
- **Retention**: 1 year (compliance)
- **Immutability**: WORM (Write Once Read Many) storage

**Alerting**:
- **Critical**: Immediate (PagerDuty, SMS)
  - CSAM detection
  - Data breach attempt
  - Service outage
- **High**: Within 1 hour (Slack, Email)
  - Multiple failed logins
  - Unusual API activity
- **Medium**: Daily digest
  - Minor security events

**Metrics to monitor**:
- Failed login rate
- Unusual upload patterns
- Database query anomalies
- Network traffic spikes

### 10. Incident Response

**Playbook**:

#### Phase 1: Detection (0-1 час)
1. Alert triggered (automated или manual report)
2. Assess severity (Critical/High/Medium/Low)
3. Assemble Incident Response Team
4. Start incident log

#### Phase 2: Containment (1-4 часа)
1. **Isolate** affected systems
2. **Block** malicious IPs/accounts
3. **Preserve** evidence (logs, snapshots)
4. **Communicate** internally (status updates)

#### Phase 3: Eradication (4-24 часа)
1. Identify root cause
2. Remove threat (patch vulnerability, delete malware)
3. Verify threat eliminated

#### Phase 4: Recovery (24-72 часа)
1. Restore services from clean backups
2. Monitor for re-infection
3. Validate system integrity

#### Phase 5: Post-Incident (1-2 недели)
1. **Post-mortem**: What happened, why, how to prevent
2. **Update playbooks**: Lessons learned
3. **Notify** affected users (GDPR: <72 hours)
4. **Regulatory reporting**: Если требуется (FTC, DPA)
5. **Security improvements**: Implement fixes

**Incident Response Team**:
- Incident Commander: [Role, TBD]
- Technical Lead: CTO
- Security Engineer: [TBD]
- Communications Lead: [TBD]
- Legal: External counsel

### 11. Penetration Testing

**Schedule**:
- **Annual**: External pentest by certified firm
- **Quarterly**: Internal vulnerability scanning
- **Pre-launch**: MVP security audit

**Scope**:
- Web application
- Mobile applications (iOS, Android)
- APIs
- Infrastructure
- Social engineering (optional)

**Remediation**:
- **Critical**: Fix within 24 hours
- **High**: Fix within 7 days
- **Medium**: Fix within 30 days
- **Low**: Fix in next release

### 12. Compliance

**COPPA (Children's Online Privacy Protection Act)**:
- ✅ Verifiable parental consent
- ✅ Data minimization для детей
- ✅ No third-party sharing детских данных
- ✅ Parental access и deletion rights

**GDPR (General Data Protection Regulation)**:
- ✅ Lawful basis (consent, contract)
- ✅ Data subject rights (access, erasure, portability)
- ✅ Data Protection Impact Assessment (DPIA)
- ✅ Breach notification (<72 hours)
- ✅ Data Processing Agreements (DPAs) с vendors

**SOC 2 Type II** (Target: Post-Series A):
- Security controls audit
- Availability, Confidentiality, Processing Integrity

## Security Best Practices (Разработка)

### Secure Coding

**Checklist для разработчиков**:
- [ ] Input validation на server-side
- [ ] Parameterized SQL queries (no string concatenation)
- [ ] Output encoding (против XSS)
- [ ] CSRF tokens для state-changing requests
- [ ] Secrets в environment variables (не в коде)
- [ ] Dependencies updated (npm audit, pip check)
- [ ] Error messages не раскрывают sensitive info
- [ ] Logging не содержит PII без необходимости

### Code Review

**Security-focused review**:
- [ ] No hardcoded secrets
- [ ] Authentication/Authorization correct
- [ ] Input validation sufficient
- [ ] SQL injection risk
- [ ] XSS risk
- [ ] CSRF protection
- [ ] Rate limiting in place
- [ ] Error handling secure

### CI/CD Security

**Pipeline checks**:
- [ ] Dependency scanning (Snyk, Dependabot)
- [ ] SAST (Static Application Security Testing) - CodeQL, SonarQube
- [ ] Container scanning (Trivy, Clair)
- [ ] Secret scanning (git-secrets, TruffleHog)
- [ ] License compliance check

## Security Contacts

**Internal**:
- Security Team: security@rork-kiku.com (placeholder)
- Incident Response: incident@rork-kiku.com (placeholder)

**External**:
- Vulnerability Disclosure: security-disclosure@rork-kiku.com (placeholder)
- Bug Bounty: [HackerOne/Bugcrowd program, TBD]

**Emergency**:
- On-call: PagerDuty (setup TBD)
- Executive: [FOUNDERS_EMAIL]

## Responsible Disclosure Policy

Мы приветствуем security researchers, которые обнаруживают уязвимости:

**Process**:
1. Email security-disclosure@rork-kiku.com с деталями
2. Мы ответим в течение 48 часов
3. Мы исправим в течение 30-90 дней (в зависимости от severity)
4. После fix, researcher может публично disclose
5. **Bug bounty**: [TBD после seed funding]

**Scope**:
- ✅ rork-kiku.com, app.rork-kiku.com, api.rork-kiku.com
- ✅ iOS/Android приложения
- ❌ Third-party services (AWS, Stripe, etc.)
- ❌ Social engineering нашего персонала
- ❌ Physical attacks

**Safe Harbor**: Мы не будем преследовать добросовестных researchers за ответственное disclosure.

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Security — это ongoing process. Этот документ будет обновляться по мере роста платформы и появления новых угроз.
