/**
 * Компонент для создания кастомных эмодзи
 * 
 * Позволяет пользователям:
 * - Загружать изображения как эмодзи
 * - Создавать эмодзи из SVG
 * - Добавлять теги и категории
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { X, Upload, Save, Image as ImageIcon } from 'lucide-react-native';
// Оптимизированный импорт: используем только нужные функции
import {
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import { useThemeMode } from '@/constants/ThemeContext';
import { CustomEmojiData } from './CustomEmoji';
import { addCustomEmoji } from '@/utils/customEmojis';
import { HapticFeedback } from '@/constants/haptics';

interface CustomEmojiCreatorProps {
  visible: boolean;
  onClose: () => void;
  onEmojiCreated?: (emoji: CustomEmojiData) => void;
}

export function CustomEmojiCreator({
  visible,
  onClose,
  onEmojiCreated,
}: CustomEmojiCreatorProps) {
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [emojiType, setEmojiType] = useState<'image' | 'svg' | 'unicode'>('image');

  const pickImage = async () => {
    try {
      const { status } = await requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужно разрешение на доступ к галерее');
        return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        HapticFeedback.light();
      }
    } catch (error) {
      console.error('[CustomEmojiCreator] Failed to pick image:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить изображение');
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название эмодзи');
      return;
    }

    if (emojiType === 'image' && !imageUri) {
      Alert.alert('Ошибка', 'Выберите изображение');
      return;
    }

    try {
      const newEmoji: CustomEmojiData = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        type: emojiType,
        source: imageUri || '',
        category: category.trim() || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      };

      await addCustomEmoji(newEmoji);
      
      HapticFeedback.success();
      Alert.alert('Успех', 'Кастомный эмодзи создан!');
      
      // Сброс формы
      setName('');
      setCategory('');
      setTags('');
      setImageUri(null);
      
      onEmojiCreated?.(newEmoji);
      onClose();
    } catch (error) {
      console.error('[CustomEmojiCreator] Failed to create emoji:', error);
      Alert.alert('Ошибка', 'Не удалось создать эмодзи');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Создать кастомный эмодзи</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Preview */}
            {imageUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              </View>
            )}

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Например: KIKU Logo"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Категория</Text>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Например: brand, safety, custom"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Tags */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Теги (через запятую)</Text>
              <TextInput
                style={styles.input}
                value={tags}
                onChangeText={setTags}
                placeholder="Например: logo, kiku, brand"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* Image Picker */}
            {emojiType === 'image' && (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Upload size={20} color={theme.accentPrimary} />
                <Text style={styles.imagePickerText}>
                  {imageUri ? 'Изменить изображение' : 'Выбрать изображение'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Type Selector */}
            <View style={styles.typeSelector}>
              <Text style={styles.label}>Тип эмодзи</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    emojiType === 'image' && styles.typeButtonActive,
                  ]}
                  onPress={() => setEmojiType('image')}
                >
                  <ImageIcon size={18} color={emojiType === 'image' ? '#fff' : theme.textPrimary} />
                  <Text
                    style={[
                      styles.typeButtonText,
                      emojiType === 'image' && styles.typeButtonTextActive,
                    ]}
                  >
                    Изображение
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    emojiType === 'svg' && styles.typeButtonActive,
                  ]}
                  onPress={() => setEmojiType('svg')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      emojiType === 'svg' && styles.typeButtonTextActive,
                    ]}
                  >
                    SVG
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    emojiType === 'unicode' && styles.typeButtonActive,
                  ]}
                  onPress={() => setEmojiType('unicode')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      emojiType === 'unicode' && styles.typeButtonTextActive,
                    ]}
                  >
                    Unicode
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={!name.trim()}
            >
              <Save size={18} color="#fff" />
              <Text style={styles.createButtonText}>Создать эмодзи</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.backgroundPrimary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSoft,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      padding: 16,
    },
    previewContainer: {
      alignItems: 'center',
      marginBottom: 20,
      padding: 20,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    imagePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      gap: 8,
      borderWidth: 2,
      borderColor: theme.accentPrimary,
      borderStyle: 'dashed',
    },
    imagePickerText: {
      fontSize: 16,
      color: theme.accentPrimary,
      fontWeight: '500',
    },
    typeSelector: {
      marginBottom: 20,
    },
    typeButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: theme.backgroundSecondary,
      gap: 6,
    },
    typeButtonActive: {
      backgroundColor: theme.accentPrimary,
    },
    typeButtonText: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    typeButtonTextActive: {
      color: '#fff',
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.accentPrimary,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      marginTop: 8,
    },
    createButtonDisabled: {
      backgroundColor: theme.backgroundSecondary,
      opacity: 0.5,
    },
    createButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
  });
}
