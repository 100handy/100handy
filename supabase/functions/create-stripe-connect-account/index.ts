import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { jsonResponse, requireAuthenticatedUser } from '../_shared/auth.ts';

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
    // Log environment check (without exposing secrets)
    const hasStripeKey = !!Deno.env.get('STRIPE_SECRET_KEY');
    const hasSupabaseUrl = !!Deno.env.get('SUPABASE_URL');
    const hasServiceKey = !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log('Environment check:', { hasStripeKey, hasSupabaseUrl, hasServiceKey });

    if (!hasStripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured on the server' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;
    const { user, serviceClient: supabase } = auth;
    const { country, refreshUrl, returnUrl } = await req.json();

    if (!user.email) {
      return jsonResponse({ error: 'Authenticated user email is required' }, 400);
    }

    // Check if user already has a Stripe Connect account
    const { data: handyProfile, error: profileError } = await supabase
      .from('handy_profiles')
      .select('stripe_connect_account_id, stripe_connect_status')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching handy profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If Connect account already exists, return it with an account link
    if (handyProfile?.stripe_connect_account_id) {
      // Create account link for existing account
      const accountLink = await stripe.accountLinks.create({
        account: handyProfile.stripe_connect_account_id,
        refresh_url: refreshUrl || 'https://100handy.com/connect/refresh',
        return_url: returnUrl || 'https://100handy.com/connect/return',
        type: 'account_onboarding',
      });

      return new Response(
        JSON.stringify({
          accountId: handyProfile.stripe_connect_account_id,
          accountLinkUrl: accountLink.url,
          status: handyProfile.stripe_connect_status,
          isExisting: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new Stripe Connect Express account
    console.log('Creating Stripe Connect account for:', { userId: user.id, email: user.email, country: country || 'GB' });

    let account;
    try {
      account = await stripe.accounts.create({
        type: 'express',
        country: country || 'GB', // Default to UK, but can be any supported country
	        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
	          supabase_user_id: user.id,
          platform: '100handy',
        },
      });
      console.log('Stripe Connect account created:', account.id);
    } catch (stripeError: any) {
      console.error('Stripe API error creating account:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        decline_code: stripeError.decline_code,
        param: stripeError.param,
      });
      return new Response(
        JSON.stringify({
          error: stripeError.message || 'Failed to create Stripe account',
          type: stripeError.type,
          code: stripeError.code,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update handy_profiles with the new Connect account ID
    const { error: updateError } = await supabase
      .from('handy_profiles')
      .update({
        stripe_connect_account_id: account.id,
        stripe_connect_status: 'pending',
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating handy profile:', updateError);
      // Don't fail the request - the account was created in Stripe
    }

    // Create account link for onboarding
    console.log('Creating account link for:', account.id);
    let accountLink;
    try {
      accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: refreshUrl || 'https://100handy.com/connect/refresh',
        return_url: returnUrl || 'https://100handy.com/connect/return',
        type: 'account_onboarding',
      });
      console.log('Account link created:', accountLink.url);
    } catch (linkError: any) {
      console.error('Stripe API error creating account link:', {
        message: linkError.message,
        type: linkError.type,
        code: linkError.code,
      });
      // Return the account ID even if link creation failed
      return new Response(
        JSON.stringify({
          accountId: account.id,
          accountLinkUrl: null,
          status: 'pending',
          isExisting: false,
          error: 'Account created but link generation failed: ' + linkError.message,
        }),
        {
          status: 200, // Partial success
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        accountId: account.id,
        accountLinkUrl: accountLink.url,
        status: 'pending',
        isExisting: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Unexpected error in create-stripe-connect-account:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
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
