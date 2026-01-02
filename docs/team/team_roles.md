# Team Roles — kiku

## Команда kiku

Этот документ описывает ключевые роли в команде kiku, их ответственности и требования к кандидатам.

---

## 1. CTO (Chief Technology Officer)

**Ответственности:**
- Определение технологической стратегии и архитектуры
- Руководство engineering командой (Backend, Mobile, ML, SRE)
- Принятие решений о tech stack
- Code review критичных изменений
- Hiring и mentoring engineers
- Работа с vendors (AWS, OpenAI, etc.)
- Security и compliance oversight

**Требования:**
- 10+ лет опыта в software engineering
- 3+ лет опыта в leadership roles
- Глубокие знания в: cloud architecture (AWS/GCP), Kubernetes, microservices
- Опыт с AI/ML системами
- Опыт в security-critical приложениях
- Excellent communication skills

**Nice to have:**
- Опыт в child safety или content moderation
- Опыт fundraising (technical due diligence)

---

## 2. Product Lead (Chief Product Officer)

**Ответственности:**
- Определение product vision и roadmap
- Prioritization features на основе user feedback и business goals
- User research и testing (pilot programs)
- Работа с designers для UX/UI
- Написание product specs
- Coordination с engineering, marketing, legal
- Metrics tracking (retention, engagement, NPS)

**Требования:**
- 5-8 лет опыта в product management
- Опыт с consumer apps (B2C)
- Data-driven подход (A/B testing, analytics)
- Understanding AI/ML products
- Excellent stakeholder management

**Nice to have:**
- Background в child psychology или education
- Опыт с highly regulated products (privacy, compliance)

---

## 3. Mobile Developer (iOS/Android)

**Ответственности:**
- Разработка и поддержка iOS/Android приложения
- Работа с React Native (Expo)
- Интеграция с backend API (tRPC)
- Optimization performance и UX
- Debugging и bug fixing
- Implementation новых features
- App Store/Google Play submissions

**Требования:**
- 3+ лет опыта в mobile development
- Strong knowledge React Native
- Understanding iOS/Android native APIs
- Experience с state management (React Context, Redux, Zustand)
- Git, CI/CD (GitHub Actions, Fastlane)
- Understanding accessibility и internationalization

**Nice to have:**
- Expo SDK expertise
- Experience с EAS (Expo Application Services)
- Background в offline-first apps

**Количество:** 1-2 developers для MVP, 3-5 для scaling

---

## 4. Backend Engineer (Node.js)

**Ответственности:**
- Разработка и поддержка backend API (Node.js + TypeScript)
- Database design и optimization (PostgreSQL)
- Integration с ML services
- API design (tRPC или REST)
- Authentication/Authorization (JWT, OAuth)
- Monitoring и logging (Prometheus, ELK)
- Performance optimization

**Требования:**
- 3+ лет опыта в backend development
- Strong knowledge Node.js, TypeScript
- Experience с PostgreSQL, Redis
- Understanding microservices architecture
- Docker, Kubernetes
- Security best practices (OWASP Top 10)
- Testing (unit, integration tests)

**Nice to have:**
- tRPC experience
- AWS experience (EKS, RDS, S3)
- GraphQL experience

**Количество:** 2-3 engineers для MVP, 5-10 для scaling

---

## 5. ML Engineer (Machine Learning)

**Ответственности:**
- Разработка и fine-tuning ML моделей для content moderation
- Text analysis (NLP) — токсичность, буллинг, груминг
- Image moderation (Computer Vision)
- Audio transcription и analysis
- Model training и evaluation
- Deployment ML models (SageMaker, custom inference servers)
- Continuous improvement на основе feedback

**Требования:**
- 3+ лет опыта в ML/AI
- Strong knowledge Python, PyTorch/TensorFlow
- NLP experience (transformers, BERT, GPT)
- Computer Vision experience (ResNet, CLIP)
- Understanding production ML systems (MLOps)
- Experience с third-party AI APIs (OpenAI, AWS Rekognition)

