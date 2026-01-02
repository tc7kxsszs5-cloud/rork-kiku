# Структура Data Room для Rork-Kiku

## Обзор

Этот документ описывает детальную структуру и содержание data room для инвесторов. См. также `docs/legal/data_room_checklist.md` для полного чек-листа.

---

## Folder Structure

```
/Rork-Kiku_DataRoom/
├── 00_Index.md                          # Этот файл — навигация
├── 01_Executive_Summary/
│   ├── One_Pager.pdf
│   ├── Pitch_Deck.pdf
│   └── Executive_Summary.pdf
├── 02_Corporate_Legal/
│   ├── Articles_of_Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Shareholders_Agreement.pdf
│   ├── Board_Minutes/
│   │   ├── 2025-Q4_Board_Minutes.pdf
│   │   └── 2026-Q1_Board_Minutes.pdf
│   └── Officer_List.xlsx
├── 03_Cap_Table/
│   ├── Current_Cap_Table.xlsx
│   ├── Cap_Table_History.xlsx
│   ├── Fully_Diluted_Analysis.xlsx
│   ├── ESOP_Plan.pdf
│   └── Option_Grants/
│       ├── Founder_Grants.pdf
│       └── Employee_Grants.xlsx
├── 04_Intellectual_Property/
│   ├── IP_Assignments/
│   │   ├── Founder_IP_Assignment.pdf
│   │   └── Employee_IP_Assignments/
│   ├── Trademarks/
│   │   ├── Rork-Kiku_Trademark_Application.pdf
│   │   └── Logo_Trademark.pdf
│   ├── Patents/
│   │   └── (если есть)
│   ├── Domain_Ownership.pdf
│   └── Open_Source_Dependencies.xlsx
├── 05_Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── Data_Processing_Agreement_Template.pdf
│   ├── COPPA_Compliance/
│   │   ├── COPPA_Checklist.pdf
│   │   ├── Parental_Consent_Process.pdf
│   │   └── Verifiable_Consent_Methods.pdf
│   ├── GDPR_Compliance/
│   │   ├── GDPR_Checklist.pdf
│   │   ├── DPIA_Report.pdf
│   │   ├── Data_Subject_Rights_Procedures.pdf
│   │   └── DPO_Appointment.pdf (если требуется)
│   └── Contracts/
│       ├── Vendor_Contracts/
│       │   ├── AWS_Agreement.pdf
│       │   ├── Stripe_Agreement.pdf
│       │   └── SendGrid_Agreement.pdf
│       ├── Partnership_Agreements/
│       └── Employment_Contracts/
│           ├── Founder_Contracts.pdf
│           └── Employee_Contracts/
├── 06_Financial/
│   ├── Financial_Statements/
│   │   ├── 2025_Q4_Financials.xlsx
│   │   ├── 2026_Q1_Financials.xlsx
│   │   ├── Balance_Sheet.pdf
│   │   ├── P&L_Statement.pdf
│   │   └── Cash_Flow_Statement.pdf
│   ├── Tax_Returns/
│   │   ├── 2025_Tax_Return.pdf
│   │   └── 2026_Tax_Return.pdf (когда доступен)
│   ├── Bank_Statements/
│   │   ├── 2025-Q4_Bank_Statements.pdf
│   │   └── 2026-Q1_Bank_Statements.pdf
│   ├── Budget_Forecast/
│   │   ├── 2026_Budget.xlsx
│   │   ├── 3Year_Forecast.xlsx
│   │   └── Burn_Rate_Analysis.xlsx
│   ├── Previous_Funding/
│   │   ├── Seed_Term_Sheet.pdf
│   │   ├── Seed_Closing_Docs.pdf
│   │   └── Use_of_Proceeds_Report.pdf
│   └── Current_Round/
│       ├── Series_A_Term_Sheet_Template.pdf
│       ├── Valuation_Analysis.xlsx
│       └── Dilution_Analysis.xlsx
├── 07_Business_Strategy/
│   ├── Business_Plan.pdf
│   ├── Go_to_Market_Strategy.pdf
│   ├── Competitive_Analysis.pdf
│   ├── Market_Research/
│   │   ├── TAM_SAM_SOM_Analysis.xlsx
│   │   ├── User_Research_Summary.pdf
│   │   └── Surveys_Results.pdf
│   ├── Product_Roadmap.pdf
│   └── Revenue_Model.pdf
├── 08_Metrics_Traction/
│   ├── User_Metrics_Dashboard.xlsx
│   │   # DAU/MAU, retention cohorts, engagement
│   ├── Financial_Metrics.xlsx
│   │   # CAC, LTV, churn, unit economics
│   ├── Pilot_Results/
│   │   ├── Pilot_Summary_Report.pdf
│   │   ├── User_Feedback.pdf
│   │   └── NPS_Results.xlsx
│   └── Monthly_Updates/
│       ├── 2025-11_Investor_Update.pdf
│       └── 2025-12_Investor_Update.pdf
├── 09_Product_Technology/
│   ├── Technical_Architecture.pdf
│   ├── Architecture_Diagrams.pdf
│   ├── Tech_Stack_Overview.pdf
│   ├── Security_Design.pdf
│   ├── ML_Model_Documentation.pdf
│   ├── API_Documentation.pdf
│   ├── Code_Quality_Metrics.pdf
│   └── Open_Source_Licenses.xlsx
├── 10_Team_HR/
│   ├── Founder_Bios/
│   │   ├── CEO_Bio_Resume.pdf
│   │   └── CTO_Bio_Resume.pdf
│   ├── Team_Overview.pdf
│   ├── Org_Chart.pdf
│   ├── Employment_Agreements/
│   │   └── (stored в 05_Legal_Compliance/Contracts)
│   ├── Equity_Grants.xlsx
│   ├── Compensation_Philosophy.pdf
│   └── Hiring_Plan.pdf
├── 11_Security_Audits/
│   ├── Penetration_Test_Report.pdf
│   ├── Security_Audit_Report.pdf
│   ├── COPPA_Certification.pdf (если есть)
│   ├── GDPR_Audit_Report.pdf
│   ├── Vulnerability_Scan_Results.pdf
│   └── Remediation_Status.xlsx
├── 12_Customer_Partnerships/
│   ├── Customer_Testimonials.pdf
│   ├── Case_Studies/
│   ├── Partnership_LOIs/ (letters of intent)
│   └── Reference_List.xlsx
└── 13_Miscellaneous/
    ├── Press_Mentions/
    │   ├── Forbes_Article.pdf
    │   └── TechCrunch_Mention.pdf
    ├── Marketing_Materials/
    │   ├── Brand_Guidelines.pdf
    │   └── Logo_Assets/
    ├── FAQs_for_Investors.pdf
    └── Contact_Info.pdf
```

