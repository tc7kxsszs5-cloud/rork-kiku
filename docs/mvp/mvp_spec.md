# Спецификация MVP для kiku

## Обзор MVP

Минимально жизнеспособный продукт (MVP) для пилотного запуска через iOS TestFlight. Фокус на core функциональности защиты детей с базовой AI-модерацией.

**Цель MVP:** Валидация гипотезы, что родители готовы использовать AI-powered инструмент для мониторинга безопасности детских чатов.

**Платформа:** iOS (iPhone) через TestFlight
**Аудитория пилота:** 50-100 семей
**Длительность пилота:** 8-12 недель

## Основная функциональность MVP

### 1. Регистрация и верификация родителя

**Must Have:**
- ✅ Email-based регистрация
- ✅ Верификация email (код на почту)
- ✅ Создание пароля (минимум 8 символов, буквы + цифры)
- ✅ Биометрическая аутентификация (Face ID / Touch ID)
- ✅ Согласие с Terms of Service и Privacy Policy
- ✅ Родительское согласие (COPPA compliance)

**Процесс:**
```
1. Ввод email → Отправка кода верификации
2. Ввод кода → Создание пароля
3. Чтение и принятие Privacy Policy
4. Чтение и принятие Terms of Service
5. COPPA consent form (для детей < 13 лет)
6. Настройка Face ID (опционально)
7. Переход на экран создания профиля ребенка
```

**UI/UX:**
- Простой onboarding flow (4-5 экранов)
- Прогресс-бар показывающий этапы
- Подсказки и объяснения на каждом шаге
- Skip опции где разумно (например, Face ID можно настроить позже)

### 2. Создание профиля ребенка

**Must Have:**
- ✅ Имя ребенка
- ✅ Возраст ребенка
- ✅ Аватар (опционально, можно выбрать из presets)
- ✅ Связь с родительским профилем
- ✅ Настройки по умолчанию (умеренная модерация)

**Данные профиля:**
```typescript
interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar_url?: string;
  parent_ids: string[];
  created_at: Date;
  settings: {
    moderation_level: 'low' | 'medium' | 'high';
    allow_unknown_contacts: boolean;
    screen_time_limits: TimeRestriction[];
  };
}
```

**Ограничения MVP:**
- Один родитель может создать до 3 детских профилей
- Минимальный возраст ребенка: 8 лет (для пилота)

### 3. Просмотр кураторного контента

**Must Have:**
- ✅ Список безопасных образовательных ресурсов
- ✅ Рекомендации по возрасту
- ✅ Категории: Образование, Игры, Безопасность в интернете
- ✅ Внешние ссылки на доверенные сайты

**Контент-категории:**
1. **Образование**
   - Дуолинго (языки)
   - Khan Academy (математика, наука)
   - Сhildren's library (электронные книги)

2. **Цифровая грамотность**
   - Видео про онлайн-безопасность
   - Статьи для родителей
   - Чек-листы безопасного поведения

3. **Полезные игры**
   - Образовательные игры (одобренные педагогами)
   - Развивающие приложения

**Примечание:** Контент будет статическим в MVP (не требует CMS)

### 4. Базовая фильтрация текста/медиа

**Текстовая модерация:**

**Категории детекции:**
- 🚨 **Буллинг/Угрозы:** "Я тебя убью", "ненавижу тебя", "ты урод"
- 🚨 **Сексуальный контент:** explicit language, grooming фразы
- 🚨 **Мошенничество:** "пришли деньги", "дай пароль", "не говори родителям"
- 🚨 **Наркотики/Алкоголь:** упоминание наркотических веществ
- 🚨 **Самоповреждение:** "хочу умереть", "суицид"

**Модель:** OpenAI GPT-4 Turbo или Anthropic Claude 3.5 Sonnet

