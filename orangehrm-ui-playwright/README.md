OrangeHRM UI Automation Framework (Playwright)
Overview

This project implements a UI automation framework using Playwright with JavaScript to test the OrangeHRM demo application.

Application URL:
https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

The framework follows Page Object Model (POM) design and includes automated tests for the employee lifecycle in the PIM module.

Tech Stack

Playwright

JavaScript (Node.js)

Playwright Test Runner

Page Object Model (POM)

Dotenv for environment variables

Project Structure
orangehrm-ui-playwright
│
├── tests
│   └── ui
│       ├── data
│       │   └── employee.factory.js
│       │
│       ├── pages
│       │   ├── LoginPage.js
│       │   ├── DashboardPage.js
│       │   ├── PimPage.js
│       │   └── EmployeeDetailsPage.js
│       │
│       ├── specs
│       │   ├── auth.spec.js
│       │   └── employee.crud.spec.js
│
├── utils
│   ├── logger.js
│   └── Toast.js
│
├── playwright.config.js
├── .env
├── package.json
└── README.md
Test Scenarios Covered
1. Login and Logout

Validate successful login

Validate invalid password

Validate empty username/password

Validate logout workflow

2. Employee Creation (PIM)

Navigate to PIM module

Create new employee

Capture employee ID

Validate success toast message

3. Employee Verification

Verify created employee using:

Employee Name

Employee ID

Job Title filter

4. Personal Details Validation

Update employee personal details

Save employee information

Validate success message

Reload page and verify saved data persists

5. Edit Employee

Update employee details

Save changes

Verify updated values are reflected correctly

6. Delete Employee

Locate employee record

Delete employee from list

Confirm deletion

Validate success toast message

Technical Features Implemented
Test Data Management

Dynamic employee data generation is implemented to avoid duplicate records.

Example:

Auto<timestamp>
Positive and Negative Test Coverage

Positive scenarios:

Successful login

Employee CRUD workflow

Negative scenarios:

Invalid password

Empty login fields

Validation errors

Logging

Custom logger is implemented.

Example logs:

[info] Searching by name
[info] Searching by ID
[info] Searching by Job Title
Success/Error Message Validation

Toast notification helper validates:

Success messages

Error messages

Reports

Playwright HTML report is generated automatically.

To view report:

npx playwright show-report
Setup Instructions
1. Install dependencies
npm install
2. Configure environment variables

Create a .env file:

BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php
3. Run all tests
npx playwright test
4. Run specific test

Example:

npx playwright test tests/ui/specs/auth.spec.js
5. Run tests in headed mode
npx playwright test --headed
6. View report
npx playwright show-report
Framework Highlights

Page Object Model architecture

Modular test design

Reusable components

Centralized logging

Automated reports

Dynamic test data generation

Author

Nagaraj Naik
QA Automation Engineer
Bangalore, India