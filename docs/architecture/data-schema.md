# Схема данных Rork-Kiku

## Обзор

Приложение использует TypeScript типы для строгой типизации данных и AsyncStorage для персистентности.

## Основные типы данных

### User (Пользователь)

```typescript
type UserRole = 'parent' | 'child';

interface User {
  id: string;              // UUID пользователя
  name: string;            // Имя пользователя
  email: string;           // Email для аутентификации
  role: UserRole;          // Роль в системе
  avatar?: string;         // URI аватара (опционально)
  createdAt: Date;         // Дата создания
  lastActive: Date;        // Последняя активность
}
```

**Хранение**: `AsyncStorage` ключ `@user_profile`

---

### Chat (Чат)

```typescript
interface Chat {
  id: string;                  // UUID чата
  participants: string[];      // Массив ID участников
  participantNames: string[];  // Имена участников
  lastMessage?: string;        // Последнее сообщение
  lastMessageTime?: Date;      // Время последнего сообщения
  unreadCount: number;         // Количество непрочитанных
  riskLevel: RiskLevel;        // Уровень риска чата
  createdAt: Date;             // Дата создания
  isActive: boolean;           // Активен ли чат
}
```

**Хранение**: `AsyncStorage` ключ `@chats`  
**Связи**: Связан с Message через `chatId`

---

### Message (Сообщение)

```typescript
type MessageType = 'text' | 'image' | 'audio' | 'video';

interface Message {
  id: string;                      // UUID сообщения
  chatId: string;                  // ID чата
  senderId: string;                // ID отправителя
  senderName: string;              // Имя отправителя
  type: MessageType;               // Тип сообщения
  text?: string;                   // Текст (для text)
  imageUri?: string;               // URI изображения
  audioUri?: string;               // URI аудио
  videoUri?: string;               // URI видео
  timestamp: Date;                 // Время отправки
  isAnalyzed: boolean;             // Проанализировано ли AI
  isAnalyzing?: boolean;           // В процессе анализа
  riskAnalysis?: RiskAnalysis;     // Результат анализа
  metadata?: Record<string, any>;  // Дополнительные данные
}
```

**Хранение**: `AsyncStorage` ключ `@messages_{chatId}`  
**Связи**: Принадлежит Chat, может иметь Alert

---

### RiskLevel (Уровень риска)

```typescript
type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';
```

**Описание уровней**:
- `safe`: Безопасно, нет угроз
- `low`: Низкий риск, требует внимания
- `medium`: Средний риск, рекомендуется проверить
- `high`: Высокий риск, требует действий
- `critical`: Критический риск, немедленные действия

---

### RiskAnalysis (Анализ рисков)

```typescript
interface RiskAnalysis {
  level: RiskLevel;            // Уровень риска
  confidence: number;          // Уверенность AI (0-1)
  reasons: string[];           // Причины риска
  categories: string[];        // Категории (threats, privacy, fraud, etc.)
  shouldAlert: boolean;        // Создать алерт?
  detectedPatterns?: string[]; // Обнаруженные паттерны
  recommendations?: string[];  // Рекомендации
  analyzedAt: Date;            // Время анализа
}
```

**Вложен в**: Message

---

### Alert (Уведомление о риске)

```typescript
interface Alert {
  id: string;              // UUID алерта
  chatId: string;          // ID чата
  messageId: string;       // ID сообщения
  riskLevel: RiskLevel;    // Уровень риска
  reason: string;          // Причина алерта
  category: string;        // Категория угрозы
  timestamp: Date;         // Время создания
  isResolved: boolean;     // Решен ли
  resolvedAt?: Date;       // Время решения
  resolvedBy?: string;     // Кем решен (user ID)
  notes?: string;          // Заметки родителя
}
```

**Хранение**: `AsyncStorage` ключ `@alerts`  
**Связи**: Связан с Message и Chat

---

### ParentalSettings (Родительские настройки)

```typescript
interface ParentalSettings {
  aiModeration: boolean;           // Включена ли AI модерация
  imageFiltering: boolean;         // Фильтрация изображений
  sosEnabled: boolean;             // Включена ли кнопка SOS
  blockUnknown: boolean;           // Блокировать незнакомых
  requireApproval: boolean;        // Требовать одобрения
  autoResolveLevel?: RiskLevel;    // Авто-решение до уровня
  notifyOnLevels: RiskLevel[];     // На каких уровнях уведомлять
  dailyTimeLimit?: number;         // Лимит времени (минуты)
  allowedHours?: {                 // Разрешенные часы
    start: string;  // "09:00"
    end: string;    // "21:00"
  };
  restrictedDays?: number[];       // Запрещенные дни (0-6)
  updatedAt: Date;                 // Последнее обновление
  updatedBy: string;               // Кем обновлено
}
```

**Хранение**: `AsyncStorage` ключ `@parental_settings`

---

### SOSAlert (SOS Тревога)

```typescript
interface SOSAlert {
  id: string;              // UUID алерта
  childId: string;         // ID ребенка
  childName: string;       // Имя ребенка
  timestamp: Date;         // Время создания
  location?: {             // Геолокация
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;      // Адрес (если geocoded)
  };
  isResolved: boolean;     // Решен ли
  resolvedAt?: Date;       // Время решения
  response?: string;       // Ответ родителя
  notifiedGuardians: string[];  // Уведомленные опекуны
}
```

