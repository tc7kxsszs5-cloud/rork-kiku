#!/usr/bin/env bun

/**
 * Тестовый скрипт для проверки регистрации родителя и ребенка
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

async function testRegistration() {
  console.log('🚀 Тест регистрации родителя и ребенка...\n');

  // Тест 1: Регистрация родителя
  console.log('🔍 Тест 1: Регистрация родителя...');
  try {
    const parentResult = await client.auth.registerParent.mutate({
      name: 'Иван Иванов',
      email: `parent_${Date.now()}@example.com`,
      country: 'US',
      state: 'TX',
      coppaConsent: true,
      privacyPolicyAccepted: true,
    });

    console.log('📋 Результат регистрации:', JSON.stringify(parentResult, null, 2));
    
    // Показываем детали ошибки если есть
    if (!parentResult.success) {
      if ('errorCode' in parentResult) {
        console.log('🔍 Код ошибки:', parentResult.errorCode);
      }
      if ('errorDetails' in parentResult) {
        console.log('🔍 Детали:', parentResult.errorDetails);
      }
      if ('errorHint' in parentResult) {
        console.log('🔍 Подсказка:', parentResult.errorHint);
      }
      if ('fullError' in parentResult && parentResult.fullError) {
        console.log('🔍 Полная ошибка:', parentResult.fullError);
      }
    }
    
    if (parentResult.success && parentResult.code) {
      console.log('✅ Родитель зарегистрирован!');
      console.log('Код:', parentResult.code);
      console.log('Parent ID:', parentResult.parentId);
      
      const code = parentResult.code;

      // Тест 2: Проверка кода
      console.log('\n🔍 Тест 2: Проверка кода...');
      const validateResult = await client.auth.validateParentCode.query({ code });
      
      if (validateResult.valid) {
        console.log('✅ Код валиден!');
        console.log('Родитель:', validateResult.parentName);
        console.log('Осталось использований:', validateResult.remainingUses);

        // Тест 3: Регистрация ребенка
        console.log('\n🔍 Тест 3: Регистрация ребенка...');
        const childResult = await client.auth.registerChild.mutate({
          parentCode: code,
          name: 'Маша',
          age: 8,
        });

        if (childResult.success) {
          console.log('✅ Ребенок зарегистрирован!');
          console.log('Child ID:', childResult.childId);
          console.log('Device ID:', childResult.deviceId);
          console.log('Parent ID:', childResult.parentId);
          console.log('UI Version:', childResult.uiVersion);
          console.log('\n✅ Все тесты пройдены!');
        } else {
          console.log('❌ Ошибка регистрации ребенка:', childResult.error);
        }
      } else {
        console.log('❌ Код невалиден:', validateResult.error);
      }
    } else {
      console.log('❌ Ошибка регистрации родителя:', parentResult.error);
    }
  } catch (error) {
    console.log('❌ Ошибка:', error);
    if (error instanceof Error) {
      console.log('Детали:', error.message);
    }
  }
}

testRegistration().catch(console.error);
