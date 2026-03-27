# 🚀 Стратегия версионирования: от v1 к v2 без потерь

## 🎯 Проблема

**Риск:** v1 может стать техническим долгом, который придётся "выбросить" из-за:
- Накопленных изменений
- Потраченного времени
- Потраченных средств
- Невозможности миграции

**Решение:** Правильная стратегия версионирования с миграциями

---

## 📋 Принципы стратегии

### 1. **Обратная совместимость**
- v2 должен работать с данными v1
- v1 должен работать с данными v2 (если возможно)
- Плавный переход без потери данных

### 2. **Версионирование на всех уровнях**
- Версия данных (Data Version)
- Версия API (API Version)
- Версия схем (Schema Version)
- Версия приложения (App Version)

### 3. **Автоматические миграции**
- Автоматическое обновление данных при запуске
- Сохранение старых данных для отката
- Логирование всех миграций

### 4. **Постепенный переход**
- Поддержка обеих версий одновременно
- Постепенная миграция пользователей
- Возможность отката

---

## 🏗️ Архитектура версионирования

### Уровень 1: Версия данных (Data Version)

```typescript
// constants/dataVersion.ts
export const CURRENT_DATA_VERSION = 2;
export const SUPPORTED_VERSIONS = [1, 2];

export interface VersionedData {
  version: number;
  data: any;
  migratedAt?: number;
  migratedFrom?: number;
}
```

**Использование:**
```typescript
// При сохранении данных
const versionedData: VersionedData = {
  version: CURRENT_DATA_VERSION,
  data: actualData,
  migratedAt: Date.now(),
};

// При загрузке данных
const { version, data } = await loadVersionedData();
if (version < CURRENT_DATA_VERSION) {
  data = await migrateData(data, version, CURRENT_DATA_VERSION);
}
```

---

### Уровень 2: Версия схем (Schema Version)

```typescript
// constants/schemas/v1.ts
export interface MessageV1 {
  id: string;
  text: string;
  timestamp: number;
  riskLevel: RiskLevel;
}

// constants/schemas/v2.ts
export interface MessageV2 {
  id: string;
  text: string;
  timestamp: number;
  riskLevel: RiskLevel;
  // Новые поля
  metadata?: {
    source: 'sms' | 'whatsapp' | 'telegram';
    editedAt?: number;
    reactions?: string[];
  };
  version: 2; // Версия схемы
}
```

---

### Уровень 3: Версия API (API Version)

```typescript
// backend/trpc/routers/v1/messages.ts
export const messagesRouterV1 = router({
  getMessages: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      // v1 логика
    }),
});

// backend/trpc/routers/v2/messages.ts
export const messagesRouterV2 = router({
  getMessages: publicProcedure
    .input(z.object({ 
      chatId: z.string(),
      includeMetadata: z.boolean().optional(), // Новое поле
    }))
    .query(async ({ input }) => {
      // v2 логика
    }),
});

// Поддержка обеих версий
export const appRouter = router({
  v1: messagesRouterV1,
  v2: messagesRouterV2,
});
```

---

## 🔄 Система миграций

### Структура миграций

```typescript
// utils/migrations/types.ts
export interface Migration {
  fromVersion: number;
  toVersion: number;
  name: string;
  migrate: (data: any) => Promise<any>;
  rollback?: (data: any) => Promise<any>;
}
```

### Пример миграции

```typescript
// utils/migrations/v1-to-v2.ts
export const migrationV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add metadata to messages',
  
  async migrate(data: any) {
    // Миграция данных
    if (data.messages) {
      data.messages = data.messages.map((msg: MessageV1) => ({
        ...msg,
        metadata: {
          source: 'sms', // Дефолтное значение
        },
        version: 2,
      }));
    }
    
    // Обновление версии
    data.version = 2;
    data.migratedAt = Date.now();
    data.migratedFrom = 1;
    
    return data;
  },
  
  async rollback(data: any) {
    // Откат миграции
    if (data.messages) {
      data.messages = data.messages.map((msg: MessageV2) => {
        const { metadata, version, ...rest } = msg;
        return rest;
      });
    }
    
    data.version = 1;
    return data;
  },
};
```

