# 🔄 Что делать после Reset пароля в Supabase

## ✅ Отлично! Если вы сделали Reset пароля

Теперь у вас **новый пароль**. Нужно обновить DATABASE_URL в Vercel с новым паролем.

## 📋 Пошаговая инструкция

### Шаг 1: Убедитесь, что скопировали новый пароль

После Reset пароль показывается **только один раз**! Если не скопировали:
- Пароль уже не будет виден
- Нужно сделать Reset еще раз

### Шаг 2: Создайте Connection String с новым паролем

**Формат:**
```
postgresql://postgres:[НОВЫЙ_ПАРОЛЬ]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Пример:**
Если новый пароль `NewPassword123`, то:
```
postgresql://postgres:NewPassword123@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

### Шаг 3: Обновите DATABASE_URL в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Удалите старую переменную (со старым паролем)
bunx vercel env rm DATABASE_URL production

# Добавьте новую с новым паролем
bunx vercel env add DATABASE_URL production
```

Когда появится запрос:
```
? What's the value of DATABASE_URL?
```

**Вставьте connection string с НОВЫМ паролем:**
```
postgresql://postgres:[НОВЫЙ_ПАРОЛЬ]@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**Замените `[НОВЫЙ_ПАРОЛЬ]` на реальный новый пароль!**

Нажмите Enter.

### Шаг 4: Перезапустите деплой

```bash
bunx vercel --prod
```

### Шаг 5: Проверьте подключение

```bash
# Подождите 20-25 секунд после деплоя
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

## ⚠️ Если не скопировали новый пароль

Если вы сделали Reset, но не скопировали пароль:

1. Вернитесь в Supabase Dashboard
2. **Settings** → **Database**
3. Найдите **Database password**
4. Нажмите **Reset database password** еще раз
5. **Сразу скопируйте** новый пароль (показывается только один раз!)
6. Сохраните пароль в безопасном месте

## 📝 Пример полного процесса

**1. Новый пароль из Supabase:** `MyNewPass456`

**2. Connection string:**
```
postgresql://postgres:MyNewPass456@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
```

**3. Команды:**
```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env rm DATABASE_URL production
bunx vercel env add DATABASE_URL production
# Вставляете: postgresql://postgres:MyNewPass456@db.eznumgsmwvavyunqhxfc.supabase.co:5432/postgres
bunx vercel --prod
```

## ✅ Успешная проверка

После обновления вы должны увидеть:
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

---

**Главное:** Используйте **НОВЫЙ пароль** из Reset, не старый!
