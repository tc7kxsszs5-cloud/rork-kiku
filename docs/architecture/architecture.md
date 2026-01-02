# Архитектура Rork-Kiku

## Обзор

Rork-Kiku — это безопасная платформа для общения детей и родителей с встроенной системой модерации контента на базе машинного обучения. Архитектура спроектирована с учетом высоких требований к безопасности, масштабируемости и соответствию нормам защиты детей (COPPA, GDPR).

## Диаграмма архитектуры

См. [docs/architecture/diag.svg](./diag.svg) — визуальное представление архитектуры системы.

## Архитектурные слои

### 1. Клиентский слой (Client Layer)

#### Мобильные приложения
- **iOS**: React Native + Expo Router
- **Android**: React Native + Expo Router (планируется)
- **Web**: Expo Router (ограниченный функционал для родительской панели)

#### Ключевые характеристики:
- Offline-first подход для надежности
- Локальное шифрование данных
- Биометрическая аутентификация (Face ID, Touch ID)
- Минимальное хранение чувствительных данных на устройстве

### 2. API Gateway / tRPC слой

#### Технологический стек:
- **tRPC**: Type-safe API для TypeScript клиентов
- **Next.js API Routes** или **Node.js Express**: Backend для tRPC
- **API Gateway (AWS API Gateway / GCP API Gateway)**: Rate limiting, WAF, DDoS защита

#### Функции:
- Роутинг запросов к микросервисам
- Аутентификация и авторизация (JWT + OAuth2)
- Rate limiting и throttling
- Request/response валидация
- Логирование всех API вызовов

#### Безопасность API:
- HTTPS/TLS 1.3 для всех соединений
- JWT токены с коротким временем жизни (15-30 мин)
- Refresh tokens с длительным временем жизни (7-30 дней)
- CORS политики с whitelist доменов
- Input sanitization на всех эндпоинтах

### 3. Микросервисная архитектура (Microservices)

#### Основные сервисы:

**Authentication Service**
- Регистрация и аутентификация пользователей
- OAuth2 провайдеры (Apple, Google)
- Верификация родителей (документы, платежи)
- Управление сессиями
- Multi-factor authentication (MFA)

**User Profile Service**
- Управление профилями родителей
- Управление профилями детей (с parental consent)
- Связь родитель-ребенок
- Настройки приватности

**Content Service**
- Загрузка медиа (фото, видео, текст)
- Хранение контента (S3-compatible storage)
- CDN интеграция
- Metadata management

**Moderation Service**
- Очередь контента для модерации
- Интеграция с ML-модулем
- Ручная модерация (moderation dashboard)
- Эскалация проблемного контента
- Флаги и репорты от пользователей

**Notification Service**
- Push notifications (iOS, Android)
- Email notifications
- SMS notifications (опционально)
- In-app notifications

**Analytics Service**
- Сбор аналитики использования
- A/B тестирование
- Retention метрики
- Родительские отчеты

**Curator Service**
- Управление кураторским контентом
- Рекомендации контента
- Категоризация и тегирование

#### Технологический стек микросервисов:
- **Node.js + TypeScript** или **Go**: Основной язык для сервисов
- **PostgreSQL**: Реляционная БД для структурированных данных
- **Redis**: Кэширование и сессии
- **RabbitMQ / Kafka**: Асинхронная обработка и очереди сообщений
- **Kubernetes**: Оркестрация контейнеров
- **Docker**: Контейнеризация сервисов

### 4. ML-модуль модерации контента

#### Компоненты:

**Text Moderation**
- Обнаружение ненормативной лексики
- Детектирование буллинга и угроз
- Анализ sentiment
- Языковые модели (Mistral, GPT-4 API для сложных случаев)

**Image Moderation**
- NSFW контент
- Насилие и жестокость
- PII (персональные данные) в изображениях
- Face detection для верификации

**Video Moderation**
- Покадровый анализ
- Audio transcription + text moderation
- Движение и behavior analysis

#### ML Infrastructure:
- **Inference**: TensorFlow Serving / TorchServe
- **GPU**: NVIDIA T4 / A10 для inference
- **Model Storage**: S3 / GCS
- **Мониторинг моделей**: MLflow, Weights & Biases
- **Retraining Pipeline**: Airflow для автоматизации

#### Точность и производительность:
- Latency: < 2 секунды для текста, < 10 секунд для изображений
- Accuracy target: 95%+ для критических категорий
- Fallback на ручную модерацию при низкой уверенности (< 80%)

