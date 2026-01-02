# План пилотного проекта kiku

## Обзор пилота

**Цель:** Валидация product-market fit и сбор обратной связи от реальных пользователей перед публичным запуском.

**Платформа:** TestFlight (iOS)  
**Длительность:** 6-8 недель (Q1 2024)  
**Участники:** 50-100 родителей + их дети  
**Регион:** Москва, Санкт-Петербург, Казань (Россия)

---

## Цели пилота

### Продуктовые цели

1. **Валидация PMF (Product-Market Fit):**
   - NPS (Net Promoter Score) > 50
   - 70%+ пользователей считают продукт полезным
   - 40%+ готовы платить после пилота

2. **Тестирование функционала:**
   - AI-анализ работает корректно (< 10% false positives)
   - SOS функция работает надежно
   - Родительский контроль понятен и используется

3. **Сбор feedback:**
   - Интервью с 20+ родителями
   - In-app surveys (еженедельно)
   - Usability тестирование (5-10 сессий)

### Технические цели

1. **Стабильность:**
   - Crash rate < 1%
   - Uptime > 99%
   - API response time p95 < 1s

2. **Performance:**
   - AI analysis latency < 5s
   - App startup time < 2s
   - Battery drain < 5% per hour of active use

3. **Безопасность:**
   - Нет утечек данных
   - Шифрование работает корректно
   - COPPA compliance verified

---

## Критерии отбора участников

### Родители (target users)

**Демография:**
- Возраст: 30-50 лет
- Дети: 8-15 лет (school age)
- Tech-savvy: Medium to high (умеют пользоваться приложениями)
- Озабоченность безопасностью: High

**Каналы рекрутинга:**
- Родительские форумы и группы в Facebook/VK
- Школы-партнеры (через директоров или учителей)
- Личные контакты команды
- Ads в Instagram/Facebook с таргетом на родителей

**Incentives:**
- Бесплатный доступ ко всем premium функциям (6 месяцев)
- Early adopter badge
- Влияние на развитие продукта (feedback sessions)
- Возможность выиграть годовую подписку (лотерея среди активных участников)

### Дети (end users)

**Критерии:**
- Возраст: 8-15 лет
- Имеют смартфон (iPhone для TestFlight)
- Активно используют мессенджеры (WhatsApp, Telegram, iMessage)
- Согласие родителей на участие (parental consent)

---

## Этапы пилота

### Фаза 1: Подготовка (1-2 недели)

**Задачи:**
- ✅ Финализация MVP
- ✅ TestFlight build готов
- ✅ Privacy policy и terms опубликованы
- ✅ Onboarding flow протестирован
- ✅ Support email настроен (support@kiku-app.com)
- ✅ Feedback форма готова (Google Forms или Typeform)

**Deliverables:**
- TestFlight invite links
- Welcome email template
- User guide (PDF, 2-3 страницы)
- FAQ документ

### Фаза 2: Рекрутинг (1-2 недели)

**Активности:**
- Публикация announcement в родительских группах
- Outreach к школам (см. outreach templates)
- Таргетированная реклама в FB/Instagram
- Email рассылка в контакты команды

**Критерии успеха:**
- 100+ applications
- 50+ confirmed participants (parents)
- Mix of demographics (age, location, tech-savviness)

**Screening process:**
1. Online application form (5 минут)
2. Quick phone screen (10 минут) для qualified candidates
3. Send TestFlight invite + onboarding materials

### Фаза 3: Onboarding (1 неделя)

**Week 1:**
- День 1: Send TestFlight invite
- День 1-2: Пользователи устанавливают приложение
- День 3: Check-in email (всё ли работает?)
- День 7: First survey (initial impressions)

**Support:**
- Telegram group для pilot participants (real-time support)
- Email support (ответ в течение 24 часов)
- Office hours (Zoom call 2x/week для Q&A)

### Фаза 4: Активное использование (3-4 недели)

**Мониторинг:**
- Daily metrics (DAU, retention, feature usage)
- Weekly surveys (NPS, satisfaction, pain points)
- Bi-weekly interviews (30 минут, 10-15 родителей)
- In-app analytics (Mixpanel or Amplitude)

**Engagement activities:**
- Weekly tips email (как лучше использовать kiku)
- Feature spotlights (highlight new or underused features)
- Community challenges (например, "Пригласи друга")

**Iterate based on feedback:**
- Hotfixes для critical bugs (deploy в течение 24 часов)
- Feature tweaks (еженедельные updates)
- UI/UX improvements (based on usability tests)

