#!/usr/bin/env bun

/**
 * Скрипт для проверки подключения к Supabase PostgreSQL
 * Использование: bun check-database.js
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Загружаем переменные из .env.local если файл существует
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
  const envVars = envFile.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        let value = trimmed.substring(equalIndex + 1).trim();
        // Убираем кавычки если есть
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key && value) {
          acc[key] = value;
        }
      }
    }
    return acc;
  }, {});
  
  // Устанавливаем переменные окружения
  Object.assign(process.env, envVars);
  
  // Отладочная информация
  if (envVars.DATABASE_URL) {
    console.log('✅ DATABASE_URL загружен из .env.local');
  }
} catch (err) {
  // Файл .env.local не найден, используем переменные окружения системы
  if (err.code !== 'ENOENT') {
    console.warn('⚠️ Ошибка чтения .env.local:', err.message);
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL не установлен');
  console.error('');
  console.error('Установите переменную окружения:');
  console.error('  export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"');
  console.error('');
  console.error('Или получите из Vercel:');
  console.error('  bunx vercel env pull');
  process.exit(1);
}

console.log('🔍 ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ');
console.log('========================================');
console.log('');

// Парсим DATABASE_URL
const url = new URL(DATABASE_URL);
const host = url.hostname;
const port = url.port || 5432;
const database = url.pathname.slice(1) || 'postgres';
const user = url.username;
const password = url.password ? '***' : 'не установлен';

console.log('📋 Параметры подключения:');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}`);
console.log(`   User: ${user}`);
console.log(`   Password: ${password}`);
console.log('');

// Проверка подключения через fetch (для Supabase REST API)
if (host.includes('supabase.co')) {
  const projectRef = host.split('.')[0].replace('db.', '');
  const supabaseUrl = `https://${projectRef}.supabase.co`;
  
  console.log('🌐 Проверка через Supabase REST API...');
  console.log(`   URL: ${supabaseUrl}`);
  console.log('');
  
  // Попытка получить информацию о проекте
  fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY || '',
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log('✅ Supabase REST API доступен');
      } else {
        console.log('⚠️ Supabase REST API недоступен (требуется API key)');
      }
    })
    .catch((err) => {
      console.log('⚠️ Ошибка проверки REST API:', err.message);
    });
}

// Проверка подключения через TCP (требует библиотеку pg)
console.log('');
console.log('📊 Проверка прямого подключения к PostgreSQL...');
console.log('');

// Установите библиотеку: bun add pg
try {
  const { Client } = require('pg');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Для Supabase
    },
  });

  client.connect()
    .then(() => {
      console.log('✅ Подключение установлено!');
      console.log('');
      
      // Проверка версии PostgreSQL
      return client.query('SELECT version();');
    })
    .then((result) => {
      console.log('📋 Версия PostgreSQL:');
      console.log(`   ${result.rows[0].version.split(',')[0]}`);
      console.log('');
      
      // Проверка таблиц
      return client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
    })
    .then((result) => {
      if (result.rows.length > 0) {
        console.log('📊 Найденные таблицы:');
        result.rows.forEach((row) => {
          console.log(`   - ${row.table_name}`);
        });
      } else {
        console.log('📊 Таблицы не найдены (это нормально для нового проекта)');
      }
      console.log('');
      
      // Проверка расширений
      return client.query(`
        SELECT extname 
        FROM pg_extension 
        ORDER BY extname;
      `);
    })
    .then((result) => {
      if (result.rows.length > 0) {
        console.log('🔌 Установленные расширения:');
        result.rows.forEach((row) => {
          console.log(`   - ${row.extname}`);
        });
      }
      console.log('');
      
      client.end();
      console.log('✅ Проверка завершена успешно!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Ошибка подключения:');
      console.error(`   ${err.message}`);
      console.error('');
      console.error('Возможные причины:');
      console.error('   1. Неправильный пароль в DATABASE_URL');
      console.error('   2. База данных недоступна');
      console.error('   3. Неправильный формат DATABASE_URL');
      console.error('');
      console.error('Проверьте DATABASE_URL в Vercel:');
      console.error('   bunx vercel env ls');
      process.exit(1);
    });
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log('⚠️ Библиотека pg не установлена');
    console.log('');
    console.log('Установите библиотеку:');
    console.log('   bun add pg');
    console.log('');
    console.log('Или используйте альтернативные методы проверки:');
    console.log('   1. Через Supabase Dashboard');
    console.log('   2. Через psql (если установлен)');
    console.log('   3. Через Vercel Function Logs');
  } else {
    console.error('❌ Ошибка:', err.message);
  }
  process.exit(1);
}
