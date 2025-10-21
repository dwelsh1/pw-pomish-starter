import { applitoolsFixture, applitoolsHelpers } from '../../../src/fixtures/applitools';

// Use Applitools fixture
const test = applitoolsFixture;

test.describe('RBP Applitools Visual Tests', () => {
  test('should match homepage visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Homepage');
    
    // Check full window
    await applitoolsHelpers.checkWindow(eyes, 'Homepage Full Page');
  });

  test('should match admin login page visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/admin');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Admin Login');
    
    // Check full window
    await applitoolsHelpers.checkWindow(eyes, 'Admin Login Page');
  });

  test('should match admin dashboard visual with Applitools', async ({ page, eyes }) => {
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
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Admin Dashboard');
    
    // Check full window
    await applitoolsHelpers.checkWindow(eyes, 'Admin Dashboard');
  });

  test('should match navigation menu visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Navigation');
    
    // Check navigation element specifically
    const nav = page.locator('nav').first();
    if (await nav.count() > 0) {
      await applitoolsHelpers.checkElement(eyes, 'nav', 'Navigation Menu');
    } else {
      // If no nav element, check header area
      const header = page.locator('header, .header, .navbar').first();
      if (await header.count() > 0) {
        await applitoolsHelpers.checkElement(eyes, 'header, .header, .navbar', 'Header Area');
      } else {
        // Fallback to full window
        await applitoolsHelpers.checkWindow(eyes, 'Navigation Fallback');
      }
    }
  });

  test('should match room card visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Room Card');
    
    // Look for room cards or booking elements
    const roomCard = page.locator('.room, .booking, .card, [class*="room"], [class*="booking"]').first();
    if (await roomCard.count() > 0) {
      await applitoolsHelpers.checkElement(eyes, '.room, .booking, .card, [class*="room"], [class*="booking"]', 'Room Card');
    } else {
      // Fallback to full window if no specific room elements found
      await applitoolsHelpers.checkWindow(eyes, 'Room Card Fallback');
    }
  });

  test('should match contact form visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Contact Form');
    
    // Look for contact form elements
    const contactForm = page.locator('form, .contact, [class*="contact"], [id*="contact"]').first();
    if (await contactForm.count() > 0) {
      await applitoolsHelpers.checkElement(eyes, 'form, .contact, [class*="contact"], [id*="contact"]', 'Contact Form');
    } else {
      // Fallback to full window
      await applitoolsHelpers.checkWindow(eyes, 'Contact Form Fallback');
    }
  });

  test('should match footer visual with Applitools', async ({ page, eyes }) => {
    await page.goto('https://automationintesting.online/');
    await page.waitForLoadState('networkidle');
    
    // Open eyes for this test
    await applitoolsHelpers.openEyes(eyes, page, 'RBP Footer');
    
    // Check footer element specifically
    const footer = page.locator('footer, .footer').first();
    if (await footer.count() > 0) {
      await applitoolsHelpers.checkElement(eyes, 'footer, .footer', 'Footer');
    } else {
      // Fallback to full window
      await applitoolsHelpers.checkWindow(eyes, 'Footer Fallback');
    }
  });
});
