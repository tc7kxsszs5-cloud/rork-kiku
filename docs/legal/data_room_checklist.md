# Data Room Checklist для Rork-Kiku

## Обзор

Data room — это организованное хранилище всех важных документов компании, предоставляемое инвесторам при due diligence. Должен быть готов перед началом fundraising.

**Платформа**: DocSend, Dropbox, Google Drive (с proper access controls) или специализированные data room сервисы (Intralinks, Firmex)

---

## 1. Учредительные и корпоративные документы

### Обязательные:

- [ ] **Устав компании** (Articles of Incorporation/Charter)
  - Актуальная версия
  - Все изменения и amendments

- [ ] **ОГРН/ИНН** (для России) или регистрационные документы
  - Выписка из ЕГРЮЛ
  - Подтверждение tax ID

- [ ] **Учредительный договор** (Shareholders Agreement)
  - Права и обязанности учредителей
  - Процедуры принятия решений
  - Exit clauses

- [ ] **Протоколы собраний** (Board Minutes)
  - Все важные решения documented
  - Appointments of officers
  - Major corporate actions

- [ ] **Список директоров и officers**
  - Актуальный состав
  - Roles и responsibilities

### Если есть:

- [ ] **Предыдущие инвестиции**
  - Term sheets
  - Stock Purchase Agreements
  - Amendments

- [ ] **Опционные планы** (Stock Option Plan)
  - ESOP документы
  - Option grants
  - Vesting schedules

---

## 2. Капитализация (Cap Table)

### Обязательные:

- [ ] **Текущий Cap Table**
  - Spreadsheet с полным breakdown
  - Все shareholders и их доли
  - Fully diluted basis

- [ ] **История капитализации**
  - Все rounds финансирования
  - Changes в ownership
  - Splits, conversions

- [ ] **Outstanding options и warrants**
  - Кому выданы
  - Vesting schedule
  - Exercise prices

- [ ] **Convertible notes** (если есть)
  - Terms
  - Conversion triggers
  - Maturity dates

### Формат:

- Excel/Google Sheets с формулами
- Carta или Capshare экспорт (если используется)
- Waterfall analysis для разных exit scenarios

---

## 3. Интеллектуальная собственность (IP)

### Обязательные:

- [ ] **IP Assignment Agreements**
  - От всех founders и employees
  - Подтверждение, что вся IP принадлежит компании

- [ ] **Trademarks**
  - Заявки на регистрацию товарных знаков
  - Registered trademarks (если есть)
  - Logo, brand name

- [ ] **Patents** (если есть)
  - Заявки и granted patents
  - ML model innovations (если patentable)

- [ ] **Copyrights**
  - Код, design assets
  - Content, documentation

- [ ] **Domain names**
  - Список всех доменов
  - Ownership подтверждение

### Если есть:

- [ ] **Лицензии от третьих сторон**
  - Open source libraries (list и licenses)
  - Commercial licenses
  - Compliance с license terms

- [ ] **Trade secrets**
  - Документация proprietary algorithms
  - ML model architecture (если confidential)

---

## 4. Юридические и compliance документы

### Privacy & Data Protection:

- [ ] **Privacy Policy** (актуальная версия)
  - COPPA compliant (если US)
  - GDPR compliant (если EU)
  - Локализованные версии (RU, EN)

- [ ] **Terms of Service** (ToS)
  - User agreement
  - Acceptable use policy
  - Disclaimers, limitations

- [ ] **Data Processing Agreement** (DPA)
  - Для EU customers
  - GDPR Article 28 compliance

- [ ] **Cookie Policy** (если web app)

- [ ] **COPPA Compliance Documentation**
  - Parental consent process
  - Data collection policies
  - Verifiable parental consent methods

- [ ] **GDPR Compliance Documentation**
  - DPIA (Data Protection Impact Assessment)
  - Records of processing activities
  - Right to be forgotten procedures

### Contracts & Agreements:

- [ ] **Customer contracts** (если есть Enterprise клиенты)
  - MSAs (Master Service Agreements)
  - SLAs (Service Level Agreements)

- [ ] **Vendor contracts**
  - AWS/GCP agreement
  - SaaS tools (Firebase, SendGrid, etc.)
  - Critical dependencies

- [ ] **Partnership agreements** (если есть)
  - School partnerships
  - Telecom partnerships
  - Co-marketing agreements

- [ ] **Employment contracts**
  - Founders
  - Key employees
  - Consultants/contractors

- [ ] **NDA templates**
  - Standard NDA для partners
  - Mutual NDAs

### Insurance & Liability:

