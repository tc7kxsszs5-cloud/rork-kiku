# Архитектура системы Rork-Kiku

## Обзор

Rork-Kiku — платформа для безопасного детского контента с автоматической и ручной модерацией. Система построена на современном микросервисном подходе с акцентом на масштабируемость, безопасность и производительность.

## Диаграмма архитектуры

См. диаграмму: `docs/architecture/diag.svg`

## Общая архитектура

### Высокоуровневая структура

```
[Клиентские приложения] 
    ↓
[CDN + Load Balancer]
    ↓
[API Gateway / tRPC]
    ↓
┌─────────────────────────────────────────┐
│  Микросервисы                          │
├─────────────────────────────────────────┤
│ • Auth Service                         │
│ • User Service                         │
│ • Content Service                      │
│ • Moderation Service (ML)              │
│ • Notification Service                 │
│ • Analytics Service                    │
└─────────────────────────────────────────┘
    ↓
[Базы данных + Storage + Cache]
```

## Слои приложения

### 1. Клиентский слой

**Мобильные приложения:**
- iOS (React Native + Expo)
- Android (React Native + Expo)
- Web (Progressive Web App)

**Технологии:**
- React Native / Expo Router
- TypeScript
- React Query для кеширования
- Локальное шифрование (SQLite + SQLCipher для sensitive data)

### 2. API Gateway / tRPC слой

**Рекомендуемый подход:** tRPC для type-safe API

**Альтернатива:** REST API с OpenAPI спецификацией

**Функции:**
- Маршрутизация запросов
- Rate limiting (защита от DDoS)
- Request validation
- JWT token verification
- API versioning
- Request/Response logging

**Технологии:**
- tRPC или Express.js / Fastify
- TypeScript
- Zod для валидации
- Rate limiter (express-rate-limit / @fastify/rate-limit)

### 3. Микросервисы

#### Auth Service
**Обязанности:**
- Регистрация пользователей
- OAuth2 / OpenID Connect
- JWT + Refresh tokens
- Multi-factor authentication (опционально)
- Session management
- RBAC (Role-Based Access Control)

**Endpoints:**
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/verify

#### User Service
**Обязанности:**
- Управление профилями родителей
- Управление профилями детей
- Семейные аккаунты
- Parent-child linking
- Profile settings

#### Content Service
**Обязанности:**
- Загрузка медиа (фото, видео)
- Хранение контента
- CDN distribution
- Content metadata
- Content versioning

#### Moderation Service (ML)
**Обязанности:**
- Автоматическая модерация (ML inference)
- Классификация контента
- Обнаружение NSFW
- Text moderation
- Age-appropriateness detection
- Escalation to human moderators

**ML Models:**
- NSFW detection (ResNet, EfficientNet)
- Violence/disturbing content detection
- Text toxicity (если есть текст)
- Face detection для privacy

#### Manual Moderation Service
**Обязанности:**
- Queue management для ручной модерации
- Moderator dashboard
- Escalation workflow
- Appeal processing
- Moderator assignment

#### Notification Service
**Обязанности:**
- Push notifications (Firebase Cloud Messaging / APNs)
- Email notifications
- In-app notifications
- Notification preferences

#### Analytics Service
**Обязанности:**
- Usage metrics
- Content statistics
- Moderation metrics
- Performance tracking
- Business intelligence

### 4. Слой данных

**Основная база данных:** PostgreSQL (или Aurora PostgreSQL)
- User profiles
- Content metadata
- Moderation logs
- Audit trails

**Object Storage:** AWS S3 / GCP Cloud Storage / Azure Blob
- Медиа файлы (фото, видео)
- Encrypted at rest (AES-256)
- Versioning enabled
- Lifecycle policies

**Cache:** Redis / Memcached
- Session storage
- API response caching
- Rate limiting counters
- Real-time data

**Message Queue:** RabbitMQ / AWS SQS / GCP Pub/Sub
- Asynchronous processing
- ML inference queue
- Notification queue
- Event-driven architecture

**Search:** Elasticsearch (опционально)
- Content search
- User search
- Analytics

## Аутентификация и авторизация

