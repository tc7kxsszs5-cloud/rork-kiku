# План пилота Rork-Kiku

## Обзор пилота

**Цель:** Валидировать продукт с реальными пользователями, собрать feedback, измерить ключевые метрики, подготовиться к публичному релизу.

**Платформа:** iOS (TestFlight)
**Длительность:** 3 месяца (Q2-Q3 2026)
**Целевая аудитория:** 50-100 семей
**Регион:** Начинаем с русскоязычных пользователей (Россия, СНГ), затем расширение на англоязычные рынки

## Цели пилота

### Основные цели

1. **Валидация продукта:** Подтвердить, что родители готовы использовать платформу для безопасного детского контента
2. **Тестирование ML-модерации:** Измерить точность автоматической модерации в реальных условиях
3. **Сбор данных:** Собрать training data для улучшения ML-моделей
4. **UX тестирование:** Выявить проблемы с usability, onboarding, навигацией
5. **Проверка unit economics:** Измерить готовность платить (willingness to pay)
6. **Выявление багов:** Найти и исправить критические ошибки до публичного релиза

### Вторичные цели

- Построить early community родителей-advocates
- Получить testimonials и case studies для маркетинга
- Протестировать customer support процессы
- Валидировать compliance (COPPA/GDPR)
- Собрать feedback для roadmap prioritization

## KPI (Key Performance Indicators)

### Модерация

**Точность ML-моделей:**
- **Precision (точность):** > 85%
  - Определение: (True Positives) / (True Positives + False Positives)
  - Критично: минимизировать false positives (хороший контент ошибочно отклонен)
- **Recall (полнота):** > 90%
  - Определение: (True Positives) / (True Positives + False Negatives)
  - Критично: минимизировать false negatives (плохой контент пропущен)
- **F1 Score:** > 0.87

**False Positive Rate:** < 5%
- Максимально допустимый процент ошибочно отклоненного безопасного контента
- Важно для user satisfaction

**False Negative Rate:** < 3%
- Максимально допустимый процент пропущенного небезопасного контента
- Критично для child safety

**Time to Review (ручная модерация):**
- **Target:** < 4 часа (от submission до decision)
- **Acceptable:** < 12 часов
- **Unacceptable:** > 24 часа

**Auto-Approval Rate:** > 70%
- Процент контента, автоматически одобренного без ручной проверки
- Цель: максимизировать для scalability

**Queue Length (модерация):**
- **Target:** < 20 items в очереди
- **Alert threshold:** > 50 items
- **Critical:** > 100 items

### Пользователи и вовлеченность

**Acquisition:**
- **Target:** 50-100 семей
- **Source mix:**
  - Partnerships (schools/NGOs): 40%
  - Organic (referrals, word of mouth): 30%
  - Parenting communities: 20%
  - Direct outreach: 10%

**Activation:**
- **Definition:** User who creates at least 1 child profile
- **Target:** > 70% of registered users

**Engagement:**
- **Uploads per family per week:** > 5
- **App opens per week:** > 10
- **Session duration:** > 3 minutes per session

**Retention:**
- **D1 (Day 1) retention:** > 80%
- **D7 (Week 1) retention:** > 60%
- **D30 (Month 1) retention:** > 40%
- **D90 (End of pilot) retention:** > 30%

**NPS (Net Promoter Score):**
- **Target:** > 40
- **Calculation:** % Promoters (9-10) - % Detractors (0-6)
- **Survey timing:** Week 4 и Week 12

**CSAT (Customer Satisfaction):**
- **Target:** > 4.2 / 5.0
- **Survey:** After key interactions (upload, moderation result, support)

### Performance

**API Performance:**
- **p50 latency:** < 200ms
- **p95 latency:** < 500ms
- **p99 latency:** < 1000ms

**Upload Performance:**
- **Photo upload:** < 5 seconds (total time)
- **Video upload (60s):** < 30 seconds

**ML Inference:**
- **Photo:** < 5 seconds
- **Video:** < 15 seconds

**Uptime:**
- **Target:** > 99.5% (3.6 hours downtime per month max)

**Error Rate:**
- **Target:** < 0.5% of requests result in 5xx errors

### Безопасность и Compliance

**Security Incidents:** 0
- Определение: Data breach, unauthorized access, credential leak

**Privacy Complaints:** 0
- User complaints о нарушении privacy или data misuse

**Parental Consent Rate:** 100%
- Все дети должны иметь verified parental consent

**COPPA Compliance Score:** 100%
- Checklist completion перед launch

## Фазы пилота

### Фаза 1: Alpha Testing (Недели 1-2)

**Участники:** Internal team + 5-10 друзей/семьи

