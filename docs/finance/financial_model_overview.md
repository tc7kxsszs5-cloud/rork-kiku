# Финансовая модель Rork-Kiku

## Обзор

Этот документ описывает финансовую модель проекта Rork-Kiku с тремя сценариями развития на период 2026-2028. Детальная модель представлена в файле `financial_model.csv`.

## Три сценария

### 1. Консервативный сценарий

**Assumptions**:
- Медленный рост user base
- Высокий churn rate (20% annual)
- Низкая conversion rate (free → paid): 3%
- CAC выше ожидаемого: $80
- Конкуренция сильнее ожидаемой

**Ключевые метрики**:
| Год | Users | Revenue | EBITDA |
|-----|-------|---------|--------|
| 2026 | 5,000 | $250K | -$550K |
| 2027 | 35,000 | $1.9M | -$1.2M |
| 2028 | 120,000 | $7.2M | -$200K |

**Break-even**: Конец 2028 или Q1 2029

**Risks в этом сценарии**:
- Требуется дополнительное финансирование (bridge round)
- Давление на runway
- Могут быть проблемы с привлечением Series A

### 2. Базовый сценарий (Наиболее вероятный)

**Assumptions**:
- Умеренный рост согласно GTM плану
- Churn rate: 15% annual (improving to 12%)
- Conversion rate: 5%
- CAC: $60 (improving to $50)
- Partnerships с 2-3 школами работают

**Ключевые метрики**:
| Год | Users | Revenue | EBITDA |
|-----|-------|---------|--------|
| 2026 | 10,000 | $500K | -$475K |
| 2027 | 75,000 | $4.1M | -$800K |
| 2028 | 250,000 | $15M | +$1.8M |

**Break-even**: Q2 2028

**Это baseline** для pitch инвесторам.

### 3. Оптимистичный сценарий

**Assumptions**:
- Viral growth (сарафанное радио работает лучше ожидаемого)
- Низкий churn: 10% annual
- Высокая conversion: 7%
- CAC: $45 (благодаря organic growth)
- Partnerships с школьными округами (масштаб)
- Возможно ISP bundling deal

**Ключевые метрики**:
| Год | Users | Revenue | EBITDA |
|-----|-------|---------|--------|
| 2026 | 15,000 | $750K | -$400K |
| 2027 | 150,000 | $8.3M | +$500K |
| 2028 | 500,000 | $30M | +$8M |

**Break-even**: Q4 2027

**Upside potential** для инвесторов.

---

## Unit Economics

### Average Revenue Per User (ARPU)

**Calculations**:
```
Free users: $0
Premium users ($4.99/мес): $59.88/год
Family users ($9.99/мес): $119.88/год

Weighted ARPU:
- Year 1: 80% Premium, 20% Family → $60/год
- Year 2: 75% Premium, 25% Family → $65/год
- Year 3: 70% Premium, 30% Family → $68/год
```

### Customer Acquisition Cost (CAC)

**Channels и стоимость**:
| Channel | CAC | % Mix (Year 1) |
|---------|-----|----------------|
| Organic (SEO, content) | $20 | 20% |
| Social media ads | $70 | 40% |
| Partnerships (schools) | $30 | 15% |
| Referral program | $25 | 15% |
| Influencer marketing | $100 | 10% |

**Blended CAC**: $60 (Year 1) → $50 (Year 3, economies of scale)

### Lifetime Value (LTV)

**Calculation**:
```
LTV = ARPU × Average Customer Lifetime
Average Lifetime = 1 / Churn Rate

Year 1: $60 × (1 / 0.15) = $60 × 6.67 = $400
Year 2: $65 × (1 / 0.12) = $65 × 8.33 = $542
Year 3: $68 × (1 / 0.10) = $68 × 10 = $680

Conservative estimate for pitch: $240 (4-year retention)
```

### LTV / CAC Ratio

**Target**: 3:1 или выше (healthy)

**Our metrics**:
- Year 1: $240 / $60 = **4:1** ✅
- Year 2: $270 / $55 = **4.9:1** ✅
- Year 3: $300 / $50 = **6:1** ✅ (excellent)

---

## Cost Structure

### Cost of Goods Sold (COGS) — ~35%

**Components**:
1. **Cloud infrastructure** (AWS): 15-20%
   - Compute (EKS): $15K/мес → $50K/мес (scaling)
   - Database (RDS): $5K/мес → $15K/мес
   - Storage (S3): $2K/мес → $8K/мес
   - Data transfer: $3K/мес → $10K/мес

2. **ML inference costs**: 5-8%
   - GPU instances: $5K/мес → $20K/мес
   - Third-party APIs (если используется): $2K/мес

3. **Payment processing**: 3%
   - Stripe fees: 2.9% + $0.30 per transaction

4. **Support costs**: 5%
   - Customer support tools (Zendesk, Intercom)
   - Support team (outsourced initially)

**Total COGS**: 28-35% of revenue (target: 30-32%)

### Operating Expenses (OpEx)

#### 1. Team Costs (50-60% of OpEx)

**2026** (5-7 people):
```
CEO (founder): $120K salary + equity
CTO (founder): $120K salary + equity
Mobile Engineer: $150K
Backend Engineer: $140K
Part-time Designer: $80K (contract)
Part-time Marketing: $60K (contract)

Total: ~$670K/year
```

**2027** (12-15 people):
```
+ ML Engineer: $160K
+ Full-time Designer: $130K
+ Marketing Lead: $140K
+ Customer Success: $80K
+ SRE/DevOps: $150K
+ 2-3 more engineers: $420K

Total: ~$2.0M/year
```

