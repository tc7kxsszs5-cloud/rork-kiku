# 🔧 Решение проблемы DNS: ENOTFOUND db.*.supabase.co

## ❌ Проблема

DNS не может найти `db.eznumgsmwvavyunqhxfc.supabase.co`. Это означает, что:

1. **Прямое подключение не работает** на Vercel serverless функциях
2. **Нужно использовать Connection Pooling** вместо прямого подключения

## ✅ Решение: Используйте Connection Pooling

Для Vercel **обязательно** нужно использовать Connection Pooling, а не прямое подключение к `db.*.supabase.co`.

## 📋 Где найти Connection Pooling String

### Вариант 1: В Supabase Dashboard

1. Откройте https://supabase.com/dashboard
2. Выберите проект
3. **Settings** → **Database**
4. Прокрутите до раздела **Connection pooling** (может быть внизу страницы)
5. Найдите connection string для pooling

**Формат будет:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Пример:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Вариант 2: Если нет раздела Connection Pooling

Попробуйте составить вручную:

1. Узнайте регион вашего проекта Supabase (обычно в URL или настройках)
2. Используйте формат:
   ```
   postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

**Регионы Supabase:**
- `us-east-1` (США восток)
- `us-west-1` (США запад)
- `eu-west-1` (Европа)
- `ap-southeast-1` (Азия)

## 🔄 Обновление DATABASE_URL

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую переменную
bunx vercel env rm DATABASE_URL production

# Добавьте новую с Connection Pooling
bunx vercel env add DATABASE_URL production
```

**Вставьте connection string с `pooler.supabase.com`:**

```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Замените:**
- `[PASSWORD]` на реальный пароль
- `[REGION]` на регион вашего проекта (например, `us-east-1`)

## 🔍 Разница между форматами

### ❌ Прямое подключение (не работает на Vercel):
```
postgresql://postgres:[PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
                                    ^^
                                    DNS не находит!
```

### ✅ Connection Pooling (работает на Vercel):
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                ^^^^^^                                    ^^^^^^
                С точкой!                                 pooler!
```

## 📋 Как узнать регион проекта

1. В Supabase Dashboard посмотрите URL проекта
2. Или в настройках проекта может быть указан регион
3. Или попробуйте разные регионы: `us-east-1`, `eu-west-1`, `ap-southeast-1`

## 🧪 Проверка после обновления

```bash
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

Теперь endpoint покажет больше диагностической информации, если будет ошибка.

---

**Главное:** Используйте Connection Pooling с `pooler.supabase.com`, а не прямое подключение с `db.*.supabase.co`!