**Цели:**
- Smoke testing основного функционала
- Выявление критических багов
- Тестирование onboarding flow
- Проверка базового UX

**Deliverables:**
- Bug report
- UX feedback
- Initial ML performance baseline

**Success Criteria:**
- 0 critical bugs
- Onboarding completion rate > 80%
- ML inference working (даже если accuracy низкая)

### Фаза 2: Closed Beta (Недели 3-6)

**Участники:** 20-30 семей (партнерства + прямое приглашение)

**Цели:**
- Тестирование product-market fit
- Сбор детального feedback
- Измерение engagement metrics
- Начало training для ML моделей

**Recruitment:**
- Партнерства с 2-3 школами/детскими садами
- Parenting groups (Facebook, VK, Telegram)
- Direct outreach к early adopters

**Activities:**
- Weekly feedback sessions (Zoom)
- In-app surveys
- Support ticket monitoring
- Performance monitoring

**Success Criteria:**
- 20+ active families
- D7 retention > 50%
- NPS > 30
- 0 P0/P1 bugs

### Фаза 3: Open Beta (Недели 7-12)

**Участники:** 50-100 семей (расширение)

**Цели:**
- Scale testing
- Финальная валидация перед public launch
- Measurement всех KPI
- Подготовка case studies и testimonials

**Recruitment:**
- Referrals от closed beta users
- Расширение partnerships
- Limited paid ads (testing channels)
- PR и media outreach

**Activities:**
- Automated metrics tracking
- Regular cohort analysis
- Feature iteration
- Marketing asset creation (screenshots, videos, testimonials)

**Success Criteria:**
- 50+ active families
- Все KPI met (см. выше)
- Ready for public launch
- Seed round pitch materials готовы

## Чек-лист безопасности и Parental Consent

### Pre-Launch Security Checklist

**Infrastructure:**
- [ ] TLS 1.3 enabled на всех endpoints
- [ ] Database encryption at rest (AES-256)
- [ ] S3 bucket encryption enabled
- [ ] Secrets stored в AWS Secrets Manager (не hardcoded)
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)

**Authentication:**
- [ ] JWT implementation reviewed
- [ ] Refresh token rotation working
- [ ] Password hashing (bcrypt/argon2) verified
- [ ] Session timeout configured (15 min access, 30 day refresh)
- [ ] OAuth2 flows tested (Apple Sign In)

**Authorization:**
- [ ] RBAC properly implemented
- [ ] Permission checks на всех endpoints
- [ ] Parent can only access own family data
- [ ] Moderators can only access moderation queue

**Data Protection:**
- [ ] PII (Personally Identifiable Information) encrypted
- [ ] Child data segregated и protected
- [ ] Audit logging enabled
- [ ] Backup encryption verified
- [ ] Data retention policy implemented

**Code Security:**
- [ ] Dependency scan passed (no critical vulnerabilities)
- [ ] Static analysis (SAST) passed
- [ ] Input validation implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection enabled

**Compliance:**
- [ ] Privacy policy published
- [ ] Terms of Service published
- [ ] COPPA compliance checklist completed
- [ ] GDPR compliance checklist completed (если EU users)
- [ ] Parental consent flow implemented
- [ ] Data deletion flow implemented

### Parental Consent Process

**COPPA Requirements:**
- Verifiable parental consent перед сбором данных ребенка
- Clear disclosure о том, какие данные собираются
- Right to review/delete child data
- No marketing to children

**Consent Flow:**

1. **Parent Registration:**
   - Parent создает аккаунт (email + password или OAuth)
   - Email verification обязательна

2. **Consent Disclosure:**
   - Показываем clear notice:
     - Какие данные ребенка будут собираться
     - Как данные будут использоваться
     - С кем данные могут быть shared (никто в MVP)
     - Родительские права (review, delete)
   - Ссылка на Privacy Policy

3. **Consent Mechanism (выбрать один метод):**

   **Option A: Credit Card Verification (Recommended для MVP)**
   - Small charge ($0.50) и instant refund
   - Verifies adult identity
   - Low friction
   - Implementation: Stripe Payment Intents

   **Option B: Government ID Verification**
   - Upload ID + selfie
   - Verify с third-party service (e.g., Onfido, Jumio)
   - High friction, но strongest verification
   - Cost: $1-3 per verification

   **Option C: Knowledge-Based Authentication**
   - Questions только adults могли бы ответить
   - Medium friction
   - Lower reliability

   **Option D: Email + Multi-Factor (Baseline)**
   - Email verification + SMS code
   - Lowest friction
   - Acceptable для pilot, но может не пройти strict COPPA review

   **Recommendation для pilot:** Option D (email + SMS) для простоты, готовиться к Option A (credit card) для public launch.

