# Data Room Template — kiku

## Структура Data Room для Due Diligence

Этот документ описывает рекомендуемую структуру virtual data room для kiku при fundraising rounds (Seed, Series A).

**Платформы для Data Room:**
- **DocSend** (рекомендовано) — tracking, permissions, watermarks
- **Dropbox Business** — simple, но no advanced features
- **Google Drive** — free, но less professional
- **Carta** — integrated с cap table management

---

## Folder Structure

```
/kiku-data-room/
│
├── 00-README.md (этот файл)
│
├── 01-Executive_Summary/
│   ├── one_pager.pdf
│   ├── pitch_deck.pdf
│   ├── executive_summary.pdf
│   └── video_demo.mp4 (или link)
│
├── 02-Corporate_Documents/
│   ├── Certificate_of_Incorporation.pdf
│   ├── Articles_of_Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Board_Resolutions/
│   │   ├── 2026-01-15_Board_Resolution_Fundraising.pdf
│   │   └── 2026-02-01_Board_Resolution_Hiring.pdf
│   └── Tax_Documents/
│       ├── Tax_ID.pdf
│       └── Tax_Returns_2025.pdf (если applicable)
│
├── 03-Cap_Table/
│   ├── Current_Cap_Table.xlsx
│   ├── Cap_Table_Post_Money.xlsx (с учётом нового раунда)
│   ├── Option_Pool.xlsx
│   ├── Founder_Vesting_Schedules.pdf
│   └── Previous_Rounds/
│       ├── Seed_Term_Sheet.pdf
│       └── Seed_Closing_Documents.pdf
│
├── 04-Intellectual_Property/
│   ├── Trademark_Registrations/
│   │   ├── kiku_Trademark_Application.pdf
│   │   └── Logo_Trademark_Certificate.pdf
│   ├── IP_Assignment_Agreements/
│   │   ├── Founder_IP_Assignment.pdf
│   │   ├── Employee_IP_Assignment_Template.pdf
│   │   └── Contractor_IP_Assignment_Examples.pdf
│   ├── Open_Source_Licenses.md
│   └── Domain_Registrations.xlsx
│
├── 05-Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── COPPA_Compliance_Statement.pdf
│   ├── GDPR_Compliance_Statement.pdf
│   ├── Data_Processing_Agreements/
│   │   ├── DPA_OpenAI.pdf
│   │   ├── DPA_AWS.pdf
│   │   └── DPA_Stripe.pdf
│   └── Compliance_Audits/
│       └── COPPA_Review_Report_2026.pdf
│
├── 06-Security_Audits/
│   ├── Penetration_Test_Report_2026-03.pdf
│   ├── Vulnerability_Scan_Results.pdf
│   ├── Security_Policies/
│   │   ├── Information_Security_Policy.pdf
│   │   ├── Incident_Response_Plan.pdf
│   │   └── Data_Retention_Policy.pdf
│   └── Certifications/
│       └── SOC2_Type1_Report.pdf (если applicable)
│
├── 07-Contracts/
│   ├── Customer_Contracts/
│   │   ├── B2C_Terms_of_Service.pdf
│   │   └── B2B_School_Contract_Template.pdf
│   ├── Vendor_Contracts/
│   │   ├── AWS_Agreement.pdf
│   │   ├── OpenAI_API_Terms.pdf
│   │   ├── Stripe_Agreement.pdf
│   │   └── Cloud_Services_Summary.xlsx
│   ├── Partnership_Agreements/
│   │   ├── School_Partnership_[SCHOOL_NAME].pdf
│   │   └── NGO_Partnership_[NGO_NAME].pdf
│   └── Employment_Contracts/
│       ├── Founder_Employment_Agreements.pdf
│       ├── Employee_Offer_Letters/ (redacted для privacy)
│       └── Contractor_Agreements/
│
├── 08-Financial_Documents/
│   ├── Financial_Statements/
│   │   ├── Income_Statement_2025.xlsx
│   │   ├── Balance_Sheet_2025.xlsx
│   │   ├── Cash_Flow_Statement_2025.xlsx
│   │   └── YTD_Financial_Summary_2026.xlsx
│   ├── Budget_vs_Actuals/
│   │   ├── 2026_Budget.xlsx
│   │   └── Budget_vs_Actuals_Q1_2026.xlsx
│   ├── Financial_Model/
│   │   ├── 3_Year_Financial_Model.xlsx
│   │   ├── Unit_Economics.xlsx
│   │   └── Scenario_Analysis.xlsx
│   ├── Bank_Statements/
│   │   ├── Bank_Statement_Dec_2025.pdf
│   │   └── Bank_Statement_Jan_2026.pdf
│   └── 409A_Valuation/ (для US companies)
│       └── 409A_Valuation_Report_2026.pdf
│
├── 09-Governance/
│   ├── Board_Composition.xlsx
│   ├── Board_Meeting_Minutes/
│   │   ├── Board_Minutes_2026-01-15.pdf
│   │   └── Board_Minutes_2026-02-01.pdf
│   ├── Shareholders_Agreements/
│   │   └── Shareholders_Agreement.pdf
│   └── Corporate_Policies/
│       ├── Code_of_Conduct.pdf
│       ├── Whistleblower_Policy.pdf
│       └── Conflict_of_Interest_Policy.pdf
│
├── 10-Product_Technology/
│   ├── Product_Roadmap.pdf
│   ├── Product_Demo_Video.mp4 (или link)
│   ├── Technical_Architecture/
│   │   ├── Architecture_Diagram.png
│   │   └── Technical_Architecture_Document.pdf
│   ├── API_Documentation/
│   │   └── API_Spec.pdf
│   ├── User_Metrics/
│   │   ├── User_Growth_Dashboard.xlsx
│   │   ├── Retention_Cohort_Analysis.xlsx
│   │   └── NPS_Survey_Results.pdf
│   └── Tech_Stack.md
│
├── 11-Customer_Testimonials/
│   ├── Pilot_User_Testimonials.pdf
│   ├── Case_Studies/
│   │   ├── Case_Study_Family_A.pdf
│   │   └── Case_Study_School_B.pdf
│   └── NPS_Scores.xlsx
│
├── 12-Litigation_Insurance/
│   ├── Litigation_Status.pdf (или "No_Litigation_Statement.pdf")
│   ├── Insurance_Policies/
│   │   ├── Cyber_Liability_Insurance.pdf
│   │   ├── E&O_Insurance.pdf
│   │   └── General_Liability_Insurance.pdf
│   └── Regulatory_Inquiries/ (если есть)
│
└── 13-Miscellaneous/
    ├── Press_Coverage/
    │   ├── TechCrunch_Article.pdf
    │   └── Media_Mentions.xlsx
    ├── Awards_Recognition/ (если есть)
    └── FAQs_for_Investors.pdf
```

