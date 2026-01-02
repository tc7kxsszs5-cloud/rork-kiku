# Архитектура системы kiku

## Обзор

kiku — это AI-powered платформа для мониторинга и обеспечения безопасности детских чатов. Система построена на современных технологиях с упором на безопасность, масштабируемость и соответствие требованиям COPPA/GDPR-K.

## Архитектурные слои

### 1. Клиентский слой (Mobile Apps)

**Технологии:**
- React Native (iOS/Android)
- Expo Router (навигация)
- TypeScript (типобезопасность)
- AsyncStorage (локальное хранилище)

**Компоненты:**
- **UI Layer**: Экраны чатов, уведомлений, статистики, родительского контроля
- **State Management**: React Context API (MonitoringContext, ParentalControlsContext, UserContext)
- **Local Storage**: AsyncStorage для хранения данных пользователя, чатов, настроек
- **Security Layer**: End-to-end шифрование сообщений, защита от скриншотов

**Архитектурные решения:**
- Offline-first подход для минимизации зависимости от сети
- Локальное хранение всех данных для соответствия COPPA/GDPR-K
- Минимизация передачи данных — только текст/изображения для AI-анализа

### 2. API/Backend слой (tRPC + Node.js)

**Технологии:**
- Node.js + TypeScript
- tRPC (type-safe API)
- Express.js (HTTP server)
- PostgreSQL (основная БД)
- Redis (кэширование, очереди задач)

**Микросервисы:**

#### a) API Gateway Service
- Аутентификация и авторизация (OAuth2/JWT + refresh tokens)
- Rate limiting и защита от DDoS
- Request routing
- API versioning

#### b) User Service
- Управление профилями родителей и детей
- Верификация родителей (документы, банковская верификация)
- RBAC (роли: родитель, ребёнок, модератор, администратор)
- Audit logging всех действий

#### c) Chat Monitoring Service
- Получение сообщений для анализа
- Координация с ML-модулем
- Хранение результатов анализа
- Управление алертами и уведомлениями

#### d) Notification Service
- Push notifications (FCM для Android, APNs для iOS)
- Email уведомления для родителей
- SMS алерты (опционально для критических случаев)
- WebSocket для real-time updates

#### e) Moderation Service
- Ручная модерация спорных случаев
- Управление очередью модерации
- Escalation workflow (авто → ручная → заморозка)
- Feedback loop для улучшения ML-моделей

### 3. ML-модуль модерации (Machine Learning)

**Технологии:**
- Python + FastAPI
- TensorFlow / PyTorch
- Hugging Face Transformers
- OpenAI API (для сложных случаев)

**Компоненты:**

#### a) Text Analysis Service
- NLP анализ текстовых сообщений
- Определение токсичности, угроз, буллинга
- Многоязычная поддержка (русский, английский)
- Контекстный анализ (не отдельные слова, а смысл)

**Модели:**
- ruBERT для русского языка
- BERT-based классификаторы для токсичности
- Custom fine-tuned модели на детских данных
- OpenAI GPT-4 для сложных edge cases

#### b) Image Moderation Service
- Детекция неприемлемого визуального контента
- Распознавание лиц (защита приватности)
- Детекция насилия, наготы
- OCR для текста на изображениях

**Модели:**
- ResNet/EfficientNet для классификации изображений
- CLIP для мультимодального анализа
- AWS Rekognition / Google Vision AI (fallback)

#### c) Voice Transcription Service
- Speech-to-text транскрипция голосовых сообщений
- Последующий анализ текста через Text Analysis Service

**Модели:**
- Whisper (OpenAI) для транскрипции
- Custom acoustic models для детской речи

#### d) Risk Scoring Engine
- Агрегация всех источников анализа
- 5-уровневая система оценки рисков:
  - 0: Безопасно (safe)
  - 1: Низкий риск (low)
  - 2: Средний риск (medium)
  - 3: Высокий риск (high)
  - 4: Критический риск (critical)
- Explainability — почему был присвоен конкретный уровень риска

### 4. Infrastructure слой

**Cloud Provider**: AWS (или GCP/Azure — мультиклауд готовность)

**Компоненты:**

