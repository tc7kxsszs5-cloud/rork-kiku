# Архитектура платформы Rork-Kiku

## Обзор

Rork-Kiku — это безопасная платформа для семейного обмена медиа-контентом с встроенной системой модерации на основе машинного обучения. Архитектура спроектирована с учётом высоких требований к безопасности, масштабируемости и производительности.

## Диаграмма архитектуры

![Архитектурная диаграмма](./diag.svg)

## Слои архитектуры

### 1. Клиентский слой

#### Мобильные приложения
- **iOS приложение**: Native Swift/SwiftUI, iOS 15+
- **Android приложение**: Native Kotlin/Jetpack Compose, Android 8.0+
- **Веб-интерфейс**: React/Next.js для родительской панели управления

#### Функциональность клиента
- Регистрация и аутентификация родителей
- Создание профилей детей
- Загрузка медиа (фото, видео)
- Просмотр семейной ленты
- Настройки модерации и контроля
- Push-уведомления

### 2. API Gateway слой

#### Технологии
- **Primary API**: tRPC для типобезопасного взаимодействия
- **REST API**: Резервный вариант для внешних интеграций
- **GraphQL**: Опциональный слой для сложных запросов

#### API Gateway функции
- Rate limiting и throttling
- Аутентификация и авторизация (JWT)
- Request/response трансформация
- Маршрутизация к микросервисам
- Кэширование на уровне API
- SSL/TLS терминация

### 3. Микросервисы

#### Auth Service (Сервис аутентификации)
- OAuth2 / OpenID Connect провайдеры (Google, Apple, Email)
- JWT токены с refresh механизмом
- Multi-factor authentication (опционально)
- Session management
- RBAC (Role-Based Access Control)

**Технологии**: Node.js/TypeScript, Fastify, Redis для сессий

#### User Service (Сервис пользователей)
- Управление профилями родителей
- Управление профилями детей
- Семейные группы и связи
- Настройки приватности
- Consent management (COPPA/GDPR)

**Технологии**: Node.js/TypeScript, PostgreSQL

#### Media Service (Сервис медиа)
- Загрузка медиа-файлов
- Обработка изображений (resize, optimization)
- Видео транскодинг
- Генерация thumbnails
- Хранение метаданных

**Технологии**: Node.js/TypeScript, S3-compatible storage, FFmpeg

#### Moderation Service (Сервис модерации)
- Интеграция с ML-модулем
- Очередь контента на модерацию
- Ручная модерация (human-in-the-loop)
- Правила и политики модерации
- Эскалация и апелляция

**Технологии**: Python/FastAPI, RabbitMQ/SQS, PostgreSQL

#### Notification Service (Сервис уведомлений)
- Push-уведомления (FCM, APNS)
- Email уведомления
- In-app уведомления
- Настройки предпочтений

**Технологии**: Node.js/TypeScript, Firebase/APNS SDK, SendGrid

#### Analytics Service (Сервис аналитики)
- Сбор метрик использования
- A/B тестирование
- User behavior tracking
- Compliance reporting

**Технологии**: Node.js/TypeScript, ClickHouse/BigQuery

### 4. ML-модуль модерации

#### Компоненты
- **Image classification**: Распознавание небезопасного контента
- **Object detection**: Обнаружение объектов на изображениях
- **Video analysis**: Покадровый анализ видео
- **Text moderation**: NLP для анализа текстовых описаний
- **Face detection**: Обнаружение и блюр лиц (опционально)

#### Инфраструктура ML
- **Training pipeline**: Offline обучение моделей
- **Inference service**: Real-time/batch предсказания
- **Model versioning**: MLflow, KubeFlow
- **A/B testing моделей**: Градуальный rollout новых версий

**Технологии**: Python, TensorFlow/PyTorch, TorchServe/TensorFlow Serving, GPU instances (NVIDIA T4/A100)

#### Метрики качества
- Accuracy: >95%
- False positive rate: <5%
- Inference latency: <500ms (p95)
- Throughput: 1000+ requests/sec

