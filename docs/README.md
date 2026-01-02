# Документация Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026

---

## Обзор

Эта папка содержит всю документацию для проекта Rork-Kiku — платформы для безопасного общения детей и родителей.

**⚠️ ВАЖНО**: Вся документация — черновики. Перед использованием в production требуется:
- ✅ Юридический ревью (для legal документов)
- ✅ Технический ревью (для architecture/security)
- ✅ Финансовый ревью (для financial model)

---

## Структура документации

### `/architecture` — Архитектура системы
- `architecture.md` — Подробное описание архитектуры (слои, data flow, security)
- `diag.svg` — Placeholder диаграмма архитектуры

### `/mvp` — MVP спецификация
- `mvp_spec.md` — Детальная спецификация MVP для pilot (функции, user flows, API contract)

### `/investors` — Материалы для инвесторов
- `pitch_deck.md` — Полный pitch deck (12-15 слайдов)
- `one_pager.md` — Одностраничное резюме проекта

### `/finance` — Финансовая модель
- `financial_model_overview.md` — Обзор финансовой модели (3 сценария)
- `financial_model.csv` — CSV с финансовыми данными

### `/pilot` — План пилотного проекта
- `pilot_plan.md` — Детальный план pilot (цели, KPI, timeline, partners)

### `/legal` — Юридические документы
- `data_room_checklist.md` — Чеклист документов для data room
- `content_policy.md` — Политика контента и модерации (**ТРЕБУЕТ ЮРИСТА**)
- `privacy_policy_draft.md` — Черновик privacy policy (**ТРЕБУЕТ ЮРИСТА**)

### `/apple` — TestFlight и iOS
- `testflight_instructions.md` — Подробные инструкции по TestFlight submission

### `/infra` — Инфраструктура и CI/CD
- `ci_cd.md` — GitHub Actions pipelines, Kubernetes, Terraform

### `/security` — Безопасность
- `security_design.md` — Security architecture, encryption, incident response

### `/team` — Командная структура
- `team_roles.md` — Описание ролей и обязанностей команды

### `/roadmap` — Дорожная карта
- `roadmap.md` — 24-месячная roadmap (Q1 2026 - Q4 2027)

### `/templates` — Шаблоны
- `outreach_templates.md` — Шаблоны писем (инвесторы, партнёры, users)
- `dataroom_template.md` — Структура data room

### `/branding` — Брендинг
- `brand-guidelines.md` — Brand guidelines (logo, colors, typography)
- `logo_placeholders/` — Placeholder логотипы (требуют замены)

---

## Как использовать эту документацию

### Для Founders / Leadership

**Перед Fundraising**:
1. Прочитать `/investors/pitch_deck.md` и `one_pager.md`
2. Обновить traction данные
3. Подготовить data room (см. `/legal/data_room_checklist.md`)
4. Использовать `/templates/outreach_templates.md` для investor outreach

**Перед Pilot**:
1. Прочитать `/pilot/pilot_plan.md`
2. Подготовить TestFlight (см. `/apple/testflight_instructions.md`)
3. Финализировать legal docs (privacy policy, content policy)

**Перед Production Launch**:
1. Security review (`/security/security_design.md`)
2. Architecture review (`/architecture/architecture.md`)
3. Team hiring (`/team/team_roles.md`)
4. Roadmap validation (`/roadmap/roadmap.md`)

### Для Engineering Team

**Setup Infrastructure**:
- Следовать `/infra/ci_cd.md` для GitHub Actions setup
- Использовать `/architecture/architecture.md` для понимания system design
- Читать `/security/security_design.md` для security best practices

**iOS Development**:
- `/apple/testflight_instructions.md` — полное руководство по TestFlight

**Security**:
- `/security/security_design.md` — обязательно к прочтению перед любыми изменениями

### Для Product Team

**MVP Development**:
- `/mvp/mvp_spec.md` — референс для features и user flows

**Roadmap Planning**:
- `/roadmap/roadmap.md` — 24-месячный plan

**User Research**:
- `/pilot/pilot_plan.md` — KPI и metrics для tracking

### Для Legal / Compliance

**Обязательно**:
- `/legal/privacy_policy_draft.md` — черновик, требует юриста
- `/legal/content_policy.md` — черновик, требует юриста
- `/legal/data_room_checklist.md` — что подготовить для investors

