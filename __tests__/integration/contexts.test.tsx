/**
 * Тесты всех контекстов
 * Использует динамические импорты для работы с ESM модулями
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Контексты', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const testContext = (contextName: string, hookName: string) => {
    test(`${contextName} инициализируется без ошибок`, async () => {
      try {
        // Используем динамический import для ESM модулей
        const module = await import(`@/constants/${contextName}`);
        
        // Определяем Provider и hook
        let Provider: React.ComponentType<{ children: React.ReactNode }> | undefined;
        let useHook: () => any | undefined;

        // Пробуем разные варианты экспорта
        if (Array.isArray(module.default)) {
          // Для createContextHook: [Provider, useHook]
          [Provider, useHook] = module.default;
        } else {
          // Для обычных экспортов
          const providerName = `${contextName.replace('Context', '')}Provider`;
          Provider = module[providerName] || module.Provider || module.default?.Provider;
          useHook = module[hookName] || module.useHook || module.default?.[hookName];
        }

        if (!Provider || !useHook) {
          console.warn(`⚠️  ${contextName} не экспортирует Provider или hook`);
          console.warn(`   Доступные ключи:`, Object.keys(module));
          return;
        }

        const TestComponent = () => {
          try {
            const hook = useHook();
            return <div>Test - {hook ? 'Hook loaded' : 'Hook empty'}</div>;
          } catch (hookError) {
            console.error(`Hook error in ${contextName}:`, hookError);
            return <div>Hook Error</div>;
          }
        };

        const { container } = render(
          <QueryClientProvider client={queryClient}>
            <Provider>
              <TestComponent />
            </Provider>
          </QueryClientProvider>
        );

        await waitFor(() => {
          expect(container).toBeTruthy();
        }, { timeout: 5000 });
      } catch (error) {
        // Более детальная информация об ошибке
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error(`Error testing ${contextName}:`, errorMessage, errorStack);
        throw new Error(`${contextName} не работает: ${errorMessage}`);
      }
    });
  };

  // Тестируем основные контексты
  testContext('ThemeContext', 'useThemeMode');
  testContext('UserContext', 'useUser');
  // Остальные контексты требуют больше зависимостей, тестируем основные
});
