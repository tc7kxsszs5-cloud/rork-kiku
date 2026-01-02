# Архитектура системы Rork-Kiku

## Обзор

Rork-Kiku — это безопасная платформа для обмена медиаконтентом между родителями и детьми с многоуровневой модерацией и защитой данных несовершеннолетних.

## Архитектурные слои

### 1. Клиентский слой

**Мобильные приложения:**
- iOS (Swift/SwiftUI, React Native или Flutter)
- Android (Kotlin/Jetpack Compose, React Native или Flutter)

**Веб-интерфейс:**
- React/Next.js для родительской панели управления
- TypeScript для типобезопасности
- Tailwind CSS или Material UI

**Offline-first подход:**
- Локальное кэширование контента
- Синхронизация при восстановлении соединения
- Service Workers для PWA

### 2. API Gateway / BFF (Backend for Frontend)

**Технологии:**
- tRPC для type-safe API (рекомендуется)
- Альтернатива: REST API с OpenAPI 3.0 спецификацией
- GraphQL для гибких запросов (опционально)

**Функции:**
- Роутинг запросов к микросервисам
- Аутентификация и авторизация
- Rate limiting и throttling
- Request/response трансформация
- API versioning (v1, v2)

**Реализация:**
- Node.js/Express или Fastify
- Kong, Traefik или AWS API Gateway

### 3. Микросервисная архитектура

#### 3.1 Auth Service
**Функции:**
- Регистрация и верификация пользователей
- OAuth2/OIDC интеграция (Google, Apple, Facebook)
- JWT токены с короткой TTL (15 мин)
- Refresh tokens с долгой TTL (30 дней) в защищённом хранилище
- Multi-factor authentication (SMS, TOTP, email)
- Session management
- Password reset flow

**Технологии:**
- Auth0, Firebase Auth, или собственная реализация на Node.js/Go
- PostgreSQL для хранения пользовательских данных
- Redis для сессий и blacklist токенов

**Безопасность:**
- Bcrypt/Argon2 для хеширования паролей
- Rate limiting для защиты от brute force
- CAPTCHA на критических endpoints

#### 3.2 User Profile Service
**Функции:**
- Управление профилями родителей и детей
- Семейные связи (parent-child relationships)
- Настройки приватности
- Родительский контроль и ограничения

**Хранение:**
- PostgreSQL для структурированных данных
- MongoDB для гибких профильных данных (опционально)

#### 3.3 Media Service
**Функции:**
- Загрузка/скачивание медиафайлов
- Транскодирование видео/аудио
- Генерация thumbnails
- Оптимизация изображений (compression, resizing)

**Технологии:**
- S3-compatible storage (AWS S3, GCS, MinIO)
- CloudFront/CloudFlare CDN
- FFmpeg для обработки видео
- Sharp/ImageMagick для изображений

**Структура хранения:**
```
/{bucket}/
  /users/{user_id}/
    /media/{media_id}/
      /original.{ext}
      /thumbnail.jpg
      /processed.{ext}
```

#### 3.4 Moderation Service (ML-модуль)
**Автоматическая модерация:**
- Текстовая модерация (оскорбления, угрозы, adult content)
- Модерация изображений (NSFW, насилие, hate symbols)
- Модерация видео (frame-by-frame анализ)
- Модерация аудио (speech-to-text + текстовая модерация)

**ML модели:**
- OpenAI Moderation API
- Google Cloud Vision API
- AWS Rekognition
- Собственные модели (BERT, ResNet, YOLO)

**Inference:**
- TensorFlow Serving или PyTorch TorchServe
- GPU instances для высокой производительности
- Batch processing для оптимизации costs

**Scoring система:**
- Confidence score 0-1 для каждой категории
- Автоматическая блокировка при score > 0.9
- Очередь ручной модерации при 0.5 < score < 0.9
- Автоматический пропуск при score < 0.5

#### 3.5 Manual Moderation Service
**Функции:**
- Очередь контента на ручную проверку
- Интерфейс модератора
- Эскалация сложных случаев
- Обратная связь для улучшения ML моделей

**Workflow:**
1. Контент поступает в очередь (SQS, RabbitMQ, Kafka)
2. Модератор получает задачу
3. Просмотр и принятие решения (approve/reject/escalate)
4. Логирование действия и feedback для ML
5. Уведомление пользователя

**Метрики:**
- Average review time
- False positive/negative rate
- Moderator throughput
- Queue depth