### 5. Data Flows

#### Сценарий 1: Регистрация родителя
1. Пользователь инициирует регистрацию в приложении
2. OAuth2 flow с провайдером (Google/Apple) или email
3. Auth Service создаёт JWT токены (access + refresh)
4. User Service создаёт профиль родителя
5. Возврат токенов клиенту
6. Клиент сохраняет токены в secure storage (Keychain/Keystore)

#### Сценарий 2: Создание профиля ребёнка
1. Родитель заполняет форму профиля ребёнка
2. User Service валидирует данные и родительское согласие
3. Создание профиля ребёнка с привязкой к родителю
4. Установка начальных настроек модерации
5. Отправка подтверждения родителю

#### Сценарий 3: Загрузка и модерация медиа
1. Пользователь выбирает медиа в приложении
2. Клиент загружает файл в Media Service (multipart upload)
3. Media Service:
   - Сохраняет оригинал в S3
   - Генерирует thumbnails
   - Извлекает метаданные (EXIF)
4. Отправка задачи в Moderation Service
5. ML-модуль анализирует контент
6. Если контент безопасен: публикация в семейную ленту
7. Если контент подозрителен: отправка на ручную модерацию
8. Если контент небезопасен: блокировка и уведомление
9. Уведомление пользователя о статусе

#### Сценарий 4: Автоматическая модерация
1. Moderation Service получает задачу из очереди
2. Вызов ML Inference Service
3. Получение prediction scores
4. Применение правил на основе threshold:
   - score < 0.3: автоматический reject
   - 0.3 <= score <= 0.7: ручная модерация
   - score > 0.7: автоматический approve
5. Обновление статуса контента
6. Логирование решения для audit trail

#### Сценарий 5: Ручная модерация
1. Модератор получает задачу из очереди
2. Просмотр контента и контекста
3. Принятие решения (approve/reject/escalate)
4. Добавление комментариев и тегов
5. Обновление статуса контента
6. Отправка уведомления пользователю
7. Фидбек в ML-систему для переобучения

#### Сценарий 6: Уведомления
1. Event происходит в системе (новое фото, результат модерации)
2. Публикация события в event bus
3. Notification Service получает событие
4. Проверка настроек пользователя
5. Формирование уведомления
6. Отправка через соответствующий канал (push/email)
7. Tracking доставки и открытия

## Рекомендации по облакам

### AWS (Рекомендуемый)
- **Compute**: EKS (Kubernetes), ECS, Lambda
- **Storage**: S3, EBS, EFS
- **Database**: RDS (PostgreSQL), DynamoDB, ElastiCache (Redis)
- **ML**: SageMaker, EC2 GPU instances
- **CDN**: CloudFront
- **Security**: KMS, Secrets Manager, WAF, Shield
- **Monitoring**: CloudWatch, X-Ray

### GCP (Альтернатива)
- **Compute**: GKE, Cloud Run, Cloud Functions
- **Storage**: Cloud Storage, Persistent Disk
- **Database**: Cloud SQL, Firestore, Memorystore
- **ML**: Vertex AI, Compute Engine GPU
- **CDN**: Cloud CDN
- **Security**: Cloud KMS, Secret Manager, Cloud Armor
- **Monitoring**: Cloud Monitoring, Cloud Trace

### Azure (Альтернатива)
- **Compute**: AKS, Container Instances, Functions
- **Storage**: Blob Storage, Managed Disks
- **Database**: Azure Database for PostgreSQL, Cosmos DB, Azure Cache
- **ML**: Azure ML, GPU VMs
- **CDN**: Azure CDN
- **Security**: Key Vault, Azure Firewall, DDoS Protection
- **Monitoring**: Azure Monitor, Application Insights

## CDN Strategy

### Требования
- Global edge locations (минимум 50+ точек присутствия)
- Image/video optimization и transcoding на edge
- Кэширование статического контента (TTL: 1 год)
- Динамический контент acceleration
- DDoS protection и WAF
- SSL/TLS сертификаты (wildcard или SNI)

