# MVP спецификация для пилотного запуска

## Обзор MVP

**Цель MVP**: Запустить минимально жизнеспособный продукт на iOS TestFlight для пилотного тестирования с ограниченной группой пользователей (50-100 семей).

**Целевая аудитория пилота**: 
- Родители с детьми 6-12 лет
- Семьи из партнёрских школ/организаций
- Early adopters, готовые давать обратную связь

**Сроки MVP**: 3-4 месяца разработки до TestFlight релиза

## Ключевые фичи MVP

### 1. Аутентификация и онбординг

#### 1.1 Регистрация родителя
- Регистрация через email + пароль
- Email verification
- Базовая информация о семье
- Согласие с Terms of Service и Privacy Policy
- Родительское согласие (COPPA compliance)

#### 1.2 Создание профиля ребёнка
- Имя ребёнка (не обязательно настоящее)
- Дата рождения (для возрастных ограничений)
- Фото профиля (опционально)
- Выбор уровня модерации (строгий/средний/мягкий)
- Начальные настройки контроля

#### 1.3 Онбординг
- Welcome flow с объяснением основных функций
- Туториал для родителей (5-7 экранов)
- Упрощённый туториал для детей (3-4 экрана)
- Пропускаемые подсказки

### 2. Профили и настройки

#### 2.1 Детский профиль
- **Базовая информация**: имя, возраст, аватар
- **Интересы**: теги для поиска друзей (хобби, игры, спорт)
- **Статус**: простой текстовый статус
- **Приватность**: профиль видят только одобренные друзья

#### 2.2 Родительский dashboard
- Список всех детских профилей
- Быстрый доступ к настройкам каждого профиля
- Уведомления о модерации и активности
- Еженедельная аналитика (время использования)

#### 2.3 Настройки контроля
- **Уровень модерации**: 
  - Строгий: одобрение всего контента
  - Средний: автоматическая модерация + ручная проверка спорного
  - Мягкий: в основном автоматическая модерация
- **Время использования**: дневные/недельные лимиты
- **Разрешённые функции**: можно отключать отдельные фичи
- **Friend requests**: автоматическое одобрение или требуется подтверждение родителя

### 3. Социальное взаимодействие

#### 3.1 Поиск друзей
- Поиск по имени пользователя
- Поиск по интересам
- "Предложенные друзья" (на основе общих интересов)
- QR-код для быстрого добавления (сканирование в реальной жизни)

#### 3.2 Friend requests
- Отправка запроса на дружбу
- Входящие запросы (approve/decline)
- **Для детей младше 10**: требуется одобрение родителя
- Список друзей с статусами (онлайн/офлайн)

#### 3.3 Приватные сообщения (текст)
- 1-на-1 текстовые чаты только с друзьями
- Автоматическая модерация всех сообщений
- **Младше 10 лет**: родители могут просматривать историю
- Push-уведомления о новых сообщениях
- Базовые emoji (кураторский список безопасных)
- Ограничение: до 500 символов на сообщение

#### 3.4 Групповые чаты (опционально в MVP)
- Малые группы до 5 человек
- Создание группы только с друзьями
- Автоматическая модерация
- Выход из группы в любой момент

### 4. Контент и медиа

#### 4.1 Загрузка фото
- Загрузка с камеры или галереи
- Максимум 5 фото в день для детей младше 10
- Автоматическая модерация перед публикацией
- Размещение в личном профиле или отправка друзьям
- Базовые фильтры (3-5 безопасных фильтров)

#### 4.2 Просмотр контента
- Фото-лента от друзей (chronological feed)
- Лайки и комментарии
- Репорт неподобающего контента
- Ограничение контента по возрасту

#### 4.3 Модерация контента (для MVP - упрощённая)
- **Автоматическая ML модерация**:
  - Детекция неподобающих изображений (NSFW)
  - Фильтрация токсичных текстов
  - Детекция PII (номера телефонов, адреса)
- **Статусы контента**:
  - Approved: опубликовано
  - Pending: на ручной модерации
  - Rejected: отклонено с причиной
