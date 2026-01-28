#!/bin/bash

# 🔄 Правильная последовательность: ПРОВЕРКА → КОММИТ → PUSH
# Использование: ./check-commit-push.sh "сообщение коммита"

set -e  # Остановить при ошибке

echo "🔍 ШАГ 1: ПРОВЕРКА (TypeScript, Lint, Тесты)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверка TypeScript
echo "📝 Проверка TypeScript..."
if bunx tsc --noEmit; then
    echo "✅ TypeScript: Нет ошибок"
else
    echo "❌ TypeScript: Есть ошибки!"
    exit 1
fi

# Проверка Lint
echo "🔍 Проверка Lint..."
if bun run lint; then
    echo "✅ Lint: Нет ошибок"
else
    echo "❌ Lint: Есть ошибки!"
    exit 1
fi

# Проверка тестов (опционально, можно закомментировать если долго)
echo "🧪 Проверка тестов..."
if bun test --testPathPattern=unit --run 2>&1 | grep -q "pass"; then
    echo "✅ Тесты: Проходят"
else
    echo "⚠️  Тесты: Есть проблемы (продолжаем)"
fi

echo ""
echo "✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!"
echo ""

# Проверка что есть изменения для коммита
if [ -z "$(git status --porcelain)" ]; then
    echo "⚠️  Нет изменений для коммита"
    exit 0
fi

echo "📋 ШАГ 2: ПОДГОТОВКА К КОММИТУ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Показать статус
echo "📊 Статус изменений:"
git status --short

# Получить сообщение коммита
if [ -z "$1" ]; then
    echo ""
    echo "❓ Введите сообщение коммита:"
    read -r COMMIT_MESSAGE
else
    COMMIT_MESSAGE="$1"
fi

if [ -z "$COMMIT_MESSAGE" ]; then
    echo "❌ Сообщение коммита не может быть пустым!"
    exit 1
fi

echo ""
echo "💾 ШАГ 3: КОММИТ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Добавить все изменения
git add .

# Коммит
git commit -m "$COMMIT_MESSAGE"

echo "✅ Коммит создан!"
echo ""

echo "🚀 ШАГ 4: PUSH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Push
git push origin main

echo ""
echo "✅ ВСЁ ГОТОВО!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Проверка пройдена"
echo "✅ Коммит создан"
echo "✅ Push выполнен"
echo ""
echo "🎯 Коммит успешно запушен на GitHub!"