**Prompt Template:**
```
Analyze the following message for child safety risks:

Message: "{message_text}"

Detect:
1. Bullying or threats
2. Sexual content or grooming
3. Scams or fraud attempts
4. Drug/alcohol references
5. Self-harm or suicide ideation

Return JSON:
{
  "risk_level": "safe" | "low" | "medium" | "high" | "critical",
  "risk_score": 0-100,
  "detected_categories": [],
  "explanation": "Brief explanation",
  "recommended_action": "none" | "notify_parent" | "block_message"
}
```

**Fallback:** Если API недоступен → keyword-based фильтрация (менее точная, но лучше чем ничего)

**Медиа-модерация (изображения):**

**Категории детекции:**
- 🚨 NSFW контент (обнаженность)
- 🚨 Насилие, кровь, оружие
- 🚨 Наркотики, алкоголь
- 🚨 Символы ненависти (свастика и т.д.)

**Модель:** OpenAI Vision API или Claude with vision

**Prompt Template:**
```
Analyze this image for child safety. Detect:
1. Nudity or sexual content
2. Violence, blood, weapons
3. Drugs or alcohol
4. Hate symbols

Return risk_level (safe/low/medium/high/critical) and explanation.
```

**Ограничения MVP:**
- ❌ Видео модерация (не включено в MVP)
- ❌ Аудио транскрипция и анализ (будет в v2)
- ❌ Custom fine-tuned модели (используем API providers)

### 5. Отправка/получение медиа с блокировкой

**Upload Flow:**
```
1. Пользователь выбирает изображение из галереи
2. Клиент отправляет в API для анализа
3. API загружает в S3 (encrypted)
4. API вызывает AI модерацию
5. Если риск > MEDIUM → блокировка загрузки
6. Иначе → изображение доступно в чате
7. Родитель получает уведомление о попытке загрузки (любое)
```

**Supported Formats (MVP):**
- Изображения: JPEG, PNG, HEIC
- Max size: 10 MB

**Blocked Content Message:**
```
❌ Это изображение не может быть загружено из соображений безопасности.
Родители получили уведомление.
```

### 6. Родительская панель (Dashboard)

**Основные секции:**

#### A. Overview (Главный экран)
```
┌─────────────────────────────────┐
│ Статистика за сегодня           │
│ • Сообщений проанализировано: 42│
│ • Новых алертов: 3              │
│ • Активных чатов: 5             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Последние алерты                │
│ 🚨 MEDIUM - Буллинг (14:32)    │
│ 🟡 LOW - Подозрительное (12:15) │
│ 🚨 HIGH - Explicit (09:41)      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Чаты                            │
│ 📱 Школьный чат (5 участников)  │
│ 📱 Друзья (3 участника)         │
│ 📱 Футбольная команда (12)      │
└─────────────────────────────────┘
```

#### B. Alerts (Уведомления)
- Список всех алертов (сортировка по дате)
- Фильтр по severity (все/high/medium/low)
- Фильтр по статусу (активные/решенные)
- Детали алерта: сообщение, риск-категории, рекомендации
- Кнопки: "Отметить решенным", "Посмотреть чат"

#### C. Chats (Чаты)
- Список всех отслеживаемых чатов
- Индикатор риска для каждого чата
- Последнее сообщение
- Количество участников
- Tap для просмотра истории сообщений

#### D. Settings (Настройки)
```
Основные настройки:
• AI модерация: ВКЛ/ВЫКЛ
• Уровень строгости: Низкий/Средний/Высокий
• Блокировка неподходящих изображений: ВКЛ/ВЫКЛ

Временные ограничения:
• Понедельник-Пятница: 18:00-21:00
• Выходные: 10:00-22:00
• Во время учебы: ВЫКЛ

Контакты:
• Белый список разрешенных контактов
• Блокировать незнакомцев: ВКЛ/ВЫКЛ

Уведомления:
• Email: parent@example.com
• Push notifications: ВКЛ
• SMS alerts для HIGH/CRITICAL: ВЫКЛ

SOS:
• Emergency contacts: +X-XXX-XXX-XXXX
• Геолокация: ВКЛ
```

#### E. Profile (Профиль)
- Информация о родителе
- Список детей
- Настройки аккаунта
- Выход

