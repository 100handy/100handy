// packages/shared/supabase/payment-methods.ts
import { supabase } from './supabaseClient.native';

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name?: string;
    email?: string;
  };
  isDefault?: boolean;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

/**
 * Get or create a Stripe customer for the current user
 */
export async function getOrCreateStripeCustomer(): Promise<string | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Check if user already has a Stripe customer ID in profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    // If customer ID exists, return it
    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Otherwise, create a new Stripe customer via edge function
    const { data, error } = await supabase.functions.invoke('create-stripe-customer', {
      body: {
        userId: user.id,
        email: user.email,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user.email,
      },
    });

    if (error) {
      console.error('Error creating Stripe customer:', error);
      return null;
    }

    return data.customerId;
  } catch (error) {
    console.error('Error in getOrCreateStripeCustomer:', error);
    return null;
  }
}

/**
 * Create a SetupIntent for adding a new payment method
 */
export async function createSetupIntent(): Promise<SetupIntentResponse | null> {
  try {
    // Get or create Stripe customer first
    const customerId = await getOrCreateStripeCustomer();

    if (!customerId) {
      console.error('Failed to get Stripe customer ID');
      return null;
    }

    // Create SetupIntent via edge function
    const { data, error } = await supabase.functions.invoke('create-setup-intent', {
      body: { customerId },
    });

    if (error) {
      console.error('Error creating SetupIntent:', error);
      return null;
    }

    return {
      clientSecret: data.clientSecret,
      setupIntentId: data.setupIntentId,
    };
  } catch (error) {
    console.error('Error in createSetupIntent:', error);
    return null;
  }
}

/**
 * List all payment methods for the current user
 */
export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const customerId = await getOrCreateStripeCustomer();

    if (!customerId) {
      console.error('Failed to get Stripe customer ID');
      return [];
    }

    console.log('[DEBUG] listPaymentMethods - Using customer ID:', customerId);

    // Fetch payment methods via edge function
    const { data, error } = await supabase.functions.invoke('list-payment-methods', {
      body: { customerId },
    });

    console.log('[DEBUG] listPaymentMethods - Raw API response:', JSON.stringify(data, null, 2));
    console.log('[DEBUG] listPaymentMethods - API error:', error);

    if (error) {
      console.error('Error listing payment methods:', error);
      return [];
    }

    const paymentMethods = data?.paymentMethods || [];
    console.log('[DEBUG] listPaymentMethods - Extracted payment methods:', JSON.stringify(paymentMethods, null, 2));
    console.log('[DEBUG] listPaymentMethods - Number of payment methods:', paymentMethods.length);

    return paymentMethods;
  } catch (error) {
    console.error('Error in listPaymentMethods:', error);
    return [];
  }
}

/**
 * Set a payment method as the default
 */
export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
  try {
    const customerId = await getOrCreateStripeCustomer();

    if (!customerId) {
      console.error('Failed to get Stripe customer ID');
      return false;
    }

    // Set default payment method via edge function
    const { error } = await supabase.functions.invoke('set-default-payment-method', {
      body: {
        customerId,
        paymentMethodId,
      },
    });

    if (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    return false;
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
  try {
    // Delete payment method via edge function
    const { error } = await supabase.functions.invoke('delete-payment-method', {
      body: { paymentMethodId },
    });

    if (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    return false;
  }
}

/**
 * Get the Stripe publishable key from environment
 */
export function getStripePublishableKey(): string {
  // This will be set in the app's environment variables
  return process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}
