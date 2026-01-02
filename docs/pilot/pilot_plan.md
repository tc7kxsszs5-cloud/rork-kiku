# План пилотного запуска — Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT — требует ревью команды
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Цели пилота

### 1.1. Бизнес-цели
- ✅ Валидация product-market fit
- ✅ Получение feedback от реальных пользователей
- ✅ Тестирование бизнес-модели (freemium conversion)
- ✅ Сбор метрик для инвесторской презентации
- ✅ Выявление критических багов и UX проблем

### 1.2. Технические цели
- ✅ Тестирование ML модерации на реальных данных
- ✅ Оптимизация производительности (latency, throughput)
- ✅ Проверка стабильности infrastructure
- ✅ Выявление узких мест (bottlenecks)
- ✅ Сбор данных для retraining ML моделей

### 1.3. Compliance цели
- ✅ Проверка COPPA/GDPR compliance на практике
- ✅ Тестирование parental consent flow
- ✅ Validation privacy policy и user agreements
- ✅ Проверка data deletion и export flows

---

## 2. Scope пилота

### 2.1. Целевая аудитория
- **Размер**: 100-500 активных пользователей
- **География**: Преимущественно США (English-speaking)
- **Демография**: Родители детей 5-12 лет
- **Источники**:
  - Founder network (friends & family): 20-30%
  - Partnership schools/НКО: 40-50%
  - Online communities (Reddit, Facebook groups): 20-30%
  - Waitlist: 10-20%

### 2.2. Платформа
- **iOS only** (TestFlight)
- **Minimum iOS version**: 14.0+
- **Target devices**: iPhone 8 и новее

### 2.3. Функционал
См. `docs/mvp/mvp_spec.md` для полного списка фич.

**Критические фичи**:
- Sign in with Apple/Google
- Создание детских профилей
- Загрузка фото (камера + галерея)
- AI модерация
- Push notifications
- Gallery view

**Не включены в пилот**:
- Video upload
- Android app
- Real-time chat
- Social features

---

## 3. KPI и Success Metrics

### 3.1. User Engagement

| Метрика | Target | Measurement |
|---------|--------|-------------|
| **Active users** | 100+ за 4 недели | Daily/Weekly active users |
| **DAU/MAU** | > 30% | Daily active / Monthly active |
| **Photos uploaded per user/week** | > 5 | Average uploads per active user |
| **Retention Day 7** | > 40% | % users active on day 7 |
| **Retention Day 30** | > 20% | % users active on day 30 |
| **Session duration** | > 3 min | Average time in app per session |
| **Sessions per week** | > 3 | Average sessions per active user |

### 3.2. Product Quality

| Метрика | Target | Measurement |
|---------|--------|-------------|
| **NPS (Net Promoter Score)** | > 40 | In-app survey (sample 50+ users) |
| **Critical bugs** | 0 | Severity P0 bugs |
| **Crash rate** | < 1% | iOS crash analytics |
| **App Store rating** (if launched) | > 4.0 | Average rating |
| **Support tickets** | < 20% users | % users submitting tickets |

### 3.3. Moderation Performance

| Метрика | Target | Measurement |
|---------|--------|-------------|
| **ML accuracy** | > 90% | (TP + TN) / Total samples |
| **False positive rate** | < 5% | FP / (FP + TN) |
| **False negative rate** | < 1% | FN / (FN + TP) — критично! |
| **Moderation latency (p95)** | < 10 sec | Time from upload to decision |
| **Manual review queue** | < 50 items | Max pending items at any time |
| **Manual review time** | < 2 hours | Avg time for moderator decision |

**Definitions**:
- **True Positive (TP)**: Unsafe content correctly rejected
- **True Negative (TN)**: Safe content correctly approved
- **False Positive (FP)**: Safe content incorrectly rejected (frustrating)
- **False Negative (FN)**: Unsafe content incorrectly approved (CRITICAL RISK)

### 3.4. Business Metrics

| Метрика | Target | Measurement |
|---------|--------|-------------|
| **Conversion Free → Paid** | > 5% | % free users upgrading |
| **Churn rate** | < 10%/month | % users leaving per month |
| **CAC (est.)** | < $50 | Cost per acquired user |
| **Feedback response rate** | > 30% | % users responding to surveys |

