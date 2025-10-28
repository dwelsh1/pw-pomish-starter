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
- **Enhanced API tests** with pw-api-plugin for beautiful visualization and playwright-schema-validator for contract validation
- **Dual visual testing** with both Playwright screenshots and Applitools AI-powered comparison
- **Four powerful reporting systems** with easy switching between Specs Reporter (default), Ortoni, Allure, and Monocart reporters
- **AI-powered Copy Prompt feature** for instant debugging assistance with failed tests (Specs Reporter, Ortoni, and Allure reporters)
- **Enhanced Specs Reporter** with sidebar navigation, in-page test details, environment information, and responsive design
- **Multi-browser testing** on Chrome, Edge, Safari, and mobile browsers

## 🚀 Quick Start

```bash
npm ci
npm run install:playwright

# Run tests with default reporter (Specs Reporter)
npm test

# Run tests with specific reporter
npm run test:specs     # Specs Reporter (default)
npm run test:ortoni   # Ortoni Report
npm run test:allure   # Allure Report
npm run test:monocart # Monocart Report

# Visual testing options
npm run test:visual           # Playwright screenshots
npm run test:visual:applitools # Applitools AI comparison
npm run test:visual:all       # Both visual methods

# Visual failure demonstration
npx playwright test tests/visual/visual-failure-demo.spec.ts --grep "should fail due to contact form H1 color change"
npm run test:applitools:chromium -- tests/visual/applitools/applitools-failure-demo.spec.ts

# UI mode for test development
npm run test:ui
```

## 📊 Reporting Systems

This project supports **four different reporting systems** with **Specs Reporter as the default** for comprehensive test result visualization:

| Reporter | Best For | Speed | Features |
|----------|---------|-------|----------|
| **Specs** | Stakeholders, environment tracking | 🚀 Fast | Sidebar nav, filtering, AI prompts, env info |
| **Ortoni** | Quick feedback, lightweight | ⚡ Fast | Charts, history, auto-open |
| **Allure** | Detailed analysis, CI/CD | 🐌 Slower | Rich reports, trends, categories |
| **Monocart** | Large test suites, performance | ⚡⚡⚡ Very Fast | Tree grid, ultra-fast filtering |

### Quick Reporter Commands
```bash
# Specs Reports (Default)
npm run test:specs
npm run specs:open

# Ortoni Reports
npm run test:ortoni
npm run show-ortoni-report

# Allure Reports
npm run test:allure
npm run allure:serve        # Dynamic (recommended)
npm run allure:generate     # Static

# Monocart Reports
npm run test:monocart
npm run monocart:open
```

### Reporter Commands Summary
| Reporter | Run Tests | Open Report |
|----------|-----------|-------------|
| **Specs** (Default) | `npm run test:specs` | `npm run specs:open` |
| **Ortoni** | `npm run test:ortoni` | `npm run show-ortoni-report` |
| **Allure** | `npm run test:allure` | `npm run allure:serve` |
| **Monocart** | `npm run test:monocart` | `npm run monocart:open` |

### Visual Testing Commands Summary
| Testing Method | Run Tests | Browser-Specific |
|----------------|-----------|------------------|
| **Playwright Screenshots** | `npm run test:visual` | `npm run test:chromium`<br>`npm run test:edge`<br>`npm run test:webkit` |
| **Applitools AI Comparison** | `npm run test:visual:applitools` | `npm run test:applitools:chromium`<br>`npm run test:applitools:edge`<br>`npm run test:applitools:webkit` |
| **Both Methods** | `npm run test:visual:all` | Run both Playwright and Applitools |

### 🚀 Quick Test Commands (Specs Reporter)
| Command | Description | Tests Run |
|---------|-------------|-----------|
| **All Tests** | | |
| `npm run all` | E2E + API (all browsers) | Chrome, Edge, Safari + API |
| `npm run all:e2e` | E2E tests (all browsers) | Chrome, Edge, Safari |
| `npm run all:api` | API tests only | API project |
| `npm run all:visual` | Visual tests (all browsers) | Chrome, Edge, Safari |
| **Chrome Only** | | |
| `npm run chrome` | E2E + API (Chrome) | Chrome + API |
| `npm run chrome:e2e` | E2E tests (Chrome) | Chrome only |
| `npm run chrome:api` | API tests (Chrome) | API only |
| `npm run chrome:visual` | Visual tests (Chrome) | Chrome only |
| **Edge Only** | | |
| `npm run edge` | E2E + API (Edge) | Edge + API |
| `npm run edge:e2e` | E2E tests (Edge) | Edge only |
| `npm run edge:api` | API tests (Edge) | API only |
| `npm run edge:visual` | Visual tests (Edge) | Edge only |
| **Safari Only** | | |
| `npm run safari` | E2E + API (Safari) | Safari + API |
| `npm run safari:e2e` | E2E tests (Safari) | Safari only |
| `npm run safari:api` | API tests (Safari) | API only |
| `npm run safari:visual` | Visual tests (Safari) | Safari only |

