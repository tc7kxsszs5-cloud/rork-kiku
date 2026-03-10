# Infrastructure: SQL + Supabase Realtime Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unblock SOS functionality by creating the sos_alerts table, and replace 3s polling in the chat screen with Supabase Realtime broadcast (instant message delivery, no polling overhead).

**Architecture:** Backend sends a "new_message" broadcast via Supabase REST HTTP API (not WebSocket — backend runs on Vercel serverless where WebSocket connections are torn down after each invocation). Frontend subscribes to that channel with the anon key (broadcast channels require no RLS). On event: fetches new messages via tRPC. All data reads/writes go through authenticated tRPC — anon key never reads table data directly.

**Tech Stack:** Supabase (PostgreSQL + Realtime broadcast), tRPC, React Native, Jest

---

## Chunk 1: SQL — sos_alerts table

### Task 1: Create SQL file for sos_alerts

**Files:**
- Create: `docs/sql/SOS_ALERTS.sql`

- [ ] **Step 1: Write SQL file**

```sql
-- Таблица для SOS-алертов
-- Выполнить в Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS sos_alerts (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  chat_id TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  message TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by TEXT,
  resolved_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_parent_id ON sos_alerts (parent_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_child_id ON sos_alerts (child_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_created_at ON sos_alerts (created_at);

ALTER TABLE sos_alerts DISABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: Run SQL in Supabase**

Open Supabase Dashboard → SQL Editor → paste contents of `docs/sql/SOS_ALERTS.sql` → Run.

Expected: "Success. No rows returned."

- [ ] **Step 3: Verify table exists**

In Supabase Dashboard → Table Editor → verify `sos_alerts` table appears with correct columns.

- [ ] **Step 4: Commit**

```bash
git add docs/sql/SOS_ALERTS.sql
git commit -m "docs: add sos_alerts SQL — run in Supabase SQL Editor"
```

---

## Chunk 2: Supabase Realtime broadcast

### Task 2: Add frontend Supabase client (anon key, broadcast only)

**Files:**
- Create: `lib/supabase.ts`
- Modify: `app.json` (or `.env` if exists) — add EXPO_PUBLIC_ vars

- [ ] **Step 1: Check current env setup**

```bash
ls /Users/mac/Desktop/rork-kiku/.env* 2>/dev/null || echo "no .env files"
grep -n "EXPO_PUBLIC\|SUPABASE" /Users/mac/Desktop/rork-kiku/app.json | head -10
```

- [ ] **Step 2: Add EXPO_PUBLIC env vars**

If `.env.local` exists, add to it. Otherwise create `.env.local`:

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> Get values from Supabase Dashboard → Settings → API.
> Anon key is safe to expose on frontend — it cannot bypass RLS.
> Note: current tables have RLS disabled (backend uses service_role). Anon key
> will NOT be used for direct table reads — only for Realtime broadcast subscription.

- [ ] **Step 3: Check if @supabase/supabase-js is already resolvable in frontend**

```bash
cd /Users/mac/Desktop/rork-kiku
bun list @supabase/supabase-js 2>/dev/null || echo "not installed"
```

If output is "not installed", run:

```bash
bun add @supabase/supabase-js
```

Expected: package present in package.json dependencies (either already was, or just added).

- [ ] **Step 4: Write failing test**

Create `__tests__/unit/lib/supabase.test.ts`:

```typescript
// __tests__/unit/lib/supabase.test.ts
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ mockClient: true })),
}));

