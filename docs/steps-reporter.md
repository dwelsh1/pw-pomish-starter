# Custom Steps Reporter Setup

The Custom Steps Reporter is a stakeholder-friendly reporting solution that generates detailed, readable test reports with dynamic charts and comprehensive test step documentation.

## Overview

The Custom Steps Reporter provides:
- **Stakeholder-Friendly Interface**: Clear, non-technical test descriptions
- **Dynamic Charts**: Interactive visualizations using ApexCharts
- **Detailed Test Steps**: Comprehensive test documentation with preconditions, steps, and postconditions
- **Individual Test Pages**: Dedicated pages for each test with full details
- **Media Integration**: Screenshots, videos, and attachments with proper organization
- **AI-Powered Copy Prompt Feature**: Generate AI-friendly prompts for failed tests
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Features

### Dashboard Overview
- **Test Summary Cards**: Visual cards showing total, passed, failed, and skipped tests
- **Interactive Charts**: 
  - Pie chart showing test distribution
  - Bar chart showing top 10 longest-running tests
- **Test Groups**: Tests organized by file with direct links to individual reports
- **Real-time Statistics**: Live test execution metrics

### Individual Test Reports
- **Test Header**: Status icon, title, duration, browser, and tags
- **Description Section**: Clear test description for stakeholders
- **Preconditions**: What needs to be set up before the test
- **Test Steps**: Detailed step-by-step execution
- **Postconditions**: What should be verified after the test
- **Media & Attachments**: Screenshots, videos, and other files
- **Error Details**: Formatted error messages with context
- **Copy Prompt Buttons**: AI-powered debugging assistance for failed tests

### Dynamic Visualizations
- **ApexCharts Integration**: Professional-grade charts
- **Responsive Design**: Charts adapt to screen size
- **Interactive Elements**: Hover effects and data exploration
- **Performance Metrics**: Visual representation of test timing

### AI-Powered Copy Prompt Feature
The Custom Steps Reporter includes an innovative **Copy Prompt** feature that generates AI-friendly prompts for failed tests, making it easy to get debugging assistance from AI tools like Cursor, ChatGPT, or Claude.

#### Three Prompt Types
1. **Copy Full Prompt** 📋 - Comprehensive analysis with complete test context
2. **Quick Analysis** ⚡ - Fast debugging with essential error information  
3. **Debug Help** 🐛 - Step-by-step debugging guidance

#### What's Included in Prompts
- **Test Details**: Title, status, browser, duration, timestamp
- **Error Details**: Complete error messages with stack traces
- **Test Context**: Description, steps, preconditions, postconditions
- **Attachment References**: Screenshots, videos, traces, error context files
- **AI Analysis Request**: Structured request for comprehensive analysis

#### How to Use
1. **Run Tests**: Execute tests with Custom Steps reporter
2. **View Failed Tests**: Navigate to failed test pages
3. **Copy Prompt**: Click appropriate Copy Prompt button
4. **Paste to AI**: Paste into Cursor, ChatGPT, or other AI tools
5. **Get Help**: Receive comprehensive debugging assistance

#### Technical Implementation
- **PromptGenerator Class**: `src/reporter/PromptGenerator.ts` generates AI-friendly prompts
- **Automatic Generation**: Prompts created automatically for failed tests
- **Clipboard Integration**: Modern Clipboard API with fallback support
- **Visual Feedback**: Button state changes and notifications

## Sidebar Navigation Features

The Steps Reporter now features a modern sidebar navigation system that provides:

### Navigation Options
- **Dashboard**: Overview of test results with summary statistics
- **Tests**: List of all tests organized by file with status indicators
- **Test Details**: In-page test details with enhanced Copy Prompt functionality

### Key Benefits
- **Single-Page Application**: No page refreshes when navigating between sections
- **Responsive Design**: Mobile-friendly sidebar that collapses on smaller screens
- **Browser Navigation**: Back/forward button support with hash-based routing
- **Enhanced UX**: Seamless navigation between dashboard, test list, and individual test details

### Technical Features
- **Dynamic Content Loading**: Test details load without leaving the main page
- **Global Prompt Storage**: Copy Prompt data stored globally for instant access
- **Media Path Correction**: Automatic path fixing for screenshots and videos
- **Clean Interface**: Removed unwanted navigation elements for better UX

## Quick Start

### Basic Usage
```bash
# Run tests with Custom Steps reporting
npm run test:steps

# Open the generated report
npm run steps:open
```

### Report Structure
```
steps-report/
├── index.html            # Main dashboard with sidebar navigation
├── 1/                    # Individual test reports
│   └── index.html
├── 2/
│   └── index.html
└── ...                   # One folder per test
```

