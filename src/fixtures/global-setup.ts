import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // This setup runs once before all tests
  console.log('Setting up global ad blocking...');
}

export default globalSetup;
