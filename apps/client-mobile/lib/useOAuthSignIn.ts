import * as WebBrowser from 'expo-web-browser';
import { signInWithProvider } from '@shared/supabase/auth';
import { supabase } from '@shared/supabase/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

async function handleOAuth(provider: 'google' | 'apple') {
  const data = await signInWithProvider(provider);
  if (!data?.url) return;

  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    'handy://auth/callback'
  );

  if (result.type === 'success' && result.url) {
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }
  }
}

export function useOAuthSignIn() {
  return {
    signInWithGoogle: () => handleOAuth('google'),
    signInWithApple: () => handleOAuth('apple'),
  };
}
