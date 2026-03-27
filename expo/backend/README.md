# KIKU Backend

Backend API для KIKU на Hono + tRPC.

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установить зависимости
bun install

# Запустить dev сервер
bun run dev
```

Сервер запустится на `http://localhost:3000`

### Деплой на Vercel

```bash
# Установить Vercel CLI
npm install -g vercel

# Деплой
vercel

# Production деплой
vercel --prod
```

## 📁 Структура

```
backend/
├── index.ts              # Entry point для Vercel
├── hono.ts               # Hono app с tRPC
├── vercel.json           # Vercel конфигурация
├── package.json          # Зависимости
└── trpc/
    ├── app-router.ts     # tRPC router
    ├── create-context.ts # Context creator
    └── routes/           # API routes
```

## 🔧 Environment Variables

Создайте `.env` файл (или настройте в Vercel):

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://... (опционально)
NODE_ENV=production
```

## 📚 API Endpoints

- `GET /` - Health check
- `POST /api/trpc/*` - tRPC endpoints

## 🧪 Тестирование

```bash
# Проверить health check
curl https://your-backend.vercel.app/

# Проверить tRPC endpoint
curl https://your-backend.vercel.app/api/trpc/example.hi
```