4. **Checkbox Consent:**
   - [ ] "I am the parent or legal guardian of this child"
   - [ ] "I consent to the collection and use of my child's information as described in the Privacy Policy"
   - [ ] "I understand I can review and delete my child's data at any time"

5. **Confirmation:**
   - Confirmation email sent
   - Parent can proceed с созданием child profile

**Record Keeping:**
- Log timestamp consent был дан
- Store consent version (privacy policy version)
- Store consent method (email, credit card, etc.)
- Immutable audit trail

## Список желаемых партнёров

### Школы и образовательные учреждения

**Целевые партнёры:**

**Москва и МО:**
- 5-10 частных школ (прогрессивные, tech-forward)
- 3-5 детских садов (premium segment)

**Санкт-Петербург:**
- 3-5 школ

**Другие города:**
- По 1-2 школы в крупных городах (Казань, Екатеринбург, Новосибирск)

**Value Proposition для школ:**
- Бесплатный пилот
- Безопасная платформа для school projects и events
- Модерация контента (защита репутации школы)
- Parent engagement tool
- Возможность white-label solution в будущем

**Requirements от школ:**
- Письмо поддержки (letter of support)
- Помощь с recruitment родителей
- Feedback на продукт

### НКО (Некоммерческие организации)

**Целевые НКО:**

**Child Safety Organizations:**
- [Российские НКО по защите детей в интернете - TO BE RESEARCHED]
- Международные: Common Sense Media (если расширяемся на US)

**Parenting Communities:**
- Клуб родителей
- Online parenting groups

**Educational Nonprofits:**
- Организации, работающие с образованием и технологиями

**Value Proposition для НКО:**
- Alignment с их mission (child safety)
- Продукт для их community
- Partnership opportunities
- Co-marketing

### Influencers и Community Leaders

**Parenting Bloggers:**
- 5-10 micro-influencers (10K-100K followers)
- Focus: child safety, tech для parents, educational content

**Telegram/VK Channels:**
- Parenting channels (50K+ subscribers)

**YouTube:**
- Family vloggers (kid-friendly content)

**Value Proposition:**
- Early access к продукту
- Co-creation opportunities (feature requests)
- Affiliate program (post-MVP)

## Критерии успеха пилота

### Must-Have (обязательно для продолжения)

1. **Technical Stability:**
   - Uptime > 99% во время пилота
   - 0 critical bugs (P0)
   - < 5 high-priority bugs (P1) unresolved

2. **User Satisfaction:**
   - NPS > 30 (minimum acceptable)
   - CSAT > 4.0 / 5.0
   - < 5% complaint rate

3. **Engagement:**
   - D7 retention > 40%
   - Uploads per family per week > 3

4. **Safety:**
   - 0 security incidents
   - 0 serious moderation failures (harmful content approved)

5. **Compliance:**
   - 100% parental consent obtained
   - 0 privacy violations

### Nice-to-Have (желательно)

1. **Strong Product-Market Fit:**
   - NPS > 50
   - D30 retention > 50%
   - Organic referral rate > 20%

2. **ML Performance:**
   - Precision > 90%
   - Auto-approval rate > 80%

3. **Willingness to Pay:**
   - > 20% users express intent to pay for premium
   - Price sensitivity < $50/year

4. **Partnership Success:**
   - 3+ schools willing to continue partnership
   - 1+ NGO willing to formal partnership

## Сроки и вехи

### Timeline

| Week | Phase | Activities | Milestones |
|------|-------|-----------|------------|
| 1-2 | Alpha | Internal testing, bug fixes | 0 critical bugs |
| 3-4 | Closed Beta Start | Recruit 10 families, onboard | 10 active families |
| 5-6 | Closed Beta | Feedback sessions, iterate | D7 retention > 50% |
| 7-8 | Open Beta Start | Expand to 30 families | 30 active families |
| 9-10 | Open Beta | Scale to 50 families, measure KPI | All KPI tracked |
| 11-12 | Wrap-up | Final iteration, testimonials | Decision: Go/No-Go |

### Milestones

**Week 2: Alpha Complete**
- [ ] TestFlight build deployed
- [ ] Internal team tested all features
- [ ] 0 P0/P1 bugs
- [ ] Go/No-Go decision для Closed Beta

**Week 6: Closed Beta Complete**
- [ ] 20+ families onboarded
- [ ] D7 retention measured
- [ ] ML baseline established
- [ ] Initial feedback incorporated
- [ ] Go/No-Go decision для Open Beta

**Week 12: Pilot Complete**
- [ ] 50+ families active
- [ ] All KPI measured
- [ ] Post-mortem report готов
- [ ] Decision: Continue to Public Launch or Pivot

