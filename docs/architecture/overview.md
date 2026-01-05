# Обзор архитектуры Rork-Kiku

## Общая архитектура

Rork-Kiku построен на современном стеке технологий для создания кроссплатформенного мобильного приложения с акцентом на безопасность и производительность.

## Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────┐
│                  Mobile Application                      │
│              (React Native + Expo)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI Layer  │  │ Context/State│  │  Navigation  │  │
│  │ (Components)│  │  Management  │  │ (Expo Router)│  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ tRPC + HTTP
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
│                  (Hono + tRPC)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes    │  │  Middleware  │  │   Context    │  │
│  │  (tRPC)     │  │   (Hono)     │  │   Creation   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI Services │  │   Storage    │  │Notifications │  │
│  │   (Rork AI) │  │(AsyncStorage)│  │   (Expo)     │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Ключевые компоненты

### 1. Frontend (Mobile Application)

#### React Native + Expo
- **Framework**: React Native 0.81.5 с React 19.1.0
- **Platform**: Expo SDK 54
- **Routing**: Expo Router (файловая маршрутизация)
- **UI**: Кастомные компоненты с Lucide иконками

#### Управление состоянием
- **React Query**: Управление серверным состоянием
- **Context API**: 5 основных контекстов
  - `MonitoringContext`: Чаты, сообщения, AI-анализ
  - `ParentalControlsContext`: Родительские настройки
  - `UserContext`: Аутентификация и профиль
  - `ThemeContext`: Тема приложения
  - `NotificationsContext`: Уведомления

#### Локальное хранилище
- **AsyncStorage**: Персистентное хранение всех данных на устройстве
- **Шифрование**: End-to-end для чувствительных данных

### 2. Backend API

#### Hono Framework
- **Легковесный**: Быстрый роутинг и middleware
- **CORS**: Настроенная политика для безопасности
- **Error Handling**: Централизованная обработка ошибок

#### tRPC Integration
- **Type-safe**: Полная типизация между клиентом и сервером
- **Transformer**: SuperJSON для сериализации
- **Routing**: Модульная структура роутов
  - `/api/trpc/example.hi`
  - `/api/trpc/notifications.*`

#### Middleware
- CORS для кроссдоменных запросов
- Обработка ошибок с логированием
- Таймауты для запросов (10 секунд)

### 3. AI Integration

#### Rork AI Toolkit
- **Текстовый анализ**: Определение рисков в сообщениях
- **Анализ изображений**: Мультимодальный анализ контента
- **Транскрипция**: Speech-to-text для голосовых сообщений

#### Risk Assessment
- 5-уровневая система: safe, low, medium, high, critical
- Keyword-based и AI-based анализ
- Реал-тайм модерация контента

## Паттерны проектирования

### 1. Provider Pattern
Все контексты обернуты в провайдеры для изоляции состояния:
```typescript
<AppProviders>
  <ThemeProvider>
    <UserProvider>
      <NotificationsProvider>
        <ParentalControlsProvider>
          <MonitoringProvider>
            {children}
          </MonitoringProvider>
        </ParentalControlsProvider>
      </NotificationsProvider>
    </UserProvider>
  </ThemeProvider>
</AppProviders>
```

### 2. Error Boundary Pattern
Глобальная обработка ошибок с UI восстановлением:
```typescript
class AppErrorBoundary extends React.Component {
  // Перехват ошибок рендеринга
  // Отображение fallback UI
  // Возможность восстановления
}
```

### 3. Repository Pattern
Разделение бизнес-логики и доступа к данным через контексты.

### 4. Atomic Design
Компоненты организованы от простых к сложным.

## Потоки данных

### 1. Аутентификация
```
User Input → UserContext → AsyncStorage → UI Update
```

### 2. Модерация сообщений
```
Message Input → MonitoringContext → AI Analysis → Risk Assessment → Alert Creation → UI Update
```

### 3. Родительский контроль
```
Settings Change → ParentalControlsContext → Compliance Log → AsyncStorage → UI Update
```

## Безопасность

### Принципы
1. **Privacy by Design**: Минимизация данных
2. **Local-First**: Все данные на устройстве
3. **Encryption**: End-to-end шифрование
4. **COPPA/GDPR-K**: Полное соответствие

### Меры защиты
- Валидация входных данных (Zod)
- Sanitization контента
- Secure storage (expo-secure-store)
- Audit logging всех действий

## Производительность

### Оптимизации
- **React.memo**: Предотвращение лишних рендеров
- **useCallback/useMemo**: Мемоизация функций и данных
- **Lazy Loading**: Загрузка компонентов по требованию
- **Batch Updates**: Группировка обновлений состояния

### Мониторинг
- Console logging для отладки
- Haptic feedback для UX
- Error tracking в Error Boundary

## Масштабируемость

### Текущая архитектура
- Локальное хранение (не требует бэкенда)
- Stateless API (легко масштабируется)
- Модульная структура (легко расширяется)

### Будущие улучшения
- Добавление централизованного бэкенда
- Синхронизация между устройствами
- Распределенная обработка AI
- CDN для статических ресурсов

## Технологический стек

### Frontend
- React Native 0.81.5
- React 19.1.0
- Expo SDK 54
- TypeScript 5.9.2
- Expo Router 6.0.13

### Backend
- Hono 4.10.6
- tRPC 11.7.2
- SuperJSON 2.2.5

### State Management
- React Query 5.90.11
- Context API
- AsyncStorage 2.2.0

### AI/ML
- @rork-ai/toolkit-sdk
- Zod 4.1.13 (валидация)

### Developer Experience
- TypeScript (строгая типизация)
- ESLint (линтинг)
- Expo Dev Tools (отладка)

## Развертывание

### Платформы
- iOS (через App Store)
- Android (через Google Play)
- Web (через Expo web)

### CI/CD
- Автоматические проверки (lint, tsc)
- Expo EAS Build
- Over-the-air updates

## Следующие шаги

См. также:
- [Компоненты](./components.md)
- [API Reference](./api-reference.md)
- [Схема базы данных](./data-schema.md)