### 3.5. Infrastructure Metrics

| Метрика | Target | Measurement |
|---------|--------|-------------|
| **Uptime** | > 99% | % time API available |
| **API latency (p95)** | < 300ms | 95th percentile response time |
| **ML inference throughput** | > 10 images/sec | Processing rate |
| **Database query time (p95)** | < 100ms | 95th percentile DB query time |
| **S3 upload success rate** | > 99.9% | % successful uploads |

---

## 4. Timeline и Phases

### Phase 1: Internal Alpha (Week 1-2)
**Participants**: 10-20 internal testers (team, family, close friends)

**Goals**:
- Smoke test critical flows
- Identify obvious bugs
- Test onboarding UX
- Verify ML модерация works end-to-end

**Activities**:
- Daily standups для bug triage
- Rapid iteration on критичные bugs
- UX feedback sessions

**Success criteria**:
- 0 critical bugs
- All core flows work
- Onboarding < 2 min
- ML модерация functional

### Phase 2: Closed Beta (Week 3-4)
**Participants**: 50-100 users (founder network + early waitlist)

**Goals**:
- Expand testing to diverse use cases
- Measure initial engagement metrics
- Test infrastructure under moderate load
- Gather qualitative feedback

**Activities**:
- Weekly feedback survey
- In-app feedback form monitoring
- Analytics dashboard setup
- Community Slack/Discord channel

**Success criteria**:
- DAU/MAU > 25%
- Retention Day 7 > 35%
- < 5 critical bugs
- Positive feedback (NPS > 30)

### Phase 3: Partnership Pilot (Week 5-8)
**Participants**: 100-300 users via school/NGO partnerships

**Goals**:
- Test at scale (hundreds of users)
- Validate B2B partnership model
- Measure conversion Free → Paid
- Build case studies for investors

**Activities**:
- Onboard partner schools (2-3 schools, 50-100 families each)
- Weekly check-ins с partner coordinators
- Educational materials для parents
- Moderation quality monitoring

**Success criteria**:
- 100+ active users
- DAU/MAU > 30%
- Retention Day 7 > 40%
- NPS > 40
- ML accuracy > 90%
- 3-5% conversion to paid (acceptable for pilot)

### Phase 4: Open Beta (Week 9-12+)
**Participants**: 300-500+ users (open TestFlight, waitlist, referrals)

**Goals**:
- Prepare for App Store launch
- Optimize for scale
- Final bug fixes and polish
- Marketing materials и screenshots

**Activities**:
- Open TestFlight links
- Social media campaign
- Content marketing (blog posts, case studies)
- Investor updates

**Success criteria**:
- All Phase 3 targets met or exceeded
- Infrastructure stable (99%+ uptime)
- Ready for public App Store launch
- Investor deck updated with real data

---

## 5. Partnerships — Желаемые партнёры

### 5.1. Школы (K-8)
**Target**: 3-5 pilot schools

**Profile**:
- Progressive schools с digital literacy programs
- Strong parent community engagement
- Tech-forward (already use EdTech tools)
- 200-500 students (50-100 families interested)

**Outreach strategy**:
- Email template (см. `docs/templates/outreach_templates.md`)
- Offer: Free Premium accounts for pilot participants
- Value prop: Digital safety education workshop for parents
- Ask: Endorsement letter, email blast to parents, parent meeting

**Potential partners** (PLACEHOLDER — identify real schools):
- [School Name 1, City, State]
- [School Name 2, City, State]
- [School Name 3, City, State]

### 5.2. НКО (Child Safety)
**Target**: 2-3 organizations

**Profile**:
- National Center for Missing & Exploited Children (NCMEC)
- Common Sense Media
- ConnectSafely
- Internet Safety 101
- Local child advocacy organizations

**Outreach strategy**:
- Partnership proposal: Co-branded educational content
- Offer: Donation ($5K-10K), free accounts для their community
- Value prop: Aligned mission (child safety online)
- Ask: Logo usage, endorsement, email blast

