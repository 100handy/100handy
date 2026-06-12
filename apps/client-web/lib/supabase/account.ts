// Account deletion functions
import { createClient } from '@/lib/supabase-client';

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
