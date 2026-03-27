#!/bin/bash

# 🚀 Автоматический деплой на Vercel

set -e

echo "=== АВТОМАТИЧЕСКИЙ ДЕПЛОЙ ==="
echo ""

# Определяем команду для Vercel CLI
VERCEL_CMD=""

# Проверяем разные способы запуска Vercel
if command -v vercel &> /dev/null; then
    # Пробуем использовать глобальную установку
    if vercel --version &> /dev/null; then
        VERCEL_CMD="vercel"
    fi
fi

# Если глобальная установка не работает, используем bunx
if [ -z "$VERCEL_CMD" ]; then
    if command -v bunx &> /dev/null; then
        echo "📦 Используем bunx vercel..."
        VERCEL_CMD="bunx vercel"
    elif command -v bun &> /dev/null; then
        echo "📦 Используем bunx vercel..."
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
    echo "🔐 Войдите в Vercel..."
    $VERCEL_CMD login
fi

echo "✅ Vercel CLI готов"
echo ""

# Деплой
echo "📋 Начинаю деплой..."
$VERCEL_CMD --prod || $VERCEL_CMD

echo ""
echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"
echo ""
