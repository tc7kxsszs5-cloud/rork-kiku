# Политика контента Rork-Kiku

## Обзор

Данный документ описывает политику модерации контента на платформе Rork-Kiku. Цель — обеспечить безопасную среду для детей, защитить их от вредного контента и поддерживать доверие родителей.

**ТРЕБУЕТ ЮРИСТА:** Данный документ является черновиком и должен быть reviewed юристом перед публикацией.

---

## 1. Запрещённый контент

### 1.1 Категория: Adult Content / Взрослый контент

**Определение:**
Любой контент сексуального или эротического характера, включая:
- Откровенные изображения или описания сексуальной активности
- Нагота (полная или частичная)
- Сексуализированные изображения детей или взрослых
- Порнография любого вида
- Откровенно сексуальные тексты или намёки

**Действие:** ❌ Автоматическая блокировка + ручная проверка

**ML Score threshold:** > 0.8 → auto-block, 0.5-0.8 → manual review

**Примеры:**
- ✅ Разрешено: детские фото в купальниках на пляже (контекст: семейный отдых)
- ❌ Запрещено: откровенные изображения, даже с artistic intent
- ❌ Запрещено: текстовые сообщения с adult keywords

### 1.2 Категория: Violence / Насилие

**Определение:**
Контент, изображающий или описывающий:
- Физическое насилие (драки, побои, убийства)
- Кровь, увечья, раны
- Издевательства над людьми или животными
- Оружие в угрожающем контексте
- Self-harm (самоповреждение)
- Suicide-related content

**Действие:** ❌ Автоматическая блокировка + ручная проверка

**ML Score threshold:** > 0.7 → auto-block, 0.4-0.7 → manual review

**Примеры:**
- ✅ Разрешено: игрушечное оружие в игровом контексте (Water guns, Nerf)
- ⚠️ Требует проверки: изображения с red substance (может быть краска, кровь, сок)
- ❌ Запрещено: изображения реального оружия, драки, крови
- ❌ Запрещено: тексты с угрозами насилия или описанием self-harm

### 1.3 Категория: Hate Speech / Hate Symbols

**Определение:**
Контент, содержащий:
- Расовую, этническую, религиозную ненависть
- Дискриминацию по полу, ориентации, disability
- Hate symbols (свастика, white supremacist symbols, etc.)
- Slurs и оскорбительные термины
- Призывы к насилию против групп

**Действие:** ❌ Автоматическая блокировка + эскалация

**ML Score threshold:** > 0.9 → auto-block + notify authorities (если применимо)

**Примеры:**
- ❌ Запрещено: hate symbols в любом контексте
- ❌ Запрещено: slurs и оскорбительные термины
- ❌ Запрещено: призывы к дискриминации или насилию

**ТРЕБУЕТ ЮРИСТА:** В некоторых юрисдикциях обязательно reporting hate speech authorities.

### 1.4 Категория: Bullying / Harassment / Буллинг

**Определение:**
Контент, направленный на:
- Издевательства, унижение, травлю
- Харассмент, угрозы
- Доксинг (раскрытие личной информации)
- Impersonation (выдавание себя за другого)

**Действие:** ⚠️ Ручная проверка + контекст

**ML Score threshold:** > 0.6 → manual review (context-dependent)

**Примеры:**
- ❌ Запрещено: сообщения с угрозами, оскорблениями
- ❌ Запрещено: публикация чужих личных данных
- ⚠️ Требует контекста: дружеское подшучивание vs. буллинг

**Note:** Rork-Kiku — платформа parent-child, поэтому буллинг между детьми маловероятен, но возможны случаи с shared accounts.

### 1.5 Категория: Illegal Content / Незаконный контент

**Определение:**
Контент, нарушающий законы:
- Child Sexual Abuse Material (CSAM) — **ZERO TOLERANCE**
- Drug use, drug sales
- Terrorism, extremism
- Illegal weapons
- Fraud, scams
- Copyright infringement (music, movies without license)

**Действие:** ❌ Немедленная блокировка + report authorities

**ML Score threshold:** > 0.95 → auto-block + law enforcement notification

**ТРЕБУЕТ ЮРИСТА:** Обязательства reporting CSAM и terrorism content authorities. В США — NCMEC (National Center for Missing & Exploited Children).

**Примеры:**
- ❌ Запрещено: любой CSAM — report to NCMEC немедленно
- ❌ Запрещено: изображения употребления наркотиков
- ❌ Запрещено: пропаганда terrorism
- ⚠️ Требует проверки: copyrighted music в background (fair use?)

