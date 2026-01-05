# Политика контента Rork-Kiku (ЧЕРНОВИК)

**⚠️ ТРЕБУЕТ ЮРИСТА: Этот документ является черновиком и должен быть reviewed и finalized квалифицированным юристом, специализирующимся на COPPA, GDPR, и child safety regulations перед публикацией.**

---

## Введение

Rork-Kiku — платформа для безопасного детского контента. Наша миссия — создать пространство, где родители могут быть уверены, что их дети видят только подходящий для их возраста контент.

Эта политика определяет:
- Какой контент разрешён на платформе
- Какой контент запрещён
- Процесс модерации
- Правила эскалации и апелляции
- Верификацию родителей

## Запрещённый контент

### Категория 1: Абсолютно запрещено (Zero Tolerance)

Следующие типы контента **немедленно удаляются** и могут привести к **permanent ban** аккаунта:

1. **Child Sexual Abuse Material (CSAM)**
   - Любое изображение или видео сексуального характера с участием детей
   - **Action:** Немедленное удаление + report в NCMEC (National Center for Missing & Exploited Children) и правоохранительные органы
   - **Account:** Permanent ban + police report

2. **Child Exploitation or Endangerment**
   - Grooming или predatory behavior
   - Контакты взрослых с детьми с целью exploitation
   - Контент, который ставит ребенка в опасность

3. **Graphic Violence**
   - Жестокое насилие, кровь, gore
   - Изображения смерти, пыток, серьезных травм
   - Animal cruelty

4. **Self-Harm & Suicide**
   - Контент, изображающий или пропагандирующий самоповреждение
   - Suicide content
   - Eating disorders promotion

5. **Hate Speech & Extremism**
   - Расизм, сексизм, гомофобия, ксенофобия
   - Экстремистский контент, терроризм
   - Symbols hate groups

6. **Illegal Activity**
   - Drugs (production, sale, use)
   - Weapons (illegal weapons)
   - Any other illegal activity

7. **Sexual Content (NSFW)**
   - Nudity (кроме age-appropriate baby/toddler photos в семейном контексте)
   - Sexually explicit content
   - Suggestive poses or content

### Категория 2: Контент, требующий контекста (Contextual Review)

Этот контент может быть разрешён или запрещён в зависимости от контекста:

1. **Mild Violence**
   - Мультяшное насилие (cartoon violence) — может быть ok
   - Видеоигры с легким насилием — зависит от возраста ребенка
   - Спортивные травмы (легкие) — обычно ok

2. **Emotional Content**
   - Грустный или расстроенный ребенок — обычно ok (это real life)
   - Extreme distress — может требовать review

3. **Potentially Dangerous Activities**
   - Extreme sports (skiing, climbing) — с safety gear обычно ok
   - Без safety precautions — может быть restricted

4. **Privacy-Sensitive Content**
   - Полные имена, адреса, номера телефонов — удаляются
   - Название школы — может быть ok в зависимости от контекста
   - Geolocation — удаляется если слишком точная

5. **Branded Content / Advertising**
   - Product placement — review case-by-case
   - Overt advertising — запрещено (COPPA violation)

### Категория 3: Контент, требующий возрастного фильтрования

1. **Страшный контент (Scary)**
   - Horror themes
   - Monsters, ghosts
   - **Age-appropriate:** Зависит от настроек родителя

2. **Mature Themes**
   - Сложные социальные темы
   - Новости (войны, катастрофы)
   - **Age-appropriate:** Зависит от возраста

## Уровни фильтрации

Родители могут выбрать уровень модерации для каждого ребенка:

### Жёсткая фильтрация (Strict) — Рекомендуется для детей 4-8 лет

**Разрешено:**
- Семейные фото и видео
- Детские игры и activities
- Educational content
- Pets и animals (non-violent)
- Nature, outdoors
- Art, crafts, music

**Запрещено:**
- Всё из Категории 1 (абсолютно)
- Любое насилие (даже мультяшное)
- Страшный контент
- Сложные темы
- News content

**Threshold:**
- Auto-approve: confidence > 98%
- Manual review: confidence 90-98%
- Auto-reject: confidence < 90% или any flags

### Умеренная фильтрация (Moderate) — Рекомендуется для детей 9-12 лет

**Разрешено:**
- Все из Strict level
- Mild cartoon violence
- Video games (E-rated или эквивалент)
- Educational content (более сложные темы)
- Спортивные игры (включая contact sports с safety gear)

**Запрещено:**
- Всё из Категории 1 (абсолютно)
- Explicit violence
- Sexual content
- Drugs, weapons
- Extreme scary content

