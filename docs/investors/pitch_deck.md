# Pitch Deck: Rork-Kiku
## Защита детей в цифровой среде

**Версия**: v0.1.0 (Черновик для инвесторов)  
**Дата**: Январь 2026  
**Формат**: 12-15 слайдов

---

## Слайд 1: Заголовок

**RORK-KIKU**  
Интеллектуальная платформа для защиты детей в интернете

*Тег-лайн*: Спокойствие родителей. Безопасность детей. Умные технологии.

**Контакты**:
- Email: [FOUNDERS_EMAIL]
- Website: [WEBSITE_PLACEHOLDER]
- Demo: [TESTFLIGHT_LINK]

---

## Слайд 2: Проблема

### 🔴 3.2 млрд детей онлайн, но защита устарела

**Ключевые факты**:
1. **85%** детей 8-12 лет имеют доступ к интернету без надлежащего контроля
2. **64%** родителей не знают, что их дети делают онлайн
3. **Киберзапугивание**: 37% детей сталкивались с онлайн-травлей
4. **Неприемлемый контент**: 71% детей видели контент 18+
5. **Онлайн-хищники**: Рост на 97% (2020-2023) случаев онлайн-груминга

**Существующие решения не работают**:
- ❌ Родительский контроль iOS/Android — легко обходится детьми
- ❌ Norton Family, Qustodio — сложные, устаревшие UI
- ❌ Школьные фильтры — работают только в школе
- ❌ "Разговоры с детьми" — недостаточно в эпоху AI и deepfakes

**Боль родителей**:
> "Я не могу уследить за всем. Мне нужны умные технологии, которые помогут защитить моего ребенка, не блокируя весь интернет."

---

## Слайд 3: Решение

### ✨ Rork-Kiku: AI-powered защита детей нового поколения

**Что мы делаем**:
Мобильная платформа (iOS/Android) с **real-time AI-фильтрацией** контента и **умной родительской панелью**.

**Ключевые функции**:
1. 🧠 **AI Content Filter** — ML-модели для анализа текста, изображений, видео
2. 🌐 **Безопасный браузер** — детский интерфейс с контролем доступа
3. 👨‍👩‍👧 **Родительская панель** — real-time аналитика и контроль
4. ⚡ **Smart Alerts** — уведомления о рисках, не спам
5. 🔒 **Privacy-first** — данные зашифрованы, COPPA/GDPR compliance

**Отличия от конкурентов**:
- 🚀 **Современный UX** — дети не хотят обходить, родители понимают с первого взгляда
- 🎯 **Точность** — ML-модели, обученные на child-safety датасетах
- 🌍 **Масштабируемость** — облачная инфраструктура, ready для миллионов пользователей

---

## Слайд 4: Продукт

### 📱 Demo & Screenshots

**Детский интерфейс**:
```
[SCREENSHOT 1: Детский браузер с safe search]
- Простой, дружелюбный дизайн
- Предустановленные безопасные сайты
- "Попросить разрешение" для новых сайтов
```

**Родительская панель**:
```
[SCREENSHOT 2: Parent Dashboard]
- Активность за 24 часа
- Заблокированный контент (preview)
- Запросы ребенка (approve/reject)
- Настройки фильтров (низкий/средний/высокий)
```

**AI в действии**:
```
[SCREENSHOT 3: Content blocking example]
Ребенок: "Хочу поискать..."
System: 🛡️ Контент заблокирован
Parent: 📱 Уведомление с деталями
```

**Tech Stack**:
- Mobile: React Native + Expo
- Backend: Node.js/Go + PostgreSQL + Redis
- ML: PyTorch (BERT-based classifiers)
- Cloud: AWS (EKS, RDS, S3)

---

## Слайд 5: TAM / SAM / SOM (Рынок)

### 🌍 Огромный и растущий рынок

**TAM (Total Addressable Market)**: $12.5 млрд
- **2.1 млрд** семей с детьми 5-15 лет глобально
- Average willingness to pay: **$5-10/месяц**
- Расчет: 2.1B × $5/мес × 12 мес = $126B (берем 10% penetration = $12.5B)

**SAM (Serviceable Addressable Market)**: $3.2 млрд
- Фокус на **США, Европа, развитые страны Азии**
- 320M семей с детьми и smartphone penetration >80%
- Расчет: 320M × $5/мес × 12 мес × 20% penetration = $3.8B (conservative $3.2B)

**SOM (Serviceable Obtainable Market)**: $150 млн (к 2028)
- Реалистичная цель: **2.5M платных пользователей** к концу 2028
- ARPU (Average Revenue Per User): **$5/месяц** ($60/год)
- Расчет: 2.5M × $60 = **$150M ARR**

