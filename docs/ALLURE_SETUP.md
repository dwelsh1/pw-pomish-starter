# Allure Reporter Setup

## Overview
Allure Reporter provides comprehensive test reporting with detailed test results, attachments, and beautiful visualizations. This guide covers setup, configuration, and the AI-Powered Copy Prompt enhancement.

## Installation
Allure Reporter is already included in this project:
```bash
npm install allure-playwright allure-commandline
```

## Configuration
The Allure Reporter is configured in `playwright.config.ts`. Ensure your `playwright.config.ts` includes the Allure reporter:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ... other configurations
  reporter: process.env.REPORTER_TYPE === 'allure' ? [
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false 
    }],
    ['html', { open: 'never', outputFolder: 'reports/html' }]
  ] : [
    // ... other reporters
  ],
  // ...
});
```

## AI-Powered Copy Prompt Feature
The Allure reporter is enhanced with AI-Powered Copy Prompt functionality through a post-processing script. This allows you to quickly copy detailed test failure information to AI tools for analysis.

### How it Works
1. **Test Execution**: Run your Playwright tests with the Allure reporter.
2. **Report Generation**: Allure generates raw results in the `allure-results` directory.
3. **Report Processing**: Use `allure generate` to create the HTML report from raw results.
4. **Post-Processing**: A custom script (`enhance-allure.ts`) automatically runs after report generation. This script:
   - Injects necessary CSS for the Copy Prompt buttons.
   - Injects JavaScript that dynamically detects failed test elements in the Allure report's DOM.
   - Attaches "Copy Full Prompt", "Quick Analysis", and "Debug Help" buttons to each failed test.
   - Provides clipboard functionality and visual feedback.
   - Generates AI-friendly prompts using the `PromptGenerator` class based on the extracted test data.

### Usage
To run tests and automatically enhance the Allure report:
```bash
npm run test:allure
```

To manually enhance an existing Allure report:
```bash
npm run allure:generate
npm run enhance-allure
```

### What's Included in the Prompt
The prompts generated for Allure reports include:
- **Test Details**: Title, status, browser, duration, timestamp, file location.
- **Error Details**: Full error messages and stack traces.
- **Step Information**: Test execution steps and their status.
- **Attachment References**: Names of screenshots, videos, and other attachments (e.g., `error-context.md`, `trace.zip`). *Note: The actual binary content of attachments is not included in the prompt due to size limitations and AI context window constraints.*
- **AI Analysis Request**: A structured request guiding the AI to provide root cause analysis, potential fixes, prevention strategies, and code suggestions.

### Report Location
The enhanced Allure report will be located at:
- **File**: `allure-report/index.html`
- **Data**: `allure-report/data/`
- **Attachments**: `allure-report/data/attachments/`

## Troubleshooting
- **Buttons Not Appearing**:
  - Ensure `npm run test:allure` or `npm run enhance-allure` completed successfully without errors.
  - Verify that `allure-report/index.html` was modified (check its timestamp).
  - Open the browser's developer console (F12) and check for JavaScript errors.
  - The enhancement script relies on specific DOM selectors. If Allure's internal HTML structure changes in a future version, the selectors in `src/reporter/AllureEnhancer.ts` might need adjustment.
- **"Failed to copy prompt" Error**:
  - Check the browser's developer console for specific clipboard API errors.
  - Ensure you are accessing the report over `http://localhost` or `https://` as clipboard access is restricted in non-secure contexts.

## Additional Resources
- [Copy Prompt Usage Guide](./COPY_PROMPT_USAGE.md)
- [Developer Guide](./DEVELOPER.md)
- [Main Documentation Index](./DOCUMENTATION.md)