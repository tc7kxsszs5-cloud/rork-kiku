/**
 * Age-appropriate content customization system
 * Implements developmentally appropriate features and content filtering
 */

export type AgeGroup = 'toddler' | 'child' | 'preteen' | 'teen';

export interface AgeGroupConfig {
  minAge: number;
  maxAge: number;
  label: string;
  description: string;
  features: {
    messaging: boolean;
    voiceMessages: boolean;
    imageSharing: boolean;
    videoSharing: boolean;
    groupChats: boolean;
    socialFeatures: boolean;
    locationSharing: boolean;
    webBrowser: boolean;
  };
  contentRestrictions: {
    maxDailyScreenTime: number; // minutes
    allowedContactsOnly: boolean;
    parentApprovalRequired: boolean;
    contentFilterLevel: 'strict' | 'moderate' | 'relaxed';
    blockedWords: string[];
    aiModerationLevel: 'high' | 'medium' | 'low';
  };
  uiCustomization: {
    colorScheme: 'playful' | 'vibrant' | 'mature' | 'standard';
    fontSize: 'large' | 'medium' | 'standard';
    simplifiedInterface: boolean;
    educationalPrompts: boolean;
  };
}

/**
 * Age group configurations
 */
export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  toddler: {
    minAge: 3,
    maxAge: 7,
    label: 'Toddler (3-7 years)',
    description: 'Highly restricted mode with parental supervision',
    features: {
      messaging: true,
      voiceMessages: true,
      imageSharing: false,
      videoSharing: false,
      groupChats: false,
      socialFeatures: false,
      locationSharing: true, // For safety
      webBrowser: false,
    },
    contentRestrictions: {
      maxDailyScreenTime: 30,
      allowedContactsOnly: true,
      parentApprovalRequired: true,
      contentFilterLevel: 'strict',
      blockedWords: [],
      aiModerationLevel: 'high',
    },
    uiCustomization: {
      colorScheme: 'playful',
      fontSize: 'large',
      simplifiedInterface: true,
      educationalPrompts: true,
    },
  },
  child: {
    minAge: 8,
    maxAge: 11,
    label: 'Child (8-11 years)',
    description: 'Restricted mode with strong safety features',
    features: {
      messaging: true,
      voiceMessages: true,
      imageSharing: true,
      videoSharing: false,
      groupChats: true,
      socialFeatures: false,
      locationSharing: true,
      webBrowser: false,
    },
    contentRestrictions: {
      maxDailyScreenTime: 60,
      allowedContactsOnly: true,
      parentApprovalRequired: true,
      contentFilterLevel: 'strict',
      blockedWords: [],
      aiModerationLevel: 'high',
    },
    uiCustomization: {
      colorScheme: 'vibrant',
      fontSize: 'medium',
      simplifiedInterface: true,
      educationalPrompts: true,
    },
  },
  preteen: {
    minAge: 12,
    maxAge: 14,
    label: 'Preteen (12-14 years)',
    description: 'Moderate restrictions with active monitoring',
    features: {
      messaging: true,
      voiceMessages: true,
      imageSharing: true,
      videoSharing: true,
      groupChats: true,
      socialFeatures: true,
      locationSharing: true,
      webBrowser: false,
    },
    contentRestrictions: {
      maxDailyScreenTime: 120,
      allowedContactsOnly: false,
      parentApprovalRequired: true,
      contentFilterLevel: 'moderate',
      blockedWords: [],
      aiModerationLevel: 'medium',
    },
    uiCustomization: {
      colorScheme: 'vibrant',
      fontSize: 'medium',
      simplifiedInterface: false,
      educationalPrompts: true,
    },
  },
  teen: {
    minAge: 15,
    maxAge: 17,
    label: 'Teen (15-17 years)',
    description: 'Balanced safety with age-appropriate freedom',
    features: {
      messaging: true,
      voiceMessages: true,
      imageSharing: true,
      videoSharing: true,
      groupChats: true,
      socialFeatures: true,
      locationSharing: true,
      webBrowser: true,
    },
    contentRestrictions: {
      maxDailyScreenTime: 180,
      allowedContactsOnly: false,
      parentApprovalRequired: false,
      contentFilterLevel: 'relaxed',
      blockedWords: [],
      aiModerationLevel: 'medium',
    },
    uiCustomization: {
      colorScheme: 'mature',
      fontSize: 'standard',
      simplifiedInterface: false,
      educationalPrompts: false,
    },
  },
};

/**
 * Determine age group from age
 */
