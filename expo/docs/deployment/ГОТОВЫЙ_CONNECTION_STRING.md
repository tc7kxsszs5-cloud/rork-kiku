# ✅ Готовый Connection String

## 🔐 Ваш пароль:
```
gerkom-tYbpek-2cochi
```

## ✅ Готовый Connection String для Vercel:

```
postgresql://postgres:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Команды для установки:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте на вопросы:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте:
  ```
  postgresql://postgres:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

## 🚀 После установки:

```bash
bunx vercel --prod
```

## ✅ Проверка:

```bash
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## 💡 Примечание:

Пароль содержит дефис `-`, который не требует URL-кодирования. Connection string готов к использованию!
