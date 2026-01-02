# MVP Спецификация Rork-Kiku

## Обзор MVP

MVP (Minimum Viable Product) предназначен для пилотного тестирования через iOS TestFlight с ограниченной группой пользователей (100-500 семей).

**Цель:** Валидация core value proposition — безопасная коммуникация между родителями и детьми с автоматической модерацией контента.

**Платформа:** iOS только (iPhone, iPad), минимальная версия iOS 15.0

**Срок разработки:** 12-16 недель

**Бюджет:** $50,000 - $80,000

## Критичные фичи MVP

### 1. Регистрация и верификация родителя

**Описание:**
Родитель создаёт аккаунт и проходит верификацию для подтверждения статуса "доверенный взрослый".

**Функциональность:**
- Регистрация через email + пароль
- Альтернатива: Sign in with Apple (рекомендуется для iOS)
- Валидация email через 6-значный код
- Обязательные поля: имя, email, пароль, согласие с Terms & Privacy Policy
- Опциональная верификация личности (для MVP можно упростить):
  - Подтверждение номера телефона через SMS
  - Или: микротранзакция на карту ($0.01)

**UI Requirements:**
- Простая форма регистрации на одном экране
- Clear privacy messaging ("Мы защищаем данные вашего ребёнка")
- Прогресс индикатор (Шаг 1 из 2)

**Backend Requirements:**
- POST /api/v1/auth/register
- POST /api/v1/auth/verify-email
- Rate limiting: 5 attempts per hour per IP
- Email service integration (SendGrid/AWS SES)

### 2. Создание и управление профилем ребёнка

**Описание:**
Родитель создаёт профиль ребёнка с контролем доступа.

**Функциональность:**
- Один родитель может создать до 5 профилей детей
- Поля профиля:
  - Имя ребёнка
  - Дата рождения (автоматический расчёт возраста)
  - Фото профиля (опционально)
  - Пол (опционально)
  - Nickname для отображения в приложении
- Генерация уникального QR-кода или invite code для связывания устройства ребёнка
- Настройки для каждого профиля:
  - Уровень модерации (жёсткая/умеренная)
  - Разрешённые типы контента (фото/видео/аудио/текст)
  - Максимальный размер файла
  - Время активности (временные ограничения)

**UI Requirements:**
- Галерея детских профилей (карточки с фото)
- Кнопка "+ Добавить ребёнка"
- Редактирование профиля
- Отображение статуса связи (linked/unlinked)

**Backend Requirements:**
- POST /api/v1/profiles/child
- PUT /api/v1/profiles/child/{id}
- GET /api/v1/profiles/children (список детей родителя)
- DELETE /api/v1/profiles/child/{id}

### 3. Кураторный и безопасный контент

**Описание:**
Предустановленный набор образовательного и развлекательного контента, одобренного модераторами.

**Контент для MVP:**
- 50-100 образовательных видео (детские песни, сказки, уроки)
- 30-50 картинок для раскрашивания
- 20-30 аудиосказок
- Простые обучающие игры (если позволяет бюджет)

**Функциональность:**
- Библиотека контента с категориями (Образование, Развлечения, Творчество)
- Поиск и фильтры (по возрасту, типу)
- Избранное
- История просмотра (для родителя)

**UI Requirements:**
- Главный экран с каруселью популярного контента
- Разделы по категориям
- Детский дружелюбный интерфейс (крупные кнопки, яркие цвета)

**Backend Requirements:**
- GET /api/v1/content/curated
- GET /api/v1/content/{id}
- POST /api/v1/content/{id}/favorite
- CDN для быстрой доставки контента

### 4. Отправка и приём медиа

**Описание:**
Ребёнок может отправлять фото/видео родителю, родитель может отправлять ребёнку.

**Функциональность ребёнка:**
- Съёмка фото через камеру
- Запись короткого видео (до 30 сек в MVP)
- Запись голосового сообщения (до 1 мин)
- Простой текстовый редактор (100 символов)
- Отправка родителю
- Индикатор статуса: "Отправлено" → "На проверке" → "Доставлено" или "Заблокировано"

**Функциональность родителя:**
- Отправка фото/видео ребёнку (без модерации, instant delivery)
- Просмотр входящих медиа от ребёнка
- История переписки
- Возможность скачать медиа

**UI Requirements:**
- Большая кнопка камеры/микрофона
- Превью перед отправкой
- Push notification при новом сообщении
- Галерея сообщений (временная лента)

