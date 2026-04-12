import * as WebBrowser from 'expo-web-browser';
import { signInWithProvider } from '@shared/supabase/auth';
import { supabase } from '@shared/supabase/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

async function handleOAuth(provider: 'google' | 'apple'): Promise<boolean> {
  const data = await signInWithProvider(provider);
  if (!data?.url) return false;

  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    'handy://auth/callback'
  );

  if (result.type !== 'success' || !result.url) return false;

  // Implicit flow: tokens are in the hash fragment (#access_token=...&refresh_token=...)
  const url = new URL(result.url);
  const hashParams = new URLSearchParams(url.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    return true;
  }

  // PKCE flow fallback: code is in query params (?code=...)
  const code = url.searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return true;
  }

  return false;
}

export function useOAuthSignIn() {
  return {
    signInWithGoogle: () => handleOAuth('google'),
    signInWithApple: () => handleOAuth('apple'),
  };
}
