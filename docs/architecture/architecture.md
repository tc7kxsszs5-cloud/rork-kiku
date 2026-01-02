# Архитектура проекта Rork-Kiku

## Обзор

Rork-Kiku — платформа безопасного обмена контентом для детей с функциями модерации на основе ML и родительским контролем. Архитектура построена на микросервисной основе с использованием современных облачных технологий.

## Диаграмма архитектуры

См. [диаграмму архитектуры](./diag.svg) для визуального представления системы.

## Архитектурные слои

### 1. Клиентский слой (Client Layer)

#### Мобильное приложение (iOS/Android)
- **Технологии**: React Native, Expo
- **Функционал**:
  - Аутентификация родителей и профили детей
  - Загрузка и просмотр медиа-контента
  - Родительский контроль и настройки фильтрации
  - Push-уведомления о модерации
  - Offline-режим с синхронизацией

#### Web Dashboard (для родителей)
- **Технологии**: Next.js, React
- **Функционал**:
  - Расширенные настройки родительского контроля
  - Аналитика активности детей
  - Управление профилями и настройками
  - Просмотр истории модерации

### 2. API Gateway / tRPC Layer

#### tRPC Router
- **Назначение**: Type-safe API между клиентом и backend
- **Преимущества**: 
  - Автоматическая типизация
  - Уменьшение boilerplate кода
  - End-to-end type safety
  
#### Endpoints (черновой список):
```typescript
// Аутентификация
auth.register(email, password, parentConsent)
auth.login(email, password)
auth.verify2FA(code)
auth.logout()

// Профили детей
children.create(name, age, avatarUrl)
children.list()
children.update(childId, data)
children.delete(childId)

// Контент
content.upload(file, childId, metadata)
content.list(childId, filters)
content.get(contentId)
content.delete(contentId)

// Модерация
moderation.getStatus(contentId)
moderation.appeal(contentId, reason)
moderation.getHistory(childId)

// Настройки фильтрации
settings.getFilterLevel(childId)
settings.setFilterLevel(childId, level)
settings.updateParentalControls(data)
```

#### API Gateway функции:
- Rate limiting (по пользователю/IP)
- Authentication/Authorization
- Request validation
- Response caching
- Request routing к микросервисам
- Logging и monitoring

### 3. Микросервисы (Backend Services)

#### Authentication Service
- **Функции**:
  - OAuth2/JWT токены
  - Multi-factor authentication (SMS/Email/TOTP)
  - Session management
  - Parent consent verification
- **База данных**: PostgreSQL (пользователи, сессии)
- **Кэш**: Redis (sessions, tokens)

#### Content Service
- **Функции**:
  - Загрузка медиа (фото, видео)
  - Хранение метаданных
  - CDN integration
  - Thumbnail generation
- **Хранилище**: S3/Cloud Storage
- **База данных**: PostgreSQL (metadata)
- **Queue**: RabbitMQ/SQS для обработки

#### Moderation Service
- **Функции**:
  - Orchestration ML-модели и ручной модерации
  - Workflow management (auto-block → manual review → freeze)
  - Appeal handling
  - Moderation history
- **База данных**: PostgreSQL (moderation decisions, appeals)
- **Queue**: RabbitMQ для async processing

#### Notification Service
- **Функции**:
  - Push notifications (FCM/APNS)
  - Email notifications
  - In-app notifications
  - Notification preferences
- **Queue**: RabbitMQ для delivery
- **База данных**: PostgreSQL (notification history)

#### Analytics Service
- **Функции**:
  - User behavior tracking
  - Content statistics
  - Moderation metrics
  - Parent dashboard data
- **База данных**: TimescaleDB/ClickHouse
- **Visualization**: Grafana

### 4. ML-модуль модерации

#### ML Inference Service
- **Модели**:
  - Computer Vision для обнаружения неприемлемого контента
  - NLP для текстового контента
  - Multi-modal модели для комплексного анализа
  
- **Классификация контента**:
  - Насилие и опасность
  - Сексуальный контент
  - Ненависть и дискриминация
  - Буллинг и харассмент
  - Personal information (PII detection)
  
