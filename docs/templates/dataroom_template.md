# Data Room Structure Template

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026

---

## Структура Data Room

```
Rork-Kiku Data Room/
│
├── 00_INDEX.md                          # Этот файл — index всех документов
│
├── 01_Executive_Summary/
│   ├── pitch_deck.pdf                   # Полный pitch deck
│   ├── one_pager.pdf                    # Одностраничное резюме
│   └── executive_summary.pdf            # Executive summary (2-3 страницы)
│
├── 02_Corporate/
│   ├── Certificate_of_Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Board_Meeting_Minutes/
│   │   ├── 2026_Q1_Board_Minutes.pdf
│   │   ├── 2026_Q2_Board_Minutes.pdf
│   │   └── ...
│   ├── Shareholder_Meeting_Minutes/
│   │   └── 2026_Annual_Meeting.pdf
│   ├── Board_Members_List.pdf
│   └── Certificate_of_Good_Standing.pdf
│
├── 03_Cap_Table/
│   ├── Current_Cap_Table.xlsx           # Актуальная капитализация
│   ├── Cap_Table_History.xlsx           # История изменений
│   ├── Stock_Option_Plan.pdf           # ESOP документ
│   ├── Option_Grants/
│   │   ├── Employee_Option_Grants.xlsx
│   │   └── Individual_Grant_Letters/
│   │       ├── [Employee_Name]_Grant.pdf
│   │       └── ...
│   ├── Convertible_Notes/               # Если есть
│   │   └── SAFE_Agreements/
│   └── 83b_Elections/                   # Для founders и early employees
│       └── [Founder_Name]_83b.pdf
│
├── 04_IP/
│   ├── IP_Assignment_Agreements/
│   │   ├── Founders_IP_Assignment.pdf
│   │   ├── Employee_IP_Assignments/
│   │   └── Contractor_IP_Assignments/
│   ├── Trademarks/
│   │   ├── Rork_Kiku_Trademark_Application.pdf
│   │   └── Logo_Trademark_Certificate.pdf
│   ├── Patents/                         # Если есть
│   ├── Open_Source_Compliance_Report.pdf
│   └── Domain_Names_List.pdf
│
├── 05_Financial/
│   ├── Financial_Statements/
│   │   ├── 2026_Q1_Income_Statement.xlsx
│   │   ├── 2026_Q1_Balance_Sheet.xlsx
│   │   ├── 2026_Q1_Cash_Flow.xlsx
│   │   └── ...
│   ├── Budget_2026.xlsx
│   ├── Financial_Model_3Year.xlsx
│   ├── Fundraising_History/
│   │   ├── Seed_Round_Documents/
│   │   │   ├── Term_Sheet.pdf
│   │   │   ├── Stock_Purchase_Agreement.pdf
│   │   │   └── Investor_List.xlsx
│   │   └── Use_of_Funds_Report.pdf
│   ├── Bank_Statements/
│   │   └── [Year_Month]_Statement.pdf
│   └── Tax_Documents/
│       ├── 2024_Tax_Return.pdf
│       ├── 2025_Tax_Return.pdf
│       └── EIN_Document.pdf
│
├── 06_Legal_Compliance/
│   ├── Contracts/
│   │   ├── Customer_Contracts/
│   │   │   └── [School_Name]_Agreement.pdf
│   │   ├── Vendor_Contracts/
│   │   │   ├── AWS_Agreement.pdf
│   │   │   └── Google_Vision_API_Terms.pdf
│   │   ├── Partnership_Agreements/
│   │   └── NDAs/
│   ├── Privacy_Data_Protection/
│   │   ├── Privacy_Policy.pdf
│   │   ├── Terms_of_Service.pdf
│   │   ├── Data_Processing_Agreement.pdf  # Для vendors
│   │   ├── Cookie_Policy.pdf
│   │   └── COPPA_Compliance_Checklist.pdf
│   ├── Security_Compliance/
│   │   ├── Security_Audit_Report.pdf      # Если проводился
│   │   ├── Penetration_Test_Report.pdf
│   │   └── GDPR_Compliance_Documentation.pdf
│   └── Litigation/
│       └── Litigation_History.pdf         # Или "None" файл
│
├── 07_HR_Employment/
│   ├── Employment_Agreements/
│   │   ├── [Employee_Name]_Offer_Letter.pdf
│   │   └── ...
│   ├── Employee_Handbook.pdf
│   ├── PIIA_Agreements/                   # Proprietary Info & Inventions
│   │   └── [Employee_Name]_PIIA.pdf
│   ├── Contractor_Agreements/
│   ├── Stock_Option_Agreements/
│   ├── 409A_Valuation.pdf                 # Если есть
│   ├── Compensation_Policy.pdf
│   └── Benefits_Plans/
│       └── Health_Insurance_Summary.pdf
│
├── 08_Product_Tech/
│   ├── Product_Roadmap.pdf
│   ├── Technical_Architecture.pdf
│   ├── API_Documentation.pdf
│   ├── Development_Practices.pdf
│   ├── Code_Repository_Access.txt         # Read-only link
│   ├── Infrastructure_Documentation.pdf
│   └── ML_Models_Documentation.pdf
│
├── 09_Marketing_Sales/
│   ├── Brand_Guidelines.pdf
│   ├── Marketing_Deck.pdf
│   ├── Case_Studies/
│   │   └── [School_Name]_Case_Study.pdf
│   ├── Press_Coverage/
│   │   └── Media_Mentions.pdf
│   ├── Sales_Deck.pdf
│   ├── Pricing_Strategy.pdf
│   └── Customer_Acquisition_Strategy.pdf
│
├── 10_Operations/
│   ├── Insurance/
│   │   ├── DO_Insurance_Policy.pdf
│   │   ├── General_Liability_Policy.pdf
│   │   ├── Cyber_Insurance_Policy.pdf
│   │   └── EO_Insurance_Policy.pdf
│   ├── Office_Lease.pdf                   # Если есть
│   └── Remote_Work_Policy.pdf             # Если remote-first
│
├── 11_Investor_Relations/
│   ├── Monthly_Updates/
│   │   ├── 2026_01_Update.pdf
│   │   ├── 2026_02_Update.pdf
│   │   └── ...
│   ├── Quarterly_Board_Presentations/
│   │   └── 2026_Q1_Board_Presentation.pdf
│   └── Investor_List.xlsx
│
└── 12_Miscellaneous/
    ├── FAQ.pdf
    ├── Exit_Strategy.pdf
    └── Due_Diligence_Q&A.pdf
```

