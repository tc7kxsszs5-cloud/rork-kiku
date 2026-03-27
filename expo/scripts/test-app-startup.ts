#!/usr/bin/env bun
/**
 * Скрипт для тестирования запуска приложения
 * Проверяет все критические компоненты перед запуском
 */

import { existsSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];

console.log('🧪 Тестирование запуска приложения...\n');

// 1. Проверка основных файлов
console.log('1️⃣ Проверка основных файлов...');
const criticalFiles = [
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/index.tsx',
  'constants/AuthContext.tsx',
  'constants/ThemeContext.tsx',
  'constants/UserContext.tsx',
  'lib/trpc.ts',
];

criticalFiles.forEach((file) => {
  const path = join(process.cwd(), file);
  if (!existsSync(path)) {
    errors.push(`❌ Отсутствует файл: ${file}`);
  } else {
    console.log(`   ✅ ${file}`);
  }
});

// 2. Проверка контекстов
console.log('\n2️⃣ Проверка контекстов...');
const contexts = [
  'constants/AuthContext.tsx',
  'constants/ThemeContext.tsx',
  'constants/UserContext.tsx',
  'constants/MonitoringContext.tsx',
  'constants/SyncSettingsContext.tsx',
  'constants/SecuritySettingsContext.tsx',
];

contexts.forEach((file) => {
  const path = join(process.cwd(), file);
  if (!existsSync(path)) {
    errors.push(`❌ Отсутствует контекст: ${file}`);
  } else {
    console.log(`   ✅ ${file}`);
  }
});

// 3. Проверка компонентов
console.log('\n3️⃣ Проверка компонентов...');
const components = [
  'components/settings/SyncSettings.tsx',
  'components/settings/BiometricAuthSettings.tsx',
];

components.forEach((file) => {
  const path = join(process.cwd(), file);
  if (!existsSync(path)) {
    warnings.push(`⚠️  Отсутствует компонент: ${file}`);
  } else {
    console.log(`   ✅ ${file}`);
  }
});

// 4. Проверка конфигурации
console.log('\n4️⃣ Проверка конфигурации...');
const configFiles = [
  'package.json',
  'app.json',
  'tsconfig.json',
];

configFiles.forEach((file) => {
  const path = join(process.cwd(), file);
  if (!existsSync(path)) {
    errors.push(`❌ Отсутствует конфигурация: ${file}`);
  } else {
    console.log(`   ✅ ${file}`);
  }
});

// 5. Проверка зависимостей
console.log('\n5️⃣ Проверка зависимостей...');
try {
  const packageJson = require(join(process.cwd(), 'package.json'));
  const requiredDeps = [
    'expo',
    'expo-router',
    '@tanstack/react-query',
    '@trpc/client',
    '@trpc/react-query',
    'react-native',
  ];

  requiredDeps.forEach((dep) => {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      warnings.push(`⚠️  Отсутствует зависимость: ${dep}`);
    } else {
      console.log(`   ✅ ${dep}`);
    }
  });
} catch (error) {
  errors.push(`❌ Не удалось прочитать package.json: ${error}`);
}

// Итоги
console.log('\n' + '='.repeat(50));
console.log('📊 Результаты тестирования:\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Все проверки пройдены успешно!');
  console.log('🚀 Приложение готово к запуску\n');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('❌ Критические ошибки:');
    errors.forEach((error) => console.log(`   ${error}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Предупреждения:');
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ Приложение не готово к запуску. Исправьте критические ошибки.\n');
    process.exit(1);
  } else {
    console.log('⚠️  Приложение готово, но есть предупреждения.\n');
    process.exit(0);
  }
}
