# Data Room Checklist для kiku

## Введение

Data room — это защищённое хранилище документов, предоставляемое потенциальным инвесторам на стадии due diligence. Данный checklist содержит список всех документов, которые должны быть подготовлены для успешного fundraising раунда.

**Целевая аудитория:** Seed/Series A investors

**Формат:** Virtual Data Room (Google Drive, Dropbox, или специализированные платформы типа DocSend, Carta)

---

## 1. Учредительные документы (Corporate Documents)

### 1.1 Регистрация компании

- [ ] **Свидетельство о регистрации юридического лица**
  - Дата регистрации: [PLACEHOLDER]
  - Юрисдикция: [PLACEHOLDER — US/Delaware, UK, Cyprus, Russia]
  - ОГРН/Registration number: [PLACEHOLDER]

- [ ] **Устав компании (Articles of Incorporation/Charter)**
  - Current version + все amendments
  - Authorized shares: [PLACEHOLDER]

- [ ] **Решение о создании компании (Board resolution)**

### 1.2 Налоговые документы

- [ ] **ИНН/Tax ID**
- [ ] **Налоговая отчётность** (за последние 2 года, если применимо)
- [ ] **Status as tax-resident** (если требуется для юрисдикции)

### 1.3 Лицензии и разрешения

- [ ] **Business licenses** (если требуются для software company)
- [ ] **Data processing licenses** (если требуются по GDPR/local laws)
- [ ] **COPPA compliance certification** (если applicable)

---

## 2. Cap Table (Структура акционерного капитала)

### 2.1 Current Cap Table

- [ ] **Детальная таблица акционеров**
  - Имена всех акционеров
  - Количество и тип акций (common, preferred)
  - % ownership
  - Vesting schedule (для founders и employees)

- [ ] **Convertible notes** (если применимо)
  - Сумма, дата, terms (discount, cap)

- [ ] **SAFEs** (Simple Agreement for Future Equity, если применимо)
  - Сумма, дата, valuation cap, discount

### 2.2 Option Pool

- [ ] **Employee stock option plan (ESOP)**
  - Size of option pool: [PLACEHOLDER — 10-15%]
  - Options granted to date
  - Options available

- [ ] **Stock option agreements** (для всех grantees)

### 2.3 Previous Financing Rounds

- [ ] **Term sheets** (от всех предыдущих раундов)
- [ ] **Closing documents** (Stock Purchase Agreements, Subscription Agreements)
- [ ] **Board resolutions** (approving each round)

---

## 3. Intellectual Property (IP)

### 3.1 Патенты и Trademarks

- [ ] **Trademark registrations**
  - Logo, brand name "kiku"
  - Status: [PLACEHOLDER — pending/registered]
  - Jurisdictions: [PLACEHOLDER]

- [ ] **Patent applications** (если applicable)
  - Описание: [PLACEHOLDER — ML algorithms, unique features]
  - Status: pending/granted

- [ ] **Domain names**
  - kiku-app.com (или аналогичные)
  - Registration dates, renewal dates

### 3.2 Software и Code

- [ ] **Source code ownership**
  - Подтверждение, что вся codebase принадлежит компании
  - IP assignment agreements от всех developers

- [ ] **Open-source licenses**
  - List of all open-source libraries used
  - License types (MIT, Apache, GPL — убедиться, что no GPL contamination)

- [ ] **Third-party software agreements**
  - OpenAI API terms
  - AWS terms
  - Expo/React Native licenses

### 3.3 IP Assignment Agreements

- [ ] **IP assignment от founders**
  - Все IP, созданный до/во время основания компании, принадлежит компании

- [ ] **IP assignment от contractors/consultants**
  - Все work-for-hire agreements

---

## 4. Privacy Policy, Terms of Service, Data Policies

### 4.1 User-facing Documents

- [ ] **Privacy Policy**
  - Current version + все предыдущие versions
  - Дата последнего обновления
  - Compliance: COPPA, GDPR-K

- [ ] **Terms of Service**
  - User agreement
  - Acceptable use policy
  - Disclaimer of warranties

- [ ] **Cookie Policy** (если applicable для web версии)

### 4.2 Data Processing Agreements

- [ ] **DPA с ML providers** (OpenAI, AWS Rekognition)
  - Подтверждение, что они не хранят детские данные
  - COPPA/GDPR compliance

- [ ] **DPA с cloud providers** (AWS, Google Cloud)
  - Data location (где хранятся данные)
  - Encryption, security measures

### 4.3 Internal Data Policies

- [ ] **Data retention policy**
  - Сколько времени хранятся данные
  - Процесс удаления (automated deletion)

