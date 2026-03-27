# KIKU Security Best Practices Report

**Дата:** 2026-02-05  
**Версия:** 1.0  
**Проект:** KIKU — AI-powered child safety platform

---

## Executive Summary

Проведён аудит безопасности по best practices для React/TypeScript (frontend) и Node/Hono (backend). Реализовано много правильных мер: валидация (Zod), санитизация, AI-модерация, биометрия, rate limiting на auth. Критические и важные замечания ниже устранены или задокументированы.

**Итог:** Критические находки по хранению API ключей и чувствительных настроек адресованы; остальные рекомендации — в плане работ.

---

## 1. Критические (Critical)

### SEC-001: API ключи не должны попадать в клиентский bundle

| Поле | Значение |
|------|----------|
| **Severity** | Critical |
| **Location** | `utils/aiService.ts` (getAIConfig), `.env` (EXPO_PUBLIC_OPENAI_API_KEY) |
| **Evidence** | `Constants.expoConfig?.extra?.openaiApiKey \|\| process.env.OPENAI_API_KEY` — при сборке Expo переменные EXPO_PUBLIC_* встраиваются в bundle и доступны любому пользователю приложения. |
| **Impact** | Утечка OpenAI API ключа → несанкционированное использование, расход средств, компрометация аккаунта. |
| **Fix** | Реализован backend proxy: процедура `ai.analyzeMessage` на backend использует серверный `OPENAI_API_KEY`; клиент вызывает тол
ько tRPC, ключ на клиенте не передаётся. |
| **Status** | ✅ Исправлено (backend proxy + клиент использует backend при доступности) |

---

### SEC-002: Чувствительные настройки безопасности в AsyncStorage

| Поле | Значение |
|------|----------|
| **Severity** | High |
| **Location** | `constants/SecuritySettingsContext.tsx` (строки 65–108) |
| **Evidence** | `AsyncStorage.getItem(SECURITY_SETTINGS_STORAGE_KEY)`, `AsyncStorage.setItem(...)` для настроек биометрии, PIN, блокировки экрана. |
| **Impact** | AsyncStorage не шифруется. При компрометации устройства или XSS настройки можно прочитать/изменить. |
| **Fix** | На iOS/Android использовать `expo-secure-store` (SecureStore) для хранения настроек безопасности; на web оставить AsyncStorage (SecureStore не поддерживается). |
| **Status** | ✅ Исправлено (SecureStore на native, fallback на web) |

---

## 2. Высокий приоритет (High)

### SEC-003: CSRF при cookie-based аутентификации

| Поле | Значение |
|------|----------|
| **Severity** | High (только если используется auth через cookies) |
| **Location** | Backend auth routes, frontend tRPC client |
| **Evidence** | Аутентификация через tRPC: если в будущем будут использоваться cookies для сессий, нужна защита от CSRF. |
| **Impact** | При cookie-based auth возможны CSRF-атаки на state-changing запросы. |
| **Fix** | Сейчас auth идёт через tRPC без cookies — риска нет. При переходе на cookie-сессии: добавить CSRF token (synchronizer token или double-submit cookie) и проверку Origin/Referer. |
| **Status** | ⏳ Не применимо (cookie auth не используется); задокументировано на будущее. |

---

### SEC-004: Авторизация только на клиенте

| Поле | Значение |
|------|----------|
| **Severity** | High (если бы защита была только на клиенте) |
| **Location** | Backend procedures |
| **Evidence** | Все защищённые операции (sync, auth, notifications) выполняются через tRPC; серверная валидация (Zod, deviceId, Supabase) присутствует. |
| **Impact** | Проверки только в UI не являются защитой — их можно обойти вызовом API. |
| **Fix** | Все критические операции должны проверяться на backend. Текущая архитектура это обеспечивает. |
| **Status** | ✅ Соответствует (авторизация/валидация на backend) |

---

## 3. Средний приоритет (Medium)

### SEC-005: Rate limiting на auth endpoints

| Поле | Значение |
|------|----------|
| **Severity** | Medium |
| **Location** | `backend/trpc/routes/auth/*`, `backend/trpc/middleware/rateLimit.ts` |
| **Evidence** | `registerParentProcedure.use(rateLimiters.general)`, `validateParentCodeProcedure.use(rateLimiters.general)` — общий лимит 100 req/min. |
| **Impact** | Без более жёсткого лимита возможен brute-force по кодам/регистрации. |
| **Fix** | Добавлен отдельный `rateLimiters.auth` (строже) для процедур registerParent, registerChild, validateParentCode. |
| **Status** | ✅ Исправлено (auth rate limiter) |

