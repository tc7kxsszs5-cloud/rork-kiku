# Privacy Policy (Черновик) — kiku

## ⚠️ DISCLAIMER

Это **черновик** Privacy Policy для внутреннего использования и обсуждения. Финальная версия **ОБЯЗАТЕЛЬНО** должна быть проверена и утверждена юристом, специализирующимся на:
- Child privacy (COPPA, GDPR-K)
- Data protection
- Consumer protection

**НЕ публиковать** этот черновик без legal review.

---

## Политика конфиденциальности kiku

**Дата вступления в силу:** [PLACEHOLDER — дата]  
**Последнее обновление:** [PLACEHOLDER — дата]

### Введение

Добро пожаловать в kiku. Мы серьёзно относимся к защите приватности детей и их семей. Эта Политика конфиденциальности объясняет:
- Какие данные мы собираем
- Как мы используем эти данные
- Как мы защищаем данные
- Ваши права в отношении ваших данных

**Важно:** kiku предназначен для родителей, которые хотят защитить своих детей онлайн. Мы собираем и обрабатываем данные **только** для обеспечения безопасности детей, с явного согласия родителей.

### Кто мы

**Название компании:** [PLACEHOLDER — kiku Inc./LLC]  
**Юридический адрес:** [PLACEHOLDER — адрес]  
**Email:** [PLACEHOLDER — privacy@kiku-app.com]  
**Телефон:** [PLACEHOLDER — +X XXX XXX XXXX]  
**Data Protection Officer (DPO):** [PLACEHOLDER — Имя, email]

Для вопросов о приватности, пожалуйста, свяжитесь с нами по адресу [PLACEHOLDER — privacy@kiku-app.com].

---

## 1. Какие данные мы собираем

### 1.1 Информация о родителях (Parent Account Data)

Когда вы создаёте родительский аккаунт, мы собираем:

**Обязательные данные:**
- **Email address** — для входа и коммуникации
- **Password** (хешированный) — для безопасного доступа
- **Имя и фамилия** — для персонализации

**Опциональные данные:**
- **Телефон** — для SMS уведомлений (если вы выберете)
- **Verification documents** — паспорт/ID (если вы проходите добровольную верификацию)
- **Платёжная информация** — если вы подписываетесь на платный план (обрабатывается через Stripe/PayPal, мы не храним полные номера карт)

### 1.2 Информация о детях (Child Profile Data)

Когда вы создаёте профиль ребёнка:

**Обязательные данные:**
- **Имя ребёнка** (только first name, не обязательно настоящее)
- **Возраст или дата рождения** — для возрастной адаптации функций
- **Связь с родительским аккаунтом** — для подтверждения parental consent

**Опциональные данные:**
- **Пол** — для персонализации
- **Аватар** — изображение профиля (хранится локально на устройстве)

⚠️ **Важно:** Мы **НЕ собираем** полное имя ребёнка, адрес, номер телефона, Social Security Number, или другие sensitive identifiers, если это не требуется по закону.

### 1.3 Данные чатов и сообщений (Chat & Message Data)

Это самая sensitive категория данных. Мы обрабатываем её **только** для анализа безопасности, с вашего согласия.

**Текстовые сообщения:**
- **Содержание сообщения** — текст, который отправляет/получает ребёнок
- **Metadata** — отправитель, получатель, timestamp, chat ID

**Изображения:**
- **Файлы изображений** — для AI анализа на неприемлемый контент
- **Metadata** — размер, формат, timestamp

**Голосовые сообщения:**
- **Аудио файлы** — для транскрипции и анализа
- **Транскрипция** — текстовая версия аудио (если доступна)

**Как мы обрабатываем эти данные:**
1. Сообщения хранятся **локально** на устройстве ребёнка (AsyncStorage, зашифрованные)
2. Для AI анализа мы отправляем содержание сообщения на наши серверы (или third-party AI providers: OpenAI, AWS Rekognition)
3. **Мы НЕ читаем сообщения вручную**, кроме случаев ручной модерации (с согласия родителей и только при высоком риске)
4. AI analysis результаты (risk scores, категории рисков) сохраняются