- [ ] **Data breach response plan**
  - Runbook для security incidents
  - Communication plan для пользователей

- [ ] **Employee data access policy**
  - Кто имеет доступ к user data
  - Audit logs

---

## 5. Security Audits и Compliance

### 5.1 Security Audits

- [ ] **Penetration testing reports**
  - От внешней security firm
  - Дата: [PLACEHOLDER]
  - Результаты: vulnerabilities found and fixed

- [ ] **Vulnerability scanning reports**
  - Dependabot/Snyk reports
  - No critical vulnerabilities

- [ ] **Code security review**
  - SonarQube/similar tool reports
  - Code quality metrics

### 5.2 Compliance Certifications

- [ ] **COPPA Compliance Statement**
  - Описание мер для compliance
  - Parental consent процесс
  - No third-party data sharing

- [ ] **GDPR-K Compliance Statement**
  - Data processing lawfulness
  - Right to erasure implementation
  - Data portability

- [ ] **SOC 2 Report** (если applicable, обычно для более зрелых компаний)
  - Type I или Type II
  - Security, availability, confidentiality controls

### 5.3 Insurance

- [ ] **Cyber liability insurance**
  - Coverage amount: [PLACEHOLDER]
  - Provider: [PLACEHOLDER]

- [ ] **Errors and omissions (E&O) insurance**

- [ ] **General liability insurance**

---

## 6. ML Data Policies и Ethics

### 6.1 Training Data

- [ ] **Data collection consent**
  - Подтверждение, что все training data собраны с согласия
  - Anonymization процесс

- [ ] **Data labeling practices**
  - Кто занимается labeling (in-house или outsourced)
  - Quality control

- [ ] **Bias mitigation**
  - Diversity of training data
  - Fairness metrics

### 6.2 Model Documentation

- [ ] **Model cards** (описание каждой ML модели)
  - Intended use
  - Training data
  - Performance metrics (accuracy, precision, recall)
  - Known limitations

- [ ] **Explainability documentation**
  - Как models принимают решения
  - Transparency для parents

### 6.3 Ethics Board/Review

- [ ] **AI Ethics Policy**
  - Principles: fairness, transparency, accountability
  - Review process для new models

- [ ] **Child Safety Ethics**
  - Guidelines для работы с детским контентом
  - Moderator training и support

---

## 7. Contracts и Partnerships

### 7.1 Customer Contracts

- [ ] **B2C terms** (already covered in ToS)

- [ ] **B2B contracts** (если applicable)
  - Contracts со школами
  - Contracts со страховыми компаниями
  - Revenue share agreements

### 7.2 Vendor Contracts

- [ ] **Cloud provider agreements** (AWS, Google Cloud)
- [ ] **ML API agreements** (OpenAI, AWS Rekognition)
- [ ] **Payment processor** (Stripe, PayPal)
- [ ] **Support tools** (Intercom, Zendesk)

### 7.3 Partnerships

- [ ] **Partnership agreements** (с НКО, школами)
  - Terms of collaboration
  - Co-marketing rights

- [ ] **Advisor agreements**
  - Compensation (equity, cash)
  - Scope of work

### 7.4 Employment Contracts

- [ ] **Founder agreements**
  - Vesting schedules
  - IP assignment
  - Non-compete/non-solicit (если applicable)

- [ ] **Employee contracts**
  - Offer letters
  - NDAs (Non-Disclosure Agreements)
  - IP assignment

- [ ] **Contractor agreements**
  - SOWs (Statements of Work)
  - Payment terms

---

## 8. Финансовые документы (Financial Documents)

### 8.1 Financial Statements

- [ ] **Income statement** (P&L)
  - Последние 2 года (если применимо) + YTD

- [ ] **Balance sheet**

- [ ] **Cash flow statement**

- [ ] **Budget vs. Actuals**
  - Comparison план vs. факт

### 8.2 Cap Table Management

- [ ] **409A valuation** (для US companies, если applicable)
  - Дата последней оценки
  - Fair market value of common stock

- [ ] **Board-approved budget**
  - Current year budget
  - Next year projections

### 8.3 Tax Returns

- [ ] **Corporate tax returns** (последние 2 года, если applicable)

---

## 9. Corporate Governance

### 9.1 Board Documents

- [ ] **Board composition**
  - List of current board members
  - Independent vs. affiliated directors

- [ ] **Board meeting minutes**
  - Последние 12 месяцев
  - Key decisions (hiring, fundraising, product launches)

- [ ] **Board resolutions**
  - Authorizing financing rounds
  - Option grants
  - Major contracts

### 9.2 Shareholders Documents

