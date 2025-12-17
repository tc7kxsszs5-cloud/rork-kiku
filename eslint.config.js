const { defineConfig } = require('eslint/config');

const lintTargets = [
  'app/**/*.{js,jsx,ts,tsx}',
  'constants/**/*.{js,jsx,ts,tsx}',
  'types/**/*.{js,jsx,ts,tsx}',
  '*.{js,ts,tsx}',
];

const globalIgnores = [
  '.expo/**',
  '**/.expo/**',
  '.expo/types/router.d.ts',
  '**/.expo/types/router.d.ts',
  'dist/**',
  '**/*.d.ts',
];

const expoFlat = require('eslint-config-expo/flat').map((config) => ({
  ...config,
  files: lintTargets,
  ignores: [...(config.ignores ?? []), ...globalIgnores],
  linterOptions: {
    ...(config.linterOptions ?? {}),
    reportUnusedDisableDirectives: false,
  },
}));

module.exports = defineConfig([
  {
    files: ['**/*'],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    ignores: globalIgnores,
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    files: ['.expo/types/router.d.ts', '**/.expo/types/router.d.ts'],
    rules: {
      'eslint-comments/no-unused-disable': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  ...expoFlat,
  {
    files: lintTargets,
    rules: {
      'eslint-comments/no-unused-disable': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
]);
