# API Reference - Rork-Kiku

## tRPC API Endpoints

### Base URL
- Production: `https://d8v7u672uumlfpscvnbps.rork.live/api/trpc`
- Development: `http://localhost:[PORT]/api/trpc`

## Endpoints

### Example Routes

#### `example.hi`
**Тип**: Query  
**Описание**: Тестовый endpoint для проверки связи

**Request**:
```typescript
// Нет параметров
```

**Response**:
```typescript
{
  message: string  // "Hello from tRPC!"
}
```

**Пример использования**:
```typescript
const { data } = trpc.example.hi.useQuery();
console.log(data?.message);
```

---

### Notification Routes

#### `notifications.registerDevice`
**Тип**: Mutation  
**Описание**: Регистрация устройства для push-уведомлений

**Request**:
```typescript
{
  token: string       // Expo push token
  platform: 'ios' | 'android' | 'web'
  deviceId?: string   // Уникальный ID устройства
}
```

**Response**:
```typescript
{
  success: boolean
  deviceId: string
  registered: Date
}
```

**Пример**:
```typescript
const registerDevice = trpc.notifications.registerDevice.useMutation();

await registerDevice.mutateAsync({
  token: expoPushToken,
  platform: Platform.OS,
  deviceId: Constants.deviceId
});
```

---

#### `notifications.getSyncStatus`
**Тип**: Query  
**Описание**: Получение статуса синхронизации уведомлений

**Request**:
```typescript
{
  deviceId: string
}
```

**Response**:
```typescript
{
  lastSync: Date | null
  pendingCount: number
  status: 'synced' | 'pending' | 'error'
}
```

**Пример**:
```typescript
const { data } = trpc.notifications.getSyncStatus.useQuery({
  deviceId: Constants.deviceId
});
```

---

#### `notifications.logDeviceTest`
**Тип**: Mutation  
**Описание**: Логирование тестового события для диагностики

**Request**:
```typescript
{
  deviceId: string
  event: string
  metadata?: Record<string, any>
}
```

**Response**:
```typescript
{
  success: boolean
  logId: string
  timestamp: Date
}
```

**Пример**:
```typescript
const logTest = trpc.notifications.logDeviceTest.useMutation();

await logTest.mutateAsync({
  deviceId: Constants.deviceId,
  event: 'notification_test',
  metadata: { testType: 'manual' }
});
```

---

## Client Configuration

### tRPC React Client

**Setup** (`lib/trpc.ts`):
```typescript
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();
```

**Features**:
- Type-safe запросы и мутации
- Автоматический retry (отключен)
- Cache management через React Query
- Timeout: 10 секунд
- SuperJSON transformer

### tRPC Vanilla Client

**Setup**:
```typescript
import { createTRPCClient } from "@trpc/client";

export const trpcVanillaClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '...' })]
});
```

**Использование**:
```typescript
// Для использования вне React компонентов
const result = await trpcVanillaClient.example.hi.query();
```

---

## Error Handling

### Client-side Errors

**Error Structure**:
```typescript
{
  message: string
  code: string
  data?: {
    httpStatus: number
    path: string
    stack?: string
  }
}
```

**Handling**:
```typescript
const { data, error, isError } = trpc.example.hi.useQuery();

if (isError) {
  console.error('API Error:', error.message);
  // Показать пользователю
}
```

### Server-side Errors

**Error Middleware** (`backend/hono.ts`):
```typescript
app.onError((err, c) => {
  console.error('[Hono] Error:', err);
  
  return c.json({
    error: {
      message: err.message || 'Internal server error',
      status: 'error',
    }
  }, 500);
});
```

**tRPC Error Handler**:
```typescript
trpcServer({
  router: appRouter,
  createContext,
  onError: ({ error, path }) => {
    console.error(`[tRPC] Error on ${path}:`, error);
  },
})
```

---

## Authentication

### Current State
- Нет аутентификации на API уровне (local-first app)
- Все данные хранятся локально
- Backend используется только для push-уведомлений

### Future Implementation
Когда понадобится аутентификация:

```typescript
// Protected Procedure
export const protectedProcedure = t.procedure
  .use(async ({ ctx, next }) => {
    const token = ctx.req.headers.get('authorization');
    
    if (!token) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    
    const user = await validateToken(token);
    
    return next({
      ctx: { ...ctx, user }
    });
  });
```

---

## Rate Limiting

### Current State
- Нет rate limiting (local-first)
- Timeout: 10 секунд на запрос

### Future Implementation
```typescript
// Rate limiter middleware
const rateLimiter = createMiddleware((opts) => {
  // Проверка лимитов
  // Throw error если превышен
  return opts.next();
});
```

---

## Query Optimization

### Cache Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,  // 5 минут
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
```

### Best Practices
1. Использовать `staleTime` для статичных данных
2. Отключить `retry` для быстрого фидбека
3. Использовать `refetchInterval` для реал-тайм данных
4. Invalidate queries после мутаций

---

## WebSocket Support (Planned)

Для реал-тайм обновлений:

```typescript
// Subscription example
const subscription = trpc.notifications.onNew.useSubscription({
  deviceId: Constants.deviceId
}, {
  onData: (notification) => {
    // Обработка нового уведомления
  }
});
```

---

## Testing API

### Unit Tests
```typescript
import { createCaller } from '@/backend/trpc/app-router';

describe('API Tests', () => {
  it('should return hi message', async () => {
    const caller = createCaller({});
    const result = await caller.example.hi();
    
    expect(result.message).toBe('Hello from tRPC!');
  });
});
```

### Integration Tests
```typescript
import { trpcVanillaClient } from '@/lib/trpc';

describe('Integration Tests', () => {
  it('should register device', async () => {
    const result = await trpcVanillaClient.notifications
      .registerDevice.mutate({
        token: 'test-token',
        platform: 'ios'
      });
    
    expect(result.success).toBe(true);
  });
});
```

---

## Performance Monitoring

### Logging
Все запросы логируются:
```typescript
console.log('[tRPC] Request:', url);
console.log('[tRPC] Response:', response.status);
console.error('[tRPC] Error:', error);
```

### Metrics
- Request duration
- Error rates
- Cache hit rates

---

## Future Endpoints

### Planned Routes

#### `messages.sync`
Синхронизация сообщений между устройствами

#### `ai.analyze`
Server-side AI анализ (для тяжелых моделей)

#### `users.updateProfile`
Обновление профиля пользователя

#### `chats.create`
Создание новых чатов

#### `alerts.notify`
Отправка алертов родителям

---

## См. также
- [Обзор архитектуры](./overview.md)
- [Компоненты](./components.md)
- [Схема данных](./data-schema.md)