---

## Описание каждой папки

### 01_Executive_Summary
**Цель**: Quick overview для новых investors/partners

**Файлы**:
- Pitch deck (PDF)
- One-pager (PDF)
- Executive summary (2-3 страницы: проблема, решение, traction, team, ask)

---

### 02_Corporate
**Цель**: Corporate structure и governance

**Файлы**:
- Учредительные документы
- Board и shareholder meeting minutes
- Good standing certificate (обновлять annually)

---

### 03_Cap_Table
**Цель**: Ownership structure

**Файлы**:
- Актуальная cap table (Excel)
- История изменений
- Stock option plan
- Individual option grants
- Convertible notes / SAFE agreements (если есть)

**Важно**: Keep confidential, restrict access

---

### 04_IP
**Цель**: Intellectual property protection

**Файлы**:
- IP assignment agreements (founders, employees, contractors)
- Trademark registrations
- Patent applications (если есть)
- Open source compliance report

---

### 05_Financial
**Цель**: Financial health и transparency

**Файлы**:
- Income statements, balance sheets, cash flow
- Budget и financial projections
- Fundraising history
- Bank statements (последние 12 месяцев)
- Tax returns (последние 2-3 года)

---

### 06_Legal_Compliance
**Цель**: Legal compliance и risk management

**Файлы**:
- Contracts (customers, vendors, partners)
- Privacy policy, ToS, DPA
- Security audits
- COPPA/GDPR compliance documentation
- Litigation history (или "None")

---

### 07_HR_Employment
**Цель**: Team structure и compensation

**Файлы**:
- Offer letters
- Employee handbook
- PIIA agreements
- Stock option agreements
- 409A valuation (для US companies)
- Benefits plans

---

### 08_Product_Tech
**Цель**: Product roadmap и technical capabilities

**Файлы**:
- Product roadmap
- Technical architecture
- API documentation
- Code repository access (read-only)
- Infrastructure docs
- ML models documentation

---

### 09_Marketing_Sales
**Цель**: Go-to-market strategy

**Файлы**:
- Brand guidelines
- Marketing deck
- Case studies
- Press coverage
- Sales deck
- Pricing strategy

---

### 10_Operations
**Цель**: Operational infrastructure

**Файлы**:
- Insurance policies (D&O, cyber, E&O)
- Office lease (если есть)
- Remote work policy

---

### 11_Investor_Relations
**Цель**: Ongoing communication с investors

**Файлы**:
- Monthly/quarterly updates
- Board presentations
- Investor list

---

### 12_Miscellaneous
**Цель**: Anything else

**Файлы**:
- FAQ
- Exit strategy
- Due diligence Q&A

---

## Access Control

### Tier 1: Public (anyone)
- Executive summary
- Pitch deck
- One-pager

### Tier 2: Investors (after NDA)
- Financial statements
- Product roadmap
- Marketing materials

### Tier 3: Serious Investors (due diligence)
- Cap table
- Detailed financials
- Contracts
- Legal documents

### Tier 4: Founders Only
- Board minutes
- Sensitive employee info
- Detailed cap table

---

## Tools для Data Room

### Option 1: Google Drive
**Pros**: Simple, familiar, free
**Cons**: Limited access control, no analytics

**Setup**:
1. Create shared folder
2. Set permissions per folder
3. Share links с expiration

---

### Option 2: Dropbox Business
**Pros**: Better security, file versioning
**Cons**: Paid ($15-20/user/month)

---

### Option 3: Carta
**Pros**: Designed для startups, cap table management
**Cons**: Expensive ($500+/month)

---

### Option 4: DealRoom / DocSend
**Pros**: Analytics (кто что открыл), watermarks, expiration
**Cons**: Paid ($50-100/month)

---

## Best Practices

### 1. Naming Convention
- Use consistent naming: `YYYY-MM-DD_Document_Name.pdf`
- Avoid spaces: use underscores or hyphens

### 2. File Formats
- **Documents**: PDF (не Word — может быть edited)
- **Spreadsheets**: Excel (для cap table, financials)
- **Presentations**: PDF (не PPT)

### 3. Versioning
- Include version number: `Financial_Model_v1.0.xlsx`
- Update INDEX.md при каждом изменении

### 4. Security
- Password-protect sensitive files
- Watermark confidential documents
- Track access (who viewed what, when)
- Set expiration dates для links

### 5. Regular Updates
- Update monthly (financial statements)
- Update quarterly (cap table, board materials)
- Update annually (corporate documents, tax returns)

---

## Checklist перед due diligence

- [ ] All folders populated
- [ ] INDEX.md up to date
- [ ] Sensitive files password-protected
- [ ] Access controls set correctly
- [ ] Links tested (work correctly?)
- [ ] Watermarks added (для confidential docs)
- [ ] NDA signed (before sharing Tier 2+)
- [ ] Legal review complete

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Legal/Finance Team
