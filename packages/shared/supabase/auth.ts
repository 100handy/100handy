// packages/shared/supabase/auth.ts
import { supabase } from './supabaseClient.native';

export interface SignUpData {
  email: string;
  password: string;
  role: 'customer' | 'handy';
  first_name: string;
  last_name: string;
  phone?: string;
  postcode?: string;
}

export async function signUp({ email, password, role, first_name, last_name, phone, postcode }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { 
        role, 
        first_name, 
        last_name, 
        phone, 
        postcode 
      },
      emailRedirectTo: getRedirectUrl()
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function sendMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: getRedirectUrl() }
  });
  if (error) throw error;
  return data;
}

export async function getSession() {
  return supabase.auth.getSession();
}

/**
 * Get the redirect URL for email confirmations and OAuth callbacks
 * 
 * For production: Set NEXT_PUBLIC_SITE_URL (web) or EXPO_PUBLIC_SITE_URL (mobile)
 * For development: Uses localhost automatically
 * 
 * Example: NEXT_PUBLIC_SITE_URL=https://yourdomain.com
 */
function getRedirectUrl() {
  // Web: use environment variable for production, fallback to current origin for development
  if (typeof window !== 'undefined') {
    const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.EXPO_PUBLIC_SITE_URL;
    if (productionUrl) {
      return `${productionUrl}/auth/callback`;
    }
    return `${window.location.origin}/auth/callback`;
  }
  // Mobile: your custom scheme
  return 'handy://auth/callback';
}

export async function signInWithProvider(provider: 'google' | 'apple' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getRedirectUrl(),
      skipBrowserRedirect: false,
    }
  });
  if (error) throw error;
  return data;
}