---

## Document Descriptions

### 01_Executive_Summary/

**One_Pager.pdf**
- One page summary о компании
- Sourced from: `docs/investors/one_pager.md`

**Pitch_Deck.pdf**
- Full pitch deck (12-15 slides)
- Sourced from: `docs/investors/pitch_deck.md`
- Exported to PowerPoint/PDF

**Executive_Summary.pdf**
- 2-3 page detailed summary
- Deeper dive чем one-pager
- Highlights: problem, solution, market, traction, team, ask

---

### 02_Corporate_Legal/

**Articles_of_Incorporation.pdf**
- Legal incorporation документы
- От регистрации компании

**Bylaws.pdf**
- Company bylaws
- Rules для governance

**Shareholders_Agreement.pdf**
- Agreement между shareholders
- Voting rights, transfer restrictions, etc.

**Board_Minutes/**
- Записи всех board meetings
- Quarterly или по мере необходимости

**Officer_List.xlsx**
- Current officers and directors
- Roles, start dates

---

### 03_Cap_Table/

**Current_Cap_Table.xlsx**
- Текущая структура ownership
- Columns: Shareholder, Shares, %, Fully Diluted %
- Include: founders, employees (options), investors

**Cap_Table_History.xlsx**
- История изменений cap table
- All funding rounds, option grants, etc.

**Fully_Diluted_Analysis.xlsx**
- Waterfall analysis для exit scenarios
- Shows payout distribution

**ESOP_Plan.pdf**
- Employee Stock Option Plan документ
- Rules для грантов

**Option_Grants/**
- Индивидуальные option grants
- Vesting schedules

---

### 04_Intellectual_Property/

**IP_Assignments/**
- Signed agreements от всех contributors
- Подтверждение, что IP принадлежит компании

**Trademarks/**
- Trademark applications и registrations
- Logo, brand name

**Patents/** (если есть)
- Patent applications или granted patents

**Domain_Ownership.pdf**
- List всех доменов и подтверждение ownership

**Open_Source_Dependencies.xlsx**
- List всех open-source libraries
- Licenses (MIT, Apache, etc.)
- Compliance check

---

### 05_Legal_Compliance/

**Privacy_Policy.pdf**
- Published privacy policy
- Sourced from: `docs/legal/privacy_policy_draft.md` (finalized version)

**Terms_of_Service.pdf**
- User agreement

**Data_Processing_Agreement_Template.pdf**
- DPA для customers (GDPR requirement)

**COPPA_Compliance/**
- Verifiable Parental Consent process
- Documentation compliance

**GDPR_Compliance/**
- DPIA (Data Protection Impact Assessment)
- Procedures для data subject rights
- Records of processing activities

**Contracts/**
- All signed contracts (vendors, partners, employees)

---

### 06_Financial/

**Financial_Statements/**
- Balance Sheet, P&L, Cash Flow
- Monthly или quarterly
- Audited (если есть)

**Tax_Returns/**
- Filed tax returns
- Last 2 years

**Bank_Statements/**
- Bank account statements
- Last 6-12 months

**Budget_Forecast/**
- Current year budget
- 3-5 year forecast (sourced from financial model)
- Burn rate analysis

**Previous_Funding/**
- Term sheets, closing docs от previous rounds
- Use of proceeds reports

**Current_Round/**
- Materials для текущего round
- Valuation analysis, dilution scenarios

---

### 07_Business_Strategy/

**Business_Plan.pdf**
- Comprehensive business plan
- Market analysis, strategy, operations

**Go_to_Market_Strategy.pdf**
- GTM plan по markets
- Sourced from: `docs/pilot/pilot_plan.md`, roadmap

**Competitive_Analysis.pdf**
- Detailed competitive landscape
- Feature comparison, positioning

**Market_Research/**
- TAM/SAM/SOM calculations
- User research summaries
- Survey results

**Product_Roadmap.pdf**
- Sourced from: `docs/roadmap/roadmap.md`

**Revenue_Model.pdf**
- Pricing strategy, unit economics

---

### 08_Metrics_Traction/

**User_Metrics_Dashboard.xlsx**
- DAU, MAU, retention, engagement
- Charts и graphs
- Trend analysis

**Financial_Metrics.xlsx**
- CAC, LTV, LTV/CAC ratio
- Churn rate
- MRR, ARR growth

**Pilot_Results/**
- Summary report от pilot
- User feedback, NPS
- Key learnings

**Monthly_Updates/**
- Investor updates (если previous funding)
- Show progress over time

---

### 09_Product_Technology/

**Technical_Architecture.pdf**
- Sourced from: `docs/architecture/architecture.md`
- Include diagrams

**Security_Design.pdf**
- Sourced from: `docs/security/security_design.md`

**ML_Model_Documentation.pdf**
- Model architecture, performance metrics

**API_Documentation.pdf**
- API endpoints, authentication

**Code_Quality_Metrics.pdf**
- Test coverage, code review stats
- CI/CD metrics

**Open_Source_Licenses.xlsx**
- Full list, compliance verified

---

### 10_Team_HR/

**Founder_Bios/**
- CVs, LinkedIn profiles
- Track record, expertise

**Team_Overview.pdf**
- Sourced from: `docs/team/team_roles.md`
- Current team, open positions

**Org_Chart.pdf**
- Visual organizational structure

**Equity_Grants.xlsx**
- All option grants issued
- Vesting status

**Compensation_Philosophy.pdf**
- Salary ranges, equity guidelines

**Hiring_Plan.pdf**
- Roles to hire, timeline, budget

---

### 11_Security_Audits/

**Penetration_Test_Report.pdf**
- External pentest results
- Vulnerabilities found, remediation status

**Security_Audit_Report.pdf**
- General security assessment

**COPPA_Certification.pdf** (если US launch)
- Certification документ

**GDPR_Audit_Report.pdf**
- Compliance audit

**Vulnerability_Scan_Results.pdf**
- Regular scans (Snyk, etc.)

**Remediation_Status.xlsx**
- Tracking fixes для found vulnerabilities

---

### 12_Customer_Partnerships/

**Customer_Testimonials.pdf**
- Quotes от users (с permission)

**Case_Studies/**
- Detailed user stories

**Partnership_LOIs/**
- Letters of Intent от partners (schools, telecoms, etc.)

**Reference_List.xlsx**
- Contact info для references (с permission)

---

### 13_Miscellaneous/

**Press_Mentions/**
- Articles, interviews
- PDF copies

**Marketing_Materials/**
- Brand guidelines, logos
- Sourced from: `docs/branding/`

**FAQs_for_Investors.pdf**
- Common questions preemptively answered

**Contact_Info.pdf**
- Who to contact для questions

---

## Access Control

### Tiered Access

**Level 1 — Initial Interest (Public)**
- One-pager
- Pitch deck

**Level 2 — Post-NDA (Full Data Room)**
- All folders
- Granted after NDA signed

**Level 3 — Due Diligence (Enhanced Access)**
- Code repository (read-only)
- Detailed financials
- Customer lists (с permission)
- Granted to serious investors in DD phase

---

## Platform Recommendations

**For Early Stage:**
- **Google Drive** (с proper permissions)
- **Dropbox** (Business plan)
- **DocSend** (tracking who accessed what)

**For Series A+:**
- **Intralinks** (профессиональный data room service)
- **Firmex**
- **DealRoom**

**Features needed:**
- Permission management (tiered access)
- Tracking (who accessed что и когда)
- Version control (update documents)
- Secure (encryption, audit trail)
- Easy для investors to navigate

---

## Maintenance

**Regular Updates:**
- **Monthly**: Financial statements, metrics dashboards, investor updates
- **Quarterly**: Board minutes, budget reviews
- **Annual**: Tax returns, audits, strategy reviews
- **As needed**: Contracts, IP documents, team changes

**Version Control:**
- Use clear naming: `Document_Name_v1.0_2026-01-15.pdf`
- Keep previous versions в archive folder
- Update index при изменениях

**Audit Trail:**
- Log who accessed что и когда
- Useful для follow-up conversations

---

## Preparation Timeline

**3 months before fundraising:**
- [ ] Inventory existing documents
- [ ] Identify gaps
- [ ] Start preparing missing documents

**2 months before:**
- [ ] Legal review всех documents
- [ ] Financial statements prepared
- [ ] Security audits completed

**1 month before:**
- [ ] Data room platform selected
- [ ] All documents uploaded
- [ ] Access controls configured
- [ ] Test access

**During fundraising:**
- [ ] Grant access upon NDA
- [ ] Monitor access logs
- [ ] Update documents regularly

---

## Security Best Practices

**Do:**
- ✅ Require NDA before access
- ✅ Use secure platform (not email!)
- ✅ Track access (who saw что)
- ✅ Redact sensitive info (SSNs, full credit card numbers)
- ✅ Watermark documents (опционально)
- ✅ Set expiration dates для access (опционально)

**Don't:**
- ❌ Email entire data room
- ❌ Use consumer Dropbox/Drive без permissions
- ❌ Include customer PII без consent
- ❌ Leave data room accessible indefinitely after fundraising

---

**Примечание:** Эта структура — comprehensive. Не все файлы требуются для каждого round. Pre-seed может быть simpler; Series A должна быть thorough. Consult с legal counsel для specific requirements.

**См. также:** `docs/legal/data_room_checklist.md` для детального чек-листа документов.
