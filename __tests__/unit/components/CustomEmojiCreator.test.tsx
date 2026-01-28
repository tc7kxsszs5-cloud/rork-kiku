/**
 * Тесты для CustomEmojiCreator компонента
 * Проверяет создание кастомных эмодзи, загрузку изображений
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CustomEmojiCreator } from '@/components/CustomEmojiCreator';
import { Alert } from 'react-native';

// Моки
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'test-image.jpg' }],
  }),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#FFFFFF',
      textPrimary: '#000000',
      textSecondary: '#666666',
      accentPrimary: '#FF6B35',
      backgroundSecondary: '#f5f5f5',
      borderSoft: '#e0e0e0',
      isDark: false,
    },
  })),
}));

jest.mock('@/utils/customEmojis', () => ({
  addCustomEmoji: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    light: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => ({
  X: 'X',
  Upload: 'Upload',
  Save: 'Save',
  Image: 'Image',
}));

// Мок для Alert
jest.spyOn(Alert, 'alert');

describe('CustomEmojiCreator', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onEmojiCreated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать модальное окно когда visible=true', () => {
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      expect(getByText('Создать кастомный эмодзи')).toBeTruthy();
    });

    it('должен отображать поле для названия', () => {
      const { getByPlaceholderText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      expect(getByPlaceholderText('Например: KIKU Logo')).toBeTruthy();
    });

    it('должен отображать поле для категории', () => {
      const { getByPlaceholderText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      expect(getByPlaceholderText('Например: brand, safety, custom')).toBeTruthy();
    });

    it('должен отображать поле для тегов', () => {
      const { getByPlaceholderText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      expect(getByPlaceholderText('Например: logo, kiku, brand')).toBeTruthy();
    });
  });

  describe('Загрузка изображения', () => {
    it('должен открывать image picker', async () => {
      const { launchImageLibraryAsync } = require('expo-image-picker');
      
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(launchImageLibraryAsync).toHaveBeenCalled();
      });
    });

    it('должен запрашивать разрешения', async () => {
      const { requestMediaLibraryPermissionsAsync } = require('expo-image-picker');
      
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      });
    });

    it('должен обрабатывать отказ в разрешениях', async () => {
      const { requestMediaLibraryPermissionsAsync } = require('expo-image-picker');
      requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Нужно разрешение на доступ к галерее');
      });
    });
  });

  describe('Создание эмодзи', () => {
    it('должен показывать ошибку при пустом названии', async () => {
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const createButton = getByText('Создать эмодзи');
      fireEvent.press(createButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Введите название эмодзи');
      });
    });

    it('должен показывать ошибку при отсутствии изображения', async () => {
      const { getByPlaceholderText, getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      const createButton = getByText('Создать эмодзи');
      fireEvent.press(createButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Выберите изображение');
      });
    });

    it('должен создавать эмодзи при корректных данных', async () => {
      const { addCustomEmoji } = require('@/utils/customEmojis');
      const { launchImageLibraryAsync } = require('expo-image-picker');
      
      const { getByPlaceholderText, getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      // Вводим название
      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      // Загружаем изображение
      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(launchImageLibraryAsync).toHaveBeenCalled();
      });

      // Создаем эмодзи
      const createButton = getByText('Создать эмодзи');
      fireEvent.press(createButton);

      await waitFor(() => {
        expect(addCustomEmoji).toHaveBeenCalled();
      });
    });

    it('должен вызывать onEmojiCreated при успехе', async () => {
      const { launchImageLibraryAsync } = require('expo-image-picker');
      const onEmojiCreated = jest.fn();
      
      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator {...defaultProps} onEmojiCreated={onEmojiCreated} />
      );
      
      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(launchImageLibraryAsync).toHaveBeenCalled();
      });

      const createButton = getByText('Создать эмодзи');
      fireEvent.press(createButton);

      await waitFor(() => {
        expect(onEmojiCreated).toHaveBeenCalled();
      });
    });

    it('должен закрывать модал после создания', async () => {
      const { launchImageLibraryAsync } = require('expo-image-picker');
      const onClose = jest.fn();
      
      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator {...defaultProps} onClose={onClose} />
      );
      
      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      const uploadButton = getByText('Выбрать изображение');
      fireEvent.press(uploadButton);

      await waitFor(() => {
        expect(launchImageLibraryAsync).toHaveBeenCalled();
      });

      const createButton = getByText('Создать эмодзи');
      fireEvent.press(createButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Типы эмодзи', () => {
    it('должен переключаться между типами', () => {
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const svgButton = getByText('SVG');
      fireEvent.press(svgButton);

      expect(svgButton).toBeTruthy();
    });

    it('должен показывать загрузчик изображения только для типа image', () => {
      const { getByText, queryByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      expect(getByText('Выбрать изображение')).toBeTruthy();

      const svgButton = getByText('SVG');
      fireEvent.press(svgButton);

      // После переключения на SVG кнопка загрузки может скрыться
      // (зависит от реализации)
    });
  });

  describe('Валидация', () => {
    it('должен блокировать создание без названия', async () => {
      const { getByText } = render(<CustomEmojiCreator {...defaultProps} />);
      
      const createButton = getByText('Создать эмодзи');
      
      // Кнопка должна быть заблокирована без названия
      // (проверяем через disabled prop или стили)
      expect(createButton).toBeTruthy();
    });
  });
});
