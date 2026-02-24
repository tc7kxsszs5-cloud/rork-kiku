# Production Checklist (Supabase + Vercel)

**Date:** 17 February 2026

This checklist is designed for a fast, safe production rollout using **Supabase** (PostgreSQL) and **Vercel** (backend). It avoids secrets in the repo and focuses on exact steps.

---

## 0) Required Values (Collect Once)

You will need these values ready:
- Supabase Project URL
- Supabase Anon Key
- Supabase Service Role Key
- Supabase Database URL (PostgreSQL connection string)
- Vercel Backend URL (after deployment)
- OpenAI API Key
- JWT Secret (32+ chars)
- Optional: Sentry DSN

---

## 1) Supabase: Apply Database Schema

Run these SQL scripts in Supabase SQL Editor or via psql:

```bash
psql $DATABASE_URL < backend/schema.sql
psql $DATABASE_URL < backend/security-policies.sql
```

Expected: tables `chats`, `messages`, `alerts`, `devices`, `sync_status`, `settings` are created.

---

## 2) Vercel: Backend Environment Variables

Set these in Vercel (Project → Settings → Environment Variables):

Required:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `OPENAI_API_KEY`

Recommended:
- `SENTRY_DSN`
- `RATE_LIMIT_MAX_REQUESTS` (e.g. `100`)
- `RATE_LIMIT_WINDOW_MS` (e.g. `60000`)

CORS:
- `ALLOWED_ORIGINS`
  - Include production frontend domains
  - Include dev localhost domains if you want local testing
  - Example:
    `https://your-app.com,https://app.your-app.com,http://localhost:8081,http://localhost:19006`

---

## 3) Deploy Backend to Vercel

From `backend/`:

```bash
cd backend
vercel --prod
```

Verify:
```bash
curl https://your-backend.vercel.app/
```

---

## 4) Frontend Environment (Expo)

In `.env.production` (local template only, not committed), set:

- `EXPO_PUBLIC_BACKEND_URL` (point to your Vercel backend URL)
- `EXPO_PUBLIC_API_URL` (legacy fallback if you already use it)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `EXPO_PUBLIC_PROJECT_ID` (only if you want to override `app.json` → `extra.eas.projectId`)
- `EXPO_PUBLIC_ENABLE_SENTRY=true`
- `EXPO_PUBLIC_ENV=production`

---

## 5) EAS Secrets (Build-Time)

```bash
eas secret:create --scope project --name DATABASE_URL --value "postgresql://..."
eas secret:create --scope project --name JWT_SECRET --value "your-secret"
eas secret:create --scope project --name OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name SENTRY_DSN --value "https://..."
```

---

## 6) Production Build

```bash
eas build --platform all --profile production
```

---

## 7) Post‑Deploy Smoke Tests

- Backend health:
```bash
curl https://your-backend.vercel.app/
```

- tRPC endpoint:
```bash
curl https://your-backend.vercel.app/api/trpc/example.hi
```

- App connectivity:
  - Open app → trigger basic API call (e.g. chats list)
  - Confirm no CORS errors in logs

---

## Notes / Known Items

- Frontend falls back to a Rork domain if `EXPO_PUBLIC_BACKEND_URL` is not set.
- `app.json` still uses "Safe Zone" branding and rork slug/package. If your intent is KIKU branding, this should be updated.
