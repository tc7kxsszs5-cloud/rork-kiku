/**
 * Custom Jest resolver: handles ESM-style .js imports that map to .ts source files.
 * Backend uses .js extensions in imports (required for ESM compatibility with Vercel),
 * but source files are .ts. This resolver falls back to .ts when .js is not found.
 */
'use strict';

module.exports = (moduleName, options) => {
  // For relative .js imports, try resolving as .ts if .js fails
  if (moduleName.match(/^\.{1,2}\//) && moduleName.endsWith('.js')) {
    const tsModuleName = moduleName.slice(0, -3); // strip .js
    try {
      return options.defaultResolver(tsModuleName, options);
    } catch (_e) {
      // fall through to original name
    }
  }

  return options.defaultResolver(moduleName, options);
};
