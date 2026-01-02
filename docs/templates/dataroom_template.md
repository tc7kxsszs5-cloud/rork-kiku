# Data Room Template Structure

## Обзор

Данный документ описывает рекомендуемую структуру data room для due diligence.

**Платформа:** Dropbox, Google Drive (с restricted access), или специализированные VDR (Virtual Data Room) сервисы: Carta Data Room, Capshare, DocSend.

---

## Структура папок

```
/RorkKiku_DataRoom/
├── 00_INDEX.md                         # Этот файл — содержание
├── 01_Executive_Summary/
│   ├── one_pager.pdf
│   ├── pitch_deck.pdf
│   └── executive_summary.pdf
├── 02_Corporate/
│   ├── Incorporation/
│   │   ├── articles_of_incorporation.pdf
│   │   ├── charter.pdf
│   │   ├── registration_certificate.pdf
│   │   └── tax_registration.pdf
│   ├── CapTable/
│   │   ├── cap_table_current.xlsx
│   │   ├── cap_table_fully_diluted.xlsx
│   │   └── shareholder_list.pdf
│   ├── Board/
│   │   ├── board_composition.pdf
│   │   ├── board_meeting_minutes_[DATE].pdf
│   │   └── ...
│   └── Governance/
│       ├── shareholders_agreement.pdf
│       ├── vesting_agreements/
│       │   ├── founder_vesting_[NAME].pdf
│       │   └── ...
│       └── bylaws.pdf
├── 03_Financial/
│   ├── Statements/
│   │   ├── income_statement_[YEAR].xlsx
│   │   ├── balance_sheet_[YEAR].xlsx
│   │   ├── cash_flow_statement_[YEAR].xlsx
│   │   └── quarterly/
│   ├── Budgets_and_Forecasts/
│   │   ├── financial_model.xlsx
│   │   ├── assumptions_document.pdf
│   │   └── sensitivity_analysis.xlsx
│   ├── Audits/
│   │   ├── audit_report_[YEAR].pdf
│   │   └── management_letter_[YEAR].pdf
│   ├── Tax/
│   │   ├── tax_return_[YEAR].pdf
│   │   └── tax_compliance_certificate.pdf
│   └── Banking/
│       ├── bank_statements_[YEAR]/
│       └── loan_agreements.pdf
├── 04_Investments/
│   ├── Previous_Rounds/
│   │   ├── pre_seed/
│   │   │   ├── term_sheet.pdf
│   │   │   ├── investment_agreement.pdf
│   │   │   └── closing_documents/
│   │   └── seed/
│   │       └── ...
│   ├── Current_Round/
│   │   ├── term_sheet_draft.pdf
│   │   ├── investor_deck.pdf
│   │   └── FAQ_for_investors.pdf
│   └── Investor_Rights/
│       ├── investor_rights_agreement.pdf
│       └── board_observer_rights.pdf
├── 05_IP/
│   ├── Assignments/
│   │   ├── founder_ip_assignment_[NAME].pdf
│   │   ├── employee_ip_assignments/
│   │   └── contractor_ip_assignments/
│   ├── Registrations/
│   │   ├── trademark_registration.pdf
│   │   ├── patent_applications.pdf
│   │   └── copyright_registrations.pdf
│   ├── Domains/
│   │   └── domain_list.xlsx
│   └── Open_Source/
│       ├── open_source_compliance_report.pdf
│       └── dependency_list.xlsx
├── 06_Legal/
│   ├── Privacy/
│   │   ├── privacy_policy.pdf
│   │   ├── terms_of_service.pdf
│   │   ├── cookie_policy.pdf
│   │   └── data_processing_agreement.pdf
│   ├── Compliance/
│   │   ├── gdpr_compliance_documentation.pdf
│   │   ├── coppa_compliance_documentation.pdf
│   │   ├── dpia_data_protection_impact_assessment.pdf
│   │   └── dpo_appointment_letter.pdf
│   ├── Security/
│   │   ├── security_design.pdf
│   │   ├── security_audit_reports/
│   │   ├── penetration_test_reports/
│   │   └── incident_response_plan.pdf
│   ├── Moderation/
│   │   ├── content_moderation_policy.pdf
│   │   ├── moderator_training_materials.pdf
│   │   └── moderation_accuracy_reports.pdf
│   ├── Litigation/
│   │   ├── litigation_list.pdf (or "None" statement)
│   │   └── insurance_policies.pdf
│   └── Regulatory/
│       └── regulatory_correspondence.pdf
├── 07_Contracts/
│   ├── Customers/
│   │   ├── standard_terms.pdf
│   │   ├── enterprise_agreement_template.pdf
│   │   ├── pilot_agreements/
│   │   └── customer_list.xlsx
│   ├── Vendors/
│   │   ├── aws_contract.pdf
│   │   ├── saas_subscriptions_list.xlsx
│   │   ├── ml_api_agreements.pdf
│   │   └── payment_processor_agreement.pdf
│   ├── Partnerships/
│   │   ├── school_partnership_agreements/
│   │   ├── ngo_partnership_agreements/
│   │   └── content_provider_agreements/
│   └── Employment/
│       ├── employment_contracts/
│       ├── contractor_agreements/
│       ├── advisor_agreements/
│       └── nda_list.xlsx
├── 08_Operations/
│   ├── Team/
│   │   ├── org_chart.pdf
│   │   ├── employee_list.xlsx
│   │   ├── compensation_bands.pdf
│   │   └── employee_handbook.pdf
│   ├── Product/
│   │   ├── product_roadmap.pdf
│   │   ├── mvp_specification.pdf
│   │   ├── technical_architecture.pdf
│   │   └── api_documentation.pdf
│   └── Metrics/
│       ├── key_metrics_dashboard.pdf
│       ├── user_metrics.xlsx
│       └── financial_kpis.xlsx
├── 09_Marketing/
│   ├── Brand/
│   │   ├── brand_guidelines.pdf
│   │   ├── logo_files/
│   │   └── marketing_materials/
│   ├── Strategy/
│   │   ├── marketing_plan.pdf
│   │   ├── customer_acquisition_strategy.pdf
│   │   └── marketing_metrics.xlsx
│   └── PR/
│       ├── press_kit.pdf
│       └── media_mentions.xlsx
├── 10_Insurance/
│   ├── general_liability.pdf
│   ├── cyber_liability.pdf
│   ├── d_and_o_insurance.pdf
│   └── key_person_insurance.pdf
└── 11_Miscellaneous/
    ├── business_licenses.pdf
    ├── certifications.pdf
    └── other_documents/
```