### 5.3. Parenting Communities
**Target**: 5-10 communities

**Online communities**:
- Reddit: r/Parenting, r/Mommit, r/Daddit
- Facebook Groups: "Parenting in [City]", "Digital Parenting"
- Forums: BabyCenter, What to Expect

**Influencers**:
- Parenting bloggers (50K+ followers)
- TikTok/Instagram parent creators
- Podcast hosts (parenting podcasts)

**Outreach strategy**:
- Personalized emails (avoid spam)
- Offer: Early access, free Premium for 6 months
- Ask: Post about the app, honest review

---

## 6. Security & Parental Consent Checklist

### 6.1. Security Requirements

- [ ] **HTTPS only**: All API traffic encrypted with TLS 1.3
- [ ] **JWT validation**: Proper signature verification, expiration checks
- [ ] **Rate limiting**: Per-user and per-IP rate limits enabled
- [ ] **Input validation**: All user inputs sanitized (XSS, SQL injection prevention)
- [ ] **File upload validation**: MIME type checks, file size limits, malware scanning
- [ ] **Database encryption**: At-rest encryption enabled (AES-256)
- [ ] **Secrets management**: No secrets in code, use AWS Secrets Manager / Vault
- [ ] **Audit logging**: All sensitive operations logged (auth, data access, moderation)
- [ ] **Backup and restore**: Daily automated backups tested
- [ ] **Incident response plan**: Documented playbook (см. `docs/security/security_design.md`)

### 6.2. Parental Consent Requirements

- [ ] **Age gate**: Verify user is 18+ during sign-up
- [ ] **Privacy Policy**: Clear, accessible, COPPA/GDPR compliant
- [ ] **Terms of Service**: Reviewed by lawyer, user must accept
- [ ] **Consent for child profile**: Parent explicitly consents to child data collection
- [ ] **Opt-in for notifications**: Parent chooses to enable push notifications
- [ ] **Data export**: Parent can export all data (GDPR "right to access")
- [ ] **Data deletion**: Parent can delete account and all data (GDPR "right to erasure")
- [ ] **Transparency**: Clear explanation of what data is collected, why, how it's used

### 6.3. Moderation Policy

- [ ] **Content policy published**: Clear guidelines on what's prohibited (см. `docs/legal/content_policy.md`)
- [ ] **ML + human review**: Two-tier moderation (auto + manual)
- [ ] **Escalation process**: Path for parents to appeal moderation decisions
- [ ] **Moderator training**: Guidelines and training materials for human moderators
- [ ] **Audit trail**: All moderation decisions logged and reviewable

### 6.4. Compliance Checklist

- [ ] **COPPA compliance**:
  - Parental consent before child data collection
  - No behavioral advertising to children
  - Parent can review and delete child data
  - Privacy Policy clear about child data handling

- [ ] **GDPR compliance** (if EU users):
  - Lawful basis for processing (consent)
  - Privacy Policy in plain language
  - Data retention policy defined
  - DPO appointed (if required)

- [ ] **Apple App Store requirements**:
  - Privacy nutrition label filled out
  - Age rating accurate (4+ for app, parental gate required)
  - In-app purchase tested (if using subscriptions)
  - No crashes in review build

---

## 7. Phased Rollout Plan

### Week 1-2: Internal Alpha
- **Release**: Internal TestFlight build
- **Users**: 10-20
- **Focus**: Critical bug fixes

### Week 3-4: Closed Beta
- **Release**: TestFlight build #2
- **Users**: 50-100
- **Focus**: Engagement metrics, feedback

### Week 5-6: Partnership Onboarding
- **Release**: TestFlight build #3 (stable)
- **Users**: +50 from School 1
- **Focus**: Partner satisfaction, onboarding UX

### Week 7-8: Partnership Expansion
- **Release**: TestFlight build #4
- **Users**: +100 from Schools 2-3
- **Focus**: Scale testing, moderation quality

### Week 9-10: Open Beta Soft Launch
- **Release**: TestFlight build #5
- **Users**: +150 from waitlist/referrals
- **Focus**: Public readiness, marketing content

