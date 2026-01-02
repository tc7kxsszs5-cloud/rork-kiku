# План пилотного проекта Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026  
**Период пилота**: Q2-Q3 2026 (6 месяцев)  
**Целевая аудитория**: 100-500 семей (США)

---

## Цели пилота

### Основные цели

1. **Валидация Product-Market Fit** 🎯
   - Подтвердить, что родители хотят безопасную платформу для детей
   - Собрать качественный feedback от пользователей
   - Итерировать продукт на основе реальных данных

2. **Тестирование ML-модерации** 🤖
   - Валидация accuracy AI-модерации (цель: 90%+)
   - Определение порога для ручной модерации
   - Оптимизация latency (< 10 сек для изображений)

3. **Оценка Retention и Engagement** 📊
   - Day 1, 7, 30 retention
   - Time in app
   - Messages sent per user
   - Content viewed

4. **Подготовка к запуску** 🚀
   - Выявление критических bug'ов
   - Тестирование масштабируемости
   - Сбор testimonials для маркетинга

### Вторичные цели

- Тестирование pricing (willingness to pay через опросы)
- Партнерства с 1-2 школами/НКО
- Сбор контента для образовательной библиотеки
- PR материалы (success stories)

---

## Key Performance Indicators (KPI)

### User Acquisition & Activation

| KPI | Target (Пилот) | Измерение |
|-----|----------------|-----------|
| **Total Signups** | 100-500 родителей | Регистрация в app |
| **Child Profiles Created** | 120-700 (1.2-1.4 per parent) | Профили детей |
| **Activation Rate** | 80%+ | % пользователей, создавших детский профиль |
| **Time to First Message** | < 10 минут | От регистрации до первого сообщения |

### Engagement

| KPI | Target | Измерение |
|-----|--------|-----------|
| **Day 1 Retention** | 70%+ | % пользователей, вернувшихся на Day 1 |
| **Day 7 Retention** | 40%+ | % пользователей, вернувшихся на Day 7 |
| **Day 30 Retention** | 25%+ | % пользователей, вернувшихся на Day 30 |
| **DAU/MAU Ratio** | 30%+ | Daily active / Monthly active |
| **Messages per User per Day** | 5-10 | Среднее количество сообщений |
| **Time in App** | 15-30 мин/день | Среднее время использования |
| **Content Views** | 3-5 статей/неделя | Просмотр образовательного контента |

### Moderation Accuracy

| KPI | Target | Измерение |
|-----|--------|-----------|
| **Auto-Approval Rate** | 85-90% | % контента, одобренного автоматически |
| **Manual Review Rate** | 5-10% | % контента, требующего ручной модерации |
| **Auto-Block Rate** | 5% | % контента, автоматически заблокированного |
| **False Positive Rate** | < 5% | % безопасного контента, ошибочно заблокированного |
| **False Negative Rate** | < 1% | % небезопасного контента, пропущенного модерацией |
| **Moderation Latency** | < 10 сек (images) | Время обработки контента |

### User Satisfaction

| KPI | Target | Измерение |
|-----|--------|-----------|
| **NPS (Net Promoter Score)** | 50+ | Survey в конце пилота |
| **CSAT (Customer Satisfaction)** | 4.5+/5 | In-app rating |
| **Support Tickets per User** | < 0.1 | Количество запросов в support |
| **Critical Bugs** | 0 | Blocking bugs после первой недели |

### Business Metrics

| KPI | Target | Измерение |
|-----|--------|-----------|
| **Willingness to Pay** | 60%+ | % пользователей, готовых платить $5-10/мес (опрос) |
| **Referral Rate** | 20%+ | % пользователей, пригласивших друзей |
| **School Partnerships** | 1-2 | LOI или MOU с школами |

---

## Чеклист безопасности и Parental Consent

### Pre-Launch Security Checklist

- [ ] **Data Encryption**
  - [ ] HTTPS/TLS 1.3 для всех API
  - [ ] S3 encryption at rest (AES-256) для медиа файлов
  - [ ] Database encryption (RDS encrypted)
  - [ ] Encrypted backups

- [ ] **Authentication & Authorization**
  - [ ] Apple Sign In интеграция работает корректно
  - [ ] JWT токены с коротким сроком жизни (30 мин)
  - [ ] Refresh token rotation
  - [ ] RBAC (Parent/Child/Moderator roles)

