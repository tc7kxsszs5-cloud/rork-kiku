# Rork-Kiku: Pitch Deck

## Структура презентации (12-15 слайдов)

---

## Слайд 1: Титульный

**Rork-Kiku**
*Безопасная платформа обмена контентом для детей*

- **Tagline**: "Защищённое цифровое пространство для детей с AI-модерацией и родительским контролем"
- **Контакты**: [FOUNDERS_EMAIL]
- **Раунд**: Pre-Seed / Seed
- **Дата**: Январь 2026

---

## Слайд 2: Проблема

### Дети в интернете сталкиваются с рисками:

**Статистика:**
- **95%** детей 6-12 лет используют мобильные устройства (Россия, 2025)
- **73%** родителей беспокоятся о безопасности детей онлайн
- **60%** детей сталкивались с неприемлемым контентом
- **$10+ млрд** глобальный рынок parental control software

**Ключевые проблемы:**

1. **Неконтролируемый доступ к контенту**
   - YouTube, TikTok, Instagram не предназначены для детей 6-12
   - Алгоритмы рекомендаций могут показывать неприемлемый контент
   - Ограниченный родительский контроль

2. **Социальное давление и буллинг**
   - Дети хотят делиться контентом, как взрослые
   - Открытые соцсети создают риски
   - Cyberbullying и harassment

3. **Недостаточная защита данных**
   - COPPA/GDPR требования сложны для соблюдения
   - Детские данные особенно чувствительны
   - Родители не доверяют большим платформам

4. **Модерация контента не эффективна**
   - Ручная модерация дорогая и медленная
   - Автоматические фильтры пропускают вредный контент
   - Нет специализированных решений для детей

---

## Слайд 3: Решение

### Rork-Kiku: Безопасная платформа с AI-модерацией

**Что мы делаем:**

1. **AI-powered модерация контента**
   - Машинное обучение для автоматической фильтрации
   - Обнаружение неприемлемого контента в реальном времени
   - Continuous learning от модераторов

2. **Родительский контроль**
   - Три уровня фильтрации (жёсткая/умеренная/мягкая)
   - Полная прозрачность: родители видят весь контент ребёнка
   - Настройки под каждый профиль ребёнка

3. **Закрытая экосистема**
   - Обмен контентом только внутри семьи (MVP)
   - Контролируемое расширение: friends, школьные группы (v2)
   - Никакой рекламы, никаких алгоритмов engagement

4. **Privacy-first подход**
   - COPPA/GDPR compliant
   - End-to-end encryption (roadmap)
   - Parental consent и верификация

**Ключевое отличие**: Мы не социальная сеть. Мы инструмент для родителей, чтобы дать детям безопасное цифровое пространство.

---

## Слайд 4: Продукт

### Mobile-first платформа (iOS → Android)

**Для родителей:**
- Регистрация и создание профилей детей
- Настройка уровней фильтрации
- Мониторинг активности и контента
- Уведомления о модерации
- Web dashboard для детальной аналитики

**Для детей:**
- Простой интерфейс для загрузки фото/видео
- Просмотр одобренного контента
- Безопасное пространство для самовыражения
- (v2) Обмен с друзьями внутри платформы

**AI-модерация:**
- Computer Vision для обнаружения неприемлемого контента
- Классификация: насилие, sexual content, PII, буллинг
- Автоматическая блокировка высокорискового контента
- Ручная модерация для borderline cases

**Архитектура:**
- React Native (iOS/Android)
- tRPC для type-safe API
- Kubernetes для микросервисов
- ML models на GPU instances
- AWS/GCP для инфраструктуры

---

## Слайд 5: Рыночная возможность (TAM/SAM/SOM)

### Глобальный рынок

**TAM (Total Addressable Market): $45 млрд**
- Глобальный рынок parental control & child safety software
- Digital wellbeing & screen time management
- Family-oriented social platforms
- Методология: (Количество семей с детьми 6-12) × (Средний чек в год)
  - ~500M семей × $90/год = $45B

**SAM (Serviceable Addressable Market): $8 млрд**
- Фокус на развитые рынки: US, EU, RU, Asia-Pacific
- Семьи с высоким digital adoption и willingness to pay
- ~90M семей × $90/год = $8.1B

