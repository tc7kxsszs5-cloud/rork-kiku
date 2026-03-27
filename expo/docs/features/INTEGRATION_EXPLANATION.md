# 📖 ОБЪЯСНЕНИЕ: Что значит "интегрировать в код"

## ❓ Вопрос 1: Нужно ли интегрировать тесты в код?

### ❌ НЕТ! Тесты НЕ нужно интегрировать в код

**Тесты работают отдельно:**
- Тесты находятся в папке `__tests__/`
- Они запускаются командой `bun run test`
- Они проверяют код, но не являются частью приложения
- **Тесты уже готовы и работают!**

**Что значит "интегрировать":**
- Это про **logger** и **errorHandler** - их нужно использовать в коде приложения
- Тесты уже написаны и работают отдельно

---

## ❓ Вопрос 2: Что значит "заменить console.log на logger"?

### Объяснение с примерами:

#### 🔴 БЫЛО (старый способ):

```typescript
// В MonitoringContext.tsx или других файлах
console.log('User logged in');
console.error('Error occurred:', error);
console.warn('Warning message');
```

**Проблемы:**
- ❌ В production все логи видны в консоли
- ❌ Нет структурированного формата
- ❌ Нет уровней важности
- ❌ Нет контекста (userId, chatId и т.д.)
- ❌ Нет возможности отправить в Sentry

#### ✅ СТАЛО (новый способ):

```typescript
// В начале файла добавить импорт
import { logger } from '@/utils/logger';

// Вместо console.log
logger.info('User logged in', { userId: '123', timestamp: Date.now() });

// Вместо console.error
logger.error('Error occurred', error, { chatId: 'abc', context: 'addMessage' });

// Вместо console.warn
logger.warn('Warning message', { reason: 'low memory' });
```

**Преимущества:**
- ✅ Структурированный формат
- ✅ Уровни важности (debug, info, warn, error, critical)
- ✅ Контекст (userId, chatId и т.д.)
- ✅ Готовность к отправке в Sentry
- ✅ Буферизация (можно посмотреть последние 100 логов)

---

## 📝 КОНКРЕТНЫЕ ПРИМЕРЫ ЗАМЕНЫ

### Пример 1: MonitoringContext.tsx

**БЫЛО:**
```typescript
const addMessage = async (...) => {
  try {
    console.log('[MonitoringContext] Adding message');
    // ... код
    console.log('[MonitoringContext] Message added');
  } catch (error) {
    console.error('[MonitoringContext] Error:', error);
  }
};
```

**СТАЛО:**
```typescript
import { logger } from '@/utils/logger';

const addMessage = async (...) => {
  try {
    logger.info('Adding message', { chatId, senderId });
    // ... код
    logger.info('Message added successfully', { messageId: newMessage.id });
  } catch (error) {
    logger.error('Failed to add message', error, { chatId, senderId });
  }
};
```

### Пример 2: ParentalControlsContext.tsx

**БЫЛО:**
```typescript
const triggerSOS = async (...) => {
  try {
    console.log('SOS triggered');
    // ... код
  } catch (error) {
    console.error('SOS error:', error);
  }
};
```

**СТАЛО:**
```typescript
import { logger } from '@/utils/logger';

const triggerSOS = async (...) => {
  try {
    logger.info('SOS triggered', { userId, chatId, location });
    // ... код
    logger.critical('SOS alert created', null, { sosId: sosAlert.id });
  } catch (error) {
    logger.critical('Failed to trigger SOS', error, { userId });
  }
};
```

### Пример 3: AuthContext.tsx

**БЫЛО:**
```typescript
const registerParent = async (...) => {
  try {
    console.log('Registering parent');
    // ... код
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

**СТАЛО:**
```typescript
import { logger } from '@/utils/logger';

const registerParent = async (...) => {
  try {
    logger.info('Parent registration started', { email: data.email });
    // ... код
    logger.info('Parent registered successfully', { userId: newUser.id });
  } catch (error) {
    logger.error('Parent registration failed', error, { email: data.email });
  }
};
```

---

## 🎯 ГДЕ НУЖНО ЗАМЕНИТЬ

### Файлы где есть console.log/error:

1. ✅ `constants/MonitoringContext.tsx` - много console.log
2. ✅ `constants/ParentalControlsContext.tsx` - console.log/error
3. ✅ `constants/AuthContext.tsx` - console.log
4. ✅ `constants/UserContext.tsx` - console.log
5. ✅ `app/chat/[chatId].tsx` - console.log
6. ✅ Другие файлы с console.log

### Как найти все места:

```bash
# Найти все console.log в проекте
grep -r "console\." constants/ app/ --include="*.ts" --include="*.tsx"
```

---

## ✅ ЧТО НУЖНО СДЕЛАТЬ

### Шаг 1: Добавить импорт в начало файла
```typescript
import { logger } from '@/utils/logger';
```

### Шаг 2: Заменить console.log на logger.info
```typescript
// Было:
console.log('Message');

// Стало:
logger.info('Message', { context: 'value' });
```

### Шаг 3: Заменить console.error на logger.error
```typescript
// Было:
console.error('Error:', error);

// Стало:
logger.error('Error occurred', error, { context: 'value' });
```

### Шаг 4: Заменить console.warn на logger.warn
```typescript
// Было:
console.warn('Warning');

// Стало:
logger.warn('Warning', { reason: 'value' });
```

---

## 🚀 РЕЗУЛЬТАТ

После замены:
- ✅ Все логи структурированы
- ✅ Есть контекст (userId, chatId и т.д.)
- ✅ Можно отправить в Sentry
- ✅ Можно фильтровать по уровням
- ✅ Можно посмотреть последние логи

---

## 💡 ИТОГО

**Тесты:** ❌ НЕ нужно интегрировать - они уже работают отдельно

**Logger:** ✅ НУЖНО интегрировать - заменить console.log на logger в коде

**ErrorHandler:** ✅ НУЖНО интегрировать - использовать в try-catch блоках
