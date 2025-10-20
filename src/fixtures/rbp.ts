import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { 
  loginAsAdmin, 
  logout,
  navigateToRooms,
  navigateToAdmin,
  navigateToContact,
  navigateToReport,
  createBooking,
  createRoom,
  submitContactForm,
  getCurrentDate,
  getFutureDate,
  generateRandomEmail,
  generateRandomPhone,
  getBookingById,
  createBookingViaAPI,
  updateBookingViaAPI,
  deleteBookingViaAPI,
  getRoomsViaAPI,
  createRoomViaAPI,
  getMessagesViaAPI,
  createMessageViaAPI
} from '@helpers/rbp';

type BookingData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

type RoomData = {
  roomNumber: string;
  roomType: string;
  roomPrice: string;
  roomDescription: string;
  roomImage?: string;
};

type ContactData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type MessageData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
};

type RBPHelpers = {
  auth: {
    loginAsAdmin: () => Promise<void>;
    logout: () => Promise<void>;
  };
  navigation: {
    toRooms: () => Promise<void>;
    toAdmin: () => Promise<void>;
    toContact: () => Promise<void>;
    toReport: () => Promise<void>;
  };
  booking: {
    create: (bookingData: BookingData) => Promise<void>;
    getById: (bookingId: string) => Promise<any>;
    createViaAPI: (bookingData: any) => Promise<any>;
    updateViaAPI: (bookingId: string, bookingData: any) => Promise<any>;
    deleteViaAPI: (bookingId: string) => Promise<number>;
  };
  room: {
    create: (roomData: RoomData) => Promise<void>;
    getAllViaAPI: () => Promise<any>;
    createViaAPI: (roomData: any) => Promise<any>;
  };
  contact: {
    submitForm: (contactData: ContactData) => Promise<void>;
  };
  message: {
    getAllViaAPI: () => Promise<any>;
    createViaAPI: (messageData: MessageData) => Promise<any>;
  };
  utils: {
    getCurrentDate: () => Promise<string>;
    getFutureDate: (daysFromNow: number) => Promise<string>;
    generateRandomEmail: () => Promise<string>;
    generateRandomPhone: () => Promise<string>;
  };
};

// Create a simple fixture without complex typing
export const test = base.extend({
  rbp: async ({ page }: { page: Page }, use: any) => {
    const rbpHelpers: RBPHelpers = {
      auth: {
        loginAsAdmin: () => loginAsAdmin(page),
        logout: () => logout(page),
      },
      navigation: {
        toRooms: () => navigateToRooms(page),
        toAdmin: () => navigateToAdmin(page),
        toContact: () => navigateToContact(page),
        toReport: () => navigateToReport(page),
      },
      booking: {
        create: (bookingData: BookingData) => createBooking(page, bookingData),
        getById: (bookingId: string) => getBookingById(page, bookingId),
        createViaAPI: (bookingData: any) => createBookingViaAPI(page, bookingData),
        updateViaAPI: (bookingId: string, bookingData: any) => updateBookingViaAPI(page, bookingId, bookingData),
        deleteViaAPI: (bookingId: string) => deleteBookingViaAPI(page, bookingId),
      },
      room: {
        create: (roomData: RoomData) => createRoom(page, roomData),
        getAllViaAPI: () => getRoomsViaAPI(page),
        createViaAPI: (roomData: any) => createRoomViaAPI(page, roomData),
      },
      contact: {
        submitForm: (contactData: ContactData) => submitContactForm(page, contactData),
      },
      message: {
        getAllViaAPI: () => getMessagesViaAPI(page),
        createViaAPI: (messageData: MessageData) => createMessageViaAPI(page, messageData),
      },
      utils: {
        getCurrentDate: () => getCurrentDate(),
        getFutureDate: (daysFromNow: number) => getFutureDate(daysFromNow),
        generateRandomEmail: () => generateRandomEmail(),
        generateRandomPhone: () => generateRandomPhone(),
      },
    };
    
    await use(rbpHelpers);
  },
});

export { expect } from '@playwright/test';