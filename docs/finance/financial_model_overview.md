# Обзор финансовой модели kiku

## Введение

Данный документ описывает финансовую модель kiku на период 2026-2030 (5 лет). Модель включает три сценария: консервативный, базовый и оптимистичный.

## Ключевые предположения

### Пользовательская база

**Рост пользователей (Total Active Users):**

| Сценарий | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|----------|--------|--------|--------|--------|--------|
| Консервативный | 5,000 | 20,000 | 60,000 | 150,000 | 300,000 |
| Базовый | 10,000 | 50,000 | 150,000 | 400,000 | 1,000,000 |
| Оптимистичный | 20,000 | 100,000 | 350,000 | 1,000,000 | 2,500,000 |

**Конверсия Free → Paid:**
- Консервативный: 10%
- Базовый: 20%
- Оптимистичный: 30%

**Churn Rate (ежемесячный):**
- Консервативный: 7%
- Базовый: 5%
- Оптимистичный: 3%

### Ценообразование

**Consumer (B2C):**
- Free Tier: $0 (для acquisition)
- Premium: $9.99/месяц или $99/год
- Family Plan: $14.99/месяц или $149/год

**Business (B2B):**
- Small School (100-500 students): $500/месяц
- Medium School (500-2000): $1,500/месяц
- Large School/District (2000+): $5,000/месяц
- Enterprise: Custom pricing

**ARPU (Average Revenue Per User):**
- Year 1-2: $10/месяц
- Year 3: $12/месяц (рост за счет Family plans)
- Year 4-5: $15-20/месяц (рост за счет B2B)

### Unit Economics

**LTV (Lifetime Value):**
```
Average retention: 3-5 лет
Monthly ARPU: $10
Annual value: $120

Conservative: $360 (3 года × $120)
Base: $480 (4 года × $120)
Optimistic: $600 (5 лет × $120)
```

**CAC (Customer Acquisition Cost):**
```
Year 1-2 (early, high CAC):
  Paid: $50
  Organic: $20
  Blended: $40

Year 3-5 (scale, lower CAC):
  Paid: $30
  Organic: $10
  Blended: $20
```

**LTV/CAC Ratio:**
- Conservative: 9:1 ($360/$40)
- Base: 16:1 ($480/$30)
- Optimistic: 30:1 ($600/$20)

Target: > 3:1 (здоровая SaaS компания)

## Сценарии доходов

### Консервативный сценарий

**Предположения:**
- Медленный рост пользователей
- Низкая конверсия (10%)
- Высокий churn (7%)
- Минимальный B2B (после Year 3)

| Year | Total Users | Paying Users | B2C Revenue | B2B Revenue | Total Revenue |
|------|-------------|--------------|-------------|-------------|---------------|
| 2026 | 5,000 | 500 | $60K | $0 | $60K |
| 2027 | 20,000 | 2,000 | $240K | $0 | $240K |
| 2028 | 60,000 | 6,000 | $720K | $180K | $900K |
| 2029 | 150,000 | 15,000 | $1.8M | $600K | $2.4M |
| 2030 | 300,000 | 30,000 | $3.6M | $1.4M | $5M |

### Базовый сценарий (целевой)

**Предположения:**
- Устойчивый рост (virality + paid)
- Средняя конверсия (20%)
- Умеренный churn (5%)
- B2B с Year 2

| Year | Total Users | Paying Users | B2C Revenue | B2B Revenue | Total Revenue |
|------|-------------|--------------|-------------|-------------|---------------|
| 2026 | 10,000 | 2,000 | $120K | $0 | $120K |
| 2027 | 50,000 | 10,000 | $1.2M | $100K | $1.3M |
| 2028 | 150,000 | 30,000 | $3.6M | $600K | $4.2M |
| 2029 | 400,000 | 80,000 | $12M | $3M | $15M |
| 2030 | 1,000,000 | 200,000 | $30M | $10M | $40M |

### Оптимистичный сценарий

**Предположения:**
- Viral growth + strong PMF
- Высокая конверсия (30%)
- Низкий churn (3%)
- Strong B2B uptake

| Year | Total Users | Paying Users | B2C Revenue | B2B Revenue | Total Revenue |
|------|-------------|--------------|-------------|-------------|---------------|
| 2026 | 20,000 | 6,000 | $360K | $0 | $360K |
| 2027 | 100,000 | 30,000 | $3.6M | $400K | $4M |
| 2028 | 350,000 | 105,000 | $15M | $3M | $18M |
| 2029 | 1,000,000 | 300,000 | $45M | $15M | $60M |
| 2030 | 2,500,000 | 750,000 | $120M | $50M | $170M |

