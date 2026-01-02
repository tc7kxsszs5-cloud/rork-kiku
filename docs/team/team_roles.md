# Роли и обязанности команды Rork-Kiku

## Обзор

Этот документ описывает структуру команды Rork-Kiku, роли, обязанности и ожидаемую компетенцию для каждой позиции на разных этапах развития компании.

---

## Организационная структура

### Phase 1: MVP (2-3 человека, Q1 2026)
```
CEO/Co-Founder (Product + Business)
CTO/Co-Founder (Tech + Engineering)
Contract Engineer (Part-time, Mobile/Backend)
```

### Phase 2: Seed (5-7 человек, Q2-Q4 2026)
```
CEO
├── Marketing Lead
└── Customer Success Manager

CTO
├── Mobile Engineer (iOS/Android)
├── Backend Engineer
├── ML Engineer (Part-time or Contract)
└── Designer (Part-time or Contract)
```

### Phase 3: Series A (15-20 человек, 2027)
```
CEO
├── VP Product
├── Marketing Lead
│   └── Content Marketing
├── Sales Lead (Enterprise)
│   └── Sales Rep
└── Customer Success Manager
    └── Support Team (2-3)

CTO
├── VP Engineering
├── Tech Lead (Backend)
│   ├── Backend Engineers (2-3)
│   └── SRE/DevOps
├── Tech Lead (Mobile)
│   ├── iOS Engineer
│   └── Android Engineer
├── ML Lead
│   └── ML Engineers (1-2)
└── Product Designer

Legal/Compliance Officer
Finance/Operations Manager
```

---

## Роли и обязанности

### 1. CEO & Co-Founder

**Reporting to**: Board of Directors / Investors

**Key Responsibilities**:
- **Vision & Strategy**: Определение долгосрочной стратегии компании
- **Fundraising**: Привлечение инвестиций (Seed, Series A, B)
- **Partnerships**: Ключевые партнерства (школы, ISP, enterprise)
- **Board Management**: Управление board meetings, investor relations
- **Team Building**: Hiring ключевых сотрудников (VP-level)
- **Culture**: Формирование корпоративной культуры
- **External Relations**: PR, media, conferences

**Key Metrics**:
- Fundraising success ($ raised, terms)
- Partnership deals (quantity, quality)
- Company growth (users, revenue)
- Team satisfaction (retention, NPS)

**Required Skills**:
- Leadership & people management
- Fundraising & investor relations
- Strategic thinking
- Strong communication (pitching, public speaking)
- Domain knowledge (child safety, parenting, tech)

**Background** (ideal):
- Previous startup experience (founder or early employee)
- Track record of successful fundraising
- Network in venture capital / tech / education

---

### 2. CTO & Co-Founder

**Reporting to**: CEO

**Key Responsibilities**:
- **Technical Architecture**: Дизайн системы, tech stack decisions
- **Engineering Team**: Building и управление инженерной командой
- **Product Development**: От идеи до production
- **Security & Compliance**: Обеспечение COPPA/GDPR compliance
- **Infrastructure**: AWS, Kubernetes, CI/CD setup
- **Technical Roadmap**: Планирование развития tech stack
- **Vendor Management**: Third-party services (AWS, Expo, etc.)

**Key Metrics**:
- System uptime (> 99.5%)
- Time to market (feature velocity)
- Technical debt management
- Team productivity (sprint velocity)
- Security incidents (goal: 0 critical)

**Required Skills**:
- Strong coding skills (TypeScript/JavaScript, Python)
- System architecture & design
- Cloud infrastructure (AWS/GCP)
- Team management & mentoring
- Security best practices

**Background** (ideal):
- 5+ years engineering experience
- Previous tech lead or CTO experience
- Experience with mobile apps, backend systems, ML

---

### 3. Product Lead / VP Product

**Reporting to**: CEO

**Key Responsibilities**:
- **Product Strategy**: Roadmap, prioritization, feature planning
- **User Research**: Interviews, surveys, usability testing
- **Product Specs**: Writing detailed specs для engineers
- **Metrics & Analytics**: Tracking KPIs, A/B testing, data-driven decisions
- **Stakeholder Management**: Working с CEO, CTO, customers
- **Go-to-Market**: Launch planning с marketing team

