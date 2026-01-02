# План пилотного проекта Rork-Kiku

## Обзор пилота

**Цель**: Валидация product-market fit через тестирование MVP с реальными пользователями  
**Целевая аудитория**: 50-100 семей в Москве и Московской области  
**Длительность**: 3-4 месяца  
**Платформа**: iOS (TestFlight)  
**Дата старта**: Q3 2026 (планируемая)  

---

## Цели пилота

### 1. Product Validation

**Проверить гипотезы:**
- ✅ Родители готовы использовать специализированную платформу для детей
- ✅ AI-модерация достаточно точна для реального использования
- ✅ Родительский контроль и настройки интуитивны
- ✅ Дети хотят использовать платформу (engagement)

**Метрики успеха:**
- NPS > 40 (родители)
- DAU/MAU > 40%
- Average 3+ uploads per child per week
- < 5% false positive rate (ML модель)

### 2. User Feedback Collection

**Что собираем:**
- Usability проблемы (UX/UI)
- Feature requests (что не хватает)
- Модерация quality (feedback на decisions)
- Performance issues (crashes, bugs, slow loading)
- Parental control настройки (что confusing)

**Методы:**
- In-app surveys
- Email surveys (еженедельные)
- 1-on-1 interviews (10-15 родителей)
- Focus groups (2-3 сессии)
- Analytics tracking

### 3. ML Model Improvement

**Цели:**
- Собрать real-world dataset (1000-5000 images/videos)
- Получить human feedback на moderation decisions
- Fine-tune модель на реальных данных
- Снизить false positive/negative rates

**Метрики:**
- Auto-approval rate: 70-85% (target)
- Manual review rate: 10-20%
- Auto-block rate: 5-10%
- Модераторы agreement с ML: > 85%

### 4. Operational Readiness

**Проверить:**
- Процессы ручной модерации (workflow, SLA)
- Support процессы (response time, resolution rate)
- Onboarding эффективность (completion rate)
- Infrastructure stability (uptime, performance)

---

## KPI пилота

### User Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| DAU/MAU | > 40% | Daily active / Monthly active users |
| Weekly uploads | 3+ per child | Average content uploads per week |
| Session length | 5+ min | Average time per session |
| Retention D7 | > 60% | Users active after 7 days |
| Retention D30 | > 40% | Users active after 30 days |

### Product Quality

| Metric | Target | Measurement |
|--------|--------|-------------|
| App crash rate | < 1% | Crash-free users (Firebase) |
| NPS | > 40 | Net Promoter Score survey |
| App Store rating | > 4.5 | TestFlight feedback |
| Support tickets | < 5 per week | Zendesk/email volume |
| Bug severity | 0 P0, < 3 P1 | Critical/high priority bugs |

### Moderation Effectiveness

| Metric | Target | Measurement |
|--------|--------|-------------|
| ML accuracy | > 85% | Precision/recall от модераторов |
| Auto-approval rate | 70-85% | % контента auto-approved |
| Manual review time | < 1 hour | Average time в queue |
| Parent complaints | < 5% | Жалобы на moderation |
| False positive rate | < 10% | Safe контент заблокирован |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding completion | > 80% | Завершили setup профиля |
| Profiles per parent | 1.5-2 avg | Average children profiles |
| Free → Paid interest | > 20% | Survey willingness to pay |
| Referral rate | > 15% | Users inviting friends |

---

## Чек-лист безопасности и Parental Consent

### Юридическая подготовка

**До запуска пилота:**

- [ ] **Privacy Policy** (черновик) подготовлен и reviewed юристом
- [ ] **Terms of Service** (черновик) подготовлен
- [ ] **Parental Consent Form** создан и валидирован
- [ ] **COPPA Compliance checklist** завершён (если планируется US)
- [ ] **GDPR Compliance checklist** завершён
- [ ] **Data Processing Agreement** (DPA) для партнёров подготовлен

### Parental Consent процесс

**Регистрация:**

1. **Email verification** (обязательно)
   - Подтверждение email адреса родителя
   - Линк с токеном для активации

2. **Consent checkbox**
   - "Я являюсь родителем/опекуном ребёнка"
   - "Я даю согласие на обработку данных моего ребёнка согласно Privacy Policy"
   - Линк на полную Privacy Policy

3. **Age verification** (для ребёнка)
   - Родитель указывает дату рождения ребёнка
   - Проверка: 6-12 лет (для пилота)

4. **Optional: дополнительная верификация**
   - SMS код на телефон родителя (опционально для пилота)
   - ID verification (отложено на production)

### Безопасность данных

**Технические меры:**

