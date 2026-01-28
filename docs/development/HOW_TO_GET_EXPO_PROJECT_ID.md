# 📱 Как получить Expo Project ID

## 🔍 Что такое Expo Project ID?

**Expo Project ID** — это уникальный идентификатор вашего проекта в системе Expo. Он нужен для:
- Push Notifications (Expo Push Notification Service)
- EAS Build
- Expo Updates
- Других сервисов Expo

---

## 📋 Где найти Expo Project ID

### Способ 1: В файле app.json / app.config.js

Проверьте файл `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "ваш-project-id-здесь"
      }
    }
  }
}
```

Или:

```json
{
  "expo": {
    "extra": {
      "projectId": "ваш-project-id-здесь"
    }
  }
}
```

### Способ 2: Через команду Expo CLI

```bash
cd /Users/mac/Desktop/rork-kiku
npx expo config --type public | grep -i projectId
```

Или:

```bash
npx expo config --type public
```

Ищите поле `projectId` в выводе.

### Способ 3: Через EAS CLI

Если у вас установлен EAS CLI:

```bash
npx eas project:info
```

Или:

```bash
npx eas config
```

### Способ 4: На сайте Expo

1. Зайдите на [expo.dev](https://expo.dev)
2. Войдите в свой аккаунт
3. Найдите ваш проект
4. Project ID будет отображаться на странице проекта

### Способ 5: В переменных окружения

Проверьте файл `.env` или `.env.local`:

```bash
cat .env | grep PROJECT_ID
```

Или переменную:

```
EXPO_PUBLIC_PROJECT_ID=ваш-project-id
```

---

## 🆕 Если Project ID еще нет

### Создать новый Project ID через EAS:

```bash
# Установить EAS CLI (если еще не установлен)
npm install -g eas-cli

# Войти в Expo аккаунт
npx eas login

# Создать проект и получить Project ID
npx eas init

# Это создаст/обновит eas.json и добавит projectId в app.json
```

Или через Expo Dashboard:
1. Зайдите на [expo.dev](https://expo.dev)
2. Создайте новый проект
3. Скопируйте Project ID
4. Добавьте в `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "скопированный-id"
      }
    }
  }
}
```

---

## ✅ Проверка текущего проекта

Для вашего проекта KIDS by KIKU:

1. **Проверьте `app.json`** - посмотрите, есть ли там `extra.eas.projectId`
2. **Проверьте `eas.json`** - там может быть указан projectId
3. **Запустите команду:**
   ```bash
   cd /Users/mac/Desktop/rork-kiku
   npx expo config --type public
   ```

---

## 🔧 Как добавить Project ID в проект

Если Project ID нет, добавьте его в `app.json`:

```json
{
  "expo": {
    "name": "KIKU",
    "slug": "greeting-project-58uufiz",
    "extra": {
      "eas": {
        "projectId": "ваш-project-id-здесь"
      }
    }
  }
}
```

Или создайте через EAS:

```bash
npx eas init
```

---

## 📝 Формат Project ID

Expo Project ID имеет формат UUID:
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Например:
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## 🚨 Важно

- **Project ID уникален** для каждого проекта
- **Не коммитьте Project ID** если он содержит чувствительную информацию (обычно безопасно)
- **Один Project ID** используется для всех платформ (iOS, Android, Web)
- **Для Push Notifications** Project ID обязателен

---

## 🔍 Быстрая проверка для вашего проекта

Запустите эту команду в терминале проекта:

```bash
cd /Users/mac/Desktop/rork-kiku
npx expo config --type public 2>/dev/null | grep -A 5 -B 5 -i "project" || echo "Проверьте app.json вручную"
```

---

**После получения Project ID, мы сможем реализовать Push Notifications!** 🚀


