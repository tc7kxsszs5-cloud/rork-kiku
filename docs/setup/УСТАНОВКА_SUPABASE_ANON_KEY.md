# ✅ Установка SUPABASE_ANON_KEY

## ❌ Проблема:

Переменная `SUPABASE_ANON_KEY` не установлена в Vercel.

## 📋 Решение:

### Шаг 1: Получите anon key из Supabase

1. Откройте https://supabase.com/dashboard
2. Выберите проект
3. **Settings** → **API**
4. Найдите **"anon public"** key (длинная строка, начинается с `eyJ...`)
5. Скопируйте его

### Шаг 2: Установите в Vercel

```bash
cd /Users/mac/Desktop/rork-kiku/backend
bunx vercel env add SUPABASE_ANON_KEY production
```

**Ответьте:**
- `Mark as sensitive?` → **yes**
- `What's the value of SUPABASE_ANON_KEY?` → Вставьте anon public key из Supabase

### Шаг 3: Деплой

```bash
bunx vercel --prod
```

### Шаг 4: Проверка

```bash
curl "https://backend-three-mauve-67.vercel.app/api/trpc/test.dbCheck"
```

---

**Установите SUPABASE_ANON_KEY и задеплойте!**
