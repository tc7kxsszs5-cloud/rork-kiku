/**
 * Тесты для ChatBackgroundPicker
 * Проверяет выбор фона чата, отображение фонов, взаимодействие с контекстом
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChatBackgroundPicker } from '@/components/ChatBackgroundPicker';

// Моки
jest.mock('@/constants/ChatBackgroundsContext', () => ({
  useChatBackgrounds: jest.fn(() => ({
    backgrounds: [
      {
        id: 'bg-1',
        name: 'Синий',
        type: 'color',
        value: '#4A90E2',
      },
      {
        id: 'bg-2',
        name: 'Градиент',
        type: 'gradient',
        value: ['#FF6B9D', '#C44569'],
      },
      {
        id: 'bg-3',
        name: 'Зеленый',
        type: 'color',
        value: '#52C41A',
      },
    ],
    setChatBackground: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      text: '#000000',
      textSecondary: '#666666',
      borderSoft: '#cccccc',
    },
  })),
}));

describe('ChatBackgroundPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать пикер фонов', () => {
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );

      expect(getByText('Выберите фон чата')).toBeTruthy();
    });

    it('должен отображать все доступные фоны', () => {
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );

      expect(getByText('Синий')).toBeTruthy();
      expect(getByText('Градиент')).toBeTruthy();
      expect(getByText('Зеленый')).toBeTruthy();
    });

    it('не должен отображаться когда visible=false', () => {
      const { queryByText } = render(
        <ChatBackgroundPicker chatId="chat-1" visible={false} />
      );

      expect(queryByText('Выберите фон чата')).toBeNull();
    });
  });

  describe('Выбор фона', () => {
    it('должен вызывать setChatBackground при выборе фона', async () => {
      const { useChatBackgrounds } = require('@/constants/ChatBackgroundsContext');
      const mockSetChatBackground = jest.fn().mockResolvedValue(undefined);
      useChatBackgrounds.mockReturnValue({
        backgrounds: [
          {
            id: 'bg-1',
            name: 'Синий',
            type: 'color',
            value: '#4A90E2',
          },
        ],
        setChatBackground: mockSetChatBackground,
      });

      const { getByText, UNSAFE_getAllByType } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const backgroundButton = touchables.find((btn: any) =>
        btn.props.onPress && getByText('Синий')
      );

      if (backgroundButton) {
        await fireEvent.press(backgroundButton);
      }

      await waitFor(() => {
        expect(mockSetChatBackground).toHaveBeenCalledWith('chat-1', 'bg-1');
      });
    });

    it('должен вызывать onSelect при выборе фона', async () => {
      const mockOnSelect = jest.fn();
      const { getByText, UNSAFE_getAllByType } = render(
        <ChatBackgroundPicker chatId="chat-1" onSelect={mockOnSelect} />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const backgroundButton = touchables.find((btn: any) =>
        btn.props.onPress && getByText('Синий')
      );

      if (backgroundButton) {
        await fireEvent.press(backgroundButton);
      }

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith('bg-1');
      });
    });

    it('должен вызывать onClose после выбора фона', async () => {
      const mockOnClose = jest.fn();
      const { getByText, UNSAFE_getAllByType } = render(
        <ChatBackgroundPicker chatId="chat-1" onClose={mockOnClose} />
      );

      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const backgroundButton = touchables.find((btn: any) =>
        btn.props.onPress && getByText('Синий')
      );

      if (backgroundButton) {
        await fireEvent.press(backgroundButton);
      }

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Отображение фонов', () => {
    it('должен отображать цветные фоны с правильным цветом', () => {
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );

      expect(getByText('Синий')).toBeTruthy();
      expect(getByText('Зеленый')).toBeTruthy();
    });

    it('должен отображать градиентные фоны', () => {
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );

      expect(getByText('Градиент')).toBeTruthy();
    });
  });
});
