import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import {
  ParentalSettings,
  SOSAlert,
  Contact,
  TimeRestriction,
  ComplianceLog,
} from './types';
import { HapticFeedback } from './haptics';
import { trpc } from '@/lib/trpc';
import { useNotifications } from './NotificationsContext';
import { useUser } from './UserContext';

const SETTINGS_STORAGE_KEY = '@parental_settings';
const SOS_ALERTS_STORAGE_KEY = '@sos_alerts';
const CONTACTS_STORAGE_KEY = '@contacts';
const TIME_RESTRICTIONS_STORAGE_KEY = '@time_restrictions';
const COMPLIANCE_LOG_STORAGE_KEY = '@compliance_log';
const ALERTS_LAST_SYNC_KEY = '@alerts_last_sync';

const DEFAULT_SETTINGS: ParentalSettings = {
  timeRestrictionsEnabled: false,
  dailyUsageLimit: 180,
  requireApprovalForNewContacts: true,
  blockUnknownContacts: false,
  imageFilteringEnabled: true,
  locationSharingEnabled: true,
  sosNotificationsEnabled: true,
  guardianEmails: [],
  guardianPhones: [],
};

export const [ParentalControlsProvider, useParentalControls] = createContextHook(() => {
  const [settings, setSettings] = useState<ParentalSettings>(DEFAULT_SETTINGS);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [timeRestrictions, setTimeRestrictions] = useState<TimeRestriction[]>([]);
  const [complianceLog, setComplianceLog] = useState<ComplianceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deviceId } = useNotifications();
  const { user } = useUser();
  const syncAlertsMutation = trpc.sync.alerts.sync.useMutation();
  const sendPushMutation = trpc.notifications.sendPushToUser.useMutation();
  const lastSyncTimestampRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadData = async () => {
      try {
        const [settingsData, sosData, contactsData, restrictionsData, complianceData] =
          await Promise.all([
            AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
            AsyncStorage.getItem(SOS_ALERTS_STORAGE_KEY),
            AsyncStorage.getItem(CONTACTS_STORAGE_KEY),
            AsyncStorage.getItem(TIME_RESTRICTIONS_STORAGE_KEY),
            AsyncStorage.getItem(COMPLIANCE_LOG_STORAGE_KEY),
          ]);

        if (!isMounted) {
          return;
        }

        if (settingsData) setSettings(JSON.parse(settingsData));
        if (sosData) setSosAlerts(JSON.parse(sosData));
        if (contactsData) setContacts(JSON.parse(contactsData));
        if (restrictionsData) setTimeRestrictions(JSON.parse(restrictionsData));
        if (complianceData) setComplianceLog(JSON.parse(complianceData));

        // Загружаем lastSyncTimestamp для alerts
        const lastSyncData = await AsyncStorage.getItem(ALERTS_LAST_SYNC_KEY);
        if (lastSyncData) {
          lastSyncTimestampRef.current = parseInt(lastSyncData, 10);
        }
      } catch (error) {
        console.error('Error loading parental controls data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (Platform.OS !== 'web') {
      loadData();
    } else {
      timer = setTimeout(loadData, 0);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const logCompliance = useCallback(
    async (action: string, userId: string, details: Record<string, any>, parentalConsent = false) => {
      const log: ComplianceLog = {
        id: `log_${Date.now()}_${Math.random()}`,
        action,
        userId,
        timestamp: Date.now(),
        details,
        parentalConsent,
      };

      const updatedLog = [log, ...complianceLog].slice(0, 1000);
      setComplianceLog(updatedLog);
      await AsyncStorage.setItem(COMPLIANCE_LOG_STORAGE_KEY, JSON.stringify(updatedLog));
      console.log('Compliance logged:', action, userId);
    },
    [complianceLog]
  );

  // Синхронизация SOS alerts с backend
  const syncAlerts = useCallback(
    async (alertsToSync: SOSAlert[]) => {
      if (!deviceId || Platform.OS === 'web') {
        return;
      }

      try {
        const result = await syncAlertsMutation.mutateAsync({
          deviceId,
          alerts: alertsToSync,
          lastSyncTimestamp: lastSyncTimestampRef.current,
        });

        if (result.success && result.lastSyncTimestamp) {
          lastSyncTimestampRef.current = result.lastSyncTimestamp;
          await AsyncStorage.setItem(ALERTS_LAST_SYNC_KEY, result.lastSyncTimestamp.toString());
        }
      } catch (error) {
        console.error('[ParentalControlsContext] Error syncing alerts (ignored):', error);
      }
    },
    [deviceId, syncAlertsMutation]
  );

  const updateSettings = useCallback(
    async (updates: Partial<ParentalSettings>, userId: string) => {
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      await logCompliance('settings_update', userId, updates, true);
      console.log('Settings updated:', updates);
    },
    [settings, logCompliance]
  );

  const triggerSOS = useCallback(
    async (userId: string, userName: string, chatId?: string, message?: string) => {
      try {
        HapticFeedback.error();
        
        let location: { lat: number; lng: number } | undefined;
        
        if (settings.locationSharingEnabled && Platform.OS !== 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            location = {
              lat: loc.coords.latitude,
              lng: loc.coords.longitude,
            };
          }
        }

        const sosAlert: SOSAlert = {
          id: `sos_${Date.now()}_${Math.random()}`,
          userId,
          userName,
          chatId,
          timestamp: Date.now(),
          location,
          message,
          resolved: false,
        };

        const updatedAlerts = [sosAlert, ...sosAlerts];
        setSosAlerts(updatedAlerts);
        await AsyncStorage.setItem(SOS_ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
        await logCompliance('sos_triggered', userId, { chatId, location, message }, false);

        // Синхронизация с backend
        await syncAlerts(updatedAlerts);

        // Отправка push-уведомления родителю (если включены уведомления)
        if (settings.sosNotificationsEnabled && user?.id) {
          try {
            await sendPushMutation.mutateAsync({
              userId: user.id,
              title: '🚨 SOS Алерт',
              body: `${userName} активировал кнопку SOS${location ? ' с геолокацией' : ''}`,
              data: {
                type: 'sos',
                alertId: sosAlert.id,
                userId,
                userName,
                chatId,
                location,
                timestamp: sosAlert.timestamp,
              },
              priority: 'high',
              sound: 'default',
              channelId: Platform.OS === 'android' ? 'sos_alerts' : undefined,
            });
          } catch (error) {
            console.error('[ParentalControlsContext] Error sending push notification (ignored):', error);
          }
        }

        console.log('SOS alert triggered:', sosAlert);
        return sosAlert;
      } catch (error) {
        console.error('Error triggering SOS:', error);
        throw error;
      }
    },
    [settings, sosAlerts, logCompliance, syncAlerts, sendPushMutation, user?.id]
  );

  const resolveSOS = useCallback(
    async (sosId: string, respondedBy: string) => {
      const updatedAlerts = sosAlerts.map((alert) =>
        alert.id === sosId
          ? { ...alert, resolved: true, respondedBy, respondedAt: Date.now() }
          : alert
      );
      setSosAlerts(updatedAlerts);
      await AsyncStorage.setItem(SOS_ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
      
      // Синхронизация с backend
      await syncAlerts(updatedAlerts);
      
      HapticFeedback.success();
      console.log('SOS resolved:', sosId);
    },
    [sosAlerts, syncAlerts]
  );

  const addContact = useCallback(
    async (
      name: string,
      userId: string,
      phone?: string,
      email?: string,
      isWhitelisted = true
    ) => {
      const contact: Contact = {
        id: `contact_${Date.now()}_${Math.random()}`,
        name,
        phone,
        email,
        isWhitelisted,
        addedBy: userId,
        addedAt: Date.now(),
      };

      const updatedContacts = [...contacts, contact];
      setContacts(updatedContacts);
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
      await logCompliance('contact_added', userId, { contactId: contact.id, name }, true);
      console.log('Contact added:', contact);
      return contact;
    },
    [contacts, logCompliance]
  );

  const removeContact = useCallback(
    async (contactId: string, userId: string) => {
      const updatedContacts = contacts.filter((c) => c.id !== contactId);
      setContacts(updatedContacts);
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
      await logCompliance('contact_removed', userId, { contactId }, true);
      console.log('Contact removed:', contactId);
    },
    [contacts, logCompliance]
  );

  const toggleContactWhitelist = useCallback(
    async (contactId: string, userId: string) => {
      const updatedContacts = contacts.map((c) =>
        c.id === contactId ? { ...c, isWhitelisted: !c.isWhitelisted } : c
      );
      setContacts(updatedContacts);
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
      const contact = updatedContacts.find((c) => c.id === contactId);
      await logCompliance(
        'contact_whitelist_toggle',
        userId,
        { contactId, isWhitelisted: contact?.isWhitelisted },
        true
      );
    },
    [contacts, logCompliance]
  );

  const addTimeRestriction = useCallback(
    async (
      userId: string,
      dayOfWeek: number,
      startHour: number,
      startMinute: number,
      endHour: number,
      endMinute: number
    ) => {
      const restriction: TimeRestriction = {
        id: `restriction_${Date.now()}_${Math.random()}`,
        userId,
        dayOfWeek,
        startHour,
        startMinute,
        endHour,
        endMinute,
        enabled: true,
      };

      const updatedRestrictions = [...timeRestrictions, restriction];
      setTimeRestrictions(updatedRestrictions);
      await AsyncStorage.setItem(
        TIME_RESTRICTIONS_STORAGE_KEY,
        JSON.stringify(updatedRestrictions)
      );
      await logCompliance('time_restriction_added', userId, restriction, true);
      return restriction;
    },
    [timeRestrictions, logCompliance]
  );

  const removeTimeRestriction = useCallback(
    async (restrictionId: string, userId: string) => {
      const updatedRestrictions = timeRestrictions.filter((r) => r.id !== restrictionId);
      setTimeRestrictions(updatedRestrictions);
      await AsyncStorage.setItem(
        TIME_RESTRICTIONS_STORAGE_KEY,
        JSON.stringify(updatedRestrictions)
      );
      await logCompliance('time_restriction_removed', userId, { restrictionId }, true);
    },
    [timeRestrictions, logCompliance]
  );

  const toggleTimeRestriction = useCallback(
    async (restrictionId: string, userId: string) => {
      const updatedRestrictions = timeRestrictions.map((r) =>
        r.id === restrictionId ? { ...r, enabled: !r.enabled } : r
      );
      setTimeRestrictions(updatedRestrictions);
      await AsyncStorage.setItem(
        TIME_RESTRICTIONS_STORAGE_KEY,
        JSON.stringify(updatedRestrictions)
      );
    },
    [timeRestrictions]
  );

  const isTimeRestricted = useCallback(() => {
    if (!settings.timeRestrictionsEnabled) return false;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return timeRestrictions.some((restriction) => {
      if (!restriction.enabled || restriction.dayOfWeek !== dayOfWeek) return false;

      const currentTime = currentHour * 60 + currentMinute;
      const startTime = restriction.startHour * 60 + restriction.startMinute;
      const endTime = restriction.endHour * 60 + restriction.endMinute;

      return currentTime < startTime || currentTime >= endTime;
    });
  }, [settings, timeRestrictions]);

  const whitelistedContacts = useMemo(
    () => contacts.filter((c) => c.isWhitelisted),
    [contacts]
  );

  const unresolvedSOSAlerts = useMemo(
    () => sosAlerts.filter((alert) => !alert.resolved),
    [sosAlerts]
  );

  return useMemo(
    () => ({
      settings,
      sosAlerts,
      unresolvedSOSAlerts,
      contacts,
      whitelistedContacts,
      timeRestrictions,
      complianceLog,
      isLoading,
      updateSettings,
      triggerSOS,
      resolveSOS,
      addContact,
      removeContact,
      toggleContactWhitelist,
      addTimeRestriction,
      removeTimeRestriction,
      toggleTimeRestriction,
      isTimeRestricted,
      logCompliance,
    }),
    [
      settings,
      sosAlerts,
      unresolvedSOSAlerts,
      contacts,
      whitelistedContacts,
      timeRestrictions,
      complianceLog,
      isLoading,
      updateSettings,
      triggerSOS,
      resolveSOS,
      addContact,
      removeContact,
      toggleContactWhitelist,
      addTimeRestriction,
      removeTimeRestriction,
      toggleTimeRestriction,
      isTimeRestricted,
      logCompliance,
    ]
  );
});
