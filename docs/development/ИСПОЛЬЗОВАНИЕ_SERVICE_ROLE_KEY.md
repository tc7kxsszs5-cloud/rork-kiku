# ✅ Использование service_role key для backend

## ✅ Что изменено:

Код обновлен для поддержки `service_role` key (предпочтительно для backend) или `anon` key.

## 📋 Варианты решения:

### Вариант 1: Использовать service_role key (рекомендуется)

**Преимущества:**
- ✅ Полный доступ к базе данных
- ✅ Лучше для backend/serverless функций
- ✅ Обходит Row Level Security (RLS)

**Шаги:**

1. Получите service_role key:
   - Supabase Dashboard → Settings → API
   - Найдите **"service_role"** key (секретный ключ)
   - Скопируйте его

2. Установите в Vercel:
   ```bash
   cd /Users/mac/Desktop/rork-kiku/backend
   bunx vercel env add SUPABASE_SERVICE_ROLE_KEY production
   # yes (sensitive)
   # Вставьте service_role key
   ```

3. Деплой:
   ```bash
   bunx vercel --prod
   ```

### Вариант 2: Исправить anon key

Если хотите использовать anon key:

1. Проверьте anon key в Supabase:
   - Settings → API
   - Убедитесь, что скопировали его полностью

2. Переустановите:
   ```bash
   bunx vercel env rm SUPABASE_ANON_KEY production
   # y
   bunx vercel env add SUPABASE_ANON_KEY production
   # yes
   # Вставьте правильный anon key
   ```

---

## 💡 Рекомендация:

**Используйте Вариант 1** - service_role key лучше для backend!

---

**Выберите вариант и выполните шаги!**