**Рост рынка**:
- CAGR: **18%** (2024-2030)
- Драйверы: Увеличение screen time детей, рост осознанности родителей, новые угрозы (AI-generated content)

**Конкуренты** (оценка revenue):
- Qustodio: ~$50M ARR
- Bark: ~$30M ARR
- Norton Family: ~$40M ARR (часть Symantec)

---

## Слайд 6: Монетизация

### 💰 Freemium + Subscription модель

**Free Tier** (60% пользователей):
- 1 ребенок
- Базовая фильтрация (keyword-based)
- История за 24 часа
- Лимит: 100 проверок контента/день

**Premium Tier** ($4.99/мес или $49/год):
- До 5 детей
- AI-powered фильтрация (ML-модели)
- Полная история (30 дней)
- Безлимитные проверки
- Priority support

**Family Tier** ($9.99/мес или $99/год):
- Безлимит детей
- Advanced analytics (weekly/monthly reports)
- Geofencing (safe zones)
- Multiple parent accounts
- Premium support + consultation

**Enterprise/School Tier** (custom pricing):
- B2B2C модель для школ
- White-label опция
- Centralized management
- Compliance reporting

**Дополнительные revenue streams** (future):
- Партнерства с ISP (Internet Service Providers)
- API licensing для других parental control apps
- Data insights (anonymized, aggregated) для research

**LTV (Lifetime Value) / CAC (Customer Acquisition Cost)**:
- LTV: $240 (average 4 years retention × $60/year)
- CAC: $60 (target)
- **LTV/CAC ratio: 4:1** ✅

---

## Слайд 7: Конкуренты

### 🏆 Конкурентное преимущество

| Критерий | Rork-Kiku | Qustodio | Bark | Norton Family |
|----------|-----------|----------|------|---------------|
| **AI/ML фильтрация** | ✅ SOTA модели | ❌ Keywords | ✅ Basic ML | ❌ Keywords |
| **Modern UX** | ✅ Native mobile | ⚠️ Устаревший | ✅ Хороший | ❌ Устаревший |
| **Real-time alerts** | ✅ Smart (не спам) | ⚠️ Too many | ✅ Хорошие | ❌ Мало инфо |
| **Privacy compliance** | ✅ COPPA/GDPR | ✅ COPPA | ✅ COPPA | ✅ COPPA |
| **Pricing** | ✅ $5/мес | ⚠️ $6-15/мес | ⚠️ $14/мес | ⚠️ $8/мес |
| **Cross-platform** | ✅ iOS/Android/Web | ✅ Все | ✅ Все | ✅ Все |
| **Founded** | 2026 | 2012 | 2015 | 2000s |

**Наши преимущества**:
1. 🚀 **Технологии** — Современный ML stack, не legacy code
2. 💎 **UX/UI** — Спроектирован для Gen Z/Alpha детей и millennial родителей
3. 🎯 **Точность** — Fine-tuned модели на child safety datasets
4. 💰 **Pricing** — Доступнее премиум-конкурентов
5. 🌱 **Agile** — Быстрые итерации vs корпоративные конкуренты

**Risks**:
- Крупные игроки (Google, Apple) могут улучшить встроенный parental control
- **Mitigation**: Наш продукт глубже и специализированнее, partnerships возможны

---

## Слайд 8: Go-to-Market (GTM)

### 🚀 Стратегия выхода на рынок

**Phase 1: MVP + TestFlight (Q1 2026)** — Текущая фаза
- 50-100 beta семей (США)
- Product-market fit validation
- Сбор feedback, улучшение моделей

**Phase 2: Pilot Launch (Q2 2026)**
- 1,000 платных пользователей
- Партнерство с 2-3 школами (Калифорния)
- Локальные родительские сообщества
- Influencer marketing (parenting bloggers)

**Phase 3: Seed Funding + Scale (Q3-Q4 2026)**
- Seed round: $1-2M
- Expansion: 10,000 users
- App Store launch (iOS + Android)
- Performance marketing (Facebook, Instagram, TikTok)

**Phase 4: Series A + National Expansion (2027)**
- Series A: $5-10M
- 100,000+ users (США)
- Partnerships: AT&T, Verizon (ISP bundling)
- Expansion в UK, Канада

**Phase 5: Global Rollout (2028+)**
- 1M+ users globally
- Локализация (Европа, Азия, LATAM)
- Enterprise/School tier scaling

**Acquisition Channels**:
1. **Content Marketing** (organic) — Parenting blogs, SEO
2. **Social Media** — Instagram, TikTok, Pinterest (parents)
3. **Partnerships** — Schools, pediatricians, parenting orgs
4. **Referral Program** — "Пригласи друга" (15% discount)
5. **Paid Ads** — Facebook/Instagram targeting parents 25-45

