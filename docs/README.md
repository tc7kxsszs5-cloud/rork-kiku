# Документация Rork-Kiku

Добро пожаловать в документацию проекта Rork-Kiku!

## 📚 Обзор

Этот репозиторий содержит всю техническую и бизнес-документацию для платформы Rork-Kiku — безопасной системы коммуникации между родителями и детьми с AI-модерацией контента.

**Статус:** Документация создана как черновики для запуска pilot проекта. Требуется review и обновление по мере развития продукта.

---

## 📂 Структура документации

### `/architecture/` — Техническая архитектура
- **architecture.md** — Полное описание системной архитектуры, микросервисов, data flow
- **diag.svg** — Архитектурная диаграмма (placeholder, требует замены)

### `/mvp/` — MVP спецификация
- **mvp_spec.md** — Детальная спецификация минимального жизнеспособного продукта для pilot

### `/investors/` — Материалы для инвесторов
- **pitch_deck.md** — Полный pitch deck (12-15 слайдов) на русском с английскими тезисами
- **one_pager.md** — Одностраничный summary проекта

### `/finance/` — Финансовая модель
- **financial_model_overview.md** — Описание трёх сценариев и драйверов
- **financial_model.csv** — CSV таблица с прогнозами

### `/pilot/` — План пилотного проекта
- **pilot_plan.md** — Полный план pilot: цели, KPI, фазы, partners, безопасность

### `/legal/` — Юридическая документация
- **data_room_checklist.md** — Список документов для due diligence
- **content_policy.md** — Политика модерации контента (ТРЕБУЕТ ЮРИСТА)
- **privacy_policy_draft.md** — Черновик Privacy Policy (ТРЕБУЕТ ЮРИСТА)

### `/apple/` — iOS и TestFlight
- **testflight_instructions.md** — Подробные инструкции по подготовке и загрузке в TestFlight

### `/infra/` — Инфраструктура и CI/CD
- **ci_cd.md** — GitHub Actions workflows, Kubernetes, Helm, Terraform hints

### `/security/` — Безопасность
- **security_design.md** — Комплексный дизайн безопасности: шифрование, KMS, RBAC, мониторинг

### `/team/` — Команда и роли
- **team_roles.md** — Описание ключевых ролей, навыков, hiring timeline

### `/roadmap/` — Дорожная карта
- **roadmap.md** — 24-месячный план развития с milestones и KPIs

### `/templates/` — Шаблоны
- **outreach_templates.md** — Email templates для investor и partner outreach
- **dataroom_template.md** — Структура data room для due diligence

