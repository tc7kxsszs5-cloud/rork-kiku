import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Href } from 'expo-router';
=======
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
import { User, Shield, Lock, Eye, Settings, MessageCircle } from 'lucide-react-native';
import { useUser } from '@/constants/UserContext';
import { useAgeCompliance } from '@/constants/AgeComplianceContext';
import { useThemeMode } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

export default function RoleSelectionScreen() {
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
  const router = useRouter();
  useUser();
  const { requiresConsent, isTexasCompliant } = useAgeCompliance();
  const { theme } = useThemeMode();
  const [selectedRole, setSelectedRole] = useState<'parent' | 'child' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    gradient: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 40,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 22,
    },
    roleCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: theme.borderSoft,
    },
    roleCardSelected: {
      borderColor: theme.accentPrimary,
      borderWidth: 3,
      backgroundColor: theme.card,
    },
    roleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    roleIcon: {
      marginRight: 12,
    },
    roleTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    roleDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    featuresList: {
      marginTop: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureIcon: {
      marginRight: 8,
    },
    featureText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    button: {
      backgroundColor: theme.accentPrimary,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    warningBox: {
      backgroundColor: '#fef3c7',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: '#f59e0b',
    },
    warningText: {
      fontSize: 14,
      color: theme.textPrimary,
      lineHeight: 20,
    },
  });

  const handleRoleSelect = (role: 'parent' | 'child') => {
    HapticFeedback.light();
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
<<<<<<< HEAD
      Alert.alert(t('roleSelection.title'), t('roleSelection.selectRoleAlert'));
=======
      Alert.alert('Выберите роль', 'Пожалуйста, выберите вашу роль перед продолжением');
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
      return;
    }

    setIsSubmitting(true);
    HapticFeedback.medium();

    try {
      // Переход на экраны регистрации
      if (selectedRole === 'parent') {
<<<<<<< HEAD
        router.push('/register-parent' as Href);
      } else {
        router.push('/register-child' as Href);
      }
    } catch (error) {
      console.error('Error navigating to registration:', error);
      Alert.alert(t('common.error'), t('roleSelection.navigateError'));
=======
        router.push('/register-parent');
      } else {
        router.push('/register-child');
      }
    } catch (error) {
      console.error('Error navigating to registration:', error);
      Alert.alert('Ошибка', 'Не удалось перейти к регистрации. Попробуйте снова.');
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.surfaceGradient} style={styles.gradient}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }} testID="role-selection-scroll">
<<<<<<< HEAD
          <Text style={styles.title} testID="role-selection-title">{t('roleSelection.title')}</Text>
          <Text style={styles.subtitle} testID="role-selection-subtitle">
            {t('roleSelection.subtitle')}
=======
          <Text style={styles.title} testID="role-selection-title">Выберите вашу роль</Text>
          <Text style={styles.subtitle} testID="role-selection-subtitle">
            Это поможет настроить приложение под ваши потребности
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
          </Text>

          {selectedRole === 'child' && requiresConsent && !isTexasCompliant && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
<<<<<<< HEAD
                {t('roleSelection.texasConsentWarning')}
=======
                ⚠️ Для использования приложения ребенком требуется родительское согласие согласно закону Техаса (SB 2420).
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
              </Text>
            </View>
          )}

          {/* Родитель */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'parent' && styles.roleCardSelected]}
            onPress={() => handleRoleSelect('parent')}
            activeOpacity={0.7}
            testID="role-selection-parent-card"
          >
            <View style={styles.roleHeader}>
              <Shield size={32} color={theme.accentPrimary} style={styles.roleIcon} />
<<<<<<< HEAD
              <Text style={styles.roleTitle} testID="role-selection-parent-title">{t('roleSelection.parent')}</Text>
            </View>
            <Text style={styles.roleDescription}>
              {t('roleSelection.parentDescription')}
=======
              <Text style={styles.roleTitle} testID="role-selection-parent-title">Родитель</Text>
            </View>
            <Text style={styles.roleDescription}>
              Полный контроль и мониторинг безопасности вашего ребенка
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Eye size={16} color={theme.textSecondary} style={styles.featureIcon} />
<<<<<<< HEAD
                <Text style={styles.featureText}>{t('roleSelection.parentFeature1')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Settings size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.parentFeature2')}</Text>
              </View>
              <View style={styles.featureItem}>
                <MessageCircle size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.parentFeature3')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.parentFeature4')}</Text>
=======
                <Text style={styles.featureText}>Мониторинг всех чатов и сообщений</Text>
              </View>
              <View style={styles.featureItem}>
                <Settings size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Настройки родительского контроля</Text>
              </View>
              <View style={styles.featureItem}>
                <MessageCircle size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Уведомления о рисках и тревогах</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Статистика и аналитика безопасности</Text>
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
              </View>
            </View>
          </TouchableOpacity>

          {/* Ребенок */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'child' && styles.roleCardSelected]}
            onPress={() => handleRoleSelect('child')}
            activeOpacity={0.7}
            testID="role-selection-child-card"
          >
            <View style={styles.roleHeader}>
              <User size={32} color={theme.accentPrimary} style={styles.roleIcon} />
<<<<<<< HEAD
              <Text style={styles.roleTitle} testID="role-selection-child-title">{t('roleSelection.child')}</Text>
            </View>
            <Text style={styles.roleDescription}>
              {t('roleSelection.childDescription')}
=======
              <Text style={styles.roleTitle} testID="role-selection-child-title">Ребенок</Text>
            </View>
            <Text style={styles.roleDescription}>
              Безопасное общение с защитой и поддержкой
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MessageCircle size={16} color={theme.textSecondary} style={styles.featureIcon} />
<<<<<<< HEAD
                <Text style={styles.featureText}>{t('roleSelection.childFeature1')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.childFeature2')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Lock size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.childFeature3')}</Text>
              </View>
              <View style={styles.featureItem}>
                <User size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>{t('roleSelection.childFeature4')}</Text>
=======
                <Text style={styles.featureText}>Безопасные чаты с AI-защитой</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Кнопка SOS для экстренной помощи</Text>
              </View>
              <View style={styles.featureItem}>
                <Lock size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Защита приватности</Text>
              </View>
              <View style={styles.featureItem}>
                <User size={16} color={theme.textSecondary} style={styles.featureIcon} />
                <Text style={styles.featureText}>Ограниченный доступ к настройкам</Text>
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, (!selectedRole || isSubmitting) && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!selectedRole || isSubmitting}
          >
            <Text style={styles.buttonText}>
<<<<<<< HEAD
              {isSubmitting ? t('roleSelection.saving') : t('roleSelection.continue')}
=======
              {isSubmitting ? 'Сохранение...' : 'Продолжить'}
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

