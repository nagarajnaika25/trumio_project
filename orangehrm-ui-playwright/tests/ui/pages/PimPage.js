const { expect } = require('@playwright/test');
const { log } = require('../../../utils/logger');
const { Toast } = require('../../../utils/Toast');

class PimPage {
  constructor(page) {
    this.page = page;

    // toast helper
    this.toast = new Toast(page);

    // stable PIM menu locator (href based)
    this.pimMenu = page.locator('a[href*="/pim/viewPimModule"]');

    // tabs
    this.addEmployeeTab = page.getByRole('link', { name: /add employee/i });
    this.employeeListTab = page.getByRole('link', { name: /employee list/i });

    // add employee inputs
    this.firstName = page.getByPlaceholder('First Name');
    this.middleName = page.getByPlaceholder('Middle Name');
    this.lastName = page.getByPlaceholder('Last Name');

    // employee id input
    this.employeeIdInput = page
      .locator('label:has-text("Employee Id")')
      .locator('..')
      .locator('..')
      .locator('input');

    // save button
    this.saveBtn = page.getByRole('button', { name: /^Save$/ });

    // filter panel
    this.employeeInfoPanel = page.locator('.oxd-table-filter-area');

    // employee id filter input
    this.empIdInput = this.employeeInfoPanel.locator(
      '.oxd-input-group:has-text("Employee Id") input'
    );

    // employee name filter input
    this.empNameInput = page.getByRole('textbox', { name: /type for hints/i }).first();
z
    // buttons
    this.searchBtn = page.getByRole('button', { name: /search/i });
    this.resetBtn = page.getByRole('button', { name: /reset/i });
    this.addEmployeeBtn = page.getByRole('button', { name: /add/i });

    // rows
    this.tableRows = page.locator('.oxd-table-body .oxd-table-card');

    // strict-mode safe "No Records Found" (table only, not toast)
    this.noRecords = page.locator('.oxd-table-body').getByText('No Records Found');
  }

  async openPIM() {
    // if already inside PIM, skip
    if (/\/pim\//i.test(this.page.url())) {
      await expect(this.employeeListTab).toBeVisible({ timeout: 30000 });
      return;
    }

    // wait menu visible
    await this.pimMenu.waitFor({ state: 'visible', timeout: 30000 });

    // click without waiting for "load" (SPA)
    await this.pimMenu.click({ noWaitAfter: true, timeout: 30000 });

    //  after click, OrangeHRM usually lands on viewEmployeeList
    await this.page.waitForURL(/\/pim\/(viewEmployeeList|viewPimModule)/i, { timeout: 30000 });

    // confirm tabs visible
    await expect(this.employeeListTab).toBeVisible({ timeout: 30000 });
  }

  async gotoAddEmployee() {
    // open add employee tab
    await this.addEmployeeTab.click();

    // wait first name visible
    await expect(this.firstName).toBeVisible({ timeout: 30000 });
  }

  async gotoEmployeeList() {
    // open employee list tab
    await this.employeeListTab.click();

    // wait search button visible
    await expect(this.searchBtn).toBeVisible({ timeout: 30000 });
  }

 async waitForSearchResults() {
  await expect(async () => {
    const rows = await this.tableRows.count();
    const empty = await this.noRecords.count();

    // rows appear OR empty message appears
    expect(rows > 0 || empty > 0).toBeTruthy();
  }).toPass({ timeout: 30000 });
}
  

//  async createEmployee(emp) {

//   // click Add Employee
//   //await this.addEmployeeBtn.click();
//   await this.gotoAddEmployee();

//   // wait form loaded
//   await expect(this.firstName).toBeVisible({ timeout: 30000 });

//   // wait employee id visible
//   await expect(this.employeeIdInput).toBeVisible({ timeout: 30000 });

//   // read generated employee id
//   let employeeId = await this.employeeIdInput.inputValue();

//   // fill names
//   await this.firstName.fill(emp.firstName);
//   await this.middleName.fill(emp.middleName);
//   await this.lastName.fill(emp.lastName);

//   // click save
//   await this.saveBtn.click();

//   // check duplicate id error
//   const duplicateIdError = this.page.getByText(/Employee Id already exists/i);

//   if (await duplicateIdError.isVisible().catch(() => false)) {

//     // generate new id
//     const uniqueSuffix = String(Date.now()).slice(-2);
//     const newId = employeeId.slice(0, -2) + uniqueSuffix;

//     await this.employeeIdInput.fill(newId);
//     employeeId = newId;

//     // click save again
//     await this.saveBtn.click();
//   }

//   // wait success toast
//   await this.toast.expectSuccess();

//   // wait personal details page
//   await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/i, { timeout: 30000 });

//   return {
//     employeeId,
//     fullName: `${emp.firstName} ${emp.lastName}`,
//   };
// }

async createEmployee(emp) {
  log.step('Creating employee...');

  // open Add Employee tab
  await this.gotoAddEmployee();

  // wait employee id visible
  await expect(this.employeeIdInput).toBeVisible({ timeout: 30000 });

  // read generated employee id
  let employeeId = await this.employeeIdInput.inputValue();

  // fill names
  await this.firstName.fill(emp.firstName);
  await this.middleName.fill(emp.middleName || '');
  await this.lastName.fill(emp.lastName);

  // click save
  await this.saveBtn.click();

  // handle duplicate Employee Id error (demo site issue)
  const duplicateIdError = this.page.getByText(/Employee Id already exists/i);

  // if duplicate error appears, change ID and save again
  if (await duplicateIdError.isVisible().catch(() => false)) {
    // make ID unique using timestamp last 4 digits
    const suffix = String(Date.now()).slice(-4);

    // keep length similar (optional)
    const base = employeeId.replace(/\D/g, '') || employeeId;
    const newId = (base.slice(0, Math.max(0, base.length - 4)) + suffix).slice(-6);

    // clear & fill new id
    await this.employeeIdInput.fill('');
    await this.employeeIdInput.fill(newId);

    employeeId = newId;

    // click save again
    await this.saveBtn.click();
  }

  // wait success toast
  await this.toast.expectSuccess();

  // verify personal details page opened
  await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/i, { timeout: 30000 });

