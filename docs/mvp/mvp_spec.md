# MVP Спецификация для TestFlight пилота

## Обзор MVP

Минимально жизнеспособный продукт (MVP) для TestFlight — это функциональное iOS приложение для мониторинга детских чатов с базовыми возможностями AI-анализа и родительского контроля. Цель: валидация гипотезы и сбор обратной связи от родителей перед полноценным запуском.

## Scope MVP (что включено)

### Основные функции

✅ **Мониторинг чатов:**
- Просмотр списка чатов с индикаторами риска
- Детальный просмотр сообщений в чате
- Поиск по участникам чата
- Фильтрация по уровню риска

✅ **AI-анализ сообщений:**
- Анализ текстовых сообщений на угрозы
- 5-уровневая система оценки рисков (0-4)
- Категории рисков: bullying, violence, sexual, fraud, self-harm
- Объяснение причины risk score

✅ **Система уведомлений:**
- Активные тревоги (alerts)
- История решенных тревог
- Возможность отметить тревогу как "решенную"
- Фильтрация по статусу (active/resolved/all)

✅ **Родительский контроль:**
- Временные ограничения (по дням недели)
- Лимиты экранного времени
- Белый список контактов
- Блокировка неизвестных собеседников
- Email-уведомления для родителей

✅ **SOS функция:**
- Кнопка экстренного вызова
- Отправка геолокации родителям
- Email и push уведомления

✅ **Статистика:**
- Общее количество чатов, сообщений, тревог
- Распределение по уровням риска
- Прогресс решения тревог

✅ **Профили пользователей:**
- Роли: родитель и ребенок
- Создание и редактирование профиля
- Выход из системы

### Технические возможности MVP

✅ **Локальное хранилище:**
- AsyncStorage для данных (offline-first)
- Шифрование данных на устройстве
- Нет зависимости от backend для базовых функций

✅ **AI интеграция:**
- Интеграция с LLM API (OpenAI/Anthropic/etc.)
- Structured output с Zod схемами
- Кэширование результатов анализа

✅ **iOS-specific:**
- Expo Location для геолокации
- Haptic feedback для важных действий
- Push notifications (опционально через Expo)

## Out of Scope (что НЕ включено в MVP)

❌ **Backend:**
- Нет серверной части
- Нет синхронизации между устройствами
- Нет облачного хранилища

❌ **Дополнительные функции:**
- Анализ изображений (только текст в MVP)
- Анализ аудио/голосовых сообщений
- Групповые чаты (только 1-на-1 чаты)
- Мультиязычность (только русский)

❌ **Advanced features:**
- Машинное обучение на устройстве
- Оффлайн AI анализ
- Интеграция с реальными мессенджерами (WhatsApp, Telegram)

❌ **Административные функции:**
- Ручная модерация
- Dashboard для модераторов
- Аналитика для команды

## User Flows

### Flow 1: Родитель настраивает мониторинг

```
1. Родитель скачивает приложение из TestFlight
   ↓
2. Открывает приложение → Onboarding screen
   ↓
3. Создает профиль родителя (имя, email)
   ↓
4. Добавляет профиль ребенка (имя, возраст)
   ↓
5. Переходит в "Родительский контроль"
   ↓
6. Настраивает:
   - Временные ограничения (например, 18:00-20:00)
   - Email для уведомлений
   - Включает AI анализ
   ↓
7. Готово! Система начинает мониторинг
```

### Flow 2: Ребенок использует приложение

```
1. Ребенок открывает приложение
   ↓
2. Видит список своих чатов
   ↓
3. Открывает чат с другом
   ↓
4. Пишет сообщение → отправляет
   ↓
5. Приложение отправляет сообщение на AI анализ
   ↓
6. AI возвращает результат (например, "safe")
   ↓
7. Сообщение помечается как "проанализировано"
   ↓
8. Если риск >= MEDIUM:
   - Создается alert
   - Родитель получает push notification
```

### Flow 3: Родитель получает тревогу

```
1. Приложение обнаруживает сообщение с HIGH risk
   ↓
2. Создается alert
   ↓
3. Родитель получает push notification
   ↓
4. Родитель открывает приложение → вкладка "Уведомления"
   ↓
5. Видит новую тревогу:
   - Уровень риска: HIGH
   - Категория: bullying
   - Текст сообщения
   - Объяснение AI
   ↓
6. Родитель:
   - Читает сообщение
   - Принимает решение (поговорить с ребенком, обратиться в школу)
   - Нажимает "Отметить решенным"
   ↓
7. Alert перемещается в "Решенные"
```

