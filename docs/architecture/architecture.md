# Архитектура системы Rork-Kiku

## Обзор

Rork-Kiku — это распределенная облачная система для защиты детей в цифровой среде, состоящая из мобильных клиентов (iOS, Android), backend API, ML-платформы для анализа контента, и административной панели для родителей и модераторов.

## Диаграмма архитектуры

![Архитектурная диаграмма](diag.svg)

> **Примечание**: Диаграмма находится в файле `diag.svg`. Для редактирования используйте draw.io, Lucidchart или аналогичные инструменты.

## Компоненты системы

### 1. Mobile Clients (iOS & Android)

**Технологии**:
- React Native + Expo
- Expo Router для навигации
- TypeScript
- React Query для кэширования
- Expo SecureStore для хранения токенов

**Ключевые модули**:
```
mobile/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Аутентификация
│   ├── (parent)/          # Родительская панель
│   ├── (child)/           # Детский интерфейс
│   └── (onboarding)/      # Онбординг
├── lib/
│   ├── api/               # API client
│   ├── ml/                # On-device ML (если применимо)
│   ├── filters/           # Локальная фильтрация
│   └── analytics/         # Аналитика
└── stores/                # State management
```

**Функции**:
- Регистрация и аутентификация (OAuth2/JWT)
- Real-time фильтрация контента
- Родительская панель управления
- Детский браузер с safe search
- Уведомления и алерты
- Offline-режим (partial)

### 2. Backend API

**Технологии**:
- **Язык**: Node.js (TypeScript) или Go
- **Фреймворк**: Express/Fastify (Node.js) или Gin (Go)
- **База данных**: PostgreSQL (primary), Redis (cache/sessions)
- **ORM**: Prisma (Node.js) или GORM (Go)
- **Аутентификация**: Passport.js / JWT + OAuth2
- **API Gateway**: Kong или AWS API Gateway

**Структура**:
```
backend/
├── api/
│   ├── auth/              # Аутентификация
│   ├── users/             # Управление пользователями
│   ├── content/           # Контент-фильтрация API
│   ├── ml/                # ML inference endpoints
│   ├── moderation/        # Модерация
│   └── analytics/         # Аналитика
├── services/
│   ├── ml-client/         # Клиент для ML-сервиса
│   ├── notification/      # Push notifications
│   └── storage/           # Работа с S3/GCS
├── middleware/
│   ├── auth/              # JWT validation
│   ├── rate-limit/        # Rate limiting
│   └── logging/           # Request logging
└── db/
    ├── migrations/        # DB migrations
    └── seeds/             # Test data
```

**Основные эндпоинты** (черновик):
```
POST   /api/v1/auth/register          # Регистрация
POST   /api/v1/auth/login             # Вход
POST   /api/v1/auth/refresh           # Обновление токена
GET    /api/v1/users/me               # Профиль пользователя
POST   /api/v1/content/check          # Проверка контента
GET    /api/v1/content/history        # История контента
POST   /api/v1/parental/controls      # Настройки родительского контроля
GET    /api/v1/analytics/dashboard    # Дашборд аналитики
POST   /api/v1/moderation/report      # Репорт контента
```

### 3. ML Platform (Анализ контента)

**Технологии**:
- **Язык**: Python
- **Фреймворки**: PyTorch, TensorFlow, Hugging Face Transformers
- **Serving**: TorchServe, TensorFlow Serving, или FastAPI
- **GPU**: NVIDIA T4/V100 (облако)

**Модели**:
```
ml-platform/
├── models/
│   ├── text-classifier/      # Классификация текста (токсичность)
│   ├── image-classifier/     # NSFW/violent content detection
│   ├── video-analyzer/       # Анализ видео (кадры)
│   └── language-detector/    # Определение языка
├── training/
│   ├── datasets/             # Обучающие данные (анонимизированные)
│   ├── scripts/              # Скрипты обучения
│   └── experiments/          # MLflow experiments
└── serving/
    ├── api/                  # REST API для inference
    └── batch/                # Batch processing
```