### Провайдеры
- **CloudFlare** (основной): Global network, R2 storage, Workers
- **AWS CloudFront**: Интеграция с S3, Lambda@Edge
- **Fastly**: Varnish-based, real-time purging
- **Akamai**: Enterprise-grade, high-cost

## Kubernetes и Helm

### Кластерная архитектура
- **Production**: Multi-AZ, минимум 3 master nodes, auto-scaling worker nodes
- **Staging**: Single-AZ, 1 master, 2-3 workers
- **Development**: Minikube/Kind локально

### Namespaces
- `auth-service`
- `user-service`
- `media-service`
- `moderation-service`
- `notification-service`
- `analytics-service`
- `ml-inference`
- `monitoring`

### Helm Charts
- Использование Helm 3
- Charts для каждого микросервиса
- Umbrella chart для full-stack deployment
- Values.yaml для разных окружений (dev/staging/prod)

### Service Mesh (опционально)
- **Istio** или **Linkerd** для:
  - Service-to-service mTLS
  - Traffic management и canary deployments
  - Observability и distributed tracing
  - Circuit breaking и retries

## SRE и операционные практики

### Мониторинг

#### Метрики (Prometheus + Grafana)
- Infrastructure: CPU, memory, disk, network
- Application: Request rate, error rate, latency (RED метрики)
- Business: DAU, MAU, upload rate, moderation queue depth
- ML: Inference latency, model accuracy drift

#### Дашборды
- Infrastructure overview
- Service-specific dashboards
- ML pipeline dashboard
- Business metrics dashboard
- On-call dashboard

### Логирование

#### Stack: ELK/EFK или Loki
- **Сбор**: Fluentd/Fluent Bit
- **Хранение**: Elasticsearch/Loki
- **Визуализация**: Kibana/Grafana
- **Retention**: 30 дней hot, 90 дней cold, 1 год archive

#### Структура логов
```json
{
  "timestamp": "2026-01-02T09:15:00Z",
  "level": "INFO",
  "service": "media-service",
  "trace_id": "abc123",
  "user_id": "user-456",
  "message": "Media uploaded successfully",
  "metadata": {
    "media_id": "media-789",
    "file_size": 1024000
  }
}
```

### Distributed Tracing
- **OpenTelemetry** для инструментирования
- **Jaeger** или **Tempo** для хранения трейсов
- Trace ID propagation через все сервисы
- Корреляция логов и трейсов

### Alerting
- **Alertmanager** для роутинга алертов
- Критичность: P0 (critical), P1 (high), P2 (medium), P3 (low)
- Каналы: PagerDuty, Slack, Email, SMS
- On-call rotation через PagerDuty/OpsGenie

### SLI/SLO/SLA

#### User Service
- **SLI**: Availability, latency (p95, p99)
- **SLO**: 99.9% uptime, p95 < 100ms
- **SLA**: 99.5% (коммерческое соглашение)

#### Media Service
- **SLI**: Upload success rate, processing time
- **SLO**: 99.5% success rate, p95 processing < 5s
- **SLA**: 99% (коммерческое соглашение)

#### ML Inference
- **SLI**: Inference latency, availability
- **SLO**: p95 < 500ms, 99% uptime
- **SLA**: 95% (внутренний SLA)

## Масштабирование

### Horizontal Scaling
- Stateless сервисы: HPA (Horizontal Pod Autoscaler) на основе CPU/memory или custom metrics
- Stateful сервисы: StatefulSet с replica scaling
- Database: Read replicas, sharding по user_id/family_id

### Vertical Scaling
- GPU instances для ML: P3/P4 на AWS, T4/A100 на GCP
- Database: Увеличение instance size при необходимости
- Cache: Увеличение memory для Redis/Memcached

### Региональное масштабирование
- Multi-region deployment для глобального присутствия
- Регионы: US-East, US-West, EU-West, Asia-Pacific
- Geo-based routing для снижения latency
- Data residency compliance (GDPR)

