# MVP Спецификация - kiku для iOS TestFlight Пилота

## Обзор MVP

Минимально жизнеспособный продукт (MVP) для пилотного запуска на iOS через TestFlight. Фокус на core функциональности для валидации продуктовой гипотезы и сбора обратной связи от первых пользователей.

**Цель MVP:** Проверить, что родители готовы использовать AI-powered инструмент для мониторинга безопасности детских чатов и получить первые данные о точности ML-моделей.

**Целевая аудитория пилота:** 50-100 семей (родители + дети 8-14 лет)

**Платформа:** iOS (TestFlight)

**Длительность пилота:** 2-3 месяца

## Критичные фичи для пилота

### 1. Регистрация и верификация родителя

#### Функциональность:
- **Email/пароль регистрация**
  - Поле email (валидация формата)
  - Поле пароль (минимум 8 символов, требования к сложности)
  - Подтверждение пароля
  - Checkbox "Я согласен с условиями использования и политикой конфиденциальности"
  
- **Email верификация**
  - Отправка verification email с ссылкой/кодом
  - Ввод кода верификации в приложении
  - Повторная отправка кода (если не получен)

- **Упрощённая верификация личности (для MVP)**
  - Опциональная загрузка документа (паспорт/водительское удостоверение)
  - Ручная проверка модератором (async процесс)
  - Для пилота: можно пропустить, но родитель получает "Неверифицированный" статус

#### Технические требования:
- JWT tokens (access + refresh)
- Secure storage токенов в AsyncStorage (или Expo SecureStore)
- Password hashing (bcrypt)
- Rate limiting на registration endpoint (защита от spam)

#### API Endpoints:
```typescript
POST /api/auth/register
  Body: { email, password, firstName, lastName }
  Response: { userId, message: "Verification email sent" }

POST /api/auth/verify-email
  Body: { email, code }
  Response: { accessToken, refreshToken, user }

POST /api/auth/login
  Body: { email, password }
  Response: { accessToken, refreshToken, user }

POST /api/auth/refresh
  Body: { refreshToken }
  Response: { accessToken }
```

### 2. Создание профиля ребёнка

#### Функциональность:
- **Форма создания профиля**
  - Имя ребёнка
  - Возраст (или дата рождения)
  - Пол (опционально)
  - Аватар (опционально)

- **Парентальное согласие**
  - Явное согласие на мониторинг
  - Объяснение, что данные будут обрабатываться AI
  - Логирование согласия с timestamp

- **Связывание профиля**
  - Ребёнок автоматически связывается с родительским аккаунтом
  - Родитель может создать несколько детских профилей

- **Код доступа для ребёнка (опционально для MVP)**
  - Генерация уникального кода для ребёнка
  - Ребёнок использует код для входа (без email/пароля)

#### Технические требования:
- Foreign key: child.parentId → parent.userId
- Compliance logging: все изменения в детских профилях

#### API Endpoints:
```typescript
POST /api/children
  Body: { parentId, name, age, gender?, avatarUrl? }
  Response: { child }

GET /api/children
  Query: { parentId }
  Response: { children: Child[] }

PUT /api/children/:childId
  Body: { name?, age?, gender?, avatarUrl? }
  Response: { child }

DELETE /api/children/:childId
  Response: { success: boolean }
```

### 3. Кураторный контент и чаты (MVP упрощение)

#### Функциональность:
- **Синтетические чаты для демонстрации**
  - Заранее подготовленные примеры чатов с разными уровнями риска
  - Позволяют родителям понять функционал до подключения реальных данных

- **Ручной ввод сообщений**
  - Родитель или ребёнок может вручную ввести текст для анализа
  - UI: текстовое поле + кнопка "Проанализировать"

- **Симуляция мессенджера (для пилота)**
  - Встроенный простой чат внутри приложения
  - Ребёнок может отправлять сообщения, которые автоматически анализируются
  - Родитель видит все сообщения + результаты анализа