### Flow 4: Экстренный SOS

```
1. Ребенок чувствует опасность
   ↓
2. Открывает чат в приложении
   ↓
3. Нажимает кнопку SOS в header
   ↓
4. Приложение:
   - Запрашивает геолокацию
   - Создает SOS alert
   - Показывает подтверждение
   ↓
5. Родитель получает:
   - Push notification
   - Email с геолокацией
   ↓
6. Родитель видит SOS alert в "Родительский контроль"
   ↓
7. Родитель принимает меры (звонок, поездка к ребенку)
```

## API Contract (для будущего backend)

### Текущая реализация MVP: Mock API

В MVP используется локальное хранилище (AsyncStorage) и mock данные. Но мы проектируем API contract для будущей интеграции с backend.

### Endpoints (черновик)

#### Authentication

```http
POST /api/v1/auth/register
Content-Type: application/json

Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "role": "parent",
  "name": "Иван Петров"
}

Response: 201 Created
{
  "userId": "user_abc123",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_xyz789",
  "expiresIn": 900
}
```

```http
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "userId": "user_abc123",
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

#### Users & Profiles

```http
GET /api/v1/users/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "userId": "user_abc123",
  "email": "parent@example.com",
  "name": "Иван Петров",
  "role": "parent",
  "children": [
    {
      "childId": "child_def456",
      "name": "Маша Петрова",
      "age": 10,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

```http
POST /api/v1/users/me/children
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "name": "Маша Петрова",
  "age": 10
}

Response: 201 Created
{
  "childId": "child_def456",
  "name": "Маша Петрова",
  "age": 10,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

#### Chats & Messages

```http
GET /api/v1/chats
Authorization: Bearer {accessToken}
Query params: ?childId=child_def456

Response: 200 OK
{
  "chats": [
    {
      "chatId": "chat_ghi789",
      "participants": ["Маша", "Катя"],
      "lastMessage": "Привет, как дела?",
      "lastMessageTime": "2024-01-01T15:30:00Z",
      "riskLevel": 0,
      "messageCount": 42,
      "unreadAlerts": 0
    }
  ],
  "total": 5
}
```

```http
GET /api/v1/chats/:chatId/messages
Authorization: Bearer {accessToken}
Query params: ?limit=50&offset=0

Response: 200 OK
{
  "messages": [
    {
      "messageId": "msg_jkl012",
      "chatId": "chat_ghi789",
      "author": "Маша",
      "text": "Привет!",
      "timestamp": "2024-01-01T15:30:00Z",
      "analyzed": true,
      "analysisResult": {
        "riskLevel": 0,
        "categories": [],
        "explanation": "Безопасное сообщение"
      }
    }
  ],
  "total": 42,
  "hasMore": false
}
```

```http
POST /api/v1/chats/:chatId/messages
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "text": "Привет, как дела?",
  "authorId": "child_def456",
  "timestamp": "2024-01-01T15:30:00Z"
}

Response: 201 Created
{
  "messageId": "msg_jkl012",
  "chatId": "chat_ghi789",
  "text": "Привет, как дела?",
  "status": "pending_analysis"
}
```

#### AI Analysis (internal service)

```http
POST /api/v1/analysis/text
Authorization: Bearer {serviceToken}
Content-Type: application/json

Request:
{
  "messageId": "msg_jkl012",
  "text": "Ты тупая, никто тебя не любит",
  "context": {
    "previousMessages": ["..."]
  }
}

Response: 200 OK
{
  "messageId": "msg_jkl012",
  "riskLevel": 3,
  "categories": ["bullying", "emotional_abuse"],
  "explanation": "Сообщение содержит оскорбления и признаки кибербуллинга",
  "confidence": 0.92,
  "analyzedAt": "2024-01-01T15:30:05Z"
}
```

#### Alerts

```http
GET /api/v1/alerts
Authorization: Bearer {accessToken}
Query params: ?status=active&childId=child_def456

Response: 200 OK
{
  "alerts": [
    {
      "alertId": "alert_mno345",
      "childId": "child_def456",
      "chatId": "chat_ghi789",
      "messageId": "msg_jkl012",
      "riskLevel": 3,
      "categories": ["bullying"],
      "message": "Ты тупая, никто тебя не любит",
      "explanation": "Кибербуллинг обнаружен",
      "status": "active",
      "createdAt": "2024-01-01T15:30:05Z",
      "resolvedAt": null
    }
  ],
  "total": 1
}
```

```http
PUT /api/v1/alerts/:alertId/resolve
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "notes": "Поговорил с ребенком, ситуация разрешена"
}

