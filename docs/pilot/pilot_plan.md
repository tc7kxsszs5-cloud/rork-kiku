# План пилота kiku

## Обзор пилотной программы

**Название:** kiku iOS TestFlight Pilot Program  
**Длительность:** 2-3 месяца  
**Целевая аудитория:** 50-100 семей (родители + дети 8-14 лет)  
**Платформа:** iOS (через TestFlight)  
**География:** [PLACEHOLDER — город/регион]  
**Начало:** Q1 2026  
**Конец:** Q2 2026

---

## Цели пилота

### Основные цели

1. **Product-Market Fit валидация**
   - Проверить, что родители готовы использовать AI-powered инструмент для мониторинга безопасности детских чатов
   - Получить качественную обратную связь о продукте

2. **ML Accuracy тестирование**
   - Измерить точность ML-моделей в реальных условиях
   - Собрать данные для улучшения моделей (с согласия родителей)
   - Выявить и исправить false positives/negatives

3. **UX/UI валидация**
   - Понять, насколько интуитивен интерфейс для родителей и детей
   - Выявить friction points в user journey

4. **Technical стабильность**
   - Проверить работу приложения на разных устройствах iOS
   - Выявить баги и performance issues
   - Оценить нагрузку на backend и ML services

5. **Compliance проверка**
   - Убедиться, что процессы парентального согласия работают правильно
   - Проверить соответствие COPPA/GDPR-K требованиям

### Вторичные цели

- Получить testimonials и case studies для маркетинга
- Набрать early adopters для word-of-mouth маркетинга
- Подготовить контент для PR (success stories, media coverage)

---

## KPI (Key Performance Indicators)

### 1. Безопасность и точность модерации

**ML Accuracy Metrics:**
- **Precision (точность)**: > 80% (из всех алертов, сколько действительно опасны)
- **Recall (полнота)**: > 75% (из всех опасных сообщений, сколько мы обнаружили)
- **F1-Score**: > 77%
- **False Positive Rate**: < 10% (родители не должны получать слишком много ложных алертов)
- **False Negative Rate**: < 5% (критично — мы не должны пропускать реальные угрозы)

**Метод измерения:**
- Ручная проверка sample сообщений модератором
- Feedback от родителей ("Этот алерт был полезен?" — Yes/No)
- A/B тестирование разных ML моделей

**Response Time:**
- **Среднее время анализа текста**: < 2 секунды
- **Среднее время анализа изображения**: < 5 секунд
- **Time to alert родителя**: < 30 секунд после обнаружения риска

### 2. Retention (удержание пользователей)

**Метрики:**
- **Day 1 retention**: > 80% (пользователи возвращаются на следующий день)
- **Day 7 retention**: > 60%
- **Day 30 retention**: > 40% (критично для пилота)
- **Completion rate:** > 70% семей завершают весь пилот (2-3 месяца)

**Churn reasons:**
- Отслеживать, почему пользователи уходят (exit interviews)
- Категоризировать: product issues, privacy concerns, не видят ценности, технические проблемы

### 3. Engagement (вовлечённость)

**Метрики:**
- **DAU (Daily Active Users)**: > 60% родителей заходят в приложение ежедневно
- **Sessions per day:** родители проверяют алерты минимум 2 раза в день
- **Time in app:** родители проводят 5-10 минут в день (не должно быть слишком много — это означает много алертов)
- **Feature usage:**
  - % родителей, использующих parental controls: > 80%
  - % родителей, настроивших time restrictions: > 50%
  - % детей, нажавших SOS кнопку (testing): 100% (все должны попробовать в demo)

### 4. NPS (Net Promoter Score)

**Цель:** NPS > 40 (good), идеально > 60 (excellent)

**Метод:**
- Survey в конце пилота: "Насколько вероятно, что вы порекомендуете kiku другу?" (0-10)
- NPS = % Promoters (9-10) - % Detractors (0-6)

**Qualitative feedback:**
- Открытые вопросы: "Что вам больше всего понравилось? Что бы вы улучшили?"

### 5. Technical Performance

**Uptime:** > 99% (минимальные downtime, особенно для critical services)

**API Latency:**
- p50: < 100ms
- p95: < 500ms
- p99: < 1s

**Error Rate:** < 1% (errors должны быть редкими и не critical)

**Crash Rate:** < 0.5% (iOS app должно быть стабильным)

---

## Чек-лист безопасного пилота

### Parental Consent

