// Client-side Supabase client for Next.js
import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;
let serverClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    if (!serverClient) {
      serverClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
    }

    return serverClient;
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
