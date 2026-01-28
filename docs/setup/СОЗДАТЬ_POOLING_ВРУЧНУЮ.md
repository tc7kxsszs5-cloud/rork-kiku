# 🔧 Создать Connection Pooling вручную

## ✅ Если нет раздела Connection Pooling в Dashboard

Можно создать connection string вручную! Попробуйте эти варианты по очереди.

## 📋 Вариант 1: us-east-1 (попробуйте сначала)

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вставьте (замените `[PASSWORD]` на реальный пароль):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Проверьте:**
```bash
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 📋 Вариант 2: eu-west-1 (если вариант 1 не работает)

```bash
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вставьте:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

## 📋 Вариант 3: ap-southeast-1 (если вариант 2 не работает)

```bash
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вставьте:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## 📋 Вариант 4: Попробуйте без региона (direct pooler)

```bash
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Вставьте:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@db.eznumgsmwvavyunqhxfc.pooler.supabase.com:6543/postgres
```

## 🔍 Формат Connection Pooling

**Общий формат:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
```

**Ваш project reference:** `eznumgsmwvavyunqhxfc`

**Варианты хоста:**
- `aws-0-us-east-1.pooler.supabase.com`
- `aws-0-eu-west-1.pooler.supabase.com`
- `aws-0-ap-southeast-1.pooler.supabase.com`
- `db.eznumgsmwvavyunqhxfc.pooler.supabase.com`

## 💡 Пример

Если пароль `mypass123`, используйте:
```
postgresql://postgres.eznumgsmwvavyunqhxfc:mypass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## ⚠️ Важно

- Пользователь: `postgres.eznumgsmwvavyunqhxfc` (с точкой и project ref)
- Хост: должен содержать `pooler.supabase.com`
- Порт: `6543` (не 5432)

---

**Попробуйте вариант 1 с `us-east-1` - это самый распространенный регион!**