**Data retention:**
- Сообщения хранятся на устройстве до удаления приложения или по запросу родителя
- На наших серверах: metadata хранится 6 месяцев, содержание сообщений удаляется после анализа (не храним permanently)

### 1.4 Данные использования приложения (Usage Data)

Мы автоматически собираем:
- **Device information** — модель устройства, OS version (iOS version), app version
- **IP address** — для security и fraud prevention
- **Log data** — crashes, errors, performance metrics
- **Analytics** — как вы используете приложение (какие экраны, как часто, engagement)

**Цель:** Улучшение приложения, bug fixing, security monitoring

### 1.5 Данные геолокации (Location Data)

Мы собираем геолокацию **ТОЛЬКО** в следующих случаях:
- **SOS алерт** — когда ребёнок нажимает кнопку экстренной помощи
- **С явного согласия** родителя и ребёнка (в момент нажатия SOS)

Мы **НЕ отслеживаем** постоянную локацию ребёнка (no background tracking).

### 1.6 Cookies и tracking technologies

**Mobile app:** Мы не используем cookies (это native app), но используем:
- **Local storage** (AsyncStorage) для хранения настроек и данных
- **Analytics SDKs** (например, Firebase Analytics) — можно opt-out в настройках

**Website (если applicable):**
- **Essential cookies** — для функционирования сайта
- **Analytics cookies** — для понимания traffic (Google Analytics) — можно opt-out

---

## 2. Как мы используем данные

### 2.1 Основные цели использования

**Для обеспечения безопасности детей:**
- AI анализ сообщений для обнаружения опасного контента (буллинг, груминг, насилие)
- Отправка алертов родителям при обнаружении рисков
- Блокировка опасных контактов (по запросу родителя)

**Для предоставления услуги:**
- Создание и управление аккаунтами
- Обработка подписок и платежей
- Отправка уведомлений (push, email)
- Customer support

**Для улучшения продукта:**
- Анализ usage patterns для UX improvements
- Bug fixing и performance optimization
- Training ML моделей (с anonymized data и согласия родителей)

**Для compliance и legal:**
- Соблюдение законов (COPPA, GDPR-K)
- Защита от fraud и abuse
- Responding to legal requests (court orders, subpoenas)

### 2.2 Правовые основания (Legal Basis) — для GDPR

Мы обрабатываем данные на основании:
- **Parental consent** — для данных детей до 13 лет (COPPA) или до 16 лет (GDPR-K)
- **Contractual necessity** — для предоставления услуги по subscription agreement
- **Legitimate interests** — для security, fraud prevention, product improvement (с соблюдением балансировки интересов)
- **Legal obligations** — для compliance с законами

---

## 3. Как мы делимся данными

### 3.1 Мы НЕ продаём данные

**kiku НИКОГДА не продаёт личные данные пользователей третьим сторонам.** Это fundamentally противоречит нашей миссии защиты детей.

### 3.2 Sharing с third parties (ограниченный)

Мы можем делиться данными с:

**AI/ML providers:**
- **OpenAI** (GPT-4 для текстового анализа)
- **AWS Rekognition** (для анализа изображений)
- **Whisper API** (для транскрипции аудио)

**Условия:**
- Data Processing Agreements (DPA) подписаны
- Они COPPA/GDPR compliant
- Они не хранят данные permanently, только для обработки запросов
- No training on детских данных без explicit consent

**Cloud infrastructure:**
- **AWS** (или Google Cloud/Azure) — для хранения backend данных
- Данные зашифрованы at rest и in transit
- Servers находятся в [PLACEHOLDER — EU/US regions]

**Payment processors:**
- **Stripe/PayPal** — для обработки платежей
- Мы передаём только необходимую информацию (email, amount)
- Они не имеют доступа к детским данным

**Analytics providers:**
- **Firebase Analytics, Mixpanel** (опционально) — для usage analytics
- Anonymized data only
- Можно opt-out

**Customer support tools:**
- **Intercom, Zendesk** (опционально) — для support tickets
- Только если вы обращаетесь в support (voluntary)

### 3.3 Legal disclosures

