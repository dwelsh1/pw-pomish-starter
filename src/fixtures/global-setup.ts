import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  // This setup runs once before all tests
  console.log('Setting up global ad blocking...');
}

export default globalSetup;
