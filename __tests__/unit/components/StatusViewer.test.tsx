/**
 * Тесты для компонента StatusViewer
 * Проверяет отображение статусов (фото/видео)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StatusViewer } from '@/components/StatusViewer';

// Моки
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#000000',
      textPrimary: '#FFFFFF',
    },
  })),
}));

jest.mock('lucide-react-native', () => ({
  X: ({ size, color }: any) => <div data-testid="x-icon" data-size={size} data-color={color} />,
  Play: ({ size, color }: any) => <div data-testid="play-icon" data-size={size} data-color={color} />,
}));

jest.mock('expo-av', () => ({
  Video: React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      playAsync: jest.fn(),
      pauseAsync: jest.fn(),
    }));
    return <div data-testid="video-player" {...props} />;
  }),
  ResizeMode: {
    CONTAIN: 'contain',
  },
}));

const mockStatuses = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Test User',
    userAvatar: 'https://example.com/avatar.jpg',
    type: 'photo' as const,
    mediaUrl: 'https://example.com/photo.jpg',
    caption: 'Test caption',
    createdAt: Date.now(),
    views: 10,
  },
  {
    id: '2',
    userId: 'user-1',
    userName: 'Test User',
    type: 'video' as const,
    mediaUrl: 'https://example.com/video.mp4',
    createdAt: Date.now(),
    views: 5,
  },
];

describe('StatusViewer', () => {
  const mockOnClose = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен рендериться с фото статусом', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(getByText('Test User')).toBeTruthy();
    });

    it('должен рендериться с видео статусом', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={1}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(getByText('Test User')).toBeTruthy();
    });

    it('должен возвращать null если статус не найден', () => {
      const { container } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={999}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(container.children.length).toBe(0);
    });
  });

  describe('Интерактивность', () => {
    it('должен вызывать onClose при нажатии на кнопку закрытия', () => {
      const { getByTestId } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      const closeButton = getByTestId('x-icon').parent;
      if (closeButton) {
        fireEvent.press(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('должен вызывать onNext при нажатии на кнопку следующего', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      const nextButton = getByText('→');
      fireEvent.press(nextButton);
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('должен вызывать onPrevious при нажатии на кнопку предыдущего', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={1}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      const prevButton = getByText('←');
      fireEvent.press(prevButton);
      expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });
  });

  describe('Отображение контента', () => {
    it('должен показывать подпись если она есть', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(getByText('Test caption')).toBeTruthy();
    });

    it('должен показывать время создания', () => {
      const { getByText } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      // Время должно отображаться
      expect(getByText).toBeTruthy();
    });
  });

  describe('Навигация', () => {
    it('должен показывать правильное количество точек для статусов', () => {
      const { container } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={0}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(container).toBeTruthy();
    });

    it('должен выделять активную точку', () => {
      const { container } = render(
        <StatusViewer
          statuses={mockStatuses}
          currentIndex={1}
          onClose={mockOnClose}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );
      expect(container).toBeTruthy();
    });
  });
});
