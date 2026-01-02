# Архитектура платформы Rork-Kiku

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT — требует технического ревью
- **Контакт**: [FOUNDERS_EMAIL]

---

## 1. Обзор системы

### 1.1. Назначение
Rork-Kiku — это мобильная платформа для безопасного обмена медиаконтентом (фото, видео) между родителями и детьми с автоматической и ручной модерацией контента для защиты детей от нежелательного контента.

### 1.2. Ключевые принципы
- **Безопасность прежде всего**: Все данные шифруются (at-rest и in-transit)
- **Privacy by Design**: Минимизация сбора данных, GDPR/COPPA compliance
- **Масштабируемость**: Архитектура рассчитана на рост от MVP до миллионов пользователей
- **High Availability**: 99.9% uptime SLA для production
- **Observability**: Полная прозрачность через метрики, логи и трейсы

---

## 2. Архитектурные слои

### 2.1. Клиентский слой (Client Layer)

#### Мобильные приложения
- **iOS**: React Native + Expo (приоритет для MVP)
  - Target: iOS 14+
  - Expo SDK 51+
  - TypeScript + React Query для state management
  - Expo Router для навигации
  
- **Android**: React Native + Expo (фаза 2)
  - Target: Android 8.0+ (API 26+)
  - Общая кодовая база с iOS

#### Веб-интерфейс (опционально, фаза 3)
- Next.js 14+ с Server Components
- Responsive design для десктопов и планшетов
- Shared API client с мобильными приложениями

### 2.2. API Gateway / BFF Layer

#### Option A: tRPC (рекомендуется для MVP)
```typescript
// Пример структуры
/api/trpc/
  ├── auth.router.ts       // Аутентификация
  ├── parent.router.ts     // Родительские операции
  ├── child.router.ts      // Детские профили
  ├── media.router.ts      // Загрузка/получение медиа
  ├── moderation.router.ts // Статус модерации
  └── notifications.router.ts
```

**Преимущества tRPC**:
- Type-safe API из коробки
- Автогенерация TypeScript типов
- Минимальный boilerplate
- WebSocket поддержка для real-time

#### Option B: REST API (альтернатива)
```
GET    /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/users/me
POST   /api/v1/children
GET    /api/v1/children/:id
POST   /api/v1/media/upload
GET    /api/v1/media/:id
GET    /api/v1/moderation/queue
POST   /api/v1/moderation/:mediaId/approve
```

**API Gateway функции**:
- Rate limiting (per user/IP)
- Request validation (Zod schemas)
- JWT verification
- Request/response logging
- CORS handling
- API versioning

### 2.3. Backend Services (Microservices)

#### 2.3.1. Authentication Service
- **Технологии**: Node.js/Bun + Hono/Express
- **Функции**:
  - OAuth2 flow (Google, Apple Sign In)
  - JWT токены (access + refresh)
  - Refresh token rotation
  - MFA поддержка (опционально)
  - Session management
  
**JWT Structure**:
```json
{
  "sub": "user-uuid",
  "role": "parent|child",
  "childProfiles": ["child-uuid-1"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Токены**:
- Access token TTL: 15 минут
- Refresh token TTL: 30 дней
- Ротация refresh токенов при каждом обновлении

#### 2.3.2. User Management Service
- Управление родительскими аккаунтами
- CRUD детских профилей
- Семейные связи (parent-child relationships)
- User preferences и настройки модерации
- RBAC: Parent (owner), Parent (viewer), Child, Moderator, Admin

#### 2.3.3. Media Service
- **Хранение**: S3-compatible storage (AWS S3 / GCS / MinIO)
- **Функции**:
  - Pre-signed URL генерация для загрузки
  - Мультипарт upload для больших файлов
  - Thumbnail генерация (ImageMagick/Sharp)
  - Video transcoding (FFmpeg) - низкий приоритет для MVP
  - CDN интеграция (CloudFront / CloudFlare)
  
**Media Pipeline**:
```
Upload Request → Pre-signed URL → Direct S3 Upload → 
→ S3 Event → Lambda/Worker → Thumbnail + Metadata → 
→ Queue to ML Moderation
```

#### 2.3.4. ML Moderation Service
- **ML модели**:
  - Computer Vision: Detectron2 / YOLO для object detection
  - NSFW detection: открытые модели (Yahoo Open NSFW, LAION CLIP)
  - OCR: Tesseract / AWS Textract для текста на изображениях
  - Custom модели: Fine-tuned на датасете безопасного контента
  
**Inference Pipeline**:
```
Media Upload → Queue (Redis/SQS) → ML Worker Pool → 
→ Inference (GPU instances) → Confidence Score → 
→ Decision Logic → DB Update + Notification
```

**Модерация Levels**:
- **Auto-approve**: confidence > 95%, safe content
- **Manual review**: 50% < confidence < 95%
- **Auto-reject**: confidence < 50%, unsafe content

**Метрики**:
- Throughput: 100+ images/sec (MVP), 1000+ (Production)
- Latency: < 5 sec для inference (p95)
- False positive rate: < 2%
- False negative rate: < 0.1% (критично)

#### 2.3.5. Manual Moderation Service
- Queue management для модераторов
- Web-интерфейс для ручной проверки
- Escalation rules (автоматическая заморозка при сомнительном контенте)
- Audit trail всех модерационных решений
- Moderator performance metrics

#### 2.3.6. Notification Service
- **Каналы**:
  - Push notifications (Expo Push, FCM, APNs)
  - Email (SendGrid / AWS SES)
  - In-app notifications
  
- **События**:
  - Медиа одобрено/отклонено
  - Новый детский профиль создан
  - Критические security alerts

### 2.4. Data Layer

#### 2.4.1. Primary Database
- **Рекомендация**: PostgreSQL 15+
- **Альтернатива**: AWS RDS PostgreSQL / Google Cloud SQL
- **Шифрование**: AES-256 at-rest (managed encryption)

**Schema (упрощённый)**:
```sql
-- Users (parents)
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP,
  encrypted_data JSONB -- для sensitive fields
)

