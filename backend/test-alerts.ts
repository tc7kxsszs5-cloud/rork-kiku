#!/usr/bin/env bun

/**
 * Тестовый скрипт для проверки синхронизации алертов
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './trpc/app-router.js';

const BACKEND_URL = 'https://backend-three-mauve-67.vercel.app';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

async function testSyncAlerts() {
  console.log('🔍 Тест синхронизации алертов...');
  
  const testData = {
    deviceId: 'test-device-123',
    alerts: [
      {
        id: 'alert-1',
        alertType: 'risk_message',
        severity: 'high' as const,
        title: 'Обнаружено рискованное сообщение',
        description: 'Сообщение содержит небезопасный контент',
        riskLevel: 'high' as const,
        status: 'active' as const,
        createdAt: Date.now(),
      },
    ],
  };

  try {
    const result = await client.sync.alerts.sync.mutate(testData);
    
    if (result.success) {
      console.log('✅ Алерты успешно синхронизированы!');
      console.log('Количество алертов:', result.count);
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

async function testGetAlerts() {
  console.log('\n🔍 Тест получения алертов...');
  
  try {
    const result = await client.sync.alerts.get.query({
      deviceId: 'test-device-123',
    });
    
    if (result.alerts) {
      console.log('✅ Алерты успешно получены!');
      console.log('Количество алертов:', result.count);
      return true;
    } else {
      console.log('❌ Ошибка получения алертов:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка запроса:', error);
    return false;
  }
}

async function runTests() {
  const syncResult = await testSyncAlerts();
  const getResult = await testGetAlerts();
  
  console.log('\n📊 Результаты:');
  console.log('Синхронизация алертов:', syncResult ? '✅' : '❌');
  console.log('Получение алертов:', getResult ? '✅' : '❌');
  
  if (syncResult && getResult) {
    console.log('\n✅ Все тесты алертов пройдены!');
  }
}

runTests().catch(console.error);
