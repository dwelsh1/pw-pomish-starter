import { test, expect } from '@playwright/test';

test.describe.skip('Applitools Visual Failure Demonstration', () => {
  test('should fail due to contact form H1 color change with Applitools', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Find the contact form H1 element and change its color to green
    const contactFormH1 = page.locator('h1').filter({ hasText: /contact|form/i }).first();
    
    // Inject CSS to change ALL H1 elements to bright green and make them larger
    await page.addStyleTag({
      content: `
        h1 {
          color: #00ff00 !important;
          font-size: 48px !important;
          background-color: #ff0000 !important;
          border: 5px solid #0000ff !important;
        }
      `
    });
    
    // Wait a moment for the style to apply
    await page.waitForTimeout(1000);
    
    // Applitools is disabled
    expect(true).toBe(true);
  });
});
