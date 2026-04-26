import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from './cors.ts';

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function getAuthHeader(req: Request): string | null {
  return req.headers.get('Authorization');
}

export async function requireAuthenticatedUser(req: Request) {
  const authHeader = getAuthHeader(req);
  if (!authHeader) {
    return { error: jsonResponse({ error: 'Unauthorized' }, 401) };
  }

  const authClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await authClient.auth.getUser();
  if (error || !user) {
    return { error: jsonResponse({ error: 'Unauthorized' }, 401) };
  }

  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  return { user, authClient, serviceClient };
}

export async function getStripeCustomerIdForUser(serviceClient: any, userId: string): Promise<string | null> {
  const { data } = await serviceClient
    .from('profiles')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  return data?.stripe_customer_id ?? null;
}

export async function getStripeConnectAccountIdForUser(serviceClient: any, userId: string): Promise<string | null> {
  const { data } = await serviceClient
    .from('handy_profiles')
    .select('stripe_connect_account_id')
    .eq('user_id', userId)
    .single();

  return data?.stripe_connect_account_id ?? null;
}
