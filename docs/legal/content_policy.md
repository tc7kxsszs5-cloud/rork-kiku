# Политика контента Rork-Kiku (Черновик)

**ВАЖНО: ⚠️ ТРЕБУЕТ ЮРИСТА ⚠️**

Этот документ является черновиком и должен быть reviewed и finalized квалифицированным юристом, специализирующимся на child safety, content moderation и internet law перед публикацией.

---

## Обзор

Rork-Kiku стремится создать безопасное цифровое пространство для детей 6-12 лет. Эта политика определяет:
- Типы контента, которые запрещены
- Уровни фильтрации
- Процессы модерации и эскалации
- Подходы к верификации родителей

---

## 1. Запрещённый контент

### 1.1. Категория: Насилие и опасность

**Запрещено:**
- ❌ Изображения или видео физического насилия (драки, избиения)
- ❌ Кровь, раны, травмы
- ❌ Оружие (ножи, пистолеты, и т.д.)
- ❌ Опасные действия (прыжки с высоты, игра с огнём)
- ❌ Угрозы или призывы к насилию

**Разрешено (с оговорками):**
- ✅ Игровое "насилие" (водные пистолеты, игрушечные мечи) — только если явно игровой контекст
- ✅ Спортивные контактные виды (бокс, борьба) — только в контексте организованного спорта с защитной экипировкой

**Модерация:**
- ML confidence > 0.8 → auto-block
- 0.5-0.8 → manual review
- < 0.5 → auto-approve (если no other red flags)

### 1.2. Категория: Сексуальный контент

**Запрещено:**
- ❌ Нагота или полу-нагота (купальники могут быть ok в beach context)
- ❌ Сексуализированные позы или действия
- ❌ Неприемлемые жесты
- ❌ Sexual innuendo (даже в тексте)

**Граничные случаи:**
- ⚠️ Купальники на пляже — ok если family context, не сексуализировано
- ⚠️ Младенцы/малыши в ванной — требует осторожности, parent context

**Модерация:**
- **Zero tolerance**: любое подозрение → manual review minimum
- ML confidence > 0.7 → auto-block
- 0.3-0.7 → manual review (high priority)
- Модератор может эскалировать к Lead Moderator при uncertainty

### 1.3. Категория: Персональные данные (PII)

**Запрещено или требует удаления:**
- ❌ Полное имя ребёнка (фамилия)
- ❌ Адрес (улица, дом)
- ❌ Номер телефона
- ❌ Email адрес
- ❌ Название школы (если с другими identifiers)
- ❌ Геотеги с точным location

**Разрешено:**
- ✅ Имя (только первое, без фамилии)
- ✅ Город (широко, например "Москва", но не точный район)
- ✅ Возраст

**Модерация:**
- ML detection для текста в images (OCR)
- Manual review если PII detected
- Возможность blur/redact части image (опционально для v2)

### 1.4. Категория: Буллинг и харассмент

**Запрещено:**
- ❌ Оскорбления, обзывательства
- ❌ Издевательства над другими детьми
- ❌ Discrimination (раса, религия, национальность, внешность)
- ❌ Exclusionary behavior (намеренное исключение)
- ❌ Shaming (body shaming, и т.д.)

**Контекст важен:**
- Friendly banter между друзьями vs. malicious intent
- Модератор должен оценить context и intent

**Модерация:**
- Преимущественно manual review (NLP сложно для context)
- Parent reports высокий приоритет
- Repeat offenders → account review

### 1.5. Категория: Неприемлемый язык

**Запрещено:**
- ❌ Матерные слова
- ❌ Вульгарная лексика
- ❌ Hate speech
- ❌ Slurs (racial, homophobic, etc.)

**Модерация:**
- Automatic word filter для очевидных случаев
- ML для variations (l33t speak, misspellings)
- Context-aware (цитаты vs. использование)

### 1.6. Категория: Незаконный контент

**Запрещено:**
- ❌ Наркотики, алкоголь, табак
- ❌ Gambling
- ❌ Pirated content (copyright violations)
- ❌ Призывы к illegal activities

**Обязательная эскалация:**
- Немедленная блокировка
- Report к legal team
- Potential report к authorities (в зависимости от severity)

### 1.7. Категория: Дезинформация и опасный контент

