import { test, expect } from '@playwright/test';

test.describe('Visual Failure Demonstration', () => {
  test('should create baseline for contact form', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Take a baseline screenshot without any modifications
    await expect(page).toHaveScreenshot('contact-form-baseline.png', { fullPage: true });
  });

  test('should fail due to contact form H1 color change', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
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
    
    // Take a screenshot - this should fail because the color changed
    await expect(page).toHaveScreenshot('contact-form-baseline.png', { fullPage: true });
  });
});