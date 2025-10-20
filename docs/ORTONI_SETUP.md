# Ortoni Report Setup

Ortoni Report is a lightweight, fast reporting solution for Playwright tests that provides beautiful charts and quick insights into your test results.

## Overview

Ortoni Report offers:
- **Quick Generation**: Fast report generation with minimal overhead
- **Beautiful Charts**: Visual representation of test results
- **Test History**: Track test execution over time
- **Lightweight**: Minimal resource usage
- **Easy Integration**: Simple setup with Playwright

## Features

### Dashboard
- **Test Summary**: Overview of passed, failed, and skipped tests
- **Success Rate**: Visual percentage of test success
- **Execution Time**: Total test execution duration
- **Project Breakdown**: Results organized by test projects

### Charts & Analytics
- **Donut Charts**: Visual representation of test status distribution
- **Bar Charts**: Test count per project
- **Trend Analysis**: Historical test execution trends
- **Performance Metrics**: Test execution timing

### Test Details
- **Individual Test Results**: Detailed view of each test
- **Error Information**: Clear error messages and stack traces
- **Screenshots**: Automatic screenshots on test failures
- **Trace Files**: Playwright trace files for debugging

## Quick Start

### Basic Usage
```bash
# Run tests with Ortoni reporting (default)
npm run test:ortoni

# View the generated report
npm run show-ortoni-report
```

### Configuration

The Ortoni reporter is configured in `playwright.config.ts`:

```typescript
const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? 'never' : 'always',
  folderPath: 'ortoni-report',
  filename: 'index.html',
  title: 'RBP Test Report',
  showProject: true,
  projectName: 'RBP Test Suite',
  testType: 'E2E',
  authorName: os.userInfo().username,
  base64Image: false,
  stdIO: false,
  meta: {
    'Test Cycle': new Date().toLocaleDateString(),
    version: '0.1.0',
    description: 'Restful Booker Platform test suite',
    release: '0.1',
    platform: os.type(),
  },
};
```

## Available Scripts

### Test Execution
- `npm run test:ortoni` - Run tests with Ortoni reporting
- `npm run test` - Run tests with default reporting (Ortoni)

### Report Management
- `npm run show-ortoni-report` - Open Ortoni report in browser

## Report Structure

```
ortoni-report/
├── index.html              # Main report file
├── ortoni-data/            # Report data directory
│   ├── attachments/        # Test attachments
│   └── ortoni-data-history.sqlite  # Test history database
└── trace/                  # Trace files and assets
    ├── assets/             # CSS and JS assets
    ├── index.html          # Trace viewer
    └── snapshot.html       # Test snapshots
```

## Configuration Options

### Basic Options
- `open`: When to open the report ('always', 'never', 'on-failure')
- `folderPath`: Directory where the report will be saved
- `filename`: Name of the report file
- `title`: Title displayed in the report

### Display Options
- `showProject`: Whether to display project information
- `projectName`: Name of your project
- `testType`: Type of tests (E2E, API, Visual, etc.)
- `authorName`: Author's name

### Data Options
- `base64Image`: Whether to use base64 encoding for images
- `stdIO`: Whether to include standard I/O logs

### Metadata
- `meta`: Additional metadata to include in the report
  - Test Cycle, Version, Description, Release, Platform, etc.

## Best Practices

### For Development
- Use `open: 'always'` for immediate feedback during development
- Set `base64Image: false` to reduce report size
- Include relevant metadata for better tracking

### For CI/CD
- Use `open: 'never'` in CI environments
- Archive the `ortoni-report/` directory as build artifacts
- Include metadata like version and build number

### For Team Collaboration
- Share the `ortoni-report/` directory for consistent reporting
- Use meaningful project names and descriptions
- Include author information for accountability

## Troubleshooting

### Common Issues

#### Report Not Opening
```bash
# Check if the report file exists
ls ortoni-report/index.html

# Manually open the report
start ortoni-report/index.html  # Windows
open ortoni-report/index.html    # Mac
xdg-open ortoni-report/index.html # Linux
```

#### Empty Report
```bash
# Ensure tests ran successfully
npm run test:ortoni

# Check for errors in console output
npm run test:ortoni -- --reporter=line
```

#### Port Already in Use
```bash
# Ortoni will automatically try different ports
# If issues persist, check for running processes
netstat -ano | findstr :2004  # Windows
lsof -i :2004                 # Mac/Linux
```

### Performance Tips

1. **Reduce Report Size**: Set `base64Image: false`
2. **Faster Generation**: Use `stdIO: false` for large test suites
3. **Clean History**: Periodically clean the `ortoni-data-history.sqlite` file

## Integration Examples

### With CI/CD
```yaml
# GitHub Actions example
- name: Run Tests with Ortoni
  run: npm run test:ortoni

- name: Upload Ortoni Report
  uses: actions/upload-artifact@v3
  with:
    name: ortoni-report
    path: ortoni-report/
```

### With Different Environments
```bash
# Development
REPORTER_TYPE=ortoni npm test

# Staging
REPORTER_TYPE=ortoni npm run test:e2e

# Production
REPORTER_TYPE=ortoni npm run test:all
```

## Comparison with Other Reporters

| Feature | Ortoni | Allure | Custom Steps |
|---------|--------|--------|--------------|
| Speed | ⚡ Fast | 🐌 Slower | 🐌 Slower |
| Charts | ✅ Yes | ✅ Yes | ✅ Yes |
| History | ✅ Yes | ✅ Yes | ❌ No |
| Customization | ⚠️ Limited | ✅ Extensive | ✅ Full Control |
| Stakeholder Friendly | ⚠️ Moderate | ⚠️ Moderate | ✅ Excellent |
| File Size | ✅ Small | ❌ Large | ⚠️ Medium |

## Advanced Usage

### Custom Metadata
```typescript
meta: {
  'Environment': 'Production',
  'Build Number': process.env.BUILD_NUMBER,
  'Git Commit': process.env.GIT_COMMIT,
  'Test Data': 'Production Database',
  'Browser Versions': 'Chrome 120, Edge 120, Safari 17'
}
```

### Conditional Configuration
```typescript
const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? 'never' : 'always',
  folderPath: process.env.CI ? 'ci-reports/ortoni' : 'ortoni-report',
  // ... other options
};
```

This setup provides a comprehensive Ortoni reporting solution that's perfect for quick feedback and lightweight reporting needs.
