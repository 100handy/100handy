import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

// Platform fee percentage (e.g., 15% = 0.15)
const PLATFORM_FEE_PERCENT = 0.15;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { bookingId, paymentIntentId } = await req.json();

    // Validate inputs
    if (!bookingId || !paymentIntentId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID and Payment Intent ID are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get booking details from Supabase (service role for admin access)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, handy_id, hourly_rate_cents, estimated_hours, payment_intent_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the requesting user owns this booking (is the professional)
    if (user.id !== booking.handy_id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: you are not the professional on this booking' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Cross-reference: verify the provided paymentIntentId matches what's stored on the booking
    // Prevents a professional from supplying a paymentIntentId from a higher-value booking
    if (booking.payment_intent_id && booking.payment_intent_id !== paymentIntentId) {
      return new Response(
        JSON.stringify({ error: 'Payment intent does not match this booking' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get professional's Stripe Connect account ID
    const { data: handyProfile, error: profileError } = await supabaseClient
      .from('handy_profiles')
      .select('stripe_connect_account_id')
      .eq('user_id', booking.handy_id)
      .single();

    if (profileError || !handyProfile?.stripe_connect_account_id) {
      return new Response(
        JSON.stringify({ error: 'Professional Stripe Connect account not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the payment intent to get the actual captured amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return new Response(
        JSON.stringify({
          error: `Payment intent is not captured. Status: ${paymentIntent.status}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const capturedAmount = paymentIntent.amount_received || paymentIntent.amount;

    // Calculate platform fee and professional's payout
    const platformFee = Math.round(capturedAmount * PLATFORM_FEE_PERCENT);
    const professionalPayout = capturedAmount - platformFee;

    // Create a transfer to the professional's Connect account
    const transfer = await stripe.transfers.create({
      amount: professionalPayout,
      currency: paymentIntent.currency,
      destination: handyProfile.stripe_connect_account_id,
      transfer_group: `booking_${bookingId}`,
      metadata: {
        booking_id: bookingId,
        payment_intent_id: paymentIntentId,
        platform_fee: platformFee,
        original_amount: capturedAmount,
      },
    });

    // Update booking with payout information
    await supabaseClient
      .from('bookings')
      .update({
        payout_status: 'transferred',
        payout_amount_cents: professionalPayout,
        platform_fee_cents: platformFee,
        transfer_id: transfer.id,
      })
      .eq('id', bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        transferId: transfer.id,
        amount: professionalPayout,
        platformFee: platformFee,
        currency: paymentIntent.currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating payout:', error);
    return new Response(
      JSON.stringify({ error: 'Payout processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
