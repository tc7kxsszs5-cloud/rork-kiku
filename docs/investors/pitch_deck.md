# Rork-Kiku Pitch Deck

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Контакт**: [FOUNDERS_EMAIL]

---

## Слайд 1: Титульный слайд

**Rork-Kiku**  
*Безопасная цифровая среда для детей и родителей*

**Seeking**: Pre-Seed / Seed раунд  
**Contact**: [FOUNDERS_EMAIL]

**Tagline**: Платформа для безопасного общения детей и родителей с AI-модерацией контента

---

## Слайд 2: Проблема

### Современные дети растут в цифровом мире, но родители теряют контроль

**3 критические проблемы**:

1. **Небезопасные платформы** 🚨
   - WhatsApp, TikTok, Instagram — не предназначены для детей 6-12 лет
   - 42% детей 8-12 лет сталкивались с нежелательным контентом онлайн
   - Кибербуллинг: 59% подростков были жертвами (Pew Research, 2022)

2. **Отсутствие родительского контроля** 👨‍👩‍👧
   - Родители не знают, что дети видят и с кем общаются
   - Существующие parental control инструменты — реактивные, а не проактивные
   - 68% родителей обеспокоены онлайн-безопасностью детей (Common Sense Media)

3. **Недостаток образовательного контента** 📚
   - Дети проводят 4-6 часов в день в интернете, но мало времени на развивающий контент
   - YouTube Kids полон рекламы и сомнительного контента
   - Нет платформы, объединяющей общение и обучение

**Результат**: Родители вынуждены либо полностью запрещать интернет (нереалистично), либо рисковать безопасностью ребенка.

---

## Слайд 3: Решение

### Rork-Kiku — первая платформа, объединяющая безопасное общение, AI-модерацию и образовательный контент

**Что мы делаем**:

1. **Безопасное общение** 💬
   - Приватные чаты родитель ↔ ребёнок
   - AI-модерация всего контента (текст, фото, видео) в реальном времени
   - Родительская панель с полной прозрачностью

2. **Проактивная защита** 🛡️
   - ML-модели блокируют 95%+ нежелательного контента автоматически
   - Ручная модерация для edge cases (< 24 часа)
   - Верификация родителей (документы, платежи, school codes)

3. **Кураторный образовательный контент** 🎓
   - Библиотека проверенного контента: наука, искусство, книги
   - Рекомендации на основе возраста и интересов
   - Геймификация обучения (в будущем)

**Почему мы уникальны**:
- **Privacy-first**: данные детей не продаются рекламодателям
- **COPPA/GDPR compliant**: встроенная безопасность с первого дня
- **AI + Human moderation**: лучшая в классе защита

---

## Слайд 4: Продукт

### iOS приложение с React Native (Android в roadmap)

**Основные функции MVP**:

**Для родителей**:
- Верификация через Apple Sign In / документы
- Создание и управление профилями детей
- Родительская панель: просмотр всех сообщений ребёнка
- Настройки модерации (строгая/средняя/мягкая)
- Отчеты о заблокированном контенте

**Для детей**:
- Безопасный чат с родителями
- Отправка текста, фото, видео (с модерацией)
- Доступ к образовательной библиотеке
- Избранное и рекомендации

**Технологии**:
- React Native + Expo (iOS/Android/Web)
- tRPC API + PostgreSQL + Redis
- ML модерация: Google Vision API + Custom models
- AWS/GCP для hosting

**Screenshots**: (добавить после дизайна)

---

## Слайд 5: Рынок — TAM/SAM/SOM

### Огромный и растущий рынок детской безопасности онлайн

**TAM (Total Addressable Market)**: $12.5B

- **Global Parental Control Software Market**: $1.8B (2024) → $5.2B (2030), CAGR 19.3% (MarketsandMarkets)
- **Kids' Educational Apps Market**: $5.3B (2024) → $7.3B (2030)
- **Total**: ~$12.5B к 2030

**Методология**: 
- 1.2 млрд детей 6-12 лет в мире
- Penetration rate: 20% к 2030 (консервативно)
- ARPU: $50/год
- TAM = 240M users × $50 = $12B

**SAM (Serviceable Available Market)**: $2.8B

- **Focus**: США, Канада, Западная Европа (до 2027)
- 120M детей 6-12 лет
- Penetration rate: 30% к 2027
- ARPU: $75/год (higher willingness to pay in developed markets)
- SAM = 36M users × $75 = $2.7B

**SOM (Serviceable Obtainable Market)**: $45M (Year 3)

- **Conservative capture**: 0.5% SAM к Year 3
- 600K платящих пользователей × $75 ARPU = $45M ARR

**Market Drivers**:
- Рост awareness о детской безопасности онлайн
- Законодательство (COPPA, GDPR, UK Online Safety Bill)
- Увеличение screen time детей (+25% с 2020)
- Родительская тревога (68% беспокоятся о детях онлайн)

