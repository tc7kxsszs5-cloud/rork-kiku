# Политика контента и модерации — Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: **DRAFT — ТРЕБУЕТ ОБЯЗАТЕЛЬНОГО РЕВЬЮ ЮРИСТА**
- **Контакт**: [FOUNDERS_EMAIL]

---

## ⚠️ ВНИМАНИЕ

**Этот документ является черновиком** и не может быть использован в production без:
1. ✅ Ревью от квалифицированного юриста (специализация: digital privacy, COPPA, GDPR)
2. ✅ Адаптации под jurisdiction (US federal law, state laws, EU GDPR, etc.)
3. ✅ Согласования с модерационной командой
4. ✅ Тестирования в pilot программе

**НЕ ПУБЛИКОВАТЬ** данный черновик как публичную политику до завершения legal review.

---

## 1. Введение

### 1.1. Назначение
Эта политика определяет правила модерации контента на платформе Rork-Kiku, включая:
- Запрещённые типы контента
- Уровни модерации (настраиваемые родителями)
- Процесс автоматической и ручной модерации
- Процесс апелляции и эскалации
- Верификация родителей

### 1.2. Принципы
- **Безопасность детей прежде всего**: Мы стремимся защитить детей от вредного контента
- **Прозрачность**: Родители понимают, как работает модерация
- **Справедливость**: Решения модерации обоснованы и могут быть обжалованы
- **Privacy**: Мы не храним контент дольше необходимого и не используем его в иных целях

---

## 2. Запрещённый контент

### 2.1. Категории запрещённого контента

#### 2.1.1. **Сексуальный контент (NSFW)**
- Обнажённое тело (полное или частичное)
- Сексуальные акты (явные или подразумеваемые)
- Детская порнография (CSAM) — **нулевая терпимость, немедленное сообщение в NCMEC**
- Сексуализация несовершеннолетних (любая форма)
- Контент сексуального характера (даже если люди одеты, но контекст сексуальный)

**Исключения**: Медицинский/образовательный контент (анатомия), но только с явным parent approval

#### 2.1.2. **Насилие**
- Графическое насилие (кровь, раны, смерть)
- Оружие (ружья, ножи, взрывчатые вещества)
- Драки, физические столкновения
- Жестокое обращение с животными
- Self-harm (порезы, суицидальные изображения)

**Исключения**: Новостной контекст (исторические фото, образовательные), игрушечное оружие (с осторожностью)

#### 2.1.3. **Ненависть и Дискриминация**
- Расистский, сексистский, гомофобный контент
- Hate symbols (свастика, Confederate flag, etc.)
- Призывы к насилию против групп людей
- Bullying и harassment

**Нулевая терпимость**: Автоматический reject + possible account suspension

#### 2.1.4. **Незаконный контент**
- Наркотики (употребление, производство, продажа)
- Алкоголь и табак (если дети присутствуют на изображении)
- Азартные игры
- Пиратский контент (copyright infringement)
- Призывы к незаконным действиям

#### 2.1.5. **Опасное поведение**
- Dangerous challenges (TikTok challenges, самоповреждение)
- Unsafe activities (дети без присмотра в опасных ситуациях)
- Eating disorders promotion (pro-ana, pro-mia)
- Suicide promotion или glorification

#### 2.1.6. **Нежелательный текст**
- Проф Offensive language (мат, оскорбления)
- Bullying messages
- Personal information (адреса, телефоны, SSN, банковские данные)
- Spam и commercial content (реклама, продажи)

**Метод детекции**: OCR (Optical Character Recognition) + NLP для анализа текста на изображениях

---

## 3. Уровни модерации

Родители выбирают уровень модерации для каждого детского профиля. Уровни определяют threshold для автоматического одобрения/отклонения.

### 3.1. Строгий (Strict)
**Целевая аудитория**: Дети 5-8 лет

**Настройки**:
- Auto-approve: ML confidence > 95% (очень строгий threshold)
- Auto-reject: ML confidence < 60%
- Manual review: 60% ≤ confidence ≤ 95%