## Структура расходов (OPEX)

### CAPEX (Capital Expenditures)

**Минимальный для SaaS бизнеса:**
- Year 1: $50K (initial infrastructure setup)
- Year 2-5: $20-50K/год (hardware для офиса, equipment)

### OPEX (Operating Expenses)

#### 1. Team & Salaries

**Консервативный:**
| Year | Headcount | Total Compensation |
|------|-----------|-------------------|
| 2026 | 5 | $300K |
| 2027 | 8 | $550K |
| 2028 | 12 | $900K |
| 2029 | 18 | $1.5M |
| 2030 | 25 | $2.5M |

**Базовый:**
| Year | Headcount | Total Compensation |
|------|-----------|-------------------|
| 2026 | 5 | $400K |
| 2027 | 10 | $800K |
| 2028 | 18 | $1.8M |
| 2029 | 30 | $3.5M |
| 2030 | 50 | $7M |

**Оптимистичный:**
| Year | Headcount | Total Compensation |
|------|-----------|-------------------|
| 2026 | 8 | $500K |
| 2027 | 15 | $1.2M |
| 2028 | 30 | $3M |
| 2029 | 60 | $7M |
| 2030 | 120 | $15M |

**Средние зарплаты (загруженные, с налогами):**
- Engineer: $100-120K/год
- Senior Engineer: $140-180K/год
- Product Manager: $120-150K/год
- Marketing/Growth: $80-120K/год
- Customer Success: $60-80K/год
- Executive (CTO, CPO): $180-250K/год

#### 2. ML & Infrastructure Costs

**AI API Costs (OpenAI/Anthropic):**
```
Cost per analysis:
- Text: $0.001 per message
- Image: $0.01 per image
- Audio transcription: $0.006 per minute

Estimated monthly volume (Base scenario):
Year 1: 100K analyses/month → $200/month
Year 2: 1M analyses/month → $2K/month
Year 3: 5M analyses/month → $10K/month
Year 4: 20M analyses/month → $40K/month
Year 5: 100M analyses/month → $200K/month
```

**AWS Infrastructure:**
```
Components:
- EKS (Kubernetes): $150-500/month
- RDS (PostgreSQL): $200-2000/month
- ElastiCache (Redis): $50-500/month
- S3 Storage: $50-500/month
- CloudFront (CDN): $100-1000/month
- Other (Secrets, Monitoring): $100-500/month

Total (Base scenario):
Year 1: $1K/month → $12K/year
Year 2: $5K/month → $60K/year
Year 3: $20K/month → $240K/year
Year 4: $50K/month → $600K/year
Year 5: $150K/month → $1.8M/year
```

**Total Infrastructure + ML (Base):**
| Year | ML Costs | Infra Costs | Total |
|------|----------|-------------|-------|
| 2026 | $2.4K | $12K | $14.4K |
| 2027 | $24K | $60K | $84K |
| 2028 | $120K | $240K | $360K |
| 2029 | $480K | $600K | $1.08M |
| 2030 | $2.4M | $1.8M | $4.2M |

#### 3. Marketing & Sales

**Консервативный:** 20% of revenue
**Базовый:** 30-40% of revenue (growth phase)
**Оптимистичный:** 25% of revenue (efficient growth)

| Scenario | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|----------|--------|--------|--------|--------|--------|
| Conservative | $12K | $48K | $180K | $480K | $1M |
| Base | $50K | $400K | $1.5M | $6M | $16M |
| Optimistic | $90K | $1M | $4.5M | $15M | $42.5M |

**Каналы:**
- Paid Ads (Facebook, Google): 40%
- Content Marketing: 20%
- PR & Events: 15%
- Partnerships & BD: 15%
- Tools & Software: 10%

#### 4. Operations & Admin

**Включает:**
- Legal & Compliance: $20-100K/год
- Accounting & Finance: $20-80K/год
- Office & Facilities: $20-100K/год
- Insurance: $10-50K/год
- Software & Tools: $20-100K/год

| Scenario | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|----------|--------|--------|--------|--------|--------|
| Conservative | $50K | $80K | $150K | $300K | $500K |
| Base | $60K | $120K | $300K | $800K | $2M |
| Optimistic | $80K | $200K | $500K | $1.5M | $4M |

### Total OPEX Summary (Base Scenario)