- [ ] **Информированное согласие:**
  - Родители получают детальное объяснение, как работает kiku
  - Объяснение, что данные будут обрабатываться AI
  - Прозрачность: какие данные собираются, как хранятся, кто имеет доступ

- [ ] **Opt-in процесс:**
  - Явное согласие на мониторинг (checkbox + signature)
  - Возможность отозвать согласие в любой момент

- [ ] **Согласие ребёнка (для подростков 12+):**
  - Объяснить ребёнку, что родитель будет мониторить его чаты
  - Получить согласие ребёнка (для transparency и trust)

### Data Handling

- [ ] **Минимизация данных:**
  - Собираем только необходимые данные (текст сообщений для анализа, метаданные)
  - Не собираем location data (кроме SOS случаев с явного согласия)

- [ ] **Локальное хранилище:**
  - Все персональные данные хранятся на устройстве (AsyncStorage)
  - Backend получает только анонимизированные данные для ML анализа

- [ ] **Шифрование:**
  - End-to-end шифрование сообщений (если возможно)
  - TLS для всех API connections
  - Encrypted storage на устройстве (Expo SecureStore для critical data)

- [ ] **Data retention policy:**
  - Данные хранятся только на время пилота
  - После пилота: родитель может запросить удаление всех данных (right to be forgotten)
  - Automated deletion через 6 месяцев после окончания пилота (если родитель не продолжает использовать)

### Security Measures

- [ ] **Penetration testing:**
  - Провести security audit перед началом пилота
  - Нанять внешнего security consultant для pentest

- [ ] **Vulnerability scanning:**
  - Scan всех dependencies (npm, pip) на known vulnerabilities
  - Использовать Dependabot, Snyk

- [ ] **Secure authentication:**
  - Strong password requirements (минимум 8 символов, uppercase, lowercase, digit, special char)
  - JWT tokens с коротким expiration (15 минут)
  - Refresh tokens хранятся безопасно (revocable)

- [ ] **Rate limiting:**
  - Защита от brute-force attacks (max 5 login attempts per 15 min)
  - API rate limiting для предотвращения abuse

- [ ] **Incident response plan:**
  - Подготовлен runbook для security incidents
  - Контакты emergency response team
  - Plan коммуникации с пользователями в случае breach

### Privacy & Compliance

- [ ] **Privacy Policy:**
  - Детальная privacy policy доступна в приложении
  - Написана на понятном языке (не legal jargon)
  - Translated на русский язык

- [ ] **COPPA Compliance:**
  - Parental consent для детей до 13 лет
  - No targeted advertising детям
  - No sharing детских данных с третьими сторонами (кроме ML APIs, которые COPPA compliant)

- [ ] **GDPR-K Compliance:**
  - Right to access: родитель может запросить все данные
  - Right to erasure: удаление данных по запросу
  - Data portability: экспорт данных в читаемом формате (JSON/CSV)

### Ethical Considerations

- [ ] **Transparency с детьми:**
  - Дети должны знать, что их чаты мониторятся
  - Не скрытый мониторинг (это может разрушить trust)

- [ ] **No over-monitoring:**
  - Родителям рекомендуется использовать kiku для безопасности, а не тотального контроля
  - Educational content: "Как говорить с ребёнком о безопасности онлайн"

- [ ] **Moderation ethics:**
  - Модераторы проходят training по работе с детским контентом
  - Психологическая поддержка для модераторов (exposure к disturbing content)

---

## Список желаемых партнёров

### Категория 1: Школы

**Типы школ:**
- Частные школы (более гибкие в adoption новых технологий)
- Международные школы (tech-savvy родители)
- Школы с focus на безопасность детей

**Целевые школы (примеры):**
- [PLACEHOLDER — Школа 1]: 500 учеников, родители tech-savvy
- [PLACEHOLDER — Школа 2]: 300 учеников, strong focus на child safety
- [PLACEHOLDER — Школа 3]: 800 учеников, уже используют другие parental control tools

**Предложение для школ:**
- Бесплатный pilot на 3 месяца
- Training для родителей (webinar: "Как защитить детей онлайн")
- Dashboard для school administrators (aggregate stats, no individual data)
- Case study после пилота (с согласия школы)

### Категория 2: НКО (Некоммерческие организации)

**Типы НКО:**
- Child safety organizations
- Anti-bullying initiatives
- Mental health для детей и подростков

**Целевые НКО (примеры):**
- [PLACEHOLDER — НКО 1]: Фокус на кибербуллинг prevention
- [PLACEHOLDER — НКО 2]: Работа с жертвами онлайн-груминга
- [PLACEHOLDER — НКО 3]: Образование родителей о digital safety