- **Родительское уведомление**: при отклонении или спорном контенте

### 5. Модерация и безопасность

#### 5.1 Автоматическая модерация
- **Текстовая модерация**:
  - Токсичность, оскорбления, буллинг
  - Сексуальный контент
  - Персональная информация (PII)
  - Внешние ссылки (автоматически блокируются)
- **Визуальная модерация**:
  - Неподобающий визуальный контент
  - Насилие
  - Детекция лиц взрослых (подозрительно)

#### 5.2 Ручная модерация (для MVP - ограниченная)
- Очередь для контента с низким confidence score
- Модераторский интерфейс (web-based)
- Решение: approve/reject с комментарием
- Уведомление родителям о решении

#### 5.3 Пользовательская модерация
- Кнопка "Report" для любого контента
- Категории: неподобающее, буллинг, спам, другое
- Автоматическое скрытие контента при множественных репортах
- Эскалация к ручной модерации

#### 5.4 Блокировка и бан
- Родители могут блокировать конкретных пользователей для своих детей
- Временный бан (24ч, 7д) при нарушениях
- Permanent ban при серьёзных нарушениях
- Апелляция через support email

### 6. Уведомления

#### 6.1 Push-уведомления
- Новые сообщения от друзей
- Friend requests
- Модерация контента (родителям)
- Время использования (напоминания и лимиты)
- Еженедельный отчёт (родителям)

#### 6.2 In-app уведомления
- Бэйджи на табах
- Notification center в приложении
- История уведомлений (последние 30 дней)

#### 6.3 Email уведомления (родителям)
- Важные security events
- Еженедельный digest
- Модерационные alerts
- Можно отключить в настройках

### 7. Аналитика и отчёты (для родителей)

#### 7.1 Дашборд активности
- Время использования (ежедневно/еженедельно)
- Количество сообщений отправлено/получено
- Новые друзья
- Загруженный/просмотренный контент

#### 7.2 Еженедельный отчёт
- Summary активности за неделю
- Топ 5 друзей по активности
- Модерационные события
- Рекомендации (если есть concerns)

### 8. Support и Help

#### 8.1 Help Center
- FAQ (встроенный в приложение)
- Категории: account, safety, technical, privacy
- Поиск по FAQ

#### 8.2 Contact Support
- Email форма в приложении
- Категории обращений
- Родители и дети имеют разные support flows
- Response time: 24-48 часов (для MVP)

#### 8.3 Safety Resources
- Руководство по безопасности для детей
- Руководство для родителей
- Что делать при буллинге/harassment
- Контакты кризисных линий помощи

## User Flows (основные)

### Flow 1: Регистрация и создание профиля ребёнка

```
1. Родитель открывает приложение
2. Экран: Welcome → Tap "Get Started"
3. Экран: Sign Up (email, password)
4. Экран: Email Verification (enter code)
5. Экран: Parental Consent (checkbox + submit)
6. Экран: Create Child Profile
   - Имя ребёнка
   - Дата рождения
   - Upload фото (optional)
   - Выбор уровня модерации
7. Экран: Onboarding Tutorial (5 слайдов)
8. Экран: Main Dashboard (child profile created)
```

### Flow 2: Ребёнок отправляет сообщение другу

```
1. Ребёнок открывает приложение (logged in)
2. Tab: Messages → Список друзей
3. Tap на друга → Chat screen
4. Ввод текста → Tap "Send"
5. Backend: Автоматическая модерация
   - IF approved: сообщение доставлено мгновенно
   - IF pending: сообщение в очереди (показывается "Pending moderation")
   - IF rejected: уведомление "Message cannot be sent" + reason
6. Friend получает push-уведомление (если approved)
7. Родитель получает уведомление (если rejected или pending)
```

### Flow 3: Загрузка и модерация фото

