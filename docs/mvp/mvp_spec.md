# MVP спецификация Rork-Kiku

## Обзор MVP

MVP (Minimum Viable Product) для платформы Rork-Kiku ориентирован на пилотное тестирование через iOS TestFlight с ограниченной группой пользователей (50-100 семей).

## Цели MVP

1. Валидировать основную гипотезу: родители нуждаются в безопасной платформе для семейного обмена медиа
2. Протестировать ML-систему модерации в реальных условиях
3. Собрать feedback от пользователей для итерации продукта
4. Продемонстрировать работающий прототип инвесторам

## Критичные функции для MVP

### 1. Регистрация и аутентификация (Обязательно)

#### Родитель
- ✅ Регистрация через Apple ID (Sign in with Apple)
- ✅ Регистрация через Google Account
- ✅ Регистрация через email + пароль
- ✅ Верификация email
- ✅ Двухфакторная аутентификация (опционально для пользователя)

#### Профиль родителя
- Имя, фамилия
- Email (обязательный)
- Фото профиля (опционально)
- Настройки приватности

### 2. Управление детьми (Обязательно)

#### Создание профиля ребёнка
- Имя ребёнка
- Дата рождения (для расчёта возраста)
- Фото профиля (опционально)
- Связь с родителем

#### Parental consent
- Согласие на обработку данных ребёнка (COPPA/GDPR)
- Подтверждение родительского статуса:
  - ~~Document verification (не в MVP)~~
  - ~~Payment microtransaction (не в MVP)~~
  - Email confirmation (MVP)

#### Ограничения MVP
- Максимум 3 профиля детей на родителя
- Возраст детей: 4-12 лет

### 3. Семейная группа (Обязательно)

#### Создание семейной группы
- Автоматическое создание при регистрации первого родителя
- Приглашение второго родителя через email
- Общая семейная лента для родителей и детей

#### Управление группой
- Добавление/удаление детей
- Изменение настроек модерации
- Просмотр активности

### 4. Загрузка медиа (Обязательно)

#### Поддерживаемые форматы
- **Фото**: JPEG, PNG, HEIC (до 10 MB)
- **Видео**: MP4, MOV (до 100 MB, максимум 60 секунд)

#### Процесс загрузки
1. Выбор медиа из галереи или камера
2. Добавление описания (опционально, до 500 символов)
3. Выбор получателей (вся семья или конкретные дети)
4. Загрузка на сервер
5. Автоматическая модерация
6. Публикация в ленте (если контент безопасен)

#### Метаданные
- Дата и время загрузки
- Автор (родитель или ребёнок)
- Геолокация (если разрешено, stripped в MVP)
- Теги (автоматические от ML)

### 5. Автоматическая модерация (Обязательно)

#### ML-модель
- Pre-trained модель (fine-tuned на семейном контенте)
- Детекция небезопасного контента:
  - Насилие
  - Обнажённое тело
  - Оружие
  - Наркотики
  - Hate symbols
- Confidence score (0-1)

#### Правила модерации
- **Автоматический approve**: confidence > 0.8
- **Ручная модерация**: 0.5 <= confidence <= 0.8
- **Автоматический reject**: confidence < 0.5

#### Уведомления
- Push-уведомление о статусе модерации
- Объяснение причины reject (общее, не детальное)

### 6. Ручная модерация (Обязательно для MVP)

#### Очередь модерации
- Список контента, требующего ручной проверки
- Сортировка по времени загрузки
- Фильтры по типу контента

#### Интерфейс модератора
- Просмотр медиа и метаданных
- Контекст (автор, семья, описание)
- Действия: Approve, Reject, Escalate
- Добавление комментариев для team

#### SLA модерации
- Ответ в течение 4 часов (working hours)
- Escalation через 24 часа

### 7. Семейная лента (Обязательно)

#### Отображение контента
- Хронологическая сортировка (новые сверху)
- Thumbnails для фото, play button для видео
- Автор и время публикации
- Описание и теги

#### Взаимодействие
- Просмотр полноразмерного медиа
- ~~Лайки (не в MVP)~~
- ~~Комментарии (не в MVP)~~
- Удаление собственного контента

#### Фильтрация
- Все медиа
- Только фото
- Только видео
- По автору (конкретный ребёнок/родитель)

### 8. Настройки модерации (Обязательно)

