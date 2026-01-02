# Финансовая модель Rork-Kiku: Обзор

## Введение

Данный документ описывает финансовую модель платформы Rork-Kiku на горизонте 5 лет (2026-2030). Модель включает три сценария: консервативный, базовый и оптимистичный.

Детальная финансовая модель представлена в файле `financial_model.csv`.

## Три сценария

### 1. Консервативный сценарий (Conservative)

**Допущения**:
- Медленный рост пользовательской базы
- Низкая конверсия free → paid (15%)
- Высокий churn rate (20%/год)
- Сложности с привлечением пользователей
- CAC выше ожидаемого ($40)
- Меньший ARPU ($40/год)

**Целевые показатели**:
- Year 1: 5K users
- Year 2: 30K users
- Year 3: 150K users
- Year 4: 500K users
- Year 5: 1.5M users
- Revenue Year 5: $60M
- Break-even: Year 4

**Вероятность**: 20-25%

**Триггеры**:
- Слабый product-market fit
- Сильная конкуренция
- Регуляторные препятствия
- Недостаток финансирования

---

### 2. Базовый сценарий (Base Case)

**Допущения**:
- Умеренный рост пользовательской базы
- Средняя конверсия free → paid (25%)
- Нормальный churn rate (15%/год)
- CAC в рамках плана ($30)
- ARPU по плану ($50/год)

**Целевые показатели**:
- Year 1: 10K users
- Year 2: 100K users
- Year 3: 500K users
- Year 4: 1.5M users
- Year 5: 4M users
- Revenue Year 5: $200M
- Break-even: Year 3

**Вероятность**: 50-60%

**Это сценарий, использованный в pitch deck.**

---

### 3. Оптимистичный сценарий (Optimistic)

**Допущения**:
- Быстрый вирусный рост
- Высокая конверсия free → paid (35%)
- Низкий churn rate (10%/год)
- Сильный network effect
- CAC ниже плана ($20)
- Выше ARPU ($60/год) благодаря upsell

**Целевые показатели**:
- Year 1: 20K users
- Year 2: 250K users
- Year 3: 1.5M users
- Year 4: 4M users
- Year 5: 10M users
- Revenue Year 5: $600M
- Break-even: Year 2

**Вероятность**: 15-20%

**Триггеры**:
- Вирусный growth loop
- Успешные partnerships
- Положительная press coverage
- Технологический прорыв (AI breakthrough)

---

## Ключевые метрики и допущения

### User Acquisition

#### Базовый сценарий
- **CAC** (Customer Acquisition Cost):
  - Year 1: $40 (early stage, experimentation)
  - Year 2: $35 (optimization)
  - Year 3-5: $30 (scale, efficiency)
  
- **Каналы и mix**:
  - Organic (SEO, word-of-mouth): 40%
  - Paid (Facebook, Google Ads): 35%
  - Partnerships (schools, НКО): 15%
  - Referrals: 10%

- **Retention и churn**:
  - Month 1: 80% retention
  - Month 3: 60% retention
  - Month 6: 50% retention
  - Annual churn: 15%

#### Влияние сценариев на CAC
- **Conservative**: CAC +33% ($40)
- **Base**: CAC baseline ($30)
- **Optimistic**: CAC -33% ($20)

### Monetization

#### Конверсия free → paid
- **Conservative**: 15%
- **Base**: 25%
- **Optimistic**: 35%

#### ARPU (Average Revenue Per User, annual)

**Base case разбивка**:
- Free tier: $0 (60% users)
- Premium ($4.99/mo): $60/year (30% users)
- Family+ ($9.99/mo): $120/year (9% users)
- Enterprise: $150/year (1% users)
- **Blended ARPU**: (0.6×$0 + 0.3×$60 + 0.09×$120 + 0.01×$150) / 1 = **~$50/year**

#### Влияние сценариев на ARPU
- **Conservative**: $40/year (lower conversion, more free users)
- **Base**: $50/year
- **Optimistic**: $60/year (higher conversion, upsell success)

### Customer Lifetime Value (LTV)

**LTV = ARPU / Churn Rate**

