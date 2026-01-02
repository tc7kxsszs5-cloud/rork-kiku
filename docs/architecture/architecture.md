# Архитектура системы kiku

## Обзор

kiku - это комплексная система защиты детей в цифровой среде, использующая искусственный интеллект для мониторинга и модерации контента в реальном времени.

## Диаграммы архитектуры

**Расположение диаграмм:** `/docs/architecture/diagrams/`
- `system-overview.png` - Общая архитектура системы
- `data-flow.png` - Потоки данных
- `deployment.png` - Диаграмма развертывания

*Примечание: Диаграммы будут созданы с использованием draw.io или Lucidchart и экспортированы в PNG/SVG*

## Архитектурные слои

### 1. Клиентский слой (Mobile Client)

**Технологии:**
- React Native + Expo Router
- TypeScript для типобезопасности
- AsyncStorage для локального хранения
- Expo Location для геолокации (SOS)
- Expo AV для аудио/видео

**Основные компоненты:**
- MonitoringContext - управление чатами и анализом
- ParentalControlsContext - родительские настройки
- UserContext - аутентификация и профили
- AI Integration Layer - интеграция с AI моделями

**Безопасность на клиенте:**
- End-to-end шифрование сообщений перед отправкой
- Локальное хранение данных с шифрованием
- Биометрическая аутентификация (Face ID/Touch ID)
- Защита от reverse engineering (обфускация кода)

### 2. API Gateway слой

**Технологии:**
- Node.js + Express / Fastify
- GraphQL или REST API
- Rate limiting и throttling
- JWT токены для аутентификации

**Эндпоинты (основные):**
```
POST   /api/v1/auth/register          - Регистрация пользователя
POST   /api/v1/auth/login             - Вход в систему
POST   /api/v1/auth/verify-parent     - Верификация родителя
GET    /api/v1/profile                - Получение профиля
POST   /api/v1/chat/analyze           - Анализ сообщения
POST   /api/v1/media/upload           - Загрузка медиа
GET    /api/v1/alerts                 - Получение уведомлений
POST   /api/v1/sos/trigger            - Триггер SOS
POST   /api/v1/parental/settings      - Обновление настроек
```

**Безопасность API:**
- HTTPS only (TLS 1.3)
- API rate limiting (100 req/min per user)
- Request signing для критических операций
- CORS настройки для web-версии
- API key rotation каждые 90 дней

### 3. Микросервисы

#### 3.1 User Service
**Ответственность:** Управление пользователями, аутентификация, профили

**База данных:** PostgreSQL
- Таблицы: users, profiles, sessions, verification_tokens
- Индексы на email, phone, user_id
- Репликация master-slave для чтения

#### 3.2 Monitoring Service
**Ответственность:** Управление чатами, сообщениями, анализ

**База данных:** PostgreSQL + Redis
- PostgreSQL: chats, messages, analysis_results
- Redis: кэш активных чатов, rate limiting
- Партиционирование таблицы messages по дате

#### 3.3 Content Moderation Service
**Ответственность:** AI-анализ текста, изображений, аудио

**Технологии:**
- Python + FastAPI
- OpenAI API / Anthropic Claude
- TensorFlow/PyTorch для custom моделей
- Celery для асинхронной обработки

**Очереди:**
- text_analysis_queue - анализ текста (приоритет: высокий)
- image_analysis_queue - анализ изображений (приоритет: средний)
- audio_transcription_queue - транскрипция аудио (приоритет: низкий)

#### 3.4 Alert Service
**Ответственность:** Управление уведомлениями, SOS, отправка нотификаций

**База данных:** PostgreSQL + Message Queue (RabbitMQ/Kafka)
- Таблицы: alerts, sos_alerts, notification_log
- Real-time websocket соединения для родителей
- Push notifications через FCM/APNs

#### 3.5 Parental Controls Service
**Ответственность:** Настройки контроля, белые списки, временные ограничения

**База данных:** PostgreSQL
- Таблицы: parental_settings, contacts_whitelist, time_restrictions
- Audit log всех изменений настроек

