# Data Room Checklist — Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT для due diligence preparation
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Введение

Этот документ содержит чеклист всех документов, которые должны быть подготовлены для data room в процессе fundraising (Seed, Series A) и due diligence инвесторами, партнёрами, или потенциальными acquirers.

**Статус документов**:
- ✅ Готов и актуален
- ⏳ В процессе подготовки
- ❌ Не начат / требуется создание
- 🔒 Конфиденциально (restricted access)

---

## 2. Corporate Documents (Учредительные документы)

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Certificate of Incorporation** | ❌ | Свидетельство о регистрации компании | `legal/corporate/certificate_of_incorporation.pdf` |
| **Bylaws / Charter** | ❌ | Устав компании | `legal/corporate/bylaws.pdf` |
| **Cap Table** | ❌ | Структура капитала (shareholders, shares, options) | `legal/corporate/cap_table.xlsx` |
| **Board Resolutions** | ❌ | Протоколы заседаний совета директоров | `legal/corporate/board_resolutions/` |
| **Shareholder Agreements** | ❌ | Соглашения между акционерами | `legal/corporate/shareholder_agreements/` |
| **Stock Option Plan** | ❌ | План опционов для сотрудников (ESOP) | `legal/corporate/stock_option_plan.pdf` |
| **Founder Vesting Agreements** | ❌ | Соглашения о vesting для founders | `legal/corporate/founder_vesting/` |

**Примечание**: Если компания ещё не зарегистрирована, начать с Delaware C-Corp (стандарт для US tech startups) или консультация с lawyer.

---

## 3. Intellectual Property (IP)

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **IP Assignment Agreements** | ❌ | Передача IP прав от founders/contractors | `legal/ip/ip_assignments/` |
| **Trademark Registrations** | ❌ | Регистрация товарных знаков (если есть) | `legal/ip/trademarks/` |
| **Patent Applications** | ❌ | Патентные заявки (если планируются) | `legal/ip/patents/` |
| **Open Source Licenses** | ⏳ | Список используемых OSS библиотек и их лицензии | `legal/ip/oss_licenses.md` |
| **Third-Party Licenses** | ❌ | Лицензии на third-party software/APIs | `legal/ip/third_party_licenses/` |
| **Domain Registrations** | ❌ | Регистрация доменов (rork-kiku.com, etc.) | `legal/ip/domains.md` |

**Action Items**:
- Все founders и contractors должны подписать IP assignment agreements
- Review OSS licenses (MIT, Apache OK; GPL requires attention)
- Register trademark "Rork-Kiku" (US, EU)

---