#### 3.6 Notification Service
**Каналы:**
- Push notifications (FCM, APNs)
- Email (SendGrid, AWS SES, Mailgun)
- SMS (Twilio, AWS SNS)
- In-app notifications

**Типы уведомлений:**
- Новое сообщение/медиа от ребёнка
- Результат модерации
- Предупреждения безопасности
- Системные оповещения

**Технологии:**
- Redis для очереди уведомлений
- WebSocket/Server-Sent Events для real-time
- Template engine для email (Handlebars, Liquid)

#### 3.7 Analytics Service
**Метрики:**
- User behavior analytics
- Модерация effectiveness
- Content statistics
- Performance metrics
- Business KPIs

**Инструменты:**
- Google Analytics / Mixpanel
- Prometheus + Grafana для технических метрик
- Custom dashboard на React

### 4. Хранилища данных

#### 4.1 Реляционная БД (PostgreSQL)
**Использование:**
- Пользовательские данные
- Профили и связи
- Транзакционные данные
- Audit logs

**Конфигурация:**
- Primary-replica setup для read scaling
- Connection pooling (PgBouncer)
- Automated backups (ежедневные + WAL archiving)
- Encryption at rest (AWS RDS encryption)

#### 4.2 Объектное хранилище (S3)
**Использование:**
- Медиафайлы (original + processed)
- Архивы и backups
- Static assets

**Конфигурация:**
- Lifecycle policies (move to Glacier after 1 year)
- Versioning для критических данных
- S3 bucket policies и IAM roles
- Encryption (SSE-S3 или SSE-KMS)

#### 4.3 Кэш (Redis)
**Использование:**
- Session storage
- API response caching
- Rate limiting counters
- Real-time data

**Конфигурация:**
- Redis Cluster для high availability
- Persistence (RDB snapshots + AOF)
- Eviction policy (LRU)

#### 4.4 Message Queue (Kafka/RabbitMQ/SQS)
**Использование:**
- Асинхронная обработка медиа
- Очередь модерации
- Event-driven architecture
- Notifications queue

**Паттерны:**
- Producer-consumer
- Pub-sub для events
- Dead letter queue для failed messages
- Exactly-once delivery semantics

#### 4.5 Search (Elasticsearch/OpenSearch)
**Использование:**
- Полнотекстовый поиск по контенту
- Log aggregation
- Analytics queries

### 5. Облачная инфраструктура

#### Рекомендуемый провайдер: AWS
**Альтернативы:** GCP, Azure, Yandex Cloud

**Основные сервисы AWS:**
- **Compute:** EKS (Kubernetes), EC2, Lambda
- **Storage:** S3, EBS, EFS
- **Database:** RDS PostgreSQL, DynamoDB, ElastiCache Redis
- **Networking:** VPC, CloudFront CDN, Route53 DNS
- **Security:** IAM, KMS, Secrets Manager, WAF, Shield
- **ML:** SageMaker, Rekognition
- **Monitoring:** CloudWatch, X-Ray

#### Multi-region deployment
**Регионы:**
- Primary: eu-west-1 (Ireland) для EU compliance
- Secondary: us-east-1 (Virginia) для US users
- Tertiary: ap-southeast-1 (Singapore) для Asia

**Data residency:**
- EU data stays in EU (GDPR compliance)
- Cross-region replication для disaster recovery

### 6. Kubernetes и оркестрация

#### Kubernetes конфигурация
**Кластер:**
- Managed Kubernetes (EKS, GKE, AKS)
- Multi-availability zone deployment
- Node autoscaling (Cluster Autoscaler, Karpenter)
- Pod autoscaling (HPA, VPA)

**Namespaces:**
- `production`
- `staging`
- `development`
- `monitoring`

**Helm charts:**
- Стандартизированные charts для всех сервисов
- Values override для разных окружений
- GitOps подход (ArgoCD, Flux)

**Service Mesh (опционально):**
- Istio или Linkerd для advanced networking
- mTLS между сервисами
- Traffic management и canary deployments

### 7. CDN и статический контент

**CDN провайдер:**
- CloudFront (AWS)
- CloudFlare
- Fastly

**Функции:**
- Кэширование медиаконтента
- Edge locations близко к пользователям
- DDoS protection
- SSL/TLS termination

**Cache strategy:**
- Immutable content с длинным TTL (1 year)
- User-generated content с средним TTL (1 day)
- Cache invalidation через webhooks

