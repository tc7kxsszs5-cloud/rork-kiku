# Safe Zone — Messenger Architecture Design
Date: 2026-03-10

## Product Concept

Safe Zone is a closed, safe communication platform for children with two distinct spaces:

**Space A — Family Channel** (already implemented)
- Parent ↔ Child private 1:1 chat
- Calls, SOS button, push notifications

**Space B — Educational Space** (to be built)
- Children ↔ Children within the same institution
- Group chats (class/school) + private DMs between children
- Teacher: group only, no personal DMs with children
- AI agent filters all messages before delivery
- Parent grants access via QR approval — does not read messages

## Roles & Permissions

| Role | Space A | Space B |
|---|---|---|
| Child | Chat with parent | Group chat + DMs with children (same institution) + QR sharing |
| Parent | Chat with child | Approves QR only — no read access |
| Teacher | — | Group only, no private DMs with children |
| AI Agent | Monitoring | Filters ALL messages before delivery |
| Institution Admin | — | Registration, groups, QR generation, teacher assignment |

## Access Flow (QR Onboarding)

```
Institution registers on platform
        ↓
Creates group (e.g. Class 5A) → generates QR
        ↓
Parent scans QR → sees: "School #15, Class 5A"
        ↓
Parent approves → child gets access
        ↓
Child can share QR with classmates
        ↓
Classmate's parent approves → classmate joins
        (cycle repeats per child)
```

Parent is the final verifier — no central institution verification needed at MVP.

## AI Moderation Layer

Every message passes 3 levels before reaching recipient:

1. **Quick check** (quickCheckMessage) — <50ms
   - Profanity, threats, bullying → blocked
2. **Contextual analysis** — async
   - Manipulation, hidden threats → flagged to teacher
   - Personal data (address, phone) → blocked
3. **Delivered** to recipient
4. **Teacher** sees flags in moderator panel

## Data Model (Supabase)

### New tables

```sql
-- Institutions
CREATE TABLE institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email_domain TEXT,
  verified BOOLEAN DEFAULT false,
  created_at BIGINT NOT NULL
);

-- Groups (classes)
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL REFERENCES institutions(id),
  name TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- Group members
CREATE TABLE group_members (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES groups(id),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- 'student' | 'teacher'
  approved_by_parent TEXT,
  joined_at BIGINT NOT NULL
);

-- Join requests (pending parent approval)
CREATE TABLE join_requests (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  qr_code_used TEXT,
  created_at BIGINT NOT NULL
);
```

### Existing tables (extend)
- `messages` — add `chat_type` field: `'family' | 'group' | 'dm'`
- `chats` — add `group_id`, `institution_id`, `chat_type`
- `sos_alerts` — create via SQL (immediate task #1)

## What Exists vs What to Build

### Already implemented ✅
- Family chat (Parent ↔ Child)
- SOS button + push notifications
- AI moderation (quickCheckMessage, AIModerationService)
- Push notifications (Expo Push API + Supabase)
- Auth with roles (parent/child)
- Supabase + tRPC backend on Vercel

### To build 🔨
1. SQL: create `sos_alerts` table in Supabase
2. Supabase Realtime (replace 3s polling)
3. Institution registration + group creation
4. QR generation and scanning
5. Parent approval flow
6. Group chats (educational)
7. Child ↔ Child DMs (AI filtered, same institution only)
8. Teacher role (group moderator, no personal DMs)
9. Teacher moderator panel
10. Sentry error monitoring

## Implementation Sequence

### Week 1 — Infrastructure
- #1 SQL sos_alerts (1h) — unblocks existing SOS code
- #2 Supabase Realtime (1d) — replaces polling, prerequisite for testing

### Week 2 — Educational Space core
- Institution registration + group creation (backend + screens)
- QR generation (backend) + scanning (frontend)
- Parent approval flow (notification + approve screen)
- Group chat UI (reuse existing chat components)

### Week 3 — Refinement
- Child ↔ Child DMs (with institution membership check)
- Teacher moderator panel
- Sentry integration

### Later (needs 2 devices)
- Messenger testing on real devices

## Key Constraints
- Adults (teachers, parents) CANNOT send private messages to children
- Children can ONLY communicate with peers from the same institution
- AI filters every message — no exceptions
- Parent is the gatekeeper for all educational access
- No central institution verification at MVP — parent approval is sufficient
