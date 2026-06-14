import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireOutreachAdmin } from "../_shared/outreach-auth.ts";

type SendPayload = { message_id?: string };

function isValidEmail(email: string | null | undefined): email is string {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const admin = await requireOutreachAdmin(req);
    if ("error" in admin) return admin.error;

    const body = (await req.json()) as SendPayload;
    const messageId = (body.message_id ?? "").trim();
    if (!messageId) return jsonResponse({ error: "message_id is required" }, 400);

    const { data: message, error: messageError } = await admin.serviceClient
      .from("outreach_messages")
      .select("*")
      .eq("id", messageId)
      .single();
    if (messageError || !message) return jsonResponse({ error: "Message not found" }, 404);

    if (message.approval_status !== "approved") {
      return jsonResponse({ error: "Message must be approved before sending" }, 400);
    }
    if (message.delivery_status === "sent") {
      return jsonResponse({ error: "Message has already been sent" }, 400);
    }

    const { data: lead, error: leadError } = await admin.serviceClient
      .from("outreach_leads")
      .select("*")
      .eq("id", message.lead_id)
      .single();
    if (leadError || !lead) return jsonResponse({ error: "Lead not found" }, 404);

    // Compliance: email channel is for worker leads with a public business email only.
    if (lead.lead_type !== "worker") {
      return jsonResponse({ error: "Email send is only enabled for worker leads" }, 400);
    }
    if (lead.contact_allowed === "no") {
      return jsonResponse({ error: "Lead is marked do-not-contact" }, 400);
    }
    if (lead.public_contact_method !== "email" || !isValidEmail(lead.contact_detail)) {
      return jsonResponse({ error: "Lead has no valid public business email" }, 400);
    }

    const host = Deno.env.get("SMTP_HOST");
    const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASSWORD");
    if (!host || !smtpUser || !smtpPass) {
      return jsonResponse({ error: "SMTP is not configured" }, 500);
    }

    const recipient = lead.contact_detail;
    const businessName = lead.business_name || lead.profile_name || "there";
    const subject = `Local work opportunities with 100Handy`;
    const optOut =
      "If you'd prefer not to receive opportunities from 100Handy, just reply STOP and we won't contact you again.";
    const signature = "100Handy — connecting trusted local professionals with nearby customers.";
    const textBody = `${message.draft_text}\n\n—\n${signature}\n${optOut}`;
    const htmlBody = `<div style="font-family:sans-serif;font-size:14px;line-height:1.5;color:#0f172a">
<p>${escapeHtml(message.draft_text).replace(/\n/g, "<br/>")}</p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
<p style="color:#64748b;font-size:12px">${escapeHtml(signature)}<br/>${escapeHtml(optOut)}</p>
</div>`;

    const client = new SMTPClient({
      connection: { hostname: host, port, tls: port === 465, auth: { username: smtpUser, password: smtpPass } },
    });

    try {
      await client.send({
        from: `100 Handy <${smtpUser}>`,
        to: recipient,
        subject,
        content: textBody,
        html: htmlBody,
      });
      await client.close();
    } catch (sendError) {
      try {
        await client.close();
      } catch (_) {
        // ignore close failure
      }
      const failure = sendError instanceof Error ? sendError.message : "SMTP send failed";
      await admin.serviceClient
        .from("outreach_messages")
        .update({ delivery_status: "failed", failure_reason: failure, channel: "email" })
        .eq("id", message.id);
      return jsonResponse({ error: failure }, 502);
    }

    const now = new Date().toISOString();
    await admin.serviceClient
      .from("outreach_messages")
      .update({
        channel: "email",
        delivery_status: "sent",
        sent_at: now,
        sent_by: admin.user.id,
        failure_reason: null,
        metadata: { ...(message.metadata ?? {}), sent_to: recipient, sent_channel: "email" },
      })
      .eq("id", message.id);

    await admin.serviceClient.from("outreach_leads").update({ status: "contacted", updated_by: admin.user.id }).eq("id", lead.id);

    // Auto-schedule a follow-up reminder if none pending.
    const { data: pendingFollowUps } = await admin.serviceClient
      .from("outreach_follow_ups")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("status", "pending")
      .limit(1);

    if (!pendingFollowUps || pendingFollowUps.length === 0) {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 3);
      dueAt.setHours(9, 0, 0, 0);
      await admin.serviceClient.from("outreach_follow_ups").insert({
        lead_id: lead.id,
        message_id: message.id,
        due_at: dueAt.toISOString(),
        status: "pending",
        notes: "Check for a reply to the outreach email before any manual follow-up.",
      });
    }

    return jsonResponse({ success: true, sent_to: recipient, message_id: message.id });
  } catch (error) {
    console.error("send-outreach-message error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