### `/branding/` — Брендинг
- **logo_placeholders/** — Placeholder logo files (SVG, PNG)
- **brand-guidelines.md** — Руководство по брендингу (placeholder, требует дизайна)

### Корневые файлы
- **license_recommendation.md** — Рекомендация MIT License и стратегия IP
- **README.md** — Этот файл

---

## 🚀 Быстрый старт

### Для основателей
1. Ознакомьтесь с `/investors/pitch_deck.md` для понимания vision
2. Изучите `/mvp/mvp_spec.md` для product roadmap
3. Проверьте `/pilot/pilot_plan.md` для запуска пилота

### Для инвесторов
1. Начните с `/investors/one_pager.md` для быстрого overview
2. Углубитесь в `/investors/pitch_deck.md`
3. Проверьте `/finance/financial_model.csv` для projections

### Для разработчиков
1. Изучите `/architecture/architecture.md` для понимания системы
2. Прочитайте `/mvp/mvp_spec.md` для feature requirements
3. Настройте CI/CD по `/infra/ci_cd.md`
4. Следуйте `/apple/testflight_instructions.md` для iOS deployment

### Для юристов
1. Review `/legal/privacy_policy_draft.md` (ТРЕБУЕТ ЮРИСТА)
2. Review `/legal/content_policy.md` (ТРЕБУЕТ ЮРИСТА)
3. Используйте `/legal/data_room_checklist.md` для compliance

---

## ✏️ Как редактировать документацию

### Инструменты
- Используйте любой Markdown editor (VS Code, Typora, Notion)
- Соблюдайте формат Markdown для консистентности
- Проверяйте links после изменений

### Правила редактирования
1. **Не удаляйте placeholders** без замены реальными данными
2. **Всегда обновляйте "Последнее обновление" дату** в конце документа
3. **Increment версию** если significant changes
4. **Пометка "ТРЕБУЕТ ЮРИСТА"** — не удаляйте без legal review

### Placeholders для замены
Все placeholders обозначены в `[SQUARE_BRACKETS]`:
- `[FOUNDERS_EMAIL]` — ваш email
- `[COMPANY_LEGAL_NAME]` — юридическое имя компании
- `[ADDRESS]` — юридический адрес
- `[CITY]` — город
- И т.д. (ищите по всем документам)

### Процесс обновления
1. Создайте feature branch: `git checkout -b docs/update-[topic]`
2. Внесите изменения
3. Commit: `git commit -m "docs: update [topic]"`
4. Push и создайте Pull Request
5. Request review от team lead или co-founder

---

## 🔒 Безопасность

### Что НЕ ДОЛЖНО быть в документации
- ❌ **Секреты, пароли, API keys** — используйте placeholders
- ❌ **Реальные email addresses** пользователей
- ❌ **Personal data** (PII)
- ❌ **Proprietary business secrets** (если docs публичный)
- ❌ **Actual contract terms** с vendors/partners (используйте summaries)

### Хранение секретов
- GitHub Secrets (для CI/CD)
- AWS Secrets Manager
- 1Password / LastPass (для team sharing)
- HashiCorp Vault (для enterprise)

**См. `/infra/ci_cd.md` для details о secret management**

---

## 📤 Добавление в Data Room

Когда готовите data room для investors:

1. Convert Markdown документы в PDF:
   ```bash
   # Example using pandoc
   pandoc pitch_deck.md -o pitch_deck.pdf
   ```

2. Organize по структуре в `/templates/dataroom_template.md`

3. Upload в secure VDR (Carta, DocSend, Dropbox с restricted access)

4. Set permissions (view-only)

5. Share access link с investors

**См. `/templates/dataroom_template.md` для полной структуры**

---

## 🤝 Contribution Guidelines

### Кто может редактировать
- **Founders:** полный доступ
- **Team members:** могут предлагать changes через PRs
- **Contractors/Advisors:** read-only (unless explicitly granted write access)

### Review Process
- **Minor changes** (typos, formatting): можно commit напрямую в `main`
- **Significant changes** (content updates): требуется PR + review
- **Legal documents**: обязательно legal counsel review перед finalize

### Style Guide
- **Language:** Русский для всех docs (English tезисы где appropriate)
- **Encoding:** UTF-8
- **Line Length:** Soft wrap (не hard limit, но < 120 chars preferred)
- **Headers:** Use `#` format, не underlines
- **Lists:** Use `-` для unordered, `1.` для ordered
- **Code blocks:** Use ` ``` ` с language specified
- **Links:** Prefer relative paths для internal links

---

## 📞 Контакты

### Вопросы по документации
- **General:** [FOUNDERS_EMAIL]
- **Technical:** [CTO_EMAIL]
- **Business:** [CEO_EMAIL]
- **Legal:** [LEGAL_EMAIL]

### Внешние ресурсы
- **GitHub Repository:** [REPO_URL]
- **Website:** [WEBSITE_URL] (placeholder)
- **Support:** [SUPPORT_EMAIL]

---

## 📝 История изменений

### Version 1.0 (2026-01-02)
- ✅ Initial documentation structure created
- ✅ All core documents drafted
- ✅ Placeholders set for future updates
- 🔄 Pending: Legal review, professional branding, actual data

### Planned Updates
- [ ] Legal review Privacy Policy и Content Policy
- [ ] Professional logo и brand design
- [ ] Real financial data после pilot
- [ ] Updated metrics после launch
- [ ] Partner и investor feedback incorporation

---

## 🎯 Next Steps

### Immediate (Week 1-2)
1. Replace all `[PLACEHOLDER]` variables с real data
2. Legal review для privacy_policy_draft.md и content_policy.md
3. Setup GitHub repository structure
4. Onboard team members

### Short-term (Month 1-3)
1. Professional logo и branding
2. Finalize MVP spec на основе development progress
3. Update pilot plan с actual partners
4. Prepare pitch deck для investor meetings

### Medium-term (Month 3-6)
1. Update documentation на основе pilot feedback
2. Metrics dashboard для tracking KPIs
3. Data room preparation для Series A
4. Technical documentation expansion (API docs, developer guides)

---

## 📚 Additional Resources

### Learning Resources
- **GDPR:** gdpr.eu
- **COPPA:** ftc.gov/coppa
- **Child Safety:** NCMEC, NSPCC guidelines
- **Startup Docs:** YC Library, FirstRound Review

### Tools
- **Markdown Editors:** VS Code, Typora, Notion
- **Diagramming:** draw.io, Lucidchart, Miro
- **PDF Conversion:** pandoc, Markdown PDF extension
- **Version Control:** Git, GitHub

---

## 🙏 Acknowledgments

Эта документация создана как foundation для Rork-Kiku. Спасибо всем, кто вносит вклад в развитие проекта и защиту детей в digital space.

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]

**Защитим детство в цифровую эпоху.** 🛡️
