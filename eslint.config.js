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
  ignores: [...(config.ignores ?? []), ".expo/**", "**/.expo/**", ".expo/types/**", "**/.expo/types/**", "dist/**", "**/*.d.ts"],
  linterOptions: {
    ...(config.linterOptions ?? {}),
    reportUnusedDisableDirectives: "off",
  },
}));

module.exports = defineConfig([
  {
    files: [".expo/types/**/*.d.ts", "**/.expo/types/**/*.d.ts"],
    rules: {
      "eslint-comments/no-unused-disable": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  {
    ignores: [".expo/**", "**/.expo/**", "dist/**", "**/*.d.ts"],
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  ...expoConfig,
  {
    files: lintTargets,
    rules: {
      "eslint-comments/no-unused-disable": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
]);
