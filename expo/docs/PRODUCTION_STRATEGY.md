# 🎯 СТРАТЕГИЯ ЗАПУСКА KIKU В PRODUCTION

**Дата:** 30 января 2026  
**Статус:** 96.2% готовности (305/317 тестов)  
**Цель:** Полный production deploy с мониторингом

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ✅ Готово:
- **Frontend:** React Native + Expo 54 ✓
- **Backend:** Hono + tRPC ✓
- **State Management:** Context API ✓
- **AI Integration:** OpenAI moderation ✓
- **Internationalization:** i18next (EN/RU) ✓
- **Theme System:** Sunrise/Midnight ✓
- **Unit Tests:** 305/317 (96.2%) ✓
- **Git Structure:** Multi-branch coordination ✓

### ⚠️ Требует доработки:
- **Unit Tests:** 12 failing (ESM modules)
- **E2E Tests:** Playwright - не запущены
- **Production Build:** EAS - не настроен
- **Monitoring:** Нет системы мониторинга
- **CI/CD:** GitHub Actions - частично настроен

---

## 🎯 СТРАТЕГИЯ РАЗВИТИЯ (5 ЭТАПОВ)

### **ЭТАП 1: ТЕХНИЧЕСКАЯ СТАБИЛИЗАЦИЯ** (2-4 часа)

#### 1.1 Исправление Unit тестов (1-2 часа)
**Проблема:** 12 failing tests из-за ESM modules

**Решение:**
```bash
# Тесты с проблемами:
- lucide-react-native (ESM import)
- react-native-svg (ESM import)
- Screen integration tests
- Component tests
```

**Действия:**
- [ ] Улучшить моки для ESM модулей
- [ ] Обновить `jest.config.js`
- [ ] Добавить fallback для ESM imports
- [ ] Проверить все 317 тестов

**Критерий успеха:** 317/317 тестов (100%)

#### 1.2 Код-ревью и оптимизация (1 час)
- [ ] Проверить все Context providers
- [ ] Оптимизировать ре-рендеры
- [ ] Проверить memory leaks
- [ ] Удалить неиспользуемый код

#### 1.3 Security аудит (1 час)
- [ ] Проверить SecureStore usage
- [ ] Проверить API keys (не в коде!)
- [ ] Проверить input validation
- [ ] GDPR compliance check

---

### **ЭТАП 2: E2E ТЕСТИРОВАНИЕ** (3-4 часа)

#### 2.1 Playwright Setup (30 мин)
```bash
bun add -D @playwright/test
bunx playwright install
```

**Конфигурация:** `playwright.config.ts`
```typescript
export default defineConfig({
  testDir: './__tests__/e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

#### 2.2 Критические E2E тесты (2-3 часа)
**Приоритет 1: Безопасность детей**
- [ ] Chat flow (parent → child)
- [ ] AI moderation (detect unsafe content)
- [ ] SOS button functionality
- [ ] Alert system (parent notifications)

**Приоритет 2: Core функционал**
- [ ] Onboarding (role selection)
- [ ] Authentication flow
- [ ] Message sending/receiving
- [ ] Settings sync

**Приоритет 3: UI/UX**
- [ ] Theme switching (sunrise/midnight)
- [ ] Language switching (EN/RU)
- [ ] Responsive layout
- [ ] Accessibility

#### 2.3 E2E отчет (30 мин)
- [ ] Создать `docs/testing/E2E_REPORT.md`
- [ ] Screenshots + videos
- [ ] Coverage metrics

**Критерий успеха:** Все критические flow работают

---

### **ЭТАП 3: PRODUCTION BUILD** (2-3 часа)

#### 3.1 EAS Build Configuration (1 час)

**Обновить `eas.json`:**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "releaseChannel": "production",
      "distribution": "store",
      "ios": {
        "buildConfiguration": "Release",
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "releaseChannel": "preview",
      "distribution": "internal"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-asc-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

**Проверить `app.json`:**
```json
{
  "expo": {
    "name": "KIKU",
    "slug": "kiku-safety",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "kiku",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.kiku.safety",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "KIKU needs location for SOS emergency features",
        "NSCameraUsageDescription": "KIKU needs camera for profile photos"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      },
      "package": "com.kiku.safety",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "CAMERA",
        "NOTIFICATIONS"
      ]
    }
  }
}
```

#### 3.2 Environment Variables (30 мин)
- [ ] Создать `.env.production`
- [ ] Настроить EAS Secrets
- [ ] Проверить API endpoints

```bash
# EAS Secrets
eas secret:create --scope project --name OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name DATABASE_URL --value "postgresql://..."
eas secret:create --scope project --name REDIS_URL --value "redis://..."
```

#### 3.3 Build Execution (1-2 часа)

**Preview build (тестовый):**
```bash
eas build --platform all --profile preview
```

**Production build:**
```bash
eas build --platform all --profile production
```

**Критерий успеха:** Build успешно создан

---

### **ЭТАП 4: DEPLOYMENT** (1-2 часа)

#### 4.1 Backend Deployment (30 мин)

**Платформа:** Vercel / Cloudflare Workers

**Vercel:**
```bash
# Install Vercel CLI
bun add -g vercel

