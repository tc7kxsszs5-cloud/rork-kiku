# Спецификация MVP для Rork-Kiku

## Цель MVP

Минимальный жизнеспособный продукт (MVP) для **iOS TestFlight пилота**, демонстрирующий ключевые функции защиты детей в цифровой среде. MVP предназначен для тестирования с ограниченной группой пользователей (50-100 семей) для валидации гипотез и сбора обратной связи.

## Scope MVP

### ✅ Включено в MVP

#### 1. Аутентификация и онбординг
- Регистрация родителя (email + пароль)
- Создание профиля ребенка (имя, возраст, аватар)
- Базовый онбординг (3-4 экрана)
- Согласие родителя (parental consent)

#### 2. Детский безопасный браузер
- Встроенный браузер с базовой фильтрацией
- Белый список разрешенных сайтов (предустановленный)
- Блокировка неразрешенных доменов
- Запрос родительского разрешения для нового сайта

#### 3. Фильтрация контента (базовая)
- Текстовая фильтрация (keyword-based + ML)
- Определение токсичного/неприемлемого языка
- Блокировка явного контента (explicit keywords)
- Уведомление родителю о заблокированном контенте

#### 4. Родительская панель
- Просмотр активности ребенка (last 24h)
- История заблокированного контента
- Одобрение/отклонение запросов на новые сайты
- Базовые настройки фильтров (строгость: низкая/средняя/высокая)

#### 5. Уведомления
- Push уведомления родителю при блокировке контента
- Уведомления о запросах ребенка на новые сайты
- Дневной дайджест активности (опционально)

#### 6. Безопасность
- Шифрование данных (в транзите и покое)
- JWT-based аутентификация
- Безопасное хранение токенов (Expo SecureStore)
- HTTPS для всех запросов

### ❌ Не включено в MVP (отложено на v2)

- Android версия (только iOS)
- Анализ изображений/видео (только текст)
- Мониторинг социальных сетей
- Time limits и screen time управление
- Геолокация и безопасные зоны
- Многопрофильность (несколько детей) - только 1 ребенок в MVP
- Расширенная аналитика и отчеты
- In-app purchases / subscriptions
- Интеграция с школьными системами

## User Flows

### Flow 1: Регистрация и настройка (первый запуск)

```
1. Родитель открывает app
   └─> Splash screen → Welcome screen

2. Регистрация родителя
   ├─> Email + пароль
   ├─> Подтверждение email (отправляется код)
   └─> Ввод кода подтверждения

3. Создание профиля ребенка
   ├─> Имя ребенка
   ├─> Возраст (dropdown)
   ├─> Выбор аватара (preset avatars)
   └─> Подтверждение parental consent

4. Выбор уровня фильтрации
   ├─> Низкий (11-13 лет)
   ├─> Средний (8-10 лет)
   └─> Высокий (5-7 лет)

5. Завершение онбординга
   └─> "Готово! Начните использовать"
```

### Flow 2: Ребенок пытается открыть сайт

```
1. Ребенок открывает браузер в детском интерфейсе
   └─> Показывается стартовая страница с рекомендованными сайтами

2. Ребенок вводит URL или использует поиск
   └─> App проверяет домен в whitelist

3a. Домен разрешен
    ├─> Открывается в браузере
    └─> Логируется в истории

3b. Домен не разрешен
    ├─> Показывается экран "Этот сайт заблокирован"
    ├─> Опция "Попросить разрешение родителя"
    └─> Отправляется уведомление родителю

4. (Опционально) Контент-фильтр проверяет текст на странице
   ├─> Если обнаружен неприемлемый контент → блокировка
   └─> Уведомление родителю
```

### Flow 3: Родитель проверяет активность

```
1. Родитель открывает parent dashboard
   └─> Видит карточку профиля ребенка

2. Просмотр активности
   ├─> Список посещенных сайтов (last 24h)
   ├─> Количество заблокированных попыток
   └─> Список заблокированного контента (preview)

3. Обработка запросов
   ├─> Нажимает на запрос "Разрешить youtube.com?"
   ├─> Просматривает причину запроса
   └─> Одобряет или отклоняет
       ├─> Если одобрено → домен добавляется в whitelist
       └─> Ребенок получает уведомление
```

### Flow 4: Проверка текстового контента (real-time)

```
1. Ребенок вводит текст (например, в поиск или чат)
   └─> Текст отправляется на проверку (debounced, не каждый символ)

2. Backend/ML проверяет контент
   ├─> Keyword matching (fast path)
   ├─> ML classifier (если не в cache)
   └─> Возвращает score и action

3a. Контент безопасен
    └─> Продолжение работы без уведомлений

3b. Контент подозрителен (warning)
    ├─> Показывается предупреждение "Будь осторожен"
    └─> Контент логируется (не блокируется)

3c. Контент неприемлем (block)
    ├─> Блокируется ввод/отправка
    ├─> Показывается сообщение "Этот контент запрещен"
    ├─> Уведомление родителю
    └─> Логируется инцидент
```

## API Contract (черновик)

### Аутентификация

