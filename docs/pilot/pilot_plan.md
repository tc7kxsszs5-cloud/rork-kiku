# План пилота Rork-Kiku

## Обзор

Пилотная программа Rork-Kiku предназначена для тестирования MVP платформы с ограниченной группой пользователей перед полномасштабным запуском. Цель — валидировать product-market fit, собрать feedback и отработать операционные процессы.

## Цели пилота

### Основные цели

1. **Валидация продукта**
   - Подтвердить, что родители нуждаются в безопасной семейной платформе
   - Проверить удобство использования (UX) для родителей и детей
   - Оценить эффективность AI-модерации в реальных условиях

2. **Технические цели**
   - Протестировать стабильность backend под реальной нагрузкой
   - Валидировать ML-модель на разнообразном контенте
   - Выявить и устранить критические баги

3. **Операционные цели**
   - Отработать процессы ручной модерации
   - Настроить мониторинг и алертинг
   - Подготовить службу поддержки

4. **Бизнес-цели**
   - Получить testimonials от пользователей
   - Собрать case studies для маркетинга
   - Подготовить pitch материалы для seed раунда

## KPI (Key Performance Indicators)

### Технические KPI

#### ML-модерация
- **Accuracy**: > 95%
- **False positives**: < 5% (контент неправильно отклонён)
- **False negatives**: < 2% (небезопасный контент пропущен)
- **Inference latency (p95)**: < 500ms
- **Time-to-review** (ручная модерация): < 4 часа (working hours)

#### Backend
- **Uptime**: > 99% (допустимо несколько инцидентов в beta)
- **API latency (p95)**: < 200ms
- **Media upload success rate**: > 98%
- **Push notification delivery rate**: > 95%

### Пользовательские KPI

#### Engagement
- **DAU/MAU** (Daily/Monthly Active Users): > 40%
- **Uploads per family per week**: > 3
- **Session duration**: > 10 minutes
- **Sessions per day**: > 2

#### Retention
- **D1 retention**: > 80% (first day)
- **D7 retention**: > 60% (week 1)
- **D30 retention**: > 40% (month 1)
- **Churn rate** (monthly): < 5%

#### Satisfaction
- **NPS** (Net Promoter Score): > 30
- **App Store rating**: > 4.0 stars
- **Support ticket resolution time**: < 24 hours
- **Critical bugs reported**: < 5 per week

### Бизнес KPI

#### Growth
- **User acquisition**: 50-100 families (100-200 родителей)
- **Organic referrals**: > 10% of new users
- **Partnership interest**: 2-3 школы/НКО выражают интерес

#### Product-Market Fit
- **"Very disappointed" survey**: > 40% (Sean Ellis test)
- **Testimonials collected**: > 10 positive reviews
- **Feature requests**: Собрать > 50 запросов для prioritization

## Чек-лист безопасности и Parental Consent

### COPPA Compliance (Children's Online Privacy Protection Act)

✅ **Verifiable Parental Consent**
- Email verification для родителей
- ~~Credit card verification (не в pilot)~~
- ~~Government ID check (не в pilot)~~
- Explicit opt-in для сбора данных детей

✅ **Минимизация данных**
- Собирать только необходимые данные (имя, дата рождения)
- Не собирать геолокацию в pilot
- Не собирать контакты или социальные связи

✅ **Родительский контроль**
- Родители имеют полный доступ к данным детей
- Родители могут удалить данные ребёнка в любой момент
- Уведомления родителям о всех действиях детей

✅ **Безопасность данных**
- TLS для всех соединений
- Encrypted storage (AES-256)
- No third-party sharing детских данных

### GDPR Compliance (General Data Protection Regulation)

✅ **Informed Consent**
- Чёткая privacy policy на русском и английском
- Opt-in для всех типов обработки данных
- Separate consent для маркетинга

✅ **Data Subject Rights**
- Right to access: Экспорт всех данных пользователя
- Right to rectification: Редактирование профиля
- Right to erasure: Полное удаление аккаунта и данных
- Right to data portability: JSON/CSV export

✅ **Data Protection by Design**
- Pseudonymization где возможно
- Regular security audits
- Data breach notification процедуры (< 72 часа)

### Security Checklist

✅ **Authentication**
- Strong password requirements (min 8 chars, uppercase, number, symbol)
- OAuth2 integration (Apple, Google)
- Rate limiting на login attempts

