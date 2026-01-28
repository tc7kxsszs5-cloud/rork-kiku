# 🔧 Исправление Connection String для Supabase

## ❌ Проблема

Ошибка: `getaddrinfo ENOTFOUND db.eznumgsmwvavyunqhxfc.supabase.co`

Проект Supabase существует, но формат connection string может быть неправильным.

## ✅ Решение: Используйте правильный формат

### Шаг 1: Получите правильный Connection String

1. Откройте https://supabase.com/dashboard
2. Выберите проект (reference: `eznumgsmwvavyunqhxfc`)
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Connection string**
5. Выберите **Session mode** (НЕ Transaction или Pooling)
6. Скопируйте connection string

### Шаг 2: Проверьте формат

Правильный формат должен быть одним из:

**Вариант A (прямое подключение):**
```
postgresql://postgres:[PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Вариант B (Connection Pooling - рекомендуется для production):**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Шаг 3: Обновите DATABASE_URL в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую переменную
bunx vercel env rm DATABASE_URL production

# Добавьте новую
bunx vercel env add DATABASE_URL production
# Вставьте правильный connection string из Supabase Dashboard
# ВАЖНО: Замените [YOUR-PASSWORD] на реальный пароль!
```

### Шаг 4: Перезапустите деплой

```bash
bunx vercel --prod
```

### Шаг 5: Проверьте подключение

```bash
# Подождите 20-25 секунд после деплоя
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## 🔍 Как найти правильный Connection String

### В Supabase Dashboard:

1. **Settings** → **Database**
2. Прокрутите до раздела **Connection string**
3. Вы увидите несколько вариантов:
   - **URI** - используйте этот
   - **Session mode** - выберите этот режим
4. Скопируйте строку, она будет выглядеть так:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
   ```
5. **ВАЖНО:** Замените `[YOUR-PASSWORD]` на реальный пароль!

### Если забыли пароль:

1. В Supabase Dashboard → **Settings** → **Database**
2. Найдите раздел **Database password**
3. Нажмите **Reset database password**
4. Сохраните новый пароль
5. Обновите connection string с новым паролем

## ⚠️ Частые ошибки

### Ошибка 1: Использование [YOUR-PASSWORD] вместо реального пароля

**Неправильно:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Правильно:**
```
postgresql://postgres:ваш_реальный_пароль@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

### Ошибка 2: Использование Transaction mode вместо Session mode

Для serverless функций (Vercel) используйте **Session mode**, не Transaction mode.

### Ошибка 3: Неправильный project reference

Убедитесь, что project reference в connection string совпадает с вашим проектом:
- Ваш проект: `eznumgsmwvavyunqhxfc`
- Connection string должен содержать: `db.eznumgsmwvavyunqhxfc.supabase.co`

## 📋 Быстрая команда (после получения connection string)

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
# Вставьте connection string с правильным паролем
bunx vercel --prod
sleep 25
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

**Следующий шаг:** Откройте Supabase Dashboard, получите правильный connection string с реальным паролем и обновите DATABASE_URL в Vercel.