### OAuth2 + JWT Flow

1. **Регистрация родителя:**
   - Родитель создает аккаунт (email + password или OAuth)
   - Email verification
   - Multi-factor authentication (опционально)

2. **Создание профиля ребенка:**
   - Родитель создает профиль для ребенка
   - Parent-child relationship в БД
   - Child profile без собственных credentials

3. **JWT токены:**
   - Access token (короткий TTL: 15 минут)
   - Refresh token (длинный TTL: 30 дней)
   - Токены хранятся в secure storage (iOS Keychain / Android Keystore)

4. **RBAC:**
   - Роли: Parent, Child, Moderator, Admin
   - Permissions: read:content, write:content, moderate:content, etc.

### Структура JWT Payload

```json
{
  "sub": "user_id",
  "role": "parent",
  "family_id": "family_id",
  "permissions": ["read:content", "write:content"],
  "iat": 1234567890,
  "exp": 1234568790
}
```

## Data Flow сценарии

### Сценарий 1: Регистрация родителя

1. Клиент → POST /auth/register (email, password)
2. Auth Service → валидирует данные
3. Auth Service → хеширует пароль (bcrypt/argon2)
4. Auth Service → создает запись в БД
5. Auth Service → отправляет email verification
6. Auth Service → возвращает JWT tokens
7. Клиент → сохраняет токены в secure storage

### Сценарий 2: Создание профиля ребенка

1. Клиент → POST /users/children (name, age, settings) + JWT
2. API Gateway → верифицирует JWT
3. User Service → создает child profile
4. User Service → связывает с parent (family_id)
5. User Service → возвращает child_id

### Сценарий 3: Загрузка медиа + автоматическая модерация

1. Клиент → POST /content/upload (media file, metadata) + JWT
2. API Gateway → верифицирует JWT и разрешения
3. Content Service → генерирует presigned URL для S3
4. Клиент → загружает файл напрямую в S3
5. S3 → триггерит Lambda / Cloud Function
6. Lambda → отправляет в Moderation Queue
7. Moderation Service → ML inference (NSFW detection, etc.)
8. Moderation Service → классифицирует контент
   - **Safe:** автоматическое одобрение
   - **Borderline:** отправка на ручную модерацию
   - **Unsafe:** автоматический reject
9. Moderation Service → обновляет metadata в БД
10. Notification Service → уведомляет родителя о результате

### Сценарий 4: Ручная модерация

1. Moderation Dashboard → GET /moderation/queue + JWT (moderator role)
2. Moderation Service → возвращает items для ревью
3. Модератор → просматривает контент
4. Модератор → POST /moderation/decision (item_id, decision, reason)
5. Moderation Service → обновляет статус в БД
6. Notification Service → уведомляет родителя

### Сценарий 5: Уведомления

1. Event → trigger (например, moderation decision)
2. Event producer → отправляет message в Notification Queue
3. Notification Service → обрабатывает сообщение
4. Notification Service → отправляет push notification (FCM/APNs)
5. Notification Service → сохраняет in-app notification в БД
6. Клиент → получает push, обновляет UI

## Рекомендации по облаку

### AWS (Рекомендуется)

**Compute:**
- EKS (Elastic Kubernetes Service) для микросервисов
- Fargate для serverless containers
- Lambda для event-driven tasks

**Storage:**
- S3 для медиа файлов
- EFS для shared file storage (если нужно)

**Database:**
- Aurora PostgreSQL (Multi-AZ для HA)
- ElastiCache Redis для кеширования

**Networking:**
- VPC с private/public subnets
- Application Load Balancer
- CloudFront CDN

**Security:**
- KMS для шифрования
- Secrets Manager для secrets
- IAM roles для RBAC
- WAF для защиты от атак

**ML:**
- SageMaker для ML inference (опционально)
- Lambda + Docker container для custom ML models

**Monitoring:**
- CloudWatch для логов и метрик
- X-Ray для distributed tracing

### GCP (Альтернатива)

**Compute:**
- GKE (Google Kubernetes Engine)
- Cloud Run для serverless
- Cloud Functions

