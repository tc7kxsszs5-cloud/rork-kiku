# 🔧 Решение ошибки EAS Build

## Проблема
```
Couldn't find any iOS builds for this project on EAS servers. 
It looks like you haven't run 'eas build' yet.
```

## Решение

### Шаг 1: Создать iOS build

```bash
# Для production build
eas build --platform ios --profile production

# Или для preview/test build
eas build --platform ios --profile preview
```

### Шаг 2: Дождаться завершения сборки

Сборка займет 10-20 минут. Вы можете:
- Следить за прогрессом в терминале
- Открыть ссылку, которую покажет EAS
- Проверить статус на https://expo.dev

### Шаг 3: После завершения сборки

```bash
# Теперь можно отправить в App Store
eas submit --platform ios
```

---

## Альтернативные варианты

### Вариант 1: Локальная сборка (требует Xcode)

```bash
eas build --platform ios --profile production --local
```

### Вариант 2: Android build (быстрее для тестирования)

```bash
eas build --platform android --profile production
```

### Вариант 3: Preview build (для тестирования)

```bash
eas build --platform ios --profile preview
```

---

## Проверка статуса сборки

```bash
# Список всех сборок
eas build:list

# Детали конкретной сборки
eas build:view [BUILD_ID]
```

---

## Настройка eas.json (если нужно)

Если нужно добавить профиль для preview:

```json
{
  "build": {
    "production": {
      "ios": {
        "workflow": "managed",
        "buildType": "archive"
      }
    },
    "preview": {
      "ios": {
        "workflow": "managed",
        "buildType": "simulator"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "ios": {
        "workflow": "managed",
        "developmentClient": true
      }
    }
  }
}
```


