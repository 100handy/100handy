// packages/shared/supabase/auth.ts
import { supabase } from './supabaseClient';

export async function signUp({ email, password, role, name }: { email: string; password: string; role: 'customer' | 'handy', name: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, name } }
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

function getRedirectUrl() {
  // Web: your site; Mobile: your custom scheme
  if (typeof window !== 'undefined') return `${window.location.origin}/auth/callback`;
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