#!/bin/bash

# Простой скрипт для проверки DATABASE_URL из .env.local

echo "🔍 ПРОВЕРКА DATABASE_URL"
echo "========================"
echo ""

# Загружаем переменные из .env.local
if [ -f .env.local ]; then
    echo "✅ Файл .env.local найден"
    source .env.local
    
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL не найден в .env.local"
        echo ""
        echo "Проверьте файл .env.local или получите переменные из Vercel:"
        echo "  bunx vercel env pull"
        exit 1
    fi
    
    echo "✅ DATABASE_URL загружен"
    echo ""
    
    # Парсим DATABASE_URL
    # Формат: postgresql://user:password@host:port/database
    if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
        USER="${BASH_REMATCH[1]}"
        PASSWORD="${BASH_REMATCH[2]}"
        HOST="${BASH_REMATCH[3]}"
        PORT="${BASH_REMATCH[4]}"
        DATABASE="${BASH_REMATCH[5]}"
        
        echo "📋 Параметры подключения:"
        echo "   User: $USER"
        echo "   Password: ${PASSWORD:0:3}***"
        echo "   Host: $HOST"
        echo "   Port: $PORT"
        echo "   Database: $DATABASE"
        echo ""
        
        # Проверяем формат Supabase
        if [[ $HOST == db.*.supabase.co ]]; then
            PROJECT_REF=$(echo $HOST | sed 's/db\.\([^.]*\)\.supabase\.co/\1/')
            echo "✅ Supabase проект обнаружен"
            echo "   Project Ref: $PROJECT_REF"
            echo ""
            echo "🌐 Supabase Dashboard:"
            echo "   https://supabase.com/dashboard/project/$PROJECT_REF"
            echo ""
        fi
        
        echo "✅ Формат DATABASE_URL корректен"
        echo ""
        echo "Для проверки подключения используйте:"
        echo "  bun check-database.js"
        echo ""
        echo "Или установите psql и используйте:"
        echo "  brew install postgresql"
        echo "  psql \"\$DATABASE_URL\" -c \"SELECT version();\""
        
    else
        echo "❌ Неверный формат DATABASE_URL"
        echo ""
        echo "Ожидаемый формат:"
        echo "  postgresql://user:password@host:port/database"
        exit 1
    fi
else
    echo "❌ Файл .env.local не найден"
    echo ""
    echo "Получите переменные из Vercel:"
    echo "  bunx vercel env pull"
    exit 1
fi
