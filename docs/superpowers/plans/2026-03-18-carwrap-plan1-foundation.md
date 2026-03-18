# CarWrap App — Plan 1: Foundation (Scaffold + Auth + Car Catalog)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new Expo app with authentication (client/studio roles) and a browsable car catalog (brand → model → generation) backed by Supabase + tRPC.

**Architecture:** New standalone Expo project (expo-router v3) with a Hono+tRPC backend. Supabase handles auth and PostgreSQL. Car catalog is seeded with ~10 models for development. No 3D yet — catalog ends at a "Car Selected" placeholder screen.

**Tech Stack:** Expo SDK 52, expo-router v3, Hono, tRPC v11, Supabase JS v2, Zustand, Zod, Bun

> **Note:** All tRPC routes in Plan 1 use `publicProcedure`. Role-based middleware (`clientProcedure` / `studioProcedure`) is deferred to Plan 3 when studio/order routes are added.

---

## Project Location

Create at: `/Users/mac/dev/carwrap/`
(outside iCloud — avoids sync issues, same pattern as SurvivalAI)

---

## File Map

```
/Users/mac/dev/carwrap/
├── app/
│   ├── _layout.tsx                  # Root layout, AuthContext provider
│   ├── (auth)/
│   │   ├── login.tsx                # Login screen
│   │   └── register.tsx             # Register screen (choose role)
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Tab bar layout
│   │   ├── index.tsx                # Home: "Start Configuration" button
│   │   └── profile.tsx              # User profile / studio profile
│   └── catalog/
│       ├── index.tsx                # Brand list
│       ├── [brand].tsx              # Models for a brand
│       └── [brand]/[model].tsx      # Generations → "Select" button
├── backend/
│   ├── server.ts                    # Hono server entry
│   └── trpc/
│       ├── app-router.ts            # Root tRPC router
│       ├── trpc.ts                  # tRPC init, middleware, procedures
│       └── routes/
│           ├── cars/
│           │   ├── list.ts          # cars.list(make?, model?)
│           │   └── get.ts           # cars.get(id)
│           └── auth/
│               └── profile.ts       # auth.getProfile, auth.updateProfile
├── constants/
│   ├── AuthContext.tsx              # Auth state, login/logout/register
│   └── supabase.ts                  # Supabase client (anon key)
├── components/
│   ├── BrandCard.tsx                # Brand logo + name card
│   ├── CarModelCard.tsx             # Model thumbnail + name
│   └── GenerationCard.tsx           # Year range + generation name
├── docs/
│   └── sql/
│       └── carwrap-schema.sql       # Full DB schema
├── package.json
├── app.json
├── tsconfig.json
└── .env                             # EXPO_PUBLIC_SUPABASE_URL, etc.
```

---

## Task 1: Scaffold new Expo project

**Files:**
- Create: `/Users/mac/dev/carwrap/` (entire project)

- [ ] **Step 1: Create project**
```bash
mkdir -p /Users/mac/dev/carwrap
cd /Users/mac/dev/carwrap
bunx create-expo-app@latest . --template blank-typescript
```

- [ ] **Step 2: Install dependencies**
```bash
cd /Users/mac/dev/carwrap
bun add expo-router @supabase/supabase-js zustand zod @trpc/client @trpc/server hono @hono/trpc-server
bun add -d @types/react @types/react-native
bunx expo install expo-linking expo-constants expo-status-bar react-native-safe-area-context react-native-screens
```

- [ ] **Step 3: Configure expo-router in app.json**

Replace contents of `app.json`:
```json
{
  "expo": {
    "name": "CarWrap",
    "slug": "carwrap",
    "version": "1.0.0",
    "scheme": "carwrap",
    "web": { "bundler": "metro" },
    "plugins": ["expo-router"]
  }
}
```

- [ ] **Step 4: Configure tsconfig.json**

Replace contents of `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

- [ ] **Step 5: Create .env file**
```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

