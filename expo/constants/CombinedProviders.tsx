/**
 * Объединенные провайдеры для оптимизации производительности
 * Уменьшает количество вложенных провайдеров и улучшает время запуска
 */

import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';
import { AuthProvider } from './AuthContext';
import * as AnalyticsContext from './AnalyticsContext';
import { PremiumProvider } from './PremiumContext';

/**
 * Базовые провайдеры - загружаются сразу (критичные для UI)
 */
export function BaseProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <AuthProvider>
          <AnalyticsContext.AnalyticsProvider>
            <PremiumProvider>
              {children}
            </PremiumProvider>
          </AnalyticsContext.AnalyticsProvider>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

/**
 * Функциональные провайдеры - загружаются после базовых
 * Можно загружать lazy для дальнейшей оптимизации
 */
export function FunctionalProviders({ children }: { children: ReactNode }) {
  const { MonitoringProvider } = require('./MonitoringContext');
  const { ParentalControlsProvider } = require('./ParentalControlsContext');
  const { NotificationsProvider } = require('./NotificationsContext');
  const { SyncSettingsProvider } = require('./SyncSettingsContext');
  const { SecuritySettingsProvider } = require('./SecuritySettingsContext');
  const { ChatBackgroundsProvider } = require('./ChatBackgroundsContext');

  return (
    <MonitoringProvider>
      <ChatBackgroundsProvider>
        <ParentalControlsProvider>
          <SyncSettingsProvider>
            <SecuritySettingsProvider>
              <NotificationsProvider>
                {children}
              </NotificationsProvider>
            </SecuritySettingsProvider>
          </SyncSettingsProvider>
        </ParentalControlsProvider>
      </ChatBackgroundsProvider>
    </MonitoringProvider>
  );
}

/**
 * AI провайдеры - загружаются lazy (не критичны для первого рендера)
 */
export const LazyAIProviders = React.lazy(() =>
  Promise.all([
    import('./PersonalizedAIContext'),
    import('./AIParentingAssistantContext'),
  ]).then(([PersonalizedAI, AIParentingAssistant]) => ({
    default: ({ children }: { children: ReactNode }) => (
      <PersonalizedAI.PersonalizedAIProvider>
        <AIParentingAssistant.AIParentingAssistantProvider>
          {children}
        </AIParentingAssistant.AIParentingAssistantProvider>
      </PersonalizedAI.PersonalizedAIProvider>
    ),
  }))
);

/**
 * Опциональные провайдеры - загружаются lazy (не критичны)
 */
export const LazyOptionalProviders = React.lazy(() =>
  Promise.all([
    import('./ABTestingContext'),
    import('./GamificationContext'),
    import('./PredictiveAnalyticsContext'),
    import('./ReferralProgramContext'),
    import('./AgeComplianceContext'),
  ]).then(([ABTesting, Gamification, PredictiveAnalytics, ReferralProgram, AgeCompliance]) => ({
    default: ({ children }: { children: ReactNode }) => (
      <AgeCompliance.AgeComplianceProvider>
        <ABTesting.ABTestingProvider>
          <Gamification.GamificationProvider>
            <PredictiveAnalytics.PredictiveAnalyticsProvider>
              <ReferralProgram.ReferralProgramProvider>
                {children}
              </ReferralProgram.ReferralProgramProvider>
            </PredictiveAnalytics.PredictiveAnalyticsProvider>
          </Gamification.GamificationProvider>
        </ABTesting.ABTestingProvider>
      </AgeCompliance.AgeComplianceProvider>
    ),
  }))
);
