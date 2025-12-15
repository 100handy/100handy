import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, refreshUrl, returnUrl, linkType } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the Connect account ID from handy_profiles
    const { data: handyProfile, error: profileError } = await supabase
      .from('handy_profiles')
      .select('stripe_connect_account_id')
      .eq('user_id', userId)
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
      return new Response(
        JSON.stringify({ error: 'No Connect account found. Please create one first.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
