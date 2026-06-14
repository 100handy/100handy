import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/outreach-auth.ts";
import { buildDedupKey, getDatasetItems, mapItem, verifySignature, type FieldMapping } from "../_shared/apify.ts";
import { classifyItems, type AgentType, type InputItem } from "../_shared/outreach-classify.ts";

const CHUNK_SIZE = 20;

type StagedItem = {
  rawItemId: string;
  dedupKey: string;
  input: InputItem;
};

function agentTypeForSource(sourceType: string): AgentType {
  return sourceType === "worker_finder" ? "worker_finder" : "customer_finder";
}

async function markRunFailed(client: SupabaseClient, runId: string, sourceId: string, status: string, error: string) {
  await client
    .from("outreach_discovery_runs")
    .update({ status, error, finished_at: new Date().toISOString() })
    .eq("id", runId);
  await client.from("outreach_sources").update({ last_run_status: status }).eq("id", sourceId);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const webhookSecret = Deno.env.get("APIFY_WEBHOOK_SECRET") ?? "";
  const apifyToken = Deno.env.get("APIFY_TOKEN") ?? "";
  const url = new URL(req.url);
  const runRef = url.searchParams.get("run_ref") ?? "";
  const sig = url.searchParams.get("sig") ?? "";

  if (!runRef || !sig || !(await verifySignature(runRef, sig, webhookSecret))) {
    return jsonResponse({ error: "Invalid signature" }, 401);
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const body = (await req.json()) as {
      eventType?: string;
      resource?: { status?: string; defaultDatasetId?: string };
    };

    const { data: run, error: runError } = await serviceClient
      .from("outreach_discovery_runs")
      .select("*")
      .eq("id", runRef)
      .single();
    if (runError || !run) return jsonResponse({ error: "Run not found" }, 404);

    const { data: source, error: sourceError } = await serviceClient
      .from("outreach_sources")
      .select("*")
      .eq("id", run.source_id)
      .single();
    if (sourceError || !source) return jsonResponse({ error: "Source not found" }, 404);

    const eventType = body.eventType ?? "";
    if (eventType !== "ACTOR.RUN.SUCCEEDED") {
      const statusMap: Record<string, string> = {
        "ACTOR.RUN.FAILED": "failed",
        "ACTOR.RUN.ABORTED": "aborted",
        "ACTOR.RUN.TIMED_OUT": "timed_out",
      };
      const status = statusMap[eventType] ?? "failed";
      await markRunFailed(serviceClient, run.id, source.id, status, `Apify reported ${eventType || "non-success"}`);
      return jsonResponse({ success: true, status });
    }

    const datasetId = body.resource?.defaultDatasetId ?? run.apify_dataset_id;
    if (!datasetId) {
      await markRunFailed(serviceClient, run.id, source.id, "failed", "No dataset id on completion");
      return jsonResponse({ error: "No dataset id" }, 400);
    }

    const maxItems = source.max_items ?? 50;
    const mapping = (source.field_mapping ?? {}) as FieldMapping;
    const rawRecords = await getDatasetItems(datasetId, apifyToken, maxItems);

    let itemsDuplicate = 0;
    const staged: StagedItem[] = [];

    for (const record of rawRecords) {
      const mapped = mapItem(record, mapping);
      if (!mapped.raw_text.trim()) {
        // Empty/unmapped record — nothing to classify.
        continue;
      }
      const dedupKey = buildDedupKey(source.id, mapped);

      const [{ data: rawDup }, { data: leadDup }] = await Promise.all([
        serviceClient.from("outreach_raw_items").select("id").eq("dedup_key", dedupKey).limit(1).maybeSingle(),
        serviceClient.from("outreach_leads").select("id").eq("duplicate_check_key", dedupKey).limit(1).maybeSingle(),
      ]);

      if (rawDup || leadDup) {
        itemsDuplicate += 1;
        await serviceClient.from("outreach_raw_items").insert({
          run_id: run.id,
          source_id: source.id,
          external_id: mapped.external_id,
          raw_payload: record,
          raw_text: mapped.raw_text,
          source_url: mapped.source_url,
          dedup_key: dedupKey,
          status: "duplicate",
        });
        continue;
      }

      const { data: rawItem, error: rawError } = await serviceClient
        .from("outreach_raw_items")
        .insert({
          run_id: run.id,
          source_id: source.id,
          external_id: mapped.external_id,
          raw_payload: record,
          raw_text: mapped.raw_text,
          source_url: mapped.source_url,
          dedup_key: dedupKey,
          status: "new",
        })
        .select("id")
        .single();
      if (rawError) throw rawError;

      staged.push({
        rawItemId: rawItem.id,
        dedupKey,
        input: {
          raw_text: mapped.raw_text,
          source_url: mapped.source_url,
          profile_name: mapped.profile_name,
          business_name: mapped.business_name,
          location: mapped.location,
        },
      });
    }

    const agentType = agentTypeForSource(source.source_type);
    const defaultServiceType = source.default_service_type || source.service_type || "Local service";
    let leadsCreated = 0;
    let itemsSkipped = 0;

    for (let offset = 0; offset < staged.length; offset += CHUNK_SIZE) {
      const chunk = staged.slice(offset, offset + CHUNK_SIZE);
      const classified = await classifyItems(agentType, source.platform, defaultServiceType, chunk.map((s) => s.input));

      for (let i = 0; i < chunk.length; i += 1) {
        const lead = classified[i];
        const stagedItem = chunk[i];

        if (!lead || !lead.include) {
          itemsSkipped += 1;
          await serviceClient.from("outreach_raw_items").update({ status: "skipped" }).eq("id", stagedItem.rawItemId);
          continue;
        }

        const { data: insertedLead, error: leadError } = await serviceClient
          .from("outreach_leads")
          .insert({
            source_id: source.id,
            lead_type: lead.lead_type,
            source_platform: source.platform,
            source_url: stagedItem.input.source_url ?? null,
            profile_name: lead.profile_name,
            business_name: lead.business_name,
            location: lead.location,
            service_type: lead.service_type,
            urgency: lead.urgency,
            intent_strength: lead.intent_strength,
            source_confidence: lead.source_confidence,
            raw_text: stagedItem.input.raw_text,
            evidence_text: lead.evidence_text,
            public_contact_method: lead.public_contact_method,
            contact_detail: lead.contact_detail,
            contact_allowed: lead.contact_allowed,
            ai_score: lead.ai_score,
            ai_summary: lead.ai_summary,
            status: lead.contact_allowed === "no" ? "rejected" : "reviewed",
            approval_status: lead.contact_allowed === "no" ? "rejected" : "pending",
            do_not_contact_reason: lead.do_not_contact_reason,
            duplicate_check_key: stagedItem.dedupKey,
            metadata: { agent_type: agentType, discovery_run_id: run.id, source_id: source.id },
          })
          .select("id")
          .single();
        if (leadError) throw leadError;

        if (lead.contact_allowed !== "no") {
          const { error: messageError } = await serviceClient.from("outreach_messages").insert({
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
              discovery_run_id: run.id,
              model: Deno.env.get("OUTREACH_AI_MODEL") ?? "gpt-4o-mini",
              generated_at: new Date().toISOString(),
            },
          });
          if (messageError) throw messageError;
        }

        leadsCreated += 1;
        await serviceClient
          .from("outreach_raw_items")
          .update({ status: "lead_created", lead_id: insertedLead.id })
          .eq("id", stagedItem.rawItemId);
      }
    }

    await serviceClient
      .from("outreach_discovery_runs")
      .update({
        status: "ingested",
        items_scraped: rawRecords.length,
        items_new: staged.length,
        items_duplicate: itemsDuplicate,
        items_skipped: itemsSkipped,
        leads_created: leadsCreated,
        ingested_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    await serviceClient.from("outreach_sources").update({ last_run_status: "ingested" }).eq("id", source.id);

    return jsonResponse({
      success: true,
      items_scraped: rawRecords.length,
      items_new: staged.length,
      items_duplicate: itemsDuplicate,
      items_skipped: itemsSkipped,
      leads_created: leadsCreated,
    });
  } catch (error) {
    console.error("outreach-discovery-webhook error:", error);
    try {
      await markRunFailed(
        serviceClient,
        runRef,
        "",
        "failed",
        error instanceof Error ? error.message : "Unknown ingestion error",
      );
    } catch (_) {
      // best-effort
    }
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
