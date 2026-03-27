#!/bin/bash

# 🔧 Автоматическая настройка Environment Variables

set -e

echo "=== НАСТРОЙКА ENVIRONMENT VARIABLES ==="
echo ""

# Определяем команду для Vercel CLI
VERCEL_CMD=""

# Проверяем разные способы запуска Vercel
if command -v vercel &> /dev/null; then
    # Пробуем использовать глобальную установку
    if vercel --version &> /dev/null 2>&1; then
        VERCEL_CMD="vercel"
    fi
fi

# Если глобальная установка не работает, используем bunx
if [ -z "$VERCEL_CMD" ]; then
    if command -v bunx &> /dev/null; then
        VERCEL_CMD="bunx vercel"
    elif command -v bun &> /dev/null; then
        VERCEL_CMD="bunx vercel"
    else
        echo "❌ Не найден bun или bunx"
        echo "Установите Bun: https://bun.sh"
        exit 1
    fi
fi

echo "✅ Используем: $VERCEL_CMD"
echo ""

# Проверка входа
if ! $VERCEL_CMD whoami &> /dev/null; then
    echo "❌ Вы не вошли в Vercel"
    echo "Выполните: $VERCEL_CMD login"
    exit 1
fi

echo "✅ Vercel CLI готов"
echo ""

# Запрос Connection String
echo "📋 Введите Connection String из Supabase:"
echo "   (Settings → Database → Connection string)"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Connection String не может быть пустым"
    exit 1
fi

echo ""
echo "🔧 Настраиваю Environment Variables..."

# Добавление переменных
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL production 2>/dev/null || {
    echo "⚠️ DATABASE_URL уже существует или ошибка"
}
echo "production" | $VERCEL_CMD env add NODE_ENV production 2>/dev/null || {
    echo "⚠️ NODE_ENV уже существует или ошибка"
}

echo ""
echo "✅ Environment Variables настроены!"
echo ""
