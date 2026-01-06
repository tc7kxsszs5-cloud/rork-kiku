import { Message, Chat, RiskLevel } from '../../constants/types';

// WARNING: In-memory storage for development/testing only
// All data will be lost when the server restarts
// For production, replace with persistent database storage (PostgreSQL, MongoDB, etc.)
// See docs/ARCHITECTURE.md for database integration guidance
const chats = new Map<string, Chat>();
const messages = new Map<string, Message>();

export interface CreateMessagePayload {
  chatId: string;
  text: string;
  senderId: string;
  senderName: string;
  imageUri?: string;
}

export interface CreateChatPayload {
  participants: string[];
  participantNames: string[];
  isGroup?: boolean;
  groupName?: string;
  groupType?: 'class' | 'group' | 'club';
  groupDescription?: string;
  adminIds?: string[];
}

/**
 * Create or get an existing chat
 */
export const upsertChat = (chatId: string, payload: CreateChatPayload): Chat => {
  const existing = chats.get(chatId);
  
  if (existing) {
    return existing;
  }

  const chat: Chat = {
    id: chatId,
    participants: payload.participants,
    participantNames: payload.participantNames,
    messages: [],
    overallRisk: 'safe',
    lastActivity: Date.now(),
    isGroup: payload.isGroup,
    groupName: payload.groupName,
    groupType: payload.groupType,
    groupDescription: payload.groupDescription,
    adminIds: payload.adminIds,
  };

  chats.set(chatId, chat);
  return chat;
};

/**
 * Store a new message
 */
export const storeMessage = (messageId: string, payload: CreateMessagePayload): Message => {
  const message: Message = {
    id: messageId,
    text: payload.text,
    senderId: payload.senderId,
    senderName: payload.senderName,
    timestamp: Date.now(),
    analyzed: false,
    imageUri: payload.imageUri,
  };

  messages.set(messageId, message);

  // Add message to chat
  const chat = chats.get(payload.chatId);
  if (chat) {
    chat.messages.push(message);
    chat.lastActivity = message.timestamp;
    chats.set(payload.chatId, chat);
  }

  return message;
};

/**
 * Update message with AI analysis results
 */
export const updateMessageAnalysis = (
  messageId: string,
  riskLevel: RiskLevel,
  riskReasons: string[],
): Message | undefined => {
  const message = messages.get(messageId);
  if (!message) {
    return undefined;
  }

  const updated: Message = {
    ...message,
    analyzed: true,
    riskLevel,
    riskReasons,
  };

  messages.set(messageId, updated);

  // Update in chat messages array
  for (const chat of chats.values()) {
    const index = chat.messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      chat.messages[index] = updated;
      
      // Update overall chat risk level
      const highestRisk = getHighestRiskLevel(chat.messages);
      chat.overallRisk = highestRisk;
      chats.set(chat.id, chat);
      
      break;
    }
  }

  return updated;
};

/**
 * Get all messages for a chat
 */
export const getChatMessages = (chatId: string, limit?: number): Message[] => {
  const chat = chats.get(chatId);
  if (!chat) {
    return [];
  }

  const sortedMessages = [...chat.messages].sort((a, b) => a.timestamp - b.timestamp);
  
  if (limit) {
    return sortedMessages.slice(-limit);
  }
  
  return sortedMessages;
};

/**
 * Get a specific chat
 */
export const getChat = (chatId: string): Chat | undefined => {
  return chats.get(chatId);
};

/**
 * Get all chats for a user
 */
export const getUserChats = (userId: string): Chat[] => {
  return Array.from(chats.values())
    .filter((chat) => chat.participants.includes(userId))
    .sort((a, b) => b.lastActivity - a.lastActivity);
};

/**
 * Get a specific message
 */
export const getMessage = (messageId: string): Message | undefined => {
  return messages.get(messageId);
};

/**
 * Helper function to determine highest risk level in chat
 */
function getHighestRiskLevel(messages: Message[]): RiskLevel {
  const riskHierarchy: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
  
  let highestRisk: RiskLevel = 'safe';
  let highestIndex = 0;

  for (const message of messages) {
    if (message.riskLevel) {
      const index = riskHierarchy.indexOf(message.riskLevel);
      if (index > highestIndex) {
        highestIndex = index;
        highestRisk = message.riskLevel;
      }
    }
  }

  return highestRisk;
}

/**
 * Delete a message (soft delete - marks as deleted)
 */
export const deleteMessage = (messageId: string): boolean => {
  const message = messages.get(messageId);
  if (!message) {
    return false;
  }

  // Remove from chat
  for (const chat of chats.values()) {
    const index = chat.messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      chat.messages.splice(index, 1);
      chats.set(chat.id, chat);
      break;
    }
  }

  messages.delete(messageId);
  return true;
};
