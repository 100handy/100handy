// Shared outreach classifier used by run-outreach-agent and the discovery webhook.
// Classifies pasted/scraped items into customer/worker leads with AI-drafted outreach,
// with a deterministic fallback when no OpenAI key is configured.

export type AgentType = "customer_finder" | "worker_finder";

export type InputItem = {
  raw_text: string;
  source_url?: string | null;
  profile_name?: string | null;
  business_name?: string | null;
  location?: string | null;
};

export type ClassifiedLead = {
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

export function safeChoice<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function clampScore(value: unknown): number {
  const score = Number(value);
  if (!Number.isFinite(score)) return 1;
  return Math.max(1, Math.min(10, Math.round(score)));
}

export function fallbackClassify(item: InputItem, agentType: AgentType, defaultServiceType: string): ClassifiedLead {
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

export async function classifyItems(
  agentType: AgentType,
  sourcePlatform: string,
  defaultServiceType: string,
  items: InputItem[],
): Promise<ClassifiedLead[]> {
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
      service_type:
        typeof lead.service_type === "string" && lead.service_type.trim() ? lead.service_type.trim() : fallback.service_type,
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

// --- Scheduling cadence ---------------------------------------------------

export type Cadence = "off" | "hourly" | "every_6h" | "every_12h" | "daily" | "weekly";

const CADENCE_MINUTES: Record<Cadence, number | null> = {
  off: null,
  hourly: 60,
  every_6h: 360,
  every_12h: 720,
  daily: 1440,
  weekly: 10080,
};

/** Returns the next run timestamp (ISO) for a cadence, or null when scheduling is off. */
export function computeNextRunAt(cadence: string, from: Date): string | null {
  const minutes = CADENCE_MINUTES[cadence as Cadence] ?? null;
  if (minutes === null) return null;
  return new Date(from.getTime() + minutes * 60_000).toISOString();
}