**Запрещено:**
- ❌ Medical misinformation (опасные "лайфхаки")
- ❌ Self-harm content
- ❌ Eating disorder promotion
- ❌ Dangerous challenges (TikTok-style risky trends)

**Модерация:**
- Manual review с escalation к Lead Moderator
- Консультация с experts (медики, психологи) при необходимости

---

## 2. Уровни фильтрации

Родители могут выбрать один из трёх уровней для каждого профиля ребёнка:

### 2.1. Жёсткая фильтрация (Strict Mode)

**Рекомендуется для**: Младшие дети (6-8 лет)

**Политика:**
- ✅ Auto-approve: только контент с ML confidence > 0.9 (очень safe)
- ⚠️ Manual review: любой uncertain контент (0.5-0.9)
- ❌ Auto-block: всё с ML score > 0.5

**Характеристики:**
- Высокий false positive rate (блокируется больше безопасного контента)
- Минимальный риск пропуска неприемлемого контента
- Больше контента попадает в manual review queue

**Typical outcomes:**
- 50-60% auto-approved
- 30-40% manual review
- 5-10% auto-blocked

### 2.2. Умеренная фильтрация (Moderate Mode) — **По умолчанию**

**Рекомендуется для**: Средний возраст (8-10 лет)

**Политика:**
- ✅ Auto-approve: ML confidence < 0.5
- ⚠️ Manual review: 0.5-0.8
- ❌ Auto-block: > 0.8

**Характеристики:**
- Balanced approach
- Некоторый false positive, но reasonable
- Большинство контента проходит автоматически

**Typical outcomes:**
- 70-80% auto-approved
- 15-25% manual review
- 3-7% auto-blocked

### 2.3. Мягкая фильтрация (Relaxed Mode)

**Рекомендуется для**: Старшие дети (10-12 лет)

**Политика:**
- ✅ Auto-approve: ML confidence < 0.7
- ⚠️ Manual review: 0.7-0.9
- ❌ Auto-block: > 0.9 (только очевидно неприемлемый)

**Характеристики:**
- Минимальная блокировка
- Больше автономии для ребёнка
- Родитель по-прежнему видит всё и может review

**Typical outcomes:**
- 85-92% auto-approved
- 5-12% manual review
- 1-3% auto-blocked

**Важно:** Даже в Relaxed Mode, certain categories (sexual content, violence) имеют строгие thresholds.

---

## 3. Правила эскалации

### 3.1. Автоматическая блокировка (Auto-Block)

**Триггеры:**
- ML confidence выше threshold для уровня фильтрации
- Automatic word filter match (матерные слова)
- Known hash match (previously blocked content)

**Действия:**
1. Контент немедленно блокируется (не показывается ребёнку)
2. Notification отправляется родителю:
   - "Контент был заблокирован: [Причина]"
   - Link для просмотра (родитель может посмотреть)
   - Возможность оспорить (appeal)
3. Контент помещается в quarantine storage
4. ML decision логируется для training

**Timeline:**
- Instant (< 1 секунда после upload)

### 3.2. Ручная модерация (Manual Review)

**Триггеры:**
- ML confidence в uncertain range
- Parent or child report
- Appeal от auto-block decision

**Процесс:**
1. Контент добавляется в moderation queue
2. Status: "На проверке" (Pending Review)
3. Назначается модератору (round-robin или priority-based)
4. Модератор просматривает:
   - Контент (image/video)
   - ML scores и reasoning
   - Context (user history, metadata)
   - Applicable policies
5. Модератор принимает решение:
   - ✅ Approve: контент становится доступным
   - ❌ Block: контент блокируется, родитель уведомляется
   - ⚠️ Escalate: отправляется к Lead Moderator
6. Decision логируется и notifies parent/child

**SLA:**
- High priority (appeals, reports): 1 hour
- Normal priority: 4 hours
- Low priority: 24 hours

**Модератор guidelines:**
- **When in doubt, err on the side of caution** (block)
- **Consider context**: age of child, family setting, intent
- **Escalate** сложные случаи к Lead Moderator
- **Consistent**: follow guidelines, не subjective personal judgement

### 3.3. Эскалация к Lead Moderator

**Триггеры:**
- Модератор uncertain
- Borderline case с conflicting policies
- Serious content (potential illegal, child safety concern)
- Repeat offender (user с multiple violations)

