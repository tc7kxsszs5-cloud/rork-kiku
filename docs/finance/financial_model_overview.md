# Финансовая модель kiku - Обзор

## Введение

Данный документ описывает финансовую модель проекта kiku на горизонте 3 лет (2026-2028). Модель построена на основе unit economics, предположений о росте пользовательской базы и операционных расходах.

**Цель модели:** Спрогнозировать финансовые показатели (revenue, costs, EBITDA, cash flow) для трёх сценариев: консервативного, базового и оптимистичного.

## Три сценария прогнозирования

### Сценарий 1: Консервативный (Conservative)

**Описание:** Медленный рост, сложности с product-market fit, высокий churn, более высокий CAC.

**Ключевые предположения:**
- **User growth:** 3,000 paying users (Year 1) → 15,000 (Year 2) → 50,000 (Year 3)
- **ARPU:** $15/month (средний между Basic и Premium)
- **CAC:** $40 (Year 1) → $35 (Year 2) → $30 (Year 3)
- **Churn rate:** 30% annually
- **Conversion rate (free → paid):** 5%
- **Organic growth:** 40% пользователей
- **Paid acquisition:** 50% пользователей
- **Referrals:** 10% пользователей

**Финансовые показатели:**

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| Paying Users (EOY) | 3,000 | 15,000 | 50,000 |
| MRR (EOY) | $45K | $225K | $750K |
| ARR (EOY) | $540K | $2.7M | $9M |
| Revenue | $270K | $1.62M | $5.85M |
| Gross Profit (75% margin) | $202K | $1.22M | $4.39M |
| Operating Expenses | $650K | $1.5M | $3.5M |
| EBITDA | -$448K | -$280K | $890K |
| Cumulative Cash Burn | -$500K | -$850K | -$200K |

**Выводы:**
- Профитабельность достигается только к концу Year 3
- Потребуется дополнительный fundraising в Year 2
- High risk, но реалистичный сценарий при медленном старте

---

### Сценарий 2: Базовый (Base Case) — Основной прогноз

**Описание:** Реалистичный сценарий с умеренным ростом, успешный product-market fit, industry-average churn.

**Ключевые предположения:**
- **User growth:** 5,000 paying users (Year 1) → 30,000 (Year 2) → 100,000 (Year 3)
- **ARPU:** $19.99/month (Premium plan средний)
- **CAC:** $30 (Year 1) → $25 (Year 2) → $20 (Year 3) — снижение за счёт organic growth
- **Churn rate:** 20% annually (industry average для subscription apps)
- **Conversion rate (free → paid):** 10%
- **Organic growth:** 50% пользователей
- **Paid acquisition:** 30% пользователей
- **Referrals:** 20% пользователей

**Финансовые показатели:**

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| Paying Users (EOY) | 5,000 | 30,000 | 100,000 |
| MRR (EOY) | $100K | $600K | $2M |
| ARR (EOY) | $1.2M | $7.2M | $24M |
| Revenue | $600K | $4.2M | $15.6M |
| Gross Profit (75% margin) | $450K | $3.15M | $11.7M |
| Operating Expenses | $800K | $2M | $5M |
| EBITDA | -$350K | $1.15M | $6.7M |
| Cumulative Cash Burn | -$400K | $350K | $7.05M |

**Драйверы роста:**
- Successful pilot → positive word-of-mouth
- Эффективный контент-маркетинг и SEO
- Partnerships с школами и НКО
- Referral program (viral coefficient 1.2x)

**Выводы:**
- Cash flow positive к середине Year 2
- Profitable к концу Year 2
- Runway от Seed раунда ($500K-$1M) достаточно до Series A
- **Это основной сценарий для pitch инвесторам**

---

### Сценарий 3: Оптимистичный (Optimistic)

**Описание:** Быстрый рост, viral adoption, низкий churn, сильные partnerships.

**Ключевые предположения:**
- **User growth:** 10,000 paying users (Year 1) → 60,000 (Year 2) → 200,000 (Year 3)
- **ARPU:** $24/month (больше Premium и Family plans)
- **CAC:** $25 (Year 1) → $18 (Year 2) → $15 (Year 3) — strong organic growth
- **Churn rate:** 15% annually (best-in-class)
- **Conversion rate (free → paid):** 15%
- **Organic growth:** 60% пользователей
- **Paid acquisition:** 20% пользователей
- **Referrals:** 20% пользователей
- **B2B revenue:** Starting Year 2 (schools, partnerships)

**Финансовые показатели:**

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| Paying Users (EOY) | 10,000 | 60,000 | 200,000 |
| MRR (EOY) | $240K | $1.44M | $4.8M |
| ARR (EOY) | $2.88M | $17.28M | $57.6M |
| Revenue | $1.44M | $10.36M | $37.44M |
| Gross Profit (78% margin) | $1.12M | $8.08M | $29.2M |
| Operating Expenses | $1M | $3M | $8M |
| EBITDA | $120K | $5.08M | $21.2M |
| Cumulative Cash Burn | -$200K | $4.68M | $25.88M |

