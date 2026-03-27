# ✅ Использование SHARED POOLER

## ✅ Отлично! Вы нашли Connection Pooling!

**SHARED POOLER** - это то, что нужно для Vercel!

## 📋 Что нужно найти:

В разделе **"Connection pooling configuration"** → **"SHARED POOLER"** должны быть:

1. **Connection String** или **URI**
2. **Host** (должен содержать `pooler.supabase.com`)
3. **Port** (обычно `6543`)
4. **Username** (должен быть `postgres.[PROJECT-REF]` или просто `postgres`)
5. **Password** (ваш пароль)

## 📋 Что мне нужно:

**Скопируйте Connection String** из раздела SHARED POOLER и пришлите мне!

Он должен выглядеть примерно так:
```
postgresql://postgres.[REF]:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
```

Или может быть в формате:
```
postgresql://postgres:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
```

---

## 💡 Если Connection String не показан:

Могут быть отдельные поля:
- **Host:** (например: `aws-0-us-east-1.pooler.supabase.com`)
- **Port:** (например: `6543`)
- **Database:** (обычно `postgres`)
- **User:** (например: `postgres` или `postgres.[REF]`)
- **Password:** (ваш пароль)

**Пришлите эти значения, и я соберу connection string!**

---

## ✅ После получения Connection String:

Я дам вам точную команду для установки в Vercel!

---

**Скопируйте Connection String из SHARED POOLER и пришлите мне!**
