# Data Room Checklist для Rork-Kiku

## Обзор

Data room — это защищённая виртуальная комната для хранения критически важных документов компании, предоставляемых инвесторам и партнёрам во время due diligence процесса. Данный checklist содержит список документов, которые должны быть подготовлены для seed раунда и последующих раундов финансирования.

**Статус**: 🟡 В процессе подготовки (большинство документов в draft)

---

## 1. Корпоративные документы (Corporate Documents)

### 1.1 Учредительные документы

- [ ] **Устав компании** (Articles of Incorporation / Charter)
  - Текущая версия
  - История изменений (если есть)
  
- [ ] **Учредительный договор** (если применимо)
  - Оригинал
  - Подписанная копия

- [ ] **Свидетельство о регистрации** (Certificate of Incorporation)
  - Выписка из ЕГРЮЛ/ЕГРИП (Россия)
  - Certificate of Good Standing (если US entity)

- [ ] **Лицензии и разрешения**
  - Лицензии на деятельность (если требуются)
  - Разрешения регуляторов

**Статус**: 🔴 Не готово (компания ещё не зарегистрирована в full capacity для pilot)

---

### 1.2 Cap Table и Акционеры

- [ ] **Cap Table** (Таблица капитализации)
  - Текущая структура ownership
  - История dilution events
  - Vesting schedules для founders и team
  - Options pool size и allocation

- [ ] **Акционерное соглашение** (Shareholders Agreement)
  - Rights, preferences, privileges
  - Voting rights
  - Transfer restrictions
  - Drag-along, tag-along provisions

- [ ] **Опционные планы** (Stock Option Plans / ESOP)
  - Plan documents
  - Individual option agreements
  - Exercise price methodology

- [ ] **SAFE/Convertible notes** (если есть)
  - Terms и conditions
  - Cap, discount, valuation
  - Conversion mechanics

**Статус**: 🟡 Частично (cap table в process, остальное после seed)

---

### 1.3 Управление и governance

- [ ] **Протоколы заседаний совета директоров** (Board Minutes)
  - Все meetings с момента основания
  - Резолюции и decisions

- [ ] **Протоколы общих собраний акционеров** (Shareholder Meetings)
  - Annual meetings
  - Extraordinary meetings

- [ ] **Bylaws** (Внутренние правила)
  - Правила управления компанией
  - Процедуры принятия решений

**Статус**: 🔴 Не готово (early stage, limited governance)

---

## 2. Интеллектуальная собственность (Intellectual Property)

### 2.1 IP Assignment

- [ ] **IP Assignment Agreement от founders**
  - Все IP созданный до регистрации компании переходит компании
  - Signed by all founders

- [ ] **IP Assignment Agreement от сотрудников**
  - Template agreement
  - Подписанные копии от всех FTE
  - Подтверждение, что work-for-hire принадлежит компании

- [ ] **IP Assignment Agreement от contractors**
  - Freelancers, consultants, agencies
  - Подтверждение ownership code, designs, etc.

**Статус**: 🟡 Частично (founder agreements в draft, employee/contractor TBD)

---

### 2.2 Товарные знаки и патенты

- [ ] **Trademark registrations**
  - "Rork-Kiku" trademark application/registration
  - Logo trademark
  - Jurisdiction: Russia, US, EU (target markets)

- [ ] **Patent applications** (если применимо)
  - ML модель innovations (если патентуемо)
  - Provisional/Non-provisional patents
  - PCT (Patent Cooperation Treaty) applications

- [ ] **Copyright registrations** (опционально)
  - Software code (если registered)
  - Original content (branding materials)

**Статус**: 🔴 Не готово (trademark application планируется после seed)

---

### 2.3 Третьесторонние лицензии

- [ ] **Open source licenses**
  - List всех open source dependencies
  - License compliance (MIT, Apache, GPL, etc.)
  - No GPL contamination в proprietary code

- [ ] **Third-party software licenses**
  - AWS, GCP, Firebase, etc. (ToS compliance)
  - SDKs (Apple, Google)
  - Paid tools (Figma, GitHub Enterprise, etc.)

**Статус**: 🟢 Готово (documented в codebase)

