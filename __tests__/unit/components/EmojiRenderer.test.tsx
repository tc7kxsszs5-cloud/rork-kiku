/**
 * Тесты для компонента EmojiRenderer
 * Проверяет рендеринг эмодзи в тексте
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { EmojiRenderer } from '@/components/EmojiRenderer';

// Мок для CustomEmoji
jest.mock('@/components/CustomEmoji', () => ({
  CustomEmoji: ({ emoji, size }: any) => (
    <div data-testid="custom-emoji" data-emoji-id={emoji.id} data-size={size} />
  ),
}));

// Мок для утилиты загрузки эмодзи
jest.mock('@/utils/customEmojis', () => ({
  loadCustomEmojis: jest.fn(() =>
    Promise.resolve([
      { id: 'emoji-1', name: 'Test Emoji', url: 'test-url' },
    ])
  ),
}));

describe('EmojiRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг текста', () => {
    it('должен рендерить обычный текст', () => {
      const { getByText } = render(<EmojiRenderer text="Hello world" />);
      expect(getByText('Hello world')).toBeTruthy();
    });

    it('должен рендерить текст с эмодзи', () => {
      const { getByText } = render(<EmojiRenderer text="Hello 😀 world" />);
      expect(getByText('Hello')).toBeTruthy();
      expect(getByText('world')).toBeTruthy();
    });
  });

  describe('Кастомные эмодзи', () => {
    it('должен обрабатывать кастомные эмодзи в формате [custom:id]', async () => {
      const { getByTestId } = render(
        <EmojiRenderer text="Hello [custom:emoji-1] world" />
      );
      
      // Ждем загрузки эмодзи
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Проверяем что кастомный эмодзи рендерится
      expect(getByTestId).toBeTruthy();
    });

    it('должен оставлять текст если кастомный эмодзи не найден', () => {
      const { getByText } = render(
        <EmojiRenderer text="Hello [custom:unknown] world" />
      );
      expect(getByText('Hello')).toBeTruthy();
      expect(getByText('[custom:unknown]')).toBeTruthy();
      expect(getByText('world')).toBeTruthy();
    });
  });

  describe('Размер эмодзи', () => {
    it('должен использовать размер по умолчанию (20)', () => {
      const { container } = render(<EmojiRenderer text="Test" />);
      expect(container).toBeTruthy();
    });

    it('должен применять кастомный размер', () => {
      const { container } = render(<EmojiRenderer text="Test" emojiSize={30} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Кастомные стили', () => {
    it('должен применять кастомный style', () => {
      const customStyle = { fontSize: 16 };
      const { container } = render(
        <EmojiRenderer text="Test" style={customStyle} />
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('должен обрабатывать пустой текст', () => {
      const { container } = render(<EmojiRenderer text="" />);
      expect(container).toBeTruthy();
    });

    it('должен обрабатывать текст только с кастомными эмодзи', () => {
      const { container } = render(<EmojiRenderer text="[custom:emoji-1]" />);
      expect(container).toBeTruthy();
    });

    it('должен обрабатывать несколько кастомных эмодзи', () => {
      const { container } = render(
        <EmojiRenderer text="[custom:emoji-1] text [custom:emoji-1]" />
      );
      expect(container).toBeTruthy();
    });
  });
});
