# Политика контента Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Статус**: ⚠️ **ТРЕБУЕТ ЮРИСТА** — консультация с юристом обязательна перед финализацией

---

## Обзор

Политика контента Rork-Kiku определяет, какой контент разрешен на платформе, а какой запрещен. Цель политики — обеспечить безопасную среду для детей 6-12 лет и их родителей, соблюдая требования COPPA, GDPR и других регуляторных норм.

**Принципы**:
1. **Безопасность детей — приоритет #1**
2. **Проактивная модерация** (AI + человек)
3. **Прозрачность** для родителей
4. **Нулевая толерантность** к опасному контенту

---

## Запрещённый контент

### Категория 1: Незаконный контент (ZERO TOLERANCE)

**Автоматическая блокировка + отчёт в правоохранительные органы**:

1. **Child Sexual Abuse Material (CSAM)**
   - Любые изображения/видео сексуального характера с участием несовершеннолетних
   - Немедленная блокировка + отчёт в NCMEC (National Center for Missing & Exploited Children)
   - Permanent ban пользователя

2. **Grooming / Predatory Behavior**
   - Попытки установить неуместные отношения с ребёнком
   - Запросы на встречи, обмен контактами вне платформы
   - Manipulation или coercion

3. **Human Trafficking / Exploitation**
   - Любой контент, связанный с торговлей людьми
   - Принудительный труд

4. **Hate Speech / Extremism**
   - Призывы к насилию на основе расы, религии, пола, и т.д.
   - Экстремистская пропаганда
   - Terrorist content

5. **Illegal Drugs / Weapons**
   - Продажа наркотиков
   - Инструкции по созданию оружия
   - Незаконная торговля

### Категория 2: Опасный контент (HIGH PRIORITY)

**Автоматическая блокировка + ручная проверка**:

1. **NSFW Content (Not Safe For Work)**
   - Нагота или полу-нагота
   - Сексуальный контент (explicit или suggestive)
   - Pornography

2. **Violence / Gore**
   - Графическое насилие (кровь, раны)
   - Жестокое обращение с животными
   - Изображения смерти или серьёзных травм

3. **Self-Harm / Suicide**
   - Контент, призывающий к самоповреждению
   - Инструкции по совершению суицида
   - Glorification самоповреждения

4. **Bullying / Harassment**
   - Оскорбления, травля
   - Threats (угрозы физического насилия)
   - Doxxing (публикация личных данных)

5. **Misinformation (опасная)**
   - Медицинская misinformation (особенно для детей)
   - Опасные challenge'ы (типа "Tide Pod challenge")

### Категория 3: Нежелательный контент (MODERATE PRIORITY)

**Ручная модерация + warning пользователю**:

1. **Profanity / Ненормативная лексика**
   - Мат и грубые слова (на любых языках)
   - Уровень зависит от настроек модерации (строгая/средняя/мягкая)

2. **Spam**
   - Рекламные сообщения
   - Repetitive content
   - Unsolicited links

3. **Personal Information (PII)**
   - Номера телефонов, адреса
   - Email addresses, social media handles
   - Credit card info

4. **Inappropriate Language**
   - Сексуальные innuendo
   - Suggestive language (не explicit, но неуместный для детей)

5. **Disturbing Content (не violent, но unsettling)**
   - Страшные изображения (horror)
   - Шокирующий контент (без насилия)

### Категория 4: Спорный контент (LOW PRIORITY)

**Разрешено, но с предупреждением родителям**:

1. **Political Content**
   - Политические взгляды (если не hate speech)
   - Разрешено для родителей, но не для детей

2. **Religious Content**
   - Религиозные темы (если не extremism)
   - Разрешено для обсуждения

3. **News / Current Events**
   - Новости о войнах, катастрофах (age-appropriate manner)
   - Предупреждение родителям перед показом детям

---

## Уровни фильтрации

Родители могут выбрать один из трёх уровней модерации для профиля ребёнка:

