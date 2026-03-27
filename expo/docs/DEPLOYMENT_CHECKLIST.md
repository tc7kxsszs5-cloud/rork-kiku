# ✅ DEPLOYMENT CHECKLIST

**Проект:** KIKU Child Safety Platform  
**Версия:** 1.0.0  
**Дата:** 30 января 2026

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. **Код и Тесты**

- [x] Unit tests: 305/317 passing (96.2%)
- [ ] E2E tests: Playwright тесты пройдены
- [x] TypeScript: No errors
- [x] Linter: No errors
- [x] Build: Successful compilation
- [x] Known Issues: Документированы

**Команды:**
```bash
bun run typecheck    # TypeScript check
bun run lint         # Linting
bun test             # Unit tests
bun run test:e2e     # E2E tests
```

---

### 2. **Environment Variables**

- [ ] `.env.production` создан (из `.env.production.example`)
- [ ] `EXPO_PUBLIC_OPENAI_API_KEY` настроен
- [ ] `EXPO_PUBLIC_API_URL` настроен
- [ ] `DATABASE_URL` настроен
- [ ] `REDIS_URL` настроен
- [ ] `JWT_SECRET` сгенерирован

**EAS Secrets:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name DATABASE_URL --value "postgresql://..."
eas secret:create --scope project --name REDIS_URL --value "redis://..."
eas secret:create --scope project --name JWT_SECRET --value "your-secret"
```

---

### 3. **App Configuration**

**`app.json` проверка:**
- [x] `name`: "KIKU"
- [x] `version`: "1.0.0"
- [x] `slug`: Правильный slug
- [x] `ios.bundleIdentifier`: Настроен
- [x] `android.package`: Настроен
- [x] `icon`: Установлен
- [x] `splash`: Установлен
- [ ] `extra.eas.projectId`: Правильный ID

**Обновить при необходимости:**
```bash
# Изменить bundleIdentifier
# iOS: app.rork.greeting-project-58uufiz → com.kiku.safety
# Android: app.rork.greeting_project_58uufiz → com.kiku.safety
```

---

### 4. **EAS Build Configuration**

**`eas.json` проверка:**
- [x] Production profile настроен
- [x] `distribution: "store"`
- [x] `releaseChannel: "production"`
- [x] iOS build configuration
- [x] Android build configuration

**Команды для build:**
```bash
# Preview build (тестовый)
eas build --platform all --profile preview

# Production build
eas build --platform all --profile production

# Только iOS
eas build --platform ios --profile production

# Только Android
eas build --platform android --profile production
```

---

### 5. **Backend Deployment**

#### **Vercel Deployment:**
```bash
cd backend
vercel --prod
```

#### **Environment Variables (Vercel):**
- [ ] `OPENAI_API_KEY`
- [ ] `DATABASE_URL`
- [ ] `REDIS_URL`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV=production`

#### **Database Setup (Supabase/Railway):**
```sql
-- Run migrations
psql $DATABASE_URL < migrations/001_initial.sql

-- Verify tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

### 6. **Mobile App Store Requirements**

#### **iOS (App Store Connect):**
- [ ] Apple Developer Account активен
- [ ] App ID создан
- [ ] Certificates настроены
- [ ] Provisioning Profiles созданы
- [ ] Privacy Policy URL готов
- [ ] App Store screenshots (5.5", 6.5")
- [ ] App Store description готова
- [ ] Keywords настроены
- [ ] Age rating: 13+ (или 4+)

**Submit команда:**
```bash
eas submit --platform ios --profile production
```

#### **Android (Google Play Console):**
- [ ] Google Play Developer Account активен
- [ ] App signing key создан
- [ ] Privacy Policy URL готов
- [ ] Google Play screenshots (phone, tablet)
- [ ] Store listing готова
- [ ] Content rating: ESRB E/PEGI 3
- [ ] Target audience: Children

**Submit команда:**
```bash
eas submit --platform android --profile production
```

---

### 7. **Monitoring & Error Tracking**

#### **Sentry Setup:**
```bash
bun add @sentry/react-native
```

**Конфигурация в `app/_layout.tsx`:**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

#### **Проверка:**
- [ ] Sentry DSN настроен
- [ ] Source maps uploaded
- [ ] Test error отправлена и получена

---

### 8. **Analytics**

- [x] Analytics Context реализован
- [x] Tracking events настроены
- [ ] Dashboard создан (Amplitude/Mixpanel)
- [ ] Critical events мониторятся

**Events to track:**
- `message_sent`
- `message_analyzed`
- `alert_created`
- `sos_triggered`
- `app_opened`
- `user_registered`

---

### 9. **Security & Privacy**

#### **GDPR Compliance:**
- [ ] Privacy Policy опубликована
- [ ] Terms of Service опубликованы
- [ ] Cookie Policy (для web)
- [ ] Data deletion процедура
- [ ] User consent flows

#### **Security Checks:**
- [x] API keys не в коде
- [x] SecureStore для sensitive data
- [x] Input validation реализована
- [x] Rate limiting настроен
- [ ] HTTPS everywhere (backend)

---

### 10. **Performance**

#### **Оптимизация:**
- [x] Bundle size проверен
- [x] Images оптимизированы
- [x] Lazy loading где возможно
- [ ] Performance profiling проведён

**Команды:**
```bash
# Check bundle size
bunx expo export --clear