**Предложение для НКО:**
- Partnership: kiku предоставляет бесплатные подписки семьям из НКО
- НКО рекомендует kiku своим бенефициарам
- Co-marketing: webinars, educational content
- Feedback от НКО для улучшения продукта

### Категория 3: Родительские сообщества

**Типы сообществ:**
- Facebook groups для родителей
- Telegram каналы
- Форумы и блоги о parenting

**Целевые сообщества (примеры):**
- [PLACEHOLDER — Facebook группа "Родители [город]"]: 10K+ members
- [PLACEHOLDER — Telegram канал "Безопасность детей"]: 5K+ subscribers
- [PLACEHOLDER — Блог известного parenting blogger]: 50K+ readers

**Предложение:**
- Эксклюзивный early access для членов сообщества
- Promo код для скидки после пилота
- Guest posts/интервью с основателями
- Testimonials от members сообщества

### Категория 4: Child Psychologists & Therapists

**Ценность:**
- Professional endorsement (доверие родителей)
- Feedback о психологических аспектах мониторинга
- Рекомендации клиентам

**Предложение:**
- Бесплатные подписки для их клиентов
- Partnership: kiku recommends therapists в приложении (directory)
- Educational content: "How to talk to your child about online safety"

---

## Сроки и фазы

### Фаза 0: Подготовка (Month -1 до начала пилота)

**Даты:** [PLACEHOLDER — декабрь 2025 - январь 2026]

**Задачи:**
- [ ] Finalize MVP (bug fixes, polish UI)
- [ ] Security audit и penetration testing
- [ ] Подготовка privacy policy, terms of service
- [ ] Recruitment пилотных семей (outreach к школам, НКО, родительским сообществам)
- [ ] Подготовка onboarding materials (user guides, video tutorials)
- [ ] Setup TestFlight (app submission, tester invites)
- [ ] Training для support team (как отвечать на вопросы родителей)

**Deliverables:**
- MVP ready для TestFlight
- 50-100 семей подтвердили участие
- Onboarding materials готовы
- Support team trained

---

### Фаза 1: Onboarding (Weeks 1-2)

**Даты:** [PLACEHOLDER — февраль 2026, неделя 1-2]

**Задачи:**
- [ ] Отправка TestFlight invites всем pilot families
- [ ] Onboarding webinar для родителей (2-3 сессии для разных time zones)
- [ ] Помощь с установкой приложения (support chat/email)
- [ ] Setup детских профилей
- [ ] Первая проверка: все ли семьи successfully onboarded

**Метрики:**
- % семей, установивших приложение: > 90%
- % семей, завершивших onboarding: > 80%
- Average time to complete onboarding: < 30 минут

**Support:**
- Dedicated support chat (Telegram/Slack group для пилотных пользователей)
- FAQ документ
- Video tutorials

---

### Фаза 2: Active Usage (Weeks 3-10)

**Даты:** [PLACEHOLDER — февраль-апрель 2026]

**Задачи:**
- [ ] Ежедневный мониторинг technical performance (uptime, latency, error rate)
- [ ] Еженедельные check-ins с pilot families (survey, email, chat)
- [ ] Сбор feedback (bugs, feature requests, UX issues)
- [ ] Быстрые hotfixes критичных багов
- [ ] A/B тестирование разных ML моделей
- [ ] Mid-pilot survey (Week 5-6): промежуточная оценка NPS, satisfaction

**Метрики:**
- DAU, retention, engagement (ежедневный мониторинг)
- Количество алертов (по категориям риска)
- False positive rate (feedback от родителей)
- Support requests (tracking и resolving)

**Communication:**
- Weekly newsletter для пилотных семей (tips, updates, success stories)
- Slack/Telegram group для быстрой коммуникации
- Office hours: еженедельная call для Q&A

---

### Фаза 3: Итерации (Weeks 11-12)

**Даты:** [PLACEHOLDER — апрель-май 2026, последние 2 недели]

**Задачи:**
- [ ] Финальные улучшения на основе feedback
- [ ] Deploy обновлений (bug fixes, UX improvements)
- [ ] Подготовка к завершению пилота (exit survey)
- [ ] Запрос testimonials и case studies
- [ ] Offer для продолжения использования (discount на платную подписку)

**Deliverables:**
- Updated app с улучшениями
- Testimonials от minimum 10 семей
- Case studies (2-3 detailed stories)