Мы можем раскрыть данные, если:
- **Требуется по закону** — court order, subpoena, warrant
- **Защита детей** — если мы обнаружили CSAM или imminent threat (обязаны репортить в NCMEC/правоохранительные органы)
- **Защита наших прав** — fraud investigation, terms of service violations

### 3.4 Business transfers

Если kiku будет приобретён другой компанией:
- Ваши данные могут быть переданы новому владельцу
- Вы будете уведомлены заранее (email)
- Вы имеете право удалить данные перед передачей

---

## 4. Как мы защищаем данные

### 4.1 Security measures

**Technical safeguards:**
- **Encryption in transit** — TLS 1.3 для всех API connections
- **Encryption at rest** — AES-256 для хранения sensitive data (БД, S3)
- **Secure authentication** — JWT tokens с коротким expiration, refresh tokens
- **Access controls** — только авторизованные сотрудники имеют доступ к production data
- **Audit logging** — все доступы к данным логируются

**Organizational safeguards:**
- **Employee training** — все сотрудники обучены data protection practices
- **Background checks** — для сотрудников с доступом к user data
- **Incident response plan** — готовность к data breaches
- **Regular security audits** — penetration testing, vulnerability scanning

### 4.2 Data breach notification

Если произойдёт data breach:
1. Мы уведомим вас **в течение 72 часов** (GDPR requirement)
2. Email notification с описанием breach и шагов по защите
3. Уведомление регуляторов (если требуется по закону)

---

## 5. Ваши права (Data Subject Rights)

### 5.1 Right to Access (Право на доступ)

Вы можете запросить копию всех данных, которые мы храним о вас и вашем ребёнке.

**Как запросить:**
- Email на [PLACEHOLDER — privacy@kiku-app.com]
- Мы ответим в течение 30 дней (GDPR requirement)
- Предоставим данные в machine-readable формате (JSON/CSV)

### 5.2 Right to Rectification (Право на исправление)

Если данные неточные, вы можете запросить исправление.

**Как исправить:**
- Большинство данных можно исправить в настройках приложения
- Для других данных — email в support

### 5.3 Right to Erasure (Право на удаление / "Right to be forgotten")

Вы можете запросить удаление всех данных о вас и вашем ребёнке.

**Как удалить:**
- В приложении: Settings → Account → Delete Account
- Или email на [PLACEHOLDER — privacy@kiku-app.com]

**Что произойдёт:**
- Все personal data будут удалены в течение 30 дней
- Некоторые данные могут быть retained для legal compliance (anonymized logs, финансовые records для tax purposes)

### 5.4 Right to Data Portability (Право на переносимость)

Вы можете запросить export ваших данных для переноса к другому provider.

**Формат:** JSON или CSV

### 5.5 Right to Object (Право на возражение)

Вы можете возразить против обработки данных для certain purposes (например, marketing).

**Как возразить:**
- Unsubscribe from marketing emails (ссылка в каждом email)
- Disable analytics в настройках приложения
- Email в [PLACEHOLDER — privacy@kiku-app.com] для других objections

### 5.6 Right to Restrict Processing (Право на ограничение обработки)

Вы можете запросить временное ограничение обработки данных (например, пока мы проверяем accuracy).

### 5.7 Right to Withdraw Consent (Право отозвать согласие)

Вы можете отозвать согласие на обработку данных в любой момент.

**Последствия:**
- Если вы отзываете согласие на AI анализ, kiku перестанет функционировать (это core feature)
- Но вы можете удалить аккаунт и все данные будут удалены

---

## 6. Дети и COPPA/GDPR-K Compliance

### 6.1 COPPA (Children's Online Privacy Protection Act) — US

kiku полностью соответствует COPPA:

**Verifiable Parental Consent:**
- Мы требуем явное согласие родителя перед сбором данных детей до 13 лет
- Email verification + опциональная документальная верификация

**No Third-Party Advertising:**
- Мы НЕ показываем рекламу детям
- Мы НЕ передаём детские данные advertisers

**Parent Rights:**
- Родители могут просматривать, исправлять, удалять данные детей
- Родители контролируют все настройки

