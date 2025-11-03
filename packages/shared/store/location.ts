import { create } from 'zustand';

export interface Location {
  streetAddress: string;
  unitNumber?: string;
  placeId?: string;
  // Parsed location details
  city?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

interface LocationState {
  location: Location | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  clearLocation: () => set({ location: null }),
}));
