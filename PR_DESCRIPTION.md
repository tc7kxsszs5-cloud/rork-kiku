# PR: docs(init): initial docs and setup for Rork-Kiku project

## 📋 Цель PR

Этот PR добавляет полную начальную структуру документации для проекта Rork-Kiku — платформы для безопасного обмена медиаконтентом между родителями и детьми с AI-модерацией.

**Все файлы являются черновиками на русском языке (UTF-8)** и требуют соответствующего ревью перед использованием в production.

---

## 📁 Добавленные файлы (22 документа)

### 1. Архитектура и техническая документация
- ✅ `docs/architecture/architecture.md` — Полная архитектура системы: слои (client, API, microservices, ML), data flow, security design, scaling strategy
- ✅ `docs/architecture/diag.svg` — Placeholder SVG диаграмма (требует замены на детальную)

### 2. MVP и спецификации
- ✅ `docs/mvp/mvp_spec.md` — Спецификация MVP для iOS TestFlight: features, user flows, API contracts, backend requirements, ML inference requirements, checklists

### 3. Материалы для инвесторов
- ✅ `docs/investors/pitch_deck.md` — Pitch deck 12-15 слайдов с полными разделами на русском + краткие английские тезисы
- ✅ `docs/investors/one_pager.md` — Одностраничный summary для быстрого ознакомления

### 4. Финансовая модель
- ✅ `docs/finance/financial_model_overview.md` — Описание 3 сценариев (консервативный/базовый/оптимистичный), unit economics, LTV/CAC
- ✅ `docs/finance/financial_model.csv` — CSV с детальными числами: year, capex, opex, team/infra/ml/moderation costs, revenue, EBITDA

### 5. План пилота
- ✅ `docs/pilot/pilot_plan.md` — Детальный pilot plan: цели, KPI (accuracy, false positives, retention, NPS), security & parental consent checklist, партнёрства, timeline, risks

### 6. Юридические документы (**ТРЕБУЮТ РЕВЬЮ ЮРИСТА**)
- ✅ `docs/legal/data_room_checklist.md` — Чеклист документов для data room (corporate, IP, contracts, financial, compliance)
- ✅ `docs/legal/content_policy.md` — Политика контента: запрещённый контент, уровни модерации (strict/moderate/relaxed), escalation rules, верификация родителей
- ✅ `docs/legal/privacy_policy_draft.md` — Черновик Privacy Policy: COPPA/GDPR compliance, data collection, rights, retention policy

### 7. Apple & iOS
- ✅ `docs/apple/testflight_instructions.md` — Полные инструкции: App ID, Bundle ID, certificates, provisioning profiles, EAS/fastlane, TestFlight setup, metadata, screenshots

### 8. Infrastructure & CI/CD
- ✅ `docs/infra/ci_cd.md` — GitHub Actions workflows (lint, iOS build, backend deploy), Terraform hints, Kubernetes/Helm deployment, secret management

### 9. Security
- ✅ `docs/security/security_design.md` — Дизайн безопасности: TLS/AES-256, KMS, key rotation, RBAC, monitoring, SIEM, incident response playbook, pentest schedule

### 10. Команда
- ✅ `docs/team/team_roles.md` — Роли и обязанности: Founders, Engineers (Mobile/Backend/ML/SRE), QA, Moderators, Legal, Finance, hiring plan

### 11. Roadmap
- ✅ `docs/roadmap/roadmap.md` — Дорожная карта 24 месяца: Q1 2026 MVP → 2028+ global scale с milestones и KPIs по кварталам

### 12. Шаблоны
- ✅ `docs/templates/outreach_templates.md` — Email templates: инвестор, партнёр/НКО, школа, journalist, с переменными для персонализации
- ✅ `docs/templates/dataroom_template.md` — Структура data room и описания разделов

### 13. Лицензия
- ✅ `docs/license_recommendation.md` — Рекомендация MIT License с обоснованием

### 14. Главный README
- ✅ `docs/README.md` — Обзор структуры docs, правила редактирования, security guidelines, инструкции по data room

### 15. Брендинг
- ✅ `docs/branding/brand-guidelines.md` — Брендбук: цвета, типографика, voice & tone, logo usage, screenshot guidelines
- ✅ `docs/branding/logo_placeholders/logo.svg` — Placeholder SVG logo
- ✅ `docs/branding/logo_placeholders/logo_color.png` — Placeholder PNG (цветной)
- ✅ `docs/branding/logo_placeholders/logo_white.png` — Placeholder PNG (белый)
- ✅ `docs/branding/logo_placeholders/README.txt` — Инструкция о замене placeholders

### 16. PR Template
- ✅ `.github/PULL_REQUEST_TEMPLATE.md` — Шаблон PR с чеклистами: цель, изменения, тесты, security, DCO signoff