- [ ] **Insurance policies** (если есть)
  - Cyber liability insurance
  - General liability
  - D&O insurance (для board)

- [ ] **Pending or threatened litigation**
  - Disclosure: none (или детали если есть)

---

## 5. Финансовые документы

### Обязательные:

- [ ] **Financial Statements**
  - Баланс (Balance Sheet)
  - P&L (Profit & Loss Statement)
  - Cash Flow Statement
  - Последние 2-3 года или с inception

- [ ] **Tax Returns**
  - Последние 2 года
  - Подтверждение filing

- [ ] **Bank Statements**
  - Последние 6-12 месяцев
  - Все счета компании

- [ ] **Budget & Forecast**
  - Текущий год budget
  - 3-5 year forecast (см. `financial_model.csv`)

- [ ] **Burn Rate Analysis**
  - Monthly burn
  - Runway calculation
  - Break-even analysis

### Funding:

- [ ] **Previous funding rounds** (если есть)
  - Term sheets
  - Closing documents
  - Use of proceeds
  - Investor reports

- [ ] **Debt** (если есть)
  - Loan agreements
  - Repayment schedule
  - Collateral

- [ ] **Current round materials**
  - Term sheet для этого round
  - Valuation methodology
  - Dilution analysis

---

## 6. Бизнес-план и стратегия

### Обязательные:

- [ ] **Executive Summary**
  - One-pager (см. `docs/investors/one_pager.md`)

- [ ] **Pitch Deck**
  - Актуальная версия (см. `docs/investors/pitch_deck.md`)

- [ ] **Business Plan**
  - Detailed plan с market analysis
  - Go-to-market strategy
  - Revenue model

- [ ] **Product Roadmap**
  - Current features
  - Planned features (12-24 months)
  - Technology stack

- [ ] **Competitive Analysis**
  - Key competitors
  - Differentiation
  - Market positioning

### Metrics & Traction:

- [ ] **User Metrics** (если есть)
  - DAU/MAU
  - Retention cohorts
  - Engagement metrics

- [ ] **Financial Metrics**
  - CAC (Customer Acquisition Cost)
  - LTV (Lifetime Value)
  - Churn rate
  - Unit economics

- [ ] **Pilot Results** (если completed)
  - Summary report
  - User feedback
  - Key learnings

---

## 7. Product & Technology

### Обязательные:

- [ ] **Technical Architecture**
  - High-level design (см. `docs/architecture/architecture.md`)
  - Диаграммы (см. `docs/architecture/diag.svg`)
  - Tech stack overview

- [ ] **Security & Infrastructure**
  - Security design (см. `docs/security/security_design.md`)
  - Compliance measures (COPPA, GDPR)
  - Incident response plan

- [ ] **ML Model Documentation**
  - Model architecture
  - Training data strategy
  - Performance metrics
  - Bias mitigation

- [ ] **API Documentation**
  - Endpoints overview
  - Authentication methods

### Code & Repos:

- [ ] **Code Repository Access** (controlled)
  - GitHub repo (read-only access для DD)
  - Code quality metrics (если есть)
  - Test coverage

- [ ] **Open Source Dependencies**
  - Full list
  - License compliance check
  - No GPL violations

---

## 8. Команда и HR

### Обязательные:

- [ ] **Founder Bios**
  - CVs/Resumes
  - LinkedIn profiles
  - Previous experience

- [ ] **Team Overview**
  - Current team structure (см. `docs/team/team_roles.md`)
  - Key hires planned

- [ ] **Employment Agreements**
  - All employees
  - Compensation details
  - IP assignment clauses

- [ ] **Advisor Agreements** (если есть)
  - Roles
  - Compensation (equity, cash)

- [ ] **Equity Grants**
  - Options issued
  - Vesting schedules
  - Strike prices

### Culture & Org:

- [ ] **Company Values & Culture**
  - Mission, vision
  - Core values

- [ ] **Hiring Plan**
  - Roles to hire (next 12-24 months)
  - Budget allocation

---

## 9. Security Audits & Compliance

### Обязательные (или "в процессе"):

- [ ] **Security Audit Report**
  - External pentest (если проведён)
  - Vulnerability assessment
  - Remediation plan

- [ ] **COPPA Certification** (если US launch)
  - Self-certification или third-party
  - Compliance documentation

- [ ] **GDPR Compliance Audit** (если EU launch)
  - DPIA results
  - DPO appointment (если требуется)

- [ ] **SOC 2 Report** (отложено на later stage)
  - Type I или Type II (если есть)

---

## 10. Дополнительные материалы

