# Developer Guide — pw-pomish-starter

This guide explains how the framework is organized, how to write tests, debug failures, and use the three reporting systems for the Restful Booker Platform (RBP).

## What's "POM‑ish"?
- **Selectors** centralized (single source of truth for locators).
- **Actions visible** in tests (don't wrap `click/fill/press` just to wrap them).
- **Helpers** only for repeated sequences (e.g., login/logout admin, navigate to rooms).
- **Fixtures** expose capabilities (`rbp.login`) without giant page classes.

## Writing UI tests
1. Use `src/selectors/*` for locators:
   ```ts
   import { restfulBooker } from '@selectors/rbp';
   const rbp = restfulBooker(page);
   await rbp.usernameInput.fill('admin');
   await rbp.passwordInput.fill('password');
   await rbp.loginButton.click();
   ```
2. If steps repeat across files, create a tiny helper in `src/helpers/*`:
   ```ts
   export async function loginAsAdmin(page: Page) { /* ... */ }
   export async function navigateToRooms(page: Page) { /* ... */ }
   ```
3. If you want discoverable capabilities, expose them via a fixture in `src/fixtures/*`:
   ```ts
   export const test = base.extend({ rbp: async ({ page }, use) => use({ login: ... }) });
   ```

**Example**
```ts
import { test, expect } from '@fixtures/base';
import { restfulBooker } from '@selectors/rbp';

test('admin login and room navigation', async ({ page, rbp }) => {
  await page.goto('/');
  const rbpSelectors = restfulBooker(page);
  await expect(rbpSelectors.heroTitle).toBeVisible();
  
  // Login as admin
  await rbp.loginAsAdmin();
  await expect(rbpSelectors.adminDashboard).toBeVisible();
  
  // Navigate to rooms
  await rbp.navigateToRooms();
  await expect(rbpSelectors.roomCards).toHaveCount({ min: 1 });
});
```

## Visual tests
- Use `toHaveScreenshot('name.png')` and run `stabilizeForSnapshot(page)` first.
- Rebaseline intentionally:
  ```bash
  npx playwright test tests/visual --update-snapshots
  ```

## API tests
- Use Playwright's `request` fixture:
  ```ts
  const res = await request.get('https://automationintesting.online/');
  expect(res.ok()).toBeTruthy();
  ```
- The RBP API provides various endpoints for testing authentication, booking management, and room operations.

## Running tests
```bash
npm test              # all tests (default: Ortoni reporter)
npm run test:e2e      # E2E tests only
npm run test:api      # API tests only
npm run test:visual   # visual tests only
npm run test:chromium # Chrome browser tests
npm run test:edge     # Edge browser tests
npm run test:webkit   # Safari browser tests
npm run test:mobile   # Mobile browser tests
npm run test:ui       # GUI test runner
npm run test:headed   # headed mode
npm run codegen       # Generate tests for RBP

# Reporter-specific commands
npm run test:ortoni   # Run with Ortoni reporter
npm run test:allure   # Run with Allure reporter
npm run test:steps    # Run with Custom Steps reporter
```

## Debugging Failed Tests

### Quick Debugging Commands
```bash
# Debug specific test
npx playwright test --debug tests/e2e/rbp-authentication.spec.ts

# Debug with headed mode
npm run test:headed -- tests/e2e/rbp-authentication.spec.ts

# Debug with UI mode
npm run test:ui -- tests/e2e/rbp-authentication.spec.ts

# Run only failed tests from last run
npm test -- --last-failed

# Run with detailed output
npm test -- --reporter=line
```

### Debugging Techniques

#### 1. Using `page.pause()`
Add `await page.pause()` in your test to open Playwright Inspector:
```ts
test('debug login flow', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens Playwright Inspector
  // Continue debugging step by step
});
```

#### 2. Screenshots and Videos
```ts
test('capture failure details', async ({ page }) => {
  await page.goto('/');
  
  // Take screenshot at any point
  await page.screenshot({ path: 'debug-screenshot.png' });
  
  // Take full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
  
  // Screenshots are automatically captured on failure
});
```

#### 3. Console Logs and Network
```ts
test('debug network issues', async ({ page }) => {
  // Listen to console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Listen to network requests
  page.on('request', request => console.log('REQUEST:', request.url()));
  page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));
  
  await page.goto('/');
});
```

#### 4. Element State Debugging
```ts
test('debug element state', async ({ page }) => {
  await page.goto('/');
  
  const element = page.locator('[data-testid="login-button"]');
  
  // Check if element exists
  console.log('Element count:', await element.count());
  
  // Check element state
  console.log('Is visible:', await element.isVisible());
  console.log('Is enabled:', await element.isEnabled());
  console.log('Text content:', await element.textContent());
  
  // Wait for specific state
  await expect(element).toBeVisible();
});
```

#### 5. API Debugging
```ts
test('debug API calls', async ({ request }) => {
  // Debug API responses
  const response = await request.get('/api/rooms');
  console.log('Status:', response.status());
  console.log('Headers:', await response.headers());
  console.log('Body:', await response.text());
  
  expect(response.ok()).toBeTruthy();
});
```

### Common Debugging Scenarios

#### Flaky Tests
```bash
# Run test multiple times to identify flakiness
for i in {1..5}; do npm test -- tests/e2e/rbp-authentication.spec.ts; done

# Run with retries
npm test -- --retries=3
```

#### Browser-Specific Issues
```bash
# Test on specific browser
npm run test:chromium -- tests/e2e/rbp-authentication.spec.ts
npm run test:edge -- tests/e2e/rbp-authentication.spec.ts
npm run test:webkit -- tests/e2e/rbp-authentication.spec.ts
```

#### Performance Issues
```bash
# Run with trace
npm test -- --trace=on

# Run with video
npm test -- --video=on

# Run with specific timeout
npm test -- --timeout=30000
```

## Reporting Systems

This project supports **three different reporting systems** for comprehensive test result visualization:

### 1. Ortoni Reports (Default)
**Best for**: Quick feedback, lightweight reporting, development

#### Features
- ⚡ **Fast generation** with minimal overhead
- 📊 **Beautiful charts** and visual analytics
- 📈 **Test history** with SQLite database
- 🔄 **Auto-open** reports after test runs
- 📱 **Responsive design** for all devices

#### Usage
```bash
# Run tests with Ortoni reporting
npm run test:ortoni

# View report
npm run show-ortoni-report
```

#### Report Location
- **File**: `ortoni-report/index.html`
- **Data**: `ortoni-report/ortoni-data/`
- **History**: `ortoni-report/ortoni-data-history.sqlite`

### 2. Allure Reports
**Best for**: Detailed analysis, CI/CD integration, historical tracking

#### Features
- 📋 **Rich HTML reports** with comprehensive analytics
- 📊 **Interactive charts** and trend analysis
- 🏷️ **Categories and tags** for test organization
- 📈 **Historical tracking** and trend analysis
- 🔗 **CI/CD integration** with artifact uploads

#### Usage
```bash
# Run tests with Allure reporting
npm run test:allure

# Generate static report
npm run allure:generate

# Serve dynamic report (recommended)
npm run allure:serve

# Open static report
npm run allure:open
```

#### Report Locations
- **Results**: `allure-results/` (JSON files)
- **Static Report**: `allure-report/` (HTML files)
- **Dynamic Server**: Temporary directory

### 3. Custom Steps Reporter
**Best for**: Stakeholder presentations, detailed documentation, step-by-step analysis

#### Features
- 👥 **Stakeholder-friendly** interface with clear descriptions
- 📝 **Step-by-step documentation** with preconditions and postconditions
- 📊 **Dynamic charts** using ApexCharts
- 🎯 **Individual test pages** with full details
- 📱 **Media integration** (screenshots, videos, attachments)

#### Usage
```bash
# Run tests with Custom Steps reporting
npm run test:steps

# View report
npm run steps:open
```

#### Report Location
- **Summary**: `steps-report/summary.html`
- **Individual Tests**: `steps-report/1/`, `steps-report/2/`, etc.

### Choosing the Right Reporter

| Scenario | Recommended Reporter | Why |
|----------|---------------------|-----|
| **Development** | Ortoni | Fast, auto-opens, quick feedback |
| **CI/CD** | Allure | Rich analytics, artifact integration |
| **Stakeholder Demo** | Custom Steps | Clear, non-technical, detailed steps |
| **Debugging** | Allure | Comprehensive error details and traces |
| **Performance Analysis** | Ortoni | Quick charts and trends |

### Reporter Configuration

All reporters are configured in `playwright.config.ts` and can be switched using environment variables:

```bash
# Switch reporters
REPORTER_TYPE=ortoni npm test
REPORTER_TYPE=allure npm test
REPORTER_TYPE=steps npm test
```

## Enhanced Reporting with ortoni-report

This project uses **ortoni-report** for comprehensive test reporting. Here's everything you need to know:

### Configuration

The ortoni-report is configured in `playwright.config.ts`:

```typescript
const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? 'never' : 'always', // Auto-open unless in CI
  folderPath: 'ortoni-report',               // Report directory
  filename: 'index.html',                    // Report filename
  title: 'RBP Test Report',                  // Report title
  showProject: true,                         // Show project info
  projectName: 'RBP Test Suite',             // Project name
  testType: 'E2E',                          // Test type
  authorName: os.userInfo().username,        // Author name
  base64Image: false,                        // Image encoding
  stdIO: false,                              // Include std I/O logs
  meta: {
    'Test Cycle': new Date().toLocaleDateString(),
    version: '0.1.0',
    description: 'Restful Booker Platform test suite',
    release: '0.1',
    platform: os.type(),
  },
};
```

### Features

#### 1. Automatic Browser Opening
- Reports automatically open in your default browser after test runs
- Disabled in CI environments (`CI=true`)
- Manual opening: `npm run show-ortoni-report`

#### 2. Rich Test Metadata
- **Project Information**: Name, version, test cycle, platform
- **Test Details**: Test type, author, description
- **Timestamps**: Test cycle dates and execution times
- **Environment**: OS type, browser versions

#### 3. Test Attachments
- **Screenshots**: Failure screenshots automatically captured
- **Videos**: Test execution recordings (on failure)
- **Traces**: Playwright traces for debugging
- **Error Context**: Detailed error information and stack traces

#### 4. Test History
- **SQLite Database**: `ortoni-data-history.sqlite` tracks all test runs
- **Historical Data**: Compare results across multiple runs
- **Trend Analysis**: Track test stability over time

#### 5. Enhanced UI
- **Interactive Navigation**: Better test result browsing
- **Filtering**: Filter by status, project, or date
- **Search**: Find specific tests or errors quickly
- **Responsive Design**: Works on desktop and mobile

### Report Structure

```
ortoni-report/
├── index.html                    # Main report file
├── ortoni-data/                 # Report data directory
│   ├── attachments/             # Test attachments
│   │   └── [test-id]/           # Per-test attachments
│   │       ├── test-failed-1.png
│   │       ├── video.webm
│   │       ├── trace.zip
│   │       └── error-context.html
│   └── ...
├── ortoni-data-history.sqlite   # Test history database
└── trace/                       # Trace assets
```

### Usage Examples

#### Running Tests with Auto-Report
```bash
# All tests (report opens automatically)
npm test

# Specific test suites
npm run test:e2e
npm run test:api
npm run test:visual

# Browser-specific tests
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile

# Headed mode with reporting
npm run test:headed
```

#### Manual Report Access
```bash
# Open ortoni-report manually
npm run show-ortoni-report

# This starts a local server at http://localhost:2004
# and opens the report in your browser
```

#### Report Customization

You can customize the report by modifying the `reportConfig` in `playwright.config.ts`:

```typescript
// Customize report appearance
const reportConfig: OrtoniReportConfig = {
  title: 'My Custom RBP Test Report',
  projectName: 'RBP Test Suite',
  testType: 'Integration',
  authorName: 'Your Name',
  
  // Add custom metadata
  meta: {
    'Environment': 'Staging',
    'Build Number': process.env.BUILD_NUMBER || 'local',
    'Branch': process.env.BRANCH_NAME || 'main',
    'Commit': process.env.COMMIT_SHA || 'unknown',
  },
};
```

### Troubleshooting

#### Report Not Opening
- Check if browser is set as default
- Verify `open: 'always'` in configuration
- Try manual opening: `npm run show-ortoni-report`

#### Missing Attachments
- Ensure `trace: 'retain-on-failure'` in Playwright config
- Check `video: 'retain-on-failure'` for video recordings
- Verify `screenshot: 'only-on-failure'` for screenshots

#### Report Server Issues
- Default port 2004 might be in use
- Check firewall settings
- Try different port: `ortoni-report show-report --port 3000`

### Integration with CI/CD

The ortoni-report works seamlessly with CI environments:

```yaml
# GitHub Actions example
- name: Run tests
  run: npm test
  env:
    CI: true  # Disables auto-browser opening

- name: Upload ortoni-report
  uses: actions/upload-artifact@v3
  with:
    name: ortoni-report
    path: ortoni-report/
```

## Test Coverage

### E2E Tests (`tests/e2e/`)
- **Authentication**: Admin login, logout, session management
- **Room Management**: Room browsing, booking forms, room interactions
- **Contact Forms**: Form submission, validation, user interaction
- **Navigation**: Cross-page navigation, mobile responsiveness
- **Cross-Browser**: Chrome, Edge, Safari, Mobile Chrome, Mobile Safari

### API Tests (`tests/api/`)
- **Homepage API**: Basic endpoint testing
- **Admin API**: Authentication and admin-specific endpoints
- **HTTP Methods**: GET, HEAD, OPTIONS, POST method testing
- **Error Handling**: Non-existent endpoints, invalid requests

### Visual Tests (`tests/visual/`)
- **Page Snapshots**: Homepage, admin pages, contact forms
- **Component Snapshots**: Navigation menus, room cards, footer
- **Cross-Browser**: Visual regression testing across all browsers
- **Responsive**: Mobile and desktop visual comparisons

## Tips & Best Practices

### Test Writing
- Prefer role/test-id locators (`getByRole`, `getByTestId`) for stability
- Avoid arbitrary waits; use locator assertions (`await expect(locator).toBeVisible()`)
- Keep test files small and focused on behavior
- Use descriptive test names that explain the scenario being tested
- Implement proper cleanup in `afterEach` hooks

### Debugging
- Use `page.pause()` for interactive debugging
- Take screenshots at key points for visual debugging
- Listen to console logs and network requests for API debugging
- Use `--last-failed` to rerun only failed tests
- Run tests multiple times to identify flaky behavior

### Reporting
- Use **Ortoni** for quick development feedback
- Use **Allure** for detailed analysis and CI/CD integration
- Use **Custom Steps** for stakeholder presentations
- Review test attachments (screenshots, videos) to understand failure patterns
- Track test stability over time using historical data

### Cross-Browser Testing
- Test across Chrome, Edge, and Safari for compatibility
- Use mobile-specific tests to verify responsive design
- Handle browser-specific behaviors appropriately
- Use parallel execution for faster test runs

### Performance
- Use proper waiting strategies instead of arbitrary timeouts
- Implement test sharding for large test suites
- Clean up test data and resources after each test
- Monitor test execution time and optimize slow tests