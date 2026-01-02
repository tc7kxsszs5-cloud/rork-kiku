# Шаблон структуры Data Room для kiku

## Введение

Данный документ описывает рекомендуемую структуру виртуального data room для kiku. Используйте это как checklist при подготовке к due diligence.

## Рекомендуемая платформа

**Варианты:**
- Google Drive (простой, бесплатный)
- Dropbox Business (хороший для sharing)
- Intralinks / Firmex (профессиональный VDR, дорого)
- Notion (для living documentation)

**Рекомендация для early-stage:** Google Drive или Dropbox

---

## Структура папок

```
kiku-dataroom/
│
├── 00-INDEX/
│   ├── index.md (этот файл, master list всех документов)
│   ├── access_log.md (кто имеет доступ, с какими правами)
│   └── version_history.md (история изменений data room)
│
├── 01-COMPANY-OVERVIEW/
│   ├── executive_summary.pdf
│   ├── one_pager.pdf
│   ├── pitch_deck_latest.pdf
│   ├── pitch_deck_versions/
│   │   ├── pitch_deck_2025-12.pdf
│   │   └── pitch_deck_2026-01.pdf
│   ├── company_presentation_detailed.pdf
│   ├── company_history.md
│   └── mission_vision_values.md
│
├── 02-LEGAL-CORPORATE/
│   ├── incorporation/
│   │   ├── certificate_of_incorporation.pdf
│   │   ├── articles_of_association.pdf
│   │   ├── shareholders_agreement.pdf
│   │   └── bylaws.pdf
│   ├── board_minutes/
│   │   ├── 2025-Q1_minutes.pdf
│   │   ├── 2025-Q2_minutes.pdf
│   │   └── [continue chronologically]
│   ├── shareholder_minutes/
│   │   └── [similar structure]
│   ├── cap_table/
│   │   ├── cap_table_current.xlsx
│   │   ├── cap_table_post_seed.xlsx (proforma)
│   │   ├── option_pool_documentation.pdf
│   │   └── founder_vesting_agreements.pdf
│   ├── funding_rounds/
│   │   ├── pre_seed/
│   │   │   ├── term_sheet.pdf
│   │   │   ├── investment_agreement.pdf
│   │   │   └── investor_list.xlsx
│   │   └── seed/ (if applicable)
│   ├── contracts/
│   │   ├── material_contracts_list.xlsx
│   │   ├── aws_agreement.pdf
│   │   ├── openai_agreement.pdf
│   │   ├── office_lease.pdf
│   │   └── [other contracts >$10K/year]
│   ├── ip/
│   │   ├── trademark_registrations.pdf
│   │   ├── domain_ownership.xlsx
│   │   ├── ip_assignment_agreements/ (all employees)
│   │   └── open_source_licenses_list.xlsx
│   └── insurance/
│       ├── general_liability_policy.pdf
│       ├── cyber_insurance_policy.pdf
│       └── d_and_o_insurance.pdf
│
├── 03-FINANCIAL/
│   ├── historical_financials/
│   │   ├── income_statements/
│   │   │   ├── 2025_monthly_pnl.xlsx
│   │   │   └── 2026_monthly_pnl.xlsx
│   │   ├── balance_sheets/
│   │   │   ├── 2025_quarterly_balance_sheet.xlsx
│   │   │   └── 2026_quarterly_balance_sheet.xlsx
│   │   ├── cash_flow_statements/
│   │   │   └── 2025-2026_monthly_cashflow.xlsx
│   │   └── bank_statements/
│   │       └── last_12_months/ (redacted account numbers)
│   ├── projections/
│   │   ├── financial_model.xlsx (5-year model)
│   │   ├── financial_model_assumptions.pdf
│   │   ├── unit_economics_analysis.xlsx
│   │   ├── cohort_analysis.xlsx
│   │   └── scenario_analysis.xlsx (conservative/base/optimistic)
│   ├── budget/
│   │   ├── 2026_annual_budget.xlsx
│   │   └── budget_vs_actual.xlsx
│   ├── fundraising/
│   │   ├── use_of_funds.pdf
│   │   ├── fundraising_memo.pdf
│   │   └── valuation_justification.pdf
│   └── tax_compliance/
│       ├── tax_returns_2025.pdf
│       ├── tax_compliance_certificates.pdf
│       └── accounting_policies.pdf
│
├── 04-PRODUCT-TECHNOLOGY/
│   ├── product_documentation/
│   │   ├── mvp_specification.pdf (from docs/mvp/mvp_spec.md)
│   │   ├── product_roadmap.pdf (from docs/roadmap/)
│   │   ├── user_manuals.pdf
│   │   └── product_screenshots/
│   ├── technical_documentation/
│   │   ├── architecture_diagram.pdf (from docs/architecture/)
│   │   ├── technology_stack.pdf
│   │   ├── data_flow_diagrams.pdf
│   │   ├── api_documentation.pdf
│   │   └── infrastructure_setup.pdf (from docs/infra/)
│   ├── development/
│   │   ├── development_practices.pdf
│   │   ├── git_workflow.pdf
│   │   ├── ci_cd_pipeline.pdf (from docs/infra/ci_cd.md)
│   │   └── technical_debt_assessment.pdf
│   ├── security/
│   │   ├── security_design.pdf (from docs/security/)
│   │   ├── security_audit_report.pdf (if available)
│   │   ├── penetration_test_results.pdf (if available)
│   │   └── vulnerability_scan_results.pdf
│   └── code_repository/
│       └── access_instructions.md (provide on request, advanced stage only)
│
├── 05-CUSTOMERS-MARKET/
│   ├── customer_data/
│   │   ├── customer_list_aggregated.xlsx
│   │   ├── customer_segmentation.xlsx
│   │   ├── geographic_distribution.xlsx
│   │   └── retention_cohorts.xlsx
│   ├── case_studies/
│   │   ├── case_study_1_anonymized.pdf
│   │   ├── case_study_2_anonymized.pdf
│   │   └── case_study_3_anonymized.pdf
│   ├── testimonials/
│   │   ├── text_testimonials.pdf
│   │   └── video_testimonials/ (links)
│   ├── metrics/
│   │   ├── key_metrics_dashboard.pdf (MAU, DAU, churn, etc.)
│   │   ├── user_analytics_report.pdf
│   │   ├── nps_scores.pdf
│   │   └── pilot_results_summary.pdf (from docs/pilot/)
│   └── market_analysis/
│       ├── market_research_report.pdf
│       ├── tam_sam_som_analysis.pdf
│       ├── competitive_analysis.pdf
│       └── customer_survey_results.pdf
│
├── 06-TEAM-HR/
│   ├── team_information/
│   │   ├── organizational_chart.pdf
│   │   ├── team_bios.pdf (from docs/team/)
│   │   ├── advisors_and_board.pdf
│   │   └── hiring_plan.pdf (from docs/team/)
│   ├── employment_documents/
│   │   ├── founder_employment_agreements/
│   │   ├── employee_agreements/ (redacted salaries initially)
│   │   ├── consultant_agreements/
│   │   ├── nda_templates.pdf
│   │   └── ip_assignment_agreements/ (ALL employees/contractors)
│   ├── compensation/
│   │   ├── compensation_philosophy.pdf
│   │   ├── salary_ranges_by_role.xlsx
│   │   ├── esop_plan.pdf
│   │   └── benefits_package.pdf
│   └── hr_policies/
│       ├── employee_handbook.pdf
│       ├── code_of_conduct.pdf
│       └── diversity_inclusion_policy.pdf
│
├── 07-COMPLIANCE-SECURITY/
│   ├── privacy_data_protection/
│   │   ├── privacy_policy.pdf (from docs/legal/)
│   │   ├── terms_of_service.pdf
│   │   ├── coppa_compliance_documentation.pdf
│   │   ├── gdpr_compliance_documentation.pdf
│   │   ├── data_processing_agreements/
│   │   └── consent_management_process.pdf
│   ├── content_moderation/
│   │   ├── content_policy.pdf (from docs/legal/)
│   │   ├── moderation_guidelines.pdf
│   │   ├── ai_moderation_documentation.pdf
│   │   └── content_appeal_process.pdf
│   ├── security/
│   │   ├── security_incident_response_plan.pdf
│   │   ├── data_breach_notification_process.pdf
│   │   ├── security_training_materials.pdf
│   │   └── vendor_security_assessments/
│   ├── certifications/
│   │   ├── soc2_report.pdf (if available)
│   │   ├── iso27001_certificate.pdf (if available)
│   │   └── app_store_compliance.pdf
│   └── audit_logs/
│       ├── compliance_logs_sample.xlsx
│       └── security_audit_logs_sample.xlsx
│
├── 08-PARTNERSHIPS-BD/
│   ├── partnership_agreements/
│   │   ├── school_partnerships/
│   │   ├── ngo_partnerships/
│   │   └── technology_partnerships/
│   ├── pipeline/
│   │   ├── partnership_pipeline.xlsx
│   │   ├── school_outreach_tracker.xlsx
│   │   └── enterprise_prospects.xlsx
│   └── materials/
│       ├── partnership_deck.pdf
│       ├── b2b_pricing.pdf
│       └── integration_documentation.pdf
│
├── 09-MARKETING-SALES/
│   ├── marketing_strategy/
│   │   ├── go_to_market_strategy.pdf
│   │   ├── marketing_plan_2026.pdf
│   │   ├── content_calendar.xlsx
│   │   └── seo_strategy.pdf
│   ├── sales_materials/
│   │   ├── sales_deck.pdf
│   │   ├── product_demo_script.pdf
│   │   └── faq_document.pdf
│   ├── analytics/
│   │   ├── marketing_metrics_dashboard.pdf
│   │   ├── cac_ltv_analysis.xlsx
│   │   ├── channel_performance.xlsx
│   │   └── conversion_funnel_analysis.xlsx
│   └── brand_assets/
│       ├── brand_guidelines.pdf
│       ├── logo_files/
│       └── marketing_collateral/
│
├── 10-PRESS-MEDIA/
│   ├── press_releases/
│   │   ├── launch_announcement.pdf
│   │   └── funding_announcement.pdf
│   ├── media_coverage/
│   │   ├── media_coverage_summary.pdf
│   │   └── press_clippings/
│   ├── press_kit/
│   │   ├── press_kit.pdf
│   │   ├── founder_photos/
│   │   └── product_screenshots/
│   └── social_media/
│       └── social_media_analytics.pdf
│
├── 11-RISK-LEGAL/
│   ├── risk_register/
│   │   ├── risk_assessment.xlsx
│   │   └── mitigation_strategies.pdf
│   ├── litigation/
│   │   ├── litigation_summary.pdf (or "nil" statement)
│   │   ├── cease_and_desist_letters/ (if any)
│   │   └── settlement_agreements/ (if any)
│   └── regulatory/
│       ├── regulatory_compliance_summary.pdf
│       └── regulatory_filings/
│
└── 12-MISCELLANEOUS/
    ├── faqs/
    │   ├── investor_faq.pdf
    │   └── technical_faq.pdf
    ├── references/
    │   ├── reference_list.pdf (investors, customers, partners)
    │   └── contact_permissions.xlsx
    └── updates/
        ├── monthly_investor_updates/
        └── quarterly_board_updates/
```

