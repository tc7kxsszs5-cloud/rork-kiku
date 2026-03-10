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
 *
 * Note: onNewMessage is stored in a ref to avoid stale closures.
 * This allows callers to pass an inline arrow without re-subscribing on every render.
 * Do NOT remove the ref pattern.
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
