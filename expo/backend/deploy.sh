#!/bin/bash

# 🚀 Скрипт для деплоя на Vercel

echo "=== ДЕПЛОЙ НА VERCEL ==="
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Устанавливаю Vercel CLI..."
    npm install -g vercel
fi

# Проверка логина
echo "🔐 Проверка входа в Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "Войдите в Vercel..."
    vercel login
fi

echo ""
echo "📋 Начинаю деплой..."
echo ""

# Первый деплой (development)
echo "1️⃣ Development деплой..."
vercel

echo ""
echo "✅ Development деплой завершен!"
echo ""
echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. Идите на https://vercel.com/dashboard"
echo "2. Выберите проект kiku-backend"
echo "3. Settings → Environment Variables"
echo "4. Добавьте:"
echo "   - DATABASE_URL = ваш_connection_string_из_supabase"
echo "   - NODE_ENV = production"
echo "5. Сохраните"
echo ""
read -p "Нажмите Enter когда настроите Environment Variables..."

# Production деплой
echo ""
echo "2️⃣ Production деплой..."
vercel --prod

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
echo ""
echo "📋 Ваш backend доступен по адресу:"
vercel ls --prod | grep kiku-backend || echo "Проверьте в Vercel Dashboard"
echo ""
echo "🎉 Готово!"
