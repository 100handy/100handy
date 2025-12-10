import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { Location } from './location';
import type { FormResponse } from '../supabase/types/forms';

// Storage key for pending booking
export const PENDING_BOOKING_STORAGE_KEY = '@pendingBooking';

// Platform-specific storage will be injected
let storage: StateStorage | null = null;

export function setPendingBookingStorage(storageImpl: StateStorage) {
  storage = storageImpl;
}

// Tasker data needed for the booking
export interface PendingBookingTasker {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  hourlyRateCents: number;
  verified: boolean;
  rating: number | null;
}

// Complete pending booking data
export interface PendingBookingData {
  // Category
  categoryId: string;
  categoryName: string;

  // Tasker
  tasker: PendingBookingTasker;

  // Schedule
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM format

  // Location
  location: Location;

  // Form responses (dynamic based on category)
  formResponses: FormResponse;

  // Timestamp when booking was created (for expiry)
  createdAt: number;

  // Return path after auth
  returnPath?: string;
}

interface PendingBookingState {
  // The pending booking data (null if none)
  pendingBooking: PendingBookingData | null;

  // Actions
  setPendingBooking: (data: PendingBookingData) => void;
  clearPendingBooking: () => void;
  hasPendingBooking: () => boolean;
  getPendingBooking: () => PendingBookingData | null;

  // Check if pending booking is still valid (not expired)
  isBookingValid: () => boolean;
}

// Booking expires after 24 hours
const BOOKING_EXPIRY_MS = 24 * 60 * 60 * 1000;

// Create a custom storage wrapper that checks for storage availability
const getStorage = (): StateStorage => {
  if (storage) {
    return storage;
  }

  // Fallback to in-memory storage if not set
  const memoryStorage: Record<string, string> = {};
  return {
    getItem: (name: string) => memoryStorage[name] ?? null,
    setItem: (name: string, value: string) => {
      memoryStorage[name] = value;
    },
    removeItem: (name: string) => {
      delete memoryStorage[name];
    },
  };
};

export const usePendingBookingStore = create<PendingBookingState>()(
  persist(
    (set, get) => ({
      pendingBooking: null,

      setPendingBooking: (data: PendingBookingData) => {
        set({
          pendingBooking: {
            ...data,
            createdAt: Date.now(),
          }
        });
      },

      clearPendingBooking: () => {
        set({ pendingBooking: null });
      },

      hasPendingBooking: () => {
        const { pendingBooking } = get();
        if (!pendingBooking) return false;

        // Check if booking is still valid (not expired)
        return get().isBookingValid();
      },

      getPendingBooking: () => {
        const { pendingBooking, isBookingValid, clearPendingBooking } = get();

        if (!pendingBooking) return null;

        // If booking is expired, clear it and return null
        if (!isBookingValid()) {
          clearPendingBooking();
          return null;
        }

        return pendingBooking;
      },

      isBookingValid: () => {
        const { pendingBooking } = get();
        if (!pendingBooking) return false;

        const now = Date.now();
        const bookingAge = now - pendingBooking.createdAt;

        // Check if booking has expired
        if (bookingAge > BOOKING_EXPIRY_MS) {
          return false;
        }

        // Check if the scheduled date hasn't passed
        const scheduledDateTime = new Date(`${pendingBooking.selectedDate}T${pendingBooking.selectedTime}`);
        if (scheduledDateTime < new Date()) {
          return false;
        }

        return true;
      },
    }),
    {
      name: PENDING_BOOKING_STORAGE_KEY,
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({ pendingBooking: state.pendingBooking }),
    }
  )
);
