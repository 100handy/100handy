import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireOutreachAdmin } from "../_shared/outreach-auth.ts";
import { clampScore, safeChoice } from "../_shared/outreach-classify.ts";

type GeneratePayload = {
  lead_id?: string;
};

type OutreachLead = {
  id: string;
  lead_type: "customer" | "worker";
  source_platform: string;
  source_url: string | null;
  profile_name: string | null;
  business_name: string | null;
  location: string | null;
  coverage_area: string | null;
  service_type: string;
  urgency: "low" | "medium" | "high" | null;
  raw_text: string;
  evidence_text: string | null;
  contact_allowed: "yes" | "no" | "unknown";
};

type AiResult = {
  lead_type: "customer" | "worker";
  service_type: string;
  location: string | null;
  urgency: "low" | "medium" | "high";
  intent_strength: "low" | "medium" | "high";
  source_confidence: "low" | "medium" | "high";
  ai_score: number;
  ai_summary: string;
  draft_text: string;
  personalised_reason: string;
  evidence_text: string | null;
  public_contact_method: "website" | "email" | "phone" | "social_profile" | "profile_only" | "unknown";
  contact_detail: string | null;
  contact_allowed: "yes" | "no" | "unknown";
  do_not_contact_reason: string | null;
};

function fallbackDraft(lead: OutreachLead): AiResult {
  const name = lead.profile_name || lead.business_name || "there";
  const location = lead.location || lead.coverage_area;
  const service = lead.service_type.toLowerCase();
  const draft =
    lead.lead_type === "worker"
      ? `Hi ${name}, I noticed you provide ${service} services${location ? ` in ${location}` : ""}. We're expanding 100Handy and are looking for trusted professionals in your area. Would you be interested in receiving additional local work opportunities?`
      : `Hi ${name}, if you're still looking for help with ${service}${location ? ` in ${location}` : ""}, 100Handy can connect you with a vetted local professional. Let me know if you'd like more information.`;

  return {
    lead_type: lead.lead_type,
    service_type: lead.service_type,
    location,
    urgency: lead.urgency ?? "medium",
    intent_strength: "medium",
    source_confidence: "medium",
    ai_score: 5,
    ai_summary: "Fallback draft generated without AI classification.",
    draft_text: draft,
    personalised_reason: "Generated from lead type, service, name, and location.",
    evidence_text: lead.evidence_text || lead.raw_text.slice(0, 500),
    public_contact_method: "unknown",
    contact_detail: null,
    contact_allowed: lead.contact_allowed,
    do_not_contact_reason: lead.contact_allowed === "no" ? "Contact is marked as not allowed on this lead." : null,
  };
}

async function generateWithOpenAI(lead: OutreachLead): Promise<AiResult> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return fallbackDraft(lead);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: Deno.env.get("OUTREACH_AI_MODEL") ?? "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You classify and draft outreach for 100Handy, a UK local services marketplace.

Return strict JSON with:
lead_type, service_type, location, urgency, intent_strength, source_confidence, ai_score, ai_summary, draft_text, personalised_reason, evidence_text, public_contact_method, contact_detail, contact_allowed, do_not_contact_reason.