**Что блокируется**:
- Любой NSFW контент (даже лёгкий)
- Любое оружие (включая игрушечное)
- Любое насилие (включая мультфильмы с драками)
- Любые ругательства в тексте
- Алкоголь/табак даже на заднем плане

**Разрешено**:
- Семейные фото (люди одеты, нет оружия/алкоголя)
- Природа, животные, еда
- Игрушки, книги, образовательный контент

### 3.2. Умеренный (Moderate) — **Default**
**Целевая аудитория**: Дети 9-12 лет

**Настройки**:
- Auto-approve: ML confidence > 90%
- Auto-reject: ML confidence < 50%
- Manual review: 50% ≤ confidence ≤ 90%

**Что блокируется**:
- NSFW контент (explicit)
- Графическое насилие
- Hate speech
- Наркотики
- Опасные challenge

**Разрешено** (с осторожностью):
- Лёгкое насилие (мультики с мечами, superhero fights)
- Игрушечное оружие (очевидно игрушечное)
- Спортивные единоборства (бокс, карате — если не графическое)
- Лёгкие ругательства в тексте (зависит от контекста)

### 3.3. Мягкий (Relaxed)
**Целевая аудитория**: Дети 13-14 лет (pre-teens)

**Настройки**:
- Auto-approve: ML confidence > 85%
- Auto-reject: ML confidence < 40%
- Manual review: 40% ≤ confidence ≤ 85%

**Что блокируется**:
- Explicit NSFW
- Extreme violence
- CSAM (нулевая терпимость)
- Hate speech
- Self-harm

**Разрешено** (больше свободы):
- PG-13 контент (bikini beach photos, etc.)
- Умеренное насилие (action movies, video games)
- Alcohol на заднем плане (семейные праздники)
- Умеренные ругательства

**Примечание**: Даже на мягком уровне мы блокируем illegal и extreme content.

---

## 4. Процесс модерации

### 4.1. Автоматическая модерация (AI/ML)

#### Шаг 1: Upload
Родитель загружает фото → Pre-signed URL → Direct S3 upload

#### Шаг 2: ML Inference
- Lambda триггер → Enqueue в ML queue (Redis/SQS)
- ML Worker подбирает job:
  - **Image analysis**: NSFW detection, object detection (YOLO), violence detection
  - **OCR**: Tesseract для извлечения текста
  - **NLP**: Текст анализируется на offensive language, PII, spam
- **Output**: Confidence score (0-100%) и categories (nsfw, violence, hate, etc.)

#### Шаг 3: Decision Logic
```python
if confidence >= strict_threshold[moderation_level]:
    status = "approved"
    notify_parent("Photo approved!")
elif confidence <= auto_reject_threshold[moderation_level]:
    status = "rejected"
    reason = get_rejection_reason(categories)
    notify_parent(f"Photo rejected: {reason}")
else:
    status = "manual_review"
    enqueue_to_manual_queue()
    notify_parent("Photo under review, you'll be notified soon")
```

#### Шаг 4: Notification
Push notification → Parent получает статус (approved / rejected / manual_review)

**Latency target**: < 10 секунд (p95)

### 4.2. Ручная модерация (Human Review)

#### Когда требуется
- ML confidence в "серой зоне" (между auto-approve и auto-reject)
- Parent appeals auto-reject decision
- Edge cases (ML не уверен)

#### Процесс
1. Moderator logs in → Queue dashboard (pending items sorted by priority)
2. Moderator views:
   - Image (original + thumbnails)
   - ML analysis (confidence score, detected categories)
   - Context (child age, moderation level, parent history)
3. Moderator makes decision:
   - **Approve**: Safe for child
   - **Reject**: Specify reason (dropdown menu + free text)
   - **Escalate**: Если не уверен → Senior moderator review
4. Decision logged → Notification sent to parent

**SLA**: < 2 hours для manual review (business hours), < 24 hours (weekends)

