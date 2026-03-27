# 🔧 Исправление ESM импортов для Vercel

## ❌ Ошибка

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/trpc/app-router'
Did you mean to import "./trpc/app-router.js"?
```

## ✅ Причина

В ESM модулях на Vercel нужно указывать расширение `.js` в импортах, даже если исходный файл `.ts`.

---

## ✅ Решение

Я исправил импорты в `backend/index.ts`:

**Было:**
```typescript
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
```

**Стало:**
```typescript
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";
```

---

## 📋 Передеплойте

```bash
cd backend
bunx vercel --prod
```

---

## ✅ После передеплоя

Проверьте работу API:

https://backend-three-mauve-67.vercel.app/

Должно показать:
```json
{"status": "ok", "message": "API is running"}
```

---

## 🔍 Если будут еще ошибки

Если появятся ошибки с другими импортами (например, в `app-router.ts`), нужно будет добавить `.js` расширения и там тоже.

---

## ✅ Готово!

После передеплоя ошибка должна исчезнуть!
