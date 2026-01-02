# Финансовая модель: Обзор

## Описание финансовой модели Rork-Kiku

Данный документ описывает финансовую модель проекта Rork-Kiku с тремя сценариями развития: консервативным, базовым и оптимистичным.

## Три сценария

### 1. Консервативный сценарий (Bear Case)

**Предположения:**
- Медленное принятие продукта рынком
- Conversion rate Free → Paid: 5-8%
- CAC выше ожидаемого ($50-70)
- Retention: D30 = 40%, D90 = 25%
- Более длинный sales cycle для Enterprise
- Конкуренция более агрессивная, чем ожидалось

**Ключевые метрики:**
- **Year 1:** 5,000 users, 250 paid, $25K revenue
- **Year 2:** 20,000 users, 1,600 paid, $158K revenue
- **Year 3:** 80,000 users, 8,000 paid, $792K revenue
- **Year 5:** 300,000 users, 45,000 paid, $4.5M revenue

**Путь к прибыльности:** 5+ лет

**Требуемое финансирование:** $500K Seed, $2M Series A, возможно Bridge round

### 2. Базовый сценарий (Base Case)

**Предположения:**
- Нормальное принятие продукта согласно плану
- Conversion rate Free → Paid: 10-15%
- CAC в рамках бюджета ($30-50)
- Retention: D30 = 50%, D90 = 35%
- Enterprise partnerships по плану
- Moderate competition

**Ключевые метрики:**
- **Year 1:** 10,000 users, 500 paid, $50K revenue
- **Year 2:** 50,000 users, 5,000 paid, $495K revenue
- **Year 3:** 200,000 users, 30,000 paid, $2.97M revenue
- **Year 5:** 1,000,000 users, 200,000 paid, $19.8M revenue

**Путь к прибыльности:** Year 3 EBITDA positive, Year 4 net profit positive

**Требуемое финансирование:** $1M Seed, $3-5M Series A

**Это базовый сценарий, используемый в pitch deck.**

### 3. Оптимистичный сценарий (Bull Case)

**Предположения:**
- Вирусный рост через word-of-mouth и PR
- Conversion rate Free → Paid: 20-25%
- CAC ниже ожидаемого ($20-30) из-за organic growth
- Retention: D30 = 70%, D90 = 50%
- Быстрые Enterprise partnerships и schools adoption
- Слабая конкуренция, first-mover advantage

**Ключевые метрики:**
- **Year 1:** 25,000 users, 2,500 paid, $248K revenue
- **Year 2:** 150,000 users, 30,000 paid, $2.97M revenue
- **Year 3:** 600,000 users, 150,000 paid, $14.85M revenue
- **Year 5:** 3,000,000 users, 900,000 paid, $89.1M revenue

**Путь к прибыльности:** Year 2 EBITDA positive

**Требуемое финансирование:** $1M Seed, $5M Series A, $20M Series B для global expansion

## Ключевые драйверы затрат

### 1. Team Costs (60-70% от OpEx)

**Структура команды по годам:**

**Year 1 (Post-Seed):**
- 2 Co-founders: $100K + $100K = $200K
- 3 Mobile Engineers: 3 × $90K = $270K
- 2 Backend Engineers: 2 × $85K = $170K
- 1 ML Engineer: $100K
- 1 Product Designer: $70K
- 1 Product Manager (part-time): $50K
- **Total:** $860K

**Year 2 (Post-Series A):**
- Founders: $250K
- Engineers (8 total): $720K
- Product team (PM, Designer): $200K
- QA Engineer: $70K
- Community Manager: $50K
- Part-time roles: $100K
- **Total:** $1.39M

**Year 3:**
- Scale team to 20-25 FTE
- **Total team costs:** $2M - $2.5M

**Assumptions:**
- Average engineer salary: $80-100K (remote-first, mix of locations)
- Annual raises: 5-10%
- Benefits & taxes: 25% on top of salary (included in numbers)

### 2. Infrastructure Costs

**Components:**

**Cloud Hosting (AWS):**
- Year 1: $3K/month → $36K/year (10K users)
- Year 2: $8K/month → $96K/year (50K users)
- Year 3: $25K/month → $300K/year (200K users)
- **Scaling factor:** ~$0.15-0.20 per active user per month

