# Pitch Deck — Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT для инвесторского ревью
- **Контакт**: [FOUNDERS_EMAIL]

---

## Слайд 1: Титульный слайд

### RORK-KIKU
**Безопасная платформа для обмена медиаконтентом между родителями и детьми с AI-модерацией**

**Founders**: [FOUNDERS_NAMES — Placeholder]

**Contact**: [FOUNDERS_EMAIL]

**Stage**: Pre-Seed / Seed

**Ask**: $500K - $1.5M

---

## Слайд 2: Проблема

### Родители сталкиваются с критической проблемой:

1. **Нежелательный контент**: Дети получают доступ к неподходящему контенту (NSFW, насилие, пропаганда) через мессенджеры, социальные сети и email.

2. **Отсутствие контроля**: Существующие платформы (WhatsApp, Instagram, Snapchat) не предоставляют родителям инструментов для модерации входящего контента.

3. **Privacy concerns**: Родители не хотят давать детям доступ к полноценным соцсетям из-за рисков:
   - Контакт с незнакомцами
   - Кибербуллинг
   - Data privacy violations
   - Screen addiction

4. **Отсутствие безопасных альтернатив**: Нет платформы, которая бы совмещала:
   - Удобство современных мессенджеров
   - Родительский контроль
   - Privacy-first подход
   - AI-модерацию контента

### Статистика:
- **95%** родителей беспокоятся о безопасности детей онлайн (Pew Research, 2023)
- **60%** детей 8-12 лет сталкивались с неподходящим контентом онлайн
- **$3.2B** market size parental control software (2024), растёт на 15% CAGR
- **46%** родителей используют parental control tools, но большинство недовольны их эффективностью

**Bottom line**: Существующие решения либо too restrictive (full device lock), либо too permissive (no content control). Нужен баланс.

---

## Слайд 3: Решение

### Rork-Kiku = Безопасный медиа-обмен + AI-модерация + Privacy

**Что мы делаем**:
- Родители делятся фото/видео с детьми через мобильное приложение
- **AI автоматически модерирует** весь входящий контент перед показом ребёнку
- Родители управляют уровнем модерации (строгий / умеренный / мягкий)
- **100% privacy**: никаких социальных сетей, никаких незнакомцев, только семья

**Как это работает**:
1. Родитель загружает фото → AI анализирует (NSFW, насилие, текст) → Одобрено / Отклонено
2. Если AI сомневается (confidence 50-90%) → Ручная модерация
3. Только одобренный контент показывается ребёнку
4. Уведомления родителям о статусе модерации

**Ключевые преимущества**:
- ✅ **Безопасность**: AI + human moderation
- ✅ **Privacy**: GDPR/COPPA compliant, no data selling
- ✅ **Удобство**: Простой UX, как Instagram, но безопасный
- ✅ **Контроль**: Родитель управляет настройками модерации
- ✅ **Масштабируемость**: AI обрабатывает 1000+ изображений/сек

---

## Слайд 4: Продукт

### MVP (iOS TestFlight — Q1 2026)

**Core features**:
- 📱 iOS mobile app (React Native + Expo)
- 🔐 Sign in with Apple / Google
- 👨‍👩‍👧‍👦 Родительские аккаунты + детские профили
- 📸 Загрузка фото (камера / галерея)
- 🤖 AI-модерация (NSFW, violence, inappropriate text)
- ✅ Автоматическое одобрение / отклонение
- 👁️ Ручная модерация (для edge cases)
- 🔔 Push notifications (статус модерации)
- 🖼️ Gallery view одобренных фото

**Tech stack**:
- Frontend: React Native, TypeScript, Expo
- Backend: Node.js, tRPC, PostgreSQL, Redis
- ML: PyTorch, YOLOv8, pre-trained NSFW models
- Cloud: AWS (EKS, RDS, S3, CloudFront)

**Screenshots**: [PLACEHOLDER — будут добавлены после design]

### Roadmap (см. слайд 12)

---

## Слайд 5: Рынок — TAM / SAM / SOM

### TAM (Total Addressable Market)
**Global market для family safety + parental control**:
- Parental control software: **$3.2B** (2024) → **$6.5B** (2030) @ 15% CAGR
- Messaging apps market: **$75B** (2024)
- Child safety market (broader): **$10B+**

