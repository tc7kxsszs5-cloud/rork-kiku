/**
 * Компонент для отображения кастомных эмодзи
 * 
 * Поддерживает:
 * - Изображения (PNG, JPG, WebP)
 * - SVG (через react-native-svg)
 * - Анимированные эмодзи (GIF, Lottie)
 */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

export interface CustomEmojiData {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'unicode';
  source: string; // URI для изображения, XML для SVG, или Unicode символ
  category?: string;
  tags?: string[]; // Для поиска
}

interface CustomEmojiProps {
  emoji: CustomEmojiData;
  size?: number;
  onPress?: () => void;
}

export function CustomEmoji({ emoji, size = 32, onPress }: CustomEmojiProps) {
  const renderEmoji = () => {
    switch (emoji.type) {
      case 'image':
        return (
          <Image
            source={{ uri: emoji.source }}
            style={[styles.emojiImage, { width: size, height: size }]}
            resizeMode="contain"
          />
        );

      case 'svg':
        return (
          <View style={[styles.emojiContainer, { width: size, height: size }]}>
            <SvgXml xml={emoji.source} width={size} height={size} />
          </View>
        );

      case 'unicode':
        return (
          <Text style={[styles.emojiText, { fontSize: size }]}>
            {emoji.source}
          </Text>
        );

      default:
        return null;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.emojiWrapper, { width: size + 8, height: size + 8 }]}
        activeOpacity={0.7}
      >
        {renderEmoji()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.emojiWrapper, { width: size + 8, height: size + 8 }]}>
      {renderEmoji()}
    </View>
  );
}

const styles = StyleSheet.create({
  emojiWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  emojiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiImage: {
    borderRadius: 4,
  },
  emojiText: {
    textAlign: 'center',
  },
});