## Data Flow для ключевых сценариев

### Сценарий 1: Регистрация родителя

```
1. User → Mobile App: Ввод email, пароля
2. Mobile App → API Gateway → Auth Service: POST /api/v1/auth/register
3. Auth Service → PostgreSQL: Создание записи пользователя
4. Auth Service → Notification Service: Отправка verification email
5. Notification Service → Email Provider: Отправка email
6. User: Переход по ссылке в email
7. Mobile App → Auth Service: GET /api/v1/auth/verify?token={token}
8. Auth Service → PostgreSQL: Обновление статуса verified=true
9. Auth Service → Mobile App: JWT access token + refresh token
10. Mobile App: Сохранение токенов в secure storage
```

### Сценарий 2: Создание профиля ребёнка

```
1. Parent → Mobile App: Ввод данных ребёнка (имя, возраст, фото)
2. Mobile App → API Gateway → User Profile Service: POST /api/v1/profiles/child
3. User Profile Service: Валидация parent_id и permissions
4. User Profile Service → PostgreSQL: Создание child profile
5. Mobile App → Media Service: Загрузка фото профиля
6. Media Service → S3: Сохранение фото
7. Media Service → Moderation Service: Автоматическая проверка фото
8. Moderation Service → ML API: Анализ изображения
9. ML API → Moderation Service: Score < 0.5 (safe)
10. Moderation Service → Media Service: Approval
11. Media Service → User Profile Service: Обновление profile_photo_url
12. User Profile Service → Mobile App: Success response
```

### Сценарий 3: Загрузка медиа ребёнком

```
1. Child → Mobile App: Выбор фото/видео для отправки родителю
2. Mobile App → API Gateway → Media Service: POST /api/v1/media/upload
3. Media Service: Генерация presigned S3 URL
4. Media Service → Mobile App: Presigned URL
5. Mobile App → S3: Прямая загрузка файла
6. S3 → Lambda/Event: S3 event trigger
7. Lambda → Media Service: Уведомление о завершении загрузки
8. Media Service → Moderation Service: Добавление в очередь модерации
9. Moderation Service → ML API: Анализ контента
   9a. Score < 0.5: Автоматический approve
   9b. 0.5 < Score < 0.9: Добавление в очередь ручной модерации
   9c. Score > 0.9: Автоматический reject
10. Manual Moderation Service: Модератор проверяет (для 9b)
11. Moderation Service → Media Service: Final decision
12. Media Service → Notification Service: Уведомление родителю (если approve)
13. Notification Service → APNs/FCM: Push notification
14. Parent Mobile App: Получение уведомления и отображение медиа
```

### Сценарий 4: Ручная модерация

```
1. Moderation Service → Manual Moderation Queue: Добавление контента
2. Moderator → Admin Panel: Открытие очереди
3. Admin Panel → Manual Moderation Service: GET /api/v1/moderation/queue
4. Manual Moderation Service → Moderator: Список контента для проверки
5. Moderator: Просмотр контента и принятие решения
6. Admin Panel → Manual Moderation Service: POST /api/v1/moderation/{id}/decision
7. Manual Moderation Service → Moderation Service: Обновление статуса
8. Manual Moderation Service → ML Service: Feedback для переобучения
9. Moderation Service → Media Service: Применение решения
10. Media Service → Notification Service: Уведомление пользователя
```

### Сценарий 5: Push-уведомления

```
1. Event Source (Media Service/Moderation Service) → Notification Service: Event
2. Notification Service → PostgreSQL: Получение notification preferences
3. Notification Service → Template Engine: Формирование сообщения
4. Notification Service → Redis: Добавление в очередь
5. Notification Worker → Redis: Получение задачи
6. Notification Worker → FCM/APNs: Отправка push notification
7. FCM/APNs → Mobile Device: Доставка уведомления
8. Mobile App: Отображение notification
9. User: Tap на notification
10. Mobile App → API Gateway: Fetch associated data
11. API Gateway → Relevant Service: GET /api/v1/media/{id}
12. Mobile App: Отображение контента
```

## Требования к масштабируемости

### Производительность

**Latency targets:**
- API response time: p50 < 100ms, p95 < 500ms, p99 < 1s
- Media upload: начало загрузки < 200ms
- Moderation: автоматическая < 5s, ручная < 5 min (target), < 1 hour (SLA)
- Push notifications: < 10s от события до доставки

