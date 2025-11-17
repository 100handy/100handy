// Stripe payment methods helper functions
import { createClient } from '@/lib/supabase';

const SUPABASE_FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1';

export interface PaymentMethod {
  id: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

/**
 * Get or create Stripe customer for the current user
 */
export async function getOrCreateStripeCustomer(): Promise<string> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-stripe-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create customer');
  }

  const { customerId } = await response.json();
  return customerId;
}

/**
 * Create a SetupIntent for adding a new payment method
 */
export async function createSetupIntent(customerId: string): Promise<string> {
  const supabase = createClient();

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-setup-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create setup intent');
  }

  const { clientSecret } = await response.json();
  return clientSecret;
}

/**
 * List all payment methods for a customer
 */
export async function listPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
  const supabase = createClient();

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list payment methods');
  }

  const { paymentMethods } = await response.json();
  return paymentMethods;
}

/**
 * Set a payment method as default
 */
export async function setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  const supabase = createClient();

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/set-default-payment-method`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ customerId, paymentMethodId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to set default payment method');
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(paymentMethodId: string): Promise<void> {
  const supabase = createClient();

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/delete-payment-method`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ paymentMethodId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete payment method');
  }
}
