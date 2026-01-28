# Руководство по тестированию KIKU

## Что такое Fork Tests (Fork Workers)?

**Fork Tests** (или Worker Processes) в Jest - это механизм параллельного выполнения тестов, когда Jest создает отдельные процессы (workers) для запуска тестов.

### Преимущества:
1. **Изоляция** - каждый тест выполняется в отдельном процессе, нет утечки состояния
2. **Параллельность** - тесты выполняются одновременно, быстрее
3. **Надежность** - если один тест упадет, другие продолжатся
4. **Масштабируемость** - можно настроить количество workers под CPU

### Настройка в Jest:

```javascript
module.exports = {
  maxWorkers: '50%', // Использовать 50% доступных CPU ядер
  // или
  maxWorkers: 4, // Конкретное количество процессов
  // или
  maxWorkers: 1, // Последовательное выполнение (для отладки)
};
```

## Организация тестов по сложности

### Уровни сложности:

1. **Простые (Simple)** - утилиты, чистые функции
   - Время выполнения: < 10ms
   - Зависимости: минимум
   - Примеры: `utils/retryUtils.ts`, форматирование данных

2. **Средние (Medium)** - сервисы, контексты с моками
   - Время выполнения: 10-100ms
   - Зависимости: моки AsyncStorage, API
   - Примеры: `AIModerationService.ts`, синхронизация данных

3. **Сложные (Complex)** - интеграционные тесты контекстов
   - Время выполнения: 100-500ms
   - Зависимости: полные моки, React Testing Library
   - Примеры: `MonitoringContext`, `ParentalControlsContext`

4. **Очень сложные (Very Complex)** - E2E, компоненты с навигацией
   - Время выполнения: > 500ms
   - Зависимости: Expo Router, навигация
   - Примеры: экраны приложения, полные user flows

### Структура тестов:

```
__tests__/
  unit/                    # Простые и средние тесты
    utils/
      analyticsMetrics.test.ts
      riskEvaluation.test.ts
      timeRestrictions.test.ts
      validation.test.ts
      ...
  
  integration/             # Сложные тесты
    app/
      startup.test.tsx     # Тесты запуска приложения
    contexts/
      MonitoringContext.test.tsx      # Тесты мониторинга
      ParentalControlsContext.test.tsx # Тесты родительского контроля
      UserContext.test.tsx             # Тесты пользователя
  
  e2e/                     # Очень сложные тесты
    screens/
      monitoring.test.tsx  # E2E тесты экрана мониторинга
    processes/
      ai-analysis.test.tsx    # E2E тесты AI анализа
      sos-process.test.tsx     # E2E тесты SOS процесса
      lifecycle.test.tsx       # E2E тесты жизнедеятельности
```

## Конфигурация для разных уровней сложности

### Быстрые тесты (unit):
- `maxWorkers: '50%'` - параллельно
- `testTimeout: 5000` - короткий timeout

### Средние тесты (integration):
- `maxWorkers: '25%'` - меньше параллелизма (больше памяти)
- `testTimeout: 10000` - средний timeout

### Медленные тесты (e2e):
- `maxWorkers: 1` - последовательно (стабильность)
- `testTimeout: 30000` - длинный timeout

## Запуск тестов

```bash
# Все тесты
bun test

# Только unit тесты (быстрые)
bun test --testPathPattern=unit

# Только integration тесты
bun test --testPathPattern=integration

# Только E2E тесты
bun test --testPathPattern=e2e

# Конкретный файл
bun test retryUtils.test.ts

# Тесты запуска приложения
bun test startup.test.tsx

# Тесты процессов жизнедеятельности
bun test lifecycle.test.tsx

# С покрытием
bun test --coverage

# Watch mode
bun test --watch
```

## Best Practices

1. **Изоляция тестов** - каждый тест должен быть независимым
2. **Моки для внешних зависимостей** - AsyncStorage, API, навигация
3. **Arrange-Act-Assert** - четкая структура теста
4. **Тестовые данные** - использовать fixtures/constants
5. **Имена тестов** - описательные, на русском или английском

## Примеры

