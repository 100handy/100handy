// Security and two-factor authentication functions
import { createClient } from '@/lib/supabase-client';

/**
 * Enable two-factor authentication via email
 * Sends an OTP to the user's email address
 */
export async function enableTwoFactor(email: string): Promise<void> {
  try {
    const supabase = createClient();

    // Send OTP to email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't create a new user if email doesn't exist
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error in enableTwoFactor:', error);
    throw error;
  }
}

/**
 * Verify OTP code and complete two-factor setup
 */
export async function verifyTwoFactor(email: string, code: string): Promise<void> {
  try {
    const supabase = createClient();

    // Verify OTP
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      throw error;
    }

    // Mark 2FA as enabled in user's profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('user_id', user.id);
    }
  } catch (error) {
    console.error('Error in verifyTwoFactor:', error);
    throw error;
  }
}

/**
 * Check if user has two-factor authentication enabled
 */
export async function isTwoFactorEnabled(): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    // Check if 2FA is enabled in profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .eq('user_id', user.id)
      .single();

    return profile?.two_factor_enabled === true;
  } catch (error) {
    console.error('Error in isTwoFactorEnabled:', error);
    return false;
  }
}

/**
 * Disable two-factor authentication
 */
export async function disableTwoFactor(): Promise<void> {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Disable 2FA in profile
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('user_id', user.id);
    }
  } catch (error) {
    console.error('Error in disableTwoFactor:', error);
    throw error;
  }
}
