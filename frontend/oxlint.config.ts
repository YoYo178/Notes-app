import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: ['dist'],

  env: {
    browser: true,
  },

  plugins: ['typescript', 'react'],
});
