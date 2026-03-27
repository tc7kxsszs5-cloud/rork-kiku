import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { useAuth } from '@/constants/AuthContext';

interface OnlineStatusProps {
  userId?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: ViewStyle;
}

/**
 * Компонент статуса онлайн/офлайн
 * Показывает зеленый кружок если пользователь онлайн
 */
export function OnlineStatus({ userId, size = 'medium', showText = false, style }: OnlineStatusProps) {
  const { theme } = useThemeMode();
  const { isAuthenticated } = useAuth();
  const [isOnline, setIsOnline] = useState(true); // По умолчанию онлайн

  useEffect(() => {
    // В реальном приложении здесь будет проверка статуса через API
    // Пока считаем пользователя онлайн, если он аутентифицирован
    setIsOnline(isAuthenticated);
    
    // Обновляем статус каждые 30 секунд
    const interval = setInterval(() => {
      setIsOnline(isAuthenticated);
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);

  const sizeMap = {
    small: 8,
    medium: 12,
    large: 16,
  };

  const dotSize = sizeMap[size];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: isOnline ? '#22c55e' : '#9ca3af',
      borderWidth: 2,
      borderColor: theme.backgroundPrimary || '#fff',
    },
    text: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '500' as const,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dot} />
      {showText && (
        <Text style={styles.text}>
          {isOnline ? 'В сети' : 'Не в сети'}
        </Text>
      )}
    </View>
  );
}
