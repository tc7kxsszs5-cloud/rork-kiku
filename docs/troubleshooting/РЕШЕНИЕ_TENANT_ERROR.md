# 🔧 Решение ошибки "Tenant or user not found"

## ✅ Текущее состояние:

- Username правильный: `postgres.eznumgsmwvavyunqhxfc` ✅
- Host правильный: `aws-0-us-east-1.pooler.supabase.com` ✅
- Пароль установлен ✅
- Но ошибка: `Tenant or user not found` ❌

## 🔍 Возможные решения:

### Решение 1: Использовать прямой connection string (без pooling)

Connection Pooling может не работать для вашего проекта. Попробуйте прямое подключение:

```
postgresql://postgres:gerkom-tYbpek-2cochi@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Установка:**
```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
# yes
# Вставьте прямой connection string выше
bunx vercel --prod
```

### Решение 2: Проверить регион

Если ваш регион не `us-east-1`, измените в connection string:

**Для us-west-1:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Для eu-central-1:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:gerkom-tYbpek-2cochi@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Решение 3: Проверить project reference

Убедитесь, что project reference правильный:
1. Supabase Dashboard → Settings → General
2. Reference ID должен быть: `eznumgsmwvavyunqhxfc`

---

## 💡 Рекомендация:

**Попробуйте Решение 1** - прямое подключение часто работает, когда pooling не работает.

---

## 📋 После подключения к Supabase:

Если вы что-то изменили в Supabase Dashboard, проверьте:
1. Правильный ли project reference
2. Правильный ли регион
3. Правильный ли пароль

Пришлите результат проверки!