**SOM (Serviceable Obtainable Market): $200 млн (5 лет)**
- Реалистичный market share: 2.5% от SAM
- Консервативная цель: 2M платных пользователей к году 5
- $200M ARR

### Региональный breakdown (5 лет):

1. **Россия и СНГ** (Year 1-2)
   - 15M семей с детьми 6-12
   - Проникновение: 5% (750K families)
   - Приоритет для пилота

2. **США** (Year 2-3)
   - 30M семей
   - Проникновение: 3% (900K families)
   - High willingness to pay ($120/year)

3. **Европа** (Year 3-4)
   - 25M семей
   - Проникновение: 2% (500K families)
   - GDPR-native платформа — конкурентное преимущество

4. **Азия** (Year 4-5)
   - 150M семей (Китай, Индия, ЮВА)
   - Проникновение: 1% (1.5M families)
   - Localization и partnerships

### Market Drivers:

- **Регулирование**: COPPA, GDPR-K, UK Age Appropriate Design Code
- **Awareness**: растущая обеспокоенность родителей
- **COVID-19 эффект**: увеличение screen time детей
- **AI advancement**: делает модерацию feasible и доступной

---

## Слайд 6: Модель монетизации

### Freemium + Subscription

**Free Tier** (для привлечения пользователей)
- 1 профиль ребёнка
- Базовая автоматическая модерация
- Ограниченное хранилище (500MB)
- Ads-free (всегда)

**Premium Tier** ($9.99/месяц или $99/год)
- До 5 профилей детей
- Расширенная ML-модерация с приоритетом
- Неограниченное хранилище
- Детальная аналитика и insights
- Family sharing (до 10 детей в группе) (v2)
- Priority support

**Enterprise/School Tier** ($499-999/месяц)
- Для школ, детских учреждений, НКО
- Кастомизированные настройки модерации
- Bulk management
- White-label опционально
- Dedicated support

### Unit Economics (предположения):

**Конверсия Free → Premium:**
- Year 1: 10% (консервативно)
- Year 3: 20%
- Year 5: 25%

**Customer Acquisition Cost (CAC):**
- Year 1-2: $50 (paid marketing, partnerships)
- Year 3+: $30 (organic growth, referrals)

**Lifetime Value (LTV):**
- Average subscription length: 3 года
- Annual churn: 25% (Year 1), 20% (Year 3+)
- LTV = $99/year × 3 years = $297
- LTV/CAC = 6-10x (healthy)

**Revenue projections (5 years):**
- Year 1: $500K (5K paid users)
- Year 2: $5M (50K paid users)
- Year 3: $20M (200K paid users)
- Year 4: $60M (600K paid users)
- Year 5: $150M (1.5M paid users)

### Дополнительные revenue streams (future):

- **B2B partnerships**: с операторами связи (bundle parental control)
- **Insurance partnerships**: discount на family insurance
- **Educational content**: платные курсы для родителей о digital safety
- **API access**: для сторонних разработчиков (privacy-compliant)

---

## Слайд 7: Конкуренты

### Конкурентный ландшафт

**Категория 1: Parental Control Apps**
- **Qustodio, Norton Family, Kaspersky Safe Kids**
- **Фокус**: блокировка сайтов, screen time, monitoring
- **Минусы**: нет собственной платформы, reactive (не proactive), not social

**Категория 2: "Kid-safe" Social Platforms**
- **YouTube Kids, Messenger Kids (Meta)**
- **Фокус**: контент от creators, messaging
- **Минусы**: алгоритмы engagement, ads/monetization focus, data concerns

**Категория 3: Educational Platforms**
- **Khan Academy Kids, Epic!**
- **Фокус**: образовательный контент
- **Минусы**: не для user-generated content, нет social компонента

**Категория 4: Family Sharing Apps**
- **FamilyAlbum, Tinybeans**
- **Фокус**: семейные фото, журналы
- **Минусы**: нет модерации, нет focus на безопасность, limited для детей

### Rork-Kiku Differentiation:

