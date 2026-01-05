# Data Room Checklist для Rork-Kiku

## Введение

Data room — это защищенное хранилище всех критически важных документов компании, которое предоставляется инвесторам, покупателям или партнерам для due diligence. Этот checklist описывает все документы, которые должны быть подготовлены и организованы.

## Структура Data Room

```
/data-room/
├── 01-corporate/
├── 02-financial/
├── 03-legal/
├── 04-ip/
├── 05-hr/
├── 06-technical/
├── 07-commercial/
├── 08-compliance/
└── 09-misc/
```

## 1. Corporate Documents (Учредительные документы)

### 1.1 Formation Documents
- [ ] **Certificate of Incorporation / Учредительный договор**
  - Дата регистрации
  - Jurisdiction (страна/регион регистрации)
  - Company number

- [ ] **Articles of Association / Устав**
  - Текущая версия
  - Все amendments (изменения)

- [ ] **Shareholders' Agreement / Акционерное соглашение**
  - Права акционеров
  - Voting rights
  - Transfer restrictions
  - Tag-along / Drag-along provisions
  - Liquidation preferences

- [ ] **Cap Table (Таблица капитализации)**
  - Current ownership structure
  - Fully diluted basis
  - Option pool (если есть)
  - Vesting schedules
  - Excel file + визуализация

### 1.2 Board Documents
- [ ] **Board Meeting Minutes**
  - Все протоколы заседаний
  - С момента основания до текущей даты
  - Signed copies

- [ ] **Board Resolutions**
  - Все решения board of directors
  - Funding rounds
  - Major contracts
  - Hiring key employees

- [ ] **Shareholder Meeting Minutes**
  - Все протоколы общих собраний акционеров

### 1.3 Funding Documents
- [ ] **Prior Funding Rounds (если есть)**
  - Term sheets
  - Investment agreements
  - SAFE notes / Convertible notes
  - Shareholder rights agreements
  - Voting agreements

- [ ] **Current Round Documents**
  - Term sheet (draft или signed)
  - Investment agreement (draft)
  - Disclosure schedules

## 2. Financial Documents

### 2.1 Financial Statements
- [ ] **Audited Financial Statements (если есть)**
  - Balance sheet
  - Income statement
  - Cash flow statement
  - Последние 3 года (или с inception)

- [ ] **Management Accounts**
  - Monthly P&L
  - Balance sheet
  - Cash flow
  - Последние 12-24 месяца

- [ ] **Financial Model**
  - 5-year projection
  - Assumptions documented
  - Scenario analysis (conservative, base, optimistic)
  - См. `docs/finance/financial_model.csv`

### 2.2 Budget & Forecasts
- [ ] **Annual Budget**
  - Current year
  - Next year (draft)

- [ ] **Cash Flow Forecast**
  - Monthly для следующих 18 месяцев
  - Runway calculation

- [ ] **Use of Funds**
  - Детальный breakdown текущего раунда
  - Milestones tied to funding

### 2.3 Banking & Debt
- [ ] **Bank Statements**
  - Последние 6 месяцев
  - Все счета

- [ ] **Loan Agreements (если есть)**
  - Terms
  - Repayment schedule
  - Covenants

- [ ] **Credit Cards**
  - Corporate credit cards
  - Limits
  - Statements

### 2.4 Taxes
- [ ] **Tax Returns**
  - Последние 3 года (или с inception)
  - VAT returns (если applicable)

- [ ] **Tax Correspondence**
  - Любые взаимодействия с налоговыми органами
  - Audits (если были)
  - Rulings

## 3. Legal Documents

### 3.1 Contracts
- [ ] **Customer Contracts (B2B, если есть)**
  - All signed agreements
  - Master service agreements
  - SOWs (Statements of Work)

- [ ] **Vendor / Supplier Contracts**
  - Cloud providers (AWS, GCP, Azure)
  - SaaS subscriptions
  - Professional services (legal, accounting)

- [ ] **Partnership Agreements**
  - Schools, NGOs
  - Content partners
  - Distribution partners

