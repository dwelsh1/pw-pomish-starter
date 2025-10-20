# pw-pomish-starter — Playwright TypeScript Starter (POM‑ish)

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Allure](https://img.shields.io/badge/Allure-FF6B6B?style=for-the-badge&logo=allure&logoColor=white)](https://allurereport.org/)
[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://www.microsoft.com/edge/)
[![Safari](https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=safari&logoColor=white)](https://www.apple.com/safari/)

[![CI/CD](https://github.com/dwelsh1/pw-pomish-starter/workflows/Playwright%20Tests/badge.svg)](https://github.com/dwelsh1/pw-pomish-starter/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg?style=for-the-badge)](CHANGELOG.md)

A comprehensive Playwright + TypeScript starter that targets the **Restful Booker Platform (RBP)** at `https://automationintesting.online` and demonstrates:

- **UI tests** with a **POM‑ish** approach (central selectors + tiny helpers, no bloated page classes)
- **API tests** against the RBP API endpoints
- **Visual snapshots** using Playwright's built‑in `toHaveScreenshot`
- **Three powerful reporting systems** with easy switching between Ortoni, Allure, and Custom Steps reporters
- **Multi-browser testing** on Chrome, Edge, Safari, and mobile browsers

## 🚀 Quick Start

```bash
npm ci
npm run install:playwright

# Run tests with default reporter (Ortoni)
npm test

# Run tests with specific reporter
npm run test:ortoni    # Ortoni Report
npm run test:allure    # Allure Report
npm run test:steps     # Custom Steps Report

# UI mode for test development
npm run test:ui
```

## 📊 Reporting Systems

This project supports **three different reporting systems** for comprehensive test result visualization:

| Reporter | Best For | Speed | Features |
|----------|---------|-------|----------|
| **Ortoni** | Quick feedback, lightweight | ⚡ Fast | Charts, history, auto-open |
| **Allure** | Detailed analysis, CI/CD | 🐌 Slower | Rich reports, trends, categories |
| **Custom Steps** | Stakeholders, documentation | 🐌 Slower | Step-by-step, dynamic charts |

### Quick Reporter Commands
```bash
# Ortoni Reports (Default)
npm run test:ortoni
npm run show-ortoni-report

# Allure Reports
npm run test:allure
npm run allure:serve        # Dynamic (recommended)
npm run allure:generate     # Static

# Custom Steps Reports
npm run test:steps
npm run steps:open
```

## 📚 Documentation

- **[docs/RUNNING_TESTS.md](./docs/RUNNING_TESTS.md)** - Comprehensive guide to running tests and generating reports
- **[docs/ORTONI_SETUP.md](./docs/ORTONI_SETUP.md)** - Ortoni Report configuration and usage
- **[docs/ALLURE_SETUP.md](./docs/ALLURE_SETUP.md)** - Allure Report setup and advanced features
- **[docs/STEPS_SETUP.md](./docs/STEPS_SETUP.md)** - Custom Steps Reporter documentation
- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Documentation overview and quick reference
- **[docs/DEVELOPER.md](./docs/DEVELOPER.md)** - Developer-specific documentation and guidelines

## 🎯 Available Scripts

### Test Execution
- `npm test` - Run all tests with default reporting (Ortoni)
- `npm run test:ortoni` - Run tests with Ortoni reporting
- `npm run test:allure` - Run tests with Allure reporting
- `npm run test:steps` - Run tests with Custom Steps reporting

### Test Types
- `npm run test:e2e` - E2E tests only
- `npm run test:api` - API tests only
- `npm run test:visual` - Visual tests only
- `npm run test:all` - Run all configured tests

### Browser-Specific Testing
- `npm run test:chromium` - Chrome browser only
- `npm run test:edge` - Edge browser only
- `npm run test:webkit` - Safari browser only
- `npm run test:mobile` - Mobile browsers (Chrome & Safari)

### Development & Debugging
- `npm run test:ui` - Interactive Playwright UI
- `npm run test:headed` - Run with visible browser
- `npm run codegen` - Generate tests for RBP

### Report Management
- `npm run show-ortoni-report` - Open Ortoni report
- `npm run allure:serve` - Serve Allure report dynamically
- `npm run allure:generate` - Generate static Allure report
- `npm run allure:open` - Open static Allure report
- `npm run steps:open` - Open Custom Steps report

### Cleanup
- `npm run allure:clean` - Clean Allure files
- `npm run steps:clean` - Clean Custom Steps files

## 🏗️ Project Structure

```text
├─ playwright.config.ts     # Playwright configuration with dynamic reporters
├─ docs/                   # Documentation files
│  ├─ RUNNING_TESTS.md     # Comprehensive test execution guide
│  ├─ ORTONI_SETUP.md      # Ortoni Report setup
│  ├─ ALLURE_SETUP.md      # Allure Report setup
│  ├─ STEPS_SETUP.md       # Custom Steps Reporter setup
│  ├─ DOCUMENTATION.md     # Documentation overview
│  └─ DEVELOPER.md         # Developer guidelines
├─ src/
│  ├─ selectors/            # Centralized locators (POM-ish approach)
│  ├─ helpers/              # Reusable test helpers
│  ├─ fixtures/             # Test fixtures and capabilities
│  ├─ utils/                # Utilities (visual stability, etc.)
│  └─ reporter/             # Custom Steps Reporter implementation
│     ├─ StepReporter.ts    # Main reporter class
│     ├─ types.ts           # TypeScript interfaces
│     ├─ helpers.ts         # Utility classes
│     └─ templates/         # HTML templates
├─ tests/
│  ├─ e2e/                 # UI tests for Restful Booker Platform
│  ├─ api/                 # API tests (RBP API)
│  └─ visual/              # Visual regression tests
├─ ortoni-report/          # Ortoni reports (auto-generated)
├─ allure-results/         # Allure raw results
├─ allure-report/          # Allure generated reports
├─ steps-report/           # Custom Steps reports
└─ reports/html/           # Standard Playwright HTML reports
```

## 🌐 Supported Browsers

| Browser | Desktop | Mobile | Project Name |
|---------|---------|--------|--------------|
| **Chrome** | ✅ | ✅ | `rbp-chromium`, `rbp-mobile-chrome` |
| **Edge** | ✅ | ❌ | `rbp-edge` |
| **Safari** | ✅ | ✅ | `rbp-webkit`, `rbp-mobile-safari` |

## 🎨 POM‑ish Philosophy

- Keep **selectors centralized**, but keep **actions visible** in the test unless a sequence is reused
- Extract **small helpers** only when they add value (e.g., `loginAsAdmin`, `navigateToRooms`)
- Use **fixtures** to expose capabilities (e.g., `rbp.login()`), not to hide everything behind a class

## 📸 Visual Snapshots

- We provide `stabilizeForSnapshot(page)` to disable animations and reduce flake
- Baselines are stored under `tests/visual/__screenshots__/` per Playwright defaults
- Tune thresholds in `playwright.config.ts` (`expect.toHaveScreenshot`)

## 🔌 API Testing

- The Restful Booker Platform provides a comprehensive API for testing
- We test various endpoints including authentication, booking management, and room operations
- Some endpoints may require proper authentication or have specific parameter requirements

## 📈 Test Coverage

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

## 🔧 Configuration

### Environment Variables
```bash
# Set base URL for testing
RBP_BASE_URL=https://automationintesting.online npm test

# Switch reporter type
REPORTER_TYPE=allure npm test
REPORTER_TYPE=steps npm test
REPORTER_TYPE=ortoni npm test
```

### Playwright Configuration
The `playwright.config.ts` file includes:
- Dynamic reporter switching based on `REPORTER_TYPE` environment variable
- Multi-browser project configuration
- Custom timeout and retry settings
- Trace and video capture on failures

## 🚀 CI/CD Integration

A basic GitHub Actions workflow is included under `.github/workflows/` that:
- Installs browsers and dependencies
- Runs tests with configurable reporters
- Uploads reports as artifacts
- Supports all three reporting systems

## 📖 Examples

### Running Specific Tests
```bash
# Single test file
npm test -- tests/e2e/rbp-authentication.spec.ts

# Specific browser
npm run test:chromium -- tests/e2e/rbp-authentication.spec.ts

# With specific reporter
npm run test:allure -- tests/e2e/rbp-authentication.spec.ts

# Pattern matching
npm test -- --grep "login"
```

### Advanced Usage
```bash
# Debug mode
npx playwright test --debug

# Watch mode
npx playwright test --watch

# Limit failures
npm test -- --max-failures=1

# Custom timeout
npm test -- --timeout=30000
```

## 🆘 Troubleshooting

### Common Issues
- **Browser not found**: Run `npm run install:playwright`
- **Report not opening**: Check file permissions and browser settings
- **Empty reports**: Ensure tests ran successfully first
- **Permission errors**: Check file system permissions

### Getting Help
- Check the [docs/RUNNING_TESTS.md](./docs/RUNNING_TESTS.md) for comprehensive troubleshooting
- Review individual reporter setup guides for specific issues
- Use `--reporter=line` for detailed test output

## 🤝 Contributing

This starter template is designed to be:
- **Extensible**: Easy to add new tests and reporters
- **Maintainable**: Clear structure and documentation
- **Flexible**: Multiple reporting options for different needs
- **Production-ready**: CI/CD integration and best practices

Feel free to customize the configuration, add new tests, or extend the reporting capabilities to fit your specific needs!