import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { requireAuthenticatedUser } from '../_shared/auth.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;
    const { user, serviceClient: supabase } = auth;

    // Get the Connect account ID from handy_profiles
    const { data: handyProfile, error: profileError } = await supabase
      .from('handy_profiles')
      .select('stripe_connect_account_id, stripe_connect_status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching handy profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If no Connect account exists
    if (!handyProfile?.stripe_connect_account_id) {
      return new Response(
        JSON.stringify({
          hasAccount: false,
          status: 'not_started',
          payoutsEnabled: false,
          chargesEnabled: false,
          requirements: null,
          externalAccounts: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch the account details from Stripe
    let account: Awaited<ReturnType<typeof stripe.accounts.retrieve>>;
    try {
      account = await stripe.accounts.retrieve(handyProfile.stripe_connect_account_id);
    } catch (stripeError: any) {
      // Account not found or invalid (e.g. test account ID used with live key, or deleted account).
      // Treat as if no account exists rather than returning a 5xx.
      if (stripeError?.statusCode === 400 || stripeError?.statusCode === 404 || stripeError?.code === 'account_invalid') {
        console.warn('Stripe Connect account not retrievable, treating as not started:', {
          accountId: handyProfile.stripe_connect_account_id,
          message: stripeError?.message,
          code: stripeError?.code,
        });
        return new Response(
          JSON.stringify({
            hasAccount: false,
            status: 'not_started',
            payoutsEnabled: false,
            chargesEnabled: false,
            requirements: null,
            externalAccounts: [],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw stripeError;
    }

    // Determine the status based on account state
    let status = handyProfile.stripe_connect_status || 'pending';
    if (account.payouts_enabled && account.charges_enabled) {
      status = 'active';
    } else if (account.requirements?.disabled_reason) {
      status = 'disabled';
    } else if (account.requirements?.currently_due?.length > 0) {
      status = 'pending';
    }

    // Update status in database if it changed
    if (status !== handyProfile.stripe_connect_status) {
      await supabase
        .from('handy_profiles')
        .update({ stripe_connect_status: status })
        .eq('user_id', user.id);
    }

    // Get external accounts (bank accounts)
    const externalAccounts = account.external_accounts?.data?.map((acc: any) => ({
      id: acc.id,
      type: acc.object,
      last4: acc.last4,
      bankName: acc.bank_name,
      currency: acc.currency,
      country: acc.country,
      default: acc.default_for_currency,
    })) || [];

    return new Response(
      JSON.stringify({
        hasAccount: true,
        accountId: account.id,
        status,
        payoutsEnabled: account.payouts_enabled,
        chargesEnabled: account.charges_enabled,
        detailsSubmitted: account.details_submitted,
        requirements: {
          currentlyDue: account.requirements?.currently_due || [],
          eventuallyDue: account.requirements?.eventually_due || [],
          pastDue: account.requirements?.past_due || [],
          pendingVerification: account.requirements?.pending_verification || [],
          disabledReason: account.requirements?.disabled_reason || null,
        },
        externalAccounts,
        country: account.country,
        defaultCurrency: account.default_currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error getting Stripe Connect status:', {
      message: error.message,
      type: error.type,
      code: error.code,
    });

    return new Response(
      JSON.stringify({
        error: error.message,
        type: error.type,
        code: error.code,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
