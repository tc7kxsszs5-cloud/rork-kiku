# 📦 Резюме: Как развернуть KIKU

## 🎯 Три способа развертывания

### 1. ⚡ Быстрый старт (для тестирования) - 10 минут

```bash
# Backend локально
cd backend && bun install && bun run dev

# Mobile App локально
cd .. && bun install && npx expo start
```

**Подробнее:** `QUICK_START_DEPLOYMENT.md`

---

### 2. 🐳 Docker (для разработки/тестирования) - 15 минут

```bash
# Запуск всей инфраструктуры одной командой
docker-compose up -d

# Backend: http://localhost:3000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

**Файлы:**
- `docker-compose.yml` - конфигурация всех сервисов
- `backend/Dockerfile` - образ backend

---

### 3. 🚀 Production развертывание - 30 минут

#### Backend на Vercel:
```bash
cd backend
npm i -g vercel
vercel --prod
```

#### Mobile App через EAS:
```bash
npm install -g eas-cli
eas login
eas build --profile production --platform all
```

#### База данных:
- **Supabase** (бесплатно) - https://supabase.com
- **Railway** ($5/мес) - https://railway.app
- **AWS RDS** (pay-as-you-go)

**Подробнее:** `DEPLOYMENT_GUIDE.md`

---

## 📋 Чеклист развертывания

### Минимальные требования:
- [ ] Node.js 18+ или Bun 1.0+
- [ ] Expo CLI (`npm install -g expo-cli`)
- [ ] Аккаунт Expo (бесплатно)
- [ ] Аккаунт Vercel (бесплатно)

### Для Production:
- [ ] База данных (PostgreSQL)
- [ ] Redis (для кеширования)
- [ ] SSL сертификаты
- [ ] Мониторинг (Sentry)
- [ ] Analytics (PostHog/Mixpanel)

---

## 🔄 Автоматическое развертывание (CI/CD)

GitHub Actions настроены для автоматического развертывания:

- **Backend:** Автоматически деплоится на Vercel при push в `main`
- **Mobile App:** Автоматически собирается и публикуется OTA update

**Файлы:**
- `.github/workflows/deploy-backend.yml`
- `.github/workflows/deploy-mobile.yml`

**Настройка:**
1. Добавить secrets в GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `EXPO_TOKEN`

---

## 📱 Публикация в App Store / Google Play

### iOS:
```bash
eas build --profile production --platform ios
eas submit --platform ios
```

### Android:
```bash
eas build --profile production --platform android
eas submit --platform android
```

**Требования:**
- Apple Developer аккаунт ($99/год)
- Google Play Developer аккаунт ($25 единоразово)

---

## 🆘 Помощь

- **Быстрый старт:** `QUICK_START_DEPLOYMENT.md`
- **Полное руководство:** `DEPLOYMENT_GUIDE.md`
- **Проблемы:** Создать issue в GitHub

---

**Рекомендуемый путь для начала:**
1. Протестировать локально (10 минут)
2. Развернуть backend на Vercel (10 минут)
3. Настроить базу данных на Supabase (10 минут)
4. Собрать mobile app через EAS (10 минут)

**Итого: ~40 минут до первого production deployment!** 🚀


