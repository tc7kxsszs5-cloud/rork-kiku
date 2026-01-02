# Документация Rork-Kiku

Добро пожаловать в центральную документацию проекта Rork-Kiku!

## 🎯 Обзор

Rork-Kiku — платформа безопасного детского контента с автоматической AI-модерацией. Эта папка содержит всю техническую, продуктовую, юридическую и бизнес-документацию проекта.

---

## 📁 Структура документации

### 🏗️ Архитектура и техническая документация

**`architecture/`**
- [`architecture.md`](architecture/architecture.md) - Полная системная архитектура
- [`diag.svg`](architecture/diag.svg) - Архитектурная диаграмма (placeholder)

**`security/`**
- [`security_design.md`](security/security_design.md) - Дизайн безопасности, шифрование, KMS, RBAC, мониторинг

**`infra/`**
- [`ci_cd.md`](infra/ci_cd.md) - CI/CD pipeline, GitHub Actions, Terraform, Helm

### 📱 Продукт и MVP

**`mvp/`**
- [`mvp_spec.md`](mvp/mvp_spec.md) - Спецификация MVP для TestFlight пилота

**`pilot/`**
- [`pilot_plan.md`](pilot/pilot_plan.md) - План пилота с KPI, фазами, чек-листами

**`roadmap/`**
- [`roadmap.md`](roadmap/roadmap.md) - Дорожная карта на 24 месяца (2026-2027)

### 💰 Инвесторские материалы

**`investors/`**
- [`pitch_deck.md`](investors/pitch_deck.md) - Полный pitch deck (12-15 слайдов)
- [`one_pager.md`](investors/one_pager.md) - Краткий one-pager для инвесторов

### 📊 Финансовая документация

**`finance/`**
- [`financial_model_overview.md`](finance/financial_model_overview.md) - Описание финансовой модели
- [`financial_model.csv`](finance/financial_model.csv) - 5-летние проекции (3 сценария)

### ⚖️ Юридическая документация

**`legal/`**
- [`data_room_checklist.md`](legal/data_room_checklist.md) - Полный чек-лист для data room
- [`content_policy.md`](legal/content_policy.md) - Политика модерации контента
- [`privacy_policy_draft.md`](legal/privacy_policy_draft.md) - Черновик privacy policy (COPPA/GDPR)

⚠️ **ТРЕБУЕТ ЮРИСТА:** Все юридические документы — черновики и требуют review профессионального юриста.

### 🍎 Apple и мобильная разработка

**`apple/`**
- [`testflight_instructions.md`](apple/testflight_instructions.md) - Подробные инструкции по TestFlight

### 👥 Команда и организация

**`team/`**
- [`team_roles.md`](team/team_roles.md) - Описание всех ролей в команде

**`templates/`**
- [`outreach_templates.md`](templates/outreach_templates.md) - Шаблоны писем (инвесторы, школы, beta-testers)
- [`dataroom_template.md`](templates/dataroom_template.md) - Шаблон структуры data room

### 🎨 Брендинг

**`branding/`**
- [`brand-guidelines.md`](branding/brand-guidelines.md) - Бренд-гайдлайны (placeholder)
- `logo_placeholders/` - Placeholder логотипы (заменить на реальные)

### 📄 Общая документация

- [`license_recommendation.md`](license_recommendation.md) - Рекомендация по лицензии (MIT)
- [`README.md`](README.md) - Этот файл

---

## 🚀 Быстрый старт

### Для новых участников команды

1. **Начните с:**
   - [`architecture/architecture.md`](architecture/architecture.md) - Понять систему
   - [`mvp/mvp_spec.md`](mvp/mvp_spec.md) - Понять продукт
   - [`team/team_roles.md`](team/team_roles.md) - Найти свою роль

2. **Затем изучите:**
   - [`roadmap/roadmap.md`](roadmap/roadmap.md) - Куда мы движемся
   - [`security/security_design.md`](security/security_design.md) - Безопасность критична!

3. **Для разработки:**
   - [`infra/ci_cd.md`](infra/ci_cd.md) - CI/CD setup
   - [`apple/testflight_instructions.md`](apple/testflight_instructions.md) - iOS deployment

