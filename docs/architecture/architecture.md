# Архитектура системы Rork-Kiku (kiku)

## Обзор

kiku — это мобильное приложение для мониторинга и защиты детей в цифровых мессенджерах с использованием искусственного интеллекта. Система обеспечивает анализ сообщений в реальном времени, родительский контроль и экстренное реагирование при обнаружении угроз.

## Архитектурная диаграмма

![Диаграмма архитектуры](./diag.svg)

*Диаграмма показывает основные компоненты системы и их взаимодействие*

## Основные компоненты

### 1. Mobile Application (React Native + Expo)

**Клиентское приложение:**
- **Platform:** iOS (приоритет), Android, Web
- **Framework:** React Native + Expo Router
- **Language:** TypeScript
- **State Management:** React Context API + AsyncStorage
- **Navigation:** Expo Router (file-based)
- **UI:** Custom components + Lucide icons

**Основные модули:**
- MonitoringContext — управление чатами и AI-анализом
- ParentalControlsContext — родительские настройки и SOS
- UserContext — аутентификация и профили

### 2. Backend Services (Cloud)

**API Gateway:**
- REST API для мобильного клиента
- WebSocket для real-time уведомлений
- Rate limiting и throttling
- API versioning (v1, v2)

**Core Services:**
```
├── Auth Service (OAuth2/JWT)
├── User Service (профили, родители/дети)
├── Monitoring Service (чаты, сообщения)
├── AI Analysis Service (текст, изображения, аудио)
├── Alert Service (уведомления, SOS)
├── Moderation Service (ручная модерация)
└── Analytics Service (статистика, метрики)
```

**Технологии (рекомендации):**
- **Runtime:** Node.js (TypeScript) или Go
- **Framework:** Express/Fastify или Gin/Echo
- **API Schema:** OpenAPI 3.0
- **Validation:** Zod (TypeScript) или Go validators

### 3. AI/ML Pipeline

**Text Analysis:**
- **Model:** Fine-tuned LLM (GPT-4, Claude, или open-source)
- **Tasks:** Threat detection, sentiment analysis, risk scoring
- **Input:** Текст сообщения + контекст (история чата)
- **Output:** Risk level (0-4), categories, explanation

**Image Analysis:**
- **Model:** Vision model (GPT-4V, CLIP, или custom CNN)
- **Tasks:** NSFW detection, violence detection, self-harm detection
- **Input:** Image + optional text context
- **Output:** Risk level, detected objects, confidence scores

**Audio Transcription:**
- **Service:** Whisper API или cloud STT (Google/AWS)
- **Pipeline:** Audio → Text → Text Analysis
- **Languages:** Russian (primary), English

**Inference Infrastructure:**
- **Deployment:** Kubernetes pods с GPU
- **Scaling:** Horizontal pod autoscaling (HPA)
- **Caching:** Redis для результатов анализа
- **Queue:** RabbitMQ/Kafka для асинхронной обработки

### 4. Data Storage

**Primary Database (Structured Data):**
- **Technology:** PostgreSQL 15+
- **Schema:**
  - users (родители, дети, роли)
  - chats (metadata, participants)
  - messages (content, analysis results, timestamps)
  - alerts (риски, статусы, actions)
  - sos_alerts (экстренные вызовы, геолокация)
  - compliance_logs (audit trail для COPPA/GDPR)

**Object Storage (Media):**
- **Technology:** AWS S3 / GCP Cloud Storage / Azure Blob
- **Encryption:** Server-side encryption (SSE-KMS)
- **Buckets:**
  - `media-messages` — изображения и аудио сообщений
  - `analysis-cache` — результаты AI анализа
  - `backups` — резервные копии

**Cache Layer:**
- **Technology:** Redis 7+
- **Use cases:**
  - Session storage (JWT tokens)
  - AI analysis results cache (TTL 7 дней)
  - Real-time statistics
  - Rate limiting counters

**Search Engine:**
- **Technology:** Elasticsearch или Meilisearch
- **Indexes:**
  - Messages (full-text search)
  - Alerts (filtering, aggregations)

### 5. Infrastructure & DevOps

**Cloud Provider (Рекомендации):**

**AWS:**
- ECS/EKS для контейнеров
- RDS для PostgreSQL
- S3 для объектов
- CloudFront для CDN
- KMS для шифрования
- CloudWatch для мониторинга