**Data Minimization:**
- Мы собираем только необходимые данные для функционирования service

### 6.2 GDPR-K (Age of Consent под GDPR) — EU

**Age of consent:** В большинстве EU стран — 16 лет (может варьироваться от 13 до 16 в зависимости от страны)

**Parental consent:**
- Для детей младше age of consent требуется согласие родителя
- Проверка возраста и parental consent

**Enhanced protections:**
- No profiling детей для marketing
- Clear and simple language в privacy policy (этот документ будет упрощён для public version)
- Easy opt-out mechanisms

### 6.3 ФЗ-152 (Russia) — если applicable

Для российских пользователей:
- Согласие на обработку персональных данных (включая детей)
- Data localization (если требуется — данные могут храниться на серверах в России)
- Уведомление Роскомнадзора (если applicable)

---

## 7. Data Retention (Сроки хранения данных)

| Тип данных | Срок хранения | Причина |
|------------|---------------|---------|
| Account data (родитель) | Пока аккаунт активен + 30 дней после удаления | Service provision |
| Child profile data | Пока аккаунт активен + 30 дней после удаления | Service provision |
| Chat messages (content) | Локально на устройстве; на серверах — удаляются после AI анализа | Privacy |
| Chat metadata (risk scores) | 6 месяцев | Analytics, ML training |
| Payment records | 7 лет | Legal requirement (tax, fraud prevention) |
| Compliance logs | 12 месяцев | COPPA/GDPR requirement |
| Analytics data (anonymized) | 24 месяца | Product improvement |

**После retention period:** Данные автоматически удаляются или anonymized (если требуется для statistical purposes).

---

## 8. International Data Transfers (Международные передачи данных)

**Если вы в EU/EEA:**
- Ваши данные могут передаваться в US (где находятся некоторые наши providers, например OpenAI)
- Мы используем **Standard Contractual Clauses (SCCs)** для обеспечения GDPR compliance
- Transfer Impact Assessment проведён

**Если вы в Russia:**
- Данные могут храниться на серверах AWS в [PLACEHOLDER — EU region]
- Cross-border transfer agreement на месте

---

## 9. Изменения в Privacy Policy

Мы можем обновлять эту политику время от времени.

**Как мы уведомим вас:**
- Email notification за 30 дней до вступления в силу изменений
- In-app notification
- Новая версия будет доступна на нашем сайте

**Ваш выбор:**
- Если вы не согласны с изменениями, вы можете удалить аккаунт

---

## 10. Контакты и complaints

**Общие вопросы:**
Email: [PLACEHOLDER — support@kiku-app.com]

**Privacy вопросы:**
Email: [PLACEHOLDER — privacy@kiku-app.com]  
Data Protection Officer: [PLACEHOLDER — Имя, email]

**Regulatory complaints:**

**В EU:**
- Вы имеете право подать жалобу в local Data Protection Authority
- Список authorities: https://edpb.europa.eu/about-edpb/board/members_en

**В US:**
- Federal Trade Commission (FTC): https://www.ftc.gov/complaint

**В Russia:**
- Роскомнадзор: https://rkn.gov.ru

---

## 11. Additional Resources

**Для родителей:**
- [PLACEHOLDER — Ссылка на FAQ о приватности]
- [PLACEHOLDER — Ссылка на Parent Guide: "Как защитить данные ребёнка онлайн"]

**Для детей (упрощённое объяснение):**
- [PLACEHOLDER — Ссылка на Kids' Privacy Guide]

---

**Последнее обновление:** [PLACEHOLDER — дата]  
**Версия:** 1.0 (DRAFT)

---

**⚠️ IMPORTANT DISCLAIMER:** Это черновик для внутреннего использования. Перед публикацией **ОБЯЗАТЕЛЬНО**:
1. Legal review от qualified attorney
2. Упростить язык для public-facing version
3. Перевести на английский (если applicable)
4. Адаптировать под конкретные юрисдикции
5. Добавить specific contact information

**Контакты для review:**
- Legal counsel: [PLACEHOLDER]
- DPO: [PLACEHOLDER]
- Child privacy expert: [PLACEHOLDER]
