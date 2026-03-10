// backend/trpc/routes/messages/__tests__/broadcast.test.ts
import { broadcastNewMessage } from '../../../utils/realtime-broadcast.js';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('broadcastNewMessage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('calls Supabase Realtime broadcast endpoint with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });
    await broadcastNewMessage('chat-123', 'msg-456');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.supabase.co/realtime/v1/api/broadcast',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          apikey: 'test-service-key',
          Authorization: 'Bearer test-service-key',
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
