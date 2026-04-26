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
    const auth = await requireAuthenticatedUser(req);
    if ('error' in auth) return auth.error;

    const customerId = await getStripeCustomerIdForUser(auth.serviceClient, auth.user.id);
    if (!customerId) {
      return jsonResponse({ error: 'Stripe customer not found' }, 400);
    }

    // Fetch payment methods and customer in parallel for better performance
    const [paymentMethods, customer] = await Promise.all([
      stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      }),
      stripe.customers.retrieve(customerId),
    ]);

    const defaultPaymentMethodId =
      typeof customer !== 'deleted' && customer.invoice_settings?.default_payment_method
        ? customer.invoice_settings.default_payment_method
        : null;

    // Format payment methods for frontend - match Stripe's PaymentMethod structure
    const formattedMethods = paymentMethods.data.map((pm) => ({
      id: pm.id,
      type: 'card',
      card: {
        brand: pm.card?.brand || 'unknown',
        last4: pm.card?.last4 || '0000',
        exp_month: pm.card?.exp_month || 0,
        exp_year: pm.card?.exp_year || 0,
      },
      billing_details: {
        name: pm.billing_details?.name,
        email: pm.billing_details?.email,
      },
      isDefault: pm.id === defaultPaymentMethodId,
    }));

    return new Response(
      JSON.stringify({
        paymentMethods: formattedMethods,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error listing payment methods:', {
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