#### Уровни фильтрации
- **Строгая**: Максимальная фильтрация (низкий threshold)
- **Умеренная**: Сбалансированная (средний threshold) — по умолчанию
- **Мягкая**: Минимальная фильтрация (высокий threshold)

#### Настройки на уровне семьи
- Единые настройки для всей семьи
- Изменение только родителями

### 9. Push-уведомления (Обязательно)

#### События
- Новое медиа в семейной ленте
- Контент прошёл модерацию
- Контент отклонён модерацией
- Новое приглашение в семью

#### Настройки
- Включение/выключение уведомлений
- Настройка по типам событий

### 10. Профили и настройки (Обязательно)

#### Редактирование профиля
- Изменение имени, фото
- Изменение email (с подтверждением)
- Изменение пароля
- Удаление аккаунта

#### Настройки приватности
- Видимость профиля (только семья)
- Сохранение геолокации (отключено по умолчанию в MVP)

## Некритичные функции (не в MVP)

❌ Лайки и комментарии  
❌ Приватные сообщения  
❌ Альбомы и коллекции  
❌ Расширенная аналитика для родителей  
❌ Экспорт данных  
❌ Android приложение (только iOS в MVP)  
❌ Web-приложение (только мобильное в MVP)  
❌ Интеграция с социальными сетями  
❌ Монетизация (бесплатно в MVP)  

## User Flows

### Flow 1: Регистрация родителя и создание первого профиля ребёнка

1. Пользователь открывает приложение
2. Экран Welcome с кнопками "Sign in with Apple", "Sign in with Google", "Sign up with Email"
3. Пользователь выбирает метод аутентификации
4. OAuth flow или регистрация с email/паролем
5. Верификация email (если email регистрация)
6. Экран onboarding: "Создайте профиль первого ребёнка"
7. Ввод имени и даты рождения ребёнка
8. Подтверждение родительского согласия (COPPA/GDPR)
9. Автоматическое создание семейной группы
10. Переход на главный экран (семейная лента)

**Время**: ~3-5 минут

### Flow 2: Загрузка и модерация фото

1. Пользователь на главном экране нажимает кнопку "Добавить фото"
2. Выбор источника: Камера или Галерея
3. Выбор фото из галереи
4. Экран предпросмотра с полем для описания
5. Выбор получателей (вся семья по умолчанию)
6. Нажатие "Загрузить"
7. Прогресс-бар загрузки
8. После загрузки: "Фото отправлено на модерацию"
9. ML-анализ (асинхронно)
10a. Если approved: Push-уведомление "Фото опубликовано", появление в ленте
10b. Если на ручной модерации: Push-уведомление "Фото проверяется"
10c. Если rejected: Push-уведомление "Фото отклонено" с общей причиной

**Время**: 
- Загрузка: ~30 секунд
- ML-анализ: ~2-5 секунд
- Ручная модерация: до 4 часов

### Flow 3: Приглашение второго родителя

1. Родитель на экране профиля нажимает "Настройки семьи"
2. Раздел "Члены семьи"
3. Кнопка "Пригласить родителя"
4. Ввод email второго родителя
5. Отправка приглашения
6. Второй родитель получает email с ссылкой
7. Переход по ссылке, регистрация/логин
8. Автоматическое добавление в семейную группу
9. Доступ к общей семейной ленте

**Время**: ~5-10 минут (для обоих родителей)

### Flow 4: Изменение настроек модерации

1. Родитель на экране профиля нажимает "Настройки модерации"
2. Выбор уровня фильтрации: Строгая/Умеренная/Мягкая
3. Просмотр описания каждого уровня
4. Выбор уровня и сохранение
5. Подтверждающее сообщение "Настройки обновлены"

**Время**: ~1 минута

## Черновой API Contract

### Base URL
```
https://api.rork-kiku.com/v1
```

### Authentication
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### 1. Auth

##### POST /auth/register
Регистрация нового пользователя

**Request**:
```json
{
  "email": "parent@example.com",
  "password": "SecurePassword123!",
  "firstName": "Иван",
  "lastName": "Петров",
  "agreeToTerms": true
}
```