- [ ] **Shareholders' agreement** (если applicable)
  - Rights and obligations
  - Drag-along, tag-along rights

- [ ] **Voting agreements**

### 9.3 Governance Policies

- [ ] **Code of conduct**
- [ ] **Whistleblower policy**
- [ ] **Conflict of interest policy**

---

## 10. Product и Technology

### 10.1 Product Roadmap

- [ ] **Current product documentation**
  - Features, specifications
  - Architecture diagrams

- [ ] **Product roadmap**
  - Next 12-24 months
  - Key milestones

### 10.2 Technical Documentation

- [ ] **System architecture document** (см. docs/architecture/architecture.md)
- [ ] **API documentation**
- [ ] **Infrastructure setup** (Terraform scripts, Kubernetes configs)

### 10.3 User Metrics

- [ ] **User growth data**
  - DAU, MAU, paying users
  - Cohort analysis

- [ ] **Engagement metrics**
  - Retention curves
  - Churn analysis

- [ ] **Unit economics**
  - CAC, LTV, payback period
  - Breakdown по каналам acquisition

---

## 11. Litigation и Disputes

### 11.1 Current and Past Litigation

- [ ] **Any ongoing lawsuits?**
  - Описание: [PLACEHOLDER — None/Pending]

- [ ] **Any past settlements?**

- [ ] **Any threatened litigation?**

### 11.2 Regulatory Inquiries

- [ ] **Any inquiries от regulators?** (FTC, ICO, Роскомнадзор, etc.)

---

## 12. References и Due Diligence

### 12.1 Customer References

- [ ] **List of pilot customers**
  - Contacts (с их согласия)
  - Testimonials

- [ ] **Case studies**

### 12.2 Partner References

- [ ] **Contacts в школах/НКО**

### 12.3 Employee References

- [ ] **Background checks** (для key employees)

---

## Организация Data Room

### Recommended Structure

```
/kiku-data-room/
├── 01-Corporate/
│   ├── Certificate_of_Incorporation.pdf
│   ├── Articles_of_Incorporation.pdf
│   ├── Board_Resolutions/
│   └── Tax_Documents/
├── 02-Cap_Table/
│   ├── Current_Cap_Table.xlsx
│   ├── Option_Pool.xlsx
│   └── Previous_Rounds/
├── 03-Intellectual_Property/
│   ├── Trademark_Registrations/
│   ├── IP_Assignment_Agreements/
│   └── Open_Source_Licenses.md
├── 04-Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── COPPA_Compliance_Statement.pdf
│   └── GDPR_Compliance_Statement.pdf
├── 05-Security_Audits/
│   ├── Pentest_Report_2026.pdf
│   ├── Vulnerability_Scan_Results.pdf
│   └── Security_Policies/
├── 06-Contracts/
│   ├── Customer_Contracts/
│   ├── Vendor_Contracts/
│   ├── Partnership_Agreements/
│   └── Employment_Contracts/
├── 07-Financial/
│   ├── Financial_Statements/
│   ├── Budget_vs_Actuals.xlsx
│   └── Tax_Returns/
├── 08-Governance/
│   ├── Board_Minutes/
│   ├── Shareholders_Agreements/
│   └── Governance_Policies/
├── 09-Product_Tech/
│   ├── Product_Roadmap.pdf
│   ├── Architecture_Documentation.md
│   └── User_Metrics_Dashboard.xlsx
├── 10-Litigation/
│   └── No_Litigation_Statement.pdf
└── 11-References/
    ├── Customer_Testimonials/
    └── Partner_Contacts.xlsx
```

### Access Control

- **Folder-level permissions:** Разные investors могут иметь доступ к разным уровням data room
- **View-only:** Investors не должны скачивать конфиденциальные документы (использовать DocSend или аналог с watermarks)
- **Audit trail:** Отслеживать, кто и когда просматривал документы

---

## Timing

**Когда готовить Data Room:**
- **Начинать сборку:** За 3-6 месяцев до fundraising
- **Finalize:** Перед первыми investor meetings
- **Update:** Регулярно (quarterly) по мере развития компании

**Due diligence timeline (типичный Seed round):**
- Week 1-2: Investor review основных документов
- Week 3-4: Deep dive (финансы, legal, tech)
- Week 5-6: Final negotiations, term sheet signing

---

## Примечания

- ⚠️ **Никаких секретов или API keys** в data room
- ⚠️ **Redact sensitive personal information** (например, Social Security Numbers founders)
- ⚠️ **Legal review** всех документов перед загрузкой в data room
- ⚠️ **NDA** должно быть подписано investors перед доступом к data room

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Legal & Finance Team  
**Статус:** Draft — требуется review legal counsel