#### 3.6 Analytics Service
**Ответственность:** Сбор метрик, статистика, отчеты

**База данных:** ClickHouse / TimescaleDB
- Time-series данные по использованию
- Агрегированная статистика по рискам
- Dashboard для родителей и команды

### 4. ML/AI слой

**Модели:**

#### 4.1 Текстовый анализ
- **Primary:** OpenAI GPT-4 / Anthropic Claude 3.5 Sonnet
- **Fallback:** Custom fine-tuned BERT/RoBERTa для русского языка
- **Детекция:** буллинг, угрозы, сексуальный контент, мошенничество, грумминг

#### 4.2 Анализ изображений
- **Primary:** OpenAI Vision API / Claude with vision
- **Fallback:** Custom CNN модель + NSFW detector
- **Детекция:** обнаженность, насилие, оружие, наркотики

#### 4.3 Анализ аудио
- **Транскрипция:** Whisper API (OpenAI) / Assembly AI
- **Анализ:** текстовый анализ после транскрипции
- **Voice emotion detection:** custom model для определения стресса

#### 4.4 Поведенческий анализ
- **Технологии:** Custom ML модель на Python
- **Данные:** паттерны общения, время активности, изменения в поведении
- **Детекция:** аномалии, признаки депрессии, изоляции

**ML Infrastructure:**
- Kubernetes для оркестрации ML сервисов
- GPU ноды для inference (NVIDIA T4/A100)
- Model versioning с MLflow/Weights & Biases
- A/B тестирование моделей
- Continuous model retraining pipeline

### 5. Инфраструктурный слой

**Облачный провайдер:** AWS (primary) / GCP (рекомендация)

**Основные сервисы:**

#### AWS Stack:
- **Compute:** EKS (Kubernetes) + EC2 для worker nodes
- **Database:** RDS PostgreSQL (Multi-AZ), ElastiCache Redis
- **Storage:** S3 для медиа файлов (с шифрованием)
- **CDN:** CloudFront для распространения контента
- **Messaging:** SQS/SNS или MSK (Kafka)
- **Monitoring:** CloudWatch + Prometheus + Grafana
- **Secrets:** AWS Secrets Manager / HashiCorp Vault
- **Load Balancing:** ALB/NLB
- **DNS:** Route 53
- **Security:** WAF, Shield для DDoS protection

#### GCP Stack (альтернатива):
- **Compute:** GKE (Google Kubernetes Engine)
- **Database:** Cloud SQL PostgreSQL, Memorystore Redis
- **Storage:** Cloud Storage
- **CDN:** Cloud CDN
- **Messaging:** Pub/Sub
- **Monitoring:** Cloud Monitoring + Cloud Logging
- **Secrets:** Secret Manager
- **Load Balancing:** Cloud Load Balancing
- **Security:** Cloud Armor

**Регионы:**
- Primary: eu-central-1 (Frankfurt) или europe-west3 (Frankfurt) для GDPR
- Secondary: eu-west-1 (Ireland) для disaster recovery
- Россия: Yandex Cloud для соответствия 152-ФЗ (при необходимости)

## Потоки данных (Data Flow)

### 1. Регистрация родителя

```
Мобильное приложение → API Gateway → User Service
                                    ↓
                              PostgreSQL (users)
                                    ↓
                         Email Verification Service
                                    ↓
                              Parent (verified)
```

**Шаги:**
1. Родитель вводит email, пароль, имя
2. API создает пользователя со статусом "pending_verification"
3. Отправка email с токеном верификации
4. Родитель подтверждает email
5. Статус меняется на "verified_parent"
6. Создается профиль с ролью "parent"

**Безопасность:**
- Пароль хешируется с bcrypt (cost factor 12)
- Email verification token с TTL 24 часа
- Rate limiting 5 попыток регистрации за час с одного IP

### 2. Загрузка и анализ медиа

```
Мобильное приложение → Upload to S3 (presigned URL)
                                    ↓
                              S3 Bucket (encrypted)
                                    ↓
                         S3 Event → Lambda/Worker
                                    ↓
                    Content Moderation Service (AI)
                                    ↓
                    Analysis Result → Alert Service
                                    ↓
            Push Notification → Родитель (если риск)
```