### 7. Базовая аналитика и логирование

**Метрики для родителей:**
- Количество сообщений в день
- Распределение рисков (pie chart)
- Топ контакты (по частоте общения)
- Activity timeline (по часам/дням)
- Прогресс решения алертов

**Пример Weekly Report (email родителю):**
```
📊 Еженедельный отчет kiku

Период: 20.01 - 26.01.2026

✅ Проанализировано сообщений: 342
🚨 Алертов: 5 (4 решено, 1 активный)
👥 Активных чатов: 7

Распределение рисков:
• Safe: 95%
• Low: 3%
• Medium: 1.5%
• High: 0.5%

Топ контакты:
1. Маша (87 сообщений)
2. Петя (54 сообщения)
3. Школьный чат (123 сообщения)

AI рекомендации:
• Поговорите с ребенком о безопасном общении
• Обратите внимание на чат "Школьный" - 1 HIGH alert
```

**Логирование (для команды):**
- Application logs (CloudWatch)
- Error tracking (Sentry)
- AI API calls и latencies
- User actions (analytics events)

## API Contract (черновик)

### Base URL
```
Production: https://api.kiku-app.com/v1
Staging: https://staging-api.kiku-app.com/v1
```

### Authentication
```
Authorization: Bearer <JWT_TOKEN>
```

### Core Endpoints

#### 1. Authentication

**POST /auth/register**
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123",
  "name": "Иван Иванов"
}

Response: 201 Created
{
  "user_id": "usr_abc123",
  "email": "parent@example.com",
  "verification_sent": true
}
```

**POST /auth/verify-email**
```json
Request:
{
  "email": "parent@example.com",
  "code": "123456"
}

Response: 200 OK
{
  "verified": true,
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900
}
```

**POST /auth/login**
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "user": {
    "id": "usr_abc123",
    "email": "parent@example.com",
    "name": "Иван Иванов",
    "role": "parent"
  }
}
```

#### 2. Profile Management

**POST /profiles**
```json
Request:
{
  "name": "Маша",
  "age": 10,
  "avatar_preset": "avatar_girl_1"
}

Response: 201 Created
{
  "profile_id": "prof_xyz789",
  "name": "Маша",
  "age": 10,
  "avatar_url": "https://cdn.kiku-app.com/avatars/girl_1.png",
  "created_at": "2026-01-02T10:00:00Z"
}
```

**GET /profiles**
```json
Response: 200 OK
{
  "profiles": [
    {
      "id": "prof_xyz789",
      "name": "Маша",
      "age": 10,
      "avatar_url": "https://cdn.kiku-app.com/avatars/girl_1.png"
    }
  ]
}
```

#### 3. Chat Monitoring

**POST /chats**
```json
Request:
{
  "profile_id": "prof_xyz789",
  "name": "Школьный чат",
  "participants": ["Маша", "Петя", "Ваня"]
}

Response: 201 Created
{
  "chat_id": "chat_123abc",
  "name": "Школьный чат",
  "created_at": "2026-01-02T10:00:00Z"
}
```

**GET /chats?profile_id=prof_xyz789**
```json
Response: 200 OK
{
  "chats": [
    {
      "id": "chat_123abc",
      "name": "Школьный чат",
      "participants_count": 3,
      "last_message_at": "2026-01-02T14:32:00Z",
      "risk_level": "medium",
      "unread_alerts": 2
    }
  ]
}
```

#### 4. Message Analysis

**POST /messages/analyze**
```json
Request:
{
  "chat_id": "chat_123abc",
  "profile_id": "prof_xyz789",
  "message_type": "text",
  "content": "Привет, как дела?",
  "sender": "Петя"
}

Response: 200 OK
{
  "message_id": "msg_456def",
  "analysis": {
    "risk_level": "safe",
    "risk_score": 5,
    "detected_categories": [],
    "explanation": "Дружеское приветствие, нет рисков"
  },
  "created_at": "2026-01-02T14:35:00Z"
}
```

