# Roadmap kiku — 24 месяца

## Обзор

Эта дорожная карта описывает развитие kiku на следующие 24 месяца (2026-2028). План включает product milestones, fundraising, expansion по регионам, и ключевые метрики на каждом этапе.

**Disclaimer:** Это живой документ, который будет обновляться по мере развития проекта и получения feedback от users и investors.

---

## Q1 2026: PoC & MVP (Proof of Concept & Minimum Viable Product)

### Цели
- Завершить MVP и запустить internal testing
- Подготовиться к pilot программе
- Начать fundraising (Pre-Seed/Seed)

### Product Milestones
- [x] iOS приложение (React Native + Expo) — готово
- [x] Базовый AI-анализ (OpenAI GPT-4, AWS Rekognition) — готово
- [ ] Pilot с 10-20 семьями (internal beta)
- [ ] Итерации на основе feedback
- [ ] Подготовка к TestFlight public beta

### Features
- ✅ Текстовый анализ сообщений
- ✅ Анализ изображений
- ✅ Родительская панель управления
- ✅ Алерты (push notifications, email)
- ✅ SOS кнопка с геолокацией
- 🚧 Анализ голосовых сообщений (Whisper API)
- 🚧 Android версия (начало разработки)

### Technical
- Backend API (Node.js + tRPC) deployed на AWS
- PostgreSQL database
- S3 для медиа storage
- Basic CI/CD (GitHub Actions)

### Team
- **Core team:** 5-7 человек (founders + 3-5 engineers)

### Fundraising
- **Target:** $500K - $1M (Seed round)
- **Activities:**
  - Pitch deck finalized
  - Investor outreach (50+ investors)
  - Due diligence preparation (data room)
- **Timeline:** Q1-Q2 2026

### Metrics (EOQ)
- **Pilot users:** 10-20 families
- **Retention (Day 30):** > 60%
- **NPS:** > 50
- **ML Accuracy:** Precision > 75%, Recall > 70%

---

## Q2 2026: TestFlight Beta & Pilot Expansion

### Цели
- Запустить TestFlight public beta
- Расширить pilot до 50-100 семей
- Close Seed round

### Product Milestones
- [ ] TestFlight public beta launch (iOS)
- [ ] Android alpha testing (internal)
- [ ] Partnerships с 2-3 школами или НКО
- [ ] Feedback collection и итерации

### Features
- ✅ Анализ голосовых сообщений
- ✅ Улучшенная точность ML models (fine-tuning на pilot data)
- 🚧 Продвинутая аналитика для родителей (графики, trends)
- 🚧 Educational content (tips для родителей)
- 🚧 Referral program (invite friends)

### Technical
- Kubernetes deployment (EKS)
- Improved monitoring (Prometheus + Grafana)
- Security audit (external pentest)

### Team
- **Add:** 1-2 Backend Engineers, 1 QA Engineer, 1 Community Manager
- **Total:** 8-10 человек

### Fundraising
- **Close Seed round:** $500K - $1M
- **Use of funds:** Product development (40%), Marketing (30%), Team (20%), Operations (10%)

### Metrics (EOQ)
- **Beta users (TestFlight):** 500-1,000
- **Pilot users:** 50-100 families
- **Retention (Day 30):** > 50%
- **NPS:** > 55
- **ML Accuracy:** Precision > 80%, Recall > 75%

---

## Q3 2026: Public Launch (iOS) & Android Beta

### Цели
- Public launch iOS в App Store
- Начало marketing campaigns
- Android beta launch
- Достичь 5,000 paying users

### Product Milestones
- [ ] iOS App Store launch (публичный релиз)
- [ ] Android beta в Google Play (TestFlight equivalent)
- [ ] Локализация на английский язык (начало)
- [ ] B2B pilot (1-2 школы)

### Features
- ✅ Мультиязычность (русский + английский)
- ✅ Интеграция с популярными мессенджерами (начало исследования: WhatsApp, Telegram API)
- 🚧 Образовательный контент для детей ("Как вести себя безопасно онлайн")
- 🚧 AI-рекомендации для родителей

### Marketing & Growth
- **Channels:**
  - Paid ads (Facebook, Instagram, Google): $50K budget
  - Content marketing (blog posts, SEO)
  - PR (tech media, parenting blogs)
  - Partnerships (школы, НКО, child psychologists)
- **Goal:** CAC < $30, LTV > $200

### Technical
- Custom ML models (начало fine-tuning собственных моделей для снижения API costs)
- Multi-region deployment (EU + US servers для data localization)

### Team
- **Add:** 1 Mobile Developer (Android), 1 ML Engineer, 1 SRE, 1 Marketing Lead
- **Total:** 12-15 человек

