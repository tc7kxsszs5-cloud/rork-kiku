# Privacy Policy — Rork-Kiku (ЧЕРНОВИК)

**Дата вступления в силу:** [DATE]  
**Последнее обновление:** 2026-01-02  

**ТРЕБУЕТ ЮРИСТА:** Данный документ является черновиком и ОБЯЗАТЕЛЬНО должен быть reviewed и approved юристом, специализирующимся на privacy law (GDPR, COPPA) перед публикацией.

---

## 1. Введение

Добро пожаловать в Rork-Kiku!

Мы глубоко привержены защите конфиденциальности детей и их родителей. Данная Privacy Policy объясняет, какие данные мы собираем, как мы их используем, как защищаем, и какие права у вас есть.

**Rork-Kiku** — это платформа для безопасной коммуникации между родителями и детьми. Мы понимаем важность защиты данных несовершеннолетних и строим продукт в соответствии с самыми строгими стандартами privacy.

**Наши принципы:**
- **Privacy by Design:** конфиденциальность встроена в продукт с первого дня
- **Минимизация данных:** собираем только то, что необходимо
- **Прозрачность:** четко объясняем, что и зачем собираем
- **Контроль родителей:** полный доступ и контроль над данными детей
- **Compliance:** соблюдаем GDPR, COPPA и другие регуляторные требования

---

## 2. Кто мы

**Имя компании:** [COMPANY_LEGAL_NAME]  
**Юридический адрес:** [ADDRESS]  
**Email:** [PRIVACY_EMAIL]  
**Контактное лицо (DPO):** [DPO_NAME], [DPO_EMAIL] *(если требуется назначение DPO согласно GDPR)*

---

## 3. К кому относится данная политика

Данная Privacy Policy применяется к:
- **Родителям** — взрослые пользователи (18+), которые создают аккаунты и управляют профилями детей
- **Детям** — несовершеннолетние пользователи (обычно 4-12 лет), чьи профили создают и контролируют родители
- **Посетители сайта** — все, кто посещает наш сайт или использует наши сервисы

---

## 4. Какие данные мы собираем

### 4.1 Данные родителей (взрослых)

#### Информация, которую вы предоставляете:

**При регистрации:**
- Имя и фамилия
- Email адрес
- Пароль (хешированный, никогда не хранится в открытом виде)
- Телефон (опционально, для верификации)

**При использовании сервиса:**
- Медиафайлы (фото, видео, аудио), которые вы отправляете детям
- Текстовые сообщения
- Настройки аккаунта (уровень модерации, preferences)
- Платёжная информация (если подписка Premium):
  - Карточные данные обрабатываются через Stripe/PayPal (мы не храним CVV или полные номера карт)
  - Billing address

**Автоматически собираемая информация:**
- IP адрес
- Device information (тип устройства, OS, версия приложения)
- Usage data (какие features используете, как часто, время сессий)
- Log data (время входа, действия в приложении)

### 4.2 Данные детей (несовершеннолетних)

**ВАЖНО:** Согласно COPPA и GDPR, мы собираем данные детей **только с verifiable parental consent**.

#### Информация, которую родители предоставляют о ребёнке:

**При создании профиля ребёнка:**
- Имя (только первое имя, не фамилия)
- Дата рождения (для расчёта возраста)
- Пол (опционально)
- Фото профиля (опционально)

#### Информация, которую ребёнок создаёт при использовании:

**Контент:**
- Медиафайлы (фото, видео, аудио), которые ребёнок отправляет родителю
- Текстовые сообщения (короткие, до 100 символов)
- Взаимодействие с образовательным контентом (что просматривал, favorite)

**Usage data:**
- Device information (минимально, только для технической поддержки)
- Время использования приложения (для parental controls)
- Log data (для безопасности и troubleshooting)

**Мы НЕ собираем:**
- ❌ Фамилию ребёнка
- ❌ Точный адрес (только город/регион для локализации)
- ❌ Номер телефона ребёнка
- ❌ Email ребёнка
- ❌ Social Security Number или другие ID
- ❌ Geolocation (точное местоположение)
- ❌ Biometric data
- ❌ Browsing history за пределами приложения
- ❌ Контакты с устройства
- ❌ Любые данные, не необходимые для core functionality

