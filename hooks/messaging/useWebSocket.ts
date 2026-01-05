/**
 * WebSocket Hook for Real-time Messaging
 * Provides WebSocket connection management for React Native
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';

// WebSocket event types
export const WS_EVENTS = {
  CONNECT: 'connection:connect',
  DISCONNECT: 'connection:disconnect',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  MESSAGE_READ: 'message:read',
  ERROR: 'error',
} as const;

interface WSMessage<T = unknown> {
  event: string;
  data: T;
  timestamp: number;
}

interface UseWebSocketOptions {
  url: string;
  token: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * WebSocket hook for real-time messaging
 */
export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    token,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected');
      return;
    }

    try {
      setStatus(ConnectionStatus.CONNECTING);
      
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      
      // Note: React Native has built-in WebSocket support
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('[WS] Connected');
        setStatus(ConnectionStatus.CONNECTED);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Call registered handlers
          const handlers = messageHandlersRef.current.get(message.event);
          if (handlers) {
            handlers.forEach(handler => handler(message.data));
          }
        } catch (error) {
          console.error('[WS] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        setStatus(ConnectionStatus.ERROR);
        onError?.(error as Error);
      };

      ws.onclose = () => {
        console.log('[WS] Disconnected');
        setStatus(ConnectionStatus.DISCONNECTED);
        onDisconnect?.();
        
        // Attempt reconnection
        if (reconnect && reconnectCountRef.current < maxReconnectAttempts) {
          setStatus(ConnectionStatus.RECONNECTING);
          reconnectCountRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`[WS] Reconnecting... (attempt ${reconnectCountRef.current})`);
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WS] Connection error:', error);
      setStatus(ConnectionStatus.ERROR);
      onError?.(error as Error);
    }
  }, [url, token, reconnect, reconnectInterval, maxReconnectAttempts, onConnect, onDisconnect, onError]);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setStatus(ConnectionStatus.DISCONNECTED);
  }, []);

  /**
   * Send a message through WebSocket
   */
  const send = useCallback((event: string, data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        event,
        data,
        timestamp: Date.now(),
      };
      
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WS] Cannot send message: not connected');
    }
  }, []);

  /**
   * Subscribe to a specific event
   */
  const subscribe = useCallback((event: string, handler: (data: any) => void) => {
    if (!messageHandlersRef.current.has(event)) {
      messageHandlersRef.current.set(event, new Set());
    }
    
    messageHandlersRef.current.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = messageHandlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          messageHandlersRef.current.delete(event);
        }
      }
    };
  }, []);

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback((chatId: string, userId: string, isTyping: boolean) => {
    send(isTyping ? WS_EVENTS.TYPING_START : WS_EVENTS.TYPING_STOP, {
      chatId,
      userId,
      isTyping,
    });
  }, [send]);

  /**
   * Send read receipt
   */
  const sendReadReceipt = useCallback((chatId: string, messageId: string, userId: string) => {
    send(WS_EVENTS.MESSAGE_READ, {
      chatId,
      messageId,
      userId,
      readAt: Date.now(),
    });
  }, [send]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    isConnected: status === ConnectionStatus.CONNECTED,
    lastMessage,
    connect,
    disconnect,
    send,
    subscribe,
    sendTyping,
    sendReadReceipt,
  };
}

/**
 * Hook to listen for specific WebSocket events
 */
export function useWebSocketEvent<T = unknown>(
  ws: ReturnType<typeof useWebSocket>,
  event: string,
  handler: (data: T) => void
) {
  useEffect(() => {
    return ws.subscribe(event, handler);
  }, [ws, event, handler]);
}