**Key Metrics**:
- Product-market fit (NPS > 40, retention > 40%)
- Feature adoption (% users using new features)
- Time to value (onboarding, aha moment)
- Customer feedback incorporation

**Required Skills**:
- Product management methodologies (Agile, Lean)
- Data analysis (SQL, analytics tools)
- UX/UI understanding
- Strong communication (specs, presentations)
- Customer empathy

**Background** (ideal):
- 3-5 years product management experience
- B2C or SaaS products
- Mobile app experience

---

### 4. Mobile Engineer (iOS / Android)

**Reporting to**: CTO или Tech Lead (Mobile)

**Key Responsibilities**:
- **Mobile App Development**: iOS (Swift/React Native) и/или Android (Kotlin/React Native)
- **Feature Implementation**: От design specs до production
- **Performance Optimization**: App size, load time, battery usage
- **Testing**: Unit tests, integration tests, E2E tests
- **Code Review**: Reviewing teammates' code
- **Bug Fixing**: Debugging production issues

**Key Metrics**:
- Code quality (test coverage, linting)
- Feature velocity (story points per sprint)
- Crash-free sessions (> 99%)
- App Store rating (maintain > 4.0 stars)

**Required Skills**:
- **React Native** (current stack) OR **native iOS/Android** (Swift/Kotlin)
- Mobile UI/UX best practices
- State management (React Context, Redux, Zustand)
- API integration (REST, GraphQL)
- Performance profiling & optimization
- App Store / Google Play submission process

**Background** (ideal):
- 2-5 years mobile development
- Shipped apps to production (App Store/Play Store)
- Experience with React Native ecosystem (Expo)

---

### 5. Backend Engineer

**Reporting to**: CTO или Tech Lead (Backend)

**Key Responsibilities**:
- **API Development**: REST/GraphQL endpoints для mobile app
- **Database Design**: PostgreSQL schema, queries, migrations
- **Business Logic**: Content filtering, user management, analytics
- **Integration**: Third-party services (Stripe, AWS, ML API)
- **Performance**: Query optimization, caching (Redis), scaling
- **Security**: Authentication (JWT), authorization (RBAC), encryption

**Key Metrics**:
- API latency (p95 < 300ms)
- API uptime (> 99.5%)
- Code quality (test coverage, linting)
- Feature velocity

**Required Skills**:
- **Node.js/TypeScript** OR **Go** (preferred stack)
- Database design & optimization (PostgreSQL)
- Caching strategies (Redis)
- API design (REST, GraphQL)
- Authentication & authorization (OAuth2, JWT)
- Cloud services (AWS, GCP)

**Background** (ideal):
- 3-5 years backend development
- Microservices architecture
- Experience with scalable systems (>10K users)

---

### 6. ML Engineer

**Reporting to**: CTO или ML Lead

**Key Responsibilities**:
- **ML Model Development**: Training classifiers (text, image, video)
- **Model Deployment**: Serving models (TorchServe, FastAPI)
- **Model Monitoring**: Accuracy, latency, drift detection
- **Data Pipeline**: Collection, labeling, preprocessing
- **Research**: Staying up-to-date с SOTA models
- **Optimization**: Model compression, quantization для low-latency

**Key Metrics**:
- Model accuracy (precision, recall, F1)
- Inference latency (< 500ms p95)
- False positive/negative rates
- Model uptime

**Required Skills**:
- **Python** + ML libraries (PyTorch, TensorFlow, scikit-learn)
- **NLP**: Transformers (BERT, GPT), text classification
- **Computer Vision** (optional): Image classification (ResNet, EfficientNet)
- Model deployment (Docker, Kubernetes, serving frameworks)
- Data processing (pandas, numpy)
- Experiment tracking (MLflow, Weights & Biases)

**Background** (ideal):
- MS/PhD in ML/AI OR 3+ years ML engineering
- Experience с production ML systems
- Published papers или Kaggle competition experience (bonus)

---

### 7. SRE / DevOps Engineer

**Reporting to**: CTO

**Key Responsibilities**:
- **Infrastructure Management**: AWS, Kubernetes, Terraform
- **CI/CD**: GitHub Actions, deployment automation
- **Monitoring**: Prometheus, Grafana, alerting
- **Incident Response**: On-call, troubleshooting outages
- **Security**: Infrastructure security, secrets management
- **Cost Optimization**: AWS cost monitoring, rightsizing instances

