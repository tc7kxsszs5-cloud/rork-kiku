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
} from 'lucide-react-native';
import { useUser } from '@/constants/UserContext';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { HapticFeedback } from '@/constants/haptics';

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

export default function ProfileScreen() {
  const { user, isLoading, identifyUser, updateUser, logoutUser } = useUser();
  const { settings } = useParentalControls();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const [language, setLanguage] = useState<string>('ru');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [paymentLinked, setPaymentLinked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Не удалось сохранить профиль. Попробуйте позже');
      HapticFeedback.error();
    } finally {
      setIsSubmitting(false);
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
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Загружаем профиль...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="profile-screen">
      <LinearGradient colors={["#fff4d7", "#ffe4c4"]} style={styles.heroCard}>
        <View style={styles.heroIconWrapper}>
          <UserIcon color="#1a1a1a" size={32} />
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
            <Mail size={16} color="#f97316" />
            <Text style={styles.badgeText}>{guardianSummary}</Text>
          </View>
        </View>
      </LinearGradient>

      {error && (
        <View style={styles.errorBanner} testID="profile-error-banner">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основные данные</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Полное имя</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Иван Иванов"
            style={styles.input}
            placeholderTextColor="#9ca3af"
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
            placeholderTextColor="#9ca3af"
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
          <Languages size={20} color="#6b7280" />
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
          <CreditCard size={24} color="#1a1a1a" />
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
            <ActivityIndicator color="#1a1a1a" />
          ) : (
            <>
              <Save size={18} color="#1a1a1a" />
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
        <Smartphone size={20} color="#0f172a" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    gap: 20,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  heroIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#fff9c4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: '#0f172a',
  },
  heroRole: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#0f172a',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'web' ? 0.05 : 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0f172a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fffdf5',
  },
  roleCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  roleCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#fff7ed',
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
    color: '#0f172a',
  },
  roleDescription: {
    fontSize: 13,
    color: '#475569',
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
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  languageChipActive: {
    borderColor: '#fbbf24',
    backgroundColor: '#fff9c4',
  },
  languageChipText: {
    fontSize: 14,
    color: '#0f172a',
  },
  languageChipTextActive: {
    fontWeight: '700' as const,
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
    color: '#0f172a',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fffbeb',
  },
  securityTextWrapper: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#92400e',
  },
  securityDescription: {
    fontSize: 13,
    color: '#b45309',
    marginTop: 4,
  },
  securityButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  securityButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#facc15',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 18,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#0f172a',
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  paymentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  paymentButtonText: {
    color: '#facc15',
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
    backgroundColor: '#facc15',
    borderRadius: 16,
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
  },
  secondaryButtonText: {
    fontWeight: '700' as const,
    color: '#b91c1c',
  },
  footerCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  footerTextWrapper: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#0f172a',
  },
  footerSubtitle: {
    fontSize: 13,
    color: '#0369a1',
    marginTop: 4,
    lineHeight: 18,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff9e6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
});
