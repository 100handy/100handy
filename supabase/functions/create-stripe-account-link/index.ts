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
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;
    const { user, serviceClient: supabase } = auth;
    const { refreshUrl, returnUrl, linkType } = await req.json();

    // Get the Connect account ID from handy_profiles
    const { data: handyProfile, error: profileError } = await supabase
      .from('handy_profiles')
      .select('stripe_connect_account_id')
      .eq('user_id', user.id)
      .single();

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

    if (!handyProfile?.stripe_connect_account_id) {
      return jsonResponse({ error: 'No Connect account found. Please create one first.' }, 400);
    }

    // Create account link
    // Types: 'account_onboarding' for initial setup, 'account_update' for updating info
    const accountLink = await stripe.accountLinks.create({
      account: handyProfile.stripe_connect_account_id,
      refresh_url: refreshUrl || 'https://100handy.com/connect/refresh',
      return_url: returnUrl || 'https://100handy.com/connect/return',
      type: linkType === 'update' ? 'account_update' : 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        url: accountLink.url,
        expiresAt: accountLink.expires_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating Stripe account link:', {
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