### 17. .gitignore Update
- ✅ `.gitignore` — Добавлены дополнительные правила для secrets, certificates, fastlane files

---

## 🔒 Инструкции по безопасности

### ⚠️ КРИТИЧЕСКИ ВАЖНО: НИ В КОЕМ СЛУЧАЕ НЕ ДОБАВЛЯТЬ СЕКРЕТЫ!

**Что ЗАПРЕЩЕНО commit в Git:**
- ❌ `.env` files с реальными credentials
- ❌ API keys, passwords, tokens
- ❌ `.p12` certificates, `.p8` private keys, `.mobileprovision`
- ❌ PII (personally identifiable information)
- ❌ Реальные email addresses, phone numbers (только placeholders: `[FOUNDERS_EMAIL]`)

**Где хранить secrets:**
- ✅ **GitHub Secrets**: Для CI/CD workflows (EXPO_TOKEN, APPLE_ID, AWS_ACCESS_KEY_ID)
- ✅ **AWS Secrets Manager**: Для runtime secrets (database passwords, API keys)
- ✅ **HashiCorp Vault**: Для enterprise secret management
- ✅ **Local .env files**: Для local development (НЕ commit в Git!)

### Все документы используют placeholder контакт:
- `[FOUNDERS_EMAIL]` — заменяемый placeholder для email
- Все примеры API keys, secrets используют формат: `[PLACEHOLDER]`, `[API_KEY]`, `[SECRET]`

---

## 📝 Статус документов

### DRAFT — Требуют ревью:
- **Все технические документы**: Architecture, MVP spec, CI/CD → Technical review
- **Все legal документы**: Privacy Policy, Content Policy, Data Room → **ОБЯЗАТЕЛЬНЫЙ LEGAL REVIEW**
- **Financial model**: CFO review (если есть)
- **Branding**: Professional designer для actual logo и brand identity

### Готовы к использованию (с оговорками):
- Roadmap, Team Roles, Templates — можно использовать как есть, но могут обновляться

---

## ⚠️ Временная недоступность Apple Developer Account

**Примечание**: На момент создания этой документации Apple Developer Account может быть недоступен. Все инструкции в `docs/apple/testflight_instructions.md` описывают процесс для будущей настройки, когда account станет доступен.

---

## 🎯 Next Steps

### Сразу после merge:
1. ✅ **Legal review**: Отправить Privacy Policy, Content Policy, ToS юристу (специализация COPPA/GDPR)
2. ✅ **Technical review**: Архитектура и security design — review CTO или senior engineer
3. ✅ **Replace placeholders**: Actual company info, emails (но НЕ secrets!)

### Перед fundraising:
1. ✅ Обновить pitch deck с реальными traction данными (после pilot)
2. ✅ Financial model validation с CFO
3. ✅ Подготовить actual data room (следовать `docs/legal/data_room_checklist.md`)

### Перед launch:
1. ✅ Hire professional designer → Replace logo placeholders
2. ✅ Legal approval Privacy Policy & ToS
3. ✅ Setup Apple Developer Account → Follow `docs/apple/testflight_instructions.md`

---

## 📊 Статистика

- **Всего файлов создано**: 27
- **Строк документации**: ~7000+ lines (Markdown + CSV + SVG)
- **Языки**: Русский (основной) + English summaries где нужно
- **Placeholders**: Все sensitive данные заменены на `[PLACEHOLDER]` формат
- **Secrets**: 0 (zero) — никаких реальных секретов не добавлено

---

## 🚀 Ссылки

- **GitHub PR**: [LINK будет добавлен после создания PR]
- **Documentation**: `docs/README.md` — start here
- **Contact**: [FOUNDERS_EMAIL]

---

## 👥 Reviewers

**Запрос на ревью от**:
- @tc7kxsszs5-cloud (repository owner)
- Key stakeholders (founders, technical leads, legal counsel)

**Review focus areas**:
- ✅ Completeness (все 22 файла присутствуют?)
- ✅ Security (нет ли secrets в коммитах?)
- ✅ Accuracy (технические детали корректны?)
- ✅ Legal compliance (требуется lawyer review перед использованием)

---

## 📄 Disclaimer

Все документы в этом PR являются **ЧЕРНОВИКАМИ** для internal planning и investor discussions. Они:
- ✅ **НЕ содержат** production code, реальных секретов, или персональных данных
- ✅ **Используют** placeholders для sensitive information
- ✅ **Требуют** соответствующего review (technical/legal/financial) перед использованием
- ✅ **Написаны на русском** (UTF-8 encoding) как requested

---

**Thank you for reviewing this PR! Спасибо за ревью! 🎉**

**Prepared by**: GitHub Copilot  
**Date**: 2026-01-02  
**Branch**: `docs/init-setup` → `main`
