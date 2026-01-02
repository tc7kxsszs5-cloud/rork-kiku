# План пилотного запуска Rork-Kiku

## Обзор

Пилотный проект Rork-Kiku для валидации product-market fit с реальными пользователями в контролируемой среде. Пилот запускается в Q2 2026 с целью набрать 1,000 платных пользователей и протестировать продукт перед масштабированием.

---

## Цели пилота

### Бизнес-цели
1. **Валидация спроса**: Подтвердить готовность платить за продукт
2. **Product-market fit**: Убедиться, что продукт решает реальную проблему
3. **Feedback loop**: Собрать детальную обратную связь для улучшений
4. **Traction для инвесторов**: Показать early traction для Seed round
5. **Partnerships**: Установить отношения с ключевыми партнерами (школы)

### Продуктовые цели
1. **Протестировать UX**: Родители и дети понимают и используют продукт
2. **ML модели**: Проверить точность фильтрации (false positives/negatives)
3. **Масштабируемость**: Проверить инфраструктуру под нагрузкой
4. **Безопасность**: Убедиться в защите данных и соответствии COPPA

---

## Этапы пилота

### Phase 1: Beta Testing (Q1 2026)

**Сроки**: Январь - Март 2026 (12 недель)

**Участники**:
- 50 семей (friends & family, early adopters)
- Бесплатный доступ к Premium features
- Активное вовлечение в feedback

**Задачи**:
- [ ] Рекрутинг beta testers (outreach, email, social media)
- [ ] Onboarding sessions (1-on-1 walkthrough)
- [ ] Weekly feedback calls (10-15 семей ротация)
- [ ] Bug fixing и improvements
- [ ] Итерации на основе feedback

**Метрики**:
- Beta signup rate: > 60% (из приглашенных)
- DAU/MAU: > 0.5
- Bugs reported: < 20 critical bugs
- NPS: > 30

**Deliverables**:
- Beta feedback report
- Product improvements roadmap
- Refined user personas

---

### Phase 2: School Pilot (Q2 2026)

**Сроки**: Апрель - Июнь 2026 (12 недель)

**Участники**:
- **2-3 школы** в Калифорнии (Bay Area или LA)
- 200-300 семей (через школу)
- Бесплатный доступ для родителей учеников

**Школы (target profile)**:
- K-8 (детский сад - 8 класс)
- Progressive approach к tech & safety
- 500-1,500 учеников
- Активное вовлечение родителей (PTA)

**Partnerships approach**:
1. **Outreach**: Email + cold call к школьным администраторам
2. **Presentation**: Demo product к Principal, IT Director, Counselor
3. **Pilot proposal**: Free 3-month access, training, support
4. **Parental consent**: Информационные письма через школу
5. **Onboarding**: Workshops для родителей (2 sessions)
6. **Support**: Dedicated support channel (email, phone)

**Задачи**:
- [ ] Identify и outreach к 10-15 школам
- [ ] Secure 2-3 школы для pilot
- [ ] Разработка educational materials (презентации, flyers)
- [ ] Parental consent процесс
- [ ] Onboarding workshops (в школе или виртуально)
- [ ] Monitoring и support (daily check-ins)
- [ ] Mid-pilot survey (Week 6)
- [ ] End-of-pilot survey и interviews

**Метрики**:
- School sign-up rate: 2-3 из 15 contacted
- Parent adoption: > 50% (из учеников школы)
- DAU/MAU: > 0.6
- NPS: > 40
- Школы хотят продолжить (paid): 100%

**Deliverables**:
- School pilot report (case studies)
- Testimonials (parents, teachers, administrators)
- Enterprise tier requirements (для schools)
- Pricing model validation

---

### Phase 3: Public Beta (Q2-Q3 2026)

**Сроки**: Июль - Сентябрь 2026 (12 недель)

**Участники**:
- 1,000 платных пользователей (target)
- Открытый доступ через App Store
- Freemium model с conversion focus

**Channels**:
- App Store (iOS)
- Website landing page
- Social media ads (Facebook, Instagram)
- Content marketing (blog, SEO)
- Referral program (beta users)
- PR (TechCrunch, Wired, parenting blogs)