**Target segment**: Родители детей 5-14 лет
- **Global**: ~1.5B children в этой возрастной группе
- **Developed markets** (US, EU, Japan, S.Korea): ~200M children
- Assumption: 50% родителей заинтересованы в child safety tools
- **TAM**: 100M families * $50/year = **$5B/year**

### SAM (Serviceable Addressable Market)
**Рынки с высоким awareness о digital safety**:
- **US**: 25M families * $60/year = $1.5B
- **EU**: 20M families * $50/year = $1B
- **Asia** (Japan, S.Korea, Singapore): 10M families * $40/year = $400M
- **Total SAM**: **~$3B/year**

### SOM (Serviceable Obtainable Market)
**Realistic market capture в первые 3-5 лет**:
- Year 1-2: Early adopters, US + EU pilot
- Year 3-5: Expansion, multi-region

**Conservative scenario**:
- 0.5% market share SAM в первые 5 лет
- **SOM**: $3B * 0.5% = **$15M ARR** (Year 5)

**Base scenario**:
- 1% market share SAM
- **SOM**: $3B * 1% = **$30M ARR** (Year 5)

**Optimistic scenario**:
- 2% market share SAM
- **SOM**: $3B * 2% = **$60M ARR** (Year 5)

### Методология:
- Bottom-up: CAC, conversion rates, retention
- Top-down: Market size, penetration rate
- Comparables: Qustodio (250K paying users), Bark (5M+ families), Net Nanny (est. $20M+ ARR)

---

## Слайд 6: Бизнес-модель и Монетизация

### Freemium Model

**Free tier**:
- 1 детский профиль
- До 50 фото/месяц
- AI модерация (строгий уровень только)
- Push notifications

**Premium tier** ($4.99/month или $49.99/year):
- Unlimited детские профили
- Unlimited фото/видео
- Все уровни модерации (строгий / умеренный / мягкий)
- Priority support
- Advanced analytics (что блокируется, почему)
- Video support (Phase 2)

**Family plan** ($9.99/month или $99.99/year):
- До 5 родительских аккаунтов (co-parents)
- Unlimited детские профили
- Все Premium features
- Custom moderation rules
- API access (для integration с другими family apps)

### Revenue Streams:
1. **Subscriptions** (Primary): 80% revenue
2. **B2B partnerships** (школы, НКО, корпоративные family benefits): 15% revenue
3. **Data insights** (anonymized, aggregated, opt-in): 5% revenue
   - Например: "Trends in online child safety" reports для исследователей
   - **Никакой продажи PII** — это red line

### Unit Economics (Base scenario, Year 3):
- **ARPU**: $50/year
- **CAC**: $30 (paid ads + organic)
- **LTV**: $150 (3 years avg lifetime, 70% retention)
- **LTV/CAC**: 5x (здоровый для subscription бизнеса)
- **Gross margin**: 75% (after infrastructure costs)

---

## Слайд 7: Конкуренты

### Direct Competitors:

| Product | Focus | Strengths | Weaknesses |
|---------|-------|-----------|------------|
| **Bark** | Monitoring детских устройств | Широкий функционал, 5M+ users | Too invasive, no AI moderation для входящего контента |
| **Qustodio** | Parental control | Mature product, multi-platform | Complex UX, focus на device lock, not content moderation |
| **Google Family Link** | Device management | Free, Google ecosystem | Limited content moderation, basic features |
| **Net Nanny** | Web filtering | Strong web filter | Legacy product, poor mobile experience |
| **Kids Messenger** (от Facebook) | Safe messaging | Facebook backing | Limited to Facebook ecosystem, trust issues |

### Indirect Competitors:
- **WhatsApp / Telegram**: General messaging, no moderation
- **Instagram Kids** (cancelled): Попытка Facebook, провалилась из-за privacy concerns

### Наше конкурентное преимущество:
1. **AI-first approach**: Автоматическая модерация 95%+ контента
2. **Privacy-first**: GDPR/COPPA compliant, no data selling, transparent policies
3. **Family-focused**: Дизайн специально для семейного контекста, не social network
4. **Modern tech stack**: React Native + Expo → быстрая итерация, multi-platform
5. **Low friction UX**: Onboarding < 2 минуты, простота как Instagram

