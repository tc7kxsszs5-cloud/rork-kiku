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
      retryUtils.test.ts
      syncService.test.ts
    services/
      aiModeration.test.ts
  
  integration/             # Сложные тесты
    contexts/
      MonitoringContext.test.tsx
      ParentalControlsContext.test.tsx
  
  e2e/                     # Очень сложные тесты
    screens/
      monitoring.test.tsx
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

# Конкретный файл
bun test retryUtils.test.ts

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
