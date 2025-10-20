import { test, expect } from '@playwright/test';

test.describe('RBP Visual Regression Tests', () => {
  test('should match homepage visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Take a full page screenshot
    await expect(page).toHaveScreenshot('rbp-homepage.png', { fullPage: true });
  });

  test('should match admin login page visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/admin');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the admin login page
    await expect(page).toHaveScreenshot('rbp-admin-login.png', { fullPage: true });
  });

  test('should match admin dashboard visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/admin');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    const usernameInput = page.locator('input[type="text"], input[name*="user"], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button').filter({ hasText: /login|sign in|submit/i }).first();
    
    await usernameInput.fill('admin');
    await passwordInput.fill('password');
    await submitButton.click();
    
    // Wait for navigation to admin dashboard
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the admin dashboard
    await expect(page).toHaveScreenshot('rbp-admin-dashboard.png', { fullPage: true });
  });

  test('should match navigation menu visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Find navigation element
    const nav = page.locator('nav').first();
    if (await nav.count() > 0) {
      await expect(nav).toHaveScreenshot('rbp-navigation.png');
    } else {
      // If no nav element, take screenshot of header area
      const header = page.locator('header, .header, .navbar').first();
      if (await header.count() > 0) {
        await expect(header).toHaveScreenshot('rbp-header.png');
      }
    }
  });

  test('should match room cards visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Find room-related elements
    const roomElements = page.locator('div, section, article').filter({ hasText: /room|hotel|book|stay/i });
    const roomCount = await roomElements.count();
    
    if (roomCount > 0) {
      // Take screenshot of first few room elements
      const firstRoomElement = roomElements.first();
      await expect(firstRoomElement).toHaveScreenshot('rbp-room-card.png');
    }
  });

  test('should match contact form visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Find contact form
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Look for the contact form (usually the one with more fields)
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        const inputs = form.locator('input, textarea');
        const inputCount = await inputs.count();
        
        if (inputCount >= 3) { // Likely a contact form
          await expect(form).toHaveScreenshot('rbp-contact-form.png');
          break;
        }
      }
    }
  });

  test('should match footer visual snapshot', async ({ page }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Find footer element
    const footer = page.locator('footer, .footer').first();
    if (await footer.count() > 0) {
      await expect(footer).toHaveScreenshot('rbp-footer.png');
    } else {
      // If no footer, take screenshot of bottom part of page
      const body = page.locator('body');
      await expect(body).toHaveScreenshot('rbp-page-bottom.png');
    }
  });
});