**Шаги:**
1. Клиент запрашивает presigned URL для загрузки
2. Прямая загрузка изображения в S3 (client-side encryption)
3. S3 event триггерит Lambda функцию
4. Lambda добавляет задачу в image_analysis_queue
5. ML сервис анализирует изображение
6. Результат сохраняется в БД
7. Если обнаружен высокий риск → Alert Service
8. Push notification родителю + запись в alerts

**Безопасность:**
- Presigned URLs с TTL 5 минут
- S3 bucket encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Изображения удаляются через 90 дней (GDPR compliance)
- Watermarking для предотвращения утечек

### 3. Модерация сообщения

```
Чат приложение → API Gateway → Monitoring Service
                                    ↓
                        Message saved to PostgreSQL
                                    ↓
                    Async → Content Moderation Service
                                    ↓
                              AI Analysis (GPT-4)
                                    ↓
                         Risk Score Calculation
                                    ↓
                    Update message.analysis_result
                                    ↓
            If risk ≥ MEDIUM → Alert Service
                                    ↓
                    Notification → Parent Dashboard
```

**Шаги:**
1. Сообщение отправлено в чат
2. Сохранение сообщения в БД со статусом "pending_analysis"
3. Публикация события в Kafka/RabbitMQ
4. ML worker получает задачу
5. Анализ текста через OpenAI API или custom модель
6. Расчет risk score (0-100)
7. Обновление статуса сообщения
8. Если risk ≥ 60 (MEDIUM) → создание alert
9. Push notification родителю
10. Запись в audit log

**Эскалация рисков:**
- LOW (0-30): только логирование
- MEDIUM (31-60): уведомление родителя
- HIGH (61-80): блокировка сообщения + уведомление
- CRITICAL (81-100): блокировка + freeze чата + экстренное уведомление

### 4. SOS уведомление

```
Ребенок нажимает SOS → Geo Location API
                                ↓
                     API Gateway → Alert Service
                                ↓
                    SOS Alert created in DB
                                ↓
                Multiple Channels Notification:
        ├─ Push Notification → All parent emails
        ├─ SMS → Parent phone numbers
        ├─ Email → Parent emails + emergency contacts
        └─ WebSocket → Parent dashboard (real-time)
```

**Шаги:**
1. Ребенок нажимает кнопку SOS в приложении
2. Получение текущей геолокации (с разрешения)
3. Создание SOS alert с координатами, timestamp, device info
4. Немедленная отправка по всем каналам
5. Родители получают уведомление с картой
6. Родители могут отметить "resolved" или "need help"
7. Опционально: интеграция с emergency services (112)

**Безопасность:**
- Геолокация шифруется в БД
- Доступ только для verified родителей
- Audit log всех SOS событий
- Ложные SOS срабатывания логируются

### 5. Родительский dashboard - мониторинг

```
Parent Login → API Gateway → User Service (auth)
                                    ↓
                         JWT Token issued
                                    ↓
            Dashboard → API Gateway (with JWT)
                                    ↓
                      Parallel API calls:
        ├─ GET /api/v1/alerts (recent alerts)
        ├─ GET /api/v1/statistics (dashboard stats)
        ├─ GET /api/v1/chats (monitored chats)
        └─ WebSocket connection (real-time updates)
```

**Real-time updates через WebSocket:**
- Новые алерты
- SOS события
- Изменения статуса анализа
- Нарушения временных ограничений

## Требования к масштабированию

### Целевые метрики производительности

**MVP / Pilot (0-1,000 пользователей):**
- Latency API: < 200ms (p95)
- AI анализ текста: < 3 секунды
- AI анализ изображений: < 10 секунд
- Uptime: 99.5%
- Throughput: 10 req/sec

**Production Phase 1 (1,000-10,000 пользователей):**
- Latency API: < 150ms (p95)
- AI анализ текста: < 2 секунды
- AI анализ изображений: < 7 секунд
- Uptime: 99.9%
- Throughput: 100 req/sec

