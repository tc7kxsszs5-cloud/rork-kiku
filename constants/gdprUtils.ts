/**
 * GDPR/COPPA Compliance Utilities
 * 
 * This module provides functionality for data export, deletion, and consent management
 * to comply with GDPR, COPPA, and other data protection regulations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { User } from './UserContext';
import { ComplianceLog } from './types';

export interface DataExportPackage {
  exportDate: string;
  version: string;
  userData: User | null;
  parentalSettings: any;
  contacts: any[];
  timeRestrictions: any[];
  complianceLogs: ComplianceLog[];
  sosAlerts: any[];
  chats: any[];
  alerts: any[];
  notificationSettings: any;
}

/**
 * Export all user data in a portable format (GDPR Right to Data Portability)
 */
export const exportAllUserData = async (): Promise<DataExportPackage> => {
  try {
    console.log('Starting data export...');

    // Collect all data from AsyncStorage
    const [
      userData,
      parentalSettings,
      contacts,
      timeRestrictions,
      complianceLogs,
      sosAlerts,
      notificationSettings,
    ] = await Promise.all([
      AsyncStorage.getItem('@user_data'),
      AsyncStorage.getItem('@parental_settings'),
      AsyncStorage.getItem('@contacts'),
      AsyncStorage.getItem('@time_restrictions'),
      AsyncStorage.getItem('@compliance_log'),
      AsyncStorage.getItem('@sos_alerts'),
      AsyncStorage.getItem('@notification_settings'),
    ]);

    const dataPackage: DataExportPackage = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      userData: userData ? JSON.parse(userData) : null,
      parentalSettings: parentalSettings ? JSON.parse(parentalSettings) : null,
      contacts: contacts ? JSON.parse(contacts) : [],
      timeRestrictions: timeRestrictions ? JSON.parse(timeRestrictions) : [],
      complianceLogs: complianceLogs ? JSON.parse(complianceLogs) : [],
      sosAlerts: sosAlerts ? JSON.parse(sosAlerts) : [],
      chats: [], // Chats are not exported for privacy (only monitoring results)
      alerts: [],
      notificationSettings: notificationSettings ? JSON.parse(notificationSettings) : null,
    };

    console.log('Data export completed successfully');
    return dataPackage;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
};

/**
 * Save exported data to a file and share it (GDPR compliance)
 */
export const exportAndShareData = async (): Promise<void> => {
  try {
    const dataPackage = await exportAllUserData();
    const jsonString = JSON.stringify(dataPackage, null, 2);
    
    const fileName = `KIKU_data_export_${Date.now()}.json`;
    const file = new FileSystem.File(FileSystem.Paths.cache, fileName);

    // Write to file
    await file.write(jsonString);

    console.log('Data exported to file:', file.uri);

    // Share the file if available on platform
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Your KIKU Data',
        UTI: 'public.json',
      });
    } else {
      console.warn('Sharing not available on this platform');
    }
  } catch (error) {
    console.error('Error exporting and sharing data:', error);
    throw new Error('Failed to export and share data');
  }
};

/**
 * Delete all user data (GDPR Right to Erasure / Right to be Forgotten)
 * 
 * @param userId - User ID to verify deletion
 * @param keepComplianceLogs - Whether to keep compliance logs for legal requirements (recommended: true)
 */
export const deleteAllUserData = async (
  userId: string,
  keepComplianceLogs = true
): Promise<void> => {
  try {
    console.log('Starting complete data deletion for user:', userId);

    // Log the deletion action before deleting data
    if (keepComplianceLogs) {
      const deletionLog: ComplianceLog = {
        id: `log_${Date.now()}_deletion`,
        action: 'DATA_DELETION',
        userId,
        timestamp: Date.now(),
        details: {
          type: 'complete_deletion',
          reason: 'user_request',
          keepComplianceLogs,
        },
        parentalConsent: true,
      };

      const existingLogs = await AsyncStorage.getItem('@compliance_log');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.unshift(deletionLog);
      
      await AsyncStorage.setItem('@compliance_log', JSON.stringify(logs));
    }

    // List of all keys to delete
    const keysToDelete = [
      '@user_data',
      '@parental_settings',
      '@contacts',
      '@time_restrictions',
      '@sos_alerts',
      '@notification_settings',
      '@notification_devices',
      '@device_test_results',
      '@theme_mode',
      // Add any other storage keys your app uses
    ];

    // Conditionally delete compliance logs
    if (!keepComplianceLogs) {
      keysToDelete.push('@compliance_log');
    }

    // Delete from AsyncStorage
    await AsyncStorage.multiRemove(keysToDelete);

    // Delete secure data (PIN)
    if (Platform.OS !== 'web') {
      try {
        await SecureStore.deleteItemAsync(`pin_${userId}`);
      } catch (error) {
        console.warn('No secure PIN found or error deleting:', error);
      }
    }

    console.log('User data deletion completed successfully');
    console.log('Compliance logs kept:', keepComplianceLogs);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw new Error('Failed to delete user data');
  }
};

/**
 * Get data retention summary (for transparency)
 */