---

## INDEX.md (Содержание Data Room)

Создайте файл `00_INDEX.md` в root data room:

```markdown
# Rork-Kiku Data Room Index

**Last Updated:** [DATE]
**Version:** [VERSION]
**Contact:** [FOUNDERS_EMAIL]

## Quick Links

- [Executive Summary](01_Executive_Summary/one_pager.pdf)
- [Pitch Deck](01_Executive_Summary/pitch_deck.pdf)
- [Cap Table](02_Corporate/CapTable/cap_table_current.xlsx)
- [Financial Model](03_Financial/Budgets_and_Forecasts/financial_model.xlsx)

---

## Table of Contents

### 01 — Executive Summary
- One-pager
- Pitch deck
- Executive summary document

### 02 — Corporate
- Incorporation documents
- Cap table (current + fully diluted)
- Board meeting minutes
- Shareholders agreement
- Vesting agreements

### 03 — Financial
- Financial statements (P&L, balance sheet, cash flow)
- Budgets and forecasts
- Financial model
- Audit reports
- Tax returns
- Bank statements

### 04 — Investments
- Previous funding rounds (term sheets, agreements)
- Current round documents
- Investor rights agreements

### 05 — Intellectual Property
- IP assignments (founders, employees, contractors)
- Trademark, patent, copyright registrations
- Domain list
- Open-source compliance report

### 06 — Legal
- Privacy policy, terms of service
- GDPR/COPPA compliance documentation
- Security design and audit reports
- Content moderation policy
- Litigation list (or "None" statement)

### 07 — Contracts
- Customer contracts (standard terms, enterprise agreements)
- Vendor contracts (AWS, SaaS, ML APIs)
- Partnership agreements (schools, NGOs)
- Employment and contractor agreements

### 08 — Operations
- Team structure (org chart, employee list)
- Product documentation (roadmap, architecture, API docs)
- Key metrics dashboard

### 09 — Marketing
- Brand guidelines and assets
- Marketing plan and strategy
- PR materials

### 10 — Insurance
- General liability, cyber liability, D&O insurance

### 11 — Miscellaneous
- Business licenses, certifications

---

## Access Instructions

1. **Request Access:** Contact [FOUNDERS_EMAIL]
2. **NDA Required:** Sign NDA before access granted
3. **View-Only:** All documents are view-only (no download/edit)
4. **Expiration:** Access expires after 30 days (can be extended)
5. **Audit Trail:** All access is logged

---

## Notes

- All documents are in PDF or Excel format
- Sensitive information is redacted where appropriate
- For questions about specific documents, contact [FOUNDERS_EMAIL]
- Updated monthly or as needed

---

## Document Checklist

Use this checklist to track which documents are uploaded:

- [ ] Executive Summary
- [ ] Pitch Deck
- [ ] One-Pager
- [ ] Articles of Incorporation
- [ ] Cap Table
- [ ] Financial Statements (latest 2 years)
- [ ] Financial Model
- [ ] Tax Returns
- [ ] Investment Agreements (all rounds)
- [ ] IP Assignments (all founders + employees)
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] GDPR/COPPA Documentation
- [ ] Security Audit Reports
- [ ] Content Moderation Policy
- [ ] Customer Contracts (if any)
- [ ] Vendor Contracts (major ones)
- [ ] Partnership Agreements
- [ ] Employment Contracts
- [ ] Org Chart
- [ ] Product Roadmap
- [ ] Technical Architecture
- [ ] Brand Guidelines
- [ ] Insurance Policies

---

**Confidential — For Investor/Partner Due Diligence Only**
```

