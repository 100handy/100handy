import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("API Example Function started!")

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create a Supabase client with the Auth context of the logged in user.
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Get the session or user object
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        // Handle different HTTP methods
        switch (req.method) {
            case 'GET':
                return new Response(
                    JSON.stringify({
                        message: 'Hello from authenticated API!',
                        user: user.email,
                        timestamp: new Date().toISOString()
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json'
                        }
                    }
                )

            case 'POST':
                const body = await req.json()

                // Example: Insert data into a table
                // const { data, error } = await supabaseClient
                //   .from('your_table')
                //   .insert([body])
                //   .select()

                return new Response(
                    JSON.stringify({
                        message: 'Data processed successfully',
                        received: body,
                        user: user.email
                    }),
                    {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json'
                        }
                    }
                )

            default:
                return new Response(
                    JSON.stringify({ error: 'Method not allowed' }),
                    {
                        status: 405,
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json'
                        }
                    }
                )
        }
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    }
})