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
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
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
