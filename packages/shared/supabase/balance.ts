import { supabase } from './supabaseClient';

/**
 * Get user's account balance in cents
 * Calculated from redeemed promo codes minus amount spent on bookings
 */
export async function getAccountBalance(): Promise<number> {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return 0;
    }

    // Get total redeemed promo code amount
    const { data: redemptions, error: redemptionsError } = await supabase
      .from('promo_code_redemptions')
      .select('amount_cents')
      .eq('user_id', user.id);

    if (redemptionsError) {
      console.error('Error fetching redemptions:', redemptionsError);
      return 0;
    }

    const totalRedeemed = redemptions?.reduce(
      (sum, redemption) => sum + redemption.amount_cents,
      0
    ) || 0;

    // Get total paid amount for this user's bookings
    // First get the user's booking IDs, then fetch only those payments
    const { data: userBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('customer_id', user.id);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return totalRedeemed;
    }

    const bookingIds = userBookings?.map(b => b.id) || [];

    if (bookingIds.length === 0) {
      return totalRedeemed;
    }

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount_cents')
      .eq('status', 'paid')
      .in('booking_id', bookingIds);

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return totalRedeemed;
    }

    const totalSpent = payments?.reduce(
      (sum, payment) => sum + payment.amount_cents, 0
    ) || 0;

    // Balance = redeemed promo codes - amount spent
    return totalRedeemed - totalSpent;
  } catch (error) {
    console.error('Error in getAccountBalance:', error);
    return 0;
  }
}

/**
 * Format balance in cents to display string (e.g., "0" or "10.50")
 */
export function formatBalanceDisplay(balanceCents: number): string {
  const pounds = balanceCents / 100;
  // If whole number, don't show decimals
  if (pounds === Math.floor(pounds)) {
    return pounds.toString();
  }
  return pounds.toFixed(2);
}
