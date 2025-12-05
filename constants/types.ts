export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  riskLevel?: RiskLevel;
  riskReasons?: string[];
  analyzed: boolean;
  imageUri?: string;
  imageAnalyzed?: boolean;
  imageBlocked?: boolean;
  imageRiskReasons?: string[];
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  messages: Message[];
  overallRisk: RiskLevel;
  lastActivity: number;
  isGroup?: boolean;
  groupName?: string;
  groupType?: 'class' | 'group' | 'club';
  groupDescription?: string;
  adminIds?: string[];
}

export interface RiskAnalysis {
  riskLevel: RiskLevel;
  reasons: string[];
  confidence: number;
  categories: string[];
}

export interface Alert {
  id: string;
  chatId: string;
  messageId: string;
  riskLevel: RiskLevel;
  timestamp: number;
  reasons: string[];
  resolved: boolean;
  type?: 'auto' | 'sos';
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  chatId?: string;
  timestamp: number;
  location?: { lat: number; lng: number };
  message?: string;
  resolved: boolean;
  respondedBy?: string;
  respondedAt?: number;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isWhitelisted: boolean;
  addedBy: string;
  addedAt: number;
}

export interface TimeRestriction {
  id: string;
  userId: string;
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  enabled: boolean;
}

export interface UsageStats {
  date: string;
  messagesCount: number;
  screenTime: number;
  riskyInteractions: number;
}

export interface ParentalSettings {
  timeRestrictionsEnabled: boolean;
  dailyUsageLimit: number;
  requireApprovalForNewContacts: boolean;
  blockUnknownContacts: boolean;
  imageFilteringEnabled: boolean;
  locationSharingEnabled: boolean;
  sosNotificationsEnabled: boolean;
  guardianEmails: string[];
  guardianPhones: string[];
}

export interface ComplianceLog {
  id: string;
  action: string;
  userId: string;
  timestamp: number;
  details: Record<string, any>;
  parentalConsent?: boolean;
}