**Примеры моделей**:
- Text: BERT-based classifier (fine-tuned на токсичность)
- Image: ResNet/EfficientNet для NSFW detection
- Multimodal: CLIP для контекстного анализа

**Inference Flow**:
1. Backend получает запрос на проверку контента
2. Отправляет в ML API (sync или async через queue)
3. ML модель возвращает score и classification
4. Backend принимает решение (block/warn/allow) на основе policy

### 4. Data Storage

**PostgreSQL** (Primary Database):
```sql
-- Основные таблицы
users              # Пользователи (родители, дети)
profiles           # Профили с настройками
content_checks     # История проверок контента
ml_predictions     # Результаты ML-анализа
moderation_queue   # Очередь модерации
reports            # Репорты пользователей
audit_logs         # Аудит действий
```

**Redis** (Cache & Sessions):
- Сессии пользователей (JWT blacklist)
- Кэш ML predictions (TTL 1h)
- Rate limiting counters
- Real-time analytics

**S3/GCS** (Object Storage):
- Загруженные медиа (для модерации)
- ML model artifacts
- Backup данных
- Логи (архив)

### 5. Message Queue & Workers

**Технологии**:
- **Queue**: RabbitMQ, AWS SQS, или Google Cloud Pub/Sub
- **Workers**: Node.js/Go/Python workers

**Задачи**:
- Асинхронный ML inference
- Отправка уведомлений (push, email)
- Batch обработка контента
- Генерация отчетов
- Cleanup задачи

### 6. Admin Panel

**Технологии**:
- **Frontend**: React + TypeScript
- **UI Framework**: Material-UI или Ant Design
- **Charting**: Recharts/D3.js

**Функции**:
- Dashboard с метриками
- Модерация контента (очередь)
- Управление пользователями
- Настройка ML моделей (thresholds)
- Просмотр логов и аудита

## Data Flow

### Сценарий 1: Проверка текстового контента

```
1. Child App → POST /api/v1/content/check
   Body: { type: "text", content: "...", userId: "..." }

2. Backend API:
   - Валидация JWT
   - Rate limiting check
   - Проверка в Redis cache (hash контента)
   
3. (Cache miss) → ML Platform:
   - POST /ml/v1/classify/text
   - ML модель анализирует контент
   - Возвращает { score: 0.85, label: "toxic", confidence: 0.92 }

4. Backend:
   - Сохраняет в PostgreSQL (content_checks)
   - Кэширует в Redis (TTL 1h)
   - Принимает решение на основе policy
   - Возвращает { action: "block", reason: "toxic_content" }

5. Child App:
   - Блокирует контент
   - Показывает предупреждение
   - (Опционально) уведомляет родителя
```

### Сценарий 2: Родительский контроль

```
1. Parent App → PUT /api/v1/parental/controls
   Body: { childId: "...", restrictions: {...} }

2. Backend:
   - Валидация JWT (parent role)
   - Обновление в PostgreSQL (profiles table)
   - Инвалидация кэша ребенка
   - Отправка push notification ребенку (queue)

3. Worker:
   - Забирает задачу из queue
   - Отправляет push через APNs/FCM

4. Child App:
   - Получает push
   - Синхронизирует настройки
   - Обновляет локальный фильтр
```

### Сценарий 3: Batch анализ для модерации

```
1. Scheduled Job (Cron):
   - Запрашивает новый контент из moderation_queue

2. Worker:
   - Забирает батч (100 items)
   - Отправляет в ML Platform (batch endpoint)

3. ML Platform:
   - Обрабатывает батч параллельно
   - Возвращает predictions

4. Worker:
   - Обновляет статусы в PostgreSQL
   - Отправляет алерты модераторам (high-risk items)
   - Архивирует результаты
```

## Облачная инфраструктура

### Рекомендуемые облака

#### Option 1: AWS (Amazon Web Services)

**Плюсы**:
- Широкий набор сервисов
- Зрелая экосистема
- Хорошая ML поддержка (SageMaker)

