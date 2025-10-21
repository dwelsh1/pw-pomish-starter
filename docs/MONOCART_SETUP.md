# Monocart Reporter Setup

**Monocart Reporter** is a powerful Playwright test reporter that provides a tree grid style interface with high performance for processing big data. It's designed for customization and extensibility with interactive reports featuring grouping and ultra-fast filtering.

## 🚀 Features

- **Tree Grid Style**: Clean, organized view of test results
- **High Performance**: Optimized for processing large test suites
- **Interactive Reports**: Grouping and ultra-fast filtering capabilities
- **Customizable**: Designed for extensibility and customization
- **Rich Visualizations**: Charts, trends, and detailed analytics
- **Multiple Formats**: HTML reports with JSON data export
- **Merge Support**: Built-in shard report merging capabilities

## 📦 Installation

The monocart-reporter is already installed in this project:

```bash
npm install monocart-reporter --save-dev
```

## ⚙️ Configuration

The reporter is configured in `playwright.config.ts` and can be activated via environment variable:

```typescript
// Reporter configuration
const REPORTER_TYPE = process.env.REPORTER_TYPE || 'ortoni'; // 'ortoni', 'allure', 'steps', or 'monocart'

// Monocart reporter configuration
if (REPORTER_TYPE === 'monocart') {
  return [
    ['monocart-reporter', {
      name: 'RBP Test Report',
      outputFile: './monocart-report/index.html',
      onEnd: async (reportData: any, helper: any) => {
        console.log(`Monocart Report generated: ${reportData.summary.tests.total} tests, ${reportData.summary.tests.failed} failed`);
      }
    }],
    ...baseReporters
  ];
}
```

## 🎯 Usage

### Basic Commands

```bash
# Run tests with Monocart reporter
npm run test:monocart

# Or set environment variable directly
REPORTER_TYPE=monocart npx playwright test

# Run specific test types
REPORTER_TYPE=monocart npx playwright test tests/api
REPORTER_TYPE=monocart npx playwright test tests/e2e
```

### Viewing Reports

```bash
# Open the Monocart report in browser
npm run monocart:open

# Or manually open
start monocart-report/index.html

# Clean old reports
npm run monocart:clean
```

## 📊 Report Features

### Tree Grid Interface
- **Hierarchical View**: Tests organized by suites, files, and projects
- **Quick Filtering**: Ultra-fast search and filter capabilities
- **Grouping Options**: Group by status, browser, project, etc.
- **Sorting**: Sort by duration, status, name, etc.

### Rich Analytics
- **Test Summary**: Pass/fail/flaky/skipped counts
- **Performance Metrics**: Duration analysis and trends
- **Error Analysis**: Detailed error reporting and categorization
- **Historical Trends**: Track test performance over time

### Interactive Elements
- **Clickable Tests**: Click on any test for detailed information
- **Expandable Suites**: Expand/collapse test suites
- **Search Functionality**: Find specific tests quickly
- **Export Options**: Export data in various formats

## 🔧 Advanced Configuration

### Custom Report Name and Output

```typescript
['monocart-reporter', {
  name: 'My Custom Test Report',
  outputFile: './custom-reports/my-report.html',
  // Additional options...
}]
```

### onEnd Hook

The `onEnd` hook allows you to perform actions after report generation:

```typescript
onEnd: async (reportData, helper) => {
  // Access report data
  console.log(`Total tests: ${reportData.summary.tests.total}`);
  console.log(`Failed tests: ${reportData.summary.tests.failed}`);
  
  // Use helper functions
  const failedTests = helper.filter((item) => 
    item.type === 'case' && item.caseType === 'failed'
  );
  
  // Send notifications, integrate with external tools, etc.
}
```

### Report Data Structure

The `reportData` object contains:

```typescript
{
  name: string,           // Report name
  date: number,          // Start date in milliseconds
  dateH: string,          // Human-readable date
  duration: number,       // Test duration in milliseconds
  durationH: string,      // Human-readable duration
  summary: {              // Test summary
    tests: { total, passed, failed, flaky, skipped },
    suites: { total, passed, failed },
    steps: { total, passed, failed },
    errors: number,
    retries: number,
    logs: number,
    attachments: number,
    artifacts: number
  },
  rows: Array,            // All test data (tree structure)
  columns: Array,         // Column definitions
  tags: Object,           // Tag collection
  metadata: Object,        // Metadata collection
  system: Object,         // System information
  trends: Array,          // Historical trend data
  // ... more properties
}
```

