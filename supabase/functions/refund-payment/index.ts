import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { jsonResponse, requireAdminPermission } from '../_shared/auth.ts';
import { calculatePayoutAmounts } from '../_shared/payment-policy.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

function getTransferReversalAmount(refundAmount: number | undefined, transferAmount: number): number | undefined {
  if (!refundAmount || refundAmount <= 0) return undefined;
  const { professionalPayout } = calculatePayoutAmounts(refundAmount);
  return Math.min(professionalPayout, transferAmount);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await requireAdminPermission(req, 'finance.manage');
    if ('error' in auth) return auth.error;
    const { serviceClient } = auth;

    const { bookingId, amount } = await req.json();

    if (!bookingId) {
      return jsonResponse({ error: 'Booking ID is required' }, 400);
    }

    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .select('id, customer_id, handy_id, payment_intent_id, payment_status, status, transfer_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    if (!booking.payment_intent_id) {
      return jsonResponse({ error: 'No payment found for this booking' }, 400);
    }

    if (booking.payment_status !== 'captured') {
      return jsonResponse({ error: `Cannot refund a payment with status: ${booking.payment_status}` }, 400);
    }

    // Issue the refund via Stripe
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: booking.payment_intent_id,
      reason: 'requested_by_customer',
    };

    if (amount && amount > 0) {
      refundParams.amount = Math.round(amount); // Partial refund in cents
    }

    const refund = await stripe.refunds.create(refundParams, {
      idempotencyKey: `${bookingId}_${amount || 'full'}_refund`,
    });

    let reversalId: string | null = null;
    if (booking.transfer_id) {
      const transfer = await stripe.transfers.retrieve(booking.transfer_id);
      const reversalAmount = getTransferReversalAmount(refund.amount, transfer.amount);
      const reversal = await stripe.transfers.createReversal(
        booking.transfer_id,
        reversalAmount ? { amount: reversalAmount } : {},
        { idempotencyKey: `${bookingId}_${amount || 'full'}_transfer_reversal` }
      );
      reversalId = reversal.id;
    }

    // Update booking payment status
    const updateData: Record<string, unknown> = { payment_status: 'refunded' };
    if (booking.transfer_id) {
      updateData.payout_status = 'failed';
    }

    await serviceClient
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        refundId: refund.id,
        reversalId,
        amount: refund.amount,
        status: refund.status,
        currency: refund.currency,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return new Response(
      JSON.stringify({ error: 'Refund processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
