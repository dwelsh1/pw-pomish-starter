import { test as base } from '@playwright/test';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  deleteAccount,
  addProductToCart,
  goToCart,
  proceedToCheckout,
  submitContactForm,
  subscribeToNewsletter,
  navigateToProducts,
  navigateToTestCases,
  navigateToApiTesting
} from '@helpers/automation';

type Helpers = {
  user: {
    register: (userData: unknown) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
  };
  products: {
    addToCart: (productName?: string) => Promise<void>;
    goToCart: () => Promise<void>;
    proceedToCheckout: () => Promise<void>;
  };
  navigation: {
    toProducts: () => Promise<void>;
    toTestCases: () => Promise<void>;
    toApiTesting: () => Promise<void>;
  };
  contact: {
    submitForm: (contactData: unknown) => Promise<void>;
  };
  newsletter: {
    subscribe: (email: string) => Promise<void>;
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
  user: async ({ page }, use) => {
    await use({
      register: (userData) => registerUser(page, userData),
      login: (email, password) => loginUser(page, email, password),
      logout: () => logoutUser(page),
      deleteAccount: () => deleteAccount(page),
    });
  },
  products: async ({ page }, use) => {
    await use({
      addToCart: (productName) => addProductToCart(page, productName),
      goToCart: () => goToCart(page),
      proceedToCheckout: () => proceedToCheckout(page),
    });
  },
  navigation: async ({ page }, use) => {
    await use({
      toProducts: () => navigateToProducts(page),
      toTestCases: () => navigateToTestCases(page),
      toApiTesting: () => navigateToApiTesting(page),
    });
  },
  contact: async ({ page }, use) => {
    await use({
      submitForm: (contactData) => submitContactForm(page, contactData),
    });
  },
  newsletter: async ({ page }, use) => {
    await use({
      subscribe: (email) => subscribeToNewsletter(page, email),
    });
  },
});

export { expect } from '@playwright/test';
