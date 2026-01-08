FROM oven/bun:1 AS base
WORKDIR /app

# Копирование файлов зависимостей
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Сборка (если нужна)
# RUN bun run build

# Production образ
FROM oven/bun:1-slim
WORKDIR /app

# Копирование зависимостей и кода
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app ./

# Открытие порта
EXPOSE 3000

# Запуск приложения
CMD ["bun", "run", "index.ts"]


