# Документация проекта Rork-Kiku

**Версия**: 0.1.0  
**Дата**: 2026-01-02  
**Контакт**: [FOUNDERS_EMAIL]

---

## 📋 Обзор

Этот каталог содержит всю документацию проекта Rork-Kiku — платформы для безопасного обмена медиаконтентом между родителями и детьми с AI-модерацией.

**⚠️ ВАЖНО**: Все документы в этом каталоге являются ЧЕРНОВИКАМИ и требуют соответствующего ревью (technical, legal, compliance) перед использованием в production.

---

## 📁 Структура документации

### `/architecture` — Техническая архитектура
- **architecture.md**: Полное описание системной архитектуры (слои, компоненты, data flow, безопасность)
- **diag.svg**: Placeholder диаграмма архитектуры (требует замены на детальную)

### `/mvp` — MVP Specification
- **mvp_spec.md**: Спецификация MVP для iOS TestFlight pilot (features, user flows, API contract, requirements)

### `/investors` — Материалы для инвесторов
- **pitch_deck.md**: Pitch deck 12-15 слайдов (проблема, решение, рынок, команда, финансы, ask)
- **one_pager.md**: Одностраничный summary для быстрого ознакомления

### `/finance` — Финансовая модель
- **financial_model_overview.md**: Описание финмодели, unit economics, сценарии (консервативный/базовый/оптимистичный)
- **financial_model.csv**: CSV с детальными цифрами (revenue, costs, EBITDA)

### `/pilot` — План пилотного запуска
- **pilot_plan.md**: Детальный план pilot программы (цели, KPI, timeline, partnerships, security checklist)

### `/legal` — Юридические документы
- **data_room_checklist.md**: Чеклист документов для data room (due diligence)
- **content_policy.md**: Политика контента и модерации (ТРЕБУЕТ РЕВЬЮ ЮРИСТА)
- **privacy_policy_draft.md**: Черновик Privacy Policy (ТРЕБУЕТ РЕВЬЮ ЮРИСТА, COPPA/GDPR compliance)

### `/apple` — iOS и TestFlight
- **testflight_instructions.md**: Инструкции по настройке Apple Developer Account, TestFlight, App Store Connect

### `/infra` — Infrastructure и CI/CD
- **ci_cd.md**: GitHub Actions workflows, Terraform, Kubernetes deployment, secret management

### `/security` — Дизайн безопасности
- **security_design.md**: Encryption, authentication, RBAC, monitoring, incident response, pentest schedule

### `/team` — Команда и роли
- **team_roles.md**: Описание ролей (founders, engineers, moderators, ops), hiring plan

### `/roadmap` — Дорожная карта
- **roadmap.md**: Roadmap на 24 месяца (Q1 2026 — 2028+), milestones, KPIs

### `/templates` — Шаблоны
- **outreach_templates.md**: Email templates (инвесторы, партнёры, школы, НКО, media)
- **dataroom_template.md**: Структура data room для fundraising