**Компоненты**:
```
- EKS (Kubernetes)          # Backend & Workers
- RDS (PostgreSQL)          # База данных
- ElastiCache (Redis)       # Cache
- S3                        # Object storage
- SQS                       # Message queue
- Lambda                    # Serverless functions
- API Gateway               # API management
- CloudFront                # CDN
- Route 53                  # DNS
- ACM                       # SSL/TLS certificates
- KMS                       # Key management
- CloudWatch                # Monitoring
- SageMaker                 # ML training & inference
```

**Ориентировочная стоимость** (месяц, базовый сценарий):
- EKS: $75 (control plane) + $200 (nodes)
- RDS: $150 (db.t3.medium)
- ElastiCache: $50
- S3: $30-50
- SQS/Lambda: $20-50
- **Итого**: ~$550-600/мес (без ML GPU)

#### Option 2: GCP (Google Cloud Platform)

**Плюсы**:
- Отличная ML инфраструктура (Vertex AI)
- Хорошие цены на GPU
- Kubernetes-native (GKE)

**Компоненты**:
```
- GKE (Kubernetes)
- Cloud SQL (PostgreSQL)
- Memorystore (Redis)
- Cloud Storage
- Pub/Sub
- Cloud Functions
- Cloud CDN
- Cloud Load Balancing
- Cloud KMS
- Cloud Monitoring
- Vertex AI
```

#### Option 3: Azure

**Плюсы**:
- Интеграция с Microsoft экосистемой
- Хорошая поддержка enterprise
- Azure OpenAI Service

**Используется реже** для стартапов, но подходит для корпоративных пилотов.

### Выбор: AWS (рекомендуется)

Для Rork-Kiku рекомендуется **AWS** на начальном этапе:
- Наиболее распространен среди стартапов
- Лучшая документация и community
- AWS Activate программа для стартапов ($5k-100k кредитов)
- Зрелые ML сервисы

## Kubernetes (EKS/GKE)

### Namespace структура

```
namespaces:
  - production          # Prod окружение
  - staging             # Staging
  - development         # Dev/testing
  - ml-inference        # ML models
```

### Deployments

```yaml
# Backend API
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rork-kiku-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rork-kiku-api
  template:
    spec:
      containers:
      - name: api
        image: rork-kiku/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: rork-kiku-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: rork-kiku-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Site Reliability Engineering (SRE)

### Мониторинг

**Prometheus + Grafana**:
```
Метрики:
- HTTP request rate/latency (p50, p95, p99)
- Database connection pool
- Redis cache hit rate
- ML inference time
- Queue depth (RabbitMQ/SQS)
- Error rate по эндпоинтам
```

**Alerting** (PagerDuty / OpsGenie):
```
Критические алерты:
- API error rate > 5% (5 min window)
- p99 latency > 2s
- Database connections > 90% pool
- Disk space > 85%
- ML inference failures > 10%
```

### Логирование

**Stack**: ELK (Elasticsearch, Logstash, Kibana) или Cloud Logging

**Структура логов**:
```json
{
  "timestamp": "2026-01-02T08:00:00Z",
  "level": "info",
  "service": "api",
  "traceId": "abc123",
  "userId": "user_456",
  "endpoint": "/api/v1/content/check",
  "method": "POST",
  "statusCode": 200,
  "duration": 123,
  "message": "Content check completed"
}
```

**Retention**:
- Hot storage: 7 дней
- Warm storage: 30 дней
- Cold storage (S3): 1 год

### Backup & Disaster Recovery

**PostgreSQL Backups**:
- Continuous WAL archiving (Point-in-Time Recovery)
- Daily full backup
- Retention: 30 days

**Redis**:
- RDB snapshots каждые 6 часов
- AOF (Append-Only File) для durability

**RTO/RPO**:
- RTO (Recovery Time Objective): < 1 час
- RPO (Recovery Point Objective): < 15 минут

## Безопасность

### Шифрование

**В транзите**:
- TLS 1.3 для всех внешних соединений
- mTLS между внутренними сервисами (service mesh: Istio/Linkerd)

**В покое**:
- PostgreSQL: Encryption at rest (AWS RDS encryption)
- S3: Server-side encryption (SSE-S3 или SSE-KMS)
- Redis: Encryption at rest (если поддерживается провайдером)

### Key Management Service (KMS)

**AWS KMS** для управления ключами:
```
Keys:
- rork-kiku/db-encryption         # Database encryption key
- rork-kiku/s3-encryption         # S3 bucket encryption
- rork-kiku/jwt-signing           # JWT signing key
- rork-kiku/api-secrets           # API secrets encryption
```

**Rotation**:
- Автоматическая ротация каждые 90 дней
- Manual rotation при compromised key

### Аутентификация и авторизация

**OAuth 2.0 + JWT**:
```
Flow:
1. User логинится → Backend генерирует JWT
2. JWT содержит: userId, role, permissions, exp
3. Mobile app сохраняет JWT в Expo SecureStore
4. Каждый запрос: Authorization: Bearer <JWT>
5. Backend валидирует JWT (signature, expiration)
```

**RBAC (Role-Based Access Control)**:
```
Roles:
- parent           # Родитель (read/write своих детей)
- child            # Ребенок (read only, ограниченный доступ)
- moderator        # Модератор (moderation queue)
- admin            # Администратор (full access)
- system           # Системный аккаунт (internal services)
```

**Permissions**:
```yaml
parent:
  - read:own_children
  - write:parental_controls
  - read:content_history
  
