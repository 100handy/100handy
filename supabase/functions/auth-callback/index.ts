import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Auth Callback Function started!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const { searchParams } = url
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/(tabs)/home'
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    // Get the base URL for redirects
    const baseUrl = Deno.env.get('EXPO_PUBLIC_SITE_URL') || 'handy://auth'
    
    // Handle error cases
    if (error) {
      console.error('Auth callback error:', error, error_description)
      return Response.redirect(`${baseUrl}/sign-in?error=${encodeURIComponent(error_description || error)}`)
    }

    // Handle successful email confirmation
    if (code) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!
      )

      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError)
          return Response.redirect(`${baseUrl}/sign-in?error=${encodeURIComponent('Failed to confirm email')}`)
        }

        // Successful signup confirmation - redirect to app
        return Response.redirect(`${baseUrl}${next}`)
      } catch (error) {
        console.error('Unexpected error during code exchange:', error)
        return Response.redirect(`${baseUrl}/sign-in?error=${encodeURIComponent('An unexpected error occurred')}`)
      }
    }

    // No code provided - redirect to sign in
    return Response.redirect(`${baseUrl}/sign-in`)

  } catch (error) {
    console.error('Auth callback function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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