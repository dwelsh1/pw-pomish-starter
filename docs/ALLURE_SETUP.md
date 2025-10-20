# Allure Report Setup

Allure Report is a powerful, flexible reporting solution that provides rich, interactive HTML reports with comprehensive test analytics and historical tracking capabilities.

## Overview

Allure Report offers:
- **Rich Test Reports**: Beautiful, interactive HTML reports with detailed analytics
- **Test History**: Track test results and trends over time
- **Categories & Tags**: Organize tests by status, severity, and custom categories
- **Environment Info**: Display comprehensive test environment details
- **Attachments**: Screenshots, videos, traces, and custom files
- **Timeline**: Visual timeline of test execution
- **Trends**: Historical test execution trends and analytics
- **Integration**: Works with CI/CD pipelines and third-party tools

## Features

### Dashboard Overview
- **Test Summary**: Comprehensive overview of test execution results
- **Environment Information**: Detailed environment and configuration details
- **Test Categories**: Organized view of test results by status and custom categories
- **Execution Timeline**: Visual timeline showing test execution flow
- **Trend Analysis**: Historical trends and performance metrics

### Test Details
- **Individual Test Reports**: Detailed view of each test with full context
- **Step-by-Step Execution**: Detailed test execution steps
- **Error Analysis**: Comprehensive error messages with stack traces
- **Attachments**: Screenshots, videos, traces, and custom files
- **Test Parameters**: Input parameters and configuration details

### Analytics & Reporting
- **Categories**: Failed, Broken, Skipped, Passed test categorization
- **Severity Levels**: Critical, High, Medium, Low severity classification
- **Feature Mapping**: Organize tests by features and stories
- **Historical Data**: Track test performance over time
- **Custom Metrics**: Add custom metrics and KPIs

## Quick Start

### Basic Usage
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

### Configuration

The Allure reporter is configured in `playwright.config.ts`:

```typescript
if (REPORTER_TYPE === 'allure') {
  return [
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false 
    }],
    ...baseReporters
  ];
}
```

## Available Scripts

### Test Execution
- `npm run test:allure` - Run tests with Allure reporting

### Report Management
- `npm run allure:generate` - Generate static Allure report
- `npm run allure:open` - Open generated Allure report
- `npm run allure:serve` - Serve Allure report dynamically (recommended)
- `npm run allure:clean` - Clean Allure results and reports

### Other Test Commands
- `npm run test:e2e` - Run E2E tests
- `npm run test:api` - Run API tests
- `npm run test:visual` - Run visual tests
- `npm run test:chromium` - Run tests on Chrome only
- `npm run test:edge` - Run tests on Edge only
- `npm run test:webkit` - Run tests on Safari only
- `npm run test:mobile` - Run tests on mobile browsers

## Report Structure

```
allure-results/             # Raw test results (JSON files)
├── *.json                 # Individual test result files
└── *.txt                  # Attachment files

allure-report/             # Generated static report
├── index.html             # Main report file
├── data/                  # Report data
├── plugins/               # Allure plugins
└── static/                # Static assets

allure.config.js           # Allure configuration
```

## Configuration Options

### Basic Configuration
```javascript
module.exports = {
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  
  environment: {
    'Test Environment': 'Restful Booker Platform',
    'Base URL': process.env.RBP_BASE_URL || 'https://automationintesting.online',
    'Browser': 'Multi-browser (Chrome, Edge, Safari)',
    'Platform': process.platform,
    'Node Version': process.version,
    'Playwright Version': require('@playwright/test/package.json').version
  },
  
  categories: [
    {
      name: 'Failed tests',
      matchedStatuses: ['failed']
    },
    {
      name: 'Broken tests', 
      matchedStatuses: ['broken']
    },
    {
      name: 'Skipped tests',
      matchedStatuses: ['skipped']
    },
    {
      name: 'Passed tests',
      matchedStatuses: ['passed']
    }
  ]
};
```

### Advanced Configuration
```javascript
// Custom categories
categories: [
  {
    name: 'Critical Issues',
    matchedStatuses: ['failed'],
    messageRegex: '.*critical.*'
  },
  {
    name: 'Performance Issues',
    matchedStatuses: ['failed'],
    messageRegex: '.*timeout.*|.*slow.*'
  }
],

// Custom environment variables
environment: {
  'Build Number': process.env.BUILD_NUMBER,
  'Git Commit': process.env.GIT_COMMIT,
  'Test Data': 'Production Database',
  'Browser Versions': 'Chrome 120, Edge 120, Safari 17'
}
```

