# ✅ Готовый Connection String для SHARED POOLER

## 📋 Ваш оригинальный connection string:

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnopqrst.supabase.co:5432/postgres
```

## ✅ Преобразование для SHARED POOLER:

**Заменяем:**
- `[YOUR-PASSWORD]` → `gerkom-tYbpek-2cochi` (ваш пароль)
- `abcdefghijklmnopqrst` → `eznumgsmwvavyunqhxfc` (ваш project reference)
- `db.abcdefghijklmnopqrst.supabase.co:5432` → `aws-0-us-east-1.pooler.supabase.com:6543` (pooling)

## ✅ Готовый Connection String для Vercel:

```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Важно:** Username должен быть `postgres.eznumgsmwvavyunqhxfc` (с project reference) для pooling!

---

## 📋 Команды для установки:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте:
  ```
  postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

## 🚀 После установки:

```bash
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## ⚠️ Если регион не us-east-1:

Если ваш регион другой, замените `us-east-1` на ваш регион:
- `us-west-1` → `aws-0-us-west-1.pooler.supabase.com`
- `eu-central-1` → `aws-0-eu-central-1.pooler.supabase.com`

---

**Используйте готовый connection string выше!**
