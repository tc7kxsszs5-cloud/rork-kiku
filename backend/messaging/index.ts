/**
 * Messaging Module
 * Main entry point for the messaging system
 */

// Core service
export { messagingService } from './service';

// Storage
export { messageStorage } from './storage';

// Moderation
export { contentModeration, ToxicityCategory, SeverityLevel } from './moderation';

// WebSocket management
export { wsManager } from './websocket-manager';
export { 
  authenticateWebSocket,
  handleWebSocketUpgrade,
  createWebSocketHandler,
  initWebSocketConnection,
} from './websocket-handler';

// Encryption utilities
export { MessageEncryption, sanitizeInput, validateMessage } from './encryption';

// Types and schemas
export {
  WS_EVENTS,
  MessageSchema,
  SendMessageSchema,
  MessageFilterSchema,
  TypingIndicatorSchema,
  ReadReceiptSchema,
} from './types';

export type {
  Message,
  SendMessageInput,
  MessageFilter,
  TypingIndicator,
  ReadReceipt,
  MessageStatus,
  MessagePriority,
  ModerationStatus,
  WSMessage,
  ConnectionSession,
  RateLimitConfig,
  ModerationResult,
} from './types';
