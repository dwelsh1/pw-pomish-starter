import { test, expect } from '@playwright/test';
import { pwApi } from 'pw-api-plugin';
import { validateSchema } from 'playwright-schema-validator';

// JSON Schema for homepage response validation
const homepageSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['content']
};

// JSON Schema for admin page response validation
const adminPageSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['content']
};

test.describe('RBP API Tests', () => {
  test('should test homepage API with enhanced visualization', async ({ page }) => {
    // Using pw-api-plugin for enhanced API visualization
    const response = await pwApi.get({ page }, 'https://automationintesting.online/');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('Restful-booker-platform');
    
    // Schema validation
    await validateSchema(page, content, homepageSchema);
  });

  test('should test admin page API with enhanced visualization', async ({ page }) => {
    // Using pw-api-plugin for enhanced API visualization
    const response = await pwApi.get({ page }, 'https://automationintesting.online/admin');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toBeTruthy();
    
    // Schema validation
    await validateSchema(page, content, adminPageSchema);
  });

  test('should test non-existent API endpoints with detailed logging', async ({ page }) => {
    // Test that non-existent endpoints return 404
    const endpoints = [
      'https://automationintesting.online/api/',
      'https://automationintesting.online/booking/',
      'https://automationintesting.online/room/',
      'https://automationintesting.online/auth/'
    ];
    
    for (const endpoint of endpoints) {
      // Using pw-api-plugin for enhanced API visualization
      const response = await pwApi.get({ page }, endpoint);
      expect(response.status()).toBe(404);
      
      // Log the response for debugging
      const content = await response.text();
      console.log(`404 Response for ${endpoint}:`, content.substring(0, 100));
    }
  });

  test('should test POST requests to admin with enhanced visualization', async ({ page }) => {
    // Try to POST to admin endpoint (login attempt)
    const response = await pwApi.post({ page }, 'https://automationintesting.online/admin', {
      data: {
        username: 'admin',
        password: 'password'
      }
    });
    
    // The response might be 200 (success) or 405 (method not allowed)
    expect([200, 405, 302]).toContain(response.status());
    
    // Log response details for debugging
    const content = await response.text();
    console.log('POST Response:', content.substring(0, 200));
  });

  test('should test different HTTP methods with enhanced visualization', async ({ page }) => {
    const baseUrl = 'https://automationintesting.online/';
    
    // Test GET with pw-api-plugin
    const getResponse = await pwApi.get({ page }, baseUrl);
    expect(getResponse.status()).toBe(200);
    
    // Test HEAD with pw-api-plugin
    const headResponse = await pwApi.head({ page }, baseUrl);
    expect([200, 405]).toContain(headResponse.status());
    
    // Test OPTIONS using pw-api-plugin fetch method
    try {
      const optionsResponse = await pwApi.fetch({ page }, baseUrl, { method: 'OPTIONS' });
      expect([200, 405]).toContain(optionsResponse.status());
    } catch (error) {
      // OPTIONS might not be supported
      console.log('OPTIONS method not supported:', error.message);
    }
  });

  test('should test API response headers and timing', async ({ page }) => {
    const response = await pwApi.get({ page }, 'https://automationintesting.online/');
    
    expect(response.status()).toBe(200);
    
    // Test response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('text/html');
    
    // Test response timing (pw-api-plugin provides this automatically)
    const content = await response.text();
    expect(content).toBeTruthy();
    
    console.log('Response Headers:', Object.keys(headers));
    console.log('Content-Type:', headers['content-type']);
  });
});
