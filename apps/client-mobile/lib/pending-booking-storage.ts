import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPendingBookingStorage } from '@shared/store';
import type { StateStorage } from 'zustand/middleware';

// Create AsyncStorage adapter for Zustand persist middleware
const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  },
};

// Initialize pending booking storage with AsyncStorage
export function initializePendingBookingStorage(): void {
  setPendingBookingStorage(asyncStorageAdapter);
}

// Export the storage key for direct AsyncStorage access if needed
export { PENDING_BOOKING_STORAGE_KEY } from '@shared/supabase';