- **Технологии**:
  - TensorFlow/PyTorch
  - ONNX для deployment
  - GPU acceleration
  - Model versioning и A/B testing
  
- **Deployment**:
  - Kubernetes с GPU nodes
  - Auto-scaling по нагрузке
  - Model serving (TensorFlow Serving/TorchServe)
  
#### Training Pipeline
- **Функции**:
  - Data collection и labeling
  - Model training и validation
  - Continuous learning от модераторов
  - Model registry
- **Инфраструктура**: Kubeflow/MLflow

### 5. Manual Moderation Dashboard

#### Moderation Queue System
- **Функции**:
  - Приоритезация контента для ревью
  - Batch processing
  - Moderation tools (annotate, block, approve)
  - Quality assurance
  
#### Moderation Team Features
- **Роли**: Lead Moderator, Moderator, QA
- **Workflow**:
  1. ML модель отмечает suspicious контент
  2. Queue распределяет по модераторам
  3. Модератор принимает решение
  4. QA проверяет (sample-based)
  5. Обратная связь для ML модели

## Data Flow для ключевых сценариев

### Сценарий 1: Регистрация родителя

```
1. Родитель → [Web/Mobile] → auth.register(email, password, consent)
2. API Gateway → Authentication Service
3. Валидация данных + проверка consent checkbox
4. Генерация verification token
5. Сохранение в БД (PostgreSQL)
6. Отправка email verification → Notification Service
7. Родитель подтверждает email
8. Account activated → статус "active"
9. Возврат JWT токена клиенту
```

### Сценарий 2: Создание профиля ребёнка

```
1. Родитель (authenticated) → children.create(name, age, avatarUrl)
2. API Gateway проверяет JWT токен
3. Content Service загружает avatar → S3
4. Создание профиля в БД с дефолтными настройками фильтрации
5. Связь child profile с parent account
6. Возврат childId клиенту
7. Уведомление родителю о создании профиля
```

### Сценарий 3: Загрузка медиа

```
1. Ребёнок загружает фото через приложение
2. content.upload(file, childId, metadata)
3. API Gateway проверяет:
   - Аутентификацию родителя
   - Права на childId
   - Rate limits
4. Content Service:
   - Загружает file → S3 (временное хранилище)
   - Создаёт metadata запись (status: "pending")
   - Генерирует contentId
5. Отправка в Queue для модерации
6. ML Inference Service:
   - Получает задачу из Queue
   - Загружает контент из S3
   - Выполняет inference
   - Возвращает scores по категориям
7. Moderation Service обрабатывает результат:
   - Если score < threshold: auto-approve → status: "approved"
   - Если score > high_threshold: auto-block → status: "blocked", notification
   - Если между: manual_review_needed → очередь модератора
8. Обновление metadata в БД
9. Notification родителю/ребёнку о статусе
```

### Сценарий 4: Автоматическая модерация

```
1. ML Service получает контент из Queue
2. Preprocessing (resize, normalize, etc.)
3. Model inference:
   - Vision model → image scores
   - Metadata analysis → context scores
4. Aggregation scores → final decision
5. Если safe (score < 0.3): 
   - Auto-approve
   - Перемещение контента в production S3
   - Обновление status → "approved"
6. Если unsafe (score > 0.8):
   - Auto-block
   - Контент остаётся в quarantine
   - Notification родителю
   - Log для review
7. Если uncertain (0.3 < score < 0.8):
   - Добавление в manual review queue
   - Сохранение scores для модератора
```

### Сценарий 5: Ручная модерация

```
1. Модератор открывает Moderation Dashboard
2. Система показывает prioritized queue:
   - High priority: appeals, borderline cases
   - Low priority: routine checks
3. Модератор просматривает контент:
   - Видит ML scores и confidence
   - Видит context (user history, metadata)
4. Модератор принимает решение:
   - Approve: контент становится доступным
   - Block: контент блокируется
   - Report: эскалация к Lead Moderator
5. Система:
   - Обновляет status в БД
   - Отправляет notification
   - Записывает decision для ML training
   - Обновляет user reputation score
```

### Сценарий 6: Уведомления