#### a) Compute
- **Kubernetes (EKS)** для оркестрации контейнеров
- **Auto-scaling**: HPA (Horizontal Pod Autoscaler) на основе CPU/memory/custom metrics
- **Node groups**: разделение по типам нагрузки (API, ML inference, background jobs)

#### b) Storage
- **PostgreSQL (RDS)**: основная реляционная БД (пользователи, чаты, алерты)
- **Redis (ElastiCache)**: кэширование, сессии, очереди задач
- **S3**: хранение изображений, аудио (с шифрованием)
- **EFS/EBS**: persistent storage для Kubernetes

#### c) Networking
- **CloudFront CDN**: раздача статики, кэширование API responses
- **VPC**: изолированная сеть
- **Load Balancer (ALB)**: балансировка нагрузки с SSL termination
- **VPN Gateway**: для доступа к внутренним сервисам

#### d) Security
- **AWS KMS**: управление ключами шифрования
- **Secrets Manager**: хранение секретов (DB пароли, API ключи)
- **IAM**: управление доступом к AWS ресурсам
- **WAF**: защита от веб-атак
- **Shield**: DDoS protection

#### e) Monitoring & Observability
- **Prometheus**: сбор метрик
- **Grafana**: визуализация метрик
- **ELK Stack (Elasticsearch, Logstash, Kibana)**: централизованное логирование
- **Jaeger**: distributed tracing
- **CloudWatch**: AWS-native мониторинг
- **PagerDuty**: алертинг и on-call управление

#### f) CI/CD
- **GitHub Actions**: автоматизация build, test, deploy
- **ArgoCD**: GitOps для Kubernetes
- **Helm**: пакетный менеджер для Kubernetes
- **Terraform**: Infrastructure as Code

## Data Flow - ключевые сценарии

### Сценарий 1: Регистрация родителя

```
1. Родитель открывает приложение → UI
2. Заполняет форму регистрации (email, пароль) → User Service
3. User Service создаёт аккаунт в PostgreSQL
4. Отправка verification email через Notification Service
5. Родитель подтверждает email → аккаунт активируется
6. (Опционально) Верификация документов/банковских данных
7. JWT токен + refresh token возвращаются клиенту
8. Токены сохраняются в AsyncStorage (зашифрованные)
```

### Сценарий 2: Добавление профиля ребёнка

```
1. Родитель создаёт профиль ребёнка → UI
2. Заполняет данные (имя, возраст) → User Service
3. Парентальное согласие логируется в Compliance Log
4. Профиль ребёнка создаётся и связывается с родителем (foreign key)
5. Ребёнок получает логин (или родитель настраивает доступ)
```

### Сценарий 3: Загрузка и анализ сообщения

```
1. Ребёнок отправляет сообщение в чате → UI (детское устройство)
2. Сообщение сохраняется локально в AsyncStorage
3. Сообщение отправляется на Chat Monitoring Service (если есть сеть)
4. Chat Monitoring Service отправляет текст в ML Text Analysis Service
5. ML модель анализирует текст и возвращает risk score + explanation
6. Если risk_level >= medium:
   a. Алерт создаётся в БД
   b. Push notification отправляется родителю (Notification Service)
   c. Email notification отправляется всем опекунам
7. Результат анализа возвращается клиенту и отображается в UI
```

### Сценарий 4: Автоматическая модерация изображения

```
1. Ребёнок загружает изображение → UI
2. Изображение загружается в S3 (pre-signed URL)
3. Chat Monitoring Service триггерит ML Image Moderation Service
4. Image Moderation Service:
   a. Скачивает изображение из S3
   b. Запускает модели детекции (nudity, violence, etc.)
   c. Возвращает risk score
5. Если risk_level >= high:
   a. Изображение блокируется автоматически
   b. Родитель получает уведомление
   c. (Опционально) Эскалация на ручную модерацию
6. Результат сохраняется в БД и отображается родителю
```

### Сценарий 5: Ручная модерация

```
1. Модератор заходит в панель модерации (отдельный UI)
2. Видит очередь сообщений/изображений для ручной проверки
3. Просматривает контент (текст/изображение) + AI анализ
4. Принимает решение:
   a. Подтвердить AI решение
   b. Переопределить (false positive/false negative)
   c. Эскалировать (critical case)
5. Решение сохраняется и используется для re-training ML моделей
6. Родитель получает обновление статуса алерта
```