### 4.3 Данные модерации

**Для обеспечения безопасности:**
- Копии всех медиафайлов, отправленных детьми, для модерации
- ML модерация scores (confidence levels по категориям)
- Решения модераторов (approve/reject/escalate)
- Timestamps всех действий модерации

**Retention:**
- Одобренный контент: хранится согласно настройкам родителя (default: 1 год)
- Заблокированный контент: удаляется в течение 30 дней (сохраняется только hash для предотвращения re-upload)
- Moderation logs: хранятся 2 года для compliance и улучшения моделей

### 4.4 Cookies и tracking technologies

**На веб-сайте (не в мобильном приложении):**
- Essential cookies (необходимы для работы сайта)
- Analytics cookies (Google Analytics, опционально с consent)
- Мы НЕ используем рекламные cookies или третьесторонние trackers

**В мобильном приложении:**
- Firebase Analytics (анонимизированная аналитика)
- Crashlytics (для отчётов о сбоях)

**Вы можете отключить analytics в настройках приложения.**

---

## 5. Как мы используем данные

### 5.1 Цели использования

**Предоставление сервиса:**
- Обеспечение коммуникации между родителями и детьми
- Модерация контента для безопасности детей
- Хранение и доставка медиафайлов
- Управление аккаунтами и профилями

**Улучшение сервиса:**
- Анализ usage patterns для улучшения UX
- A/B тестирование новых features
- Улучшение ML моделей модерации на основе feedback

**Безопасность и compliance:**
- Обнаружение fraud и abuse
- Защита от unauthorized access
- Compliance с legal requirements (GDPR, COPPA, court orders)
- Audit trails для accountability

**Коммуникация:**
- Отправка уведомлений (push, email) о новых сообщениях, модерации
- Customer support
- Product updates и important announcements
- Marketing emails (только для родителей, с opt-out)

**Billing:**
- Обработка платежей для Premium subscriptions
- Invoicing и tax compliance

### 5.2 Lawful Basis (GDPR)

**Для родителей (взрослых):**
- **Contract:** обработка данных необходима для предоставления сервиса
- **Legitimate interest:** улучшение продукта, безопасность, fraud prevention
- **Consent:** marketing emails, analytics (можно отозвать)

**Для детей:**
- **Parental consent:** все обработки данных детей основаны на verifiable parental consent
- **Contract:** предоставление сервиса согласно Terms of Service, принятым родителем
- **Legal obligation:** compliance с COPPA, GDPR, reporting illegal content

---

## 6. Как мы защищаем данные

### 6.1 Технические меры безопасности

**Шифрование:**
- **In transit:** TLS 1.3 для всех коммуникаций (HTTPS, API calls)
- **At rest:** AES-256 для всех данных в базе данных и storage
- Passwords: bcrypt hashing с salt (никогда не хранятся в открытом виде)

**Access controls:**
- Multi-factor authentication (MFA) для родителей
- Role-Based Access Control (RBAC) для внутренних систем
- Least privilege principle (сотрудники имеют доступ только к необходимым данным)

**Infrastructure security:**
- AWS KMS для key management с автоматической ротацией
- Firewalls и security groups
- DDoS protection (AWS Shield)
- Regular security audits и penetration testing

**Monitoring:**
- 24/7 security monitoring и alerts
- Automated anomaly detection
- Audit logs для всех sensitive actions (immutable, encrypted)

### 6.2 Организационные меры

**Staff training:**
- Все сотрудники проходят обучение по privacy и security
- Background checks для сотрудников с доступом к данным

**Incident response:**
- Playbook для response на security incidents
- Обязательство notification в течение 72 часов (GDPR)

**Third-party vendors:**
- Due diligence при выборе vendors (AWS, Stripe, etc.)
- Data Processing Agreements (DPA) со всеми processors
- Regular audits vendor compliance

### 6.3 Data minimization

**Мы собираем только необходимые данные:**
- Спрашиваем минимум информации при регистрации
- Не требуем фамилию ребёнка
- Не собираем location, contacts, browsing history
- Удаляем данные, когда они больше не нужны (см. Retention Policy)