---

## 3. Финансы (Financial Documents)

### 3.1 Финансовая отчётность

- [ ] **Balance Sheet** (Баланс)
  - Ежегодные с момента основания
  - Ежеквартальные (если есть)

- [ ] **Income Statement** (Отчёт о прибылях и убытках)
  - Ежегодные
  - Ежеквартальные

- [ ] **Cash Flow Statement** (Отчёт о движении денежных средств)
  - Ежегодные
  - Ежеквартальные

- [ ] **Audit reports** (если проводился audit)
  - Independent auditor's report
  - Management letter

**Статус**: 🟡 Частично (minimal financial history в early stage)

---

### 3.2 Бюджеты и прогнозы

- [ ] **Financial model**
  - 5-year projections
  - Assumptions documented
  - Sensitivity analysis
  - См. `docs/finance/financial_model.csv`

- [ ] **Annual budget**
  - Current year
  - Next year

- [ ] **Cap table projections**
  - Dilution scenarios
  - Future funding rounds modeling

**Статус**: 🟢 Готово (см. docs/finance/)

---

### 3.3 Налоги и compliance

- [ ] **Tax returns**
  - Все годы с момента основания
  - Corporate income tax
  - VAT/Sales tax (если применимо)

- [ ] **Tax compliance certificates**
  - No outstanding tax liabilities
  - Tax clearance certificates

- [ ] **Payroll records**
  - Salary structure
  - Payroll tax compliance

**Статус**: 🔴 Не готово (early stage, TBD после seed)

---

## 4. Контракты (Contracts)

### 4.1 Клиентские контракты

- [ ] **Enterprise contracts** (если есть)
  - Schools, НКО partnerships
  - Terms, pricing, SLAs

- [ ] **Terms of Service** (ToS)
  - Current version
  - История изменений
  - User acceptance records

- [ ] **Privacy Policy**
  - Current version
  - COPPA/GDPR compliant
  - См. `docs/legal/privacy_policy_draft.md`

**Статус**: 🟡 Частично (ToS/Privacy в draft, no enterprise contracts yet)

---

### 4.2 Vendor и supplier контракты

- [ ] **Cloud provider agreements**
  - AWS/GCP contracts
  - Pricing, commitments, credits

- [ ] **SaaS subscriptions**
  - GitHub, Figma, Slack, etc.
  - Annual vs monthly

- [ ] **Consulting agreements**
  - Legal, accounting, advisors
  - Scope, fees, IP assignment

**Статус**: 🟡 Частично (basic subscriptions, major contracts TBD)

---

### 4.3 Трудовые договоры

- [ ] **Employment agreements**
  - Founders (если employed)
  - FTE employees
  - Salary, benefits, vesting, IP assignment, non-compete

- [ ] **Contractor agreements**
  - Freelancers, part-time
  - Scope of work, IP assignment

- [ ] **Advisor agreements**
  - Compensation (cash, equity)
  - Scope of advice
  - Term и termination

**Статус**: 🟡 Частично (founder agreements в draft, employee TBD after seed)

---

## 5. Юридические и compliance (Legal & Compliance)

### 5.1 Privacy и Data Protection

- [ ] **Privacy Policy** (публичная)
  - См. `docs/legal/privacy_policy_draft.md`
  - COPPA/GDPR/CCPA compliant

- [ ] **Data Processing Agreement (DPA)**
  - Для partnerships с школами/НКО
  - GDPR Article 28 compliant

- [ ] **Cookie Policy** (если веб-приложение)

- [ ] **Data Protection Impact Assessment (DPIA)**
  - Для обработки детских данных
  - Risk assessment и mitigation

**Статус**: 🟡 Частично (drafts готовы, требуется legal review)

---

### 5.2 Content moderation и safety

- [ ] **Content Policy**
  - Что запрещено, что разрешено
  - См. `docs/legal/content_policy.md`

- [ ] **Moderation guidelines**
  - Internal playbook для модераторов
  - Эскалация procedures

- [ ] **Incident response план**
  - Child safety incidents
  - Data breaches
  - См. `docs/security/security_design.md`

