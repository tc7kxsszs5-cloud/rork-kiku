# Документация Rork-Kiku

Добро пожаловать в документацию проекта Rork-Kiku — безопасной семейной платформы для обмена медиа с AI-модерацией.

## 📚 Структура документации

### Архитектура и технологии
- **[architecture/](architecture/)** — Архитектура системы, диаграммы, технический стек
  - `architecture.md` — Подробная архитектура платформы
  - `diag.svg` — Архитектурная диаграмма (placeholder)

### Продукт
- **[mvp/](mvp/)** — MVP спецификация и требования
  - `mvp_spec.md` — Полная спецификация MVP для TestFlight
- **[roadmap/](roadmap/)** — Дорожная карта на 24 месяца
  - `roadmap.md` — Фазы развития, milestones, KPI

### Инвесторы и финансы
- **[investors/](investors/)** — Материалы для инвесторов
  - `pitch_deck.md` — Pitch deck (12-15 слайдов)
  - `one_pager.md` — Краткий summary для инвесторов
- **[finance/](finance/)** — Финансовая модель
  - `financial_model_overview.md` — Описание финансовой модели
  - `financial_model.csv` — Детальные проекции (CSV)

### Пилот и запуск
- **[pilot/](pilot/)** — План пилотной программы
  - `pilot_plan.md` — Цели, KPI, фазы, партнёры

### Юридические документы
- **[legal/](legal/)** — Legal и compliance
  - `data_room_checklist.md` — Чек-лист документов для data room
  - `content_policy.md` — Политика контента (ТРЕБУЕТ ЮРИСТА)
  - `privacy_policy_draft.md` — Privacy Policy черновик (ТРЕБУЕТ ЮРИСТА)

### Apple и iOS
- **[apple/](apple/)** — TestFlight и App Store
  - `testflight_instructions.md` — Инструкции по подготовке iOS build

### Инфраструктура
- **[infra/](infra/)** — DevOps и CI/CD
  - `ci_cd.md` — GitHub Actions pipelines, Terraform, secret management

### Безопасность
- **[security/](security/)** — Security design
  - `security_design.md` — Threat model, меры защиты, incident response

### Команда
- **[team/](team/)** — Роли и обязанности
  - `team_roles.md` — Описание ролей команды (founder, engineers, etc.)

### Шаблоны
- **[templates/](templates/)** — Шаблоны писем и документов
  - `outreach_templates.md` — Письма инвесторам, партнёрам, школам
  - `dataroom_template.md` — Структура data room

### Брендинг
- **[branding/](branding/)** — Brand assets и guidelines
  - `brand-guidelines.md` — Brand guidelines (цвета, шрифты, logo usage)
  - `logo_placeholders/` — Placeholder logo files

### Разное
- **[license_recommendation.md](license_recommendation.md)** — Рекомендация лицензии MIT

---

## 🚀 Быстрый старт

### Для разработчиков
1. Прочитать [architecture/architecture.md](architecture/architecture.md) — понять систему
2. Прочитать [mvp/mvp_spec.md](mvp/mvp_spec.md) — понять MVP scope
3. Прочитать [infra/ci_cd.md](infra/ci_cd.md) — setup CI/CD
4. Прочитать [security/security_design.md](security/security_design.md) — security best practices

### Для основателей/бизнеса
1. Прочитать [investors/pitch_deck.md](investors/pitch_deck.md) — pitch материалы
2. Прочитать [finance/financial_model_overview.md](finance/financial_model_overview.md) — финансовая модель
3. Прочитать [pilot/pilot_plan.md](pilot/pilot_plan.md) — план пилота
4. Прочитать [legal/data_room_checklist.md](legal/data_room_checklist.md) — подготовка к due diligence

### Для compliance/legal
1. Прочитать [legal/privacy_policy_draft.md](legal/privacy_policy_draft.md) — GDPR/COPPA (ТРЕБУЕТ REVIEW)
2. Прочитать [legal/content_policy.md](legal/content_policy.md) — Moderation policy (ТРЕБУЕТ REVIEW)
3. Прочитать [security/security_design.md](security/security_design.md) — Security measures

---

## 📝 Правила редактирования документации

### Общие принципы

1. **UTF-8 encoding**: Все файлы в UTF-8
2. **Русский язык**: Основной язык документации (за исключением кода)
3. **Markdown**: Использовать Markdown для всех docs
4. **Versioning**: Указывать дату и версию документа внизу