### Фаза 5: Завершение и анализ (1 неделя)

**Final survey:**
- Overall satisfaction (1-10)
- Would you pay for this? (Yes/No + price sensitivity)
- What features do you want? (open-ended)
- Would you recommend to friends? (NPS)

**Interviews:**
- Exit interviews с 15-20 родителями (30-45 минут)
- Deep dive: What worked? What didn't? Why?

**Data analysis:**
- Quantitative: Retention, engagement, feature usage
- Qualitative: Themes from interviews and surveys
- Product improvements backlog

**Thank you:**
- Thank you email с update о дальнейших планах
- Offer: 6 months free Premium (или спец. цена) при публичном запуске
- Request for testimonials and case studies

---

## KPI (Key Performance Indicators)

### Product Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **NPS (Net Promoter Score)** | > 50 | TBD | 🟡 |
| **DAU/MAU** | > 0.3 | TBD | 🟡 |
| **Retention Day 7** | > 40% | TBD | 🟡 |
| **Retention Day 30** | > 20% | TBD | 🟡 |
| **Avg session duration** | > 5 min | TBD | 🟡 |
| **Feature adoption (AI analysis)** | > 80% | TBD | 🟡 |
| **Feature adoption (SOS)** | Setup by 60% | TBD | 🟡 |
| **Feature adoption (Parental Controls)** | > 70% | TBD | 🟡 |

### Technical Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Crash rate** | < 1% | TBD | 🟡 |
| **AI analysis latency (p95)** | < 5s | TBD | 🟡 |
| **API response time (p95)** | < 1s | TBD | 🟡 |
| **App startup time** | < 2s | TBD | 🟡 |
| **Battery drain** | < 5%/hr | TBD | 🟡 |

### Business Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Willingness to pay** | > 40% | TBD | 🟡 |
| **Referrals (organic)** | 0.5/user | TBD | 🟡 |
| **B2B interest (schools)** | 3+ schools | TBD | 🟡 |

---

## Чек-лист безопасности и compliance

### Privacy & Security

- [ ] **Verifiable Parental Consent:** Родитель подтверждает через email verification
- [ ] **Privacy Policy:** Опубликована и доступна в приложении
- [ ] **Terms of Service:** Подписаны пользователями при onboarding
- [ ] **Data encryption:** E2E шифрование сообщений (if applicable) или at-rest encryption
- [ ] **Secure storage:** iOS Keychain для sensitive data
- [ ] **No tracking:** Нет third-party trackers (Google Analytics допустим)
- [ ] **Data minimization:** Собираем только необходимые данные
- [ ] **Right to deletion:** Родители могут удалить все данные ребенка

### COPPA Compliance (Children's Online Privacy Protection Act)

- [ ] **Age gate:** Приложение требует parental consent для детей < 13
- [ ] **Parental notice:** Clear disclosure о сборе данных
- [ ] **Parental consent:** Verifiable (email + confirmation)
- [ ] **Parent access:** Родитель может просмотреть данные ребенка
- [ ] **Parent deletion:** Родитель может удалить данные ребенка
- [ ] **No targeted ads:** Нет рекламы для детей
- [ ] **Data security:** Reasonable measures для защиты данных

### GDPR-K (для EU users, если есть)

- [ ] **Explicit consent:** Clear opt-in (not pre-checked boxes)
- [ ] **Right to access:** Data export в JSON format
- [ ] **Right to rectify:** Редактирование данных
- [ ] **Right to erasure:** "Right to be forgotten"
- [ ] **Data portability:** Export данных в machine-readable format
- [ ] **Privacy by design:** Security и privacy заложены в архитектуру
- [ ] **DPIA (Data Protection Impact Assessment):** Completed for high-risk processing

### Testing Compliance

- [ ] **Parental consent flow:** Протестирован с реальными родителями
- [ ] **Data deletion:** Verified что данные действительно удаляются
- [ ] **Email verification:** Works reliably
- [ ] **Age gate:** Работает корректно (не позволяет детям регистрироваться без родителя)

---

## Список партнеров (потенциальные)

### Школы (для рекрутинга и B2B pilot)

**Target:** 3-5 школ в Москве/СПб

**Критерии выбора:**
- Прогрессивные (используют технологии в обучении)
- Есть контакт с директором или завучем
- Родители tech-savvy и озабочены безопасностью

**Подход:**
- Outreach letter (см. `docs/templates/outreach_templates.md`)
- Offer: Бесплатный pilot для 50-100 учеников
- Value proposition: Помочь родителям защитить детей, снизить киберугрозы
- Support: Dedicated support для school administrators

