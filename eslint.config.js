const { defineConfig } = require('eslint/config');

const lintTargets = [
  "app/**/*.{js,jsx,ts,tsx}",
  "constants/**/*.{js,jsx,ts,tsx}",
  "types/**/*.{js,jsx,ts,tsx}",
  "*.{js,ts,tsx}",
];

const expoConfig = require('eslint-config-expo/flat').map((config) => ({
  ...config,
  files: config.files ?? lintTargets,
  ignores: [...(config.ignores ?? []), ".expo/**", "**/.expo/**", "dist/**"],
}));

module.exports = defineConfig([
  {
    ignores: [".expo/**", "**/.expo/**", "dist/**"],
  },
  ...expoConfig,
  {
    files: lintTargets,
    rules: {
      "eslint-comments/no-unused-disable": "off",
    },
  },
  {
    files: ["**/*"],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
]);