### Barriers to entry:
- ML модели: Требуется expertise + dataset
- Trust: Reputation в child safety критична
- Compliance: COPPA, GDPR, age verification — сложные legal requirements
- Network effects: Чем больше пользователей, тем лучше ML модели (feedback loop)

---

## Слайд 8: Go-to-Market Strategy

### Phase 1: Pilot (Q1-Q2 2026)
**Target**: 100-500 early adopters
- **Channels**:
  - iOS TestFlight (invite-only)
  - Partnerships с 3-5 школами / НКО (parent safety workshops)
  - Founder network (friends & family)
  - Reddit/Facebook groups (parenting, digital safety)
- **Goal**: Product-market fit validation, user feedback
- **Budget**: $10K (minimal paid ads, focus на organic)

### Phase 2: Seed Launch (Q3-Q4 2026)
**Target**: 5K-10K users
- **Channels**:
  - App Store launch (iOS)
  - Content marketing: Blog, SEO (keywords: "child safety", "parental control", "safe messaging")
  - Social media: Instagram, TikTok (parent influencers)
  - PR: Tech media, parenting media (TechCrunch, Wired, Parents Magazine)
  - Paid ads: Facebook/Instagram ads (targeting parents 30-45)
- **Partnerships**:
  - Schools (pilot programs)
  - Parenting НКО (NCMEC, Common Sense Media)
  - Corporate family benefits programs
- **Budget**: $100K marketing
- **Goal**: 10% conversion Free → Paid

### Phase 3: Scale (2027+)
**Target**: 100K+ users, multi-region expansion
- **Channels**:
  - All Phase 2 channels (scaled)
  - Android launch
  - International markets (EU, Asia)
  - Referral program (invite 3 friends → 1 month free)
  - B2B sales team (schools, corporates)
- **Budget**: $1M+ marketing
- **Goal**: $10M ARR by end of 2027

### Key Metrics:
- CAC: $30 (target)
- Conversion Free → Paid: 10%
- Retention (12 months): 70%
- NPS: > 50
- Virality (K-factor): 0.5 (каждый user приводит 0.5 новых)

---

## Слайд 9: Команда

### Founders (Placeholder)

**[FOUNDER 1 NAME]** — CEO
- Background: [PLACEHOLDER — ex-Google Product Manager, 10 years in child safety tech]
- Expertise: Product strategy, fundraising, partnerships
- LinkedIn: [PLACEHOLDER]

**[FOUNDER 2 NAME]** — CTO
- Background: [PLACEHOLDER — ex-Meta Engineer, ML specialization]
- Expertise: Backend, ML, infrastructure
- LinkedIn: [PLACEHOLDER]

**[FOUNDER 3 NAME]** — CPO
- Background: [PLACEHOLDER — ex-Apple Designer, 8 years in mobile UX]
- Expertise: Product design, user research
- LinkedIn: [PLACEHOLDER]

### Advisors (Planned)
- **Legal/Compliance**: Lawyer specializing в COPPA/GDPR (TBD)
- **Child Psychology**: Child safety expert (TBD)
- **ML/AI**: ML engineer from top AI lab (TBD)
- **GTM**: Marketing executive from EdTech/FamilyTech (TBD)

### Hiring Plan (Post-Seed):
- **Year 1**: Backend Eng (2), iOS Eng (1), ML Eng (1), Moderator (1-2 part-time)
- **Year 2**: Android Eng (1), QA (1), Community Manager (1), Sales (1)

---

## Слайд 10: Traction (если есть)

### Current Status (Pre-Seed):
- ✅ Product concept validated (user interviews: 50+ parents)
- ✅ MVP spec completed
- ✅ Architecture designed
- ✅ Tech stack selected
- ⏳ iOS app in development (launch: Q1 2026)
- ⏳ ML models selected (testing in progress)
- ⏳ Partnerships: In talks с 5 schools для pilot

### Early Indicators:
- **Waitlist**: [PLACEHOLDER — цель 1000+ sign-ups до launch]
- **Letter of Intent**: [PLACEHOLDER — 2-3 schools agreed для pilot]
- **Press**: [PLACEHOLDER — featured in local parenting blog]

