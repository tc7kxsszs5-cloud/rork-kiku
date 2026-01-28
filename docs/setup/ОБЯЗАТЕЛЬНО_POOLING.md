# ⚠️ ОБЯЗАТЕЛЬНО используйте Connection Pooling!

## ❌ Текущая проблема

Вы все еще используете **прямое подключение**:
```
postgresql://postgres:[PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

Этот формат **НЕ РАБОТАЕТ** на Vercel!

## ✅ Решение: Connection Pooling

Вы **ОБЯЗАТЕЛЬНО** должны использовать Connection Pooling с `pooler.supabase.com`.

## 📋 Где найти Connection Pooling в Supabase

### Способ 1: В разделе Database

1. Supabase Dashboard → ваш проект
2. **Settings** → **Database**
3. Прокрутите страницу **в самый низ**
4. Найдите раздел **Connection pooling** (может быть отдельным блоком)
5. Там будет connection string с `pooler.supabase.com`

### Способ 2: Через API Settings

1. **Settings** → **API**
2. Может быть информация о Connection Pooling там

### Способ 3: Составьте вручную

Если не можете найти в Dashboard, составьте вручную:

**Формат:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Ваш случай (попробуйте разные регионы):**

**Вариант 1 (us-east-1):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Вариант 2 (eu-west-1):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

**Вариант 3 (ap-southeast-1):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## 🔄 Обновление DATABASE_URL

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую
bunx vercel env rm DATABASE_URL production

# Добавьте новую с POOLING
bunx vercel env add DATABASE_URL production
```

**Вставьте connection string с `pooler.supabase.com`:**

```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Замените:**
- `[PASSWORD]` на реальный пароль
- `[REGION]` на регион (попробуйте `us-east-1` сначала)

## 🔍 Как узнать регион

1. В Supabase Dashboard посмотрите URL проекта
2. Или попробуйте разные регионы по очереди
3. Или проверьте в настройках проекта

## ✅ Правильный формат (Connection Pooling)

```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Ключевые отличия:**
- ✅ Пользователь: `postgres.eznumgsmwvavyunqhxfc` (с точкой и project ref)
- ✅ Хост: `aws-0-[REGION].pooler.supabase.com` (pooler, не db)
- ✅ Порт: `6543` (не 5432)

## 🧪 Проверка

```bash
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

**ВАЖНО:** Прямое подключение к `db.*.supabase.co` НЕ РАБОТАЕТ на Vercel. Используйте Connection Pooling с `pooler.supabase.com`!
