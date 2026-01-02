# Data Room Template — kiku

## Структура Data Room

Организация файлов для due diligence инвесторов. Используйте эту структуру для создания вашего data room в Google Drive, Dropbox, или DocSend.

---

## Root Structure

```
📁 kiku-dataroom/
├── 📄 README.md (этот файл)
├── 📄 INDEX.md (список всех документов)
├── 📁 1-company/
├── 📁 2-product/
├── 📁 3-financials/
├── 📁 4-legal/
├── 📁 5-team/
├── 📁 6-traction/
├── 📁 7-technical/
└── 📁 8-market/
```

---

## 1-company/ (Информация о компании)

```
📁 1-company/
├── 📄 certificate_of_incorporation.pdf
├── 📄 articles_of_association.pdf
├── 📄 shareholder_agreement.pdf (если есть)
├── 📄 cap_table.xlsx
├── 📄 board_minutes/ (папка с протоколами)
│   ├── 2023-12-01_board_meeting.pdf
│   └── 2024-01-15_board_meeting.pdf
└── 📄 founder_agreement.pdf
```

**Описание:**
- Юридические документы компании
- Структура ownership
- Корпоративное управление

---

## 2-product/ (Продукт)

```
📁 2-product/
├── 📄 product_deck.pdf (10-15 слайдов о продукте)
├── 📄 product_roadmap.pdf (12-24 месяца, из docs/roadmap/)
├── 📄 feature_list.xlsx
├── 📄 user_guide.pdf
├── 📄 demo_video.mp4 (или link на YouTube/Loom)
├── 📁 screenshots/
│   ├── home_screen.png
│   ├── chat_detail.png
│   ├── alerts.png
│   ├── parental_controls.png
│   └── statistics.png
└── 📁 user_flows/
    ├── onboarding_flow.pdf
    └── sos_flow.pdf
```

**Описание:**
- Визуализация продукта
- User flows и experience
- Roadmap и планы развития

---

## 3-financials/ (Финансы)

```
📁 3-financials/
├── 📄 financial_model.xlsx (3-5 лет, 3 сценария)
├── 📄 financial_assumptions.pdf (из docs/finance/financial_model_overview.md)
├── 📄 unit_economics.xlsx (CAC, LTV, ARPU, churn)
├── 📄 cap_table_current.xlsx
├── 📄 cap_table_pro_forma.xlsx (после раунда)
├── 📄 use_of_funds.pdf
├── 📁 historical_financials/ (если есть)
│   ├── 2023_income_statement.pdf
│   ├── 2023_balance_sheet.pdf
│   └── 2023_cash_flow.pdf
└── 📄 burn_rate_analysis.xlsx
```

**Описание:**
- Финансовая модель и проекции
- Historical financials (если есть)
- Unit economics и метрики

---

## 4-legal/ (Юридические документы)

```
📁 4-legal/
├── 📁 compliance/
│   ├── privacy_policy.pdf (из docs/legal/)
│   ├── terms_of_service.pdf
│   ├── content_policy.pdf (из docs/legal/)
│   ├── coppa_compliance.pdf
│   ├── gdpr_compliance.pdf
│   └── dpia.pdf (Data Protection Impact Assessment)
├── 📁 intellectual_property/
│   ├── trademark_registrations.pdf (если есть)
│   ├── patent_applications.pdf (если есть)
│   ├── domain_ownership.pdf
│   ├── open_source_licenses.xlsx
│   └── ip_assignment_agreements/ (от сотрудников)
├── 📁 contracts/
│   ├── vendor_agreements/
│   │   ├── openai_agreement.pdf
│   │   ├── aws_agreement.pdf
│   │   └── stripe_agreement.pdf
│   ├── partnership_agreements/ (школы, НКО)
│   ├── ndas/ (папка с NDA)
│   └── customer_agreement_template.pdf (B2B)
└── 📁 litigation/
    └── no_litigation.txt (или описание если есть)
```