**GCP:**
- GKE для Kubernetes
- Cloud SQL для PostgreSQL
- Cloud Storage для объектов
- Cloud CDN
- Cloud KMS
- Cloud Monitoring

**Azure:**
- AKS для Kubernetes
- Azure Database для PostgreSQL
- Azure Blob Storage
- Azure CDN
- Azure Key Vault
- Azure Monitor

**Kubernetes Setup:**
```yaml
Namespaces:
  - production
  - staging
  - development

Services:
  - api-gateway (LoadBalancer)
  - auth-service (ClusterIP)
  - monitoring-service (ClusterIP)
  - ai-service (ClusterIP, GPU nodepool)
  - alert-service (ClusterIP)
  - moderation-service (ClusterIP)

Resources:
  - ConfigMaps (non-secret config)
  - Secrets (credentials, keys)
  - PersistentVolumeClaims (stateful data)
  - Ingress (HTTPS routing)
```

**CI/CD Pipeline:**
- **VCS:** GitHub
- **CI:** GitHub Actions
- **CD:** ArgoCD или Flux (GitOps)
- **Container Registry:** Docker Hub, GHCR, или ECR/GCR
- **IaC:** Terraform для облачной инфраструктуры

## Data Flow для ключевых сценариев

### Сценарий 1: Анализ текстового сообщения

```
1. Пользователь (ребенок) отправляет сообщение в мобильном приложении
   ↓
2. App → Backend API (POST /api/v1/messages)
   - Body: { chatId, text, timestamp, authorId }
   ↓
3. Backend → Database (INSERT message, status: pending_analysis)
   ↓
4. Backend → Message Queue (publish: analyze_text_message)
   ↓
5. AI Worker → Получает задачу из очереди
   ↓
6. AI Worker → LLM API (analyze text for risks)
   - Prompt: "Analyze this message for child safety risks..."
   - Response: { riskLevel, categories, explanation }
   ↓
7. AI Worker → Database (UPDATE message, analysis_result)
   ↓
8. IF riskLevel >= MEDIUM:
   - Alert Service → Create alert
   - Notification Service → Send push to parent
   ↓
9. Backend → WebSocket → Mobile App (real-time update)
```

### Сценарий 2: SOS Alert

```
1. Ребенок нажимает кнопку SOS в приложении
   ↓
2. App → Get current location (Expo Location)
   ↓
3. App → Backend API (POST /api/v1/sos-alerts)
   - Body: { childId, location, timestamp, context }
   ↓
4. Backend → Database (INSERT sos_alert, status: active)
   ↓
5. Alert Service → Получить контакты родителей/опекунов
   ↓
6. Notification Service (параллельно):
   - Push notification → Parent mobile app
   - Email → Parent email(s)
   - SMS → Parent phone(s) (опционально)
   ↓
7. Backend → WebSocket → Parent App (real-time SOS notification)
   ↓
8. Parent App → Show SOS alert с картой и действиями
```

### Сценарий 3: Родительский контроль времени

```
1. Parent → Opens Parental Controls screen
   ↓
2. App → Backend API (GET /api/v1/parental-controls)
   ↓
3. Backend → Database (SELECT settings WHERE userId = parentId)
   ↓
4. Parent → Sets time restrictions (например, 19:00-21:00 weekdays)
   ↓
5. App → Backend API (PUT /api/v1/parental-controls/time-restrictions)
   ↓
6. Backend → Database (UPDATE settings)
   ↓
7. Backend → Compliance Service (LOG parental consent)
   ↓
8. Backend → WebSocket → Child App (sync settings)
   ↓
9. Child App → Apply restrictions locally
   - Check current time before allowing messaging
   - Show notification if outside allowed hours
```

## Безопасность

### 1. Аутентификация и авторизация

**OAuth2 + JWT:**
- **Provider:** Custom или Auth0/Cognito/Firebase Auth
- **Flows:**
  - Authorization Code Flow для родителей
  - Device Flow для детей (с родительским подтверждением)
- **Tokens:**
  - Access Token (JWT, TTL 15 минут)
  - Refresh Token (UUID, TTL 30 дней, stored in DB)
- **Claims:** userId, role (parent/child), permissions

