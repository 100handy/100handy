// packages/shared/supabase/auth.ts
/**
 * Cross-Platform Authentication Functions
 * 
 * This module provides authentication functions that work across both web and mobile platforms.
 * The Supabase client is automatically resolved based on platform:
 *   - Mobile: supabaseClient.native.ts (uses AsyncStorage)
 *   - Web: supabaseClient.ts (uses browser storage)
 * 
 * CROSS-PLATFORM FUNCTIONS (work on both web and mobile):
 *   ✅ signUp() - Email/password registration
 *   ✅ signIn() - Email/password login
 *   ✅ sendMagicLink() - Passwordless login via email
 *   ✅ resetPasswordForEmail() - Request password reset (email link)
 *   ✅ sendPasswordResetOTP() - Request password reset (OTP code)
 *   ✅ updatePassword() - Set new password
 *   ✅ signOut() - Log out user
 *   ✅ getSession() - Get current session
 *   ✅ signUpWithPhone() - Phone number registration (requires SMS provider)
 *   ✅ verifyOTP() - Verify phone OTP
 *   ✅ verifyEmailOTP() - Verify email OTP (for signup)
 *   ✅ verifyPasswordResetOTP() - Verify password reset OTP
 *   ✅ resendOTP() - Resend phone OTP
 *   ✅ resendEmailOTP() - Resend email OTP
 * 
 * PLATFORM-AWARE FUNCTIONS (behave differently per platform):
 *   ⚙️ signInWithProvider() - OAuth login
 *      - Web: Auto-redirects in browser
 *      - Mobile: Returns URL for manual handling with expo-web-browser
 * 
 * PLATFORM DETECTION:
 *   Uses `typeof window.document === 'undefined'` to detect React Native
 *   React Native has window but not window.document
 * 
 * IMPORTANT NOTES:
 *   - OAuth on mobile requires expo-web-browser for proper handling
 *   - Deep links configured in apps/client-mobile/app.json (scheme: "handy")
 *   - Redirect URLs configured in supabase/config.toml
 */
import { supabase } from './supabaseClient';

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
      phone?: string;
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
      emailRedirectTo: getRedirectUrl(),
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
    options: { emailRedirectTo: getRedirectUrl() }
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
    redirectTo: getRedirectUrl(),
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
export async function signUpWithPhone(
  phone: string,
  password: string,
  options?: {
    data?: {
      role: 'customer' | 'handy';
      first_name: string;
      last_name: string;
      full_name: string;
      postcode?: string;
      email?: string;
    };
  }
) {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options,
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

// ✅ NEW: Verify Email OTP (for signup)
export async function verifyEmailOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Resend Email OTP (for signup)
export async function resendEmailOTP(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Send Password Reset OTP
export async function sendPasswordResetOTP(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl(),
  });
  if (error) throw error;
  return data;
}

// ✅ NEW: Verify Password Reset OTP
export async function verifyPasswordResetOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  if (error) throw error;
  return data;
}

/**
 * Get the platform-appropriate redirect URL for auth callbacks
 * 
 * PLATFORM-AWARE: Automatically detects web vs mobile and returns the correct URL
 * 
 * Mobile (React Native):
 *   - Returns: 'handy://auth/callback' (deep link)
 *   - Configured in: apps/client-mobile/app.json (scheme)
 *   - Handled by: apps/client-mobile/app/auth/callback.tsx
 * 
 * Web (Next.js):
 *   - Production: Uses NEXT_PUBLIC_SITE_URL environment variable
 *   - Development: Uses current window.location.origin
 *   - Handled by: apps/client-web/app/auth/callback route
 * 
 * Environment Variables:
 *   - NEXT_PUBLIC_SITE_URL=https://yourdomain.com (web production)
 *   - No env var needed for mobile (uses scheme from app.json)
 * 
 * @returns {string} Platform-appropriate callback URL
 */
function getRedirectUrl() {
  // Platform detection: React Native has window but not window.document
  const isReactNative = typeof window !== 'undefined' && typeof window.document === 'undefined';
  
  if (isReactNative) {
    // Mobile: use deep link scheme defined in app.json
    return 'handy://auth/callback';
  }
  
  // Web: use environment variable for production, fallback to current origin for development
  if (typeof window !== 'undefined') {
    const productionUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (productionUrl) {
      return `${productionUrl}/auth/callback`;
    }
    return `${window.location.origin}/auth/callback`;
  }
  
  // Fallback for SSR (shouldn't reach here in normal flow)
  return 'http://localhost:3000/auth/callback';
}

/**
 * Sign in with OAuth provider (Google, Apple, Facebook)
 * 
 * PLATFORM-AWARE:
 * - Web: Automatically redirects in browser (skipBrowserRedirect: false)
 * - Mobile: Returns URL for manual handling (skipBrowserRedirect: true)
 * 
 * @example Mobile usage:
 * ```typescript
 * const data = await signInWithProvider('google');
 * if (data.url) {
 *   // Mobile: Open URL with expo-web-browser
 *   await WebBrowser.openAuthSessionAsync(data.url, 'handy://auth/callback');
 * }
 * ```
 * 
 * @example Web usage:
 * ```typescript
 * await signInWithProvider('google');
 * // Browser automatically redirects, no additional handling needed
 * ```
 */
export async function signInWithProvider(provider: 'google' | 'apple' | 'facebook') {
  // Platform detection: React Native has window but not window.document
  const isReactNative = typeof window !== 'undefined' && typeof window.document === 'undefined';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getRedirectUrl(),
      // Mobile needs the URL returned for manual handling
      // Web can auto-redirect in the browser
      skipBrowserRedirect: isReactNative,
    }
  });
  if (error) throw error;
  return data;
}