### Milestones (Next 6 months):
- **Month 1**: iOS TestFlight launch
- **Month 2**: 100 active users, < 5% churn
- **Month 3**: ML accuracy > 90%, false positive < 5%
- **Month 4**: App Store launch
- **Month 5**: 1K users, 10% conversion to paid
- **Month 6**: Seed funding closed, Android development starts

---

## Слайд 11: Финансовые проекции

### Revenue Projections (Base Scenario)

| Year | Users (Total) | Paying Users | ARPU | ARR | Growth |
|------|---------------|--------------|------|-----|--------|
| 2026 | 5,000 | 500 | $50 | $25K | - |
| 2027 | 50,000 | 5,000 | $50 | $250K | 10x |
| 2028 | 200,000 | 20,000 | $50 | $1M | 4x |
| 2029 | 500,000 | 50,000 | $52 | $2.6M | 2.6x |
| 2030 | 1,000,000 | 120,000 | $55 | $6.6M | 2.5x |

### Cost Structure (Year 1-2)

**OPEX**:
- Team (5-7 people): $500K-700K/year
- Infrastructure (AWS): $50K-100K/year
- ML inference (GPU): $30K-50K/year
- Marketing: $100K-200K/year
- Legal/compliance: $20K-30K/year
- **Total OPEX**: ~$700K-1.1M/year

**CAPEX**: Minimal (cloud-based, no hardware)

### Funding Needs:
- **Pre-Seed / Seed**: $500K - $1.5M
  - Runway: 18-24 months
  - Use of funds: Product development (40%), team (40%), marketing (15%), legal (5%)
- **Series A** (Year 2-3): $3M-5M
  - Scale team, multi-platform expansion, international markets

### Break-even:
- **Optimistic**: Month 18 ($1M ARR, 20K paying users)
- **Base**: Month 24 ($1M ARR, 20K paying users)
- **Conservative**: Month 30

**См. детальную финмодель**: `docs/finance/financial_model.csv`

---

## Слайд 12: Roadmap

### Q1 2026: MVP Launch
- ✅ iOS TestFlight
- ✅ Core features (upload, moderation, gallery)
- ✅ 100-500 pilot users
- Goal: PMF validation

### Q2-Q3 2026: App Store Launch
- ✅ iOS App Store launch
- ✅ Marketing campaign
- ✅ Partnerships (schools, НКО)
- ✅ 5K-10K users
- Goal: Prove conversion Free → Paid

### Q4 2026: Feature Expansion
- ✅ Video upload + moderation
- ✅ Co-parent collaboration
- ✅ Advanced analytics
- ✅ 20K+ users
- Goal: $100K ARR

### 2027: Multi-Platform & Scale
- ✅ Android launch
- ✅ Web dashboard (для родителей)
- ✅ International markets (EU, Asia)
- ✅ B2B partnerships (corporate family benefits)
- ✅ 100K+ users
- Goal: $1M ARR

### 2028+: Global Expansion
- ✅ Multi-language support (10+ languages)
- ✅ Real-time messaging (end-to-end encrypted)
- ✅ Third-party integrations (Google Photos, iCloud)
- ✅ AI improvements (custom models per family)
- Goal: $10M+ ARR, Series B

---

## Слайд 13: Ask & Use of Funds

### Asking: $500K - $1.5M (Seed)

**Valuation**: $3M-5M pre-money (negotiable, зависит от traction)

**Use of Funds**:
1. **Product Development** (40% = $200K-600K):
   - Full-time iOS engineer
   - Backend engineer
   - ML engineer
   - Infrastructure (AWS, GPU instances)
   
2. **Team** (40% = $200K-600K):
   - Founder salaries (minimal, $50K-80K each)
   - Key hires (4-6 people)
   
3. **Marketing & GTM** (15% = $75K-225K):
   - Pilot program (schools, НКО)
   - Content marketing, SEO
   - Paid ads (Facebook, Instagram)
   - PR (media outreach)
   
4. **Legal & Compliance** (5% = $25K-75K):
   - Privacy lawyer (GDPR, COPPA compliance)
   - Terms of Service, Privacy Policy
   - Security audits

