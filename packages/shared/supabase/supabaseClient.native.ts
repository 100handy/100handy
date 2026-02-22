// packages/shared/supabase/supabaseClient.native.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing Supabase URL. Set EXPO_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in your environment.'
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    'Missing Supabase anon key. Set EXPO_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: AsyncStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false, // mobile handles deep links instead
    },
  }
);