- [ ] **NDAs (Non-Disclosure Agreements)**
  - Со всеми parties
  - Mutual и one-way

### 3.2 Terms & Policies
- [ ] **Terms of Service / Terms of Use**
  - Current version
  - Version history
  - Date of last update

- [ ] **Privacy Policy**
  - COPPA compliant
  - GDPR compliant (если EU users)
  - См. `docs/legal/privacy_policy_draft.md`

- [ ] **Content Policy**
  - Moderation rules
  - Prohibited content
  - См. `docs/legal/content_policy.md`

- [ ] **Cookie Policy (если web app)**

- [ ] **Acceptable Use Policy**

### 3.3 Insurance
- [ ] **General Liability Insurance**
  - Policy documents
  - Coverage limits
  - Premium amount

- [ ] **Cyber Insurance (рекомендуется)**
  - Coverage для data breaches
  - Policy documents

- [ ] **D&O Insurance (Directors & Officers)**
  - Если есть board

### 3.4 Litigation & Disputes
- [ ] **Litigation Register**
  - Current litigation (если есть)
  - Past litigation
  - Potential disputes
  - **Для startup:** Likely "None" - но document это

- [ ] **Regulatory Correspondence**
  - Любые письма от regulators
  - FTC (US), Роскомнадзор (RU), etc.

## 4. Intellectual Property (IP)

### 4.1 Trademarks
- [ ] **Trademark Registrations**
  - "Rork-Kiku" brand
  - Logo
  - Jurisdiction (RU, US, EU, etc.)
  - Registration numbers
  - Status (pending, registered)

- [ ] **Trademark Search Reports**
  - Prior art search
  - Clearance opinions

### 4.2 Patents (если applicable)
- [ ] **Patent Applications**
  - Provisional / Non-provisional
  - Patent numbers
  - Claims

- [ ] **Patent Strategy Document**

**Примечание:** Для software startup, patents обычно не critical, но если есть novel ML algorithms, consider patenting.

### 4.3 Copyrights
- [ ] **Copyright Registrations (если есть)**
  - Software code
  - Content (documentation, images)

### 4.4 Domain Names
- [ ] **Domain Portfolio**
  - All registered domains
  - Registrar information
  - Expiration dates
  - Transfer codes (в secure location)

### 4.5 Open Source
- [ ] **Open Source Software Inventory**
  - All open source dependencies
  - Licenses (MIT, Apache, GPL, etc.)
  - Compliance report (no GPL in production)

- [ ] **Open Source Policy**
  - Guidelines для developers
  - Approval process для new dependencies

### 4.6 IP Assignment
- [ ] **IP Assignment Agreements**
  - All founders
  - All employees
  - All contractors
  - **Критично:** Все, кто писал код, должны signed IP assignment

- [ ] **Work-for-Hire Agreements**
  - Contractors, freelancers, agencies

## 5. HR & Team Documents

### 5.1 Founders
- [ ] **Founder Agreements**
  - Roles & responsibilities
  - Equity split
  - Vesting schedule (typically 4 years, 1-year cliff)
  - IP assignment

- [ ] **Founder Biographies / CVs**
  - Education
  - Work history
  - Relevant experience

### 5.2 Employees
- [ ] **Employment Contracts**
  - All full-time employees
  - Signed copies

- [ ] **Employee Handbook**
  - Company policies
  - Code of conduct
  - Benefits

- [ ] **Offer Letters**
  - All employees

- [ ] **Equity Grant Letters / Option Agreements**
  - If employees have stock options
  - Vesting schedules
  - Exercise terms

- [ ] **Confidentiality & IP Assignment Agreements**
  - **Критично:** Every employee must sign

### 5.3 Contractors & Consultants
- [ ] **Contractor Agreements**
  - All freelancers, consultants
  - SOW (Scope of Work)
  - IP assignment clauses

- [ ] **Advisor Agreements**
  - Terms of engagement
  - Compensation (cash, equity, both)
  - IP assignment

### 5.4 Organization Chart
- [ ] **Org Chart**
  - Current structure
  - Reporting lines
  - Planned hires

