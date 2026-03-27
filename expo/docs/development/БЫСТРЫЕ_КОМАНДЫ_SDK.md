# 📋 Быстрые команды для перехода на Supabase SDK

## 1. Установка зависимостей

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bun install
```

## 2. Получите ключи из Supabase

1. https://supabase.com/dashboard
2. Settings → API
3. Скопируйте:
   - **Project URL** (например: `https://eznumgsmwvavyunqhxfc.supabase.co`)
   - **anon public** key

## 3. Установите переменные окружения

```bash
bunx vercel env add SUPABASE_URL production
# Вставьте Project URL
# yes (sensitive)

bunx vercel env add SUPABASE_ANON_KEY production
# Вставьте anon public key
# yes (sensitive)
```

## 4. Деплой

```bash
bunx vercel --prod
```

## 5. Проверка

```bash
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

**Готово! Теперь используется Supabase SDK вместо прямого PostgreSQL подключения!**
