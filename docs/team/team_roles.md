# Роли в команде Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026

---

## Обзор

Этот документ описывает необходимые роли для успешного запуска и роста Rork-Kiku. Роли разделены по фазам: MVP, Pilot, Production.

---

## Phase 1: MVP Team (Q1-Q2 2026) — 5-7 человек

### 1. CTO / Technical Lead

**Ответственность**:
- Техническая архитектура и принятие решений
- Выбор технологического стека
- Code reviews и best practices
- Hiring технических специалистов
- Infrastructure management (AWS/GCP)

**Навыки**:
- 8+ лет опыта в software engineering
- Expertise в React Native, Node.js/Go, Kubernetes
- ML/AI experience (для модерации)
- Security background (COPPA/GDPR)
- Startup experience желательно

**KPI**:
- MVP launch в срок
- 99%+ uptime
- Security compliance (COPPA/GDPR)

---

### 2. Product Lead / PM

**Ответственность**:
- Product vision и roadmap
- Feature prioritization
- User research и feedback analysis
- Coordination между engineering, design, и stakeholders
- Pilot planning и execution

**Навыки**:
- 5+ лет опыта в product management
- Consumer apps experience
- Strong analytical skills
- Understanding детской безопасности онлайн
- Familiarity с COPPA/GDPR

**KPI**:
- Product-market fit validation
- User retention (40%+ day-7)
- NPS score (50+)

---

### 3. Mobile Engineer (iOS)

**Ответственность**:
- iOS app development (React Native + Expo)
- UI implementation (следуя designs)
- Performance optimization
- Bug fixes и testing
- App Store submission (TestFlight)

**Навыки**:
- 3+ лет React Native опыта
- iOS development (Swift/Objective-C желательно)
- Expo framework
- App Store submission process
- UI/UX sensibility

**KPI**:
- 0 critical bugs после Week 1 pilot
- App Store rating 4.5+/5

---

### 4. Backend Engineer

**Ответственность**:
- API development (tRPC или REST)
- Database design (PostgreSQL)
- Integration с ML models
- Infrastructure setup (AWS/GCP)
- Security implementation

**Навыки**:
- 3+ лет backend опыта
- Node.js/TypeScript или Go
- PostgreSQL, Redis
- AWS/GCP
- Security best practices

**KPI**:
- API latency p95 < 500ms
- 99%+ API uptime

---

### 5. ML Engineer (Part-time или Contract)

**Ответственность**:
- ML models для content moderation (text, images)
- Model training и optimization
- Inference pipeline setup
- Accuracy monitoring и improvement
- Integration с backend

**Навыки**:
- 2+ лет ML experience
- NLP (text moderation)
- Computer Vision (image moderation)
- Python (PyTorch, TensorFlow)
- Experience с Google Vision API, AWS Rekognition

**KPI**:
- Moderation accuracy 90%+
- Inference latency < 10s для images

---

### 6. Designer (Part-time или Contract)

**Ответственность**:
- UI/UX design для iOS app
- Wireframes и prototypes (Figma)
- Brand identity (logo, colors, typography)
- User flows optimization
- Design system creation

**Навыки**:
- 3+ лет UX/UI design опыта
- Mobile app design (iOS/Android)
- Figma expert
- Understanding детских продуктов
- Accessibility awareness

**KPI**:
- Design approval от stakeholders
- User feedback на UI/UX (positive)

---

### 7. QA Engineer (Part-time)

**Ответственность**:
- Manual testing (iOS app, backend)
- Test case creation
- Bug reporting и tracking
- Regression testing
- TestFlight coordination

**Навыки**:
- 2+ лет QA опыта
- Mobile testing
- Familiarity с Jira/Linear
- Attention to detail
- Communication skills

**KPI**:
- 0 critical bugs в production
- All features tested перед release

---

## Phase 2: Pilot Team (Q3-Q4 2026) — 10-12 человек

**Добавить к MVP team**:

### 8. Android Engineer

**Ответственность**:
- Android app development (React Native)
- Android-specific features
- Google Play submission
- Performance optimization

**Навыки**:
- React Native
- Android development (Kotlin/Java)
- Google Play submission

**Timing**: Начать hiring в Q2, join в Q3

---

### 9. SRE / DevOps Engineer

**Ответственность**:
- Infrastructure automation (Terraform)
- CI/CD pipeline management
- Monitoring setup (Prometheus, Grafana)
- Incident response
- Cost optimization (AWS/GCP)

**Навыки**:
- Kubernetes, Docker
- AWS/GCP
- Terraform, Helm
- Monitoring tools
- On-call experience

**KPI**:
- 99.9% uptime
- Mean time to recovery (MTTR) < 1 hour

---

### 10. Moderation Lead

**Ответственность**:
- Ручная модерация контента (edge cases)
- Moderation team hiring и training
- Moderation policy enforcement
- Escalation management
- Feedback в ML team для model improvement

**Навыки**:
- 2+ лет moderation опыта
- Understanding детской безопасности
- Trauma-informed approach
- Team management

**KPI**:
- Manual moderation turnaround < 2 hours
- False positive rate < 5%

---

### 11. Community Manager

**Ответственность**:
- User engagement (email, in-app)
- Support (ответы на вопросы пользователей)
- Feedback collection и analysis
- Social media management (Twitter, Instagram)
- Pilot user onboarding

**Навыки**:
- 2+ лет community management опыта
- Excellent communication
- Empathy (работа с родителями)
- Social media savvy

