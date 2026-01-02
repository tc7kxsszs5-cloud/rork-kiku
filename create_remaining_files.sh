#!/bin/bash

# Create roadmap
cat > docs/roadmap/roadmap.md << 'EOF'
# Дорожная карта Rork-Kiku (24 месяца)

## Phase 1: PoC (Proof of Concept) — Q4 2025 ✅
- [x] Концепция и market research
- [x] Technical feasibility study
- [x] Founding team formation
- [x] Initial architecture design

## Phase 2: MVP Development — Q1 2026 (Current)
**Target**: March 2026

**Milestone**:
- [ ] iOS app (React Native/Expo или Native Swift)
- [ ] Backend microservices (Auth, User, Media, Moderation)
- [ ] ML модель moderation (baseline, accuracy >90%)
- [ ] Basic семейная лента
- [ ] TestFlight beta

**Team**: 2-3 founders + contractors
**Funding**: Pre-seed/Friends & Family ($100K-200K)

## Phase 3: TestFlight Beta — Q2 2026
**Target**: April-June 2026

**Milestones**:
- [ ] 50-100 beta families
- [ ] Product-market fit validation (NPS >30)
- [ ] Iterate на основе feedback
- [ ] Partnerships с 2-3 schools/НКО
- [ ] Seed pitch deck готов

**KPIs**:
- D30 retention >40%
- 3+ uploads per family per week
- <5% churn per month

## Phase 4: Seed Round — Q2-Q3 2026
**Target**: $2M-3M @ $10M-15M valuation

**Use of funds**:
- Product: MVP → Production (40%)
- Team: Hire 7 FTE (30%)
- Marketing: GTM, partnerships (20%)
- Ops/Legal: COPPA/GDPR compliance (10%)

## Phase 5: App Store Launch — Q3 2026
**Target**: July-September 2026

**Milestones**:
- [ ] iOS App Store launch (public)
- [ ] Android app development started
- [ ] 10K+ users
- [ ] $100K ARR
- [ ] Content marketing campaign
- [ ] Influencer partnerships (5-10 micro-influencers)

**Expansion**:
- US, Canada (primary markets)

## Phase 6: Android Launch & Scale — Q4 2026
**Target**: October-December 2026

**Milestones**:
- [ ] Android app launch (Google Play)
- [ ] 50K+ users
- [ ] $500K ARR
- [ ] 5+ school partnerships
- [ ] Premium tier launched ($4.99/month)
- [ ] Series A pitch prep

**Features**:
- Private albums
- Enhanced analytics для родителей
- Export data (photo books)

## Phase 7: Series A — Q1 2027
**Target**: $5M-10M @ $30M-50M valuation

**Use of funds**:
- Marketing scale (40%)
- Team expansion: 20+ FTE (35%)
- International expansion (15%)
- Product: Advanced features (10%)

## Phase 8: International Expansion — Q2-Q3 2027
**Target**: EU markets

**Milestones**:
- [ ] 100K+ users
- [ ] $3M ARR
- [ ] Launch in UK, Germany, France
- [ ] Localization (English, German, French)
- [ ] GDPR full compliance audit
- [ ] B2B enterprise tier для schools

**Expansion**:
- Europe (UK, DE, FR, NL, ES)

## Phase 9: Product Maturity — Q4 2027
**Milestones**:
- [ ] 250K+ users
- [ ] Web app для родителей
- [ ] Advanced features: лайки, комментарии, альбомы
- [ ] AI photo book generation
- [ ] Monetization optimization

## Phase 10: Series B & Global Scale — 2028+
**Target**: $15M-30M

**Milestones**:
- [ ] 500K+ users (2028 EOY)
- [ ] $20M+ ARR
- [ ] Asia expansion (JP, KR, SG)
- [ ] Enterprise/Education edition
- [ ] API platform для partners
- [ ] SOC 2 Type II compliance

## Long-term Vision (2029-2030)
**Milestones**:
- [ ] 1M+ users (2029)
- [ ] 4M+ users (2030)
- [ ] $200M revenue (2030)
- [ ] Profitability (25%+ EBITDA margin)
- [ ] Consider IPO или strategic acquisition

**Features (Future)**:
- AR/VR family experiences
- Voice assistant integration (Alexa, Google Home)
- Blockchain-based data ownership
- AI storytelling (auto-generate photo/video books)

---

**Контакт**: [FOUNDERS_EMAIL]  
**Дата создания**: 2026-01-02
EOF

# Create outreach templates
cat > docs/templates/outreach_templates.md << 'EOF'
# Шаблоны писем для Rork-Kiku

