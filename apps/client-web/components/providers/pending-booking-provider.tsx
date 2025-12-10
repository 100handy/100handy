'use client';

import { useEffect } from 'react';
import { initializePendingBookingStorage } from '@/lib/pending-booking-storage';

// Initialize storage once on client mount
let initialized = false;

export function PendingBookingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!initialized && typeof window !== 'undefined') {
      initializePendingBookingStorage();
      initialized = true;
    }
  }, []);

  return <>{children}</>;
}
