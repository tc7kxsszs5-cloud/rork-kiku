# ✅ Рабочее решение для Jest

## Проблема решена!

**Рабочая конфигурация:** `jest.config.working.js`

Эта конфигурация использует `react-native` preset вместо `jest-expo`, что решает проблему с ошибкой "Attempted to assign to readonly property".

## Использование

```bash
# Запуск тестов с рабочей конфигурацией
npx jest --config jest.config.working.js --testPathPattern=unit

# Все unit тесты
npx jest --config jest.config.working.js --testPathPattern=unit

# Integration тесты
npx jest --config jest.config.working.js --testPathPattern=integration --maxWorkers=2

# E2E тесты
npx jest --config jest.config.working.js --testPathPattern=e2e --maxWorkers=1

# Все тесты
npx jest --config jest.config.working.js
```

## Ключевые отличия от стандартной конфигурации

1. **Preset**: Использует `react-native` вместо `jest-expo`
2. **Transform**: Явно настраивает babel-jest с babel-preset-expo
3. **Cache**: Отключен для устранения проблем
4. **Workers**: Ограничено до 1 в CI для стабильности

## Обновление package.json скриптов

Можно добавить удобные скрипты:

```json
{
  "scripts": {
    "test:working": "jest --config jest.config.working.js",
    "test:working:unit": "jest --config jest.config.working.js --testPathPattern=unit",
    "test:working:integration": "jest --config jest.config.working.js --testPathPattern=integration --maxWorkers=2",
    "test:working:e2e": "jest --config jest.config.working.js --testPathPattern=e2e --maxWorkers=1"
  }
}
```

## Альтернатива: Использовать Bun

Если Jest все еще вызывает проблемы, используйте Bun (работает отлично):

```bash
bun test --testPathPattern=unit
```

## Статус

✅ **jest.config.working.js** - работает  
⚠️ **jest.config.js** (с jest-expo) - может иметь проблемы  
✅ **Bun** - работает отлично (172 теста проходят)
