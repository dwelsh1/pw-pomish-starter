import { test, expect } from '@playwright/test';

test.describe('RBP API Tests', () => {
  test('should test homepage API', async ({ request }) => {
    const response = await request.get('https://automationintesting.online/');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('Restful-booker-platform');
  });

  test('should test admin page API', async ({ request }) => {
    const response = await request.get('https://automationintesting.online/admin');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toBeTruthy();
  });

  test('should test non-existent API endpoints', async ({ request }) => {
    // Test that non-existent endpoints return 404
    const endpoints = [
      'https://automationintesting.online/api/',
      'https://automationintesting.online/booking/',
      'https://automationintesting.online/room/',
      'https://automationintesting.online/auth/'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(404);
    }
  });

  test('should test POST requests to admin', async ({ request }) => {
    // Try to POST to admin endpoint (login attempt)
    const response = await request.post('https://automationintesting.online/admin', {
      data: {
        username: 'admin',
        password: 'password'
      }
    });
    
    // The response might be 200 (success) or 405 (method not allowed)
    expect([200, 405, 302]).toContain(response.status());
  });

  test('should test different HTTP methods', async ({ request }) => {
    const baseUrl = 'https://automationintesting.online/';
    
    // Test GET
    const getResponse = await request.get(baseUrl);
    expect(getResponse.status()).toBe(200);
    
    // Test HEAD
    const headResponse = await request.head(baseUrl);
    expect([200, 405]).toContain(headResponse.status());
    
    // Test OPTIONS (using fetch instead of request.options)
    try {
      const optionsResponse = await request.fetch(baseUrl, { method: 'OPTIONS' });
      expect([200, 405]).toContain(optionsResponse.status());
    } catch (error) {
      // OPTIONS might not be supported
      console.log('OPTIONS method not supported:', error.message);
    }
  });
});
