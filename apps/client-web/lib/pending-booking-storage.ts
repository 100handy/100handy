import { setPendingBookingStorage } from '@shared/supabase';
import type { StateStorage } from 'zustand/middleware';

// Create localStorage adapter for Zustand persist middleware
const localStorageAdapter: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Initialize pending booking storage with localStorage
export function initializePendingBookingStorage(): void {
  setPendingBookingStorage(localStorageAdapter);
}

// Export the storage key for direct localStorage access if needed
export { PENDING_BOOKING_STORAGE_KEY } from '@shared/supabase';