Rules:
- lead_type must be customer or worker.
- urgency, intent_strength, source_confidence must be low, medium, or high.
- ai_score must be 1-10.
- draft_text must be concise, specific, natural, and under 70 words.
- Do not claim the person asked for 100Handy.
- Do not promise availability.
- Do not encourage automated spam.
- public_contact_method must be website, email, phone, social_profile, profile_only, or unknown.
- contact_detail must only contain contact details explicitly present in the lead text/source context.
- If contact is not allowed or the lead is weak/irrelevant, lower the score and explain why.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            lead,
            expected_customer_example:
              "Hi Sarah, if you're still looking for a cleaner in Liverpool, 100Handy can connect you with a vetted local professional. Let me know if you'd like more information.",
            expected_worker_example:
              "Hi John, I noticed you provide handyman services in Warrington. We're expanding 100Handy and are looking for trusted professionals in your area. Would you be interested in receiving additional local work opportunities?",
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI outreach error:", await response.text());
    return fallbackDraft(lead);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Partial<AiResult>;

  return {
    lead_type: safeChoice(parsed.lead_type, ["customer", "worker"] as const, lead.lead_type),
    service_type:
      typeof parsed.service_type === "string" && parsed.service_type.trim() ? parsed.service_type.trim() : lead.service_type,
    location: typeof parsed.location === "string" && parsed.location.trim() ? parsed.location.trim() : lead.location,
    urgency: safeChoice(parsed.urgency, ["low", "medium", "high"] as const, lead.urgency ?? "medium"),
    intent_strength: safeChoice(parsed.intent_strength, ["low", "medium", "high"] as const, "medium"),
    source_confidence: safeChoice(parsed.source_confidence, ["low", "medium", "high"] as const, "medium"),
    ai_score: clampScore(parsed.ai_score),
    ai_summary: typeof parsed.ai_summary === "string" ? parsed.ai_summary.trim() : fallbackDraft(lead).ai_summary,
    draft_text:
      typeof parsed.draft_text === "string" && parsed.draft_text.trim() ? parsed.draft_text.trim() : fallbackDraft(lead).draft_text,
    personalised_reason:
      typeof parsed.personalised_reason === "string" ? parsed.personalised_reason.trim() : "Generated from lead context.",
    evidence_text:
      typeof parsed.evidence_text === "string" && parsed.evidence_text.trim() ? parsed.evidence_text.trim() : lead.evidence_text,
    public_contact_method: safeChoice(
      parsed.public_contact_method,
      ["website", "email", "phone", "social_profile", "profile_only", "unknown"] as const,
      "unknown",
    ),
    contact_detail: typeof parsed.contact_detail === "string" && parsed.contact_detail.trim() ? parsed.contact_detail.trim() : null,
    contact_allowed: safeChoice(parsed.contact_allowed, ["yes", "no", "unknown"] as const, lead.contact_allowed),
    do_not_contact_reason:
      typeof parsed.do_not_contact_reason === "string" && parsed.do_not_contact_reason.trim()
        ? parsed.do_not_contact_reason.trim()
        : null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const admin = await requireOutreachAdmin(req);
    if ("error" in admin) return admin.error;

    const body = (await req.json()) as GeneratePayload;
    const leadId = (body.lead_id ?? "").trim();
    if (!leadId) {
      return jsonResponse({ error: "lead_id is required" }, 400);
    }

    const { data: lead, error: leadError } = await admin.serviceClient
      .from("outreach_leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return jsonResponse({ error: "Lead not found" }, 404);
    }

    const result = await generateWithOpenAI(lead as OutreachLead);
    const leadStatus = result.contact_allowed === "no" ? "rejected" : "reviewed";
    const approvalStatus = result.contact_allowed === "no" ? "rejected" : "pending";

    const { data: updatedLead, error: updateLeadError } = await admin.serviceClient
      .from("outreach_leads")
      .update({
        lead_type: result.lead_type,
        service_type: result.service_type,
        location: result.location,
        urgency: result.urgency,
        intent_strength: result.intent_strength,
        source_confidence: result.source_confidence,
        ai_score: result.ai_score,
        ai_summary: result.ai_summary,
        evidence_text: result.evidence_text,
        public_contact_method: result.public_contact_method,
        contact_detail: result.contact_detail,
        contact_allowed: result.contact_allowed,
        do_not_contact_reason: result.do_not_contact_reason,
        status: leadStatus,
        approval_status: approvalStatus,
        updated_by: admin.user.id,
      })
      .eq("id", leadId)
      .select("*")
      .single();

    if (updateLeadError) throw updateLeadError;

    let message = null;
    if (result.contact_allowed !== "no") {
      const { data: insertedMessage, error: messageError } = await admin.serviceClient
        .from("outreach_messages")
        .insert({
          lead_id: leadId,
          message_type: "initial",
          channel: "manual",
          draft_text: result.draft_text,
          personalised_reason: result.personalised_reason,
          approval_status: "pending",
          delivery_status: "not_sent",
          metadata: {
            ai_generated: true,
            model: Deno.env.get("OUTREACH_AI_MODEL") ?? "gpt-4o-mini",
            generated_at: new Date().toISOString(),
          },
        })
        .select("*")
        .single();

      if (messageError) throw messageError;
      message = insertedMessage;
    }

    return jsonResponse({
      success: true,
      lead: updatedLead,
      message,
      ai_result: result,
    });
  } catch (error) {
    console.error("generate-outreach-draft error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
