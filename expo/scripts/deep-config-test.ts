#!/usr/bin/env bun
/**
 * Глубокие тесты конфигурации проекта
 * Проверяет все критические компоненты, провайдеры, контексты и интеграции
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];
const info: string[] = [];

console.log('🔬 Глубокое тестирование конфигурации проекта...\n');

const projectRoot = process.cwd();

// 1. Проверка структуры провайдеров
console.log('1️⃣ Проверка структуры провайдеров...');
const checkProviders = () => {
  const layoutPath = join(projectRoot, 'app/_layout.tsx');
  if (!existsSync(layoutPath)) {
    errors.push('❌ app/_layout.tsx не найден');
    return;
  }

  const content = readFileSync(layoutPath, 'utf-8');
  
  // Проверка всех провайдеров
  const requiredProviders = [
    'QueryClientProvider',
    'trpc.Provider',
    'AppErrorBoundary',
    'ThemeProvider',
    'AgeComplianceProvider',
    'UserProvider',
    'AuthProvider',
    'AnalyticsProvider',
    'PremiumProvider',
    'ABTestingProvider',
    'PersonalizedAIProvider',
    'MonitoringProvider',
    'ChatBackgroundsProvider',
    'ParentalControlsProvider',
    'GamificationProvider',
    'PredictiveAnalyticsProvider',
    'AIParentingAssistantProvider',
    'ReferralProgramProvider',
    'SyncSettingsProvider',
    'SecuritySettingsProvider',
    'NotificationsProvider',
  ];

  const missingProviders: string[] = [];
  requiredProviders.forEach((provider) => {
    if (!content.includes(provider)) {
      missingProviders.push(provider);
    }
  });

  if (missingProviders.length > 0) {
    errors.push(`❌ Отсутствуют провайдеры: ${missingProviders.join(', ')}`);
  } else {
    console.log(`   ✅ Все ${requiredProviders.length} провайдеров на месте`);
    info.push(`Все ${requiredProviders.length} провайдеров правильно обернуты`);
  }

  // Проверка критического порядка провайдеров
  // UserProvider должен быть перед AuthProvider (AuthProvider использует UserContext)
  const userProviderIndex = content.indexOf('<UserProvider>');
  const authProviderIndex = content.indexOf('<AuthProvider>');
  
  if (userProviderIndex !== -1 && authProviderIndex !== -1) {
    if (userProviderIndex < authProviderIndex) {
      console.log('   ✅ Порядок провайдеров корректный (UserProvider -> AuthProvider)');
    } else {
      warnings.push('⚠️  AuthProvider должен быть внутри UserProvider');
    }
  }
  
  // MonitoringProvider должен быть после UserProvider и AuthProvider
  const monitoringProviderIndex = content.indexOf('<MonitoringProvider>');
  if (monitoringProviderIndex !== -1 && userProviderIndex !== -1) {
    if (monitoringProviderIndex > userProviderIndex) {
      console.log('   ✅ MonitoringProvider правильно размещен после UserProvider');
    } else {
      warnings.push('⚠️  MonitoringProvider должен быть после UserProvider');
    }
  }
};

checkProviders();

// 2. Проверка контекстов
console.log('\n2️⃣ Проверка контекстов...');
const checkContexts = () => {
  const contextsDir = join(projectRoot, 'constants');
  const requiredContexts = [
    'AuthContext',
    'ThemeContext',
    'UserContext',
    'MonitoringContext',
    'SyncSettingsContext',
    'SecuritySettingsContext',
    'NotificationsContext',
    'ParentalControlsContext',
    'ChatBackgroundsContext',
    'PremiumContext',
    'AnalyticsContext',
    'ABTestingContext',
    'AgeComplianceContext',
    'PersonalizedAIContext',
    'GamificationContext',
    'PredictiveAnalyticsContext',
    'AIParentingAssistantContext',
    'ReferralProgramContext',
  ];

  const missingContexts: string[] = [];
  const existingContexts: string[] = [];

  requiredContexts.forEach((context) => {
    const contextPath = join(contextsDir, `${context}.tsx`);
    if (existsSync(contextPath)) {
      existingContexts.push(context);
      
      // Проверка экспорта провайдера и хука
      const content = readFileSync(contextPath, 'utf-8');
      if (!content.includes('Provider') || !content.includes('use')) {
        warnings.push(`⚠️  ${context} может иметь проблемы с экспортом`);
      }
    } else {
      missingContexts.push(context);
    }
  });

  if (missingContexts.length > 0) {
    errors.push(`❌ Отсутствуют контексты: ${missingContexts.join(', ')}`);
  } else {
    console.log(`   ✅ Все ${requiredContexts.length} контекстов на месте`);
  }

  existingContexts.forEach((context) => {
    console.log(`   ✅ ${context}`);
  });
};

checkContexts();

// 3. Проверка роутинга
console.log('\n3️⃣ Проверка роутинга...');
const checkRouting = () => {
  const tabsLayoutPath = join(projectRoot, 'app/(tabs)/_layout.tsx');
  if (!existsSync(tabsLayoutPath)) {
    errors.push('❌ app/(tabs)/_layout.tsx не найден');
    return;
  }

  const content = readFileSync(tabsLayoutPath, 'utf-8');
  
  // Проверка всех вкладок
  const requiredTabs = [
    'index', // Чаты
    'contacts',
    'calls',
    'achievements',
    'lessons',
    'messenger-settings',
    'about',
    'profile',
  ];

  const missingTabs: string[] = [];
  requiredTabs.forEach((tab) => {
    if (!content.includes(`name="${tab}"`)) {
      missingTabs.push(tab);
    }
  });

  if (missingTabs.length > 0) {
    errors.push(`❌ Отсутствуют вкладки: ${missingTabs.join(', ')}`);
  } else {
    console.log(`   ✅ Все ${requiredTabs.length} вкладок настроены`);
  }

  // Проверка файлов вкладок
  const tabsDir = join(projectRoot, 'app/(tabs)');
  requiredTabs.forEach((tab) => {
    const tabFile = join(tabsDir, `${tab}.tsx`);
    if (!existsSync(tabFile)) {
      errors.push(`❌ Файл вкладки не найден: ${tab}.tsx`);
    } else {
      console.log(`   ✅ ${tab}.tsx`);
    }
  });
};

checkRouting();

// 4. Проверка интеграции компонентов
console.log('\n4️⃣ Проверка интеграции компонентов...');
const checkComponents = () => {
  const componentsToCheck = [
    { file: 'app/(tabs)/messenger-settings.tsx', imports: ['SyncSettings', 'BiometricAuthSettings'] },
    { file: 'app/(tabs)/index.tsx', imports: ['OnlineStatus', 'SyncStatusIndicator', 'ThemeModeToggle'] },
    { file: 'app/chat/[chatId].tsx', imports: ['OnlineStatus', 'EmojiPicker', 'ChatBackgroundPicker'] },
    { file: 'app/(tabs)/profile.tsx', imports: ['OnlineStatus'] },
  ];

  componentsToCheck.forEach(({ file, imports }) => {
    const filePath = join(projectRoot, file);
    if (!existsSync(filePath)) {
      warnings.push(`⚠️  Файл не найден: ${file}`);
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    const missingImports: string[] = [];

    imports.forEach((imp) => {
      if (!content.includes(imp)) {
        missingImports.push(imp);
      }
    });

    if (missingImports.length > 0) {
      warnings.push(`⚠️  В ${file} отсутствуют импорты: ${missingImports.join(', ')}`);
    } else {
      console.log(`   ✅ ${file} - все импорты на месте`);
    }
  });
};

checkComponents();

// 5. Проверка обработки ошибок
console.log('\n5️⃣ Проверка обработки ошибок...');
const checkErrorHandling = () => {
  const criticalFiles = [
    'app/_layout.tsx',
    'app/(tabs)/index.tsx',
    'app/(tabs)/messenger-settings.tsx',
    'components/settings/SyncSettings.tsx',
    'components/settings/BiometricAuthSettings.tsx',
  ];

  criticalFiles.forEach((file) => {
    const filePath = join(projectRoot, file);
    if (!existsSync(filePath)) {
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    
    // Проверка наличия try-catch или ErrorBoundary
    const hasErrorHandling = 
      content.includes('try') && content.includes('catch') ||
      content.includes('ErrorBoundary') ||
      content.includes('?.') ||
      content.includes('||');

    if (!hasErrorHandling) {
      warnings.push(`⚠️  ${file} может не иметь обработки ошибок`);
    } else {
      console.log(`   ✅ ${file} - обработка ошибок присутствует`);
    }
  });
};

checkErrorHandling();

// 6. Проверка зависимостей
console.log('\n6️⃣ Проверка зависимостей...');
const checkDependencies = () => {
  const packageJsonPath = join(projectRoot, 'package.json');
  if (!existsSync(packageJsonPath)) {
    errors.push('❌ package.json не найден');
    return;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const criticalDeps = [
    'expo',
    'expo-router',
    'react',
    'react-native',
    '@tanstack/react-query',
    '@trpc/client',
    '@trpc/react-query',
    '@trpc/server',
    '@nkzw/create-context-hook',
    'expo-contacts',
    'expo-av',
    'expo-image-picker',
  ];

  const optionalDeps = [
    'expo-camera', // Опционально, используется только для видео звонков
  ];

  const missingDeps: string[] = [];
  const missingOptional: string[] = [];
  
  criticalDeps.forEach((dep) => {
    if (!deps[dep]) {
      missingDeps.push(dep);
    }
  });

  optionalDeps.forEach((dep) => {
    if (!deps[dep]) {
      missingOptional.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    errors.push(`❌ Отсутствуют критические зависимости: ${missingDeps.join(', ')}`);
  } else {
    console.log(`   ✅ Все ${criticalDeps.length} критических зависимостей установлены`);
  }

  if (missingOptional.length > 0) {
    warnings.push(`⚠️  Отсутствуют опциональные зависимости: ${missingOptional.join(', ')}`);
  }
};

checkDependencies();

// 7. Проверка конфигурации Expo
console.log('\n7️⃣ Проверка конфигурации Expo...');
const checkExpoConfig = () => {
  const appJsonPath = join(projectRoot, 'app.json');
  if (!existsSync(appJsonPath)) {
    errors.push('❌ app.json не найден');
    return;
  }

  const appJson = JSON.parse(readFileSync(appJsonPath, 'utf-8'));

  // Проверка обязательных полей
  const requiredFields = ['name', 'slug', 'version', 'splash', 'ios', 'android', 'web'];
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!appJson.expo?.[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    errors.push(`❌ В app.json отсутствуют поля: ${missingFields.join(', ')}`);
  } else {
    console.log('   ✅ Все обязательные поля app.json присутствуют');
  }

  // Проверка плагинов
  const requiredPlugins = ['expo-router', 'expo-font', 'expo-av', 'expo-camera', 'expo-location', 'expo-notifications'];
  const plugins = appJson.expo?.plugins || [];
  
  const missingPlugins: string[] = [];
  requiredPlugins.forEach((plugin) => {
    const pluginName = typeof plugin === 'string' ? plugin : plugin[0];
    if (!plugins.some((p: any) => (typeof p === 'string' ? p : p[0]) === pluginName)) {
      missingPlugins.push(pluginName);
    }
  });

  if (missingPlugins.length > 0) {
    warnings.push(`⚠️  Отсутствуют плагины: ${missingPlugins.join(', ')}`);
  } else {
    console.log('   ✅ Все необходимые плагины настроены');
  }
};

checkExpoConfig();

// 8. Проверка типов TypeScript
console.log('\n8️⃣ Проверка типов TypeScript...');
const checkTypeScript = () => {
  const tsConfigPath = join(projectRoot, 'tsconfig.json');
  if (!existsSync(tsConfigPath)) {
    warnings.push('⚠️  tsconfig.json не найден');
    return;
  }

  const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));

  // Проверка строгого режима
  if (tsConfig.compilerOptions?.strict !== true) {
    warnings.push('⚠️  TypeScript strict mode не включен');
  } else {
    console.log('   ✅ TypeScript strict mode включен');
  }

  // Проверка путей
  if (!tsConfig.compilerOptions?.paths?.['@/*']) {
    warnings.push('⚠️  Алиас @/* не настроен в tsconfig.json');
  } else {
    console.log('   ✅ Алиасы путей настроены');
  }
};

checkTypeScript();

// 9. Проверка импортов и экспортов
console.log('\n9️⃣ Проверка импортов и экспортов...');
const checkImports = () => {
  const criticalFiles = [
    'app/_layout.tsx',
    'app/(tabs)/_layout.tsx',
    'lib/trpc.ts',
  ];

  criticalFiles.forEach((file) => {
    const filePath = join(projectRoot, file);
    if (!existsSync(filePath)) {
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    
    // Проверка на циклические импорты (базовая проверка)
    const imports = content.match(/import.*from\s+['"]@\//g) || [];
    const selfImports = imports.filter((imp) => imp.includes(file.replace(/\.tsx?$/, '')));
    
    if (selfImports.length > 0) {
      warnings.push(`⚠️  ${file} может иметь циклические импорты`);
    }

    // Проверка экспорта по умолчанию
    if (file.includes('_layout.tsx') && !content.includes('export default')) {
      errors.push(`❌ ${file} должен иметь export default`);
    }
  });

  console.log('   ✅ Базовая проверка импортов завершена');
};

checkImports();

// Итоги
console.log('\n' + '='.repeat(60));
console.log('📊 Результаты глубокого тестирования:\n');

if (info.length > 0) {
  console.log('ℹ️  Информация:');
  info.forEach((msg) => console.log(`   ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Предупреждения:');
  warnings.forEach((warning) => console.log(`   ${warning}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Критические ошибки:');
  errors.forEach((error) => console.log(`   ${error}`));
  console.log('');
  console.log('❌ Конфигурация требует исправлений перед запуском.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('✅ Критических ошибок не найдено.');
  console.log('⚠️  Есть предупреждения, но они не блокируют запуск.\n');
  process.exit(0);
} else {
  console.log('✅ Все проверки пройдены успешно!');
  console.log('🚀 Конфигурация полностью готова к запуску и развертыванию!\n');
  process.exit(0);
}
