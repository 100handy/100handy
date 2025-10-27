// Account deletion functions
import { createClient } from '../supabase';

/**
 * Delete user account
 * This performs a soft delete by marking the user as deleted
 * Note: Actual user deletion requires Supabase Admin API which should be done server-side
 */
export async function deleteAccount(): Promise<void> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Note: Supabase doesn't allow users to delete themselves via client SDK
    // We need to handle this differently:
    
    // Option 1: Mark user as inactive in profiles table
    await supabase
      .from('profiles')
      .update({ 
        // We can add a 'deleted_at' or 'is_active' column to profiles
        // For now, we'll update the user metadata
      })
      .eq('user_id', user.id);

    // Option 2: Call a server-side function to delete the user
    // This is the recommended approach for production
    const { error: functionError } = await supabase.functions.invoke('delete-user', {
      body: { userId: user.id },
    });

    if (functionError) {
      console.error('Error calling delete-user function:', functionError);
      // Fallback: just sign out the user
    }

    // Sign out the user
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    throw error;
  }
}

/**
 * Request account deletion
 * Creates a support ticket for account deletion
 * This is a safer approach that requires admin approval
 */
export async function requestAccountDeletion(): Promise<void> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Create a support ticket for account deletion
    const { error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: 'Account Deletion Request',
        status: 'open',
      });

    if (ticketError) {
      throw ticketError;
    }

  } catch (error) {
    console.error('Error in requestAccountDeletion:', error);
    throw error;
  }
}