child:
  - read:own_profile
  - write:content_requests
  
moderator:
  - read:moderation_queue
  - write:moderation_decisions
  
admin:
  - read:all
  - write:all
```

### Network Security

**Firewall Rules**:
- Public: только API Gateway (port 443)
- Private: backend, databases (VPC internal)
- ML inference: отдельный VPC/subnet

**DDoS Protection**:
- AWS Shield Standard (включен по умолчанию)
- Rate limiting на API Gateway (10 req/sec per IP)
- CloudFlare (опционально, дополнительная защита)

### Мониторинг безопасности

**Prometheus + Grafana**:
- Failed login attempts (threshold: 5/min per IP)
- Suspicious API calls
- JWT validation failures

**Grafana Dashboards**:
- Security Overview
- Failed authentications
- API abuse patterns

### Incident Response

**Playbook** (см. `security/security_design.md`):
1. Detection → Alert в PagerDuty
2. Assessment → On-call engineer анализирует
3. Containment → Блокировка IP / отключение сервиса
4. Eradication → Устранение уязвимости
5. Recovery → Возврат к нормальной работе
6. Post-mortem → Анализ и улучшение

## Масштабирование

### Горизонтальное масштабирование

**Backend API**:
- Stateless сервисы → легко масштабируются
- HPA (Horizontal Pod Autoscaler) на основе CPU/memory
- Min replicas: 3, Max replicas: 10 (production)

**ML Inference**:
- GPU instances для тяжелых моделей
- Batch processing для non-real-time задач
- Model serving: TorchServe с auto-scaling

**Database**:
- Read replicas для read-heavy workloads
- Vertical scaling (upgrade instance type)
- Sharding (по userId) при очень больших объемах

### Кэширование

**Уровни кэширования**:
1. **Browser/Mobile**: Local storage для статики
2. **CDN**: CloudFront для медиа и статических ресурсов
3. **Redis**: API responses, ML predictions
4. **Database**: Query cache, materialized views

## Следующие шаги

1. **Выбор облачного провайдера**: AWS (рекомендуется)
2. **Setup Kubernetes**: EKS cluster с базовыми сервисами
3. **CI/CD Pipeline**: GitHub Actions → Docker → EKS
4. **Monitoring**: Prometheus + Grafana + AlertManager
5. **Security**: KMS setup, secrets management
6. **ML Platform**: Deploy базовых моделей (text classifier)

## Референсы

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [12-Factor App](https://12factor.net/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [SRE Book (Google)](https://sre.google/sre-book/table-of-contents/)

---

**Автор**: Техническая команда Rork-Kiku  
**Версия**: 0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Требует технического ревью и согласования с SRE/DevOps командой
