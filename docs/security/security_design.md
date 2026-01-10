# Security Design для Rork-Kiku

## Обзор

Безопасность детских данных — наш главный приоритет. Этот документ описывает comprehensive security architecture.

---

## 1. Шифрование данных

### 1.1 Данные в покое (At Rest)

**Database Encryption:**
- PostgreSQL: Transparent Data Encryption (TDE)
- AWS RDS: Encryption enabled на storage level
- Algorithm: AES-256
- Key rotation: Ежегодно через AWS KMS

**Object Storage (S3):**
- Server-Side Encryption (SSE-S3) для всех objects
- Alternative: SSE-KMS для дополнительного control
- Bucket policies: Deny unencrypted uploads

**Backups:**
- Encrypted backups с отдельным encryption key
- Stored в secure backup bucket с versioning

### 1.2 Данные в транзите (In Transit)

**TLS Everywhere:**
- Минимум: TLS 1.2
- Рекомендуется: TLS 1.3
- Certificate: Let's Encrypt или AWS Certificate Manager
- HSTS header enabled

**Internal Services:**
- mTLS (mutual TLS) для service-to-service в Kubernetes
- Istio service mesh или Linkerd для automated mTLS

**Mobile App:**
- Certificate pinning для дополнительной защиты от MITM

---

## 2. Key Management Service (KMS)

### Архитектура KMS

**AWS KMS (рекомендуется):**
- Customer Master Keys (CMKs) для encryption
- Data Encryption Keys (DEKs) generated per object
- Envelope encryption pattern

**Key Hierarchy:**
```
Master Key (AWS-managed)
  └─ Customer Master Key (CMK)
      └─ Data Encryption Keys (DEK) - per service/object
```

**Key Types:**
- `rork-kiku-db-key` — Database encryption
- `rork-kiku-s3-key` — S3 bucket encryption
- `rork-kiku-jwt-key` — JWT signing key
- `rork-kiku-backup-key` — Backup encryption

### Ротация ключей

**Автоматическая ротация:**
- CMKs: rotation каждые 365 дней (AWS автоматически)
- DEKs: regenerated при каждом использовании (envelope encryption)

**Manual ротация (emergency):**
- При подозрении на compromise
- Procedure:
  1. Generate new key
  2. Re-encrypt critical data
  3. Deprecate old key (но не delete для decryption старых данных)
  4. Update application configuration
  5. Monitor

---

## 3. Authentication & Authorization

### 3.1 OAuth2 / JWT

**Access Tokens:**
- Short TTL: 15 минут
- Signed с RS256 (asymmetric)
- Claims: `sub` (user_id), `role`, `scope`, `exp`, `iat`

**Refresh Tokens:**
- Longer TTL: 7 дней
- Rotating refresh tokens (new token каждый раз)
- Stored в database для revocation

**Password Storage:**
- bcrypt hashing (cost factor: 12)
- Salt automatically added by bcrypt
- Never stored plaintext

**MFA (Multi-Factor Authentication):**
- TOTP (Time-based One-Time Password) — Google Authenticator
- SMS backup (опционально)
- Required для parent accounts

---

## 4. Role-Based Access Control (RBAC)

### Roles

| Role | Permissions | Users |
|------|-------------|-------|
| **Parent** | Manage child profiles, view activity, settings | Parent users |
| **Child** | Limited by age settings | Child profiles |
| **Moderator** | Review content, approve/reject, escalate | Moderation team |
| **Admin** | Full system access | Core team |
| **Support** | View user data (read-only), help users | Support team |

### Implementation

**API Level:**
```typescript
// Middleware example
function requireRole(role: string) {
  return (req, res, next) => {
    const token = verifyJWT(req.headers.authorization);
    if (token.role !== role && token.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.post('/api/moderation/approve', requireRole('moderator'), approveContent);
```

---

## 5. Security Monitoring

### 5.1 Prometheus Metrics

**Security-Specific Metrics:**
- `auth_failed_attempts_total` — Failed login attempts
- `auth_mfa_failures_total` — MFA failures
- `authorization_denied_total` — Authorization denials (по роли, ресурсу)
- `suspicious_activity_detected_total` — Anomaly detection triggers
- `certificate_expiration_days` — TLS cert expiration countdown

