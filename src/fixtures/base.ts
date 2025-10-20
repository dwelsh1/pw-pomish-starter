import { test as base } from '@playwright/test';
import { 
  loginAsAdmin,
  logout,
  navigateToRooms,
  navigateToAdmin,
  navigateToContact,
  submitContactForm,
  generateRandomEmail,
  generateRandomPhone
} from '../helpers/rbp';

type Helpers = {
  auth: {
    loginAsAdmin: () => Promise<void>;
    logout: () => Promise<void>;
  };
  navigation: {
    toRooms: () => Promise<void>;
    toAdmin: () => Promise<void>;
    toContact: () => Promise<void>;
  };
  contact: {
    submitForm: (contactData: any) => Promise<void>;
  };
  utils: {
    generateRandomEmail: () => Promise<string>;
    generateRandomPhone: () => Promise<string>;
  };
};

export const test = base.extend<Helpers>({
  page: async ({ page }, use) => {
    // Block ads and unnecessary resources
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('googleads') || 
          url.includes('doubleclick') || 
          url.includes('googlesyndication') ||
          url.includes('facebook.com/tr') ||
          url.includes('analytics') ||
          url.includes('googletagmanager')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await use(page);
  },

  auth: async ({ page }, use) => {
    await use({
      loginAsAdmin: () => loginAsAdmin(page),
      logout: () => logout(page),
    });
  },

  navigation: async ({ page }, use) => {
    await use({
      toRooms: () => navigateToRooms(page),
      toAdmin: () => navigateToAdmin(page),
      toContact: () => navigateToContact(page),
    });
  },

  contact: async ({ page }, use) => {
    await use({
      submitForm: (contactData: any) => submitContactForm(page, contactData),
    });
  },

  utils: async ({ page: _page }, use) => {
    await use({
      generateRandomEmail: () => generateRandomEmail(),
      generateRandomPhone: () => generateRandomPhone(),
    });
  },
});