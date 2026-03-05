Playwright API Automation Framework – Swagger Pet Store
Overview

This project contains an API automation framework built using Playwright with JavaScript to test the Swagger Pet Store API.

API Documentation:
https://petstore.swagger.io/

The framework automates core API operations for Pet and Store endpoints with proper test structure, assertions, logging, and reporting.

Tech Stack

Playwright Test

JavaScript

Node.js

Swagger Pet Store API

Project Structure
API Automation
│
├── tests
│   ├── api
│   │   ├── pet.spec.js
│   │   └── store.spec.js
│   │
│   └── ui
│       └── sample.spec.js
│
├── test-data
│   └── petData.js
│
├── playwright.config.js
├── package.json
└── README.md
Test Scenarios
Pet Endpoints

Add a new pet

Find pet by ID

Update an existing pet

Delete a pet

Negative test – Find pet with invalid ID

Store Endpoints

Place an order for a pet

Find purchase order by ID

Delete purchase order

Negative test – Find order with invalid ID

Framework Features

Modular test structure

Separate folders for API and UI tests

Test data management

Positive and negative test scenarios

API response validation using assertions

Error handling with try/catch

Execution logs for debugging

HTML test execution reports

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd api-automation
2. Install Dependencies
npm install
3. Install Playwright Browsers
npx playwright install
Running Tests
Run All Tests
npm test
Run Only API Tests
npx playwright test tests/api
Test Reports

Playwright automatically generates an HTML report.

To view the report:

npx playwright show-report
Example Test Execution Output
Pet API › Add new pet
Pet API › Find pet by ID
Pet API › Update pet
Pet API › Delete pet

Store API › Place order
Store API › Find order by ID
Store API › Delete order

All tests executed successfully with proper response validation.

Author

Nagaraj Naik
QA Automation Engineer