| Feature | Rork-Kiku | YouTube Kids | Qustodio | FamilyAlbum |
|---------|-----------|--------------|----------|-------------|
| AI Модерация | ✅ Специализированная | ⚠️ Generic | ❌ | ❌ |
| User-generated content | ✅ | ⚠️ От creators | ❌ | ✅ |
| Родительский контроль | ✅ Granular | ⚠️ Limited | ✅ | ⚠️ Limited |
| Privacy-first | ✅ | ❌ | ⚠️ | ⚠️ |
| Возраст фокус | 6-12 | 3-8 | All ages | All ages |
| Социальный компонент | ✅ (controlled) | ❌ | ❌ | ⚠️ Family only |
| COPPA/GDPR native | ✅ | ⚠️ | ✅ | ⚠️ |

**Ключевое преимущество**: Единственная платформа, которая сочетает user-generated content, AI-модерацию и родительский контроль специально для детей 6-12 лет.

### Barriers to Entry:

1. **ML expertise**: нужна специализированная модель для детского контента
2. **Regulatory compliance**: COPPA, GDPR сложны и дороги
3. **Trust**: родители не доверят новичкам без track record
4. **Network effects**: чем больше пользователей, тем лучше ML модель

---

## Слайд 8: Go-to-Market стратегия

### Phase 1: Пилот в России (Months 1-6)

**Target**: 50-100 семей в Москве
**Channels**:
- Партнёрства с детскими садами, школами
- Родительские форумы и сообщества
- Influencer partnerships (parenting bloggers)

**Goals**:
- Validate product-market fit
- Collect feedback для улучшений
- Refine ML модели на реальных данных
- NPS 40+

### Phase 2: Россия rollout (Months 7-18)

**Target**: 10-50K families
**Channels**:
- Performance marketing (VK, Yandex, Google)
- Content marketing (блог о digital parenting)
- PR в медиа (Forbes, РБК, Медуза)
- Partnerships с телеком операторами

**Goals**:
- Reach 50K registered users
- 10K paid subscribers
- Product refinements на базе feedback

### Phase 3: US/EU expansion (Months 19-36)

**Target**: 100-500K families
**Channels**:
- App Store optimization
- Facebook/Instagram ads (targeting parents)
- Partnerships со школами, PTA organizations
- PR в US/EU media (TechCrunch, The Verge, Wired)

**Goals**:
- Establish presence в US (California, NY, Texas)
- EU early adopters (UK, Germany, Netherlands)
- 200K paid subscribers

### Phase 4: Asia & Global (Months 37-60)

**Target**: 1-2M families
**Channels**:
- Localization (Chinese, Japanese, Korean, Hindi)
- Regional partnerships
- Global PR push

**Goals**:
- 1.5M paid subscribers globally
- Dominant player в child safety space

### Key Partnerships:

1. **Schools & Educational institutions**
   - Pilot programs, bulk subscriptions
   - Trust & credibility

2. **Telecom operators**
   - Bundle with family plans
   - Distribution channel

3. **Children's organizations & NGOs**
   - Co-branding, thought leadership
   - Social impact

4. **Parenting influencers**
   - Authenticity, word-of-mouth

---

## Слайд 9: Roadmap (24 месяца)

### Q1 2026: PoC & Foundations
- ✅ Backend infrastructure setup
- ✅ ML model training начат
- ✅ iOS app prototype
- ✅ Core team hired

### Q2 2026: MVP Development
- MVP iOS app (TestFlight)
- Basic AI moderation
- Parent & child profiles
- Content upload/viewing

### Q3 2026: Pilot Launch
- 50-100 families в Москве
- Feedback collection
- ML model refinement
- Security audit

### Q4 2026: Pre-Seed/Seed Round
- Fundraising: $1-2M
- Team expansion (eng, product)
- Marketing ramp-up
- Android app development

### Q1 2027: Russia Rollout
- Public launch в России
- Performance marketing
- 10K registered users
- PR campaign

### Q2 2027: Product Iteration
- V2 features: friends, groups
- Advanced ML модели
- Web dashboard для родителей
- Analytics & insights

### Q3 2027: US/EU Soft Launch
- English localization
- US pilot (100 families)
- EU pilot (100 families)
- Regulatory compliance audit

### Q4 2027: Series A Preparation
- 50K+ registered users
- 10K+ paid subscribers
- Strong retention metrics
- Fundraising materials

### Q1 2028: Series A & Scale
- Raise $10-15M
- Aggressive US/EU expansion
- Team to 50+ people
- Enterprise/School tier