---

## Примечания по организации

### Naming Conventions

**Format:** `[Category]_[Document-Name]_[Date]_v[Version].ext`

**Examples:**
- `02_LEGAL_Shareholders_Agreement_2025-06-15_v1.0.pdf`
- `03_FIN_Financial_Model_2026-01-02_v2.3.xlsx`
- `05_CUST_Pilot_Results_2026-03-01_v1.0.pdf`

### Version Control

**Version numbering:**
- Major changes: 1.0 → 2.0
- Minor changes: 1.0 → 1.1
- Typos/formatting: 1.0 → 1.0.1

**Archive old versions:**
- Keep в `_archived/` subfolder
- OR include version в filename

### Access Control

**Levels:**
- **Level 1 (Public):** Executive summary, one-pager, basic product info
- **Level 2 (Initial DD):** Pitch deck, high-level financials, team bios
- **Level 3 (Advanced DD):** Detailed financials, contracts, cap table details
- **Level 4 (Final DD):** Sensitive docs, code access, customer lists

**Track access:**
- Maintain `access_log.md` с who accessed what when
- Use platform analytics (Google Drive/Dropbox tracking)

### Sensitive Information

**Redaction strategy (early stages):**
- Customer names → "Customer A", "Customer B"
- Exact salaries → Salary ranges
- Specific terms → "[REDACTED - available upon request]"
- Personal contact info → Use generic company contacts

