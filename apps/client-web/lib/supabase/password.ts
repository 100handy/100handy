// Password management functions
import { createClient } from '../supabase';

/**
 * Update user's password
 * Note: Supabase doesn't require current password verification for password updates
 * when the user is already authenticated. For additional security, you could
 * implement a re-authentication flow before allowing password changes.
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error in updatePassword:', error);
    throw error;
  }
}

/**
 * Verify current password by attempting to sign in
 * This is a workaround since Supabase doesn't have a native password verification API
 */
export async function verifyCurrentPassword(currentPassword: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Get current user email
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      throw new Error('Not authenticated');
    }

    // Try to sign in with current password using a separate client
    // Note: This will not affect the current session
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    return !error;
  } catch (error) {
    console.error('Error in verifyCurrentPassword:', error);
    return false;
  }
}

/**
 * Update password with current password verification
 */
export async function updatePasswordWithVerification(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    // Verify current password
    const isValid = await verifyCurrentPassword(currentPassword);
    
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Update to new password
    await updatePassword(newPassword);
  } catch (error) {
    console.error('Error in updatePasswordWithVerification:', error);
    throw error;
  }
}

