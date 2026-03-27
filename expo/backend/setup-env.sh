#!/bin/bash

# 🔧 Скрипт для настройки Environment Variables

echo "=== НАСТРОЙКА ENVIRONMENT VARIABLES ==="
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен"
    echo "Установите: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI установлен"
echo ""

# Проверка входа
if ! vercel whoami &> /dev/null; then
    echo "⚠️ Вы не вошли в Vercel"
    echo "Выполните: vercel login"
    exit 1
fi

echo "✅ Вы вошли в Vercel: $(vercel whoami)"
echo ""

# Запрос Connection String
echo "📋 Введите Connection String из Supabase (Session mode):"
echo "   (Идите в Supabase → Settings → Database → Session mode)"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Connection String не может быть пустым"
    exit 1
fi

echo ""
echo "🔧 Настраиваю Environment Variables в Vercel..."

# Установка переменных
vercel env add DATABASE_URL production <<< "$DATABASE_URL" || echo "⚠️ Ошибка при добавлении DATABASE_URL"
vercel env add NODE_ENV production <<< "production" || echo "⚠️ Ошибка при добавлении NODE_ENV"

echo ""
echo "✅ Environment Variables настроены!"
echo ""
echo "📋 Следующий шаг:"
echo "   vercel --prod"
echo ""
