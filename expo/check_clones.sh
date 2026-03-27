#!/bin/bash

# Скрипт для проверки статистики клонирований репозитория GitHub
# Использование: ./check_clones.sh [GITHUB_TOKEN]

REPO_OWNER="tc7kxsszs5-cloud"
REPO_NAME="rork-kiku"
GITHUB_TOKEN="${1:-$GITHUB_TOKEN}"

echo "🔍 Проверка статистики клонирований репозитория: ${REPO_OWNER}/${REPO_NAME}"
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GitHub токен не найден!"
    echo ""
    echo "Для получения статистики клонирований нужен Personal Access Token."
    echo ""
    echo "Способы получения статистики:"
    echo ""
    echo "1️⃣  Через веб-интерфейс GitHub:"
    echo "   https://github.com/${REPO_OWNER}/${REPO_NAME}/graphs/traffic"
    echo ""
    echo "2️⃣  Через API с токеном:"
    echo "   ./check_clones.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "3️⃣  Через переменную окружения:"
    echo "   export GITHUB_TOKEN=your_token"
    echo "   ./check_clones.sh"
    echo ""
    exit 1
fi

echo "📊 Запрос статистики клонирований через GitHub API..."
echo ""

# Получаем статистику клонирований за последние 14 дней
RESPONSE=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/traffic/clones")

# Проверяем ответ
if echo "$RESPONSE" | grep -q "Bad credentials"; then
    echo "❌ Ошибка: Неверный токен или токен истек"
    exit 1
fi

if echo "$RESPONSE" | grep -q "Not Found"; then
    echo "❌ Ошибка: Репозиторий не найден или нет доступа"
    exit 1
fi

# Парсим JSON ответ
COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | head -1 | cut -d':' -f2)
UNIQUES=$(echo "$RESPONSE" | grep -o '"uniques":[0-9]*' | head -1 | cut -d':' -f2)

echo "✅ Статистика клонирований (за последние 14 дней):"
echo ""
echo "   📥 Всего клонирований: ${COUNT:-0}"
echo "   👥 Уникальных клонирований: ${UNIQUES:-0}"
echo ""
echo "📋 Полный ответ API:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""
echo "💡 Примечание:"
echo "   - 'count' - общее количество клонирований (включая повторные)"
echo "   - 'uniques' - количество уникальных клонирований (разные пользователи/IP)"
echo ""
echo "   ⚠️  Я (AI ассистент) НЕ клонировал ваш репозиторий."
echo "   Я работаю только с локальными файлами в вашей директории."