### Week 11-12: Pre-Launch Polish
- **Release**: Release Candidate (RC)
- **Users**: 300-500 total
- **Focus**: App Store submission prep, final testing

### Week 13+: App Store Launch
- **Release**: Public App Store
- **Users**: Open to all
- **Focus**: Growth, marketing, support

---

## 8. Risks и Mitigation

| Риск | Вероятность | Impact | Митигация |
|------|-------------|--------|-----------|
| **Low user adoption** | Средняя | Критичный | Strong partnership outreach, referral incentives, early waitlist building |
| **High false positive rate** | Высокая | Средний | Tune ML thresholds, improve models, fast manual review |
| **False negatives (unsafe content approved)** | Низкая | Критичный | Conservative thresholds, manual review for edge cases, rapid response to reports |
| **iOS TestFlight limits (10K users)** | Низкая | Низкий | Plan for App Store launch before hitting limit |
| **Partner school drops out** | Средняя | Средний | Have backup schools, maintain relationships, deliver value early |
| **Critical bug in production** | Средняя | Высокий | Comprehensive testing, staged rollout, rollback plan, 24/7 monitoring |
| **Poor NPS / negative feedback** | Средняя | Высокий | Rapid iteration, responsive support, user interviews, pivot if needed |
| **Infrastructure costs exceed budget** | Средняя | Средний | Monitor spending, optimize (caching, CDN), cost alerts |

---

## 9. Success Criteria — Decision Points

### Go / No-Go для App Store Launch

**Must Have (all criteria)**:
- ✅ 100+ active users в pilot
- ✅ Retention Day 7 > 40%
- ✅ NPS > 40
- ✅ ML accuracy > 90%
- ✅ 0 critical bugs
- ✅ 99%+ uptime за последние 2 недели
- ✅ Privacy Policy и ToS reviewed by lawyer
- ✅ Apple TestFlight submission approved

**Nice to Have**:
- ⚠️ 5%+ conversion Free → Paid
- ⚠️ Positive testimonials/case studies от pilot users
- ⚠️ Partnership agreements signed с 2+ schools

**Red Flags (stop and fix)**:
- 🚫 False negative rate > 2% (unsafe content getting through)
- 🚫 Crash rate > 2%
- 🚫 Major security vulnerability discovered
- 🚫 Negative press / PR crisis
- 🚫 Retention Day 7 < 25%

### Pivot vs. Persevere

**Signals to pivot**:
- NPS < 20 (users не любят продукт)
- Retention Day 7 < 20% (no engagement)
- Conversion < 2% (no willingness to pay)
- Consistent negative feedback на core value prop

**Signals to persevere**:
- NPS 40+ (users любят продукт, но может быть мелкие issues)
- Retention 30-40% (decent engagement, can improve)
- Conversion 5%+ (willing to pay, can optimize)
- Positive qualitative feedback, users requesting more features

---

## 10. Post-Pilot Next Steps

### If Successful (criteria met):
1. **App Store launch** (Q2 2026)
2. **Marketing campaign** ramp-up
3. **Series A fundraising** preparation
4. **Android development** starts
5. **Team expansion** (hire 3-5 people)

### If Partially Successful (some criteria met):
1. **Iterate** на problem areas (e.g., improve retention, fix UX)
2. **Extended pilot** (additional 4-8 weeks)
3. **Pivot** features if needed (e.g., change moderation UX)
4. **Re-evaluate** before major investment (App Store, Android)

### If Unsuccessful (criteria not met):
1. **Deep dive** user interviews (why didn't they engage?)
2. **Pivot** or **sunset** decision
3. **Return funds** to investors (if pre-seed raised)
4. **Lessons learned** documentation

---

## 11. Контакты

- **Pilot Lead**: [FOUNDERS_EMAIL]
- **Tech Lead**: [FOUNDERS_EMAIL]
- **Partnership Lead**: [FOUNDERS_EMAIL]
- **Support**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Этот документ — черновик плана пилота. Все timeline и метрики — оценки и могут быть скорректированы по мере выполнения. Не содержит production-кода или реальных секретов.
