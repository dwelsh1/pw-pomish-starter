import { defineConfig, devices } from '@playwright/test';
import { OrtoniReportConfig } from 'ortoni-report';
import * as os from 'os';

// Node.js globals
declare const process: NodeJS.Process;

// Restful Booker Platform
const RBP_BASE_URL = process.env.RBP_BASE_URL || 'https://automationintesting.online';

// Reporter configuration - can be switched via environment variable
const REPORTER_TYPE = process.env.REPORTER_TYPE || 'ortoni'; // 'ortoni', 'allure', or 'steps'

const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? 'never' : 'always', // Opens the report automatically unless in CI environment
  folderPath: 'ortoni-report',               // Directory where the report will be saved
  filename: 'index.html',                    // Name of the report file
  title: 'RBP Test Report',                  // Title of the report
  showProject: true,                         // Whether to display project information
  projectName: 'RBP Test Suite',             // Name of your project
  testType: 'E2E',                          // Type of tests
  authorName: os.userInfo().username,        // Author's name
  base64Image: false,                        // Whether to use base64 encoding for images
  stdIO: false,                              // Whether to include standard I/O logs
  meta: {
    'Test Cycle': new Date().toLocaleDateString(), // Current date as test cycle
    version: '0.1.0',                        // Version from package.json
    description: 'Restful Booker Platform test suite', // Description of the test suite
    release: '0.1',                          // Release number
    platform: os.type(),                     // Operating system type
  },
};

// Configure reporters based on REPORTER_TYPE
const getReporters = (): any[] => {
  const baseReporters: any[] = [
    ['html', { open: 'never', outputFolder: 'reports/html' }]
  ];

  if (REPORTER_TYPE === 'allure') {
    return [
      ['allure-playwright', { 
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: false 
      }],
      ...baseReporters
    ];
  } else if (REPORTER_TYPE === 'steps') {
    return [
      ['./src/reporter/StepReporter.ts'],
      ...baseReporters
    ];
  } else {
    return [
      ['ortoni-report', reportConfig],
      ...baseReporters
    ];
  }
};

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced retries for faster CI
  workers: process.env.CI ? 2 : undefined, // Increased workers for faster CI
  timeout: process.env.CI ? 30000 : 60000, // Reduced timeout in CI for faster failure detection
  reporter: getReporters(),
  // Global setup to block ads
  // globalSetup: require.resolve('./src/fixtures/global-setup.ts'),
  use: {
    baseURL: RBP_BASE_URL,
    trace: process.env.CI ? 'off' : 'retain-on-failure', // Disable trace in CI for speed
    video: process.env.CI ? 'off' : 'retain-on-failure', // Disable video in CI for speed
    screenshot: 'only-on-failure',
    actionTimeout: process.env.CI ? 10000 : 15000, // Reduced timeout in CI
    navigationTimeout: process.env.CI ? 20000 : 30000, // Reduced timeout in CI
    headless: true,
    // Block ads and unnecessary resources
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  },
  expect: {
    timeout: 5_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  projects: [
    // E2E tests
    { 
      name: 'rbp-chromium', 
      testDir: 'tests/e2e',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: RBP_BASE_URL
      } 
    },
    { 
      name: 'rbp-edge', 
      testDir: 'tests/e2e',
      use: { 
        ...devices['Desktop Edge'],
        baseURL: RBP_BASE_URL
      } 
    },
    { 
      name: 'rbp-webkit', 
      testDir: 'tests/e2e',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: RBP_BASE_URL
      } 
    },
    { 
      name: 'rbp-mobile-chrome', 
      testDir: 'tests/e2e',
      use: { 
        ...devices['Pixel 7'],
        baseURL: RBP_BASE_URL
      } 
    },
    { 
      name: 'rbp-mobile-safari', 
      testDir: 'tests/e2e',
      use: { 
        ...devices['iPhone 14'],
        baseURL: RBP_BASE_URL
      } 
    },
    
    // API tests
    { 
      name: 'rbp-api', 
      testDir: 'tests/api',
      use: { 
        baseURL: RBP_BASE_URL
      } 
    },
    
    // Visual tests (skip in CI to avoid baseline issues)
    ...(process.env.CI ? [] : [
      { 
        name: 'rbp-visual-chromium', 
        testDir: 'tests/visual',
        use: { 
          ...devices['Desktop Chrome'],
          baseURL: RBP_BASE_URL
        } 
      },
      { 
        name: 'rbp-visual-edge', 
        testDir: 'tests/visual',
        use: { 
          ...devices['Desktop Edge'],
          baseURL: RBP_BASE_URL
        } 
      },
      { 
        name: 'rbp-visual-webkit', 
        testDir: 'tests/visual',
        use: { 
          ...devices['Desktop Safari'],
          baseURL: RBP_BASE_URL
        } 
      },
    ]),
  ],
  outputDir: 'test-results',
  snapshotDir: 'tests/visual/__screenshots__',
});