const { test } = require('@playwright/test');

//tear down or taking the screenshot after each test

test.afterEach(async ({ page }, testInfo) =>
{
  if (testInfo.status !== testInfo.expectedStatus) 
  {
    await testInfo.attach('screenshot', 
      {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});