import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Shield, Lock, Eye, Settings, MessageCircle } from 'lucide-react-native';
import { useUser } from '@/constants/UserContext';
import { useAgeCompliance } from '@/constants/AgeComplianceContext';
import { useThemeMode } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { identifyUser } = useUser();
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
      Alert.alert('Выберите роль', 'Пожалуйста, выберите вашу роль перед продолжением');
      return;
    }

    // Для ребенка проверяем соответствие Texas SB 2420
    if (selectedRole === 'child') {
      if (requiresConsent && !isTexasCompliant) {
        Alert.alert(
          'Требуется родительское согласие',
          'Для использования приложения ребенком необходимо получить согласие родителя или опекуна.',
          [
            {
              text: 'Отмена',
              style: 'cancel',
            },
            {
              text: 'Получить согласие',
              onPress: () => {
                router.push('/security-settings' as any);
              },
            },
          ]
        );
        return;
      }
    }

    setIsSubmitting(true);
    HapticFeedback.medium();

    try {
      await identifyUser({
        name: selectedRole === 'parent' ? 'Родитель' : 'Ребенок',
        role: selectedRole,
      });

      // Переход в зависимости от роли
      if (selectedRole === 'parent') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error identifying user:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить профиль. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.surfaceGradient} style={styles.gradient}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Выберите вашу роль</Text>
          <Text style={styles.subtitle}>
            Это поможет настроить приложение под ваши потребности
          </Text>

          {selectedRole === 'child' && requiresConsent && !isTexasCompliant && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Для использования приложения ребенком требуется родительское согласие согласно закону Техаса (SB 2420).
              </Text>
            </View>
          )}

          {/* Родитель */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'parent' && styles.roleCardSelected]}
            onPress={() => handleRoleSelect('parent')}
            activeOpacity={0.7}
          >
            <View style={styles.roleHeader}>
              <Shield size={32} color={theme.accentPrimary} style={styles.roleIcon} />
              <Text style={styles.roleTitle}>Родитель</Text>
            </View>
            <Text style={styles.roleDescription}>
              Полный контроль и мониторинг безопасности вашего ребенка
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Eye size={16} color={theme.textSecondary} style={styles.featureIcon} />
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
              </View>
            </View>
          </TouchableOpacity>

          {/* Ребенок */}
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'child' && styles.roleCardSelected]}
            onPress={() => handleRoleSelect('child')}
            activeOpacity={0.7}
          >
            <View style={styles.roleHeader}>
              <User size={32} color={theme.accentPrimary} style={styles.roleIcon} />
              <Text style={styles.roleTitle}>Ребенок</Text>
            </View>
            <Text style={styles.roleDescription}>
              Безопасное общение с защитой и поддержкой
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MessageCircle size={16} color={theme.textSecondary} style={styles.featureIcon} />
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
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, (!selectedRole || isSubmitting) && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!selectedRole || isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Сохранение...' : 'Продолжить'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