**Nice to have:**
- Experience с content moderation ML models
- Знание детской психологии (для контекста)
- Experience с multilingual NLP (русский + английский)

**Количество:** 1-2 engineers для MVP, 3-5 для scaling

---

## 6. SRE (Site Reliability Engineer)

**Ответственности:**
- Поддержка infrastructure (AWS, Kubernetes)
- CI/CD pipelines (GitHub Actions, ArgoCD)
- Monitoring и alerting (Prometheus, Grafana, PagerDuty)
- Incident response и on-call
- Capacity planning и scaling
- Disaster recovery и backups
- Security hardening (network policies, IAM)

**Требования:**
- 3+ лет опыта в DevOps/SRE
- Strong knowledge Kubernetes (EKS или GKE)
- Infrastructure as Code (Terraform, CloudFormation)
- CI/CD tools (GitHub Actions, Jenkins, GitLab CI)
- Monitoring tools (Prometheus, Grafana, ELK)
- Strong scripting skills (Bash, Python)

**Nice to have:**
- AWS certifications (Solutions Architect, SysOps)
- Experience с high-traffic systems
- Background в security

**Количество:** 1 SRE для MVP, 2-3 для scaling

---

## 7. QA Engineer (Quality Assurance)

**Ответственности:**
- Написание и execution test plans
- Manual testing (functional, regression, exploratory)
- Automated testing (E2E tests: Detox для React Native, Playwright для web)
- Bug reporting и tracking (Jira, Linear)
- Testing на разных devices (iOS, Android versions)
- Performance testing
- Collaboration с developers для reproduce issues

**Требования:**
- 2+ лет опыта в QA
- Strong understanding mobile apps
- Experience с test automation frameworks
- Bug tracking tools (Jira, Linear)
- Basic scripting skills (JavaScript/TypeScript для automation)
- Attention to detail

**Nice to have:**
- React Native testing experience (Detox)
- Experience testing AI/ML systems

**Количество:** 1 QA для MVP, 2-3 для scaling

---

## 8. Legal/Compliance Officer

**Ответственности:**
- Compliance с COPPA, GDPR-K, local laws
- Drafting и review Terms of Service, Privacy Policy
- Data Protection Impact Assessments (DPIA)
- Vendor contract review (DPA с OpenAI, AWS, etc.)
- User data requests handling (GDPR rights)
- Incident response legal coordination
- Licensing и IP protection

**Требования:**
- Юридическое образование (Law degree)
- 3+ лет опыта в tech law или privacy law
- Strong understanding COPPA, GDPR
- Experience с data protection
- Excellent communication skills

**Nice to have:**
- Background в child protection law
- Experience working with startups

**Количество:** 1 legal counsel (может быть part-time или external consultant)

---

## 9. Moderation Lead

**Ответственности:**
- Руководство командой модераторов
- Training модераторов (как работать с sensitive content)
- Escalation workflow для critical cases
- Feedback в ML team (false positives/negatives)
- Policy enforcement (Content Policy)
- Coordination с legal team
- Psychological support для модераторов (exposure к disturbing content)

**Требования:**
- 3+ лет опыта в content moderation или trust & safety
- Experience руководства командой
- Strong knowledge content moderation best practices
- Understanding AI-assisted moderation
- Excellent judgment и decision-making
- Empathy и emotional resilience

**Nice to have:**
- Background в child psychology
- Experience с CSAM reporting (NCMEC)

**Количество:** 1 lead + 2-5 moderators (в зависимости от volume)

---

## 10. Community Manager

**Ответственности:**
- Engagement с pilot users и beta testers
- Community building (Telegram group, Discord, forum)
- Feedback collection от users
- Customer support coordination
- Educational content creation (how to use kiku, child safety tips)
- Social media management (если applicable)
- Event organization (webinars для родителей)

**Требования:**
- 2+ лет опыта в community management
- Excellent communication skills (русский + английский)
- Empathy и patience
- Understanding child safety topics
- Experience с user feedback loops

