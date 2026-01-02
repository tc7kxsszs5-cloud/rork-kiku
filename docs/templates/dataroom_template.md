# Data Room Template для Rork-Kiku

Структура виртуального data room для due diligence (seed/Series A).

## Структура папок

```
/DataRoom_RorkKiku/
│
├── 00_README.md
│   └── Инструкции по навигации data room
│
├── 01_Executive_Summary/
│   ├── One_Pager.pdf
│   ├── Pitch_Deck.pdf
│   └── Executive_Summary.pdf
│
├── 02_Corporate/
│   ├── Articles_of_Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Cap_Table.xlsx
│   ├── Board_Minutes/
│   └── Shareholder_Agreements/
│
├── 03_Financial/
│   ├── Financial_Statements/
│   │   ├── 2025_Annual.pdf
│   │   └── 2026_Q1.pdf
│   ├── Financial_Model.xlsx
│   ├── Revenue_Projections.xlsx
│   └── Burn_Rate_Analysis.xlsx
│
├── 04_Product/
│   ├── MVP_Spec.pdf
│   ├── Architecture_Docs.pdf
│   ├── Product_Roadmap.pdf
│   └── Screenshots/
│
├── 05_Legal_Compliance/
│   ├── Privacy_Policy.pdf
│   ├── Terms_of_Service.pdf
│   ├── COPPA_Compliance.pdf
│   ├── GDPR_DPIA.pdf
│   └── Content_Policy.pdf
│
├── 06_IP/
│   ├── IP_Assignment_Founders.pdf
│   ├── IP_Assignment_Employees.pdf
│   ├── Trademark_Application.pdf
│   └── Open_Source_Licenses.xlsx
│
├── 07_Team/
│   ├── Org_Chart.pdf
│   ├── Team_Bios.pdf
│   ├── Employment_Agreements/
│   └── Advisor_Agreements/
│
├── 08_Contracts/
│   ├── Customer_Contracts/ (если есть enterprise)
│   ├── Vendor_Contracts/ (AWS, Stripe, etc.)
│   └── Partnership_Agreements/
│
├── 09_Traction/
│   ├── User_Metrics.xlsx
│   ├── Retention_Analysis.pdf
│   ├── NPS_Survey_Results.pdf
│   └── Testimonials.pdf
│
└── 10_Misc/
    ├── Press_Coverage.pdf
    ├── FAQ.pdf
    └── References.pdf
```

## Описание разделов

### 00_README.md
**Содержание**:
- Welcome message
- Структура data room
- Контакты для вопросов
- NDA reminder

### 01_Executive_Summary
**Цель**: Quick overview для investors
**Документы**: One-pager, pitch deck, executive summary

### 02_Corporate
**Цель**: Company structure, ownership
**Key docs**: Articles, cap table, board minutes

### 03_Financial
**Цель**: Financial health, projections
**Key docs**: Financial statements, model, burn rate

### 04_Product
**Цель**: Product details, roadmap
**Key docs**: MVP spec, architecture, roadmap

### 05_Legal_Compliance
**Цель**: Legal compliance (COPPA, GDPR)
**Key docs**: Privacy policy, ToS, compliance docs

### 06_IP
**Цель**: Intellectual property ownership
**Key docs**: IP assignments, trademarks

### 07_Team
**Цель**: Team composition, agreements
**Key docs**: Org chart, bios, employment agreements

### 08_Contracts
**Цель**: Contractual obligations
**Key docs**: Customer, vendor, partner contracts

### 09_Traction
**Цель**: User metrics, product-market fit
**Key docs**: User metrics, retention, NPS

### 10_Misc
**Цель**: Additional materials
**Key docs**: Press, FAQ, references

## Access Control

**Levels**:
- **Read-only**: Все investors
- **Download**: Только после term sheet
- **Watermark**: Sensitive docs (financial model, cap table)

**Audit log**: Track кто что просматривал и когда.

## Best Practices

1. **Organization**: Логичная structure, easy navigation
2. **Completeness**: Все обещанные docs присутствуют
3. **Up-to-date**: Регулярные updates
4. **Clarity**: Filename conventions (e.g., `2026-Q1_Financial_Statement.pdf`)
5. **Security**: NDA required, audit logging

---

**Контакт**: [FOUNDERS_EMAIL]  
**Дата создания**: 2026-01-02
