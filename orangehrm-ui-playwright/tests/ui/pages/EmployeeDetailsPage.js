const { expect } = require('@playwright/test');
const { Toast } = require('../../../utils/Toast');

class EmployeeDetailsPage {
  constructor(page) {
    this.page = page;
    this.toast = new Toast(page);

    // personal details heading
    this.personalDetailsHeading = page.getByRole('heading', { name: /personal details/i });

    // fields (global locators work fine on this page)
this.nickName = page.locator('input.oxd-input').nth(2);
this.otherId = page.locator('input.oxd-input').nth(3);

    // there are multiple save buttons -> pick the first visible one on the page
    this.saveBtn = page.getByRole('button', { name: /^Save$/ }).first();
  }

  async waitForPage() {
    await expect(this.personalDetailsHeading).toBeVisible({ timeout: 30000 });
  }

  async updatePersonalDetails(data) {
    await this.waitForPage();

    await expect(this.nickName).toBeVisible({ timeout: 30000 });
    await this.nickName.fill(data.nickName);

    await expect(this.otherId).toBeVisible({ timeout: 30000 });
    await this.otherId.fill(data.otherId);

    await this.saveBtn.click();

    await this.toast.expectSuccess();
  }
}

module.exports = { EmployeeDetailsPage };