**Threshold:**
- Auto-approve: confidence > 95%
- Manual review: confidence 85-95%
- Auto-reject: confidence < 85%

### Мягкая фильтрация (Relaxed) — Для детей 13-14 лет (edge of platform)

**Разрешено:**
- Все из Moderate level
- More mature themes (с parental guidance)
- News content (age-appropriate)
- Documentary content

**Запрещено:**
- Всё из Категории 1 (абсолютно)
- NSFW content
- Explicit violence
- Illegal activity

**Threshold:**
- Auto-approve: confidence > 90%
- Manual review: confidence 75-90%
- Auto-reject: confidence < 75%

## Процесс модерации

### Шаг 1: Автоматическая модерация (ML)

**Когда контент загружается:**
1. Контент отправляется в ML inference pipeline
2. ML модель анализирует:
   - NSFW detection
   - Violence detection
   - Age-appropriateness
   - Text toxicity (если есть caption)
3. ML возвращает:
   - Classification (safe / borderline / unsafe)
   - Confidence score (0-100%)
   - Flags (specific issues detected)

**Decision Logic:**

**Safe (High Confidence):**
- Confidence > threshold для выбранного уровня фильтрации
- No red flags
- **Action:** Auto-approve ✅

**Borderline (Medium Confidence):**
- Confidence в диапазоне для manual review
- OR есть amber flags
- **Action:** Queue для ручной модерации 🔍

**Unsafe (Low Confidence или red flags):**
- Confidence < threshold
- OR есть red flags (NSFW, violence, etc.)
- **Action:** Auto-reject ❌

**Typical Distribution (target):**
- Auto-approve: 70-80%
- Manual review: 15-25%
- Auto-reject: 5-10%

### Шаг 2: Ручная модерация

**Для контента в manual review queue:**

**Moderator Actions:**
1. Просмотр контента + metadata (caption, ML flags)
2. Применить moderation guidelines
3. Учитывать context (family event, educational, etc.)
4. Decision:
   - **Approve:** Контент безопасен ✅
   - **Reject:** Контент нарушает политику ❌
   - **Escalate:** Сложный случай → senior moderator 🔺

**SLA (Service Level Agreement):**
- Target: < 4 часа
- Acceptable: < 12 часов
- Max: 24 часа

**Качественный контроль:**
- 10% random sample reviewed вторым модератором
- Regular training и calibration sessions
- Weekly review сложных cases

### Шаг 3: Эскалация (для сложных случаев)

**Criteria для эскалации:**
- Модератор не уверен (uncertain)
- Conflicting rules (контент попадает в grey area)
- High-profile user или sensitive content
- Potential legal issues

**Senior Moderator:**
- Более опытный модератор
- Final decision на escalated cases
- Can create policy exceptions (documented)

**Escalation SLA:**
- Target: < 12 часов
- Max: 48 часов

### Шаг 4: Enforcement Actions

**При violation:**

