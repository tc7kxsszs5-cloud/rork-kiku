# Rork-Kiku Documentation

Добро пожаловать в documentation repository для Rork-Kiku — безопасной социальной платформы для детей 6-12 лет.

## 📁 Структура документации

### `/architecture` — Техническая архитектура
- **architecture.md** — Полная архитектура системы: backend, frontend, ML, infrastructure
- **diag.svg** — Архитектурная диаграмма (placeholder)

### `/mvp` — MVP спецификация
- **mvp_spec.md** — Детальная спецификация MVP для TestFlight пилота

### `/investors` — Материалы для инвесторов
- **pitch_deck.md** — Полный pitch deck (12-15 слайдов)
- **one_pager.md** — Одностраничный summary проекта

### `/finance` — Финансовые модели
- **financial_model_overview.md** — Описание трёх сценариев и допущений
- **financial_model.csv** — Детальная 5-летняя финансовая модель

### `/pilot` — План пилотного запуска
- **pilot_plan.md** — Comprehensive план пилота: цели, KPI, партнёры, этапы

### `/legal` — Юридическая документация
- **data_room_checklist.md** — Checklist документов для data room
- **content_policy.md** — Политика контента (ЧЕРНОВИК - требует юриста)
- **privacy_policy_draft.md** — Privacy Policy черновик (ЧЕРНОВИК - требует юриста)

### `/apple` — iOS и TestFlight
- **testflight_instructions.md** — Подробные инструкции по подготовке к TestFlight

### `/infra` — Infrastructure и DevOps
- **ci_cd.md** — GitHub Actions pipelines, deployment процессы, secrets management

### `/security` — Безопасность
- **security_design.md** — Encryption, KMS, authentication, monitoring, incident response

### `/team` — Команда и организация
- **team_roles.md** — Описание ролей, hiring plan, compensation

### `/roadmap` — Дорожная карта
- **roadmap.md** — 24-месячная roadmap с milestones и key metrics

### `/templates` — Шаблоны
- **outreach_templates.md** — Email шаблоны для инвесторов, партнёров, школ
- **dataroom_template.md** — Структура data room

### `/branding` — Brand assets
- **logo_placeholders/** — Placeholder логотипы (SVG, PNG)
- **brand-guidelines.md** — Brand guidelines черновик

### Корневые документы
- **license_recommendation.md** — Рекомендация использовать MIT License
- **README.md** — Этот файл

---

## 🔐 Безопасность

**⚠️ КРИТИЧНО:** В этом repository НЕ ДОЛЖНО быть:
- ❌ Реальных секретов, API keys, passwords
- ❌ Персональных данных
- ❌ Production credentials
- ❌ Private keys или certificates

Все чувствительные данные используют **PLACEHOLDERS** типа `[FOUNDERS_EMAIL]`, `[API_KEY]`, и т.д.

Для production используйте:
- **GitHub Secrets** для CI/CD
- **HashiCorp Vault** или **AWS Secrets Manager** для runtime secrets
- **Environment variables** никогда не commit в git

---

## 📝 Редактирование документации

### Кто может редактировать
- **Core team:** Full access
- **Contributors:** Via pull requests
- **Advisors:** Suggestions via issues

### Процесс изменений

**Мелкие изменения (typos, formatting):**
1. Edit directly в GitHub UI
2. Commit to `main` (если есть права)

**Значительные изменения:**
1. Create branch: `docs/[topic]-update`
2. Make changes
3. Open Pull Request
4. Request review от relevant team member
5. Merge после approval

**Новые документы:**
1. Обсудить с team (Issue или Slack)
2. Create в соответствующей папке
3. Update этот README (добавить в structure)
4. Pull Request для review

### Style Guide

**Language:**
- Основной язык: **Русский**
- Technical terms: можно на English (e.g., "API", "ML", "COPPA")
- Code examples: English

**Formatting:**
- Markdown format
- Headings: Start с `#` (H1) для title
- Use `##`, `###` для subsections
- Code blocks: использовать ` ```language ` syntax
- Lists: `-` для unordered, `1.` для ordered
- Links: `[Text](URL)`

**File naming:**
- Lowercase с underscores: `file_name.md`
- Descriptive names

**Placeholders:**
- Use `[PLACEHOLDER]` для sensitive info
- Use `[DATE]` для dates
- Use `— PLACEHOLDER` после placeholder values

---

## 🔄 Обновление документации

### Регулярные updates

**Quarterly (каждые 3 месяца):**
- Financial model (actuals vs projections)
- Roadmap (progress, adjustments)
- Team structure
- Metrics в pitch deck

**Monthly:**
- KPIs в investor one-pager
- Product roadmap status

**As needed:**
- Architecture (при significant changes)
- Legal docs (при policy updates — require legal review!)
- Process docs (при workflow changes)

### Version Control

- Git commit messages: `docs(category): description`
- Tag major versions: `docs-v1.0`, `docs-v2.0`
- Changelog: Maintain в commit history

---

## 🚀 Для новых членов команды

**Onboarding reading list:**
1. `/README.md` (корневой repo README)
2. `/docs/README.md` (этот файл)
3. `/docs/roadmap/roadmap.md` — понять vision
4. `/docs/architecture/architecture.md` — technical overview
5. `/docs/team/team_roles.md` — структура команды
6. Role-specific docs (e.g., `/docs/apple/testflight_instructions.md` для mobile dev)

**Questions?**
- Slack: #docs channel
- Email: [FOUNDERS_EMAIL]
- Issues: GitHub Issues в этом repo

---

## 📊 Documentation Coverage

**Current status:** ✅ Core documentation complete

- [x] Architecture & Technical Design
- [x] Product (MVP spec, roadmap)
- [x] Business (investors, finance)
- [x] Legal (policies, compliance)
- [x] Operations (team, processes)
- [x] Infrastructure (CI/CD, security)
- [x] Pilot plan
- [x] Templates

**TODO (future):**
- [ ] API Reference (когда API stable)
- [ ] User Guides (для parents, children)
- [ ] Internal Runbooks (operations)
- [ ] Vendor documentation
- [ ] Compliance audit reports

---

## 🤝 Contributing

Мы welcome contributions к documentation!

**How to contribute:**
1. Read `/CONTRIBUTING.md` (если есть в root)
2. Fork repository
3. Create branch
4. Make changes
5. Submit Pull Request
6. Wait для review

**What to contribute:**
- Typo fixes
- Clarity improvements
- Additional examples
- Translations (если relevant)
- New documentation (обсудить first)

---

## 📞 Contact

**Documentation maintainer:** [FOUNDERS_EMAIL]

**For specific topics:**
- Technical docs: CTO — [CTO_EMAIL]
- Legal docs: Legal team — [LEGAL_EMAIL]
- Business docs: CEO — [CEO_EMAIL]

---

## 🔖 Resources

**External links:**
- [COPPA Compliance Guide](https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions)
- [GDPR Resources](https://gdpr.eu/)
- [React Native Docs](https://reactnative.dev/)
- [Kubernetes Docs](https://kubernetes.io/docs/)

---

**Last Updated:** [DATE] — PLACEHOLDER  
**Version:** 1.0
