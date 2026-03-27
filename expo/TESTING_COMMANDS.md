# 🧪 Шпаргалка по тестированию KIKU

## Быстрый старт

### ✅ Playwright (E2E для веб) - РАБОТАЕТ!
```bash
bun run test:playwright              # Все тесты
bun run test:playwright:ui           # С UI интерфейсом
bunx playwright test --project="Mobile Chrome"  # Только мобильный
```

### ✅ Jest (Unit, Integration, E2E)
```bash
bun run test                        # Все тесты
bun run test:unit                  # Только unit (быстро)
bun run test:integration            # Интеграционные
bun run test:e2e                   # E2E тесты
bun run test:coverage              # С покрытием кода
bun run test:watch                 # Watch режим
```

### ✅ Bun Test (альтернатива Jest)
```bash
bun run test:bun                   # Unit тесты
bun run test:all                   # Все тесты
```

## Тестирование на устройствах

### 📱 Реальные устройства (Expo Go)
```bash
bun run start                      # Запуск → сканировать QR в Expo Go
bun run start:rork                 # Через Rork платформу
```

### 📱 iOS симулятор
```bash
bun run ios:sim                    # Автоматический запуск (исправляет launchd_sim ошибки)
bun run ios:sim:safe               # Безопасный запуск (обход launchd_sim)
bun run ios:sim:fix                # Исправить проблему launchd_sim вручную
bun run ios:debug                  # С отладкой
```

**⚠️ Если ошибка "launchd_sim may have crashed" (code 60):**
- Скрипт `ios:sim` автоматически исправляет эту проблему
- Если не помогло, используйте `bun run ios:sim:safe`
- Подробнее: `docs/troubleshooting/LAUNCHD_SIM_ERROR.md`

### 📱 Android эмулятор
```bash
bun run android:emulator           # Запуск на Android
```

### 🌐 Веб-версия (ручное тестирование)
```bash
bun run start:web                  # http://localhost:8082
```

## Конфигурационные тесты

```bash
bun run test:startup              # Тесты структуры
bun run test:deep                 # Глубокие тесты
bun run test:config               # Все конфигурационные
bun run test:all-config           # Полный набор
```

## Проверка кода

```bash
bun run typecheck                 # TypeScript
bun run lint                      # Линтинг
bun run lint:fix                  # Автоисправление
bun run check                     # Все проверки
```

## CI/CD

```bash
bun run ci:all                    # Все CI проверки
```

## Рекомендуемый workflow

### Перед коммитом:
```bash
bun run check                     # lint + typecheck
bun run test:unit                 # Быстрые тесты
```

### Перед push:
```bash
bun run test:all                  # Все Jest тесты
bun run test:playwright            # Playwright тесты
```

### Полная проверка:
```bash
bun run test:all-config           # Конфигурация
bun run test:all                  # Jest тесты
bun run test:playwright           # Playwright тесты
bun run check                     # Код качество
```

## Структура тестов

```
__tests__/
├── unit/              # Unit тесты (быстрые)
├── integration/       # Интеграционные тесты
├── e2e/              # E2E тесты (Jest)
└── playwright/       # E2E тесты (Playwright) ✅
```

## Статус тестов

- ✅ **Playwright**: 18/18 тестов проходят
- ✅ **Jest**: Настроен и готов
- ✅ **Bun Test**: Работает
- ✅ **iOS симулятор**: Доступен
- ✅ **Android эмулятор**: Доступен
- ✅ **Expo Go**: Готов к использованию