**KPI**:
- User satisfaction (CSAT) 4.5+/5
- Response time < 24 hours

---

### 12. Content Curator (Part-time)

**Ответственность**:
- Curation образовательного контента
- Partnership с publishers
- Content categorization и tagging
- Age-appropriate recommendations

**Навыки**:
- Education background
- Understanding детского контента
- Curation experience

---

## Phase 3: Production Team (2027) — 20-30 человек

**Добавить к Pilot team**:

### 13. VP of Engineering

**Ответственность**:
- Engineering team management
- Technical roadmap
- Hiring и retention
- Engineering culture

**Навыки**:
- 10+ лет engineering опыта
- 3+ лет в management
- Startup scaling experience

---

### 14. Head of Product

**Ответственность**:
- Product strategy
- PM team management
- Product roadmap (multi-year)
- Monetization optimization

**Навыки**:
- 8+ лет product опыта
- Consumer apps background
- Data-driven decision making

---

### 15-18. Additional Engineers (4x)

- 2x Backend Engineers (для microservices scaling)
- 1x Frontend Engineer (web version)
- 1x ML Engineer (full-time, advanced models)

---

### 19. Legal & Compliance Lead

**Ответственность**:
- COPPA/GDPR compliance
- ToS, Privacy Policy updates
- Data room management для investors
- Contract negotiations (partnerships)

**Навыки**:
- Юридическое образование
- Tech law experience
- COPPA/GDPR expertise

---

### 20. Head of Fundraising / CFO (Part-time или Advisor)

**Ответственность**:
- Series A preparation
- Financial modeling
- Investor relations
- Cap table management

**Навыки**:
- Finance background
- Fundraising experience
- Startup ecosystem knowledge

---

## Optional Roles (в зависимости от funding)

### Data Analyst

**Ответственность**:
- User behavior analysis
- A/B testing
- Retention optimization
- Revenue analytics

**Timing**: После pilot (Q4 2026)

---

### Marketing Manager

**Ответственность**:
- Performance marketing (Facebook, Google Ads)
- Content marketing (blog, SEO)
- PR и media outreach
- Brand partnerships

**Timing**: Перед public launch (Q1 2027)

---

### Sales Lead (Enterprise)

**Ответственность**:
- School district sales
- Corporate partnerships
- Contract negotiations
- Revenue от enterprise

**Timing**: После product-market fit (Q2 2027)

---

## Hiring Plan

### Year 1 (2026)

| Quarter | Role | Priority |
|---------|------|----------|
| Q1 | CTO, Product Lead, Mobile Eng (iOS), Backend Eng | Critical |
| Q2 | ML Eng (contract), Designer (contract), QA | High |
| Q3 | Android Eng, Moderation Lead, Community Manager | Medium |
| Q4 | SRE, Content Curator | Low |

**Total Year 1**: 10-12 people

### Year 2 (2027)

| Quarter | Role | Priority |
|---------|------|----------|
| Q1 | VP Eng, Head of Product, 2x Backend Eng | High |
| Q2 | Legal Lead, Marketing Manager, Data Analyst | Medium |
| Q3 | Sales Lead (Enterprise), Frontend Eng | Medium |
| Q4 | Additional hiring based on growth | TBD |

**Total Year 2**: 20-30 people

---

## Compensation (ориентировочно, US market)

### Senior Leadership

- **CTO**: $180K-$250K + 3-5% equity
- **VP Engineering**: $200K-$280K + 1-2% equity
- **Head of Product**: $180K-$240K + 1-2% equity

### Individual Contributors

- **Senior Engineer**: $140K-$180K + 0.5-1% equity
- **Mid-level Engineer**: $100K-$140K + 0.2-0.5% equity
- **Junior Engineer**: $80K-$100K + 0.1-0.3% equity
- **Designer**: $90K-$130K + 0.2-0.5% equity
- **PM**: $120K-$160K + 0.5-1% equity

### Operations

- **Community Manager**: $60K-$80K + 0.1-0.3% equity
- **Moderation Lead**: $70K-$90K + 0.1-0.3% equity
- **QA Engineer**: $70K-$100K + 0.1-0.3% equity

**Примечания**:
- Equity vest over 4 years, 1 year cliff
- Benefits: health insurance, 401(k), unlimited PTO
- Remote-friendly (если applicable)

---

## Culture & Values

### Core Values

1. **Child Safety First** — безопасность детей превыше всего
2. **Move Fast, Carefully** — быстрые итерации, но без compromise на безопасности
3. **Transparency** — открытость с пользователями и командой
4. **Empathy** — понимание нужд родителей и детей
5. **Continuous Learning** — growth mindset, feedback loops

### Work Environment

- **Remote-first** (опционально)
- **Flexible hours** (work-life balance)
- **Async communication** (документация важна)
- **No hero culture** (sustainable pace)

---

## Advisors & Board

### Technical Advisor

- Опыт в ML/AI модерации
- Может помочь с ML strategy

### Child Safety Advisor

- Эксперт по COPPA/GDPR
- Background в child psychology или online safety

### Business Advisor

- Startup scaling experience
- Consumer apps background
- Fundraising expertise

### Board Members (после Series A)

- Investor representatives
- Independent board members
- Founders

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku HR & Leadership Team

**Next Steps**:
- Finalize job descriptions для каждой роли
- Hiring pipeline setup (Greenhouse, Lever)
- Compensation benchmarking (Carta, Pave)
- Diversity & inclusion goals
