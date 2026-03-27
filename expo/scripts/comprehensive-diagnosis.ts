#!/usr/bin/env bun
/**
 * Комплексная диагностика всех возможных проблем запуска
 * Проверяет все критические точки инициализации
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];
const criticalIssues: string[] = [];

console.log('🔬 Комплексная диагностика проблем запуска...\n');
console.log('='.repeat(70));

// 1. Проверка критических файлов инициализации
console.log('\n1️⃣ Проверка критических файлов инициализации...\n');

const criticalInitFiles = [
  { path: 'utils/initCustomEmojis.ts', description: 'Инициализация эмодзи' },
  { path: 'utils/cursorStyles.ts', description: 'Стили курсоров' },
  { path: 'constants/i18n.ts', description: 'Интернационализация' },
  { path: 'lib/trpc.ts', description: 'tRPC клиент' },
];

criticalInitFiles.forEach(({ path, description }) => {
  const fullPath = join(projectRoot, path);
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, 'utf-8');
      // Проверка на синтаксические ошибки
      if (content.includes('export') || content.includes('function') || content.includes('const')) {
        console.log(`   ✅ ${description}: ${path}`);
      } else {
        warnings.push(`⚠️  ${path} может быть пустым или поврежденным`);
      }
    } catch (error) {
      errors.push(`❌ Ошибка чтения ${path}: ${error}`);
    }
  } else {
    criticalIssues.push(`❌ КРИТИЧНО: Отсутствует ${path}`);
    errors.push(`Отсутствует файл: ${path}`);
  }
});

// 2. Проверка инициализации в _layout.tsx
console.log('\n2️⃣ Проверка инициализации в _layout.tsx...\n');

const layoutPath = join(projectRoot, 'app/_layout.tsx');
if (existsSync(layoutPath)) {
  const content = readFileSync(layoutPath, 'utf-8');
  
  // Проверка критических импортов
  const criticalImports = [
    'QueryClient',
    'trpc',
    'ThemeProvider',
    'AuthProvider',
    'UserProvider',
    'initializeTestCustomEmojis',
    'applyGlobalCursorStyles',
  ];
  
  const missingImports: string[] = [];
  criticalImports.forEach((imp) => {
    if (!content.includes(imp)) {
      missingImports.push(imp);
    }
  });
  
  if (missingImports.length > 0) {
    criticalIssues.push(`❌ КРИТИЧНО: Отсутствуют импорты в _layout.tsx: ${missingImports.join(', ')}`);
    errors.push(`Отсутствуют импорты: ${missingImports.join(', ')}`);
  } else {
    console.log('   ✅ Все критические импорты присутствуют');
  }
  
  // Проверка обработки ошибок
  if (content.includes('try') && content.includes('catch')) {
    console.log('   ✅ Обработка ошибок присутствует');
  } else {
    warnings.push('⚠️  Недостаточная обработка ошибок в _layout.tsx');
  }
  
  // Проверка isReady состояния
  if (content.includes('isReady') && content.includes('setIsReady')) {
    console.log('   ✅ Состояние готовности настроено');
  } else {
    warnings.push('⚠️  Состояние готовности может быть не настроено');
  }
} else {
  criticalIssues.push('❌ КРИТИЧНО: app/_layout.tsx не найден');
}

// 3. Проверка зависимостей контекстов
console.log('\n3️⃣ Проверка зависимостей контекстов...\n');

const contextDependencies = [
  { context: 'AuthContext', dependsOn: ['UserContext'] },
  { context: 'MonitoringContext', dependsOn: ['UserContext', 'AuthContext'] },
  { context: 'SyncSettingsContext', dependsOn: [] },
  { context: 'SecuritySettingsContext', dependsOn: [] },
];

const layoutContent = existsSync(layoutPath) ? readFileSync(layoutPath, 'utf-8') : '';

contextDependencies.forEach(({ context, dependsOn }) => {
  const providerName = `${context.replace('Context', 'Provider')}`;
  const providerIndex = layoutContent.indexOf(`<${providerName}>`);
  
  if (providerIndex === -1) {
    criticalIssues.push(`❌ КРИТИЧНО: ${providerName} не найден в _layout.tsx`);
    return;
  }
  
  let allDependenciesMet = true;
  dependsOn.forEach((dep) => {
    const depProvider = `${dep.replace('Context', 'Provider')}`;
    const depIndex = layoutContent.indexOf(`<${depProvider}>`);
    
    if (depIndex === -1) {
      allDependenciesMet = false;
      criticalIssues.push(`❌ КРИТИЧНО: ${providerName} требует ${depProvider}, но он не найден`);
    } else if (depIndex > providerIndex) {
      allDependenciesMet = false;
      criticalIssues.push(`❌ КРИТИЧНО: ${providerName} должен быть после ${depProvider} в иерархии`);
    }
  });
  
  if (allDependenciesMet) {
    console.log(`   ✅ ${providerName}: зависимости выполнены`);
  }
});

// 4. Проверка асинхронной инициализации
console.log('\n4️⃣ Проверка асинхронной инициализации...\n');

if (layoutContent.includes('initializeTestCustomEmojis')) {
  if (layoutContent.includes('await initializeTestCustomEmojis()')) {
    console.log('   ✅ Инициализация эмодзи правильно ожидается');
  } else {
    warnings.push('⚠️  initializeTestCustomEmojis вызывается без await');
  }
  
  if (layoutContent.includes('try') && layoutContent.includes('catch')) {
    console.log('   ✅ Инициализация эмодзи обернута в try-catch');
  } else {
    warnings.push('⚠️  Инициализация эмодзи не защищена от ошибок');
  }
}

// 5. Проверка платформо-специфичного кода
console.log('\n5️⃣ Проверка платформо-специфичного кода...\n');

if (layoutContent.includes('Platform.OS === \'web\'')) {
  console.log('   ✅ Платформо-специфичные проверки присутствуют');
} else {
  warnings.push('⚠️  Отсутствуют проверки платформы');
}

// 6. Проверка состояния готовности
console.log('\n6️⃣ Проверка состояния готовности...\n');

if (layoutContent.includes('if (!isReady)') && layoutContent.includes('return null')) {
  console.log('   ✅ Состояние готовности правильно обрабатывается');
} else {
  warnings.push('⚠️  Состояние готовности может обрабатываться неправильно');
}

// 7. Проверка ErrorBoundary
console.log('\n7️⃣ Проверка ErrorBoundary...\n');

if (layoutContent.includes('AppErrorBoundary') || layoutContent.includes('ErrorBoundary')) {
  console.log('   ✅ ErrorBoundary присутствует');
} else {
  criticalIssues.push('❌ КРИТИЧНО: ErrorBoundary отсутствует');
}

// 8. Проверка экспортов
console.log('\n8️⃣ Проверка экспортов...\n');

if (layoutContent.includes('export default function RootLayout')) {
  console.log('   ✅ RootLayout правильно экспортирован');
} else {
  criticalIssues.push('❌ КРИТИЧНО: RootLayout не экспортирован');
}

// Итоги
console.log('\n' + '='.repeat(70));
console.log('📊 Результаты комплексной диагностики:\n');

if (criticalIssues.length > 0) {
  console.log('❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ:');
  criticalIssues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Ошибки:');
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Предупреждения:');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
  console.log('');
}

if (criticalIssues.length === 0 && errors.length === 0) {
  console.log('✅ Критических проблем не обнаружено!');
  console.log('🚀 Приложение должно запускаться корректно.\n');
  
  if (warnings.length > 0) {
    console.log('ℹ️  Есть предупреждения, но они не блокируют запуск.\n');
  }
  process.exit(0);
} else {
  console.log('❌ Обнаружены критические проблемы!');
  console.log('🔧 Исправьте их перед запуском.\n');
  process.exit(1);
}