✅ **Authorization**
- RBAC (Role-Based Access Control)
- JWT tokens с короткой expiration (1 hour)
- Refresh token rotation

✅ **Data Protection**
- TLS 1.3 для всех API calls
- AES-256 encryption at rest
- Database encryption (TDE)
- Secure key management (AWS KMS)

✅ **Content Moderation**
- AI screening для всего контента
- Human review для edge cases
- Immediate takedown небезопасного контента
- Audit trail для всех модерационных решений

✅ **Privacy**
- No sharing детских данных с третьими лицами
- No targeted advertising к детям
- Anonymous analytics (aggregated only)

## Список желаемых партнёров

### Школы

**Критерии выбора**:
- Прогрессивные, tech-forward школы
- Сильное parent community
- Заинтересованность в digital safety
- Готовность к pilot программам

**Целевые партнёры** (placeholder):
1. [Название школы 1] - Москва
2. [Название школы 2] - Санкт-Петербург
3. [Название школы 3] - Казань
4. International schools (English-speaking)

**Value proposition для школ**:
- Бесплатный доступ для pilot families
- Обучение digital safety для родителей
- Reporting и analytics для школы
- Co-marketing opportunities

### НКО (некоммерческие организации)

**Фокус**: Child safety, digital literacy, family support

**Целевые партнёры** (placeholder):
1. [НКО по защите детей] - child protection focus
2. [НКО digital literacy] - online safety education
3. [Семейная организация] - family support services
4. [Образовательная НКО] - educational programs

**Value proposition для НКО**:
- Бесплатный/discounted доступ для их beneficiaries
- Co-branded safety materials
- Research partnership (anonymized data insights)
- CSR (Corporate Social Responsibility) alignment

### Parenting Communities

**Критерии**:
- Active online communities
- Focus на conscious parenting
- Tech-savvy audience
- Willingness to try new products

**Целевые сообщества**:
1. Reddit r/parenting (Russia-focused threads)
2. Facebook parenting groups (Москва, СПб)
3. Telegram channels для родителей
4. Parenting bloggers и influencers

## Фазы пилота

### Фаза 1: Closed Alpha (2 недели)

**Участники**: 10-15 семей (team, friends, family)

**Цели**:
- Найти критические баги
- Протестировать core user flows
- Получить initial feedback на UX

**Активности**:
- Daily bug triage и fixes
- User interviews (1-on-1)
- Iteration на основе feedback

**Success criteria**:
- No critical bugs
- Core flows работают стабильно
- Positive initial feedback

### Фаза 2: Private Beta (4 недели)

**Участники**: 50-100 семей (invited through network, НКО)

**Цели**:
- Валидировать product-market fit
- Тестировать ML-модерацию под нагрузкой
- Собрать retention и engagement data

**Активности**:
- Weekly surveys и feedback sessions
- Monitor KPIs daily
- A/B testing на key features
- Collect testimonials

**Success criteria**:
- KPIs в green zone (см. выше)
- > 40% retention @ D30
- NPS > 30
- 10+ positive testimonials

### Фаза 3: Public Beta (8-12 недель)

**Участники**: 100-200 семей (open TestFlight, limited slots)

**Цели**:
- Scale testing
- Prepare для App Store launch
- Partnership pilots с 1-2 школами
- Finalize MVP feature set

**Активности**:
- Content marketing (blog posts, social)
- Community management (Slack/Telegram group)
- Partnership execution
- Prepare App Store materials

**Success criteria**:
- Stable product (99%+ uptime)
- Ready для App Store submission
- 2-3 partnership commitments
- Seed pitch deck готов (с traction data)

## Сроки пилота

**Total duration**: 14-18 недель (~3.5-4.5 месяца)

| Фаза | Weeks | Dates (Example) | Participants |
|------|-------|-----------------|--------------|
| Closed Alpha | 2 | Jan 15 - Jan 31, 2026 | 10-15 families |
| Private Beta | 4 | Feb 1 - Feb 28, 2026 | 50-100 families |
| Public Beta | 8-12 | Mar 1 - May 31, 2026 | 100-200 families |

**App Store launch target**: Q2 2026 (June-July 2026)

## Критерии успеха пилота

### Must-have (обязательные)

✅ **Technical stability**
- 99%+ uptime в Public Beta
- No critical bugs в production

