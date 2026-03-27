# Проблема с Jest и expo-modules-core

**Дата:** 2026-01-27  
**Статус:** Критическая проблема

---

## Описание проблемы

Все тесты падают с ошибкой:

```
Must use import to load ES Module: /Users/mac/Desktop/rork-kiku/node_modules/expo-modules-core/src/polyfill/dangerous-internal.ts

  at requireModule (node_modules/jest-runtime/build/index.js:850:25)
  at Object.<anonymous> (node_modules/jest-expo/src/preset/setup.js:297:8)
```

---

## Причина

`jest-expo` preset в файле `node_modules/jest-expo/src/preset/setup.js` напрямую импортирует:
```javascript
const { EventEmitter } = require('expo-modules-core/src/polyfill/dangerous-internal');
```

Но `expo-modules-core` использует ESM (ECMAScript Modules), а Jest пытается загрузить его через `require()` (CommonJS).

---

## Попытки решения

### 1. ✗ Добавление моков в `jest.setup.js`
Не работает, т.к. `jest-expo` preset загружается ДО `jest.setup.js`.

### 2. ✗ Добавление моков в `jest.setup.before.js` через `setupFiles`
Не работает, т.к. preset загружается на уровне конфигурации Jest.

### 3. ✗ Добавление `moduleNameMapper` в `jest.config.js`
Не работает, т.к. preset игнорирует `moduleNameMapper`.

### 4. ✗ Обновление `jest-expo` до последней версии
Проблема сохраняется даже в `jest-expo@54.0.16`.

### 5. ✗ Изменение preset на `react-native`
Приводит к другим ошибкам с ESM модулями.

---

## Возможные решения

### Решение 1: Патчинг node_modules (рекомендуется)
Создать patch для `jest-expo/src/preset/setup.js`:

```bash
npx patch-package jest-expo
```

Изменить строку:
```javascript
// Было:
const { EventEmitter } = require('expo-modules-core/src/polyfill/dangerous-internal');

// Стало:
let EventEmitter;
try {
  EventEmitter = require('expo-modules-core/src/polyfill/dangerous-internal').EventEmitter;
} catch (e) {
  EventEmitter = class EventEmitter {
    addListener() {}
    removeAllListeners() {}
  };
}
```

### Решение 2: Downgrade expo-modules-core
Откатиться на более старую версию, которая использует CommonJS.

### Решение 3: Не использовать jest-expo preset
Настроить Jest вручную без `jest-expo`, использовать базовые моки.

### Решение 4: Использовать Vitest вместо Jest
Vitest нативно поддерживает ESM.

---

## Временное решение

Для продолжения разработки можно:

1. Запускать тесты выборочно (только те, которые не используют Expo компоненты)
2. Использовать патчинг через `patch-package`
3. Мигрировать на Vitest

---

## Рекомендация

**Использовать патчинг через `patch-package`** - это самый быстрый и надежный способ.

---

**Создано:** 2026-01-27  
**Обновлено:** 2026-01-27