- [ ] **COPPA Compliance**
  - [ ] Parental consent flow реализован
  - [ ] Согласие на сбор данных от детей
  - [ ] Возрастная проверка (6-12 лет)
  - [ ] Родительский контроль над данными ребёнка

- [ ] **GDPR Compliance** (для будущих EU users)
  - [ ] Privacy Policy доступна и понятна
  - [ ] Cookie consent (если применимо)
  - [ ] Право на удаление данных реализовано
  - [ ] Data export функция

- [ ] **Content Moderation**
  - [ ] ML модели протестированы (accuracy > 90%)
  - [ ] Ручная модерация process документирован
  - [ ] Escalation flow для проблемного контента
  - [ ] Reporting mechanism (пользователи могут репортить контент)

- [ ] **Infrastructure Security**
  - [ ] WAF (Web Application Firewall) настроен
  - [ ] DDoS protection включен
  - [ ] Rate limiting на API
  - [ ] Secrets в AWS Secrets Manager (не в коде)
  - [ ] Monitoring и alerting (Sentry, CloudWatch)

- [ ] **Testing**
  - [ ] Penetration testing (basic, можно in-house)
  - [ ] OWASP Top 10 проверки
  - [ ] Security code review

### Parental Consent Flow

**Обязательные шаги**:

1. **Parent Registration**
   - Sign in with Apple (верификация email)
   - Подтверждение родительского статуса (self-declaration)

2. **Parental Consent для создания детского профиля**
   - **Экран 1**: "Вы подтверждаете, что являетесь родителем/опекуном ребёнка?"
   - **Экран 2**: Обзор того, какие данные собираются (имя, возраст, медиа)
   - **Экран 3**: Согласие на Terms of Service и Privacy Policy
   - **Экран 4**: Подтверждение настроек модерации (по умолчанию: строгая)

3. **Child Account Creation**
   - Ребёнок не может создать аккаунт самостоятельно
   - Только родитель создает профиль ребёнка
   - Родитель имеет полный контроль над профилем

4. **Ongoing Consent**
   - Родитель может в любой момент:
     - Просмотреть все данные ребёнка
     - Изменить настройки модерации
     - Удалить профиль ребёнка и все данные
     - Экспортировать данные (GDPR)

### Верификация "здоровых родителей"

**Для MVP/Pilot** (минимальная верификация):
- ✅ Apple Sign In (email verification)
- ✅ Self-declaration (родитель подтверждает свой статус)

**Для Production** (более строгая верификация):

