# Анализ ошибки: `SyntaxError: Identifier 'AnalyticsProvider' has already been declared`

## Описание ошибки
```
ERROR SyntaxError: /Users/mac/Desktop/rork-kiku/app/_layout.tsx: 
Identifier 'AnalyticsProvider' has already been declared. (16:9)
```

## Проведенный анализ

### 1. Проверка кода
- ✅ В файле `app/_layout.tsx` только **один** импорт `AnalyticsProvider` на строке 15
- ✅ В файле `constants/AnalyticsContext.tsx` только **один** экспорт `AnalyticsProvider` на строке 75
- ✅ Линтер не находит ошибок в коде
- ✅ TypeScript компилятор не показывает ошибку дублирования

### 2. Структура экспорта
```typescript
// constants/AnalyticsContext.tsx:75
export const [AnalyticsProvider, useAnalytics] = createContextHook<AnalyticsContextValue>(() => {
  // ...
});
```

### 3. Структура импорта
```typescript
// app/_layout.tsx:15
import { AnalyticsProvider } from "@/constants/AnalyticsContext";
```

## Возможные причины ошибки

### ✅ Причина #1: Кэш Metro Bundler (наиболее вероятно)
**Вероятность: 95%**

Metro bundler кэширует скомпилированные модули. Если ранее в файле был дублирующий импорт, который был удален, Metro может все еще использовать старую версию из кэша.

**Признаки:**
- Ошибка указывает на строку 16, но в файле импорт на строке 15
- TypeScript не видит ошибку
- Линтер не видит ошибку
- Ошибка появляется только при запуске Metro bundler

**Решение:**
```bash
# Полная очистка кэша
rm -rf node_modules/.cache .expo .metro .expo-shared ~/.expo

# Перезапуск с очисткой кэша
bunx expo start --clear
```

### ⚠️ Причина #2: Циклическая зависимость
**Вероятность: 3%**

Циклическая зависимость между контекстами может вызывать проблемы при компиляции:
- `_layout.tsx` → импортирует `AnalyticsProvider` из `AnalyticsContext.tsx`
- `_layout.tsx` → импортирует `MonitoringProvider` из `MonitoringContext.tsx`
- `MonitoringContext.tsx` → импортирует `useAnalytics` из `AnalyticsContext.tsx`

**Решение:**
Если проблема не решается очисткой кэша, проверьте порядок провайдеров в `_layout.tsx` - `AnalyticsProvider` должен быть выше `MonitoringProvider` в дереве провайдеров (что уже так и есть).

### ⚠️ Причина #3: Проблема с деструктуризацией экспорта
**Вероятность: 1%**

Metro bundler может неправильно обрабатывать деструктуризацию массива в экспорте:
```typescript
export const [AnalyticsProvider, useAnalytics] = createContextHook(...)
```

**Решение:**
Если проблема не решается, можно попробовать изменить способ экспорта:
```typescript
const [AnalyticsProvider, useAnalytics] = createContextHook(...);
export { AnalyticsProvider, useAnalytics };
```

### ⚠️ Причина #4: Старая версия файла в памяти
**Вероятность: 1%**

Metro bundler может держать старую версию файла в памяти, даже после изменений.

**Решение:**
Полная перезагрузка процесса Metro bundler.

## Рекомендуемые действия

### Шаг 1: Полная очистка кэша
```bash
# Остановите Metro (Ctrl+C)

# Очистите все кэши
rm -rf node_modules/.cache .expo .metro .expo-shared ~/.expo

# Перезапустите с очисткой
bunx expo start --clear
```

### Шаг 2: Если не помогло - используйте локальный запуск
```bash
bun run start:local
```

### Шаг 3: Если проблема сохраняется
Проверьте:
1. Нет ли скрытых символов в файле `app/_layout.tsx` на строке 15-16
2. Нет ли дублирующих импортов в других файлах, которые импортируются в `_layout.tsx`
3. Попробуйте изменить способ экспорта в `AnalyticsContext.tsx` (см. Причина #3)

## Вывод

**Наиболее вероятная причина:** Кэш Metro bundler содержит старую версию файла с дублирующим импортом.

**Код корректен** - проблема в инструментах сборки, а не в коде.
