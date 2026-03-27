#!/usr/bin/env bun

/**
 * Скрипт для проверки подключения к базе данных через Vercel API
 * Использование: bun check-database-vercel.js
 */

import { Client } from 'pg';

console.log('🔍 ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ');
console.log('========================================');
console.log('');

// Получаем DATABASE_URL из Vercel через переменные окружения
// В production Vercel автоматически устанавливает переменные
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не установлен');
  console.error('');
  console.error('Переменная DATABASE_URL должна быть установлена в Vercel.');
  console.error('');
  console.error('Проверьте переменные в Vercel:');
  console.error('  1. Откройте https://vercel.com/dashboard');
  console.error('  2. Выберите проект backend');
  console.error('  3. Settings → Environment Variables');
  console.error('  4. Убедитесь что DATABASE_URL существует для Production');
  console.error('');
  console.error('Или установите локально для тестирования:');
  console.error('  export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"');
  console.error('');
  console.error('Для проверки на Vercel создайте тестовый endpoint или используйте Function Logs.');
  process.exit(1);
}

// Парсим DATABASE_URL
let host, port, database, user, password;
try {
  const url = new URL(DATABASE_URL);
  host = url.hostname;
  port = url.port || 5432;
  database = url.pathname.slice(1) || 'postgres';
  user = url.username;
  password = url.password ? '***' : 'не установлен';
} catch (err) {
  console.error('❌ Неверный формат DATABASE_URL');
  console.error(`   Ошибка: ${err.message}`);
  process.exit(1);
}

console.log('📋 Параметры подключения:');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}`);
console.log(`   User: ${user}`);
console.log(`   Password: ${password}`);
console.log('');

// Проверка подключения через TCP
console.log('📊 Проверка прямого подключения к PostgreSQL...');
console.log('');

try {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Для Supabase
    },
  });

  await client.connect();
  console.log('✅ Подключение установлено!');
  console.log('');

  // Проверка версии PostgreSQL
  const versionResult = await client.query('SELECT version();');
  console.log('📋 Версия PostgreSQL:');
  console.log(`   ${versionResult.rows[0].version.split(',')[0]}`);
  console.log('');

  // Проверка таблиц
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  if (tablesResult.rows.length > 0) {
    console.log('📊 Найденные таблицы:');
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
  } else {
    console.log('📊 Таблицы не найдены (это нормально для нового проекта)');
  }
  console.log('');

  // Проверка расширений
  const extensionsResult = await client.query(`
    SELECT extname 
    FROM pg_extension 
    ORDER BY extname;
  `);

  if (extensionsResult.rows.length > 0) {
    console.log('🔌 Установленные расширения:');
    extensionsResult.rows.forEach((row) => {
      console.log(`   - ${row.extname}`);
    });
  }
  console.log('');

  await client.end();
  console.log('✅ Проверка завершена успешно!');
  process.exit(0);
} catch (err) {
  console.error('❌ Ошибка подключения:');
  console.error(`   ${err.message}`);
  console.error('');
  console.error('Возможные причины:');
  console.error('   1. Неправильный пароль в DATABASE_URL');
  console.error('   2. База данных недоступна');
  console.error('   3. Неправильный формат DATABASE_URL');
  console.error('   4. Проблемы с сетью или SSL');
  console.error('');
  console.error('Проверьте DATABASE_URL в Vercel Dashboard:');
  console.error('   https://vercel.com/dashboard → backend → Settings → Environment Variables');
  process.exit(1);
}
