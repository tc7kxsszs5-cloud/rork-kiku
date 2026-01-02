# Документация Rork-Kiku

## Обзор

Этот каталог содержит всю документацию проекта Rork-Kiku — платформы безопасного обмена контентом для детей с AI-модерацией и родительским контролем.

---

## Структура документации

### 📐 Архитектура и технические документы
- **[architecture/](./architecture/)** — Архитектура системы, диаграммы, data flows
  - [architecture.md](./architecture/architecture.md) — Полное описание архитектуры
  - [diag.svg](./architecture/diag.svg) — Визуальная диаграмма архитектуры
- **[security/](./security/)** — Безопасность и compliance
  - [security_design.md](./security/security_design.md) — Дизайн безопасности, шифрование, KMS
- **[infra/](./infra/)** — Инфраструктура и CI/CD
  - [ci_cd.md](./infra/ci_cd.md) — GitHub Actions, Fastlane, Terraform

### 📱 Продукт и разработка
- **[mvp/](./mvp/)** — MVP спецификация
  - [mvp_spec.md](./mvp/mvp_spec.md) — Детальная спецификация MVP для пилота
- **[pilot/](./pilot/)** — План пилотного проекта
  - [pilot_plan.md](./pilot/pilot_plan.md) — Цели, KPI, партнёры, timeline
- **[roadmap/](./roadmap/)** — Дорожная карта
  - [roadmap.md](./roadmap/roadmap.md) — 24-месячная roadmap с milestones

### 💰 Инвесторы и финансы
- **[investors/](./investors/)** — Материалы для инвесторов
  - [pitch_deck.md](./investors/pitch_deck.md) — Структура pitch deck (12-15 слайдов)
  - [one_pager.md](./investors/one_pager.md) — Одностраничный summary
- **[finance/](./finance/)** — Финансовая модель
  - [financial_model_overview.md](./finance/financial_model_overview.md) — Три сценария развития
  - [financial_model.csv](./finance/financial_model.csv) — CSV с проекциями

### ⚖️ Юридические документы
- **[legal/](./legal/)** — Compliance и legal docs
  - [data_room_checklist.md](./legal/data_room_checklist.md) — Чек-лист для data room
  - [content_policy.md](./legal/content_policy.md) — Политика контента (черновик)
  - [privacy_policy_draft.md](./legal/privacy_policy_draft.md) — Privacy Policy (черновик)

### 🍎 Apple и мобильная разработка
- **[apple/](./apple/)** — iOS и TestFlight
  - [testflight_instructions.md](./apple/testflight_instructions.md) — Инструкции по TestFlight setup

### 👥 Команда и процессы
- **[team/](./team/)** — Роли и структура команды
  - [team_roles.md](./team/team_roles.md) — Описание ролей и обязанностей

### 📝 Шаблоны и вспомогательные материалы
- **[templates/](./templates/)** — Шаблоны писем и документов
  - [outreach_templates.md](./templates/outreach_templates.md) — Шаблоны для инвесторов, партнёров, школ
  - [dataroom_template.md](./templates/dataroom_template.md) — Структура data room
- **[license_recommendation.md](./license_recommendation.md)** — Рекомендации по лицензии (MIT)

### 🎨 Брендинг
- **[branding/](./branding/)** — Логотипы и brand guidelines
  - [brand-guidelines.md](./branding/brand-guidelines.md) — Гайдлайны бренда
  - [logo_placeholders/](./branding/logo_placeholders/) — Placeholder логотипы

---

## Для кого эта документация

### Для разработчиков
- Начните с [architecture/architecture.md](./architecture/architecture.md)
- Изучите [mvp/mvp_spec.md](./mvp/mvp_spec.md) для понимания продукта
- См. [infra/ci_cd.md](./infra/ci_cd.md) для CI/CD setup

### Для product team
- [mvp/mvp_spec.md](./mvp/mvp_spec.md) — Features и user flows
- [roadmap/roadmap.md](./roadmap/roadmap.md) — Планирование развития
- [pilot/pilot_plan.md](./pilot/pilot_plan.md) — План пилота

### Для founders/CEO
- [investors/pitch_deck.md](./investors/pitch_deck.md) — Pitch для инвесторов
- [finance/financial_model_overview.md](./finance/financial_model_overview.md) — Финансовые проекции
- [legal/data_room_checklist.md](./legal/data_room_checklist.md) — Подготовка к fundraising

### Для legal/compliance
- [legal/privacy_policy_draft.md](./legal/privacy_policy_draft.md) — Privacy Policy
- [legal/content_policy.md](./legal/content_policy.md) — Content moderation policy
- [security/security_design.md](./security/security_design.md) — Security compliance

---

## Редактирование и внесение изменений

### Формат документов

Все документы в **Markdown** формате для:
- ✅ Легкости редактирования (plain text)
- ✅ Version control (Git diff)
- ✅ Экспорта в другие форматы (PDF, HTML)
- ✅ Readable на GitHub

### Как редактировать

1. **Найдите нужный файл** в структуре выше
2. **Откройте в текстовом редакторе** (VS Code, Sublime, и т.д.)
3. **Внесите изменения** в Markdown
4. **Commit и push** к репозиторию

```bash
# Example workflow
git checkout -b docs/update-mvp-spec
# Edit docs/mvp/mvp_spec.md
git add docs/mvp/mvp_spec.md
git commit -m "Update MVP spec with new features"
git push origin docs/update-mvp-spec
# Create PR
```

