# Финансовая модель — Обзор

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT — требует CFO review
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Введение

Данный документ описывает финансовую модель для Rork-Kiku на горизонте 5 лет (2026-2030). Модель включает три сценария:
1. **Консервативный** — медленный рост, низкая конверсия
2. **Базовый** — реалистичный рост, средняя конверсия (наш основной сценарий)
3. **Оптимистичный** — быстрый рост, высокая конверсия

Детальные числа см. в `financial_model.csv`.

---

## 2. Ключевые Предпосылки

### 2.1. Пользовательские метрики

| Метрика | Консервативный | Базовый | Оптимистичный |
|---------|----------------|---------|---------------|
| **Conversion Free → Paid** | 5% | 10% | 15% |
| **ARPU (Average Revenue Per User)** | $40/year | $50/year | $60/year |
| **Retention (12 months)** | 60% | 70% | 80% |
| **CAC (Customer Acquisition Cost)** | $40 | $30 | $25 |
| **Churn rate (annual)** | 40% | 30% | 20% |

### 2.2. Рост пользовательской базы

**Базовый сценарий**:
- **Year 1 (2026)**: 5K total users, 500 paying → $25K ARR
- **Year 2 (2027)**: 50K total users, 5K paying → $250K ARR (10x)
- **Year 3 (2028)**: 200K total users, 20K paying → $1M ARR (4x)
- **Year 4 (2029)**: 500K total users, 50K paying → $2.6M ARR (2.6x)
- **Year 5 (2030)**: 1M total users, 120K paying → $6.6M ARR (2.5x)

**Факторы роста**:
- Organic (word of mouth): 30-40%
- Paid marketing: 40-50%
- Partnerships (schools, NGOs): 10-20%
- Referrals: 5-10%

### 2.3. Pricing Strategy

**Tier pricing**:
- **Free**: $0 (до 50 фото/месяц, 1 ребёнок)
- **Premium**: $4.99/month ($49.99/year при годовой подписке, 17% discount)
- **Family**: $9.99/month ($99.99/year при годовой подписке)

**Expected mix** (Базовый сценарий, Year 3):
- 50% на Premium plan
- 30% на Family plan
- 20% на annual plans (prepaid)

**Blended ARPU**: $50/year

---

## 3. Revenue Model

### 3.1. Subscription Revenue (Primary)

**Формула**:
```
Monthly Subscription Revenue = (Premium users * $4.99) + (Family users * $9.99)
Annual Subscription Revenue = (Annual Premium * $49.99) + (Annual Family * $99.99)

Total ARR = MRR * 12 + Annual prepaid revenue
```

**Базовый сценарий — Revenue breakdown**:
- **Year 1**: $25K ARR
- **Year 2**: $250K ARR
- **Year 3**: $1M ARR
- **Year 4**: $2.6M ARR
- **Year 5**: $6.6M ARR

### 3.2. B2B Revenue (Secondary)

**B2B partnerships** (школы, корпорации, НКО):
- **Pricing**: $3-5/user/year (volume discount от retail)
- **Target**: 10-15% от total revenue к Year 3-4
- **Estimated B2B ARR** (Year 4): $300K-400K

### 3.3. Other Revenue (Minimal)

**Data insights** (anonymized, aggregated):
- Research reports: $10K-20K/year (начиная с Year 3)
- API access for partners: $5K-10K/year
- **Total**: < 5% от revenue

---

## 4. Cost Structure

### 4.1. COGS (Cost of Goods Sold)

**Infrastructure costs** (AWS, GCP, Azure):
- **Compute**: EKS cluster, API servers, ML workers
- **Storage**: S3 для media files (original + thumbnails)
- **Database**: RDS PostgreSQL (primary + replicas)
- **CDN**: CloudFront для media delivery
- **GPU**: ML inference (T4/V100 instances)

**COGS per user** (Базовый сценарий):
- **Year 1**: $3/user (higher due to low scale)
- **Year 2-3**: $2/user
- **Year 4-5**: $1.5/user (economies of scale)

**Total COGS** (Базовый):
- Year 1: $15K
- Year 2: $100K
- Year 3: $400K
- Year 4: $750K
- Year 5: $1.5M

**Gross Margin**: 70-80% (SaaS standard)

### 4.2. OPEX (Operating Expenses)

#### Team Costs (крупнейшая статья)