---

## Описание каждого раздела

### 00-README.md
- **Описание:** Index data room с кратким описанием каждого раздела
- **Audience:** Investor ориентир при первом заходе в data room

### 01-Executive_Summary
- **Цель:** Quick overview для investors
- **Файлы:**
  - **One-pager:** Краткое резюме (1 страница)
  - **Pitch deck:** Полная презентация (12-15 слайдов)
  - **Executive summary:** Детальное описание (3-5 страниц)
  - **Video demo:** Screen recording или product demo (5-10 минут)

### 02-Corporate_Documents
- **Цель:** Подтвердить легальную структуру компании
- **Обязательные документы:**
  - Certificate of Incorporation
  - Board resolutions (для всех major decisions)

### 03-Cap_Table
- **Цель:** Показать ownership structure и dilution
- **Ключевые файлы:**
  - **Current Cap Table:** До нового раунда
  - **Post-Money Cap Table:** После нового раунда (с projected valuation)
  - **Option Pool:** Сколько equity reserved для employees

### 04-Intellectual_Property
- **Цель:** Подтвердить, что компания владеет всем IP
- **Red flags для investors:**
  - Founder не подписал IP assignment
  - GPL-licensed code (может contaminate proprietary code)
  - Trademark disputes

### 05-Legal_Compliance
- **Цель:** Показать, что компания compliant с COPPA, GDPR-K
- **Критично для kiku:** Child data protection compliance

### 06-Security_Audits
- **Цель:** Подтвердить, что product secure
- **Investors хотят видеть:**
  - Recent pentest (в течение последних 6 месяцев)
  - No critical vulnerabilities unpatched

### 07-Contracts
- **Цель:** Показать commercial relationships
- **Важно:**
  - **Vendor lock-in?** (например, если OpenAI единственный ML provider)
  - **Customer contracts:** Recurring revenue, churn clauses

### 08-Financial_Documents
- **Цель:** Validate financial projections
- **Investors будут cross-check:**
  - Revenue в pitch deck vs. financial statements
  - Burn rate vs. runway

### 09-Governance
- **Цель:** Показать, что компания well-governed
- **Investors хотят видеть:**
  - Regular board meetings (quarterly минимум)
  - Independent directors (для более зрелых компаний)

### 10-Product_Technology
- **Цель:** Deep dive в product и tech stack
- **Investors (особенно technical investors) проверят:**
  - Scalability architecture
  - Tech debt
  - Code quality

