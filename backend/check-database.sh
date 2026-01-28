#!/bin/bash

# Скрипт для проверки подключения к Supabase PostgreSQL

echo "🔍 ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ"
echo "========================================"
echo ""

# Проверка наличия DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL не установлен"
    echo ""
    echo "Установите переменную окружения:"
    echo "  export DATABASE_URL='postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres'"
    echo ""
    echo "Или получите из Vercel:"
    echo "  bunx vercel env pull"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL найден"
echo ""

# Извлекаем компоненты из DATABASE_URL
# Формат: postgresql://user:password@host:port/database

# Проверка через psql (если установлен)
if command -v psql &> /dev/null; then
    echo "📊 Проверка через psql..."
    echo ""
    
    # Парсим DATABASE_URL
    DB_URL="$DATABASE_URL"
    
    # Пытаемся подключиться
    if psql "$DB_URL" -c "SELECT version();" 2>/dev/null; then
        echo ""
        echo "✅ Подключение успешно!"
        echo ""
        echo "Проверка таблиц:"
        psql "$DB_URL" -c "\dt" 2>/dev/null || echo "Таблицы не найдены (это нормально для нового проекта)"
    else
        echo "❌ Ошибка подключения через psql"
        echo "Проверьте правильность DATABASE_URL"
    fi
else
    echo "⚠️ psql не установлен"
    echo ""
    echo "Установите PostgreSQL client:"
    echo "  macOS: brew install postgresql"
    echo "  или используйте скрипт check-database.js"
fi

echo ""
echo "========================================"
