# 🔧 Использование Connection Pooling для Supabase

## ❌ Проблема

Ошибка DNS: `getaddrinfo ENOTFOUND db.eznumgsmwvavyunqhxfc.supabase.co`

Прямое подключение к `db.*.supabase.co` не работает на Vercel.

## ✅ Решение: Используйте Connection Pooling

Для Vercel serverless функций **обязательно** нужно использовать **Connection Pooling**, а не прямое подключение.

## 📋 Пошаговая инструкция

### Шаг 1: Получите Connection Pooling String

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект
3. **Settings** → **Database**
4. Прокрутите до раздела **Connection pooling**
5. Выберите вкладку **Session mode**
6. Скопируйте connection string

**Формат будет:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Обратите внимание:**
- Хост: `aws-0-[REGION].pooler.supabase.com` (НЕ `db.*.supabase.co`)
- Порт: `6543` (НЕ `5432`)
- Пользователь: `postgres.[PROJECT-REF]` (НЕ просто `postgres`)

### Шаг 2: Замените [YOUR-PASSWORD]

**Было:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Стало (пример):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:ваш_пароль@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Шаг 3: Обновите в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую переменную
bunx vercel env rm DATABASE_URL production

# Добавьте новую с Connection Pooling
bunx vercel env add DATABASE_URL production
# Вставьте connection string с pooler.supabase.com (с реальным паролем!)

# Перезапустите деплой
bunx vercel --prod
```

### Шаг 4: Проверьте

```bash
# Подождите 20-25 секунд после деплоя
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 🔍 Разница между форматами

### ❌ Прямое подключение (не работает на Vercel):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
                                    ^^
                                    Проблема здесь!
```

### ✅ Connection Pooling (работает на Vercel):
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                ^^^^^^                                    ^^^^^^
                С точкой!                                 pooler!
```

## 📋 Где найти Connection Pooling

В Supabase Dashboard:

1. **Settings** → **Database**
2. Прокрутите вниз до раздела **Connection pooling**
3. Вы увидите несколько вкладок:
   - **Session mode** ← ВЫБЕРИТЕ ЭТУ
   - Transaction mode
   - Pooling mode
4. Скопируйте connection string из **Session mode**

## ⚠️ Важно

- **Используйте Session mode**, не Transaction или Pooling mode
- **Хост должен быть** `pooler.supabase.com`, НЕ `db.*.supabase.co`
- **Порт должен быть** `6543`, НЕ `5432`
- **Пользователь должен быть** `postgres.[PROJECT-REF]`, НЕ просто `postgres`

## 🧪 Проверка правильности формата

Правильный connection string должен содержать:
- ✅ `pooler.supabase.com` в хосте
- ✅ Порт `6543`
- ✅ `postgres.[PROJECT-REF]` в пользователе
- ✅ Реальный пароль (не `[YOUR-PASSWORD]`)

---

**Следующий шаг:** Получите Connection Pooling string из Supabase (Session mode) и обновите DATABASE_URL в Vercel.
