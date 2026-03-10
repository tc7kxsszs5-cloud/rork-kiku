// __tests__/unit/lib/supabase.test.ts
const mockCreateClient = jest.fn(() => ({ mockClient: true }));

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

describe('lib/supabase', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockCreateClient.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns null when env vars are missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    let supabaseClient: unknown;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ({ supabaseClient } = require('@/lib/supabase'));
    });

    expect(supabaseClient).toBeNull();
  });

  it('creates client when env vars are present', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    let supabaseClient: unknown;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ({ supabaseClient } = require('@/lib/supabase'));
    });

    expect(supabaseClient).not.toBeNull();
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({ realtime: expect.any(Object) })
    );
  });
});
