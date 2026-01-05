/**
 * Messaging Module Types
 * Defines core types for the messaging system
 */

import { z } from 'zod';

// Message status enum
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

// Message priority levels
export type MessagePriority = 'low' | 'normal' | 'high';

// Moderation status
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

// WebSocket event types
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connection:connect',
  DISCONNECT: 'connection:disconnect',
  AUTHENTICATE: 'connection:authenticate',
  
  // Message events
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  
  // Typing indicators
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  
  // Read receipts
  MESSAGE_READ: 'message:read',
  
  // Error events
  ERROR: 'error',
} as const;

// Zod schemas for validation
export const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  text: z.string().max(5000),
  timestamp: z.number(),
  status: z.enum(['pending', 'sent', 'delivered', 'read', 'failed']),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  replyToId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
  moderationStatus: z.enum(['pending', 'approved', 'rejected', 'flagged']).default('pending'),
  moderationFlags: z.array(z.string()).optional(),
  encrypted: z.boolean().default(false),
});

export const SendMessageSchema = z.object({
  chatId: z.string(),
  text: z.string().min(1).max(5000),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  replyToId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const MessageFilterSchema = z.object({
  chatId: z.string(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  before: z.number().optional(),
  after: z.number().optional(),
});

export const TypingIndicatorSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  isTyping: z.boolean(),
});

export const ReadReceiptSchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
  userId: z.string(),
  readAt: z.number(),
});

// TypeScript types derived from schemas
export type Message = z.infer<typeof MessageSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type MessageFilter = z.infer<typeof MessageFilterSchema>;
export type TypingIndicator = z.infer<typeof TypingIndicatorSchema>;
export type ReadReceipt = z.infer<typeof ReadReceiptSchema>;

// WebSocket message format
export interface WSMessage<T = unknown> {
  event: string;
  data: T;
  timestamp: number;
}

// Connection session info
export interface ConnectionSession {
  userId: string;
  connectionId: string;
  connectedAt: number;
  lastActivity: number;
  metadata?: Record<string, unknown>;
}

// Rate limit configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Moderation result
export interface ModerationResult {
  isApproved: boolean;
  flags: string[];
  reasons: string[];
  confidence: number;
  categories: string[];
}