## 🔄 Shard Report Merging

Monocart Reporter supports merging multiple shard reports:

### Using Merge API

```typescript
import { merge } from 'monocart-reporter';

const reportDataList = [
  'path-to/shard1/index.json',
  'path-to/shard2/index.json',
  'path-to/shard3/index.json'
];

await merge(reportDataList, {
  name: 'Merged Test Report',
  outputFile: 'merged-report/index.html',
  onEnd: async (reportData, helper) => {
    // Process merged report
  }
});
```

### Using Merge CLI

```bash
# Merge multiple reports
npx monocart merge path-to/shard*/index.json -o merged-reports/index.html

# Merge with config file
npx monocart merge path-to/shard*/my-report.zip -c mr.config.js
```

## 🎨 Customization Options

### Theme Customization

```typescript
['monocart-reporter', {
  name: 'RBP Test Report',
  outputFile: './monocart-report/index.html',
  theme: 'dark',  // 'light', 'dark', 'auto'
  // ... other options
}]
```

### Column Customization

```typescript
['monocart-reporter', {
  name: 'RBP Test Report',
  outputFile: './monocart-report/index.html',
  columns: [
    { key: 'title', label: 'Test Name', width: 300 },
    { key: 'status', label: 'Status', width: 100 },
    { key: 'duration', label: 'Duration', width: 120 },
    // Custom columns...
  ]
}]
```

## 🔗 Integration Examples

### Email Notifications

```typescript
onEnd: async (reportData, helper) => {
  if (reportData.summary.tests.failed > 0) {
    await helper.sendEmail({
      to: 'team@company.com',
      subject: `Test Failures: ${reportData.summary.tests.failed} failed`,
      html: `Failed tests: ${reportData.summary.tests.failed}`
    });
  }
}
```

### Slack Integration

```typescript
onEnd: async (reportData, helper) => {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `Test Report: ${reportData.summary.tests.passed} passed, ${reportData.summary.tests.failed} failed`
      })
    });
  }
}
```

## 📈 Performance Benefits

- **Fast Rendering**: Optimized for large test suites (1000+ tests)
- **Efficient Filtering**: Ultra-fast search and filter operations
- **Memory Optimized**: Handles big data without performance degradation
- **Lazy Loading**: Loads data on-demand for better performance

## 🆚 Comparison with Other Reporters

| Feature | Monocart | Ortoni | Allure | Custom Steps |
|---------|----------|--------|--------|--------------|
| **Speed** | ⚡⚡⚡ Very Fast | ⚡⚡ Fast | ⚡ Slow | ⚡ Slow |
| **Visualization** | 🌳 Tree Grid | 📊 Charts | 📈 Rich | 📋 Steps |
| **Filtering** | 🔍 Ultra-fast | 🔍 Basic | 🔍 Good | 🔍 Basic |
| **Customization** | 🎨 High | 🎨 Medium | 🎨 Low | 🎨 High |
| **Big Data** | ✅ Excellent | ✅ Good | ❌ Poor | ❌ Poor |
| **CI/CD** | ✅ Great | ✅ Good | ✅ Good | ✅ Good |

## 🎯 Best Practices

1. **Use for Large Test Suites**: Monocart excels with 100+ tests
2. **Enable Filtering**: Take advantage of the ultra-fast filtering
3. **Customize Columns**: Show only relevant information
4. **Use onEnd Hooks**: Integrate with your workflow
5. **Merge Shard Reports**: Combine multiple test runs
6. **Monitor Performance**: Track trends over time

## 🔗 References

- [Monocart Reporter GitHub](https://github.com/cenfun/monocart-reporter)
- [Monocart Reporter Documentation](https://cenfun.github.io/monocart-reporter)
- [Playwright Reporter Documentation](https://playwright.dev/docs/test-reporters)

## 🚀 Quick Start

1. **Run tests with Monocart**:
   ```bash
   npm run test:monocart
   ```

2. **View the report**:
   ```bash
   npm run monocart:open
   ```

3. **Explore the tree grid interface** and enjoy the high-performance test reporting!

---

**Monocart Reporter** provides the perfect balance of performance, functionality, and customization for comprehensive test reporting. It's particularly valuable for large test suites where other reporters might struggle with performance.