```
1. Ребёнок открывает приложение
2. Tab: Profile или Feed → Tap "Upload Photo"
3. Выбор источника: Camera / Gallery
4. Выбор фото → Optional: Apply filter
5. Tap "Upload"
6. Upload progress bar → "Moderating..."
7. Backend ML модерация (2-5 секунд)
   - IF approved (score > 0.95): "Photo uploaded!" → видно в профиле
   - IF pending (score 0.7-0.95): "Under review" → в очереди модерации
   - IF rejected (score < 0.7): "Photo rejected" + reason (generic)
8. Родитель получает уведомление (для pending/rejected)
9. Ручная модерация (если pending) → решение
10. Уведомление ребёнку/родителю о финальном решении
```

### Flow 4: Родитель проверяет активность ребёнка

```
1. Родитель открывает приложение
2. Выбор профиля ребёнка (если несколько)
3. Tab: Dashboard → Activity widget
   - Время использования сегодня
   - Количество сообщений
   - Новые друзья
4. Tap "View Details" → Detailed analytics
   - Графики использования по дням
   - Топ друзей
   - Модерационные события (если были)
5. Tap "Weekly Report" → PDF/HTML отчёт
6. Option: "Share with partner" (другому родителю)
```

### Flow 5: Добавление друга через QR-код

```
1. Ребёнок A открывает приложение
2. Tab: Friends → Tap "Add Friend" → "Show QR Code"
3. QR-код с уникальным friend ID отображается
4. Ребёнок B открывает приложение
5. Tab: Friends → Tap "Add Friend" → "Scan QR Code"
6. Камера открывается → сканирование QR-кода
7. Экран: "Add [Child A Name] as friend?" → Tap "Send Request"
8. IF ребёнок младше 10: "Request sent to parent for approval"
   - Parent notification → approve/decline
9. IF ребёнок 10+: Friend request отправлен напрямую
10. Ребёнок A получает friend request → accept/decline
11. При accept: Оба добавлены в друзья → push-уведомления
```

## API Contract (черновые эндпоинты)

### Authentication

#### POST /api/v1/auth/register
**Request:**
```json
{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "role": "parent",
  "consent": true,
  "language": "ru"
}
```
**Response:**
```json
{
  "userId": "user_abc123",
  "email": "parent@example.com",
  "verificationRequired": true,
  "message": "Verification code sent to email"
}
```