### 5. Хранилище данных (Data Storage)

#### PostgreSQL кластеры:
- **Users DB**: Пользователи, профили, связи
- **Content DB**: Метаданные контента, комментарии
- **Analytics DB**: Аналитика и логи

#### Object Storage:
- **S3 / GCS / Azure Blob**: Медиа файлы (фото, видео)
- **CDN**: CloudFront / Cloudflare для доставки контента
- **Encryption at rest**: AES-256

#### Redis кластер:
- Сессии пользователей
- Кэш частых запросов
- Rate limiting counters

## Data Flow для ключевых сценариев

### Сценарий 1: Регистрация родителя

1. Родитель открывает приложение → регистрация через Apple ID / Google
2. API Gateway → Authentication Service → создание JWT токенов
3. Authentication Service → User Profile Service → создание профиля родителя
4. Notification Service → отправка welcome email
5. Возврат JWT access/refresh токенов → клиент сохраняет в secure storage

**Безопасность**: OAuth2 flow, HTTPS, secure token storage (Keychain iOS)

### Сценарий 2: Создание профиля ребёнка

1. Родитель создает профиль ребёнка в приложении
2. API Gateway → User Profile Service → проверка parental consent
3. User Profile Service → создание профиля ребёнка с ограничениями
4. Analytics Service → логирование события
5. Notification Service → уведомление родителя об успешном создании

**Безопасность**: Parental consent required, возрастные ограничения, COPPA compliance

### Сценарий 3: Загрузка медиа и модерация

1. Пользователь (ребёнок или родитель) загружает фото/видео
2. Content Service → presigned URL для S3 upload
3. Клиент загружает файл напрямую в S3 (encrypted at rest)
4. Content Service → создает metadata в Content DB
5. Content Service → отправляет событие в очередь RabbitMQ
6. Moderation Service → получает событие из очереди
7. Moderation Service → ML-модуль (inference request)
8. ML-модуль → анализ контента → возвращает score и категории
9. **Если score > 80% (safe)**: контент автоматически одобрен
10. **Если score 50-80% (uncertain)**: эскалация на ручную модерацию
11. **Если score < 50% (unsafe)**: контент заблокирован, уведомление родителю
12. Notification Service → уведомление пользователя о статусе модерации

**Безопасность**: Pre-moderation, родительские уведомления, шифрование файлов

### Сценарий 4: Уведомления

1. Событие (новое сообщение, завершение модерации) → Notification Service
2. Notification Service → проверка настроек пользователя
3. **Push**: APNs (iOS) / FCM (Android)
4. **Email**: SendGrid / AWS SES
5. **In-app**: сохранение в Redis + PostgreSQL
6. Клиент получает push → открывает приложение → загружает детали

**Безопасность**: Минимум PII в push-уведомлениях, encrypted payloads

## Рекомендации по облакам

### AWS (рекомендуется для MVP)

**Преимущества**:
- Зрелый Kubernetes (EKS)
- Отличная экосистема (RDS, S3, CloudWatch, KMS)
- Compliance (HIPAA, SOC 2, ISO 27001)
- ML сервисы (SageMaker, Rekognition)

**Компоненты**:
- **Compute**: EKS (Elastic Kubernetes Service)
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Storage**: S3 + CloudFront CDN
- **Monitoring**: CloudWatch + Prometheus/Grafana
- **Secrets**: AWS Secrets Manager + KMS
- **ML**: SageMaker для training, EC2 с GPU для inference

**Стоимость MVP**: ~$2,000-5,000/месяц

### GCP (альтернатива)

**Преимущества**:
- Отличный GKE (Google Kubernetes Engine)
- AI/ML capabilities (Vertex AI, Vision API)
- Более простое управление

**Компоненты**:
- **Compute**: GKE
- **Database**: Cloud SQL PostgreSQL
- **Storage**: GCS + Cloud CDN
- **Monitoring**: Cloud Monitoring + Grafana
- **Secrets**: Secret Manager
- **ML**: Vertex AI

### Azure (для корпоративных клиентов)

**Преимущества**:
- Интеграция с Microsoft экосистемой
- Azure Active Directory
- Compliance

**Компоненты**:
- **Compute**: AKS (Azure Kubernetes Service)
- **Database**: Azure Database for PostgreSQL
- **Storage**: Azure Blob Storage + CDN
- **Monitoring**: Azure Monitor
- **Secrets**: Key Vault
- **ML**: Azure ML

