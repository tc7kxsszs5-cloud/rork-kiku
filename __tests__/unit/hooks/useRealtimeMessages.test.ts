// __tests__/unit/hooks/useRealtimeMessages.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';

const mockRemoveChannel = jest.fn();
const mockSubscribe = jest.fn();
const mockOn = jest.fn();
const mockChannel = { on: mockOn, subscribe: mockSubscribe };
const mockChannelFn = jest.fn();

const mockClient = {
  channel: mockChannelFn,
  removeChannel: mockRemoveChannel,
};

jest.mock('@/lib/supabase', () => ({
  get supabaseClient() {
    return mockClient;
  },
}));

describe('useRealtimeMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOn.mockReturnValue(mockChannel);
    mockSubscribe.mockReturnValue(mockChannel);
    mockChannelFn.mockReturnValue(mockChannel);
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
    const broadcastHandler = mockOn.mock.calls[0][2];
    act(() => {
      broadcastHandler({ payload: { chatId: 'chat-abc' } });
    });
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
      ({ chatId }: { chatId: string }) => useRealtimeMessages(chatId, jest.fn()),
      { initialProps: { chatId: 'chat-1' } }
    );
    expect(mockChannelFn).toHaveBeenCalledTimes(1);
    rerender({ chatId: 'chat-2' });
    expect(mockRemoveChannel).toHaveBeenCalledTimes(1);
    expect(mockChannelFn).toHaveBeenCalledTimes(2);
  });
});