**Драйверы роста:**
- Viral adoption (NPS > 70)
- Major media coverage и PR wins
- Early B2B success (школы, страховые)
- Expansion в US market раньше запланированного

**Выводы:**
- Profitable с Year 1
- Series A будет oversubscribed
- Возможна быстрая экспансия и acquisition interest от Big Tech

---

## Ключевые драйверы затрат

### 1. Team Costs (50-60% от OpEx)

**Year 1 (5-7 человек):**
- 2 Engineers (Backend/Mobile): $150K/year each = $300K
- 1 ML Engineer: $180K/year
- 1 Product Manager: $120K/year
- 1 Marketing Lead: $100K/year
- Founders (minimal salaries): $50K/year each = $100K
- **Total:** ~$850K

**Year 2 (15-20 человек):**
- Engineering team: 6 engineers × $150K = $900K
- ML team: 2 ML engineers × $180K = $360K
- Product: 2 PMs × $120K = $240K
- Marketing: 3 marketers × $100K = $300K
- Operations: 2 ops × $80K = $160K
- Founders: $100K each × 2 = $200K
- **Total:** ~$2.16M

**Year 3 (30-40 человек):**
- Scale team пропорционально росту
- **Total:** ~$4M-5M

### 2. Infrastructure Costs (10-15% от OpEx)

**Компоненты:**
- **Cloud compute** (AWS EKS): $3K-10K/month в зависимости от traffic
- **Database** (RDS PostgreSQL + Redis): $1K-3K/month
- **Storage** (S3): $500-2K/month
- **ML APIs** (OpenAI, AWS Rekognition): $2K-10K/month в зависимости от объёма
- **CDN** (CloudFront): $500-2K/month
- **Monitoring** (Datadog, Sentry): $500/month

**Итого:**
- Year 1: ~$10K/month = $120K/year
- Year 2: ~$25K/month = $300K/year (рост пользователей)
- Year 3: ~$60K/month = $720K/year

### 3. ML Costs (5-10% от OpEx)

**Year 1 (External APIs):**
- OpenAI API (GPT-4 для анализа текста): $100-200/month
- AWS Rekognition (анализ изображений): $50-100/month
- Whisper API (транскрипция аудио): $50/month
- **Total:** ~$2.5K/month = $30K/year

**Year 2 (Hybrid):**
- External APIs + начало self-hosted models
- Training data acquisition: $50K
- GPU instances для inference: $5K/month = $60K/year
- **Total:** ~$150K/year

**Year 3 (Mostly self-hosted):**
- Self-hosted ML models (снижение API costs)
- Larger GPU clusters: $15K/month = $180K/year
- Continuous training и fine-tuning: $100K/year
- **Total:** ~$280K/year

### 4. Moderation Costs (5-10% от OpEx)

**Ручная модерация для edge cases:**
- Year 1: 1 part-time moderator (contractor) = $30K/year
- Year 2: 2 full-time moderators = $120K/year
- Year 3: 5 moderators + 1 lead = $450K/year

### 5. Marketing Costs (20-30% от OpEx)

**Year 1 (Pilot & Beta):**
- Paid ads (Facebook, Instagram, Google): $50K
- Content marketing (blog, SEO): $20K
- PR и media: $20K
- Events & partnerships: $10K
- **Total:** ~$100K

**Year 2 (Public Launch):**
- Paid ads: $300K
- Content marketing: $80K
- PR: $50K
- Influencer marketing: $50K
- Partnerships (schools, НКО): $40K
- **Total:** ~$520K

**Year 3 (Scale):**
- Paid ads: $800K
- Content marketing: $150K
- PR: $100K
- Influencer marketing: $150K
- Partnerships: $100K
- **Total:** ~$1.3M

### 6. Operations & Compliance (5-10% от OpEx)

**Компоненты:**
- Legal fees (COPPA/GDPR compliance): $30K-50K/year
- Accounting & bookkeeping: $10K-20K/year
- Insurance (cyber, liability): $15K-30K/year
- Tools & software (GitHub, Slack, etc.): $10K-20K/year
- Office/coworking space: $20K-50K/year

**Итого:**
- Year 1: ~$100K
- Year 2: ~$150K
- Year 3: ~$250K

---

## Ключевые драйверы доходов

### 1. User Growth

**Acquisition channels:**
- **Organic:** SEO, content marketing, word-of-mouth (50-60% пользователей)
- **Paid:** Facebook, Instagram, Google Ads (20-30%)
- **Referrals:** Viral referral program (15-20%)
- **Partnerships:** Школы, НКО, telecom operators (5-10% в Year 2-3)

