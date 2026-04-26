import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { getStripeCustomerIdForUser, jsonResponse, requireAuthenticatedUser } from '../_shared/auth.ts';

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
    const { paymentMethodId } = await req.json();
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;

    if (!paymentMethodId) {
      return jsonResponse({ error: 'Payment Method ID is required' }, 400);
    }

    const customerId = await getStripeCustomerIdForUser(auth.serviceClient, auth.user.id);
    if (!customerId) {
      return jsonResponse({ error: 'Stripe customer not found' }, 400);
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const ownerId =
      typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id;
    if (ownerId !== customerId) {
      return jsonResponse({ error: 'Payment method does not belong to the authenticated user' }, 403);
    }

    // Update customer's default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Default payment method updated',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error setting default payment method:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
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