### Marketing & PR:

- [ ] **Press Mentions** (если есть)
  - Articles, interviews
  - Media kit

- [ ] **Marketing Materials**
  - Branding guidelines (см. `docs/branding/brand-guidelines.md`)
  - Logos, assets

### Customer & User Feedback:

- [ ] **User Testimonials** (если есть)
  - Quotes с permission
  - Case studies

- [ ] **NPS Results** (если pilot completed)
  - Survey results
  - Feedback themes

### Miscellaneous:

- [ ] **FAQs для Investors**
  - Common questions addressed
  - Key concerns preemptively answered

- [ ] **References**
  - List of references (advisors, early customers)
  - Contact info (с permission)

---

## Организация Data Room

### Структура папок:

```
/Data_Room_Rork-Kiku/
├── 01_Corporate/
│   ├── Articles_of_Incorporation.pdf
│   ├── Shareholders_Agreement.pdf
│   ├── Board_Minutes/
│   └── Officer_List.xlsx
├── 02_Cap_Table/
│   ├── Current_Cap_Table.xlsx
│   ├── Cap_Table_History.xlsx
│   └── ESOP_Plan.pdf
├── 03_Intellectual_Property/
│   ├── IP_Assignments/
│   ├── Trademarks/
│   └── Domain_Ownership.pdf
├── 04_Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── COPPA_Compliance_Docs/
│   ├── GDPR_Compliance_Docs/
│   └── Contracts/
├── 05_Financial/
│   ├── Financial_Statements/
│   ├── Tax_Returns/
│   ├── Bank_Statements/
│   └── Financial_Model.xlsx
├── 06_Business_Strategy/
│   ├── Pitch_Deck.pdf
│   ├── One_Pager.pdf
│   ├── Business_Plan.pdf
│   └── Competitive_Analysis.pdf
├── 07_Product_Technology/
│   ├── Technical_Architecture.pdf
│   ├── Security_Design.pdf
│   ├── API_Documentation.pdf
│   └── ML_Model_Overview.pdf
├── 08_Team_HR/
│   ├── Founder_Bios/
│   ├── Team_Overview.pdf
│   ├── Employment_Agreements/
│   └── Equity_Grants.xlsx
├── 09_Security_Audits/
│   ├── Pentest_Report.pdf
│   ├── COPPA_Certification.pdf
│   └── GDPR_Audit.pdf
└── 10_Additional/
    ├── Press_Mentions/
    ├── User_Testimonials/
    └── FAQs_for_Investors.pdf
```

### Access Control:

- **Level 1** (Initial interest): One-pager, pitch deck
- **Level 2** (After NDA): Full data room access
- **Level 3** (Due diligence phase): Code repo access, detailed financials

### Logging:

- Track who accessed what documents
- Useful для follow-up conversations

---

## Timeline для подготовки

**3 месяца до fundraising:**
- [ ] Inventory всех существующих документов
- [ ] Identify gaps (missing documents)
- [ ] Start preparing missing items

**2 месяца до fundraising:**
- [ ] Legal review всех contracts и policies
- [ ] Financial statements prepared/audited
- [ ] Security audit scheduled

**1 месяц до fundraising:**
- [ ] Data room platform selected и setup
- [ ] All documents uploaded и organized
- [ ] Access controls configured
- [ ] Test access с trusted advisor

**During fundraising:**
- [ ] Grant access to investors upon NDA signing
- [ ] Monitor access logs
- [ ] Update documents as needed (e.g., новые metrics)

---

## Red Flags для Investors (избегайте!)

❌ **Missing или inconsistent documents**  
❌ **Unclear ownership/cap table issues**  
❌ **IP не fully assigned к компании**  
❌ **Litigation или threatened lawsuits (не disclosed)**  
❌ **Regulatory non-compliance** (особенно COPPA/GDPR)  
❌ **Bad financials** (неорганизованные, ошибки)  
❌ **Team turnover** (ключевые люди ушли без explanation)  

---

## Советы

✅ **Be organized**: Логичная структура, easy to navigate  
✅ **Be transparent**: Disclose issues проактивно, не прячьте  
✅ **Be current**: Update metrics regularly (monthly)  
✅ **Be professional**: Правильное formatting, no typos  
✅ **Be secure**: Proper access controls, NDAs  

---

**Примечание**: Этот checklist является comprehensive. Не все items обязательны для каждого round (e.g., pre-seed может быть менее detailed). Consult с вашим legal counsel для specific requirements вашей jurisdiction.

**См. также**: `docs/templates/dataroom_template.md` для detailed структуры.