**Throughput:**
- MVP: 1,000 active users, 10 req/s
- Pilot: 10,000 active users, 100 req/s
- Production: 1M active users, 10,000 req/s
- Scale to 10M users

**Concurrent connections:**
- WebSocket connections: до 100,000 одновременно
- Database connections: connection pooling с max 500 connections

### Высокая доступность (HA)

**Uptime SLA:**
- Production: 99.9% (8.76 hours downtime/year)
- Target: 99.95% (4.38 hours downtime/year)

**Redundancy:**
- Multi-AZ deployment для всех критичных компонентов
- Database replication (primary + 2 replicas)
- Stateless services с horizontal scaling
- Load balancing (ALB, NLB)

**Disaster Recovery:**
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 15 minutes
- Automated backups каждые 6 часов + continuous WAL archiving
- Cross-region backup replication
- Quarterly DR drills

**Circuit breakers:**
- Hystrix/Resilience4j patterns
- Graceful degradation при отказе зависимостей
- Fallback mechanisms

## Безопасность

### Шифрование

#### Шифрование в транзите (In Transit)
- **TLS 1.3** для всех внешних коммуникаций
- **mTLS** между внутренними микросервисами (опционально через service mesh)
- **Certificate management:** AWS Certificate Manager или Let's Encrypt
- **Perfect Forward Secrecy** enabled
- **HSTS** headers для веб-приложения

#### Шифрование в покое (At Rest)
- **AES-256** для всех данных в хранилищах
- **Database encryption:**
  - RDS PostgreSQL: transparent encryption
  - Application-level encryption для sensitive fields (PII)
- **S3 encryption:**
  - SSE-S3 или SSE-KMS для всех buckets
  - Bucket policies: deny unencrypted uploads
- **Backup encryption:** все backups зашифрованы

### Key Management Service (KMS)

**AWS KMS конфигурация:**
- Отдельные Customer Master Keys (CMK) для разных типов данных:
  - `rork-database-key` для RDS
  - `rork-s3-key` для S3
  - `rork-secrets-key` для Secrets Manager
  - `rork-application-key` для application-level encryption

**Управление ключами:**
- **Key rotation:** автоматическая ротация каждые 365 дней
- **Key policies:** least privilege access через IAM roles
- **Audit logging:** все операции с ключами логируются в CloudTrail
- **Multi-region keys:** для cross-region disaster recovery

**Envelope encryption:**
- Data keys генерируются из CMK
- Data keys используются для шифрования данных
- Encrypted data keys хранятся вместе с зашифрованными данными

### RBAC (Role-Based Access Control)

**Роли:**
- `parent` - родитель (полный доступ к своим детям)
- `child` - ребёнок (ограниченный доступ)
- `moderator` - модератор (доступ к очереди модерации)
- `admin` - администратор (полный доступ к системе)
- `support` - поддержка (read-only доступ для помощи пользователям)
- `auditor` - аудитор (read-only доступ к audit logs)

**Permissions:**
```
parent:
  - read:own_profile
  - update:own_profile
  - create:child_profile
  - read:child_profiles
  - update:child_profiles
  - read:child_media
  - send:messages_to_child
  - configure:parental_controls

child:
  - read:own_profile
  - update:own_profile (limited)
  - upload:media (with moderation)
  - send:messages_to_parent

moderator:
  - read:moderation_queue
  - approve:content
  - reject:content
  - escalate:content

admin:
  - *:* (full access)
```

**Реализация:**
- JWT claims с ролью и permissions
- Middleware для проверки permissions на каждом endpoint
- Database-level row security (PostgreSQL RLS)
- Audit logging всех privileged actions

### Мониторинг и алертинг

#### Prometheus + Grafana

**Метрики:**
- **Infrastructure:** CPU, memory, disk, network
- **Application:** request rate, error rate, latency (RED method)
- **Business:** active users, uploads, moderations, revenue

**Grafana dashboards:**
- System overview
- Service-specific dashboards
- Модерация dashboard
- Business KPIs

**Alerting rules:**
- High error rate (> 1%)
- High latency (p95 > 1s)
- Low disk space (< 20%)
- Failed backups
- Security incidents

#### Логирование

**Centralized logging:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana) или
- **AWS CloudWatch Logs**
- **Grafana Loki** (более легковесная альтернатива)

**Log levels:**
- DEBUG, INFO, WARN, ERROR, FATAL
- Production: INFO and above
- Development: DEBUG and above

