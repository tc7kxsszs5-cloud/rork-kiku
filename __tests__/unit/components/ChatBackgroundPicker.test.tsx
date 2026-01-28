/**
 * Тесты для ChatBackgroundPicker компонента
 * Проверяет выбор фонов, рендеринг, взаимодействие
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChatBackgroundPicker } from '@/components/ChatBackgroundPicker';

// Моки
jest.mock('@/constants/ChatBackgroundsContext', () => ({
  useChatBackgrounds: jest.fn(() => ({
    backgrounds: [
      { id: 'bg-1', name: 'Белый', type: 'color', value: '#FFFFFF' },
      { id: 'bg-2', name: 'Синий', type: 'color', value: '#4A90E2' },
      { id: 'bg-3', name: 'Градиент', type: 'gradient', value: ['#FF6B35', '#FFB020'] },
    ],
    setChatBackground: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      text: '#000000',
      textSecondary: '#666666',
      borderSoft: '#e0e0e0',
    },
  })),
}));

describe('ChatBackgroundPicker', () => {
  const defaultProps = {
    chatId: 'chat-1',
    visible: true,
    onSelect: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать компонент когда visible=true', () => {
      const { getByText } = render(<ChatBackgroundPicker {...defaultProps} />);
      
      expect(getByText('Выберите фон чата')).toBeTruthy();
    });

    it('не должен отображаться когда visible=false', () => {
      const { queryByText } = render(
        <ChatBackgroundPicker {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Выберите фон чата')).toBeNull();
    });

    it('должен отображать все доступные фоны', () => {
      const { getByText } = render(<ChatBackgroundPicker {...defaultProps} />);
      
      expect(getByText('Белый')).toBeTruthy();
      expect(getByText('Синий')).toBeTruthy();
      expect(getByText('Градиент')).toBeTruthy();
    });
  });

  describe('Выбор фона', () => {
    it('должен вызывать setChatBackground при выборе', async () => {
      const { useChatBackgrounds } = require('@/constants/ChatBackgroundsContext');
      const setChatBackground = jest.fn().mockResolvedValue(undefined);
      useChatBackgrounds.mockReturnValue({
        backgrounds: [
          { id: 'bg-1', name: 'Белый', type: 'color', value: '#FFFFFF' },
        ],
        setChatBackground,
      });

      const { getByText } = render(<ChatBackgroundPicker {...defaultProps} />);
      const background = getByText('Белый');

      fireEvent.press(background);

      await waitFor(() => {
        expect(setChatBackground).toHaveBeenCalledWith('chat-1', 'bg-1');
      });
    });

    it('должен вызывать onSelect callback', async () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <ChatBackgroundPicker {...defaultProps} onSelect={onSelect} />
      );
      
      const background = getByText('Белый');
      fireEvent.press(background);

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith('bg-1');
      });
    });

    it('должен вызывать onClose после выбора', async () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ChatBackgroundPicker {...defaultProps} onClose={onClose} />
      );
      
      const background = getByText('Белый');
      fireEvent.press(background);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Типы фонов', () => {
    it('должен отображать цветовые фоны', () => {
      const { getByText } = render(<ChatBackgroundPicker {...defaultProps} />);
      
      expect(getByText('Белый')).toBeTruthy();
      expect(getByText('Синий')).toBeTruthy();
    });

    it('должен отображать градиентные фоны', () => {
      const { getByText } = render(<ChatBackgroundPicker {...defaultProps} />);
      
      expect(getByText('Градиент')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('должен работать без опциональных props', () => {
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" />
      );
      
      expect(getByText('Выберите фон чата')).toBeTruthy();
    });

    it('должен работать с onSelect', async () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" onSelect={onSelect} />
      );
      
      const background = getByText('Белый');
      fireEvent.press(background);

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalled();
      });
    });

    it('должен работать с onClose', async () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ChatBackgroundPicker chatId="chat-1" onClose={onClose} />
      );
      
      const background = getByText('Белый');
      fireEvent.press(background);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