---

## Слайд 6: Бизнес-модель и монетизация

### Freemium + Premium подписка

**Freemium** (бесплатно):
- 1 детский профиль
- Базовая модерация (текст + фото)
- Ограниченный доступ к образовательному контенту (10 статей/месяц)
- Ограниченные push notifications

**Premium** ($7.99/месяц или $79.99/год):
- До 5 детских профилей
- Расширенная модерация (видео, real-time alerts)
- Полный доступ к образовательной библиотеке
- Расширенная аналитика и отчеты
- Priority support

**Enterprise** (Custom pricing для школ/НКО):
- Bulk licenses для школ
- Admin dashboard для учителей
- Custom content curation
- Dedicated account manager

**Unit Economics (Year 2)**:
- **ARPU**: $75/год (blend free + premium)
- **CAC**: $30 (performance marketing + referrals)
- **LTV**: $300 (4 years average retention)
- **LTV/CAC**: 10:1 (здоровый)
- **Gross Margin**: 70% (after infra + moderation costs)

**Revenue Streams**:
1. **Subscriptions**: 85% revenue (основной)
2. **Enterprise licenses**: 10% revenue
3. **Premium content partnerships**: 5% revenue (образовательные издатели)

**Pricing Strategy**:
- **Year 1 (Pilot)**: Free для всех (focus on adoption)
- **Year 2 (Production)**: Freemium launch
- **Year 3+**: Upsell to premium (target 30% conversion)

---

## Слайд 7: Конкуренты и конкурентные преимущества

### Мы играем в новой категории: "Safe Social for Kids"

**Конкуренты**:

| Competitor | Category | Strengths | Weaknesses |
|-----------|----------|-----------|------------|
| **Bark** | Parental monitoring | Хороший monitoring | Реактивный, нет своей платформы |
| **Qustodio** | Parental control | Широкий функционал | Сложный UX, нет AI модерации |
| **YouTube Kids** | Kids content | Огромный контент | Много рекламы, сомнительная модерация |
| **Messenger Kids** (Meta) | Kids messaging | Brand recognition | Privacy concerns, нет образовательного контента |
| **WhatsApp** | Messaging | Ubiquitous | Не для детей, нет модерации |

**Наши конкурентные преимущества**:

1. **AI-First Moderation** 🤖
   - 95%+ accuracy, < 10 секунд latency
   - Конкуренты полагаются на manual review или legacy filters

2. **Privacy-First** 🔒
   - Данные не продаются рекламодателям (в отличие от Meta)
   - COPPA/GDPR compliant by design
   - Родители владеют данными детей

3. **Education + Communication** 📚💬
   - Единственная платформа, объединяющая оба
   - Конкуренты — либо parental control, либо content

4. **Parent-Child Co-experience** 👨‍👩‍👧
   - Родители — активные участники, не просто мониторы
   - Встроенное доверие и transparency

5. **Startup Agility** 🚀
   - Быстрые итерации на основе feedback
   - Фокус на UX (конкуренты — legacy, сложные интерфейсы)

**Barriers to Entry**:
- ML expertise (модерация — core competency)
- Trust и brand (требуется время)
- Regulatory compliance (COPPA/GDPR — сложно для новых игроков)

---

## Слайд 8: Go-to-Market стратегия

### Phase 1: Pilot (Q1-Q3 2026) — Validation

**Target**: 100-500 семей (США)

**Channels**:
1. **Organic**: Parenting communities (Reddit, Facebook groups)
2. **Partnerships**: 2-3 школы в Bay Area или NYC
3. **Referrals**: Parents invite parents (incentivized)

**Goal**: Validate product-market fit, gather feedback, iterate

---

### Phase 2: Launch (Q4 2026 - Q2 2027) — Growth

**Target**: 10K-50K families (США)

**Channels**:
1. **Performance Marketing**:
   - Facebook/Instagram Ads (targeting parents 30-45)
   - Google Search Ads ("parental control apps", "kids messaging")
   - TikTok (parenting influencers)

2. **Content Marketing**:
   - SEO: blog о детской безопасности онлайн
   - YouTube: educational videos для родителей
   - Podcast sponsorships (parenting podcasts)

3. **Partnerships**:
   - Schools & PTAs (10-20 partnerships)
   - NGOs (Common Sense Media, Net Safety Collaborative)
   - Pediatricians (рекомендации в клиниках)

4. **PR**:
   - Tech media (TechCrunch, The Verge)
   - Parenting media (Parents Magazine, Motherly)
   - TV appearances (morning shows)

**Goal**: Achieve 50K users, 30% premium conversion

---

### Phase 3: Scale (2027-2028) — Expansion