**Storage:**
- Cloud Storage
- Cloud SQL PostgreSQL

**Cache:**
- Memorystore Redis

**CDN:**
- Cloud CDN

**Security:**
- Cloud KMS
- Secret Manager

**ML:**
- Vertex AI

### Azure (Альтернатива)

**Compute:**
- AKS (Azure Kubernetes Service)
- Container Apps
- Azure Functions

**Storage:**
- Blob Storage
- Azure Database for PostgreSQL

**Cache:**
- Azure Cache for Redis

**CDN:**
- Azure CDN

**Security:**
- Key Vault

## CDN и Content Delivery

**Рекомендации:**
- CloudFront (AWS) / Cloud CDN (GCP) / Azure CDN
- Edge locations для минимальной латентности
- Image optimization (WebP, AVIF)
- Video transcoding (adaptive bitrate)
- Secure URLs (signed URLs с TTL)

**Настройки:**
- Cache-Control headers
- Invalidation strategy
- Origin shield для защиты origin

## Kubernetes и оркестрация

### Kubernetes Architecture

**Namespaces:**
- production
- staging
- development

**Deployments для каждого микросервиса:**
- Replicas: минимум 2 для HA
- Resource limits (CPU, memory)
- Liveness & Readiness probes
- Rolling updates

**Services:**
- ClusterIP для внутренних сервисов
- LoadBalancer для публичных endpoints

**ConfigMaps & Secrets:**
- Конфигурация приложений
- Database connection strings
- API keys (через Secrets)

### Helm Charts

Использовать Helm для управления Kubernetes deployments:

