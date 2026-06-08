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

type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'ops_admin'
  | 'support_admin'
  | 'finance_admin'
  | 'seo_admin';

type AdminPermission = 'finance.manage';

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: ['finance.manage'],
  content_admin: [],
  ops_admin: [],
  support_admin: [],
  finance_admin: ['finance.manage'],
  seo_admin: [],
};

function roleHasPermission(role: AdminRole | null | undefined, permission: AdminPermission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export async function requireAdminPermission(req: Request, permission: AdminPermission) {
  const auth = await requireAuthenticatedUser(req);
  if ('error' in auth) return auth;

  const { user, serviceClient } = auth;
  const { data: profile, error } = await serviceClient
    .from('profiles')
    .select('role, admin_role, account_status')
    .eq('user_id', user.id)
    .single();

  if (error || !profile || profile.role !== 'admin' || profile.account_status !== 'active') {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) };
  }

  if (!roleHasPermission(profile.admin_role as AdminRole | null, permission)) {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) };
  }

  return auth;
}