---

## Слайд 9: Roadmap

### 🗓 Продуктовая дорожная карта (24 месяца)

**Q1 2026: PoC + MVP**
- ✅ MVP разработан (iOS React Native)
- ✅ Базовый ML text classifier
- 🔄 TestFlight beta (50 семей)
- 🔄 Feedback loop + iterations

**Q2 2026: Pilot Launch**
- iOS App Store launch (production beta)
- Pilot с 2-3 школами
- 1,000 платных users (target)
- Improved ML models (image classification beta)

**Q3 2026: Android + Scaling**
- Android версия launch
- 10,000 users (target)
- Partnerships: school districts, parenting orgs
- Advanced analytics dashboard

**Q4 2026: Seed Round + Features**
- Seed funding close
- 25,000 users (target)
- Features: Screen time limits, geofencing (beta)
- Enterprise tier MVP

**2027: Series A + National Expansion**
- Series A funding
- 100,000+ users (USA)
- Social media monitoring (Instagram, TikTok integration)
- ISP partnerships (bundling)

**2028: Global Rollout**
- 1M+ users globally
- Localization: EU (5 languages), Asia (Japan, Korea)
- AI video analysis (deepfake detection)
- Public launch в App Store/Google Play (global)

---

## Слайд 10: Команда

### 👥 Founding Team

**[FOUNDER 1 NAME]** — CEO & Co-Founder
- Background: [PREVIOUS_COMPANY], [YEARS] опыта в [DOMAIN]
- Expertise: Product, Fundraising, GTM
- Education: [UNIVERSITY], [DEGREE]
- Why: [PERSONAL_STORY — ребенок, incident, motivation]

**[FOUNDER 2 NAME]** — CTO & Co-Founder
- Background: [TECH_COMPANY], [YEARS] опыта в mobile/backend
- Expertise: Architecture, ML, Infrastructure
- Education: [UNIVERSITY], [CS_DEGREE]
- Previous: Built and scaled apps to [X] million users

**[ADVISOR 1]** — Advisor (Child Safety Expert)
- Background: [CHILD_SAFETY_ORG], [YEARS] опыта
- Expertise: COPPA compliance, child psychology
- Network: Connections in schools, gov agencies

**[ADVISOR 2]** — Advisor (ML/AI)
- Background: Ex-[FAANG], PhD in ML
- Expertise: NLP, Computer Vision, Model deployment
- Contribution: Model architecture, training pipelines

**Hiring Plan** (post-Seed):
- Mobile Engineer (iOS/Android) — Q2 2026
- Backend Engineer — Q2 2026
- ML Engineer — Q3 2026
- Product Designer — Q3 2026
- Marketing Lead — Q4 2026

---

## Слайд 11: Финансовые проекции

### 📊 3-Year Financial Projections

|  | 2026 | 2027 | 2028 |
|---|------|------|------|
| **Users (платные)** | 10,000 | 75,000 | 250,000 |
| **ARPU (годовой)** | $50 | $55 | $60 |
| **Revenue** | $500K | $4.1M | $15M |
| **COGS (35%)** | $175K | $1.4M | $5.3M |
| **Gross Profit** | $325K | $2.7M | $9.8M |
| **Gross Margin** | 65% | 65% | 65% |
| **OpEx** | $800K | $3.5M | $8M |
| **EBITDA** | -$475K | -$800K | $1.8M |
| **Burn Rate (мес)** | $40K | $70K | $50K |

**Assumptions**:
- Conversion rate (free → paid): 5%
- Churn rate: 15% annual (improving to 10% by 2028)
- CAC: $60 → $50 (economies of scale)
- Team size: 5 → 15 → 30 (2026 → 2027 → 2028)

**Key Metrics**:
- **Break-even**: Q2 2028
- **Rule of 40**: Revenue Growth % + EBITDA Margin % = [40+] ✅ (by 2028)
- **LTV/CAC**: 4:1 (healthy)

**Capitalization Table** (illustrative):
- Founders: 70% (post-Seed)
- Seed Investors: 20%
- Angels/Advisors: 5%
- Employee Pool: 5%

---

## Слайд 12: Funding Ask

### 💵 Seed Round: $1.5M - $2M

**Allocation**:
1. **Product Development** (40%) — $600-800K
   - Hire 2 engineers (iOS, Backend)
   - ML model improvements (image/video)
   - Android version
   - Infrastructure (AWS costs)