**Для будущих версий (не MVP):**
- Интеграция с WhatsApp, Telegram, iMessage (требует API или accessibility hooks)

#### Технические требования:
- Local storage для демо-чатов
- Синхронизация с backend для реальных чатов

#### API Endpoints:
```typescript
POST /api/chats
  Body: { childId, participants: string[] }
  Response: { chat }

GET /api/chats
  Query: { childId }
  Response: { chats: Chat[] }

POST /api/messages
  Body: { chatId, senderId, text, type: 'text' | 'image' | 'voice' }
  Response: { message }

GET /api/messages
  Query: { chatId, limit?, offset? }
  Response: { messages: Message[] }
```

### 4. Базовая фильтрация текста и медиа

#### Функциональность:

**Текстовая фильтрация:**
- Детекция токсичного языка (ругательства, угрозы)
- Обнаружение буллинга (насмешки, оскорбления)
- Детекция груминга (попытки манипуляции)
- Выявление запросов личной информации (адрес, телефон)
- Детекция суицидальных мыслей

**Фильтрация изображений:**
- Детекция наготы/сексуального контента
- Обнаружение насилия/крови
- Детекция оружия
- OCR + анализ текста на изображениях

**Голосовые сообщения (упрощённо для MVP):**
- Speech-to-text транскрипция
- Анализ транскрипции через текстовую фильтрацию

#### ML Модели (для MVP):
- **OpenAI GPT-4 API** для текстового анализа (быстрый старт без fine-tuning)
- **AWS Rekognition** или **Google Vision API** для анализа изображений
- **OpenAI Whisper API** для транскрипции аудио

#### Risk Scoring:
- 5-уровневая система: Safe (0), Low (1), Medium (2), High (3), Critical (4)
- Explainability: краткое объяснение, почему присвоен определённый уровень

#### API Endpoints:
```typescript
POST /api/analyze/text
  Body: { text, context?: string }
  Response: { riskLevel, riskScore, explanation, categories: string[] }

POST /api/analyze/image
  Body: { imageUrl }
  Response: { riskLevel, riskScore, explanation, categories: string[] }

POST /api/analyze/voice
  Body: { audioUrl }
  Response: { transcription, riskLevel, riskScore, explanation }
```

### 5. Отправка и приём медиа

#### Функциональность:
- **Текстовые сообщения**: простой текстовый ввод
- **Изображения**: загрузка из галереи или камера
- **Голосовые сообщения**: запись аудио через Expo AV

#### Технические требования:
- **Хранение медиа**: S3 с pre-signed URLs
- **Максимальные размеры**:
  - Изображения: до 10 MB
  - Аудио: до 5 минут
- **Форматы**:
  - Изображения: JPEG, PNG
  - Аудио: MP3, M4A

#### API Endpoints:
```typescript
POST /api/media/upload
  Body: FormData { file }
  Response: { url, mediaId }

GET /api/media/presigned-url
  Query: { mediaId }
  Response: { presignedUrl, expiresAt }
```

### 6. Родительская панель управления

#### Функциональность:

**Основной dashboard:**
- Список всех чатов ребёнка
- Индикаторы риска для каждого чата (цветовая кодировка)
- Счётчики:
  - Всего сообщений
  - Проанализированных сообщений
  - Активных алертов

**Детальный просмотр чата:**
- Список сообщений с результатами анализа
- Фильтрация по уровню риска
- Поиск по ключевым словам

**Алерты и уведомления:**
- Список активных и решённых алертов
- Возможность отметить алерт как "решённый"
- Добавление заметок к алерту

**Настройки безопасности:**
- Включение/выключение различных типов фильтров
- Настройка чувствительности (строгая/умеренная/мягкая)
- Временные ограничения использования (по дням недели)
- Белый список контактов

**Email опекунов:**
- Добавление/удаление email адресов для уведомлений
- Все опекуны получают алерты

