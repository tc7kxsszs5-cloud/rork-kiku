#!/usr/bin/env bun

/**
 * Тестовый скрипт для проверки синхронизации настроек
 * Использует правильный формат для @hono/trpc-server
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './trpc/app-router.js';

const BACKEND_URL = 'https://backend-three-mauve-67.vercel.app';

// Создаем tRPC клиент
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

// Тест 1: Проверка подключения
async function testConnection() {
  console.log('🔍 Тест 1: Проверка подключения к Supabase...');
  
  try {
    const result = await client.test.dbCheck.query();
    
    if (result.success) {
      console.log('✅ Подключение работает!');
      return true;
    } else {
      console.log('❌ Ошибка подключения:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    return false;
  }
}

// Тест 2: Синхронизация настроек
async function testSyncSettings() {
  console.log('\n🔍 Тест 2: Синхронизация настроек...');
  
  const testSettings = {
    timeRestrictionsEnabled: true,
    dailyUsageLimit: 120,
    requireApprovalForNewContacts: true,
    blockUnknownContacts: false,
    imageFilteringEnabled: true,
    locationSharingEnabled: true,
    sosNotificationsEnabled: true,
    guardianEmails: ['parent@example.com'],
    guardianPhones: ['+79001234567'],
    updatedAt: Date.now(),
  };

  const testData = {
    deviceId: 'test-device-123',
    settings: testSettings,
    lastSyncTimestamp: 0,
  };

  try {
    const result = await client.sync.settings.sync.mutate(testData);
    
    if (result.success) {
      console.log('✅ Настройки успешно синхронизированы!');
      console.log('Настройки:', JSON.stringify(result.settings, null, 2));
      return true;
    } else {
      console.log('❌ Ошибка синхронизации:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    if (error instanceof Error) {
      console.log('Детали ошибки:', error.message);
    }
    return false;
  }
}

// Тест 3: Получение настроек
async function testGetSettings() {
  console.log('\n🔍 Тест 3: Получение настроек...');
  
  try {
    const result = await client.sync.settings.get.query({
      deviceId: 'test-device-123',
    });
    
    if (result.settings) {
      console.log('✅ Настройки успешно получены!');
      console.log('Настройки:', JSON.stringify(result.settings, null, 2));
      console.log('Last sync timestamp:', result.lastSyncTimestamp);
      return true;
    } else {
      console.log('❌ Ошибка получения настроек:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    if (error instanceof Error) {
      console.log('Детали ошибки:', error.message);
    }
    return false;
  }
}

// Тест 4: Обновление настроек
async function testUpdateSettings() {
  console.log('\n🔍 Тест 4: Обновление настроек...');
  
  const updatedSettings = {
    timeRestrictionsEnabled: false,
    dailyUsageLimit: 180,
    requireApprovalForNewContacts: false,
    blockUnknownContacts: true,
    imageFilteringEnabled: true,
    locationSharingEnabled: true,
    sosNotificationsEnabled: true,
    guardianEmails: ['parent@example.com', 'guardian@example.com'],
    guardianPhones: ['+79001234567'],
    updatedAt: Date.now(),
  };

  const testData = {
    deviceId: 'test-device-123',
    settings: updatedSettings,
    lastSyncTimestamp: Date.now() - 1000, // Предыдущая синхронизация была секунду назад
  };

  try {
    const result = await client.sync.settings.sync.mutate(testData);
    
    if (result.success) {
      console.log('✅ Настройки успешно обновлены!');
      console.log('Обновленные настройки:', JSON.stringify(result.settings, null, 2));
      return true;
    } else {
      console.log('❌ Ошибка обновления:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    if (error instanceof Error) {
      console.log('Детали ошибки:', error.message);
    }
    return false;
  }
}

// Запуск всех тестов
async function runTests() {
  console.log('🚀 Запуск тестов синхронизации настроек...\n');
  
  const results = {
    connection: await testConnection(),
    syncSettings: await testSyncSettings(),
    getSettings: await testGetSettings(),
    updateSettings: await testUpdateSettings(),
  };
  
  console.log('\n📊 Результаты тестов:');
  console.log('Подключение:', results.connection ? '✅' : '❌');
  console.log('Синхронизация настроек:', results.syncSettings ? '✅' : '❌');
  console.log('Получение настроек:', results.getSettings ? '✅' : '❌');
  console.log('Обновление настроек:', results.updateSettings ? '✅' : '❌');
  
  const allPassed = Object.values(results).every((r) => r);
  
  if (allPassed) {
    console.log('\n✅ Все тесты пройдены!');
  } else {
    console.log('\n❌ Некоторые тесты не прошли');
  }
}

runTests().catch(console.error);
