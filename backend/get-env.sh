#!/bin/bash

# Скрипт для получения production переменных из Vercel

echo "📥 Получение production переменных из Vercel..."
echo ""

cd "$(dirname "$0")"

# Получаем production переменные
bunx vercel env pull --environment=production

echo ""
echo "✅ Переменные загружены в .env.local"
echo ""
echo "Проверка DATABASE_URL:"
if grep -q "DATABASE_URL" .env.local 2>/dev/null; then
    echo "✅ DATABASE_URL найден"
    # Показываем только начало (без пароля)
    DATABASE_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    if [[ $DATABASE_URL == postgresql://* ]]; then
        HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
        echo "   Host: $HOST"
        echo "   Формат: ✅ Корректный"
    else
        echo "   Формат: ❌ Неверный"
    fi
else
    echo "❌ DATABASE_URL не найден"
    echo ""
    echo "Проверьте переменные в Vercel:"
    echo "  bunx vercel env ls"
fi

echo ""
echo "Теперь запустите проверку:"
echo "  bun check-database.js"
