# Documentation Overview

This project includes comprehensive documentation for all four reporting systems, dual visual testing methods, and detailed guides for running tests. Here's what's available:

## 📚 Main Documentation

### **[README.md](./README.md)**
- Project overview and quick start guide
- Complete script reference
- Project structure and configuration
- Browser support and examples
- Troubleshooting basics

### **[RUNNING_TESTS.md](./RUNNING_TESTS.md)**
- **Comprehensive guide to running tests and generating reports**
- Detailed examples for all test execution scenarios
- Test filtering and targeting options
- Advanced usage patterns
- Extensive troubleshooting section
- Best practices and performance tips

## 📊 Reporter-Specific Documentation

### **[ORTONI_SETUP.md](./ORTONI_SETUP.md)**
- Ortoni Report configuration and features
- Quick setup and usage
- Configuration options and customization
- Best practices for development and CI/CD
- Troubleshooting common issues

### **[ALLURE_SETUP.md](./ALLURE_SETUP.md)**
- Allure Report setup and advanced features
- Rich reporting capabilities and analytics
- Environment configuration and customization
- CI/CD integration examples
- Advanced configuration options

### **[specs-reporter.md](./specs-reporter.md)**
- Specs Reporter implementation
- Stakeholder-friendly reporting features
- Environment information tracking
- Advanced filtering and navigation
- AI-powered Copy Prompt feature

### **[MONOCART_SETUP.md](./MONOCART_SETUP.md)**
- Monocart Reporter setup and advanced features
- High-performance tree grid reporting
- Ultra-fast filtering and sorting capabilities
- Customization and extensibility options
- Shard merging and large test suite handling

### **[APPLITOOLS_SETUP.md](./APPLITOOLS_SETUP.md)**
- Applitools visual testing setup and advanced features
- AI-powered visual comparison capabilities
- Fixtures-based integration approach
- Cross-browser visual testing
- Cloud-based baseline management

### **[COPY_PROMPT_USAGE.md](./COPY_PROMPT_USAGE.md)**
- AI-powered Copy Prompt feature usage guide
- Three prompt types: Full Prompt, Quick Analysis, Debug Help
- Integration with AI tools (Cursor, ChatGPT, Claude)
- Best practices and troubleshooting
- Technical implementation details

### **[VISUAL_FAILURE_DEMO.md](./VISUAL_FAILURE_DEMO.md)**
- Comprehensive comparison of Playwright vs Applitools visual testing
- Real-world failure demonstration with both systems
- Detailed analysis of failure reporting differences
- When to use each visual testing method

## 🎯 Quick Reference

### Test Execution Commands
```bash
# All tests with different reporters
npm run test:ortoni    # Ortoni Report
npm run test:allure    # Allure Report
npm run test:specs     # Custom Steps Report
npm run test:monocart  # Monocart Report

# Specific browsers
npm run test:chromium  # Chrome only
npm run test:edge      # Edge only
npm run test:webkit    # Safari only

# Applitools browser-specific
npm run test:applitools:chromium  # Applitools Chrome
npm run test:applitools:edge      # Applitools Edge
npm run test:applitools:webkit    # Applitools Safari

# Test types
npm run test:e2e      # E2E tests
npm run test:api      # API tests
npm run test:visual   # Playwright visual tests
npm run test:visual:applitools  # Applitools visual tests
npm run test:visual:all         # Both visual methods

# Visual failure demonstration
npx playwright test tests/visual/visual-failure-demo.spec.ts --grep "should fail due to contact form H1 color change"
npm run test:applitools:chromium -- tests/visual/applitools/applitools-failure-demo.spec.ts
```

### Report Viewing Commands
```bash
# Ortoni Reports
npm run show-ortoni-report

# Allure Reports
npm run allure:serve        # Dynamic (recommended)
npm run allure:generate     # Static
npm run allure:open         # Open static

# Custom Steps Reports
npm run specs:open
```

## 🔧 Configuration Files

- **`playwright.config.ts`** - Main Playwright configuration with dynamic reporter switching
- **`allure.config.js`** - Allure-specific configuration
- **`package.json`** - All npm scripts and dependencies
- **`.gitignore`** - Report directories and generated files

## 🌐 Browser Support

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome | ✅ | ✅ | Fully supported |
| Edge | ✅ | ❌ | Fully supported |
| Safari | ✅ | ✅ | Fully supported |
| Firefox | ❌ | ❌ | Removed per user request |

## 📈 Reporting Comparison

| Feature | Ortoni | Allure | Custom Steps |
|---------|--------|--------|--------------|
| **Speed** | ⚡ Fast | 🐌 Slower | 🐌 Slower |
| **Setup** | ✅ Simple | ⚠️ Medium | ⚠️ Medium |
| **Charts** | ✅ Static | ✅ Interactive | ✅ Dynamic |
| **History** | ✅ Yes | ✅ Yes | ❌ No |
| **Stakeholder Friendly** | ⚠️ Moderate | ⚠️ Moderate | ✅ Excellent |
| **CI/CD Integration** | ✅ Good | ✅ Excellent | ✅ Good |
| **Customization** | ⚠️ Limited | ✅ Extensive | ✅ Full Control |

## 🚀 Getting Started

1. **Read the [README.md](./README.md)** for project overview
2. **Follow [RUNNING_TESTS.md](./RUNNING_TESTS.md)** for comprehensive test execution guide
3. **Choose your reporter** and read the specific setup guide:
   - [ORTONI_SETUP.md](./ORTONI_SETUP.md) for quick, lightweight reporting
   - [ALLURE_SETUP.md](./ALLURE_SETUP.md) for detailed analysis and CI/CD
   - [specs-reporter.md](./specs-reporter.md) for stakeholder presentations

## 🆘 Need Help?

- **General questions**: Check [RUNNING_TESTS.md](./RUNNING_TESTS.md) troubleshooting section
- **Reporter-specific issues**: Check the individual setup guides
- **Configuration problems**: Review `playwright.config.ts` and configuration examples
- **Browser issues**: See browser-specific troubleshooting in [RUNNING_TESTS.md](./RUNNING_TESTS.md)

## 📝 Documentation Updates

This documentation is maintained alongside the codebase. When adding new features or changing configurations, please update the relevant documentation files to keep them current and helpful for all users.
