import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import-x';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'import-x': importPlugin,
    },
    rules: {
      // Bulletproof React import boundaries
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // features/* CANNOT import from other features/*
            {
              target: './apps/web/src/features',
              from: './apps/web/src/features',
              except: ['.'],
              message: 'Features cannot import from other features. Use shared/ or app/ instead.',
            },
            // shared/ CANNOT import from features/ or app/
            {
              target: './apps/web/src/shared',
              from: './apps/web/src/features',
              message: 'shared/ cannot import from features/.',
            },
            {
              target: './apps/web/src/shared',
              from: './apps/web/src/app',
              message: 'shared/ cannot import from app/.',
            },
          ],
        },
      ],
    },
  },
];
