import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html']],
  use: {
    baseURL: 'https://petstore.swagger.io/v2'
  }
});