**Вариант 1: Документальная проверка** (рекомендуется)
- Загрузка ID (driver's license, passport)
- Автоматическая проверка через Stripe Identity или Onfido
- Manual review для edge cases

**Вариант 2: Платежная верификация**
- Малый платеж ($1-2) на кредитную карту родителя
- Подтверждение, что карта принадлежит взрослому
- Немедленный возврат после верификации

**Вариант 3: School/NGO Verification**
- Родитель вводит код от школы или НКО
- Партнерские организации выдают коды верифицированным родителям
- Высокое доверие, но ограниченная scale

**Вариант 4: Video Verification** (advanced)
- Видеозвонок с модератором (как Airbnb)
- Проверка ID в реальном времени
- Дорого, но высокое качество верификации

**Рекомендация для Pilot**: Вариант 1 (Apple Sign In + self-declaration) → Вариант 2 или 3 для Production.

**ТРЕБУЕТ ЮРИСТА**: Консультация с юристом по COPPA для финализации verification flow.

---

## Список желаемых партнёров

### Школы (Bay Area / NYC)

**Критерии выбора**:
- K-6 или K-8 школы (дети 6-12 лет)
- Прогрессивные школы с focus на tech и безопасность
- Активные PTA (Parent-Teacher Association)

**Потенциальные партнёры**:
1. **[School Name Placeholder]** Elementary School (Bay Area)
   - 200-300 families
   - Strong PTA, tech-forward
   - Контакт: [email placeholder]

2. **[School Name Placeholder]** Charter School (NYC)
   - 150-250 families
   - Focus на STEM education
   - Контакт: [email placeholder]

3. **[School Name Placeholder]** Private School (Los Angeles)
   - 100-200 families
   - High parental engagement
   - Контакт: [email placeholder]

**Подход к партнерству**:
- Presentation для PTA meeting
- Free pilot для всех родителей школы
- Feedback sessions с родителями и учителями
- Testimonials для будущего маркетинга

### НКО (Child Safety / Parenting)

**Потенциальные партнёры**:
1. **Common Sense Media**
   - Leading voice в детской медиа безопасности
   - Рекомендации и endorsement
   - Контакт: [email placeholder]

2. **Net Safety Collaborative**
   - Focus на детской безопасности онлайн
   - Partnership для pilot testing
   - Контакт: [email placeholder]

3. **PTA (National Parent Teacher Association)**
   - Доступ к миллионам родителей
   - Endorsement как "recommended app"
   - Контакт: [email placeholder]

4. **Child Mind Institute**
   - Эксперты по child development
   - Консультации по product design
   - Контакт: [email placeholder]

**Value Proposition для НКО**:
- Бесплатный доступ к премиум для их сообщества
- Co-branding (с их логотипом)
- Data sharing (anonymized, для research)
- Alignment с их миссией (детская безопасность)

---

## Этапы и сроки пилота

### Phase 1: Pre-Launch Preparation (4 недели, Март 2026)

**Week 1-2**:
- [ ] Финализация MVP (feature freeze)
- [ ] QA тестирование (critical path)
- [ ] Security audit (internal)
- [ ] TestFlight build готов

**Week 3**:
- [ ] Recruitment: outreach к школам/НКО
- [ ] Создание onboarding materials (FAQ, guides)
- [ ] Support process setup (email, in-app chat)
- [ ] Analytics dashboard готов (для мониторинга KPI)

**Week 4**:
- [ ] Soft launch с 10-20 beta testers (friends & family)
- [ ] Сбор initial feedback
- [ ] Bug fixes (hotfixes)
- [ ] Final TestFlight build

### Phase 2: Pilot Launch (Неделя 1-4, Апрель 2026)

**Week 1** (Launch Week):
- [ ] Отправка invite links к 100-200 родителям
- [ ] Daily monitoring: signups, crashes, support tickets
- [ ] Hotfixes для critical bugs (< 24 hours)
- [ ] Daily standup для быстрого реагирования

**Week 2-3** (Early Adoption):
- [ ] Expansion до 200-300 users
- [ ] Сбор feedback (in-app surveys)
- [ ] Iteration на основе feedback (minor feature tweaks)
- [ ] Weekly retention tracking

**Week 4** (Stabilization):
- [ ] Feature freeze (только bug fixes)
- [ ] Performance optimization
- [ ] Moderation accuracy review
- [ ] Preparation для expansion

### Phase 3: Pilot Expansion (Неделя 5-12, Май-Июнь 2026)

**Week 5-8**:
- [ ] Expansion до 500 users
- [ ] School partnership activation (1-2 школы)
- [ ] Monthly surveys (NPS, CSAT)
- [ ] Content library expansion (добавить 20+ articles)

**Week 9-12**:
- [ ] Stabilization и monitoring
- [ ] Advanced features testing (video moderation, если готово)
- [ ] Preparation для public launch
- [ ] Сбор testimonials и success stories

### Phase 4: Pilot Wrap-up & Analysis (Неделя 13-14, Июль 2026)

**Week 13**:
- [ ] Final surveys (NPS, feature requests, pricing)
- [ ] Data analysis (retention, engagement, moderation)
- [ ] Bug backlog prioritization
- [ ] Post-mortem meeting

**Week 14**:
- [ ] Report для инвесторов (traction, KPI, learnings)
- [ ] Roadmap update на основе pilot learnings
- [ ] Decision: продолжать к public launch или pivot?

---

## Критерии успеха пилота

### Must-Have (обязательные для success)

1. **Retention** ✅
   - Day 7 retention: 40%+
   - Day 30 retention: 25%+

2. **Moderation Accuracy** ✅
   - Auto-approval: 85%+
   - False positive: < 5%
   - False negative: < 1%

3. **User Satisfaction** ✅
   - NPS: 50+
   - CSAT: 4.5+/5
   - Critical bugs: 0 (после Week 1)

4. **Engagement** ✅
   - Messages per user per day: 5+
   - Time in app: 15+ мин/день

### Nice-to-Have (желательные, но не критичные)

- 500+ users (если < 500, но KPI хорошие — OK)
- School partnerships: 1-2 (если 0 — OK для MVP)
- Willingness to pay: 60%+ (валидация monetization)
- Referral rate: 20%+ (early virality signal)

### Red Flags (если эти метрики плохие — pivot или major changes)

- ❌ Day 7 retention < 30% → product-market fit под вопросом
- ❌ NPS < 30 → пользователи не любят продукт
- ❌ False negative rate > 5% → серьёзные проблемы с безопасностью
- ❌ Critical bugs > 2 после Week 1 → качество кода низкое

---

## Риски и митигация

### Risk 1: Медленный recruitment (< 100 users)

**Mitigation**:
- Organic channels: parenting subreddits, Facebook groups
- Paid ads: Facebook/Instagram (small budget $1K)
- Incentivized referrals: ранний доступ к premium

### Risk 2: Низкий retention (< 30% Day 7)

**Mitigation**:
- User interviews (почему churn?)
- A/B testing onboarding flow
- Push notifications для re-engagement
- Улучшение value proposition (больше контента?)

### Risk 3: ML moderation не работает (accuracy < 80%)

**Mitigation**:
- Fallback на 100% ручную модерацию (temporary)
- Дополнительный training ML моделей
- Рассмотреть использование сторонних API (Google, AWS Rekognition)

### Risk 4: Privacy concerns от родителей

**Mitigation**:
- Прозрачность: clear Privacy Policy
- FAQ: "Где хранятся данные?", "Кто имеет доступ?"
- Blog posts о безопасности
- Third-party security audit (если бюджет позволяет)

### Risk 5: Legal/compliance issues

**Mitigation**:
- Консультация с юристом COPPA/GDPR (до launch)
- Disclaimer: "Beta/Pilot — subject to change"
- Clear consent flows
- Incident response plan (если data breach)

---

## Следующие шаги после пилота

### Success → Public Launch

**If** pilot KPI хорошие:
1. Подготовка App Store submission (Q3 2026)
2. Marketing plan для public launch
3. Fundraising (Pre-Seed / Seed)
4. Hiring (engineers, PM, designer)

### Partial Success → Iterate

**If** некоторые KPI хорошие, но не все:
1. Идентифицировать слабые места
2. 1-2 месяца iteration
3. Второй pilot (extended)
4. Re-evaluate после iteration

### Failure → Pivot or Shutdown

**If** большинство KPI плохие:
1. Post-mortem: что не сработало?
2. Pivot опции:
   - Другая целевая аудитория (подростки 13-17?)
   - Другой value proposition (B2B для школ?)
   - Другой формат продукта (parental control tool vs social platform?)
3. Решение: pivot или shutdown

---

## Коммуникация и отчётность

### Weekly Updates (внутренняя команда)

- **Format**: Slack update или short meeting (15 min)
- **Content**:
  - KPI snapshot (signups, retention, moderation)
  - Critical bugs / incidents
  - User feedback highlights
  - Action items для следующей недели

### Monthly Reports (для инвесторов/advisors)

- **Format**: Email с dashboard link
- **Content**:
  - Executive summary (1 paragraph)
  - KPI table (actual vs target)
  - Key learnings
  - Roadmap updates
  - Ask (если есть)

### End of Pilot Report (июль 2026)

- **Format**: Deck (10-15 слайдов)
- **Content**:
  - Pilot overview
  - KPI results vs targets
  - User testimonials
  - Key learnings
  - Next steps (public launch или pivot)
  - Fundraising ask (если применимо)

---

## Ресурсы

### Team (минимальный для pilot)

- **Product Lead**: 1 FTE (planning, feedback analysis, roadmap)
- **Engineers**: 2-3 FTE (bug fixes, features, infrastructure)
- **Designer**: 0.5 FTE (UI tweaks, onboarding flow)
- **Moderators**: 1-2 part-time (manual moderation, support)
- **Community Manager**: 0.5 FTE (user engagement, feedback collection)

### Budget (6 месяцев)

- **Team**: $150K (5 FTE × $5K/month × 6 months)
- **Infrastructure**: $10K (AWS, tools)
- **Marketing**: $10K (small paid ads для recruitment)
- **Legal**: $5K (lawyer consultation)
- **Misc**: $5K (office, misc expenses)
- **Total**: ~$180K

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Product Team

**Статус**: ТРЕБУЕТ РЕВЬЮ от Product Lead, CTO, Legal