### Fundraising
- **Prepare for Series A:** Начать conversations с VCs

### Metrics (EOQ)
- **Paying users:** 5,000
- **MRR:** $100K
- **Retention (Day 30):** > 40%
- **NPS:** > 60
- **Churn:** < 25% annually

---

## Q4 2026: Scale & Android Public Launch

### Цели
- Android public launch
- Достичь 10,000 paying users
- Prepare Series A fundraising

### Product Milestones
- [ ] Android App Store launch (публичный релиз)
- [ ] Feature parity (iOS и Android на одинаковом уровне)
- [ ] B2B offering (официальный продукт для школ)

### Features
- ✅ Продвинутая аналитика (AI-powered insights)
- ✅ Интеграция с WhatsApp (если API доступен) или альтернативный подход
- 🚧 Gamification для детей (badges за безопасное поведение)
- 🚧 Parent community (форум для родителей)

### Marketing & Growth
- **Channels:**
  - Continued paid ads: $100K/quarter
  - Influencer marketing (parenting bloggers)
  - Referral program optimization
  - B2B sales (outreach к школам)
- **Goal:** CAC < $25, LTV > $240

### Technical
- Self-hosted ML models (снижение costs на OpenAI API)
- Advanced security (SOC 2 Type I preparation)

### Team
- **Add:** 2 Backend Engineers, 1 Product Manager, 1 Designer, 1 Sales Lead (B2B)
- **Total:** 18-20 человек

### Fundraising
- **Series A kick-off:** Pitch VCs, target $5-10M
- **Valuation target:** $30-50M

### Metrics (EOQ)
- **Paying users:** 10,000
- **MRR:** $200K
- **Retention (Day 30):** > 45%
- **NPS:** > 65
- **B2B revenue:** $50K ARR

---

## Q1 2027: Series A & US Expansion

### Цели
- Close Series A round
- Expand в US market
- Достичь 20,000 paying users

### Product Milestones
- [ ] US market launch (localized content, partnerships)
- [ ] Compliance: COPPA certification
- [ ] Enhanced B2B product (dashboards для школ)

### Features
- ✅ Real-time синхронизация между устройствами (multi-device support)
- ✅ Advanced parental controls (geofencing, screen time limits)
- 🚧 Integration с school systems (Google Classroom, Schoology)

### Marketing & Growth
- **US GTM strategy:**
  - Partnerships с US schools и НКО
  - US-specific paid ads
  - PR в US media (TechCrunch, Wired, Parenting magazines)
- **Budget:** $200K/quarter

### Technical
- Multi-region infrastructure (US East, US West, EU)
- SOC 2 Type II certification

### Team
- **Add:** 3 Engineers, 1 US Sales Lead, 1 Legal (US COPPA expert), 1 Marketing (US)
- **Total:** 25-30 человек

### Fundraising
- **Close Series A:** $5-10M
- **Use of funds:** US expansion (40%), Product (30%), Team (20%), Marketing (10%)

### Metrics (EOQ)
- **Paying users:** 20,000 (включая 5K+ в US)
- **MRR:** $400K
- **Retention (Day 30):** > 50%
- **NPS:** > 70
- **B2B revenue:** $200K ARR

---

## Q2 2027: EU Expansion & Feature Expansion

### Цели
- Expand в EU market
- Достичь 40,000 paying users
- Launch advanced AI features

### Product Milestones
- [ ] EU market launch (GDPR-K compliant)
- [ ] Multi-language support (5+ languages: EN, RU, DE, FR, ES)
- [ ] Advanced AI features (predictive analytics, proactive recommendations)

### Features
- ✅ Predictive risk scoring (ML model предсказывает риски до того, как произойдёт incident)
- ✅ AI coaching для родителей ("Как поговорить с ребёнком об этой ситуации")
- 🚧 Integration с telecom operators (white-label или partnership)

### Marketing & Growth
- **EU GTM strategy:**
  - EU partnerships (schools, governments)
  - EU-specific ads
  - PR в EU media
- **Budget:** $300K/quarter

### Technical
- EU data centers (for GDPR data residency)
- Advanced ML models (lower latency, higher accuracy)

### Team
- **Add:** 5 Engineers, 1 EU Sales Lead, 1 EU Legal
- **Total:** 35-40 человек

### Metrics (EOQ)
- **Paying users:** 40,000
- **MRR:** $800K
- **Retention (Day 30):** > 55%
- **NPS:** > 75
- **B2B revenue:** $500K ARR

---

## Q3 2027: Asia Expansion (Pilot)

### Цели
- Pilot launch в Asia (Япония, Южная Корея, Сингапур)
- Достичь 60,000 paying users globally

