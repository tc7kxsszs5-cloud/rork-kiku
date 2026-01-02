# Documentation — kiku

## Добро пожаловать в документацию kiku!

Этот каталог содержит всю техническую, бизнес и юридическую документацию для проекта kiku — AI-powered решения для защиты детей в цифровых мессенджерах.

---

## Структура документации

### 📁 architecture/ — Техническая архитектура

**Для кого:** CTO, Backend/Frontend разработчики, SRE

- **architecture.md** — Подробная архитектура системы, компоненты, data flow, security design
- **diag.svg** — Диаграмма архитектуры (placeholder, требует замены на детальную)

**Когда использовать:**
- Планирование новых features
- Onboarding новых разработчиков
- Архитектурные decision-making

---

### 📁 mvp/ — MVP спецификация

**Для кого:** Product team, разработчики, QA

- **mvp_spec.md** — Спецификация MVP для TestFlight пилота: scope, user flows, API contract, требования

**Когда использовать:**
- Планирование MVP development
- Understanding product requirements
- API design

---

### 📁 investors/ — Материалы для инвесторов

**Для кого:** CEO, fundraising team, инвесторы

- **pitch_deck.md** — Структура pitch deck (12-15 слайдов): проблема, решение, рынок, бизнес-модель, команда, финансы
- **one_pager.md** — Одностраничное описание проекта для quick intro

**Когда использовать:**
- Fundraising (Pre-seed, Seed, Series A)
- Investor meetings
- Partnership discussions

---

### 📁 finance/ — Финансовая модель

**Для кого:** CEO, CFO, инвесторы

- **financial_model_overview.md** — Описание финансовой модели, assumptions, сценарии (консервативный/базовый/оптимистичный)
- **financial_model.csv** — CSV файл с детальной финансовой моделью (3 года, quarterly breakdown)

**Когда использовать:**
- Fundraising due diligence
- Бюджетное планирование
- Financial decision-making

---

### 📁 pilot/ — План пилотного проекта

**Для кого:** Product team, Marketing, Community manager

- **pilot_plan.md** — План пилота: цели, критерии отбора участников, этапы, KPI, чек-лист безопасности, список партнеров

**Когда использовать:**
- Подготовка к pilot launch
- Рекрутинг участников
- Measuring pilot success

---

### 📁 legal/ — Юридические документы

**Для кого:** CEO, Legal counsel, compliance team

- **data_room_checklist.md** — Список документов для data room (due diligence)
- **content_policy.md** — Политика контента: запрещенный контент, уровни фильтрации, модерация, верификация родителей
- **privacy_policy_draft.md** — Черновик privacy policy (COPPA/GDPR compliance)

**⚠️ ВАЖНО:** Все legal документы — ЧЕРНОВИКИ и требуют обязательной ревью юристом перед использованием в production.

**Когда использовать:**
- Подготовка к публичному launch
- Fundraising due diligence
- Compliance audits

---

### 📁 apple/ — TestFlight и App Store

**Для кого:** Mobile developers, DevOps

- **testflight_instructions.md** — Подробная инструкция по подготовке iOS build для TestFlight: Apple Developer setup, EAS configuration, metadata, screenshots

**Когда использовать:**
- Первый TestFlight upload
- App Store submission
- Troubleshooting build issues

---

### 📁 infra/ — Infrastructure и CI/CD

**Для кого:** SRE, DevOps, Backend developers

- **ci_cd.md** — GitHub Actions workflows, EAS Build, secrets management, Kubernetes deployment, Terraform examples

**Когда использовать:**
- Setting up CI/CD pipeline
- Deploying backend infrastructure
- Automating builds и deployments

---

### 📁 security/ — Security design

**Для кого:** CTO, Security team, SRE

- **security_design.md** — Threat model, authentication/authorization, encryption, KMS, monitoring, incident response, penetration testing

**Когда использовать:**
- Security architecture planning
- Security audits и pentests
- Incident response

---

### 📁 team/ — Команда и роли

**Для кого:** CEO, HR, hiring managers