export const getDataRetentionSummary = async (): Promise<{
  categories: Array<{
    name: string;
    description: string;
    retentionPeriod: string;
    dataSize?: string;
  }>;
}> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    
    const categories = [
      {
        name: 'User Profile',
        description: 'Name, email, role, age, preferences',
        retentionPeriod: 'Until account deletion',
        dataSize: keys.includes('@user_data') ? 'Stored' : 'Empty',
      },
      {
        name: 'Parental Settings',
        description: 'Control settings, restrictions, permissions',
        retentionPeriod: 'Until account deletion',
        dataSize: keys.includes('@parental_settings') ? 'Stored' : 'Empty',
      },
      {
        name: 'Contacts',
        description: 'Whitelisted contacts',
        retentionPeriod: 'Until removed or account deletion',
        dataSize: keys.includes('@contacts') ? 'Stored' : 'Empty',
      },
      {
        name: 'SOS Alerts',
        description: 'Emergency alerts with location',
        retentionPeriod: '1 year for safety review',
        dataSize: keys.includes('@sos_alerts') ? 'Stored' : 'Empty',
      },
      {
        name: 'Compliance Logs',
        description: 'Consent and action audit trail',
        retentionPeriod: '3 years (legal requirement)',
        dataSize: keys.includes('@compliance_log') ? 'Stored' : 'Empty',
      },
      {
        name: 'Chat Analysis',
        description: 'Risk assessments and alerts',
        retentionPeriod: '90 days automatic cleanup',
        dataSize: 'Stored locally, not persisted',
      },
    ];

    return { categories };
  } catch (error) {
    console.error('Error getting data retention summary:', error);
    throw new Error('Failed to get data retention summary');
  }
};

/**
 * Record parental consent (COPPA compliance)
 */
export const recordParentalConsent = async (
  userId: string,
  consentType: 'data_collection' | 'monitoring' | 'location_sharing' | 'data_processing',
  granted: boolean,
  details?: Record<string, any>
): Promise<void> => {
  try {
    const consentLog: ComplianceLog = {
      id: `consent_${Date.now()}_${Math.random()}`,
      action: `CONSENT_${consentType.toUpperCase()}`,
      userId,
      timestamp: Date.now(),
      details: {
        consentType,
        granted,
        ...details,
      },
      parentalConsent: granted,
    };

    const existingLogs = await AsyncStorage.getItem('@compliance_log');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.unshift(consentLog);
    
    // Keep only last 1000 logs
    const trimmedLogs = logs.slice(0, 1000);
    
    await AsyncStorage.setItem('@compliance_log', JSON.stringify(trimmedLogs));
    console.log('Parental consent recorded:', consentType, granted);
  } catch (error) {
    console.error('Error recording parental consent:', error);
    throw new Error('Failed to record consent');
  }
};

/**
 * Get all consent records for a user (for transparency)
 */
export const getUserConsents = async (userId: string): Promise<ComplianceLog[]> => {
  try {
    const existingLogs = await AsyncStorage.getItem('@compliance_log');
    if (!existingLogs) return [];

    const logs: ComplianceLog[] = JSON.parse(existingLogs);
    return logs.filter(
      (log) => log.userId === userId && log.action.startsWith('CONSENT_')
    );
  } catch (error) {
    console.error('Error getting user consents:', error);
    return [];
  }
};

/**
 * Check if required consents are granted (COPPA verification)
 */
export const hasRequiredConsents = async (userId: string): Promise<{
  hasAllRequired: boolean;
  missing: string[];
}> => {
  try {
    const consents = await getUserConsents(userId);
    const requiredConsents = ['data_collection', 'monitoring'];
    
    const grantedTypes = new Set(
      consents
        .filter((c) => c.parentalConsent)
        .map((c) => c.details.consentType)
    );

    const missing = requiredConsents.filter((type) => !grantedTypes.has(type));

    return {
      hasAllRequired: missing.length === 0,
      missing,
    };
  } catch (error) {
    console.error('Error checking required consents:', error);
    return { hasAllRequired: false, missing: [] };
  }
};

/**
 * Anonymize old data (data minimization principle)
 * This can be called periodically to comply with GDPR data minimization
 */
export const anonymizeOldData = async (olderThanDays: number = 90): Promise<void> => {
  try {
    console.log(`Anonymizing data older than ${olderThanDays} days...`);
    
    const cutoffDate = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    // Anonymize old SOS alerts
    const sosAlerts = await AsyncStorage.getItem('@sos_alerts');
    if (sosAlerts) {
      const alerts = JSON.parse(sosAlerts);
      const anonymized = alerts.map((alert: any) => {
        if (alert.timestamp < cutoffDate) {
          return {
            ...alert,
            userId: 'anonymized',
            userName: 'anonymized',
            location: undefined,
            message: undefined,
          };
        }
        return alert;
      });
      await AsyncStorage.setItem('@sos_alerts', JSON.stringify(anonymized));
    }

    console.log('Old data anonymization completed');
  } catch (error) {
    console.error('Error anonymizing old data:', error);
    throw new Error('Failed to anonymize old data');
  }
};
