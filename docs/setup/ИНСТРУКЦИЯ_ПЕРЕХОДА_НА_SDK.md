# ✅ Инструкция: Переход на Supabase Client SDK

## 🎯 Преимущества нового подхода:

- ✅ **Не нужно Connection Pooling** - SDK работает через REST API
- ✅ **Нет проблем с DNS** - работает через HTTP запросы
- ✅ **Проще в использовании** - готовые методы для работы с данными
- ✅ **Автоматическая обработка ошибок** - SDK сам управляет подключениями

---

## 📋 Шаг 1: Установите зависимости

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bun install
```

Это установит `@supabase/supabase-js`.

---

## 📋 Шаг 2: Получите ключи из Supabase

1. Откройте https://supabase.com/dashboard
2. Выберите проект
3. **Settings** → **API**
4. Найдите:
   - **Project URL** (например: `https://eznumgsmwvavyunqhxfc.supabase.co`)
   - **anon public** key (длинная строка, начинается с `eyJ...`)

---

## 📋 Шаг 3: Установите переменные окружения в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend

# Добавьте SUPABASE_URL
bunx vercel env add SUPABASE_URL production
# Когда спросит "What's the value?" → Вставьте Project URL из Supabase
# Mark as sensitive? → yes

# Добавьте SUPABASE_ANON_KEY
bunx vercel env add SUPABASE_ANON_KEY production
# Когда спросит "What's the value?" → Вставьте anon public key из Supabase
# Mark as sensitive? → yes
```

---

## 📋 Шаг 4: Деплой

```bash
bunx vercel --prod
```

---

## 📋 Шаг 5: Проверка

```bash
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

**Ожидаемый результат:**
```json
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "message": "Подключение к Supabase работает!",
        "method": "Supabase SDK"
      }
    }
  }
}
```

---

## ✅ Что изменилось:

1. ✅ Создан файл `backend/utils/supabase.ts` - утилита для работы с Supabase SDK
2. ✅ Обновлен `backend/trpc/routes/test/db-check.ts` - теперь использует Supabase SDK вместо прямого PostgreSQL подключения
3. ✅ Добавлен `@supabase/supabase-js` в `package.json`

---

## 💡 Теперь можно использовать Supabase SDK везде:

```typescript
import { supabase } from '../utils/supabase.js';

// Пример запроса
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

---

**Этот подход должен решить все проблемы с подключением!**
