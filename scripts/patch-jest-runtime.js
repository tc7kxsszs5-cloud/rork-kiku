#!/usr/bin/env node
/**
 * Патч jest-runtime для Node 20+: обход "Attempted to assign to readonly property"
 * при копировании свойств module.Module. Запускается в postinstall.
 */

const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'jest-runtime', 'build', 'index.js');

if (!fs.existsSync(target)) {
  process.exit(0);
}

let code = fs.readFileSync(target, 'utf8');
const marker = '// Skip readonly properties (Node 20+)';
if (code.includes(marker)) {
  process.exit(0);
}

const old = `Object.entries(_module().default.Module).forEach(([key, value]) => {
      // @ts-expect-error: no index signature
      Module[key] = value;
    });`;

const replacement = `Object.entries(_module().default.Module).forEach(([key, value]) => {
      try {
        // @ts-expect-error: no index signature
        Module[key] = value;
      } catch (_) {
        ${marker}
      }
    });`;

if (code.includes(old)) {
  code = code.replace(old, replacement);
  fs.writeFileSync(target, code);
  console.log('[postinstall] Patched jest-runtime for Node 20+ readonly fix');
}