**Storage (S3 + CDN):**
- Year 1: $1K/month → $12K/year
- Year 2: $5K/month → $60K/year
- Year 3: $20K/month → $240K/year
- **Scaling factor:** depends on media upload rate

**Database (RDS):**
- Year 1: $500/month → $6K/year
- Year 2: $1.5K/month → $18K/year
- Year 3: $5K/month → $60K/year

**Redis/Caching:**
- Year 1: $200/month → $2.4K/year
- Year 2: $800/month → $9.6K/year
- Year 3: $2K/month → $24K/year

**Total Infrastructure Year 1:** ~$60K  
**Total Infrastructure Year 2:** ~$184K  
**Total Infrastructure Year 3:** ~$624K

### 3. ML Costs (модерация)

**ML API costs per item:**
- Text moderation: $0.001 per request (OpenAI)
- Image moderation: $0.01 per image (AWS Rekognition)
- Video moderation: $0.05 per video (frame-by-frame)

**Assumptions:**
- Average uploads per paid user per month: 20 items (mix of text, images, video)
- 70% images, 20% video, 10% text

**Calculation:**
- Year 1 (500 paid users): 500 × 20 × 12 = 120,000 items
  - Cost: ~$1,200/year
- Year 2 (5,000 paid users): 5,000 × 20 × 12 = 1.2M items
  - Cost: ~$12K/year
- Year 3 (30,000 paid users): 30,000 × 20 × 12 = 7.2M items
  - Cost: ~$72K/year

**ML Costs с custom models (Year 2+):**
- GPU instances для inference: $500-2K/month
- Model training: $5K/quarter
- **Total ML Year 2:** ~$30K  
- **Total ML Year 3:** ~$100K

### 4. Moderation Costs (ручная модерация)

**Assumptions:**
- 20% контента требует ручной модерации
- Стоимость модератора: $15/hour (outsourced)
- Время на проверку: 2 минуты на item
- Модераторы работают 8-часовой смены

**Calculation:**
- Year 1: 120,000 items × 20% = 24,000 items to review
  - Time: 24,000 × 2 min = 48,000 min = 800 hours
  - Cost: 800 × $15 = $12K/year
- Year 2: 1.2M items × 20% = 240,000 items
  - Cost: $120K/year (или 2-3 FTE moderators)
- Year 3: 7.2M items × 20% = 1.44M items
  - Cost: $720K/year (или 10-15 FTE moderators, возможно in-house)

**Note:** По мере улучшения ML моделей, процент ручной модерации может снизиться до 10-15%.

### 5. Marketing & Sales

**Year 1 (Pilot + Launch):**
- Performance marketing: $50K
- Content marketing: $20K
- PR & events: $15K
- Partnerships: $10K
- **Total:** $95K

**Year 2 (Growth):**
- Performance marketing: $150K
- Content marketing: $40K
- PR & events: $30K
- Partnerships: $20K
- Referral program: $10K
- **Total:** $250K

**Year 3 (Scale):**
- Performance marketing: $400K
- Content marketing: $60K
- PR & events: $50K
- Partnerships: $40K
- Referral program: $30K
- **Total:** $580K

**CAC assumptions:**
- Year 1: $50 (high due to early stage, education needed)
- Year 2: $40 (improving efficiency)
- Year 3: $30 (economies of scale, brand recognition)

### 6. Other Operating Expenses

**SaaS tools & subscriptions:**
- Analytics: $1K/month → $12K/year
- CI/CD, monitoring: $500/month → $6K/year
- Email/SMS services: $500/month → $6K/year
- Other tools: $1K/month → $12K/year
- **Total:** $36K/year (Year 1), scales to $60K/year

**Legal & Compliance:**
- Year 1: $25K (setup, GDPR/COPPA review)
- Year 2: $30K (ongoing compliance)
- Year 3+: $50K/year (SOC 2, audits)

**Office & Operations:**
- Remote-first: minimal office costs
- Co-working budget: $500/person/month (optional)
- Travel: $20K/year
- Miscellaneous: $10K/year

## Ключевые драйверы доходов

### 1. Subscription Revenue

**Tiers:**
- Free: $0 (но создаёт virality и data для ML)
- Premium: $9.99/month или $99/year (17% discount)
- Family: $14.99/month или $149/year
- Enterprise: custom pricing ($500-5,000/school/year)

