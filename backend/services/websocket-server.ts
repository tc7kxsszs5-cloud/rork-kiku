import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import crypto from 'crypto';
import { analyzeTextContent, shouldBlockMessage } from '../services/content-filter';
import { storeMessage, updateMessageAnalysis, getChatMessages, upsertChat, getChat } from '../services/message-store';
import { Message } from '../../constants/types';

// Store active WebSocket connections by userId
const userConnections = new Map<string, Set<WebSocket>>();

// Store userId for each WebSocket
const connectionUsers = new WeakMap<WebSocket, string>();

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'auth' | 'join_chat' | 'leave_chat' | 'get_messages';
  payload: any;
}

export interface ChatMessagePayload {
  chatId: string;
  text: string;
  senderId: string;
  senderName: string;
  imageUri?: string;
}

export interface AuthPayload {
  userId: string;
  token?: string;
}

export interface JoinChatPayload {
  chatId: string;
  participants: string[];
  participantNames: string[];
}

export interface GetMessagesPayload {
  chatId: string;
  limit?: number;
}

/**
 * Initialize WebSocket server
 */
export const createWebSocketServer = (server: Server): WebSocketServer => {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws',
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');

    // Send welcome message
    sendToClient(ws, {
      type: 'connected',
      payload: { 
        message: 'Connected to Kids Messenger WebSocket server',
        timestamp: Date.now(),
      },
    });

    ws.on('message', async (data: Buffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        await handleMessage(ws, message);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        sendToClient(ws, {
          type: 'error',
          payload: { 
            message: 'Invalid message format',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    });

    ws.on('close', () => {
      const userId = connectionUsers.get(ws);
      if (userId) {
        removeUserConnection(userId, ws);
        console.log(`User ${userId} disconnected`);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server initialized on path /ws');
  return wss;
};

/**
 * Handle incoming WebSocket messages
 */
async function handleMessage(ws: WebSocket, message: WebSocketMessage): Promise<void> {
  const { type, payload } = message;

  switch (type) {
    case 'auth':
      handleAuth(ws, payload as AuthPayload);
      break;

    case 'join_chat':
      await handleJoinChat(ws, payload as JoinChatPayload);
      break;

    case 'message':
      await handleChatMessage(ws, payload as ChatMessagePayload);
      break;

    case 'typing':
      handleTyping(ws, payload);
      break;

    case 'get_messages':
      handleGetMessages(ws, payload as GetMessagesPayload);
      break;

    case 'leave_chat':
      handleLeaveChat(ws, payload);
      break;

    default:
      sendToClient(ws, {
        type: 'error',
        payload: { message: `Unknown message type: ${type}` },
      });
  }
}

/**
 * Handle user authentication
 */
function handleAuth(ws: WebSocket, payload: AuthPayload): void {
  const { userId, token } = payload;

  // In a production app, you would validate the token here
  // For now, we'll accept any userId
  if (!userId) {
    sendToClient(ws, {
      type: 'auth_failed',
      payload: { message: 'User ID is required' },
    });
    return;
  }

  // Store user connection
  connectionUsers.set(ws, userId);
  addUserConnection(userId, ws);

  sendToClient(ws, {
    type: 'auth_success',
    payload: { 
      userId,
      timestamp: Date.now(),
    },
  });

  console.log(`User ${userId} authenticated`);
}

/**
 * Handle joining a chat room
 */
async function handleJoinChat(ws: WebSocket, payload: JoinChatPayload): Promise<void> {
  const { chatId, participants, participantNames } = payload;
  const userId = connectionUsers.get(ws);

  if (!userId) {
    sendToClient(ws, {
      type: 'error',
      payload: { message: 'Not authenticated' },
    });
    return;
  }

  // Verify user is a participant
  if (!participants.includes(userId)) {
    sendToClient(ws, {
      type: 'error',
      payload: { message: 'Not authorized to join this chat' },
    });
    return;
  }

  // Create or get chat
  upsertChat(chatId, {
    participants,
    participantNames,
  });

  sendToClient(ws, {
    type: 'chat_joined',
    payload: { 
      chatId,
      timestamp: Date.now(),
    },
  });

  // Notify other participants
  broadcastToChatParticipants(chatId, userId, {
    type: 'user_joined',
    payload: {
      chatId,
      userId,
      timestamp: Date.now(),
    },
  });
}

/**
 * Handle chat messages with AI filtering
 */
async function handleChatMessage(ws: WebSocket, payload: ChatMessagePayload): Promise<void> {
  const userId = connectionUsers.get(ws);

  if (!userId) {
    sendToClient(ws, {
      type: 'error',
      payload: { message: 'Not authenticated' },
    });
    return;
  }

  const { chatId, text, senderId, senderName, imageUri } = payload;

  // Verify sender matches authenticated user
  if (senderId !== userId) {
    sendToClient(ws, {
      type: 'error',
      payload: { message: 'Sender ID mismatch' },
    });
    return;
  }

  // Generate message ID using crypto for better uniqueness
  const messageId = `msg_${Date.now()}_${crypto.randomUUID().split('-')[0]}`;

  // Store message (unanalyzed initially)
  const message = storeMessage(messageId, {
    chatId,
    text,
    senderId,
    senderName,
    imageUri,
  });

  // Analyze content with AI filter
  const analysis = await analyzeTextContent(text);
  
  // Update message with analysis
  const analyzedMessage = updateMessageAnalysis(messageId, analysis.riskLevel, analysis.reasons);

  // Check if message should be blocked
  if (shouldBlockMessage(analysis.riskLevel)) {
    sendToClient(ws, {
      type: 'message_blocked',
      payload: {
        messageId,
        riskLevel: analysis.riskLevel,
        reasons: analysis.reasons,
        timestamp: Date.now(),
      },
    });
    return;
  }

  // Broadcast message to all chat participants
  broadcastToChat(chatId, {
    type: 'new_message',
    payload: analyzedMessage,
  });

  // Send analysis feedback to sender if there are concerns
  if (analysis.riskLevel !== 'safe') {
    sendToClient(ws, {
      type: 'message_warning',
      payload: {
        messageId,
        riskLevel: analysis.riskLevel,
        reasons: analysis.reasons,
      },
    });
  }
}

/**
 * Handle typing indicator
 */
function handleTyping(ws: WebSocket, payload: any): void {
  const userId = connectionUsers.get(ws);
  if (!userId) return;

  const { chatId, isTyping } = payload;

  broadcastToChatParticipants(chatId, userId, {
    type: 'typing',
    payload: {
      chatId,
      userId,
      isTyping,
      timestamp: Date.now(),
    },
  });
}

/**
 * Handle get messages request
 */
function handleGetMessages(ws: WebSocket, payload: GetMessagesPayload): void {
  const { chatId, limit } = payload;
  const messages = getChatMessages(chatId, limit);

  sendToClient(ws, {
    type: 'messages_history',
    payload: {
      chatId,
      messages,
      timestamp: Date.now(),
    },
  });
}

/**
 * Handle leaving a chat
 */
function handleLeaveChat(ws: WebSocket, payload: any): void {
  const userId = connectionUsers.get(ws);
  if (!userId) return;

  const { chatId } = payload;

  broadcastToChatParticipants(chatId, userId, {
    type: 'user_left',
    payload: {
      chatId,
      userId,
      timestamp: Date.now(),
    },
  });
}

/**
 * Send message to a specific client
 */
function sendToClient(ws: WebSocket, message: any): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Broadcast message to all users in a chat
 */
function broadcastToChat(chatId: string, message: any): void {
  // Get all participants from the chat
  const chat = getChat(chatId);
  if (!chat) return;

  for (const participantId of chat.participants) {
    const connections = userConnections.get(participantId);
    if (connections) {
      connections.forEach((ws) => sendToClient(ws, message));
    }
  }
}

/**
 * Broadcast to chat participants except sender
 */
function broadcastToChatParticipants(chatId: string, excludeUserId: string, message: any): void {
  const chat = getChat(chatId);
  if (!chat) return;

  for (const participantId of chat.participants) {
    if (participantId === excludeUserId) continue;

    const connections = userConnections.get(participantId);
    if (connections) {
      connections.forEach((ws) => sendToClient(ws, message));
    }
  }
}

/**
 * Add user connection
 */
function addUserConnection(userId: string, ws: WebSocket): void {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId)!.add(ws);
}

/**
 * Remove user connection
 */
function removeUserConnection(userId: string, ws: WebSocket): void {
  const connections = userConnections.get(userId);
  if (connections) {
    connections.delete(ws);
    if (connections.size === 0) {
      userConnections.delete(userId);
    }
  }
}

/**
 * Get active user count
 */
export const getActiveUserCount = (): number => {
  return userConnections.size;
};

/**
 * Get all active user IDs
 */
export const getActiveUserIds = (): string[] => {
  return Array.from(userConnections.keys());
};
