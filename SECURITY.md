# Security Architecture for KIKU

## Overview

KIKU implements multiple layers of security to protect children's data and ensure compliance with privacy regulations including COPPA, GDPR, and TDPSA.

## Security Layers

### 1. Authentication & Authorization

#### User Authentication
- **Role-based access control**: Separate parent and child accounts with distinct permissions
- **Age verification**: Date of birth required for age-appropriate filtering
- **Parental consent**: Required for children under 13 (COPPA compliance)
- **Biometric authentication**: Face ID/Touch ID support for secure access (native platforms)
- **Session management**: 30-minute session timeout with automatic re-authentication

#### Implementation
```typescript
// UserContext.tsx
- identifyUser(): Creates user with age verification and parental consent
- enableBiometric(): Enables biometric authentication
- refreshAuthenticationTime(): Updates last activity timestamp
```

### 2. Data Storage & Encryption

#### Secure Storage
- **Native platforms**: Hardware-backed encryption via expo-secure-store
  - Uses iOS Keychain and Android Keystore
  - Encryption keys stored in secure enclave
  - Data inaccessible without device authentication

- **Web platforms**: XOR-based obfuscation (fallback)
  - Not cryptographically secure, but better than plain text
  - Warning displayed to users
  - Recommendation to use native app

#### Sensitive Data Types
1. **User credentials and tokens**
2. **Parental control settings**
3. **Contact whitelist**
4. **SOS alert records**
5. **Session data**

#### Implementation
```typescript
// lib/secureStorage.ts
- SecureStorage.setItem(): Store encrypted data
- SecureStorage.getItem(): Retrieve and decrypt data
- SessionManager.createSession(): Secure session management
```

### 3. Age-Based Content Filtering

#### Age Groups
- **Toddler (0-5)**: Strictest filtering, 150% sensitivity
- **Early Child (6-9)**: Very strict filtering, 130% sensitivity
- **Preteen (10-12)**: Strict filtering, 110% sensitivity
- **Teen (13-17)**: Base filtering, 100% sensitivity

#### Content Categories Filtered
1. **Critical threats**: Violence, self-harm, weapons
2. **Privacy risks**: Personal data requests, location sharing
3. **Financial fraud**: Money requests, payment pressure
4. **Grooming behavior**: Secret meetings, isolation attempts
5. **Bullying**: Harassment, insults, threats
6. **Inappropriate content**: Adult content, explicit material

#### Implementation
```typescript
// MonitoringContext.tsx
- AGE_GROUP_SENSITIVITY: Age-based multipliers
- evaluateMessageRisk(): Risk analysis with age consideration
- KEYWORD_RULES: Age-appropriate detection patterns
```

### 4. AI Content Moderation

#### Text Analysis
- **Pattern matching**: Regex-based keyword detection
- **Context awareness**: Multi-word phrase detection
- **Confidence scoring**: Risk level with confidence percentage
- **Category tagging**: Threat categorization for context

#### Image Analysis
- **Keyword filtering**: Detects weapons, violence, explicit content
- **Blocking mechanism**: Prevents display of flagged content
- **Parent notification**: Alerts for blocked content

#### Voice/Audio Analysis
- **Transcription**: Speech-to-text conversion
- **Text analysis**: Same filtering as text messages
- **Real-time processing**: Immediate risk assessment

### 5. Emergency SOS System

#### Features
- **One-tap activation**: Emergency button in chat screens
- **Location sharing**: Precise GPS coordinates (with permission)
- **Guardian notification**: Alerts sent to all configured contacts
- **Audit trail**: All SOS activations logged for compliance

#### Security Measures
- **Location encryption**: GPS data encrypted at rest
- **Access control**: Only designated guardians receive location
- **Usage logging**: Compliance logs for audit trails
- **False positive handling**: Easy resolution marking

### 6. Parental Controls

#### Control Features
1. **Time restrictions**: Day/time-based usage limits
2. **Contact whitelist**: Approved contacts only
3. **Content filtering**: Age-appropriate content rules
4. **Screen time limits**: Daily usage caps
5. **Activity monitoring**: Real-time threat detection