  return {
    employeeId,
    fullName: `${emp.firstName} ${emp.lastName}`,
  };
}


  async searchByEmployeeId(id) {
    log.info('Searching by ID', id);

    await this.gotoEmployeeList();

    // reset filters
    await this.resetBtn.click().catch(() => {});
    await expect(this.empIdInput).toBeVisible({ timeout: 30000 });

    // fill id
    await this.empIdInput.fill(id);

    // click search
    await this.searchBtn.click();

    // wait results
    await this.waitForSearchResults();
  }

  async searchByEmployeeName(name) {
    log.info('Searching by name', name);

    await this.gotoEmployeeList();

    // reset filters
    await this.resetBtn.click().catch(() => {});
    await expect(this.empNameInput).toBeVisible({ timeout: 30000 });

    // fill name
    await this.empNameInput.fill(name);

    // pick from suggestions
    await this.empNameInput.press('ArrowDown');
    await this.empNameInput.press('Enter');

    // click search
    await this.searchBtn.click();

    // wait results
    await this.waitForSearchResults();
  }

  async assertEmployeeFound() {
    await expect(this.tableRows.first()).toBeVisible({ timeout: 30000 });
  }

 // PimPage.js



 async assertNoRecords(employeeId) {
  // official empty state
  const emptyState = this.page.locator('.oxd-table-body').getByText('No Records Found');

  // poll until either emptyState visible OR employeeId disappears from table
  await expect(async () => {
    // wait a bit for UI to settle
    await this.page.waitForLoadState('networkidle');

    // if empty state visible -> success
    if (await emptyState.isVisible().catch(() => false)) return;

    // else: ensure employee id is not present in any row
    const idCell = this.page.locator('.oxd-table-body').locator(`text="${employeeId}"`);
    const count = await idCell.count();

    expect(count).toBe(0);
  }).toPass({ timeout: 60000 });

 
  // If rows still exist, verify the employeeId is NOT present in Id column (more precise)
  // OrangeHRM table has an "Id" column. Match the cell exactly to avoid partial text matches.
  const idCellExact = this.page
    .locator('.oxd-table-body .oxd-table-card')
    .locator(`text="${employeeId}"`);

  await expect(idCellExact).toHaveCount(0, { timeout: 30000 });
}

  async openFirstResult() {
    const firstRow = this.tableRows.first();
    await expect(firstRow).toBeVisible({ timeout: 30000 });
    await firstRow.click();
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/i, { timeout: 30000 });
  }

async deleteFirstResult() {
  log.step('Deleting employee...');

  const firstRow = this.tableRows.first();
  await expect(firstRow).toBeVisible({ timeout: 30000 });

  // click delete icon (last button)
  await firstRow.locator('button').last().click();

  // confirm delete
  await this.page.getByRole('button', { name: /yes, delete/i }).click();

  // wait toast
  await this.toast.expectSuccess();

  // IMPORTANT: wait for table to refresh
  await this.page.waitForLoadState('networkidle');

  // also wait until row count changes (table rerender)
  await expect(this.tableRows).toHaveCount(0, { timeout: 30000 }).catch(() => {});
} 
}

module.exports = { PimPage };