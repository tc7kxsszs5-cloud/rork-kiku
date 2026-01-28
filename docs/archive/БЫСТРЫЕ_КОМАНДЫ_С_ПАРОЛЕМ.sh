#!/bin/bash

# Быстрые команды с сгенерированным паролем

# Пароль
PASSWORD="JwVd9WyfJT8c6WhM"

# Connection string
CONNECTION_STRING="postgresql://postgres:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

echo "🔐 Пароль: ${PASSWORD}"
echo ""
echo "📋 Connection String:"
echo "${CONNECTION_STRING}"
echo ""
echo "📋 Команды для выполнения:"
echo ""
echo "# 1. Удалить старый DATABASE_URL"
echo "bunx vercel env rm DATABASE_URL production"
echo ""
echo "# 2. Добавить новый DATABASE_URL"
echo "bunx vercel env add DATABASE_URL production"
echo "# yes"
echo "# Вставьте: ${CONNECTION_STRING}"
echo ""
echo "# 3. Деплой"
echo "bunx vercel --prod"
echo ""
echo "# 4. Проверка"
echo 'curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"'