- **team_roles.md** — Описание всех ролей: CTO, Product Lead, Mobile Dev, AI/ML Engineer, SRE, QA, Marketing, и т.д. — responsibilities, skills, compensation

**Когда использовать:**
- Hiring planning
- Org chart creation
- Compensation benchmarking

---

### 📁 roadmap/ — Дорожная карта

**Для кого:** CEO, Product team, investors

- **roadmap.md** — Дорожная карта на 24 месяца: PoC → MVP → Public Launch → Pilot → Production → Global Rollout

**Когда использовать:**
- Strategic planning
- Prioritization discussions
- Investor updates

---

### 📁 templates/ — Шаблоны

**Для кого:** CEO, Marketing, Sales, Community

- **outreach_templates.md** — Шаблоны писем: инвесторам, партнерам, школам, родителям, media
- **dataroom_template.md** — Структура data room для due diligence

**Когда использовать:**
- Outreach campaigns
- Fundraising preparation
- Partnership development

---

### 📄 license_recommendation.md — Рекомендация лицензии

**Для кого:** CEO, Legal, CTO

**Содержание:** Рекомендация использовать MIT License для open-source частей проекта, сравнение с альтернативами (GPL, Apache 2.0), dual licensing strategy

**Когда использовать:**
- Licensing decision-making
- Open-source strategy

---

## Как использовать эту документацию

### Для разработчиков

**Start here:**
1. `architecture/architecture.md` — Понять систему
2. `mvp/mvp_spec.md` — Понять product requirements
3. `infra/ci_cd.md` — Setup development environment

### Для Product Team

**Start here:**
1. `mvp/mvp_spec.md` — MVP scope и features
2. `pilot/pilot_plan.md` — Pilot planning
3. `roadmap/roadmap.md` — Long-term vision

### Для CEO/Founders

**Start here:**
1. `investors/pitch_deck.md` — Fundraising materials
2. `finance/financial_model_overview.md` — Financial planning
3. `legal/` — Compliance и legal setup

### Для Investors

**Start here:**
1. `investors/one_pager.md` — Quick overview
2. `investors/pitch_deck.md` — Detailed pitch
3. `legal/data_room_checklist.md` — Due diligence documents

---

## Maintenance и Updates

### Who Updates What