#### Moderator Guidelines
- **Conservative approach**: Если сомневаешься → reject или escalate
- **Context matters**: Child age и moderation level важны
- **Respect privacy**: Не сохранять, не делиться контентом вне платформы
- **No bias**: Объективная оценка без личных предубеждений

### 4.3. Escalation Rules

#### Tier 1 → Tier 2 (Senior Moderator)
- Moderator не уверен в решении
- Potential CSAM (детская порнография) — **немедленная эскалация**
- Legal grey area (например, political content)
- High-profile user (если станет такой)

#### Tier 2 → Tier 3 (Management + Legal)
- Confirmed CSAM → Report to NCMEC (National Center for Missing & Exploited Children)
- Legal threats от user
- Press inquiries about moderation decision

#### Tier 3 → Authorities
- **CSAM**: Mandatory reporting to NCMEC (federal law requirement)
- **Imminent harm**: Threat of violence, suicide → Contact local law enforcement
- **Court orders**: Subpoenas, search warrants → Legal counsel

---

## 5. Процесс апелляции

### 5.1. Когда родитель может appeal
- Photo было rejected автоматически или вручную
- Родитель считает, что решение неправильное

### 5.2. Как appeal
1. Parent clicks "Appeal" в notification или Gallery
2. Form:
   - "Why do you think this was incorrectly rejected?"
   - Free text explanation
   - Option to upload alternative version (если был issue с original)
3. Submit → Appeal queue

### 5.3. Review процесс
- Senior moderator reviews appeal within 24 hours
- Reconsiders decision с учётом parent context
- **Final decision**:
  - Approve (с извинениями)
  - Uphold rejection (с объяснением)
- No further appeals (decision is final)

### 5.4. False positive tracking
- Track все appeals и их outcomes
- If false positive rate > 5% → Retrain ML models
- Feedback loop: Appeals используются для улучшения ML

---

## 6. Верификация родителей

### Цель
Убедиться, что аккаунт создан реальным родителем/опекуном, а не ребёнком или злоумышленником.

### Методы верификации (по возрастанию строгости)

#### 6.1. **Age Gate** (Baseline — обязательный)
- При sign-up: "Are you 18 or older?" → Yes/No
- Если No → Cannot proceed
- **Проблема**: Легко обойти (дети могут нажать "Yes")

#### 6.2. **Email Verification** (Обязательный для MVP)
- Подтвердить email через verification link
- Фильтрует spam/bots, но не детей

#### 6.3. **Payment Verification** (Рекомендуется)
- Microtransaction ($0.01-$0.99) через credit card
- **Rationale**: Дети обычно не имеют credit cards
- Деньги возвращаются или идут на charity
- **Проблема**: Friction (некоторые parents не захотят платить)