**POST /media/analyze**
```json
Request:
{
  "chat_id": "chat_123abc",
  "profile_id": "prof_xyz789",
  "media_type": "image",
  "media_url": "https://cdn.kiku-app.com/uploads/abc123.jpg"
}

Response: 200 OK
{
  "media_id": "media_789ghi",
  "analysis": {
    "risk_level": "safe",
    "risk_score": 10,
    "detected_categories": [],
    "explanation": "Фото природы, безопасно"
  },
  "allowed": true
}
```

#### 5. Alerts

**GET /alerts?profile_id=prof_xyz789&status=active**
```json
Response: 200 OK
{
  "alerts": [
    {
      "id": "alert_111aaa",
      "chat_id": "chat_123abc",
      "message_id": "msg_456def",
      "severity": "high",
      "category": "bullying",
      "message_preview": "ты такой урод...",
      "created_at": "2026-01-02T14:32:00Z",
      "status": "active",
      "recommendations": [
        "Поговорите с ребенком о происшествии",
        "Рассмотрите возможность связаться с учителем"
      ]
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "per_page": 20
  }
}
```

**PATCH /alerts/:alert_id**
```json
Request:
{
  "status": "resolved",
  "resolution_note": "Поговорили с ребенком, ситуация под контролем"
}

Response: 200 OK
{
  "alert_id": "alert_111aaa",
  "status": "resolved",
  "resolved_at": "2026-01-02T15:00:00Z"
}
```

#### 6. Parental Controls

**GET /parental-controls?profile_id=prof_xyz789**
```json
Response: 200 OK
{
  "profile_id": "prof_xyz789",
  "settings": {
    "ai_moderation_enabled": true,
    "moderation_level": "medium",
    "block_inappropriate_media": true,
    "block_unknown_contacts": true,
    "time_restrictions": [
      {
        "day": "monday",
        "start_time": "18:00",
        "end_time": "21:00"
      }
    ],
    "whitelisted_contacts": ["Мама", "Папа", "Бабушка"],
    "guardian_emails": ["parent@example.com"]
  }
}
```

**PATCH /parental-controls/:profile_id**
```json
Request:
{
  "moderation_level": "high",
  "block_unknown_contacts": true
}

Response: 200 OK
{
  "updated": true,
  "consent_logged": true
}
```

#### 7. SOS

**POST /sos**
```json
Request:
{
  "profile_id": "prof_xyz789",
  "location": {
    "latitude": 55.7558,
    "longitude": 37.6173
  },
  "note": "Чувствую себя небезопасно"
}

Response: 201 Created
{
  "sos_id": "sos_999zzz",
  "status": "active",
  "notifications_sent": 3,
  "created_at": "2026-01-02T16:00:00Z"
}
```

#### 8. Statistics

**GET /statistics?profile_id=prof_xyz789&period=7d**
```json
Response: 200 OK
{
  "period": "7d",
  "messages_analyzed": 342,
  "alerts_created": 5,
  "alerts_resolved": 4,
  "risk_distribution": {
    "safe": 325,
    "low": 10,
    "medium": 5,
    "high": 2,
    "critical": 0
  },
  "top_contacts": [
    {"name": "Маша", "count": 87},
    {"name": "Петя", "count": 54}
  ]
}
```

### Rate Limits (MVP)

```
Unauthenticated:
- 10 requests per minute

Authenticated (free tier):
- 100 requests per minute
- 1000 AI analyses per day

Authenticated (paid tier - future):
- 500 requests per minute
- Unlimited AI analyses
```

### Error Responses

```json
400 Bad Request:
{
  "error": "validation_error",
  "message": "Invalid email format",
  "fields": {
    "email": "Must be a valid email address"
  }
}

401 Unauthorized:
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}

429 Too Many Requests:
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again in 30 seconds.",
  "retry_after": 30
}

500 Internal Server Error:
{
  "error": "internal_error",
  "message": "An unexpected error occurred. Please try again later.",
  "incident_id": "inc_abc123"
}
```

