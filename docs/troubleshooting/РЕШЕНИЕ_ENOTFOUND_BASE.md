# 🔧 Решение ошибки "getaddrinfo ENOTFOUND base"

## ❌ Проблема:

Ошибка `getaddrinfo ENOTFOUND base` означает, что connection string неправильно разобран.

## 🔍 Возможные причины:

### 1. Проблема с форматом URL

Попробуйте использовать `postgresql://` вместо `postgres://`:

```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 2. Проблема с паролем (специальные символы)

Пароль `gerkom-tYbpek-2cochi` содержит дефис `-`, который обычно не требует кодирования, но попробуем проверить.

### 3. Проблема с форматом connection string

Может быть нужно использовать другой формат.

---

## ✅ Решения для тестирования:

### Решение 1: Использовать `postgresql://` вместо `postgres://`

```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Решение 2: URL-кодировать дефис в пароле (если нужно)

Дефис обычно не требует кодирования, но попробуем.

### Решение 3: Проверить, может быть нужен другой формат username

Попробуйте без project reference:

```
postgresql://postgres:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 📋 Команды для Решения 1:

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
# y
bunx vercel env add DATABASE_URL production
# yes
# Вставьте: postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-east-1.pooler.supabase.com:6543/postgres
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

**Попробуйте Решение 1 - используйте `postgresql://` вместо `postgres://`!**
