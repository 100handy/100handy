// Account balance and promo code management functions
import { createClient } from '../supabase';
import type { PromoCode, PromoCodeRedemption } from './types';

/**
 * Get user's account balance
 * Calculated from completed payments and redeemed promo codes
 */
export async function getAccountBalance(): Promise<number> {
  try {
    const supabase = createClient();
    
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

    // Get total paid amount (amount user has spent)
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount_cents, booking_id')
      .eq('status', 'paid')
      .not('booking_id', 'is', null);

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return totalRedeemed;
    }

    // Need to filter payments by customer_id through bookings
    const bookingIds = payments?.map(p => p.booking_id) || [];
    
    if (bookingIds.length === 0) {
      return totalRedeemed;
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('customer_id', user.id)
      .in('id', bookingIds);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return totalRedeemed;
    }

    const userBookingIds = new Set(bookings?.map(b => b.id) || []);
    const totalSpent = payments
      ?.filter(p => userBookingIds.has(p.booking_id))
      .reduce((sum, payment) => sum + payment.amount_cents, 0) || 0;

    // Balance = redeemed promo codes - amount spent
    // (Promo codes are credits, payments reduce the balance)
    return totalRedeemed - totalSpent;
  } catch (error) {
    console.error('Error in getAccountBalance:', error);
    return 0;
  }
}

/**
 * Get user's redeemed promo codes
 */
export async function getRedeemedPromoCodes(): Promise<PromoCodeRedemption[]> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return [];
    }

    const { data, error } = await supabase
      .from('promo_code_redemptions')
      .select('*')
      .eq('user_id', user.id)
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.error('Error fetching redeemed promo codes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRedeemedPromoCodes:', error);
    return [];
  }
}

/**
 * Apply a promo code
 */
export async function applyPromoCode(code: string): Promise<{
  success: boolean;
  message: string;
  amount?: number;
}> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    // Find promo code
    const { data: promoCode, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (promoError || !promoCode) {
      return {
        success: false,
        message: 'Invalid promo code',
      };
    }

    // Check if expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return {
        success: false,
        message: 'This promo code has expired',
      };
    }

    // Check if max uses reached
    if (promoCode.current_uses >= promoCode.max_uses) {
      return {
        success: false,
        message: 'This promo code has reached its maximum uses',
      };
    }

    // Check if user already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('promo_code_redemptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('promo_code_id', promoCode.id)
      .single();

    if (existingRedemption) {
      return {
        success: false,
        message: 'You have already redeemed this promo code',
      };
    }

    // Redeem the code
    const { error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        user_id: user.id,
        promo_code_id: promoCode.id,
        amount_cents: promoCode.amount_cents,
      });

    if (redemptionError) {
      console.error('Error redeeming promo code:', redemptionError);
      return {
        success: false,
        message: 'Failed to redeem promo code',
      };
    }

    return {
      success: true,
      message: `Successfully added £${(promoCode.amount_cents / 100).toFixed(2)} to your account`,
      amount: promoCode.amount_cents,
    };
  } catch (error) {
    console.error('Error in applyPromoCode:', error);
    return {
      success: false,
      message: 'An error occurred while applying the promo code',
    };
  }
}