### Сценарий 6: Push уведомления

```
1. Алерт создаётся в Chat Monitoring Service
2. Notification Service получает событие (через Redis pub/sub или Kafka)
3. Notification Service:
   a. Получает FCM/APNs токены родителя из БД
   b. Формирует payload уведомления
   c. Отправляет через FCM/APNs
4. Родитель получает push на устройстве
5. Клик на уведомление → открывается приложение на экране алертов
```

### Сценарий 7: SOS алерт

```
1. Ребёнок нажимает кнопку SOS → UI
2. Приложение запрашивает геолокацию (Expo Location)
3. SOS алерт отправляется на Chat Monitoring Service с координатами
4. Notification Service немедленно отправляет:
   a. Push notification всем опекунам
   b. Email с геолокацией
   c. (Опционально) SMS
5. SOS алерт отображается в родительской панели с картой
6. Родитель может отметить SOS как "решённый" после контакта с ребёнком
```

## Требования к масштабируемости

### Целевые метрики производительности

**MVP/Pilot (1000 пользователей):**
- API latency: p95 < 500ms
- ML inference: < 2s для текста, < 5s для изображения
- Push notifications: < 5s задержка
- Uptime: 99.5%

**Production (100K пользователей):**
- API latency: p95 < 200ms
- ML inference: < 1s для текста, < 3s для изображения
- Push notifications: < 2s задержка
- Uptime: 99.9%

**Scale (1M+ пользователей):**
- API latency: p95 < 100ms
- ML inference: < 500ms для текста, < 2s для изображения
- Push notifications: < 1s задержка
- Uptime: 99.95%

### Стратегии масштабирования