**Партнеры (placeholder — заменить на реальные после согласования):**
1. Школа №[NUMBER], Москва — [CONTACT_EMAIL]
2. Гимназия №[NUMBER], СПб — [CONTACT_EMAIL]
3. Лицей №[NUMBER], Казань — [CONTACT_EMAIL]

### НКО и благотворительные организации

**Target:** Организации с фокусом на child safety

**Примеры:**
- Лига безопасного интернета
- Фонд "Дети Онлайн"
- РОЦИТ (Региональная общественная организация "Центр Интернет-технологий")

**Value proposition:**
- Partnership для продвижения child safety
- Совместные мероприятия (вебинары, workshops)
- Упоминание в материалах (co-branding)

### Родительские сообщества

**Online communities:**
- Группы в VK: "Родители Москвы", "Мамы и дети"
- Форумы: littleone.ru, 7ya.ru, eva.ru
- Telegram каналы: Родительские чаты

**Outreach:**
- Публикация анонса пилота (с модерацией админов)
- Offer для участников community (early access)
- Regular updates о progress

---

## Сроки и Timeline

### Детальный план (8 недель)

**Week 1-2: Подготовка**
- Финализация MVP
- TestFlight submission
- Материалы готовы (welcome email, user guide, FAQ)
- Рекрутинг начинается

**Week 3: Onboarding**
- Invite links sent
- Первые пользователи устанавливают приложение
- Support setup (Telegram group, email)
- Daily monitoring

**Week 4-7: Активное использование**
- Weekly surveys
- Bi-weekly interviews
- Iterate based on feedback
- Engagement activities

**Week 8: Завершение**
- Final survey
- Exit interviews
- Data analysis
- Thank you emails
- Plan next steps

---

## Бюджет пилота

| Категория | Стоимость | Описание |
|-----------|-----------|----------|
| **Incentives** | $2,000 | Призы для участников (годовые подписки, мерч) |
| **Marketing** | $1,000 | Ads для рекрутинга (FB/Instagram) |
| **Tools** | $500 | Survey tools (Typeform Pro), analytics (Mixpanel) |
| **Support** | $1,000 | Part-time support person (if needed) |
| **Miscellaneous** | $500 | Непредвиденные расходы |
| **Total** | **$5,000** | |

**Источник финансирования:** Pre-seed раунд ($500K)

---

## Риски и mitigation

### Risk 1: Низкий recruitment rate

**Mitigation:**
- Начать рекрутинг заранее (2 недели до запуска)
- Расширить каналы (больше групп, школ, ads)
- Улучшить incentives (больше prizes)

### Risk 2: Низкая активность пользователей

**Mitigation:**
- Engagement activities (weekly tips, challenges)
- Personal outreach (emails, calls)
- Gamification (badges, leaderboards — если уместно)

### Risk 3: Технические проблемы (crashes, bugs)

**Mitigation:**
- Thorough testing до запуска
- Hotfix process (быстрое реагирование)
- Clear communication с пользователями (прозрачность о багах)

### Risk 4: Негативная обратная связь

**Mitigation:**
- Listen и iterate quickly
- Over-communicate (что мы делаем на основе feedback)
- Set expectations (это pilot, не финальный продукт)

---

## Success Criteria

**Pilot считается успешным если:**
- ✅ NPS > 50
- ✅ 40%+ готовы платить ($4.99/мес или больше)
- ✅ Retention Day 30 > 20%
- ✅ < 5 critical bugs found
- ✅ 3+ schools заинтересованы в B2B pilot
- ✅ Собрано 20+ testimonials
- ✅ Clear roadmap improvements на основе feedback

**Next steps после успешного пилота:**
1. Iterate на основе feedback (2-3 недели)
2. Public launch (App Store + Google Play)
3. Marketing push (SEO, content, ads)
4. B2B pilot с школами
5. Fundraising (seed round, $3-5M)

---

## Контакты

**Pilot Coordinator:** [PILOT_COORDINATOR_NAME]  
**Email:** pilot@kiku-app.com (placeholder)  
**Telegram group:** [INVITE_LINK] (для участников)  
**Support:** support@kiku-app.com  

**Office Hours (Zoom):**
- Вторник, 19:00-20:00 МСК
- Четверг, 19:00-20:00 МСК

---

**Статус:** ЧЕРНОВИК для утверждения  
**Последнее обновление:** Январь 2024  
**Автор:** kiku Team
