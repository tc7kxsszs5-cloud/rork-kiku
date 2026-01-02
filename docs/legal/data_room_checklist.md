# Data Room Checklist для Rork-Kiku

## Обзор

Данный документ содержит полный список документов, которые должны быть подготовлены для data room при due diligence инвесторами, партнёрами или в рамках аудита.

**ВАЖНО:** Data room должен быть организован в защищённом виртуальном хранилище (Dropbox, Google Drive с ограниченным доступом, или специализированные VDR сервисы типа Carta, Capshare).

---

## 1. Корпоративные документы

### 1.1 Учредительные документы

- [ ] **Устав компании** (Charter/Articles of Incorporation)
  - Оригинал и все amendments
  - Дата: [DATE]
  - Юрисдикция: [JURISDICTION]

- [ ] **Учредительный договор** (если LLC)
  - Operating Agreement
  - Signed by all members

- [ ] **Свидетельство о государственной регистрации**
  - Certificate of Incorporation
  - ИНН/ОГРН

- [ ] **Выписка из ЕГРЮЛ** (актуальная, < 30 дней)
  - Подтверждение регистрации и актуального состава

- [ ] **Протоколы общих собраний учредителей**
  - Все важные решения (issue shares, апрув бюджета, назначения)
  - Даты: [DATES]

- [ ] **Решение о выпуске акций/долей**
  - Share issuance resolutions
  - Stock certificates (если выпущены)

### 1.2 Структура собственности (Cap Table)

- [ ] **Капитализационная таблица (Cap Table)**
  - Текущая структура: founders, investors, option pool
  - Fully diluted cap table
  - Tool: Excel или Carta

- [ ] **Shareholders Agreement** (Соглашение акционеров)
  - Права акционеров
  - Drag-along, tag-along provisions
  - Voting rights
  - Transfer restrictions

- [ ] **Vesting schedule для founders и сотрудников**
  - Founder vesting agreements (4 years, 1 year cliff)
  - Employee stock option plan (ESOP)

- [ ] **Board composition and meeting minutes**
  - Состав совета директоров
  - Протоколы заседаний (если board сформирован)

---

## 2. Финансовые документы

### 2.1 Финансовая отчётность

- [ ] **Financial statements (last 2 years или с момента основания)**
  - Income Statement (P&L)
  - Balance Sheet
  - Cash Flow Statement
  - Quarterly и annual

- [ ] **Management accounts** (последние 6-12 месяцев)
  - Monthly breakdowns
  - Budget vs. actual

- [ ] **Бюджет и прогнозы**
  - Financial model (3-5 years)
  - Assumptions document
  - Sensitivity analysis
  - См. `docs/finance/financial_model.csv`

- [ ] **Аудиторские отчёты** (если проводились)
  - External audit reports
  - Management letters

- [ ] **Tax returns и налоговая отчётность**
  - Последние 2-3 года
  - НДС, налог на прибыль
  - Подтверждение отсутствия задолженностей

### 2.2 Банковские и финансовые отношения

- [ ] **Bank statements** (последние 12 месяцев)
  - Операционный счёт
  - Savings accounts

- [ ] **Loan agreements** (если есть займы)
  - Terms and conditions
  - Repayment schedule
  - Collateral

- [ ] **Lines of credit** (если есть)

- [ ] **Receivables and payables aging reports**
  - AR aging
  - AP aging

---

## 3. Инвестиционные документы

### 3.1 Предыдущие раунды финансирования (если есть)

- [ ] **Investment agreements**
  - SAFE, Convertible Notes, Equity
  - Terms and conditions
  - Valuation caps, discounts

- [ ] **Term sheets** (все раунды)
  - Pre-seed, Seed, Series A (если есть)

- [ ] **Investor rights agreements**
  - Information rights
  - Pro-rata rights
  - Board observer rights

- [ ] **Список всех инвесторов**
  - Имена, emails, суммы инвестиций
  - Contact information

### 3.2 Текущий раунд

- [ ] **Pitch deck** (актуальная версия)
  - См. `docs/investors/pitch_deck.md`

- [ ] **One-pager**
  - См. `docs/investors/one_pager.md`

- [ ] **Executive summary**

- [ ] **FAQ для инвесторов**

---

## 4. Интеллектуальная собственность (IP)

### 4.1 IP Assignment

- [ ] **IP Assignment Agreements** от всех founders и сотрудников
  - Подтверждение, что вся IP принадлежит компании
  - Signed by all contributors

- [ ] **Contractor IP agreements**
  - Work-for-hire clauses
  - IP ownership transfer

### 4.2 Регистрации и заявки

- [ ] **Trademark registrations** (если есть)
  - "Rork-Kiku" brand
  - Logo
  - Jurisdiction: [JURISDICTION]