### Оптимизации
- Connection pooling для databases
- HTTP/2 и gRPC для межсервисного взаимодействия
- Compression (gzip, brotli) для API responses
- Lazy loading и pagination для списков
- Incremental backups вместо full

## High Availability (HA)

### Требования
- **Uptime target**: 99.9% (8.76 часов downtime/год)
- **RTO** (Recovery Time Objective): < 1 час
- **RPO** (Recovery Point Objective): < 15 минут

### Стратегии

#### Multi-AZ Deployment
- Kubernetes nodes в разных availability zones
- Database Multi-AZ с автоматическим failover
- Load balancers распределены по AZ

#### Database HA
- Primary-Replica setup с автоматическим failover
- Read replicas для распределения нагрузки
- Point-in-time recovery (PITR)
- Daily automated backups, retention 30 дней

#### Disaster Recovery
- Cross-region backup и replication
- DR runbooks и регулярные DR drills (quarterly)
- Automation для failover процедур

#### Chaos Engineering
- Chaos Monkey для тестирования resilience
- Регулярные game days (monthly)
- Testing: pod failures, node failures, AZ failures

## Безопасность

### Transport Layer Security (TLS)

#### Внешние соединения
- TLS 1.3 (minimum TLS 1.2)
- Strong cipher suites only (ECDHE, AES-GCM)
- Certificate pinning в мобильных приложениях
- HSTS (HTTP Strict Transport Security)
- Certificate rotation: автоматическая через Let's Encrypt или AWS Certificate Manager

#### Внутренние соединения
- mTLS между микросервисами (через service mesh или cert-manager)
- VPN/Private Link для cross-region communication

### Шифрование данных at-rest

#### Уровни шифрования
1. **Database encryption**: AES-256
   - Transparent Data Encryption (TDE) для PostgreSQL
   - Encrypted EBS volumes
2. **Storage encryption**: AES-256
   - S3 Server-Side Encryption (SSE-KMS)
   - Client-side encryption для особо чувствительных данных
3. **Backup encryption**: AES-256
   - Encrypted snapshots и backups

#### KMS (Key Management Service)
- **AWS KMS**, **GCP Cloud KMS**, или **Azure Key Vault**
- Customer Master Keys (CMK) для каждого окружения
- Data Encryption Keys (DEK) для шифрования данных
- Key hierarchy: Root key -> Environment key -> Data key

### Ротация ключей

#### Стратегия
- **Encryption keys**: Автоматическая ротация раз в 90 дней
- **API keys/tokens**: Ротация раз в 30 дней или при компрометации
- **Database credentials**: Ротация раз в 60 дней через Secrets Manager
- **TLS certificates**: Автоматическая ротация через cert-manager

#### Процесс ротации
1. Генерация нового ключа
2. Dual-writing (запись старым и новым ключом)
3. Миграция существующих данных (background job)
4. Переключение на чтение только нового ключа
5. Удаление старого ключа через grace period (30 дней)

### RBAC (Role-Based Access Control)

#### Роли
- **Super Admin**: Полный доступ ко всем ресурсам
- **Admin**: Управление пользователями и контентом
- **Moderator**: Доступ к модерации контента
- **Support**: Ограниченный доступ для поддержки пользователей
- **Parent**: Стандартные права родителя
- **Child**: Ограниченные права ребёнка

#### Permissions
- `users:read`, `users:write`, `users:delete`
- `content:read`, `content:write`, `content:delete`, `content:moderate`
- `analytics:read`
- `settings:write`

#### Реализация
- OAuth2 scopes для API
- Kubernetes RBAC для инфраструктуры
- IAM policies для облачных ресурсов
- Least privilege principle

### Мониторинг и логирование безопасности

#### SIEM (Security Information and Event Management)
- **Splunk**, **Elastic SIEM**, или **Sumo Logic**
- Централизация security logs
- Correlation rules для детекции атак
- Real-time alerting

