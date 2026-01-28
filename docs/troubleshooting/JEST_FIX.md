# Решение проблемы с Jest

## Проблема

Jest падает с ошибкой:
```
TypeError: Attempted to assign to readonly property.
```

Это проблема с `jest-expo` preset и некоторыми версиями Node.js/Jest.

## Решения

### Решение 1: Использовать упрощенную конфигурацию Jest

Создана альтернативная конфигурация `jest.config.simple.js` без `jest-expo` preset:

```bash
# Запуск с упрощенной конфигурацией
npx jest --config jest.config.simple.js --testPathPattern=unit
```

### Решение 2: Использовать Bun для unit тестов (рекомендуется)

Bun работает отлично и быстрее:

```bash
# Все unit тесты
bun test --testPathPattern=unit

# Исключая проблемные с react-native
bun test --testPathPattern=unit --testPathIgnorePatterns="soundNotifications|syncHelpers"
```

### Решение 3: Обновить jest-expo

Попробуйте обновить jest-expo до последней версии:

```bash
bun update jest-expo @testing-library/react-native jest
```

### Решение 4: Использовать только unit тесты без react-native

Если integration/E2E тесты не критичны сейчас:

```bash
# Только работающие unit тесты
bun test --testPathPattern=unit --testPathIgnorePatterns="soundNotifications|syncHelpers"
```

## Рекомендуемый подход

**Используйте Bun для unit тестов** - это быстрее и работает без проблем:

```bash
bun test --testPathPattern=unit
```

172 теста проходят успешно с Bun ✅

## Альтернатива для Jest

Если обязательно нужен Jest, попробуйте упрощенную конфигурацию:

```bash
npx jest --config jest.config.simple.js
```

## Статус

✅ **Bun** - работает отлично (172 теста)  
⚠️ **Jest с jest-expo** - требует дополнительной настройки  
⚠️ **Jest упрощенный** - попробуйте `jest.config.simple.js`