---

## 7. С кем мы делимся данными

### 7.1 Мы НЕ продаём ваши данные

**Мы НИКОГДА не продаём личные данные родителей или детей третьим лицам. Точка.**

### 7.2 С кем мы можем делиться данными:

**Service providers (обработчики данных):**
- **Cloud hosting:** AWS (для хранения данных, compute)
- **ML APIs:** OpenAI, AWS Rekognition, Google Cloud Vision (для модерации контента)
- **Payment processing:** Stripe, PayPal (для billing)
- **Email/SMS:** SendGrid, Twilio (для notifications)
- **Analytics:** Google Analytics, Firebase (анонимизированные данные)

**Все service providers:**
- Подписывают Data Processing Agreements (DPA)
- Обязаны соблюдать GDPR, COPPA
- Имеют доступ только к необходимым данным
- Не могут использовать данные для своих целей

**Law enforcement и legal requests:**
- Мы можем раскрыть данные при наличии valid legal request:
  - Court order (судебное постановление)
  - Subpoena (повестка)
  - Law enforcement request (с proper authorization)
- Мы review все requests для validity перед раскрытием
- Мы уведомляем пользователей, если это не запрещено законом

**Child safety:**
- Если мы обнаруживаем Child Sexual Abuse Material (CSAM), мы обязаны report to NCMEC (США) или соответствующим authorities
- Если есть immediate threat к безопасности ребёнка, мы можем report authorities

**Business transfers:**
- В случае merger, acquisition, или sale of assets, данные могут быть transferred новому владельцу
- Новый владелец обязан соблюдать данную Privacy Policy (или уведомить вас о изменениях)

**Aggregated data:**
- Мы можем публиковать или делиться aggregated, anonymized data (например, "50% пользователей используют feature X")
- Эти данные не идентифицируют конкретных пользователей

---

## 8. Международная передача данных

### 8.1 Где хранятся данные

**Primary region:** [REGION, например, EU-West (Ireland) для EU compliance]

**Мы используем AWS с data residency:**
- **EU users:** данные хранятся в EU (GDPR compliance)
- **US users:** данные хранятся в US
- **Other regions:** данные могут храниться в ближайшем AWS region

### 8.2 Cross-border transfers

**Если данные передаются за пределы EEA:**
- Мы используем **Standard Contractual Clauses (SCC)** approved by European Commission
- Или полагаемся на **adequacy decisions** (например, для швейцарских или UK transfers)
- Service providers (AWS, Google) имеют certifications и appropriate safeguards

**Ваши права:** если вы в EU, ваши данные защищены GDPR независимо от того, где они физически хранятся.

---

## 9. Ваши права и контроль

### 9.1 Права родителей (GDPR, COPPA)

**Access (доступ):**
- Вы можете запросить копию всех данных, которые мы храним о вас и вашем ребёнке
- Доступно через родительскую панель управления или email на [PRIVACY_EMAIL]

**Rectification (исправление):**
- Вы можете исправить неточные данные в настройках аккаунта
- Или связаться с нами для помощи

**Deletion (удаление):**
- Вы можете удалить аккаунт и все данные в любое время
- В настройках: "Удалить аккаунт" → confirmation
- Данные удаляются в течение 30 дней (retention для legal purposes, затем полное удаление)
- Некоторые данные могут сохраняться в backups до 90 дней, затем удаляются

**Restriction (ограничение обработки):**
- Вы можете запросить ограничение обработки данных (например, на время dispute)

**Portability (переносимость):**
- Вы можете экспортировать все данные в machine-readable format (JSON, CSV)
- Доступно через родительскую панель: "Экспортировать данные"

**Objection (возражение):**
- Вы можете возразить против обработки данных на основе legitimate interest
- Вы можете opt-out из marketing emails (кнопка "Unsubscribe")

**Withdraw consent (отзыв согласия):**
- Вы можете отозвать согласие на обработку данных ребёнка в любое время
- Это приведёт к удалению аккаунта ребёнка и всех данных

### 9.2 Права детей