### 1.6 Категория: Spam / Malicious Content

**Определение:**
- Spam, нежелательная реклама
- Phishing, malware
- Scams
- Repetitive, low-quality content

**Действие:** ⚠️ Warning → блокировка при повторении

**Примеры:**
- ❌ Запрещено: ссылки на phishing sites
- ❌ Запрещено: spam сообщения
- ⚠️ Warning: повторяющийся контент (дети иногда отправляют одно фото много раз)

### 1.7 Категория: Personal Information / Личная информация

**Определение:**
Контент, раскрывающий:
- Адреса, номера телефонов
- Social Security Numbers, passport data
- Банковские данные, credit cards
- School names, specific locations (safety risk)

**Действие:** ⚠️ Автоматическая редакция (blur/remove) + уведомление

**ML Score threshold:** OCR + regex для обнаружения phone numbers, addresses

**Примеры:**
- ⚠️ Блокировать: фото с видимым адресом на конверте
- ⚠️ Блокировать: скриншоты с personal data
- ✅ Разрешено: имена (first names), если не в опасном контексте

**Note:** Дети могут случайно отправить фото с personal info (например, школьный badge). Задача модерации — выявить и заблокировать.

---

## 2. Уровни фильтрации

### 2.1 Жёсткая фильтрация (Strict)

**Рекомендуется для:** детей 4-8 лет

**Параметры:**
- ML confidence threshold: 0.4 (низкий порог → больше контента идёт на ручную проверку)
- Автоматический блок: score > 0.7
- Ручная проверка: score 0.4-0.7
- Автоматический пропуск: score < 0.4

**Blocked categories:**
- Все категории выше с наиболее строгими правилами
- Любое изображение с оружием (даже игрушечным, требует проверки)
- Любые намёки на adult content

**Result:**
- Более высокий false positive rate (может заблокировать безобидный контент)
- Максимальная защита

**Use case:**
- Родители, которые хотят абсолютную уверенность
- Младшие дети

### 2.2 Умеренная фильтрация (Moderate) — **Default**

**Рекомендуется для:** детей 8-12 лет

**Параметры:**
- ML confidence threshold: 0.5
- Автоматический блок: score > 0.8
- Ручная проверка: score 0.5-0.8
- Автоматический пропуск: score < 0.5

**Blocked categories:**
- Все категории выше, но с учётом контекста
- Игрушечное оружие в игровом контексте — разрешено
- Мультяшное насилие (cartoons) — может быть разрешено при контексте

**Result:**
- Баланс между защитой и user experience
- Меньше false positives

**Use case:**
- Большинство родителей
- Default setting

### 2.3 Мягкая фильтрация (Lenient)

**Рекомендуется для:** детей 10-12 лет, высокий уровень доверия

**Параметры:**
- ML confidence threshold: 0.6
- Автоматический блок: score > 0.9
- Ручная проверка: score 0.6-0.9
- Автоматический пропуск: score < 0.6

**Blocked categories:**
- Только критичный контент: adult, explicit violence, hate speech, illegal
- Cartoons, игры с условным насилием — разрешены
- Большая свобода для creative content

**Result:**
- Минимум false positives
- Родители должны больше полагаться на trust

**Use case:**
- Старшие дети с доказанной ответственностью
- Родители, которые хотят больше свободы для ребёнка

**Note:** Даже на мягкой фильтрации, критичный контент (CSAM, explicit violence, hate) всегда блокируется.

---

## 3. Правила эскалации

### 3.1 Автоматическая блокировка (Auto-Block)

**Условия:**
- ML confidence score выше threshold для auto-block (зависит от уровня фильтрации)
- Контент из категории ZERO TOLERANCE (CSAM, terrorism)

**Действия:**
1. Контент немедленно блокируется (не доставляется получателю)
2. Уведомление отправителю: "Ваше сообщение не прошло модерацию"
3. Контент добавляется в очередь ручной проверки (double-check)
4. Если подтверждается: контент удаляется, logged
5. Если false positive: контент разблокируется, доставляется, ML model feedback

**Timing:**
- Блокировка: instant
- Ручная проверка: в течение 1 часа (SLA)

### 3.2 Ручная модерация (Manual Review)

**Условия:**
- ML confidence score в диапазоне manual review
- Контент требует контекста (например, red substance — кровь или краска?)
- Edge cases

