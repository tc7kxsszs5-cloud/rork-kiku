# Финансовая модель Rork-Kiku: Обзор

## Введение

Этот документ описывает финансовую модель платформы Rork-Kiku с тремя сценариями развития: консервативный, базовый и оптимистичный. Детальные цифры представлены в файле `financial_model.csv`.

## Допущения и методология

### Общие допущения

**Запуск:** Q2 2026 (Pilot)
**Публичный релиз:** Q4 2026
**Горизонт планирования:** 5 лет (2026-2030)

### User Acquisition

**Каналы привлечения:**
1. Organic (SEO, referral): 30% пользователей
2. Social ads (Facebook, Instagram, TikTok): 40%
3. Partnerships (schools, NGOs, influencers): 20%
4. Content marketing: 10%

**Customer Acquisition Cost (CAC):**
- Year 1: $40 (высокий из-за market education)
- Year 2: $30 (optimization)
- Year 3+: $25 (scale efficiencies)

**Retention Rate:**
- Month 1: 80%
- Month 3: 60%
- Month 6: 50%
- Year 1: 40%
- Year 2+: 35% (stable)

**Средний LTV:** 4 года (based on retention curve)

### Monetization

**Pricing Strategy:**
- Free tier: 0% revenue
- Premium: $49/year (или $4.99/month)
- Family Plan: $99/year (или $9.99/month)

**Conversion Rates (Free → Premium):**
- Year 1: 5% (early adopters)
- Year 2: 15% (product-market fit)
- Year 3: 20% (maturity)
- Year 4-5: 25-30%

**Premium → Family Plan:**
- 30% of Premium users upgrade to Family

**Average Revenue Per User (ARPU):**
- Free users: $0
- Premium users: $49/year
- Family users: $99/year
- Blended ARPU: $8-$16/user (зависит от conversion)

### Cost Structure

**COGS (Cost of Goods Sold):**
- Cloud infrastructure (AWS): 10% revenue
- CDN: 2% revenue
- Payment processing: 3% revenue
- ML inference compute: 4% revenue
- Moderation team (contractors): 6% revenue
- **Total COGS:** 25% revenue

**Operating Expenses:**

**Team Salaries (Year 1-5):**
| Year | Team Size | Total Salary Cost |
|------|-----------|-------------------|
| 2026 | 5 | $500K |
| 2027 | 12 | $1.8M |
| 2028 | 20 | $4M |
| 2029 | 35 | $8M |
| 2030 | 50 | $13M |

**Average salary:** $100K-$150K blended (engineers, product, operations)

**Marketing & User Acquisition:**
- Year 1: 200% of revenue (investment phase)
- Year 2: 80% of revenue
- Year 3: 40% of revenue
- Year 4-5: 25-30% of revenue

**Other Operating Expenses:**
- Office & admin: 5% of revenue
- Legal & compliance: 3% of revenue
- R&D (beyond team): 2% of revenue
- Customer support: 3% of revenue
- **Total Other OpEx:** 13% of revenue

### Capital Requirements

**Pre-Seed (Current):** $500K - $1M
- **Use:** MVP development, pilot
- **Runway:** 18 months

**Seed (Q2 2027):** $3M - $5M
- **Use:** Scale to 500K users, Android launch
- **Runway:** 18-24 months

**Series A (Q1 2028):** $10M - $15M
- **Use:** International expansion, profitability
- **Runway:** 24-36 months

## Сценарий 1: Консервативный

### Описание
Медленный рост, низкая conversion, высокий CAC. Реалистичный worst-case без major failures.

### Ключевые допущения
- User growth: 50% медленнее базового
- Conversion: на 30% ниже базового (Year 3: 14% вместо 20%)
- CAC: на 20% выше базового ($30 вместо $25 в Year 3)
- Retention: на 10% ниже базового

### Результаты

