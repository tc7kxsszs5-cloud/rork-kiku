# 🔄 Реализация Backend синхронизации - План и прогресс

## ✅ Шаг 1: Создан SyncService (ЗАВЕРШЕНО)

**Файл:** `utils/syncService.ts`

**Что сделано:**
- ✅ `ChatSyncService` - синхронизация чатов
- ✅ `AlertSyncService` - синхронизация алертов  
- ✅ `SettingsSyncService` - синхронизация настроек
- ✅ `getDeviceId()` - получение/создание уникального deviceId
- ✅ Поддержка incremental sync (delta sync)
- ✅ Хранение lastSyncTimestamp в AsyncStorage

**Структура:**
```typescript
// Сервисы готовы к использованию:
import { chatSyncService, alertSyncService, settingsSyncService } from '@/utils/syncService';

// Использование:
const result = await chatSyncService.syncChats(chats);
const result = await chatSyncService.getChats();
```

---

## 🚧 Шаг 2: Интеграция в MonitoringContext (СЛЕДУЮЩИЙ ШАГ)

**Файл:** `constants/MonitoringContext.tsx`

**Что нужно сделать:**

1. **Импортировать сервисы:**
```typescript
import { chatSyncService, alertSyncService } from '@/utils/syncService';
```

2. **Добавить состояние синхронизации:**
```typescript
const [isSyncing, setIsSyncing] = useState(false);
const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
const [syncError, setSyncError] = useState<Error | null>(null);
```

3. **Добавить функцию синхронизации:**
```typescript
const syncData = useCallback(async () => {
  if (!isMountedRef.current) return;
  
  setIsSyncing(true);
  setSyncError(null);
  
  try {
    // Синхронизация чатов
    const chatsResult = await chatSyncService.syncChats(chats);
    if (chatsResult.success && chatsResult.data.length > 0) {
      setChats(chatsResult.data);
    }
    
    // Получение изменений с сервера
    const serverChatsResult = await chatSyncService.getChats();
    if (serverChatsResult.success && serverChatsResult.data.length > 0) {
      // Merge с локальными чатами
      const mergedChats = mergeChatsWithServer(chats, serverChatsResult.data);
      setChats(mergedChats);
    }
    
    // Синхронизация алертов
    const alertsResult = await alertSyncService.syncAlerts(alerts);
    if (alertsResult.success && alertsResult.data.length > 0) {
      setAlerts(alertsResult.data);
    }
    
    setLastSyncTimestamp(Date.now());
  } catch (error) {
    console.error('[MonitoringContext] Sync error:', error);
    setSyncError(error instanceof Error ? error : new Error('Sync failed'));
  } finally {
    setIsSyncing(false);
  }
}, [chats, alerts]);
```

4. **Автоматическая синхронизация при изменениях:**
```typescript
// После addMessage - синхронизировать чаты
useEffect(() => {
  if (chats.length > 0) {
    const timer = setTimeout(() => {
      syncData();
    }, 2000); // Debounce 2 секунды
    
    return () => clearTimeout(timer);
  }
}, [chats]);
```

5. **Синхронизация при загрузке:**
```typescript
useEffect(() => {
  if (isMountedRef.current) {
    // Первая синхронизация при загрузке
    syncData();
    
    // Периодическая синхронизация каждые 30 секунд
    const interval = setInterval(() => {
      syncData();
    }, 30000);
    
    return () => clearInterval(interval);
  }
}, []);
```

6. **Экспорт состояния синхронизации:**
```typescript
return useMemo(() => ({
  chats,
  alerts,
  // ... existing
  isSyncing,
  lastSyncTimestamp,
  syncError,
  syncData, // Функция для ручной синхронизации
}), [chats, alerts, isSyncing, lastSyncTimestamp, syncError, syncData]);
```

---

## 🚧 Шаг 3: Интеграция в ParentalControlsContext

**Файл:** `constants/ParentalControlsContext.tsx`

**Что нужно сделать:**

1. **Импортировать сервис:**
```typescript
import { settingsSyncService } from '@/utils/syncService';
```

2. **Добавить синхронизацию настроек:**
```typescript
const syncSettings = useCallback(async () => {
  try {
    const result = await settingsSyncService.syncSettings(settings);
    if (result.success && result.data) {
      // Обновить настройки с сервера
      setSettings(result.data);
    }
  } catch (error) {
    console.error('[ParentalControlsContext] Sync error:', error);
  }
}, [settings]);
```

