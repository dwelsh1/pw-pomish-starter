# Applitools Visual Testing Setup

This document provides comprehensive guidance on using Applitools Eyes for visual testing in the RBP project. Applitools offers advanced visual testing capabilities with AI-powered comparison and cross-browser testing.

## Table of Contents

- [Overview](#overview)
- [Setup & Configuration](#setup--configuration)
- [Running Applitools Tests](#running-applitools-tests)
- [Test Structure](#test-structure)
- [Helper Functions](#helper-functions)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Applitools Eyes provides:
- **AI-powered visual comparison** - More intelligent than pixel-perfect comparison
- **Cross-browser testing** - Automatic testing across different browsers and devices
- **Dynamic content handling** - Better handling of dynamic content and animations
- **Cloud-based testing** - No need to maintain baseline images locally
- **Rich reporting** - Detailed visual reports with diff highlighting

## Setup & Configuration

### 1. Environment Variables

The Applitools API key is stored in the `.env` file:

```bash
# .env file
APPLITOOLS_API_KEY=your_api_key_here
VISUAL_TYPE=playwright  # or applitools
```

### 2. Dependencies

Required packages are already installed:

```json
{
  "@applitools/eyes-playwright": "^1.40.5",
  "dotenv": "^17.2.3"
}
```

### 3. Fixtures Configuration

The Applitools integration uses a custom fixture (`src/fixtures/applitools.ts`) that provides:

- **Eyes instance** - Pre-configured Applitools Eyes
- **Helper functions** - Common Applitools operations
- **Automatic cleanup** - Ensures eyes are properly closed

## Running Applitools Tests

### Basic Commands

```bash
# Run all Applitools visual tests
npm run test:visual:applitools

# Run Applitools tests on specific browsers
npm run test:applitools:chromium
npm run test:applitools:edge
npm run test:applitools:webkit

# Run both Playwright and Applitools visual tests
npm run test:visual:all
```

### Applitools Commands Summary
| Command Type | Command | Description |
|--------------|---------|-------------|
| **All Tests** | `npm run test:visual:applitools` | Run all Applitools visual tests |
| **Browser-Specific** | `npm run test:applitools:chromium` | Chrome only |
| | `npm run test:applitools:edge` | Edge only |
| | `npm run test:applitools:webkit` | Safari only |
| **Combined** | `npm run test:visual:all` | Both Playwright and Applitools |
| **Project-Specific** | `npx playwright test --project=rbp-applitools-chromium` | Direct project execution |

### Browser-Specific Testing

```bash
# Chrome only
npm run test:applitools:chromium

# Edge only
npm run test:applitools:edge

# Safari only
npm run test:applitools:webkit
```

### Project-Specific Testing

```bash
# Run specific Applitools project
npx playwright test --project=rbp-applitools-chromium
npx playwright test --project=rbp-applitools-edge
npx playwright test --project=rbp-applitools-webkit
```

### Visual Failure Demonstration

To see how Applitools handles visual differences compared to Playwright's built-in visual testing:

```bash
# Run Applitools visual failure test
npm run test:applitools:chromium -- tests/visual/applitools/applitools-failure-demo.spec.ts

# Compare with Playwright visual failure test
npx playwright test tests/visual/visual-failure-demo.spec.ts --grep "should fail due to contact form H1 color change"
```

**See [VISUAL_FAILURE_DEMO.md](./VISUAL_FAILURE_DEMO.md) for a comprehensive comparison of both approaches.**

## Test Structure

### Basic Test Pattern

```typescript
import { test } from '@playwright/test';
import { applitoolsFixture, applitoolsHelpers } from '../../../src/fixtures/applitools';

const test = applitoolsFixture;

test.describe('My Applitools Tests', () => {
  test('should match visual with Applitools', async ({ page, eyes }) => {
    // Navigate to page
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'Test Name');
    
    // Check visual
    await applitoolsHelpers.checkWindow(eyes, 'Full Page');
  });
});
```

### Available Test Projects

| Project Name | Browser | Test Directory |
|--------------|---------|----------------|
| `rbp-applitools-chromium` | Chrome | `tests/visual/applitools` |
| `rbp-applitools-edge` | Edge | `tests/visual/applitools` |
| `rbp-applitools-webkit` | Safari | `tests/visual/applitools` |

## Helper Functions

The `applitoolsHelpers` object provides convenient methods:

### `openEyes(eyes, page, testName, viewportSize?)`

Opens Applitools Eyes with RBP-specific settings:

```typescript
await applitoolsHelpers.openEyes(eyes, page, 'Homepage Test');
await applitoolsHelpers.openEyes(eyes, page, 'Mobile Test', { width: 375, height: 667 });
```

### `checkWindow(eyes, tag?)`

Checks the full window:

```typescript
await applitoolsHelpers.checkWindow(eyes, 'Homepage Full Page');
await applitoolsHelpers.checkWindow(eyes); // Uses default tag
```

### `checkElement(eyes, selector, tag?)`

Checks a specific element:

```typescript
await applitoolsHelpers.checkElement(eyes, 'nav', 'Navigation Menu');
await applitoolsHelpers.checkElement(eyes, '.hero', 'Hero Section');
```

### `checkRegion(eyes, region, tag?)`

Checks a specific region:

```typescript
const region = { x: 100, y: 200, width: 300, height: 400 };
await applitoolsHelpers.checkRegion(eyes, region, 'Custom Region');
```

## Best Practices

### 1. Test Organization

- **Separate directories**: Keep Applitools tests in `tests/visual/applitools/`
- **Descriptive names**: Use clear test names and tags
- **Logical grouping**: Group related tests in describe blocks

### 2. Visual Testing Strategy

- **Full page tests**: Use `checkWindow()` for overall page layout
- **Component tests**: Use `checkElement()` for specific components
- **Responsive tests**: Test different viewport sizes

### 3. Test Data Management

- **Consistent state**: Ensure pages are in a consistent state before checking
- **Wait for stability**: Use `waitForLoadState('networkidle')` before visual checks
- **Handle dynamic content**: Applitools handles dynamic content better than pixel comparison

### 4. Performance Considerations

- **Batch tests**: Applitools automatically batches tests for efficiency
- **Skip in CI**: Applitools tests are skipped in CI to avoid API limits
- **Selective testing**: Run specific tests when needed

## Troubleshooting

### Common Issues

#### 1. API Key Not Found

**Error**: `API key not found`

**Solution**: Ensure `.env` file exists with correct API key:
```bash
APPLITOOLS_API_KEY=your_actual_api_key
```

#### 2. Eyes Not Closed

**Error**: `Eyes not closed properly`

**Solution**: The fixture automatically handles cleanup, but ensure tests don't throw unhandled errors.

#### 3. Network Issues

**Error**: `Network timeout` or `Connection failed`

**Solution**: Check internet connection and Applitools service status.

#### 4. Baseline Mismatch

**Issue**: Tests fail due to baseline differences

**Solution**: 
- Review Applitools dashboard for visual differences
- Accept new baselines if changes are intentional
- Use Applitools' smart comparison features

### Debug Mode

Enable debug logging by setting environment variable:

```bash
APPLITOOLS_DEBUG=true npm run test:visual:applitools
```

### Viewing Results

1. **Applitools Dashboard**: Visit [applitools.com](https://applitools.com) to view test results
2. **Test Reports**: Check the generated reports for detailed information
3. **Console Output**: Look for Applitools-specific output in test runs

## Integration with Existing Tests

### Switching Between Visual Testing Methods

You can easily switch between Playwright's built-in visual testing and Applitools:

```bash
# Playwright visual tests (pixel comparison)
npm run test:visual

# Applitools visual tests (AI-powered comparison)
npm run test:visual:applitools

# Both methods
npm run test:visual:all
```

### Environment-Based Switching

Use the `VISUAL_TYPE` environment variable:

```bash
# Set in .env file
VISUAL_TYPE=applitools  # or playwright

# Or override for specific runs
cross-env VISUAL_TYPE=applitools npm run test:visual
```

## Advanced Configuration

### Custom Applitools Settings

Modify `src/fixtures/applitools.ts` to customize:

- **Batch settings**: Change batch names and IDs
- **Viewport sizes**: Set default viewport dimensions
- **Server configuration**: Point to different Applitools servers
- **Match settings**: Configure comparison sensitivity

### CI/CD Integration

For CI/CD pipelines:

1. **Set API key**: Add `APPLITOOLS_API_KEY` to CI environment variables
2. **Skip in CI**: Tests are automatically skipped in CI environments
3. **Artifact collection**: Collect Applitools reports as artifacts

## Support and Resources

- **Applitools Documentation**: [https://applitools.com/docs/](https://applitools.com/docs/)
- **Playwright Integration**: [https://applitools.com/docs/playwright/](https://applitools.com/docs/playwright/)
- **Community Support**: [https://community.applitools.com/](https://community.applitools.com/)
- **API Reference**: [https://applitools.com/docs/api/](https://applitools.com/docs/api/)