- [ ] **Patent applications** (если есть)
  - ML модели, algorithms (если уникальные)
  - Status: pending/granted

- [ ] **Copyright registrations** (если применимо)
  - Оригинальный контент, дизайн

- [ ] **Domain names**
  - Список всех зарегистрированных доменов
  - Expiration dates
  - Registrar information

### 4.3 Open Source

- [ ] **Open source compliance report**
  - Список всех open-source dependencies
  - Licenses (MIT, Apache, GPL, etc.)
  - Compliance audit (нет конфликтов лицензий)

- [ ] **Open source policy**
  - Правила использования open-source в проекте

---

## 5. Юридические и compliance документы

### 5.1 Privacy и Data Protection

- [ ] **Privacy Policy** (финальная версия)
  - См. `docs/legal/privacy_policy_draft.md`
  - Дата публикации
  - GDPR и COPPA compliant

- [ ] **Terms of Service / Terms and Conditions**
  - User agreement
  - Acceptable use policy

- [ ] **Data Processing Agreement (DPA)**
  - Для EU users (GDPR requirement)
  - Processor vs. Controller определение

- [ ] **Cookie Policy** (если web app)

- [ ] **GDPR compliance documentation**
  - Data inventory
  - Lawful basis for processing
  - DPO appointment (если требуется)
  - Data retention policy
  - Right to deletion procedures

- [ ] **COPPA compliance documentation**
  - Verifiable parental consent mechanism
  - Data minimization practices
  - Parental notification process

- [ ] **Data Protection Impact Assessment (DPIA)**
  - Оценка рисков для privacy
  - Mitigation measures

### 5.2 Security

- [ ] **Security design document**
  - См. `docs/security/security_design.md`

- [ ] **Security audit reports** (если проводились)
  - Penetration testing
  - Vulnerability assessments
  - Remediation plans

- [ ] **SOC 2 / ISO 27001 certifications** (если есть)
  - Certificates
  - Audit reports

- [ ] **Incident response plan**
  - Playbook
  - Contact list
  - Escalation procedures

- [ ] **Business continuity and disaster recovery plan**
  - Backup procedures
  - RTO/RPO targets
  - DR testing results

### 5.3 Content Moderation

- [ ] **Content Moderation Policy**
  - См. `docs/legal/content_policy.md`
  - Prohibited content categories
  - Moderation procedures

- [ ] **Moderator training materials**
  - Guidelines
  - Examples
  - Escalation procedures

- [ ] **Moderation accuracy reports**
  - False positive/negative rates
  - Quality assurance reviews

### 5.4 Litigation и споры

- [ ] **Список всех судебных разбирательств** (текущих и прошлых)
  - Статус: active/settled/dismissed
  - Summary

- [ ] **Threat letters и cease-and-desist**
  - Если были получены

- [ ] **Insurance policies**
  - D&O insurance
  - Cyber liability insurance
  - Professional liability

---

## 6. Контракты и соглашения

### 6.1 Customer contracts

- [ ] **Standard customer terms**
  - Free tier ToS
  - Premium subscription agreement
  - Enterprise agreement template

- [ ] **Pilot agreements** (для пилота)
  - Школы и НКО
  - Terms and scope

- [ ] **Список активных клиентов** (если есть платные)
  - Company name, contract value, term

### 6.2 Vendor и supplier contracts

- [ ] **Cloud provider agreements**
  - AWS contract
  - Terms and pricing

- [ ] **SaaS subscriptions**
  - List of all tools and services
  - Monthly/annual costs

- [ ] **ML API agreements**
  - OpenAI, AWS Rekognition, Google Cloud Vision
  - Usage limits and pricing

- [ ] **Payment processor agreements**
  - Stripe, PayPal (если используются)

- [ ] **Email/SMS provider agreements**
  - SendGrid, Twilio

### 6.3 Partnership agreements

- [ ] **School partnership agreements**
  - Terms, responsibilities
  - Data sharing provisions

- [ ] **NGO partnership agreements**

- [ ] **Content provider agreements** (если marketplace)
  - Revenue share terms
  - IP ownership

- [ ] **Affiliate and referral agreements**

### 6.4 Employment и contractor agreements

- [ ] **Employment contracts** (все сотрудники)
  - Job title, salary, benefits
  - Start date
  - IP assignment clause
  - Non-compete и non-solicitation (где применимо)

- [ ] **Contractor agreements**
  - SOW (Statement of Work)
  - Payment terms
  - IP assignment

- [ ] **Advisor agreements**
  - Scope of advisory
  - Compensation (cash, equity)

- [ ] **Non-Disclosure Agreements (NDAs)**
  - Mutual и unilateral NDAs
  - С кем подписаны

---

## 7. Операционные документы

### 7.1 Team

- [ ] **Organization chart**
  - Current team structure
  - Reporting lines

