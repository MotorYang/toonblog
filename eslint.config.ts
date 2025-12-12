// eslint.config.ts
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist/**', 'build/**'],

    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },

    plugins: {
      react,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      prettier,
      unicorn,
      'jsx-a11y': a11y,
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // 让 import 插件识别 TS 路径和别名
        },
      },
      react: { version: 'detect' },
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
    ],

    rules: {
      // Prettier 格式化作为 ESLint 错误
      'prettier/prettier': 'error',

      // import 插件规则
      'import/no-unresolved': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/prefer-default-export': 'off',

      // import 排序
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Unicorn 插件常用规则
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true, // 默认 camelCase
            pascalCase: true, // 允许 PascalCase
          },
          ignore: [
            '^index$',
            '^vite\\.config',
            '^eslint\\.config',
            '^tsconfig',
            '^prettier\\.config',
            '^.*\\.d\\.ts$',
            '^setupTests$',
          ],
          multipleFileExtensions: false,
        },
      ],

      // React / JSX 调整
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': 'off',

      // jsx-a11y 规则示例（手动启用）
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
    },
  },
]);
