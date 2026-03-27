/**
 * Strict validation schemas using Zod
 * Provides comprehensive input validation for security
 */

import { z } from "zod";
import { sanitizeDeviceId, sanitizeEmail, sanitizePhone, validateTimestamp, validateArrayLength } from "./security.js";

/**
 * Device ID schema - strict validation
 */
export const deviceIdSchema = z.string()
  .min(1, "Device ID cannot be empty")
  .max(100, "Device ID too long")
  .refine(
    (val) => /^[a-zA-Z0-9._-]+$/.test(val),
    "Device ID contains invalid characters"
  )
  .transform((val) => sanitizeDeviceId(val));

/**
 * Timestamp schema
 */
export const timestampSchema = z.number()
  .int("Timestamp must be an integer")
  .positive("Timestamp must be positive")
  .transform((val) => validateTimestamp(val));

/**
 * Email schema
 */
export const emailSchema = z.string()
  .email("Invalid email format")
  .max(254, "Email too long")
  .transform((val) => sanitizeEmail(val));

/**
 * Phone schema
 */
export const phoneSchema = z.string()
  .regex(/^\+[1-9]\d{10,15}$/, "Invalid phone format")
  .transform((val) => sanitizePhone(val));

/**
 * Chat schema - strict validation
 */
export const chatSchema = z.object({
  id: z.string().min(1).max(100),
  contactName: z.string().min(1).max(200).optional(),
  contactPhone: phoneSchema.optional(),
  lastMessage: z.string().max(1000).optional(),
  lastMessageTimestamp: timestampSchema.optional(),
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'critical']).optional(),
  unreadCount: z.number().int().min(0).max(10000).optional(),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
  // Новый формат чатов (клиент)
  participants: z.array(z.string().min(1).max(100)).max(100).optional(),
  participantNames: z.array(z.string().min(1).max(200)).max(100).optional(),
  overallRisk: z.enum(['safe', 'low', 'medium', 'high', 'critical']).optional(),
  lastActivity: timestampSchema.optional(),
  isGroup: z.boolean().optional(),
  groupName: z.string().min(1).max(200).optional(),
  groupType: z.enum(['class', 'group', 'club']).optional(),
  groupDescription: z.string().max(1000).optional(),
  adminIds: z.array(z.string().min(1).max(100)).max(100).optional(),
  messages: z.array(z.lazy(() => messageSchema)).max(5000).optional(),
  contactChildId: z.string().min(1).max(100).optional(),
}).strict().superRefine((value, ctx) => {
  const hasContactName = typeof value.contactName === 'string' && value.contactName.length > 0;
  const hasParticipantNames = Array.isArray(value.participantNames) && value.participantNames.length > 0;
  if (!hasContactName && !hasParticipantNames) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either contactName or participantNames is required',
      path: ['contactName'],
    });
  }
});

/**
 * Message schema - strict validation
 */
export const messageSchema = z.object({
  id: z.string().min(1).max(100),
  sender: z.string().min(1).max(200).optional(),
  senderId: z.string().min(1).max(100).optional(),
  senderName: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(), // Max 10KB per message
  text: z.string().min(1).max(10000).optional(),
  timestamp: timestampSchema,
  messageType: z.enum(['text', 'image', 'voice', 'video']).default('text'),
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'critical']).optional(),
  aiAnalysis: z.any().optional(),
}).strict().superRefine((value, ctx) => {
  const hasSender = !!value.sender || !!value.senderId || !!value.senderName;
  const hasContent = !!value.content || !!value.text;
  if (!hasSender) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Sender is required',
      path: ['sender'],
    });
  }
  if (!hasContent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Content is required',
      path: ['content'],
    });
  }
});

/**
 * Alert schema - strict validation
 */
export const alertSchema = z.object({
  id: z.string().min(1).max(100),
  chatId: z.string().min(1).max(100).optional(),
  messageId: z.string().min(1).max(100).optional(),
  alertType: z.string().min(1).max(100),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'resolved', 'dismissed']).default('active'),
  createdAt: timestampSchema,
  resolvedAt: timestampSchema.optional(),
  metadata: z.any().optional(),
}).strict();

/**
 * Settings schema - strict validation
 */
export const settingsSchema = z.object({
  timeRestrictionsEnabled: z.boolean(),
  dailyUsageLimit: z.number().int().min(0).max(1440), // Max 24 hours in minutes
  requireApprovalForNewContacts: z.boolean(),
  blockUnknownContacts: z.boolean(),
  imageFilteringEnabled: z.boolean(),
  locationSharingEnabled: z.boolean(),
  sosNotificationsEnabled: z.boolean(),
  guardianEmails: z.array(emailSchema).max(10), // Max 10 emails
  guardianPhones: z.array(phoneSchema).max(10), // Max 10 phones
  communicationMode: z.enum(['open', 'groups', 'invites']).optional(),
  updatedAt: timestampSchema.optional(),
}).strict();

/**
 * Sync input schema for chats
 */
export const syncChatsInputSchema = z.object({
  deviceId: deviceIdSchema,
  chats: z.array(chatSchema).max(1000), // Max 1000 chats per sync
  lastSyncTimestamp: timestampSchema.optional(),
}).strict();

/**
 * Get chats input schema
 */
export const getChatsInputSchema = z.object({
  deviceId: deviceIdSchema,
  lastSyncTimestamp: timestampSchema.optional(),
}).strict();

/**
 * Sync alerts input schema
 */
export const syncAlertsInputSchema = z.object({
  deviceId: deviceIdSchema,
  alerts: z.array(alertSchema).max(1000), // Max 1000 alerts per sync
  lastSyncTimestamp: timestampSchema.optional(),
}).strict();

/**
 * Get alerts input schema
 */
export const getAlertsInputSchema = z.object({
  deviceId: deviceIdSchema,
  lastSyncTimestamp: timestampSchema.optional(),
}).strict();

/**
 * Sync settings input schema
 */
export const syncSettingsInputSchema = z.object({
  deviceId: deviceIdSchema,
  settings: settingsSchema.optional(),
  lastSyncTimestamp: timestampSchema.optional(),
}).strict();

/**
 * Get settings input schema
 */
export const getSettingsInputSchema = z.object({
  deviceId: deviceIdSchema,
}).strict();