#### 6.4. **Document Verification** (Опционально, для high-risk cases)
- Upload government-issued ID (driver's license, passport)
- Third-party service (Onfido, Jumio) для verification
- **Проблема**: Privacy concerns, expensive ($1-2 per verification)
- **Use case**: Если подозрение на fraud или abuse

#### 6.5. **School/NGO Verification** (Pilot partnerships)
- Parent signs up через school-issued link
- School coordinator pre-verifies parents
- **Advantages**: High trust, community-based
- **Disadvantages**: Limited scale

#### 6.6. **Video Proof** (Extreme cases)
- Parent records short video stating their name и intent
- Reviewed by moderator
- **Use case**: Appeals после account suspension

### Наша рекомендация (MVP)
- ✅ **Age Gate** (обязательно)
- ✅ **Email Verification** (обязательно)
- ⚠️ **Payment Verification** (опционально, opt-in для Premium)
- ❌ Document/Video verification: Только для escalations

---

## 7. Sanctions и Account Actions

### 7.1. Warnings
- First offense (minor violation): Warning message
- Parent informed about policy violation
- Photo remains rejected, но account остаётся active

### 7.2. Temporary Suspension (24-72 hours)
**Triggers**:
- Multiple violations (3+ rejected photos in 7 days)
- Attempted bypass модерации (uploading same rejected photo multiple times)
- Harassment of moderators (abusive messages)

**During suspension**: No uploads allowed, gallery remains readable

### 7.3. Account Termination
**Triggers**:
- CSAM (нулевая терпимость)
- Severe violations (hate speech, severe violence)
- Repeated violations после warnings и suspensions
- Fraud/abuse (fake parent account)

**Process**:
- Account permanently banned
- All data deleted (GDPR "right to erasure" — но сохраняем audit logs для legal purposes)
- IP/device ban (to prevent re-registration)

### 7.4. Appeals для sanctions
- Parent может appeal suspension или termination
- Legal review если parent угрожает судом
- **Final decision**: Management + Legal

---

## 8. Privacy и Data Retention

### 8.1. Что мы храним
- **Approved photos**: До удаления parent или account termination
- **Rejected photos**: 30 дней (для appeals), затем удаляются
- **ML analysis logs**: 90 дней (для model improvement)
- **Moderation decisions**: 7 лет (audit trail, legal compliance)

### 8.2. Кто имеет доступ
- **AI/ML systems**: Автоматический анализ (no human access)
- **Moderators**: Только pending и appealed items
- **Parent**: Свои uploaded photos и moderation statuses
- **Child**: Только approved photos
- **Law enforcement**: Только по court order (subpoena)

### 8.3. Что мы НЕ делаем
- ❌ Не продаём данные third parties
- ❌ Не используем photos для рекламы или ML training без explicit consent
- ❌ Не показываем контент другим users (не social network)

---

## 9. Continuous Improvement

### 9.1. ML Model Retraining
- **Frequency**: Ежемесячно (или when significant new data)
- **Data sources**:
  - Manual moderation decisions (ground truth)
  - Appeals (false positives/negatives)
  - Public datasets (не используем user photos без consent)
- **Metrics tracking**: Accuracy, false positive/negative rates

### 9.2. Policy Updates
- **Review**: Ежеквартально или when needed
- **Stakeholders**: Legal, moderation team, product, founders
- **User notification**: Email blast + in-app notification перед изменениями

---

## 10. Compliance

### 10.1. COPPA (Children's Online Privacy Protection Act)
- Parental consent перед сбором child data
- No behavioral advertising to children
- Parent может review и delete child data

### 10.2. GDPR (General Data Protection Regulation — EU)
- Data minimization (только необходимые данные)
- Right to access (parent может export data)
- Right to erasure (parent может delete data)
- Data retention policy defined

### 10.3. Reporting Obligations
- **CSAM**: Mandatory reporting to NCMEC (18 USC § 2258A)
- **Imminent harm**: Discretionary reporting to law enforcement

---

## 11. Контакты

### Moderation Team
- **Moderation Lead**: [FOUNDERS_EMAIL]
- **Appeals**: [FOUNDERS_EMAIL]
- **Report CSAM**: [CSAM_HOTLINE — NCMEC CyberTipline]

### Legal
- **Legal Counsel**: [LAW_FIRM — TBD]
- **Privacy Questions**: [FOUNDERS_EMAIL]

---

## 12. Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1.0 | 2026-01-02 | Первоначальный черновик | [FOUNDERS_EMAIL] |

---

## ⚠️ ФИНАЛЬНОЕ НАПОМИНАНИЕ

**ЭТОТ ДОКУМЕНТ — ЧЕРНОВИК**

Перед использованием в production:
1. ✅ Legal review (ОБЯЗАТЕЛЬНО)
2. ✅ Moderation team training
3. ✅ Pilot testing
4. ✅ Community feedback
5. ✅ Compliance audit

**НЕ ПУБЛИКОВАТЬ** без legal approval.

**Контакт**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Этот документ является черновиком политики контента. Не является юридическим советом. Требует обязательной проверки квалифицированным юристом перед использованием.
