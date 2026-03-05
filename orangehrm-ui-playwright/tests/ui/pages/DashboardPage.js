const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    // user dropdown
    this.userDropdown = page.locator('.oxd-userdropdown-tab');

    // logout menu item
    this.logoutLink = page.getByRole('menuitem', { name: /logout/i });
  }

  async assertLoaded() {
    // verify dashboard url
    await expect(this.page).toHaveURL(/dashboard/i, { timeout: 30000 });
  }

  async logout() {
    // open dropdown
    await this.userDropdown.click();

    // click logout
    await this.logoutLink.click();

    // verify redirected to login
    await expect(this.page).toHaveURL(/auth\/login/i, { timeout: 30000 });
  }
}

module.exports = { DashboardPage };