# Analyze bundle
bunx @expo/metro-bundler analyze
```

---

### 11. **Documentation**

#### **Требуется:**
- [x] `README.md` обновлен
- [x] `docs/PRODUCTION_STRATEGY.md` создан
- [x] `docs/testing/KNOWN_ISSUES.md` создан
- [ ] `docs/API_DOCUMENTATION.md` создан
- [ ] `docs/USER_GUIDE.md` создан
- [ ] `docs/TROUBLESHOOTING.md` создан

#### **Для пользователей:**
- [ ] Parent user guide
- [ ] Child safety tips
- [ ] FAQ
- [ ] Support contact info

---

### 12. **Legal Documents**

**Обязательно:**
- [ ] Privacy Policy (GDPR compliant)
- [ ] Terms of Service
- [ ] Age restrictions (13+)
- [ ] Parental consent (для детей <13)

**Дополнительно:**
- [ ] Copyright notices
- [ ] Open source licenses
- [ ] Attribution (если используются 3rd party)

---

## 🚀 DEPLOYMENT PROCESS

### **Step 1: Pre-build checks**
```bash
# 1. Clean install
rm -rf node_modules bun.lock
bun install

# 2. Run all checks
bun run typecheck
bun run lint
bun test
bun run test:e2e

# 3. Test production build locally
bun run build:production
```

### **Step 2: Backend Deployment**
```bash
# 1. Deploy to Vercel
cd backend
vercel --prod

# 2. Verify API
curl https://your-api.vercel.app/health

# 3. Run migrations
psql $DATABASE_URL < migrations/latest.sql
```

### **Step 3: Mobile App Build**
```bash
# 1. Preview build (test first)
eas build --platform all --profile preview

# 2. Test preview build on device
eas build:install <build-id>

# 3. Production build
eas build --platform all --profile production
```

### **Step 4: App Store Submission**
```bash
# iOS
eas submit --platform ios --profile production --latest

# Android
eas submit --platform android --profile production --latest
```

### **Step 5: Post-deployment**
```bash
# 1. Monitor Sentry for errors
open https://sentry.io/organizations/your-org/issues/

# 2. Check analytics
open https://analytics.amplitude.com/kiku/dashboard

# 3. Test critical flows on production
- Onboarding
- Chat messaging
- SOS alerts
- AI moderation
```

---

## ⚠️ ROLLBACK PROCEDURE

### **If something goes wrong:**

1. **Backend issues:**
```bash
# Revert to previous Vercel deployment
vercel rollback
```

2. **Mobile app issues:**
```bash
# Can't rollback app stores directly
# But can push hotfix via OTA update:
eas update --branch production --message "Hotfix: Critical bug"
```

3. **Database issues:**
```bash
# Restore from backup
pg_restore -d $DATABASE_URL backup.dump
```

---

## 📊 SUCCESS METRICS

### **Technical:**
- ✅ Build успешно завершён
- ✅ Tests проходят (≥95%)
- ✅ No critical errors в Sentry
- ✅ API response time <200ms
- ✅ App startup time <2s

### **Business:**
- 📱 App в App Store / Google Play
- 👥 First 100 users onboarded
- 📈 Analytics tracking работает
- 🔒 No security incidents
- ⭐ App Store rating ≥4.0

---

## 🆘 SUPPORT

### **Emergency Contacts:**
- **DevOps:** [Your contact]
- **Backend:** [Your contact]
- **Mobile:** [Your contact]

### **Resources:**
- **Docs:** https://docs.kiku.app
- **Status page:** https://status.kiku.app
- **Support email:** support@kiku.app

---

**Автор:** Development Team  
**Последнее обновление:** 30 января 2026  
**Статус:** Ready for Production Deploy

---

## 🎯 FINAL GO/NO-GO CHECKLIST

### **GO if:**
- ✅ All critical tests pass
- ✅ No blocking bugs
- ✅ Backend deployed and healthy
- ✅ Monitoring active
- ✅ Rollback plan ready

### **NO-GO if:**
- ❌ Critical tests failing
- ❌ Security vulnerabilities found
- ❌ Backend unstable
- ❌ No monitoring setup
- ❌ Legal docs missing

---

**Decision:** [ ] GO / [ ] NO-GO  
**Signed by:** _______________  
**Date:** _______________