-- Children profiles
children (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES users(id),
  name_encrypted BYTEA,
  age INTEGER,
  moderation_level VARCHAR(20), -- strict/moderate/relaxed
  created_at TIMESTAMP
)

-- Media
media (
  id UUID PRIMARY KEY,
  uploader_id UUID REFERENCES users(id),
  child_id UUID,
  s3_key VARCHAR(500),
  thumbnail_key VARCHAR(500),
  mime_type VARCHAR(50),
  moderation_status VARCHAR(20), -- pending/approved/rejected/manual_review
  ml_confidence FLOAT,
  created_at TIMESTAMP,
  approved_at TIMESTAMP
)

-- Moderation logs
moderation_logs (
  id UUID PRIMARY KEY,
  media_id UUID REFERENCES media(id),
  moderator_id UUID,
  action VARCHAR(20), -- approve/reject/escalate
  reason TEXT,
  created_at TIMESTAMP
)
```

#### 2.4.2. Cache Layer
- **Redis Cluster**:
  - Session storage
  - JWT blacklist (для logout)
  - Rate limiting counters
  - Hot data caching (user profiles, media metadata)
  
**Redis TTLs**:
- Sessions: 30 дней
- User profiles: 1 час
- Media metadata: 24 часа

#### 2.4.3. Message Queue
- **Опции**: Redis Streams / AWS SQS / RabbitMQ
- **Очереди**:
  - `media-upload` → ML processing
  - `manual-moderation` → Moderator queue
  - `notifications` → Push/email delivery
  - `deadletter` → Failed jobs

#### 2.4.4. Object Storage
- **S3 Buckets**:
  - `media-raw` — оригинальные файлы
  - `media-thumbnails` — thumbnails
  - `media-approved` — одобренный контент (опционально)
  
**Lifecycle policies**:
- Raw media: 90 дней retention
- Approved media: indefinite (или по user request)
- Rejected media: 30 дней (для audit), затем удаление

### 2.5. Infrastructure Layer

#### 2.5.1. Cloud Provider (рекомендации)
**Option 1: AWS (рекомендуется)**
- EKS для Kubernetes
- RDS PostgreSQL
- ElastiCache Redis
- S3 + CloudFront
- SQS для очередей
- Lambda для event-driven tasks
- Secrets Manager для ключей

**Option 2: Google Cloud Platform**
- GKE для Kubernetes
- Cloud SQL PostgreSQL
- Memorystore Redis
- Cloud Storage + Cloud CDN
- Pub/Sub
- Cloud Functions
- Secret Manager

**Option 3: Azure**
- AKS
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Blob Storage + Azure CDN
- Azure Service Bus
- Azure Functions
- Azure Key Vault

#### 2.5.2. Kubernetes Architecture
```yaml
# Namespace structure
namespaces:
  - rork-kiku-production
  - rork-kiku-staging
  - rork-kiku-dev