**Статус**: 🟡 Частично (drafts готовы, требуется legal review)

---

### 5.3 Регуляторные compliance

- [ ] **COPPA compliance documentation**
  - Verifiable parental consent process
  - Data minimization practices
  - FTC compliance attestation

- [ ] **GDPR compliance documentation**
  - Lawful basis for processing
  - Data subject rights procedures
  - DPO (Data Protection Officer) appointment (если требуется)

- [ ] **CCPA compliance** (если California users)
  - "Do Not Sell My Info" mechanism
  - Consumer rights procedures

**Статус**: 🟡 Частично (процессы документированы, формальный audit TBD)

---

### 5.4 Litigation и disputes

- [ ] **Pending litigation** (если есть)
  - Court documents
  - Legal memos
  - Potential exposure

- [ ] **Past litigation** (если было)
  - Judgments, settlements
  - Releases

- [ ] **Claims и threats** (если есть)
  - Cease and desist letters
  - IP infringement claims
  - Response letters

**Статус**: 🟢 Готово (N/A - no litigation)

---

## 6. Insurance (Страхование)

- [ ] **General Liability Insurance**
  - Coverage amount
  - Policy period
  - Exclusions

- [ ] **Cyber Liability Insurance**
  - Data breach coverage
  - Cyber extortion coverage

- [ ] **Directors & Officers (D&O) Insurance**
  - Coverage для founders и board

- [ ] **Workers' Compensation** (если required)

**Статус**: 🔴 Не готово (планируется после seed)

---

## 7. Продуктовая и техническая документация (Product & Technical)

### 7.1 Архитектура и дизайн

- [ ] **Architecture documentation**
  - См. `docs/architecture/architecture.md`
  - System design diagrams

- [ ] **MVP specification**
  - См. `docs/mvp/mvp_spec.md`
  - Feature requirements

- [ ] **Security design**
  - См. `docs/security/security_design.md`
  - Threat model

**Статус**: 🟢 Готово (см. docs/)

---

### 7.2 Code и development

- [ ] **Source code access**
  - GitHub repo access для due diligence (read-only)
  - Branch structure

- [ ] **Code quality reports**
  - SonarQube, CodeClimate
  - Code coverage (unit tests)

- [ ] **Dependency audit**
  - NPM audit, Snyk
  - No critical vulnerabilities

**Статус**: 🟡 Частично (code ready, audits TBD)

---

### 7.3 Infrastructure

- [ ] **Infrastructure as Code (IaC)**
  - Terraform/Pulumi configs
  - Deployment scripts

- [ ] **CI/CD pipelines**
  - GitHub Actions workflows
  - См. `docs/infra/ci_cd.md`

- [ ] **Disaster recovery plan**
  - Backup procedures
  - RTO/RPO targets

**Статус**: 🟡 Частично (basic setup, production-grade TBD)

---

## 8. Маркетинг и GTM (Marketing & Go-to-Market)

### 8.1 Brand materials

- [ ] **Brand guidelines**
  - См. `docs/branding/brand-guidelines.md`
  - Logo files, color palette

- [ ] **Marketing collateral**
  - Pitch deck (см. `docs/investors/pitch_deck.md`)
  - One-pager (см. `docs/investors/one_pager.md`)
  - Website copy

**Статус**: 🟢 Готово (см. docs/)

---

### 8.2 GTM Strategy

- [ ] **Go-to-Market plan**
  - Target audience
  - Channels
  - Messaging

- [ ] **Partnership agreements** (если есть)
  - Schools, НКО
  - Terms, co-marketing

- [ ] **Press kit**
  - Press releases
  - Media mentions

**Статус**: 🟡 Частично (strategy documented, no partnerships yet)

---

## 9. Люди и культура (People & Culture)

### 9.1 Team

- [ ] **Org chart**
  - Current structure
  - Future hiring plan
  - См. `docs/team/team_roles.md`

- [ ] **Резюме key employees**
  - Founders, C-level
  - Key engineers

- [ ] **References**
  - Для founders (если applicable)
  - Background checks

**Статус**: 🟡 Частично (team roles documented, minimal team currently)

---

### 9.2 Culture и policies

