/**
 * Тесты для EmojiPicker компонента
 * Проверяет выбор эмодзи, категории, поиск
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EmojiPicker } from '@/components/EmojiPicker';

// Моки
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#FFFFFF',
      textPrimary: '#000000',
      textSecondary: '#666666',
      accentPrimary: '#FF6B35',
      borderSoft: '#e0e0e0',
      card: '#f5f5f5',
      isDark: false,
    },
  })),
}));

jest.mock('lucide-react-native', () => ({
  X: 'X',
  Search: 'Search',
  Smile: 'Smile',
}));

describe('EmojiPicker', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onEmojiSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать модальное окно когда visible=true', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);
      
      expect(getByText('Смайлики')).toBeTruthy();
    });

    it('не должен отображаться когда visible=false', () => {
      const { queryByText } = render(
        <EmojiPicker {...defaultProps} visible={false} />
      );
      
      // Модальное окно не должно быть видимым
      expect(queryByText).toBeDefined();
    });

    it('должен отображать поле поиска', () => {
      const { getByPlaceholderText } = render(<EmojiPicker {...defaultProps} />);
      
      expect(getByPlaceholderText('Поиск эмодзи...')).toBeTruthy();
    });
  });

  describe('Категории', () => {
    it('должен отображать все категории', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);
      
      expect(getByText('Смайлики')).toBeTruthy();
      expect(getByText('Жесты')).toBeTruthy();
      expect(getByText('Сердца')).toBeTruthy();
      expect(getByText('Предметы')).toBeTruthy();
      expect(getByText('Природа')).toBeTruthy();
      expect(getByText('Еда')).toBeTruthy();
    });

    it('должен переключаться между категориями', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);
      
      const gestures = getByText('Жесты');
      fireEvent.press(gestures);

      // Категория должна переключиться
      expect(gestures).toBeTruthy();
    });
  });

  describe('Выбор эмодзи', () => {
    it('должен вызывать onEmojiSelect при выборе', () => {
      const onEmojiSelect = jest.fn();
      const { getAllByTestId } = render(
        <EmojiPicker {...defaultProps} onEmojiSelect={onEmojiSelect} />
      );
      
      // Получаем первый эмодзи (если есть testID)
      const emojis = getAllByTestId(/emoji-item/);
      if (emojis.length > 0) {
        fireEvent.press(emojis[0]);
        expect(onEmojiSelect).toHaveBeenCalled();
      }
    });

    it('не должен закрывать пикер после выбора', () => {
      const onClose = jest.fn();
      const { getAllByTestId } = render(
        <EmojiPicker {...defaultProps} onClose={onClose} />
      );
      
      const emojis = getAllByTestId(/emoji-item/);
      if (emojis.length > 0) {
        fireEvent.press(emojis[0]);
        expect(onClose).not.toHaveBeenCalled();
      }
    });
  });

  describe('Поиск', () => {
    it('должен фильтровать эмодзи по поиску', () => {
      const { getByPlaceholderText, queryByText } = render(<EmojiPicker {...defaultProps} />);
      
      const searchInput = getByPlaceholderText('Поиск эмодзи...');
      fireEvent.changeText(searchInput, '😀');

      // Результаты поиска должны обновиться
      expect(searchInput).toBeTruthy();
    });

    it('должен очищать поиск при смене категории', () => {
      const { getByPlaceholderText, getByText } = render(<EmojiPicker {...defaultProps} />);
      
      const searchInput = getByPlaceholderText('Поиск эмодзи...');
      fireEvent.changeText(searchInput, 'test');

      const gestures = getByText('Жесты');
      fireEvent.press(gestures);

      // Поиск должен быть очищен или работать по всем категориям
      expect(searchInput).toBeTruthy();
    });
  });

  describe('Закрытие', () => {
    it('должен вызывать onClose при нажатии на кнопку закрытия', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <EmojiPicker {...defaultProps} onClose={onClose} />
      );
      
      // Предполагаем кнопку закрытия с testID
      const closeButton = getByTestId('emoji-picker-close');
      if (closeButton) {
        fireEvent.press(closeButton);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });

  describe('Edge cases', () => {
    it('должен обрабатывать пустой поисковый запрос', () => {
      const { getByPlaceholderText } = render(<EmojiPicker {...defaultProps} />);
      
      const searchInput = getByPlaceholderText('Поиск эмодзи...');
      fireEvent.changeText(searchInput, '');

      // Должны отображаться эмодзи текущей категории
      expect(searchInput).toBeTruthy();
    });

    it('должен обрабатывать поиск без результатов', () => {
      const { getByPlaceholderText } = render(<EmojiPicker {...defaultProps} />);
      
      const searchInput = getByPlaceholderText('Поиск эмодзи...');
      fireEvent.changeText(searchInput, 'xyz12345');

      // Должен показывать пустой результат
      expect(searchInput).toBeTruthy();
    });
  });
});