- [ ] **Step 6: Verify it starts**
```bash
cd /Users/mac/dev/carwrap
bun run start
```
Expected: Expo DevTools opens, no errors.

- [ ] **Step 7: Commit**
```bash
git init && git add -A
git commit -m "feat: scaffold Expo app with expo-router"
```

---

## Task 2: Supabase schema

**Files:**
- Create: `docs/sql/carwrap-schema.sql`

- [ ] **Step 1: Create schema file**

Create `docs/sql/carwrap-schema.sql`:
```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('client', 'studio_owner')),
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Cars
create table cars (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year_from int not null,
  year_to int,
  generation_name text,
  glb_url text,
  thumbnail_url text,
  created_at timestamptz default now()
);
create index on cars(make);
create index on cars(make, model);

-- Car parts (mesh map)
create table car_parts (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete cascade,
  mesh_name text not null,
  label_ru text not null,
  part_group text not null check (part_group in ('body','bumper','glass','mirror','molding'))
);

-- Materials (wrap films)
create table materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  finish text not null check (finish in ('gloss','matte','carbon','chrome','satin')),
  color_hex text,
  texture_url text,
  price_per_m2 numeric,
  requires_premium boolean default false
);

-- Configurations
create table configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  car_id uuid references cars(id),
  parts_config jsonb default '[]',
  windows_config jsonb default '[]',
  created_at timestamptz default now()
);
alter table configs enable row level security;
create policy "Users can manage own configs"
  on configs for all using (auth.uid() = user_id);

-- Studios
create table studios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  city text,
  logo_url text,
  services jsonb default '[]',
  rating numeric default 0,
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  config_id uuid references configs(id),
  client_id uuid references auth.users(id),
  studio_id uuid references studios(id),
  status text not null default 'pending'
    check (status in ('pending','viewed','quoted','confirmed','cancelled')),
  price numeric,
  studio_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Client sees own orders"
  on orders for select using (auth.uid() = client_id);
create policy "Studio sees own orders"
  on orders for select using (
    auth.uid() = (select owner_id from studios where id = studio_id)
  );

-- Trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, role, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'role','client'), new.email);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Seed: 10 cars for development
insert into cars (make, model, year_from, year_to, generation_name) values
  ('BMW', '3 Series', 2019, 2025, 'G20'),
  ('BMW', '5 Series', 2017, 2023, 'G30'),
  ('BMW', 'X5', 2019, 2025, 'G05'),
  ('Mercedes-Benz', 'C-Class', 2021, 2025, 'W206'),
  ('Mercedes-Benz', 'E-Class', 2017, 2023, 'W213'),
  ('Mercedes-Benz', 'GLE', 2020, 2025, 'W167'),
  ('Audi', 'A6', 2019, 2025, 'C8'),
  ('Audi', 'Q5', 2021, 2025, 'FY facelift'),
  ('Toyota', 'Camry', 2018, 2024, 'XV70'),
  ('Kia', 'K5', 2020, 2025, 'DL3');
```

- [ ] **Step 2: Run in Supabase SQL Editor**

Open Supabase dashboard → SQL Editor → paste and run the entire file.
Expected: all tables created, no errors.

Verify seed data:
```sql
SELECT count(*) FROM cars;
-- Expected: 10
```

- [ ] **Step 3: Commit schema file**
```bash
git add docs/sql/carwrap-schema.sql
git commit -m "feat: add Supabase schema with profiles, cars, materials, configs, studios, orders"
```

---

## Task 3: Supabase client + AuthContext

**Files:**
- Create: `constants/supabase.ts`
- Create: `constants/AuthContext.tsx`

- [ ] **Step 1: Create Supabase client**

Create `constants/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Create AuthContext**

Create `constants/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

type Role = 'client' | 'studio_owner'

type Profile = {
  id: string
  role: Role
  display_name: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: Role) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('id, role, display_name')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signUp(email: string, password: string, role: Role) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

- [ ] **Step 3: Wrap root layout with AuthProvider**