### Структура документа

Каждый документ должен содержать:
- **Заголовок H1**: Название документа
- **Обзор**: Краткое описание цели документа
- **Содержание**: Секции с H2, H3 headers
- **Footer**: Дата создания, версия, контакт [FOUNDERS_EMAIL]

### Пример footer
```markdown
---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]
```

### Как вносить изменения

1. **Создать branch**: `git checkout -b docs/update-architecture`
2. **Редактировать файл**: Внести изменения
3. **Commit**: `git commit -m "docs: update architecture diagram"`
4. **Push**: `git push origin docs/update-architecture`
5. **Create PR**: С описанием изменений
6. **Review**: Получить approval от team lead
7. **Merge**: После approval

### Review process

**Minor changes** (typos, formatting):
- Self-review OK
- Commit directly to main (или через PR)

**Major changes** (new sections, substantial edits):
- Create PR
- Request review от relevant stakeholder:
  - Technical docs → CTO
  - Business docs → CEO/Product Lead
  - Legal docs → Legal counsel (обязательно)
- Merge after approval

---

## 📄 Как добавлять материалы в Data Room

### Подготовка документа

1. **Format**: PDF (preferred) или XLSX для spreadsheets
2. **Naming convention**: `YYYY-MM-DD_Document_Name.pdf`
   - Example: `2026-01-02_Privacy_Policy_v1.0.pdf`
3. **Watermark**: Добавить watermark для sensitive docs (cap table, financial model)
4. **Version control**: Указать версию в filename

### Структура Data Room

См. [templates/dataroom_template.md](templates/dataroom_template.md) для детальной структуры.

**Платформа**:
- **MVP/Beta**: Google Drive (secure sharing) или DocSend
- **Seed/Series A**: Carta, Firmex, или dedicated data room platform

### Security

⚠️ **Важно**:
- NDA required перед доступом
- Read-only access по умолчанию
- Audit logging enabled
- No download до term sheet (опционально)

---

## 🔒 Правила безопасности

### ❌ НИКОГДА не добавлять в docs:

1. **Секреты и credentials**:
   - API keys, passwords, tokens
   - Database connection strings
   - Private keys, certificates
   - AWS access keys, GCP service accounts

2. **Персональные данные**:
   - Real user data (emails, names, photos)
   - IP addresses
   - Phone numbers

3. **Конфиденциальная бизнес-информация**:
   - Real financial data (до публичного disclosure)
   - Confidential partner agreements
   - Unreleased product plans (если не internal docs)

### ✅ Вместо этого использовать:

1. **Placeholders**:
   - `[FOUNDERS_EMAIL]` вместо real email
   - `[API_KEY]` вместо real API key
   - `[DATABASE_URL]` вместо real connection string

2. **Environment variables**:
   ```bash
   export DATABASE_URL="postgresql://..."
   export API_KEY="sk_live_..."
   ```

3. **Secret management**:
   - **GitHub Secrets** для CI/CD
   - **HashiCorp Vault** для production
   - **AWS Secrets Manager** для cloud resources

### Secret scanning

**Tools**:
- `git-secrets` — Prevent committing secrets
- `trufflehog` — Scan git history для secrets
- GitHub Secret Scanning — Автоматическое обнаружение

**Setup git-secrets** (recommended):
```bash
brew install git-secrets # macOS
git secrets --install
git secrets --register-aws
```

---

## 🎨 Брендинг

См. [branding/brand-guidelines.md](branding/brand-guidelines.md) для:
- Logo files (SVG, PNG)
- Color palette
- Typography
- Usage guidelines

---

## 📞 Контакты

**Вопросы по документации**: [FOUNDERS_EMAIL]

**Специфичные вопросы**:
- **Technical**: CTO
- **Business/Product**: CEO
- **Legal**: Legal counsel (external)
- **Finance**: CFO/Finance advisor

---

## 📅 История обновлений

**2026-01-02**: Инициальная версия документации (v1.0)

---

## 📖 Дополнительные ресурсы

**External links**:
- COPPA compliance: https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions
- GDPR guide: https://gdpr.eu/
- GitHub docs: https://docs.github.com/
- Terraform docs: https://www.terraform.io/docs

---

**Дата создания**: 2026-01-02  
**Версия**: 1.0  
**Мейнтейнер**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**Спасибо за использование документации Rork-Kiku!** 🙏