Response: 200 OK
{
  "alertId": "alert_mno345",
  "status": "resolved",
  "resolvedAt": "2024-01-01T16:00:00Z",
  "resolvedBy": "user_abc123"
}
```

#### SOS Alerts

```http
POST /api/v1/sos-alerts
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "childId": "child_def456",
  "location": {
    "latitude": 55.7558,
    "longitude": 37.6173
  },
  "timestamp": "2024-01-01T17:00:00Z",
  "context": "Emergency button pressed"
}

Response: 201 Created
{
  "sosAlertId": "sos_pqr678",
  "childId": "child_def456",
  "status": "active",
  "location": {...},
  "createdAt": "2024-01-01T17:00:00Z"
}
```

```http
GET /api/v1/sos-alerts
Authorization: Bearer {accessToken}
Query params: ?status=active

Response: 200 OK
{
  "sosAlerts": [
    {
      "sosAlertId": "sos_pqr678",
      "childId": "child_def456",
      "childName": "Маша Петрова",
      "location": {...},
      "timestamp": "2024-01-01T17:00:00Z",
      "status": "active"
    }
  ]
}
```

#### Parental Controls

```http
GET /api/v1/parental-controls
Authorization: Bearer {accessToken}
Query params: ?childId=child_def456

Response: 200 OK
{
  "childId": "child_def456",
  "settings": {
    "enabled": true,
    "aiAnalysisEnabled": true,
    "timeRestrictions": [
      {
        "day": "monday",
        "startTime": "18:00",
        "endTime": "20:00"
      }
    ],
    "dailyLimitMinutes": 120,
    "blockUnknown": true,
    "whitelistOnly": false
  },
  "guardianEmails": ["parent@example.com"],
  "contacts": [
    {
      "contactId": "contact_stu901",
      "name": "Катя",
      "approved": true
    }
  ]
}
```

```http
PUT /api/v1/parental-controls
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "childId": "child_def456",
  "settings": {
    "enabled": true,
    "aiAnalysisEnabled": true,
    "dailyLimitMinutes": 90
  }
}

Response: 200 OK
{
  "message": "Settings updated successfully",
  "updatedAt": "2024-01-01T18:00:00Z"
}
```

## Требования к backend для MVP

### Минимальные требования

1. **Authentication:**
   - OAuth2 + JWT
   - Refresh token rotation
   - Secure password hashing (bcrypt/argon2)

2. **Database:**
   - PostgreSQL для structured data
   - Read replicas для масштабируемости
   - Backup и recovery

3. **AI Service:**
   - Интеграция с LLM API (OpenAI, Anthropic, или self-hosted)
   - Queue для асинхронной обработки (RabbitMQ/SQS)
   - Retry logic и error handling

4. **Notifications:**
   - Push notifications (Expo Push API или FCM)
   - Email notifications (SendGrid/AWS SES)
   - Webhook для SOS alerts

5. **Security:**
   - HTTPS only (TLS 1.3)
   - Rate limiting (по IP и userId)
   - Input validation и sanitization
   - CORS правильно настроен

### Performance требования

- **API response time:** p95 < 500ms
- **AI analysis latency:** p95 < 3s
- **WebSocket latency:** < 200ms
- **Uptime:** 99.9% (43 минуты downtime/месяц)

### Масштабируемость

- **Users:** 100-500 пользователей в пилоте
- **Messages/day:** ~10,000 (20 messages/user/day)
- **AI requests/day:** ~10,000 (анализ каждого сообщения)

## ML/AI требования для пилота

### Text Analysis Model

**Вариант 1: Cloud API (рекомендуется для MVP)**
- OpenAI GPT-4 или Anthropic Claude
- Structured output с JSON schema
- Prompt engineering для детектирования рисков

**Вариант 2: Self-hosted (для production)**
- Fine-tuned LLaMA 3 или Mixtral
- Hosted на GPU instances (AWS/GCP)
- Lower cost per request, higher latency

**Prompt template:**
```
Analyze this message from a child's chat for safety risks:

Message: "{text}"
Context: Previous messages in chat...

Evaluate for:
1. Bullying/harassment
2. Sexual content
3. Violence/threats
4. Fraud/scams
5. Self-harm indicators