**Scale Phase (10,000-100,000 пользователей):**
- Latency API: < 100ms (p95)
- AI анализ текста: < 1 секунда
- AI анализ изображений: < 5 секунд
- Uptime: 99.95%
- Throughput: 1,000 req/sec

**Global Scale (100,000+ пользователей):**
- Latency API: < 50ms (p95)
- AI анализ текста: < 500ms
- AI анализ изображений: < 3 секунды
- Uptime: 99.99%
- Throughput: 10,000+ req/sec

### Стратегия горизонтального масштабирования

**API Gateway & Services:**
- Kubernetes Horizontal Pod Autoscaler (HPA)
- Metrics: CPU > 70%, Memory > 80%, Custom (request queue depth)
- Min replicas: 2, Max replicas: 20 (production)

**Базы данных:**
- PostgreSQL read replicas (1 master + N read replicas)
- Connection pooling (PgBouncer)
- Партиционирование больших таблиц (messages, analysis_results)
- Redis cluster для кэша (3+ nodes)

**ML Inference:**
- Dedicated GPU node pool в Kubernetes
- Model serving через TensorFlow Serving / TorchServe
- Batch inference для non-critical анализа
- Приоритетная очередь для real-time анализа

**Хранилище:**
- S3 с lifecycle policies (Standard → Glacier через 90 дней)
- CloudFront CDN для frequently accessed media
- Multi-region replication для disaster recovery

### Стратегия вертикального масштабирования

**Когда использовать:**
- Баз данных PostgreSQL (до определенного предела)
- Redis cache (memory-bound workload)
- ML inference nodes (GPU upgrade)

**Рекомендуемые типы инстансов (AWS):**
- API Services: t3.medium → c6i.xlarge
- Database: db.t3.large → db.r6i.2xlarge
- ML Inference: g4dn.xlarge → p3.2xlarge (GPU)
- Redis: cache.t3.medium → cache.r6g.xlarge

## Рекомендации по облаку и CDN

### Выбор облачного провайдера

**AWS (рекомендуется для MVP):**
✅ Наиболее зрелая платформа
✅ Широкий выбор сервисов
✅ Лучшая документация и community
✅ GDPR compliance (EU регионы)
❌ Дороже чем GCP для некоторых workloads

**GCP (альтернатива):**
✅ Лучшие ML/AI сервисы (Vertex AI)
✅ Более простое ценообразование
✅ Лучшая интеграция с Kubernetes
❌ Меньше регионов в Европе

**Azure:**
✅ Хорошая интеграция с Microsoft экосистемой
✅ Hybrid cloud возможности
❌ Менее зрелые ML сервисы

**Yandex Cloud (для России):**
✅ Соответствие 152-ФЗ
✅ Хранение данных в России
❌ Ограниченный функционал vs AWS/GCP

### CDN стратегия

**CloudFront (AWS) / Cloud CDN (GCP):**
- Кэширование статических ресурсов (изображения профилей, иконки)
- Geo-restriction для соответствия региональным требованиям
- SSL/TLS termination
- DDoS protection (AWS Shield)

**Кэширование:**
- Static assets: TTL 30 дней
- API responses: TTL 5 минут (с cache invalidation)
- User-generated images: TTL 7 дней

## Kubernetes и SRE

### Kubernetes кластер

**Архитектура кластера:**
```
Production Cluster (EKS/GKE)
├── Namespaces:
│   ├── api-gateway (2-10 pods)
│   ├── user-service (2-5 pods)
│   ├── monitoring-service (2-5 pods)
│   ├── content-moderation (2-10 pods)
│   ├── alert-service (2-5 pods)
│   ├── analytics-service (1-3 pods)
│   └── ml-inference (1-5 GPU pods)
├── Ingress: NGINX Ingress Controller
├── Service Mesh: Istio (optional for advanced traffic management)
└── Monitoring: Prometheus + Grafana
```

**Node Pools:**
- `api-pool`: General purpose (t3.medium / n1-standard-2)
- `ml-pool`: GPU nodes (g4dn.xlarge / n1-standard-4 + T4 GPU)
- `db-pool`: Memory optimized (r6i.large / n1-highmem-2)

