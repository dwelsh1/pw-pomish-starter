/* eslint-env node */
module.exports = {
  // Allure configuration
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  
  // Environment information
  environment: {
    'Test Environment': 'Restful Booker Platform',
    'Base URL': process.env.RBP_BASE_URL || 'https://automationintesting.online',
    'Browser': 'Multi-browser (Chrome, Firefox, Safari)',
    'Platform': process.platform,
    'Node Version': process.version,
    'Playwright Version': require('@playwright/test/package.json').version
  },
  
  // Categories for test results
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
  ],
  
  // Test result patterns
  testResultPatterns: [
    'allure-results/**/*.json'
  ]
};
