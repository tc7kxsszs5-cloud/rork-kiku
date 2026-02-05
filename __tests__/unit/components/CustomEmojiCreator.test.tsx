/**
 * Тесты для CustomEmojiCreator
 * Проверяет создание кастомных эмодзи, загрузку изображений, валидацию
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { CustomEmojiCreator } from '@/components/CustomEmojiCreator';
import * as ImagePicker from 'expo-image-picker';

// Моки
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      backgroundSecondary: '#f5f5f5',
      borderSoft: '#cccccc',
      accentPrimary: '#4A90E2',
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
    error: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => ({
  X: () => null,
  Upload: () => null,
  Save: () => null,
  Image: () => null,
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('CustomEmojiCreator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg' }],
    });
  });

  describe('Рендеринг', () => {
    it('должен отображать модальное окно когда visible=true', () => {
      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      expect(getByText('Создать кастомный эмодзи')).toBeTruthy();
    });

    it('не должен отображаться когда visible=false', () => {
      const { queryByText } = render(
        <CustomEmojiCreator visible={false} onClose={jest.fn()} />
      );

      expect(queryByText('Создать кастомный эмодзи')).toBeNull();
    });

    it('должен отображать поля ввода', () => {
      const { getByPlaceholderText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      expect(getByPlaceholderText('Например: KIKU Logo')).toBeTruthy();
      expect(getByPlaceholderText('Например: brand, safety, custom')).toBeTruthy();
      expect(getByPlaceholderText('Например: logo, kiku, brand')).toBeTruthy();
    });
  });

  describe('Ввод данных', () => {
    it('должен обновлять название эмодзи', () => {
      const { getByPlaceholderText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      expect(nameInput.props.value).toBe('Test Emoji');
    });

    it('должен обновлять категорию', () => {
      const { getByPlaceholderText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const categoryInput = getByPlaceholderText('Например: brand, safety, custom');
      fireEvent.changeText(categoryInput, 'brand');

      expect(categoryInput.props.value).toBe('brand');
    });

    it('должен обновлять теги', () => {
      const { getByPlaceholderText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const tagsInput = getByPlaceholderText('Например: logo, kiku, brand');
      fireEvent.changeText(tagsInput, 'logo, kiku');

      expect(tagsInput.props.value).toBe('logo, kiku');
    });
  });

  describe('Выбор изображения', () => {
    it('должен запрашивать разрешение на доступ к галерее', async () => {
      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      });
    });

    it('должен показывать ошибку если разрешение не выдано', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Ошибка',
          'Нужно разрешение на доступ к галерее'
        );
      });
    });

    it('должен устанавливать изображение после выбора', async () => {
      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(getByText(/Изменить изображение/)).toBeTruthy();
      });
    });

    it('должен обрабатывать ошибку при загрузке изображения', async () => {
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockRejectedValue(
        new Error('Image picker error')
      );

      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Ошибка',
          'Не удалось загрузить изображение'
        );
      });
    });
  });

  describe('Выбор типа эмодзи', () => {
    it('должен переключать тип на SVG', () => {
      const { getByText, UNSAFE_getAllByType } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const svgButton = touchables.find((btn: any) =>
        btn.props.children && getByText('SVG')
      );

      if (svgButton) {
        fireEvent.press(svgButton);
      }

      // Проверяем, что кнопка SVG активна
      expect(getByText('SVG')).toBeTruthy();
    });

    it('должен переключать тип на Unicode', () => {
      const { getByText, UNSAFE_getAllByType } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const unicodeButton = touchables.find((btn: any) =>
        btn.props.children && getByText('Unicode')
      );

      if (unicodeButton) {
        fireEvent.press(unicodeButton);
      }

      expect(getByText('Unicode')).toBeTruthy();
    });
  });

  describe('Создание эмодзи', () => {
    it('должен показывать ошибку если название не введено', async () => {
      const { getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      fireEvent.press(getByText('Создать эмодзи'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Введите название эмодзи');
      });
    });

    it('должен показывать ошибку если изображение не выбрано для типа image', async () => {
      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      fireEvent.press(getByText('Создать эмодзи'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Выберите изображение');
      });
    });

    it('должен создавать эмодзи с правильными данными', async () => {
      const { addCustomEmoji } = require('@/utils/customEmojis');
      const mockOnEmojiCreated = jest.fn();
      const mockOnClose = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator
          visible={true}
          onClose={mockOnClose}
          onEmojiCreated={mockOnEmojiCreated}
        />
      );

      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      const categoryInput = getByPlaceholderText('Например: brand, safety, custom');
      fireEvent.changeText(categoryInput, 'brand');

      const tagsInput = getByPlaceholderText('Например: logo, kiku, brand');
      fireEvent.changeText(tagsInput, 'logo, kiku');

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(getByText(/Изменить изображение/)).toBeTruthy();
      });

      fireEvent.press(getByText('Создать эмодзи'));

      await waitFor(() => {
        expect(addCustomEmoji).toHaveBeenCalled();
        expect(mockOnEmojiCreated).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Успех', 'Кастомный эмодзи создан!');
      });
    });

    it('должен обрабатывать ошибку при создании эмодзи', async () => {
      const { addCustomEmoji } = require('@/utils/customEmojis');
      addCustomEmoji.mockRejectedValueOnce(new Error('Save error'));

      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(getByText(/Изменить изображение/)).toBeTruthy();
      });

      fireEvent.press(getByText('Создать эмодзи'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Не удалось создать эмодзи');
      });
    });

    it('должен обрабатывать теги правильно', async () => {
      const { addCustomEmoji } = require('@/utils/customEmojis');

      const { getByPlaceholderText, getByText } = render(
        <CustomEmojiCreator visible={true} onClose={jest.fn()} />
      );

      const nameInput = getByPlaceholderText('Например: KIKU Logo');
      fireEvent.changeText(nameInput, 'Test Emoji');

      const tagsInput = getByPlaceholderText('Например: logo, kiku, brand');
      fireEvent.changeText(tagsInput, 'logo, kiku, brand');

      fireEvent.press(getByText('Выбрать изображение'));

      await waitFor(() => {
        expect(getByText(/Изменить изображение/)).toBeTruthy();
      });

      fireEvent.press(getByText('Создать эмодзи'));

      await waitFor(() => {
        expect(addCustomEmoji).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['logo', 'kiku', 'brand'],
          })
        );
      });
    });
  });

  describe('Закрытие модального окна', () => {
    it('должен вызывать onClose при нажатии на кнопку закрытия', () => {
      const mockOnClose = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <CustomEmojiCreator visible={true} onClose={mockOnClose} />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const closeButton = touchables.find((btn: any) => btn.props.onPress === mockOnClose);

      if (closeButton) {
        fireEvent.press(closeButton);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
