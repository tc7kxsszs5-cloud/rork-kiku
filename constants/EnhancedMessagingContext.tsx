/**
 * Enhanced Messaging Context
 * Integrates with WebSocket for real-time messaging
 */

import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useWebSocket, WS_EVENTS, ConnectionStatus } from '@/hooks/messaging/useWebSocket';

// Configuration - should be moved to environment variables or config file
const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000/api/ws';
const getUserToken = () => {
  // TODO: Implement actual authentication token retrieval
  // This should return a JWT or similar secure token
  return 'user_demo'; // PLACEHOLDER - replace with actual auth
};

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationFlags?: string[];
}

interface TypingUser {
  userId: string;
  chatId: string;
  timestamp: number;
}

export const [EnhancedMessagingProvider, useEnhancedMessaging] = createContextHook(() => {
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser[]>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  
  const messageQueueRef = useRef<Message[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize WebSocket connection
  const ws = useWebSocket({
    url: WS_URL,
    token: getUserToken(),
    reconnect: true,
    onConnect: () => {
      console.log('[Messaging] Connected to WebSocket');
      setConnectionStatus(ConnectionStatus.CONNECTED);
      
      // Send queued messages
      if (messageQueueRef.current.length > 0) {
        console.log(`[Messaging] Sending ${messageQueueRef.current.length} queued messages`);
        messageQueueRef.current.forEach(msg => {
          // Send via tRPC instead since WebSocket is for receiving only
        });
        messageQueueRef.current = [];
      }
    },
    onDisconnect: () => {
      console.log('[Messaging] Disconnected from WebSocket');
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    },
    onError: (error) => {
      console.error('[Messaging] WebSocket error:', error);
      setConnectionStatus(ConnectionStatus.ERROR);
    },
  });

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = ws.subscribe(WS_EVENTS.MESSAGE_RECEIVE, (data: Message) => {
      if (!isMountedRef.current) return;
      
      console.log('[Messaging] Received message:', data);
      
      setMessages(prev => {
        const newMessages = new Map(prev);
        const chatMessages = newMessages.get(data.chatId) || [];
        
        // Check if message already exists
        const exists = chatMessages.some(m => m.id === data.id);
        if (!exists) {
          chatMessages.push(data);
          chatMessages.sort((a, b) => a.timestamp - b.timestamp);
          newMessages.set(data.chatId, chatMessages);
        }
        
        return newMessages;
      });
    });

    return unsubscribe;
  }, [ws]);

  // Listen for typing indicators
  useEffect(() => {
    const unsubscribeStart = ws.subscribe(WS_EVENTS.TYPING_START, (data: { chatId: string; userId: string }) => {
      if (!isMountedRef.current) return;
      
      setTypingUsers(prev => {
        const newTyping = new Map(prev);
        const chatTyping = newTyping.get(data.chatId) || [];
        
        // Add user if not already typing
        if (!chatTyping.some(u => u.userId === data.userId)) {
          chatTyping.push({
            userId: data.userId,
            chatId: data.chatId,
            timestamp: Date.now(),
          });
          newTyping.set(data.chatId, chatTyping);
        }
        
        return newTyping;
      });
    });

    const unsubscribeStop = ws.subscribe(WS_EVENTS.TYPING_STOP, (data: { chatId: string; userId: string }) => {
      if (!isMountedRef.current) return;
      
      setTypingUsers(prev => {
        const newTyping = new Map(prev);
        const chatTyping = newTyping.get(data.chatId) || [];
        
        // Remove user from typing
        const filtered = chatTyping.filter(u => u.userId !== data.userId);
        if (filtered.length > 0) {
          newTyping.set(data.chatId, filtered);
        } else {
          newTyping.delete(data.chatId);
        }
        
        return newTyping;
      });
    });

    return () => {
      unsubscribeStart();
      unsubscribeStop();
    };
  }, [ws]);

  // Listen for read receipts
  useEffect(() => {
    const unsubscribe = ws.subscribe(WS_EVENTS.MESSAGE_READ, (data: { chatId: string; messageId: string; userId: string }) => {
      if (!isMountedRef.current) return;
      
      setMessages(prev => {
        const newMessages = new Map(prev);
        const chatMessages = newMessages.get(data.chatId);
        
        if (chatMessages) {
          const updated = chatMessages.map(msg => 
            msg.id === data.messageId ? { ...msg, status: 'read' as const } : msg
          );
          newMessages.set(data.chatId, updated);
        }
        
        return newMessages;
      });
    });

    return unsubscribe;
  }, [ws]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (
    chatId: string,
    text: string,
    senderId: string,
    senderName: string
  ) => {
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      chatId,
      senderId,
      senderName,
      text,
      timestamp: Date.now(),
      status: 'pending',
    };

    // Optimistically add message
    setMessages(prev => {
      const newMessages = new Map(prev);
      const chatMessages = newMessages.get(chatId) || [];
      chatMessages.push(tempMessage);
      newMessages.set(chatId, chatMessages);
      return newMessages;
    });

    try {
      // TODO: Send via tRPC when properly configured
      // Example:
      // const result = await trpc.messaging.send.mutate({
      //   chatId,
      //   text,
      //   senderId,
      //   senderName,
      // });
      
      // Simulate API call delay for now
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update message status
      if (isMountedRef.current) {
        setMessages(prev => {
          const newMessages = new Map(prev);
          const chatMessages = newMessages.get(chatId);
          
          if (chatMessages) {
            const updated = chatMessages.map(msg =>
              msg.id === tempMessage.id ? { ...msg, status: 'sent' as const } : msg
            );
            newMessages.set(chatId, updated);
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      console.error('[Messaging] Error sending message:', error);
      
      // Mark as failed
      if (isMountedRef.current) {
        setMessages(prev => {
          const newMessages = new Map(prev);
          const chatMessages = newMessages.get(chatId);
          
          if (chatMessages) {
            const updated = chatMessages.map(msg =>
              msg.id === tempMessage.id ? { ...msg, status: 'failed' as const } : msg
            );
            newMessages.set(chatId, updated);
          }
          
          return newMessages;
        });
      }
      
      // Queue for retry when reconnected
      messageQueueRef.current.push(tempMessage);
    }
  }, []);

  /**
   * Get messages for a chat
   */
  const getMessages = useCallback((chatId: string): Message[] => {
    return messages.get(chatId) || [];
  }, [messages]);

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback((chatId: string, userId: string, isTyping: boolean) => {
    ws.sendTyping(chatId, userId, isTyping);
  }, [ws]);

  /**
   * Mark message as read
   */
  const markAsRead = useCallback((chatId: string, messageId: string, userId: string) => {
    ws.sendReadReceipt(chatId, messageId, userId);
  }, [ws]);

  /**
   * Get typing users for a chat
   */
  const getTypingUsers = useCallback((chatId: string): TypingUser[] => {
    return typingUsers.get(chatId) || [];
  }, [typingUsers]);

  return {
    messages: Array.from(messages.values()).flat(),
    connectionStatus,
    isConnected: ws.isConnected,
    sendMessage,
    getMessages,
    sendTyping,
    markAsRead,
    getTypingUsers,
  };
});