---

### SEC-006: Audit logging критических операций

| Поле | Значение |
|------|----------|
| **Severity** | Medium |
| **Location** | Backend auth, sync, alerts |
| **Evidence** | Нет централизованного логирования событий безопасности (логин, смена настроек, SOS, создание алертов). |
| **Impact** | Сложнее расследовать инциденты и злоупотребления. |
| **Fix** | Ввести структурированное логирование (например, logger с полями action, userId, deviceId, result) для: регистрация родитель/ребёнок, валидация кода, создание/обновление алертов, смена критичных настроек. Не логировать пароли и токены. |
| **Status** | 📋 Рекомендация (в бэклог) |

---

### SEC-007: Заголовки безопасности (CSP, X-Frame-Options и т.д.)

| Поле | Значение |
|------|----------|
| **Severity** | Medium |
| **Location** | Backend (Hono), CDN/edge (Vercel/Rork) |
| **Evidence** | В коде backend не найдена явная настройка Helmet/CSP; возможно задаётся на edge. |
| **Impact** | Риск XSS, clickjacking, если заголовки не выставлены на уровне edge. |
| **Fix** | Проверить заголовки в production (CSP, X-Content-Type-Options: nosniff, X-Frame-Options или frame-ancestors). При необходимости добавить middleware (например, Helmet-аналог для Hono) в backend. |
| **Status** | 📋 Рекомендация (проверить на edge/CDN) |

---

## 4. Низкий приоритет (Low)

### SEC-008: Зависимости и supply chain

| Поле | Значение |
|------|----------|
| **Severity** | Low |
| **Location** | CI (`.github/workflows/ci.yml`, `security.yml`) |
| **Evidence** | `bun audit` выполняется в CI и в security workflow; lockfile проверяется. |
| **Impact** | Уязвимости в зависимостях могут остаться незамеченными без регулярного audit. |
| **Fix** | Оставить/усилить: `bun install --frozen-lockfile`, `bun audit` в CI; при необходимости добавить audit для `backend/` отдельным шагом. |
| **Status** | ✅ Реализовано (CI + security workflow) |

---

### SEC-009: Секреты в коде и в репозитории

| Поле | Значение |
|------|----------|
| **Severity** | Low (при соблюдении практик) |
| **Location** | `.env` в .gitignore, EAS Secrets, Vercel env |
| **Evidence** | Секреты задаются через env и EAS/Vercel; в коде не хардкодятся. |
| **Fix** | Не коммитить `.env` с реальными ключами; использовать только примеры в `.env.example`. |
| **Status** | ✅ Соответствует |

---

## 5. Что уже реализовано хорошо

- **Валидация и санитизация:** Zod-схемы, `backend/utils/security.ts` (sanitizeString, sanitizeEmail, sanitizePhone, containsXSS и т.д.).
- **AI-модерация:** Анализ текста и изображений, уровни риска, fallback при недоступности API.
- **Биометрия:** Face ID / Touch ID / Fingerprint через expo-local-authentication.
- **Rate limiting:** Общий и специализированный (auth) middleware на tRPC.
- **Безопасность данных:** Валидация deviceId, email, phone, timestamp; ограничение размера и глубины JSON.

---

## 6. Рекомендации на будущее

1. **SSL Pinning** (mobile): снижение риска MITM в недоверенных сетях.
2. **Шифрование данных at rest:** для особо чувствительных полей в БД (по необходимости).
3. **Threat model:** документ с акторами, активами и сценариями угроз для детского приложения.
4. **Регулярный пересмотр:** повторный аудит после крупных фич или раз в квартал.

---

## 7. Ссылки на исправления

- Backend AI proxy: `backend/trpc/routes/ai/analyze-message.ts`
- Роутер AI: `backend/trpc/app-router.ts` (ai.analyzeMessage)
- Клиент: `utils/aiService.ts` — приоритет вызова backend, без передачи ключа на клиент
- SecureStore: `constants/SecuritySettingsContext.tsx` — SecureStore на native
- Auth rate limiter: `backend/trpc/middleware/rateLimit.ts` (rateLimiters.auth)

---

    *Отчёт подготовлен в соответствии с security best practices (OWASP, React/Express security specs).  