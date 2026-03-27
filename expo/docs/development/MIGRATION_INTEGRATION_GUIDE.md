# 🔄 Руководство по интеграции системы миграций

## ✅ Что уже сделано

### 1. Система версионирования
- ✅ `utils/versioning.ts` - базовые функции версионирования
- ✅ `utils/migrations/types.ts` - типы для миграций
- ✅ `utils/migrations/migrationManager.ts` - менеджер миграций

### 2. Примеры миграций
- ✅ `utils/migrations/analytics/v1-to-v2.ts` - миграция аналитики
- ✅ `utils/migrations/messages/v1-to-v2.ts` - миграция сообщений
- ✅ `utils/migrations/user/v1-to-v2.ts` - миграция пользователя

### 3. Интеграция
- ✅ `constants/AnalyticsContext.tsx` - интегрирована система миграций

---

## 📋 Как интегрировать в другие контексты

### Шаг 1: Импортировать необходимые функции

```typescript
import { 
  getStoredVersion, 
  saveStoredVersion, 
  needsMigration, 
  APP_DATA_VERSION 
} from '@/utils/versioning';
import { getMigrationManager } from '@/utils/migrations';

const CURRENT_DATA_VERSION = APP_DATA_VERSION; // или своя версия
const STORAGE_KEY = '@your_storage_key';
```

### Шаг 2: Обновить функцию загрузки данных

```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      let parsed = JSON.parse(stored);
      
      // Проверяем версию
      const currentVersion = parsed.version || 1;
      
      // Если нужна миграция
      if (needsMigration(currentVersion, CURRENT_DATA_VERSION)) {
        console.log(`[Context] Migrating from ${currentVersion} to ${CURRENT_DATA_VERSION}`);
        
        const migrationManager = getMigrationManager();
        const result = await migrationManager.migrate(
          parsed,
          currentVersion,
          CURRENT_DATA_VERSION
        );

        if (result.success) {
          parsed = result.data;
          
          // Сохраняем мигрированные данные
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          await saveStoredVersion(STORAGE_KEY, CURRENT_DATA_VERSION);
        }
      }

      // Используем данные
      setData(parsed.data || parsed);
    } catch (error) {
      console.error('[Context] Failed to load data:', error);
    }
  };
  
  loadData();
}, []);
```

### Шаг 3: Обновить функцию сохранения данных

```typescript
const saveData = useCallback(async (data: YourDataType) => {
  try {
    // Сохраняем в новом формате с версией
    const versionedData = {
      version: CURRENT_DATA_VERSION,
      data,
      updatedAt: Date.now(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(versionedData));
    await saveStoredVersion(STORAGE_KEY, CURRENT_DATA_VERSION);
  } catch (error) {
    console.error('[Context] Failed to save data:', error);
  }
}, []);
```

---

## 📝 Пример: MonitoringContext

```typescript
// constants/MonitoringContext.tsx
import { getStoredVersion, saveStoredVersion, needsMigration, APP_DATA_VERSION } from '@/utils/versioning';
import { getMigrationManager } from '@/utils/migrations';

const CHATS_STORAGE_KEY = '@kiku_chats';
const CURRENT_CHATS_VERSION = APP_DATA_VERSION;

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const stored = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
        if (!stored) return;

        let parsed = JSON.parse(stored);
        const currentVersion = parsed.version || 1;
        
        if (needsMigration(currentVersion, CURRENT_CHATS_VERSION)) {
          const migrationManager = getMigrationManager();
          const result = await migrationManager.migrate(
            parsed,
            currentVersion,
            CURRENT_CHATS_VERSION
          );

          if (result.success) {
            parsed = result.data;
            await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(parsed));
            await saveStoredVersion(CHATS_STORAGE_KEY, CURRENT_CHATS_VERSION);
          }
        }

        setChats(parsed.chats || parsed.data || []);
      } catch (error) {
        console.error('[MonitoringContext] Failed to load chats:', error);
      }
    };
    
    loadChats();
  }, []);

  // ... остальной код
});
```

---

## 📝 Пример: UserContext