| Year | Users | Conversion | Revenue | EBITDA | Notes |
|------|-------|-----------|---------|--------|-------|
| 2026 | 30K | 3% | $45K | -$650K | Slow pilot |
| 2027 | 250K | 10% | $1.25M | -$1.5M | Need more funding |
| 2028 | 1M | 14% | $7M | -$1M | Still burning cash |
| 2029 | 2.5M | 18% | $22.5M | +$3M | Break-even |
| 2030 | 5M | 20% | $50M | +$12M | Profitability |

**Оценка на exit (Year 5):** $150M - $200M (3x-4x revenue multiple)
**ROI для Pre-Seed инвесторов:** 10x - 15x

### Риски
- Может потребоваться дополнительное финансирование (bridge round)
- Более длинный путь к прибыльности
- Конкуренты могут обогнать

### Вероятность: 30%

## Сценарий 2: Базовый (Base Case)

### Описание
Реалистичный средний сценарий. Используется для основного планирования.

### Ключевые допущения
- User growth: органический рост + эффективная UA
- Conversion: 5% → 15% → 20% → 25% → 30%
- CAC: $40 → $30 → $25 (scale efficiencies)
- Retention: стандартная SaaS retention curve

### Результаты

| Year | Users | Conversion | Revenue | EBITDA | Notes |
|------|-------|-----------|---------|--------|-------|
| 2026 | 50K | 5% | $125K | -$725K | As planned |
| 2027 | 500K | 15% | $3.75M | -$350K | Near break-even |
| 2028 | 2M | 20% | $20M | +$7M | Profitable! |
| 2029 | 5M | 25% | $68.75M | +$26.75M | Strong growth |
| 2030 | 10M | 30% | $165M | +$74M | Market leader |

**Оценка на exit (Year 5):** $250M - $400M (3x-5x revenue multiple)
**ROI для Pre-Seed инвесторов:** 25x - 40x

### Вероятность: 50%

## Сценарий 3: Оптимистичный

### Описание
Сильный product-market fit, viral growth, высокая conversion. Aggressive но достижимый сценарий.

### Ключевые допущения
- User growth: на 50% быстрее базового (viral loops, strong partnerships)
- Conversion: на 30% выше базового (Year 3: 26% вместо 20%)
- CAC: на 20% ниже базового ($20 вместо $25 в Year 3)
- Retention: на 10% выше базового

### Результаты

| Year | Users | Conversion | Revenue | EBITDA | Notes |
|------|-------|-----------|---------|--------|-------|
| 2026 | 75K | 7% | $260K | -$700K | Strong pilot |
| 2027 | 750K | 20% | $7.5M | +$500K | Early profitability |
| 2028 | 3M | 26% | $40M | +$18M | Exceptional growth |
| 2029 | 8M | 32% | $140M | +$65M | Dominant position |
| 2030 | 15M | 35% | $280M | +$140M | Clear market leader |

**Оценка на exit (Year 5):** $500M - $1B (5x-7x revenue multiple)
**ROI для Pre-Seed инвесторов:** 50x - 100x

### Вероятность: 20%

## Сравнение сценариев

### Revenue Comparison (Year 5)

| Scenario | Year 5 Revenue | Year 5 EBITDA | Exit Valuation | Pre-Seed ROI |
|----------|----------------|---------------|----------------|--------------|
| Conservative | $50M | +$12M | $150M - $200M | 10x - 15x |
| Base | $165M | +$74M | $250M - $400M | 25x - 40x |
| Optimistic | $280M | +$140M | $500M - $1B | 50x - 100x |

### Probability-Weighted Expected Value

**Expected Revenue (Year 5):**
= (30% × $50M) + (50% × $165M) + (20% × $280M)
= $15M + $82.5M + $56M
= **$153.5M**

**Expected Exit Valuation:**
= (30% × $175M) + (50% × $325M) + (20% × $750M)
= $52.5M + $162.5M + $150M
= **$365M**

**Expected ROI for Pre-Seed:**
= (30% × 12.5x) + (50% × 32.5x) + (20% × 75x)
= 3.75x + 16.25x + 15x
= **35x**

## Key Drivers и Sensitivity Analysis

### Наиболее важные метрики (в порядке влияния на результат):

