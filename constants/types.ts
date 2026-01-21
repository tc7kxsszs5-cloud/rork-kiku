export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

// User Roles and Authentication
export type UserRole = 'parent' | 'child';
export type Gender = 'male' | 'female' | 'other';
export type ParentGender = Gender; // Alias for compatibility

export interface ParentAccount {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  passwordHash?: string; // Хеш пароля для аутентификации
  pinCode?: string; // PIN-код для быстрого доступа
  createdAt: number;
  deviceId?: string;
  language?: string;
  children: ChildAccount[];
  activeChildId?: string;
  country?: string; // Для локализации и пола по умолчанию
}

export interface ChildAccount {
  id: string;
  parentId: string; // Связь с родителем
  name: string;
  age?: number;
  gender?: Gender; // Может зависеть от страны родителя
  avatar?: string;
  deviceId?: string;
  createdAt: number;
  permissions: ChildPermissions;
  customSettings?: {
    favoriteBackgrounds?: string[]; // ID любимых фонов
    notificationSounds?: string[]; // Любимые звуки уведомлений
  };
}

export interface ChildPermissions {
  canChangeBackgrounds: boolean; // Разрешено менять фоны чатов
  canChangeSounds: boolean; // Разрешено менять звуки уведомлений
  canAddContacts: boolean; // Разрешено добавлять контакты (с разрешения родителя)
  canSendMessages: boolean; // Разрешено отправлять сообщения
  canReceiveMessages: boolean; // Разрешено получать сообщения
  // Всегда включено для безопасности:
  // - родитель видит все сообщения
  // - контент-фильтрация всегда активна
  // - мониторинг всегда активен
}

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
  backgroundId?: string; // ID выбранного фона чата
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

export type NotificationTestStatus = 'passed' | 'failed';

export type NotificationTestType = 'permissions' | 'token' | 'delivery' | 'sync';

export interface NotificationTestResult {
  id: string;
  type: NotificationTestType;
  status: NotificationTestStatus;
  message: string;
  timestamp: number;
  deviceLabel?: string;
}

export interface NotificationDeviceRecord {
  deviceId: string;
  pushToken: string;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  userId?: string;
  permissions?: string;
  lastSyncedAt: number;
  lastTestedAt?: number;
  testResults: NotificationTestResult[];
}

// Achievements System
export type AchievementCategory = 'safety' | 'communication' | 'responsibility' | 'streak' | 'special';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon name
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  requirement: {
    type: 'messages_sent' | 'safe_days' | 'streak_days' | 'alerts_resolved' | 'no_risks' | 'group_chats' | 'special';
    target: number;
    condition?: string;
  };
  unlockedAt?: number;
  progress?: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: number;
  progress: number;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedCount: number;
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  categoryBreakdown: Record<AchievementCategory, { unlocked: number; total: number }>;
}

// Interactive Lessons System
export type LessonCategory = 'safety' | 'privacy' | 'communication' | 'behavior' | 'emergency';

export type LessonStepType = 'text' | 'image' | 'scenario' | 'interactive' | 'quiz';

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title?: string;
  content: string;
  imageUri?: string;
  options?: {
    id: string;
    text: string;
    isCorrect?: boolean;
    feedback?: string;
  }[];
  correctAnswerId?: string;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: LessonCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  steps: LessonStep[];
  quiz?: QuizQuestion[];
  prerequisites?: string[]; // lesson IDs
  unlockedAt?: number;
  completedAt?: number;
  progress?: number; // 0-100
}

export interface UserLessonProgress {
  lessonId: string;
  currentStep: number;
  completedSteps: number[];
  quizScore?: number;
  completedAt?: number;
  startedAt?: number;
}

export interface LessonStats {
  totalLessons: number;
  completedCount: number;
  inProgressCount: number;
  totalTimeSpent: number; // minutes
  averageScore: number;
  categoryProgress: Record<LessonCategory, { completed: number; total: number }>;
}

// Chat Backgrounds System
export type BackgroundType = 'solid' | 'gradient' | 'pattern';

export interface ChatBackground {
  id: string;
  name: string;
  type: BackgroundType;
  preview: string; // emoji или цвет для превью
  // Для solid цвета
  color?: string;
  // Для градиентов
  gradient?: string[]; // массив цветов для LinearGradient
  gradientDirection?: { start: { x: number; y: number }; end: { x: number; y: number } };
  // Для паттернов (будущее расширение)
  pattern?: string;
  isDefault?: boolean;
  isCustom?: boolean; // пользовательский фон
}