#### Горизонтальное масштабирование
- Stateless API services (легко масштабируются добавлением pod'ов)
- Load balancing через ALB с health checks
- Auto-scaling на основе CPU/memory/request rate

#### Вертикальное масштабирование
- Увеличение размера RDS instance для БД
- Использование read replicas для чтения
- Партиционирование таблиц по user_id / created_at

#### Кэширование
- Redis для hot data (пользовательские сессии, часто запрашиваемые данные)
- CloudFront CDN для статики и API responses
- In-memory кэш в каждом service (LRU cache)

#### Асинхронная обработка
- Redis/RabbitMQ/Kafka для очередей задач
- Background workers для ML inference (не блокируют API)
- Batching запросов к ML models для эффективности

#### Database optimization
- Индексы на часто запрашиваемые поля (user_id, chat_id, created_at)
- Connection pooling (PgBouncer)
- Query optimization и monitoring (slow query log)
- Партиционирование больших таблиц (messages, alerts)

## Высокая доступность (High Availability)

### Multi-AZ deployment
- RDS PostgreSQL в Multi-AZ режиме (автоматический failover)
- Redis с репликацией (primary-replica)
- Kubernetes nodes в разных AZ

### Disaster Recovery
- **RTO (Recovery Time Objective)**: < 1 час
- **RPO (Recovery Point Objective)**: < 5 минут
- Automated backups (PostgreSQL snapshots каждый час, retention 7 дней)
- Cross-region replication для критических данных
- Documented runbooks для disaster recovery

### Health checks & Auto-recovery
- Kubernetes liveness/readiness probes
- Load balancer health checks
- Automatic pod restart при failures
- Circuit breaker pattern для внешних зависимостей

## Рекомендации по облаку

### AWS (Рекомендовано для MVP)
**Плюсы:**
- Наиболее зрелый cloud provider
- Лучшие ML services (SageMaker, Rekognition)
- Широкий выбор managed services
- Отличная документация

**Сервисы:**
- EKS (Kubernetes)
- RDS (PostgreSQL), ElastiCache (Redis)
- S3, CloudFront
- KMS, Secrets Manager
- SageMaker (для ML training/inference)

### GCP (Альтернатива)
**Плюсы:**
- Лучшие ML tools (Vertex AI, AutoML)
- Более дешёвые compute ресурсы
- BigQuery для аналитики

**Сервисы:**
- GKE (Kubernetes)
- Cloud SQL, Memorystore
- Cloud Storage, Cloud CDN
- Cloud Vision API, Cloud Natural Language

### Azure (Альтернатива)
**Плюсы:**
- Хорошая интеграция с Microsoft ecosystem
- Azure Cognitive Services для ML

### Multi-cloud стратегия (будущее)
- Terraform для Infrastructure as Code (cloud-agnostic)
- Kubernetes для portable workloads
- Избегание vendor lock-in для критических компонентов

## CDN и Content Delivery

**Рекомендация:** CloudFront (AWS) или Cloudflare

**Кэшируемый контент:**
- Статические ассеты (изображения, JS/CSS)
- API responses (с коротким TTL для dynamic data)

**Не кэшируемый контент:**
- Персональные данные пользователя
- Алерты и уведомления (real-time)

**Преимущества:**
- Снижение latency для пользователей из разных регионов
- Разгрузка origin servers
- DDoS protection

## Kubernetes и SRE практики

### Kubernetes setup

**Namespace isolation:**
- `production` — production workloads
- `staging` — pre-production testing
- `development` — dev environment

**Resource requests/limits:**
- Каждый pod с defined requests (CPU/memory)
- Limits для предотвращения noisy neighbor проблем

**Pod disruption budgets:**
- Минимум 2 доступных pod'а при updates
- Rolling updates с zero downtime

**ConfigMaps и Secrets:**
- Конфигурация через ConfigMaps
- Секреты через Kubernetes Secrets (с шифрованием at rest)

### SRE метрики (SLI/SLO)

**Service Level Indicators (SLI):**
- API success rate (% successful requests)
- API latency (p50, p95, p99)
- ML inference latency
- Push notification delivery rate

**Service Level Objectives (SLO):**
- API success rate: > 99.9%
- API p95 latency: < 200ms
- ML inference p95: < 3s
- Push delivery rate: > 99%

**Error budgets:**
- 0.1% ошибок в месяц (43 минуты downtime)
- Если error budget исчерпан → freeze feature releases, focus на reliability

### On-call и incident response
- 24/7 on-call rotation (PagerDuty)
- Incident severity levels (P0-P4)
- Documented runbooks для типовых проблем
- Post-mortem для всех major incidents (без blame culture)

## Безопасность

### Шифрование данных

#### В покое (at rest):
- **Базы данных**: RDS encryption с AWS KMS
- **Файлы**: S3 encryption (SSE-KMS)
- **Локальное хранилище**: AsyncStorage с шифрованием (Expo SecureStore для критичных данных)

#### В транзите (in transit):
- **TLS 1.3** для всех API connections
- **Certificate pinning** в мобильном приложении
- **End-to-end шифрование** для сообщений (опционально для будущих версий)

### Key Management (KMS)

**AWS KMS:**
- Отдельные ключи для разных типов данных (DB, S3, secrets)
- Автоматическая ротация ключей (ежегодно)
- Access logging для всех key operations

**Ротация ключей:**
- **Database encryption keys**: автоматическая ротация AWS KMS (1 год)
- **API keys**: ручная ротация каждые 90 дней
- **JWT signing keys**: ротация каждые 30 дней (graceful transition)

### Аутентификация и авторизация

#### OAuth2 + JWT
- **Access tokens**: short-lived (15 минут), JWT
- **Refresh tokens**: long-lived (30 дней), хранятся в БД (revocable)
- **Token refresh flow**: автоматическое обновление access token при истечении

#### Multi-Factor Authentication (MFA)
- Опционально для родителей (TOTP, SMS)
- Обязательно для модераторов и администраторов

### Role-Based Access Control (RBAC)

**Роли:**
1. **Parent** — полный доступ к своим детским профилям
2. **Child** — ограниченный доступ (не видит родительскую панель)
3. **Moderator** — доступ к очереди модерации
4. **Admin** — полный доступ к системе

**Permissions:**
- `chat.read`, `chat.create`, `chat.delete`
- `alert.read`, `alert.resolve`
- `user.read`, `user.update`, `user.delete`
- `moderation.read`, `moderation.review`

### Мониторинг безопасности

#### SIEM (Security Information and Event Management)
- Централизованное логирование всех security events
- Alerts на подозрительную активность:
  - Multiple failed login attempts
  - Unusual API patterns (rate limiting violations)
  - Unauthorized access attempts

#### Vulnerability scanning
- **Container scanning**: Trivy для Docker images
- **Dependency scanning**: Dependabot для npm/pip packages
- **Code scanning**: SonarQube, Snyk

#### Penetration testing
- Ежегодный pentest от внешней компании
- Bug bounty program (на поздних стадиях)

### Incident Response

**Runbook для security incidents:**

1. **Обнаружение** — Alert от SIEM/monitoring
2. **Containment** — Изоляция affected systems
3. **Investigation** — Анализ логов, определение scope
4. **Eradication** — Удаление угрозы, patching уязвимостей
5. **Recovery** — Восстановление сервисов
6. **Post-mortem** — Документация инцидента, lessons learned

**Контакты:**
- Security team lead: [PLACEHOLDER]
- External security consultant: [PLACEHOLDER]
- Legal counsel: [PLACEHOLDER]

### Compliance и audit

**Логирование:**
- Все API requests с user_id, timestamp, IP
- Все изменения в родительских настройках (compliance log)
- Все модераторские действия
- Retention: 12 месяцев (compliance requirement)

**Регулярные аудиты:**
- Quarterly security review
- Annual compliance audit (COPPA/GDPR-K)
- Code review для критичных изменений

## Диаграммы

### High-level Architecture Diagram

```
                                    ┌─────────────────┐
                                    │   CloudFront    │
                                    │      CDN        │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │ Application     │
                                    │ Load Balancer   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐      ┌───────▼───────┐      ┌─────────▼────────┐
           │  API Gateway    │      │  Notification │      │  Moderation      │
           │   Service       │      │    Service    │      │   Service        │
           └────────┬────────┘      └───────┬───────┘      └─────────┬────────┘
                    │                       │                        │
           ┌────────▼────────┐      ┌───────▼───────┐               │
           │   User Service  │      │ FCM/APNs/Email│               │
           └────────┬────────┘      └───────────────┘               │
                    │                                                │
           ┌────────▼────────────────────────────────────────────────▼────────┐
           │              Chat Monitoring Service                            │
           └────────┬──────────────────────────────────────────────┬─────────┘
                    │                                              │
           ┌────────▼────────┐                            ┌────────▼────────┐
           │  PostgreSQL     │                            │   Redis Cache   │
           │  (RDS Multi-AZ) │                            │   + Queues      │
           └─────────────────┘                            └─────────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   ML Services   │
                                    │   (Python/ML)   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐      ┌───────▼───────┐      ┌─────────▼────────┐
           │  Text Analysis  │      │     Image     │      │      Voice       │
           │   Service       │      │  Moderation   │      │  Transcription   │
           └─────────────────┘      └───────┬───────┘      └──────────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   S3 Storage    │
                                    │  (Encrypted)    │
                                    └─────────────────┘

                        ┌───────────────────────────────────┐
                        │     Mobile Clients (iOS/Android)  │
                        │     - React Native + Expo         │
                        │     - Local AsyncStorage          │
                        │     - End-to-end encryption       │
                        └───────────────────────────────────┘
```

**Файл диаграммы:** Для более детальной диаграммы рекомендуется использовать инструменты типа draw.io, Lucidchart, или PlantUML. Сохранить как `docs/architecture/architecture_diagram.png` или `.svg`.

### Примеры UML/диаграмм для создания:

1. **Deployment Diagram** — Kubernetes namespaces, pods, services
2. **Sequence Diagram** — для каждого data flow сценария
3. **Entity Relationship Diagram** — структура базы данных
4. **Security Architecture** — зоны безопасности, firewalls, шифрование

## Рекомендации по дальнейшим шагам

1. **Создать детальные Sequence Diagrams** для всех критичных сценариев
2. **Design Database Schema** — подробная ERD со всеми таблицами
3. **Define API Contracts** — OpenAPI/Swagger спецификация для всех endpoints
4. **Setup Infrastructure as Code** — Terraform modules для AWS
5. **Implement Observability** — настройка Prometheus, Grafana dashboards
6. **Security Hardening** — container security scanning, network policies
7. **Load Testing** — определение реальных limits и bottlenecks

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Architecture Team  
**Статус:** Draft — требуется review и утверждение
