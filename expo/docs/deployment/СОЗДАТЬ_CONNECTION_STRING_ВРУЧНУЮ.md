# 🔧 Создать Connection String вручную

## ✅ Если не можете найти в Dashboard

Если знаете пароль, можно создать connection string вручную!

## 📋 Формат Connection String

### Вариант 1: Прямое подключение

```
postgresql://postgres:[ПАРОЛЬ]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Ваш проект:**
```
postgresql://postgres:[ПАРОЛЬ]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

### Вариант 2: Connection Pooling (если знаете регион)

```
postgresql://postgres.[PROJECT-REF]:[ПАРОЛЬ]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Пример:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[ПАРОЛЬ]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 🔑 Где взять пароль

1. Supabase Dashboard → ваш проект
2. **Settings** → **Database**
3. Найдите **Database password**
4. Если не виден - нажмите **Reset database password**
5. Скопируйте пароль

## 📝 Пример создания

**Если пароль:** `MyPassword123`

**Connection string будет:**
```
postgresql://postgres:MyPassword123@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

## 🚀 Использование

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую
bunx vercel env rm DATABASE_URL production

# Добавьте новую
bunx vercel env add DATABASE_URL production
# Вставьте созданный connection string

# Перезапустите
bunx vercel --prod
```

---

**Просто замените `[ПАРОЛЬ]` на реальный пароль из Supabase!**