**Backend Requirements:**
- POST /api/v1/media/upload (с presigned URL для S3)
- GET /api/v1/media/inbox
- GET /api/v1/media/sent
- WebSocket или polling для real-time updates

**Ограничения MVP:**
- Максимальный размер фото: 5 MB
- Максимальный размер видео: 50 MB
- Поддерживаемые форматы: JPEG, PNG, MP4, M4A

### 5. Базовая автоматическая модерация

**Описание:**
ML-based фильтрация контента, отправляемого ребёнком.

**Типы проверок:**

**5.1 Текстовая модерация:**
- Фильтрация оскорблений, угроз, adult keywords
- Используемые инструменты:
  - OpenAI Moderation API (первичная проверка)
  - Собственный словарь на русском (дополнение)
- Категории: hate, self-harm, sexual, violence, profanity

**5.2 Модерация изображений:**
- Обнаружение NSFW контента
- Обнаружение насилия
- Обнаружение hate symbols
- Инструменты:
  - AWS Rekognition Moderation Labels
  - Google Cloud Vision SafeSearch
  - Альтернатива: open-source модель (NSFW Detector)

**5.3 Модерация видео:**
- Покадровый анализ (каждая 2-3 секунда)
- Те же проверки, что и для изображений
- Анализ звуковой дорожки (speech-to-text + текстовая модерация)

**Логика принятия решений:**
```
if confidence_score >= 0.9:
    action = "AUTO_BLOCK"
    notify_parent = True
    add_to_manual_queue = True
elif confidence_score >= 0.5:
    action = "PENDING_MANUAL_REVIEW"
    notify_parent = False
    add_to_manual_queue = True
else:
    action = "APPROVE"
    notify_parent = True
    add_to_manual_queue = False
```

**Backend Requirements:**
- POST /api/v1/moderation/analyze
- Integration с ML APIs
- Хранение moderation logs
- Throughput для MVP: 10 req/sec
- Target latency: < 5 sec для фото, < 30 sec для видео

### 6. Очередь ручной модерации

**Описание:**
Интерфейс для модераторов для проверки контента с неопределённым автоматическим результатом.

**Функциональность:**
- Очередь контента, требующего проверки
- Просмотр медиа в безопасном интерфейсе
- Три действия: Approve / Reject / Escalate
- Причина rejection (выбор из списка + текстовое поле)
- Эскалация к senior модератору
- Статистика модератора (reviewed count, accuracy)

**UI Requirements (Web-based admin panel):**
- Таблица с очередью (thumbnail, type, timestamp, priority)
- Modal для детального просмотра
- Горячие клавиши (A - approve, R - reject, E - escalate)
- Фильтры (priority, type, date)

**Backend Requirements:**
- GET /api/v1/moderation/queue
- POST /api/v1/moderation/{id}/decision
- WebSocket для real-time updates очереди
- Приоритизация: high confidence + recent uploads первыми

**SLA для MVP:**
- 95% контента reviewed < 1 hour
- 99% контента reviewed < 4 hours
- Critical content (high risk score) < 15 minutes

### 7. Родительская панель управления

**Описание:**
Интерфейс для родителя для мониторинга активности ребёнка и управления настройками.

**Функциональность:**
- Dashboard с overview:
  - Сколько медиа отправлено/получено сегодня/неделю
  - Последняя активность ребёнка
  - Статус модерации (сколько на проверке)
- Список всех медиа ребёнка (архив)
- История модерации:
  - Заблокированный контент (с причиной)
  - Возможность appeal (в будущем)
- Настройки:
  - Уровень фильтрации (жёсткий/умеренный)
  - Уведомления (push/email)
  - Время активности ребёнка
  - Экспорт данных
- Семейные настройки:
  - Добавление второго родителя (для будущей версии)

**UI Requirements:**
- Tab navigation (Dashboard, Archive, Settings)
- Charts для статистики (simple bar/line charts)
- Понятные toggle switches для настроек

**Backend Requirements:**
- GET /api/v1/parent/dashboard
- GET /api/v1/parent/media-history
- GET /api/v1/parent/moderation-log
- PUT /api/v1/parent/settings

### 8. Аналитика и логирование

**Описание:**
Tracking пользовательских действий для анализа engagement и улучшения продукта.

**События для tracking:**
- User events:
  - Registration completed
  - Child profile created
  - Media uploaded
  - Media viewed
  - Content from library viewed
  - Settings changed
- System events:
  - Moderation completed
  - Moderation decision (approve/reject)
  - Push notification sent/delivered
  - Error occurred

**Инструменты:**
- Google Analytics / Firebase Analytics (для мобильного приложения)
- Mixpanel или Amplitude (для advanced analytics)
- Custom events tracking