```typescript
// constants/UserContext.tsx
import { getStoredVersion, saveStoredVersion, needsMigration, APP_DATA_VERSION } from '@/utils/versioning';
import { getMigrationManager } from '@/utils/migrations';

const USER_STORAGE_KEY = '@user_data';
const CURRENT_USER_VERSION = APP_DATA_VERSION;

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (!stored) return;

        let parsed = JSON.parse(stored);
        const currentVersion = parsed.version || 1;
        
        if (needsMigration(currentVersion, CURRENT_USER_VERSION)) {
          const migrationManager = getMigrationManager();
          const result = await migrationManager.migrate(
            parsed,
            currentVersion,
            CURRENT_USER_VERSION
          );

          if (result.success) {
            parsed = result.data;
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
            await saveStoredVersion(USER_STORAGE_KEY, CURRENT_USER_VERSION);
          }
        }

        setUser(parsed.user || parsed.data || parsed);
      } catch (error) {
        console.error('[UserContext] Failed to load user:', error);
      }
    };
    
    loadUser();
  }, []);

  // ... остальной код
});
```

---

## 🎯 Создание новой миграции

### Шаг 1: Создать файл миграции

```typescript
// utils/migrations/yourContext/v1-to-v2.ts
import { Migration } from '../types';

export const yourContextV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add new fields to your data',
  description: 'Описание миграции',

  async migrate(data: any) {
    // Логика миграции
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        newField: 'defaultValue',
        version: 2,
      }));
    }

    data.version = 2;
    data.migratedAt = Date.now();
    data.migratedFrom = 1;

    return data;
  },

  async rollback(data: any) {
    // Логика отката
    if (data.items) {
      data.items = data.items.map((item: any) => {
        const { newField, version, ...rest } = item;
        return rest;
      });
    }

    data.version = 1;
    return data;
  },
};
```

### Шаг 2: Зарегистрировать миграцию

```typescript
// utils/migrations/index.ts
import { yourContextV1ToV2 } from './yourContext/v1-to-v2';

export function createMigrationManager(): MigrationManager {
  const manager = new MigrationManager();

  // Регистрируем все миграции
  manager.register(analyticsV1ToV2);
  manager.register(messagesV1ToV2);
  manager.register(userV1ToV2);
  manager.register(yourContextV1ToV2); // Новая миграция

  return manager;
}
```

---

## ✅ Чеклист интеграции

- [ ] Импортировать функции версионирования
- [ ] Определить CURRENT_DATA_VERSION
- [ ] Обновить функцию загрузки данных
- [ ] Обновить функцию сохранения данных
- [ ] Создать миграцию (если нужно)
- [ ] Зарегистрировать миграцию
- [ ] Протестировать миграцию

---

## 🧪 Тестирование миграций

```typescript
// __tests__/unit/utils/migrations/analytics.test.ts
import { analyticsV1ToV2 } from '@/utils/migrations/analytics/v1-to-v2';

describe('analyticsV1ToV2', () => {
  it('должен мигрировать события с версии 1 на версию 2', async () => {
    const v1Data = {
      version: 1,
      events: [
        { event: 'message_sent', timestamp: Date.now() },
      ],
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.version).toBe(2);
    expect(migrated.events[0].sessionId).toBeDefined();
    expect(migrated.events[0].deviceId).toBeDefined();
  });

  it('должен откатывать миграцию', async () => {
    const v2Data = {
      version: 2,
      events: [
        { 
          event: 'message_sent', 
          timestamp: Date.now(),
          sessionId: 'session_123',
          deviceId: 'device_123',
        },
      ],
    };

    const rolledBack = await analyticsV1ToV2.rollback!(v2Data);

    expect(rolledBack.version).toBe(1);
    expect(rolledBack.events[0].sessionId).toBeUndefined();
  });
});
```

---

## 🚀 Итог

**Система миграций готова к использованию!**

- ✅ Базовые функции версионирования
- ✅ Менеджер миграций
- ✅ Примеры миграций
- ✅ Интеграция в AnalyticsContext
- ✅ Документация

**Следующие шаги:**
1. Интегрировать в другие контексты
2. Создать миграции для новых версий
3. Протестировать миграции

---

**Теперь v1 плавно мигрирует в v2 без потери данных!** 🎯
