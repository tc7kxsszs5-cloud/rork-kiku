# ✅ ФИНАЛЬНЫЙ Connection String

## 🔐 Готовый Connection String:

```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Команды (скопируйте и выполните):

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вопросы:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте:
  ```
  postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

```bash
bunx vercel --prod
```

```bash
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

✅ **Этот connection string должен работать!**