**Метрики для отслеживания:**
- DAU/WAU/MAU
- Retention (D1, D7, D30)
- Upload frequency
- Moderation accuracy (false positive rate)
- Response time
- Crash rate

**Backend Requirements:**
- POST /api/v1/analytics/event
- Integration с analytics platforms
- Privacy compliance: anonymize PII

## User Flows

### Flow 1: Родитель регистрируется и создаёт профиль ребёнка

```
1. Открыть приложение
2. Tap "Начать" → "Я родитель"
3. Ввести email, пароль
4. Tap "Зарегистрироваться"
5. Получить код на email
6. Ввести код верификации
7. Перейти на главный экран
8. Tap "+ Добавить ребёнка"
9. Ввести имя, дату рождения
10. Загрузить фото (опционально)
11. Tap "Создать профиль"
12. Увидеть QR-код для связи с устройством ребёнка
13. Tap "Готово"
```

### Flow 2: Связывание устройства ребёнка

```
1. На устройстве ребёнка: открыть приложение
2. Tap "Я ребёнок"
3. Выбрать способ связи: QR-код или код приглашения
4. Если QR: отсканировать код с устройства родителя
5. Если код: ввести 6-значный код
6. Приложение автоматически связывается с профилем
7. Показать welcome screen с именем ребёнка
8. Tap "Начать"
```

### Flow 3: Ребёнок отправляет фото родителю

```
1. Открыть приложение (устройство ребёнка)
2. Tap кнопку камеры (большая центральная кнопка)
3. Сделать фото или выбрать из галереи
4. Превью фото с опциональным текстом
5. Tap "Отправить маме/папе"
6. Показать индикатор загрузки
7. Показать уведомление "На проверке..."
8. После модерации: "Доставлено!" или "Не удалось отправить"
```

### Flow 4: Родитель получает и просматривает фото

```
1. Получить push notification "Новое фото от [имя ребёнка]"
2. Tap на notification
3. Открыть приложение → вкладка "Сообщения"
4. Увидеть новое фото в ленте
5. Tap на фото для полноэкранного просмотра
6. Опции: скачать, ответить, сердечко
7. Tap сердечко (ребёнок получает notification)
```

### Flow 5: Модератор проверяет контент

```
1. Открыть admin panel
2. Перейти в "Очередь модерации"
3. Увидеть список контента (sorted by priority)
4. Tap на первый элемент
5. Открыть modal с превью контента
6. Посмотреть content + ML scores
7. Принять решение: Approve (A) / Reject (R) / Escalate (E)
8. Если Reject: выбрать причину из dropdown
9. Confirm действие
10. Контент автоматически удаляется из очереди
11. Следующий элемент загружается автоматически
```

## Требования к UI/UX

### Дизайн принципы
1. **Safety First**: всегда напоминать о безопасности и модерации
2. **Simple & Clear**: минималистичный интерфейс, понятный детям и родителям
3. **Playful for Kids**: яркие цвета, анимации, поощрения
4. **Professional for Parents**: чистый дизайн, информативные дашборды
5. **Accessible**: поддержка VoiceOver, Dynamic Type, высокий контраст

### Цветовая схема (предварительная)
- Primary: #4A90E2 (синий, доверие)
- Secondary: #50C878 (зелёный, безопасность)
- Accent: #FFB347 (оранжевый, игривость)
- Error: #E74C3C (красный)
- Background: #F5F5F5 (светло-серый)

### Типографика
- Заголовки: SF Pro Display Bold, 24-32pt
- Основной текст: SF Pro Text Regular, 16-18pt
- Детский интерфейс: более крупные шрифты (18-24pt)

### Иконография
- SF Symbols для iOS нативных иконов
- Собственные иллюстрации для детского интерфейса

### Анимации
- Smooth transitions (0.3s ease)
- Loading indicators
- Success animations (конфетти при доставке сообщения)
- Haptic feedback для важных действий

## Черновой API Contract

### Authentication Endpoints

#### POST /api/v1/auth/register
**Request:**
```json
{
  "email": "parent@example.com",
  "password": "SecureP@ss123",
  "full_name": "Иван Иванов",
  "terms_accepted": true,
  "privacy_accepted": true
}
```

**Response (201 Created):**
```json
{
  "user_id": "usr_abc123",
  "email": "parent@example.com",
  "verification_required": true,
  "message": "Код верификации отправлен на email"
}
```