**Процесс:**
1. Контент помещается в очередь модерации
2. Уведомление отправителю: "Ваше сообщение на проверке, это займёт до 1 часа"
3. Модератор просматривает контент
4. Решение: Approve / Reject / Escalate
5. Если Approve: доставляется получателю + ML feedback (false positive)
6. Если Reject: удаляется + уведомление отправителю + причина
7. Если Escalate: передаётся senior модератору или team lead

**Timing:**
- SLA: 95% контента reviewed < 1 hour
- Priority queue для high-risk content (review < 15 min)

**Quality Assurance:**
- 10% решений модераторов randomly reviewed старшим модератором
- Feedback loop для улучшения качества

### 3.3 Эскалация к senior модератору

**Условия:**
- Сложный случай, модератор не уверен
- Пограничный контент (на грани допустимого)
- Potential legal issue

**Процесс:**
1. Модератор нажимает "Escalate"
2. Контент передаётся senior модератору или team lead
3. Senior модератор принимает решение с обоснованием
4. Решение документируется для future reference

**Timing:**
- SLA: < 2 hours для escalated content

### 3.4 Заморозка аккаунта (Account Freeze)

**Условия:**
- Повторные нарушения (3+ rejected uploads за неделю)
- Серьёзное нарушение (CSAM, terrorism, explicit violence)
- Suspected malicious intent

**Процесс:**
1. Аккаунт временно заморожен (login disabled)
2. Уведомление родителю: "Аккаунт заморожен из-за нарушений политики контента"
3. Родитель может запросить review (appeal)
4. Manual review senior модератором или team
5. Решение: Unfreeze / Permanent Ban

**Timing:**
- Freeze: immediate
- Appeal review: < 24 hours

### 3.5 Блокировка аккаунта (Permanent Ban)

**Условия:**
- Серьёзное нарушение: CSAM, terrorism
- Повторные заморозки (3+ за месяц)
- Доказанный malicious intent

**Процесс:**
1. Аккаунт permanently banned
2. Уведомление родителю с причиной
3. Данные удаляются согласно privacy policy (retention 30 days для legal purposes)
4. Если illegal content: report to authorities

**Appeal:**
- Permanent ban может быть appealed, но требует strong evidence
- Review committee (не одиночный модератор)

---

## 4. Процесс обращения (Appeal Process)

### 4.1 Когда родитель может appeal

**Ситуации:**
- Контент был заблокирован, но родитель считает, что это false positive
- Аккаунт был заморожен, но родитель считает, что это ошибка
- Модерация неправильно интерпретировала контекст

**Не принимаются appeals:**
- Очевидные нарушения (explicit adult content, CSAM, hate speech)
- Контент, нарушающий законы

### 4.2 Процесс appeal

**Шаги:**
1. Родитель нажимает "Обжаловать" в уведомлении или в родительской панели
2. Заполняет форму: причина appeal, контекст
3. Appeal отправляется в отдельную очередь
4. Senior модератор или team lead review
5. Решение принимается в течение 24-48 hours
6. Родитель получает уведомление с решением и обоснованием

**Возможные решения:**
- **Approve appeal:** контент разблокируется, доставляется, извинения
- **Reject appeal:** решение остаётся в силе, обоснование предоставляется
- **Partial approve:** контент редактируется (blur/crop), затем доставляется

**Transparency:**
- Родитель всегда получает clear explanation
- Если контент illegal или очень опасный, объяснение общее (без деталей)

### 4.3 Escalation при несогласии

**Если родитель не согласен с решением appeal:**
- Можно запросить escalation to moderation team lead или legal team
- Email на [MODERATION_APPEALS_EMAIL]
- Response в течение 3-5 business days

**Final decision:**
- Решение moderation team lead — финальное для большинства случаев
- Для legal disputes: может потребоваться external review или arbitration (см. Terms of Service)

---

## 5. Верификация "здоровых родителей"

**Проблема:** Как убедиться, что аккаунт родителя действительно принадлежит ответственному взрослому, а не злоумышленнику?

### 5.1 Метод: Document Check (проверка документов)

**Процесс:**
1. Родитель загружает фото паспорта или водительских прав
2. Автоматическая проверка (OCR + liveness detection, если видео)
3. Ручная проверка модератором (если auto-check не уверен)
4. Подтверждение личности

**Pros:**
- Высокая степень уверенности
- Соответствует KYC (Know Your Customer) требованиям

**Cons:**
- Privacy concerns (родители не хотят отправлять паспорт)
- Медленно (ручная проверка)
- Требует secure storage документов

