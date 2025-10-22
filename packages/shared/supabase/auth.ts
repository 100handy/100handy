// packages/shared/supabase/auth.ts - UPDATED
// Auto-detect platform and import correct client
let supabase: any;
if (typeof window !== 'undefined') {
  // Web environment
  supabase = require('./supabaseClient').supabase;
} else {
  // Native environment
  supabase = require('./supabaseClient.native').supabase;
}

export interface SignUpData {
  email: string;
  password: string;
  phone?: string;
  options?: {
    data: {
      role: 'customer' | 'handy';
      first_name: string;
      last_name: string;
      full_name: string;
      postcode?: string;
    };
  };
}

export async function signUp(signUpData: SignUpData) {
  const { email, password, options } = signUpData;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: options?.data,
      emailRedirectTo: `${getRedirectUrl()}/auth/callback`,
    },
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
    options: { emailRedirectTo: `${getRedirectUrl()}/auth/callback` }
  });
  if (error) throw error;
  return data;
}

export async function getSession() {
  return supabase.auth.getSession();
}

// ✅ NEW: Forgot Password
export async function resetPasswordForEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getRedirectUrl()}/auth/callback?next=/reset-password`,
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Reset Password
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ✅ NEW: Phone Sign Up (requires SMS provider setup in Supabase)
export async function signUpWithPhone(phone: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Verify Phone OTP
export async function verifyOTP(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Resend OTP
export async function resendOTP(phone: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'sms',
    phone,
  });
  if (error) throw error;
  return data;
}

/**
 * Get the base URL for redirects
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
      return productionUrl;
    }
    return window.location.origin;
  }
  // Mobile: your custom scheme (base URL without path)
  return 'handy://';
}

export async function signInWithProvider(provider: 'google' | 'apple' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getRedirectUrl()}/auth/callback`,
      skipBrowserRedirect: false,
    }
  });
  if (error) throw error;
  return data;
}