## Kubernetes архитектура

### Namespace стратегия:
- `production`: Production workloads
- `staging`: Pre-production testing
- `dev`: Development environment

### Deployments:
- **ReplicaSets**: 3+ replicas для critical services
- **HPA (Horizontal Pod Autoscaler)**: Auto-scaling по CPU/memory
- **PDB (Pod Disruption Budget)**: Минимум 2 pods always available

### Networking:
- **Ingress Controller**: NGINX Ingress или ALB (AWS)
- **Service Mesh**: Istio или Linkerd (для advanced routing)
- **Network Policies**: Ограничение трафика между pods

### Storage:
- **Persistent Volumes**: для databases (RDS предпочтительнее)
- **EBS / Persistent Disks**: для stateful sets

### Secrets Management:
- **External Secrets Operator**: синхронизация с AWS Secrets Manager / Vault
- **Sealed Secrets**: для GitOps

## SRE практики

### Observability (O11y)

**Мониторинг**:
- **Prometheus**: метрики (CPU, memory, latency, error rate)
- **Grafana**: визуализация дашбордов
- **AlertManager**: alerting rules
- **PagerDuty / Opsgenie**: incident management

**Ключевые метрики**:
- **Golden Signals**: Latency, Traffic, Errors, Saturation
- **SLA targets**: 99.9% uptime (4.3 часа downtime/месяц)
- **API latency**: p50 < 200ms, p99 < 1s
- **ML inference latency**: < 2s для текста, < 10s для изображений

**Логирование**:
- **Fluentd / Fluent Bit**: log aggregation
- **Elasticsearch + Kibana** (ELK stack) или **Loki + Grafana**
- **CloudWatch Logs** (AWS)
- **Retention**: 90 дней для audit logs, 30 дней для application logs

**Трейсинг**:
- **Jaeger / Zipkin**: distributed tracing
- **OpenTelemetry**: стандартизированный инструментарий

### Incident Response

**Playbook**:
1. **Detection**: автоматические алерты → PagerDuty → on-call engineer
2. **Assessment**: определить severity (SEV1-SEV4)
3. **Mitigation**: быстрое решение (rollback, scaling, manual intervention)
4. **Communication**: status page (status.rork-kiku.com), email updates
5. **Post-mortem**: анализ причин, action items, документация

**Escalation**:
- **SEV1** (Critical): CEO + CTO + SRE lead
- **SEV2** (High): CTO + SRE + Product
- **SEV3** (Medium): SRE + DevOps
- **SEV4** (Low): DevOps

### Disaster Recovery

**Backup стратегия**:
- **Databases**: ежедневные automated backups (RDS snapshots)
- **Point-in-time recovery**: 7-30 дней
- **S3 data**: versioning + cross-region replication
- **DR site**: Multi-region для critical data (опционально для MVP)

**RTO/RPO**:
- **RTO (Recovery Time Objective)**: < 4 часа
- **RPO (Recovery Point Objective)**: < 1 час

## Безопасность (Security)

### Шифрование

**Encryption at Rest**:
- **Databases**: Encrypted RDS (AES-256)
- **Object Storage**: S3 server-side encryption (SSE-KMS)
- **Disk Encryption**: Encrypted EBS volumes
- **Application-level**: шифрование PII полей в БД (AES-256)

**Encryption in Transit**:
- **TLS 1.3**: все внешние коммуникации
- **mTLS**: между микросервисами (опционально для MVP)
- **VPN / Private Link**: для управления инфраструктурой

### Key Management Service (KMS)

**AWS KMS** (или GCP KMS / Azure Key Vault):
- **Master Keys**: управляются облачным провайдером
- **Data Encryption Keys (DEK)**: для шифрования данных
- **Key Rotation**: автоматическая ротация каждые 90 дней
- **Audit Logs**: CloudTrail логи для всех key operations

**Практики**:
- Разделение ключей по окружениям (dev/staging/prod)
- Least privilege: ограничение доступа к ключам
- Backup keys: в отдельном безопасном месте

### Аутентификация и авторизация

**OAuth2 / JWT**:
- **Access Token**: JWT, срок жизни 15-30 минут
- **Refresh Token**: opaque token, срок жизни 7-30 дней
- **Token Storage**: Keychain (iOS), Keystore (Android)
- **Token Rotation**: автоматическое обновление access token