**Дети не имеют прямого доступа к настройкам, но:**
- Родители действуют от имени детей
- Родители контролируют все данные детей
- При достижении age of consent (16 лет в EU, 13 в США), аккаунт может быть transferred ребёнку (с его consent)

### 9.3 Как осуществить права

**Через приложение:**
- Родительская панель → Настройки → Privacy & Data

**Через email:**
- Отправьте запрос на [PRIVACY_EMAIL]
- Мы response в течение 30 дней (GDPR requirement)
- Мы можем запросить подтверждение личности

**Через DPO:**
- Если у вас concerns о privacy, свяжитесь с DPO: [DPO_EMAIL]

---

## 10. Data retention (сроки хранения)

### 10.1 Сроки хранения данных

**Активный аккаунт:**
- Данные хранятся, пока аккаунт активен

**После удаления аккаунта:**
- Большинство данных удаляется в течение 30 дней
- Некоторые данные сохраняются для legal compliance:
  - Audit logs: 2 года (для fraud prevention, legal claims)
  - Financial records: 7 лет (tax compliance)
  - Moderation logs: 2 года (для compliance, ML improvement)

**Медиафайлы:**
- Одобренный контент: хранится 1 год после последнего доступа (или согласно настройкам родителя)
- Заблокированный контент: удаляется в течение 30 дней (hash сохраняется для предотвращения re-upload)

**Backups:**
- Backups могут содержать данные до 90 дней после deletion
- Затем данные удаляются из backups

### 10.2 Inactive accounts

**Если аккаунт неактивен 2 года:**
- Мы отправляем email warning за 30 дней до удаления
- Если нет response, аккаунт и данные удаляются

---

## 11. Verifiable Parental Consent (COPPA)

### 11.1 Механизмы consent

**При создании профиля ребёнка:**
1. Родитель получает disclosure о том, какие данные мы собираем о ребёнке
2. Родитель подтверждает, что является legal guardian
3. Родитель предоставляет consent на сбор данных

**Методы верификации родителя:**
- **Credit card verification:** микротранзакция $0.01 (primary method)
- **School/NGO verification:** bulk enrollment через verified partners
- **Document check:** загрузка паспорта (для сложных случаев)

**Родитель может отозвать consent в любое время:**
- В настройках профиля ребёнка: "Удалить профиль"
- Все данные ребёнка удаляются

### 11.2 Parental notification

**Мы уведомляем родителей:**
- При создании профиля ребёнка (email confirmation)
- При любых изменениях в Privacy Policy (email + in-app notification)
- При любых significant events (security incident, data breach)

---

## 12. Изменения в Privacy Policy

### 12.1 Как мы уведомляем об изменениях

**Minor changes:**
- Обновляем "Последнее обновление" дату
- Публикуем на сайте

**Material changes (существенные изменения):**
- Email notification всем пользователям за 30 дней до вступления в силу
- In-app notification
- Возможность opt-out (или удалить аккаунт, если не согласны)

### 12.2 Согласие с изменениями

**Продолжая использовать сервис после effective date, вы принимаете новую Privacy Policy.**

**Если вы не согласны:**
- Вы можете удалить аккаунт до effective date
- Мы удалим все данные согласно Retention Policy

---

## 13. Дети и конфиденциальность

### 13.1 Мы не собираем данные детей без parental consent

**Если мы узнаём, что собрали данные ребёнка без verifiable parental consent:**
- Мы немедленно удаляем эти данные
- Мы уведомляем родителя (если можем идентифицировать)

### 13.2 Образовательные цели

**Мы используем данные детей только для:**
- Предоставления сервиса (коммуникация с родителем)
- Модерации контента (безопасность)
- Улучшения продукта (анонимизированная аналитика)

**Мы НЕ используем данные детей для:**
- ❌ Targeted advertising (у нас вообще нет рекламы)
- ❌ Profiling
- ❌ Behavioral tracking за пределами приложения
- ❌ Продажи данных
- ❌ Любых целей, не согласованных с родителем

---

## 14. Third-party links