### Менеджер миграций

```typescript
// utils/migrations/migrationManager.ts
export class MigrationManager {
  private migrations: Migration[] = [];
  
  register(migration: Migration) {
    this.migrations.push(migration);
  }
  
  async migrate(data: any, fromVersion: number, toVersion: number) {
    let currentData = data;
    let currentVersion = fromVersion;
    
    while (currentVersion < toVersion) {
      const migration = this.migrations.find(
        m => m.fromVersion === currentVersion && m.toVersion === currentVersion + 1
      );
      
      if (!migration) {
        throw new Error(`No migration found from ${currentVersion} to ${currentVersion + 1}`);
      }
      
      // Сохраняем резервную копию
      await this.saveBackup(currentData, currentVersion);
      
      // Выполняем миграцию
      currentData = await migration.migrate(currentData);
      currentVersion = migration.toVersion;
      
      console.log(`Migrated from ${migration.fromVersion} to ${migration.toVersion}`);
    }
    
    return currentData;
  }
  
  private async saveBackup(data: any, version: number) {
    // Сохраняем резервную копию для отката
    await AsyncStorage.setItem(
      `@backup_v${version}_${Date.now()}`,
      JSON.stringify(data)
    );
  }
}
```

---

## 📊 Версионирование в контекстах

### AnalyticsContext с версионированием

```typescript
// constants/AnalyticsContext.tsx
const ANALYTICS_STORAGE_KEY = '@kiku_analytics';
const ANALYTICS_VERSION_KEY = '@kiku_analytics_version';
const CURRENT_ANALYTICS_VERSION = 2;

export const [AnalyticsProvider, useAnalytics] = createContextHook(() => {
  const [events, setEvents] = useState<AnalyticsEventData[]>([]);
  const migrationManager = useMemo(() => new MigrationManager(), []);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные
        const data = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
        const version = await AsyncStorage.getItem(ANALYTICS_VERSION_KEY);
        
        if (!data) return;
        
        let parsedData = JSON.parse(data);
        const currentVersion = version ? parseInt(version, 10) : 1;
        
        // Мигрируем если нужно
        if (currentVersion < CURRENT_ANALYTICS_VERSION) {
          parsedData = await migrationManager.migrate(
            parsedData,
            currentVersion,
            CURRENT_ANALYTICS_VERSION
          );
          
          // Сохраняем мигрированные данные
          await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(parsedData));
          await AsyncStorage.setItem(ANALYTICS_VERSION_KEY, String(CURRENT_ANALYTICS_VERSION));
        }
        
        setEvents(parsedData.events || []);
      } catch (error) {
        console.error('[AnalyticsContext] Migration error:', error);
      }
    };
    
    loadData();
  }, []);
  
  // ... остальной код
});
```

---

## 🔧 Практическая реализация

### Шаг 1: Создать систему версионирования

```typescript
// utils/versioning.ts
export const APP_DATA_VERSION = 2;
export const API_VERSION = 2;

export interface VersionInfo {
  appVersion: string; // "1.0.0"
  dataVersion: number; // 2
  apiVersion: number; // 2
  schemaVersion: number; // 2
}

export function getVersionInfo(): VersionInfo {
  return {
    appVersion: require('../package.json').version,
    dataVersion: APP_DATA_VERSION,
    apiVersion: API_VERSION,
    schemaVersion: APP_DATA_VERSION,
  };
}
```

### Шаг 2: Создать миграции для каждого контекста