```
1. Event triggered (moderation complete, new message, etc.)
2. Event → Notification Service через Queue
3. Notification Service:
   - Проверяет user preferences
   - Определяет channel (push/email/in-app)
   - Форматирует сообщение
4. Delivery:
   - Push: FCM/APNS
   - Email: SendGrid/AWS SES
   - In-app: WebSocket/SSE
5. Tracking delivery status
6. Retry logic при неудаче
```

## Рекомендации по облачной инфраструктуре

### AWS (рекомендуется для старта)

#### Compute
- **EKS (Elastic Kubernetes Service)**: основной compute для микросервисов
- **EC2 GPU instances**: для ML inference
- **Lambda**: для serverless функций (image processing, webhooks)

#### Storage
- **S3**: медиа контент, backups, logs
- **EBS**: persistent storage для БД
- **EFS**: shared storage для Kubernetes

#### Database
- **RDS PostgreSQL**: основные транзакционные данные
- **ElastiCache Redis**: caching, sessions
- **DynamoDB**: метаданные, sessions (опционально)
- **Amazon Timestream**: аналитика временных рядов

#### Networking
- **VPC**: изолированная сеть
- **ALB/NLB**: load balancing
- **CloudFront**: CDN для статики и медиа
- **Route53**: DNS management

#### Security
- **KMS**: шифрование ключей
- **Secrets Manager**: хранение секретов
- **IAM**: access control
- **WAF**: защита от веб-атак
- **GuardDuty**: threat detection

#### Monitoring & Logging
- **CloudWatch**: метрики и логи
- **X-Ray**: distributed tracing
- **CloudTrail**: audit logs

#### ML Services
- **SageMaker**: training и deployment моделей
- **S3 + SageMaker**: data lake для training

#### Messaging
- **SQS**: очереди сообщений
- **SNS**: pub/sub для notifications
- **EventBridge**: event routing

#### Cost Optimization
- Spot instances для non-critical workloads
- Reserved instances для production
- S3 lifecycle policies
- Auto-scaling groups

### GCP (альтернатива)

- **GKE**: Kubernetes
- **Cloud Storage**: object storage
- **Cloud SQL**: PostgreSQL
- **Memorystore**: Redis
- **Cloud CDN**: content delivery
- **Cloud KMS**: key management
- **AI Platform**: ML training/serving
- **Pub/Sub**: messaging
- **Cloud Armor**: security

### Azure (альтернатива)

- **AKS**: Kubernetes
- **Blob Storage**: object storage
- **Azure Database for PostgreSQL**: managed DB
- **Azure Cache for Redis**: caching
- **Azure CDN**: content delivery
- **Key Vault**: secrets management
- **Azure ML**: ML platform
- **Service Bus**: messaging
- **Application Gateway**: load balancing

## Kubernetes и Container Orchestration

### Cluster Architecture

```yaml
# Production Cluster Structure
namespaces:
  - production:
      - api-gateway
      - auth-service
      - content-service
      - moderation-service
      - notification-service
      - ml-inference (GPU nodes)
  - staging:
      - [same services as production]
  - monitoring:
      - prometheus
      - grafana
      - alertmanager
  - logging:
      - elasticsearch
      - kibana
      - fluentd
```

### Node Pools

1. **General Purpose Nodes**
   - API Gateway, Auth, Notification
   - Auto-scaling: 3-10 nodes
   - Instance type: t3.large/medium

2. **Compute Optimized Nodes**
   - Content processing
   - Auto-scaling: 2-8 nodes
   - Instance type: c5.xlarge

3. **GPU Nodes**
   - ML Inference
   - Auto-scaling: 1-5 nodes
   - Instance type: p3.2xlarge (V100)

4. **Memory Optimized Nodes**
   - Analytics, caching
   - Auto-scaling: 2-4 nodes
   - Instance type: r5.xlarge

### Deployment Strategy

- **Rolling updates**: zero-downtime deployments
- **Blue-green deployments**: для критических сервисов
- **Canary deployments**: для ML моделей
- **Health checks**: liveness, readiness probes
- **Resource limits**: CPU, memory для каждого pod
- **HPA (Horizontal Pod Autoscaler)**: auto-scaling по CPU/memory
- **VPA (Vertical Pod Autoscaler)**: оптимизация ресурсов

