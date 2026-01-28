#!/usr/bin/env bun

/**
 * Тестовый скрипт для проверки синхронизации данных
 * Запуск: bun test-sync.ts
 * Использует правильный формат для @hono/trpc-server
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './trpc/app-router.js';

const BACKEND_URL = process.env.BACKEND_URL || 'https://backend-three-mauve-67.vercel.app';

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
      console.log(JSON.stringify(result, null, 2));
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

// Тест 2: Синхронизация чатов
async function testSyncChats() {
  console.log('\n🔍 Тест 2: Синхронизация чатов...');
  
  const testData = {
    deviceId: 'test-device-123',
    chats: [
      {
        id: 'chat-1',
        contactName: 'Иван',
        contactPhone: '+79001234567',
        lastMessage: 'Привет!',
        lastMessageTimestamp: Date.now(),
        riskLevel: 'safe' as const,
        unreadCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  };

  try {
    const result = await client.sync.chats.sync.mutate(testData);
    
    if (result.success) {
      console.log('✅ Чаты успешно синхронизированы!');
      console.log('Количество чатов:', result.count);
      return true;
    } else {
      console.log('❌ Ошибка синхронизации:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    return false;
  }
}

// Тест 3: Получение чатов
async function testGetChats() {
  console.log('\n🔍 Тест 3: Получение чатов...');
  
  try {
    const result = await client.sync.chats.get.query({
      deviceId: 'test-device-123',
    });
    
    if (result.chats) {
      console.log('✅ Чаты успешно получены!');
      console.log('Количество чатов:', result.count);
      return true;
    } else {
      console.log('❌ Ошибка получения чатов:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    return false;
  }
}

// Запуск всех тестов
async function runTests() {
  console.log('🚀 Запуск тестов синхронизации...\n');
  
  const results = {
    connection: await testConnection(),
    syncChats: await testSyncChats(),
    getChats: await testGetChats(),
  };
  
  console.log('\n📊 Результаты тестов:');
  console.log('Подключение:', results.connection ? '✅' : '❌');
  console.log('Синхронизация чатов:', results.syncChats ? '✅' : '❌');
  console.log('Получение чатов:', results.getChats ? '✅' : '❌');
  
  const allPassed = Object.values(results).every((r) => r);
  
  if (allPassed) {
    console.log('\n✅ Все тесты пройдены!');
  } else {
    console.log('\n❌ Некоторые тесты не прошли');
  }
}

runTests().catch(console.error);