# Core services (per namespace)
deployments:
  - api-gateway (3 replicas, HPA 3-10)
  - auth-service (2 replicas, HPA 2-5)
  - user-service (2 replicas, HPA 2-5)
  - media-service (3 replicas, HPA 3-10)
  - ml-worker (5 replicas, GPU nodes, HPA 5-20)
  - moderation-api (2 replicas)
  - notification-service (2 replicas)

# StatefulSets
statefulsets:
  - redis-cluster (3 nodes)
  - postgres-primary (1 primary + 2 read replicas)

# Jobs/CronJobs
cronjobs:
  - cleanup-old-media (daily)
  - audit-log-rotation (weekly)
  - ml-model-refresh (monthly)
```

**Resource requests/limits (пример)**:
```yaml
api-gateway:
  requests: { cpu: 500m, memory: 512Mi }
  limits: { cpu: 1000m, memory: 1Gi }

ml-worker:
  requests: { cpu: 2000m, memory: 4Gi, nvidia.com/gpu: 1 }
  limits: { cpu: 4000m, memory: 8Gi, nvidia.com/gpu: 1 }
```

#### 2.5.3. Helm Charts
- Использовать Helm 3 для деплоя
- Отдельные charts для каждого сервиса
- Umbrella chart для всего стека
- Secrets через External Secrets Operator (интеграция с AWS Secrets Manager / Vault)

#### 2.5.4. CI/CD Pipeline
См. `docs/infra/ci_cd.md`

---

## 3. Data Flow сценарии

### 3.1. Регистрация родителя
```
1. User открывает приложение → "Sign up with Google/Apple"
2. OAuth flow → redirect to provider → authorization
3. Provider callback → Auth Service validates → JWT issued
4. User Service creates user record
5. Client redirects to onboarding flow
```

### 3.2. Создание профиля ребёнка
```
1. Parent fills child profile form (name, age, photo)
2. API Gateway → User Service → DB insert
3. Encrypt sensitive fields (name) with KMS
4. Parent sets moderation level (strict/moderate/relaxed)
5. Return child profile to client
```

### 3.3. Загрузка медиа и автоматическая модерация
```
1. Parent selects photo → Upload button
2. Client requests pre-signed URL from Media Service
3. Client uploads directly to S3 via pre-signed URL
4. S3 triggers event → Lambda enqueues to ML queue
5. ML Worker picks job → Downloads from S3 → Runs inference
6. ML model returns confidence score (0-100%)
7. Decision logic:
   - If score > 95%: Auto-approve → Notify parent/child
   - If 50% < score < 95%: Send to manual review queue
   - If score < 50%: Auto-reject → Notify parent with reason