- **Conservative**: $40 / 0.20 = **$200**
- **Base**: $50 / 0.15 = **$333**
- **Optimistic**: $60 / 0.10 = **$600**

### LTV/CAC Ratio

| Сценарий | LTV | CAC | LTV/CAC | Оценка |
|----------|-----|-----|---------|--------|
| Conservative | $200 | $40 | **5x** | Acceptable |
| Base | $333 | $30 | **11x** | Healthy |
| Optimistic | $600 | $20 | **30x** | Excellent |

**Бенчмарки**: LTV/CAC > 3x считается жизнеспособным, > 5x здоровым, > 10x отличным для SaaS.

---

## Структура расходов

### COGS (Cost of Goods Sold)

#### Компоненты
1. **Hosting & Infrastructure** (AWS/GCP):
   - Compute (EC2/GKE): $500/month → $50K/year (Year 1)
   - Storage (S3/Cloud Storage): $1K/month → $12K/year (Year 1)
   - Database (RDS/Cloud SQL): $500/month → $6K/year (Year 1)
   - CDN (CloudFront/CloudFlare): $200/month → $2.4K/year (Year 1)
   - **Total infra Year 1**: ~$70K
   - **Scaling**: Linear с пользователями (storage), sub-linear (compute due to efficiency)

2. **ML Inference**:
   - GPU instances (T4): $0.50/hour → $4K/month → $50K/year (Year 1)
   - **Scaling**: Sub-linear (batch processing, model optimization)

3. **Third-party APIs**:
   - Firebase/APNS (push notifications): $100/month → $1.2K/year
   - SendGrid (email): $100/month → $1.2K/year
   - Auth providers (OAuth): $50/month → $600/year
   - **Total 3rd-party Year 1**: ~$3K

4. **Moderation (human)**:
   - Moderators: 1 FTE @ $50K/year (Year 1)
   - Scaling: 1 moderator per 10K daily uploads

**Total COGS Year 1**: ~$170K  
**COGS as % of revenue**:
- Year 1-2: High (no revenue or low revenue)
- Year 3+: 20-25% (target 75% gross margin)

### Operating Expenses (OpEx)

#### 1. Team Costs

**Year 1 (2026)** - Post-seed hiring:
- iOS Developer: $120K
- Android Developer: $120K
- Backend Engineer (x2): $240K
- ML Engineer: $150K
- QA/Testing: $80K
- Community Manager: $70K
- **Subtotal**: $780K

**Year 2 (2027)** - Expansion:
- Product Manager: $140K
- SRE/DevOps: $130K
- Sales/BD (x2): $200K
- Marketing: $100K
- Moderation Lead: $80K
- Legal/Compliance (part-time): $50K
- **Subtotal**: $1.48M (cumulative: $2.26M)

**Year 3-5**: Продолжение hiring, масштабирование команды до 30-40 FTE.

#### 2. Marketing & Sales

- **Year 1**: $100K (organic, content, small paid tests)
- **Year 2**: $600K (paid acquisition ramp-up)
- **Year 3**: $5M (scale marketing, 25% of revenue)
- **Year 4-5**: 20-25% of revenue

#### 3. G&A (General & Administrative)

- Legal & Compliance: $50K-200K/year (COPPA/GDPR audits, lawyers)
- Insurance: $20K-50K/year
- Office & Misc: $30K-100K/year (remote-first, co-working, tools)
- Accounting & Finance: $30K-100K/year

**Total G&A**: 10-15% of revenue (Year 3+)

---

## Капитальные затраты (CapEx)

**Минимальные** для SaaS-модели:

- Компьютеры для команды: $2K/person → $20K (Year 1, 10 people)
- Лицензии ПО (Figma, GitHub, Slack, etc.): $10K/year
- Прочие: $10K/year

**Total CapEx Year 1**: ~$40K  
**Recurring CapEx**: ~$20K/year

**CapEx не является большой статьёй расходов** для SaaS бизнеса.

---

## Путь к прибыльности

### Year 1 (2026): Development & MVP
- Revenue: $0 (бесплатная beta)
- Expenses: $1.5M-2M (team, infra, ops)
- **EBITDA**: -$1.5M to -$2M
- **Burn rate**: $125K-150K/month