### Service Mesh (опционально для Production)

- **Istio/Linkerd**: для advanced networking
- **Features**: 
  - Traffic management
  - mTLS между сервисами
  - Observability
  - Circuit breaking
  - Rate limiting

## SRE и Операционные практики

### Мониторинг

#### Prometheus + Grafana
- **Метрики сервисов**:
  - Request rate, latency, error rate (RED)
  - CPU, memory, disk usage (USE)
  - Custom business metrics
- **Dashboards**:
  - Service health overview
  - ML inference performance
  - Moderation queue metrics
  - User activity metrics

#### Alerting
```yaml
Alerts:
  Critical:
    - Service down (5xx > 1%)
    - Database connection pool exhausted
    - Disk space < 10%
    - ML inference latency > 10s
  Warning:
    - High latency (p95 > 2s)
    - Memory usage > 80%
    - Moderation queue backlog > 1000
```

### Логирование

#### Stack: ELK/EFK
- **Elasticsearch**: хранение логов
- **Fluentd/Fluent Bit**: log collection
- **Kibana**: visualization и search

#### Log Levels
- **ERROR**: failures, exceptions
- **WARN**: потенциальные проблемы
- **INFO**: важные events (user actions, moderation decisions)
- **DEBUG**: детальная информация для troubleshooting

#### Structured Logging
```json
{
  "timestamp": "2026-01-02T08:00:00Z",
  "level": "INFO",
  "service": "moderation-service",
  "traceId": "abc123",
  "userId": "user456",
  "contentId": "content789",
  "action": "moderation_decision",
  "decision": "approved",
  "mlScore": 0.15,
  "moderatorId": "mod001"
}
```

### On-Call и Incident Response

#### Rotation
- Primary on-call: SRE/DevOps
- Secondary on-call: Backend Engineer
- Escalation: CTO

#### Incident Severity
- **P0 (Critical)**: полный outage, data breach
- **P1 (High)**: частичный outage, degraded performance
- **P2 (Medium)**: minor issues, workaround available
- **P3 (Low)**: cosmetic issues, feature requests

#### Runbooks
- Service restart procedures
- Database failover
- Rollback deployments
- ML model rollback
- Security incident response

### Disaster Recovery

#### Backup Strategy
- **Databases**: automated daily backups, 30-day retention
- **S3 content**: versioning enabled, cross-region replication
- **Configuration**: Git repository, encrypted

#### Recovery Objectives
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour

#### DR Procedures
1. Restore database from backup
2. Deploy infrastructure from IaC
3. Deploy services from container registry
4. Restore S3 content from replica
5. Update DNS
6. Validate service health

### Performance Optimization

#### Caching Strategy
- **CDN**: статика, media (CloudFront/Fastly)
- **Redis**: sessions, hot data, API responses
- **Application cache**: in-memory для referential data

#### Database Optimization
- **Indexing**: на частые queries
- **Connection pooling**: PgBouncer
- **Read replicas**: для аналитики
- **Partitioning**: для больших таблиц (logs, analytics)

#### Content Delivery
- **Image optimization**: resize, compress, WebP
- **Video optimization**: adaptive bitrate, thumbnail
- **Lazy loading**: в мобильном приложении

## Безопасность (Security)

### Шифрование

#### Data at Rest
- **Databases**: encryption с AWS KMS
- **S3**: server-side encryption (SSE-KMS)
- **Backups**: encrypted snapshots
- **Logs**: encrypted в CloudWatch/S3

#### Data in Transit
- **TLS 1.3**: для всех внешних connections
- **mTLS**: между микросервисами (опционально через Istio)
- **VPN**: для administrative access
- **Encrypted channels**: для websockets

#### KMS (Key Management Service)
- **Master keys**: AWS KMS для envelope encryption
- **Key rotation**: автоматическая ротация каждые 90 дней
- **Access control**: IAM policies для ключей
- **Audit**: CloudTrail логи использования ключей

### Аутентификация и Авторизация

#### OAuth2 + JWT
- **Access tokens**: короткий TTL (15 min)
- **Refresh tokens**: длинный TTL (30 days), rotated
- **Token signing**: RS256 (asymmetric)
- **Token storage**: httpOnly cookies (web), secure storage (mobile)