- [ ] **Employee handbook**
  - Policies and procedures
  - Code of conduct

- [ ] **Compensation and benefits plan**
  - Salary bands
  - Equity grants
  - Benefits package

- [ ] **Performance review process**

### 7.2 Product и технологии

- [ ] **Product roadmap**
  - См. `docs/roadmap/roadmap.md`

- [ ] **Technical architecture document**
  - См. `docs/architecture/architecture.md`

- [ ] **MVP specification**
  - См. `docs/mvp/mvp_spec.md`

- [ ] **API documentation**
  - Endpoints, methods, schemas

- [ ] **Source code access** (опционально, для tech due diligence)
  - Read-only GitHub access
  - Code quality metrics

### 7.3 Operations

- [ ] **Customer support process**
  - Ticketing system
  - SLA для response times
  - Escalation procedures

- [ ] **Moderation operations manual**
  - Standard operating procedures
  - Quality assurance

- [ ] **Key metrics dashboard**
  - User metrics
  - Financial metrics
  - Operational metrics

---

## 8. Маркетинг и Growth

### 8.1 Маркетинговые материалы

- [ ] **Brand guidelines**
  - См. `docs/branding/brand-guidelines.md`

- [ ] **Marketing plan**
  - Channels, budget, timeline

- [ ] **PR materials**
  - Press kit
  - Media mentions

### 8.2 Customer acquisition

- [ ] **Customer acquisition strategy**
  - Channels и tactics
  - CAC по каналам

- [ ] **Marketing metrics**
  - Traffic sources
  - Conversion rates
  - CAC, LTV

### 8.3 Outreach templates

- [ ] **Investor outreach templates**
  - См. `docs/templates/outreach_templates.md`

- [ ] **Partner outreach templates**

---

## 9. Прочие документы

### 9.1 Insurance

- [ ] **Insurance policies**
  - General liability
  - Cyber liability
  - D&O insurance
  - Key person insurance (если есть)

### 9.2 Compliance certificates

- [ ] **Business licenses** (если требуются)

- [ ] **Industry certifications** (если есть)

---

## Data Room Structure (рекомендуемая)

```
/DataRoom_RorkKiku/
  /01_Corporate/
    /Incorporation/
    /CapTable/
    /BoardMinutes/
    /ShareholderAgreements/
  /02_Financial/
    /Statements/
    /Budgets/
    /TaxReturns/
    /BankStatements/
  /03_Investments/
    /PreviousRounds/
    /CurrentRound/
      pitch_deck.pdf
      one_pager.pdf
  /04_IP/
    /Assignments/
    /Trademarks/
    /OpenSource/
  /05_Legal/
    /Privacy/
      privacy_policy.pdf
      terms_of_service.pdf
      dpa.pdf
    /Security/
      security_design.pdf
      audit_reports/
    /Moderation/
      content_policy.pdf
  /06_Contracts/
    /Customers/
    /Vendors/
    /Partnerships/
    /Employment/
  /07_Operations/
    /Team/
    /Product/
    /Metrics/
  /08_Marketing/
    /BrandGuidelines/
    /Materials/
  /09_Insurance/
  /10_Miscellaneous/
```

---

## Подготовка Data Room: Checklist

### Pre-Due Diligence

- [ ] Собрать все документы из чек-листа
- [ ] Организовать в структуру папок
- [ ] Сконвертировать в PDF (где необходимо)
- [ ] Удалить/редактировать sensitive information (SSN, personal data)
- [ ] Проверить актуальность всех документов
- [ ] Убедиться, что все подписи и печати на месте

### Setup

- [ ] Выбрать VDR платформу (Dropbox, Google Drive, Carta)
- [ ] Загрузить все документы
- [ ] Установить permissions (view-only)
- [ ] Создать index document (содержание)

### Access Management

- [ ] Создать access log (кто, когда, что смотрел)
- [ ] NDA requirement перед доступом
- [ ] Expiration date для доступа (например, 30 дней)
- [ ] Watermarking документов (опционально)

### Ongoing Maintenance

- [ ] Обновлять quarterly (финансы, metrics)
- [ ] Добавлять новые документы по мере появления
- [ ] Archiving старых версий

---

## Примечания

**ТРЕБУЕТ ЮРИСТА:**
- Все юридические документы должны быть reviewed юристом перед включением в data room
- Privacy Policy, Terms of Service — обязательно legal review
- Contracts — убедиться, что можем раскрывать третьим лицам (no confidentiality breach)

**Конфиденциальность:**
- Не включать личные данные пользователей или сотрудников без anonymization
- Financial data — только aggregated
- Customer lists — можно, но без sensitive details

**Red Flags для инвесторов:**
- Отсутствие IP assignments от founders
- Unclear cap table
- Pending litigation
- Tax debts
- Poor financial records
- No GDPR/COPPA compliance

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
