# ✅ Правильный Connection String с Reference ID

## ✅ Reference ID: `eznumgsmwvavyunqhxfc`

## 🔐 Готовый Connection String:

### Вариант 1: С project reference в username (рекомендуется)

```
postgres://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Вариант 2: Без project reference в username

```
postgres://postgres:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 📋 Команды для Варианта 1:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
```

**Ответьте:** `y`

```bash
bunx vercel env add DATABASE_URL production
```

**Ответьте:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте:
  ```
  postgres://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

## 🚀 После установки:

```bash
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## 💡 Если Вариант 1 не работает:

Попробуйте Вариант 2 (без project reference в username).

---

**Используйте правильный Reference ID: `eznumgsmwvavyunqhxfc`!**