Create `app/_layout.tsx`:
```typescript
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/constants/AuthContext'

function RootNavigator() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return
    const inAuth = segments[0] === '(auth)'
    if (!user && !inAuth) router.replace('/(auth)/login')
    if (user && inAuth) router.replace('/(tabs)')
  }, [user, loading])

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}
```

- [ ] **Step 4: Commit**
```bash
git add constants/ app/_layout.tsx
git commit -m "feat: add Supabase client and AuthContext with role support"
```

---

## Task 4: Auth screens (Login + Register)

**Files:**
- Create: `app/(auth)/login.tsx`
- Create: `app/(auth)/register.tsx`

- [ ] **Step 1: Create login screen**

Create `app/(auth)/login.tsx`:
```typescript
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/constants/AuthContext'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Заполните все поля')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) Alert.alert('Ошибка', error)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarWrap</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Пароль" value={password}
        onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Вход...' : 'Войти'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0f0f0f' },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 16,
           marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#e63946', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#888', textAlign: 'center', marginTop: 20 },
})
```

- [ ] **Step 2: Create register screen**

Create `app/(auth)/register.tsx`:
```typescript
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/constants/AuthContext'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'studio_owner'>('client')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleRegister() {
    if (!email || !password) return Alert.alert('Заполните все поля')
    setLoading(true)
    const { error } = await signUp(email, password, role)
    setLoading(false)
    if (error) Alert.alert('Ошибка', error)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Пароль" value={password}
        onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Я:</Text>
      <View style={styles.roleRow}>
        {(['client', 'studio_owner'] as const).map(r => (
          <TouchableOpacity key={r} style={[styles.roleBtn, role === r && styles.roleBtnActive]}
            onPress={() => setRole(r)}>
            <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
              {r === 'client' ? 'Клиент' : 'Студия'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Регистрация...' : 'Создать аккаунт'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0f0f0f' },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 16,
           marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  label: { color: '#888', marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1,
             borderColor: '#333', alignItems: 'center' },
  roleBtnActive: { borderColor: '#e63946', backgroundColor: '#1a0507' },
  roleBtnText: { color: '#888', fontWeight: '600' },
  roleBtnTextActive: { color: '#e63946' },
  button: { backgroundColor: '#e63946', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#888', textAlign: 'center', marginTop: 20 },
})
```

- [ ] **Step 3: Test auth flow manually**

Run app → should redirect to login → register new account → redirects to tabs.

- [ ] **Step 4: Commit**
```bash
git add app/\(auth\)/
git commit -m "feat: add login and register screens with role selection"
```

---

## Task 5: tRPC backend — cars routes

**Files:**
- Create: `backend/trpc/trpc.ts`
- Create: `backend/trpc/routes/cars/list.ts`
- Create: `backend/trpc/routes/cars/get.ts`
- Create: `backend/trpc/app-router.ts`
- Create: `backend/server.ts`

- [ ] **Step 1: Create tRPC init**

Create `backend/trpc/trpc.ts`:
```typescript
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

export const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure
```

- [ ] **Step 2: Create cars.list route**

Create `backend/trpc/routes/cars/list.ts`:
```typescript
import { z } from 'zod'
import { publicProcedure } from '../../trpc'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const carsList = publicProcedure
  .input(z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    yearFrom: z.number().optional(),
    yearTo: z.number().optional(),
  }).optional())
  .query(async ({ input }) => {
    let query = supabase.from('cars').select('*').order('make').order('model')
    if (input?.make) query = query.eq('make', input.make)
    if (input?.model) query = query.eq('model', input.model)
    if (input?.yearFrom) query = query.gte('year_from', input.yearFrom)
    if (input?.yearTo) query = query.lte('year_to', input.yearTo)
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  })
```

- [ ] **Step 3: Create cars.get route**