### Best Practices

**Do:**
- ✅ Используйте clear headers (##, ###)
- ✅ Добавляйте links между документами
- ✅ Обновляйте dates при significant changes
- ✅ Оставляйте комментарии о placeholders (e.g., [PLACEHOLDER])
- ✅ Используйте checklists (- [ ]) для TODO items

**Don't:**
- ❌ Не добавляйте реальные секреты (используйте [PLACEHOLDER])
- ❌ Не добавляйте персональные данные
- ❌ Не коммитьте binary файлы (large PDFs, и т.д.) — используйте Git LFS
- ❌ Не удаляйте важные sections без discussion

### Markdown Tips

**Headers:**
```markdown
# H1 — Главный заголовок
## H2 — Секция
### H3 — Подсекция
```

**Lists:**
```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

**Links:**
```markdown
[Text to display](./relative/path/to/file.md)
[External link](https://example.com)
```

**Code blocks:**
```markdown
\`\`\`javascript
const code = "example";
\`\`\`
```

**Tables:**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
```

**Checklists:**
```markdown
- [ ] TODO item
- [x] Completed item
```

---

## Экспорт документов

### В PDF
Для презентаций или отправки инвесторам:

**Using Pandoc:**
```bash
pandoc docs/investors/pitch_deck.md -o pitch_deck.pdf
```

**Using VS Code:**
- Install "Markdown PDF" extension
- Right-click на .md file → "Markdown PDF: Export (pdf)"

**Using online tools:**
- [Dillinger.io](https://dillinger.io/) — online Markdown editor с export
- [StackEdit](https://stackedit.io/)

### В PowerPoint/Google Slides
Для pitch decks:
1. Export to PDF (см. выше)
2. Импортировать PDF в PowerPoint/Slides
3. Или manually recreate slides с branding

---

## Maintenance и Updates

### Регулярные обновления

**Monthly:**
- [ ] Update metrics в [roadmap/roadmap.md](./roadmap/roadmap.md)
- [ ] Update financials в [finance/](./finance/)
- [ ] Review и update [mvp/mvp_spec.md](./mvp/mvp_spec.md) based на progress

**Quarterly:**
- [ ] Review всех legal documents для compliance changes
- [ ] Update [team/team_roles.md](./team/team_roles.md) при team changes
- [ ] Review [security/security_design.md](./security/security_design.md) для new threats

**As needed:**
- [ ] Update [investors/pitch_deck.md](./investors/pitch_deck.md) перед fundraising
- [ ] Update [pilot/pilot_plan.md](./pilot/pilot_plan.md) при pilot changes
- [ ] Create new documents при необходимости

### Version Control

**Document versions:**
- Используйте Git для tracking changes
- Major updates: упоминайте в commit message
- Keep changelog в header документа (опционально)

**Example changelog в документе:**
```markdown
## Changelog
- **v1.1** (2026-03-15): Added new features X, Y
- **v1.0** (2026-01-15): Initial version
```

---

## Placeholders и Sensitive Data

### Placeholders используемые в документах:

- `[FOUNDERS_EMAIL]` — email founders
- `[COMPANY ADDRESS]` — юридический адрес
- `[PHONE NUMBER]` — контактный телефон
- `[PLACEHOLDER]` — generic placeholder
- `[ДАТА]` — дата для заполнения

### Важно: Безопасность

**Никогда не добавляйте в документацию:**
- ❌ Реальные секреты (API keys, passwords)
- ❌ Credentials (Apple Developer, AWS keys)
- ❌ Персональные данные пользователей
- ❌ Конфиденциальную financial information (actual bank accounts, и т.д.)

**Используйте placeholders вместо:**
```markdown
**Database URL:** [USE GITHUB SECRETS - не коммитить]
**Apple ID:** [PLACEHOLDER - store в GitHub Secrets]
```

---

## Contribution Guidelines

### Для internal team:

1. **Create branch** для changes:
   ```bash
   git checkout -b docs/your-update-description
   ```

2. **Make changes** в соответствующих файлах

3. **Commit с clear message:**
   ```bash
   git commit -m "docs: update MVP spec with payment integration"
   ```

4. **Push и create PR:**
   ```bash
   git push origin docs/your-update-description
   ```

5. **Request review** от relevant stakeholders

### Для external contributors (если open-source):

1. Fork репозиторий
2. Make changes в вашем fork
3. Submit Pull Request с описанием changes
4. Await review

---

## Дополнительные ресурсы

### Markdown Editors
- **VS Code** — best for developers (с extensions)
- **Typora** — WYSIWYG Markdown editor
- **iA Writer** — minimal, distraction-free
- **Obsidian** — для знаний management с linking

### Markdown Guides
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown](https://guides.github.com/features/mastering-markdown/)

### Documentation Best Practices
- [Write the Docs](https://www.writethedocs.org/)
- [Documentation Guide](https://www.writethedocs.org/guide/)

---

## Contact

Для вопросов о документации:
- **Email:** [TEAM_EMAIL] [PLACEHOLDER]
- **Slack:** #docs channel (если есть)
- **GitHub Issues:** создайте issue с label `documentation`

---

## License

Эта документация является частью проекта Rork-Kiku и лицензирована под MIT License. См. [LICENSE](../LICENSE) для деталей.

---

**Последнее обновление:** 2026-01-02  
**Maintained by:** Rork-Kiku Team