# Deploy backend
cd backend
vercel --prod
```

**Environment Variables (Vercel):**
- `OPENAI_API_KEY`
- `DATABASE_URL` (PostgreSQL)
- `REDIS_URL` (Upstash Redis)
- `JWT_SECRET`

#### 4.2 Database Setup (30 мин)

**PostgreSQL (Supabase / Railway):**
```sql
-- Migrations
CREATE TABLE users (
  id UUID PRIMARY KEY,
  role VARCHAR(10), -- 'parent' | 'child'
  created_at TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID,
  content TEXT,
  risk_level VARCHAR(10),
  created_at TIMESTAMP
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  user_id UUID,
  type VARCHAR(20),
  content TEXT,
  created_at TIMESTAMP
);
```

#### 4.3 Mobile App Deployment (30 мин)

**iOS (App Store Connect):**
```bash
eas submit --platform ios --profile production
```

**Android (Google Play Console):**
```bash
eas submit --platform android --profile production
```

**Критерий успеха:** Приложение в сторах

---

### **ЭТАП 5: МОНИТОРИНГ И ПОДДЕРЖКА** (ongoing)

#### 5.1 Error Tracking

**Sentry Integration:**
```bash
bun add @sentry/react-native
```

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

#### 5.2 Analytics

**Плюс к существующей аналитике:**
- [ ] Настроить dashboards (Amplitude / Mixpanel)
- [ ] Отслеживать critical events
- [ ] Monitor API latency
- [ ] Track user retention

#### 5.3 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/production.yml`):
```yaml
name: Production Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
      - run: eas build --platform all --non-interactive

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 ПЛАН ДЕЙСТВИЙ (ПАРАЛЛЕЛЬНАЯ РАБОТА)

### **СЕГОДНЯ (30 января)**

**09:00 - 11:00: Стабилизация (Agent 1)**
- Исправить 12 failing tests
- Код-ревью
- Security audit

**09:00 - 12:00: E2E Setup (Agent 2)**
- Установить Playwright
- Написать критические E2E тесты
- Создать отчет

**11:00 - 14:00: Production Build (Agent 3)**
- Настроить EAS
- Создать preview build
- Подготовить документацию

### **ЗАВТРА (31 января)**

**09:00 - 11:00: Production Build**
- Запустить production build (iOS + Android)

**11:00 - 13:00: Backend Deploy**
- Deploy на Vercel
- Setup Database (Supabase)
- Проверить API endpoints

**13:00 - 15:00: Mobile Deploy**
- Submit iOS (App Store)
- Submit Android (Google Play)

**15:00 - 17:00: Monitoring Setup**
- Настроить Sentry
- Создать dashboards
- Документация

---

## 📋 CHECKLIST ПЕРЕД PRODUCTION

### **Код:**
- [ ] 100% unit tests pass (317/317)
- [ ] E2E tests pass (critical flows)
- [ ] No console.errors
- [ ] No TODO/FIXME в prod коде
- [ ] TypeScript strict mode ✓

### **Безопасность:**
- [ ] API keys в environment variables
- [ ] SecureStore для sensitive data
- [ ] Input validation
- [ ] GDPR compliance
- [ ] Content moderation активна

### **Performance:**
- [ ] Bundle size оптимизирован
- [ ] Images оптимизированы
- [ ] Lazy loading где возможно
- [ ] Memory leaks исправлены

### **Documentation:**
- [ ] README.md обновлен
- [ ] API documentation
- [ ] Deployment guide
- [ ] User guide (для родителей)

### **Legal:**
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Cookie Policy
- [ ] Age restrictions (13+)

---

## 🚨 КРИТИЧЕСКИЕ РИСКИ

### **Риск 1: ESM Module Issues**
**Вероятность:** Средняя  
**Влияние:** Низкое (только тесты)  
**Митигация:** Можем deploy с 96% тестов

### **Риск 2: Xcode Licensing**
**Вероятность:** Высокая  
**Влияние:** Высокое (блокирует iOS build)  
**Митигация:** Использовать EAS Build (cloud)

### **Риск 3: AI API Limits**
**Вероятность:** Низкая  
**Влияние:** Критическое (core feature)  
**Митигация:** Rate limiting + fallback strategy

### **Риск 4: App Store Rejection**
**Вероятность:** Средняя  
**Влияние:** Среднее (задержка launch)  
**Митигация:** Следовать App Store Guidelines

---

## 📈 КРИТЕРИИ УСПЕХА

### **Technical:**
- ✅ 100% unit tests (или 95%+ с обоснованием)
- ✅ E2E tests для critical flows
- ✅ Production build создан
- ✅ Backend deployed и работает
- ✅ Monitoring активен

### **Business:**
- ✅ App в App Store / Google Play
- ✅ Документация готова
- ✅ Support процесс настроен
- ✅ Legal documents готовы

### **User Experience:**
- ✅ Onboarding работает
- ✅ Core features работают
- ✅ Performance приемлемый
- ✅ No critical bugs

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

**ПРЯМО СЕЙЧАС:**
1. Запустить 3 агентов параллельно
2. Agent 1: Fix unit tests
3. Agent 2: E2E tests setup
4. Agent 3: Production build config

**КОМАНДЫ:**
```bash
# Agent 1: Tests
git checkout -b agent-fix-tests-30-01
bun test

# Agent 2: E2E
git checkout -b agent-e2e-setup-30-01
bun add -D @playwright/test

# Agent 3: Production
git checkout -b agent-production-config-30-01
# Update eas.json, app.json
```

---

**Автор:** AI Assistant (Cursor)  
**Последнее обновление:** 30 января 2026, 09:00  
**Статус:** В процессе выполнения