### Year 2 (2027): Launch & GTM
- Revenue: $3M (100K users, $30 ARPU)
- COGS: $900K (30%)
- OpEx: $5M (team $2.3M, marketing $2M, G&A $700K)
- **EBITDA**: -$3M
- **Burn rate**: $250K/month

### Year 3 (2028): Scale & Break-even
- Revenue: $20M (500K users, $40 ARPU)
- COGS: $5M (25%)
- OpEx: $15M (team $5M, marketing $5M, G&A $5M)
- **EBITDA**: $0 (break-even)
- **Burn rate**: $0

### Year 4 (2029): Profitability
- Revenue: $68M
- COGS: $17M (25%)
- OpEx: $36M (team $12M, marketing $15M, G&A $9M)
- **EBITDA**: $15M
- **EBITDA margin**: 22%

### Year 5 (2030): Scale Profitability
- Revenue: $200M
- COGS: $50M (25%)
- OpEx: $100M (team $30M, marketing $45M, G&A $25M)
- **EBITDA**: $50M
- **EBITDA margin**: 25%

---

## Финансирование

### Seed Round ($2M-3M)
- **Runway**: 18 months (до конца 2027)
- **Target**: Достичь $500K ARR и 50K users для Series A

### Series A ($5M-10M, Q4 2026 - Q1 2027)
- **Valuation**: $30M-50M
- **Runway**: 24-30 months (до конца 2028)
- **Target**: Достичь break-even или close to it

### Series B ($15M-30M, 2029)
- **Valuation**: $100M-200M
- **Runway**: 24 months
- **Target**: Scale internationally, reach profitability

### Потенциальный IPO или Exit (2030-2032)
- **Target valuation**: $1B+ (unicorn status)
- **Revenue**: $500M+ ARR
- **EBITDA**: $100M+

---

## Чувствительность к параметрам

### Наиболее чувствительные переменные

1. **CAC**: ±$10 change → ±30% impact on LTV/CAC ratio
2. **Churn rate**: ±5% change → ±50% impact on LTV
3. **Conversion rate** (free → paid): ±5% change → ±20% impact on ARPU
4. **Pricing**: ±$1/mo change → ±20% impact on ARPU

### Сценарии стресс-тестов

#### Worst case: High CAC + High churn
- CAC: $50
- Churn: 25%
- LTV: $40 / 0.25 = $160
- **LTV/CAC**: 160 / 50 = **3.2x** (borderline viable)
- **Action**: Pivot pricing or reduce burn

#### Best case: Low CAC + Low churn
- CAC: $15
- Churn: 8%
- LTV: $60 / 0.08 = $750
- **LTV/CAC**: 750 / 15 = **50x** (exceptional)
- **Action**: Aggressively invest in growth

---

## Риски и митигации

### Финансовые риски

1. **Недостаток финансирования**
   - Mitigation: Поддерживать runway 12+ месяцев, открывать раунд рано

2. **Высокий CAC**
   - Mitigation: Фокус на organic growth (content, referrals), optimize paid channels

3. **Низкая конверсия**
   - Mitigation: A/B testing pricing, features, onboarding flow

4. **Высокий churn**
   - Mitigation: Улучшение product engagement, customer success team

---

## Заключение

Финансовая модель Rork-Kiku показывает **путь к прибыльности в Year 3** при базовом сценарии и **здоровые unit economics** (LTV/CAC = 11x). Модель консервативна в допущениях роста и оптимистична в операционной эффективности.

**Ключевые выводы**:
- ✅ Привлечение $2M-3M seed достаточно для достижения milestones для Series A
- ✅ LTV/CAC ratio 11x в базовом сценарии — здоровый для SaaS
- ✅ Break-even в Year 3 при умеренном росте
- ✅ Path to $200M revenue и 25% EBITDA margin в Year 5
- ⚠️ Высокая чувствительность к CAC и churn — требует постоянного мониторинга

**Детали см. в `financial_model.csv`**.

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Это черновой документ с финансовыми прогнозами. Все цифры являются оценками и не гарантируют будущие результаты. Для инвестиционных решений требуется дополнительный due diligence.