**Full disclosure (final DD):**
- Provide complete unredacted documents
- Require NDA strengthening
- Watermark documents с recipient name

---

## Maintenance Schedule

### Weekly
- Add new documents as created
- Update metrics dashboards
- Review access logs

### Monthly
- Update financial statements
- Add new contracts/agreements
- Review and remove outdated documents

### Quarterly
- Comprehensive review
- Update all key metrics
- Refresh pitch materials
- Archive old versions

### Before Investor Meeting
- Complete fresh review (2-3 days before)
- Ensure all documents up-to-date
- Test all links
- Prepare Q&A document based on common questions

---

## Pre-Meeting Checklist

```
[ ] All required documents uploaded and organized
[ ] File naming consistent
[ ] Versions clearly marked
[ ] Sensitive information appropriately redacted (if early stage)
[ ] All links working
[ ] PDFs readable (not scanned images without OCR)
[ ] Excel files not password protected (or provide password separately)
[ ] Index document updated
[ ] Access permissions set correctly
[ ] NDA executed (if required)
[ ] Contact information current
[ ] FAQ document prepared
[ ] Team briefed on data room contents
```

---

## Common Investor Questions - Be Ready

### Financial
- Why these revenue assumptions?
- How did you calculate TAM/SAM/SOM?
- Why is CAC/LTV better than competitors?
- Burn rate vs runway?
- Break-even timeline?