Return JSON:
{
  "riskLevel": 0-4,
  "categories": ["bullying", ...],
  "explanation": "Brief explanation",
  "confidence": 0.0-1.0
}
```

### Performance targets

- **Latency:** < 3 seconds для text analysis
- **Accuracy:** > 85% precision, > 90% recall на известных датасетах
- **False positives:** < 10% (чтобы не перегружать родителей)

## Compliance (COPPA/GDPR-K)

### Обязательные элементы для TestFlight

1. **Verifiable Parental Consent:**
   - Родитель создает аккаунт первым
   - Email verification обязателен
   - Checkbox "Я подтверждаю, что являюсь родителем/опекуном"

2. **Privacy Policy:**
   - Ясное описание сбора данных
   - Цель использования (защита ребенка)
   - Хранение данных (локально + облако после MVP)
   - Права родителя (просмотр, удаление)

3. **Data Minimization:**
   - Собираем только необходимые данные
   - Не храним данные дольше 90 дней
   - Нет рекламы и трекинга

4. **Audit Trail:**
   - Логирование всех действий родителя
   - Timestamp и IP address
   - Цель: compliance audit

## Дизайн и UX

### Приоритеты UX

1. **Простота:** Минимум кликов до ключевых действий
2. **Прозрачность:** Ясное объяснение AI решений
3. **Trust:** Родители должны доверять системе
4. **Speed:** Быстрый отклик на действия

### Key screens (приоритет)

1. Home (Chats list) — главный экран
2. Chat detail — просмотр сообщений
3. Alerts — уведомления о рисках
4. Parental Controls — настройки
5. Statistics — статистика безопасности

## TestFlight Requirements

### App Store Connect Setup

1. **App Information:**
   - App Name: "kiku - Защита детей"
   - Bundle ID: `com.kiku.app` (placeholder)
   - SKU: `KIKU-001`
   - Primary Language: Russian

2. **Age Rating:**
   - 4+ (для родителей)
   - No objectionable content
   - Made for Kids: NO (это родительское приложение)

3. **Privacy Disclosures:**
   - Data collected: Name, Email, Location (for SOS)
   - Purpose: Child safety monitoring
   - Linked to user: YES
   - Tracking: NO

4. **Beta Testing Info:**
   - What to test: Basic functionality, AI accuracy, UX
   - Feedback: Email to [FOUNDERS_EMAIL]
   - Duration: 4-6 weeks

### Build Requirements

```bash
# iOS Build
expo build:ios --release-channel production

# OR with EAS
eas build --platform ios --profile production
```

**Build settings:**
- iOS version: 14.0+
- Architectures: arm64
- Bitcode: NO (deprecated)
- Signing: Automatic (Expo managed)

## Success Metrics для пилота

### Key Performance Indicators (KPI)

1. **User Acquisition:**
   - 50+ родителей установили приложение
   - 30+ активных пользователей (WAU)
   - 10+ детских профилей

2. **Engagement:**
   - DAU/MAU ratio > 0.3
   - Avg session duration > 5 минут
   - Retention Day 7 > 40%

3. **AI Performance:**
   - 85%+ точность детектирования рисков
   - < 10% false positives
   - < 5% false negatives на known threats

4. **Feedback:**
   - 4.0+ stars средняя оценка
   - < 5% crash rate
   - 70%+ родителей довольны функционалом

## Next Steps после MVP

1. **Backend интеграция:**
   - Разработка API
   - Синхронизация между устройствами
   - Cloud storage

2. **Advanced AI:**
   - Анализ изображений
   - Анализ аудио
   - Контекстуальный анализ

3. **Features:**
   - Групповые чаты
   - Мультиязычность
   - Интеграция с мессенджерами

4. **Scale:**
   - Production infrastructure (Kubernetes)
   - Monitoring и alerting
   - Security audit

## Placeholders для секретов

```env
# НЕ коммитить в Git!

# OpenAI API
OPENAI_API_KEY=sk-xxx...xxx

# Expo
EXPO_TOKEN=xxx...xxx

# Database
DATABASE_URL=postgresql://user:[PASSWORD]@host:5432/db

# Email
SENDGRID_API_KEY=SG.xxx...xxx

# Apple
APPLE_ID=[APPLE_ID_EMAIL]
APPLE_APP_SPECIFIC_PASSWORD=[APP_SPECIFIC_PASSWORD]
```

**Инструкция:** Все секреты загружаются через GitHub Secrets или HashiCorp Vault. См. `docs/infra/ci_cd.md` для деталей.

---

**Статус:** ЧЕРНОВИК для ревью  
**Последнее обновление:** 2024-01-01  
**Автор:** kiku Team  
**Контакт:** [FOUNDERS_EMAIL]