**Autoscaling:**
```yaml
# HPA example for API Gateway
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### SRE практики

**SLI/SLO/SLA:**

**SLI (Service Level Indicators):**
- API Latency (p50, p95, p99)
- Error Rate (4xx, 5xx)
- Availability (uptime %)
- ML Analysis Latency

**SLO (Service Level Objectives):**
- API Availability: 99.9% (43 minutes downtime/месяц)
- API Latency p95: < 200ms
- Error Rate: < 0.5%
- ML Text Analysis: < 3 seconds (p95)

**SLA (Service Level Agreements):**
- Uptime: 99.5% (с компенсацией при нарушении)
- Support Response: < 4 часа для critical issues

**Мониторинг:**
- **Metrics:** Prometheus для сбора метрик
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana) или Loki
- **Traces:** Jaeger или Zipkin для distributed tracing
- **Dashboards:** Grafana для визуализации
- **Alerting:** Alertmanager + PagerDuty для on-call

**On-call rotation:**
- 24/7 coverage (для production)
- Primary and secondary on-call
- Escalation path: Engineer → Senior → Lead → CTO

**Incident Management:**
1. Detection (automated alerts)
2. Response (on-call engineer)
3. Mitigation (quick fix)
4. Resolution (root cause fix)
5. Post-mortem (blameless retrospective)

**Chaos Engineering:**
- Regular fault injection testing (Chaos Monkey)
- Disaster recovery drills (quarterly)
- Load testing перед major releases

## Безопасность

### Шифрование данных

**В покое (at rest):**
- **Базы данных:** AWS RDS encryption (AES-256)
- **S3 bucket:** Server-side encryption (SSE-KMS)
- **Локальное хранилище:** AsyncStorage encryption (AES-256)
- **Backups:** Encrypted with separate keys

**В передаче (in transit):**
- **API:** TLS 1.3 only (отключить TLS 1.2)
- **Internal services:** mTLS (mutual TLS) в Kubernetes
- **Client-Server:** Certificate pinning в мобильном приложении
- **WebSocket:** WSS (WebSocket Secure)

**End-to-end encryption:**
- Сообщения шифруются на клиенте перед отправкой
- Ключи хранятся локально на устройстве
- Сервер не имеет доступа к ключам дешифрования (zero-knowledge)
- Rotation ключей каждые 30 дней

### Управление ключами

**AWS KMS (Key Management Service):**
- Отдельные KMS ключи для разных сред (dev/staging/prod)
- Автоматическая rotation ключей каждые 12 месяцев
- Audit log всех операций с ключами (CloudTrail)
- IAM policies для контроля доступа к ключам

**Типы ключей:**
- `kiku-prod-db-key`: для шифрования RDS
- `kiku-prod-s3-key`: для шифрования S3
- `kiku-prod-app-key`: для шифрования sensitive данных в приложении
- `kiku-prod-backup-key`: для шифрования backups

**HashiCorp Vault (рекомендация для production):**
- Dynamic secrets для баз данных
- PKI (Public Key Infrastructure) для сертификатов
- Transit secrets engine для encryption as a service
- Audit logging всех операций

### Аутентификация

**Пользователи:**
- Email + пароль (bcrypt, cost factor 12)
- Multi-factor authentication (MFA) для родителей (optional but recommended)
- Биометрия (Face ID / Touch ID) для быстрого доступа
- Social OAuth (Google, Apple Sign In) для удобства

**API Authentication:**
- JWT токены (short-lived: 15 минут access token)
- Refresh tokens (30 дней, хранятся в secure storage)
- Token rotation при каждом refresh
- Token revocation list в Redis

**Service-to-Service:**
- API keys для internal services
- mTLS для микросервисов
- Service accounts в Kubernetes

### Управление доступом (Authorization)

**RBAC (Role-Based Access Control):**

**Роли:**
- `parent`: доступ к dashboard, настройкам, алертам своих детей
- `child`: доступ к чатам, профилю (ограниченный)
- `moderator`: доступ к review flagged content
- `admin`: полный доступ к системе
- `support`: доступ к тикетам, limited user data

**Permissions:**
```
parent:
  - read:own_children_data
  - write:parental_controls
  - read:alerts
  - write:sos_response

