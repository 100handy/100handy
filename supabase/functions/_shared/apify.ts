// Minimal Apify REST client + field-mapping/dedup/signature helpers for the
// outreach discovery engine. Apify "actors" scrape platforms; we trigger a run
// (registering a completion webhook) and ingest the dataset when it finishes.

const APIFY_BASE = "https://api.apify.com/v2";

export type FieldMapping = Partial<
  Record<"raw_text" | "profile_name" | "business_name" | "source_url" | "location" | "external_id", string>
>;

export type MappedItem = {
  raw_text: string;
  profile_name: string | null;
  business_name: string | null;
  source_url: string | null;
  location: string | null;
  external_id: string | null;
};

/** Reads a dotted path (e.g. "author.name") from a scraped object, coercing to string. */
function pick(obj: Record<string, unknown>, path: string | undefined): string | null {
  if (!path) return null;
  const val = path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      obj,
    );
  if (val == null) return null;
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

/** Maps a raw Apify dataset item onto our lead fields using the source's field_mapping. */
export function mapItem(payload: Record<string, unknown>, mapping: FieldMapping): MappedItem {
  return {
    raw_text: pick(payload, mapping.raw_text) ?? "",
    profile_name: pick(payload, mapping.profile_name),
    business_name: pick(payload, mapping.business_name),
    source_url: pick(payload, mapping.source_url),
    location: pick(payload, mapping.location),
    external_id: pick(payload, mapping.external_id),
  };
}

/** Stable, lowercased dedup key scoped to a source. */
export function buildDedupKey(
  sourceId: string,
  item: { external_id: string | null; source_url: string | null; raw_text: string },
): string {
  const tail = (item.external_id || item.source_url || item.raw_text.slice(0, 80)).trim().toLowerCase();
  return `${sourceId}:${tail}`;
}

export type StartRunResult = { runId: string; datasetId: string };

/**
 * Starts an Apify actor run with an ad-hoc completion webhook pointing back at us.
 * The webhook carries run_ref (our discovery_runs id) + an HMAC signature.
 */
export async function startActorRun(
  actorId: string,
  input: Record<string, unknown>,
  token: string,
  webhookUrl: string,
  runRef: string,
  signature: string,
): Promise<StartRunResult> {
  const webhooks = btoa(
    JSON.stringify([
      {
        eventTypes: ["ACTOR.RUN.SUCCEEDED", "ACTOR.RUN.FAILED", "ACTOR.RUN.TIMED_OUT", "ACTOR.RUN.ABORTED"],
        requestUrl: `${webhookUrl}?run_ref=${encodeURIComponent(runRef)}&sig=${encodeURIComponent(signature)}`,
      },
    ]),
  );

  const url = `${APIFY_BASE}/acts/${encodeURIComponent(actorId)}/runs?token=${token}&webhooks=${webhooks}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify start failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const runId = json?.data?.id as string | undefined;
  const datasetId = json?.data?.defaultDatasetId as string | undefined;
  if (!runId || !datasetId) throw new Error("Apify start returned no run id / dataset id");
  return { runId, datasetId };
}

/** Fetches up to `limit` cleaned items from an Apify dataset. */
export async function getDatasetItems(
  datasetId: string,
  token: string,
  limit: number,
): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&clean=true&limit=${limit}`);
  if (!res.ok) throw new Error(`Apify dataset fetch failed: ${res.status}`);
  return (await res.json()) as Record<string, unknown>[];
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function signPayload(runRef: string, secret: string): Promise<string> {
  return hmac(runRef, secret);
}

export async function verifySignature(runRef: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmac(runRef, secret);
  if (expected.length !== signature.length) return false;
  // Constant-time-ish comparison.
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