**2028** (25-30 people):
```
+ Product Manager: $150K
+ Head of Sales (Enterprise): $180K
+ 5 more engineers: $750K
+ 3 support staff: $210K
+ Legal/Compliance: $120K

Total: ~$4.5M/year
```

#### 2. Инфраструктура (10-15% of OpEx)

- AWS costs (see COGS)
- Tools & Software: $50K → $150K/year
  - GitHub, Slack, Notion, Figma, etc.
  - Monitoring (Datadog, Sentry)
  - Analytics (Mixpanel, Amplitude)

#### 3. Маркетинг и продажи (25-30% of OpEx)

**2026**: $300K
- Performance ads: $150K
- Content marketing: $50K
- Partnerships: $50K
- Events/conferences: $30K
- Influencer marketing: $20K

**2027**: $1.2M (scaling)
**2028**: $2.5M (aggressive growth)

#### 4. Юридические и compliance (5-10% of OpEx)

- Legal counsel: $50K → $150K/year
- COPPA/GDPR compliance audits: $30K/year
- Insurance (D&O, cyber): $20K → $50K/year
- Patents/IP: $20K/year

#### 5. Admin и прочее (5-10% of OpEx)

- Accounting: $30K → $80K/year
- Recruiting: $40K → $100K/year
- Office (if needed): $0 → $100K/year (remote-first)
- Travel: $20K → $60K/year

---

## Funding Requirements

### Seed Round: $1.5M - $2M

**Runway**: 18-24 months (to Series A)

**Burn Rate**:
```
2026: ~$70K/month → ~$840K/year
First 6 months: $40K/month (lean)
Months 7-12: $70K/month (hiring)
Months 13-18: $90K/month (scaling)

Total 18-month burn: ~$1.2M
Buffer: $300-500K
→ Total need: $1.5-1.7M
```

**Milestones для Series A**:
- 25,000+ платных users
- $500K+ ARR
- Clear path to $5M ARR
- Product-market fit validated
- Strong retention metrics

### Series A: $5M - $10M (2027)

**Use of funds**:
- Scaling team (10 → 30 people)
- Aggressive marketing ($2M+/year)
- Android development completion
- Enterprise tier build-out
- International expansion prep

**Valuation target**: $30-50M pre-money

---

## Key Performance Indicators (KPIs)

### North Star Metric

**Children Protected Daily** = Active children using the platform

### Product Metrics

1. **DAU/MAU ratio**: Target 0.6+ (high engagement)
2. **Retention**:
   - Day 1: 70%+
   - Week 1: 55%+
   - Month 1: 40%+
   - Month 6: 30%+
3. **Content checks per child per day**: 50+ (shows usage)
4. **Parental engagement**: 60%+ parents check dashboard weekly

### Business Metrics

1. **MRR Growth Rate**: 15-20% month-over-month (early stage)
2. **Churn Rate**: < 15% annual
3. **CAC Payback Period**: < 12 months
4. **LTV/CAC ratio**: > 3:1
5. **Net Revenue Retention**: 100%+ (upsells to Family tier)

### ML/Product Quality Metrics

1. **False Positive Rate**: < 5%
2. **False Negative Rate**: < 2%
3. **ML Inference Latency**: p95 < 500ms
4. **API Uptime**: 99.5%+

---

## Financial Model Methodology

### Revenue Model

**Formula**:
```
Revenue = (Paid Users) × (ARPU)

Paid Users = (Free Users) × (Conversion Rate)
Free Users = (Previous Month Users) × (1 - Churn Rate) + (New Signups)

New Signups = (Marketing Spend) / (CAC) + (Organic Growth)
```

### Cohort Analysis

**Example Cohort** (Jan 2026, 1000 users):
| Month | Active Users | Revenue | Cumulative Revenue |
|-------|--------------|---------|-------------------|
| 1 | 1000 | $5,000 | $5,000 |
| 3 | 850 | $4,250 | $13,500 |
| 6 | 700 | $3,500 | $25,000 |
| 12 | 550 | $2,750 | $45,000 |
| 24 | 400 | $2,000 | $80,000 |

**LTV from this cohort**: $80,000 / 1000 = $80 per user (conservative)

---

## Risks and Mitigation

### Financial Risks

1. **Higher CAC than projected**
   - Mitigation: Focus на organic channels, referral program
   - Pivot: B2B2C model (schools) если B2C CAC too high

2. **Lower conversion rate**
   - Mitigation: Improve free tier value, better onboarding
   - Test: A/B testing pricing tiers

3. **Higher churn**
   - Mitigation: Product improvements, customer success team
   - Monitor: Weekly cohort analysis

4. **Runway shortfall**
   - Mitigation: Maintain 6-month buffer, bridge round option
   - Backup: Cut non-essential expenses, extend Series A timeline

### Market Risks

1. **Competition from big tech** (Apple, Google)
   - Mitigation: Superior features, partnerships option
   
2. **Regulatory changes** (COPPA, GDPR)
   - Mitigation: Proactive compliance, legal advisors

---

## Appendix: Detailed CSV Model

Смотрите файл **`financial_model.csv`** для:
- Месячный breakdown на 36 месяцев
- Детальные CAPEX и OPEX категории
- Cohort analysis
- Sensitivity analysis (CAC, churn, conversion)
- Cash flow projections

---

**Автор**: Finance Team, Rork-Kiku  
**Версия**: v0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Требует валидации с financial advisor  
**Обновление**: Quarterly по мере получения actual data
