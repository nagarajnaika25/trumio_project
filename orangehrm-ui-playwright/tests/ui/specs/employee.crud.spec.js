const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PimPage } = require('../pages/PimPage');
const { EmployeeDetailsPage } = require('../pages/EmployeeDetailsPage');
const { log } = require('../../../utils/logger');

test.describe('Employee CRUD', () => {
  test.setTimeout(180000);

  test('UI: Create -> Verify -> Personal details -> Edit -> Delete -> Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PimPage(page);
    const employeeDetailsPage = new EmployeeDetailsPage(page);

    const ts = Date.now();

    const emp = {
      firstName: `Auto${ts}`,
      middleName: '',
      lastName: `User${ts}`,
    };

    const updatedEmp = {
      nickName: `Nick${ts}`,
      otherId: `OID${ts}`,
    };

    log.info(`Starting URL: ${page.url()}`);

    // login
    await loginPage.loginSuccess(
  process.env.OHRM_USERNAME || 'Admin',
  process.env.OHRM_PASSWORD || 'admin123'
);
    await dashboardPage.assertLoaded();

    // open PIM
    await pimPage.openPIM();

    // create employee
    const created = await pimPage.createEmployee(emp);
    const employeeId = created.employeeId;
    const fullName = created.fullName;

    // verify by name
    await pimPage.openPIM();
    await pimPage.searchByEmployeeName(fullName);
    await pimPage.assertEmployeeFound();

    // verify by id
    await pimPage.searchByEmployeeId(employeeId);
    await pimPage.assertEmployeeFound();

    // open details
    await pimPage.openFirstResult();

    // update details
    await employeeDetailsPage.updatePersonalDetails(updatedEmp);

    // delete employee (search by id again)
    await pimPage.openPIM();
    await pimPage.searchByEmployeeId(employeeId);
    await pimPage.assertEmployeeFound();
    await pimPage.deleteFirstResult();

    // verify deleted
    await pimPage.searchByEmployeeId(employeeId);
   await pimPage.assertNoRecords(employeeId);

    // logout
    await dashboardPage.logout();
    await expect(page).toHaveURL(/auth\/login/i);
  });
});