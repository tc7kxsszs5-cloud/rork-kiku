# 🔧 Как построить Connection String вручную

## 📋 Если не можете найти Connection String в Supabase

Можно построить его вручную!

---

## 🔍 Шаг 1: Найдите параметры подключения

### В Supabase Dashboard:

1. **Settings → Database**
2. Найдите раздел **"Connection info"** или **"Database settings"**
3. Запишите:
   - **Host** (например: `db.eznumgsmwvavyunqhxfc.supabase.co`)
   - **Port** (`5432` или `6543`)
   - **Database** (обычно `postgres`)
   - **User** (обычно `postgres`)
   - **Password** (ваш пароль из Settings → Database → Database password)

---

## 📋 Шаг 2: Постройте Connection String

### Формат:

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

### Для вашего проекта:

**Project:** `eznumgsmwvavyunqhxfc`

**Пример:**
```
postgresql://postgres:ВАШ_ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

---

## 📋 Шаг 3: Варианты портов

### Порт 5432 (прямое подключение):
```
postgresql://postgres:ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

### Порт 6543 (Connection Pooling - рекомендуется):
```
postgresql://postgres:ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:6543/postgres
```

**Рекомендуется использовать порт 6543** для лучшей производительности!

---

## 📋 Шаг 4: Где найти пароль?

1. **Settings → Database**
2. Найдите **"Database password"**
3. Если забыли - можно сбросить пароль

---

## ✅ Готово!

Скопируйте построенную строку и используйте в `./auto-setup.sh`

---

## 🔍 Проверка:

После построения проверьте формат:
- ✅ Должна начинаться с `postgresql://`
- ✅ Содержать `@` перед host
- ✅ Содержать `:` перед port
- ✅ Содержать `/` перед database

---

## 📋 Пример полной строки:

```
postgresql://postgres.xxxxx:ВАШ_ПАРОЛЬ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Или:

```
postgresql://postgres:ВАШ_ПАРОЛЬ@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```
