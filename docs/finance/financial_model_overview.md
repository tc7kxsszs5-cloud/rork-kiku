# Финансовая модель Rork-Kiku — Обзор

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Период**: 3 года (2026-2028)

---

## Обзор модели

Финансовая модель Rork-Kiku построена на трёх сценариях: **Консервативный**, **Базовый** и **Оптимистичный**. Каждый сценарий отражает различные предположения о росте пользователей, конверсии в платящих клиентов и операционных затратах.

Полная модель доступна в CSV: [financial_model.csv](./financial_model.csv)

---

## Методология и допущения

### Общие допущения

1. **Pilot Year (Year 1, 2026)**:
   - Приложение бесплатно для всех пользователей
   - Фокус на валидации product-market fit
   - Revenue = $0

2. **Freemium Launch (Year 2, 2027)**:
   - Запуск премиум-подписки ($7.99/мес, $79.99/год)
   - Целевая конверсия: 30% free → premium
   - ARPU: $75/год (blend free + premium)

3. **Scale (Year 3, 2028)**:
   - Увеличение user base
   - Поддержание 30% конверсии
   - Оптимизация unit economics

### Ключевые метрики

- **ARPU (Average Revenue Per User)**: $75/год для платящих пользователей
- **CAC (Customer Acquisition Cost)**: $30 (performance marketing + organic)
- **LTV (Lifetime Value)**: $300 (4 года средняя retention)
- **LTV/CAC ratio**: 10:1
- **Gross Margin**: 60-70% (SaaS-like)
- **Churn Rate**: 25% годовой (75% retention)

---

## Сценарий 1: Консервативный (вероятность 70%)

### Описание
Медленный органический рост с минимальным маркетинговым бюджетом. Подходит для ситуации, когда adoption ниже ожидаемого или есть задержки в запуске.

### Ключевые допущения

**User Growth**:
- Year 1: 5,000 users (pilot)
- Year 2: 30,000 users (6x рост)
- Year 3: 150,000 users (5x рост)

**Конверсия**:
- Year 1: 0% (все бесплатно)
- Year 2-3: 30% free → premium

**ARPU**: $75/год

**CAC**: $30 (низкий маркетинговый бюджет, больше organic)

### Финансовые результаты

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| **Total Users** | 5,000 | 30,000 | 150,000 |
| **Paying Users** | 0 | 9,000 | 45,000 |
| **Revenue** | $0 | $675K | $3.4M |
| **COGS** | $50K | $270K | $1.2M |
| **Gross Profit** | -$50K | $405K | $2.2M |
| **Operating Expenses** | $450K | $930K | $1.8M |
| **Net Profit** | **-$500K** | **-$525K** | **+$400K** |
| **Cumulative Cash** | -$500K | -$1.025M | -$625K |

**Break-even**: Q3-Q4 Year 3

### Затраты (Opex)

**Year 1** ($450K):
- Team: $250K (4 engineers, 1 PM)
- Infrastructure: $50K (AWS, tools)
- Marketing: $100K (organic, pilot partnerships)
- Moderation: $30K (manual moderators)
- Legal/Admin: $20K

**Year 2** ($930K):
- Team: $550K (7 engineers, 1 PM, 1 designer)
- Infrastructure: $120K (scaling)
- Marketing: $200K (performance ads start)
- Moderation: $40K (hybrid AI + manual)
- Legal/Admin: $20K

**Year 3** ($1.8M):
- Team: $1.0M (10 engineers, 2 PMs, 2 designers, QA)
- Infrastructure: $250K (multi-region, CDN)
- Marketing: $400K (scaled ads)
- Moderation: $100K (team expansion)
- Legal/Admin: $50K

### Риски
- Медленный рост может привести к проблемам с cash runway
- Низкая конверсия в premium требует быстрой оптимизации продукта
- Необходимость дополнительного финансирования в Year 3

---

## Сценарий 2: Базовый (вероятность 50%)

### Описание
Ожидаемый сценарий с умеренным маркетинговым бюджетом и стандартной конверсией. Предполагается хороший product-market fit и устойчивый рост.

### Ключевые допущения

**User Growth**:
- Year 1: 10,000 users (pilot)
- Year 2: 60,000 users (6x рост)
- Year 3: 300,000 users (5x рост)

**Конверсия**: 30% free → premium

**ARPU**: $75/год

**CAC**: $30