### `/branding` — Брендинг
- **brand-guidelines.md**: Брендбук (цвета, типографика, logo usage)
- **logo_placeholders/**: Placeholder logo assets (SVG, PNG)

### Корневой уровень
- **README.md** (этот файл): Обзор docs структуры
- **license_recommendation.md**: Рекомендация лицензии (MIT для OSS частей)

---

## 🔒 Безопасность и Secrets

### ⚠️ НИКОГДА НЕ commit secrets в Git!

**Запрещено**:
- `.env` files с реальными credentials
- API keys, passwords, tokens
- `.p12` certificates, private keys
- PII (personally identifiable information)
- Реальные email addresses, phone numbers

**Разрешено (placeholders только)**:
- `[FOUNDERS_EMAIL]` — placeholder для email
- `[PLACEHOLDER]` — для других sensitive данных
- `[API_KEY]`, `[SECRET]` — явные placeholders

### Где хранить secrets:
- **GitHub Secrets**: Для CI/CD (EXPO_TOKEN, APPLE_ID, AWS keys)
- **AWS Secrets Manager**: Для runtime secrets (database passwords, API keys)
- **HashiCorp Vault**: Для enterprise secret management
- **Environment variables**: Local development (не commit .env файлы!)

### .gitignore должен включать:
```
.env
.env.local
.env.*.local
*.p12
*.key
*.pem
*.mobileprovision
secrets/
credentials/
```

---

## ✏️ Правила редактирования документации

### 1. Формат
- **Markdown**: Все docs в Markdown (.md)
- **UTF-8 encoding**: Обязательно (поддержка русского языка)
- **Названия файлов**: `lowercase_with_underscores.md`

### 2. Структура документа
Каждый document должен иметь:
```markdown
# Название документа

## Версия документа
- **Версия**: X.Y.Z
- **Дата**: YYYY-MM-DD
- **Статус**: DRAFT | REVIEW | APPROVED
- **Контакт**: [FOUNDERS_EMAIL]

---

[Content here]
```

### 3. Версионирование
- **Semantic versioning**: Major.Minor.Patch (e.g., 0.1.0, 1.0.0)
- **Major** (X.0.0): Полное переписывание
- **Minor** (0.X.0): Существенные изменения, новые разделы
- **Patch** (0.0.X): Мелкие правки, typos

### 4. Changelog
Для major documents (architecture, MVP spec), добавить Changelog в конец:
```markdown
## Changelog
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1.0 | 2026-01-02 | Первоначальный черновик | [AUTHOR] |
| 0.2.0 | 2026-01-15 | Добавлен раздел X | [AUTHOR] |
```

### 5. Placeholders
- Всегда используйте placeholders для sensitive data
- Формат: `[DESCRIPTION]` в квадратных скобках
- Примеры: `[FOUNDERS_EMAIL]`, `[API_KEY]`, `[COMPANY_NAME]`

---

## 📤 Добавление материалов в Data Room

### Когда готовитесь к fundraising:

1. **Review documents**: Убедитесь, что все docs актуальны
2. **Legal review**: Privacy Policy, ToS, contracts — обязательно review юристом
3. **Remove placeholders**: Заменить на actual data (но не commit secrets в Git!)
4. **Organize structure**: Следовать структуре из `templates/dataroom_template.md`
5. **Set permissions**: Разные access levels (public, NDA, restricted)
6. **Use secure platform**: DocSend, Notion, или Google Drive с permissions

### Файлы для Data Room:
- ✅ Pitch deck (PDF)
- ✅ Financial model (Excel)
- ✅ Legal documents (после lawyer review)
- ✅ Technical docs (architecture, security)
- ✅ Traction metrics (если есть)

---

## 🛠️ Инструменты

### Для редактирования Markdown:
- **VS Code**: С плагином Markdown Preview
- **Typora**: WYSIWYG Markdown editor
- **Notion**: Онлайн, collaborative

### Для диаграмм:
- **Draw.io** (diagrams.net): Бесплатный, онлайн
- **Lucidchart**: Professional, платный
- **Mermaid**: Markdown-based diagrams (интеграция с GitHub)

### Для финмодели:
- **Google Sheets** или **Excel**: Для financial_model.csv
- **Causal**: Financial modeling tool (alternative)

---

## 🔄 Workflow для обновлений

### Мелкие правки (typos, clarifications):
1. Edit документ directly
2. Update version (patch: 0.0.X)
3. Commit: `docs: fix typo in architecture.md`

### Существенные изменения (новые разделы, major updates):
1. Create branch: `docs/update-mvp-spec`
2. Make changes
3. Update version (minor: 0.X.0)
4. Open PR для review
5. Merge после approval

### Критические docs (legal, compliance):
1. **ВСЕГДА** lawyer review перед использованием
2. Document legal review: "Reviewed by [LAW_FIRM] on [DATE]"
3. Separate versions: `privacy_policy_draft.md` vs `privacy_policy_approved.md`

---

## 📞 Контакты

### Общие вопросы:
- **Email**: [FOUNDERS_EMAIL]

### Specific areas:
- **Technical docs** (architecture, MVP): [CTO_EMAIL или FOUNDERS_EMAIL]
- **Legal docs** (privacy, ToS): [LEGAL_COUNSEL или FOUNDERS_EMAIL]
- **Financial docs**: [CFO или FOUNDERS_EMAIL]
- **Product docs** (roadmap, features): [CPO или FOUNDERS_EMAIL]

---

## ⚠️ Disclaimer

**Все документы в каталоге `/docs` являются ЧЕРНОВИКАМИ** и предназначены для:
- Internal team planning
- Investor discussions (с пониманием draft status)
- Development guidance

**НЕ использовать в production без**:
- Technical review (для tech docs)
- Legal review (для legal/compliance docs)
- Founder approval (для external-facing materials)

**Никаких реальных секретов, ключей, паролей или персональных данных** в документации. Только placeholders.

---

**Last Updated**: 2026-01-02  
**Maintained by**: [FOUNDERS_EMAIL]