✅ **User satisfaction**
- NPS > 30
- App Store rating > 4.0
- < 10% churn в месяц

✅ **ML performance**
- Accuracy > 95%
- False positive rate < 5%

### Should-have (желательные)

✅ **Engagement**
- DAU/MAU > 40%
- 3+ uploads per family per week

✅ **Growth**
- 100+ families в Public Beta
- 10%+ organic referrals

✅ **Partnerships**
- 1-2 schools committed to pilot expansion
- 1 НКО partnership signed

### Nice-to-have (опциональные)

✅ **Traction**
- Media mention (TechCrunch, local press)
- Influencer endorsement
- Waitlist для App Store launch (100+ families)

## Процесс сбора feedback

### Методы

1. **In-app surveys**
   - После 1 недели использования
   - После 1 месяца использования
   - NPS survey

2. **User interviews**
   - 1-on-1 video calls (30 минут)
   - Focus groups (5-7 родителей)
   - Проводить раз в 2 недели

3. **Analytics**
   - Mixpanel/Amplitude для event tracking
   - Daily KPI dashboard
   - Weekly reports для team

4. **Support tickets**
   - Zendesk или Intercom
   - Categorize по типам issues
   - Track resolution time

### Вопросы для feedback

**Product-market fit**:
- "Насколько вы были бы разочарованы, если бы не могли больше использовать Rork-Kiku?"
- "Что вам нравится больше всего?"
- "Что бы вы хотели улучшить?"

**UX/UI**:
- "Было ли легко зарегистрироваться?"
- "Насколько интуитивна навигация?"
- "Есть ли запутанные моменты?"

**Модерация**:
- "Устраивает ли вас время модерации?"
- "Были ли false positives (контент неправильно отклонён)?"
- "Чувствуете ли вы, что ваши дети в безопасности?"

**Feature requests**:
- "Каких функций вам не хватает?"
- "Что бы вы добавили в первую очередь?"

## Риски и митигация

### Риск 1: Низкий user adoption
**Вероятность**: Medium  
**Влияние**: High  
**Митигация**:
- Персональные приглашения через network
- Incentives для early adopters (lifetime Premium)
- Partnerships с НКО для distribution

### Риск 2: Технические проблемы
**Вероятность**: Medium  
**Влияние**: High  
**Митигация**:
- Тщательное QA перед каждой фазой
- Gradual rollout (не всем сразу)
- 24/7 on-call для critical issues

### Риск 3: Плохой UX feedback
**Вероятность**: Low-Medium  
**Влияние**: High  
**Митигация**:
- Extensive user testing перед pilot
- Быстрая итерация на основе feedback
- Designer on team для rapid prototyping

### Риск 4: ML модель недостаточно точна
**Вероятность**: Medium  
**Влияние**: High  
**Митигация**:
- Human-in-the-loop как fallback
- Continuous model training на production data
- Transparent communication с пользователями о ограничениях

### Риск 5: Партнёры не заинтересованы
**Вероятность**: Medium  
**Влияние**: Medium  
**Митигация**:
- Multiple outreach channels
- Value proposition чётко articulated
- Flexibility в partnership terms

## Бюджет пилота

**Included в Seed funding** ($2M-3M)

| Категория | Сумма | Заметки |
|-----------|-------|---------|
| Infrastructure | $10K | AWS/GCP costs для pilot |
| Team | $150K | 3 месяца для 5-7 FTE (partial burn) |
| Marketing | $5K | Content creation, outreach |
| Incentives | $10K | Lifetime Premium для early adopters |
| Misc | $5K | Contingency |
| **Total** | **$180K** | |

## Post-Pilot Actions

### Если пилот успешен
1. **Prepare App Store launch**
   - Finalize app metadata
   - Prepare marketing materials
   - Schedule launch date

2. **Expand beta**
   - Open waitlist
   - Scale infrastructure
   - Hire additional team members

3. **Fundraising**
   - Use traction data для seed pitch
   - Reach out to investors
   - Close seed round

### Если пилот показывает проблемы
1. **Pivot or iterate**
   - Analyze root causes
   - Major product changes если необходимо
   - Re-run pilot с updated product

2. **Communicate with stakeholders**
   - Transparent update для investors/advisors
   - Gather additional input
   - Re-assess strategy

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Это черновой план пилота. Детали могут измениться на основе feedback и обстоятельств.