#### Security Implementation
- **Parent-only access**: Controls protected by authentication
- **Change logging**: All modifications logged with timestamp
- **Parental consent**: Explicit consent required for changes
- **Override protection**: Children cannot modify settings

### 7. Data Privacy & Compliance

#### COPPA Compliance
- **Parental consent**: Required for children under 13
- **Data minimization**: Collect only necessary data
- **Parent access**: Full data review and deletion rights
- **No advertising**: No ads or marketing to children
- **No data sharing**: No third-party data sales

#### GDPR Compliance
- **Right to access**: Users can view all collected data
- **Right to deletion**: Data removal within 30 days
- **Right to rectification**: Data correction on request
- **Data portability**: Export in machine-readable format
- **Consent management**: Explicit opt-in required

#### TDPSA Compliance (Texas)
- **Data protection**: Enhanced security measures
- **Breach notification**: 60-day notification requirement
- **Access controls**: Strong authentication required
- **Audit trails**: Complete activity logging

### 8. Network Security

#### Data Transmission
- **HTTPS only**: All network requests encrypted
- **Certificate pinning**: Prevents MITM attacks (future)
- **API authentication**: Token-based auth for backend
- **Rate limiting**: Prevents abuse and DDoS

#### Push Notifications
- **Expo Push**: Secure notification delivery
- **Token encryption**: Device tokens stored securely
- **Content filtering**: No sensitive data in notifications
- **Parent-only alerts**: Critical notifications to parents

### 9. Local Data Security

#### Storage Strategy
- **Local-first**: Primary data storage on device
- **Minimal cloud**: Only for cross-device sync (optional)
- **Encryption at rest**: All sensitive data encrypted
- **Automatic cleanup**: Old data purged per retention policy

#### Data Retention
- **Account data**: Until account deletion
- **Safety logs**: 90 days
- **SOS alerts**: 1 year (legal compliance)
- **Deleted data**: Permanently removed in 30 days

### 10. Security Best Practices

#### Development
- **Secure coding**: Follow OWASP guidelines
- **Code review**: All changes reviewed for security
- **Dependency scanning**: Regular vulnerability checks
- **Penetration testing**: Annual security audits

#### Operational
- **Access logging**: All data access logged
- **Anomaly detection**: Unusual activity monitoring
- **Incident response**: Documented response procedures
- **User education**: In-app security tips

## Security Checklist for Release

### Pre-Release
- [ ] All sensitive data uses SecureStorage
- [ ] Biometric authentication tested on physical devices
- [ ] Age-based filtering validated for all age groups
- [ ] Parental consent flow tested
- [ ] SOS system tested with real location data
- [ ] Privacy policy reviewed by legal team
- [ ] COPPA compliance verified
- [ ] Data encryption validated

### App Store Submission
- [ ] Privacy descriptions complete in app.json
- [ ] NSUsageDescription strings clear and accurate
- [ ] App Privacy Policy accessible
- [ ] Data collection practices disclosed
- [ ] Age rating appropriate (4+)
- [ ] Parental controls documented

### Post-Release
- [ ] Security monitoring active
- [ ] Incident response plan ready
- [ ] User feedback channels open
- [ ] Regular security updates scheduled
- [ ] Compliance audits scheduled

## Incident Response

### Data Breach Procedure
1. **Immediate**: Isolate affected systems
2. **24 hours**: Notify users and regulators
3. **7 days**: Full investigation report
4. **30 days**: Implement remediation measures
5. **Ongoing**: Monitor for further incidents

### Vulnerability Disclosure
- Email: security@kiku-app.com
- Responsible disclosure: 90-day embargo
- Bug bounty: Rewards for verified findings
- Public disclosure: After fix deployment

## Contact

**Security Team**
- Email: security@kiku-app.com
- Website: www.kiku-app.com/security
- Emergency: Use encrypted channel (PGP key available)

## Updates

This security documentation is reviewed quarterly and updated as needed.

**Last Updated:** January 2, 2026
**Next Review:** April 2, 2026