**RBAC (Role-Based Access Control):**
```
Roles:
  - CHILD: Read own chats, send messages, trigger SOS
  - PARENT: Read child's data, configure controls, view alerts
  - MODERATOR: Review flagged content, ban users
  - ADMIN: Full system access

Permissions:
  - read:own_messages
  - read:child_messages (parent only)
  - write:parental_controls (parent only)
  - trigger:sos (child only)
  - moderate:content (moderator only)
```

### 2. Шифрование

**End-to-End Encryption (E2EE):**
- **Protocol:** Signal Protocol или libsodium
- **Keys:**
  - Identity Key Pair (долгосрочный)
  - Prekey Bundle (для новых сессий)
  - Session Keys (для каждого чата)
- **Storage:** Private keys в Keychain (iOS) / Keystore (Android)

**Transport Layer Security:**
- **Protocol:** TLS 1.3
- **Certificates:** Let's Encrypt (auto-renewal)
- **HSTS:** Strict-Transport-Security header

**At-Rest Encryption:**
- **Database:** Transparent Data Encryption (TDE) на уровне PostgreSQL
- **Object Storage:** SSE-KMS (AWS), CSEK (GCP), или CMK (Azure)
- **Mobile:** iOS Data Protection API, Android Encrypted Shared Preferences

### 3. Key Management Service (KMS)

**Cloud KMS:**
- **AWS KMS:** Customer Master Keys (CMK) для каждого environment
- **GCP KMS:** Key rings с rotation policy (90 дней)
- **Azure Key Vault:** Secrets, keys, certificates

**Key Rotation:**
- **Schedule:** Автоматическая ротация каждые 90 дней
- **Process:**
  1. Generate new key version
  2. Encrypt new data with new key
  3. Re-encrypt old data (background job)
  4. Deprecate old key после grace period (30 дней)

**Secrets Management:**
- **Development:** `.env.local` (git-ignored)
- **Staging/Production:**
  - **Option 1:** GitHub Secrets (для CI/CD)
  - **Option 2:** HashiCorp Vault (для runtime)
  - **Option 3:** Cloud-native (AWS Secrets Manager, GCP Secret Manager)

### 4. Мониторинг и логирование

**Prometheus + Grafana:**
- **Metrics:**
  - API request rate, latency, errors (RED method)
  - Database connections, query time
  - AI inference time, queue depth
  - Memory, CPU, disk usage
- **Alerts:**
  - High error rate (> 5%)
  - Slow response time (p95 > 2s)
  - Database connection pool exhausted
  - Disk space < 20%

**Logging Stack:**
- **Collection:** Fluentd или Fluent Bit
- **Storage:** Elasticsearch или Loki
- **Visualization:** Kibana или Grafana
- **Retention:**
  - Debug logs: 7 дней
  - Info logs: 30 дней
  - Warning/Error logs: 90 дней
  - Audit logs (compliance): 7 лет

**Structured Logging Format:**
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "monitoring-service",
  "traceId": "abc123",
  "userId": "user_456",
  "action": "analyze_message",
  "result": "success",
  "duration_ms": 150,
  "metadata": { "riskLevel": 1 }
}
```

**SIEM (Security Information and Event Management):**
- **Tool:** Splunk, Datadog Security, или ELK Stack
- **Use cases:**
  - Anomaly detection (необычная активность)
  - Compliance reporting (COPPA/GDPR audit logs)
  - Security incident investigation

### 5. Incident Response

**Incident Response Plan:**

**Уровни инцидентов:**
- **P0 (Critical):** Утечка данных, полный outage, SOS система down
- **P1 (High):** Partial outage, AI система не работает
- **P2 (Medium):** Degraded performance, некритичные ошибки
- **P3 (Low):** Мелкие баги, улучшения

**Процесс реагирования:**
```
1. Detection (мониторинг, алерты, user reports)
   ↓
2. Triage (определить severity, назначить owner)
   ↓
3. Investigation (логи, метрики, traces)
   ↓
4. Mitigation (hotfix, rollback, failover)
   ↓
5. Communication (status page, email, push notifications)
   ↓
6. Resolution (fix deployed, verified)
   ↓