## Switching Between Reporters

### Method 1: Using npm scripts (Recommended)
```bash
# Use Ortoni Reports
npm run test:ortoni

# Use Allure Reports
npm run test:allure

# Use Custom Steps Reports
npm run test:steps
```

### Method 2: Using environment variable
```bash
# Set reporter type via environment variable
set REPORTER_TYPE=allure && npm test    # Windows
REPORTER_TYPE=allure npm test           # Linux/Mac
```

## Allure Report Features

### What Allure Provides
- **Rich Test Reports**: Beautiful, interactive HTML reports
- **Test History**: Track test results over time
- **Categories**: Organize tests by status (Failed, Broken, Skipped, Passed)
- **Environment Info**: Display test environment details
- **Attachments**: Screenshots, videos, and traces on failures
- **Timeline**: Visual timeline of test execution
- **Trends**: Historical test execution trends
- **Custom Categories**: Define custom test categories
- **Severity Levels**: Assign severity to test failures
- **Feature Mapping**: Organize tests by features and stories

### Report Structure
```
allure-results/     # Raw test results (JSON files)
allure-report/      # Generated HTML report
allure.config.js    # Allure configuration
```

## Configuration

### Playwright Configuration
The reporter is configured in `playwright.config.ts`:
- **Ortoni**: Uses `ortoni-report` with custom configuration
- **Allure**: Uses `allure-playwright` with detailed output
- **Custom Steps**: Uses custom `StepReporter` implementation

### Allure Configuration
Customize Allure reports in `allure.config.js`:
- Environment information
- Test categories
- Result patterns
- Custom metrics

## Best Practices

### For Development
- Use `npm run allure:serve` for dynamic reports during development
- Clean results between test runs: `npm run allure:clean`

### For CI/CD
- Generate static reports: `npm run allure:generate`
- Archive `allure-report/` directory for artifact storage
- Include environment variables for better tracking

### For Team Collaboration
- Share `allure-results/` directory for consistent reporting
- Use environment variables to switch reporters per team preference
- Regular cleanup of old report data

## Troubleshooting

### Common Issues

#### Allure command not found
```bash
# Ensure allure-commandline is installed
npm list allure-commandline

# Reinstall if needed
npm install --save-dev allure-commandline
```

#### Empty reports
```bash
# Run tests first, then generate reports
npm run test:allure
npm run allure:generate
```

#### Permission errors
```bash
# Check file permissions in allure-results/
ls -la allure-results/

# Fix permissions if needed
chmod -R 755 allure-results/
```

### Clean Slate
```bash
npm run allure:clean    # Clean Allure files
npm run test:allure     # Run tests with Allure
npm run allure:serve    # View fresh report
```

## Integration with Existing Workflow

This setup maintains full compatibility with your existing Ortoni and Custom Steps reporting while adding Allure capabilities. All three systems can coexist and be used interchangeably based on your needs.

- **Ortoni Reports**: Great for quick, lightweight reporting
- **Allure Reports**: Excellent for detailed analysis and historical tracking
- **Custom Steps Reports**: Perfect for stakeholder presentations and detailed documentation

## Advanced Features

### Custom Test Categories
```javascript
categories: [
  {
    name: 'Authentication Issues',
    matchedStatuses: ['failed'],
    messageRegex: '.*login.*|.*auth.*'
  },
  {
    name: 'UI Issues',
    matchedStatuses: ['failed'],
    messageRegex: '.*element.*|.*click.*|.*visible.*'
  }
]
```

### Environment-Specific Configuration
```javascript
const environment = process.env.NODE_ENV === 'production' ? {
  'Environment': 'Production',
  'Database': 'Production DB',
  'API Endpoint': 'https://api.production.com'
} : {
  'Environment': 'Development',
  'Database': 'Test DB',
  'API Endpoint': 'https://api.dev.com'
};
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run Tests with Allure
  run: npm run test:allure

- name: Generate Allure Report
  run: npm run allure:generate

- name: Upload Allure Report
  uses: actions/upload-artifact@v3
  with:
    name: allure-report
    path: allure-report/
```

This comprehensive Allure setup provides powerful reporting capabilities with detailed analytics, historical tracking, and seamless integration with your existing testing workflow.