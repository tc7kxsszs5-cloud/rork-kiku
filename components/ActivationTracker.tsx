import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAnalytics } from '@/constants/AnalyticsContext';
import { trackInstall, trackFirstLaunch, trackSession, isFirstLaunch, isActivated } from '@/utils/activationTracking';

/**
 * Компонент для отслеживания активации и сессий
 * Должен быть внутри AnalyticsProvider
 */
export function ActivationTracker() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const trackAppLaunch = async () => {
      try {
        const installDate = await trackInstall();
        const firstLaunch = await trackFirstLaunch();
        await trackSession();
        
        // Трекинг событий
        if (installDate) {
          trackEvent('app_installed', { timestamp: installDate });
        }
        
        const isFirst = await isFirstLaunch();
        if (isFirst && firstLaunch) {
          trackEvent('app_first_launch', { timestamp: firstLaunch });
        }
        
        trackEvent('session_started', { timestamp: Date.now() });
        
        // Проверка активации (если пользователь уже активирован, но событие не отправлено)
        const activated = await isActivated();
        if (activated) {
          trackEvent('user_activated', { timestamp: Date.now() });
        }
      } catch (error) {
        console.error('[ActivationTracker] Failed to track app launch:', error);
      }
    };

    trackAppLaunch();
  }, [trackEvent]);

  return null;
}
