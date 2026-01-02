# Финансовая модель kiku — Описание

## Обзор

Этот документ описывает финансовую модель kiku на 3 года (2024-2026) с тремя сценариями: консервативным, базовым и оптимистичным. Детальная модель представлена в файле `financial_model.csv`.

---

## Assumptions (Предпосылки)

### Общие предпосылки

**Продуктовые:**
- Launch: Q2 2024 (April)
- Platforms: iOS, Android, Web
- Business model: Freemium + subscription

**Ценообразование:**
- Free tier: До 100 сообщений/месяц
- Basic: $4.99/месяц или $49/год (save 18%)
- Premium: $9.99/месяц или $99/год (save 17%)
- Enterprise: Custom pricing (avg $5/месяц per license, bulk)

**Conversion rates:**
- Free → Paid: 20% (industry benchmark для parental control apps)
- Basic vs Premium split: 70% / 30%
- Annual vs Monthly: 40% / 60% (annual предпочитают для экономии)

**Retention:**
- Monthly churn: 5% (60% annual retention)
- LTV: 3 years average (36 months)

**Customer Acquisition:**
- CAC: $30 (blended — organic + paid)
- Organic vs Paid: Year 1 (30/70), Year 2 (50/50), Year 3 (60/40)
- Channels: Facebook/Instagram ads, SEO, content, referrals, partnerships

---

## Сценарии

### Сценарий 1: Консервативный (Pessimistic)

**Assumptions:**
- Slow user growth (market resistance, competition)
- Higher churn (6% monthly)
- Higher CAC ($40)
- Lower conversion (15% free→paid)

**Targets:**
- 2024: 5,000 users → 750 paying → $45K ARR
- 2025: 20,000 users → 3,000 paying → $180K ARR
- 2026: 60,000 users → 9,000 paying → $540K ARR

**Outcome:** Break-even не достигнут к концу 2026, требуется дополнительный раунд.

---

### Сценарий 2: Базовый (Base Case)

**Assumptions:**
- Moderate user growth (expected PMF validation)
- Standard churn (5% monthly)
- Expected CAC ($30)
- Industry-standard conversion (20%)

**Targets:**
- 2024: 10,000 users → 2,000 paying → $120K ARR
- 2025: 50,000 users → 10,000 paying → $600K ARR
- 2026: 150,000 users → 30,000 paying → $1.8M ARR

**Outcome:** Negative EBITDA в 2026, profitability в 2027 с 300K+ paying users.

---

### Сценарий 3: Оптимистичный (Optimistic)

**Assumptions:**
- Rapid user growth (viral adoption, strong PMF)
- Low churn (4% monthly, 70% annual retention)
- Low CAC ($20, due to virality and partnerships)
- High conversion (25%)

**Targets:**
- 2024: 20,000 users → 5,000 paying → $300K ARR
- 2025: 100,000 users → 25,000 paying → $1.5M ARR
- 2026: 300,000 users → 75,000 paying → $4.5M ARR

**Outcome:** Profitability в 2026, high growth, Series B potential.

---

## Revenue Model

### Subscription Revenue

**ARPU (Average Revenue Per User) calculation:**
```
Basic (70%):  $4.99/month × 12 × 70% = $41.93/year
Premium (30%): $9.99/month × 12 × 30% = $35.96/year
Blended ARPU: $41.93 + $35.96 = $77.89/year

With annual discount (40% users):
Annual users: $49 (Basic, 70%) + $99 (Premium, 30%) = $64.00 weighted
Monthly users: $59.88 (Basic) + $119.88 (Premium) = $89.95 weighted
Blended: $64 × 40% + $90 × 60% = $25.60 + $54.00 = $79.60/year

Conservative ARPU: $60/year (after discounts, promos, churn)
```

**Enterprise Revenue (B2B):**
- Schools: $5/month per license × 50 students per school = $250/month = $3K/year per school
- Target: 10 schools in 2024, 50 in 2025, 200 in 2026
- Enterprise ARR: $30K (2024), $150K (2025), $600K (2026)

**Total Revenue:**
```
Year 1 (2024):
  B2C: 2,000 paying × $60 = $120K
  B2B: 10 schools × $3K = $30K
  Total: $150K ARR

Year 2 (2025):
  B2C: 10,000 × $60 = $600K
  B2B: 50 × $3K = $150K
  Total: $750K ARR

Year 3 (2026):
  B2C: 30,000 × $60 = $1.8M
  B2B: 200 × $3K = $600K
  Total: $2.4M ARR
```

---

## Cost Structure

