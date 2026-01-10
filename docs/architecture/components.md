# Компоненты системы Rork-Kiku

## Обзор компонентов

Приложение состоит из нескольких ключевых компонентов, организованных по слоям.

## Структура приложения

```
app/
├── (tabs)/              # Вкладки навигации
│   ├── index.tsx        # Главная: список чатов
│   ├── alerts.tsx       # Уведомления
│   ├── about.tsx        # О приложении
│   ├── profile.tsx      # Профиль пользователя
│   └── _layout.tsx      # Лейаут вкладок
├── chat/
│   └── [chatId].tsx     # Детали чата
├── _layout.tsx          # Корневой лейаут
├── modal.tsx            # Модальное окно
├── security-settings.tsx    # Настройки безопасности
├── ai-recommendations.tsx   # AI рекомендации
└── notifications-diagnostics.tsx  # Диагностика уведомлений
```

## Frontend компоненты

### 1. Layout Components

#### RootLayout (`app/_layout.tsx`)
**Назначение**: Корневой компонент приложения

**Функции**:
- Инициализация провайдеров (Query, tRPC, Contexts)
- Error Boundary для глобальной обработки ошибок
- Splash screen управление
- Gesture Handler инициализация

**Ключевые особенности**:
```typescript
- QueryClient с настройками кэширования
- AppErrorBoundary для обработки runtime ошибок
- Nested providers (Theme → User → Notifications → ParentalControls → Monitoring)
- Platform-specific инициализация (web vs native)
```

#### TabsLayout (`app/(tabs)/_layout.tsx`)
**Назначение**: Навигация по вкладкам

**Вкладки**:
1. Чаты (index) - Главный экран мониторинга
2. Уведомления (alerts) - Активные алерты
3. Статистика (statistics) - Аналитика
4. О приложении (about) - Информация
5. Контроль (parental-controls) - Настройки
6. Профиль (profile) - Пользователь

### 2. Screen Components

#### ChatsScreen (`app/(tabs)/index.tsx`)
**Назначение**: Главный экран со списком чатов

**Функциональность**:
- Отображение всех отслеживаемых чатов
- Индикаторы уровня риска (цветные)
- Поиск по участникам
- Фильтрация по уровню риска
- Статистика (чаты, сообщения, тревоги)

**Состояние**:
```typescript
- chats: Chat[]
- searchQuery: string
- selectedRiskFilter: RiskLevel | 'all'
- stats: { totalChats, totalMessages, totalAlerts }
```

#### ChatDetailScreen (`app/chat/[chatId].tsx`)
**Назначение**: Просмотр отдельного чата

**Функциональность**:
- Список сообщений с рисками
- Ввод текстовых сообщений
- Запись и отправка голосовых сообщений
- SOS кнопка в header
- AI-анализ сообщений в реал-тайм

**Интеграция**:
- MonitoringContext для сообщений
- ParentalControlsContext для SOS
- AI Toolkit для анализа

#### AlertsScreen (`app/(tabs)/alerts.tsx`)
**Назначение**: Управление уведомлениями

**Функциональность**:
- Активные и решенные тревоги
- Фильтрация по статусу
- Детали каждого алерта
- Кнопка "Отметить решенным"

#### ProfileScreen (`app/(tabs)/profile.tsx`)
**Назначение**: Управление профилем

**Функциональность**:
- Создание/редактирование профиля
- Выбор роли (parent/child)
- Информация об аккаунте
- Выход из системы

#### SecuritySettingsScreen (`app/security-settings.tsx`)
**Назначение**: Центр безопасности

**Функциональность**:
- SOS алерты с геолокацией
- Основные настройки безопасности
- Временные ограничения
- Белый список контактов
- Email опекунов для уведомлений

### 3. Context Components

#### MonitoringContext (`constants/MonitoringContext.tsx`)
**Назначение**: Управление чатами и модерацией

**Состояние**:
```typescript
{
  chats: Chat[]
  messages: Record<string, Message[]>
  alerts: Alert[]
  addMessage: (chatId, text, imageUri?, audioUri?) => Promise
  analyzeMessage: (message) => Promise<RiskAnalysis>
  markAlertResolved: (alertId) => void
  getActiveAlerts: () => Alert[]
}
```

**Функции**:
- Создание и управление чатами
- AI-анализ сообщений
- Создание алертов при обнаружении рисков
- Персистентность через AsyncStorage

#### ParentalControlsContext (`constants/ParentalControlsContext.tsx`)
**Назначение**: Родительский контроль

**Состояние**:
```typescript
{
  settings: ParentalSettings
  sosAlerts: SOSAlert[]
  timeRestrictions: TimeRestriction[]
  whitelistedContacts: Contact[]
  guardianEmails: string[]
  updateSettings: (settings) => Promise
  addSOSAlert: (location) => Promise
  resolveSOSAlert: (alertId) => void
}
```

**Функции**:
- Управление настройками безопасности
- SOS функционал с геолокацией
- Временные ограничения
- Compliance logging (COPPA/GDPR-K)

#### UserContext (`constants/UserContext.tsx`)
**Назначение**: Аутентификация и профиль

**Состояние**:
```typescript
{
  user: User | null
  isAuthenticated: boolean
  login: (email, password) => Promise
  logout: () => Promise
  updateProfile: (data) => Promise
}
```

