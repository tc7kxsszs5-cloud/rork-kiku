#!/bin/bash

# 🚀 Команды для деплоя на Vercel и Supabase

echo "=== ДЕПЛОЙ НА VERCEL И SUPABASE ==="
echo ""

# Шаг 1: Supabase
echo "📋 ШАГ 1: SUPABASE"
echo "1. Идите на https://supabase.com"
echo "2. Создайте проект"
echo "3. Получите connection string из Settings → Database"
echo "4. Сохраните connection string"
echo ""
read -p "Нажмите Enter когда получите connection string..."

# Шаг 2: Vercel
echo ""
echo "📋 ШАГ 2: VERCEL"
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Устанавливаю Vercel CLI..."
    npm install -g vercel
fi

# Логин
echo "Вход в Vercel..."
vercel login

# Деплой
echo ""
echo "Деплой backend..."
cd backend
vercel

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📋 ШАГ 3: Настройте Environment Variables"
echo "1. Идите на https://vercel.com/dashboard"
echo "2. Выберите проект kiku-backend"
echo "3. Settings → Environment Variables"
echo "4. Добавьте DATABASE_URL (ваш connection string из Supabase)"
echo "5. Добавьте NODE_ENV=production"
echo ""
echo "📋 ШАГ 4: Production деплой"
echo "Выполните: vercel --prod"
echo ""
echo "✅ Готово! Ваш backend будет доступен по адресу: https://kiku-backend.vercel.app"