## 📚 Documentation

- **[docs/RUNNING_TESTS.md](./docs/RUNNING_TESTS.md)** - Comprehensive guide to running tests and generating reports
- **[docs/API_PLUGINS.md](./docs/API_PLUGINS.md)** - Enhanced API testing with pw-api-plugin and schema validation
- **[docs/APPLITOOLS_SETUP.md](./docs/APPLITOOLS_SETUP.md)** - Applitools visual testing setup and advanced features
- **[docs/VISUAL_FAILURE_DEMO.md](./docs/VISUAL_FAILURE_DEMO.md)** - Comprehensive comparison of Playwright vs Applitools visual testing
- **[docs/ORTONI_SETUP.md](./docs/ORTONI_SETUP.md)** - Ortoni Report configuration and usage
- **[docs/ALLURE_SETUP.md](./docs/ALLURE_SETUP.md)** - Allure Report setup and advanced features
- **[docs/COPY_PROMPT_USAGE.md](./docs/COPY_PROMPT_USAGE.md)** - AI-powered Copy Prompt feature usage guide
- **[docs/UNIT_TESTING.md](./docs/UNIT_TESTING.md)** - Unit testing setup and guidelines

## 🎯 Available Scripts

### Test Execution
- `npm test` - Run all tests with default reporting (Specs Reporter)
- `npm run test:specs` - Run tests with Specs reporting
- `npm run test:ortoni` - Run tests with Ortoni reporting
- `npm run test:allure` - Run tests with Allure reporting
- `npm run test:monocart` - Run tests with Monocart reporting

### Test Types
- `npm run test:e2e` - E2E tests only
- `npm run test:api` - API tests only
- `npm run test:api:ui` - API tests with UI visualization
- `npm run test:api:report` - API tests with HTML report details
- `npm run test:api:dark` - API tests with dark theme
- `npm run test:api:accessible` - API tests with accessible theme
- `npm run test:visual` - Playwright visual tests only
- `npm run test:visual:applitools` - Applitools visual tests only
- `npm run test:visual:all` - Both visual testing methods
- `npm run test:all` - Run all configured tests

### Browser-Specific Testing
- `npm run test:chromium` - Chrome browser only
- `npm run test:edge` - Edge browser only
- `npm run test:webkit` - Safari browser only
- `npm run test:mobile` - Mobile browsers (Chrome & Safari)
- `npm run test:applitools:chromium` - Applitools tests on Chrome
- `npm run test:applitools:edge` - Applitools tests on Edge
- `npm run test:applitools:webkit` - Applitools tests on Safari

### Development & Debugging
- `npm run test:ui` - Interactive Playwright UI
- `npm run test:headed` - Run with visible browser
- `npm run codegen` - Generate tests for RBP

### Report Management
- `npm run specs:open` - Open Specs report (default)
- `npm run show-ortoni-report` - Open Ortoni report
- `npm run allure:serve` - Serve Allure report dynamically
- `npm run allure:generate` - Generate static Allure report
- `npm run allure:open` - Open static Allure report

### Cleanup
- `npm run allure:clean` - Clean Allure files
- `npm run specs:clean` - Clean Specs files

## 🏗️ Project Structure

```text
├─ playwright.config.ts     # Playwright configuration with dynamic reporters
├─ docs/                   # Documentation files
│  ├─ RUNNING_TESTS.md     # Comprehensive test execution guide
│  ├─ ORTONI_SETUP.md      # Ortoni Report setup
│  ├─ ALLURE_SETUP.md      # Allure Report setup
│  ├─ specs-reporter.md    # Specs Reporter setup and features
│  ├─ DOCUMENTATION.md     # Documentation overview
│  └─ DEVELOPER.md         # Developer guidelines
├─ src/
│  ├─ selectors/            # Centralized locators (POM-ish approach)
│  ├─ helpers/              # Reusable test helpers
│  ├─ fixtures/             # Test fixtures and capabilities
│  ├─ utils/                # Utilities (visual stability, etc.)
│  └─ reporter/             # Specs Reporter implementation
│     ├─ SpecsReporter.ts    # Main reporter class
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
├─ specs-report/           # Custom Specs reports
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
REPORTER_TYPE=specs npm test    # Specs Reporter (default)
REPORTER_TYPE=ortoni npm test   # Ortoni Report
REPORTER_TYPE=allure npm test   # Allure Report
REPORTER_TYPE=monocart npm test # Monocart Report
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