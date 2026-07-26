import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: ['**/node_modules/*', '**/*.js', '**/*.mjs'],

  env: {
    node: true,
  },

  plugins: ['typescript'],

  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'warn',
  },
});
