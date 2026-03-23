import { expect } from '@playwright/test';


//Handling popup meassages

export class Toast {
  constructor(page) {
    // store page object
    this.page = page;
    // toast container locator (OrangeHRM)
    this.container = page.locator('.oxd-toast-container');
    // toast message locator
    this.message = page.locator('.oxd-toast-container .oxd-text');
  }

  async expectSuccess() {
    // wait until toast container shows up (give more time)
    await expect(this.container).toBeVisible({ timeout: 30000 });
    // validate success text anywhere inside toast
    await expect(this.container).toContainText(/success/i, { timeout: 30000 });
  }


  async expectError() {
    await expect(this.container).toBeVisible({ timeout: 15000 });
    await expect(this.container).toContainText(/error|failed/i);
  }
}

module.exports = { Toast };