import { createClient } from '@/lib/supabase-client';

/**
 * Create a payment intent with authorization hold (manual capture)
 * This places a hold on the customer's card without charging it
 */
export async function createPaymentIntent(params: {
  amount: number; // Amount in cents
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; paymentIntentId: string } | null> {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: {
      amount: params.amount,
      currency: params.currency || 'gbp',
      metadata: params.metadata,
    },
  });

  if (error) {
    console.error('Error creating payment intent:', {
      message: error.message,
      context: error.context,
      details: error,
    });
    throw new Error(error.message || 'Failed to create payment intent');
  }

  if (!data) {
    console.error('No data returned from create-payment-intent function');
    throw new Error('No data returned from payment intent creation');
  }

  return data;
}

/**
 * Capture an authorized payment
 * Call this when the task is completed to actually charge the customer
 */
export async function capturePayment(params: {
  paymentIntentId: string;
  amount?: number; // Optional: Capture a specific amount (must be <= authorized amount)
}): Promise<{ success: boolean } | null> {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke('capture-payment', {
    body: {
      paymentIntentId: params.paymentIntentId,
      amount: params.amount,
    },
  });

  if (error) {
    console.error('Error capturing payment:', error);
    throw new Error(error.message || 'Failed to capture payment');
  }

  return data;
}

/**
 * Cancel an authorized payment intent (release the authorization hold)
 * Call this when a booking is cancelled before completion.
 */
export async function cancelPaymentIntent(params: {
  paymentIntentId: string;
}): Promise<{ success: boolean } | null> {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke('cancel-payment-intent', {
    body: {
      paymentIntentId: params.paymentIntentId,
    },
  });

  if (error) {
    console.error('Error canceling payment intent:', error);
    throw new Error(error.message || 'Failed to cancel payment intent');
  }

  return data;
}
