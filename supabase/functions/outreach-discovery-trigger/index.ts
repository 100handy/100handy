import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, requireOutreachAdmin } from "../_shared/outreach-auth.ts";
import { signPayload, startActorRun } from "../_shared/apify.ts";

type TriggerPayload = {
  source_id?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const admin = await requireOutreachAdmin(req);
    if ("error" in admin) return admin.error;

    const body = (await req.json()) as TriggerPayload;
    const sourceId = (body.source_id ?? "").trim();
    if (!sourceId) return jsonResponse({ error: "source_id is required" }, 400);

    const apifyToken = Deno.env.get("APIFY_TOKEN");
    const webhookSecret = Deno.env.get("APIFY_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    if (!apifyToken || !webhookSecret) {
      return jsonResponse({ error: "Apify is not configured (APIFY_TOKEN / APIFY_WEBHOOK_SECRET)" }, 500);
    }

    const { data: source, error: sourceError } = await admin.serviceClient
      .from("outreach_sources")
      .select("*")
      .eq("id", sourceId)
      .single();

    if (sourceError || !source) return jsonResponse({ error: "Source not found" }, 404);
    if (!source.active) return jsonResponse({ error: "Source is inactive" }, 400);
    if (!source.apify_actor_id) return jsonResponse({ error: "Source has no Apify actor configured" }, 400);

    // Create the run row first so its id is the webhook run_ref.
    const { data: run, error: runError } = await admin.serviceClient
      .from("outreach_discovery_runs")
      .insert({
        source_id: source.id,
        status: "running",
        trigger: "manual",
        triggered_by: admin.user.id,
        started_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (runError) throw runError;

    const webhookUrl = `${supabaseUrl}/functions/v1/outreach-discovery-webhook`;
    const signature = await signPayload(run.id, webhookSecret);
    const input = {
      ...(source.apify_input ?? {}),
      maxItems: source.max_items ?? 50,
    };

    try {
      const { runId, datasetId } = await startActorRun(
        source.apify_actor_id,
        input,
        apifyToken,
        webhookUrl,
        run.id,
        signature,
      );

      await admin.serviceClient
        .from("outreach_discovery_runs")
        .update({ apify_run_id: runId, apify_dataset_id: datasetId })
        .eq("id", run.id);

      await admin.serviceClient
        .from("outreach_sources")
        .update({ last_run_at: new Date().toISOString(), last_run_status: "running" })
        .eq("id", source.id);

      return jsonResponse({ success: true, run: { ...run, apify_run_id: runId, apify_dataset_id: datasetId } });
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : "Failed to start Apify run";
      await admin.serviceClient
        .from("outreach_discovery_runs")
        .update({ status: "failed", error: message, finished_at: new Date().toISOString() })
        .eq("id", run.id);
      await admin.serviceClient
        .from("outreach_sources")
        .update({ last_run_status: "failed" })
        .eq("id", source.id);
      return jsonResponse({ error: message }, 502);
    }
  } catch (error) {
    console.error("outreach-discovery-trigger error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