### Для инвесторов

**Начните с:**
- [`investors/one_pager.md`](investors/one_pager.md) - Краткий обзор
- [`investors/pitch_deck.md`](investors/pitch_deck.md) - Полная презентация

**Затем:**
- [`finance/financial_model_overview.md`](finance/financial_model_overview.md) - Финансовые проекции
- [`legal/data_room_checklist.md`](legal/data_room_checklist.md) - Due diligence материалы

### Для партнёров (школы, НКО)

**Начните с:**
- [`pilot/pilot_plan.md`](pilot/pilot_plan.md) - План пилота
- [`templates/outreach_templates.md`](templates/outreach_templates.md) - Шаблоны писем

---

## 📝 Правила редактирования документации

### Кто может редактировать

- **Founders:** Все документы
- **Team Members:** Техническая документация
- **Advisors:** По согласованию

### Процесс изменений

1. **Minor changes** (typos, formatting):
   - Создать PR напрямую

2. **Major changes** (новые секции, изменение content):
   - Обсудить с командой
   - Создать PR с описанием изменений
   - Request review от relevant stakeholders

3. **Legal/Financial documents:**
   - **Обязательно** согласование с founder или legal counsel
   - Never самостоятельно без approval

### Naming Convention

**Файлы:**
- Lowercase с underscores: `file_name.md`
- Descriptive names: `mvp_spec.md` (не `spec.md`)

**Commits:**
- `docs: Add [description]`
- `docs: Update [file] - [what changed]`
- `docs: Fix typo in [file]`

### Markdown Style

**Headers:**
- `# H1` - Document title (только один)
- `## H2` - Main sections
- `### H3` - Subsections

**Lists:**
- Unordered: `- Item`
- Ordered: `1. Item`
- Checkboxes: `- [ ] Todo` или `- [x] Done`