#### POST /api/v1/auth/verify-email
**Request:**
```json
{
  "userId": "user_abc123",
  "code": "123456"
}
```
**Response:**
```json
{
  "verified": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

#### POST /api/v1/auth/login
**Request:**
```json
{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "userId": "user_abc123",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900,
  "profiles": ["child_profile_1", "child_profile_2"]
}
```

### User Profiles

#### POST /api/v1/profiles/child
**Request:**
```json
{
  "parentId": "user_abc123",
  "name": "Алиса",
  "birthDate": "2015-06-15",
  "avatar": "https://...",
  "interests": ["рисование", "танцы", "котики"],
  "moderationLevel": "medium",
  "settings": {
    "dailyTimeLimit": 120,
    "friendRequestApproval": true,
    "parentCanViewMessages": true
  }
}
```
**Response:**
```json
{
  "profileId": "child_xyz789",
  "name": "Алиса",
  "age": 8,
  "username": "alice_xyz789",
  "qrCode": "https://api.../qr/child_xyz789",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### GET /api/v1/profiles/child/{profileId}
**Response:**
```json
{
  "profileId": "child_xyz789",
  "name": "Алиса",
  "age": 8,
  "username": "alice_xyz789",
  "avatar": "https://...",
  "interests": ["рисование", "танцы", "котики"],
  "status": "Люблю рисовать! 🎨",
  "friendCount": 12,
  "settings": { ... }
}
```

#### PATCH /api/v1/profiles/child/{profileId}
**Request:**
```json
{
  "status": "Новый статус!",
  "interests": ["рисование", "танцы", "котики", "музыка"]
}
```
**Response:**
```json
{
  "profileId": "child_xyz789",
  "updated": true,
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### Friends

#### POST /api/v1/friends/request
**Request:**
```json
{
  "fromProfileId": "child_xyz789",
  "toProfileId": "child_abc456",
  "method": "qr_code"
}
```
**Response:**
```json
{
  "requestId": "req_123456",
  "status": "pending",
  "requiresParentApproval": true,
  "message": "Friend request sent. Waiting for parent approval."
}
```

#### POST /api/v1/friends/request/{requestId}/respond
**Request:**
```json
{
  "profileId": "child_abc456",
  "action": "accept"
}
```
**Response:**
```json
{
  "requestId": "req_123456",
  "status": "accepted",
  "friendship": {
    "friendshipId": "friendship_789",
    "profiles": ["child_xyz789", "child_abc456"],
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

#### GET /api/v1/friends/{profileId}
**Response:**
```json
{
  "profileId": "child_xyz789",
  "friends": [
    {
      "profileId": "child_abc456",
      "name": "Боря",
      "avatar": "https://...",
      "status": "online",
      "lastSeen": "2024-01-15T12:30:00Z"
    }
  ],
  "totalCount": 12
}
```

### Messages

#### POST /api/v1/messages/send
**Request:**
```json
{
  "fromProfileId": "child_xyz789",
  "toProfileId": "child_abc456",
  "type": "text",
  "content": "Привет! Как дела?",
  "metadata": {
    "clientMessageId": "msg_client_123"
  }
}
```
**Response:**
```json
{
  "messageId": "msg_server_456",
  "status": "pending_moderation",
  "estimatedTime": 5,
  "message": "Message is being moderated"
}
```

#### GET /api/v1/messages/conversation/{profileId1}/{profileId2}
**Query params:** `?limit=50&before=timestamp`
**Response:**
```json
{
  "conversation": {
    "participants": ["child_xyz789", "child_abc456"],
    "messages": [
      {
        "messageId": "msg_001",
        "fromProfileId": "child_xyz789",
        "content": "Привет!",
        "status": "delivered",
        "sentAt": "2024-01-15T12:00:00Z",
        "readAt": "2024-01-15T12:01:00Z"
      }
    ],
    "hasMore": true
  }
}
```

#### GET /api/v1/messages/conversations/{profileId}
**Response:**
```json
{
  "conversations": [
    {
      "conversationId": "conv_123",
      "withProfile": {
        "profileId": "child_abc456",
        "name": "Боря",
        "avatar": "https://..."
      },
      "lastMessage": {
        "content": "Увидимся завтра!",
        "sentAt": "2024-01-15T15:00:00Z",
        "status": "read"
      },
      "unreadCount": 0
    }
  ]
}
```

### Content

#### POST /api/v1/content/upload/request
**Request:**
```json
{
  "profileId": "child_xyz789",
  "type": "image",
  "mimeType": "image/jpeg",
  "sizeBytes": 2048576,
  "metadata": {
    "caption": "Мой рисунок!"
  }
}
```
**Response:**
```json
{
  "uploadId": "upload_123",
  "uploadUrl": "https://s3.../presigned-url",
  "expiresIn": 300,
  "contentId": "content_456"
}
```

#### POST /api/v1/content/{contentId}/complete
**Request:**
```json
{
  "uploadId": "upload_123",
  "profileId": "child_xyz789"
}
```
**Response:**
```json
{
  "contentId": "content_456",
  "status": "pending_moderation",
  "message": "Content is being moderated"
}
```

#### GET /api/v1/content/feed/{profileId}
**Query params:** `?limit=20&before=timestamp`
**Response:**
```json
{
  "items": [
    {
      "contentId": "content_789",
      "profileId": "child_abc456",
      "profile": {
        "name": "Боря",
        "avatar": "https://..."
      },
      "type": "image",
      "url": "https://cdn.../image.jpg",
      "thumbnail": "https://cdn.../thumb.jpg",
      "caption": "Посмотрите на это!",
      "createdAt": "2024-01-15T14:00:00Z",
      "likes": 5,
      "comments": 2,
      "liked": false
    }
  ],
  "hasMore": true
}
```

### Moderation

#### GET /api/v1/moderation/status/{contentId}
**Response:**
```json
{
  "contentId": "content_456",
  "status": "approved",
  "moderatedAt": "2024-01-15T12:05:00Z",
  "moderationType": "automatic",
  "score": 0.98
}
```

#### POST /api/v1/moderation/report
**Request:**
```json
{
  "reporterId": "child_xyz789",
  "contentId": "content_789",
  "category": "inappropriate",
  "description": "Это неподобающий контент"
}
```
**Response:**
```json
{
  "reportId": "report_123",
  "status": "submitted",
  "message": "Thank you for your report. We will review it."
}
```

### Notifications

#### GET /api/v1/notifications/{profileId}
**Query params:** `?limit=50&unreadOnly=true`
**Response:**
```json
{
  "notifications": [
    {
      "notificationId": "notif_123",
      "type": "friend_request",
      "title": "New friend request",
      "body": "Боря sent you a friend request",
      "data": {
        "requestId": "req_456",
        "fromProfileId": "child_abc456"
      },
      "read": false,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

#### POST /api/v1/notifications/{notificationId}/mark-read
**Response:**
```json
{
  "notificationId": "notif_123",
  "read": true
}
```

### Analytics (для родителей)

#### GET /api/v1/analytics/activity/{profileId}
**Query params:** `?period=week&startDate=2024-01-08`
**Response:**
```json
{
  "profileId": "child_xyz789",
  "period": "week",
  "data": {
    "totalScreenTime": 840,
    "dailyBreakdown": [
      { "date": "2024-01-08", "minutes": 120 },
      { "date": "2024-01-09", "minutes": 100 }
    ],
    "messagesSent": 45,
    "messagesReceived": 52,
    "contentUploaded": 3,
    "contentViewed": 28,
    "newFriends": 2,
    "moderationEvents": {
      "approved": 3,
      "pending": 0,
      "rejected": 1
    }
  }
}
```

#### GET /api/v1/analytics/weekly-report/{profileId}
**Response:**
```json
{
  "profileId": "child_xyz789",
  "weekStart": "2024-01-08",
  "weekEnd": "2024-01-14",
  "reportUrl": "https://api.../reports/weekly_child_xyz789_2024W02.pdf",
  "summary": {
    "totalScreenTime": 840,
    "averageDaily": 120,
    "topFriends": ["child_abc456", "child_def789"],
    "highlights": ["Connected with 2 new friends", "Uploaded 3 photos"],
    "concerns": []
  }
}
```

## Требования к Backend для MVP

### Технический стек (рекомендация)

#### Backend
- **Framework**: NestJS (Node.js) или Go
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Queue**: RabbitMQ или AWS SQS
- **Storage**: AWS S3 или MinIO
- **Search**: Elasticsearch (опционально для MVP)

#### ML Модерация
- **Framework**: Python FastAPI
- **ML**: PyTorch/TensorFlow с pre-trained моделями
- **Inference**: ONNX Runtime для оптимизации
- **Models**:
  - Text: BERT-based toxicity classifier
  - Vision: ResNet/EfficientNet для NSFW detection
  - Multi-modal: CLIP для комплексного анализа

#### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (может быть на AWS EKS, GKE, или локально с Minikube для dev)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (упрощённый для MVP)
- **Logging**: JSON logs → CloudWatch/Loki

### Backend сервисы (упрощённо для MVP)

#### Минимальный набор микросервисов
1. **Auth Service**: аутентификация и authorization
2. **Profile Service**: user profiles и settings
3. **Social Service**: friends, messages, feed
4. **Content Service**: загрузка и хранение медиа
5. **Moderation Service**: интеграция с ML и ручная модерация
6. **Notification Service**: push и email уведомления

#### Или Monolith для MVP (альтернатива)
- Единое NestJS приложение с модульной архитектурой
- Легче начать и deploy
- Можно разделить на микросервисы позже

### Database Schema (основные таблицы)

```sql
-- Users (родители)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'parent', 'moderator', 'admin'
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Child Profiles
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  avatar_url VARCHAR(500),
  status VARCHAR(200),
  moderation_level VARCHAR(20), -- 'strict', 'medium', 'light'
  settings JSONB, -- гибкие настройки
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Interests (многие-ко-многим с profiles)
CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE profile_interests (
  profile_id UUID REFERENCES child_profiles(id),
  interest_id INT REFERENCES interests(id),
  PRIMARY KEY (profile_id, interest_id)
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY,
  profile_id_1 UUID REFERENCES child_profiles(id),
  profile_id_2 UUID REFERENCES child_profiles(id),
  status VARCHAR(20) NOT NULL, -- 'pending', 'accepted', 'rejected', 'blocked'
  initiated_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (profile_id_1, profile_id_2)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  from_profile_id UUID REFERENCES child_profiles(id),
  to_profile_id UUID REFERENCES child_profiles(id),
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'sticker'
  status VARCHAR(20) NOT NULL, -- 'pending', 'approved', 'rejected', 'delivered', 'read'
  moderation_score DECIMAL(3,2),
  moderation_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Content (загруженные медиа)
CREATE TABLE content (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES child_profiles(id),
  type VARCHAR(20) NOT NULL, -- 'image', 'video'
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  caption VARCHAR(500),
  status VARCHAR(20) NOT NULL, -- 'pending', 'approved', 'rejected'
  moderation_score DECIMAL(3,2),
  moderation_reason VARCHAR(255),
  visibility VARCHAR(20) DEFAULT 'friends', -- 'friends', 'private'
  created_at TIMESTAMP DEFAULT NOW(),
  moderated_at TIMESTAMP
);

-- Content Interactions
CREATE TABLE content_likes (
  content_id UUID REFERENCES content(id),
  profile_id UUID REFERENCES child_profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (content_id, profile_id)
);

CREATE TABLE content_comments (
  id UUID PRIMARY KEY,
  content_id UUID REFERENCES content(id),
  profile_id UUID REFERENCES child_profiles(id),
  comment TEXT NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Moderation Queue
CREATE TABLE moderation_queue (
  id UUID PRIMARY KEY,
  item_type VARCHAR(20) NOT NULL, -- 'message', 'content', 'comment'
  item_id UUID NOT NULL,
  profile_id UUID REFERENCES child_profiles(id),
  priority INT DEFAULT 0,
  ml_score DECIMAL(3,2),
  ml_categories JSONB, -- categories detected by ML
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewing', 'completed'
  assigned_to UUID REFERENCES users(id), -- moderator
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Moderation Decisions
CREATE TABLE moderation_decisions (
  id UUID PRIMARY KEY,
  queue_id UUID REFERENCES moderation_queue(id),
  moderator_id UUID REFERENCES users(id),
  decision VARCHAR(20) NOT NULL, -- 'approve', 'reject'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reports (user reports)
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  reporter_id UUID REFERENCES child_profiles(id),
  reported_item_type VARCHAR(20) NOT NULL, -- 'content', 'message', 'profile'
  reported_item_id UUID NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'inappropriate', 'bullying', 'spam', 'other'
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES child_profiles(id),
  type VARCHAR(50) NOT NULL, -- 'friend_request', 'message', 'moderation', etc.
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- additional payload
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics (aggregated data)
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES child_profiles(id),
  date DATE NOT NULL,
  screen_time_minutes INT DEFAULT 0,
  messages_sent INT DEFAULT 0,
  messages_received INT DEFAULT 0,
  content_uploaded INT DEFAULT 0,
  content_viewed INT DEFAULT 0,
  UNIQUE (profile_id, date)
);
```

### ML Модели для MVP

#### Текстовая модерация
- **Model**: BERT-based toxicity classifier (например, Detoxify)
- **Категории**:
  - Toxicity
  - Severe toxicity
  - Obscene
  - Threat
  - Insult
  - Identity hate
- **Threshold**: Score > 0.7 → reject или pending
- **Latency target**: < 500ms

#### Визуальная модерация
- **Model**: Pre-trained ResNet/EfficientNet fine-tuned на NSFW dataset
- **Категории**:
  - NSFW (различные типы)
  - Violence
  - Gore
- **Threshold**: Score > 0.7 → reject или pending
- **Latency target**: < 3 секунды для изображения

#### PII Detection
- **Text**: Regex patterns для телефонов, email, адресов
- **Images**: OCR (Tesseract) + regex для текста на изображениях
- **Action**: Автоматический reject при детекции PII

### API Rate Limiting (MVP)

```
Public endpoints (no auth):
- 10 requests per minute per IP

Authenticated users:
- 100 requests per minute per user

Child profiles:
- Messages: 60 per hour (1 per minute average)
- Content upload: 10 per day
- Friend requests: 20 per day

Moderators:
- 300 requests per minute
```

### Security (MVP minimum)

1. **HTTPS only**: TLS 1.2+
2. **JWT Authentication**: 15-минутные access tokens
3. **Password requirements**: минимум 8 символов, включая цифры
4. **Rate limiting**: защита от brute force
5. **Input validation**: на всех endpoints
6. **SQL Injection protection**: parameterized queries
7. **XSS protection**: санитизация пользовательского input
8. **CORS**: разрешены только known origins

### Monitoring и Logging (MVP)

#### Метрики для мониторинга
- API response times (p50, p95, p99)
- Error rates (по endpoint)
- Database query times
- ML модерация latency
- Queue depths (moderation, notifications)
- Active users (concurrent)

#### Alerts (критичные)
- API error rate > 5%
- Database connection pool exhausted
- Moderation queue depth > 100
- ML service unavailable

#### Logging
- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Обязательно логировать:
  - All authentication events
  - All moderation decisions
  - All failed requests (with sanitized data)
  - All critical errors

## Success Metrics для MVP пилота

### Adoption Metrics
- **Target**: 50-100 семей в пилоте
- Parent registrations: 80% completion rate
- Child profiles created: average 1.5 per parent
- Daily Active Users (DAU): 40% of registered profiles

### Engagement Metrics
- Messages sent: average 10 per active user per day
- Content uploaded: average 1 per user per week
- Friend connections: average 5 friends per profile
- Session length: 15-20 минут average

### Safety Metrics
- Moderation accuracy: > 90% (measured via audit)
- False positive rate: < 5%
- Average moderation time: < 30 seconds for automatic, < 5 минут for manual
- User reports: < 1% of all content

### Parent Satisfaction
- Parent NPS (Net Promoter Score): > 50
- Weekly report open rate: > 60%
- Safety concerns reported: < 5 per 100 users

### Technical Metrics
- API availability: > 99.5%
- API latency p95: < 500ms
- ML модерация latency p95: < 5 секунд
- Push notification delivery rate: > 95%

## Scope ограничения MVP (что НЕ включено)

### Не для MVP:
- ❌ Android приложение (только iOS)
- ❌ Web версия
- ❌ Видео загрузка и стриминг
- ❌ Голосовые/видео звонки
- ❌ Stories или ephemeral контент
- ❌ Геолокация или location sharing
- ❌ In-app покупки/monetization
- ❌ Групповые активности или игры
- ❌ Интеграция с социальными сетями
- ❌ Multi-language support (только русский)
- ❌ Расширенная аналитика и BI
- ❌ Экспорт данных в других форматах

## Следующие шаги после MVP

1. **Сбор feedback**: детальные интервью с пилотными пользователями
2. **Итерация**: улучшение на основе feedback
3. **Расширение функций**: приоритизация фич для следующей версии
4. **Android разработка**: если iOS MVP успешен
5. **Масштабирование**: подготовка инфраструктуры для большего количества пользователей
6. **Monetization**: внедрение subscription модели
7. **Regulatory compliance**: полный аудит и сертификация (COPPA, GDPR)

## Заключение

MVP фокусируется на core value proposition: безопасное социальное взаимодействие для детей с родительским контролем и ML модерацией. Все остальное вторично и будет добавлено в следующих версиях на основе user feedback и business приоритетов.