## Configuration

The Custom Steps Reporter is implemented as a custom Playwright reporter in `src/reporter/StepReporter.ts`:

```typescript
class StepReporter implements Reporter {
  private testDir = 'tests';
  private testNo = 0;
  private summary: TestSummary = {
    duration: '',
    status: '',
    statusIcon: '',
    total: 0,
    totalPassed: 0,
    totalFailed: 0,
    totalFlaky: 0,
    totalSkipped: 0,
    groupedResults: {}
  };
  // ... implementation details
}
```

## Available Scripts

### Test Execution
- `npm run test:steps` - Run tests with Custom Steps reporting

### Report Management
- `npm run steps:open` - Open Custom Steps report in browser
- `npm run steps:clean` - Clean Custom Steps report files

## Test Annotations

The Custom Steps Reporter supports test annotations for better documentation:

### Available Annotation Types
```typescript
export enum AnnotationType {
  Precondition = 'Pre Condition',
  PostCondition = 'Post Condition', 
  Description = 'Description',
  GoTo = 'Go To',
  Step = 'Step',
  Assert = 'Assert',
  Mock = 'Mock',
}
```

### Using Annotations in Tests
```typescript
test('Login with valid user', {
  annotation: [
    { type: AnnotationType.Description, description: 'Verify user can login with valid credentials' },
    { type: AnnotationType.Precondition, description: 'Valid username and password exist' },
    { type: AnnotationType.Step, description: 'Navigate to login page' },
    { type: AnnotationType.Step, description: 'Enter username and password' },
    { type: AnnotationType.Assert, description: 'Verify successful login' },
    { type: AnnotationType.PostCondition, description: 'User is redirected to dashboard' }
  ]
}, async ({ page }) => {
  // Test implementation
});
```

## Report Templates

### Summary Template (`summary.html`)
- Main dashboard with test overview
- Interactive charts for test distribution and performance
- Test groups organized by file
- Direct links to individual test reports

### Individual Test Template (`stepReporter.html`)
- Detailed test information
- Step-by-step execution details
- Media attachments and error information
- Responsive design for all devices

## Customization

### Adding Custom Annotations
```typescript
// Add custom annotation types
export enum CustomAnnotationType {
  Database = 'Database',
  API = 'API Call',
  UI = 'UI Interaction',
  Validation = 'Data Validation'
}
```

### Modifying Templates
Templates are located in `src/reporter/templates/`:
- `summary.html` - Dashboard template
- `stepReporter.html` - Individual test template

### Styling Customization
Templates use inline CSS for easy customization:
- Material Design icons
- Roboto font family
- Responsive grid layouts
- Custom color schemes

## Best Practices

### For Stakeholders
- Use clear, non-technical descriptions
- Include business context in test descriptions
- Provide meaningful preconditions and postconditions
- Use consistent annotation patterns

### For Developers
- Add annotations to all tests for better documentation
- Include relevant media attachments
- Use descriptive test names
- Group related tests logically

### For Test Management
- Regular cleanup of old reports
- Consistent naming conventions
- Version control for template customizations
- Regular review of test documentation quality

## Troubleshooting

### Common Issues

#### Report Not Generating
```bash
# Check if the reporter is properly configured
npm run test:steps -- --reporter=line

# Verify template files exist
ls src/reporter/templates/
```

#### Empty Test Steps
```bash
# Ensure tests have proper annotations
# Check test implementation for annotation usage
```

#### Charts Not Displaying
```bash
# Check browser console for JavaScript errors
# Verify ApexCharts CDN is accessible
# Check network connectivity
```

#### Template Errors
```bash
# Verify EJS template syntax
# Check for missing variables in templates
# Validate HTML structure
```

#### Copy Prompt Issues
```bash
# Copy buttons not visible
# Cause: Buttons only appear on failed tests
# Solution: Navigate to a failed test page

# Copy failed
# Cause: Browser security restrictions
# Solution: Try refreshing page or different browser

# Incomplete prompts
# Cause: Missing test annotations or error data
# Solution: Ensure tests have proper descriptions and error handling
```

### Performance Optimization

1. **Reduce Media Size**: Compress screenshots and videos
2. **Limit Test Count**: Use test filtering for large suites
3. **Template Caching**: Templates are cached for performance
4. **Clean Old Reports**: Regular cleanup of old report files

## Integration Examples

### With CI/CD
```yaml
# GitHub Actions example
- name: Run Tests with Custom Steps Reporter
  run: npm run test:steps

- name: Upload Custom Steps Report
  uses: actions/upload-artifact@v3
  with:
    name: steps-report
    path: steps-report/
```