**Code:**
- Inline: \`code\`
- Block: \`\`\`language\n...\n\`\`\`

**Links:**
- Internal: `[text](./relative/path.md)`
- External: `[text](https://...)`

**Images:**
- `![alt text](./path/to/image.png)`

---

## 🔒 Правила безопасности

### ⛔ НИКОГДА не добавляйте в документацию:

❌ **Секреты и ключи:**
- API keys
- Database passwords
- JWT secrets
- Private keys (.p8, .pem)
- OAuth client secrets

❌ **Персональные данные:**
- Реальные email addresses пользователей
- Телефоны
- Адреса
- Children's information

❌ **Коммерческие секреты:**
- Actual pricing strategy (используйте placeholders)
- Real investor names без их permission
- Confidential partnership details

### ✅ Вместо этого используйте:

✅ **Placeholders:**
- `[FOUNDERS_EMAIL]`
- `[API_KEY]`
- `[DATABASE_URL]`
- `$ENVIRONMENT_VARIABLE`

✅ **Инструкции:**
- "Создайте API key в [сервис] и сохраните в GitHub Secrets"
- "Получите credentials от founder и add to `.env.local`"

✅ **Example values (obviously fake):**
- `test@example.com`
- `sk_test_abc123...` (clearly test key)

### Хранение секретов

**Правильные места:**
- GitHub Secrets (для CI/CD)
- `.env.local` (gitignored)
- HashiCorp Vault
- AWS Secrets Manager
- 1Password / LastPass (для team sharing)

**См. также:**
- [`security/security_design.md`](security/security_design.md) - Secret management
- [`infra/ci_cd.md`](infra/ci_cd.md) - GitHub Secrets setup

---

## 📦 Процесс добавления в Data Room

### Когда добавлять документы в Data Room

**Before fundraising:**
- Corporate documents
- Financial projections
- Legal policies
- Team information

**During due diligence:**
- Любые requested documents
- Updates к existing documents

### Процесс

1. **Prepare document:**
   - Ensure up-to-date
   - Remove placeholders (заменить real data)
   - Legal review (если applicable)
   - Founder approval

2. **Add to Data Room:**
   - Follow naming convention (см. [`templates/dataroom_template.md`](templates/dataroom_template.md))
   - Update INDEX.md
   - Set correct permissions (read-only для investors)

3. **Announce:**
   - Notify team
   - Update investors (если они have access)

### Checklist

См. полный checklist: [`legal/data_room_checklist.md`](legal/data_room_checklist.md)

---

## 🔄 Versioning

### Document Versions

**Major documents** (pitch deck, financial model, policies):
- Version numbers: v1.0, v1.1, v2.0
- Version history в document footer
- Changelog в document или separate CHANGELOG.md

**Working documents** (architecture, specs):
- Git history достаточно
- No explicit versioning

### Archive Old Versions

**When to archive:**
- Major pivot or strategy change
- After funding round (keep term sheet versions)
- Legal document superseded

**Where:**
- Create `archive/` folder
- Move old versions
- Update links

---

## 📧 Контактная информация

### Questions о документации

**General:** [FOUNDERS_EMAIL]

**Specific areas:**
- **Technical (architecture, infra):** CTO или Lead Engineer
- **Product (MVP, roadmap):** Product Lead
- **Legal:** Legal Counsel
- **Financial:** CFO (или Founder)
- **Fundraising:** CEO

### Reporting Issues

**Found an error или outdated info?**

1. **Small issue:** Create PR с fix
2. **Big issue:** Create GitHub Issue с description
3. **Urgent:** Email [FOUNDERS_EMAIL]

---

## 📚 External Resources

### Related Documentation

**Project README:**
- [`../README.md`](../README.md) - Main project README (code)

**Technical Specs:**
- API documentation (TO BE CREATED)
- Database schema (TO BE CREATED)

### External Links

**Compliance:**
- [COPPA Guidelines](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business)
- [GDPR Info](https://gdpr.eu/)

**Tools:**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Kubernetes](https://kubernetes.io/docs/)

---

## 🗂️ Appendix: Document Status

### ✅ Complete (Ready to use)

- architecture.md
- security_design.md
- mvp_spec.md
- pilot_plan.md
- roadmap.md
- pitch_deck.md
- one_pager.md
- financial_model_overview.md
- financial_model.csv
- team_roles.md

### ⚠️ Draft (Requires review)

- content_policy.md (REQUIRES LAWYER)
- privacy_policy_draft.md (REQUIRES LAWYER)
- data_room_checklist.md (Review before fundraise)

### 📝 Placeholder (Requires replacement)

- brand-guidelines.md
- logo_placeholders/*
- diag.svg (architecture diagram)

### 📅 To Be Created

- Terms of Service
- API Documentation
- Database Schema Documentation
- Employee Handbook
- Contributor Guidelines

---

## 📊 Documentation Statistics

**Total Documents:** 20+
**Last Updated:** 2026-01-02
**Primary Language:** Russian
**Secondary Language:** English (where applicable)

**Coverage:**
- Architecture: ✅
- Product: ✅
- Legal: ⚠️ (requires lawyer review)
- Financial: ✅
- Operations: ✅
- Branding: 📝 (placeholders)

---

## 🎯 Action Items

**For immediate focus:**
- [ ] Replace placeholder logos
- [ ] Legal review of content_policy.md и privacy_policy.md
- [ ] Create real architecture diagram
- [ ] Fill in [PLACEHOLDER] values throughout docs

**For pre-fundraise:**
- [ ] Complete data room preparation
- [ ] Update pitch deck с latest metrics
- [ ] Finalize financial projections
- [ ] Get all legal docs approved

**For pre-launch:**
- [ ] Create Terms of Service
- [ ] Finalize all user-facing policies
- [ ] Complete API documentation
- [ ] Professional branding assets

---

## 📞 Support

**Need help navigating documentation?**

Contact: [FOUNDERS_EMAIL]

**Want to contribute?**

1. Read this README
2. Follow editing guidelines
3. Create PR
4. Request review

---

**Last Updated:** 2026-01-02

**Maintained By:** [YOUR_NAME], Founder

**Version:** 0.1 (Initial Release)