**Target**: 500K-1M families (США + Канада + Западная Европа)

**Channels**:
1. **International Expansion**:
   - Launch in UK, Germany, France
   - Localize content и moderation

2. **B2B/Enterprise**:
   - School district contracts (bulk licenses)
   - Corporate benefits (employee family programs)

3. **Virality**:
   - Referral programs (incentivized)
   - Network effects (kids want to connect with friends)

**Goal**: $10M+ ARR, product-market fit in 3+ countries

---

## Слайд 9: Roadmap (24 месяца)

### 2026

**Q1: PoC & MVP Development**
- Finalize MVP spec
- Build core features (messaging, moderation, parent dashboard)
- ML models training (text + image)

**Q2: TestFlight Pilot**
- Launch TestFlight with 100 families
- Iterate based on feedback
- Achieve 40% day-7 retention

**Q3: Pilot Expansion**
- Expand to 500 families
- Add video moderation
- School partnerships (2-3 schools)

**Q4: Production Beta**
- Public launch on App Store (iOS)
- Freemium + Premium subscriptions
- Performance marketing start

### 2027

**Q1: Growth**
- Scale to 10K users
- Android version launch
- Enhanced analytics for parents

**Q2: Monetization Optimization**
- Optimize premium conversion (target 30%)
- Enterprise sales start (schools)
- Break-even on unit economics

**Q3: International Expansion**
- Launch in UK, Canada
- Multilingual support (English, Spanish, French)
- Partner with international NGOs

**Q4: Series A Prep**
- 100K+ users, $5M+ ARR
- Proven LTV/CAC
- Global roadmap (Asia, ROW)

---

## Слайд 10: Команда

### Experienced founders with complementary skills

**[Founder 1 — CEO]** (placeholder)
- Background: Ex-Facebook/Google Product Manager (10 years)
- Expert in consumer apps и growth
- Stanford MBA

**[Founder 2 — CTO]** (placeholder)
- Background: Ex-Amazon/Microsoft Senior Engineer (8 years)
- Expert in distributed systems и ML
- MIT Computer Science

**[Founder 3 — CPO]** (placeholder)
- Background: Ex-Apple Designer (5 years)
- Expert in UX/UI for mobile apps
- RISD Design

**Advisors**:
- **Child Safety Expert**: (TBD) — консультант по COPPA/GDPR
- **ML Expert**: (TBD) — advisor по модерации контента
- **Investor**: (TBD) — seed investor с опытом в EdTech/SocialTech

**Hiring Plan** (Year 1):
- Mobile Engineer (iOS) — Q1
- Backend Engineer — Q1
- ML Engineer — Q2
- QA Engineer — Q2
- Moderation Lead — Q3
- Community Manager — Q4

**Total Team Size**: 10 people к концу Year 1

---

## Слайд 11: Финансовые проекции (3 сценария)

### Conservative (вероятность 70%)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total Users | 5,000 | 30,000 | 150,000 |
| Paying Users | 0 (free pilot) | 9,000 (30% conv) | 45,000 (30% conv) |
| ARPU | $0 | $75 | $75 |
| **Revenue** | **$0** | **$675K** | **$3.4M** |
| CAC | $0 | $30 | $30 |
| Gross Margin | N/A | 60% | 65% |
| **Burn Rate** | **$500K** | **$1.2M** | **$2.0M** |
| **Cash Needed** | **$500K** | **$1.7M** | **$3.7M** |

### Base Case (вероятность 50%)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total Users | 10,000 | 60,000 | 300,000 |
| Paying Users | 0 | 18,000 | 90,000 |
| ARPU | $0 | $75 | $75 |
| **Revenue** | **$0** | **$1.35M** | **$6.8M** |
| **Burn Rate** | **$600K** | **$1.5M** | **$3.0M** |
| **Cash Needed** | **$600K** | **$2.1M** | **$5.1M** |

### Optimistic (вероятность 20%)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total Users | 20,000 | 120,000 | 600,000 |
| Paying Users | 0 | 36,000 | 180,000 |
| ARPU | $0 | $75 | $80 |
| **Revenue** | **$0** | **$2.7M** | **$14.4M** |
| **Burn Rate** | **$700K** | **$2.0M** | **$5.0M** |
| **Cash Needed** | **$700K** | **$2.7M** | **$7.7M** |

**Assumptions**:
- **Pilot Year 1**: Free для всех (focus на adoption)
- **Year 2**: Freemium launch, 30% premium conversion
- **Year 3**: Scale + upsell, 30% conversion maintained
- **CAC**: $30 (performance marketing + organic)
- **LTV**: $300 (4 years retention)
- **Gross Margin**: 60-70% (SaaS-like)

**Break-even**: Year 3 (base case), Year 4 (conservative)

---

## Слайд 12: The Ask — Использование средств