### Expected Milestones (with funding):
- **Month 6**: iOS App Store launch, 1K users
- **Month 12**: 10K users, $50K ARR, ML accuracy > 92%
- **Month 18**: 30K users, $150K ARR, Android launch
- **Month 24**: 100K users, $500K ARR, Series A ready

### Exit Strategy (Long-term):
- **Acquisition**: Potential acquirers — Apple (Family Sharing), Google (Family Link), Meta, Snap, educational tech companies (Class Dojo, Khan Academy)
- **IPO**: Long-term (5-7+ years), if scale to $50M+ ARR
- **Strategic partnerships**: Integrate с existing family tech ecosystems

---

## Слайд 14: Risks & Mitigation

### Key Risks:

1. **Regulatory Risk** (Privacy laws):
   - **Mitigation**: Legal team, GDPR/COPPA compliance from day 1, regular audits

2. **ML Accuracy Risk** (False negatives):
   - **Mitigation**: Human moderation fallback, continuous model improvement, user feedback loop

3. **User Adoption Risk** (Low conversion):
   - **Mitigation**: Freemium model, strong value prop, user testing, referral incentives

4. **Competition Risk** (Big tech копирует):
   - **Mitigation**: Speed to market, niche focus, build trust & community early

5. **Trust Risk** (Data breach, privacy concerns):
   - **Mitigation**: Security-first architecture, encryption, regular pentests, transparent policies

---

## Слайд 15: Call to Action

### Why Now?
- **Market timing**: Post-COVID surge в digital safety awareness
- **Regulatory momentum**: COPPA updates, EU Digital Services Act
- **Tech maturity**: AI/ML достаточно продвинуты и доступны
- **Founder expertise**: Team with domain knowledge in child safety + AI

### Why Us?
- **Mission-driven**: Protecting children онлайн
- **Privacy-first**: No data selling, transparent, GDPR/COPPA compliant
- **AI-powered**: Scalable, efficient, accurate
- **Strong team**: [PLACEHOLDER — highlight founder expertise]

### Next Steps:
1. **Schedule follow-up meeting**: Deep dive на product, tech, financials
2. **Product demo**: TestFlight access (as soon as available)
3. **Due diligence**: Open our data room (see `docs/legal/data_room_checklist.md`)
4. **Term sheet negotiation**: Let's build the safest platform for kids together

### Contact:
- **Email**: [FOUNDERS_EMAIL]
- **Deck**: [LINK TO DECK — Google Slides / Pitch.com]
- **Website**: [PLACEHOLDER — rork-kiku.com]
- **LinkedIn**: [PLACEHOLDER]

**Let's protect the next generation online. Join us.**

---

## Appendix: English Summary (for international investors)

### Rork-Kiku: AI-Powered Safe Media Sharing for Families

**Problem**: Parents struggle to protect children from inappropriate online content. Existing solutions are either too restrictive (device lock) or too permissive (no content control).

**Solution**: Mobile app where parents share photos/videos with kids. AI automatically moderates all content before showing it to children. Parents control moderation levels (strict/moderate/relaxed).

**Market**: $5B TAM (global family safety + parental control), targeting 100M families with children 5-14 years old.

**Business Model**: Freemium subscription ($4.99/month, $9.99/month family plan). Target 10% conversion, $50 ARPU, $30 CAC.

**Traction**: Pre-MVP, launching iOS TestFlight Q1 2026. Pilot partnerships with schools/NGOs in progress.

**Ask**: $500K-$1.5M Seed funding for 18-24 months runway. Use: Product (40%), Team (40%), Marketing (15%), Legal (5%).

**Team**: [FOUNDERS — placeholder: ex-Google, ex-Meta, ex-Apple backgrounds in Product, ML, Design]

**Roadmap**: Q1 2026 TestFlight → Q3 2026 App Store → Q4 2026 $100K ARR → 2027 Android + $1M ARR → 2028+ Global expansion.

**Contact**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Данный pitch deck является черновиком для инвесторского ревью. Все цифры, проекции и данные — примерные и требуют валидации. Не содержит конфиденциальной информации или реальных секретов. Placeholder контакт: [FOUNDERS_EMAIL].
