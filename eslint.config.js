import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.skills/**',
      'apps/**/dist/**',
      'apps/backend/src/shared/database/generated/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['apps/backend/src/**/*.ts', 'apps/backend/vitest.config.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['apps/frontend/src/**/*.{ts,tsx}', 'apps/frontend/vite.config.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];