#### API Endpoints:
```typescript
GET /api/parent/dashboard
  Query: { parentId }
  Response: { stats, recentAlerts, children }

GET /api/alerts
  Query: { parentId, status?: 'active' | 'resolved' }
  Response: { alerts: Alert[] }

PUT /api/alerts/:alertId/resolve
  Body: { note?: string }
  Response: { alert }

GET /api/settings/parental-controls
  Query: { childId }
  Response: { settings }

PUT /api/settings/parental-controls
  Body: { childId, settings }
  Response: { settings }
```

### 7. Базовая аналитика и логирование

#### Функциональность:

**Статистика для родителей:**
- Общее количество сообщений
- Количество проанализированных сообщений
- Распределение по уровням риска (график)
- Топ категорий рисков
- Динамика активности (по дням/неделям)

**Логирование для compliance:**
- Все действия родителя (изменение настроек, просмотр чатов)
- Все AI-анализы (timestamp, input, output)
- Все парентальные согласия

**Технические метрики (для команды):**
- API response times
- ML inference latency
- Error rates
- Количество активных пользователей (DAU, MAU)

#### API Endpoints:
```typescript
GET /api/analytics/stats
  Query: { childId, dateFrom?, dateTo? }
  Response: { stats }

GET /api/analytics/risk-distribution
  Query: { childId, dateFrom?, dateTo? }
  Response: { distribution: { safe, low, medium, high, critical } }

GET /api/logs/compliance
  Query: { parentId, limit?, offset? }
  Response: { logs: ComplianceLog[] }
```

## API Contract (черновой список эндпойнтов)

### Authentication
- `POST /api/auth/register` — регистрация родителя
- `POST /api/auth/verify-email` — верификация email
- `POST /api/auth/login` — вход
- `POST /api/auth/refresh` — обновление access token
- `POST /api/auth/logout` — выход

### User Management
- `GET /api/users/:userId` — получение профиля
- `PUT /api/users/:userId` — обновление профиля
- `DELETE /api/users/:userId` — удаление аккаунта

### Children
- `POST /api/children` — создание детского профиля
- `GET /api/children` — список детей
- `GET /api/children/:childId` — детальная информация
- `PUT /api/children/:childId` — обновление профиля
- `DELETE /api/children/:childId` — удаление профиля

### Chats
- `POST /api/chats` — создание чата
- `GET /api/chats` — список чатов
- `GET /api/chats/:chatId` — детальная информация
- `DELETE /api/chats/:chatId` — удаление чата

### Messages
- `POST /api/messages` — отправка сообщения
- `GET /api/messages` — список сообщений (для чата)
- `GET /api/messages/:messageId` — детальная информация

### AI Analysis
- `POST /api/analyze/text` — анализ текста
- `POST /api/analyze/image` — анализ изображения
- `POST /api/analyze/voice` — транскрипция + анализ аудио

### Alerts
- `GET /api/alerts` — список алертов
- `GET /api/alerts/:alertId` — детальная информация
- `PUT /api/alerts/:alertId/resolve` — отметить как решённый

### Parental Controls
- `GET /api/settings/parental-controls` — получение настроек
- `PUT /api/settings/parental-controls` — обновление настроек
- `POST /api/settings/contacts/whitelist` — добавление контакта в whitelist
- `DELETE /api/settings/contacts/whitelist/:contactId` — удаление из whitelist
- `POST /api/settings/guardians/email` — добавление email опекуна
- `DELETE /api/settings/guardians/email/:emailId` — удаление email опекуна

### Media
- `POST /api/media/upload` — загрузка медиа (изображение/аудио)
- `GET /api/media/presigned-url` — получение pre-signed URL для скачивания

### Analytics
- `GET /api/analytics/stats` — общая статистика
- `GET /api/analytics/risk-distribution` — распределение рисков
- `GET /api/analytics/activity` — активность по дням

### SOS
- `POST /api/sos` — отправка SOS алерта
- `GET /api/sos` — список SOS алертов
- `PUT /api/sos/:sosId/resolve` — отметить SOS как решённый