**ТРЕБУЕТ ЮРИСТА:** Хранение копий паспортов — legal implications (GDPR, data protection)

**Recommendation для MVP:** не использовать, слишком invasive.

### 5.2 Метод: Payment Microtransaction (микротранзакция)

**Процесс:**
1. Родитель привязывает кредитную или дебетовую карту
2. Система делает микротранзакцию $0.01 (или бесплатную authorization)
3. Родитель подтверждает транзакцию в банке
4. Верификация завершена

**Pros:**
- Быстро и автоматично
- COPPA compliant (credit card = adult)
- Низкие privacy concerns

**Cons:**
- Требует платёжной интеграции (Stripe, PayPal)
- Не все родители хотят привязывать карту (хотя большинство имеют карты)

**Recommendation для MVP:** ✅ рекомендуется, хороший баланс.

### 5.3 Метод: School/NGO Verification (верификация через партнёра)

**Процесс:**
1. Школа или НКО предоставляет список родителей (с их согласием)
2. Родители регистрируются по email из списка или с invite code
3. Автоматическая верификация

**Pros:**
- Высокая степень доверия
- Быстро для bulk enrollment
- Нет privacy concerns

**Cons:**
- Только для partnerships
- Не scale для organic sign-ups

**Recommendation для Pilot:** ✅ основной метод для пилота через школы.

### 5.4 Метод: Video Proof (видеодоказательство)

**Процесс:**
1. Родитель записывает короткое видео с паспортом и произносит кодовую фразу
2. Модератор проверяет видео и паспорт
3. Liveness detection (не является записанным видео)

**Pros:**
- Очень высокая степень уверенности
- Сложно подделать

**Cons:**
- Очень invasive
- Медленно (ручная проверка)
- Privacy concerns

**Recommendation:** только для сложных случаев (например, appeal после suspicious activity).

### 5.5 Метод: Social Verification (социальная верификация)

**Процесс:**
1. Родитель связывает аккаунт с Facebook, Google, Apple ID
2. Система проверяет возраст и активность аккаунта
3. Дополнительные сигналы: friends, posts, profile completeness

**Pros:**
- Быстро и удобно (OAuth)
- Большинство родителей имеют social accounts

**Cons:**
- Privacy concerns (доступ к social data)
- Social accounts могут быть fake
- Не 100% reliable

**Recommendation:** можно использовать как дополнительный signal, но не как единственный метод.

### 5.6 Комбинированный подход (рекомендуется)

**Для MVP и пилота:**
1. **Primary:** School/NGO verification (для pilot partnerships)
2. **Secondary:** Payment microtransaction (для organic sign-ups)
3. **Tertiary:** Email + phone verification (минимальный baseline)

**Для production:**
1. **Tier 1:** Email + phone (baseline, все пользователи)
2. **Tier 2:** Microtransaction (для Premium features)
3. **Tier 3:** Document check (опционально, для Enterprise или high-trust features)

**ТРЕБУЕТ ЮРИСТА:** убедиться, что выбранные методы compliant с COPPA verifiable parental consent requirements.

---

## 6. Модерация контента родителей

**Вопрос:** Нужно ли модерировать контент, который родители отправляют детям?

**Ответ:** В общем случае — нет, но есть exceptions.

### 6.1 Baseline: доверие родителям

**Принцип:**
- Родители — ответственные взрослые, верифицированные
- Контент от родителей детям доставляется instantly без модерации
- Это core value proposition: быстрая и безопасная коммуникация

### 6.2 Exceptions: модерация родительского контента

**Случаи, когда модерация необходима:**

**1. Suspected compromised account:**
- Если аккаунт родителя может быть скомпрометирован (unusual activity, login from new device)
- Временная модерация контента до подтверждения личности

**2. Report от другого родителя:**
- Если второй родитель (в shared family account) жалуется на контент первого родителя
- Manual review для разрешения конфликта

**3. Legal request:**
- Court order или law enforcement request
- Review контента для legal purposes

**4. Opt-in moderation:**
- Родители могут сами включить модерацию своего контента (для accountability)
- Например, если родитель не доверяет себе в стрессовых ситуациях

**5. Enterprise accounts:**
- Школы могут требовать модерации контента от учителей детям (institutional policy)

**Default:** родительский контент не модерируется, доставка instant.

---

## 7. Прозрачность и отчётность

### 7.1 Transparency Report (публичный отчёт)