Create `backend/trpc/routes/cars/get.ts`:
```typescript
import { z } from 'zod'
import { publicProcedure } from '../../trpc'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const carsGet = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input }) => {
    const { data: car, error } = await supabase
      .from('cars').select('*').eq('id', input.id).single()
    if (error) throw new Error(error.message)

    const { data: parts } = await supabase
      .from('car_parts').select('*').eq('car_id', input.id)

    return { ...car, parts: parts ?? [] }
  })
```

- [ ] **Step 4: Create app router**

Create `backend/trpc/app-router.ts`:
```typescript
import { router } from './trpc'
import { carsList } from './routes/cars/list'
import { carsGet } from './routes/cars/get'

export const appRouter = router({
  cars: router({
    list: carsList,
    get: carsGet,
  }),
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 5: Create Hono server**

Create `backend/server.ts`:
```typescript
import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc/app-router'

const app = new Hono()

app.use('/trpc/*', trpcServer({ router: appRouter }))

app.get('/health', (c) => c.json({ ok: true }))

export default {
  port: 3000,
  fetch: app.fetch,
}
```

- [ ] **Step 6: Add backend .env**
```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 7: Start backend and test**
```bash
cd /Users/mac/dev/carwrap
bun backend/server.ts
# In another terminal:
curl http://localhost:3000/health
# Expected: {"ok":true}
curl "http://localhost:3000/trpc/cars.list?input={}"
# Expected: JSON array of 10 seed cars
```

- [ ] **Step 8: Commit**
```bash
git add backend/
git commit -m "feat: add tRPC backend with cars.list and cars.get routes"
```

---

## Task 6: tRPC client + car catalog UI

**Files:**
- Create: `constants/trpc.ts`
- Create: `app/catalog/index.tsx`
- Create: `app/catalog/[brand].tsx`
- Create: `app/catalog/[brand]/[model].tsx`
- Create: `components/BrandCard.tsx`
- Create: `components/GenerationCard.tsx`

- [ ] **Step 1: Create tRPC client**

Create `constants/trpc.ts`:
```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/backend/trpc/app-router'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,
    }),
  ],
})
```

- [ ] **Step 2: Create BrandCard component**

Create `components/BrandCard.tsx`:
```typescript
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type Props = { brand: string; count: number; onPress: () => void }

export function BrandCard({ brand, count, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.count}>{count} моделей</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20,
          marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  brand: { color: '#fff', fontSize: 18, fontWeight: '700' },
  count: { color: '#888', fontSize: 14, marginTop: 4 },
})
```

- [ ] **Step 3: Create brand list screen**

Create `app/catalog/index.tsx`:
```typescript
import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '@/constants/trpc'
import { BrandCard } from '@/components/BrandCard'

export default function CatalogScreen() {
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    trpc.cars.list.query().then(cars => {
      const map: Record<string, number> = {}
      cars.forEach(c => { map[c.make] = (map[c.make] ?? 0) + 1 })
      setBrands(Object.entries(map).map(([name, count]) => ({ name, count })))
      setLoading(false)
    })
  }, [])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#e63946" />

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите марку</Text>
      <FlatList
        data={brands}
        keyExtractor={b => b.name}
        renderItem={({ item }) => (
          <BrandCard brand={item.name} count={item.count}
            onPress={() => router.push(`/catalog/${item.name}`)} />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16, paddingTop: 60 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 },
})
```

- [ ] **Step 4: Create models-for-brand screen**

Create `app/catalog/[brand].tsx`:
```typescript
import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { trpc } from '@/constants/trpc'

export default function BrandModelsScreen() {
  const { brand } = useLocalSearchParams<{ brand: string }>()
  const [models, setModels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    trpc.cars.list.query({ make: brand }).then(cars => {
      const unique = [...new Set(cars.map(c => c.model))]
      setModels(unique)
      setLoading(false)
    })
  }, [brand])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#e63946" />

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{brand}</Text>
      <FlatList
        data={models}
        keyExtractor={m => m}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
            onPress={() => router.push(`/catalog/${brand}/${item}`)}>
            <Text style={styles.model}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16, paddingTop: 60 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20,
          marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  model: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
```

