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
import { trpcVanillaClient } from '@/lib/trpc';
import { useThemeMode } from '@/constants/ThemeContext';
import { useAuth } from '@/constants/AuthContext';
import { Baby, Key, User, CheckCircle } from 'lucide-react-native';

export default function RegisterChildScreen() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { login } = useAuth();
  const [parentCode, setParentCode] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState(false);
  const [parentName, setParentName] = useState('');

  const styles = createStyles(theme);

  // Валидация кода в реальном времени
  const validateCode = async (code: string) => {
    if (!code || code.length < 10) {
      setCodeValid(false);
      return;
    }

    setIsValidatingCode(true);
    try {
      const result = await trpcVanillaClient.auth.validateParentCode.query({ code: code.toUpperCase() });
      setCodeValid(result.valid || false);
      setParentName(result.parentName || '');
    } catch {
      setCodeValid(false);
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Форматируем код: KIKU-XXXXXX
    const formatted = text.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setParentCode(formatted);
    
    if (formatted.length >= 10) {
      validateCode(formatted);
    } else {
      setCodeValid(false);
    }
  };

  const handleRegister = async () => {
    if (!parentCode.trim() || !codeValid) {
      Alert.alert('Ошибка', 'Введите корректный код родителя');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите ваше имя');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 4 || ageNum > 15) {
      Alert.alert('Ошибка', 'Введите возраст от 4 до 15 лет');
      return;
    }

    setIsLoading(true);

    try {
      const result = await trpcVanillaClient.auth.registerChild.mutate({
        parentCode: parentCode.toUpperCase(),
        name: name.trim(),
        age: ageNum,
      });

      if (result.success && result.childId) {
        // Сохраняем данные ребенка
        await AsyncStorage.setItem('@child_id', result.childId);
        if (result.deviceId) {
          await AsyncStorage.setItem('@device_id', result.deviceId);
        }

        // Логиним ребенка
        await login(result.childId, 'child');

        // Сразу переходим в чаты (layout тоже перенаправит при isAuthenticated)
        router.replace('/(tabs)' as Href);

        Alert.alert(
          'Успешно!',
          `Добро пожаловать, ${name}! Устройства связаны с ${result.parentName}.`,
          [{ text: 'ОК' }]
        );
      } else {
        Alert.alert('Ошибка', result.error || 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('[RegisterChild] Error:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header} testID="register-child-header">
          <Baby size={48} color={theme.interactive?.primary || theme.accentPrimary} />
          <Text style={styles.title} testID="register-child-title">Я ребенок</Text>
          <Text style={styles.subtitle} testID="register-child-subtitle">
            Введите код родителя для регистрации
          </Text>
        </View>

        <View style={styles.form} testID="register-child-form">
          <View style={styles.inputContainer}>
            <Key size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="KIKU-XXXXXX"
              placeholderTextColor={theme.textSecondary}
              value={parentCode}
              onChangeText={handleCodeChange}
              autoCapitalize="characters"
              maxLength={11}
            />
            {isValidatingCode && (
              <ActivityIndicator size="small" color={theme.interactive?.primary || theme.accentPrimary} />
            )}
            {codeValid && parentCode.length >= 10 && (
              <CheckCircle size={20} color={theme.success} />
            )}
          </View>

          {codeValid && parentName && (
            <View style={styles.codeValidContainer}>
              <Text style={styles.codeValidText}>
                ✅ Код подтвержден! Родитель: {parentName}
              </Text>
            </View>
          )}

          {parentCode.length >= 10 && !codeValid && !isValidatingCode && (
            <View style={styles.codeInvalidContainer}>
              <Text style={styles.codeInvalidText}>
                ❌ Код не найден или недействителен
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <User size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ваше имя"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ваш возраст (4-15 лет)"
              placeholderTextColor={theme.textSecondary}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              (!codeValid || isLoading) && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!codeValid || isLoading}
            testID="register-child-submit-button"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText} testID="register-child-submit-text">Зарегистрироваться</Text>
            )}
          </TouchableOpacity>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Нет кода? Попросите у родителя код для регистрации
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/role-selection' as Href)}
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
    fontFamily: 'monospace',
  },
  codeValidContainer: {
    backgroundColor: theme.success + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeValidText: {
    color: theme.success,
    fontSize: 14,
    fontWeight: '600',
  },
  codeInvalidContainer: {
    backgroundColor: theme.danger + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeInvalidText: {
    color: theme.danger,
    fontSize: 14,
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
  helpContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});
