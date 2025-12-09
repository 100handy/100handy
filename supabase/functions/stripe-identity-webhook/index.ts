import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2024-10-28.acacia',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const webhookSecret = Deno.env.get('STRIPE_IDENTITY_WEBHOOK_SECRET') || '';

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // Only allow POST requests for webhooks
    if (req.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return new Response(
                JSON.stringify({ error: 'Missing stripe-signature header' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Verify the webhook signature
        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                webhookSecret
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return new Response(
                JSON.stringify({ error: `Webhook Error: ${err.message}` }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'identity.verification_session.verified': {
                const session = event.data.object as Stripe.Identity.VerificationSession;
                console.log('Verification session verified:', session.id);

                // Update the user's verification status to verified
                const { error: updateError } = await supabaseAdmin
                    .from('handy_profiles')
                    .update({
                        verification_status: 'verified',
                    })
                    .eq('stripe_verification_session_id', session.id);

                if (updateError) {
                    console.error('Error updating profile to verified:', updateError);
                    // Don't throw - log error but return 200 to Stripe to prevent retries
                } else {
                    console.log('Profile updated to verified for session:', session.id);
                }
                break;
            }

            case 'identity.verification_session.requires_input': {
                const session = event.data.object as Stripe.Identity.VerificationSession;
                console.log('Verification session requires input:', session.id);

                // Get the last error if available
                const lastError = session.last_error;
                const errorCode = lastError?.code || 'unknown';
                const errorReason = lastError?.reason || 'Verification failed';

                console.log('Verification failed reason:', errorCode, errorReason);

                // Update the user's verification status to rejected
                const { error: updateError } = await supabaseAdmin
                    .from('handy_profiles')
                    .update({
                        verification_status: 'rejected',
                    })
                    .eq('stripe_verification_session_id', session.id);

                if (updateError) {
                    console.error('Error updating profile to rejected:', updateError);
                    // Don't throw - log error but return 200 to Stripe to prevent retries
                } else {
                    console.log('Profile updated to rejected for session:', session.id);
                }
                break;
            }

            case 'identity.verification_session.canceled': {
                const session = event.data.object as Stripe.Identity.VerificationSession;
                console.log('Verification session canceled:', session.id);

                // Reset the user's verification status to pending
                const { error: updateError } = await supabaseAdmin
                    .from('handy_profiles')
                    .update({
                        verification_status: 'pending',
                        stripe_verification_session_id: null,
                    })
                    .eq('stripe_verification_session_id', session.id);

                if (updateError) {
                    console.error('Error resetting profile verification:', updateError);
                    // Don't throw - log error but return 200 to Stripe to prevent retries
                } else {
                    console.log('Profile verification reset for session:', session.id);
                }
                break;
            }

            case 'identity.verification_session.processing': {
                const session = event.data.object as Stripe.Identity.VerificationSession;
                console.log('Verification session processing:', session.id);
                // No action needed, just log
                break;
            }

            case 'identity.verification_session.created': {
                const session = event.data.object as Stripe.Identity.VerificationSession;
                console.log('Verification session created:', session.id);
                // No action needed, session is created via our endpoint
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(
            JSON.stringify({ received: true }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        // Log the error but still return 200 to prevent Stripe retries
        // Stripe considers any 2xx as successful delivery
        console.error('Error processing webhook:', error);
        return new Response(
            JSON.stringify({ received: true, error: error.message }),
            {
                status: 200, // Always 200 to prevent retries
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
});
