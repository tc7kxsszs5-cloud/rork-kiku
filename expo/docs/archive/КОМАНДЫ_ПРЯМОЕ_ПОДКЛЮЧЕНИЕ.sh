#!/bin/bash

# Команды для установки прямого подключения

echo "🔄 Установка прямого подключения к Supabase..."
echo ""

cd /Users/mac/Desktop/rork-kiku/backend

echo "1️⃣ Удаление старого DATABASE_URL..."
bunx vercel env rm DATABASE_URL production

echo ""
echo "2️⃣ Добавление нового DATABASE_URL (прямое подключение)..."
echo "   Когда спросит 'Mark as sensitive?' → yes"
echo "   Когда спросит 'What's the value?' → вставьте:"
echo ""
echo "   postgresql://postgres:gerkom-tYbpek-2cochi@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres"
echo ""

bunx vercel env add DATABASE_URL production

echo ""
echo "3️⃣ Деплой..."
bunx vercel --prod

echo ""
echo "4️⃣ Проверка подключения..."
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"

echo ""
echo "✅ Готово!"