**Structured logging:**
- JSON format для машинной обработки
- Обязательные поля: timestamp, service, level, message, trace_id, user_id
- Correlation IDs для трассировки запросов

**Log retention:**
- Hot storage: 30 дней (быстрый доступ)
- Warm storage: 1 год (архив)
- Cold storage: 7 лет (compliance, минимальный доступ)

**Sensitive data:**
- Маскирование PII в логах (email, phone, IP)
- Никогда не логировать пароли, токены, ключи

#### Audit Trails

**Audit events:**
- User registration/login
- Profile changes
- Media uploads
- Moderation decisions
- Admin actions
- Permission changes
- Data access/export/deletion

**Audit log format:**
```json
{
  "timestamp": "2026-01-02T10:30:00Z",
  "event_type": "media_upload",
  "user_id": "user_123",
  "actor_id": "user_123",
  "resource_type": "media",
  "resource_id": "media_456",
  "action": "create",
  "result": "success",
  "ip_address": "192.0.2.1",
  "user_agent": "RorkKiku/1.0 iOS/16.0",
  "metadata": {
    "file_size": 1024000,
    "content_type": "image/jpeg"
  }
}
```

**Retention:** минимум 7 лет для compliance

**Access control:**
- Read-only для auditors
- Immutable logs (write-once)
- Encryption at rest

### Incident Response

#### Incident Response Playbook

**Фазы:**

1. **Detection** (0-5 min)
   - Автоматические alerts от мониторинга
   - Сообщения от пользователей
   - Security scanning tools

2. **Identification** (5-15 min)
   - Оценка severity (P0-Critical, P1-High, P2-Medium, P3-Low)
   - Определение impact scope
   - Сбор initial logs и metrics

3. **Containment** (15-30 min)
   - Изоляция affected systems
   - Блокировка malicious actors
   - Rollback changes при необходимости
   - Communication to stakeholders

4. **Eradication** (30 min - hours)
   - Устранение root cause
   - Применение patches/fixes
   - Verification

5. **Recovery** (hours - days)
   - Постепенное восстановление сервисов
   - Мониторинг stability
   - Communication to users

6. **Post-Mortem** (1-2 weeks after)
   - Root cause analysis
   - Lessons learned
   - Action items для предотвращения в будущем
   - Обновление playbook

**Contacts:**
```
Incident Commander: [INCIDENT_COMMANDER_EMAIL]
Security Lead: [SECURITY_LEAD_EMAIL]
CTO: [CTO_EMAIL]
External Contacts:
  - AWS Support: [AWS_SUPPORT_NUMBER]
  - Legal Counsel: [LEGAL_EMAIL]
  - PR/Communications: [PR_EMAIL]
```

**Timelines для response:**
- P0 (Critical): acknowledge < 15 min, resolve < 4 hours
- P1 (High): acknowledge < 30 min, resolve < 24 hours
- P2 (Medium): acknowledge < 2 hours, resolve < 1 week
- P3 (Low): acknowledge < 1 day, resolve < 1 month

#### Security Incident Types

**Data breach:**
1. Немедленная блокировка доступа
2. Оценка scope (сколько данных, каких пользователей)
3. Уведомление affected users (GDPR: < 72 hours)
4. Уведомление регуляторов
5. Forensics и analysis

**DDoS attack:**
1. Активация DDoS mitigation (AWS Shield, CloudFlare)
2. Rate limiting и blacklisting
3. Scaling infrastructure
4. Communication to users о возможных задержках

**Unauthorized access:**
1. Принудительный logout всех пользователей
2. Password reset для affected accounts
3. Аудит access logs
4. Strengthening authentication

**Malware/malicious content upload:**
1. Блокировка content
2. Уведомление uploader и модераторов
3. Scan для similar content
4. Обновление ML models

## Диаграмма архитектуры

См. `diag.svg` в этой же директории для визуализации архитектуры.

## Заключение

Данная архитектура обеспечивает:
- **Безопасность:** многоуровневое шифрование, RBAC, audit trails
- **Масштабируемость:** horizontal scaling, caching, CDN
- **Надёжность:** high availability, disaster recovery, monitoring
- **Compliance:** GDPR, COPPA готовность через дизайн

По мере роста проекта архитектура может эволюционировать, но принципы security-first и privacy-by-design остаются неизменными.

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Авторы:** [FOUNDERS_EMAIL]