- [ ] **HTTPS** везде (TLS 1.3)
- [ ] **Data encryption at rest** (AWS KMS)
- [ ] **JWT токены** для аутентификации (короткий TTL)
- [ ] **Password hashing** (bcrypt, cost factor 12)
- [ ] **Rate limiting** на API endpoints
- [ ] **Input validation** на всех endpoints
- [ ] **SQL injection prevention** (parameterized queries)
- [ ] **XSS prevention** (CSP headers, sanitization)
- [ ] **CORS** properly configured
- [ ] **Security headers** (HSTS, X-Frame-Options, etc.)

**Operational security:**

- [ ] **Secrets management** (AWS Secrets Manager или HashiCorp Vault)
- [ ] **Backup strategy** (daily automated backups)
- [ ] **Access control** (minimal privileges, 2FA для админов)
- [ ] **Logging** (audit trail для всех admin actions)
- [ ] **Incident response plan** подготовлен
- [ ] **Security audit** (external review перед запуском)

### Модерация контента

**Политики:**

- [ ] **Content Policy** определена и documented
- [ ] **Moderation guidelines** для модераторов созданы
- [ ] **Escalation process** (auto-block → manual → legal review)
- [ ] **Appeal process** для родителей определён
- [ ] **Модератор training** materials подготовлены

**Технические:**

- [ ] **ML model** deployed и tested
- [ ] **Moderation queue** system готов
- [ ] **Notification system** для родителей работает
- [ ] **Quarantine storage** для blocked content настроен

### Права пользователей (GDPR/COPPA)

**Обязательные функции:**

- [ ] **Data access request** (родитель может запросить все данные)
- [ ] **Data deletion** (right to be forgotten)
- [ ] **Data portability** (export данных в JSON)
- [ ] **Consent withdrawal** (возможность отозвать consent)
- [ ] **Data retention policy** (автоматическое удаление после N лет)

---

## Список партнёров

### Школы и детские учреждения

**Цель**: Набрать 50-100 семей через partnerships

**Potential partners:**

1. **Частные школы Москвы** (2-3 школы)
   - Презентация для родителей
   - Opt-in participation
   - Feedback sessions

2. **Детские сады и развивающие центры** (3-5 центров)
   - Younger kids (6-8 лет)
   - Parental involvement высокий

3. **Детские спортивные секции** (1-2 секции)
   - Active kids, tech-savvy parents

4. **НКО и фонды** (опционально)
   - Фокус на child safety
   - Co-branding opportunities

### Процесс партнерства:

1. **Initial outreach** (email, call)
   - Описание продукта и пилота
   - Предложение бесплатного участия
   - Запрос встречи

2. **Presentation** (для admin/родителей)
   - Demo приложения
   - Объяснение безопасности
   - Q&A

3. **Onboarding** (для согласившихся)
   - Регистрация через партнёрский код
   - Dedicated support channel
   - Feedback sessions

4. **Post-pilot** (после завершения)
   - Результаты и insights
   - Благодарность
   - Предложение продолжить (со скидкой)

---

## Этапы и сроки пилота

### Phase 1: Подготовка (4-6 недель до запуска)

**Week -6 to -4:**
- [ ] MVP iOS app завершён (feature complete)
- [ ] Internal QA testing
- [ ] ML model deployed на staging
- [ ] Backend infrastructure готова (AWS setup)
- [ ] Security audit проведён

**Week -4 to -2:**
- [ ] TestFlight build uploaded
- [ ] Internal beta testing (5-10 human testers)
- [ ] Bug fixes и critical issues resolved
- [ ] Privacy Policy & ToS finalized
- [ ] Support documentation prepared

**Week -2 to 0:**
- [ ] Outreach к школам/партнёрам
- [ ] Презентации и recruitment
- [ ] Onboarding materials готовы
- [ ] Moderation team trained (1-2 moderators)
- [ ] Monitoring & analytics setup (Firebase, Mixpanel)

### Phase 2: Soft Launch (Week 1-2)

**Goals:**
- Recruit первые 10-20 families
- Intensive monitoring
- Quick bug fixes

**Activities:**
- Daily check-ins с early users
- Hotfixes при необходимости
- Moderation quality review
- Performance monitoring

**Success criteria для перехода к full pilot:**
- App crash rate < 2%
- Critical bugs resolved
- Onboarding flow работает smoothly
- No major security issues

### Phase 3: Full Pilot (Week 3-12)

**Goals:**
- Scale to 50-100 families
- Collect comprehensive feedback
- Refine ML model
- Validate KPIs

**Activities:**

