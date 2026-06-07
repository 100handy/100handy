import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type AgentType = "customer_finder" | "worker_finder";

type InputItem = {
  raw_text: string;
  source_url?: string | null;
  profile_name?: string | null;
  business_name?: string | null;
  location?: string | null;
};

type RunPayload = {
  agent_type?: AgentType;
  source_platform?: string;
  default_service_type?: string;
  items?: InputItem[];
};

type ClassifiedLead = {
  include: boolean;
  lead_type: "customer" | "worker";
  profile_name: string | null;
  business_name: string | null;
  location: string | null;
  service_type: string;
  urgency: "low" | "medium" | "high";
  intent_strength: "low" | "medium" | "high";
  source_confidence: "low" | "medium" | "high";
  ai_score: number;
  ai_summary: string;
  evidence_text: string;
  public_contact_method: "website" | "email" | "phone" | "social_profile" | "profile_only" | "unknown";
  contact_detail: string | null;
  contact_allowed: "yes" | "no" | "unknown";
  do_not_contact_reason: string | null;
  draft_text: string;
  personalised_reason: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function safeChoice<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function clampScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 1;
  return Math.max(1, Math.min(10, Math.round(score)));
}

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const authClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    return { error: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("role, admin_role, account_status")
    .eq("user_id", user.id)
    .single();

  const canManageOutreach = profile?.admin_role === "super_admin" || profile?.admin_role === "ops_admin";
  if (profileError || !profile || profile.role !== "admin" || profile.account_status !== "active" || !canManageOutreach) {
    return { error: jsonResponse({ error: "Forbidden" }, 403) };
  }

  return { user, serviceClient };
}

function fallbackClassify(item: InputItem, agentType: AgentType, defaultServiceType: string): ClassifiedLead {
  const leadType = agentType === "worker_finder" ? "worker" : "customer";
  const name = item.profile_name || item.business_name || "there";
  const service = defaultServiceType || "Local service";
  const draftText =
    leadType === "worker"
      ? `Hi ${name}, I noticed you provide ${service.toLowerCase()} services${item.location ? ` in ${item.location}` : ""}. We're expanding 100Handy and are looking for trusted professionals in your area. Would you be interested in receiving additional local work opportunities?`
      : `Hi ${name}, if you're still looking for help with ${service.toLowerCase()}${item.location ? ` in ${item.location}` : ""}, 100Handy can connect you with a vetted local professional. Let me know if you'd like more information.`;

  return {
    include: true,
    lead_type: leadType,
    profile_name: item.profile_name ?? null,
    business_name: item.business_name ?? null,
    location: item.location ?? null,
    service_type: service,
    urgency: "medium",
    intent_strength: "medium",
    source_confidence: "medium",
    ai_score: 5,
    ai_summary: "Fallback classification generated without AI.",
    evidence_text: item.raw_text.slice(0, 500),
    public_contact_method: "unknown",
    contact_detail: null,
    contact_allowed: "unknown",
    do_not_contact_reason: null,
    draft_text: draftText,
    personalised_reason: "Generated from pasted source text.",
  };
}

async function classifyItems(agentType: AgentType, sourcePlatform: string, defaultServiceType: string, items: InputItem[]) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return items.map((item) => fallbackClassify(item, agentType, defaultServiceType));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: Deno.env.get("OUTREACH_AI_MODEL") ?? "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the ${agentType} for 100Handy.

Customer Finder: identify people actively asking for handyman, cleaning, moving, gardening, furniture assembly, plumbing, or electrical help.
Worker Finder: identify tradespeople or service providers advertising local services.

Return strict JSON: {"leads":[...]} with one output per input item.
Each lead must include: include, lead_type, profile_name, business_name, location, service_type, urgency, intent_strength, source_confidence, ai_score, ai_summary, evidence_text, public_contact_method, contact_detail, contact_allowed, do_not_contact_reason, draft_text, personalised_reason.

Rules:
- Do not invent contact details.
- draft_text must be under 70 words and human-review friendly.
- Do not auto-send or imply the person asked for 100Handy.
- Set include=false for irrelevant/weak items.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            agent_type: agentType,
            source_platform: sourcePlatform,
            default_service_type: defaultServiceType,
            items,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI outreach batch error:", await response.text());
    return items.map((item) => fallbackClassify(item, agentType, defaultServiceType));
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { leads?: Partial<ClassifiedLead>[] };

  return items.map((item, index) => {
    const lead = parsed.leads?.[index] ?? {};
    const fallback = fallbackClassify(item, agentType, defaultServiceType);
    return {
      include: lead.include !== false,
      lead_type: safeChoice(lead.lead_type, ["customer", "worker"] as const, fallback.lead_type),
      profile_name: typeof lead.profile_name === "string" ? lead.profile_name : item.profile_name ?? null,
      business_name: typeof lead.business_name === "string" ? lead.business_name : item.business_name ?? null,
      location: typeof lead.location === "string" ? lead.location : item.location ?? null,
      service_type: typeof lead.service_type === "string" && lead.service_type.trim() ? lead.service_type.trim() : fallback.service_type,
      urgency: safeChoice(lead.urgency, ["low", "medium", "high"] as const, fallback.urgency),
      intent_strength: safeChoice(lead.intent_strength, ["low", "medium", "high"] as const, fallback.intent_strength),
      source_confidence: safeChoice(lead.source_confidence, ["low", "medium", "high"] as const, fallback.source_confidence),
      ai_score: clampScore(lead.ai_score),
      ai_summary: typeof lead.ai_summary === "string" ? lead.ai_summary : fallback.ai_summary,
      evidence_text: typeof lead.evidence_text === "string" ? lead.evidence_text : fallback.evidence_text,
      public_contact_method: safeChoice(
        lead.public_contact_method,
        ["website", "email", "phone", "social_profile", "profile_only", "unknown"] as const,
        "unknown",
      ),
      contact_detail: typeof lead.contact_detail === "string" && lead.contact_detail.trim() ? lead.contact_detail.trim() : null,
      contact_allowed: safeChoice(lead.contact_allowed, ["yes", "no", "unknown"] as const, "unknown"),
      do_not_contact_reason:
        typeof lead.do_not_contact_reason === "string" && lead.do_not_contact_reason.trim()
          ? lead.do_not_contact_reason.trim()
          : null,
      draft_text: typeof lead.draft_text === "string" && lead.draft_text.trim() ? lead.draft_text.trim() : fallback.draft_text,
      personalised_reason:
        typeof lead.personalised_reason === "string" && lead.personalised_reason.trim()
          ? lead.personalised_reason.trim()
          : fallback.personalised_reason,
    };
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const admin = await requireAdmin(req);
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
          ].join(":").toLowerCase(),
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
