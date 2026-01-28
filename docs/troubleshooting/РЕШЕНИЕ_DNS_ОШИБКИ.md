# 🔧 Решение ошибки DNS: ENOTFOUND db.eznumgsmwvavyunqhxfc.supabase.co

## ❌ Текущая ошибка

```
getaddrinfo ENOTFOUND db.eznumgsmwvavyunqhxfc.supabase.co
```

API работает, но подключение к базе данных не устанавливается.

## 🔍 Возможные причины:

1. **Проект Supabase был переименован** или удален
2. **Неправильный project reference** в connection string
3. **Нужно использовать Connection Pooling** вместо прямого подключения
4. **DATABASE_URL не обновлен** в Vercel после изменений

## ✅ Решение 1: Проверьте проект в Supabase

1. Откройте https://supabase.com/dashboard
2. Проверьте, что проект существует и активен
3. Проверьте project reference в URL:
   - URL будет: `https://supabase.com/dashboard/project/[PROJECT-REF]`
   - Убедитесь, что `[PROJECT-REF]` совпадает с `eznumgsmwvavyunqhxfc`

## ✅ Решение 2: Используйте Connection Pooling

Для Vercel serverless функций лучше использовать **Connection Pooling**:

1. Supabase Dashboard → **Settings** → **Database**
2. Найдите раздел **Connection pooling**
3. Выберите **Session mode**
4. Скопируйте connection string (он будет с другим хостом, например `pooler.supabase.com`)
5. Формат будет:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## ✅ Решение 3: Получите свежий Connection String

1. Supabase Dashboard → ваш проект
2. **Settings** → **Database**
3. **Connection string** → **Session mode**
4. Убедитесь, что используете **самый свежий** connection string
5. Проверьте, что project reference правильный

## ✅ Решение 4: Обновите DATABASE_URL в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Проверьте текущие переменные
bunx vercel env ls

# Удалите старую переменную
bunx vercel env rm DATABASE_URL production

# Добавьте новую с правильным connection string
bunx vercel env add DATABASE_URL production
# Вставьте правильный connection string из Supabase

# Перезапустите деплой
bunx vercel --prod
```

## 🔍 Проверка project reference

Если project reference изменился:

1. В Supabase Dashboard посмотрите URL проекта
2. Project reference будет в URL: `.../project/[REF]`
3. Используйте этот REF в connection string

## 📋 Правильные форматы Connection String

### Вариант 1: Прямое подключение
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Вариант 2: Connection Pooling (рекомендуется для Vercel)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## 🧪 Проверка после исправления

```bash
# Подождите 20-25 секунд после деплоя
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

Успешный ответ:
```json
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "version": "PostgreSQL 15.x",
        "tables": [],
        "extensions": ["plpgsql"]
      }
    }
  }
}
```

## ⚠️ Если проект был переименован

Если project reference изменился:

1. Получите новый connection string из Supabase
2. Обновите DATABASE_URL в Vercel
3. Перезапустите деплой

---

**Следующий шаг:** Проверьте проект в Supabase Dashboard и убедитесь, что project reference правильный. Если изменился - получите новый connection string и обновите в Vercel.