| Document | Owner | Update Frequency |
|----------|-------|------------------|
| architecture/* | CTO | As needed (major changes) |
| mvp/mvp_spec.md | Product Lead | Per sprint/iteration |
| investors/* | CEO | Before fundraising |
| finance/* | CEO/CFO | Monthly (metrics), Quarterly (model) |
| pilot/pilot_plan.md | Product Lead | Weekly during pilot |
| legal/* | Legal counsel | As needed, before launch |
| apple/testflight_instructions.md | Mobile Dev | As needed (new features) |
| infra/ci_cd.md | SRE | As needed (infrastructure changes) |
| security/security_design.md | CTO/Security | Quarterly, after audits |
| team/team_roles.md | CEO/HR | As needed (new hires) |
| roadmap/roadmap.md | CEO/Product | Monthly review, Quarterly update |
| templates/* | Marketing/CEO | As needed |

### Version Control

- Документы в Git (version history)
- Major updates → Commit message с changelog
- Breaking changes → Announce в team chat

### Review Process

**Before публикацией:**
1. Author пишет документ
2. Peer review (relevant team member)
3. Final approval (CEO или designated owner)
4. Commit и announce

**For legal documents:**
1. Author пишет черновик
2. **Legal counsel review** (обязательно!)
3. Edits по feedback
4. Final approval от legal counsel
5. Commit

---

## Placeholders для замены

Многие документы содержат placeholders, которые нужно заменить на реальные значения:

### Общие placeholders

- `[FOUNDERS_NAME]` — Имя основателя
- `[FOUNDERS_EMAIL]` — Email основателя (например: founder@kiku-app.com)
- `[COMPANY_NAME]` — Название юридического лица
- `[COMPANY_ADDRESS]` — Адрес компании
- `[DATE]` — Дата (формат: January 1, 2024 или 2024-01-01)

### Apple-specific

- `[APPLE_ID_EMAIL]` — Apple ID email для App Store Connect
- `[APP_STORE_CONNECT_APP_ID]` — ID приложения в App Store Connect
- `[APPLE_TEAM_ID]` — Apple Developer Team ID

### Legal

- `[PRIVACY_EMAIL]` — Email для privacy inquiries (например: privacy@kiku-app.com)
- `[DPO_EMAIL]` — Data Protection Officer email
- `[YOUR_COUNTRY]` — Страна регистрации компании

### Investor materials

- `[INVESTOR_NAME]` — Имя инвестора (для personalization)
- `[FOUNDERS_LINKEDIN]` — LinkedIn profile URL

**Как заменить:**
```bash
# Find all placeholders
grep -r "\[.*\]" docs/

# Replace with real values (example)
find docs/ -type f -exec sed -i 's/\[FOUNDERS_EMAIL\]/founder@kiku-app.com/g' {} +
```

---

## Confidentiality

### Public Documents (можно делиться)

- README.md (этот файл)
- architecture/ (high-level, без sensitive details)
- license_recommendation.md
- roadmap/ (general vision)

### Confidential (только для team и investors)

- investors/ (pitch deck, financials)
- finance/ (financial model)
- legal/ (contracts, agreements)
- pilot/pilot_plan.md (partner details)

### Highly Confidential (только для authorized users)

- legal/privacy_policy_draft.md (до публикации)
- security/security_design.md (vulnerabilities, incident details)
- team/team_roles.md (compensation details)

**⚠️ ВАЖНО:** Не commit sensitive data (secrets, passwords, real user data) в Git!

---

## Contributing

### Для team members

1. Create branch: `docs/update-[document-name]`
2. Make changes
3. Commit с descriptive message
4. Create PR
5. Request review
6. Merge после approval

### Formatting Guidelines

- **Language:** Русский (primary), English (для code examples)
- **Encoding:** UTF-8
- **Line endings:** LF (Unix)
- **Max line length:** 120 characters (для Markdown)
- **Headings:** ATX-style (`#`, `##`, `###`)
- **Lists:** `-` для unordered, `1.` для ordered

### Markdown Best Practices

```markdown
✅ Good:
# Heading 1
## Heading 2
- List item
- Another item

❌ Bad:
Heading 1
=========
Heading 2
---------
* List item (use - instead)
```

---

## Support

**Questions about documentation:**
- Email: docs@kiku-app.com (placeholder)
- Slack: #docs channel
- GitHub: Create issue с label `documentation`

**Suggest improvements:**
- Create PR с changes
- Или GitHub issue с предложением

---

## Quick Reference

### Most Important Documents

1. **MVP Spec** — `mvp/mvp_spec.md`
2. **Architecture** — `architecture/architecture.md`
3. **Pitch Deck** — `investors/pitch_deck.md`
4. **Roadmap** — `roadmap/roadmap.md`
5. **Security** — `security/security_design.md`

### Quick Commands

```bash
# Find document
find docs/ -name "*[keyword]*"

# Search content
grep -r "keyword" docs/

# Count files
find docs/ -type f | wc -l

# List all placeholders
grep -r "\[.*\]" docs/ | grep -v ".git"
```

---

## Changelog

### Version 1.0 (January 2024)

- ✅ Initial documentation structure created
- ✅ 19 documents + 1 diagram
- ✅ All key areas covered (architecture, MVP, investors, finance, legal, infra, team, roadmap)
- 🔄 Placeholders need to be replaced with real values
- 🔄 Legal documents need lawyer review

### Next Steps

- [ ] Replace all placeholders with real values
- [ ] Legal counsel review of legal documents
- [ ] Create detailed architecture diagram (replace placeholder SVG)
- [ ] Add more screenshots и visuals
- [ ] Translate key documents to English (для international investors)

---

**Последнее обновление:** Январь 2024  
**Maintainer:** kiku Team  
**Version:** 1.0

**🚀 Ready to build kiku and protect children online!**