### 5.5 Compensation
- [ ] **Salary & Compensation Review**
  - Current salaries (anonymized summary)
  - Benchmarking против market

- [ ] **Bonus / Incentive Plans**
  - If applicable

## 6. Technical Documentation

### 6.1 Product
- [ ] **Product Roadmap**
  - См. `docs/roadmap/roadmap.md`

- [ ] **Architecture Documentation**
  - См. `docs/architecture/architecture.md`
  - Architecture diagrams

- [ ] **API Documentation**
  - Endpoints, parameters, responses
  - См. `docs/mvp/mvp_spec.md`

### 6.2 Security & Compliance
- [ ] **Security Design Document**
  - См. `docs/security/security_design.md`

- [ ] **Security Audit Reports**
  - Penetration testing results
  - Vulnerability scan reports
  - Remediation status

- [ ] **Compliance Certifications (если есть)**
  - SOC 2 (unlikely для early-stage, но goal)
  - ISO 27001
  - GDPR compliance assessment

- [ ] **Data Protection Impact Assessment (DPIA)**
  - Required для GDPR если обрабатываются children's data
  - Template available от GDPR authorities

- [ ] **Incident Response Plan**
  - См. `docs/security/security_design.md` (Incident Response section)

### 6.3 Infrastructure
- [ ] **Infrastructure Diagram**
  - Cloud architecture (AWS/GCP/Azure)
  - Network topology

- [ ] **Disaster Recovery Plan**
  - Backup strategy
  - RTO / RPO targets
  - Failover procedures

- [ ] **Infrastructure Costs**
  - Current monthly spend
  - Projected spend at scale

### 6.4 Code & Repositories
- [ ] **Code Repository Access**
  - GitHub organization
  - Repository list
  - Access controls (who has admin access)

- [ ] **Code Review Process**
  - PR guidelines
  - CI/CD pipeline

- [ ] **Test Coverage Report**
  - Unit tests
  - Integration tests
  - Coverage percentage

## 7. Commercial Documents

### 7.1 Customers (if B2B)
- [ ] **Customer List**
  - Company names (anonymized если NDA required)
  - Contract value
  - Start date, end date

- [ ] **Customer Contracts**
  - Top 10 customers (by revenue)

- [ ] **Pipeline**
  - Potential customers
  - Stage of negotiation
  - Expected close date

### 7.2 Partnerships
- [ ] **Partnership List**
  - Schools, NGOs, influencers
  - Status (active, pending, inactive)

- [ ] **Partnership Agreements**
  - Signed contracts

- [ ] **Case Studies / Testimonials**
  - Customer success stories
  - User quotes

### 7.3 Metrics & KPIs
- [ ] **Product Metrics Dashboard**
  - MAU (Monthly Active Users)
  - DAU (Daily Active Users)
  - Retention cohorts
  - Engagement metrics
  - Churn rate

- [ ] **Financial Metrics Dashboard**
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - CAC (Customer Acquisition Cost)
  - LTV (Lifetime Value)
  - LTV:CAC ratio
  - Burn rate

### 7.4 Marketing
- [ ] **Marketing Plan**
  - Channels
  - Budget allocation
  - Expected ROI

- [ ] **Marketing Materials**
  - Pitch deck (см. `docs/investors/pitch_deck.md`)
  - One-pager (см. `docs/investors/one_pager.md`)
  - Website screenshots
  - App screenshots

## 8. Compliance & Regulatory

### 8.1 COPPA Compliance (US)
- [ ] **COPPA Compliance Checklist**
  - Privacy notice
  - Parental consent mechanism
  - Data collection practices
  - Opt-out procedures

- [ ] **FTC Correspondence (если есть)**

### 8.2 GDPR Compliance (EU)
- [ ] **GDPR Compliance Checklist**
  - Legal basis для processing
  - Data processing agreements (DPA) с vendors
  - Data subject rights procedures
  - Breach notification procedure

- [ ] **Data Processing Agreements**
  - Со всеми third-party processors (AWS, analytics tools, etc.)

