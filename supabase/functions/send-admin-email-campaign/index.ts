import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type CampaignPayload = {
  delivery_job_id: string;
};

type ProfileRow = {
  user_id: string;
  role: string | null;
};

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
    if (!deliveryJobId) {
      return new Response(JSON.stringify({ error: "delivery_job_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      .select("user_id, role");

    if (profilesError) throw profilesError;

    const authUsers = await serviceClient.auth.admin.listUsers();
    const authUserMap = new Map(authUsers.data.users.map((row) => [row.id, row.email ?? null]));

    const recipients = (profiles ?? [])
      .filter((row: ProfileRow) => {
        switch (job.recipient_group) {
          case "client":
          case "new_users":
            return row.role === "client";
          case "professional":
          case "new_handys":
            return row.role === "professional";
          case "all":
          default:
            return row.role === "client" || row.role === "professional";
        }
      })
      .map((row: ProfileRow) => authUserMap.get(row.user_id))
      .filter(isValidEmail);

    const uniqueRecipients = [...new Set(recipients)];

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