### Decision Points

**Go/No-Go Criteria:**

**After Alpha (Week 2):**
- **Go:** 0 critical bugs, team confident в продукте
- **No-Go:** Fundamental issues с архитектурой или UX

**After Closed Beta (Week 6):**
- **Go:** NPS > 20, retention > 40%, technical stable
- **No-Go:** Poor engagement, fundamental product issues

**After Pilot (Week 12):**
- **Go to Public Launch:** Must-Have criteria met
- **Pivot:** Significant product issues, но market interest
- **Shutdown:** Poor product-market fit, низкий interest

## Риски и митигации

### Риски

**1. Низкий recruitment (< 50 семей)**
- **Likelihood:** Medium
- **Impact:** High (не достаточно data для валидации)
- **Mitigation:**
  - Start recruitment рано (за 4 недели до launch)
  - Multiple channels (schools, communities, influencers)
  - Incentives (free Premium после пилота)

**2. Низкая ML accuracy (< 80%)**
- **Likelihood:** Medium
- **Impact:** High (poor user experience, safety risk)
- **Mitigation:**
  - Conservative thresholds (больше manual review)
  - Rapid iteration на модели
  - Hire ML expert consultant если нужно

**3. Плохой retention (< 30% D7)**
- **Likelihood:** Low-Medium
- **Impact:** High (poor product-market fit)
- **Mitigation:**
  - Focus на onboarding UX
  - Weekly check-ins с users
  - Rapid bug fixes
  - Feature requests prioritization

**4. Privacy/Security incident**
- **Likelihood:** Low
- **Impact:** Critical (shutdown risk)
- **Mitigation:**
  - Security checklist completion обязательна
  - Regular security reviews
  - Incident response plan готов
  - Limited pilot scope (lower risk)

**5. Compliance issues (COPPA/GDPR)**
- **Likelihood:** Low
- **Impact:** Critical
- **Mitigation:**
  - Legal counsel review перед launch
  - Conservative interpretation rules
  - Over-compliance approach

## Инструменты и процессы

### Feedback Collection

**In-App:**
- NPS survey (Week 4, Week 12)
- CSAT survey (after key interactions)
- Feature request form
- Bug report form

**External:**
- Weekly Zoom sessions (Week 3-6)
- Telegram/WhatsApp group для pilot users
- Email surveys (Typeform, Google Forms)

**Analytics:**
- Mixpanel / Amplitude для behavioral tracking
- Custom dashboard для KPI monitoring
- Cohort analysis

### Communication

**With Pilot Users:**
- Onboarding email sequence
- Weekly updates (what's new, upcoming features)
- Direct support: [FOUNDERS_EMAIL]
- In-app chat (если есть)

**Internal:**
- Daily standups
- Weekly pilot review
- Bi-weekly retrospectives
- Slack channel #pilot

### Support

**Response Time SLA:**
- Critical issues (app crash, data loss): < 2 hours
- High priority (feature broken): < 8 hours
- Medium priority (UX issue): < 24 hours
- Low priority (feature request): < 3 days

**Support Channels:**
- Email: [FOUNDERS_EMAIL]
- In-app support form
- Telegram/WhatsApp (для pilot только)

## Post-Pilot Action Plan

### Successful Pilot (Go Decision)

**Immediate Actions (Week 13-16):**
1. Address all feedback и P1 bugs
2. Finalize public launch plan
3. Prepare marketing materials (screenshots, video, testimonials)
4. App Store listing готов
5. Legal/compliance final review
6. TestFlight → Public beta transition

**Seed Fundraise Prep:**
1. Pitch deck update с pilot data
2. Case studies и testimonials
3. Investor outreach
4. Target close: Q4 2026 or Q1 2027

### Pivot Required

**Analysis:**
- Root cause analysis (why didn't work)
- User interviews (deep dive)
- Competitive analysis update
- Market research

**Options:**
- Pivot на B2B (schools только)
- Pivot на different age group
- Pivot на different geography
- Feature pivot (например, focus только на moderation tool)

### Shutdown Decision

**Graceful Shutdown:**
- Notify all pilot users (30 days notice)
- Data export для users
- Refund any payments
- Post-mortem report
- Thank you note

---

**Примечание:** План пилота является living document и должен обновляться еженедельно в течение пилота. Все KPI должны отслеживаться real-time.

**Контакт:** [FOUNDERS_EMAIL]

**Related Documents:**
- `docs/mvp/mvp_spec.md` - MVP спецификация
- `docs/security/security_design.md` - Security checklist
- `docs/legal/privacy_policy_draft.md` - Privacy policy