**⚠️ ВСЕ legal docs — черновики, НЕ использовать без legal review.**

---

## Редактирование документации

### Как добавить/обновить документ

1. **Создать или отредактировать** файл в соответствующей папке
2. **Использовать Markdown** format (.md files)
3. **UTF-8 encoding** обязательно (для русского текста)
4. **Commit message**: `docs: [краткое описание изменения]`
5. **Pull Request**: создать PR для ревью

### Версионирование

- Каждый документ должен иметь **Версию** в header'е
- **Дата последнего обновления** в header'е
- **Статус** (ЧЕРНОВИК, ТРЕБУЕТ РЕВЬЮ, ФИНАЛИЗИРОВАН)

**Пример header'а**:

```markdown
# Название документа

**Версия**: 1.2  
**Дата**: 2026-02-15  
**Статус**: ТРЕБУЕТ ЮРИСТА
```

### Naming Convention

- Файлы: `lowercase_with_underscores.md`
- Папки: `lowercase` (без underscores)
- Избегать пробелов в именах файлов

---

## Data Room подготовка

Когда готовы к fundraising или partnerships:

1. **Собрать документы** по чеклисту (`/legal/data_room_checklist.md`)
2. **Организовать** по структуре (`/templates/dataroom_template.md`)
3. **Secure storage**: Google Drive с ограниченным доступом или специализированный data room (Carta, DocSend)
4. **NDA**: Все investors/partners должны подписать NDA перед доступом

**Важно**: НЕ включать в data room:
- ❌ API keys, passwords, secrets
- ❌ Customer PII (личные данные)
- ❌ Sensitive source code (только high-level architecture)

---

## Правила безопасности

### ⛔ НИ В КОЕМ СЛУЧАЕ НЕ КОММИТИТЬ:

- ❌ **API keys** (Expo token, AWS credentials, Google API keys)
- ❌ **Passwords** (database passwords, admin passwords)
- ❌ **Secrets** (JWT secrets, encryption keys)
- ❌ **Personal data** (customer emails, phone numbers, children's data)
- ❌ **Private keys** (SSL certificates, SSH keys)

### ✅ Как безопасно хранить секреты:

**Для local development**:
- `.env` файл (добавлен в `.gitignore`)
- Never commit `.env` в Git

**Для CI/CD**:
- **GitHub Secrets** (Settings → Secrets and variables → Actions)
- **HashiCorp Vault**
- **AWS Secrets Manager** / **GCP Secret Manager**

**В документации**:
- Использовать placeholders: `[API_KEY]`, `[DATABASE_URL]`
- Instructions как безопасно загрузить secrets

**См. подробнее**: `/infra/ci_cd.md` — раздел "Secrets Management"

---

## Placeholders в документации

Многие документы содержат placeholders, которые нужно заменить:

- `[FOUNDERS_EMAIL]` — email founders для контакта
- `[SUPPORT_EMAIL]` — email support команды
- `[PRIVACY_EMAIL]` — email для privacy вопросов
- `[COMPANY_ADDRESS]` — юридический адрес компании
- `[WEBSITE_URL]` — URL сайта
- `[API_KEY]` — placeholder для API keys (НЕ реальные keys)

**Когда заменять**:
- Перед финализацией документов для production
- НЕ заменять реальными секретами в Git (только в secure storage)

---

## Contributing

### Процесс

1. **Create branch**: `docs/your-feature-name`
2. **Make changes**: редактируйте документацию
3. **Commit**: `git commit -m "docs: add/update [description]"`
4. **Push**: `git push origin docs/your-feature-name`
5. **Pull Request**: создать PR в main branch
6. **Review**: минимум 1 approver
7. **Merge**: после approval

### PR Template

См. `.github/PULL_REQUEST_TEMPLATE.md` для шаблона PR.

---

## Contact

**Documentation Questions**: [FOUNDERS_EMAIL]  
**Technical Questions**: CTO  
**Legal Questions**: Legal Counsel (когда hired)

---

## License

См. `/license_recommendation.md` для рекомендации по лицензии.

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Documentation Team

**Next Steps**:
- [ ] Finalize all placeholder values
- [ ] Legal review (privacy policy, content policy)
- [ ] Technical review (architecture, security)
- [ ] Financial review (financial model)
- [ ] Update docs as project evolves
