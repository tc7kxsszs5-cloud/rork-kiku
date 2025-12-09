import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

interface ThemeModeToggleProps {
  variant?: 'compact' | 'expanded';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ThemeModeToggle({ variant = 'compact', style, testID = 'theme-toggle-button' }: ThemeModeToggleProps) {
  const { themeMode, toggleThemeMode, theme } = useThemeMode();
  const isCompact = variant === 'compact';
  const label = themeMode === 'sunrise' ? (isCompact ? 'День' : 'Светлый режим') : (isCompact ? 'Ночь' : 'Ночной режим');

  return (
    <TouchableOpacity
      onPress={() => {
        HapticFeedback.selection();
        toggleThemeMode();
      }}
      style={[
        styles.toggle,
        isCompact ? styles.compact : styles.expanded,
        {
          backgroundColor: theme.chipBackground,
          borderColor: theme.accentPrimary,
        },
        style,
      ]}
      activeOpacity={0.85}
      testID={testID}
    >
      {themeMode === 'sunrise' ? (
        <Sun size={isCompact ? 16 : 20} color={theme.chipText} />
      ) : (
        <Moon size={isCompact ? 16 : 20} color={theme.chipText} />
      )}
      <Text style={[styles.toggleText, { color: theme.chipText }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  compact: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  expanded: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700' as const,
    marginLeft: 8,
  },
});
