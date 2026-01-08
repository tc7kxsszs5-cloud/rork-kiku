# 🚀 Руководство по развертыванию KIKU

## 📋 Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Развертывание Backend](#развертывание-backend)
3. [Развертывание Mobile App](#развертывание-mobile-app)
4. [Настройка инфраструктуры](#настройка-инфраструктуры)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Мониторинг и логирование](#мониторинг-и-логирование)
7. [Развертывание в Production](#развертывание-в-production)

---

## 🔧 Предварительные требования

### Необходимое ПО:
- **Node.js** 18+ или **Bun** 1.0+
- **Git**
- **Docker** (опционально, для контейнеризации)
- **Expo CLI** (`npm install -g expo-cli`)

### Аккаунты и сервисы:
- **Expo Account** (для мобильного приложения)
- **Cloud Provider** (AWS/Azure/GCP для backend)
- **Database** (PostgreSQL для production)
- **Redis** (для кеширования и очередей)
- **CDN** (Cloudflare/AWS CloudFront)

---

## 🖥️ Развертывание Backend

### Вариант 1: Serverless (Hono на Vercel/Cloudflare Workers)

#### Vercel Deployment:

```bash
# 1. Установка Vercel CLI
npm i -g vercel

# 2. Переход в директорию backend
cd backend

# 3. Создание vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.ts"
    }
  ]
}
EOF

# 4. Развертывание
vercel --prod
```

#### Cloudflare Workers:

```bash
# 1. Установка Wrangler CLI
npm install -g wrangler

# 2. Авторизация
wrangler login

# 3. Создание wrangler.toml
cat > wrangler.toml << EOF
name = "kiku-backend"
main = "index.ts"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "api.kiku.app/*", zone_name = "kiku.app" }
]
EOF

# 4. Развертывание
wrangler deploy --env production
```

### Вариант 2: Docker Container (для VPS/Cloud)

#### Создание Dockerfile:

```dockerfile
# backend/Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Установка зависимостей
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Копирование кода
COPY . .

# Сборка
RUN bun run build

# Production образ
FROM oven/bun:1-slim
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./

EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
```

#### Развертывание:

```bash
# 1. Сборка образа
docker build -t kiku-backend:latest ./backend

# 2. Запуск контейнера
docker run -d \
  --name kiku-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  kiku-backend:latest

# 3. Или с docker-compose
docker-compose up -d
```

### Вариант 3: Kubernetes

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kiku-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kiku-backend
  template:
    metadata:
      labels:
        app: kiku-backend
    spec:
      containers:
      - name: backend
        image: kiku-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: kiku-secrets
              key: database-url
---
apiVersion: v1
kind: Service
metadata:
  name: kiku-backend-service
spec:
  selector:
    app: kiku-backend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
# Развертывание
kubectl apply -f k8s/backend-deployment.yaml
```

---

## 📱 Развертывание Mobile App

### 1. Настройка Expo

```bash
# 1. Установка Expo CLI
npm install -g expo-cli

# 2. Логин в Expo
expo login

# 3. Настройка app.json
```

#### app.json конфигурация:

```json
{
  "expo": {
    "name": "KIKU",
    "slug": "kiku",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.kiku.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.kiku.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 2. EAS Build (Expo Application Services)

```bash
# 1. Установка EAS CLI
npm install -g eas-cli

# 2. Инициализация EAS
eas build:configure

# 3. Создание eas.json
```

#### eas.json:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.kiku.app"
      },
      "android": {
        "package": "com.kiku.app"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 3. Сборка приложения

```bash
# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (для тестирования)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

### 4. Публикация в App Store / Google Play

```bash
# iOS App Store
eas submit --platform ios --profile production

# Google Play Store
eas submit --platform android --profile production
```

### 5. OTA Updates (Over-The-Air)

```bash
# Публикация обновления без пересборки
expo publish --release-channel production

# Или через EAS
eas update --branch production --message "Bug fixes and improvements"
```

---

## 🗄️ Настройка инфраструктуры

### 1. База данных (PostgreSQL)

#### Вариант A: Managed Service (AWS RDS, Google Cloud SQL)

```bash
# AWS RDS
aws rds create-db-instance \
  --db-instance-identifier kiku-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username kiku \
  --master-user-password <password> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx
```

#### Вариант B: Self-hosted

```bash
# Docker PostgreSQL
docker run -d \
  --name kiku-postgres \
  -e POSTGRES_USER=kiku \
  -e POSTGRES_PASSWORD=<password> \
  -e POSTGRES_DB=kiku \
  -p 5432:5432 \
  -v kiku-data:/var/lib/postgresql/data \
  postgres:15

# Миграции
cd backend
bun run migrate
```

### 2. Redis (для кеширования)

```bash
# Docker Redis
docker run -d \
  --name kiku-redis \
  -p 6379:6379 \
  redis:7-alpine

# Или Managed Redis (AWS ElastiCache, Redis Cloud)
```

### 3. CDN (Cloudflare)

1. Добавить домен в Cloudflare
2. Настроить DNS записи
3. Включить SSL/TLS
4. Настроить кеширование

### 4. Environment Variables

#### Backend (.env):

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/kiku

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# JWT
JWT_SECRET=your-secret-key

# Expo Push Notifications
EXPO_ACCESS_TOKEN=your-expo-token

# Environment
NODE_ENV=production
PORT=3000

# CORS
ALLOWED_ORIGINS=https://kiku.app,https://app.kiku.app
```

#### Mobile App (app.config.js):

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || 'https://api.kiku.app',
      environment: process.env.NODE_ENV || 'production',
    },
  },
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

#### .github/workflows/deploy-backend.yml:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: cd backend && bun install
      
      - name: Run tests
        run: cd backend && bun test
      
      - name: Build
        run: cd backend && bun run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### .github/workflows/deploy-mobile.yml:

```yaml
name: Deploy Mobile App

on:
  push:
    branches: [main]
    paths:
      - 'app/**'
      - 'constants/**'

jobs:
  build-and-submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install -g eas-cli && npm install
      
      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build Android
        run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to App Stores
        run: |
          eas submit --platform ios --profile production --non-interactive
          eas submit --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📊 Мониторинг и логирование

### 1. Application Monitoring (Sentry)

```bash
# Установка
npm install @sentry/react-native

# Настройка в app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: __DEV__ ? 'development' : 'production',
});
```

### 2. Analytics (PostHog / Mixpanel)

```typescript
// constants/AnalyticsContext.tsx
import posthog from 'posthog-js';

// Инициализация
posthog.init('your-api-key', {
  api_host: 'https://app.posthog.com',
});
```

### 3. Logging (Winston / Pino)

```typescript
// backend/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
});
```

### 4. Uptime Monitoring (UptimeRobot / Pingdom)

Настроить мониторинг endpoints:
- `https://api.kiku.app/health`
- `https://api.kiku.app/api/trpc/example.hi`

