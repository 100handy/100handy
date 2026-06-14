import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireOutreachAdmin } from "../_shared/outreach-auth.ts";
import { FIRST_FOLLOW_UP_DAYS, isValidEmail, sendOutreachEmail } from "../_shared/outreach-email.ts";

type SendPayload = { message_id?: string };

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

    const recipient = lead.contact_detail;

    try {
      await sendOutreachEmail({
        to: recipient,
        subject: "Local work opportunities with 100Handy",
        bodyText: message.draft_text,
      });
    } catch (sendError) {
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

    // Start the automatic follow-up sequence (step 1) if none pending. Best-effort:
    // a scheduling failure must never fail an email that already went out.
    try {
      const { data: pendingFollowUps } = await admin.serviceClient
        .from("outreach_follow_ups")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("status", "pending")
        .limit(1);

      if (!pendingFollowUps || pendingFollowUps.length === 0) {
        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + FIRST_FOLLOW_UP_DAYS);
        dueAt.setHours(9, 0, 0, 0);
        await admin.serviceClient.from("outreach_follow_ups").insert({
          lead_id: lead.id,
          message_id: message.id,
          due_at: dueAt.toISOString(),
          status: "pending",
          auto_send: true,
          step: 1,
          notes: "Automatic follow-up #1 — sends by email unless the lead is marked replied/closed.",
        });
      }
    } catch (followUpError) {
      console.error("send-outreach-message: follow-up scheduling failed (email already sent):", followUpError);
    }

    return jsonResponse({ success: true, sent_to: recipient, message_id: message.id });
  } catch (error) {
    console.error("send-outreach-message error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
