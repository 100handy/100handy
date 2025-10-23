'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Session monitor hook to handle token refresh and session expiry
 * Listens to Supabase auth state changes and handles session timeouts gracefully
 */
export function useSessionMonitor() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
  }, [router, supabase]);
}