## 1. Письмо инвестору (Cold Outreach)

**Subject**: [Имя инвестора] — Rork-Kiku: AI-powered safe family platform (Seed $2M-3M)

```
Здравствуйте [Имя],

Меня зовут [Ваше имя], и я основатель Rork-Kiku — первой семейной платформы для безопасного обмена фото и видео с AI-модерацией, созданной для детей 4-12 лет и их родителей.

**Проблема**: 1.2 млрд родителей не имеют безопасной платформы для детей. Социальные сети (Instagram, TikTok) небезопасны, нарушают COPPA/GDPR, создают риски для детей.

**Решение**: Закрытая семейная сеть с AI-модерацией (95%+ accuracy), COPPA/GDPR compliance из коробки, позитивное пространство для семей.

**Traction**: [Обновить после MVP]
- MVP запущен на TestFlight (Q1 2026)
- 50+ beta families
- NPS >30

**Market**: $60B TAM, $10B SAM. Targeting 4M users ($200M revenue) в 5 лет.

**Ask**: Seed раунд $2M-3M @ $10M-15M pre-money для MVP → App Store launch и Series A prep.

Я хотел бы поделиться pitch deck и обсудить возможность сотрудничества. Доступны ли вы для 30-минутного call на следующей неделе?

С уважением,
[Ваше имя]
[FOUNDERS_EMAIL]
www.rork-kiku.com
```

**Переменные**:
- `[Имя инвестора]`: Персонализировать
- `[Ваше имя]`: Имя основателя
- `[Traction]`: Обновить с actual data после MVP

**Персонализация**:
- Упомянуть portfolio компании инвестора, релевантные для child safety/social/SaaS
- Референс к их thesis (если публично available)

---

## 2. Письмо партнёру/НКО

**Subject**: Partnership opportunity: Rork-Kiku x [Название НКО] для child online safety

```
Здравствуйте [Имя контакта],

Меня зовут [Ваше имя], основатель Rork-Kiku — платформы для безопасного семейного обмена медиа.

Я обращаюсь к [Название НКО] с предложением партнёрства по child online safety education и pilot программе нашей платформы.

**О Rork-Kiku**:
- Закрытая семейная сеть (не публичная)
- AI-модерация контента для защиты детей
- COPPA/GDPR compliant
- Целевая аудитория: семьи с детьми 4-12 лет

**Предложение партнёрства**:
1. **Pilot program**: Бесплатный доступ для ваших beneficiaries (100+ семей)
2. **Educational content**: Co-branding safety materials для родителей
3. **Research**: Insights на основе anonymized data (opt-in)
4. **Co-marketing**: Mutual promotion в ваших и наших каналах

**Value для [Название НКО]**:
- Поддержка вашей миссии child safety
- Доступ к безопасной платформе для ваших семей
- Visibility в tech community
- Potential research publications

Я хотел бы обсудить, как мы можем сотрудничать. Можем ли мы созвониться на 20-30 минут?

С уважением,
[Ваше имя]
[FOUNDERS_EMAIL]
www.rork-kiku.com
```

**Персонализация**:
- Упомянуть specific programs НКО
- Alignment с их mission statement
- Local context (если НКО региональное)

---

## 3. Письмо школе для пилота

**Subject**: Pilot program: Safe family platform for [Название школы] community

```
Здравствуйте [Имя директора/администратора],

Меня зовут [Ваше имя], основатель Rork-Kiku — безопасной платформы для семейного обмена фото и видео.

Мы приглашаем [Название школы] участвовать в pilot программе нашей платформы, созданной для семей с детьми 4-12 лет.

**Проблема, которую мы решаем**:
Родители хотят делиться школьными моментами с семьёй, но социальные сети небезопасны для детей. Rork-Kiku — это приватная альтернатива.

**Ключевые преимущества**:
- ✅ Закрытая семейная сеть (нет публичных профилей)
- ✅ AI-модерация контента (child safety)
- ✅ COPPA/GDPR compliant
- ✅ Бесплатно для pilot участников

**Что предлагаем школе**:
1. Бесплатный Premium доступ для всех семей (3 месяца pilot)
2. Workshop для родителей: "Digital safety for families"
3. Support для вашей school community
4. Co-branding opportunities

**Что нам нужно от школы**:
- Announce pilot программы родителям (email, newsletter)
- Feedback от 30-50 семей
- Permission для testimonials (optional)

Pilot начинается в [Месяц]. Можем ли мы обсудить детали? Я доступен для call или meeting в школе.

С уважением,
[Ваше имя]
[FOUNDERS_EMAIL]
www.rork-kiku.com
```