**Year 1** (Seed funding, lean team):
- 3 founders: $50K each = $150K
- 2 backend engineers: $120K each = $240K
- 1 iOS engineer: $120K = $120K
- 1 ML engineer: $140K = $140K
- 1-2 part-time moderators: $30K = $30K
- **Total**: $680K

**Year 2** (expansion):
- Team of 8-10: $850K-1M
- Add: Android engineer, QA, Community Manager

**Year 3** (scale):
- Team of 12-15: $1.2M-1.5M
- Add: Sales, Marketing, more engineers

**Year 4-5** (mature):
- Team of 20-30: $2M-3M
- Full product, engineering, marketing, sales teams

#### Marketing & Sales

**Year 1**: $50K (pilot, organic focus)
**Year 2**: $150K (App Store launch, paid ads)
**Year 3**: $400K (scale marketing)
**Year 4**: $800K (multi-region, B2B sales)
**Year 5**: $1.5M (global expansion)

**CAC targets**:
- Paid channels: $30-40
- Organic/referrals: $5-10
- B2B: $10-20 (volume deals)

#### Infrastructure (Cloud)

См. COGS выше (infrastructure включён в COGS).

#### Moderation Costs

**Human moderators** (для manual review):
- **Baseline**: 1-2 part-time moderators (Year 1): $30K
- **Scale**: 5-10 full-time (Year 3-4): $300K-500K
- **Assumption**: 5-10% контента требует manual review

**ML model costs**:
- Training: $10K-20K per quarter (Year 1-2), $50K+ (Year 3+)
- Inference: Included in GPU infrastructure costs

#### Legal & Compliance

- **Year 1**: $30K (privacy lawyer, ToS/Privacy Policy, initial audits)
- **Year 2-3**: $50K/year (ongoing compliance, GDPR/COPPA audits)
- **Year 4-5**: $100K+/year (multi-region compliance, IP, contracts)

#### Other OPEX

- Office/co-working: $10K-30K/year (remote-first, minimal)
- Software/tools: $20K-50K/year (GitHub, AWS, Slack, Notion, etc.)
- Insurance: $10K-20K/year (D&O, cyber insurance)
- Travel: $10K-30K/year (conferences, partnerships)

### 4.3. Total OPEX Summary (Базовый сценарий)

| Year | Team | Marketing | Moderation | Legal | Other | Total OPEX |
|------|------|-----------|------------|-------|-------|------------|
| 2026 | $680K | $50K | $30K | $30K | $50K | $840K |
| 2027 | $900K | $150K | $100K | $50K | $60K | $1.26M |
| 2028 | $1.3M | $400K | $300K | $50K | $80K | $2.13M |
| 2029 | $2M | $800K | $500K | $100K | $100K | $3.5M |
| 2030 | $2.5M | $1.5M | $700K | $100K | $120K | $4.92M |

---

## 5. P&L Summary (Profit & Loss)

### Базовый сценарий:

| Year | Revenue | COGS | Gross Profit | OPEX | EBITDA | Margin |
|------|---------|------|--------------|------|--------|--------|
| 2026 | $25K | $15K | $10K | $840K | **-$830K** | -3320% |
| 2027 | $250K | $100K | $150K | $1.26M | **-$1.11M** | -444% |
| 2028 | $1M | $400K | $600K | $2.13M | **-$1.53M** | -153% |
| 2029 | $2.6M | $750K | $1.85M | $3.5M | **-$1.65M** | -63% |
| 2030 | $6.6M | $1.5M | $5.1M | $4.92M | **+$180K** | +3% |

**Break-even**: Year 5 (2030) в базовом сценарии.

**Оптимистичный сценарий**: Break-even в Year 3-4.

**Консервативный сценарий**: Break-even в Year 6-7 (требует дополнительное финансирование).

---

## 6. Fundraising Needs

### Seed Round (Now)
- **Amount**: $500K - $1.5M
- **Use**: Product development, initial team, pilot launch
- **Runway**: 18-24 months (до Series A)

### Series A (Year 2-3, ~2027-2028)
- **Amount**: $3M-5M
- **Use**: Scale team (15-20 people), multi-platform (Android), marketing, international expansion
- **Milestones**: $500K-1M ARR, 30K-50K users, proven unit economics

### Series B (Year 4-5, ~2029-2030)
- **Amount**: $10M-20M
- **Use**: Global expansion, B2B sales team, advanced features, M&A
- **Milestones**: $5M-10M ARR, 500K-1M users, positive unit economics

