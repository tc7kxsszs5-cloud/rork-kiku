# 📋 Команды с правильным Project Reference

## ✅ Правильный Project Reference: `apbkobhfnmcqqzqeeqss`

## 1. Перейдите в директорию

```bash
cd /Users/mac/Desktop/rork-kiku/backend
```

## 2. Удалите старый DATABASE_URL

```bash
bunx vercel env rm DATABASE_URL production
```

**Ответьте:** `y`

## 3. Добавьте новый DATABASE_URL

```bash
bunx vercel env add DATABASE_URL production
```

**Ответьте:**
- `Mark as sensitive?` → **yes**
- `What's the value of DATABASE_URL?` → Вставьте (попробуйте US East сначала):

```
postgres://postgres.apbkobhfnmcqqzqeeqss:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:5432/postgres
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

## 🔄 Если не работает с портом 5432:

Попробуйте с портом `6543`:

```
postgres://postgres.apbkobhfnmcqqzqeeqss:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## ⚠️ Если регион не US East:

Замените `us-east-1` на ваш регион:
- `us-west-1` для US West
- `eu-central-1` для Europe

---

**Используйте правильный project reference: `apbkobhfnmcqqzqeeqss`!**
