import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Camera, Image as ImageIcon, Video, X } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
// Оптимизированный импорт: используем только нужные функции
import {
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';

interface StatusCreatorProps {
  onClose: () => void;
  onStatusCreated: (status: { type: 'photo' | 'video'; uri: string; caption?: string }) => void;
}

export function StatusCreator({ onClose, onStatusCreated }: StatusCreatorProps) {
  const { theme } = useThemeMode();
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'photo' | 'video'; uri: string } | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const styles = createStyles(theme);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await requestCameraPermissionsAsync();
      const { status: mediaStatus } = await requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Разрешения', 'Необходимы разрешения для доступа к камере и галерее');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia({ type: 'photo', uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('[StatusCreator] Image picker error:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia({ type: 'photo', uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('[StatusCreator] Camera error:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
        videoMaxDuration: 30, // 30 секунд максимум
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia({ type: 'video', uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('[StatusCreator] Video picker error:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать видео');
    }
  };

  const handleCreate = async () => {
    if (!selectedMedia) {
      Alert.alert('Ошибка', 'Выберите фото или видео');
      return;
    }

    setIsUploading(true);
    try {
      // Здесь будет загрузка на сервер
      // Пока просто передаем данные
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      
      onStatusCreated({
        type: selectedMedia.type,
        uri: selectedMedia.uri,
        caption: caption.trim() || undefined,
      });
      
      onClose();
    } catch (error) {
      console.error('[StatusCreator] Upload error:', error);
      Alert.alert('Ошибка', 'Не удалось создать статус');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Новый статус</Text>
        <TouchableOpacity onPress={handleCreate} disabled={!selectedMedia || isUploading}>
          {isUploading ? (
            <ActivityIndicator color={theme.interactive?.primary || theme.accentPrimary} />
          ) : (
            <Text style={[styles.publishButton, !selectedMedia && styles.publishButtonDisabled]}>
              Опубликовать
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {selectedMedia ? (
        <View style={styles.previewContainer}>
          {selectedMedia.type === 'photo' ? (
            <Image source={{ uri: selectedMedia.uri }} style={styles.preview} />
          ) : (
            <ExpoVideo
              source={{ uri: selectedMedia.uri }}
              style={styles.preview}
              shouldPlay
              isLooping
              resizeMode={ResizeMode.CONTAIN}
            />
          )}
          <TextInput
            style={styles.captionInput}
            placeholder="Добавьте подпись..."
            placeholderTextColor={theme.textSecondary}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={100}
          />
          <TouchableOpacity onPress={() => setSelectedMedia(null)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Удалить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={takePhoto}>
            <Camera size={32} color={theme.interactive?.primary || theme.accentPrimary} />
            <Text style={styles.optionText}>Сделать фото</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={pickImage}>
            <ImageIcon size={32} color={theme.interactive?.primary || theme.accentPrimary} />
            <Text style={styles.optionText}>Выбрать фото</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={pickVideo}>
            <Video size={32} color={theme.interactive?.primary || theme.accentPrimary} />
            <Text style={styles.optionText}>Выбрать видео</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderSoft,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  publishButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.interactive?.primary || theme.accentPrimary,
  },
  publishButtonDisabled: {
    opacity: 0.5,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 32,
  },
  option: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  preview: {
    width: '100%',
    height: '60%',
    borderRadius: 16,
    backgroundColor: '#000',
  },
  captionInput: {
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    fontSize: 16,
    color: theme.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  removeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.danger || '#ef4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
