# Privacy Policy (Черновик)

**Дата вступления в силу**: [DATE]  
**Последнее обновление**: Январь 2026

⚠️ **ВАЖНО**: Это черновик и требует обязательной юридической проверки перед публикацией.

---

## Введение

Добро пожаловать в Rork-Kiku. Мы — платформа для защиты детей в цифровой среде, и мы очень серьезно относимся к конфиденциальности, особенно когда речь идет о детях.

Этот Privacy Policy объясняет:
- Какую информацию мы собираем
- Как мы используем эту информацию
- С кем мы делимся информацией
- Ваши права (родителей и детей)
- Как связаться с нами

**Важно**: Rork-Kiku соблюдает COPPA (Children's Online Privacy Protection Act) и GDPR (General Data Protection Regulation).

---

## Кто мы

**Компания**: Rork-Kiku, Inc. [LEGAL_ENTITY_NAME]  
**Адрес**: [COMPANY_ADDRESS]  
**Email**: [PRIVACY_EMAIL] (например, privacy@rork-kiku.com)  
**Телефон**: [PHONE_NUMBER]

**Data Protection Officer** (если требуется по GDPR): [DPO_NAME], [DPO_EMAIL]

---

## Для кого этот сервис

Rork-Kiku предназначен для **семей с детьми до 13 лет** (primary audience).

**Важно**:
- **Родители** создают аккаунты и управляют настройками
- **Дети** используют приложение под контролем родителей
- Мы **не собираем** личную информацию детей без **verifiable parental consent** (COPPA requirement)

---

## Какую информацию мы собираем

### 1. Информация от родителей

#### A. Account Information (при регистрации)
- **Email address** (родителя)
- **Password** (хешированный, не хранится в открытом виде)
- **Имя** (опционально)
- **Credit card information** (для верификации родительского согласия и платежей)
  - ⚠️ **Мы НЕ храним** полные номера карт. Используется Stripe (PCI DSS compliant)
  - Храним только: last 4 digits, expiration date, card brand

#### B. Child Profile Information
- **Имя ребенка** (или псевдоним, на выбор родителя)
- **Возраст ребенка** (для настройки фильтров)
- **Avatar** (предустановленные изображения, НЕ фото ребенка)
- **Filter level** (низкий/средний/высокий)

#### C. Usage Data (родительский аккаунт)
- **Login history** (timestamps, IP addresses)
- **Settings changes** (какие настройки и когда изменялись)
- **Dashboard views** (как часто родитель проверяет активность)

### 2. Информация о детском использовании

⚠️ **COPPA Compliance**: Эта информация собирается **только после** получения verifiable parental consent.

#### A. Content Filtering Data
- **URLs** visited или attempted (не полные browse history, только что было проверено фильтром)
- **Content checks** (текст/изображение отправлено на проверку, хешированный)
- **Filter decisions** (block/warn/allow)
- **Timestamps** (когда произошло событие)

**Что мы НЕ собираем**:
- ❌ Полная история браузинга (comprehensive browse history)
- ❌ Keystrokes (кроме контента, отправленного на проверку)
- ❌ Screenshots или screen recordings
- ❌ Geolocation в real-time (если не включено родителем для geofencing feature)
- ❌ Contacts из адресной книги

#### B. Device Information
- **Device model** (iPhone 12, iPad Air, etc.)
- **OS version** (iOS 17.2)
- **App version** (Rork-Kiku v1.2.0)
- **Device ID** (anonymized, для analytics)

#### C. Usage Analytics
- **App opens/closes** (frequency)
- **Feature usage** (какие функции используются)
- **Crash reports** (если приложение падает, для bug fixing)

**Anonymized & Aggregated**: Analytics данные используются в aggregated form (не привязаны к конкретному ребенку в reports).

---

## Как мы используем информацию

### 1. Предоставление сервиса

- **Content filtering**: Проверка контента на соответствие политике безопасности
- **Parent dashboard**: Показываем родителям активность и заблокированный контент
- **Parental controls**: Применение настроек, установленных родителем
- **Notifications**: Отправка уведомлений о важных событиях (blocked content, child requests)

### 2. Улучшение продукта

- **ML model training**: Используем анонимизированные данные для улучшения точности фильтров
- **Bug fixing**: Crash reports и error logs для исправления ошибок
- **Feature development**: Analytics помогают понять, какие функции важны пользователям

⚠️ **Анонимизация**: Перед использованием в ML training, данные anonymized (удаляются personal identifiers).

### 3. Безопасность

- **Fraud prevention**: Обнаружение подозрительной активности (взломы, abuse)
- **Child safety**: Обнаружение potential threats (grooming, self-harm)
- **Compliance**: Выполнение юридических обязательств (reporting CSAM к NCMEC)

### 4. Коммуникация

- **Service updates**: Важные изменения в сервисе или политике
- **Support**: Ответы на вопросы родителей
- **Marketing** (опционально): Новости, tips, updates
  - ⚠️ **Opt-out доступен**: Родители могут отказаться от marketing emails

---

## С кем мы делимся информацией

### Мы НЕ продаем данные

❌ **Мы НИКОГДА не продаем** personal information детей или родителей third parties.

### Sharing (в ограниченных случаях)

#### 1. Service Providers (Processors)

Мы используем third-party services для работы платформы:

**Cloud Infrastructure**:
- **AWS** (Amazon Web Services) — hosting, database, storage
- **Data processed**: All user data (encrypted at rest and in transit)
- **Location**: US-East-1 (можно изменить для GDPR compliance)
- **DPA signed**: ✅ Data Processing Agreement

**Payment Processing**:
- **Stripe** — обработка платежей
- **Data processed**: Credit card info (НЕ передаем детские данные)
- **PCI DSS compliant**: ✅

**Communication**:
- **SendGrid** — transactional emails
- **Firebase Cloud Messaging** — push notifications
- **Data processed**: Email addresses, device tokens (не детские данные)

**Analytics** (Anonymized):
- **Mixpanel / Amplitude** — product analytics
- **Data processed**: Anonymized usage data (нет PII)

**Support**:
- **Zendesk** — customer support
- **Data processed**: Parent inquiries, email, support history

⚠️ **All service providers** подписывают DPA (Data Processing Agreement) и обязаны соблюдать COPPA/GDPR.

#### 2. Legal Requirements

Мы можем раскрыть информацию, если это требуется законом:

- **Court orders / subpoenas** (судебные запросы)
- **Law enforcement** (если законное требование)
- **NCMEC reporting** (Child Sexual Abuse Material — обязательная отчетность)
- **Emergency situations** (imminent threat to child's safety)

**Transparency**: Мы оспариваем необоснованные запросы и уведомляем пользователей (если законом разрешено).

#### 3. Business Transfers

В случае слияния, поглощения или продажи компании:
- Данные пользователей могут быть переданы новому владельцу
- **Обязательство**: Новый владелец должен соблюдать этот Privacy Policy или уведомить пользователей о изменениях

#### 4. Aggregated Data

Мы можем публиковать **aggregated, anonymized** data:
- Transparency reports (сколько контента заблокировано, категории)
- Industry research (child safety trends)
- Marketing materials (общая статистика пользователей)

❌ **Никогда не включаем** personal identifiers в public reports.

---

## Права родителей (COPPA & GDPR)

### 1. Right to Access (Право доступа)

Родители имеют право запросить копию всех данных, которые мы собрали о их ребенке.

**Как запросить**:
- Email на [PRIVACY_EMAIL]
- Или через родительскую панель: Settings → Privacy → "Export my data"

**Timeframe**: Ответим в течение 30 дней (GDPR requirement)

**Format**: JSON или CSV file (на выбор)

### 2. Right to Rectification (Право исправления)

Если данные неточные или неполные, родители могут запросить исправление.

**Как**: Email на [PRIVACY_EMAIL] с деталями

### 3. Right to Erasure ("Right to be Forgotten")

Родители могут запросить удаление всех данных о ребенке.

**Как**:
- Settings → Account → "Delete child account"
- Email request на [PRIVACY_EMAIL]

**Что удаляется**:
- Child profile
- Content filtering history
- Usage analytics
- All associated data

**Timeframe**: Немедленно из production systems, до 90 дней из backups

**Exceptions** (когда мы можем сохранить данные):
- Legal obligation (pending investigation)
- Fraud prevention (hashed identifiers, не PII)
- Aggregated analytics (anonymized, не привязаны к ребенку)

### 4. Right to Data Portability

Родители могут запросить данные в machine-readable format для переноса к другому сервису.

**Format**: JSON (структурированный, с documentation)

### 5. Right to Object

Родители могут возразить против:
- Processing данных для marketing
- Automated decision-making (в некоторых случаях)

**Note**: Некоторые processing essential для работы сервиса (например, content filtering). Отказ от этого processing означает невозможность использовать сервис.

### 6. Right to Withdraw Consent

Родители могут отозвать consent в любое время.

**Как**: Delete account (автоматически отзывает consent)

**Effect**: Прекращается сбор и обработка данных, но ранее собранные данные могут быть сохранены для legal reasons (см. retention policy ниже).

---

## Права детей

### Communication с детьми

Мы **не коммуницируем напрямую** с детьми без parental consent, кроме:
- In-app notifications (related к использованию, например "Content blocked")
- Safety resources (если ребенок нажимает "Need help?" — hotline numbers)

### Дети могут запросить (через родителя)

- Доступ к своим данным
- Исправление данных
- Удаление аккаунта

**Process**: Ребенок обращается к родителю → родитель делает запрос (см. выше)

---

## Data Retention (Хранение данных)

### Active Accounts

Пока аккаунт активен, мы храним данные необходимые для работы сервиса.

### Deleted Accounts

**Немедленное удаление** (production databases):
- Child profile
- Parent account info
- Active sessions

**Delayed deletion** (backups & logs):
- **Backup retention**: 90 дней (для disaster recovery)
- **Logs**: 1 год (для security & compliance)
  - После 1 года: удаляются или anonymized (PII removed)

**Permanent retention** (aggregated, anonymized):
- Analytics (не привязаны к конкретному user)
- ML training data (anonymized, нет PII)

### Inactive Accounts

Если аккаунт неактивен > 2 года:
- Отправляем уведомление родителю (email)
- Если нет ответа в течение 90 дней → удаляем аккаунт (см. выше)

---

## Security Measures (Безопасность)

### Encryption

- **In transit**: TLS 1.3 (all communications)
- **At rest**: AES-256 (database, backups, storage)
- **Passwords**: bcrypt hashing (not stored in plaintext)
- **PII**: Additional encryption layer (field-level) using AWS KMS

### Access Control

- **Principle of Least Privilege**: Employees имеют доступ только к данным, необходимым для работы
- **Role-Based Access Control** (RBAC): Разные роли (engineer, support, admin) с разными permissions
- **Audit logs**: Все доступы к PII логируются

### Monitoring

- **Security monitoring**: Real-time alerts на suspicious activity
- **Penetration testing**: Regular external security audits
- **Bug bounty**: [TO BE LAUNCHED] для responsible disclosure

### Employee Training

- **COPPA/GDPR training**: Все employees проходят обучение
- **Background checks**: Для employees с доступом к детским данным
- **Confidentiality agreements**: Все employees подписывают NDA

### Incident Response

В случае data breach:
1. **Containment**: Немедленная изоляция affected systems
2. **Assessment**: Определение scope (какие данные, сколько пользователей)
3. **Notification**:
   - Affected users: Уведомляем в течение 72 часов (GDPR)
   - Authorities: FTC (COPPA), data protection authority (GDPR)
4. **Remediation**: Устранение vulnerability
5. **Post-mortem**: Анализ и prevention measures

---

## International Data Transfers

**Primary data location**: США (AWS US-East-1)

### For EU users (GDPR)

Если вы находитесь в EU:
- Данные могут передаваться в США (где наши servers)
- **Legal basis**: Standard Contractual Clauses (SCC) + AWS DPA
- **Adequacy decision**: Ожидаем EU-US Data Privacy Framework resolution

**Your rights**: EU residents имеют дополнительные права по GDPR (см. выше).

**Supervisory authority**: Вы можете обратиться в вашу локальную data protection authority с жалобами.

---

## Cookies & Tracking

### Mobile App (iOS/Android)

Мы **не используем** traditional cookies в mobile app, но используем:
- **Device identifiers** (для analytics)
- **Session tokens** (для authentication)
- **Local storage** (для offline functionality)

**Opt-out**: Вы можете disable analytics в Settings → Privacy → "Analytics".

### Website (если есть)

Наш website может использовать:
- **Essential cookies**: Для работы сайта (login, session)
- **Analytics cookies**: Google Analytics (anonymized IP)
- **Marketing cookies**: (опционально, с вашего consent)

**Manage cookies**: Cookie banner при первом посещении, можно изменить preferences в любое время.

---

## Children Under 13

### COPPA Compliance

Rork-Kiku **не позволяет** детям создавать свои аккаунты. Только родители могут создать аккаунт.

**Verifiable Parental Consent**:
- Email verification
- Credit card authorization (reasonable method по FTC)

**Parental rights** (см. выше):
- Access, rectify, delete child data
- Revoke consent в любое время

**No direct marketing к детям**: Мы не отправляем marketing materials детям.

---

## Changes to This Policy

Мы можем обновлять этот Privacy Policy.

**Notification**:
- **Material changes**: Уведомим по email и в app (не менее чем за 30 дней до вступления)
- **Minor changes**: Обновим "Last updated" date и опубликуем на сайте

**Your choice**: Если вы не согласны с изменениями, вы можете удалить аккаунт.

---

## Contact Us

Вопросы о Privacy Policy или данных:

**Email**: [PRIVACY_EMAIL]  
**Mail**: [COMPANY_ADDRESS]  
**Phone**: [PHONE_NUMBER]  
**Data Protection Officer** (если применимо): [DPO_EMAIL]

**Response time**: Ответим в течение 10 business days.

---

## For EU Residents: Supervisory Authority

Если вы не удовлетворены нашим ответом, вы можете обратиться в:

**[YOUR LOCAL DATA PROTECTION AUTHORITY]**  
Example (Ireland): Data Protection Commission - https://www.dataprotection.ie/

---

## Appendix A: Glossary

**COPPA**: Children's Online Privacy Protection Act (US law)  
**GDPR**: General Data Protection Regulation (EU law)  
**PII**: Personally Identifiable Information  
**DPA**: Data Processing Agreement  
**CSAM**: Child Sexual Abuse Material  
**NCMEC**: National Center for Missing & Exploited Children

---

**Effective Date**: [TO BE FILLED]  
**Version**: 1.0 (Draft)  
**Last Reviewed**: Январь 2026

⚠️ **IMPORTANT**: This is a draft. Must be reviewed by legal counsel specialized in:
- COPPA compliance
- GDPR compliance
- Data privacy law
- Child safety law

**Before publishing**:
- [ ] Legal review completed
- [ ] FTC guidance consulted
- [ ] GDPR compliance verified
- [ ] All placeholders filled
- [ ] Published on website & in-app
- [ ] User notification (if updating existing policy)

---

**Questions for Legal Review**:
1. Is credit card verification sufficient for verifiable parental consent?
2. Data retention periods — are they compliant?
3. International data transfers — do we need additional safeguards?
4. Any state-specific requirements (California CCPA, etc.)?
5. Review all service provider agreements for COPPA/GDPR compliance
