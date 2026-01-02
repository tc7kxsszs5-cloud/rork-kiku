# Security Design для Rork-Kiku

## Обзор

Этот документ описывает security architecture и практики для Rork-Kiku, платформы безопасного обмена контентом для детей.

**Критические принципы:**
- Privacy-first (особенно для детей)
- Defense in depth (многослойная защита)
- Compliance-ready (COPPA, GDPR)
- Transparency (audit trail для всех actions)

---

## 1. Шифрование данных

### 1.1. Data at Rest (Хранение)

**Databases (PostgreSQL):**
- **Encryption**: AES-256 через AWS RDS encryption
- **Key Management**: AWS KMS (Key Management Service)
- **Backups**: автоматически encrypted с теми же ключами

**Object Storage (S3 для медиа):**
- **Encryption**: SSE-S3 или SSE-KMS
- **Recommended**: SSE-KMS для лучшего контроля над ключами
- **Versioning**: enabled для recovery

**Application Secrets:**
- **Storage**: AWS Secrets Manager или HashiCorp Vault
- **Access**: IAM roles с least privilege
- **Rotation**: автоматическая ротация каждые 90 дней

**Sensitive Fields (дополнительно):**
- **PII fields**: application-level encryption перед storage
- **Library**: использовать проверенные библиотеки (libsodium, OpenSSL)
- **Keys**: отдельные от database encryption

### 1.2. Data in Transit (Передача)

**External Communication:**
- **TLS 1.3**: для всех client-server connections
- **Certificate**: Let's Encrypt или AWS ACM
- **HSTS**: Strict-Transport-Security header enabled
- **Certificate Pinning**: в mobile app (опционально)

**Internal Communication (Microservices):**
- **mTLS (Mutual TLS)**: между микросервисами (через Istio/Linkerd)
- **VPC**: все internal services в private subnets
- **Security Groups**: restrict traffic между services

**API Security:**
- **HTTPS only**: no HTTP fallback
- **API Gateway**: rate limiting, authentication
- **WebSockets**: WSS (WebSocket Secure)

---

## 2. Key Management Service (KMS)

### 2.1. AWS KMS Architecture

**Master Keys:**
- **Customer Master Keys (CMK)**: для каждого environment (dev, staging, prod)
- **Separate keys** для разных purposes:
  - Database encryption
  - S3 bucket encryption
  - Application secrets
  - Backup encryption

