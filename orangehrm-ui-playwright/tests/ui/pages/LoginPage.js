const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginBtn = page.getByRole('button', { name: /login/i });
    this.invalidCredentials = page.getByText(/invalid credentials/i);
  }

  async goto() {
    // ✅ always correct URL
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      { waitUntil: 'domcontentloaded' }
    );

    await expect(this.username).toBeVisible({ timeout: 30000 });
    await expect(this.password).toBeVisible({ timeout: 30000 });
    await expect(this.loginBtn).toBeVisible({ timeout: 30000 });
  }

  async loginSuccess(username, password) {
    await this.goto();
    await this.username.fill(username);
    await this.password.fill(password);

    await Promise.all([
      this.page.waitForURL(/dashboard/i, { timeout: 60000 }),
      this.loginBtn.click(),
    ]);
  }

  async loginFail(username, password) {
    await this.goto();
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async assertInvalidCredentials() {
    await expect(this.invalidCredentials).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { LoginPage };