### 11-Customer_Testimonials
- **Цель:** Validate product-market fit
- **Сильные testimonials:**
  - Specific outcomes (например, "kiku спасла моего ребёнка от кибербуллинга")
  - NPS > 50 (good), > 70 (excellent)

### 12-Litigation_Insurance
- **Цель:** Показать отсутствие legal liabilities
- **Red flags:**
  - Ongoing litigation (особенно IP disputes)
  - No cyber liability insurance (критично для data-heavy businesses)

### 13-Miscellaneous
- **Цель:** Дополнительные материалы, которые не подходят в другие категории
- **Nice to have:**
  - Press coverage (validation, brand awareness)
  - Awards (product/founder recognition)

---

## Permissions & Access Control

### Folder-level Permissions

**Level 1: Public (Anyone with link)**
- 01-Executive_Summary (pitch deck, one-pager)
- 11-Customer_Testimonials

**Level 2: Interested Investors (После первого meeting)**
- 10-Product_Technology
- 08-Financial_Documents (summary только, не детальные bank statements)

**Level 3: Committed Investors (После term sheet signing)**
- Все folders (full access)
- 03-Cap_Table
- 07-Contracts
- 09-Governance
- 12-Litigation_Insurance

### Audit Trail

**Track:**
- Кто просматривал какие файлы
- Сколько времени провели на каждой странице (DocSend feature)
- Какие файлы скачивали

**Use case:**
- Follow-up с investors на основе их interest (например, если investor долго смотрел financial model, обсудить unit economics на следующем call)

---

## Security Best Practices

### Watermarks
- **Для sensitive documents:** Add "Confidential — For [INVESTOR_NAME] Only"
- **Purpose:** Discourage sharing, identify source если leak

### Expiration
- **Set expiration dates:** Например, data room access expires через 90 дней после initial share
- **Renew:** Если due diligence продолжается

### Redaction
- **Personal data:** Redact employee SSNs, full addresses, etc.
- **Competitive info:** Redact customer names (если не public), pricing details (если proprietary)

### No Direct Downloads (Optional)
- **View-only mode:** Investors могут просматривать, но не скачивать (DocSend feature)
- **Exception:** После term sheet signing, allow downloads

---

## Maintenance & Updates

### Regular Updates
- **Monthly:** Update financial statements, user metrics
- **Quarterly:** Update board minutes, financial model
- **As needed:** Add new contracts, partnerships, press coverage

### Version Control
- **File naming:** Use dates (e.g., `Financial_Model_2026-03-15.xlsx`)
- **Changelog:** Maintain a changelog.md в корне data room (что изменилось с последнего update)

---

## FAQ для Investors

**Q: Как долго data room будет доступен?**
A: Data room доступен в течение due diligence процесса (обычно 4-8 недель после term sheet). После closing, access может быть продлён для board members.

**Q: Могу ли я скачать файлы?**
A: Level 1-2 файлы — view-only. После term sheet signing — full download access.

**Q: Кто имеет доступ к data room?**
A: Только investors, которым мы предоставили доступ. Мы не делимся data room publicly.

**Q: Как часто обновляется data room?**
A: Financial data обновляется monthly, other documents — as needed.

**Q: С кем связаться по вопросам?**
A: Для общих вопросов — [FOUNDER_EMAIL]. Для financial questions — [CFO_EMAIL]. Для legal questions — [LEGAL_EMAIL].

---

## Checklist перед Share

- [ ] Все файлы uploaded и названы корректно
- [ ] Permissions настроены (folder-level access control)
- [ ] Watermarks добавлены к sensitive documents
- [ ] Personal data redacted
- [ ] No secrets или API keys в documents
- [ ] README и FAQs обновлены
- [ ] Audit trail включён
- [ ] Expiration dates установлены (если applicable)
- [ ] Test access (попросить кого-то из команды проверить link)

---

## Рекомендуемые Платформы

**1. DocSend (Рекомендовано)**
- **Плюсы:** Tracking, permissions, watermarks, analytics
- **Минусы:** Платно ($10-50/month в зависимости от plan)
- **Use case:** Professional fundraising

**2. Dropbox Business**
- **Плюсы:** Simple, familiar interface
- **Минусы:** No advanced tracking
- **Use case:** If budget-conscious

**3. Google Drive**
- **Плюсы:** Free, easy
- **Минусы:** Less professional, basic permissions
- **Use case:** Early-stage, small data room

**4. Carta**
- **Плюсы:** Integrated с cap table, professional
- **Минусы:** Requires Carta account
- **Use case:** If already using Carta для cap table management

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (шаблон)  
**Автор:** kiku Fundraising Team  
**Статус:** Template — customize перед использованием
