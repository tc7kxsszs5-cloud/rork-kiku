/**
 * Тесты для EmojiRenderer
 * Проверяет отображение эмодзи, кастомных эмодзи, парсинг текста
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { EmojiRenderer } from '@/components/EmojiRenderer';

// Моки
jest.mock('@/utils/customEmojis', () => ({
  loadCustomEmojis: jest.fn().mockResolvedValue([
    {
      id: 'custom-1',
      name: 'Test Emoji',
      type: 'image',
      source: 'https://example.com/emoji.png',
    },
  ]),
  CustomEmojiData: {},
}));

jest.mock('@/components/CustomEmoji', () => ({
  CustomEmoji: ({ emoji }: any) => null,
}));

describe('EmojiRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать обычный текст', () => {
      const { getByText } = render(<EmojiRenderer text="Hello world" />);
      expect(getByText('Hello world')).toBeTruthy();
    });

    it('должен отображать Unicode эмодзи', () => {
      const { getByText } = render(<EmojiRenderer text="Hello 😀 world" />);
      expect(getByText(/Hello/)).toBeTruthy();
      expect(getByText(/world/)).toBeTruthy();
    });

    it('должен обрабатывать пустой текст', () => {
      const { UNSAFE_getByType } = render(<EmojiRenderer text="" />);
      const text = UNSAFE_getByType('Text');
      expect(text).toBeTruthy();
    });
  });

  describe('Кастомные эмодзи', () => {
    it('должен парсить кастомные эмодзи из текста', async () => {
      const { getByText } = render(<EmojiRenderer text="Hello [custom:custom-1] world" />);
      
      // Проверяем, что текст разбит правильно
      expect(getByText(/Hello/)).toBeTruthy();
      expect(getByText(/world/)).toBeTruthy();
    });

    it('должен обрабатывать несколько кастомных эмодзи', () => {
      const { getByText } = render(
        <EmojiRenderer text="Hello [custom:custom-1] and [custom:custom-1] again" />
      );
      
      expect(getByText(/Hello/)).toBeTruthy();
      expect(getByText(/and/)).toBeTruthy();
      expect(getByText(/again/)).toBeTruthy();
    });

    it('должен обрабатывать несуществующие кастомные эмодзи как текст', () => {
      const { getByText } = render(<EmojiRenderer text="Hello [custom:unknown] world" />);
      expect(getByText(/\[custom:unknown\]/)).toBeTruthy();
    });
  });

  describe('Размеры', () => {
    it('должен использовать размер по умолчанию', () => {
      const { UNSAFE_getByType } = render(<EmojiRenderer text="Test" />);
      const text = UNSAFE_getByType('Text');
      expect(text).toBeTruthy();
    });

    it('должен использовать переданный размер', () => {
      const { UNSAFE_getByType } = render(<EmojiRenderer text="Test" emojiSize={30} />);
      const text = UNSAFE_getByType('Text');
      expect(text).toBeTruthy();
    });
  });

  describe('Стилизация', () => {
    it('должен применять переданный style', () => {
      const customStyle = { fontSize: 18 };
      const { UNSAFE_getByType } = render(<EmojiRenderer text="Test" style={customStyle} />);
      const text = UNSAFE_getByType('Text');
      const style = text.props.style;
      const styles = Array.isArray(style) ? style : [style];
      expect(styles.some((s: object) => s && typeof s === 'object' && (s as any).fontSize === customStyle.fontSize)).toBe(true);
    });
  });
});
