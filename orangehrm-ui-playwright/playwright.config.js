const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  timeout: 60 * 1000,
  expect: { timeout: 30 * 1000 },

  retries: 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    ...devices['Desktop Chrome'],

    // baseURL MUST end at /web/index.php
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php',

    locale: 'en-US',
    headless: false,
    viewport: { width: 1280, height: 720 },

    actionTimeout: 15 * 1000,
    navigationTimeout: 60 * 1000,

    trace: 'on-first-retry',
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
screenshot: 'on',
  video: 'on',

    
    launchOptions: { slowMo: 100 },
  },

  projects: [{ name: 'chromium' }],
});