child:
  - read:own_profile
  - write:own_profile
  - read:own_chats
  - write:messages (с модерацией)

moderator:
  - read:flagged_content
  - write:moderation_decision
  - read:moderation_queue

admin:
  - all:*
```

**API Level Authorization:**
- Middleware проверяет JWT токен
- Извлекает user_id и role из токена
- Проверяет permissions для requested resource
- Deny by default (whitelist approach)

### Мониторинг безопасности

**SIEM (Security Information and Event Management):**
- Централизованный сбор security logs
- Correlation rules для обнаружения атак
- Alerting при подозрительной активности

**Security Metrics:**
- Неудачные попытки логина (> 5 за 5 минут → alert)
- Необычные паттерны доступа (geo-location, device fingerprint)
- API rate limit violations
- Подозрительные SQL запросы (SQL injection attempts)
- Аномалии в network traffic

**Vulnerability Scanning:**
- Регулярные scans инфраструктуры (weekly)
- Dependency scanning для библиотек (Snyk, Dependabot)
- Container image scanning (Trivy, Clair)
- Penetration testing (quarterly by 3rd party)

### Incident Response

**Incident Response Playbook:**

**1. Обнаружение (Detection):**
- Автоматические alerts от SIEM
- Сообщения от пользователей
- Bug bounty reports

**2. Оценка (Assessment):**
- Severity: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- Scope: количество затронутых пользователей
- Data breach: был ли доступ к sensitive data

**3. Containment:**
- Изоляция скомпрометированных систем
- Rotation credentials если необходимо
- Блокировка атакующих IP адресов

**4. Eradication:**
- Устранение причины инцидента
- Patching уязвимостей
- Updating firewall rules

**5. Recovery:**
- Восстановление сервисов
- Проверка integrity данных
- Мониторинг для предотвращения recurrence

**6. Post-Incident:**
- Детальный report (что, когда, почему, как)
- Lessons learned
- Обновление playbooks
- Notification пользователей (если требуется по GDPR)

**Incident Response Team:**
- Incident Commander (Lead Engineer/CTO)
- Technical Lead (Senior Backend Engineer)
- Security Engineer
- Communications Lead (для external communications)
- Legal/Compliance Officer (для regulatory issues)

**Communication Plan:**
- Internal: Slack channel, status page
- External: Email to affected users, public blog post (if major)
- Regulatory: notification в течение 72 часов (GDPR)

## Compliance и регуляторные требования

**GDPR (General Data Protection Regulation):**
- Right to access (предоставление данных пользователю)
- Right to deletion (удаление данных по запросу)
- Data portability (экспорт данных)
- Privacy by design
- Data protection officer (DPO)

**COPPA (Children's Online Privacy Protection Act):**
- Parental consent перед сбором данных детей < 13 лет
- Прозрачность в использовании данных
- Reasonable security measures
- Deletion policy

**152-ФЗ (Россия):**
- Хранение персональных данных граждан РФ на территории России
- Уведомление Роскомнадзора
- Локализация данных (при работе в РФ)

## Резюме и следующие шаги

**Готовность к масштабированию:**
✅ Микросервисная архитектура - легко масштабируется горизонтально
✅ Kubernetes - автоматическое управление и autoscaling
✅ Managed databases - репликация и failover
✅ CDN - снижение нагрузки на backend

**Приоритеты для MVP:**
1. ✅ Стабильный клиент (iOS) с базовым AI анализом
2. ⏳ API Gateway + User Service + Monitoring Service
3. ⏳ Content Moderation Service с OpenAI integration
4. ⏳ Alert Service с push notifications
5. ⏳ Basic monitoring и logging

**Приоритеты после MVP:**
1. Advanced ML models (custom training)
2. Behavioral analysis
3. Multi-region deployment
4. Advanced analytics dashboard
5. Integration с schools и NGOs

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (Draft)
**Ответственный:** CTO / Technical Architect
