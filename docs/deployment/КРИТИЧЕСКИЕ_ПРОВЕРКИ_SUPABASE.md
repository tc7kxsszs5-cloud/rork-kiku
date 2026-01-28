# 🔴 Критические проверки в Supabase

## ❌ Текущая проблема:

Используется прямое подключение (`db.eznumgsmwvavyunqhxfc.supabase.co`), которое не работает на Vercel.

## ✅ Что нужно проверить и включить:

### 1. 🔴 КРИТИЧНО: Connection Pooling

**Где проверить:**
- Supabase Dashboard → **Settings** → **Database**
- Прокрутите до раздела **"Connection pooling"** или **"Pooler"**

**Что проверить:**
- ✅ Pooling должен быть **ВКЛЮЧЕН** (Enabled/Active)
- ✅ Должен быть показан **Connection String для pooling**

**Если pooling выключен:**
1. Включите Connection Pooling
2. Скопируйте готовый Connection String для pooling
3. Он должен содержать `pooler.supabase.com` или `aws-0-*.pooler.supabase.com`

---

### 2. Регион проекта

**Где проверить:**
- Settings → **General** → **Region**

**Что проверить:**
- Какой регион? (US East, US West, Europe, и т.д.)
- Нужен для правильного pooling host

---

### 3. Готовый Connection String для Pooling

**Где найти:**
- Settings → Database → **Connection pooling**
- Найдите **"Connection string"** или **"URI"** для pooling

**Что сделать:**
- Скопируйте готовый Connection String
- Он должен выглядеть примерно так:
  ```
  postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  ```

---

## 📋 Что мне нужно от вас:

1. **Включен ли Connection Pooling?** (Да/Нет)
2. **Есть ли готовый Connection String для pooling?** (если да - скопируйте и пришлите)
3. **Какой регион проекта?** (US East/US West/Europe)

---

## 💡 Если pooling выключен:

1. Включите Connection Pooling в Supabase Dashboard
2. Скопируйте готовый Connection String
3. Используйте его в Vercel

---

## ⚠️ Важно:

**НЕ используйте прямой connection string** (`db.*.supabase.co`) - он не работает на Vercel!

**Используйте только Connection Pooling** (`pooler.supabase.com` или `aws-0-*.pooler.supabase.com`)

---

**Проверьте Connection Pooling и пришлите готовый Connection String!**