**OAuth2 Providers**:
- Apple Sign In
- Google Sign In
- Facebook (опционально)

**RBAC (Role-Based Access Control)**:
- **Parent**: полный доступ к детским профилям
- **Child**: ограниченный доступ (только свой контент)
- **Moderator**: доступ к moderation dashboard
- **Admin**: полный административный доступ
- **Curator**: доступ к curation tools

### Мониторинг и SIEM

**Security Monitoring**:
- **AWS GuardDuty** / **GCP Security Command Center**: threat detection
- **SIEM**: Splunk / ELK для анализа логов безопасности
- **WAF (Web Application Firewall)**: AWS WAF / Cloudflare
- **DDoS Protection**: AWS Shield / Cloudflare

**Audit Logs**:
- Все аутентификации
- Все изменения в профилях детей
- Все модерационные действия
- Все административные изменения
- Retention: 1 год

### Compliance и регуляторные требования

**COPPA (Children's Online Privacy Protection Act)**:
- Parental consent перед созданием детского профиля
- Минимизация сбора данных о детях
- Родительский доступ ко всем данным ребенка
- Возможность удаления данных

**GDPR (General Data Protection Regulation)**:
- Явное согласие на обработку данных
- Право на доступ, исправление, удаление (Right to be forgotten)
- Data portability
- Breach notification (в течение 72 часов)

**Рекомендации**:
- Консультация с юристом по COPPA/GDPR
- Privacy by design
- Минимизация PII
- Регулярные security audits

### Incident Response

**Playbook для security incidents**:
1. **Detection**: SIEM alerts, user reports, penetration testing findings
2. **Containment**: изоляция скомпрометированных систем
3. **Eradication**: устранение угрозы (патчи, удаление malware)
4. **Recovery**: восстановление из backups, проверка integrity
5. **Lessons Learned**: post-mortem, улучшение процессов

**Communication**:
- Внутренняя команда: Slack #security channel
- Пользователи: email, in-app notifications (если затронуты их данные)
- Регуляторы: в течение 72 часов (GDPR)
- PR/Media: через CEO/PR team

## Масштабирование

### Горизонтальное масштабирование

**Stateless Services**:
- Легко масштабируются добавлением pods
- Load balancing через Kubernetes Service
- HPA на основе CPU/memory или custom metrics

**Stateful Services**:
- **Databases**: read replicas для scaling reads
- **Redis**: cluster mode для sharding
- **Kafka**: добавление partitions

### Вертикальное масштабирование

- Увеличение CPU/memory для pods
- Vertical Pod Autoscaler (VPA)
- Upgrade RDS instance types

### Производительность

**Caching стратегия**:
- **CDN**: для статического контента (изображения, видео)
- **Redis**: для часто запрашиваемых данных (user profiles, sessions)
- **Application-level caching**: in-memory caching в сервисах

**Database optimization**:
- Индексы на часто используемых колонках
- Query optimization
- Connection pooling
- Partitioning для больших таблиц

## Roadmap архитектуры

### Phase 1: MVP (Q1-Q2 2026)
- Monolith → 3-5 микросервисов
- Single region (US East)
- RDS PostgreSQL + Redis + S3
- Basic ML moderation (text + image)
- EKS на AWS

### Phase 2: Pilot (Q3 2026)
- 5-10 микросервисов
- Multi-AZ для HA
- Улучшенные ML модели
- Advanced monitoring (Grafana dashboards)
- Automated testing (CI/CD)

### Phase 3: Production (Q4 2026 - Q1 2027)
- Full microservices architecture (10+ services)
- Multi-region (US + EU)
- Real-time analytics
- Video moderation
- Advanced security (SIEM, pentest)

### Phase 4: Scale (2027+)
- Global presence (Asia, ROW)
- Edge computing для low-latency
- Advanced ML (custom models)
- Blockchain для transparency (опционально)

## Дополнительные материалы

- **Диаграмма**: [docs/architecture/diag.svg](./diag.svg)
- **Security Design**: [docs/security/security_design.md](../security/security_design.md)
- **CI/CD**: [docs/infra/ci_cd.md](../infra/ci_cd.md)
- **MVP Spec**: [docs/mvp/mvp_spec.md](../mvp/mvp_spec.md)

---

**Последнее обновление**: 2026-01-02  
**Версия документа**: 1.0 (ЧЕРНОВИК)  
**Статус**: ТРЕБУЕТ ТЕХНИЧЕСКОГО РЕВЬЮ