**Задачи**:
- [ ] App Store launch (production)
- [ ] Marketing campaigns launch
- [ ] Performance ads optimization (A/B testing)
- [ ] Content marketing (2-3 posts/week)
- [ ] Referral program activation
- [ ] PR outreach (10-15 publications)
- [ ] Customer support scaling (Zendesk setup)
- [ ] Analytics setup (Mixpanel, Amplitude)

**Метрики**:
- 1,000 paid users by end of Q3
- $50K MRR
- Conversion rate (free → paid): > 5%
- CAC: < $80
- Churn: < 20% (monthly)
- LTV/CAC: > 3:1

**Deliverables**:
- Marketing playbook (что работает, что нет)
- Customer acquisition strategy (refined)
- Pricing model finalized
- Product roadmap (based on user feedback)

---

## KPI Dashboard

### Пилот-метрики

| Metric | Beta (Q1) | School Pilot (Q2) | Public Beta (Q3) |
|--------|-----------|-------------------|------------------|
| **Users (total)** | 50 | 300 | 5,000 |
| **Paid users** | 0 | 0 | 1,000 |
| **DAU/MAU** | 0.5 | 0.6 | 0.6 |
| **NPS** | 30 | 40 | 45 |
| **Churn (monthly)** | N/A | N/A | < 20% |
| **CAC** | $0 | $0 | $80 |
| **MRR** | $0 | $0 | $50K |

### Продуктовые метрики

**Content Filtering**:
- False Positive Rate: < 5%
- False Negative Rate: < 2%
- ML Inference Latency: p95 < 500ms

**Engagement**:
- Daily content checks per child: > 50
- Parent dashboard views per week: > 3
- Parental requests response time: < 24h

**Technical**:
- API Uptime: > 99.5%
- Crash-free sessions: > 99%
- App loading time: < 3s

---

## Чеклист безопасности и compliance

### COPPA Compliance

- [ ] **Parental Consent Process**
  - [ ] Clear consent form (понятный язык)
  - [ ] Описание собираемых данных
  - [ ] Цель использования данных
  - [ ] Право на доступ и удаление данных

- [ ] **Privacy Policy**
  - [ ] Опубликована в app и на сайте
  - [ ] Описание data collection practices
  - [ ] Третьи стороны (если есть)
  - [ ] Контактная информация

- [ ] **Data Security**
  - [ ] Шифрование в транзите (TLS 1.3)
  - [ ] Шифрование в покое (AES-256)
  - [ ] Secure token storage (Expo SecureStore)
  - [ ] Regular security audits

- [ ] **Data Retention**
  - [ ] Clear retention policy
  - [ ] Automatic deletion process
  - [ ] Parent can request data export/deletion

- [ ] **Third-party Services**
  - [ ] Review all third-party integrations
  - [ ] Ensure COPPA compliance
  - [ ] DPAs (Data Processing Agreements) signed

### Security Checklist

- [ ] **Authentication**
  - [ ] JWT with expiration
  - [ ] Refresh token rotation
  - [ ] Password hashing (bcrypt)
  - [ ] Rate limiting (login attempts)

- [ ] **Authorization**
  - [ ] RBAC implemented
  - [ ] Permission checks on all endpoints
  - [ ] Child data isolation (parent can only access own children)

- [ ] **Data Protection**
  - [ ] PII encryption (field-level)
  - [ ] Database encryption (RDS)
  - [ ] Backup encryption
  - [ ] Secure key management (KMS)

- [ ] **Monitoring**
  - [ ] Security event logging
  - [ ] Alert on suspicious activity
  - [ ] Regular log review
  - [ ] Incident response plan

- [ ] **Penetration Testing**
  - [ ] Internal security review
  - [ ] External pentest (before public launch)
  - [ ] Vulnerability remediation
  - [ ] Retest critical findings

---

## Parental Consent Process

### Verifiable Parental Consent (VPC)

**COPPA требует "verifiable" consent** — нужно удостовериться, что consent дал родитель, а не ребенок.

### Варианты верификации (от простых к строгим):

#### Option 1: Email + Credit Card (Рекомендуется для MVP)