#### Multi-Factor Authentication (MFA)
- **Methods**: SMS, Email, TOTP (Google Authenticator)
- **Enforcement**: обязательно для родителей
- **Backup codes**: для recovery

#### Session Management
- **Storage**: Redis с TTL
- **Invalidation**: при logout, password change
- **Concurrent sessions**: лимит 3 active sessions
- **IP tracking**: для fraud detection

### RBAC (Role-Based Access Control)

#### Roles
```yaml
Roles:
  - Parent:
      permissions:
        - manage_own_children
        - view_own_content
        - moderate_own_family
  - Child:
      permissions:
        - upload_content
        - view_approved_content
  - Moderator:
      permissions:
        - review_content
        - approve_content
        - block_content
  - Admin:
      permissions:
        - manage_users
        - manage_settings
        - view_analytics
  - SuperAdmin:
      permissions:
        - all_permissions
```

### Мониторинг безопасности

#### Prometheus + Grafana
- **Метрики**:
  - Failed login attempts
  - Anomalous API usage
  - Suspicious upload patterns
  - MFA bypass attempts

#### SIEM (Security Information and Event Management)
- **Solutions**: Splunk, Datadog Security, AWS Security Hub
- **Use cases**:
  - Centralized logging
  - Threat detection
  - Compliance reporting
  - Incident investigation

#### Vulnerability Scanning
- **Container images**: Trivy, Clair
- **Dependencies**: Snyk, Dependabot
- **Infrastructure**: AWS Inspector, Nessus
- **Schedule**: weekly scans, immediate на critical CVEs

### Logging и Audit

#### Audit Logs
```json
{
  "timestamp": "2026-01-02T08:00:00Z",
  "actor": "user123",
  "action": "update_filter_level",
  "resource": "child456",
  "before": "moderate",
  "after": "strict",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### Retention Policy
- **Security logs**: 2 years
- **Application logs**: 90 days
- **Audit logs**: 7 years (compliance)
- **Access logs**: 1 year

#### Compliance
- **COPPA**: parental consent, data deletion
- **GDPR**: right to access, right to be forgotten
- **CCPA**: data disclosure, opt-out

### Incident Response

#### Playbook
1. **Detection**: alerts, monitoring, reports
2. **Assessment**: severity, impact, affected users
3. **Containment**: isolate affected systems
4. **Eradication**: remove threat, patch vulnerability
5. **Recovery**: restore services, validate
6. **Lessons Learned**: post-mortem, improvements

#### Communication
- **Internal**: Slack channel, PagerDuty
- **External**: status page, email to affected users
- **Regulatory**: notification по GDPR/COPPA при breach

#### Security Team
- **Security Lead**: координация response
- **DevOps**: infrastructure changes
- **Legal**: compliance, notifications
- **PR**: external communication

### Penetration Testing

#### Schedule
- **External**: quarterly
- **Internal**: bi-annually
- **Post-major-release**: после значительных изменений

#### Scope
- Web application security
- API security
- Mobile app security
- Infrastructure security
- Social engineering

#### Vendors
- **In-house**: security team
- **Third-party**: certified pentest firms
- **Bug bounty**: HackerOne, Bugcrowd (после GA)

## Масштабирование и рост

### Стратегия масштабирования

#### Horizontal Scaling
- Kubernetes HPA для сервисов
- Database read replicas
- CDN для глобального контента

#### Vertical Scaling
- Увеличение instance sizes при необходимости
- Database instance upgrades

#### Geographic Distribution
- Multi-region deployment для latency
- Data residency для compliance (EU, US, Asia)

### Capacity Planning

#### Metrics
- DAU/MAU growth rate
- Content upload rate
- Moderation throughput
- Storage growth

#### Forecasting
- Quarterly capacity reviews
- Budget planning
- Infrastructure optimization

## Диаграмма компонентов

См. [диаграмму архитектуры](./diag.svg) для полной визуализации.

---

**Примечание**: Это архитектурный документ-черновик. Детали реализации могут меняться в процессе разработки. Все секреты, ключи и credentials должны храниться в GitHub Secrets, HashiCorp Vault или AWS Secrets Manager.