**Week 3-4:**
- Recruit remaining families
- Onboarding support
- Weekly email check-ins

**Week 5-8:**
- Mid-pilot survey
- 1-on-1 interviews (10-15 parents)
- Feature iterations (minor improvements)
- ML model tuning

**Week 9-12:**
- Final survey
- Focus group sessions (2-3)
- Data analysis
- Prepare final report

### Phase 4: Wrap-up & Analysis (Week 13-14)

**Deliverables:**

- [ ] **Pilot Report**:
  - Executive summary
  - KPIs achieved vs. targets
  - User feedback themes
  - Product recommendations
  - ML model performance
  - Next steps

- [ ] **Data package** для investors:
  - User metrics
  - Engagement data
  - NPS results
  - Testimonials (с permission)

- [ ] **Product roadmap** (updated):
  - Prioritized feature requests
  - Bug fixes backlog
  - V2 planning

- [ ] **Decision**: Go/No-Go для public launch
  - Criteria: NPS > 40, DAU/MAU > 35%, < 2% crash rate
  - If Go: proceed с fundraising & scaling
  - If No-Go: iterate на issues и re-pilot

---

## Бюджет пилота

### Costs (3-4 месяца)

**Infrastructure:**
- AWS: $2-3K (compute, storage, ML)
- Tools: $500 (Firebase, Mixpanel, Sentry)
- **Total**: ~$3K

**Team:**
- Dev support (bug fixes): 20-30 hours/week (internal)
- Moderators: 2 part-time ($1K/month each) = $2K
- PM/Coordinator: internal
- **Total**: ~$2-3K

**Marketing/Recruitment:**
- Partnership outreach: $0 (sweat equity)
- Incentives (опционально): $50/family x 50 = $2.5K
- Printing materials: $500
- **Total**: ~$3K

**Other:**
- Legal review: $2K
- Security audit: $3K
- Contingency: $2K
- **Total**: ~$7K

**Grand Total**: ~$15-20K для пилота

---

## Риски и митигация

### Recruitment Challenges

**Risk**: Не удастся набрать 50-100 семей

**Mitigation:**
- Multiple partnership channels (schools, centers, sports)
- Incentives (бесплатный Premium на год)
- Personal networks (founders, early team)
- Social media promotion (parenting groups)

### Technical Issues

**Risk**: App crashes, bugs, performance problems

**Mitigation:**
- Thorough QA testing перед pilot
- Soft launch с 10-20 families first
- On-call dev support
- Rollback plan (ability to fix critical bugs within 24h)

### ML Model Accuracy

**Risk**: Слишком много false positives/negatives

**Mitigation:**
- Conservative thresholds (better block uncertain)
- Manual moderation fallback
- Continuous tuning based на feedback
- Transparent communication с parents

### Privacy/Security Breach

**Risk**: Data leak, security vulnerability

**Mitigation:**
- Security audit перед launch
- Minimal data collection (only necessary)
- Encrypted storage и transmission
- Incident response plan готов
- Insurance (cyber liability)

### Low Engagement

**Risk**: Пользователи не используют app регулярно

**Mitigation:**
- Onboarding optimization (clear value proposition)
- Engagement reminders (push notifications)
- Gamification elements (опционально)
- Direct outreach к inactive users

---

## Success Criteria

### Go/No-Go Decision для Public Launch

**Must-have (all required):**
- ✅ NPS > 40
- ✅ App crash rate < 2%
- ✅ No critical security vulnerabilities
- ✅ COPPA/GDPR compliance achieved
- ✅ Positive feedback from majority (> 70%)

**Nice-to-have (2 из 3):**
- ⚠️ DAU/MAU > 35%
- ⚠️ Retention D30 > 35%
- ⚠️ Willingness to pay > 15%

**If all criteria met:**
→ Proceed с public launch, fundraising, scaling

**If criteria not met:**
→ Iterate на product, address issues, consider re-pilot

---

## Следующие шаги после пилота

1. **Если успешно**:
   - Prepare для public launch (Russia)
   - Fundraise Seed round ($1-2M)
   - Android development
   - Team expansion

2. **Если неуспешно**:
   - Deep dive analysis (почему?)
   - Product pivot или iteration
   - Small-scale testing (A/B tests)
   - Re-evaluate market fit

3. **В любом случае**:
   - Документировать learnings
   - Thank you для participants
   - Maintain relationships с partners
   - Update roadmap & strategy

---

**Примечание**: Этот план является черновиком и будет обновляться по мере подготовки пилота. Все participants должны подписать consent forms. Не собирайте больше данных, чем необходимо для тестирования продукта.
