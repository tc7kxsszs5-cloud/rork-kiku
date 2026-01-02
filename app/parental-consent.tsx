/**
 * Parental Consent Management Screen
 * 
 * COPPA/GDPR compliant consent management interface for parents
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, FileText, Download, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useUser } from '@/constants/UserContext';
import {
  recordParentalConsent,
  getUserConsents,
  hasRequiredConsents,
  exportAndShareData,
  deleteAllUserData,
  getDataRetentionSummary,
} from '@/constants/gdprUtils';
import { ComplianceLog } from '@/constants/types';

type ConsentType = 'data_collection' | 'monitoring' | 'location_sharing' | 'data_processing';

interface ConsentConfig {
  type: ConsentType;
  title: string;
  description: string;
  required: boolean;
}

const CONSENT_ITEMS: ConsentConfig[] = [
  {
    type: 'data_collection',
    title: 'Data Collection',
    description: 'Allow KIKU to collect and store profile information, settings, and preferences locally on this device.',
    required: true,
  },
  {
    type: 'monitoring',
    title: 'Message Monitoring',
    description: 'Allow AI-powered analysis of messages for safety threats, bullying, and inappropriate content.',
    required: true,
  },
  {
    type: 'location_sharing',
    title: 'Location Sharing (SOS)',
    description: 'Allow emergency SOS alerts to share location with designated guardians.',
    required: false,
  },
  {
    type: 'data_processing',
    title: 'Data Processing',
    description: 'Allow processing of collected data for safety analysis and recommendations.',
    required: false,
  },
];

export default function ParentalConsentScreen() {
  const router = useRouter();
  const { user, isParent } = useUser();
  
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    data_collection: false,
    monitoring: false,
    location_sharing: false,
    data_processing: false,
  });
  
  const [existingConsents, setExistingConsents] = useState<ComplianceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [retentionSummary, setRetentionSummary] = useState<any>(null);

  useEffect(() => {
    loadConsents();
    loadRetentionSummary();
  }, [user]);

  const loadConsents = async () => {
    if (!user) return;
    
    try {
      const userConsents = await getUserConsents(user.id);
      setExistingConsents(userConsents);
      
      // Set current consent states from most recent logs
      const currentConsents: Record<ConsentType, boolean> = {
        data_collection: false,
        monitoring: false,
        location_sharing: false,
        data_processing: false,
      };
      
      userConsents.forEach((log) => {
        const type = log.details.consentType as ConsentType;
        if (type && currentConsents.hasOwnProperty(type)) {
          currentConsents[type] = log.parentalConsent || false;
        }
      });
      
      setConsents(currentConsents);
    } catch (error) {
      console.error('Error loading consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRetentionSummary = async () => {
    try {
      const summary = await getDataRetentionSummary();
      setRetentionSummary(summary);
    } catch (error) {
      console.error('Error loading retention summary:', error);
    }
  };

  const handleConsentChange = async (type: ConsentType, value: boolean) => {
    if (!user || !isParent) {
      Alert.alert('Access Denied', 'Only parents can manage consents');
      return;
    }

    setConsents((prev) => ({ ...prev, [type]: value }));
    
    try {
      await recordParentalConsent(user.id, type, value);
      await loadConsents(); // Reload to show in history
    } catch (error) {
      console.error('Error saving consent:', error);
      Alert.alert('Error', 'Failed to save consent');
    }
  };

  const handleExportData = async () => {
    try {
      Alert.alert(
        'Export Data',
        'This will create a JSON file with all your data. You can share it via email or save it to your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: async () => {
              try {
                await exportAndShareData();
                Alert.alert('Success', 'Data exported successfully');
              } catch (error) {
                Alert.alert('Error', 'Failed to export data');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDeleteData = async () => {
    if (!user) return;

    Alert.alert(
      'Delete All Data',
      'This will permanently delete all user data except compliance logs (required by law). This action cannot be undone.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllUserData(user.id, true);
              Alert.alert(
                'Data Deleted',
                'All data has been deleted. The app will restart.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data');
            }
          },
        },
      ]
    );
  };

  const checkRequiredConsents = async () => {
    if (!user) return;
    
    const result = await hasRequiredConsents(user.id);
    
    if (result.hasAllRequired) {
      Alert.alert('✅ Compliant', 'All required consents have been granted.');
    } else {
      Alert.alert(
        'Missing Consents',
        `Please grant the following required consents:\n\n${result.missing.map((m) => `• ${m.replace('_', ' ')}`).join('\n')}`
      );
    }
  };

  if (!isParent) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Shield size={64} color="#f87171" />
          <Text style={styles.accessDeniedTitle}>Parent Access Only</Text>
          <Text style={styles.accessDeniedText}>
            Only parent accounts can manage consent settings and data.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading consents...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Shield size={48} color="#FFD700" />
        <Text style={styles.title}>Parental Consent & Privacy</Text>
        <Text style={styles.subtitle}>COPPA & GDPR Compliance</Text>
      </View>

      {/* Consent Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consent Management</Text>
        <Text style={styles.sectionDescription}>
          As a parent/guardian, you control what data can be collected and how it's used.
          Required consents are necessary for the app to function.
        </Text>

        {CONSENT_ITEMS.map((item) => (
          <View key={item.type} style={styles.consentItem}>
            <View style={styles.consentHeader}>
              <View style={styles.consentTitleRow}>
                <Text style={styles.consentTitle}>{item.title}</Text>
                {item.required && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                )}
              </View>
              <Switch
                value={consents[item.type]}
                onValueChange={(value) => handleConsentChange(item.type, value)}
                trackColor={{ false: '#d1d5db', true: '#FFD700' }}
                thumbColor={consents[item.type] ? '#fff' : '#f3f4f6'}
              />
            </View>
            <Text style={styles.consentDescription}>{item.description}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkRequiredConsents}
        >
          <CheckCircle2 size={20} color="#fff" />
          <Text style={styles.checkButtonText}>Verify Compliance</Text>
        </TouchableOpacity>
      </View>

      {/* Data Rights Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Data Rights</Text>
        <Text style={styles.sectionDescription}>
          Under GDPR and COPPA, you have the right to access, export, and delete your data.
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Download size={24} color="#3b82f6" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Export All Data</Text>
            <Text style={styles.actionDescription}>
              Download a copy of all your data in JSON format
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDeleteData}>
          <Trash2 size={24} color="#ef4444" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Delete All Data</Text>
            <Text style={styles.actionDescription}>
              Permanently delete all user data (cannot be undone)
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Data Retention Section */}
      {retentionSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.sectionDescription}>
            Transparency about how long we keep your data
          </Text>

          {retentionSummary.categories.map((category: any, index: number) => (
            <View key={index} style={styles.retentionItem}>
              <Text style={styles.retentionName}>{category.name}</Text>
              <Text style={styles.retentionDescription}>{category.description}</Text>
              <Text style={styles.retentionPeriod}>
                Retention: {category.retentionPeriod}
              </Text>
              <Text style={styles.retentionStatus}>Status: {category.dataSize}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Consent History */}
      {existingConsents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent History</Text>
          <Text style={styles.sectionDescription}>
            Audit trail of all consent changes
          </Text>

          {existingConsents.slice(0, 10).map((log) => (
            <View key={log.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyAction}>
                  {log.action.replace('CONSENT_', '').replace('_', ' ')}
                </Text>
                <View
                  style={[
                    styles.historyStatus,
                    log.parentalConsent ? styles.statusGranted : styles.statusDenied,
                  ]}
                >
                  <Text style={styles.historyStatusText}>
                    {log.parentalConsent ? 'Granted' : 'Denied'}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDate}>
                {new Date(log.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Legal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal Information</Text>
        
        <TouchableOpacity style={styles.legalLink}>
          <FileText size={20} color="#3b82f6" />
          <Text style={styles.legalLinkText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.legalLink}>
          <FileText size={20} color="#3b82f6" />
          <Text style={styles.legalLinkText}>Terms of Service</Text>
        </TouchableOpacity>
        
        <View style={styles.complianceNote}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={styles.complianceNoteText}>
            KIKU is fully compliant with COPPA (Children's Online Privacy Protection Act) and
            GDPR (General Data Protection Regulation). All data is stored locally on your device.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For questions about privacy and data protection, contact:
        </Text>
        <Text style={styles.footerEmail}>privacy@kiku-app.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 24,
    marginBottom: 12,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFD700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  consentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  requiredBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#b91c1c',
  },
  consentDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
  },
  retentionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  retentionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  retentionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  retentionPeriod: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 2,
  },
  retentionStatus: {
    fontSize: 12,
    color: '#666',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  historyStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusGranted: {
    backgroundColor: '#dcfce7',
  },
  statusDenied: {
    backgroundColor: '#fee2e2',
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  legalLinkText: {
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: 12,
  },
  complianceNote: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  complianceNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerEmail: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 4,
  },
});
