# ⚡ Быстрая команда для Connection Pooling

## 🎯 Попробуйте это (замените [PASSWORD] на реальный пароль)

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вставьте:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Замените `[PASSWORD]` на реальный пароль!**

Затем:
```bash
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 🔄 Если не работает, попробуйте другие регионы

**eu-west-1:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

**ap-southeast-1:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

**Начните с `us-east-1`!**