### Compliance
- `GET /api/logs/compliance` — логи действий (для audit)

## Технические требования для минимального инстанса

### Backend Infrastructure (для пилота 50-100 семей)

**Compute:**
- **Kubernetes cluster** (AWS EKS или GCP GKE):
  - 2 nodes (t3.medium или equivalent): 2 vCPU, 4 GB RAM each
  - Auto-scaling: min 2, max 4 nodes

**Database:**
- **PostgreSQL** (RDS или Cloud SQL):
  - Instance: db.t3.small (2 vCPU, 2 GB RAM)
  - Storage: 50 GB (с возможностью расширения)

**Cache:**
- **Redis** (ElastiCache или Memorystore):
  - Instance: cache.t3.micro (1 vCPU, 0.5 GB RAM)

**Storage:**
- **S3** (или Cloud Storage):
  - 100 GB для медиа-файлов
  - Lifecycle policy: удаление через 6 месяцев

**CDN:**
- CloudFront (или Cloud CDN) — основной тариф

**Мониторинг:**
- Prometheus + Grafana (self-hosted на одном из nodes)
- CloudWatch/Stackdriver для базовых метрик

### ML Inference (для пилота)

**Опция 1: External APIs (рекомендовано для MVP)**
- OpenAI API (GPT-4, Whisper)
- AWS Rekognition или Google Vision API
- Стоимость: pay-as-you-go (~$100-300/month для 50-100 семей)

**Опция 2: Self-hosted ML (для будущих версий)**
- ML inference service:
  - Instance: g4dn.xlarge (4 vCPU, 16 GB RAM, 1 GPU) — только если нужен self-hosted
  - Hugging Face models (ruBERT, CLIP)

### Estimated Costs (для пилота 50-100 семей)

| Компонент | Стоимость/месяц |
|-----------|-----------------|
| EKS/GKE Cluster | $150 |
| Compute (nodes) | $150 |
| PostgreSQL (RDS) | $50 |
| Redis (ElastiCache) | $30 |
| S3 Storage | $20 |
| CloudFront CDN | $20 |
| OpenAI API | $200 |
| AWS Rekognition | $50 |
| Monitoring | $30 |
| **Итого** | **~$700/month** |

**Note:** Для пилота можно использовать Free Tier и credits от облачных провайдеров (AWS Activate, GCP for Startups).

### Минимальные системные требования для iOS

**iOS приложение:**
- iOS 14.0+
- iPhone 8 и новее
- 100 MB свободного места
- Интернет-соединение (WiFi или cellular)

**TestFlight:**
- Максимум 10,000 test users (более чем достаточно для пилота)
- Builds доступны 90 дней

## Метрики успеха для MVP

**Продуктовые метрики:**
- **Retention**: > 50% пользователей активны через 30 дней
- **Engagement**: родители проверяют алерты минимум 3 раза в неделю
- **NPS (Net Promoter Score)**: > 40

**Технические метрики:**
- **ML Accuracy**: > 80% precision/recall для текста, > 70% для изображений
- **API latency**: p95 < 500ms
- **Uptime**: > 99%

**Compliance метрики:**
- 100% парентальных согласий залогированы
- Нет security incidents

## Ограничения MVP

**Не включено в MVP (для будущих версий):**
- Интеграция с внешними мессенджерами (WhatsApp, Telegram)
- Real-time синхронизация между устройствами
- Android версия
- Мультиязычность (только русский)
- Продвинутая аналитика (ML-powered insights)
- Gamification для детей
- Образовательный контент о безопасности

## Roadmap после MVP

**Post-MVP (следующие 6 месяцев):**
1. Android версия
2. Интеграция с популярными мессенджерами
3. Push notifications для real-time алертов
4. Расширенная аналитика и AI-рекомендации
5. Мультиязычность (английский)
6. Улучшение ML моделей на основе feedback

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (черновик)  
**Автор:** kiku Product Team  
**Статус:** Draft — требуется review и утверждение
