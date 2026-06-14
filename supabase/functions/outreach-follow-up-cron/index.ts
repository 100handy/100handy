import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/outreach-auth.ts";
import {
  buildFollowUpText,
  isValidEmail,
  nextFollowUpDueDays,
  sendOutreachEmail,
} from "../_shared/outreach-email.ts";

// Leads in these states are conversation-ended; never auto follow-up.
const STOP_STATES = new Set(["replied", "closed", "rejected"]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const cronSecret = Deno.env.get("OUTREACH_CRON_SECRET") ?? "";
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const nowIso = new Date().toISOString();

  try {
    const { data: dueFollowUps, error } = await serviceClient
      .from("outreach_follow_ups")
      .select("*")
      .eq("status", "pending")
      .eq("auto_send", true)
      .lte("due_at", nowIso)
      .order("due_at", { ascending: true })
      .limit(50);
    if (error) throw error;

    let sent = 0;
    let skipped = 0;
    const errors: Array<{ follow_up_id: string; error: string }> = [];

    for (const fu of dueFollowUps ?? []) {
      const { data: lead } = await serviceClient
        .from("outreach_leads")
        .select("*")
        .eq("id", fu.lead_id)
        .single();

      const eligible =
        lead &&
        lead.lead_type === "worker" &&
        lead.contact_allowed !== "no" &&
        !STOP_STATES.has(lead.status) &&
        lead.public_contact_method === "email" &&
        isValidEmail(lead.contact_detail);

      if (!eligible) {
        skipped += 1;
        await serviceClient
          .from("outreach_follow_ups")
          .update({ status: "skipped", notes: `${fu.notes ?? ""} [auto-skip: lead not email-eligible or conversation ended]`.trim() })
          .eq("id", fu.id);
        continue;
      }

      const step = fu.step ?? 1;
      const bodyText = buildFollowUpText(lead.business_name || lead.profile_name, step);

      try {
        await sendOutreachEmail({
          to: lead.contact_detail,
          subject: "Following up — local work with 100Handy",
          bodyText,
        });
      } catch (sendError) {
        const failure = sendError instanceof Error ? sendError.message : "SMTP send failed";
        errors.push({ follow_up_id: fu.id, error: failure });
        await serviceClient
          .from("outreach_follow_ups")
          .update({ status: "skipped", notes: `${fu.notes ?? ""} [auto-send failed: ${failure}]`.trim() })
          .eq("id", fu.id);
        continue;
      }

      // Record the sent follow-up message (auto-approved system send).
      const { data: followMessage } = await serviceClient
        .from("outreach_messages")
        .insert({
          lead_id: lead.id,
          message_type: "follow_up",
          channel: "email",
          draft_text: bodyText,
          personalised_reason: `Automatic follow-up step ${step}.`,
          approval_status: "approved",
          approved_at: nowIso,
          delivery_status: "sent",
          sent_at: nowIso,
          metadata: { auto_follow_up: true, step, sent_to: lead.contact_detail },
        })
        .select("id")
        .single();

      await serviceClient
        .from("outreach_follow_ups")
        .update({ status: "completed", completed_at: nowIso })
        .eq("id", fu.id);

      // Schedule the next step if the sequence isn't finished.
      const nextDays = nextFollowUpDueDays(step);
      if (nextDays !== null) {
        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + nextDays);
        dueAt.setHours(9, 0, 0, 0);
        await serviceClient.from("outreach_follow_ups").insert({
          lead_id: lead.id,
          message_id: followMessage?.id ?? fu.message_id,
          due_at: dueAt.toISOString(),
          status: "pending",
          auto_send: true,
          step: step + 1,
          notes: `Automatic follow-up #${step + 1} — sends by email unless the lead is marked replied/closed.`,
        });
      }

      sent += 1;
    }

    return jsonResponse({ success: true, processed: (dueFollowUps ?? []).length, sent, skipped, errors });
  } catch (error) {
    console.error("outreach-follow-up-cron error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
