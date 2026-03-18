# Car Wrap & Tuning App — Design Spec
**Date:** 2026-03-18
**Status:** Approved
**Project:** New standalone app (separate from Safe Zone)

---

## Overview

A cross-platform (iOS, Android, Web) car wrap and tuning visualization app for two audiences:
- **Clients (B2C):** Choose their car from a catalog, visualize wrap colors, tinting, and protection zones
- **Studios (B2B):** Receive client configurations, add pricing, manage orders

---

## Architecture

### Frontend
- **React Native + Expo** (expo-router, same stack as Safe Zone)
- **Three.js inside WebView** — 3D rendering, 360° rotation, mesh-level click detection
- **GLTF/GLB** — 3D model format (industry standard)
- **Zustand** — configurator state (selected parts, colors, materials)
- Works on iOS, Android, and Web from a single codebase

### Backend
- **Hono + tRPC** (same stack as Safe Zone)
- **Supabase** — PostgreSQL database, Auth, Storage for thumbnails
- **Cloudflare R2** — CDN for heavy GLB files (3D models, 5–20 MB each)

---

## Car Catalog

### Coverage
- Years: **2021–2026**
- Categories: Sedans, SUVs, Coupes, Wagons, Minivans, Commercial/Buses
- Total target: **~150–200 GLB models** (start with 40–50, expand monthly)

### Priority Brands (German trio first)

**BMW**
- 1, 2, 3, 4, 5, 7, 8 Series
- X1, X2, X3, X4, X5, X6, X7
- M3, M4, M5
- i4, i5, i7 (electric)

**Mercedes-Benz**
- A, C, E, S Class
- CLA, CLE, G-Class
- GLA, GLB, GLC, GLE, GLS
- V-Class (minivan)
- EQA, EQE, EQS (electric)

**Audi**
- A3, A4, A5, A6, A7, A8
- Q3, Q4, Q5, Q6, Q7, Q8
- RS/S-line variants
- e-tron (electric)

**Mass Market**
- Toyota: Camry, RAV4, Land Cruiser, Hilux
- Kia: K5, K8, Sportage, Sorento
- Hyundai: Sonata, Tucson, Santa Fe
- Volkswagen: Golf, Passat, Tiguan
- Lada: Vesta, Niva

**Minivans**
- Toyota Alphard, Kia Carnival, Mercedes V-Class, VW Multivan

**Commercial / Buses**
- Mercedes Sprinter, Ford Transit, VW Crafter, Газель Next

### Catalog Structure
```
Brand → Model → Generation (year range) → GLB file
```
One GLB per generation (same body = same file, multiple years point to it).

### 3D Model Sources
- Sketchfab, CGTrader, TurboSquid
- GLB files must have named, separated meshes per body part
- Budget estimate: ~$20–80/model → ~$1,500–2,000 for initial 40–50 models

---

## User Flows

### Client Flow
```
Register/Login
  → Home: "Start Configuration" button
  → Select car: Brand → Model → Year/Generation
  → 3D Editor (main screen)
  → Save / Share / Send to Studio
```

### Studio Flow
```
Login (studio role)
  → Dashboard: incoming orders, statuses
  → View client configuration in 3D
  → Add price → Confirm order
  → Studio profile: name, city, services, portfolio
```

---

## 3D Editor — Core Screen

### Layout
```
┌─────────────────────────────┐
│   [3D car — rotate 360°]    │
│                             │
│  [Parts] [Glass] [Summary]  │  ← bottom tabs
└─────────────────────────────┘
```

### Interaction
1. User taps a part on the 3D model
2. Three.js Raycaster identifies the mesh (e.g., "hood")
3. Bottom sheet opens with material options
4. Material/color applied to mesh in real time

### Body Parts (meshes)

| Group | Parts |
|-------|-------|
| Body | hood, roof, trunk, doors (×4) |
| Bumpers | front bumper, rear bumper, grille, splitter, trim pieces |
| Moldings | sills, wheel arches, door moldings |
| Mirrors | mirror housings |
| Glass | windshield, side windows (×4), rear window |

### Wrap Materials
- Finishes: Gloss, Matte, Carbon, Chrome, Satin
- Brands: 3M, Avery Dennison, KPMF, Oracal
- Color picker + brand preset colors
- Texture preview thumbnail per material

### Window Tinting (Glass tab)
- Per-window tint slider: 0–95%
- Three.js updates mesh opacity + color in real time
- Visual result visible on the 3D model

### Save & Share
- Config saved to Supabase as JSON
- Deep link opens the saved config for any recipient
- Screenshot of 3D render → save to gallery

---

## Data Model

```sql
-- Cars
cars: id, make, model, year_from, year_to, generation_name, glb_url, thumbnail_url

-- Car parts (meshes)
car_parts: id, car_id, mesh_name, label_ru, group (body/bumper/glass/mirror/molding)

-- Wrap materials
materials: id, name, brand, finish (gloss/matte/carbon/chrome/satin),
           color_hex, texture_url, price_per_m2

-- Client configurations
configs: id, user_id, car_id, created_at,
         parts_config: jsonb,   -- [{part_id, material_id, color_hex}]
         windows_config: jsonb  -- [{window_id, tint_percent}]

-- Studios
studios: id, owner_id, name, city, logo_url, services: jsonb, rating

-- Orders
orders: id, config_id, client_id, studio_id, status, price, created_at
```

---

## API (tRPC routes)

```
cars.list(make?, model?, yearFrom?, yearTo?)   → car catalog
cars.get(id)                                   → car + all its parts

materials.list(finish?, brand?)                → materials catalog

configs.save(carId, partsConfig, windowsConfig) → save configuration
configs.get(id)                                 → get config by id (for sharing)

studios.list(city?)                             → nearby studios
orders.create(configId, studioId)               → send request to studio
orders.list()                                   → my orders (client or studio)
```

---

## Monetization

### Clients (B2C)
- **Free:** basic configurator, save & share
- **Premium (~$4.99/mo):** all materials & textures, unlimited saves, PDF export

### Studios (B2B)
- **Free plan:** 1 profile, up to 5 orders/month
- **Pro (~$29/mo):** unlimited orders, portfolio, analytics, branded PDF
- **White-label (custom):** own branding in the app

---

## Phased Rollout

### Phase 1 — MVP (this spec)
- Car catalog (40–50 models, 2021–2026)
- 3D viewer with 360° rotation + per-part tap
- Wrap customization per part (color, finish, texture)
- Window tinting
- Save / Share / Send to Studio
- Client + Studio accounts

### Phase 2 — Risk Zones
- PPF zone map overlay (bumper, hood, sills, mirrors, arches)
- Protection package selection (full / partial / critical only)
- Area calculation → PDF quote

### Phase 3 — Tuning + AI Photo
- Photo upload → AI identifies car make/model → loads 3D model
- Rims catalog (choose model or color)
- Spoilers, body kits, trim accessories
- Chrome / de-gloss individual elements
- Studio admin panel: order management, service catalog, pricing
