# ✅ ФИНАЛЬНЫЙ Connection String с правильным Reference ID

## ✅ Reference ID: `eznumgsmwvavyunqhxfc`

## 🔐 Готовый Connection String:

```
postgres://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Что правильно:

- ✅ Reference ID: `eznumgsmwvavyunqhxfc`
- ✅ Username: `postgres.eznumgsmwvavyunqhxfc` (с project reference)
- ✅ Пароль: `gerkom-tYbpek-2cochi`
- ✅ Host: `aws-0-us-east-1.pooler.supabase.com` (Ohio = US East)
- ✅ Порт: `6543` (для pooling)
- ✅ Database: `postgres`

---

## 📋 Команды для копирования:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
# y
bunx vercel env add DATABASE_URL production
# yes
# Вставьте: postgres://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## ✅ Ожидаемый результат:

```json
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "version": "PostgreSQL ...",
        "tables": [...]
      }
    }
  }
}
```

---

**Используйте правильный Reference ID: `eznumgsmwvavyunqhxfc`!**