**Описание:**
- Compliance документы
- IP и contracts
- Litigation history

---

## 5-team/ (Команда)

```
📁 5-team/
├── 📄 team_bios.pdf (LinkedIn profiles)
├── 📄 org_chart.pdf
├── 📄 roles_responsibilities.pdf (из docs/team/team_roles.md)
├── 📄 advisors_list.pdf
├── 📁 employment/
│   ├── employment_agreements/ (redacted)
│   ├── consultant_agreements/
│   ├── equity_plan.pdf (ESOP)
│   └── vesting_schedules.xlsx
└── 📄 compensation_summary.xlsx (salaries, equity)
```

**Описание:**
- Team members и их background
- Compensation и equity structure

---

## 6-traction/ (Достижения)

```
📁 6-traction/
├── 📄 key_metrics_dashboard.pdf
├── 📄 cohort_analysis.xlsx
├── 📁 growth_charts/
│   ├── users_growth.png
│   ├── mrr_growth.png
│   └── retention_curve.png
├── 📄 funnel_analysis.xlsx
├── 📁 customer_data/ (anonymized)
│   ├── customer_list_anonymized.xlsx
│   ├── testimonials.pdf
│   ├── case_studies.pdf
│   └── nps_score.pdf
└── 📁 pilot_results/
    ├── pilot_report.pdf (из docs/pilot/)
    ├── pilot_survey_results.xlsx
    └── user_feedback_summary.pdf
```

**Описание:**
- Метрики роста
- Customer feedback и testimonials
- Pilot results

---

## 7-technical/ (Техническая информация)

```
📁 7-technical/
├── 📁 architecture/
│   ├── architecture_diagram.pdf (из docs/architecture/)
│   ├── tech_stack.xlsx
│   ├── third_party_services.xlsx
│   └── sla_agreements.pdf (с провайдерами)
├── 📁 code/
│   ├── github_repo_access.txt (read-only link)
│   ├── code_quality_report.pdf (SonarQube, CodeClimate)
│   └── test_coverage.pdf
├── 📁 security/
│   ├── security_audit_report.pdf (если проводился)
│   ├── pentest_report.pdf (если проводился)
│   ├── vulnerability_disclosures.pdf
│   ├── incident_history.pdf (если были)
│   └── backup_dr_plan.pdf
└── 📄 ci_cd_pipeline.pdf (из docs/infra/ci_cd.md)
```

**Описание:**
- Technical architecture
- Code quality и security
- DevOps процессы

---

## 8-market/ (Рынок)

```
📁 8-market/
├── 📄 market_size_report.pdf (TAM/SAM/SOM analysis)
├── 📄 market_research.pdf (Gartner, IDC reports)
├── 📄 competitive_analysis.pdf (из docs/investors/pitch_deck.md)
├── 📄 positioning_map.pdf (2x2 matrix)
├── 📁 go_to_market/
│   ├── gtm_strategy.pdf
│   ├── marketing_plan.pdf (12 месяцев)
│   ├── sales_playbook.pdf (B2B)
│   └── pricing_strategy.pdf
└── 📁 press_media/
    ├── press_releases/ (если были)
    ├── media_coverage/ (статьи)
    └── awards.pdf (если есть)
```

**Описание:**
- Market analysis
- GTM strategy
- Press и media

---

## INDEX.md (Master list)

```markdown
# kiku Data Room Index

**Last Updated:** [DATE]  
**Version:** 1.0

## Quick Links

- [Company Overview](#1-company)
- [Product](#2-product)
- [Financials](#3-financials)
- [Legal](#4-legal)
- [Team](#5-team)
- [Traction](#6-traction)
- [Technical](#7-technical)
- [Market](#8-market)

## Documents by Category

### 1. Company (10 documents)
1. Certificate of Incorporation - `1-company/certificate_of_incorporation.pdf`
2. Articles of Association - `1-company/articles_of_association.pdf`
...

### 2. Product (12 documents)
1. Product Deck - `2-product/product_deck.pdf`
2. Demo Video - `2-product/demo_video.mp4`
...

[Continue for all categories]

## Access Instructions

**For investors:** Request access via [FOUNDERS_EMAIL]  
**NDA Required:** Yes, before accessing sections 3-7  
**Support:** dataroom@kiku-app.com
```

