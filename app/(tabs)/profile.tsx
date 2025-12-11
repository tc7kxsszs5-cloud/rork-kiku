import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import {
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  KeyRound,
  Save,
  Languages,
  LogOut,
  Mail,
  Smartphone,
  Lightbulb,
  Bell,
  CloudUpload,
  RefreshCcw,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { useUser } from '@/constants/UserContext';
import { useNotifications, PushPermissionState } from '@/constants/NotificationsContext';
import { NotificationTestType } from '@/constants/types';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { HapticFeedback } from '@/constants/haptics';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { ThemeModeToggle } from '@/components/ThemeModeToggle';

const ROLE_OPTIONS = [
  {
    value: 'parent' as const,
    title: 'Родитель',
    description: 'Полный контроль, уведомления и доступ к настройкам безопасности',
    accent: '#0f172a',
  },
  {
    value: 'child' as const,
    title: 'Ребенок',
    description: 'Ограниченный доступ, безопасный режим и защита приватности',
    accent: '#2563eb',
  },
];

const LANGUAGE_OPTIONS = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

type SettingsShortcut = {
  key: 'security' | 'recommendations';
  title: string;
  description: string;
  accent: string;
  target: Href;
  Icon: typeof ShieldCheck;
};

const SETTINGS_SHORTCUTS: SettingsShortcut[] = [
  {
    key: 'security',
    title: 'Настройки безопасности',
    description: 'Статусы тревог, аналитика рисков и покрытие мониторинга',
    accent: '#fb923c',
    target: '/security-settings',
    Icon: ShieldCheck,
  },
  {
    key: 'recommendations',
    title: 'AI рекомендации',
    description: 'Персональные советы и обучение всей семьи',
    accent: '#fde047',
    target: '/ai-recommendations',
    Icon: Lightbulb,
  },
];

const PERMISSION_STATUS_META: Record<PushPermissionState, { label: string; description: string; color: string; textColor: string }> = {
  granted: {
    label: 'Разрешено',
    description: 'Уведомления включены',
    color: '#dcfce7',
    textColor: '#166534',
  },
  denied: {
    label: 'Запрещено',
    description: 'Нет доступа к уведомлениям',
    color: '#fee2e2',
    textColor: '#b91c1c',
  },
  undetermined: {
    label: 'Не запрошено',
    description: 'Требуется запрос разрешений',
    color: '#fef9c3',
    textColor: '#92400e',
  },
  unavailable: {
    label: 'Недоступно',
    description: 'Платформа без поддержки push',
    color: '#e2e8f0',
    textColor: '#475569',
  },
};

type ReadinessStatus = 'ready' | 'pending' | 'blocked';

type ReadinessKey = 'permissions' | 'token' | 'sync' | 'diagnostics' | 'hardware';

type IconComponent = typeof Bell;

interface ReadinessItem {
  key: ReadinessKey;
  title: string;
  description: string;
  detail: string;
  status: ReadinessStatus;
  Icon: IconComponent;
}

const READINESS_STATUS_META: Record<ReadinessStatus, { label: string; chipBackground: string; chipColor: string; iconBackground: string }> = {
  ready: {
    label: 'Готово',
    chipBackground: 'rgba(34,197,94,0.15)',
    chipColor: '#15803d',
    iconBackground: 'rgba(34,197,94,0.2)',
  },
  pending: {
    label: 'Требует действий',
    chipBackground: 'rgba(251,191,36,0.2)',
    chipColor: '#92400e',
    iconBackground: 'rgba(251,191,36,0.25)',
  },
  blocked: {
    label: 'Заблокировано',
    chipBackground: 'rgba(248,113,113,0.2)',
    chipColor: '#b91c1c',
    iconBackground: 'rgba(248,113,113,0.25)',
  },
};

const readinessIconMap: Record<ReadinessKey, IconComponent> = {
  permissions: Bell,
  token: KeyRound,
  sync: CloudUpload,
  diagnostics: Activity,
  hardware: Smartphone,
};

const DIAGNOSTIC_LABELS: Record<NotificationTestType, string> = {
  permissions: 'Разрешения',
  token: 'Push токен',
  delivery: 'Доставка',
  sync: 'Синхронизация',
};

export default function ProfileScreen() {
  const { user, isLoading, identifyUser, updateUser, logoutUser } = useUser();
  const { settings } = useParentalControls();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const [language, setLanguage] = useState<string>('ru');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [paymentLinked, setPaymentLinked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useIsMounted();
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const placeholderColor = theme.textSecondary;
  const primaryActionTextColor = theme.isDark ? '#0b1220' : '#1a1a1a';

  const {
    permissionStatus,
    expoPushToken,
    registerDevice: registerPushDevice,
    isRegistering: isRegisteringDevice,
    serverRecord,
    runDiagnostics,
    isRunningDiagnostics,
    lastDiagnostics,
    lastError: pushError,
    refreshStatus: refreshPushStatus,
    isSupported: isPushSupported,
    isSyncing: isPushSyncing,
  } = useNotifications();

  const permissionMeta = PERMISSION_STATUS_META[permissionStatus] ?? PERMISSION_STATUS_META.undetermined;
  const truncatedToken = expoPushToken ? `${expoPushToken.slice(0, 14)}…${expoPushToken.slice(-6)}` : 'Токен не получен';
  const lastSyncText = serverRecord?.lastSyncedAt
    ? new Date(serverRecord.lastSyncedAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Нет данных синхронизации';
  const diagnosticsPreview = useMemo(() => lastDiagnostics.slice(0, 3), [lastDiagnostics]);

  const readinessChecklist = useMemo<ReadinessItem[]>(() => {
    const effectiveResults = serverRecord?.testResults ?? lastDiagnostics;
    const latestDeliveryTest = [...effectiveResults]
      .filter((result) => result.type === 'delivery' && result.status === 'passed')
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    const hasRecentDeliveryTest = latestDeliveryTest ? Date.now() - latestDeliveryTest.timestamp < 1000 * 60 * 60 * 24 : false;
    const deliveryDetail = latestDeliveryTest
      ? `Последний тест: ${new Date(latestDeliveryTest.timestamp).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}`
      : 'Диагностика доставки не запускалась';

    const permissionStatusValue: ReadinessStatus = permissionStatus === 'granted'
      ? 'ready'
      : permissionStatus === 'denied'
        ? 'blocked'
        : 'pending';

    const tokenStatus: ReadinessStatus = expoPushToken
      ? 'ready'
      : permissionStatus === 'granted'
        ? 'pending'
        : 'blocked';

    const syncStatus: ReadinessStatus = serverRecord?.lastSyncedAt ? 'ready' : 'pending';

    const diagnosticsStatus: ReadinessStatus = hasRecentDeliveryTest ? 'ready' : (isPushSupported ? 'pending' : 'blocked');

    const hardwareStatus: ReadinessStatus = isPushSupported ? 'ready' : 'blocked';

    return [
      {
        key: 'permissions',
        title: 'Разрешения push',
        description: 'Требуются для TestFlight и App Store Connect',
        detail: permissionMeta.label,
        status: permissionStatusValue,
        Icon: readinessIconMap.permissions,
      },
      {
        key: 'token',
        title: 'Expo токен',
        description: 'Нужен для боевых уведомлений и edge-тестов',
        detail: expoPushToken ? truncatedToken : 'Токен не получен',
        status: tokenStatus,
        Icon: readinessIconMap.token,
      },
      {
        key: 'sync',
        title: 'Серверная регистрация',
        description: 'Устройство должно быть зарегистрировано на сервере',
        detail: serverRecord?.lastSyncedAt ? lastSyncText : 'Синхронизация не выполнялась',
        status: syncStatus,
        Icon: readinessIconMap.sync,
      },
      {
        key: 'diagnostics',
        title: 'Диагностика доставки',
        description: 'Недавний тест push на реальном устройстве',
        detail: deliveryDetail,
        status: diagnosticsStatus,
        Icon: readinessIconMap.diagnostics,
      },
      {
        key: 'hardware',
        title: 'Тестовое устройство',
        description: 'Нужно реальное iOS устройство с Expo Go/TestFlight',
        detail: isPushSupported ? 'Устройство поддерживает push API' : 'Используется платформа без push поддержки',
        status: hardwareStatus,
        Icon: readinessIconMap.hardware,
      },
    ];
  }, [expoPushToken, isPushSupported, lastDiagnostics, lastSyncText, permissionMeta.label, permissionStatus, serverRecord?.lastSyncedAt, serverRecord?.testResults, truncatedToken]);

  const readinessSummary = useMemo(() => {
    const total = readinessChecklist.length;
    const readyCount = readinessChecklist.filter((item) => item.status === 'ready').length;
    const blockedCount = readinessChecklist.filter((item) => item.status === 'blocked').length;
    const score = total > 0 ? Math.round((readyCount / total) * 100) : 0;
    return {
      total,
      readyCount,
      blockedCount,
      score,
    };
  }, [readinessChecklist]);

  const handleRegisterPush = async () => {
    if (!isPushSupported) {
      Alert.alert('Недоступно', 'Push-уведомления не поддерживаются на этой платформе');
      return;
    }
    HapticFeedback.medium();
    console.log('[ProfileScreen] Manual push registration requested');
    try {
      await registerPushDevice();
      Alert.alert('Готово', 'Устройство синхронизировано с сервером');
    } catch (err) {
      console.error('[ProfileScreen] Push registration error', err);
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось подключить push-уведомления');
    }
  };

  const handleRunDiagnostics = async () => {
    HapticFeedback.light();
    console.log('[ProfileScreen] Diagnostics started');
    try {
      const results = await runDiagnostics();
      const hasFailures = results.some((result) => result.status === 'failed');
      Alert.alert(
        hasFailures ? 'Диагностика завершена с ошибками' : 'Диагностика успешна',
        hasFailures ? 'Проверьте список проверок ниже' : 'Все проверки пройдены',
      );
    } catch (err) {
      console.error('[ProfileScreen] Diagnostics error', err);
      Alert.alert('Ошибка диагностики', err instanceof Error ? err.message : 'Не удалось запустить проверку');
    }
  };

  const handleRefreshPushStatus = async () => {
    HapticFeedback.selection();
    console.log('[ProfileScreen] Refreshing push sync status');
    try {
      await refreshPushStatus();
    } catch (err) {
      console.error('[ProfileScreen] Refresh status error', err);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setRole(user.role);
      setLanguage(user.language ?? 'ru');
      console.log('[ProfileScreen] Loaded user data into form');
    }
  }, [user]);

  const guardianSummary = useMemo(() => {
    const emailCount = settings.guardianEmails.length;
    const phoneCount = settings.guardianPhones.length;
    return `${emailCount} email • ${phoneCount} телефон`;
  }, [settings.guardianEmails.length, settings.guardianPhones.length]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError('Введите имя пользователя');
      HapticFeedback.warning();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (user) {
        await updateUser({
          name: name.trim(),
          email: email.trim() || undefined,
          role,
          language,
        });
        console.log('[ProfileScreen] User updated');
      } else {
        await identifyUser({
          name: name.trim(),
          email: email.trim() || undefined,
          role,
          language,
        });
        console.log('[ProfileScreen] User created');
      }
      HapticFeedback.success();
      Alert.alert('Профиль сохранен', 'Данные успешно обновлены');
    } catch (err) {
      console.error('[ProfileScreen] Error saving profile', err);
      if (isMountedRef.current) {
        setError('Не удалось сохранить профиль. Попробуйте позже');
      }
      HapticFeedback.error();
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      HapticFeedback.medium();
      await logoutUser();
      Alert.alert('Вы вышли из профиля');
      console.log('[ProfileScreen] User logged out');
    } catch (err) {
      console.error('[ProfileScreen] Logout error', err);
      Alert.alert('Ошибка', 'Не удалось выйти из профиля');
    }
  };

  const handleToggleTwoFactor = () => {
    HapticFeedback.selection();
    setTwoFactorEnabled((prev) => !prev);
    console.log('[ProfileScreen] 2FA toggled');
  };

  const handleTogglePayment = () => {
    HapticFeedback.selection();
    setPaymentLinked((prev) => !prev);
    console.log('[ProfileScreen] Payment toggle');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} testID="profile-loading">
        <ActivityIndicator size="large" color={theme.accentPrimary} />
        <Text style={styles.loadingText}>Загружаем профиль...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="profile-screen">
      <LinearGradient colors={theme.heroGradient} style={styles.heroCard}>
        <View style={styles.heroIconWrapper}>
          <UserIcon color={theme.textPrimary} size={32} />
        </View>
        <Text style={styles.heroName} testID="profile-name-display">
          {name || 'Новый пользователь'}
        </Text>
        <Text style={styles.heroRole} testID="profile-role-display">
          {role === 'parent' ? 'Родитель' : 'Ребенок'} • {language === 'ru' ? 'Русский' : 'English'}
        </Text>
        <View style={styles.heroBadges}>
          <View style={styles.badge}>
            <ShieldCheck size={16} color="#34d399" />
            <Text style={styles.badgeText}>Защита активна</Text>
          </View>
          <View style={styles.badge}>
            <Mail size={16} color={theme.accentPrimary} />
            <Text style={styles.badgeText}>{guardianSummary}</Text>
          </View>
        </View>
        <ThemeModeToggle variant="expanded" style={styles.heroToggle} testID="profile-theme-toggle" />
      </LinearGradient>

      {error && (
        <View style={styles.errorBanner} testID="profile-error-banner">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.section} testID="profile-readiness-section">
        <Text style={styles.sectionTitle}>Готовность к тестированию</Text>
        <View style={styles.readinessSummaryCard}>
          <View style={styles.readinessSummaryHeader}>
            <View>
              <Text style={styles.readinessSummaryLabel}>Сводный прогресс</Text>
              <Text style={styles.readinessSummaryScore} testID="profile-readiness-score">{readinessSummary.score}%</Text>
            </View>
            <View style={styles.readinessSummaryBadgeRow}>
              <View style={styles.readinessSummaryBadge}>
                <CheckCircle2 size={16} color="#22c55e" />
                <Text style={styles.readinessSummaryBadgeText}>{readinessSummary.readyCount} готово</Text>
              </View>
              <View style={[styles.readinessSummaryBadge, styles.readinessSummaryBadgeWarning]}>
                <XCircle size={16} color="#ef4444" />
                <Text style={styles.readinessSummaryBadgeText}>{readinessSummary.blockedCount} блок</Text>
              </View>
            </View>
          </View>
          <View style={styles.readinessProgressTrack}>
            <View style={[styles.readinessProgressFill, { width: `${readinessSummary.score}%` }]} testID="profile-readiness-progress" />
          </View>
          <Text style={styles.readinessSummaryHint}>Закройте все пункты ниже, прежде чем отправлять сборку в TestFlight.</Text>
        </View>
        {readinessChecklist.map((item) => {
          const meta = READINESS_STATUS_META[item.status];
          return (
            <View key={item.key} style={styles.readinessItem} testID={`profile-readiness-${item.key}`}>
              <View style={[styles.readinessIconWrapper, { backgroundColor: meta.iconBackground }]}>
                <item.Icon size={18} color={meta.chipColor} />
              </View>
              <View style={styles.readinessTextWrapper}>
                <View style={styles.readinessItemHeader}>
                  <Text style={styles.readinessItemTitle}>{item.title}</Text>
                  <View style={[styles.readinessStatusBadge, { backgroundColor: meta.chipBackground }]}>
                    <Text style={[styles.readinessStatusText, { color: meta.chipColor }]}>{meta.label}</Text>
                  </View>
                </View>
                <Text style={styles.readinessItemDescription}>{item.description}</Text>
                <Text style={styles.readinessItemDetail}>{item.detail}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Центр настроек</Text>
        {SETTINGS_SHORTCUTS.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.key}
            style={styles.shortcutCard}
            onPress={() => {
              HapticFeedback.light();
              router.push(shortcut.target);
            }}
            testID={`profile-shortcut-${shortcut.key}`}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: shortcut.accent }]}>
              <shortcut.Icon color={theme.isDark ? '#0b1220' : '#1a1a1a'} size={20} />
            </View>
            <View style={styles.shortcutTextWrapper}>
              <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
              <Text style={styles.shortcutDescription}>{shortcut.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section} testID="notifications-section">
        <Text style={styles.sectionTitle}>Push-уведомления</Text>
        <View style={styles.notificationCard}>
          <View style={styles.notificationRow}>
            <Bell size={20} color={theme.textPrimary} />
            <View style={styles.notificationTextWrapper}>
              <Text style={styles.notificationLabel}>Статус разрешений</Text>
              <Text style={styles.notificationValue}>{permissionMeta.description}</Text>
            </View>
            <View
              style={[styles.statusPill, { backgroundColor: permissionMeta.color }]}
              testID="notifications-permission-chip"
            >
              <Text style={[styles.statusPillText, { color: permissionMeta.textColor }]}>{permissionMeta.label}</Text>
            </View>
          </View>
          <View style={styles.notificationRow}>
            <CloudUpload size={20} color={theme.textPrimary} />
            <View style={styles.notificationTextWrapper}>
              <Text style={styles.notificationLabel}>Синхронизация</Text>
              <Text style={styles.notificationValue} testID="notifications-sync-status">
                {lastSyncText}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconGhostButton}
              onPress={handleRefreshPushStatus}
              disabled={isPushSyncing}
              testID="notifications-refresh-button"
            >
              {isPushSyncing ? (
                <ActivityIndicator size="small" color={theme.textPrimary} />
              ) : (
                <RefreshCcw size={18} color={theme.textPrimary} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.tokenRow}>
            <Text style={styles.notificationLabel}>Expo токен</Text>
            <Text style={styles.tokenText} numberOfLines={1} testID="notifications-token-value">
              {truncatedToken}
            </Text>
          </View>
        </View>
        {!isPushSupported && (
          <View style={styles.notificationAlert} testID="notifications-alert-unsupported">
            <Text style={styles.notificationAlertText}>
              Веб-версия не поддерживает фоновые push-уведомления. Используйте мобильное приложение для тестов.
            </Text>
          </View>
        )}
        {pushError && (
          <View style={styles.notificationAlert} testID="notifications-alert-error">
            <Text style={styles.notificationAlertText}>{pushError}</Text>
          </View>
        )}
        <View style={styles.notificationActions}>
          <TouchableOpacity
            style={[styles.primaryNotificationButton, (isRegisteringDevice || !isPushSupported) && styles.disabledButton]}
            onPress={handleRegisterPush}
            disabled={isRegisteringDevice || !isPushSupported}
            testID="notifications-register-button"
          >
            {isRegisteringDevice ? (
              <ActivityIndicator color={primaryActionTextColor} />
            ) : (
              <>
                <Bell size={18} color={primaryActionTextColor} />
                <Text style={styles.primaryNotificationButtonText}>
                  {permissionStatus === 'granted' ? 'Обновить токен' : 'Включить push'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryNotificationButton, isRunningDiagnostics && styles.disabledButton]}
            onPress={handleRunDiagnostics}
            disabled={isRunningDiagnostics}
            testID="notifications-diagnostics-button"
          >
            {isRunningDiagnostics ? (
              <ActivityIndicator color={theme.textPrimary} />
            ) : (
              <>
                <Activity size={18} color={theme.textPrimary} />
                <Text style={styles.secondaryNotificationButtonText}>Диагностика</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.testResultsCard}>
          <View style={styles.testResultsHeader}>
            <Text style={styles.notificationLabel}>Последние проверки</Text>
            <Text style={styles.notificationValue}>
              {diagnosticsPreview.length > 0
                ? `${diagnosticsPreview.length} / ${lastDiagnostics.length || diagnosticsPreview.length}`
                : 'Нет данных'}
            </Text>
          </View>
          {diagnosticsPreview.length > 0 ? (
            diagnosticsPreview.map((result) => (
              <View key={result.id} style={styles.testResultRow} testID={`notifications-test-result-${result.id}`}>
                {result.status === 'passed' ? (
                  <CheckCircle2 size={18} color="#22c55e" />
                ) : (
                  <XCircle size={18} color="#ef4444" />
                )}
                <View style={styles.notificationTextWrapper}>
                  <Text style={styles.notificationValue}>{DIAGNOSTIC_LABELS[result.type]}</Text>
                  <Text style={styles.testResultMessage}>{result.message}</Text>
                </View>
                <Text style={styles.testResultTime}>
                  {new Date(result.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.notificationValue}>Диагностика ещё не запускалась</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основные данные</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Полное имя</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Иван Иванов"
            style={styles.input}
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
            testID="profile-name-input"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="parent@mail.com"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={placeholderColor}
            testID="profile-email-input"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Роль в системе</Text>
        {ROLE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.roleCard, role === option.value && styles.roleCardActive]}
            onPress={() => {
              setRole(option.value);
              HapticFeedback.selection();
              console.log('[ProfileScreen] Role selected', option.value);
            }}
            testID={`profile-role-${option.value}`}
          >
            <View style={styles.roleHeader}>
              <View style={[styles.roleAccent, { backgroundColor: option.accent }]} />
              <Text style={styles.roleTitle}>{option.title}</Text>
            </View>
            <Text style={styles.roleDescription}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Язык интерфейса</Text>
        <View style={styles.languageRow}>
          <Languages size={20} color={theme.textSecondary} />
          {LANGUAGE_OPTIONS.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              style={[styles.languageChip, language === lang.value && styles.languageChipActive]}
              onPress={() => {
                setLanguage(lang.value);
                HapticFeedback.selection();
                console.log('[ProfileScreen] Language selected', lang.value);
              }}
              testID={`profile-language-${lang.value}`}
            >
              <Text
                style={[
                  styles.languageChipText,
                  language === lang.value && styles.languageChipTextActive,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Безопасность доступа</Text>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleTitle}>Двухфакторная аутентификация</Text>
            <Text style={styles.toggleDescription}>
              SMS + код подтверждения при входе в приложение
            </Text>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={handleToggleTwoFactor}
            trackColor={{ false: '#d1d5db', true: '#34d399' }}
            thumbColor={twoFactorEnabled ? '#065f46' : '#fef3c7'}
            testID="profile-2fa-toggle"
          />
        </View>
        <View style={styles.securityCard}>
          <KeyRound size={20} color="#f59e0b" />
          <View style={styles.securityTextWrapper}>
            <Text style={styles.securityTitle}>Резервные коды</Text>
            <Text style={styles.securityDescription}>
              Скачайте резервные коды, чтобы не потерять доступ, если телефон недоступен
            </Text>
          </View>
          <TouchableOpacity style={styles.securityButton} onPress={() => Alert.alert('Скоро', 'Резервные коды будут доступны позже')}>
            <Text style={styles.securityButtonText}>Скачать</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Платежные данные</Text>
        <View style={styles.paymentCard}>
          <CreditCard size={24} color={theme.textPrimary} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>
              {paymentLinked ? 'Карта привязана' : 'Нет привязанной карты'}
            </Text>
            <Text style={styles.paymentSubtitle}>
              {paymentLinked ? 'Автопродление подключено' : 'Подключите карту для оплаты подписки'}
            </Text>
          </View>
          <TouchableOpacity style={styles.paymentButton} onPress={handleTogglePayment} testID="profile-payment-toggle">
            <Text style={styles.paymentButtonText}>{paymentLinked ? 'Отключить' : 'Привязать'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          onPress={handleSaveProfile}
          disabled={isSubmitting}
          testID="profile-save-button"
        >
          {isSubmitting ? (
            <ActivityIndicator color={primaryActionTextColor} />
          ) : (
            <>
              <Save size={18} color={primaryActionTextColor} />
              <Text style={styles.primaryButtonText}>Сохранить</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout} testID="profile-logout-button">
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.secondaryButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerCard}>
        <Smartphone size={20} color={theme.textPrimary} />
        <View style={styles.footerTextWrapper}>
          <Text style={styles.footerTitle}>Доверенные устройства</Text>
          <Text style={styles.footerSubtitle}>
            Мониторьте входы в аккаунт и подтверждайте новые устройства в настройках безопасности
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    gap: 20,
    backgroundColor: theme.backgroundPrimary,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: theme.accentPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: theme.isDark ? 0.35 : 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  heroIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: theme.textPrimary,
  },
  heroRole: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  heroToggle: {
    marginTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    marginBottom: 12,
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accentPrimary,
  },
  shortcutTextWrapper: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  shortcutDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  section: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'web' ? 0.08 : (theme.isDark ? 0.25 : 0.08),
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.textPrimary,
    marginBottom: 16,
  },
  readinessSummaryCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    marginBottom: 16,
  },
  readinessSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  readinessSummaryLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  readinessSummaryScore: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: theme.textPrimary,
    marginTop: 4,
  },
  readinessSummaryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readinessSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  readinessSummaryBadgeWarning: {
    backgroundColor: theme.isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
    borderColor: theme.isDark ? 'rgba(239,68,68,0.4)' : '#fecaca',
  },
  readinessSummaryBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  readinessProgressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.borderSoft,
    overflow: 'hidden',
    marginBottom: 10,
  },
  readinessProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.accentPrimary,
  },
  readinessSummaryHint: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  readinessItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: theme.borderSoft,
  },
  readinessIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readinessTextWrapper: {
    flex: 1,
  },
  readinessItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  readinessItemTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  readinessStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  readinessStatusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  readinessItemDescription: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  readinessItemDetail: {
    fontSize: 13,
    color: theme.textPrimary,
    marginTop: 4,
  },
  notificationCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    gap: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationTextWrapper: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  notificationValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.textPrimary,
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  iconGhostButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  tokenRow: {
    marginTop: 8,
  },
  tokenText: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  notificationAlert: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    backgroundColor: theme.isDark ? 'rgba(248,113,113,0.12)' : '#fef2f2',
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(248,113,113,0.3)' : '#fecaca',
  },
  notificationAlertText: {
    fontSize: 13,
    color: theme.isDark ? '#fecaca' : '#b91c1c',
  },
  notificationActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  primaryNotificationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.accentPrimary,
  },
  primaryNotificationButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: theme.isDark ? '#0b1220' : '#1a1a1a',
  },
  secondaryNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.cardMuted,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  secondaryNotificationButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  testResultsCard: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    padding: 16,
    backgroundColor: theme.card,
    gap: 12,
  },
  testResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  testResultMessage: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  testResultTime: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.borderSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.textPrimary,
    backgroundColor: theme.cardMuted,
  },
  roleCard: {
    borderWidth: 1,
    borderColor: theme.borderSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: theme.card,
  },
  roleCardActive: {
    borderColor: theme.accentPrimary,
    backgroundColor: theme.isDark ? 'rgba(250,204,21,0.12)' : '#fff7ed',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  roleAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  roleDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    backgroundColor: theme.card,
  },
  languageChipActive: {
    borderColor: theme.accentPrimary,
    backgroundColor: theme.accentPrimary,
  },
  languageChipText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  languageChipTextActive: {
    fontWeight: '700' as const,
    color: theme.isDark ? theme.backgroundPrimary : '#1a1a1a',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  toggleDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.cardMuted,
  },
  securityTextWrapper: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  securityDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  securityButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: theme.textPrimary,
  },
  securityButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.backgroundPrimary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    borderRadius: 18,
    padding: 18,
    backgroundColor: theme.card,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  paymentSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  paymentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.textPrimary,
  },
  paymentButtonText: {
    color: theme.backgroundPrimary,
    fontWeight: '700' as const,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.accentPrimary,
    borderRadius: 16,
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.isDark ? '#0b1220' : '#1a1a1a',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: theme.isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2',
  },
  secondaryButtonText: {
    fontWeight: '700' as const,
    color: '#b91c1c',
  },
  footerCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: theme.cardMuted,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  footerTextWrapper: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  footerSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: theme.isDark ? 'rgba(248,113,113,0.2)' : '#fee2e2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(248,113,113,0.3)' : '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundPrimary,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.textSecondary,
  },
});