- [ ] **Employee handbook**
  - Code of conduct
  - HR policies

- [ ] **Compensation philosophy**
  - Salary bands
  - Equity guidelines

- [ ] **Diversity & Inclusion policy**

**Статус**: 🔴 Не готово (early stage, TBD after hiring)

---

## 10. Due Diligence вопросы (Common DD Questions)

Инвесторы часто задают следующие вопросы. Подготовьте ответы заранее:

### Product
- Что уникального в вашем продукте?
- Как вы валидировали product-market fit?
- Каковы ключевые метрики (DAU, retention, NPS)?

### Market
- Размер рынка (TAM/SAM/SOM)?
- Кто ваши конкуренты?
- Какова ваша differentiation?

### Business Model
- Как вы зарабатываете деньги?
- Каков ваш unit economics (LTV/CAC)?
- Когда ожидаете break-even?

### Team
- Почему вы — right team для этой проблемы?
- Какой опыт у founders?
- Кого планируете нанять?

### Financials
- Сколько вы уже потратили?
- На что пойдут привлечённые средства?
- Какой runway вам нужен до следующего раунда?

### Legal/Compliance
- Есть ли pending litigation?
- Compliance с COPPA/GDPR?
- Кто владеет IP?

---

## Рекомендации по организации Data Room

### Платформы для data room

**Recommended**:
- **DocSend** (by Dropbox) — простой, tracking analytics
- **Google Drive** (secure sharing) — бесплатно, familiar
- **Carta** (для cap table + data room)

**Enterprise-grade** (для Series B+):
- **Firmex**, **Intralinks**, **Merrill DataSite**

### Структура папок

```
/Data_Room_Rork-Kiku/
├── 01_Corporate/
│   ├── Articles_of_Incorporation.pdf
│   ├── Cap_Table.xlsx
│   └── Board_Minutes/
├── 02_IP/
│   ├── IP_Assignment_Founders.pdf
│   ├── Trademark_Application.pdf
│   └── Open_Source_Licenses.xlsx
├── 03_Financial/
│   ├── Financial_Statements/
│   ├── Financial_Model.xlsx
│   └── Tax_Returns/
├── 04_Contracts/
│   ├── Employment_Agreements/
│   ├── Vendor_Contracts/
│   └── ToS_Privacy_Policy.pdf
├── 05_Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── COPPA_Compliance_Doc.pdf
│   └── GDPR_DPIA.pdf
├── 06_Insurance/
│   └── Insurance_Policies.pdf
├── 07_Product_Technical/
│   ├── Architecture_Docs/
│   ├── MVP_Spec.pdf
│   └── Security_Design.pdf
├── 08_Marketing/
│   ├── Pitch_Deck.pdf
│   ├── One_Pager.pdf
│   └── Brand_Guidelines.pdf
├── 09_People/
│   ├── Org_Chart.pdf
│   ├── Team_Resumes.pdf
│   └── Employee_Handbook.pdf
└── 10_Misc/
    └── FAQ.pdf
```

### Access control

- **Read-only** access для investors
- **Watermarks** на sensitive documents (опционально)
- **NDA** перед доступом к data room
- **Audit log** — track кто что просматривал и когда

---

## Timeline для подготовки data room

| Milestone | Timeframe | Ответственный |
|-----------|-----------|---------------|
| Corporate docs | Before seed pitch | Founder/Legal |
| Financial model | Before seed pitch | Founder/CFO |
| IP assignments | Before seed pitch | Founder/Legal |
| Privacy/Compliance drafts | Before seed pitch | Founder/Legal |
| Product docs | Before seed pitch | CTO/Team |
| Full data room | During seed DD (2-4 weeks) | Founder |
| Legal review | During seed DD | External counsel |
| Final sign-off | Before term sheet signing | Board |

---

## Контакты для подготовки

**Legal counsel**: [TBD — нанять после seed или раньше если critical]  
**Accounting/Tax**: [TBD — bookkeeper или CPA]  
**Data room platform**: [TBD — выбрать между DocSend, Carta, Google Drive]

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Это черновой checklist. Актуализировать по мере подготовки документов к seed раунду.
