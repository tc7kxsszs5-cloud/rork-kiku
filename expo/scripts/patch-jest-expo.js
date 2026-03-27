#!/usr/bin/env node
/**
 * Патч jest-expo для решения ESM проблемы с expo-modules-core
 * Запускается в postinstall
 */

const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'jest-expo', 'src', 'preset', 'setup.js');

if (!fs.existsSync(target)) {
  console.log('[postinstall] jest-expo setup.js not found, skipping patch');
  process.exit(0);
}

let code = fs.readFileSync(target, 'utf8');
const marker = '// Patched: ESM import fix for expo-modules-core';

if (code.includes(marker)) {
  console.log('[postinstall] jest-expo already patched');
  process.exit(0);
}

// Ищем строку с require('expo-modules-core/src/polyfill/dangerous-internal')
const old = `const { EventEmitter } = require('expo-modules-core/src/polyfill/dangerous-internal');`;

// Заменяем на безопасный вариант с try-catch
const replacement = `${marker}
let EventEmitter;
try {
  const mod = require('expo-modules-core/src/polyfill/dangerous-internal');
  EventEmitter = mod.EventEmitter || mod.default?.EventEmitter;
} catch (e) {
  // Fallback: создаем заглушку если импорт не удался
  EventEmitter = class EventEmitter {
    addListener() {}
    removeAllListeners() {}
    removeSubscription() {}
  };
}`;

if (code.includes(old)) {
  code = code.replace(old, replacement);
  fs.writeFileSync(target, code);
  console.log('[postinstall] Patched jest-expo/src/preset/setup.js for ESM fix');
} else {
  console.log('[postinstall] Could not find target string in jest-expo setup.js');
  // Попробуем поискать альтернативный вариант
  const alt = `const {EventEmitter} = require('expo-modules-core/src/polyfill/dangerous-internal');`;
  if (code.includes(alt)) {
    code = code.replace(alt, replacement);
    fs.writeFileSync(target, code);
    console.log('[postinstall] Patched jest-expo/src/preset/setup.js for ESM fix (alternative match)');
  }
}