**First Strike:**
- Content removed
- Warning sent to parent
- Explanation о violation
- Educational materials (what's allowed/not allowed)

**Second Strike:**
- Content removed
- Warning + temporary upload restriction (7 days)
- Required: review community guidelines

**Third Strike:**
- Content removed
- Temporary account suspension (30 days)
- Required: contact support для reinstatement

**Severe Violation (Category 1 content):**
- Immediate permanent ban
- All content removed
- Report to authorities (если CSAM или illegal content)
- No appeal

**Account Reinstatement:**
- Parent должен подтвердить understanding правил
- May require phone/video call
- Approval от senior moderator или admin

## Процесс апелляции (Appeals)

Если родитель считает, что контент был **ошибочно отклонён** (false positive):

### Процесс Appeal:

1. **Submit Appeal:**
   - In-app appeal form
   - OR email: [FOUNDERS_EMAIL]
   - Provide: content ID, reason why should be approved

2. **Review:**
   - Appeal reviewed другим модератором (не тем, кто сделал original decision)
   - Review в течение 48 часов

3. **Decision:**
   - **Upheld:** Original decision correct, контент остается rejected
   - **Overturned:** Original decision ошибка, контент approved
   - **Partial:** Контент approved с modifications (например, blur части изображения)

4. **Feedback Loop:**
   - All overturned decisions используются для ML model improvement
   - Moderator training updated если систематическая ошибка

### Appeal Statistics (Target):

- Appeals submitted: < 2% of rejections
- Appeals upheld: 70-80% (модераторы обычно правы)
- Appeals overturned: 20-30% (false positives)

## Верификация "здоровых родителей" (Parental Verification)

**Цель:** Убедиться, что account создан реальным родителем, а не:
- Ребенком, притворяющимся родителем
- Predator, создающим fake parent account

### Варианты верификации (от easiest до strongest):

### Option 1: Email + SMS Verification (Baseline) ⚠️
**Process:**
- Email verification при регистрации
- SMS code на phone number
**Strength:** Low (дети могут иметь доступ к email/phone)
**Cost:** Free
**Friction:** Low
**Acceptable для:** Pilot только, NOT for public launch

### Option 2: Credit Card Micro-Transaction (Recommended) 💳
**Process:**
- Charge $0.50 на credit/debit card
- Instant refund
- Verifies cardholder (adults обычно имеют cards)
**Strength:** Medium-High
**Cost:** Payment processing fees (~3%) = $0.015
**Friction:** Low
**Acceptable для:** Public launch
**Implementation:** Stripe Payment Intents API

### Option 3: Government ID Check (Strong) 🆔
**Process:**
- Upload government-issued ID (passport, driver's license)
- Selfie для liveness check
- Third-party verification service (Onfido, Jumio, Veriff)
**Strength:** High
**Cost:** $1-3 per verification
**Friction:** High (многие users не хотят upload ID)
**Acceptable для:** High-risk accounts или by request

### Option 4: School / NGO Verification (Partnership) 🏫
**Process:**
- Parent registers через partnership link (school, NGO)
- Organization confirms parent identity
- Pre-verified parents
**Strength:** High (trust в organization)
**Cost:** Free (partnership agreement)
**Friction:** Low (если parent уже в partnership)
**Acceptable для:** Pilot и partnership channels

### Option 5: Video Proof (Manual) 📹
**Process:**
- Parent records short video (30 seconds)
- States: "I am [Name], parent of [Child Name], and I consent to create account"
- Shows face (liveness check)
- Reviewed manually или с video liveness detection
**Strength:** Medium-High
**Cost:** Manual review time (~2 min) = ~$1 moderator cost
**Friction:** Medium
**Acceptable для:** High-value customers или suspicious accounts

### Option 6: Payment (Full Product) 💰
**Process:**
- Start trial (free 7 days)
- Convert to paid subscription
- Payment verification (credit card)
**Strength:** Medium (assumes adults have payment methods)
**Cost:** None (user pays)
**Friction:** High (not all parents will pay immediately)
**Acceptable для:** Post-trial conversion

### Recommendation:

**MVP/Pilot:** Option 1 (Email + SMS) + Option 4 (School verification для partnerships)

**Public Launch:** Option 2 (Credit Card) as primary + Option 4 (School) для partnerships

**Future:** Add Option 3 (ID check) для users кто prefer stronger verification или для suspicious activity

**Never:** Rely только на checkbox "I am a parent" — слишком weak

## Контактная информация

**Для модераторов:**
- Internal: Moderation dashboard
- Questions: moderation-team@ [DOMAIN]

**Для пользователей:**
- Report content: In-app report button
- Appeal decision: In-app appeal form или [FOUNDERS_EMAIL]
- Support: [FOUNDERS_EMAIL]

**Для legal/compliance questions:**
- [FOUNDERS_EMAIL]

## Изменения политики

**Version History:**
- v0.1 (Draft) - 2026-01-02 - Initial draft
- v1.0 (TBD) - Post legal review

**Process для updates:**
1. Draft changes
2. Legal review
3. User notification (30 days advance notice для major changes)
4. Effective date

---

**⚠️ DISCLAIMER:**

Этот документ является **ЧЕРНОВИКОМ** и предназначен для internal planning только. Он **НЕ** является legal advice и **НЕ** должен публиковаться без review квалифицированным юристом.

**ТРЕБУЕТ REVIEW:**
- Юрист, специализирующийся на COPPA (US)
- Юрист, специализирующийся на GDPR (EU), если планируется EU expansion
- Юрист, знакомый с российским законодательством о защите детей (если основной рынок РФ)
- Child safety expert

**Юридические формулировки должны быть reviewed для:**
- COPPA compliance
- GDPR compliance (если EU)
- Section 230 protection (US) — "good faith" moderation
- Liability limitations
- Indemnification clauses

**PLACEHOLDER CONTACTS:**
- [FOUNDERS_EMAIL] должен быть заменён реальным email
- [DOMAIN] должен быть заменён реальным доменом

**НИКОГДА не включать:**
- Actual user data в этом документе
- Specific moderation decisions (хранить отдельно в secure logs)
- Moderator credentials

---

**Контакт для вопросов:** [FOUNDERS_EMAIL]

**Related Documents:**
- `docs/legal/privacy_policy_draft.md` - Privacy policy
- `docs/security/security_design.md` - Security design
- `docs/mvp/mvp_spec.md` - Moderation API specs
