import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type CampaignPayload = {
  delivery_job_id?: string;
  test_email?: string;
  subject?: string;
  body?: string;
};

type ProfileRow = {
  user_id: string;
  role: string | null;
  postcode?: string | null;
  account_status?: string | null;
};

function matchesRecipientGroup(role: string | null, recipientGroup: string) {
  switch (recipientGroup) {
    case "client":
    case "new_users":
      return role === "client" || role === "customer";
    case "professional":
    case "new_handys":
      return role === "professional" || role === "handy";
    case "admin":
      return role === "admin";
    case "all":
    default:
      return role === "client" || role === "customer" || role === "professional" || role === "handy";
  }
}

function normalise(text: string | null | undefined) {
  return (text ?? "").trim().toLowerCase();
}

function matchesFilters(
  profile: ProfileRow,
  filters: Record<string, unknown>,
  marketingEnabledUserIds: Set<string>,
) {
  if (profile.account_status && profile.account_status !== "active") return false;
  const city = normalise((filters.city as string | undefined) ?? "");
  if (city) return true; // city fallback unsupported in current schema; do not exclude on empty capability
  const postcodePrefix = normalise((filters.postcode_prefix as string | undefined) ?? "");
  if (postcodePrefix && !normalise(profile.postcode).startsWith(postcodePrefix)) {
    return false;
  }
  if (filters.require_marketing_opt_in === true && !marketingEnabledUserIds.has(profile.user_id)) {
    return false;
  }
  return true;
}

function isValidEmail(email: string | null | undefined): email is string {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authedClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });

    const {
      data: { user },
    } = await authedClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("role,account_status")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin" || profile.account_status !== "active") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Partial<CampaignPayload>;
    const deliveryJobId = (body.delivery_job_id ?? "").trim();
    const testEmail = (body.test_email ?? "").trim();

    if (!deliveryJobId && !testEmail) {
      return new Response(JSON.stringify({ error: "delivery_job_id or test_email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const host = Deno.env.get("SMTP_HOST");
    const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASSWORD");

    if (!host || !smtpUser || !smtpPass) {
      throw new Error("SMTP not configured");
    }

    const client = new SMTPClient({
      connection: {
        hostname: host,
        port,
        tls: port === 465,
        auth: { username: smtpUser, password: smtpPass },
      },
    });

    if (testEmail) {
      try {
        await client.send({
          from: `100 Handy <${smtpUser}>`,
          to: testEmail,
          subject: body.subject ?? "100Handy email test",
          content: body.body ?? "This is a test email from the 100Handy admin panel.",
          html: (body.body ?? "This is a test email from the 100Handy admin panel.").replace(/\n/g, "<br />"),
        });
      } finally {
        await client.close();
      }

      return new Response(
        JSON.stringify({
          success: true,
          mode: "test",
          recipient: testEmail,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: job, error: jobError } = await serviceClient
      .from("email_delivery_jobs")
      .select("*")
      .eq("id", deliveryJobId)
      .single();

    if (jobError || !job) throw jobError ?? new Error("Delivery job not found");

    await serviceClient
      .from("email_delivery_jobs")
      .update({ delivery_status: "processing", error_message: null })
      .eq("id", deliveryJobId);

    const { data: profiles, error: profilesError } = await serviceClient
      .from("profiles")
      .select("user_id, role, postcode, account_status");

    if (profilesError) throw profilesError;

    const audienceFilters = (job.audience_filters ?? {}) as Record<string, unknown>;
    const { data: notificationSettings, error: notificationSettingsError } = await serviceClient
      .from("notification_settings")
      .select("user_id, marketing_emails");

    if (notificationSettingsError) throw notificationSettingsError;

    const marketingEnabledUserIds = new Set(
      (notificationSettings ?? [])
        .filter((row) => row.marketing_emails !== false)
        .map((row) => row.user_id),
    );

    const authUsers = await serviceClient.auth.admin.listUsers();
    const authUserMap = new Map(authUsers.data.users.map((row) => [row.id, row.email ?? null]));

    const recipients = (profiles ?? [])
      .filter((row: ProfileRow) => {
        return matchesRecipientGroup(row.role, job.recipient_group) && matchesFilters(row, audienceFilters, marketingEnabledUserIds);
      })
      .map((row: ProfileRow) => authUserMap.get(row.user_id))
      .filter(isValidEmail);

    const uniqueRecipients = [...new Set(recipients)];

    let sentCount = 0;
    let failedCount = 0;

    try {
      for (const email of uniqueRecipients) {
        try {
          await client.send({
            from: `100 Handy <${smtpUser}>`,
            to: email,
            subject: job.subject,
            content: job.body,
            html: job.body.replace(/\n/g, "<br />"),
          });
          sentCount += 1;
        } catch {
          failedCount += 1;
        }
      }
    } finally {
      await client.close();
    }

    const finalStatus = failedCount > 0 && sentCount === 0 ? "failed" : "sent";

    await serviceClient
      .from("email_delivery_jobs")
      .update({
        delivery_status: finalStatus,
        recipient_count: uniqueRecipients.length,
        sent_count: sentCount,
        failed_count: failedCount,
        completed_at: new Date().toISOString(),
        error_message: failedCount > 0 ? `${failedCount} recipients failed.` : null,
      })
      .eq("id", deliveryJobId);

    return new Response(
      JSON.stringify({
        success: true,
        recipient_count: uniqueRecipients.length,
        sent_count: sentCount,
        failed_count: failedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("send-admin-email-campaign error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
