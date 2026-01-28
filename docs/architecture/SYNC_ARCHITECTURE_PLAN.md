# Архитектура синхронизации и Push-уведомлений
## Анализ лучших практик и оптимальный подход для KIKU

### 📚 Изученный опыт

#### Мессенджеры (Telegram, WhatsApp, Signal):
1. **Offline-First архитектура** - данные всегда доступны локально
2. **Delta Sync** - синхронизация только изменений (инкрементальная)
3. **Queue-based Sync** - очередь синхронизации с приоритетами
4. **Background Sync** - фоновая синхронизация без блокировки UI
5. **Retry с exponential backoff** - надежная доставка с повторными попытками

#### Приложения безопасности:
1. **Event-driven push** - push-уведомления на основе событий (не polling)
2. **Analytics integration** - отслеживание доставки, открытий, ошибок
3. **Priority levels** - приоритеты для критических событий
4. **Batching** - группировка для оптимизации

### 🎯 Рекомендуемый подход для KIKU

#### 1. **Сервис синхронизации (SyncService)**
```
utils/syncService.ts
- Queue для pending sync операций
- Background sync с интервалом
- Delta sync через lastSyncTimestamp (уже есть в backend)
- Retry логика с exponential backoff
- Conflict resolution (last-write-wins с timestamp)
```

**Паттерн**: Queue + Background Worker

#### 2. **Push Notifications Backend**
```
backend/trpc/routes/notifications/send-push.ts
- Expo Push API integration
- Batch отправка (для оптимизации)
- Analytics hooks (доставка, ошибки)
- Priority handling (critical/high/normal)
```

**Паттерн**: API Gateway + Analytics Layer

#### 3. **Frontend интеграция**
```
MonitoringContext.tsx:
- Alert создается → добавляется в sync queue
- Sync service периодически синхронизирует
- Push notification отправляется через backend (если critical/high)

ParentalControlsContext.tsx:
- SOS trigger → immediate sync + push
- Использует тот же sync service
```

**Паттерн**: Event-Driven + Lazy Sync

#### 4. **Analytics для Push**
```
AnalyticsContext.tsx:
- События: push_sent, push_delivered, push_failed, push_opened
- Метрики: sent, delivered, failed, opened, successRate
- Интеграция через callback'и из sync service
```

**Паттерн**: Event Tracking + Metrics

### 📋 План реализации (по приоритету)

#### Фаза 1: Базовая инфраструктура
1. ✅ Создать `utils/retryUtils.ts` (retry с exponential backoff)
2. ✅ Создать `utils/syncService.ts` (sync queue + background worker)
3. ✅ Реализовать backend `send-push.ts` (Expo Push API)

#### Фаза 2: Интеграция с MonitoringContext
4. ✅ Интегрировать sync service в MonitoringContext
5. ✅ Добавить синхронизацию alerts при создании
6. ✅ Добавить push notifications для critical/high рисков

#### Фаза 3: Аналитика
7. ✅ Добавить события push в AnalyticsContext
8. ✅ Интегрировать tracking в sync service
9. ✅ Добавить метрики push в AnalyticsMetrics

#### Фаза 4: Оптимизация (опционально)
10. Batching для синхронизации
11. Background sync optimization
12. Push notification grouping

### 🔑 Ключевые принципы

1. **Offline-First**: Все данные доступны локально, синхронизация - фоновая
2. **Event-Driven**: Push отправляется при событиях, не polling
3. **Fault-Tolerant**: Retry логика, graceful degradation
4. **Observable**: Полная аналитика всех операций
5. **Separation of Concerns**: Отдельные сервисы для sync и push

### 📊 Архитектурная схема

```
┌─────────────────┐
│ MonitoringContext│
│   (создает Alert)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sync Service   │───► Queue (pending alerts)
│  (utils/sync)   │    │
└────────┬────────┘    │
         │             │ (background worker)
         │             ▼
         │      ┌──────────────┐
         │      │ Backend Sync │
         │      │  (tRPC)      │
         │      └──────┬───────┘
         │             │
         │             ▼
         │      ┌──────────────┐
         │      │ Push Service │───► Expo Push API
         │      │  (backend)   │
         │      └──────┬───────┘
         │             │
         ▼             ▼
┌─────────────────────────────────┐
│    Analytics Context            │
│  (track events + metrics)       │
└─────────────────────────────────┘
```

### ✅ Преимущества подхода

1. **Надежность**: Retry логика + queue = гарантированная доставка
2. **Производительность**: Background sync не блокирует UI
3. **Масштабируемость**: Queue pattern позволяет обрабатывать пики
4. **Отслеживаемость**: Полная аналитика всех операций
5. **Гибкость**: Легко добавить новые типы синхронизации