### Финансовые результаты

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| **Total Users** | 10,000 | 60,000 | 300,000 |
| **Paying Users** | 0 | 18,000 | 90,000 |
| **Revenue** | $0 | $1.35M | $6.8M |
| **COGS** | $100K | $540K | $2.4M |
| **Gross Profit** | -$100K | $810K | $4.4M |
| **Operating Expenses** | $500K | $1.1M | $2.6M |
| **Net Profit** | **-$600K** | **-$290K** | **+$1.8M** |
| **Cumulative Cash** | -$600K | -$890K | +$910K |

**Break-even**: Q2-Q3 Year 3

### Затраты (Opex)

**Year 1** ($500K):
- Team: $300K (5 engineers, 1 PM)
- Infrastructure: $60K
- Marketing: $100K
- Moderation: $30K
- Legal/Admin: $10K

**Year 2** ($1.1M):
- Team: $650K (9 engineers, 2 PMs, 1 designer)
- Infrastructure: $150K
- Marketing: $250K
- Moderation: $30K
- Legal/Admin: $20K

**Year 3** ($2.6M):
- Team: $1.4M (15 engineers, 3 PMs, 3 designers, QA, SRE)
- Infrastructure: $400K
- Marketing: $650K
- Moderation: $100K
- Legal/Admin: $50K

### Результат
- Положительный cash flow к концу Year 3
- Готовность к Series A ($5-10M) в Q4 Year 3
- Доказанный unit economics (LTV/CAC = 10:1)

---

## Сценарий 3: Оптимистичный (вероятность 20%)

### Описание
Агрессивный рост с высоким маркетинговым бюджетом, viral adoption и сильными партнерствами (школы, NGO). Предполагается отличный product-market fit и network effects.

### Ключевые допущения

**User Growth**:
- Year 1: 20,000 users (pilot + viral)
- Year 2: 120,000 users (6x рост)
- Year 3: 600,000 users (5x рост)

**Конверсия**: 30% free → premium (Year 2), 35% (Year 3 с upsell)

**ARPU**: $75 (Year 2), $80 (Year 3 с enterprise)

**CAC**: $30 (эффективность marketing + virality снижает CAC)

### Финансовые результаты

| Метрика | Year 1 | Year 2 | Year 3 |
|---------|--------|--------|--------|
| **Total Users** | 20,000 | 120,000 | 600,000 |
| **Paying Users** | 0 | 36,000 | 210,000 |
| **Revenue** | $0 | $2.7M | $16.8M |
| **COGS** | $150K | $1.08M | $5.9M |
| **Gross Profit** | -$150K | $1.62M | $10.9M |
| **Operating Expenses** | $550K | $1.4M | $4.0M |
| **Net Profit** | **-$700K** | **+$220K** | **+$6.9M** |
| **Cumulative Cash** | -$700K | -$480K | +$6.42M |

**Break-even**: Q3-Q4 Year 2

### Затраты (Opex)

**Year 1** ($550K):
- Team: $350K (6 engineers, 1 PM, 1 designer)
- Infrastructure: $70K
- Marketing: $100K
- Moderation: $20K
- Legal/Admin: $10K

**Year 2** ($1.4M):
- Team: $800K (12 engineers, 3 PMs, 2 designers)
- Infrastructure: $200K
- Marketing: $350K (aggressive ads)
- Moderation: $30K
- Legal/Admin: $20K

**Year 3** ($4.0M):
- Team: $2.0M (25 engineers, 5 PMs, 5 designers, QA, SRE, Support)
- Infrastructure: $800K (global infra)
- Marketing: $1.0M (international expansion)
- Moderation: $150K
- Legal/Admin: $50K

### Результат
- Прибыльность к концу Year 2
- Сильная позиция для Series A ($10-20M) в Q2-Q3 Year 3
- Возможность международной экспансии

---

## Сравнение сценариев

| Метрика | Консервативный | Базовый | Оптимистичный |
|---------|----------------|---------|---------------|
| **Year 3 Revenue** | $3.4M | $6.8M | $16.8M |
| **Year 3 Users** | 150K | 300K | 600K |
| **Break-even** | Q4 Year 3 | Q3 Year 3 | Q4 Year 2 |
| **Cash Needed (3 years)** | $1.025M | $890K | $480K |
| **Year 3 Net Profit** | $400K | $1.8M | $6.9M |

---

## Структура затрат

### CapEx (Capital Expenditures)

