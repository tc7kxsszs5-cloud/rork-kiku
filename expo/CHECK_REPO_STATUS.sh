#!/bin/bash

# Скрипт для проверки статуса репозитория GitHub

echo "🔍 Проверка статуса репозитория..."
echo ""

REPO_URL=$(git config --get remote.origin.url)
echo "📍 URL репозитория: $REPO_URL"
echo ""

# Извлекаем owner и repo из URL
if [[ $REPO_URL == *"github.com"* ]]; then
    OWNER_REPO=$(echo $REPO_URL | sed 's/.*github.com[:/]\([^.]*\).*/\1/')
    OWNER=$(echo $OWNER_REPO | cut -d'/' -f1)
    REPO=$(echo $OWNER_REPO | cut -d'/' -f2 | sed 's/\.git$//')
    
    echo "👤 Owner: $OWNER"
    echo "📦 Repo: $REPO"
    echo ""
    echo "🌐 Проверьте статус репозитория:"
    echo "   https://github.com/$OWNER/$REPO"
    echo ""
    echo "📊 Статистика клонирований:"
    echo "   https://github.com/$OWNER/$REPO/graphs/traffic"
    echo ""
    echo "⚙️  Настройки репозитория:"
    echo "   https://github.com/$OWNER/$REPO/settings"
    echo ""
    echo "💡 Как проверить статус:"
    echo "   1. Откройте ссылку выше"
    echo "   2. Если видите 🔒 замок = ПРИВАТНЫЙ ✅"
    echo "   3. Если НЕТ замка = ПУБЛИЧНЫЙ ⚠️"
    echo ""
    echo "🔐 Чтобы сделать репозиторий приватным:"
    echo "   1. Откройте: https://github.com/$OWNER/$REPO/settings"
    echo "   2. Прокрутите вниз до 'Danger Zone'"
    echo "   3. Нажмите 'Change visibility'"
    echo "   4. Выберите 'Make private'"
else
    echo "⚠️  Это не GitHub репозиторий"
fi
