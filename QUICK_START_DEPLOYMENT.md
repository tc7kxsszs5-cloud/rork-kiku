# ⚡ Быстрый старт развертывания KIKU

## 🎯 Минимальная настройка для тестирования

### 1. Backend (5 минут)

```bash
# Переход в директорию backend
cd backend

# Установка зависимостей
bun install

# Запуск локально
bun run dev

# Backend будет доступен на http://localhost:3000
```

### 2. Mobile App (5 минут)

```bash
# Возврат в корень проекта
cd ..

# Установка зависимостей
bun install

# Запуск Expo
npx expo start

# Сканировать QR код в Expo Go app
```

---

## 🚀 Production развертывание (30 минут)

### Шаг 1: Backend на Vercel (10 минут)

```bash
# 1. Установка Vercel CLI
npm i -g vercel

# 2. Переход в backend
cd backend

# 3. Развертывание
vercel --prod

# 4. Настройка environment variables в Vercel Dashboard
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - и другие...
```

### Шаг 2: База данных (10 минут)

#### Вариант A: Supabase (бесплатно до 500MB)

1. Создать аккаунт на https://supabase.com
2. Создать новый проект
3. Скопировать connection string
4. Добавить в Vercel environment variables как `DATABASE_URL`

#### Вариант B: Railway (бесплатно $5/мес)

```bash
# Установка Railway CLI
npm i -g @railway/cli

# Логин
railway login

# Создание проекта
railway init

# Добавление PostgreSQL
railway add postgresql

# Получение connection string
railway variables
```

### Шаг 3: Mobile App через EAS (10 минут)

```bash
# 1. Установка EAS CLI
npm install -g eas-cli

# 2. Логин
eas login

# 3. Инициализация
eas build:configure

# 4. Сборка для тестирования
eas build --profile preview --platform android

# 5. После тестирования - production build
eas build --profile production --platform all
```

---

## 📱 Развертывание в App Store / Google Play

### iOS App Store:

```bash
# 1. Настроить Apple Developer аккаунт ($99/год)
# 2. Создать App ID в Apple Developer Portal
# 3. Обновить bundleIdentifier в app.json

# 4. Собрать и отправить
eas build --profile production --platform ios
eas submit --platform ios
```

### Google Play Store:

```bash
# 1. Создать аккаунт Google Play Developer ($25 единоразово)
# 2. Создать приложение в Google Play Console
# 3. Скачать service account key

# 4. Собрать и отправить
eas build --profile production --platform android
eas submit --platform android
```

---

## 🔧 Минимальная конфигурация

### backend/.env (локально):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/kiku
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
```

### app.config.js (для мобильного приложения):

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    },
  },
};
```

---

## ✅ Чеклист перед production

- [ ] Backend развернут и доступен
- [ ] База данных настроена и миграции применены
- [ ] Environment variables настроены
- [ ] SSL сертификаты установлены
- [ ] Mobile app собран и протестирован
- [ ] Мониторинг настроен (Sentry, Analytics)
- [ ] Backup базы данных настроен
- [ ] Rate limiting включен
- [ ] CORS настроен правильно
- [ ] Документация обновлена

---

## 🆘 Нужна помощь?

Смотрите полное руководство: `DEPLOYMENT_GUIDE.md`