**Conversion funnel:**
- Website visitors → App downloads: 10-15%
- Downloads → Sign-ups: 50-60%
- Sign-ups → Активные пользователи (free): 40-50%
- Free → Paid: 5-15% (зависит от сценария)

### 2. ARPU Increase

**Стратегии роста ARPU:**
- **Upsell:** Free → Basic → Premium → Family
- **Add-ons:** Дополнительные детские профили, extended storage
- **Annual plans:** Discount за годовую подписку (экономия для клиента, но prepaid revenue для нас)
- **B2B contracts:** Higher ARPU от школ и корпоративных клиентов

**Прогноз ARPU:**
- Year 1: $15-20/month (mostly Basic & Premium)
- Year 2: $20-22/month (больше Premium & Family)
- Year 3: $22-25/month (B2B + более дорогие планы)

### 3. B2B Revenue

**B2B сегменты (starting Year 2):**
- **Школы:** $5/student/year, целевая аудитория — 1000 schools × 500 students = 500K students
  - Реалистичная penetration: 1% в Year 2, 3% в Year 3
  - Revenue: $25K (Year 2) → $75K (Year 3)
- **Страховые компании:** Bundle с family insurance, $50K-100K/year per partner
  - 1-2 partners в Year 3 = $100K-200K
- **Telecom operators:** White-label, revenue share model, $200K-500K/year
  - 1 partner в Year 3 = $300K

**B2B contribution к revenue:**
- Year 2: ~5% ($200K)
- Year 3: ~10-15% ($1.5M-2M)

---

## Чувствительность модели (Sensitivity Analysis)

**Ключевые переменные, влияющие на финансовые результаты:**

### 1. CAC (Customer Acquisition Cost)
- **Impact:** Если CAC увеличивается на 50% → EBITDA снижается на 30-40%
- **Mitigation:** Фокус на organic growth, referral program, content marketing

### 2. Churn Rate
- **Impact:** Если churn увеличивается с 20% до 30% → LTV снижается на 40%
- **Mitigation:** Improve product stickiness, customer success team, loyalty programs

### 3. Conversion Rate (Free → Paid)
- **Impact:** Если conversion снижается с 10% до 5% → revenue падает на 50%
- **Mitigation:** A/B testing onboarding, trial optimizations, value proposition clarity

### 4. ARPU
- **Impact:** Если ARPU снижается с $20 до $15 → revenue падает на 25%
- **Mitigation:** Upsell campaigns, feature differentiation, annual plans

### 5. ML/Infrastructure Costs
- **Impact:** Если costs увеличиваются на 2x → gross margin снижается с 75% до 65%
- **Mitigation:** Self-hosted ML models, optimization, better caching

---

## Предположения и риски

### Предположения модели:

**Рыночные:**
- Parental control market продолжает расти (12% CAGR)
- Родители готовы платить за AI-powered решения
- No major regulatory changes (COPPA/GDPR остаются стабильными)

**Продуктовые:**
- Product-market fit достигается к концу Year 1
- ML accuracy улучшается с ростом данных
- No major technical issues (downtime, data breaches)

**Операционные:**
- Успешный hiring (нет проблем с поиском talent)
- Retention founders и ключевых сотрудников
- No major competitive threats (новые игроки, Big Tech entering market)

### Риски и mitigation:

**Риск 1: Медленный user growth**
- **Причины:** Poor product-market fit, high CAC, strong competition
- **Mitigation:** Pivot strategy, focus on niche segment, partnerships

**Риск 2: Регуляторные изменения**
- **Причины:** Новые законы (например, полный запрет мониторинга детей)
- **Mitigation:** Legal advisory, compliance-first approach, lobby efforts

**Риск 3: Technical failures**
- **Причины:** ML models not accurate, infrastructure issues, data breach
- **Mitigation:** Strong engineering team, security audits, backup plans

**Риск 4: Competitive pressure**
- **Причины:** Big Tech (Apple, Google) launching similar features
- **Mitigation:** Focus on niche, differentiation через superior AI, partnerships

---

## Выводы и рекомендации

**Рекомендуемый сценарий для планирования:** Базовый (Base Case)

**Runway планирование:**
- Seed раунд $500K-$1M должен обеспечить 12-18 месяцев runway
- Series A ($5-10M) необходим в Q4 2026 - Q1 2027 для масштабирования
- Break-even достигается к концу Year 2 в базовом сценарии

**Action items:**
1. Детально отслеживать unit economics (CAC, LTV, churn) с первого дня
2. Фокусироваться на organic growth для снижения CAC
3. Постоянно улучшать ML accuracy для снижения false positives (churn driver)
4. Готовить B2B offering для диверсификации revenue streams
5. Планировать Series A раунд заранее (6-9 месяцев lead time)

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Finance Team  
**Статус:** Draft — требуется review CFO и board