---

### Фаза 4: Завершение и анализ (Week 13+)

**Даты:** [PLACEHOLDER — май 2026]

**Задачи:**
- [ ] Финальный survey (NPS, detailed feedback)
- [ ] Exit interviews с 10-15 семьями (1-on-1 calls)
- [ ] Анализ всех собранных данных (KPI, feedback, bugs)
- [ ] Post-mortem: что сработало, что нет, lessons learned
- [ ] Подготовка отчёта для stakeholders (investors, advisors)
- [ ] Планирование следующих шагов (public launch roadmap)

**Deliverables:**
- Pilot report (15-20 страниц):
  - Executive summary
  - KPI results
  - Feedback analysis
  - ML accuracy metrics
  - Lessons learned
  - Recommendations для public launch
- Testimonials и case studies для маркетинга
- Updated product roadmap на основе пилота

---

## Success Criteria (Критерии успеха пилота)

**Пилот считается успешным, если:**

1. ✅ **ML Accuracy:** Precision > 80%, Recall > 75%, F1 > 77%
2. ✅ **Retention:** Day 30 retention > 40%
3. ✅ **NPS:** > 40 (good) или > 60 (excellent)
4. ✅ **Technical:** Uptime > 99%, Crash rate < 0.5%
5. ✅ **Engagement:** > 60% родителей используют приложение ежедневно
6. ✅ **Testimonials:** Minimum 10 positive testimonials
7. ✅ **No major incidents:** Нет security breaches или critical bugs

**Если успешно → Go to Public Launch**  
**Если не успешно → Pivot или дополнительные итерации**

---

## Риски и Mitigation

### Риск 1: Низкая точность ML моделей (много false positives)

**Impact:** Родители перестают доверять алертам, churn увеличивается

**Mitigation:**
- A/B тестирование разных моделей
- Fine-tuning на feedback от родителей
- Threshold optimization (баланс precision vs. recall)

### Риск 2: Privacy concerns

**Impact:** Родители или дети отказываются участвовать из-за опасений о приватности

**Mitigation:**
- Полная transparency (что, как, зачем собираем)
- Локальное хранение данных (минимизация передачи в backend)
- Strong security measures (шифрование, audits)

### Риск 3: Technical issues (bugs, crashes, downtime)

**Impact:** Плохой user experience, негативные reviews

**Mitigation:**
- Thorough testing перед пилотом
- Быстрый support (dedicated team для пилота)
- Hotfix процесс (deploy updates быстро)

### Риск 4: Недостаточный recruitment

**Impact:** < 50 семей участвуют → недостаточно данных для выводов

**Mitigation:**
- Multiple recruitment channels (школы, НКО, сообщества)
- Incentives (бесплатный доступ, скидки после пилота)
- Referral program (приведи друга → оба получаете benefit)

### Риск 5: Регуляторные проблемы

**Impact:** Пилот остановлен из-за compliance issues

**Mitigation:**
- Legal review перед стартом
- Compliance-first подход (COPPA/GDPR-K)
- Advisory от legal experts

---

## Budget для пилота

**Estimated costs:**

| Статья расходов | Стоимость |
|-----------------|-----------|
| TestFlight setup (Apple Developer) | $99/year |
| Infrastructure (AWS для 50-100 семей) | $500/month × 3 = $1,500 |
| ML APIs (OpenAI, AWS Rekognition) | $200/month × 3 = $600 |
| Support team (1 part-time) | $2,000/month × 3 = $6,000 |
| Security audit | $5,000 (one-time) |
| Incentives для participants (опционально) | $50/family × 50 = $2,500 |
| Marketing materials (videos, guides) | $1,000 |
| **Total** | **~$16,699** |

**Note:** Это минимальный budget. Для более крупного пилота (100+ семей) costs увеличатся.

---

## Контакты и команда пилота

**Pilot Lead:** [PLACEHOLDER — Имя Фамилия, email]  
**Support Lead:** [PLACEHOLDER — Имя Фамилия, email]  
**ML Engineer:** [PLACEHOLDER — Имя Фамилия, email]  
**Product Manager:** [PLACEHOLDER — Имя Фамилия, email]

**Emergency contacts:**
- Technical issues: [PLACEHOLDER — email/phone]
- Security incidents: [PLACEHOLDER — email/phone]
- Legal/compliance: [PLACEHOLDER — email/phone]

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Pilot Team  
**Статус:** Draft — требуется review и утверждение