**Key Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key for RDS",
      "Effect": "Allow",
      "Principal": {
        "Service": "rds.amazonaws.com"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey",
        "kms:CreateGrant"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2.2. Ротация ключей

**Automatic Rotation:**
- **CMKs**: автоматическая ротация каждый год (enable в KMS)
- **Application keys**: manual rotation каждые 90 дней
- **Secrets**: AWS Secrets Manager automatic rotation

**Rotation Process:**
1. Generate new key
2. Encrypt new data с new key
3. Keep old keys для decryption existing data
4. Gradual migration (re-encrypt old data)
5. Retire old keys после migration complete

**Emergency Rotation:**
- В случае compromise: immediate rotation
- Revoke old keys
- Force re-authentication всех users

---

## 3. SIEM (Security Information and Event Management)

### 3.1. Centralized Logging

**Log Sources:**
- Application logs (API, backend services)
- Infrastructure logs (Kubernetes, load balancers)
- Security logs (authentication, authorization)
- Audit logs (admin actions, data access)
- WAF logs (web application firewall)

**Log Aggregation:**
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Или AWS CloudWatch Logs**: для managed solution
- **Or Datadog / Splunk**: для advanced analytics

### 3.2. Security Events Monitoring

**Critical Events:**
- Failed login attempts (> 5 в течение 5 минут)
- Privilege escalation attempts
- Unusual API usage patterns
- Data exfiltration indicators
- Malware/virus detection
- DDoS attacks

**Alerts Configuration:**
```yaml
Alerts:
  - name: "Multiple Failed Logins"
    condition: "failed_logins > 5 in 5 minutes"
    severity: "high"
    action: "notify security team, temp block IP"
  
  - name: "Admin Action Outside Hours"
    condition: "admin_action AND time NOT IN 9-18"
    severity: "medium"
    action: "notify security team"
  
  - name: "Mass Data Export"
    condition: "data_export_size > 1GB OR records > 10000"
    severity: "critical"
    action: "block, notify security lead"
```

### 3.3. Incident Detection

**Use Cases:**
- **Anomaly detection**: ML-based для unusual patterns
- **Threat intelligence**: integration с threat feeds
- **Correlation**: link events across multiple sources
- **Forensics**: detailed trail для investigation

---

## 4. Retention и Log Management

### 4.1. Log Retention Policy

**По типу логов:**

| Log Type | Retention Period | Reason |
|----------|------------------|---------|
| Application logs | 90 days | Troubleshooting, debugging |
| Security logs | 2 years | Compliance, incident investigation |
| Audit logs | 7 years | Legal, compliance (GDPR, tax) |
| Access logs | 1 year | Security analysis |
| Error logs | 6 months | Quality assurance |
| Debug logs | 30 days | Development only |

**Storage Tiers:**
- **Hot storage** (0-30 days): fast access, SSD
- **Warm storage** (31-365 days): slower access, cheaper
- **Cold storage** (1+ years): archival, S3 Glacier

### 4.2. Log Sanitization

**Sensitive Data Removal:**
- **PII**: remove или mask personal information
- **Passwords**: never log passwords (даже hashed)
- **API keys/tokens**: mask или remove
- **Credit card numbers**: PCI-DSS compliance

**Example sanitization:**
```javascript
function sanitizeLog(log) {
  // Mask email
  log.email = log.email.replace(/(.{2}).*@/, '$1***@');
  
  // Remove tokens
  delete log.authToken;
  delete log.refreshToken;
  
  // Mask credit card
  if (log.creditCard) {
    log.creditCard = log.creditCard.replace(/.(?=.{4})/g, '*');
  }
  
  return log;
}
```

---

## 5. Incident Response Playbook

### 5.1. Incident Classification

**Severity Levels:**

- **P0 (Critical)**: 
  - Data breach (customer data exposed)
  - Complete system outage
  - Active attack в progress
  - Child safety emergency
  
- **P1 (High)**:
  - Partial data exposure
  - Service degradation (> 50% users affected)
  - Successful unauthorized access
  
- **P2 (Medium)**:
  - Security vulnerability discovered
  - Attempted breach (unsuccessful)
  - Minor data leak (non-sensitive)
  
- **P3 (Low)**:
  - Suspicious activity (no impact)
  - Policy violations
  - Security tool alerts (false positives)

### 5.2. Response Process

**Phase 1: Detection & Triage (0-15 minutes)**
1. Alert received (automated или manual report)
2. Security lead notified (PagerDuty)
3. Initial assessment (severity classification)
4. Escalate if P0/P1

**Phase 2: Containment (15-60 minutes)**
1. Isolate affected systems
   - Block malicious IPs
   - Disable compromised accounts
   - Quarantine infected services
2. Prevent further damage
3. Document timeline

**Phase 3: Eradication (1-4 hours)**
1. Remove threat (malware, backdoors, etc.)
2. Patch vulnerabilities
3. Reset compromised credentials
4. Deploy security updates

**Phase 4: Recovery (4-24 hours)**
1. Restore services from backups (if needed)
2. Verify security posture
3. Gradual re-enable services
4. Monitor for re-infection

**Phase 5: Post-Incident (24-72 hours)**
1. Post-mortem meeting
2. Incident report (root cause, timeline, impact)
3. Lessons learned
4. Process improvements
5. Communication (internal, external, regulatory)

### 5.3. Communication Plan

**Internal:**
- Immediate: Security team, CTO, CEO
- Within 1 hour: Engineering team, Product
- Within 4 hours: All employees (if major)

**External:**
- **Users**: notify affected users (GDPR: within 72 hours)
- **Authorities**: report to regulatory bodies (if required)
- **Partners**: inform partners (if их data affected)
- **Public**: press release (if public interest)

**Template Email (Data Breach):**
```
Subject: Important Security Notice for Rork-Kiku Users

Dear [Parent Name],

We are writing to inform you of a security incident that may have affected your account.

What Happened:
[Brief description of incident]

What Data Was Affected:
[List types of data: email, names, etc.]

What We're Doing:
[Actions taken to secure systems]

What You Should Do:
[Recommended actions: change password, monitor, etc.]

We sincerely apologize for this incident. Your trust and your child's safety are our top priorities.

For more information: [link]
Contact us: security@rork-kiku.com

Sincerely,
Rork-Kiku Security Team
```

---

## 6. Penetration Testing Plan

### 6.1. Testing Schedule

**Frequency:**
- **External pentest**: Quarterly (every 3 months)
- **Internal pentest**: Bi-annually (every 6 months)
- **Post-major-release**: after significant features
- **Ad-hoc**: when significant vulnerability discovered

**Environments:**
- **Production**: только для external pentests, с approval
- **Staging**: полноценные penetration tests
- **Never**: production database directly

### 6.2. Scope

**In-Scope:**
- Web application (API, dashboard)
- Mobile app (iOS, Android)
- Infrastructure (Kubernetes, AWS)
- Authentication/Authorization flows
- API endpoints
- Third-party integrations

**Out-of-Scope:**
- Physical security (data centers)
- Social engineering (unless specifically authorized)
- DoS attacks (don't impact production)

### 6.3. Testing Types

**Black Box Testing:**
- Testers have no internal knowledge
- Simulates external attacker
- Focus на exposed attack surface

**Gray Box Testing:**
- Testers have some internal knowledge (credentials, architecture)
- More realistic (insider threat)
- Balanced approach

**White Box Testing:**
- Full access к code, infrastructure
- Most thorough
- Focus на finding all vulnerabilities

### 6.4. Vendors

**Preferred vendors:**
- HackerOne (bug bounty platform)
- Synack (crowdsourced security testing)
- Local security firms (for compliance)

**Criteria:**
- Certified professionals (OSCP, CEH, etc.)
- Experience с child-focused applications
- NDA signed
- Insurance coverage

### 6.5. Remediation

**Timeline:**

| Severity | Fix Deadline | Verification |
|----------|--------------|--------------|
| Critical | 24-48 hours | Immediate retest |
| High | 7 days | Retest within 14 days |
| Medium | 30 days | Retest next quarter |
| Low | 90 days | Retest next quarter |

**Process:**
1. Pentest completed → report delivered
2. Security team triages findings
3. Engineering prioritizes fixes
4. Fixes deployed
5. Pentest vendor retests
6. Sign-off when all critical/high fixed

---

## 7. Security Checklist (Pre-Launch)

**Application Security:**
- [ ] All API endpoints authenticated
- [ ] Input validation on all user inputs
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (CSP headers, sanitization)
- [ ] CSRF protection (tokens)
- [ ] Rate limiting configured
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Error messages don't leak sensitive info

**Data Protection:**
- [ ] Data at rest encrypted (RDS, S3)
- [ ] Data in transit encrypted (TLS 1.3)
- [ ] PII fields identified и protected
- [ ] Data retention policies implemented
- [ ] GDPR/COPPA compliance verified

**Access Control:**
- [ ] RBAC implemented (least privilege)
- [ ] MFA enabled для admins
- [ ] Password policy enforced (length, complexity)
- [ ] Session management secure (httpOnly cookies)
- [ ] Secrets stored в Secrets Manager

**Infrastructure:**
- [ ] Firewalls configured (AWS Security Groups)
- [ ] VPC properly segmented
- [ ] SSH access restricted (bastion host only)
- [ ] Backups automated и tested
- [ ] DDoS protection (CloudFront, WAF)

**Monitoring:**
- [ ] Centralized logging configured
- [ ] Security alerts set up
- [ ] Incident response plan documented
- [ ] Penetration test completed
- [ ] Security audit passed

**Compliance:**
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] COPPA compliance (parental consent)
- [ ] GDPR compliance (data rights)
- [ ] Data Processing Agreements signed

---

## 8. Security Training

**For Engineering Team:**
- OWASP Top 10 awareness
- Secure coding practices
- Secret management
- Incident response procedures

**For Moderators:**
- Confidentiality agreements
- Handling sensitive content
- Escalation procedures
- Child safety protocols

**For All Employees:**
- Phishing awareness
- Password hygiene
- Device security
- Incident reporting

---

**Примечание:** Security — это ongoing process, не one-time effort. Regular reviews, updates и training критически важны. Этот документ должен обновляться при изменении threat landscape или regulations.
