# Дизайн безопасности — Rork-Kiku

## Версия: 0.1.0 (DRAFT)
**Дата**: 2026-01-02  
**Контакт**: [FOUNDERS_EMAIL]

---

## 1. Обзор

Безопасность — критичный приоритет для Rork-Kiku, учитывая, что мы работаем с детскими данными и семейным контентом. Данный документ описывает security design на всех уровнях системы.

---

## 2. Encryption

### 2.1. In-Transit Encryption
- **TLS 1.3** для всех API communications
- **Certificate management**: AWS ACM (auto-renewal)
- **HSTS enabled**: Strict-Transport-Security header
- **No mixed content**: Все ресурсы через HTTPS

### 2.2. At-Rest Encryption
**Database** (PostgreSQL RDS):
- AES-256 encryption enabled
- Managed by AWS (transparent encryption)
- Encrypted backups

**Object Storage** (S3):
- S3 Server-Side Encryption (SSE-S3 или SSE-KMS)
- Bucket policy: Enforce encryption

**Sensitive PII**:
- Application-level encryption перед DB insert
- Используем AWS KMS для key management
- Fields: child names, parent emails

### 2.3. Key Management (KMS)
- **AWS KMS** для encryption keys
- **Key rotation**: Автоматическая каждые 90 дней
- **Audit trail**: CloudTrail logs всех KMS operations
- **Separate keys** per environment (dev/staging/prod)

---

## 3. Authentication & Authorization

### 3.1. JWT Best Practices
- **Algorithm**: RS256 (asymmetric)
- **Access token TTL**: 15 minutes
- **Refresh token TTL**: 30 дней
- **Refresh token rotation**: Каждое обновление
- **Token blacklist**: Redis для logout

### 3.2. OAuth2 (Google, Apple Sign In)
- **Standard flows**: Authorization Code flow
- **State parameter**: CSRF protection
- **PKCE**: Proof Key for Code Exchange (mobile apps)

### 3.3. RBAC (Role-Based Access Control)
**Roles**:
- `parent.owner`: Full access к своим детям
- `parent.viewer`: Read-only (co-parents)
- `child`: Ограниченный доступ
- `moderator`: Moderation queue access
- `admin`: Full system access

**Permission checks**: На каждый API request

---

## 4. API Security

### 4.1. Rate Limiting
- **Per-user**: 100 requests/minute
- **Per-IP**: 1000 requests/minute
- **Moderation API**: 10 requests/minute (против abuse)
- **Tool**: Express-rate-limit или AWS WAF

### 4.2. Input Validation
- **Zod schemas** для всех API inputs
- **File upload validation**:
  - MIME type check
  - File size limit (10MB для images)
  - Malware scanning (ClamAV или AWS GuardDuty)
- **SQL injection prevention**: Parameterized queries (TypeORM)
- **XSS prevention**: Sanitize user inputs

### 4.3. CORS
- **Allowed origins**: Только наши domains
- **Credentials**: Include credentials только для trusted origins

---

## 5. Data Privacy

### 5.1. GDPR Compliance
- **Right to access**: API endpoint `/api/v1/users/me/export`
- **Right to erasure**: Soft delete → hard delete после 30 дней
- **Data minimization**: Только необходимые данные
- **Data retention**: Defined policies (см. Privacy Policy)

### 5.2. COPPA Compliance
- **Parental consent**: Verifiable consent перед child data collection
- **No behavioral ads** to children
- **Parent control**: Review и delete child data

### 5.3. PII Handling
- **Classification**: Public / Internal / Confidential / Restricted
- **Encryption**: Sensitive PII encrypted at-rest
- **Access logs**: Audit всех accesses to PII
- **Retention**: Delete после account termination + grace period

---

## 6. Infrastructure Security

### 6.1. Network Security
- **VPC**: Private subnets для DB и internal services
- **Security Groups**: Least privilege rules
- **NAT Gateway**: Outbound-only для private subnets
- **WAF**: AWS WAF для DDoS protection

### 6.2. Container Security
- **Image scanning**: Trivy для vulnerability scanning
- **Minimal base images**: Alpine Linux
- **Non-root user**: Containers run as non-root
- **Read-only filesystem**: Where possible

### 6.3. Kubernetes Security
- **RBAC**: Least privilege service accounts
- **Network Policies**: Restrict pod-to-pod traffic
- **Pod Security Standards**: Enforce baseline или restricted
- **Secrets**: External Secrets Operator (AWS Secrets Manager)

---

## 7. Monitoring & Logging

### 7.1. Logging
- **Structured logs**: JSON format
- **Log levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Sensitive data masking**: Emails, PII redacted
- **Retention**: 90 days (app logs), 7 years (audit logs)

### 7.2. SIEM (Security Information and Event Management)
- **Tool**: AWS CloudWatch Logs Insights или ELK Stack
- **Alerts**: Suspicious activities (brute force, unusual access patterns)

### 7.3. Audit Trail
- **All moderation decisions** logged
- **All PII access** logged
- **Administrative actions** logged

---

## 8. Incident Response

### 8.1. Incident Severity Levels
- **P0 (Critical)**: Data breach, full outage → Response: 15 min
- **P1 (High)**: Security vulnerability → Response: 1 hour
- **P2 (Medium)**: Degraded performance → Response: 4 hours
- **P3 (Low)**: Minor issue → Response: Next business day

### 8.2. Incident Response Playbook
1. **Detection**: Alerts → PagerDuty → On-call
2. **Triage**: Assess severity → Escalate
3. **Containment**: Isolate affected systems
4. **Eradication**: Fix root cause
5. **Recovery**: Restore services
6. **Post-mortem**: Blameless, action items

### 8.3. Data Breach Response
- **Isolate**: Affected systems
- **Notify**: Security team, legal, founders
- **Investigate**: Scope of breach
- **Notify users**: GDPR (72 hours), COPPA compliance
- **Report**: Authorities (если required)

---

## 9. Penetration Testing

### 9.1. Schedule
- **Quarterly**: Penetration tests by external vendor
- **After major releases**: Security review

### 9.2. Scope
- External attack surface
- API security
- Authentication/authorization
- Data privacy compliance

### 9.3. Remediation
- **High/Critical**: Fix within 30 days
- **Medium**: Fix within 90 days
- **Low**: Fix when possible

---

## 10. Compliance & Audits

### 10.1. Regular Audits
- **Security audit**: Annually
- **COPPA compliance**: Bi-annually
- **GDPR compliance**: Annually (если EU users)

### 10.2. Certifications (Future)
- **SOC 2 Type II** (когда достигнем scale)
- **ISO 27001** (опционально)

---

## Контакты
- **Security Lead**: [FOUNDERS_EMAIL]
- **Incident Response**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Черновик security design документа. Требует review security expert перед production deployment.