describe('lib/supabase', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns null when env vars are missing', async () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const { supabaseClient } = await import('@/lib/supabase');
    expect(supabaseClient).toBeNull();
  });

  it('creates client when env vars are present', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    const { supabaseClient } = await import('@/lib/supabase');
    expect(supabaseClient).not.toBeNull();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

```bash
cd /Users/mac/Desktop/rork-kiku
bun run test:unit -- __tests__/unit/lib/supabase.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/supabase'"

- [ ] **Step 6: Create lib/supabase.ts**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Anon key: safe for frontend — used only for Realtime broadcast subscription.
// All data reads/writes go through tRPC (authenticated).
export const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: { params: { eventsPerSecond: 10 } },
      })
    : null;
```

- [ ] **Step 7: Run test to verify it passes**

```bash
bun run test:unit -- __tests__/unit/lib/supabase.test.ts
```

Expected: PASS

- [ ] **Step 8: Ensure .env.local is gitignored before committing**

```bash
grep -q "\.env\.local" /Users/mac/Desktop/rork-kiku/.gitignore || echo ".env.local" >> /Users/mac/Desktop/rork-kiku/.gitignore
```

- [ ] **Step 9: Commit (without .env.local)**

```bash
git add lib/supabase.ts __tests__/unit/lib/supabase.test.ts .gitignore
git commit -m "feat: add frontend Supabase client for Realtime broadcast"
```

---

### Task 3: Create useRealtimeMessages hook

**Files:**
- Create: `hooks/useRealtimeMessages.ts`
- Create: `__tests__/unit/hooks/useRealtimeMessages.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/unit/hooks/useRealtimeMessages.test.ts
// Note: use renderHook from @testing-library/react-native (v13+ includes it directly)
import { renderHook } from '@testing-library/react-native';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

const mockRemoveChannel = jest.fn();
const mockSubscribe = jest.fn(() => mockChannel);
const mockOn = jest.fn(() => mockChannel);
const mockChannel = { on: mockOn, subscribe: mockSubscribe };
const mockChannelFn = jest.fn(() => mockChannel);
const mockSend = jest.fn();

const mockClient = {
  channel: mockChannelFn,
  removeChannel: mockRemoveChannel,
};

jest.mock('@/lib/supabase', () => ({
  get supabaseClient() { return mockClient; },
}));

describe('useRealtimeMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOn.mockReturnValue(mockChannel);
    mockSubscribe.mockReturnValue(mockChannel);
  });

  it('does nothing when chatId is null', () => {
    renderHook(() => useRealtimeMessages(null, jest.fn()));
    expect(mockChannelFn).not.toHaveBeenCalled();
  });

  it('subscribes to correct channel for chatId', () => {
    renderHook(() => useRealtimeMessages('chat-123', jest.fn()));
    expect(mockChannelFn).toHaveBeenCalledWith('chat:chat-123');
    expect(mockOn).toHaveBeenCalledWith('broadcast', { event: 'new_message' }, expect.any(Function));
    expect(mockSubscribe).toHaveBeenCalled();
  });

  it('calls onNewMessage when broadcast received', () => {
    const onNewMessage = jest.fn();
    renderHook(() => useRealtimeMessages('chat-abc', onNewMessage));
    // Simulate broadcast event
    const broadcastHandler = mockOn.mock.calls[0][2];
    broadcastHandler({ payload: { chatId: 'chat-abc' } });
    expect(onNewMessage).toHaveBeenCalledWith({ chatId: 'chat-abc' });
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() =>
      useRealtimeMessages('chat-123', jest.fn())
    );
    unmount();
    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('resubscribes when chatId changes', () => {
    const { rerender } = renderHook(
      ({ chatId }) => useRealtimeMessages(chatId, jest.fn()),
      { initialProps: { chatId: 'chat-1' } }
    );
    expect(mockChannelFn).toHaveBeenCalledTimes(1);
    rerender({ chatId: 'chat-2' });
    expect(mockRemoveChannel).toHaveBeenCalledTimes(1);
    expect(mockChannelFn).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun run test:unit -- __tests__/unit/hooks/useRealtimeMessages.test.ts
```

Expected: FAIL with "Cannot find module '@/hooks/useRealtimeMessages'" (not a supabase import error — if you see `@testing-library/react-native` errors instead, install it: `bun add -D @testing-library/react-native`)

- [ ] **Step 3: Create hooks/useRealtimeMessages.ts**

```typescript
// hooks/useRealtimeMessages.ts
import { useEffect, useRef } from 'react';
import { supabaseClient } from '@/lib/supabase';

type BroadcastPayload = {
  chatId: string;
};

/**
 * Subscribes to Supabase Realtime broadcast for a chat.
 * When the backend sends a "new_message" broadcast, calls onNewMessage.
 * Falls back gracefully if Supabase client is unavailable.
 */
export function useRealtimeMessages(
  chatId: string | null,
  onNewMessage: (payload: BroadcastPayload) => void
): void {
  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  useEffect(() => {
    if (!chatId || !supabaseClient) return;

    const channel = supabaseClient
      .channel(`chat:${chatId}`)
      .on('broadcast', { event: 'new_message' }, (event: { payload: BroadcastPayload }) => {
        onNewMessageRef.current(event.payload);
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [chatId]);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun run test:unit -- __tests__/unit/hooks/useRealtimeMessages.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add hooks/useRealtimeMessages.ts __tests__/unit/hooks/useRealtimeMessages.test.ts
git commit -m "feat: add useRealtimeMessages hook — Supabase broadcast subscription"
```

---

### Task 4: Backend broadcasts after message insert (HTTP REST, serverless-safe)

**Why HTTP REST, not WebSocket client:** The backend runs on Vercel serverless. Each function invocation is stateless — a WebSocket connection opened via `supabase.channel().send()` is torn down immediately after the handler returns, making the broadcast silently fail. The Supabase Realtime HTTP REST endpoint (`POST /realtime/v1/api/broadcast`) is a plain HTTP call — it works correctly in serverless.

**Files:**
- Create: `backend/utils/realtime-broadcast.ts`
- Create: `backend/trpc/routes/messages/__tests__/broadcast.test.ts`
- Modify: `backend/trpc/routes/messages/send.ts`

- [ ] **Step 1: Write failing test for broadcast utility**

Create `backend/trpc/routes/messages/__tests__/broadcast.test.ts`:

```typescript
// backend/trpc/routes/messages/__tests__/broadcast.test.ts
import { broadcastNewMessage } from '../../../utils/realtime-broadcast.js';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('broadcastNewMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('calls Supabase Realtime broadcast endpoint with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });
    await broadcastNewMessage('chat-123', 'msg-456');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.supabase.co/realtime/v1/api/broadcast',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'apikey': 'test-service-key',
          'Authorization': 'Bearer test-service-key',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          messages: [{
            topic: 'chat:chat-123',
            event: 'new_message',
            payload: { chatId: 'chat-123', messageId: 'msg-456' },
          }],
        }),
      })
    );
  });

  it('returns silently when env vars are missing (does not throw)', async () => {
    delete process.env.SUPABASE_URL;
    await expect(broadcastNewMessage('chat-123', 'msg-456')).resolves.toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not throw when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(broadcastNewMessage('chat-123', 'msg-456')).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/mac/Desktop/rork-kiku
bun run test:unit -- backend/trpc/routes/messages/__tests__/broadcast.test.ts
```

Expected: FAIL — "Cannot find module '../../../utils/realtime-broadcast.js'"

- [ ] **Step 3: Create backend/utils/realtime-broadcast.ts**

```typescript
// backend/utils/realtime-broadcast.ts
// HTTP REST broadcast — works correctly in Vercel serverless.
// (WebSocket-based supabase.channel().send() is torn down after each invocation.)

export async function broadcastNewMessage(
  chatId: string,
  messageId: string
): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return;

  try {
    await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{
          topic: `chat:${chatId}`,
          event: 'new_message',
          payload: { chatId, messageId },
        }],
      }),
    });
  } catch (err) {
    // Best-effort — do not break message delivery if broadcast fails
    console.warn('[realtime-broadcast] broadcast failed (non-critical):', err);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:unit -- backend/trpc/routes/messages/__tests__/broadcast.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Add broadcast call to send.ts**

In `backend/trpc/routes/messages/send.ts`, add import at top:
```typescript
import { broadcastNewMessage } from '../../utils/realtime-broadcast.js';
```

After the `if (messageError) { throw ... }` block and before the chat update:
```typescript
// Notify frontend subscribers via Realtime broadcast (HTTP REST, serverless-safe)
await broadcastNewMessage(chatId, messageId);
```

- [ ] **Step 6: Run typecheck**

```bash
bun run typecheck
```

Expected: 0 errors

- [ ] **Step 7: Commit**

```bash
git add backend/utils/realtime-broadcast.ts \
        backend/trpc/routes/messages/__tests__/broadcast.test.ts \
        backend/trpc/routes/messages/send.ts
git commit -m "feat: broadcast new_message via Supabase REST API after insert (serverless-safe)"
```

---

### Task 5: Replace polling in chat screen with Realtime hook

**Structural note:** The current polling puts `fetchNewMessages` as an inner function inside a `useEffect`. The replacement moves it outside as a `useCallback` so it can be called from two places: initial mount effect AND the Realtime hook callback. This is a structural refactor of lines 109–152, not just a line splice.

**Files:**
- Modify: `app/chat/[chatId].tsx` (replace polling block ~lines 109–152)

- [ ] **Step 1: Read current polling block**

Read `app/chat/[chatId].tsx` lines 95–155. Confirm:
- `fetchNewMessages` is defined *inside* the `useEffect` at line ~110
- `setInterval(fetchNewMessages, 3000)` is at line ~149
- `lastFetchTime` state is used inside `fetchNewMessages`

- [ ] **Step 2: Replace polling with Realtime**

Delete the entire polling `useEffect` (lines ~109–152). Replace with:

```typescript
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

// ... inside the component, replace the polling useEffect with:

// Fetch messages from server (used on mount + on Realtime event)
const fetchNewMessages = useCallback(async () => {
  if (!chatId) return;
  try {
    const result = await trpcVanillaClient.messages.getForChat.query({
      chatId,
      since: lastFetchTime > 0 ? lastFetchTime : undefined,
    });
    if (result.success && result.messages.length > 0) {
      const mapped: Message[] = result.messages.map((m) => ({
        id: m.id,
        text: m.content ?? m.text ?? '',
        senderId: m.senderId,
        senderName: m.senderName,
        timestamp: m.timestamp,
        analyzed: m.analyzed ?? false,
        riskLevel: (m.riskLevel as RiskLevel) ?? 'safe',
        riskReasons: [],
        imageUri: undefined,
        imageAnalyzed: true,
        imageBlocked: false,
      }));
      mergeServerMessages(mapped);
      setLastFetchTime(Date.now());
    }
  } catch (err) {
    logger.error(
      'Failed to fetch messages',
      err instanceof Error ? err : new Error(String(err)),
      { component: 'ChatScreen', action: 'fetchMessages', chatId }
    );
  }
}, [chatId, lastFetchTime, mergeServerMessages]);

// Initial fetch on mount
useEffect(() => {
  fetchNewMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [chatId]);

// Realtime: fetch on broadcast event.
// Note: passing an inline arrow `() => fetchNewMessages()` is intentional.
// useRealtimeMessages stores onNewMessage in a ref internally, so the latest
// fetchNewMessages (with current lastFetchTime) is always called — no stale closure.
// Do NOT remove the ref pattern from useRealtimeMessages.
useRealtimeMessages(chatId, () => {
  fetchNewMessages();
});
```

- [ ] **Step 3: Run typecheck**

```bash
bun run typecheck
```

Expected: 0 errors

- [ ] **Step 4: Run lint**

```bash
bun run lint
```

Expected: 0 errors

- [ ] **Step 5: Manual smoke test**

```bash
bun run start:web
```

Open chat in browser → send a message → verify it appears without polling delay.
Check browser console: no "Failed to poll messages" errors.

- [ ] **Step 6: Commit**

```bash
git add "app/chat/[chatId].tsx"
git commit -m "feat: replace 3s polling with Supabase Realtime broadcast in chat screen"
```

---

## Summary

After completing this plan:

| Item | Status |
|---|---|
| `sos_alerts` table in Supabase | ✅ SQL created, run manually in Dashboard |
| Frontend Supabase client | ✅ `lib/supabase.ts` (anon key, broadcast only) |
| `useRealtimeMessages` hook | ✅ tested, instant message delivery |
| Backend broadcasts on send | ✅ `messages/send.ts` |
| Chat screen polling removed | ✅ `chat/[chatId].tsx` |

**Next plan:** `2026-03-10-educational-space.md` — Institution registration, QR flow, group chats, child DMs, teacher panel.