1. **Conversion Rate (Free → Premium):** ±5% изменение → ±25% влияние на revenue
2. **CAC:** ±20% изменение → ±15% влияние на profitability timeline
3. **User Growth Rate:** ±30% изменение → ±30% влияние на Year 5 revenue
4. **Retention Rate:** ±10% изменение → ±20% влияние на LTV
5. **ARPU:** ±$10 изменение → ±20% влияние на revenue

### Sensitivity Table: Conversion Rate vs. CAC (Year 5 Revenue)

| | CAC $20 | CAC $25 | CAC $30 | CAC $35 |
|---------------|---------|---------|---------|---------|
| **Conv 15%** | $80M | $75M | $70M | $65M |
| **Conv 20%** | $110M | $100M | $90M | $85M |
| **Conv 25%** | $140M | $130M | $120M | $110M |
| **Conv 30%** | $180M | $165M | $150M | $140M |

**Insight:** Даже при высоком CAC ($35), хорошая conversion (30%) дает $140M revenue. Фокус на product и conversion важнее, чем оптимизация CAC.

## Break-Even Analysis

### Базовый сценарий:

**EBITDA Break-Even:** Q3 2028 (Month 27)
- Users: ~1.5M
- Paying users: ~300K
- Revenue: ~$15M ARR
- Operating expenses: ~$14M

**Cash Flow Positive:** Q1 2029
- После учета capex и working capital

**Cumulative Cash Burn до Break-Even:** ~$6M
- Pre-Seed: $1M
- Seed: $4M
- Series A: $1M (используется частично)

## Funding Requirements Detailed

### Pre-Seed: $500K - $1M (Current)

**Milestones to achieve:**
- MVP launch (TestFlight)
- 50-100 pilot families
- Product-market fit validation
- Seed-ready metrics

**Runway:** 18 months

### Seed: $3M - $5M (Q2 2027)

**Required milestones before raise:**
- 10K+ families
- Premium tier launched
- $100K+ ARR
- Proven unit economics (LTV:CAC > 3:1)

**Use of funds:**
- Scale to 500K users
- Android app
- Team expansion (12 people)
- Marketing ramp-up

**Runway:** 18-24 months

### Series A: $10M - $15M (Q1 2028)

**Required milestones:**
- 500K+ families
- $3M+ ARR
- Positive contribution margin
- Clear path to profitability

**Use of funds:**
- International expansion
- B2B product (schools, organizations)
- Advanced features (AI improvements, social features)
- Team expansion (35 people)

**Runway:** 24-36 months (to profitability)

## Выводы и рекомендации

### Выводы:

1. **Сильный business case:** Даже в консервативном сценарии, 10x-15x ROI для early investors
2. **Clear path to profitability:** Break-even в 2028 (базовый сценарий)
3. **Scalable model:** High gross margins (75%), improving unit economics
4. **Capital efficient:** $6M total raise до break-even
5. **Multiple exit options:** Big tech acquirers, IPO potential (при оптимистичном сценарии)

### Рекомендации:

1. **Focus на conversion:** Самый важный driver - оптимизировать onboarding и premium features
2. **Optimize CAC:** Органические каналы (SEO, referral) должны быть > 50% growth
3. **Measure retention:** Monthly cohort analysis для early detection проблем
4. **Conservative burn:** Не превышать budget на UA до доказательства unit economics
5. **Plan for scenarios:** Держать contingency план для консервативного сценария

### Риски:

1. **Longer path to profitability:** Если консервативный сценарий, может потребоваться bridge round
2. **Competition:** Big tech может скопировать модель
3. **Regulatory changes:** COPPA/GDPR могут ужесточиться
4. **Moderation costs:** Если автоматизация не достигнет 80%, margins пострадают

---

**Примечание:** Все цифры являются estimates и должны регулярно обновляться на основе actual performance. Модель следует пересматривать ежеквартально.

**Детальные расчеты:** См. `financial_model.csv` для помесячных/погодовых разбивок по всем метрикам.

**Контакт для вопросов:** [FOUNDERS_EMAIL]