**Conversion funnel:**
- Free users → 10-15% convert to Premium (базовый сценарий)
- Premium → 20% upgrade to Family (multiple children)
- Trial → 60% convert to paid after 14-day trial

**Revenue mix (Year 3, базовый):**
- Premium (70%): 21,000 users × $99 = $2.08M
- Family (25%): 7,500 users × $149 = $1.12M
- Enterprise (5%): 50 schools × $2,000 = $100K
- **Total:** $3.3M

### 2. Content Marketplace (Year 2+)

**Model:**
- Third-party creators upload educational content
- Revenue share: 70% creator, 30% Rork-Kiku
- Average content price: $2-10
- Transaction volume: 5% of users buy content monthly

**Projections:**
- Year 2: $10K revenue
- Year 3: $50K revenue
- Year 5: $500K revenue

### 3. Affiliate & Partnerships (Year 2+)

**Partnerships:**
- Детские товары (игрушки, книги)
- Образовательные платформы
- Family services (insurance, travel)

**Commission:** 5-10% от sale

**Projections:**
- Year 2: $5K revenue
- Year 3: $20K revenue
- Year 5: $200K revenue

### 4. Anonymous Analytics (B2B) (Year 3+)

**Model:**
- Продажа анонимизированных insights исследователям, НКО
- Price: $10K-50K per dataset

**Projections:**
- Year 3: $30K revenue
- Year 5: $200K revenue

## Чувствительность модели

### Sensitivity Analysis

**Наиболее чувствительные переменные:**

1. **Conversion Rate (Free → Paid):**
   - +5% conversion → +50% revenue
   - -5% conversion → -50% revenue
   - **Высокая чувствительность**

2. **CAC:**
   - +$20 CAC → need +30% funding
   - -$20 CAC → faster path to profitability
   - **Средняя чувствительность**

3. **Retention (D30, D90):**
   - +10% retention → +30% LTV
   - -10% retention → -30% LTV, need to re-acquire users
   - **Высокая чувствительность**

4. **ARPU (через upsell):**
   - +$2/month ARPU → +20% revenue
   - -$2/month ARPU → -20% revenue
   - **Средняя чувствительность**

5. **Team Size:**
   - +5 engineers → +$500K costs/year
   - Scaling team too fast → burn rate issue
   - **Средняя чувствительность**

### Break-even Analysis

**Базовый сценарий:**
- Break-even (EBITDA): Month 30-36 (Year 3)
- Break-even (Net Profit): Month 42-48 (Year 4)

**Условия для break-even:**
- 25,000+ paid users
- $2.5M+ annual revenue
- Team size: 20-25 FTE
- Marketing efficiency: CAC < $35

**Консервативный сценарий:**
- Break-even: Year 5+

**Оптимистичный сценарий:**
- Break-even (EBITDA): Year 2
- Break-even (Net Profit): Year 3

## Key Assumptions Summary

| Parameter | Conservative | Base | Optimistic |
|-----------|-------------|------|------------|
| Year 1 Users | 5K | 10K | 25K |
| Year 3 Users | 80K | 200K | 600K |
| Year 5 Users | 300K | 1M | 3M |
| Conversion (Free→Paid) | 5-8% | 10-15% | 20-25% |
| CAC | $50-70 | $30-50 | $20-30 |
| ARPU | $80/yr | $99/yr | $110/yr |
| D30 Retention | 40% | 50% | 70% |
| Gross Margin | 70% | 75% | 80% |
| Break-even | Year 5+ | Year 3 | Year 2 |

## Риски и митигация

**Financial Risks:**

1. **Недостаточная конверсия Free → Paid**
   - Mitigation: улучшение premium features, trial optimization, onboarding

2. **Высокий churn**
   - Mitigation: focus на product quality, engagement features, customer success

3. **Рост CAC**
   - Mitigation: organic channels, referral program, brand building

4. **Медленный рост пользователей**
   - Mitigation: partnerships со школами, PR, community building

5. **Увеличение модерации costs**
   - Mitigation: улучшение ML models, автоматизация, процессная оптимизация

## Заключение

Финансовая модель Rork-Kiku основана на realistic assumptions и подтверждается comparable companies в parental control и child safety секторах. Базовый сценарий показывает путь к $20M revenue и profitability к Year 4-5, что делает компанию привлекательной для Series A и potential acquisition.

Детальная финансовая модель доступна в `financial_model.csv`.

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
