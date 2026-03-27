# ✅ Исправленный Connection String

## ❌ Проблема:

Ошибка: `Tenant or user not found`

Причина: Для Connection Pooling нужен username с project reference.

## ✅ Правильный формат:

**Было (неправильно):**
```
postgresql://postgres:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Стало (правильно):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 🔧 Что изменилось:

- `postgres` → `postgres.eznumgsmwvavyunqhxfc`
- Добавлен project reference после точки

## 📋 Команды для установки:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте исправленный connection string выше

## 🚀 После установки:

```bash
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## 💡 Важно:

Для Connection Pooling username должен быть в формате: `postgres.[PROJECT-REF]`
