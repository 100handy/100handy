import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { paymentIntentId } = await req.json();

    // Validate paymentIntentId
    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ error: 'Payment Intent ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify ownership: look up the booking linked to this payment intent
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .select('id, customer_id, handy_id, status, payment_status')
      .eq('payment_intent_id', paymentIntentId)
      .maybeSingle();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: 'Booking lookup failed' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (booking && user.id !== booking.customer_id && user.id !== booking.handy_id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: you are not a party to this booking' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!booking && paymentIntent.metadata?.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: payment intent does not belong to the authenticated user' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const canReleaseLinkedHold =
      booking?.status === 'cancelled' ||
      (booking?.status === 'completed' && booking?.payment_status === 'failed');

    if (booking && !canReleaseLinkedHold) {
      return new Response(
        JSON.stringify({ error: `Cannot release hold while booking status is ${booking.status}` }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Only cancel if the payment intent is in a cancellable state
    // (requires_payment_method, requires_confirmation, requires_action, processing, requires_capture)
    const cancellableStatuses = [
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'requires_capture', // This is the authorization hold state
    ];

    if (!cancellableStatuses.includes(paymentIntent.status)) {
      return new Response(
        JSON.stringify({
          error: `Cannot cancel payment intent with status: ${paymentIntent.status}`,
          status: paymentIntent.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Cancel the payment intent (releases the authorization hold)
    const canceledIntent = await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'requested_by_customer',
    });

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId: canceledIntent.id,
        status: canceledIntent.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error canceling payment intent:', error);
    return new Response(
      JSON.stringify({ error: 'Payment cancellation failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