---

## 🚀 Развертывание в Production

### Пошаговый чеклист:

#### 1. Подготовка

- [ ] Настроить домены (api.kiku.app, kiku.app)
- [ ] Настроить SSL сертификаты
- [ ] Настроить базу данных
- [ ] Настроить Redis
- [ ] Настроить CDN

#### 2. Backend

- [ ] Развернуть backend на Vercel/Cloudflare/AWS
- [ ] Настроить environment variables
- [ ] Запустить миграции базы данных
- [ ] Настроить мониторинг
- [ ] Протестировать API endpoints

#### 3. Mobile App

- [ ] Собрать production build через EAS
- [ ] Протестировать на реальных устройствах
- [ ] Отправить на ревью в App Store / Google Play
- [ ] Настроить OTA updates

#### 4. Безопасность

- [ ] Настроить rate limiting
- [ ] Настроить CORS
- [ ] Настроить firewall
- [ ] Провести security audit
- [ ] Настроить backup базы данных

#### 5. Мониторинг

- [ ] Настроить Sentry для error tracking
- [ ] Настроить analytics
- [ ] Настроить uptime monitoring
- [ ] Настроить alerts

#### 6. Документация

- [ ] Обновить API документацию
- [ ] Создать user guide
- [ ] Подготовить release notes

---

## 🔐 Безопасность

### Рекомендации:

1. **Secrets Management:**
   - Использовать AWS Secrets Manager / HashiCorp Vault
   - Никогда не коммитить секреты в Git

2. **Rate Limiting:**
   ```typescript
   // backend/middleware/rateLimit.ts
   import { rateLimit } from 'hono-rate-limit';
   
   export const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 минут
     max: 100, // максимум 100 запросов
   });
   ```

3. **CORS:**
   ```typescript
   // backend/index.ts
   app.use('*', cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
     credentials: true,
   }));
   ```

4. **Database Security:**
   - Использовать connection pooling
   - Использовать prepared statements
   - Регулярные backup'ы
   - Encryption at rest

---

## 📈 Масштабирование

### Горизонтальное масштабирование:

1. **Load Balancer:** AWS ALB / Cloudflare Load Balancer
2. **Auto-scaling:** Kubernetes HPA / AWS Auto Scaling
3. **Database:** Read replicas, sharding
4. **Caching:** Redis cluster, CDN

### Вертикальное масштабирование:

1. Увеличить размер инстансов
2. Оптимизировать запросы к БД
3. Использовать connection pooling

---

## 🆘 Troubleshooting

### Частые проблемы:

1. **Backend не запускается:**
   - Проверить environment variables
   - Проверить подключение к БД
   - Проверить логи

2. **Mobile app не собирается:**
   - Проверить eas.json
   - Проверить app.json
   - Проверить зависимости

3. **API не отвечает:**
   - Проверить CORS настройки
   - Проверить rate limiting
   - Проверить firewall rules

---

## 📞 Поддержка

Для вопросов по развертыванию:
- Email: dev@kiku.app
- Документация: https://docs.kiku.app
- GitHub Issues: https://github.com/kiku/issues

---

**Последнее обновление:** 2025-01-06  
**Версия:** 1.0