8. Update media.moderation_status in DB
9. Send push notification
```

### 3.4. Ручная модерация
```
1. Moderator logs in to moderation panel
2. Loads queue of pending media (confidence 50-95%)
3. Views image + metadata + ML reasoning
4. Makes decision: Approve / Reject / Escalate
5. Updates moderation_logs table
6. Updates media.moderation_status
7. Notification sent to parent
```

### 3.5. Уведомления
```
1. Event occurs (media approved/rejected)
2. Notification Service receives event
3. Looks up user preferences (push enabled? email enabled?)
4. Generates notification payload
5. Sends to Expo Push API / FCM / APNs
6. Logs delivery status
7. Retries on failure (exponential backoff, max 3 attempts)
```

---

## 4. Безопасность (Security)

### 4.1. Шифрование

#### In-Transit
- **TLS 1.3** для всех API endpoints
- Certificate management: AWS ACM / Let's Encrypt + cert-manager
- HSTS headers enabled
- No mixed content

#### At-Rest
- **Database**: AES-256 encryption (RDS/Cloud SQL managed encryption)
- **Object Storage**: S3 Server-Side Encryption (SSE-S3 или SSE-KMS)
- **Sensitive PII**: Application-level encryption через KMS
  - Child names, parent emails, etc.
  - Encrypted before DB insert, decrypted on read

#### Key Management (KMS)
- AWS KMS / Google Cloud KMS / Azure Key Vault
- Separate keys per environment (dev/staging/prod)
- **Key rotation**: автоматическая ротация каждые 90 дней
- Audit trail всех операций с ключами

**Encryption flow**:
```
Plaintext → Encrypt with DEK (Data Encryption Key) → 
→ Ciphertext stored in DB
DEK → Encrypted with KEK (Key Encryption Key) from KMS → 
→ Encrypted DEK stored alongside ciphertext
```

### 4.2. Аутентификация и Авторизация

#### JWT Best Practices
- Short-lived access tokens (15 min)
- Refresh token rotation
- Signature algorithm: RS256 (asymmetric)
- Token blacklist для logout (Redis)

#### RBAC (Role-Based Access Control)
**Роли**:
- `parent.owner` — полный доступ к своим детям
- `parent.viewer` — только чтение (для co-parents)
- `child` — ограниченный доступ (просмотр своего контента)
- `moderator` — доступ к moderation queue
- `admin` — полный доступ к системе

**Permissions**:
```typescript
const permissions = {
  'parent.owner': ['children:create', 'children:read', 'children:update', 'media:upload', 'media:read'],
  'parent.viewer': ['children:read', 'media:read'],
  'child': ['media:read'],
  'moderator': ['moderation:review', 'media:read'],
  'admin': ['*']
}
```

### 4.3. Безопасность данных

#### PII Handling
- Минимизация сбора: только необходимые данные
- Data classification: Public / Internal / Confidential / Restricted
- Retention policy:
  - User data: до удаления аккаунта + 30 дней grace period
  - Logs: 90 дней
  - Audit trails: 7 лет (compliance)

#### GDPR / COPPA Compliance
- Right to access: API endpoint `/api/v1/users/me/data-export`
- Right to erasure: Soft delete → Hard delete after 30 дней
- Parental consent: верификация родителя перед созданием детского профиля
- Age gates: дети < 13 лет не могут создать аккаунт самостоятельно

### 4.4. Monitoring и Logging

#### Metrics (Prometheus + Grafana)
**Application metrics**:
- Request rate, latency (p50, p95, p99)
- Error rate (5xx, 4xx)
- ML inference throughput/latency
- Database query performance
- Cache hit rate

**Business metrics**:
- Active users (DAU/MAU)
- Media uploads per day
- Moderation queue length
- False positive/negative rates

**Infrastructure metrics**:
- CPU/Memory utilization
- Disk I/O
- Network traffic
- Pod restarts
- Node health

#### Logging (ELK Stack / CloudWatch / Stackdriver)
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Correlation IDs для request tracing
- Sensitive data masking (emails, PII)

**Log retention**:
- Application logs: 30 дней
- Access logs: 90 дней
- Audit logs: 7 лет

#### Distributed Tracing (Jaeger / OpenTelemetry)
- End-to-end request tracing
- Latency breakdown по сервисам
- Error propagation tracking

### 4.5. Incident Response

#### Incident Severity Levels
- **P0 (Critical)**: Полный outage, data breach — response time: 15 min
- **P1 (High)**: Partial outage, security vulnerability — response time: 1 hour
- **P2 (Medium)**: Degraded performance — response time: 4 hours
- **P3 (Low)**: Minor issue — response time: next business day

#### Incident Response Playbook
1. **Detection**: Alerts → PagerDuty/Opsgenie → On-call engineer
2. **Triage**: Assess severity → Escalate if needed
3. **Mitigation**: Immediate fix (rollback/hotfix)
4. **Communication**: Status page update + stakeholder notification
5. **Resolution**: Root cause fix
6. **Post-mortem**: Blameless post-mortem + action items

#### Security Incident Response
1. Isolate affected systems
2. Preserve evidence (logs, snapshots)
3. Notify security team + legal (if data breach)
4. Containment → Eradication → Recovery
5. User notification (GDPR: within 72 hours)

### 4.6. Penetration Testing
- **Schedule**: Quarterly penetration tests
- **Scope**: External attack surface + API security
- **Vendor**: Third-party security firm (recommendations: [PLACEHOLDER])
- **Remediation**: All High/Critical findings within 30 дней

---

## 5. Масштабирование и HA

### 5.1. Horizontal Scaling
- **API Gateway**: HPA based on CPU (target: 70%)
- **ML Workers**: HPA based on queue depth (target: 100 msgs)
- **Database**: Read replicas для read-heavy queries
- **Redis**: Cluster mode для high availability

### 5.2. Vertical Scaling
- GPU instances для ML workers (T4/V100/A100)
- Increase DB instance size as needed (start: db.t3.medium → db.r5.xlarge)

### 5.3. Caching Strategy
- **L1 Cache**: Application memory (LRU cache)
- **L2 Cache**: Redis (centralized)
- **L3 Cache**: CDN (CloudFront) для static media

### 5.4. CDN Strategy
- CloudFront / CloudFlare в front of S3
- Edge locations близко к пользователям
- Cache TTL:
  - Thumbnails: 7 дней
  - Approved media: 30 дней
  - API responses: не кэшируются (или short TTL: 1 min)

### 5.5. Database Optimization
- **Indexing**: B-tree indexes на foreign keys, WHERE clauses
- **Partitioning**: Partition `media` table по created_at (monthly partitions)
- **Connection pooling**: PgBouncer (100 connections per instance)
- **Query optimization**: EXPLAIN ANALYZE для slow queries

### 5.6. High Availability
- **Multi-AZ deployment**: Primary + standby в разных AZ
- **Failover**: Automatic failover для RDS (< 1 min)
- **Backup**: Automated daily backups + point-in-time recovery
- **DR plan**: Cross-region replication (опционально для production)

**RTO (Recovery Time Objective)**: < 1 hour
**RPO (Recovery Point Objective)**: < 15 min

---

## 6. Масштабирование: от MVP до Global

### 6.1. MVP (1K users)
- Single region (US East / EU West)
- 1 Kubernetes cluster (3 nodes)
- RDS Single-AZ (db.t3.medium)
- Redis single instance
- Manual scaling

**Estimated cost**: $500-1000/month

### 6.2. Pilot (10K users)
- Single region
- Kubernetes cluster (5-10 nodes, HPA enabled)
- RDS Multi-AZ (db.r5.large) + 1 read replica
- Redis cluster (3 nodes)
- CloudFront CDN

**Estimated cost**: $2000-4000/month

### 6.3. Production (100K-1M users)
- Multi-region (US + EU)
- Kubernetes clusters per region (10-50 nodes, HPA + Cluster Autoscaler)
- RDS Multi-AZ (db.r5.xlarge+) + multiple read replicas
- Redis cluster (6+ nodes)
- Global CDN
- Full observability stack

**Estimated cost**: $10K-50K/month

### 6.4. Global Scale (1M+ users)
- Multi-region (US, EU, Asia, ROW)
- Geo-routing (Route 53 / Cloud DNS)
- Data locality compliance (EU data stays in EU)
- Dedicated GPU clusters для ML
- Multi-tier storage (hot/warm/cold)

**Estimated cost**: $50K-200K+/month

---

## 7. Диаграммы

### 7.1. High-Level Architecture Diagram
![Architecture Diagram](./diag.svg)

*Примечание: Диаграмма — placeholder, требует создания в Lucidchart/Draw.io/Mermaid*

### 7.2. Компоненты диаграммы (для создания)
- Client (iOS/Android/Web)
- API Gateway / Load Balancer
- Auth Service, User Service, Media Service
- ML Moderation Workers (с GPU)
- Manual Moderation Queue
- PostgreSQL (Primary + Replicas)
- Redis Cluster
- S3 / Object Storage
- CDN
- Message Queue
- Monitoring Stack (Prometheus, Grafana, ELK)

---

## 8. Технологический стек (summary)

### Frontend
- React Native + Expo
- TypeScript
- React Query / tRPC client
- Expo Router

### Backend
- Node.js / Bun + Hono/Express
- TypeScript
- tRPC (или REST)
- PostgreSQL + TypeORM/Prisma
- Redis
- S3-compatible storage

### ML/AI
- Python 3.11+
- PyTorch / TensorFlow
- Detectron2 / YOLO
- Hugging Face models
- FastAPI для inference API

### Infrastructure
- Kubernetes (EKS/GKE/AKS)
- Helm 3
- Terraform для IaC
- GitHub Actions для CI/CD
- Prometheus + Grafana
- ELK Stack / CloudWatch

### Security
- AWS KMS / Google KMS
- HashiCorp Vault (опционально)
- OAuth2 / OpenID Connect
- JWT (RS256)

---

## 9. Следующие шаги

1. **Техническое ревью**: Инженерный ревью данного документа
2. **PoC**: Proof of Concept для ML модерации
3. **MVP развертывание**: Минимальный набор сервисов для pilot
4. **Load testing**: K6/Locust для определения узких мест
5. **Security audit**: Внешний аудит безопасности
6. **Compliance review**: Юридическая проверка GDPR/COPPA

---

## 10. Контакты и ресурсы

- **Техническая документация**: `docs/`
- **API спецификация**: `docs/mvp/mvp_spec.md`
- **Security design**: `docs/security/security_design.md`
- **CI/CD setup**: `docs/infra/ci_cd.md`
- **Контакт**: [FOUNDERS_EMAIL]

---

**DISCLAIMER**: Данный документ является черновиком и не содержит production-кода, реальных секретов или персональных данных. Все примеры и конфигурации — для демонстрационных целей.
