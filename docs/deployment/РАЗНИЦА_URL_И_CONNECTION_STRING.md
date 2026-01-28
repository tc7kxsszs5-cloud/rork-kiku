# 🔍 Разница между URL проекта и Connection String

## ❌ Это НЕ connection string

**URL проекта:**
```
https://eznumgsmwvavyunqhxfc.supabase.co
```

Это просто адрес вашего проекта в Supabase.

---

## ✅ Connection String выглядит так:

```
postgresql://postgres:[YOUR-PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

Или (для pooling):
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## 📋 Где найти Connection String

### Шаг 1: Откройте ваш проект

1. Идите на [supabase.com](https://supabase.com)
2. Войдите в аккаунт
3. Откройте проект (тот, у которого URL `eznumgsmwvavyunqhxfc`)

### Шаг 2: Найдите Connection String

1. Слева нажмите **Settings** (шестеренка ⚙️)
2. Выберите **Database**
3. Прокрутите вниз
4. Найдите секцию **"Connection string"** или **"Connection URI"**

### Шаг 3: Скопируйте Connection String

Там будет поле с текстом типа:
```
postgresql://postgres:[YOUR-PASSWORD]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Это и есть connection string!**

---

## 🔧 Как составить Connection String вручную

Если не можете найти в интерфейсе, можно составить вручную:

### Вариант 1: Прямой (порт 5432)

```
postgresql://postgres:ВАШ_ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

Где:
- `postgres` - пользователь
- `ВАШ_ПАРОЛЬ` - ваш пароль базы данных
- `db.eznumgsmwvavyunqhxfc.supabase.co` - хост (из вашего URL)
- `5432` - порт
- `postgres` - название базы данных

### Вариант 2: Pooling (порт 6543)

```
postgresql://postgres.eznumgsmwvavyunqhxfc:ВАШ_ПАРОЛЬ@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## ✅ Что нужно сделать

1. **Найдите ваш пароль базы данных**
   - Это пароль, который вы указали при создании проекта
   - Или найдите его в Settings → Database

2. **Составьте connection string:**
   ```
   postgresql://postgres:ВАШ_ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
   ```
   (Замените `ВАШ_ПАРОЛЬ` на реальный пароль)

3. **Используйте в Vercel:**
   - Settings → Environment Variables
   - Key: `DATABASE_URL`
   - Value: ваш connection string

---

## 🆘 Если не знаете пароль

1. Settings → Database
2. Найдите секцию **"Database password"** или **"Reset database password"**
3. Если забыли - можно сбросить пароль

---

## 🎯 Главное

**URL проекта ≠ Connection String**

Connection string - это строка для подключения к базе данных, которая начинается с `postgresql://`

Найдите её в Settings → Database → Connection string