**Nice to have:**
- Background в parenting или education
- Experience с early-stage startups

**Количество:** 1 community manager для MVP, 2-3 для scaling

---

## 11. Fundraising/Growth Lead

**Ответственности:**
- Investor outreach (emails, meetings)
- Pitch deck creation и updates
- Due diligence coordination
- Cap table management
- Partnership development (школы, НКО)
- PR и media relations
- Marketing strategy (user acquisition)

**Требования:**
- 3+ лет опыта в fundraising, business development, или growth
- Strong network в tech/VC ecosystem
- Excellent presentation skills
- Understanding startup financing (Seed, Series A)
- Data-driven approach к growth

**Nice to have:**
- Background в child safety или education sector
- Previous startup experience (founder или early employee)

**Количество:** 1 lead (может быть founder или external consultant)

---

## 12. Designer (UX/UI)

**Ответственности:**
- Design mobile app UI (iOS/Android)
- User research и usability testing
- Wireframes, mockups, prototypes (Figma)
- Design system maintenance
- Accessibility design
- Collaboration с product и engineering

**Требования:**
- 3+ лет опыта в UX/UI design
- Strong portfolio (mobile apps)
- Proficiency Figma или Sketch
- Understanding user-centered design
- Knowledge accessibility best practices

**Nice to have:**
- Experience designing для детей и родителей
- Background в psychology

**Количество:** 1 designer для MVP, 2-3 для scaling

---

## Hiring Plan

### Phase 1: Pre-Seed/MVP (0-6 months)

**Core team (5-7 человек):**
- 1 CTO (founder или co-founder)
- 1 Product Lead (founder или co-founder)
- 1-2 Backend Engineers
- 1 Mobile Developer
- 1 ML Engineer
- 1 Designer (может быть external consultant)

**External consultants:**
- Legal counsel (part-time)
- Moderators (outsourced или freelance)

### Phase 2: Seed (6-12 months)

**Add (5-8 человек):**
- 1 Backend Engineer
- 1 Mobile Developer
- 1 SRE
- 1 QA Engineer
- 1 Community Manager
- 1 Moderation Lead
- 1-2 Moderators

### Phase 3: Series A (12-24 months)

**Scale team (20-30 человек):**
- Engineering: 10-15 (Backend, Mobile, ML, SRE)
- Product: 2-3 (PMs, Designer)
- QA: 2-3
- Moderation: 5-8
- Legal/Compliance: 1-2 (full-time)
- Community/Support: 2-3
- Growth/Marketing: 2-3

---

## Compensation Guidelines

**Equity allocation (for early employees):**
- CTO (если не founder): 2-5%
- Early engineers (#1-3): 0.5-1.5% each
- Mid-stage employees: 0.1-0.5%

**Vesting schedule:** 4 years, 1 year cliff (standard Silicon Valley)

**Salary ranges (depends on location, experience):**
- Engineers (Senior): $120K-180K
- Engineers (Mid-level): $80K-120K
- Product Lead: $100K-150K
- Designer: $80K-120K
- QA: $60K-100K
- Community Manager: $50K-80K

**Примечание:** Для startups в early stage, equity compensation более значима чем cash salary. Многие early employees берут ниже market rate в обмен на equity.

---

## Remote Work Policy

**Default:** Remote-first (команда может быть distributed)

**Office:** Опционально (co-working space для local team members)

**Time zones:** Предпочтительно overlap минимум 4 часа для async collaboration

**Tools:**
- Slack для communication
- Zoom для meetings
- Linear/Jira для task tracking
- Figma для design
- GitHub для code
- Notion/Confluence для documentation

---

## Culture & Values

**Core values:**
- **Child safety first** — миссия превыше всего
- **Transparency** — открытая коммуникация, no hidden agendas
- **Empathy** — понимание пользователей (родители и дети)
- **Excellence** — high standards для quality и security
- **Collaboration** — cross-functional teamwork

**No jerks policy:** Toxic behavior не терпится, независимо от skills

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku HR & Leadership  
**Статус:** Draft — требуется review