export const getAgeGroup = (age: number): AgeGroup => {
  if (age >= 3 && age <= 7) return 'toddler';
  if (age >= 8 && age <= 11) return 'child';
  if (age >= 12 && age <= 14) return 'preteen';
  if (age >= 15 && age <= 17) return 'teen';
  
  // Default to most restrictive for safety
  return 'toddler';
};

/**
 * Get configuration for specific age
 */
export const getAgeGroupConfig = (age: number): AgeGroupConfig => {
  const ageGroup = getAgeGroup(age);
  return AGE_GROUP_CONFIGS[ageGroup];
};

/**
 * Check if feature is allowed for age
 */
export const isFeatureAllowed = (age: number, feature: keyof AgeGroupConfig['features']): boolean => {
  const config = getAgeGroupConfig(age);
  return config.features[feature];
};

/**
 * Get content filter level for age
 */
export const getContentFilterLevel = (age: number): 'strict' | 'moderate' | 'relaxed' => {
  const config = getAgeGroupConfig(age);
  return config.contentRestrictions.contentFilterLevel;
};

/**
 * Get AI moderation level for age
 */
export const getAIModerationLevel = (age: number): 'high' | 'medium' | 'low' => {
  const config = getAgeGroupConfig(age);
  return config.contentRestrictions.aiModerationLevel;
};

/**
 * Get max daily screen time for age (in minutes)
 */
export const getMaxDailyScreenTime = (age: number): number => {
  const config = getAgeGroupConfig(age);
  return config.contentRestrictions.maxDailyScreenTime;
};

/**
 * Check if content approval is required
 */
export const requiresParentApproval = (age: number): boolean => {
  const config = getAgeGroupConfig(age);
  return config.contentRestrictions.parentApprovalRequired;
};

/**
 * Get UI customization settings
 */
export const getUICustomization = (age: number) => {
  const config = getAgeGroupConfig(age);
  return config.uiCustomization;
};

/**
 * Educational content recommendations by age
 */
export const getEducationalContent = (ageGroup: AgeGroup) => {
  const content = {
    toddler: [
      'Simple shapes and colors recognition',
      'Basic counting and alphabet',
      'Friendly social interactions',
      'Sharing and kindness',
    ],
    child: [
      'Online safety basics',
      'Recognizing unsafe situations',
      'Talking to trusted adults',
      'Cyberbullying awareness',
    ],
    preteen: [
      'Digital citizenship',
      'Privacy and personal information',
      'Healthy online relationships',
      'Managing screen time',
    ],
    teen: [
      'Advanced online safety',
      'Digital footprint awareness',
      'Critical thinking online',
      'Reporting mechanisms',
    ],
  };

  return content[ageGroup] || [];
};

/**
 * Safety tips by age group
 */
export const getSafetyTips = (ageGroup: AgeGroup): string[] => {
  const tips = {
    toddler: [
      'Only talk to people mommy and daddy approve',
      'Tell a grown-up if something feels wrong',
      'Keep your real name private',
      'Be kind to everyone',
    ],
    child: [
      'Never share your password with anyone except parents',
      'Don\'t share photos with strangers',
      'Tell an adult if someone makes you uncomfortable',
      'Think before you post or send',
    ],
    preteen: [
      'Protect your personal information online',
      'Be aware of online strangers and fake profiles',
      'Report cyberbullying immediately',
      'Verify information before believing it',
    ],
    teen: [
      'Maintain a positive digital reputation',
      'Be critical of online content and sources',
      'Understand the permanence of online actions',
      'Balance online and offline activities',
    ],
  };

  return tips[ageGroup] || [];
};

/**
 * Color schemes for different age groups
 */
export const getColorScheme = (ageGroup: AgeGroup) => {
  const schemes = {
    toddler: {
      primary: '#FFB84D',
      secondary: '#FF6B9D',
      background: '#FFF9E6',
      accent: '#A0E8B7',
      text: '#2D3748',
    },
    child: {
      primary: '#4FACFE',
      secondary: '#00F2FE',
      background: '#F0F9FF',
      accent: '#FDA085',
      text: '#1A202C',
    },
    preteen: {
      primary: '#667EEA',
      secondary: '#764BA2',
      background: '#F7FAFC',
      accent: '#FC6C85',
      text: '#2D3748',
    },
    teen: {
      primary: '#2563EB',
      secondary: '#0F172A',
      background: '#FFFFFF',
      accent: '#FACC15',
      text: '#0F172A',
    },
  };

  return schemes[ageGroup];
};