#### POST /api/v1/auth/register
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePassword123!",
  "termsAccepted": true
}

Response: 200 OK
{
  "userId": "user_123",
  "email": "parent@example.com",
  "accessToken": "eyJhbGci...",
  "refreshToken": "refresh_abc..."
}
```

#### POST /api/v1/auth/login
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "refresh_abc...",
  "user": {
    "id": "user_123",
    "email": "parent@example.com",
    "role": "parent"
  }
}
```

### Профили

#### POST /api/v1/profiles/child
```json
Request:
Headers: { "Authorization": "Bearer <accessToken>" }
Body:
{
  "name": "Алиса",
  "age": 9,
  "avatar": "avatar_02",
  "filterLevel": "medium"
}

Response: 201 Created
{
  "childId": "child_456",
  "name": "Алиса",
  "age": 9,
  "filterLevel": "medium",
  "createdAt": "2026-01-02T08:00:00Z"
}
```

#### GET /api/v1/profiles/child/:childId
```json
Response: 200 OK
{
  "childId": "child_456",
  "name": "Алиса",
  "age": 9,
  "avatar": "avatar_02",
  "filterLevel": "medium",
  "whitelistedDomains": ["youtube.com", "wikipedia.org"],
  "stats": {
    "sitesVisited": 45,
    "blockedAttempts": 7,
    "lastActive": "2026-01-02T07:30:00Z"
  }
}
```

### Контент-фильтрация

#### POST /api/v1/content/check
```json
Request:
Headers: { "Authorization": "Bearer <accessToken>" }
Body:
{
  "childId": "child_456",
  "type": "text",
  "content": "Пример текста для проверки"
}

Response: 200 OK
{
  "action": "allow",  // allow | warn | block
  "reason": null,
  "score": 0.15,
  "details": {
    "classifier": "text_toxicity_v1",
    "confidence": 0.87,
    "categories": []
  }
}

Response: 200 OK (заблокированный контент)
{
  "action": "block",
  "reason": "toxic_language",
  "score": 0.92,
  "details": {
    "classifier": "text_toxicity_v1",
    "confidence": 0.95,
    "categories": ["profanity", "harassment"]
  }
}
```

#### POST /api/v1/content/check-domain
```json
Request:
{
  "childId": "child_456",
  "domain": "example.com"
}

Response: 200 OK
{
  "allowed": false,
  "reason": "not_whitelisted",
  "canRequest": true
}
```

### Запросы родительского разрешения

#### POST /api/v1/parental/requests
```json
Request:
{
  "childId": "child_456",
  "type": "domain_access",
  "domain": "tiktok.com",
  "reason": "Хочу посмотреть видео"
}

Response: 201 Created
{
  "requestId": "req_789",
  "status": "pending",
  "createdAt": "2026-01-02T08:00:00Z"
}
```

#### GET /api/v1/parental/requests
```json
Response: 200 OK
{
  "requests": [
    {
      "requestId": "req_789",
      "childId": "child_456",
      "childName": "Алиса",
      "type": "domain_access",
      "domain": "tiktok.com",
      "reason": "Хочу посмотреть видео",
      "status": "pending",
      "createdAt": "2026-01-02T08:00:00Z"
    }
  ]
}
```

#### PUT /api/v1/parental/requests/:requestId
```json
Request:
{
  "status": "approved",  // approved | rejected
  "note": "Разрешаю на 1 час"
}

Response: 200 OK
{
  "requestId": "req_789",
  "status": "approved",
  "approvedAt": "2026-01-02T08:05:00Z"
}
```

### Активность

#### GET /api/v1/activity/child/:childId
```json
Request:
Query params: ?timeRange=24h

Response: 200 OK
{
  "childId": "child_456",
  "timeRange": "24h",
  "summary": {
    "sitesVisited": 15,
    "blockedAttempts": 3,
    "warningIssued": 1
  },
  "events": [
    {
      "id": "evt_001",
      "timestamp": "2026-01-02T07:30:00Z",
      "type": "content_blocked",
      "domain": "blocked-site.com",
      "reason": "not_whitelisted",
      "details": "Попытка доступа к заблокированному сайту"
    },
    {
      "id": "evt_002",
      "timestamp": "2026-01-02T07:15:00Z",
      "type": "site_visited",
      "domain": "wikipedia.org",
      "duration": 420
    }
  ]
}
```

## Backend Requirements для MVP

### Технологии
- **Runtime**: Node.js 18+ (TypeScript) или Go 1.21+
- **Framework**: Express.js/Fastify (Node) или Gin (Go)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Queue**: AWS SQS или RabbitMQ (optional, для async tasks)

### Основные модули

```
backend-mvp/
├── src/
│   ├── auth/              # JWT, OAuth2, sessions
│   ├── profiles/          # User & child profiles
│   ├── content/           # Content filtering API
│   ├── ml/                # ML client (к ML service)
│   ├── parental/          # Parental controls & requests
│   ├── activity/          # Activity logging & retrieval
│   ├── notifications/     # Push notifications (FCM/APNs)
│   └── middleware/        # Auth, logging, rate limiting
├── db/
│   └── migrations/        # Prisma/TypeORM migrations
├── config/
│   └── env/               # Environment configs
└── tests/
    └── integration/       # API tests
```