**Follow-up**:
- Если no response через 1 неделю: gentle reminder
- Если no response через 2 недели: try different contact (PTA, tech coordinator)

---

## 4. Beta Tester Invitation

**Subject**: You're invited: Rork-Kiku Beta (Safe family photo/video sharing)

```
Hi [Имя],

Спасибо за интерес к Rork-Kiku!

Мы рады пригласить вас в нашу beta программу. Rork-Kiku — это безопасная платформа для семейного обмена фото и видео, созданная для детей 4-12 лет.

**Как начать**:
1. Install TestFlight: https://apps.apple.com/app/testflight/id899247664
2. Open beta invite: [TestFlight Link]
3. Install Rork-Kiku beta
4. Create your family profile

**Что тестировать**:
- Регистрация и onboarding
- Создание детских профилей
- Загрузка фото/видео
- Семейная лента
- Feedback на moderation

**Feedback**:
- Bugs: Report через TestFlight
- Suggestions: Reply этому email
- Survey: [Google Form]

**Beta perks**:
- Lifetime Premium access (при launch)
- Early access к новым features
- Влияние на product roadmap

Вопросы? Reply этому email или напишите [FOUNDERS_EMAIL].

Спасибо за участие! 🙏

Команда Rork-Kiku
```

---

## Инструкции по использованию

1. **Персонализация**: ВСЕГДА персонализировать [переменные]
2. **A/B testing**: Тестировать разные subject lines
3. **Follow-up**: 1-2 follow-ups если no response
4. **Timing**: Отправлять в working hours (9am-5pm local time)
5. **Tracking**: Use email tracking (Mailtrack, HubSpot) для open rates

---

**Контакт**: [FOUNDERS_EMAIL]  
**Дата создания**: 2026-01-02
EOF

# Create dataroom template
cat > docs/templates/dataroom_template.md << 'EOF'
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
EOF

# Create license recommendation
cat > docs/license_recommendation.md << 'EOF'
# Рекомендация лицензии для Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование выбора

**MIT License** — одна из самых permissive open source лицензий, подходящая для коммерческих проектов.

**Преимущества MIT**:
1. ✅ **Simple**: Короткая и понятная
2. ✅ **Permissive**: Позволяет commercial use, modification, distribution
3. ✅ **Compatible**: Совместима с большинством других лицензий
4. ✅ **Industry standard**: Используется многими крупными проектами (React, Node.js)
5. ✅ **No copyleft**: Не требует open-sourcing производных работ (в отличие от GPL)

**Недостатки MIT**:
- ❌ Не предоставляет patent protection (в отличие от Apache 2.0)
- ❌ Minimal warranty disclaimer (но достаточно для большинства случаев)

### Альтернативы

#### Apache License 2.0
**Плюсы**: Patent protection, explicit contributor agreements  
**Минусы**: Более сложная лицензия  
**Когда использовать**: Если patent concerns (например, ML algorithms patentable)

#### Proprietary License
**Плюсы**: Полный контроль, no obligations  
**Минусы**: No community contributions, less trust  
**Когда использовать**: Если хотите закрытый source (не recommended для MVP stage)

### Рекомендация для Rork-Kiku

**Сценарий**: Если планируете open-source клиентские библиотеки или SDKs

**Рекомендация**:
- **Client libraries** (iOS, Android, JS SDK): **MIT License**
- **Backend services**: **Proprietary** (closed source)
- **ML models**: **Proprietary** (trade secret)

**Hybrid approach**: Open-source client, closed-source backend — common для SaaS companies (Firebase, Stripe, Auth0).

### MIT License Text

```
MIT License

Copyright (c) 2026 Rork-Kiku

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Как добавить лицензию

1. **Create LICENSE file** в root directory
2. **Add license header** в каждый source file (optional, но recommended):

```javascript
// Copyright (c) 2026 Rork-Kiku
// Licensed under the MIT License. See LICENSE file in the project root.
```

3. **Update package.json** (Node.js projects):

```json
{
  "license": "MIT"
}
```

4. **Update README.md**:

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Legal Review

⚠️ **Disclaimer**: Это рекомендация, не legal advice. Проконсультируйтесь с юристом перед finalization лицензии, особенно если:
- Планируете патентовать innovations
- Используете third-party code с copyleft licenses (GPL)
- Есть contributors outside team

---

**Контакт**: [FOUNDERS_EMAIL]  
**Дата создания**: 2026-01-02
EOF

echo "All remaining files created successfully!"
