// packages/shared/supabase/payment-methods.ts
import { supabase } from './supabaseClient';

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

async function getAuthenticatedUser() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  return user;
}

async function getExistingStripeCustomerId(): Promise<string | null> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.warn('Unable to fetch Stripe customer ID from profile:', profileError);
      return null;
    }

    return profile?.stripe_customer_id ?? null;
  } catch (error) {
    console.warn('Unable to load Stripe customer ID from profile:', error);
    return null;
  }
}

/**
 * Get or create a Stripe customer for the current user
 */
export async function getOrCreateStripeCustomer(): Promise<string | null> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      console.warn('Unable to get authenticated user for Stripe customer');
      return null;
    }

    // Check if user already has a Stripe customer ID in profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, first_name, last_name')
      .eq('user_id', user.id)
      .maybeSingle();

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
      body: {},
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
    // Intentionally creates a Stripe customer if one doesn't exist yet — a SetupIntent requires it.
    if (!(await getOrCreateStripeCustomer())) {
      console.error('Failed to get Stripe customer ID');
      return null;
    }

    // Create SetupIntent via edge function
    const { data, error } = await supabase.functions.invoke('create-setup-intent', {
      body: {},
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
    const customerId = await getExistingStripeCustomerId();

    if (!customerId) {
      return [];
    }

    // Fetch payment methods via edge function
    const { data, error } = await supabase.functions.invoke('list-payment-methods', {
      body: {},
    });

    if (error) {
      console.warn('Unable to list payment methods:', error);
      return [];
    }

    return data?.paymentMethods || [];
  } catch (error) {
    console.warn('Unable to load payment methods:', error);
    return [];
  }
}

/**
 * Set a payment method as the default
 */
export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
  try {
    if (!(await getOrCreateStripeCustomer())) {
      console.error('Failed to get Stripe customer ID');
      return false;
    }

    // Set default payment method via edge function
    const { error } = await supabase.functions.invoke('set-default-payment-method', {
      body: {
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

// ==========================================
// Stripe Connect Functions (for Professionals)
// ==========================================

export interface ConnectAccountResult {
  accountId: string;
  accountLinkUrl: string;
  status: string;
  isExisting: boolean;
}

export interface ConnectAccountStatus {
  hasAccount: boolean;
  accountId?: string;
  status: string;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  detailsSubmitted?: boolean;
  requirements?: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
    disabledReason: string | null;
  };
  externalAccounts: Array<{
    id: string;
    type: string;
    last4: string;
    bankName: string;
    currency: string;
    country: string;
    default: boolean;
  }>;
  country?: string;
  defaultCurrency?: string;
}

export interface AccountLinkResult {
  url: string;
  expiresAt: number;
}

/**
 * Get or create a Stripe Connect account for the current professional user
 * Returns the account ID and onboarding URL
 */
export async function getOrCreateStripeConnectAccount(
  country?: string,
  refreshUrl?: string,
  returnUrl?: string
): Promise<ConnectAccountResult | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn('Unable to get authenticated user for Stripe Connect account:', authError);
      return null;
    }

    // Get user's profile for email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    // Create or get Connect account via edge function
    const { data, error } = await supabase.functions.invoke('create-stripe-connect-account', {
      body: {
        country: country || 'GB',
        refreshUrl,
        returnUrl,
      },
    });

    if (error) {
      console.error('Error creating/getting Stripe Connect account:', error);
      // Throw the error so the UI can display it
      throw new Error(error.message || 'Failed to create Stripe Connect account');
    }

    // Check if the response contains an error field (from our edge function)
    if (data?.error) {
      console.error('Stripe Connect API error:', data);
      throw new Error(data.error);
    }

    return {
      accountId: data.accountId,
      accountLinkUrl: data.accountLinkUrl,
      status: data.status,
      isExisting: data.isExisting,
    };
  } catch (error: unknown) {
    console.warn('Unable to create or load Stripe Connect account:', error);
    throw error;
  }
}

/**
 * Get the current status of the professional's Stripe Connect account
 */
export async function getConnectAccountStatus(): Promise<ConnectAccountStatus | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn('Unable to get authenticated user for Stripe Connect status:', authError);
      return null;
    }

    // Get Connect account status via edge function
    const { data, error } = await supabase.functions.invoke('get-stripe-connect-status', {
      body: {},
    });

    if (error) {
      console.warn('Unable to get Stripe Connect status:', error);
      return null;
    }

    return data as ConnectAccountStatus;
  } catch (error) {
    console.warn('Unable to load Stripe Connect status:', error);
    return null;
  }
}

/**
 * Create an account link for Stripe Connect onboarding or updating
 */
export async function createConnectAccountLink(
  linkType: 'onboarding' | 'update' = 'onboarding',
  refreshUrl?: string,
  returnUrl?: string
): Promise<AccountLinkResult | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn('Unable to get authenticated user for Stripe account link:', authError);
      return null;
    }

    // Create account link via edge function
    const { data, error } = await supabase.functions.invoke('create-stripe-account-link', {
      body: {
        linkType,
        refreshUrl,
        returnUrl,
      },
    });

    if (error) {
      console.warn('Unable to create Stripe account link:', error);
      return null;
    }

    return {
      url: data.url,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    console.warn('Unable to create Stripe account link:', error);
    return null;
  }
}