### 1. Team Costs (CAPEX)

**Year 1 (2024):**
```
Founder (CEO): $50K (below market, startup salary)
CTO: $80K
Product Lead: $60K
ML Engineer: $70K
Total: $260K
```

**Year 2 (2025):**
```
Existing team: $260K
+2 Mobile Devs: $140K ($70K each)
+1 Backend Dev: $80K
+1 Community/Support: $50K
+1 Marketing Lead: $70K
Total: $600K
```

**Year 3 (2026):**
```
Existing team: $600K
+2 Devs: $160K
+1 SRE: $90K
+1 QA: $60K
+1 Data Analyst: $70K
+1 Sales (B2B): $80K
+Salary increases (10%): $60K
Total: $1.12M
```

### 2. Infrastructure Costs (OPEX)

**Cloud hosting (AWS/GCP):**
```
Year 1: 10K users → $20K/year ($2K/month)
Year 2: 50K users → $60K/year ($5K/month)
Year 3: 150K users → $180K/year ($15K/month)
```

**AI API costs (OpenAI/Anthropic):**
```
Assumptions:
- 20 messages/user/day on average
- $0.01 per text analysis (GPT-4 pricing)
- Premium users: 30% also use image analysis ($0.05/image, 5 images/day)

Year 1: 2K paying users
  Text: 2K × 20 msg × 365 days × $0.01 = $146K
  Images (Premium 30%): 600 × 5 × 365 × $0.05 = $54.75K
  Total AI: $200K/year

Year 2: 10K paying users → $1M AI costs/year
Year 3: 30K paying users → $3M AI costs/year (PROBLEM!)

Mitigation:
- Negotiate volume discounts with OpenAI (50% off at scale)
- Self-host open-source LLM (LLaMA 3, Mixtral) after $500K ARR
  → Reduce AI costs to $500K/year by 2026

Conservative estimate with mitigation:
Year 1: $30K (low volume, paid API)
Year 2: $90K (growing volume, starting discounts)
Year 3: $220K (self-hosted + API hybrid)
```

**Database, storage, CDN:**
```
Year 1: $10K
Year 2: $30K
Year 3: $80K
```

**Total Infrastructure:**
```
Year 1: $60K
Year 2: $180K
Year 3: $480K
```

### 3. Marketing & Sales (OPEX)

**Customer Acquisition:**
```
CAC: $30
New paying users:
  Year 1: 2,000 → $60K
  Year 2: 8,000 (net new) → $240K
  Year 3: 20,000 (net new) → $600K
```

**Content & Brand:**
```
Year 1: $20K (SEO, blog, social media)
Year 2: $60K (increased content, events)
Year 3: $120K (brand campaigns, PR)
```

**Total Marketing:**
```
Year 1: $80K
Year 2: $300K
Year 3: $720K
```

### 4. Moderation & Support (OPEX)

**Human moderators (for flagged content):**
```
Year 1: 1 part-time moderator → $20K
Year 2: 2 full-time → $80K
Year 3: 5 full-time → $200K
```

**Customer support:**
- Included in Community/Support team costs (Year 2+)
- Year 1: Founder handles support

**Total Moderation:**
```
Year 1: $20K
Year 2: $80K
Year 3: $200K
```

### 5. Operations & Other (OPEX)

**Legal & Compliance:**
```
Year 1: $30K (initial legal setup, privacy policy, incorporation)
Year 2: $40K (ongoing compliance, contracts)
Year 3: $60K (international expansion, IP)
```

**Accounting & Finance:**
```
Year 1: $10K (outsourced accountant)
Year 2: $20K
Year 3: $40K (CFO consultant or fractional CFO)
```

**Tools & Software:**
```
SaaS tools (Notion, Figma, GitHub, Slack, etc.): $10K/year
Data tools (analytics, monitoring): $10K/year → $30K/year (2026)
```

**Office & Travel:**
```
Year 1: $10K (remote team, minimal travel)
Year 2: $30K (conferences, team meetups)
Year 3: $50K (office space optional, more travel)
```

**Insurance:**
```
Year 1: $10K (D&O, general liability)
Year 2: $20K
Year 3: $30K
```

**Total Operations:**
```
Year 1: $70K
Year 2: $120K
Year 3: $210K
```

---

## Summary by Year

### Year 1 (2024)

| Category | Amount |
|----------|--------|
| **Revenue** | $150K |
| Team | $260K |
| Infrastructure | $60K |
| Marketing | $80K |
| Moderation | $20K |
| Operations | $70K |
| **Total Costs** | $490K |
| **EBITDA** | **-$340K** |
| **Monthly burn** | $28K |

