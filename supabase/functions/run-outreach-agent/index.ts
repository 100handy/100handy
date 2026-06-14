import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireOutreachAdmin } from "../_shared/outreach-auth.ts";
import { classifyItems, safeChoice, type AgentType, type InputItem } from "../_shared/outreach-classify.ts";

type RunPayload = {
  agent_type?: AgentType;
  source_platform?: string;
  default_service_type?: string;
  items?: InputItem[];
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const admin = await requireOutreachAdmin(req);
    if ("error" in admin) return admin.error;

    const body = (await req.json()) as RunPayload;
    const agentType = safeChoice(body.agent_type, ["customer_finder", "worker_finder"] as const, "customer_finder");
    const sourcePlatform = (body.source_platform ?? "").trim();
    const defaultServiceType = (body.default_service_type ?? "Local service").trim();
    const items = (body.items ?? []).filter((item) => item.raw_text?.trim()).slice(0, 20);

    if (!sourcePlatform) return jsonResponse({ error: "source_platform is required" }, 400);
    if (items.length === 0) return jsonResponse({ error: "At least one item is required" }, 400);

    const classified = await classifyItems(agentType, sourcePlatform, defaultServiceType, items);
    const created = [];

    for (let index = 0; index < classified.length; index += 1) {
      const lead = classified[index];
      const item = items[index];
      if (!lead.include) continue;

      const { data: insertedLead, error: leadError } = await admin.serviceClient
        .from("outreach_leads")
        .insert({
          lead_type: lead.lead_type,
          source_platform: sourcePlatform,
          source_url: item.source_url ?? null,
          profile_name: lead.profile_name,
          business_name: lead.business_name,
          location: lead.location,
          service_type: lead.service_type,
          urgency: lead.urgency,
          intent_strength: lead.intent_strength,
          source_confidence: lead.source_confidence,
          raw_text: item.raw_text.trim(),
          evidence_text: lead.evidence_text,
          public_contact_method: lead.public_contact_method,
          contact_detail: lead.contact_detail,
          contact_allowed: lead.contact_allowed,
          ai_score: lead.ai_score,
          ai_summary: lead.ai_summary,
          status: lead.contact_allowed === "no" ? "rejected" : "reviewed",
          approval_status: lead.contact_allowed === "no" ? "rejected" : "pending",
          do_not_contact_reason: lead.do_not_contact_reason,
          duplicate_check_key: [
            agentType,
            sourcePlatform,
            item.source_url || lead.profile_name || lead.business_name || item.raw_text.slice(0, 80),
            lead.service_type,
            lead.location ?? "",
          ]
            .join(":")
            .toLowerCase(),
          created_by: admin.user.id,
          updated_by: admin.user.id,
          metadata: {
            agent_type: agentType,
            batch_generated: true,
          },
        })
        .select("*")
        .single();

      if (leadError) throw leadError;

      let message = null;
      if (lead.contact_allowed !== "no") {
        const { data: insertedMessage, error: messageError } = await admin.serviceClient
          .from("outreach_messages")
          .insert({
            lead_id: insertedLead.id,
            message_type: "initial",
            channel: "manual",
            draft_text: lead.draft_text,
            personalised_reason: lead.personalised_reason,
            approval_status: "pending",
            delivery_status: "not_sent",
            metadata: {
              ai_generated: true,
              agent_type: agentType,
              model: Deno.env.get("OUTREACH_AI_MODEL") ?? "gpt-4o-mini",
              generated_at: new Date().toISOString(),
            },
          })
          .select("*")
          .single();

        if (messageError) throw messageError;
        message = insertedMessage;
      }

      created.push({ lead: insertedLead, message });
    }

    return jsonResponse({ success: true, created_count: created.length, created });
  } catch (error) {
    console.error("run-outreach-agent error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
