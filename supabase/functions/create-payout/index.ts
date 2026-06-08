import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { jsonResponse, requireAuthenticatedUser } from '../_shared/auth.ts';
import { calculatePayoutAmounts, getPayoutPolicy } from '../_shared/payment-policy.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

function getLatestChargeId(paymentIntent: Stripe.PaymentIntent): string | null {
  const latestCharge = paymentIntent.latest_charge;
  if (typeof latestCharge === 'string') return latestCharge;
  return latestCharge?.id ?? null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;
    const { user, serviceClient: supabaseClient } = auth;

    const { bookingId, paymentIntentId } = await req.json();

    // Validate inputs
    if (!bookingId || !paymentIntentId) {
      return jsonResponse({ error: 'Booking ID and Payment Intent ID are required' }, 400);
    }

    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, handy_id, status, payment_status, payout_status, transfer_id, hourly_rate_cents, estimated_hours, payment_intent_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    const payoutPolicy = getPayoutPolicy({ userId: user.id, booking });
    if (!payoutPolicy.allowed) {
      return jsonResponse({ error: payoutPolicy.reason || 'Payout is not allowed' }, 403);
    }

    // Cross-reference: verify the provided paymentIntentId matches what's stored on the booking
    // Prevents a professional from supplying a paymentIntentId from a higher-value booking
    if (booking.payment_intent_id && booking.payment_intent_id !== paymentIntentId) {
      return jsonResponse({ error: 'Payment intent does not match this booking' }, 400);
    }

    // Get professional's Stripe Connect account ID
    const { data: handyProfile, error: profileError } = await supabaseClient
      .from('handy_profiles')
      .select('stripe_connect_account_id')
      .eq('user_id', booking.handy_id)
      .single();

    if (profileError || !handyProfile?.stripe_connect_account_id) {
      return jsonResponse({ error: 'Professional Stripe Connect account not found' }, 404);
    }

    const account = await stripe.accounts.retrieve(handyProfile.stripe_connect_account_id);
    if (!account.payouts_enabled) {
      return jsonResponse({ error: 'Professional Stripe Connect payouts are not enabled' }, 400);
    }

    // Get the payment intent to get the actual captured amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return jsonResponse({ error: `Payment intent is not captured. Status: ${paymentIntent.status}` }, 400);
    }

    const capturedAmount = paymentIntent.amount_received || paymentIntent.amount;
    const { platformFee, professionalPayout } = calculatePayoutAmounts(capturedAmount);
    const sourceTransaction = getLatestChargeId(paymentIntent);
    if (!sourceTransaction) {
      return jsonResponse({ error: 'Captured payment charge not found for payout' }, 400);
    }

    // Create a transfer to the professional's Connect account
    const transfer = await stripe.transfers.create(
      {
        amount: professionalPayout,
        currency: paymentIntent.currency,
        destination: handyProfile.stripe_connect_account_id,
        source_transaction: sourceTransaction,
        transfer_group: `booking_${bookingId}`,
        metadata: {
          booking_id: bookingId,
          payment_intent_id: paymentIntentId,
          platform_fee: platformFee,
          original_amount: capturedAmount,
        },
      },
      { idempotencyKey: `${bookingId}_${paymentIntentId}_payout` }
    );

    // Update booking with payout information
    await supabaseClient
      .from('bookings')
      .update({
        payout_status: 'transferred',
        payout_amount_cents: professionalPayout,
        platform_fee_cents: platformFee,
        transfer_id: transfer.id,
      })
      .eq('id', bookingId)
      .is('transfer_id', null);

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
