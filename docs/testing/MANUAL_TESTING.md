# Руководство по ручному тестированию

## Быстрый старт

### 1. Проверка стиля кода (Lint)

```bash
# Запустить lint проверку
bun run lint

# Автоматически исправить ошибки стиля
bun run lint:fix
```

**Что проверяет:**
- Соответствие правилам ESLint
- Форматирование кода
- Неиспользуемые переменные
- Потенциальные ошибки

---

### 2. Проверка типов TypeScript

```bash
# Проверить типы без компиляции
bun run typecheck
# или
bunx tsc --noEmit
```

**Что проверяет:**
- Корректность типов
- Отсутствие ошибок TypeScript
- Соответствие интерфейсам

---

### 3. Модульные тесты (Unit Tests)

```bash
# Запустить все unit тесты
bun run test:unit

# Запустить конкретный файл тестов
bun test __tests__/unit/utils/cursorStyles.test.ts
bun test __tests__/unit/utils/soundNotifications.test.ts

# Запустить все тесты
bun run test
```

**Что тестирует:**
- Детерминированные функции
- Чистые функции без побочных эффектов
- Утилиты и helpers

---

### 4. Тесты с покрытием кода (Coverage)

```bash
# Запустить тесты с отчетом о покрытии
bun run test:coverage
```

**Что показывает:**
- Процент покрытия кода тестами
- Какие строки не покрыты тестами
- Статистику по файлам

---

### 5. Watch Mode (автоматический перезапуск)

```bash
# Запустить тесты в режиме наблюдения
bun run test:watch
```

**Что делает:**
- Автоматически перезапускает тесты при изменении файлов
- Показывает только измененные тесты
- Удобно для разработки

---

## Детальные команды

### Запуск конкретных тестов

```bash
# По паттерну имени файла
bun test cursorStyles

# По паттерну имени теста
bun test -t "должен содержать"

# Только failed тесты (после первого запуска)
bun test --onlyFailures
```

### Опции для Jest (если используется)

```bash
# Через bunx jest (если настроен Jest)
bunx jest --testPathPatterns=unit

# С verbose выводом
bunx jest --verbose

# С одним worker (последовательно, для отладки)
bunx jest --maxWorkers=1

# Только измененные файлы
bunx jest --onlyChanged
```

---

## Проверка всех компонентов сразу

### Полная проверка проекта

```bash
# Команда для CI (все проверки)
bun run ci:all

# Или по отдельности:
bun run ci:install  # Установка зависимостей
bun run ci:lint     # Lint
bun run ci:tsc      # Type check
bun run ci:test     # Tests
```

### Ручной чеклист

```bash
# 1. Lint
bun run lint

# 2. Type Check
bun run typecheck

# 3. Unit Tests
bun run test:unit

# 4. Все тесты (если есть integration/e2e)
bun run test
```

---

## Структура тестов

```
__tests__/
  unit/                    # Модульные тесты
    utils/
      cursorStyles.test.ts      # Тесты для cursorStyles
      soundNotifications.test.ts # Тесты для soundNotifications
```

---

## Примеры вывода

### Успешный запуск тестов

```
✅ cursorStyles - Детерминированные unit тесты > cursorStyles объект > должен содержать все необходимые стили курсоров [2.10ms]
✅ cursorStyles - Детерминированные unit тесты > cursorStyles объект > должен содержать строковые значения для всех стилей [3.14ms]
...

 12 pass
 0 fail
 51 expect() calls
Ran 12 tests across 1 file. [521.00ms]
```

### Успешный lint

```
$ expo lint
✅ No lint errors found
```

### Успешный type check

```
$ bunx tsc --noEmit
✅ No TypeScript errors found
```

---

## Отладка тестов

### Если тесты падают

1. **Посмотреть детальный вывод:**
   ```bash
   bun test --verbose
   ```

2. **Запустить один тест:**
   ```bash
   bun test -t "название_теста"
   ```

3. **Запустить один файл:**
   ```bash
   bun test cursorStyles.test.ts
   ```

### Если TypeScript ошибки

1. **Проверить конкретный файл:**
   ```bash
   bunx tsc --noEmit app/(tabs)/profile.tsx
   ```

2. **Показать только ошибки (без warnings):**
   ```bash
   bunx tsc --noEmit 2>&1 | grep "error TS"
   ```

---

## Интеграция в разработку

### Перед коммитом

```bash
# Быстрая проверка
bun run lint && bun run typecheck && bun run test:unit
```

### Перед push

```bash
# Полная проверка
bun run ci:all
```

---

## Полезные советы

1. **Используйте watch mode во время разработки:**
   ```bash
   bun run test:watch
   ```

2. **Проверяйте покрытие регулярно:**
   ```bash
   bun run test:coverage
   ```

3. **Автоматически исправляйте lint ошибки:**
   ```bash
   bun run lint:fix
   ```

4. **Для CI/CD используйте:**
   ```bash
   bun run ci:all
   ```

---

## Troubleshooting

### Тесты не находятся

```bash
# Проверить структуру
ls -la __tests__/unit/utils/

# Проверить конфигурацию Jest
cat jest.config.js
```

### TypeScript кэш

Если TypeScript показывает старые ошибки:
- Перезапустите TypeScript сервер в IDE
- Или очистите кэш: `rm -rf node_modules/.cache`

### Зависимости не установлены

```bash
bun install
```

---

**Примечание:** Все команды используют `bun` как package manager. Если у вас установлен `npm` или `yarn`, замените `bun` на `npm run` или `yarn`.