**Key Metrics**:
- System uptime (> 99.9%)
- Incident response time (MTTR)
- Deployment frequency (daily deployments)
- Infrastructure cost ($ per user)

**Required Skills**:
- **Kubernetes** (EKS, GKE)
- **Infrastructure as Code** (Terraform, CloudFormation)
- **CI/CD** (GitHub Actions, Jenkins, CircleCI)
- **Monitoring** (Prometheus, Grafana, Datadog)
- **Scripting** (Bash, Python)
- **Cloud platforms** (AWS, GCP)

**Background** (ideal):
- 3-5 years DevOps/SRE experience
- Experience с Kubernetes в production
- On-call experience

---

### 8. QA Engineer / QA Lead

**Reporting to**: CTO или VP Engineering

**Key Responsibilities**:
- **Test Planning**: Test cases, test scenarios
- **Manual Testing**: Exploratory testing, regression testing
- **Automation**: E2E tests (Playwright, Cypress), API tests
- **Bug Tracking**: Filing bugs, reproduction steps
- **Quality Metrics**: Tracking bugs, test coverage
- **Release Testing**: Pre-release smoke tests

**Key Metrics**:
- Bug detection rate (pre-production)
- Test coverage (% features covered)
- Regression test pass rate
- Release quality (critical bugs in production)

**Required Skills**:
- Testing methodologies (black box, white box, regression)
- Test automation (Selenium, Playwright, Cypress)
- API testing (Postman, REST Assured)
- Mobile testing (iOS, Android)
- Bug tracking tools (Jira, Linear)

**Background** (ideal):
- 2-5 years QA experience
- Mobile app testing experience
- Automation experience

---

### 9. Product Designer

**Reporting to**: Product Lead OR CTO

**Key Responsibilities**:
- **UX Design**: User flows, wireframes, prototypes
- **UI Design**: Visual design, design system, components
- **User Research**: Interviews, usability tests, surveys
- **Iteration**: A/B testing designs, feedback incorporation
- **Collaboration**: Working с engineers, product, marketing
- **Brand**: Logo, color palette, typography

**Key Metrics**:
- Design iteration speed (time to prototype)
- User satisfaction (NPS, CSAT)
- Design system adoption (% usage by engineers)
- Usability test success rate

**Required Skills**:
- **Design tools**: Figma, Sketch, Adobe XD
- UX methodologies (user research, personas, journey maps)
- Visual design (typography, color theory, layout)
- Prototyping (interactive prototypes)
- Mobile UI design (iOS, Android guidelines)

**Background** (ideal):
- 3-5 years product design
- Mobile app design experience
- Portfolio с shipped products

---

### 10. Legal / Compliance Officer

**Reporting to**: CEO

**Key Responsibilities**:
- **COPPA Compliance**: Ensuring compliance с US law
- **GDPR Compliance**: EU data protection
- **Privacy Policy**: Writing, updating legal documents
- **Contracts**: Reviewing vendor contracts, partnerships
- **IP Protection**: Trademarks, patents (if applicable)
- **Incident Response**: Legal aspects of data breaches

**Key Metrics**:
- Compliance audits passed
- Zero legal violations
- Contract turnaround time

**Required Skills**:
- Law degree (JD) + bar admission
- Privacy law expertise (COPPA, GDPR, CCPA)
- Tech law experience
- Contract negotiation

**Background** (ideal):
- 3-5 years legal experience
- Privacy law specialist
- Tech company experience

---

### 11. Moderation Team Lead

**Reporting to**: Product Lead OR Legal/Compliance

**Key Responsibilities**:
- **Content Moderation**: Review flagged content
- **Policy Enforcement**: Apply content policy consistently
- **Training**: Training moderators, quality assurance
- **Escalation**: Escalate serious cases (child exploitation, etc.)
- **Reporting**: Weekly moderation metrics
- **Policy Updates**: Recommend policy changes based on trends

**Key Metrics**:
- Moderation queue turnaround (< 24h for non-urgent)
- Moderator accuracy (consistency)
- Escalation rate (serious cases identified)
- User appeals resolution

**Required Skills**:
- Understanding of child safety issues
- Content moderation experience
- Decision-making under ambiguity
- Empathy & maturity (handling sensitive content)