**Процесс:**
1. Модератор escalates с notes и reasoning
2. Lead Moderator reviews в priority queue
3. Lead Moderator консультируется с:
   - Legal team (если legal implications)
   - Child safety expert (если safety concern)
   - CEO/Product (если policy ambiguity)
4. Lead Moderator принимает final decision
5. Decision документируется и может обновить policies

**SLA:**
- Critical (child safety, illegal): Immediate (< 30 min)
- High priority: 2 hours
- Normal: 8 hours

### 3.4. Заморозка аккаунта (Account Freeze)

**Триггеры:**
- Multiple violations (3+ в течение 30 дней)
- Serious violation (sexual content, violence)
- Pattern of malicious behavior
- Parent or child account compromise suspected

**Действия:**
1. **Немедленная заморозка**:
   - Аккаунт temporarily suspended
   - Невозможно upload нового контента
   - Existing контент скрыт (pending review)
2. **Notification родителю**:
   - Email и in-app notification
   - Explanation причины
   - Процесс appeal или resolution
3. **Review процесс**:
   - Lead Moderator или Admin reviews account
   - Examines all flagged content
   - Determines appropriate action:
     - **Warning**: аккаунт unfrozen с предупреждением
     - **Temporary suspension**: 7-30 дней
     - **Permanent ban**: в serious cases
4. **Appeal**:
   - Родитель может оспорить через email
   - Review в течение 48 hours
   - Final decision by Lead Moderator + CEO

**Reinstatement:**
- После suspension, родитель должен acknowledge policies
- Monitoring period (90 дней) с stricter moderation

---

## 4. Подходы к верификации "здоровых родителей"

**Цель:** Убедиться, что аккаунт действительно управляется родителем, а не ребёнком или bad actor.

**⚠️ СЛОЖНАЯ ПРОБЛЕМА — ТРЕБУЕТ ЮРИДИЧЕСКОЙ И ТЕХНИЧЕСКОЙ ЭКСПЕРТИЗЫ**

### 4.1. Email verification (Обязательно для MVP)

**Процесс:**
- Email адрес должен быть verified
- Link с токеном для активации

**Pros:**
- ✅ Простой, стандартный
- ✅ Minimal friction

**Cons:**
- ❌ Дети могут иметь доступ к email родителей
- ❌ Легко fake (временные email)

**Mitigation:**
- Block известные disposable email domains
- Require "родительский" email providers (не kid-focused)

### 4.2. SMS verification (Опционально для MVP)

**Процесс:**
- Мобильный номер телефона
- SMS с кодом

**Pros:**
- ✅ Более сложно для детей fake (обычно)
- ✅ Additional verification layer

**Cons:**
- ❌ Не все родители comfortable sharing номер
- ❌ VOIP numbers могут bypas

**Mitigation:**
- Optional, не mandatory для MVP
- Detect и block VOIP/virtual numbers

### 4.3. ID verification (Для future/Production)

**Процесс:**
- Upload government-issued ID (паспорт, водительские права)
- Face verification (selfie match)
- Third-party service (Onfido, Jumio, Stripe Identity)

**Pros:**
- ✅ Высокая уверенность в identity
- ✅ Compliance с некоторыми regulations

**Cons:**
- ❌ Высокий friction (многие откажутся)
- ❌ Privacy concerns (хранение sensitive data)
- ❌ Дорого ($1-5 per verification)

**Рекомендация:**
- Не для MVP
- Optional для "verified parent" badge (в будущем)
- Mandatory только для certain features (например, public sharing)

### 4.4. Behavioral signals (ML-based)

**Процесс:**
- Анализ поведения пользователя:
  - Device type (детские tablets vs. adult phones)
  - Usage patterns (дети используют днём, родители вечером)
  - Content uploaded (взрослый контент vs. детский)
  - Language complexity (в messages, captions)
  
**Pros:**
- ✅ Passive, no friction
- ✅ Continuous verification

**Cons:**
- ❌ Сложно implement
- ❌ False positives (tech-savvy дети)
- ❌ Privacy concerns (extensive tracking)

**Рекомендация:**
- Long-term research project
- Не для MVP
- Может complement другие methods

### 4.5. Payment verification (For Paid accounts)

**Процесс:**
- Credit card information
- Assumption: дети не имеют своих кредитных карт