### Product Milestones
- [ ] Asia pilot (1-2 страны)
- [ ] Localization (японский, корейский)
- [ ] Partnerships с local schools/organizations

### Features
- ✅ Multi-messenger integration (Line, KakaoTalk, WeChat для Asia)
- ✅ Cultural adaptation (content moderation models для Asian languages)

### Marketing & Growth
- **Asia GTM strategy:**
  - Local partnerships
  - Localized ads
- **Budget:** $200K/quarter

### Technical
- Asia data centers (Singapore, Tokyo)

### Team
- **Add:** 3 Engineers, 1 Asia BD Lead
- **Total:** 45-50 человек

### Metrics (EOQ)
- **Paying users:** 60,000
- **MRR:** $1.2M
- **Retention (Day 30):** > 55%
- **NPS:** > 75

---

## Q4 2027: Scale & Profitability Focus

### Цели
- Достичь 100,000 paying users
- Cash flow positive (или близко к этому)
- Prepare для Series B или path to profitability

### Product Milestones
- [ ] Feature complete (все основные features запущены)
- [ ] Optimization focus (snappier UX, lower costs)

### Features
- ✅ All planned features launched
- Focus на polish и optimization

### Marketing & Growth
- **Focus на organic growth:**
  - Referral program optimization (viral coefficient > 1.2)
  - Content marketing (SEO, blogs)
  - Community-driven growth
- **Reduce paid ads spend** (shift к organic)

### Technical
- Cost optimization (self-hosted ML, infrastructure tuning)
- Gross margin improvement: 75% → 80%

### Team
- **Add:** Minimal (focus на efficiency)
- **Total:** 50-60 человек

### Metrics (EOQ)
- **Paying users:** 100,000
- **MRR:** $2M
- **ARR:** $24M
- **EBITDA:** Near break-even или slightly profitable
- **Retention (Day 30):** > 50%
- **NPS:** > 75

---

## 2028: Global Scale & New Markets

### Цели
- **Q1-Q2:** Latin America expansion (Brazil, Mexico, Argentina)
- **Q3-Q4:** Rest of World expansion (Africa, Middle East)
- **EOY:** 200,000+ paying users, $50M+ ARR

### Product Milestones
- [ ] Global presence (10+ countries)
- [ ] Enterprise product (large school districts, governments)

### Features
- Advanced enterprise features (SSO, custom policies, white-label)

### Technical
- Global CDN optimization
- Multi-cloud (AWS + GCP for redundancy)

### Team
- **Total:** 80-100+ человек

### Fundraising (если нужен)
- **Series B:** $20-50M (если планируем aggressive expansion)
- **Or:** Profitable growth (no external funding needed)

### Metrics (EOY 2028)
- **Paying users:** 200,000+
- **ARR:** $50M+
- **Profitable:** EBITDA positive
- **NPS:** > 75

---

## Ключевые метрики на каждом этапе (Summary)

| Период | Paying Users | MRR | ARR | Retention (D30) | NPS | Churn |
|--------|--------------|-----|-----|-----------------|-----|-------|
| Q1 2026 | 10-20 (pilot) | - | - | > 60% | > 50 | - |
| Q2 2026 | 50-100 | - | - | > 50% | > 55 | - |
| Q3 2026 | 5,000 | $100K | $1.2M | > 40% | > 60 | < 25% |
| Q4 2026 | 10,000 | $200K | $2.4M | > 45% | > 65 | < 20% |
| Q1 2027 | 20,000 | $400K | $4.8M | > 50% | > 70 | < 20% |
| Q2 2027 | 40,000 | $800K | $9.6M | > 55% | > 75 | < 15% |
| Q3 2027 | 60,000 | $1.2M | $14.4M | > 55% | > 75 | < 15% |
| Q4 2027 | 100,000 | $2M | $24M | > 50% | > 75 | < 20% |
| EOY 2028 | 200,000+ | $4M+ | $50M+ | > 50% | > 75 | < 20% |

---

## Risks & Mitigation

**Risk 1: Slow user growth**
- **Причина:** Poor product-market fit, high CAC
- **Mitigation:** Pivot strategy, focus на niche, partnerships

**Risk 2: Регуляторные изменения**
- **Причина:** Новые законы, ограничивающие child data processing
- **Mitigation:** Legal advisory, compliance-first, lobby

**Risk 3: Competitive pressure (Big Tech enters market)**
- **Причина:** Apple/Google launch similar features
- **Mitigation:** Focus на superior AI, niche focus, partnerships

**Risk 4: Funding challenges**
- **Причина:** Market downturn, investor skepticism
- **Mitigation:** Path to profitability, bootstrap-friendly growth

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Leadership Team  
**Статус:** Living document — будет обновляться quarterly