### Seeking: $1.5M Pre-Seed / Seed Round

**Use of Funds** (18-month runway):

1. **Product Development** — $600K (40%)
   - 2 Mobile Engineers (iOS/Android)
   - 1 Backend Engineer
   - 1 ML Engineer
   - Infrastructure costs (AWS/GCP)

2. **Go-to-Market** — $450K (30%)
   - Performance marketing ($300K)
   - Content marketing & SEO ($100K)
   - PR & events ($50K)

3. **Operations** — $300K (20%)
   - 1 Moderation Lead + 2 Moderators
   - 1 Community Manager
   - Legal & compliance

4. **Founders & Overhead** — $150K (10%)
   - Founder salaries (minimal, ramen)
   - Office/tools/misc

**Milestones with $1.5M**:
- ✅ Launch TestFlight Pilot (Q2 2026)
- ✅ Achieve 10K+ users (Q4 2026)
- ✅ Public launch on App Store (Q1 2027)
- ✅ $500K ARR (Q2 2027)
- ✅ Series A ready (Q3-Q4 2027)

**Existing Investors** (если есть):
- Angels: $100K (friends & family)
- Accelerator: $150K (Y Combinator / Techstars — если применимо)

**Next Round** (Series A):
- **Timing**: Q4 2027
- **Target**: $5-10M
- **Valuation**: $30-50M (3-5x revenue multiple)

---

## Слайд 13: Traction & Validation (если есть)

**Current Status** (Январь 2026):
- 🚧 MVP в разработке
- 🔍 Market research завершен (100+ parent interviews)
- 🤝 2 LOIs (Letters of Intent) от школ в Bay Area
- 📊 Waitlist: 500+ parents

**Key Learnings from Research**:
- 85% родителей обеспокоены детской безопасностью онлайн
- 70% готовы платить $5-10/месяц за безопасную платформу
- Top concern: кто видит данные детей? (privacy)

**Pilot Partners** (подтверждаются):
- [School Name] Elementary School (Bay Area) — 200 families
- [NGO Name] — child safety advocacy group

---

## Слайд 14: Risks & Mitigation

### Мы знаем о рисках и готовы к ним

**Risk 1: Adoption — родители не захотят новую платформу**
- **Mitigation**: Pilot с 100+ семьями, валидация demand, strong referrals

**Risk 2: Regulatory — COPPA/GDPR compliance сложен**
- **Mitigation**: Юристы с опытом в COPPA, privacy by design

**Risk 3: Competition — крупные игроки (Meta, Google) могут войти**
- **Mitigation**: First-mover advantage, niche focus, trust/brand

**Risk 4: Moderation — ML модели не будут достаточно точными**
- **Mitigation**: Hybrid approach (AI + human), continuous model improvement

**Risk 5: Monetization — пользователи не будут платить**
- **Mitigation**: Freemium модель, value proposition (безопасность детей — high willingness to pay)

---

## Слайд 15: Call to Action

### Join us in making the internet safer for kids

**Why invest in Rork-Kiku?**

1. **Massive Market** 🌍
   - $12.5B TAM, growing 20% CAGR
   - Underserved segment (kids 6-12)

2. **Strong Team** 💪
   - Experienced founders (Product, Eng, Design)
   - Deep expertise in consumer apps и ML

3. **Defensible Moat** 🏰
   - AI-first moderation (hard to replicate)
   - Trust & brand (takes time to build)
   - Regulatory compliance (barrier to entry)

4. **Social Impact** ❤️
   - Protecting children online
   - Empowering parents
   - Positive mental health outcomes

**Next Steps**:
1. Schedule follow-up call to discuss in detail
2. Review financial model и projections
3. Meet the team
4. Due diligence & term sheet

**Contact**: [FOUNDERS_EMAIL]

---

## Appendix: Дополнительные материалы

### Доступны по запросу:
- Детальная финансовая модель (3-year projections)
- Product demo (Figma mockups или beta app)
- Market research report (100+ parent interviews)
- Legal compliance overview (COPPA/GDPR)
- Technical architecture document
- Competitor analysis deep dive

**Data Room**: [Link to secure data room]

---

**Конец Pitch Deck**

---

**Примечания**:
- Этот pitch deck — черновик. Требуется:
  - ✅ Добавить реальные имена founders и backgrounds
  - ✅ Заменить [FOUNDERS_EMAIL] на настоящий email
  - ✅ Добавить screenshots продукта (после дизайна)
  - ✅ Обновить traction (когда будут данные)
  - ✅ Дизайн: сделать визуально привлекательным (Pitch.com, Canva, или PowerPoint)
  
- **Безопасность**: Не включать в pitch deck:
  - ❌ Персональные данные пользователей
  - ❌ API ключи или секреты
  - ❌ Sensitive financial details (cap table — только в data room)

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02