**Хранение**: `AsyncStorage` ключ `@sos_alerts`

---

### Contact (Контакт в белом списке)

```typescript
interface Contact {
  id: string;              // UUID контакта
  name: string;            // Имя
  phone?: string;          // Телефон
  email?: string;          // Email
  relationship: string;    // Отношение (friend, family, etc.)
  isApproved: boolean;     // Одобрен ли
  approvedAt?: Date;       // Когда одобрен
  approvedBy?: string;     // Кем одобрен
  notes?: string;          // Заметки
  addedAt: Date;           // Когда добавлен
}
```

**Хранение**: `AsyncStorage` ключ `@whitelisted_contacts`

---

### TimeRestriction (Временное ограничение)

```typescript
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday

interface TimeRestriction {
  id: string;              // UUID ограничения
  dayOfWeek: DayOfWeek;    // День недели
  startTime: string;       // Время начала "09:00"
  endTime: string;         // Время окончания "21:00"
  isEnabled: boolean;      // Включено ли
  dailyLimit?: number;     // Дневной лимит (минуты)
}
```

**Хранение**: `AsyncStorage` ключ `@time_restrictions`

---

### ComplianceLog (Лог соответствия COPPA/GDPR)

```typescript
type ComplianceAction = 
  | 'consent_granted'
  | 'consent_revoked'
  | 'settings_changed'
  | 'data_accessed'
  | 'data_deleted'
  | 'profile_created'
  | 'profile_updated';

interface ComplianceLog {
  id: string;                      // UUID записи
  action: ComplianceAction;        // Тип действия
  userId: string;                  // ID пользователя
  userRole: UserRole;              // Роль пользователя
  timestamp: Date;                 // Время действия
  details?: Record<string, any>;   // Детали действия
  ipAddress?: string;              // IP адрес (если применимо)
  deviceId?: string;               // ID устройства
}
```

**Хранение**: `AsyncStorage` ключ `@compliance_logs`

---

## Отношения между типами

```
User
  ├── owns → Chat (participants)
  └── creates → Message (senderId)

Chat
  ├── contains → Message[] (chatId)
  └── has → RiskLevel (calculated from messages)

Message
  ├── belongs to → Chat (chatId)
  ├── sent by → User (senderId)
  ├── has → RiskAnalysis (optional)
  └── may trigger → Alert

Alert
  ├── references → Message (messageId)
  └── references → Chat (chatId)

ParentalSettings
  └── configured by → User (parent role)

SOSAlert
  ├── created by → User (child role)
  └── notifies → GuardianEmails[]

Contact
  └── approved by → User (parent role)

TimeRestriction
  └── configured by → User (parent role)

ComplianceLog
  └── tracks → User actions
```

## Индексирование и поиск

### По AsyncStorage ключам
- `@user_profile`: User
- `@chats`: Chat[]
- `@messages_{chatId}`: Message[]
- `@alerts`: Alert[]
- `@parental_settings`: ParentalSettings
- `@sos_alerts`: SOSAlert[]
- `@whitelisted_contacts`: Contact[]
- `@time_restrictions`: TimeRestriction[]
- `@compliance_logs`: ComplianceLog[]
- `@guardian_emails`: string[]

### Поиск в памяти
Данные загружаются в Context и фильтруются в памяти:
- Поиск чатов по участникам
- Фильтрация алертов по статусу
- Фильтрация сообщений по риску

## Миграции данных

### Версионирование
```typescript
interface DataVersion {
  version: string;  // "1.0.0"
  migratedAt: Date;
}
```

**Хранение**: `AsyncStorage` ключ `@data_version`

### Стратегия миграции
При обновлении схемы:
1. Проверить версию данных
2. Применить миграции последовательно
3. Обновить версию
4. Создать backup (опционально)

## Валидация данных

### Zod схемы
Все типы имеют Zod схемы для валидации:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['parent', 'child']),
  avatar: z.string().optional(),
  createdAt: z.date(),
  lastActive: z.date(),
});
```

### Runtime валидация
```typescript
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

## Backup и восстановление

### Экспорт данных
```typescript
const exportAllData = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const data = await AsyncStorage.multiGet(keys);
  return JSON.stringify(data);
};
```

### Импорт данных
```typescript
const importData = async (jsonData: string) => {
  const data = JSON.parse(jsonData);
  await AsyncStorage.multiSet(data);
};
```

## Производительность

### Оптимизации
- Lazy loading сообщений (по chatId)
- Pagination для длинных списков
- Batch operations для AsyncStorage
- Debounce для поисковых запросов

### Лимиты
- AsyncStorage: ~6MB на iOS, ~10MB на Android
- Рекомендуется: < 5MB общего объема
- Cleanup старых сообщений при превышении

## Безопасность данных

### Шифрование
Чувствительные данные шифруются через expo-secure-store:
- User credentials
- Guardian emails
- Location data

### Sanitization
Все пользовательские данные sanitize перед сохранением:
```typescript
const sanitizeText = (text: string) => {
  return text.trim().replace(/[<>]/g, '');
};
```

## См. также
- [Обзор архитектуры](./overview.md)
- [Компоненты](./components.md)
- [API Reference](./api-reference.md)
