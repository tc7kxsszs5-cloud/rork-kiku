# 🔧 Исправление ошибки: Tenant or user not found

## ✅ Хорошие новости!

DNS ошибка исчезла! Connection Pooling работает, но формат пользователя неправильный.

## ❌ Текущая ошибка

```
Tenant or user not found
```

Это означает, что пользователь `postgres.eznumgsmwvavyunqhxfc` не существует.

## ✅ Решение: Попробуйте другие форматы

### Вариант 1: Просто `postgres` (без project ref)

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте:** `yes`

**Вставьте:**
```
postgresql://postgres:[ПАРОЛЬ]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Вариант 2: С project ref в другом формате

```bash
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте:** `yes`

**Вставьте:**
```
postgresql://postgres:[ПАРОЛЬ]@db.eznumgsmwvavyunqhxfc.pooler.supabase.com:6543/postgres
```

### Вариант 3: Попробуйте другой регион с простым пользователем

```bash
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
```

**Ответьте:** `yes`

**Вставьте:**
```
postgresql://postgres:[ПАРОЛЬ]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

## 📋 Проверка после каждого варианта

```bash
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 💡 Рекомендация

Начните с **Варианта 1** - используйте просто `postgres` без project ref в имени пользователя.

---

**Попробуйте Вариант 1 сначала!**
