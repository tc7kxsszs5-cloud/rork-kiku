import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { trpcVanillaClient } from '@/lib/trpc';
import { useThemeMode } from '@/constants/ThemeContext';
import { useAuth } from '@/constants/AuthContext';
import { ShieldCheck, Mail, User, CheckCircle } from 'lucide-react-native';

export default function RegisterParentScreen() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coppaConsent, setCoppaConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredCode, setRegisteredCode] = useState<string | null>(null);

  const styles = createStyles(theme);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите ваше имя');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    if (!coppaConsent) {
      Alert.alert('Ошибка', 'Необходимо согласие с COPPA');
      return;
    }

    if (!privacyConsent) {
      Alert.alert('Ошибка', 'Необходимо принять политику конфиденциальности');
      return;
    }

    setIsLoading(true);

    try {
      const result = await trpcVanillaClient.auth.registerParent.mutate({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        country: 'US',
        state: 'TX',
        coppaConsent: true,
        privacyPolicyAccepted: true,
      });

      if (result.success && result.code && result.parentId) {
        setRegisteredCode(result.code);
        // Сохраняем parentId для дальнейшего использования
        await AsyncStorage.setItem('@parent_id', result.parentId);
        // Логиним родителя
        await login(result.parentId, 'parent', undefined, result.authToken);
      } else {
        Alert.alert('Ошибка', result.error || 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('[RegisterParent] Error:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!registeredCode) return;
    
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(registeredCode);
      } else {
        await Clipboard.setStringAsync(registeredCode);
      }
      Alert.alert('Скопировано', 'Код скопирован в буфер обмена');
    } catch (error) {
      console.error('[RegisterParent] Copy error:', error);
      Alert.alert('Ошибка', 'Не удалось скопировать код');
    }
  };

  // Если код получен - показываем экран с кодом
  if (registeredCode) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={theme.success} />
            <Text style={styles.successTitle}>Регистрация завершена!</Text>
            <Text style={styles.successMessage}>
              Ваш код для регистрации ребенка:
            </Text>

            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{registeredCode}</Text>
            </View>

            <Text style={styles.instructionText}>
              Покажите этот код ребенку для регистрации в приложении
            </Text>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Text style={styles.copyButtonText}>📋 Скопировать код</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.replace('/(tabs)/index' as Href)}
            >
              <Text style={styles.continueButtonText}>Продолжить</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header} testID="register-parent-header">
          <ShieldCheck size={48} color={theme.interactive?.primary || theme.accentPrimary} />
          <Text style={styles.title} testID="register-parent-title">Я родитель</Text>
          <Text style={styles.subtitle} testID="register-parent-subtitle">
            Зарегистрируйтесь, чтобы защитить своего ребенка
          </Text>
        </View>

        <View style={styles.form} testID="register-parent-form">
          <View style={styles.inputContainer} testID="register-parent-name-input-container">
            <User size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ваше имя"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              testID="register-parent-name-input"
            />
          </View>

          <View style={styles.inputContainer} testID="register-parent-email-input-container">
            <Mail size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="register-parent-email-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Телефон (необязательно)"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.consentContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setCoppaConsent(!coppaConsent)}
            >
              <View style={[styles.checkboxBox, coppaConsent && styles.checkboxChecked]}>
                {coppaConsent && <CheckCircle size={16} color={theme.interactive?.primary || theme.accentPrimary} />}
              </View>
              <Text style={styles.consentText}>
                Я согласен с COPPA и подтверждаю, что являюсь родителем или опекуном
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setPrivacyConsent(!privacyConsent)}
            >
              <View style={[styles.checkboxBox, privacyConsent && styles.checkboxChecked]}>
                {privacyConsent && <CheckCircle size={16} color={theme.interactive?.primary || theme.accentPrimary} />}
              </View>
              <Text style={styles.consentText}>
                Я принимаю политику конфиденциальности
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            testID="register-parent-submit-button"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText} testID="register-parent-submit-text">Зарегистрироваться</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textPrimary,
    marginLeft: 12,
  },
  consentContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.borderSoft,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.interactive?.primary || theme.accentPrimary,
    borderColor: theme.interactive?.primary || theme.accentPrimary,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: theme.interactive?.primary || theme.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 24,
  },
  successMessage: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  codeContainer: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    borderWidth: 2,
    borderColor: theme.interactive?.primary || theme.accentPrimary,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.interactive?.primary || theme.accentPrimary,
    letterSpacing: 4,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  copyButton: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  copyButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: theme.interactive?.primary || theme.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 24,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
