// Shared admin gate for outreach edge functions.
// Requires an authenticated admin whose admin_role can manage outreach.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export type OutreachAdmin = {
  user: { id: string };
  serviceClient: SupabaseClient;
};

export async function requireOutreachAdmin(req: Request): Promise<OutreachAdmin | { error: Response }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    return { error: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("role, admin_role, account_status")
    .eq("user_id", user.id)
    .single();

  const canManageOutreach = profile?.admin_role === "super_admin" || profile?.admin_role === "ops_admin";
  if (
    profileError ||
    !profile ||
    profile.role !== "admin" ||
    profile.account_status !== "active" ||
    !canManageOutreach
  ) {
    return { error: jsonResponse({ error: "Forbidden" }, 403) };
  }

  return { user: { id: user.id }, serviceClient };
}
