import { test as base, Page } from '@playwright/test';
import { Eyes, Target, Configuration, BatchInfo } from '@applitools/eyes-playwright';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get API key with fallback
const apiKey = process.env.APPLITOOLS_API_KEY;
if (!apiKey) {
  throw new Error('APPLITOOLS_API_KEY environment variable is required. Please set it in your .env file.');
}

// Applitools configuration
const configuration = new Configuration();
configuration.setApiKey(apiKey);
configuration.setServerUrl('https://eyesapi.applitools.com');

// Batch configuration for better organization
const batchInfo = new BatchInfo('RBP Visual Tests');
batchInfo.setId(`rbp-batch-${Date.now()}`);
configuration.setBatch(batchInfo);

// Applitools Eyes fixture
export const applitoolsFixture = base.extend<{ eyes: Eyes }>({
  eyes: async ({ page }, use) => {
    const eyes = new Eyes(configuration);
    
    // Configure eyes with default settings
    eyes.setConfiguration(configuration);
    
    try {
      await use(eyes);
    } finally {
      // Ensure eyes are closed after each test
      try {
        await eyes.close();
      } catch (error) {
        console.warn('Failed to close eyes:', error);
      }
    }
  }
});

// Helper functions for common Applitools operations
export const applitoolsHelpers = {
  /**
   * Open eyes with RBP-specific settings
   */
  async openEyes(eyes: Eyes, page: Page, testName: string, viewportSize?: { width: number; height: number }) {
    const appName = 'Restful Booker Platform';
    const viewport = viewportSize || { width: 1280, height: 720 };
    
    await eyes.open(page, appName, testName, viewport);
  },

  /**
   * Check full window with Applitools
   */
  async checkWindow(eyes: Eyes, tag?: string) {
    await eyes.check(tag || 'Full Window', Target.window());
  },

  /**
   * Check specific element with Applitools
   */
  async checkElement(eyes: Eyes, selector: string, tag?: string) {
    await eyes.check(tag || `Element: ${selector}`, Target.region(selector));
  },

  /**
   * Check specific region with Applitools
   */
  async checkRegion(eyes: Eyes, region: { x: number; y: number; width: number; height: number }, tag?: string) {
    await eyes.check(tag || 'Custom Region', Target.region(region));
  }
};

// Export the fixture as default
export default applitoolsFixture;