### Q2 2028 & beyond:
- Global expansion
- New features (educational content, etc.)
- Potential acquisitions
- Path to profitability

---

## Слайд 10: Команда

### Founders (placeholder — заполнить реальными данными)

**[Founder 1 Name] — CEO/Co-founder**
- Background: [Previous experience, education]
- Expertise: Product, Business Development
- Why Rork-Kiku: [Personal motivation]

**[Founder 2 Name] — CTO/Co-founder**
- Background: [Previous experience, education]
- Expertise: Engineering, ML
- Why Rork-Kiku: [Personal motivation]

### Early Team (to be hired)

**Product Lead**
- 5+ years experience в mobile apps
- Специализация: UX для детей

**Backend Engineer**
- Expert в микросервисах, Kubernetes
- Security-first mindset

**ML Engineer**
- PhD/Masters в Computer Vision
- Experience с content moderation

**Mobile Developer (iOS)**
- Senior iOS dev, React Native
- Published apps в App Store

**Marketing/Growth Lead**
- B2C growth experience
- Performance marketing expertise

### Advisors (to be recruited)

**Child Safety Expert**
- Background в child psychology или advocacy
- Credential для PR

**Legal/Compliance Advisor**
- Expert в COPPA, GDPR
- Опыт с детскими продуктами

**Tech/Product Advisor**
- Previous founder or exec в tech
- Network & guidance

---

## Слайд 11: Финансовые проекции

### Revenue Forecast (5 years, $USD)

| Year | Users (Total) | Paid Users | ARR | Growth YoY |
|------|---------------|------------|-----|------------|
| 2026 | 5,000 | 500 | $50K | - |
| 2027 | 50,000 | 5,000 | $500K | 900% |
| 2028 | 200,000 | 20,000 | $2M | 300% |
| 2029 | 800,000 | 100,000 | $10M | 400% |
| 2030 | 2,500,000 | 500,000 | $50M | 400% |

**Assumptions:**
- Average subscription: $99/year
- Free → Paid conversion: 10% (Year 1) → 20% (Year 5)
- Annual churn: 25% → 20%

### Cost Structure

**Year 1-2 (Pre-Seed/Seed):**
- Team: 60% ($400K - salaries для 5-8 人)
- Infrastructure: 15% ($100K - AWS, tools)
- Marketing: 15% ($100K - ads, partnerships)
- Other: 10% ($66K - legal, office, misc)
- Total: ~$666K/year

**Year 3+ (Series A):**
- Team: 50% ($5M - 40-50 people)
- Marketing: 30% ($3M - scaling growth)
- Infrastructure: 10% ($1M - ML, storage)
- R&D: 5% ($500K - new features)
- Other: 5% ($500K)
- Total: ~$10M/year

### Path to Profitability

- **Break-even**: Year 4-5
- **Positive EBITDA**: Year 5
- Focus на growth, not profitability в первые 3-4 года

---

## Слайд 12: Привлечение средств

### Round: Pre-Seed / Seed

**Asking Amount**: $1-2M USD (или эквивалент в RUB)

**Valuation**: $5-8M pre-money (negotiable)

**Structure**: Equity or SAFE

### Use of Funds (18-24 месяца runway)

**Team (50% - $500K-1M)**
- Hire 5-8 ключевых людей:
  - CTO, Product Lead, Backend Eng, ML Eng, iOS Dev
- Competitive salaries для удержания talent

**Product Development (25% - $250K-500K)**
- MVP completion
- ML model training & refinement
- Security audits
- Testing & QA

**Infrastructure (10% - $100K-200K)**
- AWS/GCP credits
- GPU instances для ML
- Database, storage, CDN
- Development tools

**Marketing & Growth (10% - $100K-200K)**
- Pilot recruitment
- Early user acquisition
- PR & content
- Partnership development

**Legal & Compliance (5% - $50K-100K)**
- COPPA/GDPR compliance
- Privacy policy, ToS
- Corporate structure
- IP protection

### Milestones (с этим раундом)

**6 месяцев:**
- MVP launch на TestFlight
- 50-100 pilot users
- Core team assembled

**12 месяцев:**
- Public launch в России
- 10K registered users
- 1K paid subscribers
- Positive user feedback (NPS 40+)

**18 месяцев:**
- 50K registered users
- 5K+ paid subscribers
- Android app в бета
- Готовность к US/EU expansion