```yaml
# values.yaml пример
replicaCount: 3
image:
  repository: [REGISTRY_URL]/auth-service
  tag: "1.0.0"
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

## SRE и масштабирование

### Horizontal Pod Autoscaling (HPA)

Автоматическое масштабирование на основе:
- CPU utilization (target: 70%)
- Memory utilization (target: 80%)
- Custom metrics (например, queue length)

### Vertical Pod Autoscaling (VPA)

Автоматическая оптимизация resource requests/limits.

### Cluster Autoscaling

Автоматическое добавление/удаление nodes в зависимости от нагрузки.

### Database Scaling

**Vertical scaling:**
- Увеличение instance size

**Horizontal scaling:**
- Read replicas для read-heavy workloads
- Sharding (если очень большой объем данных)

### Caching Strategy

**Cache layers:**
1. CDN cache (статический контент)
2. Redis cache (API responses, session data)
3. Application-level cache (in-memory)

## High Availability (HA)

### Multi-AZ Deployment

- Kubernetes nodes в multiple availability zones
- Database в Multi-AZ режиме
- Load balancer с health checks

### Disaster Recovery

**Backup strategy:**
- Database: automated daily backups + point-in-time recovery
- S3: versioning + cross-region replication
- Config: Git repository для infrastructure as code

**RTO/RPO:**
- RTO (Recovery Time Objective): < 1 час
- RPO (Recovery Point Objective): < 5 минут

### Failover

- Automated failover для database
- Health checks и automatic pod restart
- Circuit breakers для межсервисного взаимодействия

## Безопасность

### Шифрование

**В транзите (in transit):**
- TLS 1.3 для всех соединений
- Certificate management (Let's Encrypt / AWS Certificate Manager)
- mTLS между микросервисами (опционально, через service mesh)

**В покое (at rest):**
- Database: encryption at rest (AES-256)
- S3: server-side encryption (SSE-S3 или SSE-KMS)
- Backup encryption

### KMS и управление ключами

**AWS KMS / GCP Cloud KMS / Azure Key Vault:**
- Централизованное управление ключами шифрования
- Automatic key rotation (ежегодно)
- Audit logging всех key usage
- Separate keys для разных сред (dev, staging, prod)

**Ключи по категориям:**
- Database encryption key
- S3 encryption key
- Application secrets encryption key
- JWT signing key (rotate каждые 90 дней)

### RBAC (Role-Based Access Control)

**Роли:**
- **Parent:** может создавать child profiles, загружать контент для своих детей
- **Child:** read-only доступ к своему контенту (через parent account)
- **Moderator:** доступ к moderation queue, может одобрять/отклонять контент
- **Admin:** полный доступ ко всем функциям
- **SRE/DevOps:** доступ к инфраструктуре и логам

**Permissions:**
- read:own_content
- write:own_content
- read:family_content
- moderate:content
- admin:users
- admin:system

### Мониторинг и логирование

**Prometheus + Grafana:**
- Метрики приложений (requests/sec, latency, error rate)
- Метрики инфраструктуры (CPU, memory, disk, network)
- Custom business metrics (uploads/day, moderation queue length)
- Alerting на основе thresholds

**Dashboards:**
- Service health dashboard
- Moderation metrics dashboard
- User activity dashboard
- Infrastructure dashboard

**ELK Stack / CloudWatch Logs:**
- Централизованное логирование
- Structured logging (JSON format)
- Log retention: 90 дней для production
- Log levels: DEBUG, INFO, WARN, ERROR

**Логируемые события:**
- Authentication events (login, logout, failed attempts)
- Content upload events
- Moderation decisions
- API requests (request ID, user ID, endpoint, response time)
- Errors and exceptions

### Audit Trails

**Требования для compliance (COPPA, GDPR):**
- Логирование всех действий с персональными данными
- Who, What, When, Why
- Immutable logs (WORM storage или blockchain)
- Retention: минимум 7 лет для audit

**Audit events:**
- User registration/deletion
- Data access (кто и когда просматривал детский профиль)
- Data modifications
- Permission changes
- Moderation decisions

### Incident Response

**Incident Response Playbook:**

1. **Detection:**
   - Alerts от monitoring systems
   - User reports
   - Security scanning

2. **Triage:**
   - Severity assessment (Critical, High, Medium, Low)
   - Impact analysis
   - Initial containment

3. **Investigation:**
   - Log analysis
   - Root cause analysis
   - Timeline reconstruction

4. **Remediation:**
   - Fix implementation
   - Deployment
   - Verification

5. **Post-incident:**
   - Post-mortem report
   - Lessons learned
   - Action items для предотвращения

**Incident categories:**
- Security breach (data leak, unauthorized access)
- Service outage
- Performance degradation
- Data corruption

**Communication plan:**
- Internal: Slack/Teams channel для incident coordination
- External: status page для пользователей
- Legal/Compliance: уведомление при data breach (требования GDPR)

### Penetration Testing и Security Audits

**Schedule:**
- Penetration testing: ежеквартально
- Security audit: ежегодно
- Vulnerability scanning: непрерывно (automated)

**Scope:**
- Web application security
- API security
- Infrastructure security
- Mobile app security
- Social engineering

**Post-testing:**
- Remediation plan для найденных уязвимостей
- Re-testing после fixes
- Documentation updates

## Технический стек (рекомендации)

**Backend:**
- Node.js / TypeScript (или Go для high-performance сервисов)
- tRPC или Express.js / Fastify
- Prisma ORM (для PostgreSQL)

**Database:**
- PostgreSQL (primary)
- Redis (cache & sessions)

**Mobile:**
- React Native + Expo
- TypeScript
- React Query

**ML:**
- Python + FastAPI (для ML inference service)
- TensorFlow / PyTorch
- ONNX Runtime (для optimized inference)

**Infrastructure:**
- Kubernetes (EKS / GKE / AKS)
- Terraform для infrastructure as code
- Helm для Kubernetes deployments
- GitHub Actions / GitLab CI для CI/CD

**Monitoring:**
- Prometheus + Grafana
- ELK Stack или CloudWatch Logs
- Sentry для error tracking

## Следующие шаги

1. Создать детальную диаграмму архитектуры (обновить `diag.svg`)
2. Определить API contracts для каждого микросервиса
3. Выбрать cloud provider (рекомендуется AWS)
4. Настроить infrastructure as code (Terraform)
5. Создать CI/CD pipeline
6. Реализовать MVP согласно `docs/mvp/mvp_spec.md`

---

**Примечание:** Этот документ является черновиком и требует review от технической команды и архитекторов. Все placeholder значения должны быть заменены реальными при имплементации.
