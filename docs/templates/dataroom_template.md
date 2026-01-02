# Data Room Template Structure для Rork-Kiku

## Overview

Этот template описывает рекомендуемую структуру data room для due diligence процесса.

---

## Folder Structure

```
/RorkKiku-DataRoom/
├── 00-INDEX.md
├── 01-Corporate/
│   ├── Formation/
│   ├── Governance/
│   └── Funding/
├── 02-Financial/
│   ├── Statements/
│   ├── Projections/
│   └── Banking/
├── 03-Legal/
│   ├── Contracts/
│   ├── Policies/
│   └── Compliance/
├── 04-IP/
│   ├── Trademarks/
│   ├── Domains/
│   └── Assignments/
├── 05-HR/
│   ├── Team/
│   └── Contractors/
├── 06-Technical/
│   ├── Architecture/
│   ├── Security/
│   └── Product/
├── 07-Commercial/
│   ├── Customers/
│   ├── Partnerships/
│   └── Metrics/
└── 08-Misc/
```

---

## File Naming Convention

**Format:** `[Category]-[Subcategory]-[DocumentName]-[Date].[ext]`

**Examples:**
- `01-Corporate-CertificateOfIncorporation-2025-01-15.pdf`
- `02-Financial-Q4-2025-PL-2026-01-10.xlsx`
- `03-Legal-PrivacyPolicy-v2.1-2026-01-01.pdf`

---

## 00-INDEX.md

```markdown
# Rork-Kiku Data Room Index

Last Updated: [DATE]

## Document Overview

| Category | # Files | Last Updated |
|----------|---------|--------------|
| Corporate | 15 | [DATE] |
| Financial | 8 | [DATE] |
| Legal | 12 | [DATE] |
| IP | 6 | [DATE] |
| HR | 10 | [DATE] |
| Technical | 8 | [DATE] |
| Commercial | 5 | [DATE] |
| Misc | 3 | [DATE] |

## Key Documents

1. **Pitch Deck:** `07-Commercial/Pitch-Deck-v3.0-2026-01-02.pdf`
2. **Financial Model:** `02-Financial/Financial-Model-5Year-2026-01-02.xlsx`
3. **Cap Table:** `01-Corporate/Cap-Table-Current-2026-01-02.xlsx`

## Contact

For questions: [FOUNDERS_EMAIL]
Data Room Manager: [NAME]
```

---

## 01-Corporate/

### Formation/
- Certificate of Incorporation
- Articles of Association (Устав)
- Registration documents

### Governance/
- Shareholders Agreement
- Board Meeting Minutes (all)
- Shareholder Meeting Minutes (all)

### Funding/
- Prior funding documents (если есть)
- SAFE notes, Convertible notes
- Term sheets
- Cap Table (current + fully diluted)

---

## 02-Financial/

### Statements/
- P&L (monthly, last 12 months)
- Balance Sheet (current)
- Cash Flow Statement

### Projections/
- 5-year financial model
- Budget (current year)
- Cash flow forecast (18 months)

### Banking/
- Bank statements (last 6 months)
- Loan agreements (если есть)

---

## 03-Legal/

### Contracts/
- Customer contracts
- Vendor contracts
- Partnership agreements
- NDAs

### Policies/
- Privacy Policy
- Terms of Service
- Content Policy

### Compliance/
- COPPA compliance checklist
- GDPR compliance (if EU)
- Insurance policies

---

## 04-IP/

### Trademarks/
- Trademark registrations
- Logo files

### Domains/
- Domain list
- Registrar info

### Assignments/
- IP Assignment agreements (founders, employees, contractors)
- Work-for-hire agreements

---

## 05-HR/

### Team/
- Org chart
- Employment contracts
- Equity grants

### Contractors/
- Contractor agreements
- Advisor agreements

---

## 06-Technical/

### Architecture/
- Architecture document
- Architecture diagram
- Tech stack overview

### Security/
- Security design document
- Security audit reports
- Penetration test results

### Product/
- Product roadmap
- API documentation
- MVP spec

---

## 07-Commercial/

### Customers/
- Customer list (anonymized if needed)
- Case studies
- Testimonials

### Partnerships/
- Partnership agreements
- MOU (Memorandum of Understanding)

### Metrics/
- Product metrics (MAU, DAU, retention)
- Financial metrics (MRR, ARR, CAC, LTV)
- Growth metrics

---

## 08-Misc/

- Press coverage
- Awards/Recognition
- Any other relevant documents

---

## Access Instructions

### For Investors

1. Request access: [FOUNDERS_EMAIL]
2. Receive access link (Google Drive, Dropbox, or Visible)
3. All documents read-only
4. Questions: email или schedule call

### For Team

- Update documents: weekly
- Review completeness: monthly
- Manager: [NAME], [EMAIL]

---

## Document Preparation Checklist

### Before Fundraise

- [ ] All placeholders replaced с real data
- [ ] All documents current (last 90 days)
- [ ] Sensitive info redacted appropriately
- [ ] Naming convention consistent
- [ ] INDEX.md updated
- [ ] Access controls set
- [ ] Test access (request colleague to review)

### During Fundraise

- [ ] Monitor access logs
- [ ] Update weekly (new metrics, documents)
- [ ] Respond to questions promptly (< 24 hours)
- [ ] Track что investors viewing (insights)

---

**Контакт:** [FOUNDERS_EMAIL]

**Related:** `docs/legal/data_room_checklist.md`
