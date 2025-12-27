import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Location {
  streetAddress: string;
  unitNumber?: string;
  placeId?: string;
  // Parsed location details
  city?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
  // Geographic coordinates for work area checking
  latitude?: number;
  longitude?: number;
}

interface LocationState {
  location: Location | null;
  recentLocations: Location[];
  setLocation: (location: Location) => void;
  addRecentLocation: (location: Location) => void;
  clearLocation: () => void;
  clearRecentLocations: () => void;
}

const MAX_RECENT_LOCATIONS = 5;

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      recentLocations: [],
      setLocation: (location) => {
        set({ location });
        // Also add to recent locations when setting
        get().addRecentLocation(location);
      },
      addRecentLocation: (location) => {
        const { recentLocations } = get();
        // Check if this location already exists (by placeId or streetAddress)
        const exists = recentLocations.some(
          (loc) =>
            (loc.placeId && loc.placeId === location.placeId) ||
            loc.streetAddress === location.streetAddress
        );
        if (exists) return;

        // Add to front and limit to MAX_RECENT_LOCATIONS
        const updated = [location, ...recentLocations].slice(0, MAX_RECENT_LOCATIONS);
        set({ recentLocations: updated });
      },
      clearLocation: () => set({ location: null }),
      clearRecentLocations: () => set({ recentLocations: [] }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        location: state.location,
        recentLocations: state.recentLocations,
      }),
    }
  )
);