**Наш сервис может содержать ссылки на third-party websites или контент:**
- Мы не контролируем эти сайты
- Данная Privacy Policy не применяется к ним
- Мы рекомендуем прочитать privacy policies третьих сторон

**Образовательный контент:**
- Некоторый контент может быть hosted на YouTube, Vimeo
- Мы тщательно проверяем контент перед добавлением в библиотеку
- Embedded content может использовать cookies (можно отключить)

---

## 15. Контакты и вопросы

### 15.1 Как связаться с нами

**Вопросы о Privacy Policy:**
- Email: [PRIVACY_EMAIL]
- Response time: в течение 5 business days

**Data Protection Officer (DPO):**
- Name: [DPO_NAME]
- Email: [DPO_EMAIL]

**General support:**
- Email: [SUPPORT_EMAIL]
- In-app chat

**Postal address:**
```
[COMPANY_LEGAL_NAME]
[STREET_ADDRESS]
[CITY, STATE/REGION, ZIP/POSTAL_CODE]
[COUNTRY]
```

### 15.2 Жалобы и регуляторы

**Если у вас concerns о том, как мы обрабатываем данные:**
- Сначала свяжитесь с нами: [PRIVACY_EMAIL]
- Мы постараемся решить проблему

**Если не удовлетворены нашим response:**
- EU residents: можете подать жалобу в supervisory authority вашей страны
- US residents: можете подать жалобу в FTC (Federal Trade Commission)

**Список EU supervisory authorities:**
https://edpb.europa.eu/about-edpb/board/members_en

---

## 16. Дополнительные положения для конкретных юрисдикций

### 16.1 California (CCPA/CPRA)

**Для residents California:**
- Право знать, какие personal information собираются
- Право на deletion
- Право на opt-out from sale (мы не продаём данные)
- Право на non-discrimination

**Запрос можно отправить на [PRIVACY_EMAIL] с subject "California Privacy Request".**

### 16.2 UK GDPR

**Для UK residents:**
- Применяются те же права, что и GDPR
- Supervisory authority: ICO (Information Commissioner's Office)
- Age of consent: 13 лет

### 16.3 Brazil (LGPD)

**Для Brazilian residents:**
- Применяются аналогичные права GDPR
- Data Protection Officer: [DPO_EMAIL]

**Мы обновим этот раздел по мере expansion в новые регионы.**

---

## 17. Согласие

**Используя Rork-Kiku, вы подтверждаете, что:**
- Вы прочитали и поняли данную Privacy Policy
- Вы согласны с обработкой данных, описанной здесь
- Если вы создаёте профиль ребёнка, вы являетесь legal guardian и даёте verifiable parental consent

**Если у вас есть вопросы, пожалуйста, свяжитесь с нами перед использованием сервиса.**

---

## 18. Заключение

**Мы серьёзно относимся к конфиденциальности.**

Rork-Kiku построен с privacy-first approach. Мы понимаем, что вы доверяете нам самое ценное — безопасность ваших детей. Мы обязуемся оправдать это доверие через прозрачность, compliance и лучшие практики безопасности.

**Если у вас есть вопросы или concerns, пожалуйста, свяжитесь с нами. Мы здесь, чтобы помочь.**

---

**DISCLAIMER: Данный документ является ЧЕРНОВИКОМ и НЕ должен использоваться как финальная Privacy Policy без review юристом.**

**ТРЕБУЕТСЯ:**
- Legal review специалистом по privacy law
- Compliance check для всех target jurisdictions (GDPR, COPPA, CCPA, etc.)
- Approval от DPO (если назначен)
- Review актуальных regulatory requirements (законы меняются)

**Placeholders для заполнения:**
- [DATE] — дата вступления в силу
- [COMPANY_LEGAL_NAME] — юридическое имя компании
- [ADDRESS] — юридический адрес
- [PRIVACY_EMAIL] — email для privacy запросов
- [DPO_NAME], [DPO_EMAIL] — DPO (если требуется)
- [SUPPORT_EMAIL] — general support email
- [REGION] — primary data region

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0 (DRAFT)  
**Статус:** ТРЕБУЕТ ЮРИСТА  
**Контакт:** [FOUNDERS_EMAIL]