**Process**:
1. Родитель регистрируется (email + password)
2. Подтверждение email (verification link)
3. Создание child profile
4. Ввод credit card для $0.01 authorization (не charge)
5. Consent form (checkbox + signature)

**Плюсы**:
- Простой UX
- Быстрый onboarding
- Credit card = reasonable verification (FTC accepts)

**Минусы**:
- Требует credit card (может оттолкнуть некоторых)

#### Option 2: Government ID Verification

**Process**:
1. Родитель регистрируется
2. Upload driver's license / passport (photo)
3. Third-party verification (Stripe Identity, Jumio)
4. Approval (automated или manual review)
5. Consent form

**Плюсы**:
- Очень высокая верификация
- COPPA compliant

**Минусы**:
- Сложный UX
- Privacy concerns (родители не хотят давать ID)
- Дорого (third-party services)

#### Option 3: Video Call Verification

**Process**:
1. Родитель регистрируется
2. Scheduling video call (15-min slot)
3. Video call с support team
4. Verification (show ID, sign consent)

**Плюсы**:
- Human touch
- High verification

**Минусы**:
- Не масштабируется
- Дорого (support time)
- Slow onboarding

### Рекомендация для пилота: Option 1 (Email + Credit Card)

**Обоснование**:
- FTC accepts credit card as reasonable verification
- Простой UX (важно для пилота)
- Масштабируется
- Можно добавить Option 2/3 позже для edge cases

⚠️ **ВАЖНО**: Получить юридическую консультацию перед финализацией процесса.

---

## Список партнеров

### Целевые школы (Bay Area, California)

**Tier 1 (Ideal)**:
- [ ] Summit Public Schools (network of innovative schools)
- [ ] Basis Independent Schools
- [ ] Nueva School (progressive, tech-forward)
- [ ] Saklan School
- [ ] Kehillah Jewish High School

**Tier 2 (Good fit)**:
- [ ] Public schools в Palo Alto USD
- [ ] Public schools в Mountain View-Los Altos USD
- [ ] Private schools в SF Bay Area

**Contact approach**:
1. Research principal/IT director
2. Email introduction + product demo link
3. Follow-up call (1 week later)
4. In-person meeting (if interested)
5. Pilot proposal (written)

### Parenting Organizations

- [ ] PTA (Parent-Teacher Association)
- [ ] Common Sense Media (partnership/endorsement)
- [ ] National Center for Missing & Exploited Children
- [ ] Family Online Safety Institute
- [ ] American Academy of Pediatrics (local chapters)

### Influencers & Bloggers

**Parenting influencers** (Instagram, TikTok, YouTube):
- [ ] 5-10 mid-tier influencers (50K-500K followers)
- [ ] Focus on tech & safety topics
- [ ] Compensation: Free Premium + $500-2000 per post

**Parenting bloggers**:
- [ ] Mom blogs (tech-savvy moms)
- [ ] Dad blogs (emerging segment)
- [ ] Family tech review sites

---

## Этапы и сроки (подробно)

### Week-by-Week Plan (Q2 2026 School Pilot)

**Week 1-2: Preparation**
- [ ] Finalize school list
- [ ] Create pitch deck для schools
- [ ] Develop educational materials
- [ ] Setup support infrastructure

**Week 3-4: Outreach**
- [ ] Email outreach (10-15 schools)
- [ ] Follow-up calls
- [ ] Schedule demo meetings

**Week 5-6: Demos & Negotiations**
- [ ] In-person demos (3-5 schools)
- [ ] Pilot proposals
- [ ] Legal agreements (pilot terms)

**Week 7-8: Onboarding**
- [ ] Parental consent process (through school)
- [ ] Parent workshops (2 sessions per school)
- [ ] App installation support

**Week 9-10: Active Pilot**
- [ ] Daily monitoring
- [ ] Weekly check-ins с school contacts
- [ ] Mid-pilot survey (parents)
- [ ] Bug fixes & support

**Week 11-12: Wrap-up**
- [ ] End-of-pilot survey
- [ ] Parent interviews (10-15)
- [ ] School debrief meetings
- [ ] Testimonial collection
- [ ] Case study writing