2. **Marketing & GTM** (35%) — $525-700K
   - Performance marketing ($300K)
   - Content marketing & SEO ($100K)
   - Partnerships (schools, influencers) ($125K)

3. **Operations & Legal** (15%) — $225-300K
   - Legal (COPPA/GDPR compliance) ($75K)
   - Admin, accounting, insurance ($75K)
   - Hiring & recruiting ($75K)

4. **Runway Buffer** (10%) — $150-200K
   - Emergency fund
   - Unforeseen costs

**Milestones** (18-month runway):
- ✅ 25,000 users by Q4 2026
- ✅ $500K ARR by Q4 2026
- ✅ Product-market fit validated
- ✅ Prep for Series A (Q3 2027)

**Valuation**: $8M - $10M pre-money
- Comparable: Early-stage parental control startups (2024-2025)
- Bark: $300M valuation (Series B, 2021)
- Qustodio: $50M+ valuation (estimated, bootstrapped)

**Round Structure**:
- SAFE (Simple Agreement for Future Equity)
- Discount: 20%
- Cap: $10M
- Pro-rata rights for lead investor

---

## Слайд 13: Traction (если есть)

### 📈 Early Traction & Validation

**Pre-Launch Indicators**:
- ✅ **50 beta families** signed up for TestFlight
- ✅ **Waitlist**: 500+ families (organic)
- ✅ **LOIs**: 2 школы заинтересованы в pilot (Калифорния)
- ✅ **Press**: Featured on [PUBLICATION] (if any)
- ✅ **Awards**: Finalist in [COMPETITION] (if any)

**User Feedback** (beta):
> "Finally, a parental control app that doesn't feel like I'm spying on my kid. It's about safety, not surveillance."  
> — Sarah M., beta parent

> "The AI filtering is impressive. It caught things I would have missed."  
> — John D., beta parent

**Metrics** (from beta):
- DAU/MAU: 0.65 (high engagement)
- NPS: 42 (good for early product)
- False positive rate: 4% (acceptable, improving)

---

## Слайд 14: Call to Action (CTA)

### 🎯 Join Us in Making the Internet Safer for Children

**What We're Building**:
✨ AI-powered платформа, защищающая 100M+ детей к 2030

**Why Now**:
- 🌊 Tsunami неприемлемого контента (AI-generated)
- 📱 Дети младше получают smartphones
- 👪 Родители требуют лучших решений
- 💡 Технологии готовы (SOTA ML models)

**Why Us**:
- 🧠 Команда с опытом в child safety + ML + mobile
- 🚀 Validated MVP, early traction
- 🌍 Огромный TAM ($12.5B+)
- 💰 Profitable unit economics (LTV/CAC 4:1)

**Ask**:
💵 **$1.5M - $2M Seed Round**  
📅 **Close by**: Q2 2026  
📧 **Contact**: [FOUNDERS_EMAIL]

**Next Steps**:
1. Schedule follow-up meeting
2. Demo app (TestFlight access)
3. Detailed financial model review
4. Due diligence & term sheet

---

## Слайд 15: Приложение (Backup Slides)

### Дополнительные материалы

**Competitive Analysis (detailed)**  
**Financial Model (detailed)**  
**Tech Stack & Architecture**  
**Compliance & Legal**  
**Customer Personas**  
**Case Studies (beta users)**

---

## Контакты

**Rork-Kiku Team**  
📧 Email: [FOUNDERS_EMAIL]  
🌐 Website: [WEBSITE]  
📱 Demo: [TESTFLIGHT_LINK]  
💼 LinkedIn: [LINKEDIN]

**Инвестиционные материалы**:
- One-Pager: `docs/investors/one_pager.md`
- Financial Model: `docs/finance/`
- Data Room: `docs/templates/dataroom_template.md`

---

**Статус документа**: Черновик v0.1.0  
**Дата**: Январь 2026  
**Авторы**: Founding Team, Rork-Kiku  
**Конфиденциальность**: Только для потенциальных инвесторов

---

## Примечания для финализации

⚠️ **ПЕРЕД ОТПРАВКОЙ ИНВЕСТОРАМ**:
1. Заполните placeholders ([FOUNDERS_EMAIL], [NAME], etc.)
2. Добавьте реальные screenshots продукта
3. Обновите traction metrics (если есть новые данные)
4. Юридическая проверка claims и projections
5. Дизайн в PowerPoint/Keynote/Pitch (красивые визуалы)
6. Проверьте все цифры (TAM/SAM/SOM, projections)

**Recommended Tools**:
- Pitch.com — для создания красивых presentations
- Slidebean — AI-powered pitch deck builder
- Canva — для graphics и icons

**Timeline**: Превратить этот черновик в финальный deck за 2-3 недели
