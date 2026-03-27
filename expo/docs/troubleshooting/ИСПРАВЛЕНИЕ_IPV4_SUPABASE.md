# 🔧 Исправление: "Use Session Pooler if on a IPv4 network"

## ❌ Проблема

При попытке подключиться к Supabase видите сообщение:
```
Use Session Pooler if on a IPv4 network or purchase IPv4 add-on
```

---

## ✅ Решение: Используйте Session Pooler

### Шаг 1: Получите правильный Connection String

1. Идите в Supabase Dashboard
2. **Settings** → **Database**
3. Найдите секцию **"Connection string"**
4. **Выберите вкладку "Session mode"** (НЕ "URI"!)

### Шаг 2: Скопируйте Connection String

**Session mode connection string выглядит так:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Отличия от обычного URI:**
- ✅ Порт: **6543** (вместо 5432)
- ✅ Хост: **pooler.supabase.com** (вместо db.xxxxx.supabase.co)
- ✅ Работает через IPv6, не требует IPv4
- ✅ Подходит для Vercel и других cloud платформ

### Шаг 3: Замените пароль

В connection string замените `[YOUR-PASSWORD]` на ваш реальный пароль базы данных.

**Пример:**
```
postgresql://postgres.abcdefgh:mySecurePassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## 📋 Где использовать

Используйте этот connection string в:

1. **Vercel Environment Variables:**
   - Settings → Environment Variables
   - Key: `DATABASE_URL`
   - Value: ваш Session mode connection string

2. **Локальной разработке** (если нужно):
   - `.env` файл
   - `DATABASE_URL=ваш_connection_string`

---

## 🔍 Как проверить

После настройки в Vercel, проверьте работу:

1. Откройте ваш API URL: `https://your-backend.vercel.app`
2. Должно вернуться: `{"status":"ok","message":"API is running"}`
3. Если есть ошибки подключения к БД - проверьте connection string

---

## ✅ Готово!

Теперь используйте **Session mode** connection string вместо обычного URI!

**Важно:** Session mode работает везде, включая Vercel, и не требует IPv4.