### Year 2 (2025)

| Category | Amount |
|----------|--------|
| **Revenue** | $750K |
| Team | $600K |
| Infrastructure | $180K |
| Marketing | $300K |
| Moderation | $80K |
| Operations | $120K |
| **Total Costs** | $1,280K |
| **EBITDA** | **-$530K** |
| **Monthly burn** | $44K |

### Year 3 (2026)

| Category | Amount |
|----------|--------|
| **Revenue** | $2.4M |
| Team | $1.12M |
| Infrastructure | $480K |
| Marketing | $720K |
| Moderation | $200K |
| Operations | $210K |
| **Total Costs** | $2.73M |
| **EBITDA** | **-$330K** |
| **Monthly burn** | $28K |

**Примечание:** EBITDA становится положительной в 2027 при 100K+ paying users ($6M ARR).

---

## Funding Requirements

### Pre-Seed Round (Current)

**Amount:** $500K  
**Use:** Year 1 operations + buffer for Year 2  
**Runway:** 12-18 months  
**Milestones:** PMF, 10K users, $50K MRR

### Seed Round (2025)

**Amount:** $3-5M  
**Use:** Scale to 100K users, international expansion  
**Runway:** 24 months  
**Milestones:** 100K users, $500K MRR, B2B traction

### Series A (2026)

**Amount:** $10-15M  
**Use:** Profitability push, global scale, product expansion  
**Milestones:** 500K users, $3M ARR, path to profitability

---

## Key Metrics & KPIs

**User Metrics:**
- Total Users (free + paid)
- Paying Users (conversion rate)
- MAU (Monthly Active Users)
- DAU/MAU ratio (engagement)

**Revenue Metrics:**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)

**Growth Metrics:**
- User growth rate (MoM, YoY)
- Revenue growth rate (MoM, YoY)
- CAC (Customer Acquisition Cost)
- LTV/CAC ratio (target > 3)

**Unit Economics:**
- Gross Margin (target > 70%)
- Contribution Margin (after CAC)
- Payback Period (target < 12 months)

**Retention:**
- Monthly churn rate (target < 5%)
- Annual retention (target > 60%)
- Cohort retention curves

**Operational:**
- Cash runway (months)
- Burn rate (monthly)
- Time to profitability

---

## Sensitivity Analysis

**Variables that significantly impact financials:**

1. **Conversion rate (free → paid):**
   - 15% → ARR decreases by 25%
   - 25% → ARR increases by 25%

2. **Churn rate:**
   - 6% monthly → LTV decreases by 30%
   - 4% monthly → LTV increases by 40%

3. **CAC:**
   - $40 → Payback period +4 months
   - $20 → Payback period -4 months

4. **AI costs:**
   - No self-hosting → Year 3 costs +$2M
   - Successful self-hosting → Year 3 costs -$500K

5. **Enterprise traction:**
   - 500 schools by 2026 → Additional $1.5M ARR
   - 0 schools → B2C only, slower growth

---

## Break-Even Analysis

**When do we reach profitability?**

**Base case:**
- 2027 with 100K paying users ($6M ARR)
- Costs at $5M (team of 20, efficient operations)
- EBITDA: +$1M

**Optimistic case:**
- Late 2026 with 75K paying users ($4.5M ARR)
- Costs at $4M (lean team, high efficiency)
- EBITDA: +$500K

**Pessimistic case:**
- 2028+ or requires additional funding
- Need Series B to reach profitability

---

## Exit Scenarios (Long-term)

**Acquisition (2027-2029):**
- **Acquirers:** Bark, Qustodio, Kaspersky, telecom operators, Apple/Google
- **Valuation:** 8-10x ARR (SaaS standard)
- **If $10M ARR:** $80-100M exit
- **If $20M ARR:** $160-200M exit

**IPO (2030+):**
- Requires $50M+ ARR, profitability, proven unit economics
- Valuation: 15-20x ARR
- Less likely for niche market, but possible with global scale

---

## Приложения

**Детальная модель:** См. `financial_model.csv`

**Включает:**
- Ежемесячная разбивка (Year 1)
- Ежеквартальная разбивка (Year 2-3)
- 3 сценария (консервативный, базовый, оптимистичный)
- Все revenue и cost категории
- Cash flow analysis
- Sensitivity tables

---

**Статус:** ЧЕРНОВИК для ревью  
**Последнее обновление:** Январь 2024  
**Автор:** kiku Finance Team  
**Контакт:** [FOUNDERS_EMAIL]
