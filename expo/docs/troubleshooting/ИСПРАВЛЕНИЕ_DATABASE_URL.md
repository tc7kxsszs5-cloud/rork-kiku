# 🔧 Исправление ошибки подключения к базе данных

## ❌ Ошибка

```
getaddrinfo ENOTFOUND db.eznumgsmwvavyunqhxfc.supabase.co
```

Это означает, что DNS не может найти хост базы данных.

## 🔍 Возможные причины:

1. **Неправильный project reference** в DATABASE_URL
2. **Проект Supabase приостановлен** или удален
3. **Неправильный формат connection string**
4. **Нужно использовать Connection Pooling** вместо прямого подключения

## ✅ Решение 1: Проверьте проект Supabase

1. Откройте https://supabase.com/dashboard
2. Проверьте, что проект `eznumgsmwvavyunqhxfc` существует и активен
3. Если проект приостановлен - восстановите его

## ✅ Решение 2: Получите правильный Connection String

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Connection string**
5. Выберите **Session mode** (не Transaction или Pooling)
6. Скопируйте connection string

Формат должен быть:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Или прямой формат:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## ✅ Решение 3: Обновите DATABASE_URL в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую переменную
bunx vercel env rm DATABASE_URL production

# Добавьте новую с правильным connection string
bunx vercel env add DATABASE_URL production
# Вставьте правильный connection string из Supabase Dashboard
```

## ✅ Решение 4: Используйте Connection Pooling (рекомендуется)

Для production лучше использовать Connection Pooling:

1. В Supabase Dashboard → **Settings** → **Database**
2. Найдите **Connection pooling**
3. Используйте **Session mode** connection string
4. Формат: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

## 🔍 Проверка project reference

Если project reference `eznumgsmwvavyunqhxfc` неправильный:

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект
3. В URL будет: `https://supabase.com/dashboard/project/[ПРАВИЛЬНЫЙ-REF]`
4. Используйте этот REF в connection string

## 🧪 Проверка после исправления

После обновления DATABASE_URL:

```bash
# Перезапустите деплой
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel --prod

# Подождите 20-25 секунд, затем проверьте
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 📋 Правильный формат DATABASE_URL

### Вариант 1: Прямое подключение (для разработки)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Вариант 2: Connection Pooling (для production - рекомендуется)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## ⚠️ Важно

- Замените `[PASSWORD]` на реальный пароль из Supabase
- Замените `[PROJECT-REF]` на правильный reference вашего проекта
- Замените `[REGION]` на регион вашего проекта (например, `us-east-1`)

---

**Следующий шаг:** Проверьте проект в Supabase Dashboard и обновите DATABASE_URL с правильным connection string.