---

## 7. Unit Economics

### LTV (Lifetime Value)

**Формула**:
```
LTV = ARPU * Average lifetime (in years) * Gross margin

Базовый сценарий:
LTV = $50 * 3 years * 75% = $112.50
```

**Improved retention → higher LTV**:
- 60% retention (Conservative): LTV = $90
- 70% retention (Base): LTV = $112.50
- 80% retention (Optimistic): LTV = $150

### CAC (Customer Acquisition Cost)

**Target**: $30 (Базовый), $25 (Optimistic), $40 (Conservative)

**Channels**:
- Paid ads (Facebook, Instagram): $35-45 per user
- Organic/SEO: $5-10 per user
- Referrals: $5-8 per user (referral credit cost)
- B2B partnerships: $10-20 per user

**Blended CAC**: $30 (assuming 50% paid, 40% organic, 10% referral)

### LTV/CAC Ratio

**Target**: 3x+ (healthy), 5x (great)

**Scenarios**:
- **Conservative**: LTV $90 / CAC $40 = **2.25x** (acceptable for early stage)
- **Base**: LTV $112.50 / CAC $30 = **3.75x** (healthy)
- **Optimistic**: LTV $150 / CAC $25 = **6x** (great)

### Payback Period

**Формула**: CAC / (ARPU * Gross margin / 12)

**Base scenario**:
```
Payback = $30 / ($50 * 0.75 / 12) = $30 / $3.125 = 9.6 months
```

**Target**: < 12 months (SaaS standard)

---

## 8. Cash Flow & Burn Rate

### Burn Rate (Базовый сценарий)

**Year 1**: -$830K / 12 = ~$70K/month
**Year 2**: -$1.11M / 12 = ~$92K/month
**Year 3**: -$1.53M / 12 = ~$128K/month

**Cumulative burn** (Year 1-3): -$3.47M

**Seed funding ($1M)**: Covers ~14 months
**Series A ($4M)**: Covers до break-even (Year 5)

### Cash Flow Positive

**Optimistic**: Year 3-4
**Base**: Year 5
**Conservative**: Year 6-7 (requires bridge/extension)

---

## 9. Sensitivity Analysis

### Key Variables Impact

**If conversion drops to 7% (from 10%)**:
- ARR Year 3: $700K (вместо $1M) → -30%
- Break-even delayed by 1-2 years

**If CAC increases to $45 (from $30)**:
- LTV/CAC: 2.5x (вместо 3.75x) → still acceptable
- Need higher marketing budget or better organic growth

**If retention drops to 60% (from 70%)**:
- LTV: $90 (вместо $112.50) → -20%
- Need lower CAC or higher ARPU

**Mitigation strategies**:
- Focus on product-market fit (improve retention)
- Optimize onboarding (reduce early churn)
- Test pricing (maybe $5.99 or $6.99 for Premium)
- Expand B2B (lower CAC, higher volume)

---

## 10. Risks & Assumptions

### Key Assumptions:
1. Conversion Free → Paid: 10% (industry standard: 2-10% для freemium)
2. Retention 70% (industry: 60-80% для family apps)
3. CAC $30 (achievable with mix paid/organic)
4. ARPU $50 (validated through user interviews)
5. Gross margin 75% (SaaS standard: 70-80%)

### Risks:
- **Low conversion**: If PMF не найден, conversion может быть 2-5%
- **High CAC**: Если paid ads дорогие, CAC может быть $50+
- **Competition**: Big tech (Google, Apple) могут запустить аналог
- **Regulatory**: COPPA/GDPR штрафы или требования, увеличивающие costs

---

## 11. Заключение

Финансовая модель показывает **реалистичный путь к $6.6M ARR за 5 лет** при разумных предпосылках (базовый сценарий). Критичны:
1. **Product-market fit**: conversion 10% и retention 70% достижимы
2. **Efficient marketing**: CAC $30 требует mix paid/organic/referral
3. **Operational efficiency**: Держать gross margin 75%+

**Next steps**:
1. Validate assumptions через MVP pilot (Q1 2026)
2. Measure actual conversion, retention, CAC
3. Adjust model based on real data
4. Prepare Series A pitch с proven unit economics

**Контакт**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Этот документ является черновиком финансовой модели для internal и investor review. Все цифры — оценки и предположения, требующие валидации на реальных данных. Не является финансовым советом.
