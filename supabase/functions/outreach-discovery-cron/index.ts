import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/outreach-auth.ts";
import { signPayload, startActorRun } from "../_shared/apify.ts";
import { computeNextRunAt } from "../_shared/outreach-classify.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const cronSecret = Deno.env.get("OUTREACH_CRON_SECRET") ?? "";
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const apifyToken = Deno.env.get("APIFY_TOKEN") ?? "";
  const webhookSecret = Deno.env.get("APIFY_WEBHOOK_SECRET") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  if (!apifyToken || !webhookSecret) {
    return jsonResponse({ error: "Apify is not configured" }, 500);
  }

  const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  const webhookUrl = `${supabaseUrl}/functions/v1/outreach-discovery-webhook`;
  const nowIso = new Date().toISOString();

  try {
    const { data: sources, error } = await serviceClient
      .from("outreach_sources")
      .select("*")
      .eq("schedule_enabled", true)
      .eq("active", true)
      .not("apify_actor_id", "is", null)
      .or(`next_run_at.is.null,next_run_at.lte.${nowIso}`);

    if (error) throw error;

    let dispatched = 0;
    const errors: Array<{ source_id: string; error: string }> = [];

    for (const source of sources ?? []) {
      const nextRunAt = computeNextRunAt(source.schedule_cadence ?? "off", new Date());
      try {
        const { data: run, error: runError } = await serviceClient
          .from("outreach_discovery_runs")
          .insert({
            source_id: source.id,
            status: "running",
            trigger: "scheduled",
            started_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (runError) throw runError;

        const signature = await signPayload(run.id, webhookSecret);
        const { runId, datasetId } = await startActorRun(
          source.apify_actor_id,
          { ...(source.apify_input ?? {}), maxItems: source.max_items ?? 50 },
          apifyToken,
          webhookUrl,
          run.id,
          signature,
        );

        await serviceClient
          .from("outreach_discovery_runs")
          .update({ apify_run_id: runId, apify_dataset_id: datasetId })
          .eq("id", run.id);

        await serviceClient
          .from("outreach_sources")
          .update({ last_run_at: nowIso, last_run_status: "running", next_run_at: nextRunAt })
          .eq("id", source.id);

        dispatched += 1;
      } catch (sourceError) {
        const message = sourceError instanceof Error ? sourceError.message : "Failed to dispatch source";
        errors.push({ source_id: source.id, error: message });
        // Still advance next_run_at so a broken source doesn't retry every tick.
        await serviceClient
          .from("outreach_sources")
          .update({ last_run_status: "failed", next_run_at: nextRunAt })
          .eq("id", source.id);
      }
    }

    return jsonResponse({ success: true, dispatched, errors });
  } catch (error) {
    console.error("outreach-discovery-cron error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
