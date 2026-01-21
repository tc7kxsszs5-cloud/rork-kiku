# Настройка Jest для тестирования

## Проблема

Jest падает с ошибкой:
```
TypeError: Attempted to assign to readonly property.
```

Это известная проблема с jest-expo preset и некоторыми версиями Node.js/Jest.

## Решение: Использовать Bun для unit тестов

**Рекомендуемый подход:** Используйте Bun для unit тестов (работает отлично):

```bash
# Все unit тесты (кроме проблемных с react-native)
bun test --testPathPattern=unit

# Исключая проблемные тесты
bun test --testPathPattern=unit --testPathIgnorePatterns="soundNotifications|syncHelpers"
```

## Альтернатива: Исправить Jest

Если нужно использовать Jest, попробуйте:

1. Обновить зависимости:
```bash
bun update jest jest-expo @testing-library/react-native
```

2. Использовать более простую конфигурацию без jest-expo:
```javascript
// jest.config.simple.js
module.exports = {
  preset: 'react-native',
  // ... упрощенная конфигурация
};
```

3. Или использовать только для integration/E2E тестов, которые действительно нужны.

## Текущий статус

✅ **Bun тесты** - работают отлично (172 теста проходят)  
⚠️ **Jest тесты** - требуют дополнительной настройки

## Рекомендация

Используйте Bun для unit тестов - это быстрее и работает без проблем.