## 4. Privacy & Compliance

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Privacy Policy** | ⏳ | Черновик в `docs/legal/privacy_policy_draft.md` | `legal/privacy/privacy_policy.pdf` |
| **Terms of Service** | ❌ | Пользовательское соглашение | `legal/privacy/terms_of_service.pdf` |
| **COPPA Compliance Plan** | ❌ | План соответствия COPPA (Children's Online Privacy Protection Act) | `legal/privacy/coppa_compliance.pdf` |
| **GDPR Compliance Plan** | ❌ | План соответствия GDPR (для EU users) | `legal/privacy/gdpr_compliance.pdf` |
| **Data Processing Agreement (DPA)** | ❌ | DPA для subprocessors (AWS, third-party vendors) | `legal/privacy/dpa_templates/` |
| **Data Protection Impact Assessment (DPIA)** | ❌ | DPIA для high-risk processing (ML на детских данных) | `legal/privacy/dpia.pdf` |
| **Cookie Policy** | ❌ | Политика использования cookies (если web app) | `legal/privacy/cookie_policy.pdf` |
| **Consent Forms** | ❌ | Формы согласия родителей (parental consent) | `legal/privacy/consent_forms/` |

**Critical for launch**: Privacy Policy, Terms of Service, Parental Consent — reviewed by lawyer.

---

## 5. Security & Risk

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Security Design Document** | ⏳ | См. `docs/security/security_design.md` | `legal/security/security_design.pdf` |
| **Penetration Test Reports** | ❌ | Отчёты от external pentest vendors | `legal/security/pentest_reports/` |
| **Security Audit Reports** | ❌ | Внутренние или external security audits | `legal/security/audit_reports/` |
| **Vulnerability Disclosure Policy** | ❌ | Процесс reporting security vulnerabilities | `legal/security/vuln_disclosure_policy.md` |
| **Incident Response Plan** | ⏳ | См. `docs/security/security_design.md` | `legal/security/incident_response_plan.pdf` |
| **Disaster Recovery Plan** | ❌ | План восстановления после катастроф | `legal/security/disaster_recovery.pdf` |
| **Business Continuity Plan** | ❌ | План обеспечения бизнес-непрерывности | `legal/security/business_continuity.pdf` |
| **Insurance Policies** | ❌ | Cyber insurance, D&O insurance | `legal/security/insurance_policies/` |

**Recommended**: Penetration test перед launch, security audit перед Series A.

---

## 6. Contracts & Agreements

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Employment Agreements** | ❌ | Договоры с сотрудниками | `legal/contracts/employment/` |
| **Contractor Agreements** | ❌ | Договоры с подрядчиками (freelancers, agencies) | `legal/contracts/contractors/` |
| **Advisor Agreements** | ❌ | Договоры с advisors (equity, compensation) | `legal/contracts/advisors/` |
| **Investor Agreements** | ❌ | SAFE, convertible notes, equity agreements | `legal/contracts/investors/` |
| **Partnership Agreements** | ❌ | Договоры с школами, НКО, B2B partners | `legal/contracts/partnerships/` |
| **Vendor Agreements** | ❌ | Договоры с vendors (AWS, third-party APIs) | `legal/contracts/vendors/` |
| **NDA Templates** | ❌ | Mutual and one-way NDA templates | `legal/contracts/nda_templates/` |

---

## 7. Financial Documents

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Financial Model** | ⏳ | См. `docs/finance/financial_model.csv` | `financial/financial_model.xlsx` |
| **Bank Statements** | 🔒 | Последние 6-12 месяцев (for due diligence) | `financial/bank_statements/` |
| **Cap Table** | ❌ | Актуальная cap table с опционами | `financial/cap_table.xlsx` |
| **Pitch Deck** | ⏳ | См. `docs/investors/pitch_deck.md` | `fundraising/pitch_deck.pdf` |
| **One-Pager** | ⏳ | См. `docs/investors/one_pager.md` | `fundraising/one_pager.pdf` |
| **Budget & Burn Rate** | ❌ | Ежемесячный бюджет и burn rate | `financial/budget.xlsx` |
| **Revenue Reports** | ❌ | Monthly/quarterly revenue (если есть) | `financial/revenue_reports/` |
| **Tax Returns** | ❌ | Налоговые декларации (если подавались) | `financial/tax_returns/` |

---

## 8. Product & Technology

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Architecture Documentation** | ⏳ | См. `docs/architecture/architecture.md` | `product/architecture.pdf` |
| **MVP Specification** | ⏳ | См. `docs/mvp/mvp_spec.md` | `product/mvp_spec.pdf` |
| **Product Roadmap** | ⏳ | См. `docs/roadmap/roadmap.md` | `product/roadmap.pdf` |
| **User Research Reports** | ❌ | Interviews, surveys, usability tests | `product/user_research/` |
| **Analytics Dashboard** | ❌ | Key metrics dashboard (screenshots or access) | `product/analytics/` |
| **Code Repository Access** | 🔒 | Read-only access to GitHub (due diligence) | `product/github_access.md` |
| **API Documentation** | ❌ | Public API docs (если планируется) | `product/api_docs/` |
| **Tech Stack Overview** | ⏳ | См. `docs/architecture/architecture.md` | `product/tech_stack.md` |

---

## 9. Marketing & GTM

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **GTM Strategy** | ⏳ | См. `docs/investors/pitch_deck.md` (слайд 8) | `marketing/gtm_strategy.pdf` |
| **Marketing Plan** | ❌ | Детальный plan (channels, budget, timeline) | `marketing/marketing_plan.pdf` |
| **Content Calendar** | ❌ | Editorial calendar для blog, social media | `marketing/content_calendar.xlsx` |
| **Brand Guidelines** | ⏳ | См. `docs/branding/brand-guidelines.md` | `marketing/brand_guidelines.pdf` |
| **Press Coverage** | ❌ | Links to press mentions, articles | `marketing/press_coverage.md` |
| **Case Studies** | ❌ | Success stories from pilot users | `marketing/case_studies/` |
| **Website Analytics** | ❌ | Google Analytics reports (если сайт есть) | `marketing/website_analytics/` |

---

## 10. Customer & Operations

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Customer List** | 🔒 | List of paying customers (anonymized for pitch) | `customers/customer_list.xlsx` |
| **Customer Testimonials** | ❌ | Quotes, video testimonials | `customers/testimonials/` |
| **Support Tickets** | ❌ | Summary of support requests and resolutions | `operations/support_tickets/` |
| **SLAs** | ❌ | Service Level Agreements (если B2B) | `operations/slas/` |
| **Operational Playbooks** | ❌ | Runbooks для common operations | `operations/playbooks/` |

---

## 11. Legal & Regulatory

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Legal Opinion Letters** | ❌ | Письма от lawyer (compliance, IP, etc.) | `legal/opinion_letters/` |
| **Regulatory Filings** | ❌ | FTC, FCC, state registrations (если требуется) | `legal/regulatory/` |
| **Litigation History** | ✅ | None (новая компания) | `legal/litigation/` |
| **Insurance Policies** | ❌ | General liability, cyber, D&O | `legal/insurance/` |

---

## 12. HR & Team

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Team Roster** | ⏳ | См. `docs/team/team_roles.md` | `hr/team_roster.xlsx` |
| **Org Chart** | ❌ | Organizational structure | `hr/org_chart.pdf` |
| **Resumes / CVs** | 🔒 | Founders and key employees | `hr/resumes/` |
| **Employee Handbook** | ❌ | Company policies, code of conduct | `hr/employee_handbook.pdf` |
| **Option Grants** | ❌ | Stock option grants log | `hr/option_grants.xlsx` |

---

## 13. Pilot & Traction

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **Pilot Plan** | ⏳ | См. `docs/pilot/pilot_plan.md` | `traction/pilot_plan.pdf` |
| **Pilot Results** | ❌ | Metrics, feedback, case studies | `traction/pilot_results.pdf` |
| **User Growth Charts** | ❌ | DAU/MAU graphs, retention curves | `traction/user_growth/` |
| **Letter of Intent (LOI)** | ❌ | LOI from pilot partners (schools, NGOs) | `traction/loi/` |
| **Partnership MOUs** | ❌ | Memorandum of Understanding с partners | `traction/partnership_mous/` |

---

## 14. Miscellaneous

| Документ | Статус | Описание | Расположение |
|----------|--------|----------|--------------|
| **FAQ for Investors** | ❌ | Frequently asked questions + answers | `misc/investor_faq.md` |
| **Competitive Analysis** | ❌ | Detailed competitive landscape | `misc/competitive_analysis.pdf` |
| **Market Research** | ❌ | TAM/SAM/SOM analysis, sources | `misc/market_research.pdf` |
| **Technology Demo** | ❌ | Video demo или live demo access | `misc/demo_video.mp4` |

---

## 15. Access & Organization

### Virtual Data Room Tools
**Recommended platforms**:
- **DocSend** (YC-backed, popular с VCs): Tracking, analytics, permissions
- **Google Drive** (простой, но менее secure): Folders с permissions
- **Notion** (более structured): Database views
- **Dropbox Business**: Enterprise-grade file sharing

### Folder Structure (Пример)
```
/DataRoom-RorkKiku-2026/
├── 01_Corporate/
│   ├── Certificate_of_Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Cap_Table.xlsx
│   └── Board_Resolutions/
├── 02_IP/
│   ├── IP_Assignments/
│   ├── Trademarks/
│   └── OSS_Licenses.md
├── 03_Privacy_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── COPPA_Compliance.pdf
│   └── GDPR_Compliance.pdf
├── 04_Security/
│   ├── Security_Design.pdf
│   ├── Pentest_Reports/
│   └── Incident_Response_Plan.pdf
├── 05_Contracts/
│   ├── Employment_Agreements/
│   ├── Investor_Agreements/
│   └── Partnership_Agreements/
├── 06_Financial/
│   ├── Financial_Model.xlsx
│   ├── Bank_Statements/ (restricted)
│   └── Budget.xlsx
├── 07_Product_Tech/
│   ├── Architecture.pdf
│   ├── MVP_Spec.pdf
│   ├── Roadmap.pdf
│   └── User_Research/
├── 08_Marketing/
│   ├── GTM_Strategy.pdf
│   ├── Brand_Guidelines.pdf
│   └── Press_Coverage.md
├── 09_Traction/
│   ├── Pilot_Plan.pdf
│   ├── Pilot_Results.pdf
│   └── LOI/
└── 10_Team/
    ├── Team_Roster.xlsx
    ├── Org_Chart.pdf
    └── Resumes/ (restricted)
```

### Access Levels
- **Level 1 (Public)**: Pitch deck, one-pager, product demo
- **Level 2 (NDA required)**: Financial model, architecture, competitive analysis
- **Level 3 (Serious investors only)**: Cap table, contracts, bank statements, code repository

---

## 16. Next Steps

### Pre-Seed / Seed Fundraising
**Priority documents** (создать до первого investor meeting):
1. ✅ Pitch Deck (`docs/investors/pitch_deck.md`)
2. ✅ One-Pager (`docs/investors/one_pager.md`)
3. ✅ Financial Model (`docs/finance/financial_model.csv`)
4. ⏳ MVP Spec (`docs/mvp/mvp_spec.md`)
5. ❌ Privacy Policy & ToS (lawyer review)
6. ❌ IP Assignment Agreements (founders sign)

**Timeline**: 2-4 weeks для подготовки core documents.

### Series A Fundraising
**Additional requirements**:
- Proven traction (pilot results, user growth)
- Audited financials (если revenue > $500K)
- Security audit / pentest report
- Complete contracts folder
- Customer references

**Timeline**: 1-2 months для full data room.

---

## 17. Контакты

- **Data Room Coordinator**: [FOUNDERS_EMAIL]
- **Legal Counsel**: [LAW_FIRM_NAME — TBD]
- **Accounting**: [ACCOUNTANT_NAME — TBD]

---

**DISCLAIMER**: Этот чеклист — шаблон для подготовки data room. Фактический список документов может варьироваться в зависимости от investor requirements и stage компании. Консультируйтесь с lawyer перед предоставлением sensitive documents.