#### Security Monitoring
- **Prometheus + Grafana** для метрик безопасности:
  - Failed login attempts
  - Unauthorized API calls
  - Suspicious content uploads
  - Anomalous traffic patterns
- **Falco** для runtime security в Kubernetes

#### Audit Trails
- Полное логирование всех административных действий
- Immutable audit logs (WORM storage)
- Retention: минимум 1 год
- Регулярные аудиты доступа

### Incident Response

#### Playbook
1. **Detection**: Автоматические алерты или ручное обнаружение
2. **Assessment**: Определение scope и severity инцидента
3. **Containment**: Изоляция скомпрометированных систем
4. **Eradication**: Удаление угрозы
5. **Recovery**: Восстановление сервисов
6. **Lessons Learned**: Post-mortem и улучшения

#### Команда IR
- Incident Commander
- Technical Lead
- Security Engineer
- Communications Lead
- Legal (при необходимости)

#### Инструменты
- **PagerDuty** для escalation
- **Slack** для координации
- **Jira** для tracking
- **Confluence** для документации

#### Коммуникация
- Internal: Slack incident channel, status page
- External: Email, social media, PR
- Regulatory: Обязательное уведомление при утечке персональных данных (GDPR: 72 часа)

### Vulnerability Management

#### Процессы
- **Dependency scanning**: Snyk, Dependabot, Trivy
- **Container scanning**: Trivy, Clair, Anchore
- **Code scanning**: SonarQube, CodeQL
- **DAST**: OWASP ZAP, Burp Suite
- **Penetration testing**: Ежеквартальные pentest внешними аудиторами

#### Patching Policy
- **Critical vulnerabilities**: Patch в течение 24 часов
- **High vulnerabilities**: Patch в течение 7 дней
- **Medium vulnerabilities**: Patch в течение 30 дней
- **Low vulnerabilities**: Patch в следующем релизе

### Compliance

#### Требования
- **COPPA** (Children's Online Privacy Protection Act)
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **FERPA** (Family Educational Rights and Privacy Act)
- **SOC 2 Type II** (планируется после seed раунда)

#### Процессы
- Privacy Impact Assessment (PIA)
- Data Protection Impact Assessment (DPIA)
- Regular compliance audits
- Employee training на GDPR/COPPA

## Технологический стек (итоговый)

### Backend
- **Languages**: TypeScript (Node.js), Python
- **Frameworks**: Fastify, FastAPI, Express
- **API**: tRPC, REST, GraphQL (опционально)
- **Databases**: PostgreSQL, Redis, DynamoDB/Firestore
- **Message Queues**: RabbitMQ, SQS, Kafka

### Frontend
- **Mobile**: Swift/SwiftUI (iOS), Kotlin/Jetpack Compose (Android)
- **Web**: React, Next.js, TypeScript
- **State Management**: Redux Toolkit, React Query

### ML/AI
- **Frameworks**: TensorFlow, PyTorch
- **Serving**: TorchServe, TensorFlow Serving
- **Training**: Jupyter, MLflow, Kubeflow
- **Monitoring**: MLflow, Weights & Biases

### DevOps/Infrastructure
- **Container**: Docker, containerd
- **Orchestration**: Kubernetes, Helm
- **CI/CD**: GitHub Actions, ArgoCD, Flux
- **IaC**: Terraform, Pulumi
- **Monitoring**: Prometheus, Grafana, Loki, Jaeger
- **Secret Management**: HashiCorp Vault, AWS Secrets Manager

### Cloud Providers
- **Primary**: AWS
- **Alternatives**: GCP, Azure

## Следующие шаги

1. Создание Proof of Concept (PoC) архитектуры в dev окружении
2. Setup CI/CD pipelines
3. Развёртывание MVP на staging
4. Load testing и performance tuning
5. Security audit и penetration testing
6. Production deployment
7. Post-launch monitoring и optimization

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Это черновой документ для внутреннего использования и инвесторов. Не содержит production-кода или секретов.
