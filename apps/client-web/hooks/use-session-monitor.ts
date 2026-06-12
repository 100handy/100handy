'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Session monitor hook to handle token refresh and session expiry
 * Listens to Supabase auth state changes and handles session timeouts gracefully
 */
export function useSessionMonitor() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const supabase = createClient();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT') {
        toast.error('Your session has expired. Please sign in again.');
        router.push('/sign-in');
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
}