- [ ] **Step 5: Create generations screen (leaf node)**

Create `app/catalog/[brand]/[model].tsx`:
```typescript
import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { trpc } from '@/constants/trpc'

type Car = { id: string; make: string; model: string; year_from: number;
             year_to: number | null; generation_name: string | null }

export default function GenerationsScreen() {
  const { brand, model } = useLocalSearchParams<{ brand: string; model: string }>()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trpc.cars.list.query({ make: brand, model }).then(data => {
      setCars(data as Car[])
      setLoading(false)
    })
  }, [brand, model])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#e63946" />

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{brand} {model}</Text>
      <FlatList
        data={cars}
        keyExtractor={c => c.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
            onPress={() => Alert.alert('Готово!', `Выбрано: ${item.generation_name ?? item.year_from}\n\n3D-редактор будет в Плане 2`)}>
            <Text style={styles.gen}>{item.generation_name ?? 'Базовая'}</Text>
            <Text style={styles.years}>
              {item.year_from}–{item.year_to ?? 'н.в.'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16, paddingTop: 60 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20,
          marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a',
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gen: { color: '#fff', fontSize: 16, fontWeight: '600' },
  years: { color: '#888', fontSize: 14 },
})
```

- [ ] **Step 6: Add catalog link to home tab**

Create `app/(tabs)/index.tsx`:
```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/constants/AuthContext'

export default function HomeScreen() {
  const router = useRouter()
  const { profile } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarWrap</Text>
      <Text style={styles.subtitle}>
        {profile?.role === 'studio_owner' ? 'Панель студии' : 'Настрой свою машину'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/catalog')}>
        <Text style={styles.buttonText}>Начать конфигурацию</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center',
               alignItems: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 40, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 48 },
  button: { backgroundColor: '#e63946', borderRadius: 16, paddingVertical: 18,
            paddingHorizontal: 48 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
})
```

- [ ] **Step 7: Create tabs layout**

Create `app/(tabs)/_layout.tsx`:
```typescript
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0f0f0f', borderTopColor: '#1a1a1a' },
      tabBarActiveTintColor: '#e63946',
      tabBarInactiveTintColor: '#555',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Главная' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
    </Tabs>
  )
}
```

- [ ] **Step 8: Create profile tab**

Create `app/(tabs)/profile.tsx`:
```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '@/constants/AuthContext'

export default function ProfileScreen() {
  const { profile, signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile?.display_name ?? 'Пользователь'}</Text>
      <Text style={styles.role}>
        {profile?.role === 'studio_owner' ? '🏪 Студия' : '👤 Клиент'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center',
               alignItems: 'center', padding: 24 },
  name: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  role: { color: '#888', fontSize: 16, marginBottom: 48 },
  button: { backgroundColor: '#333', borderRadius: 12, paddingVertical: 14,
            paddingHorizontal: 40 },
  buttonText: { color: '#fff', fontSize: 16 },
})
```

- [ ] **Step 9: Manual end-to-end test**
1. Start backend: `bun backend/server.ts`
2. Start app: `bun run start`
3. Register as client → lands on Home
4. Tap "Начать конфигурацию" → Brand list shows BMW, Mercedes, Audi, Toyota, Kia
5. Tap BMW → shows 3 Series, 5 Series, X5
6. Tap 3 Series → shows G20 (2019–2025) → tap → shows placeholder alert
7. Profile tab shows role

- [ ] **Step 10: Commit**
```bash
git add app/ components/ constants/trpc.ts
git commit -m "feat: add car catalog UI — brand → model → generation flow"
```

---

## Plan 1 Complete ✅

**What's working after Plan 1:**
- New Expo app with expo-router
- Supabase auth with client/studio_owner roles
- tRPC backend with car catalog API
- Full catalog browse: Brand → Model → Generation
- Dark UI with red accent

**Next:** Plan 2 — 3D Editor (Three.js in WebView, mesh tap, material system)
