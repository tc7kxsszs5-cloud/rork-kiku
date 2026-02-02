# 🚀 KIKU Deployment Guide

Полное руководство по деплою KIKU в продакшн.

---

## 📋 Prerequisites

Перед началом убедитесь, что у вас есть:
- [ ] Аккаунт [Supabase](https://supabase.com) (для PostgreSQL)
- [ ] Аккаунт [Vercel](https://vercel.com) (для Backend API)
- [ ] Аккаунт [Sentry](https://sentry.io) (для мониторинга)
- [ ] OpenAI API Key (для AI модерации)
- [ ] Expo аккаунт с EAS CLI установленным

---

## Part 1: Настройка Supabase (Database)

### 1.1 Создайте проект в Supabase

```bash
# Перейдите на https://supabase.com/dashboard
# Создайте новый проект
# Запишите следующие данные:
# - Project URL: https://xxxxx.supabase.co
# - anon/public key
# - service_role key (secret)
# - Database URL (в Settings > Database > Connection string)
```

### 1.2 Запустите миграции базы данных

```sql
-- Скопируйте содержимое файла backend/schema.sql
-- Выполните в Supabase SQL Editor

-- Основные таблицы:
-- - users (родители и дети)
-- - chats
-- - messages  
-- - alerts
-- - settings
-- - notifications
```

### 1.3 Настройте Row Level Security (RLS)

```sql
-- Скопируйте содержимое backend/security-policies.sql
-- Выполните в Supabase SQL Editor
-- Это защитит данные пользователей
```

### 1.4 Обновите .env файлы

```bash
# В backend/.env.production добавьте:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="ваш-anon-key"
SUPABASE_SERVICE_ROLE_KEY="ваш-service-role-key"

# В .env.production (frontend) добавьте:
EXPO_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="ваш-anon-key"
```

---

## Part 2: Деплой Backend на Vercel

### 2.1 Установите Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Залогиньтесь в Vercel

```bash
vercel login
```

### 2.3 Деплой backend

```bash
cd backend

# Первый deploy (интерактивный)
vercel

# Или production deploy сразу
vercel --prod

# Запомните URL, например: https://kiku-backend.vercel.app
```

### 2.4 Добавьте Environment Variables в Vercel

```bash
# Через CLI
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add JWT_SECRET production
vercel env add OPENAI_API_KEY production
vercel env add SENTRY_DSN production

# Или через Vercel Dashboard:
# https://vercel.com/your-name/kiku-backend/settings/environment-variables
```

### 2.5 Переделай после добавления env vars

```bash
vercel --prod
```

---

## Part 3: Настройка Sentry Monitoring

### 3.1 Создайте проект в Sentry

```bash
# Перейдите на https://sentry.io
# Create New Project
# Platform: React Native
# Alert frequency: On every new issue
```

### 3.2 Получите DSN

```bash
# В настройках проекта скопируйте DSN
# Формат: https://xxxxx@o123456.ingest.sentry.io/123456
```

### 3.3 Установите Sentry в проект

```bash
# В корне проекта
npx @sentry/wizard@latest -i reactNative

# Или вручную:
bun add @sentry/react-native
```

### 3.4 Обновите .env

```bash
# Frontend .env.production
SENTRY_DSN="https://xxxxx@sentry.io/123456"
SENTRY_ORG="your-org"
SENTRY_PROJECT="kiku-production"

# Backend .env.production
SENTRY_DSN="https://xxxxx@sentry.io/123456"
SENTRY_ENVIRONMENT="production"
```

---

## Part 4: Настройка Frontend Environment Variables

### 4.1 Обновите .env.production

```bash
# В корневом .env.production добавьте URL backend
EXPO_PUBLIC_API_URL="https://kiku-backend.vercel.app"
EXPO_PUBLIC_BACKEND_URL="https://kiku-backend.vercel.app"
EXPO_PUBLIC_RORK_API_BASE_URL="https://kiku-backend.vercel.app"

# OpenAI
EXPO_PUBLIC_OPENAI_API_KEY="sk-your-production-key"

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_MODERATION=true
EXPO_PUBLIC_ENABLE_SOS_ALERTS=true
```

### 4.2 Добавьте секреты в EAS

```bash
# ВАЖНО: Используйте EAS Secrets для чувствительных данных
eas secret:create --scope project --name OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name SUPABASE_URL --value "https://..."
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "..."
eas secret:create --scope project --name SENTRY_DSN --value "https://..."
```

---

## Part 5: Build & Deploy Frontend

### 5.1 Проверьте конфигурацию

```bash
# Проверка TypeScript
bunx tsc --noEmit

# Проверка ESLint
bun run lint

# Запуск тестов
bun run test
```

### 5.2 Запустите Production Build

```bash
# Preview build (для тестирования)
eas build --platform all --profile preview

# Production build
eas build --platform all --profile production
```

### 5.3 Отправьте в сторы

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## Part 6: Проверка и Тестирование

### 6.1 Проверьте Backend API

```bash
# Проверка health endpoint
curl https://kiku-backend.vercel.app/

# Ожидаемый ответ:
# {"status":"ok","message":"API is running"}
```

### 6.2 Проверьте Database Connection

```bash
# В backend запустите тест
cd backend
bun run check:api
```

### 6.3 Проверьте Sentry

```bash
# Откройте Sentry Dashboard
# Issues > All Issues
# Должны видеть test events (если отправляли)
```

---

## Part 7: Post-Deployment

### 7.1 Настройте мониторинг

```bash
# В Vercel Dashboard:
# - Настройте Alerts (email уведомления)
# - Настройте Log Drains (если нужно)

# В Sentry:
# - Настройте Alert Rules
# - Добавьте Slack/Email интеграции
```

### 7.2 Настройте CI/CD (опционально)

```bash
# GitHub Actions уже настроен в .github/workflows/
# Проверьте и обновите secrets в GitHub:
# - EXPO_TOKEN
# - VERCEL_TOKEN (если нужно auto-deploy backend)
```

---

## 🔥 Quick Deploy Script

Для быстрого деплоя всего проекта:

```bash
#!/bin/bash
# deploy-all.sh

echo "🚀 KIKU Full Deployment"

# 1. Backend
echo "📦 Deploying backend..."
cd backend
vercel --prod
cd ..

# 2. Frontend
echo "📱 Building frontend..."
eas build --platform all --profile production

echo "✅ Deployment complete!"
echo "Backend: https://kiku-backend.vercel.app"
echo "Frontend: Check EAS Dashboard for build status"
```

---

## 📞 Troubleshooting

### Backend не запускается на Vercel

```bash
# Проверьте логи
vercel logs

# Проверьте env vars
vercel env ls

# Локальная проверка
cd backend
vercel dev
```

### Frontend не подключается к Backend

```bash
# Проверьте URL в .env.production
echo $EXPO_PUBLIC_API_URL

# Проверьте CORS в backend/index.ts
# Убедитесь что ваш origin в allowedOrigins
```

### Database connection errors

```bash
# Проверьте connection string
# В Supabase Dashboard > Settings > Database
# Убедитесь что используете Transaction pooler (не Session)

# Connection string format:
# postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## ✅ Deployment Checklist

Перед публикацией убедитесь:

- [ ] ✅ Supabase настроен и таблицы созданы
- [ ] ✅ Backend задеплоен на Vercel
- [ ] ✅ Backend env vars добавлены в Vercel
- [ ] ✅ Frontend env vars обновлены
- [ ] ✅ EAS secrets настроены
- [ ] ✅ Sentry подключен и тестирован
- [ ] ✅ TypeScript без ошибок
- [ ] ✅ ESLint без warnings
- [ ] ✅ Тесты проходят
- [ ] ✅ Production build успешно создан
- [ ] ✅ Privacy Policy опубликована
- [ ] ✅ Terms of Service опубликованы

---

## 🎉 Готово!

Ваше приложение KIKU теперь в продакшн!

**Важные ссылки:**
- 📊 Vercel Dashboard: https://vercel.com/dashboard
- 🗄️ Supabase Dashboard: https://supabase.com/dashboard
- 🐛 Sentry Dashboard: https://sentry.io
- 📱 EAS Dashboard: https://expo.dev

**Поддержка:**
- 📧 Email: support@rork.ai
- 📚 Docs: https://docs.rork.ai
- 💬 Discord: https://discord.gg/rork

---

**Последнее обновление:** 1 февраля 2026