**Публикуется:** ежеквартально

**Содержит:**
- Общее количество контента модерировано
- Breakdown по категориям (adult, violence, hate, etc.)
- False positive/negative rates (aggregated)
- Average moderation time
- Appeals: количество, approval rate
- Account freezes и bans: количество, причины
- Law enforcement requests: количество (без деталей)

**Цель:**
- Показать родителям, что модерация работает
- Accountability
- Trust building

### 7.2 Parental Dashboard: Moderation History

**Функции:**
- Родители видят историю модерации контента их ребёнка
- Заблокированный контент: когда, почему (general category)
- Appeals: статус
- Настройки модерации: current level, можно изменить

**Privacy:**
- Детали заблокированного контента не показываются (чтобы не traumatize родителей)
- Только категория и timestamp

### 7.3 Communication с родителями

**Notifications:**
- Push/email при блокировке контента
- Explanation: "Контент не прошёл модерацию из-за [CATEGORY]"
- Action: "Вы можете обжаловать решение"

**Tone:**
- Понятный, не judgmental
- Объяснение, почему это важно для безопасности
- Support contact если questions

---

## 8. Continuous Improvement

### 8.1 ML Model Feedback Loop

**Процесс:**
1. Решения ручных модераторов логируются
2. Feedback отправляется в ML pipeline
3. Модели переобучаются (re-training) ежемесячно
4. A/B тестирование новых моделей перед production rollout

**Метрики:**
- Accuracy improvement over time
- False positive/negative rate снижение
- Автоматизация rate (% контента, который не требует ручной проверки)

### 8.2 Moderation Quality Assurance

**Процесс:**
- Random sampling 10% решений модераторов
- Review senior модератором или QA team
- Feedback модераторам для улучшения
- Retraining модераторов при необходимости

**Метрики:**
- Inter-rater reliability (согласие между модераторами)
- Error rate по модераторам
- Average review time

### 8.3 Policy Updates

**Периодичность:**
- Review policy ежеквартально
- Updates при необходимости (новые threat types, regulatory changes)

**Process:**
- Internal review
- **ТРЕБУЕТ ЮРИСТА:** legal review изменений
- Communication к пользователям (email, in-app notification)
- Effective date (30 days notice для major changes)

---

## 9. Regulatory Compliance

### 9.1 COPPA (Children's Online Privacy Protection Act, США)

**Требования:**
- Verifiable parental consent перед сбором данных детей
- Disclosure, что собираем и как используем
- Parental access к данным детей
- Data retention minimization

**Compliance:**
- ✅ Parental consent flow implemented
- ✅ Privacy Policy с COPPA disclosures
- ✅ Parental dashboard для доступа к данным
- ✅ Deletion mechanism

### 9.2 GDPR (General Data Protection Regulation, EU)

**Требования для детей (< 16 лет в EU):**
- Parental consent required
- Right to access, rectification, erasure
- Data minimization
- Privacy by design

**Compliance:**
- ✅ GDPR consent management
- ✅ Right to deletion
- ✅ Data export functionality
- ✅ DPO appointed (если требуется)

### 9.3 UK Age Appropriate Design Code

**Требования:**
- High privacy settings by default для детей
- Minimal data collection
- No profiling или targeted ads для детей
- Transparent privacy info

**Compliance:**
- ✅ Privacy by default
- ✅ Нет ads на платформе
- ✅ Minimal data collection

**ТРЕБУЕТ ЮРИСТА:** Полный compliance audit перед launch в UK.

---

## 10. Примечания и рекомендации

**ТРЕБУЕТ ЮРИСТА в следующих разделах:**
- Определения запрещённого контента (legal liability)
- Reporting obligations (CSAM, terrorism)
- Appeals process (due process requirements)
- International compliance (GDPR, COPPA, Age Appropriate Design Code)
- Terms of Service integration
- Liability limitations

**Рекомендации:**
1. **Legal review обязателен** перед публикацией политики
2. **Regular updates** политики (quarterly review)
3. **Transparency** с родителями (clear communication)
4. **Continuous improvement** модерации (ML + human)
5. **Training модераторов** (регулярное повышение квалификации)

**Контакты для вопросов:**
- Legal: [LEGAL_EMAIL]
- Moderation: [MODERATION_EMAIL]
- Support: [SUPPORT_EMAIL]

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0 (DRAFT)  
**Статус:** ТРЕБУЕТ ЮРИСТА  
**Контакт:** [FOUNDERS_EMAIL]