## Требования к масштабируемости для пилота

### Целевые показатели производительности

**Пользователи:** 50-100 семей (100-200 пользователей)

**Ожидаемая нагрузка:**
- ~50-100 сообщений в час (peak)
- ~10-20 изображений в час
- Concurrent users: 20-30

**Требования к latency:**
- API response: < 300ms (p95)
- Text analysis: < 5 seconds
- Image analysis: < 15 seconds
- Real-time notifications: < 1 second

**Инфраструктура (минимальная для MVP):**
```
API Gateway:
- 1-2 replicas (Kubernetes pods)
- Instance: t3.small (AWS) or n1-standard-1 (GCP)

Backend Services:
- User Service: 1 replica
- Monitoring Service: 1-2 replicas
- Alert Service: 1 replica
- Content Moderation: 2 replicas (может быть bottleneck)

Database:
- PostgreSQL: db.t3.small (single instance OK для пилота)
- Redis: cache.t3.micro (для sessions)

Storage:
- S3: Standard tier
- CloudFront: Basic distribution

AI APIs:
- OpenAI API: Pay-per-use
- Estimated: $50-200/month для пилота
```

**Scaling strategy для пилота:**
- Manual scaling (достаточно для MVP)
- Monitor CPU/Memory через CloudWatch
- Если usage > 70% постоянно → upgrade instance или add replica

**Budget estimate (monthly for MVP):**
```
Infrastructure:
- AWS/GCP: ~$200-300
  - Compute (EKS/GKE): $100
  - Database: $50
  - Storage/CDN: $20
  - Networking: $30

AI APIs:
- OpenAI/Anthropic: $50-200
  (зависит от volume)

Monitoring/Logging:
- CloudWatch/Stackdriver: $20-50

Total: ~$300-550/month
```

## Out of Scope для MVP

**Не включено в пилот (будет в последующих версиях):**

❌ Android version (только iOS)
❌ Web dashboard для родителей (только mobile)
❌ Video moderation
❌ Audio transcription и анализ
❌ Behavioral analysis (ML для паттернов)
❌ Multi-language support (только русский язык)
❌ Integration со школьными системами
❌ Group chats с > 20 участниками
❌ Advanced analytics (ML insights)
❌ Social features (parent community)
❌ In-app payments/subscriptions
❌ White-label solution
❌ Export данных (GDPR compliance feature)

## Success Criteria для MVP

**Метрики успеха пилота:**

**User Adoption:**
- ✅ Минимум 50 активных семей
- ✅ 70%+ retention после 4 недель
- ✅ 3+ sessions per week на семью

**Engagement:**
- ✅ 80%+ родителей проверяют алерты в течение 24 часов
- ✅ 50%+ родителей используют dashboard минимум раз в неделю

**AI Performance:**
- ✅ 90%+ accuracy на текстовой модерации (по feedback родителей)
- ✅ <5% false positives (ложные срабатывания)
- ✅ 0 false negatives для CRITICAL cases

**Technical:**
- ✅ 99% uptime
- ✅ <5s average analysis time
- ✅ 0 data breaches
- ✅ 0 critical bugs

**Qualitative:**
- ✅ NPS (Net Promoter Score) > 50
- ✅ 80%+ родителей готовы рекомендовать друзьям
- ✅ Positive feedback from children (не чувствуют себя "слишком" контролируемыми)

## Roadmap после MVP

**Post-MVP features (v1.1 - v2.0):**

**Q1 2026:**
- Android version
- Audio transcription
- Advanced filtering rules (custom keywords)
- Parent web dashboard

**Q2 2026:**
- Behavioral analysis
- Multi-language support (English)
- Video moderation (beta)
- Integration с школами (pilot)

**Q3-Q4 2026:**
- Predictive analytics
- AI recommendations
- Community features
- Monetization (subscriptions)

---

**Документ обновлен:** 2026-01-02
**Версия:** 1.0 (MVP Spec - Draft)
**Утверждение:** Product Team + Engineering Lead