---

## README.md (Root)

```markdown
# kiku Data Room

Welcome to the kiku data room for due diligence.

## Structure

This data room is organized into 8 main sections:

1. **Company** — Corporate documents, cap table
2. **Product** — Product overview, roadmap, screenshots
3. **Financials** — Financial model, unit economics
4. **Legal** — Compliance, IP, contracts
5. **Team** — Team bios, org chart, compensation
6. **Traction** — Metrics, customer data, pilot results
7. **Technical** — Architecture, code, security
8. **Market** — Market analysis, GTM strategy

## Access Levels

- **Public:** Pitch deck, one-pager
- **NDA Signed:** Financials, traction (sections 3, 6)
- **Serious Investors:** Full data room (all sections)
- **Legal DD:** Legal documents (section 4)

## How to Navigate

1. Start with `INDEX.md` for full list of documents
2. Each folder has its own README with descriptions
3. Use search (Ctrl+F) to find specific documents

## Questions?

**Contact:** [FOUNDERS_EMAIL]  
**Support:** dataroom@kiku-app.com

---

**Confidential** — For authorized investors only  
**Version:** 1.0 | **Date:** [DATE]
```

---

## Access Control Matrix

| Section | Public | NDA Signed | Serious Investors | Legal DD |
|---------|--------|------------|-------------------|----------|
| 1. Company | ✗ | ✗ | ✓ | ✓ |
| 2. Product | ✓ (limited) | ✓ | ✓ | ✓ |
| 3. Financials | ✗ | ✓ | ✓ | ✓ |
| 4. Legal | ✗ | ✗ | ✗ | ✓ |
| 5. Team | ✓ (bios) | ✓ | ✓ | ✓ |
| 6. Traction | ✗ | ✓ | ✓ | ✓ |
| 7. Technical | ✗ | ✗ | ✓ | ✓ |
| 8. Market | ✓ (summary) | ✓ | ✓ | ✓ |

---

## Best Practices

### Naming Conventions

```
✅ Good: financial_model_2024_01_01_v2.xlsx
✅ Good: cap_table_pro_forma_500k_round.xlsx
✅ Good: pilot_results_final.pdf

❌ Bad: model.xlsx
❌ Bad: document (1).pdf
❌ Bad: final_FINAL_v3_real_final.pdf
```

### Version Control

- Include date in filename: `YYYY_MM_DD`
- Use v1, v2, v3 for versions
- Archive old versions in `archive/` subfolder

### Redaction

- Redact SSN, credit card numbers, passwords
- Use [REDACTED] placeholder
- Explain why redacted in notes

### Updates

- Update INDEX.md when adding documents
- Send changelog to investors who have access
- Version data room (v1.0, v1.1, v2.0)

---

## Tools

**Recommended platforms:**
1. **Google Drive** — Free, easy sharing
2. **Dropbox** — Professional, activity tracking
3. **DocSend** — Investor-focused, detailed analytics
4. **Notion** — Modern, flexible
5. **Capshare/Carta** — For cap table management

**Tracking:**
- Track who accessed what (DocSend excels at this)
- Monitor time spent on each document
- See which documents are most viewed

---

## Maintenance Schedule

- **Weekly:** Update traction metrics (users, MRR)
- **Monthly:** Update financials, burn rate
- **Quarterly:** Review and refresh all sections
- **Before fundraising:** Complete audit of all documents

---

**Статус:** Template для создания data room  
**Последнее обновление:** Январь 2024
