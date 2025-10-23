// Security and two-factor authentication functions
import { createClient } from '../supabase';

/**
 * Enable two-factor authentication via SMS
 * Sends an OTP to the provided phone number
 */
export async function enableTwoFactor(phone: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // Format phone number (remove spaces, ensure it starts with +)
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Send OTP to phone
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
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
export async function verifyTwoFactor(phone: string, code: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Verify OTP
    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: 'sms',
    });

    if (error) {
      throw error;
    }

    // Update user's phone in their profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ phone: formattedPhone })
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

    // User has 2FA enabled if their phone is confirmed
    return !!user.phone_confirmed_at;
  } catch (error) {
    console.error('Error in isTwoFactorEnabled:', error);
    return false;
  }
}

/**
 * Disable two-factor authentication
 * Note: Supabase doesn't have a direct API to disable phone auth,
 * so we just remove the phone from the user's profile
 */
export async function disableTwoFactor(): Promise<void> {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Remove phone from profile
      await supabase
        .from('profiles')
        .update({ phone: null })
        .eq('user_id', user.id);
    }
  } catch (error) {
    console.error('Error in disableTwoFactor:', error);
    throw error;
  }
}

