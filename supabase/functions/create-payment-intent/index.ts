import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { getStripeCustomerIdForUser, jsonResponse, requireAuthenticatedUser } from '../_shared/auth.ts';
import { calculateAuthorizationAmountCents, parsePositiveNumber } from '../_shared/payment-policy.ts';

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

    const { currency = 'gbp', metadata = {} } = await req.json();
    const bookingId = metadata?.booking_id;
    const handyId = metadata?.handy_id ?? metadata?.handyman_id;
    const categoryId = metadata?.category_id;
    const estimatedHours = parsePositiveNumber(metadata?.estimated_hours, 'estimated_hours');

    if (!handyId || !categoryId) {
      return jsonResponse({ error: 'Handy ID and category ID are required' }, 400);
    }

    const { data: handyProfile, error: handyError } = await serviceClient
      .from('handy_profiles')
      .select('hourly_rate_cents')
      .eq('user_id', handyId)
      .single();

    if (handyError || !handyProfile) {
      return jsonResponse({ error: 'Professional profile not found' }, 404);
    }

    let hourlyRateCents = handyProfile.hourly_rate_cents;
    const { data: category } = await serviceClient
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();

    if (category?.name) {
      const { data: skill } = await serviceClient
        .from('skills')
        .select('id')
        .ilike('name', category.name)
        .single();

      if (skill?.id) {
        const { data: userSkill } = await serviceClient
          .from('user_skills')
          .select('hourly_rate_cents')
          .eq('user_id', handyId)
          .eq('skill_id', skill.id)
          .eq('is_active', true)
          .gt('hourly_rate_cents', 0)
          .single();

        if (userSkill?.hourly_rate_cents) {
          hourlyRateCents = userSkill.hourly_rate_cents;
        }
      }
    }

    const amount = calculateAuthorizationAmountCents({
      hourlyRateCents,
      estimatedHours,
      frequency: metadata?.frequency,
    });
    const customerId = await getStripeCustomerIdForUser(serviceClient, user.id);

    // Create a PaymentIntent with manual capture (authorization hold)
    // This places a hold on the customer's card without charging it
    // The hold is valid for 7 days for online card payments
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: currency.toLowerCase(),
        customer: customerId,
        capture_method: 'manual', // Authorization hold - charge later when task completes
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never', // Cards only, no redirect-based methods
        },
        metadata: {
          ...metadata,
          expected_amount_cents: String(amount),
          hourly_rate_cents: String(hourlyRateCents),
          platform: '100handy',
          user_id: user.id,
        },
      },
      bookingId ? { idempotencyKey: `${bookingId}_create` } : undefined
    );

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating payment intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
    const clientError =
      typeof error.message === 'string' &&
      (error.message.includes('must be a positive number') ||
        error.message.includes('Recurring booking checkout') ||
        error.message.includes('Invalid booking frequency'));

    return new Response(
      JSON.stringify({ error: clientError ? error.message : 'Payment processing failed' }),
      {
        status: clientError ? 400 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
