# Running Tests & Getting Reports

This comprehensive guide covers everything you need to know about running Playwright tests and generating reports with the four available reporting systems.

## Table of Contents

- [Quick Start](#quick-start)
- [Available Browsers](#available-browsers)
- [Running Tests](#running-tests)
- [Generating Reports](#generating-reports)
- [Test Filtering & Targeting](#test-filtering--targeting)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Quick Start

### Run All Tests with Default Reporter (Ortoni)
```bash
npm test
```

### Run Tests with Specific Reporter
```bash
npm run test:ortoni    # Ortoni Report
npm run test:allure    # Allure Report  
npm run test:specs     # Custom Steps Report
npm run test:monocart  # Monocart Report
```

### View Reports
```bash
npm run show-ortoni-report  # Ortoni
npm run allure:serve        # Allure
npm run specs:open          # Custom Steps
npm run monocart:open       # Monocart
```

### Reporter Commands Summary
| Reporter | Run Tests | Open Report |
|----------|-----------|-------------|
| **Ortoni** | `npm run test:ortoni` | `npm run show-ortoni-report` |
| **Allure** | `npm run test:allure` | `npm run allure:serve` |
| **Steps** | `npm run test:specs` | `npm run specs:open` |
| **Monocart** | `npm run test:monocart` | `npm run monocart:open` |

### Visual Testing Commands Summary
| Testing Method | Run Tests | Browser-Specific |
|----------------|-----------|------------------|
| **Playwright Screenshots** | `npm run test:visual` | `npm run test:chromium`<br>`npm run test:edge`<br>`npm run test:webkit` |
| **Applitools AI Comparison** | `npm run test:visual:applitools` | `npm run test:applitools:chromium`<br>`npm run test:applitools:edge`<br>`npm run test:applitools:webkit` |
| **Both Methods** | `npm run test:visual:all` | Run both Playwright and Applitools |

## Available Browsers

Your project is configured to test on **3 desktop browsers** and **2 mobile browsers**:

| Browser | Project Name | Command |
|---------|--------------|---------|
| **Chrome** | `rbp-chromium` | `npm run test:chromium` |
| **Edge** | `rbp-edge` | `npm run test:edge` |
| **Safari** | `rbp-webkit` | `npm run test:webkit` |
| **Mobile Chrome** | `rbp-mobile-chrome` | `npm run test:mobile` |
| **Mobile Safari** | `rbp-mobile-safari` | `npm run test:mobile` |

### Applitools Visual Testing Projects

| Browser | Project Name | Command |
|---------|--------------|---------|
| **Chrome** | `rbp-applitools-chromium` | `npm run test:applitools:chromium` |
| **Edge** | `rbp-applitools-edge` | `npm run test:applitools:edge` |
| **Safari** | `rbp-applitools-webkit` | `npm run test:applitools:webkit` |

## Running Tests

### 1. Running All Tests

#### All Browsers (Default)
```bash
npm test                    # Run all tests with Ortoni reporting
npm run test:all            # Same as above
```

#### All Browsers with Specific Reporter
```bash
npm run test:ortoni         # All tests with Ortoni
npm run test:allure         # All tests with Allure
npm run test:specs          # All tests with Custom Steps
```

### 2. Running Tests by Type

#### E2E Tests Only
```bash
npm run test:e2e            # E2E tests on all browsers
npm run test:e2e -- --reporter=line  # With line reporter
```

#### API Tests Only
```bash
npm run test:api            # API tests only
```

#### Visual Tests Only
```bash
npm run test:visual         # Playwright visual tests on all browsers
npm run test:visual:applitools # Applitools visual tests on all browsers
npm run test:visual:all     # Both Playwright and Applitools visual tests
```

#### Visual Failure Demonstration
```bash
# Playwright visual failure test (shows pixel-perfect comparison)
npx playwright test tests/visual/visual-failure-demo.spec.ts --grep "should fail due to contact form H1 color change"

# Applitools visual failure test (shows AI-powered comparison)
npm run test:applitools:chromium -- tests/visual/applitools/applitools-failure-demo.spec.ts

# View Playwright visual results
npx playwright show-report

# View Applitools results
# Check console output for Applitools dashboard URL
```

### 3. Running Tests by Browser

#### Single Browser
```bash
npm run test:chromium       # Chrome only
npm run test:edge           # Edge only
npm run test:webkit         # Safari only
```

#### Multiple Specific Browsers
```bash
# Run on Chrome and Edge only
npx playwright test --project=rbp-chromium --project=rbp-edge

# Run on Chrome and Safari only
npx playwright test --project=rbp-chromium --project=rbp-webkit
```

#### Mobile Browsers
```bash
npm run test:mobile         # Both mobile browsers
```

### 4. Running Specific Test Files

#### Single Test File
```bash
# Run specific test file on all browsers
npm test -- tests/e2e/rbp-authentication.spec.ts

# Run specific test file on Chrome only
npm run test:chromium -- tests/e2e/rbp-authentication.spec.ts

# Run specific test file with Allure reporting
npm run test:allure -- tests/e2e/rbp-authentication.spec.ts
```

#### Multiple Test Files
```bash
# Run multiple test files
npm test -- tests/e2e/rbp-authentication.spec.ts tests/e2e/rbp-working.spec.ts

# Run all E2E tests
npm test -- tests/e2e/

# Run all API tests
npm test -- tests/api/
```

### 5. Running Specific Tests

#### Single Test by Name
```bash
# Run specific test by name (grep pattern)
npm test -- --grep "should load homepage successfully"

# Run tests matching pattern
npm test -- --grep "login"
```

#### Multiple Tests by Pattern
```bash
# Run all authentication tests
npm test -- --grep "authentication"

# Run all room-related tests
npm test -- --grep "room"
```

### 6. Running Tests with Options

#### Limit Failures
```bash
# Stop after first failure
npm test -- --max-failures=1

# Stop after 3 failures
npm test -- --max-failures=3
```

#### Run in Headed Mode
```bash
# Run with browser visible
npm run test:headed

# Run specific test in headed mode
npm run test:headed -- tests/e2e/rbp-authentication.spec.ts
```

#### Run with UI Mode
```bash
# Interactive test runner
npm run test:ui

# UI mode for specific tests
npm run test:ui -- tests/e2e/rbp-authentication.spec.ts
```

#### Run with Retries
```bash
# Run with 2 retries (configured in playwright.config.ts)
npm test -- --retries=2
```

## Generating Reports

### 1. Ortoni Reports

#### Generate Report
```bash
npm run test:ortoni         # Generates report automatically
```

#### View Report
```bash
npm run show-ortoni-report  # Opens in browser
```

#### Report Location
- **File**: `ortoni-report/index.html`
- **Data**: `ortoni-report/ortoni-data/`
- **History**: `ortoni-report/ortoni-data-history.sqlite`

### 2. Allure Reports

#### Generate Results
```bash
npm run test:allure         # Generates allure-results/
```

#### Generate Static Report
```bash
npm run allure:generate     # Creates allure-report/
```

#### Serve Dynamic Report
```bash
npm run allure:serve        # Serves report dynamically (recommended)
```

#### Open Static Report
```bash
npm run allure:open         # Opens static report
```

#### Report Locations
- **Results**: `allure-results/` (JSON files)
- **Static Report**: `allure-report/` (HTML files)
- **Dynamic Server**: Temporary directory

### 3. Custom Steps Reports

#### Generate Report
```bash
npm run test:specs          # Generates steps-report/
```

#### View Report
```bash
npm run specs:open          # Opens summary.html
```

#### Report Location
- **Summary**: `steps-report/summary.html`
- **Individual Tests**: `steps-report/1/`, `steps-report/2/`, etc.

## Test Filtering & Targeting

### 1. File-based Filtering

#### Run Tests in Specific Directory
```bash
npm test -- tests/e2e/              # All E2E tests
npm test -- tests/api/              # All API tests
npm test -- tests/visual/            # All visual tests
```

#### Run Specific Test Files
```bash
npm test -- tests/e2e/rbp-authentication.spec.ts
npm test -- tests/e2e/rbp-working.spec.ts
npm test -- tests/api/rbp-api.spec.ts
```

#### Run Multiple Files
```bash
npm test -- tests/e2e/rbp-authentication.spec.ts tests/e2e/rbp-working.spec.ts
```

### 2. Pattern-based Filtering

#### Test Name Patterns
```bash
# Run tests with "login" in the name
npm test -- --grep "login"

# Run tests with "authentication" in the name
npm test -- --grep "authentication"

# Run tests with "room" in the name
npm test -- --grep "room"
```

#### Suite Name Patterns
```bash
# Run specific test suite
npm test -- --grep "RBP Authentication Tests"

# Run multiple suites
npm test -- --grep "Authentication|Working"
```

### 3. Browser-based Filtering

#### Single Browser
```bash
npm run test:chromium       # Chrome only
npm run test:edge           # Edge only
npm run test:webkit         # Safari only
```

#### Multiple Browsers
```bash
# Chrome and Edge
npx playwright test --project=rbp-chromium --project=rbp-edge

# Desktop browsers only
npx playwright test --project=rbp-chromium --project=rbp-edge --project=rbp-webkit
```

### 4. Status-based Filtering

#### Run Only Failed Tests
```bash
# Re-run only failed tests from last run
npm test -- --last-failed
```

#### Run Tests with Specific Status
```bash
# Run tests that were skipped
npm test -- --grep-invert "passed|failed"
```

## Advanced Usage

### 1. Environment Variables

#### Set Reporter Type
```bash
# Windows
set REPORTER_TYPE=allure && npm test
set REPORTER_TYPE=steps && npm test
set REPORTER_TYPE=ortoni && npm test

# Linux/Mac
REPORTER_TYPE=allure npm test
REPORTER_TYPE=steps npm test
REPORTER_TYPE=ortoni npm test
```

#### Set Base URL
```bash
# Test against different environment
RBP_BASE_URL=https://staging.example.com npm test
RBP_BASE_URL=https://localhost:3000 npm test
```

### 2. Parallel Execution

#### Control Workers
```bash
# Run with specific number of workers
npm test -- --workers=4

# Run with 1 worker (sequential)
npm test -- --workers=1
```

#### Fully Parallel Mode
```bash
# Enable fully parallel execution (default)
npm test -- --fully-parallel
```

### 3. Debugging

#### Debug Mode
```bash
# Run in debug mode
npx playwright test --debug

# Debug specific test
npx playwright test --debug tests/e2e/rbp-authentication.spec.ts
```

#### Trace Mode
```bash
# Generate traces for debugging
npm test -- --trace=on

# Generate traces only on failure
npm test -- --trace=retain-on-failure
```

### 4. Code Generation

#### Generate Test Code
```bash
# Generate tests for specific URL
npm run codegen

# Generate tests for specific page
npx playwright codegen https://automationintesting.online/admin
```

### 5. Test Development

#### Run Tests in Watch Mode
```bash
# Watch mode for development
npx playwright test --watch
```

#### Run Tests with Specific Timeout
```bash
# Set custom timeout
npm test -- --timeout=30000
```

## Troubleshooting

### 1. Common Issues

#### Tests Not Running
```bash
# Check if Playwright is installed
npx playwright --version

# Install Playwright browsers
npm run install:playwright

# Check test file syntax
npm run typecheck
```

#### Browser Not Found
```bash
# Install specific browser
npx playwright install chromium
npx playwright install edge
npx playwright install webkit

# Install all browsers
npx playwright install
```

#### Report Not Generated
```bash
# Check if tests ran successfully
npm test -- --reporter=line

# Check for errors in console
npm test -- --reporter=list
```

### 2. Performance Issues

#### Slow Test Execution
```bash
# Reduce parallel workers
npm test -- --workers=2

# Run tests sequentially
npm test -- --workers=1

# Disable parallel execution
npm test -- --fully-parallel=false
```

#### Memory Issues
```bash
# Reduce browser instances
npm test -- --workers=1

# Disable video recording
npm test -- --video=off

# Disable screenshots
npm test -- --screenshot=off
```

### 3. Report Issues

#### Ortoni Report Not Opening
```bash
# Check if report file exists
ls ortoni-report/index.html

# Manually open report
start ortoni-report/index.html  # Windows
open ortoni-report/index.html    # Mac
```

#### Allure Report Empty
```bash
# Check if results were generated
ls allure-results/

# Regenerate report
npm run allure:clean
npm run test:allure
npm run allure:generate
```

#### Custom Steps Report Missing Tests
```bash
# Check if templates exist
ls src/reporter/templates/

# Verify reporter configuration
npm run test:specs -- --reporter=line
```

### 4. Browser-Specific Issues

#### Chrome Issues
```bash
# Update Chrome
npx playwright install chromium

# Run with specific Chrome flags
npm test -- --project=rbp-chromium --headed
```

#### Edge Issues
```bash
# Update Edge
npx playwright install edge

# Check Edge installation
npx playwright install --with-deps edge
```

#### Safari Issues
```bash
# Update Safari/WebKit
npx playwright install webkit

# Check WebKit installation
npx playwright install --with-deps webkit
```

### 5. Network Issues

#### Connection Timeouts
```bash
# Increase timeout
npm test -- --timeout=60000

# Test with different base URL
RBP_BASE_URL=https://localhost:3000 npm test
```

#### Proxy Issues
```bash
# Set proxy
npm test -- --proxy-server=http://proxy:8080
```

## Best Practices

### 1. Test Organization

#### File Structure
```
tests/
├── e2e/                    # End-to-end tests
│   ├── rbp-authentication.spec.ts
│   └── rbp-working.spec.ts
├── api/                    # API tests
│   └── rbp-api.spec.ts
└── visual/                 # Visual tests
    └── rbp-visual.spec.ts
```

#### Naming Conventions
- Use descriptive test names
- Group related tests in describe blocks
- Use consistent naming patterns
- Include browser/project information

### 2. Test Execution

#### Development Workflow
```bash
# 1. Run specific test during development
npm run test:chromium -- tests/e2e/rbp-authentication.spec.ts

# 2. Run all tests before commit
npm test

# 3. Run with specific reporter for review
npm run test:specs
```

#### CI/CD Workflow
```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run install:playwright

# 3. Run tests with Allure reporting
npm run test:allure

# 4. Generate and archive reports
npm run allure:generate
```

### 3. Report Management

#### Regular Cleanup
```bash
# Clean old reports
npm run allure:clean
npm run specs:clean

# Clean test results
rm -rf test-results/
```

#### Report Archiving
```bash
# Archive reports for CI/CD
tar -czf reports-$(date +%Y%m%d).tar.gz allure-report/ steps-report/ ortoni-report/
```

### 4. Performance Optimization

#### Parallel Execution
```bash
# Use appropriate worker count
npm test -- --workers=4  # For 4-core machine
npm test -- --workers=8  # For 8-core machine
```

#### Resource Management
```bash
# Disable unnecessary features
npm test -- --video=retain-on-failure
npm test -- --screenshot=only-on-failure
npm test -- --trace=retain-on-failure
```

### 5. Debugging

#### Debug Failed Tests
```bash
# Run failed tests in debug mode
npm test -- --last-failed --debug

# Generate traces for failed tests
npm test -- --last-failed --trace=on
```

#### Investigate Issues
```bash
# Run with detailed output
npm test -- --reporter=list

# Run with line reporter
npm test -- --reporter=line

# Run in headed mode
npm run test:headed -- --last-failed
```

This comprehensive guide should help you run tests effectively and generate the reports you need for your testing workflow.