**24 месяца:**
- Series A ready:
  - 100K+ users
  - 10K+ paid ($1M ARR)
  - Strong retention
  - Validated в multiple markets

### Investor Ask

**What we're looking for:**
- Strategic investor с experience в consumer apps, child safety, или edtech
- Network & connections для partnerships (schools, NGOs, etc.)
- Hands-off approach, trust в команду
- Long-term vision (5-7 years)

**Contact**: [FOUNDERS_EMAIL]

---

## Слайд 13: Traction & Validation (опционально — если есть)

### Current Status

**Product:**
- ✅ Architecture designed
- ✅ Tech stack selected
- 🚧 MVP в разработке

**Team:**
- ✅ 2 co-founders
- 🚧 Recruiting key hires

**Market Research:**
- ✅ 50+ parent interviews
- ✅ Competitive analysis
- ✅ Regulatory research

**Pilots & Partnerships:**
- 🚧 In talks с 2 школами для пилота
- 🚧 Partnership discussions с НКО

**Funding:**
- ✅ Bootstrapped до сих пор
- 🚧 Seeking Pre-Seed/Seed

---

## Слайд 14: Риски и митигация

### Key Risks

**1. Regulatory Risk**
- **Risk**: Изменения в COPPA, GDPR могут потребовать значительных изменений
- **Mitigation**: Legal advisor, compliance-first design, active monitoring законодательства

**2. User Acquisition Cost**
- **Risk**: CAC может быть высоким, особенно для нишевого продукта
- **Mitigation**: Partnerships с школами для organic growth, word-of-mouth, community building

**3. ML Model Accuracy**
- **Risk**: False positives/negatives могут frustate пользователей
- **Mitigation**: Conservative thresholds, continuous learning, manual moderation fallback

**4. Competition**
- **Risk**: Большие игроки (Meta, Google) могут скопировать
- **Mitigation**: First-mover advantage, специализация, trust & privacy focus, network effects

**5. Market Adoption**
- **Risk**: Родители могут не be willing to pay
- **Mitigation**: Freemium модель, clear value proposition, strong ROI on safety

**6. Operational Scale**
- **Risk**: Модерация может не scale по мере роста
- **Mitigation**: Invest в ML, hire moderation team, automated workflows

---

## Слайд 15: Closing & Call to Action

### Vision

**"Создать безопасное цифровое пространство для миллионов детей по всему миру."**

Rork-Kiku стремится стать глобальным стандартом безопасности для детского контента онлайн.

### Why Now?

- **Perfect timing**: AI делает автоматическую модерацию feasible
- **Market need**: родители desperately ищут решения
- **Regulatory tailwinds**: законы поддерживают child safety
- **COVID legacy**: дети проводят больше времени онлайн

### Ask

**Мы ищем $1-2M для запуска и масштабирования.**

**Next Steps:**
1. **Schedule call**: обсудить детали, ответить на вопросы
2. **Due diligence**: предоставим data room access
3. **Term sheet**: обсудим условия
4. **Let's build**: создадим что-то великое вместе

**Contact**: [FOUNDERS_EMAIL]

---

## Appendix (дополнительные слайды для Q&A)

### Appendix A: Detailed Financial Model
- См. `docs/finance/financial_model.csv` и `financial_model_overview.md`

### Appendix B: Technical Architecture
- См. `docs/architecture/architecture.md`

### Appendix C: Go-to-Market Details
- См. `docs/pilot/pilot_plan.md`

### Appendix D: Competitive Analysis Deep Dive
- Feature comparison table
- Market positioning

### Appendix E: ML Model Details
- Модель архитектура
- Training data strategy
- Performance metrics

### Appendix F: Legal & Compliance
- COPPA compliance checklist
- GDPR compliance checklist
- Privacy policy draft
- Terms of Service draft

---

**Примечание**: Этот pitch deck является шаблоном. Все цифры, проекции и контакты должны быть заполнены реальными данными. [FOUNDERS_EMAIL] — placeholder для контактной информации основателей.

**Инструкция по использованию**: Экспортируйте в PowerPoint/Keynote/Google Slides, добавьте брендинг, визуалы и реальные данные команды. Не добавляйте конфиденциальную информацию в публичные репозитории.