| Year | Team | ML+Infra | Marketing | Operations | Total OPEX |
|------|------|----------|-----------|------------|------------|
| 2026 | $400K | $14K | $50K | $60K | $524K |
| 2027 | $800K | $84K | $400K | $120K | $1.4M |
| 2028 | $1.8M | $360K | $1.5M | $300K | $3.96M |
| 2029 | $3.5M | $1.08M | $6M | $800K | $11.38M |
| 2030 | $7M | $4.2M | $16M | $2M | $29.2M |

## EBITDA & Profitability (Base Scenario)

| Year | Revenue | OPEX | EBITDA | EBITDA Margin |
|------|---------|------|--------|---------------|
| 2026 | $120K | $524K | -$404K | -337% |
| 2027 | $1.3M | $1.4M | -$100K | -8% |
| 2028 | $4.2M | $3.96M | $240K | 6% |
| 2029 | $15M | $11.38M | $3.62M | 24% |
| 2030 | $40M | $29.2M | $10.8M | 27% |

**Путь к прибыльности:**
- Year 1-2: Burn phase (фокус на рост)
- Year 3: Break-even
- Year 4-5: Profitable с 24-27% margins

## Требования к финансированию

### Раунды инвестиций

**Pre-Seed (уже привлечено или bootstrapped): $250K**
- Use: MVP development, initial team
- Source: Founders, angels, accelerators

**Seed Round (текущий): $1.5M @ $6M pre**
- Use: Team expansion, product development, marketing
- Runway: 18-24 месяца
- Milestones для Series A:
  - 100K+ active users
  - $500K+ ARR
  - Strong unit economics (LTV/CAC > 5)

**Series A (18-24 месяца): $8M @ $30M pre**
- Use: Scale marketing, international expansion, B2B sales team
- Runway: 24-30 месяцев
- Milestones для Series B:
  - 500K+ active users
  - $10M+ ARR
  - Multi-country presence

**Series B (36-48 месяцев): $25M @ $100M pre**
- Use: Global expansion, M&A, product diversification
- Goal: Path to IPO or strategic acquisition

### Cash Flow & Burn Rate

**Base Scenario:**

| Year | Revenue | OPEX | Net Burn | Cum. Burn |
|------|---------|------|----------|-----------|
| 2026 | $120K | $524K | -$404K | -$404K |
| 2027 | $1.3M | $1.4M | -$100K | -$504K |
| 2028 | $4.2M | $3.96M | +$240K | -$264K |
| 2029 | $15M | $11.38M | +$3.62M | +$3.36M |
| 2030 | $40M | $29.2M | +$10.8M | +$14.16M |

**Funding requirements:**
- Pre-Seed $250K покрывает до MVP
- Seed $1.5M покрывает Year 1-2 burn ($504K) + runway buffer
- Series A необходима в Q4 2027 перед break-even

## Риски и митигация

**Финансовые риски:**

1. **Высокий CAC:** Если CAC > $60, unit economics ломаются
   - Mitigation: Фокус на organic growth, referral program, content marketing

2. **Высокий churn:** Если churn > 10%, LTV падает
   - Mitigation: Улучшение product engagement, customer success team

3. **Медленный рост:** Если рост < консервативного сценария
   - Mitigation: Pivot strategy, дополнительное финансирование

4. **AI costs spike:** OpenAI может поднять цены
   - Mitigation: Multi-provider strategy, развитие собственных моделей

5. **Конкуренция:** Крупные игроки могут демпинговать
   - Mitigation: Niche focus, superior product, strong community

## Детальная модель

См. приложенный файл: `financial_model.csv`

Модель включает:
- Ежемесячные проекции на 5 лет
- Три сценария (Conservative, Base, Optimistic)
- Детальный breakdown расходов по категориям
- Sensitivity analysis на ключевые параметры
- Cash flow projections

## Заключение

Базовый сценарий показывает:
- **Достижение $40M revenue к Year 5**
- **Break-even в Year 3**
- **Strong unit economics** (LTV/CAC 16:1)
- **Profitable margins** 24-27% к Year 4-5
- **Требование к финансированию:** $1.5M Seed + $8M Series A

Консервативный сценарий всё ещё показывает **позитивную траекторию** с break-even в Year 4 и путём к прибыльности.

Оптимистичный сценарий представляет **potential upside** с $170M revenue к Year 5 при strong execution.

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (Draft)
**Автор:** CFO/Finance Lead

**Примечание:** Все цифры являются проекциями и subject to change на основе реальных данных пилота и рыночных условий.