#### ThemeContext (`constants/ThemeContext.tsx`)
**Назначение**: Управление темой

**Состояние**:
```typescript
{
  theme: 'light' | 'dark'
  colors: ColorScheme
  toggleTheme: () => void
}
```

#### NotificationsContext (`constants/NotificationsContext.tsx`)
**Назначение**: Push уведомления

**Состояние**:
```typescript
{
  expoPushToken: string | null
  notifications: Notification[]
  registerDevice: () => Promise
  sendNotification: (title, body, data) => Promise
}
```

### 4. UI Components

#### ThemeModeToggle (`components/ThemeModeToggle.tsx`)
**Назначение**: Переключатель темы

**Функциональность**:
- Переключение между светлой и темной темой
- Иконка солнца/луны
- Haptic feedback

### 5. Utility Components

#### Error Boundary (`app/_layout.tsx`)
**Назначение**: Обработка ошибок React

**Функции**:
- Перехват runtime ошибок
- Fallback UI
- Кнопка восстановления
- Логирование ошибок

**UI**:
```typescript
{
  "errorContainer": "Полноэкранный контейнер",
  "errorTitle": "Что-то пошло не так",
  "errorMessage": "Сообщение об ошибке",
  "errorButton": "Попробовать снова"
}
```

## Backend компоненты

### 1. Hono Server (`backend/hono.ts`)

**Назначение**: HTTP сервер и роутинг

**Middleware**:
- CORS: Кроссдоменные запросы
- tRPC Server: Интеграция с tRPC
- Error Handler: Глобальная обработка ошибок
- Not Found Handler: 404 ответы

**Endpoints**:
- `GET /` - Health check
- `/api/trpc/*` - tRPC endpoints

### 2. tRPC Router (`backend/trpc/app-router.ts`)

**Назначение**: API маршрутизация

**Routes**:
```typescript
{
  example: {
    hi: Procedure  // Тестовый endpoint
  },
  notifications: {
    registerDevice: Procedure    // Регистрация устройства
    getSyncStatus: Procedure     // Статус синхронизации
    logDeviceTest: Procedure     // Тестовое логирование
  }
}
```

### 3. Context Creator (`backend/trpc/create-context.ts`)

**Назначение**: Создание контекста для tRPC

**Функции**:
- Извлечение запроса из Hono
- Инициализация контекста для процедур
- Настройка SuperJSON transformer

## Схемы данных

### Types (`constants/types.ts`)

**Основные типы**:
```typescript
type User = {
  id: string
  name: string
  email: string
  role: 'parent' | 'child'
  avatar?: string
}

type Chat = {
  id: string
  participants: string[]
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  riskLevel: RiskLevel
}

type Message = {
  id: string
  chatId: string
  senderId: string
  text?: string
  imageUri?: string
  audioUri?: string
  timestamp: Date
  isAnalyzed: boolean
  riskAnalysis?: RiskAnalysis
}

type RiskAnalysis = {
  level: RiskLevel
  confidence: number
  reasons: string[]
  categories: string[]
  shouldAlert: boolean
}

type Alert = {
  id: string
  chatId: string
  messageId: string
  riskLevel: RiskLevel
  reason: string
  timestamp: Date
  isResolved: boolean
}
```

## Интеграции

### 1. AI Service
- Rork AI Toolkit SDK
- Text analysis для модерации
- Image analysis для контента
- Speech-to-text для аудио

### 2. Storage
- AsyncStorage для персистентности
- SecureStore для чувствительных данных

### 3. Expo Services
- Location для SOS геолокации
- Notifications для push
- Camera/ImagePicker для медиа
- AV для аудио

### 4. External APIs
- Через tRPC client к backend
- HTTP fetch с таймаутами
- Error handling и retry логика

## Потоки взаимодействия

### 1. Отправка сообщения
```
User Input → MonitoringContext.addMessage()
  ↓
Save to messages state
  ↓
AI Analysis (analyzeMessage)
  ↓
Risk Assessment
  ↓
Create Alert if needed
  ↓
Persist to AsyncStorage
  ↓
UI Update
```

### 2. SOS Alert
```
SOS Button Press → Get Location
  ↓
ParentalControlsContext.addSOSAlert()
  ↓
Save to sosAlerts state
  ↓
Send notifications to guardians
  ↓
Persist to AsyncStorage
  ↓
UI Update (show in SecuritySettings)
```

### 3. Settings Update
```
Settings Change → ParentalControlsContext.updateSettings()
  ↓
Create Compliance Log
  ↓
Update settings state
  ↓
Persist to AsyncStorage
  ↓
UI Update
```

## Тестирование

### Unit Tests
- Context hooks
- Utility functions
- Data transformations

### Integration Tests
- API endpoints
- tRPC procedures
- Context integrations

### E2E Tests
- User flows
- Navigation
- Data persistence

## Производительность компонентов

### Оптимизации
- React.memo для дорогих компонентов
- useCallback для стабильных функций
- useMemo для вычисляемых значений
- Virtualization для длинных списков

### Мониторинг
- Console logging
- Performance metrics
- Error tracking

## См. также
- [Обзор архитектуры](./overview.md)
- [API Reference](./api-reference.md)
- [Схема данных](./data-schema.md)