---

## Budget для пилота

### Q1 2026 Beta (12 weeks)

| Item | Cost | Notes |
|------|------|-------|
| Team (founders) | $0 | Sweat equity |
| Contract engineer | $15K | Part-time support |
| AWS infrastructure | $2K | Dev & staging |
| Tools (Zoom, survey) | $500 | Software subscriptions |
| **Total Q1** | **$17.5K** | |

### Q2 2026 School Pilot (12 weeks)

| Item | Cost | Notes |
|------|------|-------|
| Team salaries | $40K | 2 founders + 1 engineer |
| Travel (school visits) | $2K | Bay Area travel |
| Marketing materials | $1K | Flyers, presentations |
| Workshops (venue) | $1K | If in-person |
| AWS infrastructure | $5K | Scaling up |
| Support tools | $1K | Zendesk, Intercom |
| **Total Q2** | **$50K** | |

### Q3 2026 Public Beta (12 weeks)

| Item | Cost | Notes |
|------|------|-------|
| Team salaries | $100K | Growing team |
| Marketing ads | $50K | Facebook, Instagram |
| Content marketing | $10K | Blog, SEO, copywriting |
| PR agency | $15K | Optional, 3 months |
| AWS infrastructure | $15K | 5K users |
| Support & tools | $5K | Scaling support |
| **Total Q3** | **$195K** | |

**Total Pilot Budget**: ~$260K (Q1-Q3 2026)

---

## Success Criteria

### Must-Have (Go/No-Go для scaling)

1. **Product-Market Fit**:
   - [ ] NPS > 40
   - [ ] 60%+ users active weekly
   - [ ] Retention (Month 1) > 40%

2. **Business Validation**:
   - [ ] Conversion rate (free → paid) > 5%
   - [ ] 1,000 paid users by end Q3
   - [ ] Churn < 20% monthly

3. **Product Quality**:
   - [ ] False positive rate < 5%
   - [ ] App crash rate < 1%
   - [ ] 0 critical security incidents

4. **Partnership Validation**:
   - [ ] 2+ schools willing to continue (paid)
   - [ ] 3+ testimonials from schools

### Nice-to-Have (Bonus indicators)

- Viral growth (referral rate > 10%)
- Press coverage (1+ major publication)
- CAC < $60
- LTV/CAC > 4:1

---

## Post-Pilot Action Plan

### If Successful (Criteria met):

1. **Scale Marketing**: Increase ad spend to $100K/month
2. **Hire Aggressively**: 5-7 new hires (eng, marketing, support)
3. **Series A Prep**: Start conversations с VCs
4. **Expand Partnerships**: 10 schools by end of year
5. **Android Launch**: Prioritize Android development

### If Mixed Results (Partial success):

1. **Iterate Product**: Focus on biggest pain points
2. **Pivot Strategy**: Maybe B2B2C (schools) > B2C
3. **Extend Pilot**: Additional 3 months with adjustments
4. **Cost Control**: Stretch runway, delay hiring
5. **Additional Fundraising**: Angel round or bridge

### If Unsuccessful (Criteria not met):

1. **Deep Dive Analysis**: What went wrong?
2. **User Interviews**: 20+ in-depth interviews
3. **Pivot Decision**: Product pivot or shut down
4. **Team Discussion**: Founders alignment on next steps
5. **Investor Communication**: Transparent update

---

## Risks and Mitigation

### Pilot-Specific Risks

1. **School partnerships fail to materialize**
   - Mitigation: Start outreach early (Q1), have backup plan (B2C focus)

2. **Low parent adoption in schools**
   - Mitigation: Incentives (raffles, prizes), school endorsement, workshops

3. **Technical issues at scale**
   - Mitigation: Load testing before pilot, monitoring, rapid response team

4. **Privacy concerns from parents**
   - Mitigation: Clear communication, privacy policy, transparency

5. **COPPA compliance issues**
   - Mitigation: Legal review before pilot, conservative approach, expert advisors

---

**Автор**: Product & Growth Team, Rork-Kiku  
**Версия**: v0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Требует валидации с командой и legal review  
**Следующий ревью**: Перед началом каждой фазы пилота