---

## Best Practices

### Organization:
- ✅ Logical folder structure
- ✅ Clear file naming: `document_type_date.pdf`
- ✅ No duplicates
- ✅ Include INDEX file

### Security:
- ✅ Password-protected access
- ✅ View-only permissions
- ✅ NDA required before access
- ✅ Audit logging enabled
- ✅ Expiration dates set

### Content:
- ✅ Redact sensitive personal data (SSN, personal addresses)
- ✅ Keep financial data aggregated (не individual salaries)
- ✅ Update quarterly (или при major changes)
- ✅ Ensure all documents are signed where required

### Communication:
- ✅ Clear instructions for access
- ✅ Contact person for questions
- ✅ Timeline expectations (when documents will be reviewed)

---

## Tools & Platforms

**Free/Low-Cost:**
- Google Drive (с restricted sharing)
- Dropbox
- DocSend (with analytics)

**Professional VDR:**
- Carta Data Room
- Capshare
- Firmex
- Intralinks

**Features to look for:**
- Access control (user-by-user permissions)
- Audit trail (who viewed what, when)
- Watermarking (optional, для sensitive docs)
- Q&A functionality (investors can ask questions directly)
- Expiration dates

---

## Maintenance

**Regular Updates:**
- Monthly: financial statements, metrics
- Quarterly: major documents review
- As needed: new contracts, board minutes, funding docs

**Version Control:**
- Keep old versions in archive folder
- Clear file naming with dates

**Notifications:**
- Notify investors когда major documents updated
- Email: "Data room updated with Q3 financials"

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
