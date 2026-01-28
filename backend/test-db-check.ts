#!/usr/bin/env bun

/**
 * Проверка подключения к Supabase и существования таблиц
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './trpc/app-router.js';

const BACKEND_URL = process.env.BACKEND_URL || 'https://backend-three-mauve-67.vercel.app';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

async function checkDatabase() {
  console.log('🔍 Проверка подключения к базе данных...\n');
  
  try {
    const result = await client.test.dbCheck.query();
    console.log('✅ Подключение успешно!');
    console.log('Результат:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Ошибка подключения:', error);
    if (error instanceof Error) {
      console.log('Детали:', error.message);
    }
  }
}

checkDatabase().catch(console.error);