**Минимальный CapEx** для software-first бизнеса:
- Компьютеры и оборудование для команды: $30K (Year 1), $50K (Year 2-3)
- Офис: remote-first (минимизация затрат)

### OpEx (Operating Expenditures)

**Основные категории**:

1. **Team Costs** (50-60% от opex):
   - Salaries (engineers, PM, design, QA, SRE)
   - Benefits (health insurance, etc.)
   - Recruiting fees

2. **Infrastructure Costs** (10-20% от opex):
   - AWS / GCP hosting
   - Database (RDS, Redis)
   - Object Storage (S3, CDN)
   - Monitoring tools (Sentry, Datadog)

3. **ML Costs** (5-10% от opex):
   - Google Vision API (image moderation)
   - Custom model training (GPU instances)
   - ML infrastructure (SageMaker, TensorFlow Serving)

4. **Moderation Costs** (5-10% от opex):
   - Manual moderators (part-time / contract)
   - Moderation tools (dashboards)

5. **Marketing & Sales** (20-30% от opex):
   - Performance ads (Facebook, Google, TikTok)
   - Content marketing (blog, SEO)
   - Partnerships (schools, NGO)
   - PR & events

6. **Legal & Admin** (2-5% от opex):
   - Legal counsel (COPPA, GDPR)
   - Accounting
   - Insurance
   - Tools (Slack, GitHub, etc.)

---

## Чувствительность и риски

### Sensitivity Analysis

**Ключевые драйверы**:
1. **Premium Conversion Rate**: 20% vs 30% vs 40%
   - -10%: revenue снижается на ~33%
   - +10%: revenue увеличивается на ~33%

2. **CAC (Customer Acquisition Cost)**: $20 vs $30 vs $50
   - $20: LTV/CAC = 15:1 (отлично)
   - $50: LTV/CAC = 6:1 (приемлемо, но tight)

3. **Churn Rate**: 20% vs 25% vs 35%
   - 20% churn: LTV = $375
   - 35% churn: LTV = $214 → LTV/CAC = 7:1

### Риски

1. **User Adoption Risk**:
   - Если рост пользователей < 50% от базового сценария → переход к консервативному сценарию
   - Митигация: pilot validation, strong referrals

2. **Monetization Risk**:
   - Если конверсия < 20% → пересмотр pricing или value proposition
   - Митигация: A/B testing, user research

3. **Competition Risk**:
   - Крупные игроки (Meta, Google) входят в рынок → давление на CAC и pricing
   - Митигация: first-mover advantage, niche focus, defensible moat (AI moderation)

4. **Operational Risk**:
   - ML moderation не работает (низкая accuracy) → высокие moderation costs
   - Митигация: hybrid AI + human, continuous model improvement

---

## Рекомендации

### Для Pre-Seed / Seed раунда

**Raise**: $1.5M для 18-month runway (базовый сценарий)

**Milestones**:
- ✅ TestFlight Pilot (Q2 2026) → 100-500 users
- ✅ Product-market fit validation (Q3 2026) → 40%+ day-7 retention
- ✅ Public launch (Q4 2026 - Q1 2027) → 10K+ users
- ✅ Revenue traction (Q2 2027) → $500K ARR
- ✅ Series A ready (Q3-Q4 2027) → $1-2M ARR, proven unit economics

### Для Series A

**Timing**: Q4 2027 - Q1 2028

**Target**: $5-10M

**Valuation**: $30-50M (3-5x ARR multiple для SaaS)

**Use of Funds**:
- International expansion (UK, Canada, Germany, France)
- Team scaling (25-50 people)
- Advanced features (video moderation, AI assistant, gamification)
- Enterprise sales (school districts)

---

## Заключение

Финансовая модель Rork-Kiku показывает **жизнеспособный путь к прибыльности в Year 3** в базовом сценарии. Ключевые факторы успеха:

1. **Доказанный unit economics**: LTV/CAC = 10:1, gross margin 60-70%
2. **Масштабируемая модель**: низкий CAC ($30) за счет organic + referrals
3. **Strong retention**: 75% годовая retention (LTV = $300)
4. **Clear path to Series A**: $1-2M ARR к концу Year 3

**Риски управляемы** при условии:
- Быстрая валидация в pilot (Q2-Q3 2026)
- Фокус на unit economics с Day 1
- Continuous product improvement на основе feedback

---

**Полная модель**: См. [financial_model.csv](./financial_model.csv) для детальных расчетов по месяцам и годам.

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Founding Team
