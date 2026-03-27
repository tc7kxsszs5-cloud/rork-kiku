# 📋 Точный формат Connection String

## ✅ Вариант 1: Простой пользователь (попробуйте сначала)

**Формат:**
```
postgresql://postgres:[ПАРОЛЬ]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Примеры с разными паролями:**

Если пароль `abc123`:
```
postgresql://postgres:abc123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Если пароль `MyPass456`:
```
postgresql://postgres:MyPass456@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Если пароль `Secure789`:
```
postgresql://postgres:Secure789@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## ✅ Вариант 2: С project ref в хосте

**Формат:**
```
postgresql://postgres:[ПАРОЛЬ]@db.eznumgsmwvavyunqhxfc.pooler.supabase.com:6543/postgres
```

**Примеры:**

Если пароль `abc123`:
```
postgresql://postgres:abc123@db.eznumgsmwvavyunqhxfc.pooler.supabase.com:6543/postgres
```

Если пароль `MyPass456`:
```
postgresql://postgres:MyPass456@db.eznumgsmwvavyunqhxfc.pooler.supabase.com:6543/postgres
```

## ✅ Вариант 3: С project ref в пользователе (если нужно)

**Формат:**
```
postgresql://postgres.eznumgsmwvavyunqhxfc:[ПАРОЛЬ]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Примеры:**

Если пароль `abc123`:
```
postgresql://postgres.eznumgsmwvavyunqhxfc:abc123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Структура Connection String

```
postgresql://[ПОЛЬЗОВАТЕЛЬ]:[ПАРОЛЬ]@[ХОСТ]:[ПОРТ]/[БАЗА]
```

**Где:**
- `[ПОЛЬЗОВАТЕЛЬ]` - обычно `postgres` или `postgres.[PROJECT-REF]`
- `[ПАРОЛЬ]` - ваш реальный пароль из Supabase
- `[ХОСТ]` - `aws-0-[REGION].pooler.supabase.com` или `db.[PROJECT-REF].pooler.supabase.com`
- `[ПОРТ]` - `6543` для pooling
- `[БАЗА]` - `postgres`

## 🔍 Что заменить

**В любом из вариантов выше замените только:**
- `[ПАРОЛЬ]` → ваш реальный пароль

**Остальное оставьте как есть!**

## 💡 Рекомендация

Начните с **Варианта 1** - самый простой формат:
```
postgresql://postgres:ВАШ_ПАРОЛЬ@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

**Замените только `ВАШ_ПАРОЛЬ` на реальный пароль из Supabase!**
