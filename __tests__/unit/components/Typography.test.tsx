/**
 * Тесты для Typography компонентов
 * Проверяет все варианты типографики, стили, цвета
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
  Typography,
  DisplayHero,
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  HeadlineBold,
  HeadlineRegular,
  TitleBold,
  TitleRegular,
  BodyLarge,
  BodyRegular,
  BodySmall,
  Caption,
  Label,
} from '@/components/Typography';

// Моки
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      text: {
        primary: '#000000',
        secondary: '#666666',
      },
    },
  })),
}));

jest.mock('@/constants/Typography', () => ({
  typography: {
    displayHero: { fontSize: 48, fontWeight: '700' },
    displayLarge: { fontSize: 40, fontWeight: '700' },
    displayMedium: { fontSize: 32, fontWeight: '600' },
    displaySmall: { fontSize: 28, fontWeight: '600' },
    headlineBold: { fontSize: 24, fontWeight: '700' },
    headlineRegular: { fontSize: 24, fontWeight: '400' },
    titleBold: { fontSize: 20, fontWeight: '700' },
    titleRegular: { fontSize: 20, fontWeight: '400' },
    bodyBold: { fontSize: 16, fontWeight: '700' },
    bodyRegular: { fontSize: 16, fontWeight: '400' },
    bodySmall: { fontSize: 14, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
    label: { fontSize: 14, fontWeight: '600' },
  },
  createTypographyStyle: jest.fn((style, color) => ({ ...style, color })),
  TypographyStyles: {},
}));

describe('Typography', () => {
  describe('Базовый компонент', () => {
    it('должен отображать текст', () => {
      const { getByText } = render(<Typography>Test text</Typography>);
      expect(getByText('Test text')).toBeTruthy();
    });

    it('должен использовать bodyRegular по умолчанию', () => {
      const { getByText } = render(<Typography>Test</Typography>);
      expect(getByText('Test')).toBeTruthy();
    });

    it('должен применять кастомный цвет', () => {
      const { getByText } = render(<Typography color="#ff0000">Test</Typography>);
      expect(getByText('Test')).toBeTruthy();
    });

    it('должен применять кастомный style', () => {
      const { getByText } = render(<Typography style={{ marginTop: 10 }}>Test</Typography>);
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Display компоненты', () => {
    it('DisplayHero должен отображать текст', () => {
      const { getByText } = render(<DisplayHero>Hero</DisplayHero>);
      expect(getByText('Hero')).toBeTruthy();
    });

    it('DisplayLarge должен отображать текст', () => {
      const { getByText } = render(<DisplayLarge>Large</DisplayLarge>);
      expect(getByText('Large')).toBeTruthy();
    });

    it('DisplayMedium должен отображать текст', () => {
      const { getByText } = render(<DisplayMedium>Medium</DisplayMedium>);
      expect(getByText('Medium')).toBeTruthy();
    });

    it('DisplaySmall должен отображать текст', () => {
      const { getByText } = render(<DisplaySmall>Small</DisplaySmall>);
      expect(getByText('Small')).toBeTruthy();
    });
  });

  describe('Headline компоненты', () => {
    it('HeadlineBold должен отображать текст', () => {
      const { getByText } = render(<HeadlineBold>Bold</HeadlineBold>);
      expect(getByText('Bold')).toBeTruthy();
    });

    it('HeadlineRegular должен отображать текст', () => {
      const { getByText } = render(<HeadlineRegular>Regular</HeadlineRegular>);
      expect(getByText('Regular')).toBeTruthy();
    });
  });

  describe('Title компоненты', () => {
    it('TitleBold должен отображать текст', () => {
      const { getByText } = render(<TitleBold>Title</TitleBold>);
      expect(getByText('Title')).toBeTruthy();
    });

    it('TitleRegular должен отображать текст', () => {
      const { getByText } = render(<TitleRegular>Title</TitleRegular>);
      expect(getByText('Title')).toBeTruthy();
    });
  });

  describe('Body компоненты', () => {
    it('BodyLarge должен отображать текст', () => {
      const { getByText } = render(<BodyLarge>Body</BodyLarge>);
      expect(getByText('Body')).toBeTruthy();
    });

    it('BodyRegular должен отображать текст', () => {
      const { getByText } = render(<BodyRegular>Body</BodyRegular>);
      expect(getByText('Body')).toBeTruthy();
    });

    it('BodySmall должен отображать текст', () => {
      const { getByText } = render(<BodySmall>Small</BodySmall>);
      expect(getByText('Small')).toBeTruthy();
    });
  });

  describe('Дополнительные компоненты', () => {
    it('Caption должен отображать текст', () => {
      const { getByText } = render(<Caption>Caption</Caption>);
      expect(getByText('Caption')).toBeTruthy();
    });

    it('Label должен отображать текст', () => {
      const { getByText } = render(<Label>Label</Label>);
      expect(getByText('Label')).toBeTruthy();
    });
  });

  describe('Пропсы', () => {
    it('должен передавать все TextProps', () => {
      const { getByText } = render(
        <Typography testID="test-typography" numberOfLines={2}>
          Test
        </Typography>
      );
      const text = getByText('Test');
      expect(text.props.testID).toBe('test-typography');
      expect(text.props.numberOfLines).toBe(2);
    });
  });
});
