import { test, expect } from '@playwright/test';
import { restfulBooker } from '../../src/selectors/rbp';

test.describe('Intentional Failure Test', () => {
  test.skip('should fail when trying to click Contact999 link', { tag: ['@smoke', '@failure', '@contact'] }, async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Get selectors for this page
    const selectors = restfulBooker(page);
    
    // This will fail because contactLink selector is set to 'Contact999' which doesn't exist
    await expect(selectors.contactLink).toBeVisible({ timeout: 5000 });
    await selectors.contactLink.click();
  });
});
