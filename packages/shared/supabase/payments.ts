import { supabase } from './supabaseClient';

// Payment status types
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled' | 'refunded';
export type PayoutStatus = 'pending' | 'transferred' | 'failed';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CaptureResult {
  success: boolean;
  paymentIntentId: string;
  status: string;
  amount: number;
  amountCaptured: number;
}

export interface PayoutResult {
  success: boolean;
  transferId: string;
  amount: number;
  platformFee: number;
  currency: string;
}

/**
 * Create a PaymentIntent with authorization hold for a booking
 * This places a hold on the customer's card without charging it
 */
export async function createPaymentIntent(
  amount: number, // Amount in cents
  customerId: string,
  metadata?: Record<string, string>
): Promise<PaymentIntentResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount,
        currency: 'gbp',
        customerId,
        metadata: {
          ...metadata,
          platform: '100handy',
        },
      },
    });

    if (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }

    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    };
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    return null;
  }
}

/**
 * Capture an authorized payment (charge the customer's card)
 * Used when professional completes the job
 */
export async function capturePayment(
  paymentIntentId: string,
  amount?: number // Optional: capture a different amount than authorized
): Promise<CaptureResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke('capture-payment', {
      body: {
        paymentIntentId,
        amount,
      },
    });

    if (error) {
      console.error('Error capturing payment:', error);
      return null;
    }

    return {
      success: data.success,
      paymentIntentId: data.paymentIntentId,
      status: data.status,
      amount: data.amount,
      amountCaptured: data.amountCaptured,
    };
  } catch (error) {
    console.error('Error in capturePayment:', error);
    return null;
  }
}

/**
 * Cancel a payment intent (release authorization hold)
 * Used when booking is cancelled before completion
 */
export async function cancelPaymentIntent(paymentIntentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-payment-intent', {
      body: { paymentIntentId },
    });

    if (error) {
      console.error('Error canceling payment intent:', error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Error in cancelPaymentIntent:', error);
    return false;
  }
}

/**
 * Create a payout to the professional's Stripe Connect account
 * Used after capturing payment on job completion
 */
export async function createPayout(
  bookingId: string,
  paymentIntentId: string
): Promise<PayoutResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke('create-payout', {
      body: {
        bookingId,
        paymentIntentId,
      },
    });

    if (error) {
      console.error('Error creating payout:', error);
      return null;
    }

    return {
      success: data.success,
      transferId: data.transferId,
      amount: data.amount,
      platformFee: data.platformFee,
      currency: data.currency,
    };
  } catch (error) {
    console.error('Error in createPayout:', error);
    return null;
  }
}

/**
 * Update booking payment status in the database
 */
export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
  paymentIntentId?: string
): Promise<boolean> {
  try {
    const updateData: { payment_status: PaymentStatus; payment_intent_id?: string } = {
      payment_status: paymentStatus,
    };

    if (paymentIntentId) {
      updateData.payment_intent_id = paymentIntentId;
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking payment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateBookingPaymentStatus:', error);
    return false;
  }
}

/**
 * Get booking payment details
 */
export async function getBookingPaymentDetails(bookingId: string): Promise<{
  paymentIntentId: string | null;
  paymentStatus: PaymentStatus | null;
  payoutStatus: PayoutStatus | null;
  payoutAmountCents: number | null;
  platformFeeCents: number | null;
} | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('payment_intent_id, payment_status, payout_status, payout_amount_cents, platform_fee_cents')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking payment details:', error);
      return null;
    }

    return {
      paymentIntentId: data.payment_intent_id,
      paymentStatus: data.payment_status as PaymentStatus | null,
      payoutStatus: data.payout_status as PayoutStatus | null,
      payoutAmountCents: data.payout_amount_cents,
      platformFeeCents: data.platform_fee_cents,
    };
  } catch (error) {
    console.error('Error in getBookingPaymentDetails:', error);
    return null;
  }
}

/**
 * Full payment capture and payout flow for job completion
 * This captures the payment and initiates the payout to the professional
 */
export async function processJobCompletionPayment(
  bookingId: string,
  paymentIntentId: string
): Promise<{
  success: boolean;
  captureResult?: CaptureResult;
  payoutResult?: PayoutResult;
  error?: string;
}> {
  try {
    // Step 1: Capture the payment
    const captureResult = await capturePayment(paymentIntentId);
    if (!captureResult || !captureResult.success) {
      await updateBookingPaymentStatus(bookingId, 'failed');
      return {
        success: false,
        error: 'Failed to capture payment',
      };
    }

    // Update payment status to captured
    await updateBookingPaymentStatus(bookingId, 'captured');

    // Step 2: Create payout to professional
    const payoutResult = await createPayout(bookingId, paymentIntentId);
    if (!payoutResult || !payoutResult.success) {
      // Payment was captured but payout failed - this needs manual intervention
      console.error('Payment captured but payout failed for booking:', bookingId);
      return {
        success: true, // Payment was captured successfully
        captureResult,
        error: 'Payment captured but payout to professional failed',
      };
    }

    return {
      success: true,
      captureResult,
      payoutResult,
    };
  } catch (error: any) {
    console.error('Error in processJobCompletionPayment:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during payment processing',
    };
  }
}
