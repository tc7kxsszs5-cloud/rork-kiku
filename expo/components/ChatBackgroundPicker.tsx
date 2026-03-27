/**
 * Chat Background Picker Component
 * Allows users to select chat backgrounds
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useChatBackgrounds } from '@/constants/ChatBackgroundsContext';
import { useThemeMode } from '@/constants/ThemeContext';

interface ChatBackgroundPickerProps {
  chatId: string;
  onSelect?: (backgroundId: string) => void;
  visible?: boolean;
  onClose?: () => void;
}

export function ChatBackgroundPicker({ chatId, onSelect, visible = true, onClose }: ChatBackgroundPickerProps) {
  const { backgrounds, setChatBackground } = useChatBackgrounds();
  const { theme } = useThemeMode();
  const styles = createStyles(theme);

  const handleSelect = async (backgroundId: string) => {
    await setChatBackground(chatId, backgroundId);
    onSelect?.(backgroundId);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите фон чата</Text>
      <View style={styles.grid}>
        {backgrounds.map((bg) => (
          <TouchableOpacity
            key={bg.id}
            style={styles.backgroundItem}
            onPress={() => handleSelect(bg.id)}
          >
            <View
              style={[
                styles.backgroundPreview,
                bg.type === 'color' && { backgroundColor: bg.value as string },
                bg.type === 'gradient' && {
                  backgroundColor: Array.isArray(bg.value) ? bg.value[0] : '#FFFFFF',
                },
              ]}
            />
            <Text style={styles.backgroundName}>{bg.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  backgroundItem: {
    alignItems: 'center',
    width: 100,
  },
  backgroundPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  backgroundName: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});