### Database Schema (упрощенная)

```sql
-- Users (родители)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'parent',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Child Profiles
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  avatar VARCHAR(50),
  filter_level VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Whitelisted Domains
CREATE TABLE whitelisted_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  added_by UUID REFERENCES users(id),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, domain)
);

-- Content Checks (история проверок)
CREATE TABLE content_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  content_type VARCHAR(20),  -- 'text', 'domain'
  content_hash TEXT,
  action VARCHAR(20),         -- 'allow', 'warn', 'block'
  score DECIMAL(4, 3),
  reason TEXT,
  checked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_checks_child_time ON content_checks(child_id, checked_at DESC);

-- Parental Requests
CREATE TABLE parental_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES users(id),
  request_type VARCHAR(50),   -- 'domain_access'
  domain VARCHAR(255),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Activity Events
CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50),     -- 'site_visited', 'content_blocked'
  domain VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_events_child_time ON activity_events(child_id, created_at DESC);
```

### Environment Variables

```bash
# App
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rork_kiku

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=[USE_AWS_SECRETS_MANAGER_OR_ENV_VAR]
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ML Service
ML_SERVICE_URL=https://ml.rork-kiku.internal
ML_API_KEY=[USE_SECRETS_MANAGER]

# Push Notifications
FCM_SERVER_KEY=[USE_SECRETS_MANAGER]
APNS_KEY_ID=[USE_SECRETS_MANAGER]
APNS_TEAM_ID=[USE_SECRETS_MANAGER]

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=[USE_IAM_ROLES_IN_PROD]
AWS_SECRET_ACCESS_KEY=[USE_IAM_ROLES_IN_PROD]
```

⚠️ **Важно**: НЕ храните секреты в коде. Используйте:
- AWS Secrets Manager
- GitHub Secrets (для CI/CD)
- HashiCorp Vault
- Kubernetes Secrets

## ML Inference Requirements для MVP

### Модель: Text Toxicity Classifier

**Тип модели**: BERT-based classifier (fine-tuned)

**Входные данные**: Текст (до 512 токенов)

**Выходные данные**:
```json
{
  "score": 0.85,           // 0-1 (вероятность токсичности)
  "label": "toxic",        // toxic | non-toxic
  "confidence": 0.92,      // 0-1
  "categories": [
    "profanity",
    "harassment"
  ]
}
```

**Latency requirement**: < 500ms (p95)

**Deployment**:
- Docker container с FastAPI
- Deploy на AWS ECS/EKS или Kubernetes
- Auto-scaling: 2-5 replicas (в зависимости от load)

### Альтернатива: Third-party API (для MVP)

Для ускорения MVP можно использовать готовые API:
- **Perspective API** (Google) — бесплатно до 1M requests/мес
- **Azure Content Moderator** — платный, но быстрый onboarding
- **OpenAI Moderation API** — бесплатно, высокая точность

**Плюсы third-party**:
- Быстрый запуск (нет необходимости тренировать модель)
- Готовая инфраструктура
- Меньше initial costs

**Минусы**:
- Зависимость от внешнего сервиса
- Ограничения на privacy (данные отправляются третьей стороне)
- Costs при масштабировании

**Рекомендация для MVP**: Начать с **Perspective API** или собственной легкой модели, мигрировать на собственную инфраструктуру после пилота.

## Success Metrics для MVP

### Технические метрики
- **API Uptime**: > 99.5%
- **p95 Latency**: < 300ms (API calls)
- **ML Inference Time**: < 500ms (p95)
- **Crash Rate**: < 1%

### Продуктовые метрики
- **Daily Active Users (DAU)**: 60% от registered users
- **Content Checks per Day**: 50+ per child
- **Parental Engagement**: 70% родителей проверяют dashboard раз в день
- **False Positive Rate**: < 5% (контент ошибочно заблокирован)
- **False Negative Rate**: < 2% (вредный контент пропущен)

### Пользовательские метрики
- **NPS (Net Promoter Score)**: > 40
- **App Store Rating**: > 4.0 ★
- **Retention (Week 1)**: > 60%
- **Retention (Week 4)**: > 40%

## Roadmap MVP → v1.0

### MVP (Текущий scope)
- Базовый функционал
- iOS TestFlight
- 50-100 семей

### v1.1 (Post-MVP, +2 мес)
- Улучшение ML моделей (на основе feedback)
- Поддержка нескольких детей
- Улучшенная аналитика родительской панели

### v1.2 (+3 мес)
- Android версия
- Изображение/видео фильтрация (базовая)
- Time limits

### v2.0 (Production, +6 мес)
- Public App Store release
- Subscriptions
- Расширенные функции (social media monitoring)

---

**Автор**: Продуктовая команда Rork-Kiku  
**Версия**: 0.1.0 (Черновик)  
**Дата**: Январь 2026  
**Статус**: Требует валидации с командой и техническим ревью
