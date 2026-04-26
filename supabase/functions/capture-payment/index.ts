import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { jsonResponse, requireAuthenticatedUser } from '../_shared/auth.ts';
import { getCapturePolicy } from '../_shared/payment-policy.ts';

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
    const { user, serviceClient } = auth;

    const { paymentIntentId, amount } = await req.json();

    // Validate paymentIntentId
    if (!paymentIntentId) {
      return jsonResponse({ error: 'Payment Intent ID is required' }, 400);
    }

    // Verify ownership: look up the booking linked to this payment intent
    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .select('id, customer_id, handy_id, status, payment_status, hourly_rate_cents')
      .eq('payment_intent_id', paymentIntentId)
      .maybeSingle();

    if (bookingError || !booking) {
      return jsonResponse({ error: 'Booking not found for this payment intent' }, 404);
    }

    const amountToCapture = amount ? Math.round(amount) : undefined;
    const policy = getCapturePolicy({ userId: user.id, booking, amountToCapture });
    if (!policy.allowed) {
      return jsonResponse({ error: policy.reason || 'Payment capture is not allowed' }, 403);
    }

    // Capture the authorized payment
    // This actually charges the customer's card
    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
      amountToCapture ? { amount_to_capture: amountToCapture } : {},
      { idempotencyKey: `${paymentIntentId}_capture` }
    );

    await serviceClient
      .from('bookings')
      .update({ payment_status: 'captured' })
      .eq('id', booking.id)
      .eq('payment_status', 'authorized');

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        amountCaptured: paymentIntent.amount_captured,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error capturing payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
