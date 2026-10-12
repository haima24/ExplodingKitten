// Lint rules. `no-restricted-imports` implements the dependency rules from
// working-artifacts/docs/dev-specs/README.md section 2.1:
//   engine imports nothing; protocol may import engine types and card data;
//   server imports engine and protocol; client imports protocol and only the
//   engine/cards and engine/types entry points (never applyAction or createGame).
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const restrict = (options) => ({ 'no-restricted-imports': ['error', options] });

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'apps/client/public/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  {
    files: ['packages/engine/src/**/*.ts'],
    rules: restrict({
      patterns: [
        {
          regex: '^(?!\.{1,2}/|\./).+',
          message: 'The engine imports nothing outside itself (pure, no DOM, no Node, no packages).',
        },
      ],
    }),
  },
  {
    files: ['packages/protocol/src/**/*.ts'],
    rules: restrict({
      paths: [
        { name: '@wb/engine', message: 'Protocol may import only @wb/engine/types and @wb/engine/cards.' },
        { name: '@wb/server', message: 'Protocol must not depend on the server.' },
        { name: '@wb/client', message: 'Protocol must not depend on the client.' },
      ],
    }),
  },
  {
    files: ['apps/server/src/**/*.ts'],
    rules: restrict({
      paths: [{ name: '@wb/client', message: 'The server must not depend on the client.' }],
    }),
  },
  {
    files: ['apps/client/src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...restrict({
        paths: [
          {
            name: '@wb/engine',
            message: 'The client may import only @wb/engine/cards and @wb/engine/types (never applyAction or createGame).',
          },
          { name: '@wb/server', message: 'The client must not depend on the server.' },
          { name: 'ws', message: 'The client uses the browser WebSocket.' },
        ],
      }),
    },
  },
);
