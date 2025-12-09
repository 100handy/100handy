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

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        // Verify the user is authenticated
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Authorization header required' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Get the authenticated user from the token
        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !authUser) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired token' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        const { userId, email } = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'User ID is required' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Verify the authenticated user matches the requested userId
        if (authUser.id !== userId) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Cannot create verification session for another user' }),
                {
                    status: 403,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        // Create a VerificationSession
        const verificationSession = await stripe.identity.verificationSessions.create({
            type: 'document',
            metadata: {
                user_id: userId,
            },
            options: {
                document: {
                    require_matching_selfie: true,
                },
            },
        });

        // Create an ephemeral key for the VerificationSession
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { verification_session: verificationSession.id },
            { apiVersion: '2024-10-28.acacia' }
        );

        // Store the verification session ID in the database
        const { error: updateError } = await supabaseAdmin
            .from('handy_profiles')
            .update({
                stripe_verification_session_id: verificationSession.id,
                verification_status: 'submitted',
                verification_submitted_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating profile with verification session:', updateError);
            // Return error - DB update is critical for webhook correlation
            return new Response(
                JSON.stringify({ error: 'Failed to save verification session. Please try again.' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(
            JSON.stringify({
                id: verificationSession.id,
                ephemeral_key_secret: ephemeralKey.secret,
                client_secret: verificationSession.client_secret,
                url: verificationSession.url,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        console.error('Error creating verification session:', error);
        return new Response(
            JSON.stringify({
                error: error.message,
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
});