### Уровень 1: Жёсткая фильтрация (Strict) — По умолчанию для 6-9 лет

**Что блокируется**:
- ✅ Весь запрещённый контент (категории 1-2)
- ✅ Нежелательный контент (категория 3)
- ✅ 80% спорного контента (категория 4)

**Порог ML confidence для auto-approval**: 95%+

**Примеры**:
- Блокировать: "damn", "stupid", любые намёки на насилие
- Разрешать: "nice", "awesome", образовательный контент

**Рекомендуется для**: Дети 6-9 лет

### Уровень 2: Умеренная фильтрация (Moderate) — По умолчанию для 10-12 лет

**Что блокируется**:
- ✅ Весь запрещённый контент (категории 1-2)
- ⚠️ Частично нежелательный контент (категория 3) — зависит от контекста
- ❌ Спорный контент обычно разрешён (категория 4)

**Порог ML confidence для auto-approval**: 90%+

**Примеры**:
- Блокировать: explicit profanity, sexual content
- Разрешать: mild profanity ("damn"), новости (age-appropriate)

**Рекомендуется для**: Дети 10-12 лет

### Уровень 3: Мягкая фильтрация (Soft) — Опционально для родителей

**Что блокируется**:
- ✅ Только запрещённый контент (категории 1-2)
- ❌ Нежелательный и спорный контент обычно разрешён

**Порог ML confidence для auto-approval**: 85%+

**Примеры**:
- Блокировать: NSFW, violence, grooming
- Разрешать: profanity (кроме extreme), политические темы

**Рекомендуется для**: Родители, которые хотят больше свободы для ребёнка (11-12 лет)

---

## Процесс модерации и эскалации

### Шаг 1: Автоматическая модерация (AI)

**Когда**: Каждый раз, когда пользователь отправляет контент (текст, изображение, видео)

**Как работает**:
1. Контент отправляется в ML модель (Google Vision API, custom NLP models)
2. ML модель возвращает:
   - **Score** (0-100): вероятность, что контент безопасен
   - **Categories**: список проблемных категорий (NSFW, violence, profanity, и т.д.)
3. Решение на основе score и уровня модерации:

| Score | Действие |
|-------|----------|
| **90-100** (safe) | ✅ Автоматически одобрен → доставляется получателю |
| **50-89** (uncertain) | ⚠️ Отправляется на ручную модерацию |
| **0-49** (unsafe) | ❌ Автоматически заблокирован → уведомление родителю |

**Latency**:
- Текст: < 2 секунды
- Изображение: < 10 секунд
- Видео: < 30 секунд (покадровый анализ)

### Шаг 2: Ручная модерация (Human)

**Когда**: Контент с score 50-89 (uncertain) или когда пользователь оспаривает auto-block

**Кто модерирует**:
- Trained moderators (full-time или contract)
- 18+ лет, background check
- Training по COPPA, детской безопасности

**Процесс**:
1. Модератор видит контент в moderation queue
2. Просматривает контент + context (кто отправил, кому, история пользователя)
3. Принимает решение:
   - **Approve**: контент доставляется получателю
   - **Reject**: контент блокируется + уведомление родителю
   - **Escalate**: сложный case → передаётся senior moderator или admin

**SLA (Service Level Agreement)**:
- **Пилот**: < 2 часа (в рабочее время)
- **Production**: < 30 минут (24/7 coverage)

### Шаг 3: Эскалация (Escalation)

**Когда**: Серьёзные нарушения (категория 1-2) или повторные нарушения

**Процесс эскалации**:

1. **First Offense (minor)**:
   - Контент заблокирован
   - Уведомление родителю: "Ваш ребёнок попытался отправить нежелательный контент"
   - Warning (без последствий)

2. **Second Offense (minor)**:
   - Контент заблокирован
   - Уведомление родителю + recommendation изменить настройки модерации
   - Возможно temporary restriction (например, только текст, без медиа)