3. **Синхронизация при изменении настроек:**
```typescript
const updateSettings = useCallback(async (updates: Partial<ParentalSettings>, userId: string) => {
  // ... existing update logic ...
  
  // После сохранения - синхронизировать
  await syncSettings();
}, [syncSettings]);
```

---

## 🚧 Шаг 4: Индикатор статуса синхронизации в UI

**Файл:** `components/SyncStatusIndicator.tsx` (новый)

**Что нужно создать:**

```typescript
import { View, Text, ActivityIndicator } from 'react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useTheme } from '@/constants/ThemeContext';

export const SyncStatusIndicator = () => {
  const { isSyncing, lastSyncTimestamp, syncError } = useMonitoring();
  const theme = useTheme();
  
  if (syncError) {
    return (
      <View style={{ ... }}>
        <Text>Ошибка синхронизации</Text>
      </View>
    );
  }
  
  if (isSyncing) {
    return (
      <View style={{ ... }}>
        <ActivityIndicator />
        <Text>Синхронизация...</Text>
      </View>
    );
  }
  
  if (lastSyncTimestamp) {
    const timeAgo = formatTimeAgo(lastSyncTimestamp);
    return (
      <View style={{ ... }}>
        <Text>Обновлено {timeAgo}</Text>
      </View>
    );
  }
  
  return null;
};
```

**Интеграция в экран:**
```typescript
// app/(tabs)/index.tsx
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator';

// В компоненте:
<SyncStatusIndicator />
```

---

## 🚧 Шаг 5: Обработка конфликтов при синхронизации

**Что нужно реализовать:**

1. **Merge логика для чатов:**
```typescript
const mergeChatsWithServer = (localChats: Chat[], serverChats: Chat[]): Chat[] => {
  const chatMap = new Map<string, Chat>();
  
  // Добавляем серверные чаты
  serverChats.forEach(chat => chatMap.set(chat.id, chat));
  
  // Объединяем с локальными (приоритет последнего обновления)
  localChats.forEach(localChat => {
    const serverChat = chatMap.get(localChat.id);
    if (!serverChat) {
      chatMap.set(localChat.id, localChat);
    } else {
      // Last-write-wins для конфликтов
      const localLastActivity = localChat.lastActivity || 0;
      const serverLastActivity = serverChat.lastActivity || 0;
      
      if (localLastActivity > serverLastActivity) {
        chatMap.set(localChat.id, localChat);
      } else {
        // Объединяем сообщения
        const mergedMessages = mergeMessages(
          serverChat.messages,
          localChat.messages
        );
        chatMap.set(localChat.id, {
          ...serverChat,
          messages: mergedMessages,
        });
      }
    }
  });
  
  return Array.from(chatMap.values());
};

const mergeMessages = (server: Message[], local: Message[]): Message[] => {
  const messageMap = new Map<string, Message>();
  
  [...server, ...local].forEach(msg => {
    const existing = messageMap.get(msg.id);
    if (!existing || (msg.timestamp > existing.timestamp)) {
      messageMap.set(msg.id, msg);
    }
  });
  
  return Array.from(messageMap.values()).sort((a, b) => a.timestamp - b.timestamp);
};
```

---

## 📋 Чеклист реализации

- [x] **Шаг 1:** Создать SyncService
- [ ] **Шаг 2:** Интегрировать в MonitoringContext
- [ ] **Шаг 3:** Интегрировать в ParentalControlsContext
- [ ] **Шаг 4:** Добавить индикатор статуса в UI
- [ ] **Шаг 5:** Реализовать обработку конфликтов
- [ ] **Шаг 6:** Тестирование синхронизации
- [ ] **Шаг 7:** Документация

---

## 🎯 Следующий шаг

**Начать с Шага 2: Интеграция в MonitoringContext**

Это самое важное - интегрировать синхронизацию чатов и алертов, чтобы данные синхронизировались между устройствами.

---

**Статус:** Шаг 1 завершен ✅  
**Следующий шаг:** Интеграция в MonitoringContext  
**Оценка времени:** 2-3 часа работы