**Alerts:**
```yaml
# prometheus/alerts.yml
groups:
  - name: security
    rules:
      - alert: HighAuthFailureRate
        expr: rate(auth_failed_attempts_total[5m]) > 10
        annotations:
          summary: "High authentication failure rate detected"
      
      - alert: CertificateExpiringSoon
        expr: certificate_expiration_days < 7
        annotations:
          summary: "TLS certificate expiring in less than 7 days"
```

### 5.2 Grafana Dashboards

**Security Dashboard:**
- Authentication success/failure rates
- Authorization denials by resource
- Suspicious pattern detections
- TLS certificate status
- API abuse metrics (rate limiting triggers)

---

## 6. Logging

### Security Event Logging

**What to Log:**
- All authentication events (success/failure)
- All authorization decisions (allow/deny)
- Admin actions
- Data access (who accessed what)
- Configuration changes
- Security incidents

**Log Format (JSON):**
```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "level": "INFO",
  "event_type": "auth_success",
  "user_id": "user_123",
  "ip_address": "192.0.2.1",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "method": "password",
    "mfa_used": true
  }
}
```

**Log Retention:**
- Hot storage (Elasticsearch/Loki): 30 дней
- Cold storage (S3): 1 год (compliance)
- Audit logs: 7 лет (legal requirement в некоторых jurisdictions)

**Log Encryption:**
- Encrypt sensitive logs (contain PII) in storage

---

## 7. Security Information & Event Management (SIEM)

### Future: SIEM Integration

**Options:**
- **AWS Security Hub** — Aggregate findings from multiple sources
- **Splunk** — Enterprise SIEM
- **ELK Stack + Security** — Open-source

**Capabilities:**
- Correlation of security events
- Threat intelligence integration
- Automated incident response
- Compliance reporting

---

## 8. Incident Response Playbook

### Phases

**1. Detection**
- Automated alerts (Prometheus, CloudWatch)
- User reports
- Security audits

**2. Containment**
- Isolate affected systems
- Block malicious IPs
- Disable compromised accounts
- Preserve evidence

**3. Eradication**
- Remove malware/malicious code
- Patch vulnerabilities
- Reset credentials

**4. Recovery**
- Restore from clean backups
- Verify system integrity
- Gradual service restoration

**5. Post-Incident**
- Root cause analysis
- Update security measures
- Document lessons learned
- User communication (if data breach)

### Data Breach Response

**GDPR Compliance:**
- Notify supervisory authority в течение 72 часов
- Notify affected users без undue delay
- Document breach, response, and mitigation

**COPPA Compliance:**
- Notify FTC if children's data compromised
- Notify parents affected

---

## 9. Penetration Testing

### Scope

**Annual Pentest:**
- External: API endpoints, mobile app
- Internal: Service-to-service, databases
- Social engineering (phishing tests)

**Quarterly Vulnerability Scanning:**
- Automated scans (Nessus, OpenVAS)
- Dependency scanning (Snyk, npm audit)

**Bug Bounty (Future):**
- HackerOne или Bugcrowd platform
- Responsible disclosure: 90-day timeline
- Rewards: tiered по severity

### Remediation

**Critical (CVSS 9.0-10.0):**
- Fix within 24 hours
- Emergency deployment

**High (CVSS 7.0-8.9):**
- Fix within 7 days

**Medium/Low:**
- Fix within next release cycle

---

## 10. Security Checklist

### Pre-Launch

- [ ] All secrets в environment variables/secrets manager
- [ ] TLS certificates valid
- [ ] Database encryption enabled
- [ ] Password hashing implemented (bcrypt)
- [ ] Rate limiting configured
- [ ] Input validation на всех endpoints
- [ ] CORS configured properly
- [ ] Security headers (HSTS, CSP, X-Frame-Options)
- [ ] Dependency audit clean (npm audit fix)
- [ ] Penetration test completed
- [ ] Incident response plan documented

### Ongoing

- [ ] Monthly dependency updates
- [ ] Quarterly penetration tests
- [ ] Annual security audit
- [ ] Key rotation schedule followed
- [ ] Logs monitored regularly
- [ ] Alerts reviewed и tuned
- [ ] Backup restoration tested quarterly

---

## 11. Compliance

### COPPA
- Parental consent mechanisms tested
- Children's data encrypted и access controlled
- Data deletion procedures verified

### GDPR
- Data processing documented
- Right to erasure implemented
- Data portability functional
- DPIAs completed

### SOC 2 (Future)
- Control environment documented
- Annual audit by approved firm

---

**Последнее обновление:** [DATE] — PLACEHOLDER  
**Owner:** Security Team — [FOUNDERS_EMAIL]
