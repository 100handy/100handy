import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";
import { calculatePayoutAmounts } from "../_shared/payment-policy.ts";
import { jsonResponse, requireAuthenticatedUser } from "../_shared/auth.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;
    const { user, serviceClient } = auth;

    const { bookingId } = await req.json();
    if (!bookingId) {
      return jsonResponse({ error: 'Booking ID is required' }, 400);
    }

    const { data: requesterProfile, error: requesterError } = await serviceClient
      .from('profiles')
      .select('role, account_status')
      .eq('user_id', user.id)
      .single();

    if (requesterError || !requesterProfile || requesterProfile.role !== 'admin' || requesterProfile.account_status !== 'active') {
      return jsonResponse({ error: 'Active admin access is required' }, 403);
    }

    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .select('id, handy_id, status, payment_status, payout_status, transfer_id, payment_intent_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    if (booking.status !== 'completed') {
      return jsonResponse({ error: `Booking must be completed, got ${booking.status}` }, 400);
    }

    if (booking.payment_status !== 'captured') {
      return jsonResponse({ error: `Payment must be captured, got ${booking.payment_status}` }, 400);
    }

    if (booking.transfer_id || booking.payout_status === 'transferred') {
      return jsonResponse({ error: 'Payout has already been transferred' }, 400);
    }

    if (!booking.handy_id || !booking.payment_intent_id) {
      return jsonResponse({ error: 'Booking payout context is incomplete' }, 400);
    }

    const { data: handyProfile, error: profileError } = await serviceClient
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

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment_intent_id);
    if (paymentIntent.status !== 'succeeded') {
      return jsonResponse({ error: `Payment intent is not captured. Status: ${paymentIntent.status}` }, 400);
    }

    const capturedAmount = paymentIntent.amount_received || paymentIntent.amount;
    const { platformFee, professionalPayout } = calculatePayoutAmounts(capturedAmount);

    const transfer = await stripe.transfers.create(
      {
        amount: professionalPayout,
        currency: paymentIntent.currency,
        destination: handyProfile.stripe_connect_account_id,
        transfer_group: `booking_${bookingId}`,
        metadata: {
          booking_id: bookingId,
          payment_intent_id: booking.payment_intent_id,
          platform_fee: platformFee,
          original_amount: capturedAmount,
          triggered_by_admin: user.id,
        },
      },
      { idempotencyKey: `${bookingId}_${booking.payment_intent_id}_admin_payout` },
    );

    const { error: updateError } = await serviceClient
      .from('bookings')
      .update({
        payout_status: 'transferred',
        payout_amount_cents: professionalPayout,
        platform_fee_cents: platformFee,
        transfer_id: transfer.id,
      })
      .eq('id', bookingId)
      .is('transfer_id', null);

    if (updateError) {
      return jsonResponse({ error: 'Payout transfer succeeded but booking update failed' }, 500);
    }

    return jsonResponse({
      success: true,
      transferId: transfer.id,
      amount: professionalPayout,
      platformFee,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Error processing admin payout:', error);
    return jsonResponse({ error: 'Admin payout processing failed' }, 500);
  }
});