### Простой тест (unit):
```typescript
describe('retryWithBackoff', () => {
  it('должен повторить операцию при ошибке', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 2) throw new Error('Retry');
      return 'success';
    };
    
    const result = await retryWithBackoff(fn, { retries: 3 });
    expect(result).toBe('success');
    expect(attempts).toBe(2);
  });
});
```

### Сложный тест (integration):
```typescript
describe('MonitoringContext', () => {
  it('должен создать alert при high risk сообщении', async () => {
    const { result } = renderHook(() => useMonitoring());
    
    await act(async () => {
      await result.current.addMessage({
        id: '1',
        text: 'I want to hurt myself',
        timestamp: Date.now(),
      });
    });
    
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0].riskLevel).toBe('high');
  });
});
```

## Типы тестов в проекте

### 1. Unit тесты (`__tests__/unit/`)
Тестируют отдельные функции и утилиты:
- `analyticsMetrics.test.ts` - вычисление аналитических метрик
- `riskEvaluation.test.ts` - оценка рисков
- `timeRestrictions.test.ts` - временные ограничения
- `validation.test.ts` - валидация данных

### 2. Integration тесты (`__tests__/integration/`)

#### Тесты запуска приложения (`app/startup.test.tsx`)
Проверяют инициализацию всех провайдеров:
- ✅ Инициализация всех контекстов без ошибок
- ✅ Загрузка данных из AsyncStorage
- ✅ Обработка ошибок при загрузке
- ✅ Правильный порядок провайдеров

#### Тесты контекстов (`contexts/`)
- **MonitoringContext.test.tsx** - мониторинг чатов, анализ сообщений, алерты
- **ParentalControlsContext.test.tsx** - родительские настройки, SOS, контакты, временные ограничения
- **UserContext.test.tsx** - пользовательские данные, профили, дети

### 3. E2E тесты (`__tests__/e2e/`)

#### Тесты экранов (`screens/`)
- **monitoring.test.tsx** - полный flow работы с чатами и сообщениями

#### Тесты процессов (`processes/`)
- **ai-analysis.test.tsx** - полный цикл AI анализа от получения сообщения до создания алерта
- **sos-process.test.tsx** - полный цикл SOS от триггера до разрешения
- **lifecycle.test.tsx** - полный цикл жизнедеятельности приложения

## Покрытие тестами

### Что покрыто тестами:

✅ **Запуск приложения**
- Инициализация всех провайдеров
- Загрузка данных из хранилища
- Обработка ошибок

✅ **Мониторинг**
- Добавление сообщений
- AI анализ текста и изображений
- Создание алертов
- Управление алертами

✅ **Родительский контроль**
- Настройки безопасности
- SOS функциональность
- Управление контактами
- Временные ограничения
- Compliance логирование

✅ **Пользователь**
- Создание и обновление профиля
- Управление детьми
- Выход из профиля

✅ **Процессы жизнедеятельности**
- Полный цикл от создания пользователя до SOS
- Настройка контроля и мониторинг нарушений
- Обработка ошибок
- Производительность

## Запуск всех тестов

```bash
# Все тесты с покрытием
bun run test:coverage

# Только unit тесты (быстро)
bun run test:unit

# Только integration тесты
bun run test:integration

# Только E2E тесты (медленно, последовательно)
bun run test:e2e

# CI/CD проверка (все проверки)
bun run ci:all
```

## Добавление новых тестов

### Для нового контекста:
1. Создайте файл `__tests__/integration/contexts/YourContext.test.tsx`
2. Используйте `createWrapper()` для обертки провайдеров
3. Тестируйте все основные функции контекста
4. Проверяйте загрузку/сохранение в AsyncStorage

### Для нового процесса:
1. Создайте файл `__tests__/e2e/processes/your-process.test.tsx`
2. Тестируйте полный цикл процесса
3. Проверяйте интеграцию между контекстами
4. Тестируйте обработку ошибок

### Для нового экрана:
1. Создайте файл `__tests__/e2e/screens/your-screen.test.tsx`
2. Используйте `@testing-library/react-native` для рендеринга
3. Тестируйте основные user flows
4. Проверяйте навигацию