**Response** (201):
```json
{
  "userId": "user-123",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

##### POST /auth/login
Вход в систему

**Request**:
```json
{
  "email": "parent@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "userId": "user-123",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

##### POST /auth/refresh
Обновление access token

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

##### POST /auth/oauth/google
OAuth вход через Google

**Request**:
```json
{
  "idToken": "google-id-token",
  "provider": "google"
}
```

**Response** (200): Same as /auth/login

##### POST /auth/oauth/apple
OAuth вход через Apple

**Request**:
```json
{
  "identityToken": "apple-identity-token",
  "authorizationCode": "apple-auth-code",
  "provider": "apple"
}
```

**Response** (200): Same as /auth/login

#### 2. Users

##### GET /users/me
Получение профиля текущего пользователя

**Response** (200):
```json
{
  "userId": "user-123",
  "email": "parent@example.com",
  "firstName": "Иван",
  "lastName": "Петров",
  "profilePicture": "https://cdn.rork-kiku.com/users/user-123/profile.jpg",
  "role": "parent",
  "familyId": "family-456",
  "createdAt": "2026-01-02T09:15:00Z"
}
```

##### PATCH /users/me
Обновление профиля

**Request**:
```json
{
  "firstName": "Иван",
  "lastName": "Петров",
  "profilePicture": "https://cdn.rork-kiku.com/users/user-123/new-profile.jpg"
}
```

**Response** (200): Updated user object

##### DELETE /users/me
Удаление аккаунта

**Response** (204): No content

#### 3. Children

##### POST /children
Создание профиля ребёнка

**Request**:
```json
{
  "firstName": "Маша",
  "dateOfBirth": "2018-05-15",
  "profilePicture": "https://cdn.rork-kiku.com/children/child-789/profile.jpg",
  "parentalConsent": true
}
```

**Response** (201):
```json
{
  "childId": "child-789",
  "firstName": "Маша",
  "dateOfBirth": "2018-05-15",
  "age": 7,
  "profilePicture": "https://cdn.rork-kiku.com/children/child-789/profile.jpg",
  "familyId": "family-456",
  "createdAt": "2026-01-02T09:15:00Z"
}
```

##### GET /children
Список детей в семье

**Response** (200):
```json
{
  "children": [
    {
      "childId": "child-789",
      "firstName": "Маша",
      "age": 7,
      "profilePicture": "https://cdn.rork-kiku.com/children/child-789/profile.jpg"
    }
  ]
}
```

##### PATCH /children/:childId
Обновление профиля ребёнка

**Request**:
```json
{
  "firstName": "Маша",
  "profilePicture": "https://cdn.rork-kiku.com/children/child-789/new-profile.jpg"
}
```

**Response** (200): Updated child object

##### DELETE /children/:childId
Удаление профиля ребёнка

**Response** (204): No content

#### 4. Media

##### POST /media/upload
Загрузка медиа-файла

**Request** (multipart/form-data):
```
file: <binary>
description: "День рождения Маши"
recipients: ["child-789"]
```

**Response** (202):
```json
{
  "mediaId": "media-101",
  "status": "pending_moderation",
  "uploadUrl": "https://cdn.rork-kiku.com/media/media-101/original.jpg",
  "thumbnailUrl": "https://cdn.rork-kiku.com/media/media-101/thumb.jpg",
  "createdAt": "2026-01-02T09:20:00Z"
}
```

##### GET /media
Список медиа в семейной ленте

**Query Parameters**:
- `page`: int (default: 1)
- `limit`: int (default: 20, max: 100)
- `type`: "photo" | "video" | "all" (default: "all")
- `authorId`: string (optional)

**Response** (200):
```json
{
  "media": [
    {
      "mediaId": "media-101",
      "type": "photo",
      "url": "https://cdn.rork-kiku.com/media/media-101/original.jpg",
      "thumbnailUrl": "https://cdn.rork-kiku.com/media/media-101/thumb.jpg",
      "description": "День рождения Маши",
      "authorId": "user-123",
      "authorName": "Иван Петров",
      "status": "approved",
      "createdAt": "2026-01-02T09:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

##### GET /media/:mediaId
Получение деталей медиа

**Response** (200):
```json
{
  "mediaId": "media-101",
  "type": "photo",
  "url": "https://cdn.rork-kiku.com/media/media-101/original.jpg",
  "thumbnailUrl": "https://cdn.rork-kiku.com/media/media-101/thumb.jpg",
  "description": "День рождения Маши",
  "authorId": "user-123",
  "authorName": "Иван Петров",
  "recipients": ["child-789"],
  "status": "approved",
  "moderationScore": 0.92,
  "tags": ["family", "birthday", "indoor"],
  "createdAt": "2026-01-02T09:20:00Z",
  "moderatedAt": "2026-01-02T09:20:05Z"
}
```

##### DELETE /media/:mediaId
Удаление медиа

**Response** (204): No content

#### 5. Families

##### GET /families/me
Получение информации о семье

**Response** (200):
```json
{
  "familyId": "family-456",
  "name": "Семья Петровых",
  "members": [
    {
      "userId": "user-123",
      "firstName": "Иван",
      "lastName": "Петров",
      "role": "parent"
    }
  ],
  "children": [
    {
      "childId": "child-789",
      "firstName": "Маша",
      "age": 7
    }
  ],
  "moderationLevel": "moderate",
  "createdAt": "2026-01-02T09:00:00Z"
}
```

##### PATCH /families/me
Обновление настроек семьи

**Request**:
```json
{
  "name": "Семья Петровых",
  "moderationLevel": "strict"
}
```

**Response** (200): Updated family object

##### POST /families/invite
Приглашение члена семьи

**Request**:
```json
{
  "email": "parent2@example.com",
  "role": "parent"
}
```

**Response** (200):
```json
{
  "inviteId": "invite-111",
  "email": "parent2@example.com",
  "status": "pending",
  "expiresAt": "2026-01-09T09:00:00Z"
}
```

#### 6. Moderation (Internal/Admin)

##### GET /moderation/queue
Получение очереди модерации

**Query Parameters**:
- `page`: int
- `limit`: int
- `status`: "pending" | "approved" | "rejected"

**Response** (200):
```json
{
  "items": [
    {
      "mediaId": "media-102",
      "type": "photo",
      "url": "https://cdn.rork-kiku.com/media/media-102/original.jpg",
      "thumbnailUrl": "https://cdn.rork-kiku.com/media/media-102/thumb.jpg",
      "authorId": "user-123",
      "familyId": "family-456",
      "mlScore": 0.65,
      "mlTags": ["unclear", "outdoor"],
      "createdAt": "2026-01-02T09:25:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

##### POST /moderation/:mediaId/decision
Принятие решения модератором

**Request**:
```json
{
  "decision": "approved",
  "comment": "Безопасный семейный контент",
  "moderatorId": "mod-222"
}
```

**Response** (200):
```json
{
  "mediaId": "media-102",
  "status": "approved",
  "moderatedAt": "2026-01-02T10:00:00Z",
  "moderatorId": "mod-222"
}
```

#### 7. Notifications

##### GET /notifications
Список уведомлений

**Response** (200):
```json
{
  "notifications": [
    {
      "notificationId": "notif-333",
      "type": "media_approved",
      "title": "Фото опубликовано",
      "body": "Ваше фото прошло модерацию и опубликовано в семейной ленте",
      "data": {
        "mediaId": "media-101"
      },
      "read": false,
      "createdAt": "2026-01-02T09:20:10Z"
    }
  ]
}
```

##### PATCH /notifications/:notificationId/read
Пометить уведомление прочитанным

**Response** (200): Updated notification object

## Требования к Backend

### Performance

#### Throughput
- API Gateway: 1000 requests/sec (burst: 2000 req/sec)
- Media Upload: 100 concurrent uploads
- Media Download: 500 concurrent downloads
- Database: 5000 queries/sec

#### Latency
- API response time (p95): < 200ms
- Media upload (p95): < 5s for 10MB file
- ML inference (p95): < 500ms
- Database query (p95): < 50ms

### Storage

#### Media Storage
- Expected: 10 GB/family/month (MVP pilot)
- Total MVP: 50 families × 3 months × 10 GB = 1.5 TB
- Storage tier: Standard S3 (hot access)

#### Database
- PostgreSQL: 50 GB for MVP
- Redis cache: 8 GB RAM
- Backups: Daily, retention 30 days

### Scaling

#### Horizontal Scaling
- API services: Auto-scaling 2-10 instances
- ML inference: 2-4 GPU instances
- Database: Primary + 1 read replica

#### Vertical Scaling
- API services: 2 vCPU, 4 GB RAM per instance
- ML inference: NVIDIA T4 GPU, 16 GB RAM
- Database: 4 vCPU, 16 GB RAM, 100 GB SSD

## Требования к ML Inference

### Model Performance
- **Accuracy**: > 95%
- **False positive rate**: < 5% (важно для UX)
- **False negative rate**: < 2% (критично для безопасности)
- **Inference latency**: < 500ms (p95)
- **Throughput**: 100 images/sec per GPU instance

### Model Architecture
- Pre-trained: ResNet50, EfficientNet, или CLIP
- Fine-tuning на датасете семейного контента
- Multi-task learning: classification + object detection

### Deployment
- TorchServe или TensorFlow Serving
- GPU instances: NVIDIA T4 (AWS g4dn.xlarge)
- Auto-scaling на основе queue depth
- A/B testing новых версий моделей

### Monitoring
- Inference latency tracking
- Model drift detection
- False positive/negative rates
- Re-training triggers

## Чек-листы

### Чек-лист разработки

#### Backend
- [ ] Setup Kubernetes cluster (dev/staging)
- [ ] Deploy PostgreSQL с репликацией
- [ ] Deploy Redis для кэширования
- [ ] Setup S3 bucket для медиа
- [ ] Implement Auth Service (OAuth + JWT)
- [ ] Implement User Service
- [ ] Implement Media Service
- [ ] Implement Moderation Service
- [ ] Implement Notification Service (FCM/APNS)
- [ ] Setup message queue (RabbitMQ/SQS)
- [ ] Deploy ML inference service
- [ ] Integrate ML модель
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Setup logging (ELK/Loki)
- [ ] Setup CI/CD pipeline
- [ ] Write API documentation (Swagger/OpenAPI)
- [ ] Load testing (k6, JMeter)
- [ ] Security audit (OWASP, penetration testing)

#### iOS App
- [ ] Project setup (Xcode, Swift)
- [ ] Setup networking layer (URLSession, tRPC client)
- [ ] Implement authentication screens
- [ ] Implement OAuth flows (Apple, Google)
- [ ] Implement onboarding flow
- [ ] Implement child profile creation
- [ ] Implement family feed (lazy loading)
- [ ] Implement media upload (camera, gallery)
- [ ] Implement media viewer
- [ ] Implement settings screens
- [ ] Implement push notifications
- [ ] Implement secure storage (Keychain)
- [ ] Add error handling и retry logic
- [ ] Add loading states и placeholders
- [ ] Accessibility support (VoiceOver)
- [ ] Localization (русский язык)
- [ ] Unit tests (critical flows)
- [ ] UI tests (smoke tests)
- [ ] TestFlight setup
- [ ] App Store metadata

#### ML
- [ ] Dataset collection и annotation
- [ ] Data augmentation pipeline
- [ ] Model training (baseline)
- [ ] Model evaluation (accuracy, F1, confusion matrix)
- [ ] Hyperparameter tuning
- [ ] Model optimization (quantization, pruning)
- [ ] Export model для production
- [ ] Setup inference service
- [ ] Integration testing с backend
- [ ] Load testing inference service
- [ ] A/B testing framework
- [ ] Monitoring dashboard

### Чек-лист запуска MVP

#### Pre-launch
- [ ] All critical features implemented
- [ ] Backend deployed на staging
- [ ] iOS app submitted to TestFlight
- [ ] Load testing passed
- [ ] Security audit completed
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] COPPA compliance verified
- [ ] GDPR compliance verified
- [ ] Monitoring и alerting configured
- [ ] On-call rotation setup
- [ ] Incident response playbook ready

#### Launch
- [ ] TestFlight build approved
- [ ] Invite 50 beta testers (родители)
- [ ] Onboarding email sent
- [ ] Monitoring dashboard active
- [ ] Support channel ready (email/Slack)
- [ ] Collect initial feedback
- [ ] Daily standups для bug fixes

#### Post-launch
- [ ] Monitor KPIs (DAU, uploads, retention)
- [ ] Collect user feedback
- [ ] Weekly iteration meetings
- [ ] Bug fixes prioritization
- [ ] Feature requests backlog
- [ ] Prepare for seed pitch

## Критерии успеха MVP

1. **Технические**:
   - 99% uptime за период пилота
   - < 500ms median API latency
   - ML accuracy > 95%
   - < 5% false positive rate

2. **Пользовательские**:
   - 50+ активных семей
   - 70%+ retention после 4 недель
   - 100+ загруженных медиа в неделю
   - NPS > 30

3. **Бизнес**:
   - Положительный feedback от 80%+ пользователей
   - 2-3 partnership запроса от школ/НКО
   - Готовность к seed pitch

---

**Дата создания**: 2026-01-02  
**Версия документа**: 1.0 (Draft)  
**Автор**: Команда Rork-Kiku  
**Контакт**: [FOUNDERS_EMAIL]

**ВНИМАНИЕ**: Это черновой документ для внутреннего использования и инвесторов. Не содержит production-кода или секретов.
