# ✅ Реализация с Supabase Client SDK

## 🎯 Преимущества:

- ✅ Не нужно настраивать Connection Pooling
- ✅ Работает через REST API Supabase
- ✅ Автоматическая обработка подключений
- ✅ Проще в использовании

---

## 📋 Шаг 1: Установка

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bun add @supabase/supabase-js
```

---

## 📋 Шаг 2: Получите ключи из Supabase

1. Откройте https://supabase.com/dashboard
2. Выберите проект
3. Settings → API
4. Найдите:
   - **Project URL** (например: `https://eznumgsmwvavyunqhxfc.supabase.co`)
   - **anon public** key

---

## 📋 Шаг 3: Создайте утилиту Supabase

Создайте файл `backend/utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 📋 Шаг 4: Установите переменные окружения в Vercel

```bash
bunx vercel env add SUPABASE_URL production
# Вставьте Project URL из Supabase

bunx vercel env add SUPABASE_ANON_KEY production
# Вставьте anon public key из Supabase
```

---

## 📋 Шаг 5: Используйте в routes

Пример в `backend/trpc/routes/test/db-check.ts`:

```typescript
import { publicProcedure } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";

export const dbCheckProcedure = publicProcedure.query(async () => {
  try {
    // Простой запрос для проверки подключения
    const { data, error } = await supabase
      .from('_prisma_migrations') // или любая системная таблица
      .select('*')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Подключение к Supabase работает!',
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
});
```

---

## 📋 Шаг 6: Деплой

```bash
bunx vercel --prod
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

## ✅ Преимущества этого подхода:

1. **Не нужно Connection Pooling** - Supabase SDK сам управляет подключениями
2. **Работает через REST API** - нет проблем с DNS или подключением
3. **Проще в использовании** - готовые методы для работы с данными
4. **Автоматическая обработка ошибок** - SDK сам обрабатывает проблемы подключения

---

**Этот подход должен решить все проблемы с подключением!**