### With Different Test Types
```bash
# E2E Tests
npm run test:steps -- tests/e2e/

# API Tests  
npm run test:steps -- tests/api/

# Visual Tests
npm run test:steps -- tests/visual/
```

## Advanced Features

### Custom Test Metadata
```typescript
// Add custom metadata to test results
const resultItem: TestResults = {
  num: this.testNo,
  title: test.title,
  fileName: groupKey,
  timeDuration: result.duration,
  duration: formattedDuration,
  description: description,
  status: result.status,
  browser: browser,
  tags: tags,
  preConditions: preConditions,
  steps: steps,
  postConditions: postConditions,
  statusIcon: statusIcon,
  videoPath: videoPath,
  screenshotPaths: screenshotPaths,
  attachments: reportAttachments,
  errors: errors
};
```

### Dynamic Chart Configuration
```javascript
// Customize chart appearance
var pieChartOptions = {
  chart: {
    type: 'pie',
    height: 300,
  },
  series: [passed, failed, skipped],
  labels: ['Passed', 'Failed', 'Skipped'],
  colors: ['#27ae60', '#e74c3c', '#f39c12'],
  title: {
    text: 'Test Results Distribution',
    align: 'center'
  }
};
```

## Comparison with Other Reporters

| Feature | Custom Steps | Ortoni | Allure |
|---------|--------------|--------|--------|
| Stakeholder Friendly | ✅ Excellent | ⚠️ Moderate | ⚠️ Moderate |
| Test Documentation | ✅ Comprehensive | ⚠️ Basic | ⚠️ Basic |
| Customization | ✅ Full Control | ⚠️ Limited | ✅ Extensive |
| Charts | ✅ Dynamic | ✅ Static | ✅ Interactive |
| Individual Test Pages | ✅ Yes | ❌ No | ✅ Yes |
| Media Integration | ✅ Excellent | ⚠️ Basic | ✅ Good |
| Setup Complexity | ⚠️ Medium | ✅ Simple | ❌ Complex |

## File Structure

```
src/reporter/
├── StepReporter.ts          # Main reporter implementation
├── PromptGenerator.ts       # AI prompt generation utility
├── types.ts                 # TypeScript interfaces and enums
├── helpers.ts               # Utility classes (HtmlHelper, FileHelper, TimeHelper)
└── templates/
    ├── summary.html         # Dashboard template
    └── stepReporter.html    # Individual test template

steps-report/                # Generated reports
├── summary.html            # Main dashboard
├── 1/                     # Test 1 details
│   └── index.html
├── 2/                     # Test 2 details
│   └── index.html
└── ...                    # Additional test folders
```

This Custom Steps Reporter provides the most comprehensive and stakeholder-friendly reporting solution, perfect for teams that need detailed test documentation and clear communication with non-technical stakeholders.

## 📂 Steps Reporter File Structure

```
src/reporter/
├── StepReporter.ts          # Main reporter implementation
├── PromptGenerator.ts       # AI prompt generation logic
├── types.ts                 # TypeScript interfaces
├── helpers.ts               # Utility functions
└── templates/
    ├── stepReporter.html    # Individual test report template
    └── summary.html         # Summary report template (renamed to index.html)

steps-report/                 # Generated reports
├── index.html              # Main summary page
├── 1/index.html            # Individual test reports
├── 2/index.html
├── ...
└── attachments/            # Screenshots, videos, traces
```

## 🔍 What You'll See

1. **Main Summary**: `http://localhost:8080/` - Overview of all tests
2. **Individual Tests**: `http://localhost:8080/[test-number]/index.html` - Detailed test reports
3. **Copy Prompt Buttons**: On failed tests, you'll see three buttons:
   - **📋 Copy Full Prompt** - Comprehensive analysis
   - **⚡ Quick Analysis** - Fast error analysis
   - **🐛 Debug Help** - Debugging-focused prompt

## 🎯 Test the Copy Prompt Feature

Navigate to any failed test (like the "Contact999" test) and you should see the Copy Prompt buttons with the red left border styling. Click any button to copy the AI prompt to your clipboard!

The Steps reporter is the most feature-complete implementation with full Copy Prompt functionality working perfectly.

## Additional Resources

- **[COPY_PROMPT_USAGE.md](./COPY_PROMPT_USAGE.md)** - Detailed guide for using the AI-powered Copy Prompt feature
- **[DEVELOPER.md](./DEVELOPER.md)** - Technical implementation details and developer guidelines
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete documentation overview
