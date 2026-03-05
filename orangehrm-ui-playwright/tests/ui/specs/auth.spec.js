const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Auth', () => {

  test('Positive: valid login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginSuccess(
      process.env.OHRM_USERNAME || 'Admin',
      process.env.OHRM_PASSWORD || 'admin123'
    );
  });

  test('Negative: invalid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFail(
      process.env.OHRM_USERNAME || 'Admin',
      'wrong'
    );

    await loginPage.assertInvalidCredentials();
  });

  test('Negative: empty username/password shows required validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginBtn.click();

    // "Required" should appear for both fields
    await expect(page.getByText(/^Required$/)).toHaveCount(2);
  });

  test('Negative: empty password shows required', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // fill username only
    await loginPage.username.fill(process.env.OHRM_USERNAME || 'Admin');
    await loginPage.loginBtn.click();

    await expect(page.getByText(/^Required$/)).toBeVisible();
  });

  test('Logout: user can logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginSuccess(
      process.env.OHRM_USERNAME || 'Admin',
      process.env.OHRM_PASSWORD || 'admin123'
    );

    await page.locator('.oxd-userdropdown-tab').click();
    await page.getByRole('menuitem', { name: /logout/i }).click();

    await expect(page).toHaveURL(/auth\/login/i);
  });

});