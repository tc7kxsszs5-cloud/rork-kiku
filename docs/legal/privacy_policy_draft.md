# Privacy Policy — Rork-Kiku (ЧЕРНОВИК)

## ⚠️ ТРЕБУЕТ ОБЯЗАТЕЛЬНОГО РЕВЬЮ ЮРИСТА

**Версия**: 0.1.0 (Draft)  
**Дата**: 2026-01-02  
**Статус**: **DRAFT — НЕ ИСПОЛЬЗОВАТЬ В PRODUCTION**  
**Контакт**: [FOUNDERS_EMAIL]

---

## Важное уведомление

Этот документ является черновиком Privacy Policy и требует обязательной проверки квалифицированным юристом, специализирующимся на:
- COPPA (Children's Online Privacy Protection Act)
- GDPR (General Data Protection Regulation)
- CCPA/CPRA (California privacy laws)
- Международная трансграничная передача данных

**НЕ ПУБЛИКОВАТЬ** без legal review и approval.

---

## 1. Введение

Добро пожаловать в Rork-Kiku ("мы", "нас", "наш"). Мы серьёзно относимся к защите конфиденциальности вас и вашего ребёнка. Данная Privacy Policy объясняет:
- Какие данные мы собираем
- Как мы используем эти данные
- Как мы защищаем данные
- Ваши права в отношении данных

**Последнее обновление**: 2026-01-02

---

## 2. Кто мы

**Компания**: Rork-Kiku, Inc. [PLACEHOLDER — company legal name]  
**Адрес**: [PLACEHOLDER — legal address]  
**Email**: [FOUNDERS_EMAIL]  
**Website**: [PLACEHOLDER — rork-kiku.com]

---

## 3. Какие данные мы собираем

### 3.1. Родительские данные

**При регистрации**:
- Email address
- Имя (как вы хотите, чтобы вас называли)
- OAuth profile information (если используете Sign in with Google/Apple):
  - User ID от provider
  - Profile photo (опционально)

**При использовании сервиса**:
- Photos вы загружаете для ваших детей
- Metadata фотографий (дата, время, device info)
- Настройки модерации (strict/moderate/relaxed)
- Interaction data (какие фото вы просматриваете, когда)
- Device information (iOS version, device model, IP address)
- Usage analytics (время в приложении, features используемые)

### 3.2. Детские данные (COPPA Protected)

**С вашего согласия мы собираем**:
- Имя ребёнка (только для отображения в приложении)
- Возраст ребёнка (для настройки moderation level)
- Profile photo ребёнка (опционально, загружаемое вами)
- Photos одобренные для ребёнка

**Мы НЕ собираем от детей**:
- Email, phone number, address, SSN, или любые direct contact information
- Behavioral tracking data
- Geolocation (кроме IP address для infrastructure purposes)
- Любые данные без parental consent

### 3.3. Автоматически собираемые данные

- **Logs**: API requests, errors, access logs
- **Analytics**: App usage, feature engagement (через anonymized identifiers)
- **Cookies** (если web app): Session cookies, preference cookies (no advertising cookies)

### 3.4. Данные от третьих сторон

- **OAuth providers** (Google, Apple): Basic profile info (name, email, user ID)
- **Payment processors** (Stripe, Apple IAP): Transaction data (amount, date, status) — но не credit card numbers
- **Infrastructure providers** (AWS, CDN): Technical logs, performance metrics

---

## 4. Как мы используем данные

### 4.1. Основные функции сервиса
- Создание и управление родительскими и детскими аккаунтами
- Загрузка и хранение photos
- AI и human moderation контента
- Отображение approved photos детям
- Отправка уведомлений (push, email)

### 4.2. Улучшение сервиса
- Analytics для понимания, как пользователи используют app
- Retraining ML models для улучшения moderation accuracy (только с aggregated, anonymized data)
- Bug fixes и performance optimization

### 4.3. Безопасность
- Fraud detection и prevention
- Account security (authentication, suspicious activity monitoring)
- Compliance с legal obligations (COPPA, GDPR)

### 4.4. Коммуникация
- Important service updates (policy changes, security alerts)
- Moderation notifications (approved/rejected photos)
- Marketing emails (опционально, opt-in only, no marketing to children)

### 4.5. Что мы НЕ делаем с данными
- ❌ Не продаём данные third parties
- ❌ Не используем для behavioral advertising (особенно детям)
- ❌ Не передаём third parties без вашего consent (кроме service providers)
- ❌ Не создаём profiles детей для advertising purposes

---

## 5. Кому мы передаём данные

### 5.1. Service Providers (Subprocessors)

Мы работаем с trusted third-party providers для infrastructure и services:

| Provider | Purpose | Data Shared | Location |
|----------|---------|-------------|----------|
| AWS (Amazon Web Services) | Cloud hosting, storage | Photos, user data, logs | US (с encryption) |
| Google Cloud / Firebase | Analytics, notifications | Anonymized usage data, push tokens | US |
| Stripe | Payment processing | Email, transaction amount | US |
| [PLACEHOLDER] | Email delivery | Email, name (для emails) | US |

**Data Processing Agreements (DPA)**: Все subprocessors подписали DPA, гарантирующие GDPR/COPPA compliance.

### 5.2. Legal Obligations

Мы можем раскрывать данные если:
- **Court order или subpoena**: По требованию закона
- **Law enforcement**: Для расследования преступлений (например, CSAM)
- **Emergency**: Для предотвращения imminent harm (суицид, насилие)

### 5.3. Business Transfers

Если компания продаётся, merge, или приобретается:
- Данные могут быть переданы новому владельцу
- Мы уведомим вас заранее (30-day notice)
- Вы можете удалить аккаунт до transfer

---

## 6. Трансграничная передача данных

### 6.1. Где хранятся данные

**Primary region**: United States (AWS US-East-1 или US-West-2)

**EU users**: Если вы из EU, ваши данные могут передаваться в US, что не имеет "adequacy decision" от EU Commission. Мы используем **Standard Contractual Clauses (SCC)** для защиты данных.

### 6.2. Data Residency (Roadmap)

**Future plans** (если EU/Asia market растёт):
- EU data center (Frankfurt или Dublin)
- Asia data center (Singapore или Tokyo)
- Data locality compliance (EU data остаётся в EU)

---

## 7. Как мы защищаем данные

### 7.1. Encryption

- **In-transit**: TLS 1.3 для всех API communications
- **At-rest**: AES-256 encryption для databases и S3 storage
- **Sensitive fields**: Application-level encryption (child names, parent emails) с KMS keys

### 7.2. Access Control

- **Role-Based Access Control (RBAC)**: Только authorized personnel have access
- **Moderators**: Access только к photos in moderation queue, no access to approved photos
- **Engineers**: Minimal access, audited, no access to production data без approval
- **Founders**: Full access (для emergency support)

### 7.3. Security Practices

- Regular security audits и penetration testing
- Automated vulnerability scanning
- Incident response plan (см. `docs/security/security_design.md`)
- Employee training на security best practices

### 7.4. Data Retention

- **Approved photos**: До удаления parent или account termination
- **Rejected photos**: 30 days (для appeals), затем удаляются
- **User accounts**: До удаления parent
- **Logs**: 90 days (application logs), 7 years (audit logs для compliance)
- **Backups**: 30 days, encrypted

---

## 8. Ваши права (GDPR, CCPA, COPPA)

### 8.1. Right to Access

Вы можете запросить copy всех данных мы храним о вас и вашем ребёнке:
- **Метод**: In-app "Export Data" или email [FOUNDERS_EMAIL]
- **Format**: JSON или CSV
- **Timeline**: Within 30 days (GDPR), 45 days (CCPA)

### 8.2. Right to Rectification

Исправить неточные данные:
- **Метод**: In-app settings или email support
- **Timeline**: Immediate для user-editable fields

### 8.3. Right to Erasure ("Right to be Forgotten")

Удалить account и все данные:
- **Метод**: In-app "Delete Account" или email [FOUNDERS_EMAIL]
- **Timeline**: 30-day grace period (можете восстановить), затем permanent deletion
- **Exceptions**: Мы можем хранить audit logs для legal compliance (но personal identifiers удалены)

### 8.4. Right to Data Portability

Export данных в machine-readable format (JSON):
- **Метод**: In-app "Export Data"
- **Included**: All your photos, child profiles, moderation history

### 8.5. Right to Object

Вы можете object к:
- Marketing emails (opt-out в любой момент)
- Analytics tracking (частично — некоторые analytics необходимы для service)

### 8.6. Right to Withdraw Consent

Вы можете withdraw consent в любой момент:
- Delete child profile → удаляет все child data
- Delete account → удаляет все data

### 8.7. Right to Lodge a Complaint

Если вы считаете, что мы нарушили ваши privacy rights:
- **EU**: Contact your local Data Protection Authority (DPA)
- **US**: Contact FTC (Federal Trade Commission)
- **Our contact**: [FOUNDERS_EMAIL] (мы постараемся решить issue напрямую)

---

## 9. COPPA Compliance (для детей < 13 лет)

### 9.1. Parental Consent

**Мы получаем verifiable parental consent** перед сбором child data:
- Age gate при sign-up ("Are you 18 or older?")
- Email verification (доказательство, что взрослый)
- Payment verification (опционально для Premium)

**Parent understands и consents**:
- Types of data collected (name, age, photos)
- How data used (moderation, display to child)
- Data retention policy
- Parent can review и delete child data

### 9.2. No Behavioral Advertising

Мы **НЕ показываем behavioral ads детям** (или вообще не показываем ads — freemium model).

### 9.3. Data Minimization

Мы собираем **только необходимые данные** для service:
- Name и age (для moderation settings)
- Photos (uploaded by parent)
- NO contact info, geolocation, browsing history, or third-party tracking

### 9.4. Parent Control

Parent может:
- Review all child data (in-app)
- Delete child profile (удаляет все data)
- Change moderation settings
- Appeal moderation decisions

---

## 10. Cookies и Tracking

### 10.1. Mobile App (iOS/Android)

**Мы НЕ используем cookies** в mobile app (native app, не web view).

**Tracking**:
- Session tokens (JWT) для authentication
- Anonymous analytics (aggregated usage data)
- Push notification tokens (для notifications)

**No third-party tracking SDKs** (no Facebook Pixel, Google Ads, etc.)

### 10.2. Website (если планируется)

**Essential cookies**:
- Session cookies (для login)
- Preference cookies (language, theme)

**Analytics cookies** (опционально):
- Google Analytics (anonymized IP)
- Can opt-out через cookie banner

**No advertising cookies**: Мы не используем advertising cookies.

---

## 11. Changes to This Policy

### 11.1. Notification

Если мы вносим material changes в policy:
- Email notification (30-day advance notice)
- In-app notification (pop-up при next login)
- Updated policy posted at [WEBSITE_URL]/privacy

### 11.2. Continued Use

Продолжая использовать service после changes, вы accept updated policy.

### 11.3. If You Disagree

Если вы не согласны с updated policy:
- Delete account (right to erasure)
- Contact [FOUNDERS_EMAIL] to discuss concerns

---

## 12. Контакты

### Data Protection Officer (DPO)
- **Email**: [FOUNDERS_EMAIL] (пока нет dedicated DPO, founders handle)
- **Address**: [PLACEHOLDER — company address]

### General Inquiries
- **Support**: [FOUNDERS_EMAIL]
- **Legal**: [FOUNDERS_EMAIL]

### Regulatory Authorities
- **US FTC**: https://www.ftc.gov/
- **EU DPA**: [Your local DPA — see https://edpb.europa.eu/]

---

## 13. Для родителей из конкретных jurisdictions

### 13.1. California (CCPA/CPRA)

Если вы resident California:
- Right to know (what data collected, sold, disclosed)
- Right to delete
- Right to opt-out of sale (мы не продаём данные)
- Right to non-discrimination

**Contact**: [FOUNDERS_EMAIL] для CCPA requests.

### 13.2. European Union (GDPR)

Если вы resident EU:
- All rights described в Section 8
- Data transfers protected by SCC
- Right to lodge complaint с local DPA

**EU Representative**: [PLACEHOLDER — если требуется по GDPR]

### 13.3. United Kingdom (UK GDPR)

Similar to EU GDPR:
- UK ICO (Information Commissioner's Office) — regulatory authority
- **Contact**: https://ico.org.uk/

---

## 14. Children's Rights

### Если ребёнку исполнилось 13 лет

When child turns 13:
- Parent может convert child profile to independent account (если планируется)
- Или продолжить parent-managed account
- Child может request independent account (с parent approval)

**Текущий scope (MVP)**: Дети НЕ имеют independent login. Parent manages all.

---

## 15. Security Breach Notification

Если происходит data breach affecting personal data:
- **EU**: Notification within 72 hours (GDPR requirement)
- **US**: Notification в reasonable timeframe (COPPA, state breach laws)
- **Method**: Email + in-app notification + website post

**What we'll tell you**:
- What data affected
- When breach occurred
- What we're doing to fix it
- What you should do (change password, monitor accounts)

---

## 16. Disclaimer & Legal

Этот Privacy Policy является **черновиком** и не является legal advice. Требует review от:
- Privacy lawyer (специализация COPPA, GDPR, CCPA)
- Compliance officer (если нанят)
- Data Protection Officer (если требуется)

**НЕ ИСПОЛЬЗОВАТЬ в production без legal approval.**

**Контакт**: [FOUNDERS_EMAIL]

---

**Effective Date**: [TO BE DETERMINED — после legal review]

**Last Updated**: 2026-01-02 (Draft Version)

---

**DISCLAIMER**: This Privacy Policy draft is for internal review only and must be reviewed by a qualified attorney before use in production. It does not constitute legal advice. All placeholders ([FOUNDERS_EMAIL], [PLACEHOLDER]) must be replaced with actual information.