#### POST /api/v1/auth/verify-email
**Request:**
```json
{
  "user_id": "usr_abc123",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

#### POST /api/v1/auth/login
**Request:**
```json
{
  "email": "parent@example.com",
  "password": "SecureP@ss123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer",
  "user": {
    "id": "usr_abc123",
    "email": "parent@example.com",
    "full_name": "Иван Иванов",
    "role": "parent"
  }
}
```

#### POST /api/v1/auth/refresh
**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900
}
```

### Profile Endpoints

#### POST /api/v1/profiles/child
**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "name": "Маша",
  "date_of_birth": "2018-05-15",
  "gender": "female",
  "nickname": "Mashenka",
  "profile_photo_url": "https://cdn.example.com/photos/child123.jpg",
  "settings": {
    "moderation_level": "strict",
    "allowed_content_types": ["photo", "video", "text"],
    "max_file_size_mb": 50,
    "active_hours": {
      "start": "08:00",
      "end": "20:00"
    }
  }
}
```

**Response (201 Created):**
```json
{
  "id": "child_xyz789",
  "name": "Маша",
  "date_of_birth": "2018-05-15",
  "age": 7,
  "gender": "female",
  "nickname": "Mashenka",
  "profile_photo_url": "https://cdn.example.com/photos/child123.jpg",
  "invite_code": "ABCD1234",
  "qr_code_url": "https://api.example.com/qr/child_xyz789",
  "settings": {
    "moderation_level": "strict",
    "allowed_content_types": ["photo", "video", "text"],
    "max_file_size_mb": 50,
    "active_hours": {
      "start": "08:00",
      "end": "20:00"
    }
  },
  "created_at": "2026-01-02T10:30:00Z",
  "parent_id": "usr_abc123"
}
```

#### GET /api/v1/profiles/children
**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "children": [
    {
      "id": "child_xyz789",
      "name": "Маша",
      "age": 7,
      "nickname": "Mashenka",
      "profile_photo_url": "https://cdn.example.com/photos/child123.jpg",
      "linked": true,
      "last_active": "2026-01-02T09:15:00Z"
    }
  ],
  "total": 1
}
```

### Media Endpoints

#### POST /api/v1/media/upload-request
**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "sender_id": "child_xyz789",
  "recipient_id": "usr_abc123",
  "content_type": "image/jpeg",
  "file_size": 2048000,
  "metadata": {
    "caption": "Смотри, мама!"
  }
}
```

**Response (200 OK):**
```json
{
  "media_id": "media_123abc",
  "upload_url": "https://s3.amazonaws.com/bucket/path?signature=...",
  "expires_in": 300
}
```

#### POST /api/v1/media/upload-complete
**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "media_id": "media_123abc"
}
```

**Response (200 OK):**
```json
{
  "media_id": "media_123abc",
  "status": "processing",
  "message": "Медиа загружено и отправлено на модерацию"
}
```

#### GET /api/v1/media/inbox
**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?limit=20&offset=0&child_id=child_xyz789
```

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "media_123abc",
      "sender_id": "child_xyz789",
      "sender_name": "Маша",
      "sender_photo": "https://cdn.example.com/photos/child123.jpg",
      "type": "photo",
      "url": "https://cdn.example.com/media/media_123abc.jpg",
      "thumbnail_url": "https://cdn.example.com/media/media_123abc_thumb.jpg",
      "caption": "Смотри, мама!",
      "status": "delivered",
      "created_at": "2026-01-02T09:15:00Z",
      "read": false
    }
  ],
  "total": 1,
  "unread_count": 1
}
```

### Moderation Endpoints

#### GET /api/v1/moderation/queue
**Headers:**
```
Authorization: Bearer {moderator_access_token}
```

**Query Parameters:**
```
?limit=50&priority=high&type=photo
```

**Response (200 OK):**
```json
{
  "queue": [
    {
      "id": "mod_queue_001",
      "media_id": "media_456def",
      "type": "photo",
      "thumbnail_url": "https://cdn.example.com/media/media_456def_thumb.jpg",
      "ml_score": 0.65,
      "ml_categories": {
        "explicit": 0.15,
        "violence": 0.65,
        "hate": 0.05
      },
      "priority": "high",
      "created_at": "2026-01-02T09:00:00Z",
      "sender_age": 8
    }
  ],
  "total": 15,
  "average_wait_time_minutes": 12
}
```

#### POST /api/v1/moderation/{id}/decision
**Headers:**
```
Authorization: Bearer {moderator_access_token}
```

**Request:**
```json
{
  "decision": "reject",
  "reason": "violence",
  "notes": "Изображение содержит насилие"
}
```