7. Post-mortem (RCA, action items, prevention)
```

**On-call Rotation:**
- **Schedule:** 24/7 coverage, ротация каждую неделю
- **Tools:** PagerDuty или Opsgenie
- **Escalation:** L1 → L2 → Manager → CTO (если не resolved за 1 час)

**Backup & Disaster Recovery:**
- **RTO (Recovery Time Objective):** < 4 часа
- **RPO (Recovery Point Objective):** < 15 минут
- **Backups:**
  - Database: Continuous backup (WAL) + daily snapshots
  - Object Storage: Versioning enabled
  - Configuration: Git (IaC)
- **DR Site:** Multi-region deployment (active-passive или active-active)

## Масштабируемость и производительность

**Horizontal Scaling:**
- **API Gateway:** Load balancer + auto-scaling (2-10 pods)
- **Services:** Stateless, scale based on CPU/memory/custom metrics
- **AI Workers:** GPU pods, scale based on queue depth
- **Database:** Read replicas (2-3), connection pooling

**Caching Strategy:**
- **CDN:** CloudFront/Cloudflare для статических ассетов
- **Redis:** AI results (TTL 7d), user sessions (TTL 30d)
- **Application-level:** Memoization, query result caching

**Performance Targets:**
- **API response time:** p95 < 500ms, p99 < 1s
- **AI analysis latency:** p95 < 3s, p99 < 5s
- **WebSocket latency:** < 100ms
- **Database query time:** p95 < 100ms

## Compliance и Privacy

**COPPA (Children's Online Privacy Protection Act):**
- Verifiable Parental Consent перед сбором данных
- Ясное описание сбора и использования данных
- Право родителя просмотреть и удалить данные ребенка
- No targeted advertising для детей

**GDPR-K (GDPR для детей):**
- Explicit consent для детей < 16 лет (EU) / < 13 лет (US)
- Right to access, rectify, erase data
- Data Portability (export в JSON)
- Privacy by Design & Default

**Data Retention:**
- **Messages:** 90 дней (после чего автоматически удаляются)
- **Analysis Results:** 90 дней
- **Compliance Logs:** 7 лет (legal requirement)
- **User Data:** До запроса на удаление

**Data Minimization:**
- Собираем только необходимые данные для функциональности
- Анонимизация данных для аналитики (remove PII)
- Псевдонимизация userId в логах

## API Contract (черновик)

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Users

```http
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
GET    /api/v1/users/:id/children (parent only)
POST   /api/v1/users/:id/link-child (parent only)
```

### Chats & Messages

```http
GET  /api/v1/chats
POST /api/v1/chats
GET  /api/v1/chats/:id
GET  /api/v1/chats/:id/messages
POST /api/v1/chats/:id/messages
```

### Monitoring & Analysis

```http
POST /api/v1/analysis/text (internal)
POST /api/v1/analysis/image (internal)
POST /api/v1/analysis/audio (internal)
```

### Alerts

```http
GET   /api/v1/alerts
GET   /api/v1/alerts/:id
PUT   /api/v1/alerts/:id/resolve (parent only)
POST  /api/v1/sos-alerts (child only)
GET   /api/v1/sos-alerts (parent only)
```

### Parental Controls

```http
GET /api/v1/parental-controls
PUT /api/v1/parental-controls
GET /api/v1/parental-controls/contacts
POST /api/v1/parental-controls/contacts
DELETE /api/v1/parental-controls/contacts/:id
```

## Следующие шаги

1. **PoC (Proof of Concept):** Локальное приложение с mock AI (1-2 недели)
2. **MVP Backend:** Минимальный backend с real AI API (4-6 недель)
3. **TestFlight Beta:** iOS приложение для пилота (2-3 недели)
4. **Production Infrastructure:** Kubernetes, мониторинг, CI/CD (4-6 недель)
5. **Scale Testing:** Load testing, performance tuning (2-3 недели)
6. **Security Audit:** Pentest, code review, compliance check (2-4 недели)

## Ссылки

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Security](https://reactnative.dev/docs/security)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security-testing-guide/)
- [COPPA Compliance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [GDPR-K Guidelines](https://gdpr-info.eu/)
- [Signal Protocol](https://signal.org/docs/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

---

**Примечание:** Этот документ является черновиком и требует ревью со стороны технической команды, юристов и security экспертов перед имплементацией в production.