- [ ] **Data Processing Register**
  - What data is collected
  - Why (purpose)
  - How long retained
  - Who has access

### 8.3 Other Regulations
- [ ] **App Store Guidelines Compliance**
  - iOS: Apple App Store Review Guidelines
  - Android: Google Play Store policies

- [ ] **Payment Processing Compliance**
  - PCI DSS (если обрабатываем credit cards)
  - Documentation от payment provider (Stripe, etc.)

## 9. Miscellaneous

### 9.1 Press & Media
- [ ] **Press Coverage**
  - Articles, blog posts, mentions
  - PDF copies

- [ ] **Press Kit**
  - Company description
  - Founder photos
  - Logo assets
  - Contact information

### 9.2 Presentations
- [ ] **Investor Presentations**
  - All versions pitch deck
  - Dates presented

- [ ] **Demo Day Presentations (если applicable)**

### 9.3 Correspondence
- [ ] **Key Email Threads**
  - Important negotiations
  - Investor communications
  - Major decisions

### 9.4 Operational
- [ ] **Office Lease Agreement (если есть офис)**
  - Terms, rent, duration

- [ ] **Equipment Inventory**
  - Laptops, servers, etc.
  - Assigned to whom

- [ ] **Software Licenses**
  - All SaaS subscriptions
  - GitHub, Figma, Slack, etc.
  - Monthly/annual costs

## Data Room Management

### Access Control
- **Platform:** Google Drive (Business), Dropbox, или dedicated data room solution (Carta, Visible, DealRoom)
- **Permissions:** Read-only для investors, редактировать только founders/admins
- **Logging:** Track кто и что просматривал

### Document Naming Convention
```
[Category]-[Subcategory]-[Document Name]-[Date if applicable].pdf

Examples:
01-Corporate-Certificate_of_Incorporation-2025-01-15.pdf
03-Legal-Terms_of_Service-v2.1-2026-01-01.pdf
05-HR-Employee_Contract-John_Doe-2025-06-01.pdf
```

### Version Control
- Используйте version numbers в filename
- Keep history предыдущих versions
- Document change log

### Redaction
- Redact sensitive personal information (SSN, passport numbers)
- Redact commercially sensitive info (pricing, если required)
- But: Be transparent - over-redaction raises red flags

### Regular Updates
- **Frequency:** Monthly review и update
- **Owner:** Назначить data room manager (обычно CFO или CEO)
- **Checklist:** Review this checklist каждый месяц

### Preparation Timeline
**Pre-Seed Fundraise:**
- Start preparing data room 2 months перед active fundraising
- Core documents должны быть готовы за 4 weeks

**Due Diligence Process:**
- Usually 2-4 weeks для Pre-Seed
- Longer для larger rounds

## Checklist Status Tracking

**Status Categories:**
- ✅ **Complete:** Document готов и uploaded
- 🔄 **In Progress:** Working on it
- ⏳ **Planned:** Scheduled для preparation
- ❌ **Not Applicable:** Не relevant для нашей stage
- ⚠️ **Missing:** Нужно, но пока нет

## Next Steps

1. **Assign Owner:** Кто-то (обычно CEO или CFO) responsible за data room
2. **Create Folder Structure:** Set up в Google Drive или другой платформе
3. **Prioritize:** Start с corporate, legal, и financial documents
4. **Weekly Progress:** Review progress каждую неделю
5. **Mock Due Diligence:** Попросите advisor или lawyer провести mock due diligence

---

**Примечание:** Этот checklist comprehensive, и не все items могут быть relevant для early-stage startup. Prioritize based на вашу текущую stage и немедленные fundraising needs.

**ВАЖНО:** Никогда не включайте в data room:
- Employee SSN, passport numbers (redact)
- Bank account numbers (redact)
- API keys, passwords, secrets
- Customer PII без explicit permission

**Контакт для вопросов:** [FOUNDERS_EMAIL]

**Related Documents:**
- `docs/templates/dataroom_template.md` - Template для организации
- `docs/finance/financial_model.csv` - Financial projections
- `docs/investors/pitch_deck.md` - Investor presentation
