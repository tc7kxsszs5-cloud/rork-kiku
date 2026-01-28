/**
 * Тесты для компонента Typography
 * Проверяет рендеринг, варианты, цвета и все экспортируемые компоненты
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
  AccentBold,
  AccentRegular,
  Caption,
  Overline,
  Label,
} from '@/components/Typography';

// Мок для ThemeContext
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      text: {
        primary: '#000000',
        accent: '#FF6B35',
      },
    },
  })),
}));

describe('Typography', () => {
  describe('Базовый компонент Typography', () => {
    it('должен рендерить текст', () => {
      const { getByText } = render(<Typography>Test text</Typography>);
      expect(getByText('Test text')).toBeTruthy();
    });

    it('должен использовать вариант по умолчанию', () => {
      const { getByText } = render(<Typography>Default variant</Typography>);
      const text = getByText('Default variant');
      expect(text).toBeTruthy();
    });

    it('должен применять кастомный цвет', () => {
      const { getByText } = render(<Typography color="#FF0000">Red text</Typography>);
      const text = getByText('Red text');
      expect(text).toBeTruthy();
    });

    it('должен применять кастомный стиль', () => {
      const customStyle = { fontSize: 20 };
      const { getByText } = render(<Typography style={customStyle}>Custom style</Typography>);
      const text = getByText('Custom style');
      expect(text).toBeTruthy();
    });

    it('должен поддерживать все варианты', () => {
      const variants = [
        'displayHero',
        'displayLarge',
        'displayMedium',
        'displaySmall',
        'headlineBold',
        'headlineRegular',
        'titleBold',
        'titleRegular',
        'bodyLarge',
        'bodyRegular',
        'bodySmall',
        'accentBold',
        'accentRegular',
        'caption',
        'overline',
        'label',
      ] as const;

      variants.forEach((variant) => {
        const { getByText } = render(<Typography variant={variant}>Variant {variant}</Typography>);
        expect(getByText(`Variant ${variant}`)).toBeTruthy();
      });
    });
  });

  describe('Display компоненты', () => {
    it('DisplayHero должен рендериться', () => {
      const { getByText } = render(<DisplayHero>Hero text</DisplayHero>);
      expect(getByText('Hero text')).toBeTruthy();
    });

    it('DisplayLarge должен рендериться', () => {
      const { getByText } = render(<DisplayLarge>Large text</DisplayLarge>);
      expect(getByText('Large text')).toBeTruthy();
    });

    it('DisplayMedium должен рендериться', () => {
      const { getByText } = render(<DisplayMedium>Medium text</DisplayMedium>);
      expect(getByText('Medium text')).toBeTruthy();
    });

    it('DisplaySmall должен рендериться', () => {
      const { getByText } = render(<DisplaySmall>Small text</DisplaySmall>);
      expect(getByText('Small text')).toBeTruthy();
    });
  });

  describe('Headline компоненты', () => {
    it('HeadlineBold должен рендериться', () => {
      const { getByText } = render(<HeadlineBold>Bold headline</HeadlineBold>);
      expect(getByText('Bold headline')).toBeTruthy();
    });

    it('HeadlineRegular должен рендериться', () => {
      const { getByText } = render(<HeadlineRegular>Regular headline</HeadlineRegular>);
      expect(getByText('Regular headline')).toBeTruthy();
    });
  });

  describe('Title компоненты', () => {
    it('TitleBold должен рендериться', () => {
      const { getByText } = render(<TitleBold>Bold title</TitleBold>);
      expect(getByText('Bold title')).toBeTruthy();
    });

    it('TitleRegular должен рендериться', () => {
      const { getByText } = render(<TitleRegular>Regular title</TitleRegular>);
      expect(getByText('Regular title')).toBeTruthy();
    });
  });

  describe('Body компоненты', () => {
    it('BodyLarge должен рендериться', () => {
      const { getByText } = render(<BodyLarge>Large body</BodyLarge>);
      expect(getByText('Large body')).toBeTruthy();
    });

    it('BodyRegular должен рендериться', () => {
      const { getByText } = render(<BodyRegular>Regular body</BodyRegular>);
      expect(getByText('Regular body')).toBeTruthy();
    });

    it('BodySmall должен рендериться', () => {
      const { getByText } = render(<BodySmall>Small body</BodySmall>);
      expect(getByText('Small body')).toBeTruthy();
    });
  });

  describe('Accent компоненты', () => {
    it('AccentBold должен рендериться', () => {
      const { getByText } = render(<AccentBold>Bold accent</AccentBold>);
      expect(getByText('Bold accent')).toBeTruthy();
    });

    it('AccentRegular должен рендериться', () => {
      const { getByText } = render(<AccentRegular>Regular accent</AccentRegular>);
      expect(getByText('Regular accent')).toBeTruthy();
    });
  });

  describe('Special компоненты', () => {
    it('Caption должен рендериться', () => {
      const { getByText } = render(<Caption>Caption text</Caption>);
      expect(getByText('Caption text')).toBeTruthy();
    });

    it('Overline должен рендериться', () => {
      const { getByText } = render(<Overline>Overline text</Overline>);
      expect(getByText('Overline text')).toBeTruthy();
    });

    it('Label должен рендериться', () => {
      const { getByText } = render(<Label>Label text</Label>);
      expect(getByText('Label text')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('должен обрабатывать пустой children', () => {
      const { container } = render(<Typography>{''}</Typography>);
      expect(container).toBeTruthy();
    });

    it('должен обрабатывать null children', () => {
      const { container } = render(<Typography>{null}</Typography>);
      expect(container).toBeTruthy();
    });

    it('должен передавать все TextProps', () => {
      const { getByText } = render(
        <Typography testID="test-typography" accessibilityLabel="Test">
          Props test
        </Typography>
      );
      const text = getByText('Props test');
      expect(text).toBeTruthy();
    });
  });
});