**Response (200 OK):**
```json
{
  "id": "mod_queue_001",
  "decision": "reject",
  "processed_at": "2026-01-02T09:30:00Z",
  "processed_by": "mod_user_123"
}
```

### Parent Dashboard Endpoints

#### GET /api/v1/parent/dashboard
**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "summary": {
    "children_count": 2,
    "total_media_sent": 156,
    "total_media_received": 203,
    "pending_moderation": 2
  },
  "recent_activity": [
    {
      "child_id": "child_xyz789",
      "child_name": "Маша",
      "last_active": "2026-01-02T09:15:00Z",
      "media_today": 3
    }
  ],
  "moderation_stats": {
    "approved_today": 5,
    "rejected_today": 1,
    "pending": 2
  }
}
```

## Требования к Backend и ML-inference для пилота

### Backend Requirements

**Производительность:**
- Concurrent users: 100-500 families (~1,000 users)
- Peak load: 50 requests/second
- Average API response time: < 200ms (p95)
- WebSocket connections: до 1,000 одновременно

**Availability:**
- Target uptime: 99.5% (43 минуты downtime/месяц допустимо для пилота)
- Scheduled maintenance windows: 1 раз в 2 недели, off-peak hours

**Storage:**
- Media storage: 10 GB - 100 GB (зависит от активности)
- Database: 1-5 GB
- Backup retention: 7 дней

**Scaling:**
- Horizontal scaling готовность (stateless services)
- Auto-scaling настроено на CPU > 70%

**Infrastructure для MVP:**
- Kubernetes cluster: 3-5 nodes (t3.medium или equivalent)
- PostgreSQL: db.t3.small с 20 GB storage
- Redis: cache.t3.micro
- S3 bucket с CloudFront

**Cost estimate для пилота (3 месяца):**
- Infrastructure: $500-1,000/month
- ML APIs: $200-500/month
- Email/SMS: $50-100/month
- **Total:** $2,250-4,800 за 3 месяца

### ML-inference Requirements

**Модели:**
1. **Текстовая модерация:**
   - OpenAI Moderation API (primary)
   - Fallback: собственная модель на базе BERT
   - Языки: русский, английский

2. **Модерация изображений:**
   - AWS Rekognition Moderation (primary)
   - Fallback: Google Cloud Vision SafeSearch
   - Дополнительно: собственная модель для edge cases

3. **Модерация видео:**
   - Покадровый анализ с AWS Rekognition
   - Аудио через speech-to-text (AWS Transcribe) + текстовая модерация

**Throughput:**
- Фото: 10-20 изображений/минуту
- Видео: 5-10 видео/минуту (до 30 сек каждое)
- Текст: 50-100 запросов/минуту

**Latency targets:**
- Фото: < 3 seconds
- Видео: < 30 seconds
- Текст: < 1 second

**Accuracy targets (для пилота):**
- True Positive Rate (правильно заблокированный плохой контент): > 95%
- False Positive Rate (неправильно заблокированный хороший контент): < 5%
- Human review для edge cases (0.5 < score < 0.9): ~20% от всего контента

**Feedback loop:**
- Решения ручных модераторов логируются
- Периодическое переобучение моделей (после пилота)
- A/B тестирование новых моделей

**Fallback механизмы:**
- Если ML API недоступен: автоматически отправлять в ручную модерацию
- Если ручная модерация перегружена: delay delivery с уведомлением

## Исключённые из MVP (для будущих версий)

1. Android приложение
2. Групповые чаты / семейные группы
3. Видеозвонки
4. Расширенные игры и активности
5. Интеграции с образовательными платформами
6. Мультиязычность (только русский в MVP)
7. Экспорт данных в PDF/CSV
8. Advanced analytics dashboard
9. Родительское сообщество/форум
10. Marketplace контента от третьих сторон

## Критерии успеха MVP

**Технические:**
- ✅ 95% uptime за период пилота
- ✅ < 3 sec модерация фото
- ✅ < 30 sec модерация видео
- ✅ < 5% false positive rate
- ✅ Нет critical security incidents

**Продуктовые:**
- ✅ 50+ семей активных пользователей
- ✅ 70% D7 retention
- ✅ 50% D30 retention
- ✅ 5+ медиа загружено за семью в неделю
- ✅ NPS > 40

**Бизнес:**
- ✅ Валидация demand (waitlist для production)
- ✅ Положительные отзывы от родителей (4+ stars)
- ✅ Партнёрство с 1-2 школами или НКО
- ✅ Интерес от инвесторов (5+ meetings)

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
