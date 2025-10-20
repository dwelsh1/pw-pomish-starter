import type { Page } from '@playwright/test';
import { restfulBooker } from '@selectors/rbp';

// RBP-specific helper functions
export async function loginAsAdmin(page: Page) {
  const rbp = restfulBooker(page);
  
  // Navigate to admin page
  await rbp.adminLink.click();
  
  // Wait for login form
  await rbp.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
  
  // Fill login credentials
  await rbp.usernameInput.fill('admin');
  await rbp.passwordInput.fill('password');
  
  // Submit login
  await rbp.loginButton.click();
  
  // Wait for admin dashboard to load
  await rbp.adminDashboard.waitFor({ state: 'visible', timeout: 15000 });
}

export async function logout(page: Page) {
  const rbp = restfulBooker(page);
  
  await rbp.logoutButton.click();
  
  // Wait for redirect to home page
  await rbp.homeLink.waitFor({ state: 'visible', timeout: 10000 });
}

export async function navigateToRooms(page: Page) {
  const rbp = restfulBooker(page);
  
  try {
    // Try clicking the navigation rooms link first
    await rbp.roomsLink.click();
  } catch {
    // Fallback: navigate directly to rooms URL
    await page.goto('https://automationintesting.online/#rooms');
  }
  
  // Wait for rooms to load with multiple possible selectors
  try {
    await rbp.roomCards.first().waitFor({ state: 'visible', timeout: 10000 });
  } catch {
    // Fallback: wait for any room-related content
    await page.waitForSelector('.room, .card, [class*="room"]', { timeout: 10000 });
  }
}

export async function navigateToAdmin(page: Page) {
  const rbp = restfulBooker(page);
  await rbp.adminLink.click();
}

export async function navigateToContact(page: Page) {
  const rbp = restfulBooker(page);
  
  try {
    // Try clicking the navigation contact link first
    await rbp.contactLink.click();
  } catch {
    // Fallback: navigate directly to contact URL
    await page.goto('https://automationintesting.online/#contact');
  }
  
  // Wait for contact form with multiple possible selectors
  try {
    await rbp.contactForm.waitFor({ state: 'visible', timeout: 10000 });
  } catch {
    // Fallback: wait for any form
    await page.waitForSelector('form', { timeout: 10000 });
  }
}

export async function navigateToReport(page: Page) {
  const rbp = restfulBooker(page);
  await rbp.reportLink.click();
  
  // Wait for report section
  await rbp.reportSection.waitFor({ state: 'visible', timeout: 10000 });
}

// Booking helpers
export async function createBooking(page: Page, bookingData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}) {
  const rbp = restfulBooker(page);
  
  // Fill booking form
  await rbp.firstNameInput.fill(bookingData.firstName);
  await rbp.lastNameInput.fill(bookingData.lastName);
  await rbp.emailInput.fill(bookingData.email);
  await rbp.phoneInput.fill(bookingData.phone);
  await rbp.checkInDateInput.fill(bookingData.checkIn);
  await rbp.checkOutDateInput.fill(bookingData.checkOut);
  await rbp.adultsSelect.selectOption(bookingData.adults.toString());
  await rbp.childrenSelect.selectOption(bookingData.children.toString());
  
  // Submit booking
  await rbp.submitBookingButton.click();
  
  // Wait for success message or booking confirmation
  await rbp.successMessage.waitFor({ state: 'visible', timeout: 10000 });
}

export async function createRoom(page: Page, roomData: {
  roomNumber: string;
  roomType: string;
  roomPrice: string;
  roomDescription: string;
  roomImage?: string;
}) {
  const rbp = restfulBooker(page);
  
  // Click create room button
  await rbp.createRoomButton.click();
  
  // Wait for room form
  await rbp.roomForm.waitFor({ state: 'visible', timeout: 10000 });
  
  // Fill room form
  await rbp.roomNumberInput.fill(roomData.roomNumber);
  await rbp.roomTypeSelect.selectOption(roomData.roomType);
  await rbp.roomPriceInput.fill(roomData.roomPrice);
  await rbp.roomDescriptionTextarea.fill(roomData.roomDescription);
  
  if (roomData.roomImage) {
    await rbp.roomImageInput.setInputFiles(roomData.roomImage);
  }
  
  // Save room
  await rbp.saveRoomButton.click();
  
  // Wait for success message
  await rbp.successMessage.waitFor({ state: 'visible', timeout: 10000 });
}

export async function submitContactForm(page: Page, contactData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const rbp = restfulBooker(page);
  
  // Fill contact form
  await rbp.contactNameInput.fill(contactData.name);
  await rbp.contactEmailInput.fill(contactData.email);
  await rbp.contactPhoneInput.fill(contactData.phone);
  await rbp.contactSubjectInput.fill(contactData.subject);
  await rbp.contactMessageTextarea.fill(contactData.message);
  
  // Submit form
  await rbp.submitContactButton.click();
  
  // Wait for success message
  await rbp.successMessage.waitFor({ state: 'visible', timeout: 10000 });
}

// Utility functions
export async function getCurrentDate(): Promise<string> {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export async function getFutureDate(daysFromNow: number): Promise<string> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromNow);
  return futureDate.toISOString().split('T')[0];
}

export async function generateRandomEmail(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `test-${random}-${timestamp}@example.com`;
}

export async function generateRandomPhone(): Promise<string> {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${areaCode}-${exchange}-${number}`;
}

// API helpers
export async function getBookingById(page: Page, bookingId: string) {
  const response = await page.request.get(`https://automationintesting.online/booking/${bookingId}`);
  return response.json();
}

export async function createBookingViaAPI(page: Page, bookingData: unknown) {
  const response = await page.request.post('https://automationintesting.online/booking/', {
    data: bookingData
  });
  return response.json();
}

export async function updateBookingViaAPI(page: Page, bookingId: string, bookingData: unknown) {
  const response = await page.request.put(`https://automationintesting.online/booking/${bookingId}`, {
    data: bookingData
  });
  return response.json();
}

export async function deleteBookingViaAPI(page: Page, bookingId: string) {
  const response = await page.request.delete(`https://automationintesting.online/booking/${bookingId}`);
  return response.status();
}

export async function getRoomsViaAPI(page: Page) {
  const response = await page.request.get('https://automationintesting.online/room/');
  return response.json();
}

export async function createRoomViaAPI(page: Page, roomData: unknown) {
  const response = await page.request.post('https://automationintesting.online/room/', {
    data: roomData
  });
  return response.json();
}

export async function getMessagesViaAPI(page: Page) {
  const response = await page.request.get('https://automationintesting.online/message/');
  return response.json();
}

export async function createMessageViaAPI(page: Page, messageData: unknown) {
  const response = await page.request.post('https://automationintesting.online/message/', {
    data: messageData
  });
  return response.json();
}