**Background** (ideal):
- 2-5 years moderation experience (Facebook, TikTok, etc.)
- Child safety background (bonus)

---

### 12. Community Manager

**Reporting to**: Marketing Lead

**Key Responsibilities**:
- **User Engagement**: Forums, social media, support channels
- **Feedback Collection**: Gather user feedback, feature requests
- **Advocacy**: Turn users into advocates (referrals, testimonials)
- **Content**: User stories, case studies
- **Support**: Escalate support issues to appropriate teams

**Key Metrics**:
- Community engagement (active users, posts)
- NPS (community-driven)
- User-generated content (testimonials, reviews)
- Support ticket resolution (first response time)

**Required Skills**:
- Community management tools (Discord, Slack, forums)
- Social media management
- Content writing
- Customer service
- Empathy & communication

**Background** (ideal):
- 2-3 years community management
- Experience с parent communities (bonus)

---

### 13. Fundraising / Investor Relations Manager

**Reporting to**: CEO

**Key Responsibilities**:
- **Fundraising**: Coordinate fundraising rounds (Seed, Series A, B)
- **Investor Relations**: Regular updates to investors
- **Pitch Materials**: Maintain pitch deck, financial model
- **Due Diligence**: Coordinate DD process с investors
- **Board Support**: Prepare board materials, meeting coordination

**Key Metrics**:
- Fundraising success ($ raised)
- Investor satisfaction
- Board meeting quality

**Required Skills**:
- Financial modeling (Excel, Google Sheets)
- Pitch deck creation (PowerPoint, Pitch)
- Investor relations
- Project management

**Background** (ideal):
- Investment banking OR startup fundraising experience
- MBA (bonus)

---

## Hiring Plan

### Q1-Q2 2026 (Post-MVP, Seed funding)
1. Mobile Engineer (full-time)
2. Backend Engineer (full-time)
3. Part-time Designer

### Q3-Q4 2026 (Post-Seed)
4. ML Engineer (full-time OR contract)
5. Marketing Lead
6. Customer Success Manager
7. SRE/DevOps (if scaling issues)

### 2027 (Post-Series A)
8. VP Product
9. VP Engineering
10. iOS Engineer (separate from Android)
11. 2-3 Backend Engineers
12. Product Designer (full-time)
13. QA Engineer
14. Legal/Compliance Officer
15. Sales Lead (Enterprise)
16. Content Marketer
17. Support Team (2-3 people)

---

## Compensation Guidelines

### Equity Ranges (ESOP)

| Role | Equity Range (%) | Vesting |
|------|------------------|---------|
| Co-Founders | 35-40% each | 4-year vest, 1-year cliff |
| VP-level (early) | 1-3% | 4-year vest, 1-year cliff |
| Senior Engineers | 0.1-0.5% | 4-year vest, 1-year cliff |
| Mid Engineers | 0.05-0.2% | 4-year vest, 1-year cliff |
| Junior / Contract | 0.01-0.1% | 4-year vest, 1-year cliff |

**Total ESOP pool**: 15-20% (allocated for all employees)

### Salary Bands (San Francisco / Remote US)

| Role | Level | Salary Range |
|------|-------|--------------|
| CEO/CTO (Founder) | N/A | $120-180K (+ equity) |
| VP-level | Senior | $150-220K |
| Engineering | Senior | $140-180K |
| Engineering | Mid | $100-140K |
| Engineering | Junior | $80-100K |
| Product | Senior | $130-170K |
| Design | Senior | $110-150K |
| Marketing | Lead | $100-140K |
| Customer Success | Manager | $70-100K |

⚠️ **Note**: Bay Area salaries 20-30% выше. Remote может быть adjusted по cost of living.

---

## Performance Reviews

### Cadence

- **Quarterly**: 1-on-1s, goal setting
- **Annually**: Formal review, compensation adjustment

### Evaluation Criteria

1. **Performance**: Achieving goals (OKRs)
2. **Culture Fit**: Living company values
3. **Growth**: Learning, skill development
4. **Collaboration**: Teamwork, communication
5. **Impact**: Contribution к company success

---

**Автор**: People & Operations Team, Rork-Kiku  
**Версия**: v0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Living document, updated as team grows  
**Следующий ревью**: Quarterly или при значительных изменениях в структуре команды