3. **Third Offense (minor) или First Offense (major)**:
   - Контент заблокирован
   - **Account freeze** (24-48 часов)
   - Родитель должен review политику контента и подтвердить понимание
   - Возможно требование повышения уровня модерации

4. **Serious Offense (категория 1: CSAM, grooming, и т.д.)**:
   - **Permanent ban** пользователя (родитель + ребёнок)
   - Отчёт в правоохранительные органы (NCMEC, FBI, местная полиция)
   - Сохранение evidence (logs, screenshots) для расследования
   - Legal team involvement

**Appeals (оспаривание)**:
- Пользователь может оспорить блокировку через support
- Review by senior moderator
- Решение в течение 48 часов

---

## Верификация "здоровых родителей"

**Цель**: Убедиться, что "родитель" на платформе — действительно взрослый и не pretending to be parent для grooming.

### Варианты верификации

#### Вариант 1: Документальная верификация (рекомендуется для Production)

**Процесс**:
1. Родитель загружает ID (driver's license, passport)
2. Автоматическая проверка через сервис (Stripe Identity, Onfido, Jumio)
3. Проверяется:
   - Фото на ID соответствует selfie
   - Возраст > 18 лет
   - Документ не поддельный
4. Manual review для edge cases

**Плюсы**:
- Высокая надежность
- Automated (низкая стоимость)
- Industry standard

**Минусы**:
- Friction для пользователя
- Privacy concerns (хранение ID копий)

**Стоимость**: ~$1-2 за верификацию

#### Вариант 2: Платежная верификация

**Процесс**:
1. Родитель вводит credit/debit card
2. Малый платёж ($1-2) для верификации
3. Подтверждение, что карта принадлежит взрослому (дети обычно не имеют карт)
4. Возврат платежа после верификации

**Плюсы**:
- Простой UX
- Низкая стоимость
- Доказывает платежеспособность (для будущей монетизации)

**Минусы**:
- Не 100% reliable (дети могут использовать карты родителей)
- Некоторые родители могут не иметь карт

**Стоимость**: processing fees (~$0.30 + 2.9%)

#### Вариант 3: School/NGO Verification Codes

**Процесс**:
1. Партнёрские школы/НКО выдают verification codes верифицированным родителям
2. Родитель вводит код при регистрации
3. Код валидируется → родитель верифицирован

**Плюсы**:
- Высокое доверие (школа уже знает родителя)
- Отличный partnership channel
- Zero friction

**Минусы**:
- Limited scale (только для партнёрских организаций)
- Требует partnerships

**Стоимость**: $0 (если partnerships бесплатные)

#### Вариант 4: Video Verification (advanced, для high-risk cases)

**Процесс**:
1. Родитель запрашивает видео верификацию
2. Видеозвонок с moderator (как Airbnb)
3. Проверка ID в реальном времени
4. Moderator подтверждает identity

**Плюсы**:
- Максимальная надежность
- Human touch

**Минусы**:
- Дорого ($10-20 за verification)
- Не масштабируемо
- High friction

**Стоимость**: $10-20 за verification

### Рекомендация

**MVP/Pilot**:
- Apple Sign In + self-declaration (минимальная верификация)
- Monitoring: ручной review подозрительных accounts

**Production**:
- **Tier 1** (default): Платежная верификация (Вариант 2) — простой и недорогой
- **Tier 2** (optional): Документальная верификация (Вариант 1) — для родителей, которые хотят больше доверия
- **Tier 3** (partners): School/NGO codes (Вариант 3) — для партнёрских программ

**High-risk cases**: Video verification (Вариант 4) — для suspicious accounts

---

## Подходы к модерации

### AI Moderation

**Текстовая модерация**:
- **Google Perspective API**: toxicity, profanity, threats
- **Custom NLP models**: sentiment analysis, PII detection
- **Blacklist/Whitelist**: список запрещённых/разрешённых слов

**Модерация изображений**:
- **Google Vision API SafeSearch**: NSFW, violence, adult content
- **AWS Rekognition Content Moderation**: альтернатива
- **Custom models**: для edge cases (например, memes с текстом)

**Модерация видео**:
- **Frame-by-frame analysis**: каждый кадр через image moderation
- **Audio transcription**: speech-to-text → text moderation
- **Scene detection**: обнаружение rapid scene changes (может указывать на inappropriate content)

### Human Moderation

**Когда использовать**:
- Uncertain cases (score 50-89)
- Appeals (пользователь оспаривает block)
- Edge cases (complex context)

**Team**:
- **Moderation Lead**: 1 FTE (full-time employee)
- **Moderators**: 2-5 FTE (в зависимости от volume)
- **Senior Moderators**: 1-2 FTE (для escalations)

**Training**:
- COPPA compliance
- Детская безопасность
- Trauma-informed moderation (защита mental health moderators)
- De-escalation techniques

**Tools**:
- Moderation dashboard (admin panel)
- Queue management (FIFO, priority-based)
- Annotation tools (для ML training)

**Wellness**:
- Regular breaks (модерация disturbing content — тяжелая работа)
- Counseling support
- Rotation (не только moderation, но и другие задачи)

---

## Reporting и Transparency

### Для родителей

**Moderation Reports**:
- Weekly summary: сколько контента заблокировано, почему
- Real-time alerts для serious violations
- Access to full moderation history в parent dashboard

**Transparency**:
- Clear explanation почему контент заблокирован
- Примеры разрешённого vs запрещённого контента
- FAQ: "Почему мой ребёнок не может отправить это?"

### Для регуляторов

**Compliance Reports**:
- Quarterly reports для FTC (если требуется)
- CSAM reports в NCMEC (mandatory)
- Breach notifications (GDPR, 72 hours)

**Audits**:
- Annual security audit (третья сторона)
- COPPA compliance review
- Penetration testing

---

## Legal Considerations

### ⚠️ ТРЕБУЕТ ЮРИСТА

Эта политика контента — черновик и **должна быть reviewed и approved юристом** перед публикацией, особенно:

1. **COPPA Compliance**:
   - Parental consent flows
   - Data collection minimization
   - Право родителей на удаление данных

2. **GDPR Compliance** (для EU users):
   - Data processing legal basis
   - Right to be forgotten
   - Data portability

3. **Section 230 (US)**:
   - Platform immunity для user-generated content
   - Good faith moderation (не теряет immunity)

4. **Liability**:
   - Ограничение ответственности в ToS
   - Disclaimer: "Мы стараемся модерировать контент, но не можем гарантировать 100% accuracy"

5. **Международное законодательство**:
   - UK Online Safety Bill
   - EU Digital Services Act (DSA)
   - Country-specific laws (Германия NetzDG, и т.д.)

---

## Версионирование и обновления

**Версия**: 1.0 (ЧЕРНОВИК)

**Planned Updates**:
- **Version 1.1** (после pilot): обновления на основе feedback
- **Version 2.0** (перед public launch): финализация с юристом
- **Version 3.0+** (ongoing): обновления при изменении законов или появлении новых угроз

**Процесс обновления**:
1. Draft changes
2. Legal review
3. User notification (30 days перед применением)
4. Publish updated policy

---

## Заключение

Политика контента Rork-Kiku нацелена на создание **самой безопасной платформы для детей** при сохранении баланса между защитой и свободой. Ключевые принципы:

1. **Проактивность**: AI модерация перед доставкой контента
2. **Прозрачность**: родители видят всё
3. **Эскалация**: серьёзные нарушения → permanent ban + legal action
4. **Адаптивность**: три уровня модерации для разных возрастов

**Next Steps**:
- [ ] Legal review (консультация с юристом)
- [ ] Finalize verification flows
- [ ] Train moderation team
- [ ] Test moderation pipeline (pilot)
- [ ] Iterate based on feedback

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Product & Legal Team  
**Статус**: ⚠️ **ТРЕБУЕТ ЮРИСТА**