**Pros:**
- ✅ Strong signal (родители обычно контролируют payment)
- ✅ Natural для paid subscriptions

**Cons:**
- ❌ Только для paid users
- ❌ Некоторые дети могут have prepaid cards

**Рекомендация:**
- Use для paid tier
- Не полагаться только на это

### 4.6. Social proof (References)

**Процесс:**
- Invite-only или referral-based
- Требуется referral от verified родителя
- Community-based trust

**Pros:**
- ✅ Community self-policing
- ✅ Warm introductions (better quality users)

**Cons:**
- ❌ Ограничивает growth
- ❌ Не scalable для mass market

**Рекомендация:**
- Возможно для pilot или invite-only beta
- Не для public launch

---

## 5. Рекомендации для внедрения

### Фаза 1: MVP (Минимальная защита)
1. ✅ Email verification (обязательно)
2. ✅ Parental consent checkbox
3. ✅ Age verification (родитель указывает возраст ребёнка)
4. ⚠️ SMS verification (опционально, not mandatory)

### Фаза 2: Post-Pilot (Укрепление)
1. ✅ Behavioral analytics (начать сбор данных)
2. ✅ Payment verification (для paid tier)
3. ⚠️ Optional ID verification (для verified badge)

### Фаза 3: Scale (Продвинутая верификация)
1. ✅ Multi-factor authentication
2. ✅ Continuous behavioral monitoring
3. ✅ Community reporting mechanisms
4. ✅ Audit trail для moderation decisions

---

## 6. Compliance и юридические consideration

### COPPA (США)

**Требования:**
- ✅ Verifiable Parental Consent (VPC) required
- ✅ Parental right to review/delete child's data
- ✅ No targeted ads к детям
- ✅ Data minimization

**Наш подход:**
- Email + consent checkbox (acceptable для "email plus" method)
- Parent dashboard для review/delete
- No ads вообще (by design)
- Minimal data collection

### GDPR (ЕС)

**Требования:**
- ✅ Parental consent для детей < 16 (зависит от страны, 13-16)
- ✅ Right to access, rectification, erasure
- ✅ Data portability
- ✅ DPIA (Data Protection Impact Assessment)

**Наш подход:**
- Parental consent at registration
- Full data export/delete capabilities
- DPIA conducted перед EU launch

### Локальные законы (Россия)

**Требования:**
- ✅ Data localization (хранение данных россиян в России)
- ✅ Согласие на обработку персональных данных
- ✅ Возможность отзыва согласия

**Наш подход:**
- AWS Russia region или локальные серверы
- Explicit consent forms
- Easy withdrawal process

---

## 7. Ограничения и disclaimers

**⚠️ Эта политика НЕ гарантирует:**
- 100% точность автоматической модерации (ML не совершенна)
- Немедленное обнаружение всего неприемлемого контента
- Полную защиту от bad actors

**Родители должны:**
- Активно мониторить активность своих детей
- Общаться с детьми о online safety
- Сообщать о problems через app

**Компания обязуется:**
- Непрерывно улучшать ML модели
- Быстро реагировать на reports
- Быть transparent в moderation decisions
- Регулярно обновлять policies

---

## 8. Контакты и отчёты

**Для сообщения о неприемлемом контенте:**
- In-app report button
- Email: moderation@rork-kiku.com (placeholder)

**Для legal/compliance вопросов:**
- Email: legal@rork-kiku.com (placeholder)

**Для child safety emergencies:**
- Немедленно contact local authorities (полиция, child protective services)
- Затем notify нас: safety@rork-kiku.com (placeholder)

---

## Changelog

- **v0.1** (2026-01-01): Начальный черновик
- **TBD**: Legal review
- **TBD**: Public publication

---

**⚠️ ВАЖНОЕ НАПОМИНАНИЕ ⚠️**

Этот документ является ЧЕРНОВИКОМ и должен быть полностью reviewed юристом перед публикацией. Content moderation и child safety — юридически complex areas с серьёзными последствиями при ошибках.

**Следующие шаги:**
1. Консультация с lawyer специализирующимся на:
   - Internet law
   - Child safety regulations (COPPA, GDPR-K)
   - Content moderation liability
2. Review всех policies и procedures
3. Finalize и publish official version
4. Regular updates (quarterly или при изменениях в законодательстве)

**Не используйте этот черновик как official policy без legal review.**
