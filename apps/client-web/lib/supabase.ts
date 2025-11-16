// Client-side Supabase client for Next.js
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  // Ensure we're on the client side before creating the client
  if (typeof window === 'undefined') {
    // Return a dummy client for SSR that won't be used
    // This should never actually be used since all client code should be in useEffect
    return {} as SupabaseClient;
  }

  // Reuse the same client instance to avoid multiple subscriptions
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        isSingleton: true,
        cookieOptions: {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        }
      }
    );
  }

  return browserClient;
}