```typescript
// utils/migrations/analytics/v1-to-v2.ts
export const analyticsV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add session tracking to analytics',
  
  async migrate(data: any) {
    // Добавляем новые поля к событиям
    if (data.events) {
      data.events = data.events.map((event: any) => ({
        ...event,
        sessionId: event.sessionId || generateSessionId(),
        deviceId: event.deviceId || getDeviceId(),
      }));
    }
    
    data.version = 2;
    return data;
  },
};
```

### Шаг 3: Интегрировать в каждый контекст

```typescript
// constants/MonitoringContext.tsx
const MESSAGES_STORAGE_KEY = '@kiku_messages';
const MESSAGES_VERSION_KEY = '@kiku_messages_version';
const CURRENT_MESSAGES_VERSION = 2;

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>([]);
  const migrationManager = useMemo(() => new MigrationManager(), []);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        const version = await AsyncStorage.getItem(MESSAGES_VERSION_KEY);
        
        if (!data) return;
        
        let parsedData = JSON.parse(data);
        const currentVersion = version ? parseInt(version, 10) : 1;
        
        // Миграция
        if (currentVersion < CURRENT_MESSAGES_VERSION) {
          parsedData = await migrationManager.migrate(
            parsedData,
            currentVersion,
            CURRENT_MESSAGES_VERSION
          );
          
          await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(parsedData));
          await AsyncStorage.setItem(MESSAGES_VERSION_KEY, String(CURRENT_MESSAGES_VERSION));
        }
        
        setChats(parsedData.chats || []);
      } catch (error) {
        console.error('[MonitoringContext] Migration error:', error);
      }
    };
    
    loadData();
  }, []);
  
  // ... остальной код
});
```

---

## 📋 Чеклист внедрения

### Фаза 1: Подготовка (неделя 1)
- [ ] Создать систему версионирования
- [ ] Создать менеджер миграций
- [ ] Определить версии для всех данных
- [ ] Создать схемы v1 и v2

### Фаза 2: Миграции (неделя 2)
- [ ] Создать миграции для AnalyticsContext
- [ ] Создать миграции для MonitoringContext
- [ ] Создать миграции для UserContext
- [ ] Создать миграции для ParentalControlsContext

### Фаза 3: Интеграция (неделя 3)
- [ ] Интегрировать миграции в контексты
- [ ] Добавить версионирование в API
- [ ] Тестирование миграций
- [ ] Создать резервные копии

### Фаза 4: Тестирование (неделя 4)
- [ ] Тесты миграций
- [ ] Тесты отката
- [ ] Тесты обратной совместимости
- [ ] Production тестирование

---

## 🎯 Преимущества стратегии

### 1. **Нет потери данных**
- ✅ Все данные v1 мигрируются в v2
- ✅ Резервные копии для отката
- ✅ Логирование всех миграций

### 2. **Плавный переход**
- ✅ Поддержка обеих версий
- ✅ Постепенная миграция
- ✅ Возможность отката

### 3. **Масштабируемость**
- ✅ Легко добавить v3, v4, v5
- ✅ Переиспользуемые миграции
- ✅ Автоматизация процесса

### 4. **Безопасность**
- ✅ Резервные копии
- ✅ Валидация данных
- ✅ Обработка ошибок

---

## 🚀 Пример использования

```typescript
// При обновлении приложения
const versionInfo = getVersionInfo();
console.log('Current version:', versionInfo);

// Автоматическая миграция при запуске
const migrationManager = new MigrationManager();
migrationManager.register(analyticsV1ToV2);
migrationManager.register(messagesV1ToV2);

// Миграция данных
const migratedData = await migrationManager.migrate(
  oldData,
  1, // from version
  2  // to version
);
```

---

## 📝 Итог

**С этой стратегией:**
- ✅ v1 не станет техническим долгом
- ✅ Плавный переход к v2
- ✅ Нет потери данных
- ✅ Возможность отката
- ✅ Масштабируемость на будущее

**v1 не нужно "выбрасывать" - он плавно мигрирует в v2!** 🚀
