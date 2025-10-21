import type { Page, Locator } from '@playwright/test';

// Centralized selectors for Restful Booker Platform (RBP)
export const restfulBooker = (page: Page) => {
  // Navigation elements - more specific selectors
  const homeLink: Locator = page.locator('nav').getByRole('link', { name: 'Home' });
  const roomsLink: Locator = page.locator('nav').getByRole('link', { name: 'Rooms' });
  const adminLink: Locator = page.locator('nav').getByRole('link', { name: 'Admin' });
  const contactLink: Locator = page.locator('nav').getByRole('link', { name: 'Contact999' });
  const reportLink: Locator = page.locator('nav').getByRole('link', { name: 'Report' });

  // Authentication elements
  const loginButton: Locator = page.getByRole('button', { name: 'Login' });
  const logoutButton: Locator = page.getByRole('button', { name: 'Logout' });
  const usernameInput: Locator = page.locator('input[name="username"]');
  const passwordInput: Locator = page.locator('input[name="password"]');

  // Home page elements
  const heroSection: Locator = page.locator('.hero');
  const heroTitle: Locator = page.locator('.hero h1');
  const heroSubtitle: Locator = page.locator('.hero p');
  const bookNowButton: Locator = page.getByRole('button', { name: 'Book this room' });

  // Room elements - more specific selectors
  const roomCards: Locator = page.locator('.room-card, .card, [class*="room"]');
  const roomCard: Locator = page.locator('.room-card, .card, [class*="room"]').first();
  const roomImage: Locator = page.locator('.room-card img, .card img, [class*="room"] img');
  const roomTitle: Locator = page.locator('.room-card h3, .card h3, [class*="room"] h3, .room-title');
  const roomDescription: Locator = page.locator('.room-card p, .card p, [class*="room"] p, .room-description');
  const roomPrice: Locator = page.locator('.room-card .price, .card .price, [class*="room"] .price, .room-price');
  const roomFeatures: Locator = page.locator('.room-card .features, .card .features, [class*="room"] .features, .room-features');

  // Booking form elements - more flexible selectors
  const bookingForm: Locator = page.locator('form').first();
  const firstNameInput: Locator = page.locator('input[name="firstname"], input[name="firstName"], input[placeholder*="first"], input[placeholder*="First"]');
  const lastNameInput: Locator = page.locator('input[name="lastname"], input[name="lastName"], input[placeholder*="last"], input[placeholder*="Last"]');
  const emailInput: Locator = page.locator('input[name="email"], input[type="email"]');
  const phoneInput: Locator = page.locator('input[name="phone"], input[type="tel"]');
  const checkInDateInput: Locator = page.locator('input[name="checkin"], input[name="checkIn"], input[type="date"]').first();
  const checkOutDateInput: Locator = page.locator('input[name="checkout"], input[name="checkOut"], input[type="date"]').last();
  const adultsSelect: Locator = page.locator('select[name="adults"], select[name="adult"]');
  const childrenSelect: Locator = page.locator('select[name="children"], select[name="child"]');
  const submitBookingButton: Locator = page.getByRole('button', { name: 'Book' }).or(page.getByRole('button', { name: 'Submit' }));
  const cancelBookingButton: Locator = page.getByRole('button', { name: 'Cancel' });

  // Admin dashboard elements - more flexible selectors
  const adminDashboard: Locator = page.locator('.admin-dashboard, .dashboard, [class*="admin"], main').first();
  const bookingsTable: Locator = page.locator('table').first();
  const bookingRows: Locator = page.locator('table tbody tr, table tr');
  const createBookingButton: Locator = page.getByRole('button', { name: 'Create Booking' }).or(page.getByRole('button', { name: 'Add Booking' }));
  const editBookingButton: Locator = page.getByRole('button', { name: 'Edit' });
  const deleteBookingButton: Locator = page.getByRole('button', { name: 'Delete' });

  // Room management elements
  const roomManagement: Locator = page.locator('.room-management');
  const createRoomButton: Locator = page.getByRole('button', { name: 'Create Room' });
  const roomForm: Locator = page.locator('form');
  const roomNumberInput: Locator = page.locator('input[name="roomNumber"]');
  const roomTypeSelect: Locator = page.locator('select[name="roomType"]');
  const roomPriceInput: Locator = page.locator('input[name="roomPrice"]');
  const roomDescriptionTextarea: Locator = page.locator('textarea[name="roomDescription"]');
  const roomImageInput: Locator = page.locator('input[name="roomImage"]');
  const saveRoomButton: Locator = page.getByRole('button', { name: 'Save' });

  // Contact form elements - more flexible selectors
  const contactForm: Locator = page.locator('form').last();
  const contactNameInput: Locator = page.locator('input[name="name"], input[placeholder*="name"], input[placeholder*="Name"]');
  const contactEmailInput: Locator = page.locator('input[name="email"], input[type="email"]');
  const contactPhoneInput: Locator = page.locator('input[name="phone"], input[type="tel"]');
  const contactSubjectInput: Locator = page.locator('input[name="subject"], input[placeholder*="subject"], input[placeholder*="Subject"]');
  const contactMessageTextarea: Locator = page.locator('textarea[name="message"], textarea[placeholder*="message"], textarea[placeholder*="Message"]');
  const submitContactButton: Locator = page.getByRole('button', { name: 'Submit' }).or(page.getByRole('button', { name: 'Send' }));

  // Report elements
  const reportSection: Locator = page.locator('.report-section');
  const reportTable: Locator = page.locator('table');
  const generateReportButton: Locator = page.getByRole('button', { name: 'Generate Report' });
  const exportReportButton: Locator = page.getByRole('button', { name: 'Export' });

  // Message elements
  const messageSection: Locator = page.locator('.message-section');
  const messageTable: Locator = page.locator('table');
  const messageRows: Locator = page.locator('table tbody tr');
  const markAsReadButton: Locator = page.getByRole('button', { name: 'Mark as Read' });
  const deleteMessageButton: Locator = page.getByRole('button', { name: 'Delete' });

  // Success/Error messages - more flexible selectors
  const successMessage: Locator = page.locator('.alert-success, .success, .message-success, [class*="success"], .notification-success');
  const errorMessage: Locator = page.locator('.alert-danger, .error, .message-error, [class*="error"], .notification-error');
  const warningMessage: Locator = page.locator('.alert-warning, .warning, .message-warning, [class*="warning"], .notification-warning');
  const infoMessage: Locator = page.locator('.alert-info, .info, .message-info, [class*="info"], .notification-info');

  // Loading states
  const loadingSpinner: Locator = page.locator('.spinner');
  const loadingOverlay: Locator = page.locator('.loading-overlay');

  // Modal elements
  const modal: Locator = page.locator('.modal');
  const modalTitle: Locator = page.locator('.modal-title');
  const modalBody: Locator = page.locator('.modal-body');
  const modalFooter: Locator = page.locator('.modal-footer');
  const closeModalButton: Locator = page.locator('.modal .close');
  const confirmButton: Locator = page.getByRole('button', { name: 'Confirm' });

  return {
    // Navigation
    homeLink, roomsLink, adminLink, contactLink, reportLink,
    
    // Authentication
    loginButton, logoutButton, usernameInput, passwordInput,
    
    // Home page
    heroSection, heroTitle, heroSubtitle, bookNowButton,
    
    // Rooms
    roomCards, roomCard, roomImage, roomTitle, roomDescription, roomPrice, roomFeatures,
    
    // Booking
    bookingForm, firstNameInput, lastNameInput, emailInput, phoneInput,
    checkInDateInput, checkOutDateInput, adultsSelect, childrenSelect,
    submitBookingButton, cancelBookingButton,
    
    // Admin dashboard
    adminDashboard, bookingsTable, bookingRows, createBookingButton,
    editBookingButton, deleteBookingButton,
    
    // Room management
    roomManagement, createRoomButton, roomForm, roomNumberInput,
    roomTypeSelect, roomPriceInput, roomDescriptionTextarea, roomImageInput, saveRoomButton,
    
    // Contact
    contactForm, contactNameInput, contactEmailInput, contactPhoneInput,
    contactSubjectInput, contactMessageTextarea, submitContactButton,
    
    // Reports
    reportSection, reportTable, generateReportButton, exportReportButton,
    
    // Messages
    messageSection, messageTable, messageRows, markAsReadButton, deleteMessageButton,
    
    // Messages and states
    successMessage, errorMessage, warningMessage, infoMessage,
    loadingSpinner, loadingOverlay,
    
    // Modals
    modal, modalTitle, modalBody, modalFooter, closeModalButton, confirmButton
  };
};