### Product
- What's your defensibility?
- Why won't Google/Apple do this?
- AI accuracy - how measured?
- Scalability limits?
- What if AI providers raise prices?

### Market
- Market size validation?
- Who are real competitors?
- Why haven't others succeeded?
- Customer concentration risk?

### Team
- Why this team?
- Who's missing?
- Founder vesting?
- Key person risk?

### Legal
- Any IP disputes?
- COPPA compliance validation?
- Data breach plan?
- Regulatory risks?

---

## Tools & Best Practices

### Recommended Tools

**VDR Platforms:**
- **Budget:** Google Drive ($6-12/user/mo)
- **Mid-range:** Dropbox Business ($15-25/user/mo)
- **Professional:** Intralinks, Firmex ($1K-5K/month)

**Document Creation:**
- **PDFs:** Adobe Acrobat (professional looking)
- **Spreadsheets:** Excel/Google Sheets
- **Diagrams:** Lucidchart, draw.io
- **Presentations:** PowerPoint, Keynote, Pitch

**Tracking:**
- **Analytics:** Google Drive/Dropbox built-in
- **CRM Integration:** Sync with HubSpot/Pipedrive
- **Notifications:** Set up alerts для document access

### Security Best Practices

```
[ ] Require NDA before Level 3+ access
[ ] Enable two-factor authentication
[ ] Use watermarks on sensitive documents
[ ] Set expiring links (30-60 days)
[ ] Disable download for most sensitive docs
[ ] Track who accessed what
[ ] Regular access audits (remove old access)
[ ] Encrypted backup
```

---

## Appendix: Document Descriptions

См. `/docs/legal/data_room_checklist.md` для детального описания каждого документа и его содержания.

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0
**Владелец:** CFO / CEO

**Примечание:** Адаптируйте структуру под ваши нужды. Это starting template, не rigid requirement.

**Контакты для data room access requests:**
- Email: dataroom@kiku-app.com
- Процесс: NDA → access credentials → virtual tour (optional)
