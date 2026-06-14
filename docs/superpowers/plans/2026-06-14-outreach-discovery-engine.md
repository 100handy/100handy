# Outreach Discovery Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Apify-powered discovery layer so admins register lead sources that scrape platforms (Reddit first) and feed the existing AI classifier → approval queue.

**Architecture:** Extend `outreach_sources` + add `outreach_discovery_runs` and `outreach_raw_items` tables. Three Deno edge functions (trigger / completion-webhook / cron dispatcher) share new `_shared` modules (Apify client, classifier, admin auth). `pg_cron` + `pg_net` drive scheduled runs via a cadence enum. New admin UI pages `/outreach/sources` and `/outreach/runs`.

**Tech Stack:** Supabase (Postgres + Deno edge functions + pg_cron/pg_net), OpenAI `gpt-4o-mini`, Apify REST API, React + Vite + React Query + Tailwind (admin-web).

---

## File structure

**Create**
- `supabase/migrations/20260614000021_extend_outreach_discovery.sql` — schema + RLS + cron.
- `supabase/functions/_shared/outreach-auth.ts` — `requireOutreachAdmin`.
- `supabase/functions/_shared/apify.ts` — Apify client + HMAC sign/verify + field mapping.
- `supabase/functions/_shared/outreach-classify.ts` — extracted classifier + fallback + cadence helper.
- `supabase/functions/_shared/outreach-classify.test.ts`, `apify.test.ts` — Deno tests.
- `supabase/functions/outreach-discovery-trigger/index.ts`
- `supabase/functions/outreach-discovery-webhook/index.ts`
- `supabase/functions/outreach-discovery-cron/index.ts`
- `apps/admin-web/src/lib/api/outreach-sources.ts` — sources/runs hooks.
- `apps/admin-web/src/lib/api/__tests__/outreach-discovery.test.ts` — cadence + dedup-key tests.
- `apps/admin-web/src/components/outreach/OutreachNav.tsx`
- `apps/admin-web/src/pages/outreach/sources.tsx`
- `apps/admin-web/src/pages/outreach/runs.tsx`

**Modify**
- `supabase/functions/run-outreach-agent/index.ts` — import shared classifier/auth.
- `supabase/functions/generate-outreach-draft/index.ts` — import shared auth.
- `supabase/config.toml` — `verify_jwt=false` for webhook + cron.
- `apps/admin-web/src/lib/database.types.ts` — new columns/tables.
- `apps/admin-web/src/App.tsx` — routes.
- `apps/admin-web/src/lib/admin-route-permissions.ts` — route entries.
- `apps/admin-web/src/pages/outreach/leads.tsx` — mount `OutreachNav` + read `?run=` filter.

---

## Task 1: Database migration

**Files:** Create `supabase/migrations/20260614000021_extend_outreach_discovery.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Outreach discovery engine: Apify-powered source scraping + scheduling.

alter table public.outreach_sources
  add column if not exists apify_actor_id text,
  add column if not exists apify_input jsonb not null default '{}'::jsonb,
  add column if not exists field_mapping jsonb not null default '{}'::jsonb,
  add column if not exists default_service_type text,
  add column if not exists max_items integer not null default 50 check (max_items between 1 and 500),
  add column if not exists schedule_cadence text not null default 'off'
    check (schedule_cadence in ('off','hourly','every_6h','every_12h','daily','weekly')),
  add column if not exists schedule_enabled boolean not null default false,
  add column if not exists next_run_at timestamptz,
  add column if not exists last_run_at timestamptz,
  add column if not exists last_run_status text;

create table if not exists public.outreach_discovery_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.outreach_sources(id) on delete cascade,
  apify_run_id text,
  apify_dataset_id text,
  status text not null default 'queued'
    check (status in ('queued','running','succeeded','failed','ingested','aborted','timed_out')),
  trigger text not null default 'manual' check (trigger in ('manual','scheduled')),
  triggered_by uuid references auth.users(id) on delete set null,
  items_scraped integer not null default 0,
  items_new integer not null default 0,
  items_duplicate integer not null default 0,
  items_skipped integer not null default 0,
  leads_created integer not null default 0,
  error text,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  ingested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_raw_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.outreach_discovery_runs(id) on delete cascade,
  source_id uuid not null references public.outreach_sources(id) on delete cascade,
  external_id text,
  raw_payload jsonb not null default '{}'::jsonb,
  raw_text text,
  source_url text,
  dedup_key text,
  status text not null default 'new'
    check (status in ('new','classified','lead_created','duplicate','skipped','error')),
  lead_id uuid references public.outreach_leads(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_outreach_runs_source_created on public.outreach_discovery_runs(source_id, created_at desc);
create index if not exists idx_outreach_runs_apify on public.outreach_discovery_runs(apify_run_id) where apify_run_id is not null;
create index if not exists idx_outreach_sources_schedule on public.outreach_sources(schedule_enabled, next_run_at) where schedule_enabled;
create index if not exists idx_outreach_raw_items_dedup on public.outreach_raw_items(dedup_key) where dedup_key is not null;
create index if not exists idx_outreach_raw_items_source_external on public.outreach_raw_items(source_id, external_id);
create index if not exists idx_outreach_raw_items_run_status on public.outreach_raw_items(run_id, status);

drop trigger if exists outreach_discovery_runs_updated_at on public.outreach_discovery_runs;
create trigger outreach_discovery_runs_updated_at
  before update on public.outreach_discovery_runs
  for each row execute function public.touch_updated_at();

alter table public.outreach_discovery_runs enable row level security;
alter table public.outreach_raw_items enable row level security;

drop policy if exists "Admins can manage outreach discovery runs" on public.outreach_discovery_runs;
create policy "Admins can manage outreach discovery runs"
  on public.outreach_discovery_runs for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage outreach raw items" on public.outreach_raw_items;
create policy "Admins can manage outreach raw items"
  on public.outreach_raw_items for all
  using (public.is_admin()) with check (public.is_admin());

-- Scheduled dispatch: pg_cron ticks every 15 min and pings the cron edge function.
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Store project URL + dispatch secret as GUCs (set by ops; safe no-op if absent).
-- The cron function itself re-validates the secret.
do $$
declare
  base_url text := current_setting('app.settings.functions_base_url', true);
  dispatch_secret text := current_setting('app.settings.outreach_cron_secret', true);
begin
  if base_url is null or dispatch_secret is null then
    raise notice 'outreach cron not scheduled: set app.settings.functions_base_url and app.settings.outreach_cron_secret then re-run select cron.schedule(...)';
    return;
  end if;

  perform cron.unschedule('outreach-discovery-dispatch') where exists (
    select 1 from cron.job where jobname = 'outreach-discovery-dispatch'
  );

  perform cron.schedule(
    'outreach-discovery-dispatch',
    '*/15 * * * *',
    format($cron$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object('Content-Type','application/json','x-cron-secret', %L),
        body := '{}'::jsonb
      );
    $cron$, base_url || '/functions/v1/outreach-discovery-cron', dispatch_secret)
  );
end $$;

comment on table public.outreach_discovery_runs is 'One row per Apify discovery actor run for outreach sources.';
comment on table public.outreach_raw_items is 'Staged scraped items pending classification into outreach leads.';
```

- [ ] **Step 2: Verify SQL parses** — Run: `pnpm supabase:reset` (local) or apply migration; expect no errors. If local Supabase unavailable, verify by lint: `grep -c "create table" supabase/migrations/20260614000021_extend_outreach_discovery.sql` → expect `2`.

- [ ] **Step 3: Commit** — `git add supabase/migrations && git commit -m "Add outreach discovery schema + cron scheduling"`

---

## Task 2: Shared classifier + cadence helper (TDD)

**Files:** Create `supabase/functions/_shared/outreach-classify.ts` + `outreach-classify.test.ts`

- [ ] **Step 1: Write failing test** in `outreach-classify.test.ts`

```ts
import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { computeNextRunAt, fallbackClassify } from "./outreach-classify.ts";

Deno.test("computeNextRunAt off returns null", () => {
  assertEquals(computeNextRunAt("off", new Date("2026-06-14T00:00:00Z")), null);
});

Deno.test("computeNextRunAt every_6h adds 6 hours", () => {
  const next = computeNextRunAt("every_6h", new Date("2026-06-14T00:00:00Z"));
  assertEquals(next, "2026-06-14T06:00:00.000Z");
});

Deno.test("fallbackClassify worker builds worker draft", () => {
  const lead = fallbackClassify({ raw_text: "Handyman in Warrington", profile_name: "John" }, "worker_finder", "Handyman");
  assertEquals(lead.lead_type, "worker");
  assertEquals(lead.draft_text.includes("John"), true);
});
```

- [ ] **Step 2: Run, expect FAIL** — `deno test supabase/functions/_shared/outreach-classify.test.ts` → module not found.

- [ ] **Step 3: Implement** `outreach-classify.ts` — move `ClassifiedLead`, `InputItem`, `safeChoice`, `clampScore`, `fallbackClassify`, `classifyItems` out of `run-outreach-agent/index.ts` verbatim (export them), and add:

```ts
export type Cadence = "off" | "hourly" | "every_6h" | "every_12h" | "daily" | "weekly";

const CADENCE_MINUTES: Record<Cadence, number | null> = {
  off: null, hourly: 60, every_6h: 360, every_12h: 720, daily: 1440, weekly: 10080,
};

export function computeNextRunAt(cadence: string, from: Date): string | null {
  const minutes = CADENCE_MINUTES[cadence as Cadence] ?? null;
  if (minutes === null) return null;
  return new Date(from.getTime() + minutes * 60_000).toISOString();
}
```

- [ ] **Step 4: Run, expect PASS** — `deno test supabase/functions/_shared/outreach-classify.test.ts`

- [ ] **Step 5: Refactor `run-outreach-agent/index.ts`** to import `classifyItems`, `fallbackClassify`, `safeChoice`, `clampScore`, types from `../_shared/outreach-classify.ts`; delete the now-duplicated local copies. Keep behavior identical.

- [ ] **Step 6: Commit** — `git add supabase/functions && git commit -m "Extract shared outreach classifier + cadence helper"`

---

## Task 3: Shared Apify client + field mapping (TDD)

**Files:** Create `supabase/functions/_shared/apify.ts` + `apify.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { mapItem, buildDedupKey, signPayload, verifySignature } from "./apify.ts";

Deno.test("mapItem applies field mapping", () => {
  const mapping = { raw_text: "body", profile_name: "author", source_url: "url", external_id: "id" };
  const out = mapItem({ body: "need a cleaner", author: "sarah", url: "http://x/1", id: "1" }, mapping);
  assertEquals(out.raw_text, "need a cleaner");
  assertEquals(out.profile_name, "sarah");
  assertEquals(out.external_id, "1");
});

Deno.test("buildDedupKey is stable + lowercased", () => {
  assertEquals(
    buildDedupKey("src1", { external_id: "ABC", source_url: null, raw_text: "Hi" }),
    "src1:abc",
  );
});

Deno.test("verifySignature accepts a valid signature", async () => {
  const sig = await signPayload("run-123", "secret");
  assertEquals(await verifySignature("run-123", sig, "secret"), true);
  assertEquals(await verifySignature("run-123", "bad", "secret"), false);
});
```

- [ ] **Step 2: Run, expect FAIL** — `deno test supabase/functions/_shared/apify.test.ts`

- [ ] **Step 3: Implement `apify.ts`**

```ts
const APIFY_BASE = "https://api.apify.com/v2";

export type FieldMapping = Partial<Record<
  "raw_text" | "profile_name" | "business_name" | "source_url" | "location" | "external_id",
  string
>>;

function pick(obj: Record<string, unknown>, path: string | undefined): string | null {
  if (!path) return null;
  const val = path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
  return val == null ? null : String(val);
}

export function mapItem(payload: Record<string, unknown>, mapping: FieldMapping) {
  return {
    raw_text: pick(payload, mapping.raw_text) ?? "",
    profile_name: pick(payload, mapping.profile_name),
    business_name: pick(payload, mapping.business_name),
    source_url: pick(payload, mapping.source_url),
    location: pick(payload, mapping.location),
    external_id: pick(payload, mapping.external_id),
  };
}

export function buildDedupKey(sourceId: string, item: { external_id: string | null; source_url: string | null; raw_text: string }) {
  const tail = (item.external_id || item.source_url || item.raw_text.slice(0, 80)).trim().toLowerCase();
  return `${sourceId}:${tail}`;
}

export async function startActorRun(actorId: string, input: Record<string, unknown>, token: string, webhookUrl: string, runRef: string, signature: string) {
  const webhooks = btoa(JSON.stringify([{
    eventTypes: ["ACTOR.RUN.SUCCEEDED", "ACTOR.RUN.FAILED", "ACTOR.RUN.TIMED_OUT", "ACTOR.RUN.ABORTED"],
    requestUrl: `${webhookUrl}?run_ref=${encodeURIComponent(runRef)}&sig=${encodeURIComponent(signature)}`,
  }]));
  const res = await fetch(`${APIFY_BASE}/acts/${encodeURIComponent(actorId)}/runs?token=${token}&webhooks=${webhooks}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify start failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return { runId: json.data?.id as string, datasetId: json.data?.defaultDatasetId as string };
}

export async function getDatasetItems(datasetId: string, token: string, limit: number) {
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&clean=true&limit=${limit}`);
  if (!res.ok) throw new Error(`Apify dataset fetch failed: ${res.status}`);
  return (await res.json()) as Record<string, unknown>[];
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const signPayload = (runRef: string, secret: string) => hmac(runRef, secret);
export async function verifySignature(runRef: string, signature: string, secret: string): Promise<boolean> {
  return (await hmac(runRef, secret)) === signature;
}
```

- [ ] **Step 4: Run, expect PASS** — `deno test supabase/functions/_shared/apify.test.ts`

- [ ] **Step 5: Commit** — `git add supabase/functions && git commit -m "Add shared Apify client + dedup/signature helpers"`

---

## Task 4: Shared admin auth helper

**Files:** Create `supabase/functions/_shared/outreach-auth.ts`; modify both existing outreach functions.

- [ ] **Step 1: Implement** `outreach-auth.ts` — move the `requireAdmin` body (super_admin/ops_admin check) from `run-outreach-agent/index.ts`, export as `requireOutreachAdmin(req)`. Returns `{ user, serviceClient } | { error }`.
- [ ] **Step 2: Update** `run-outreach-agent/index.ts` and `generate-outreach-draft/index.ts` to `import { requireOutreachAdmin } from "../_shared/outreach-auth.ts"` and delete local copies.
- [ ] **Step 3: Type-check** — `deno check supabase/functions/run-outreach-agent/index.ts supabase/functions/generate-outreach-draft/index.ts`
- [ ] **Step 4: Commit** — `git commit -am "Extract shared outreach admin auth"`

---

## Task 5: `outreach-discovery-trigger` function

**Files:** Create `supabase/functions/outreach-discovery-trigger/index.ts`

- [ ] **Step 1: Implement** — verify admin via `requireOutreachAdmin`; load source; require `active` + `apify_actor_id`; `signPayload(runRef, APIFY_WEBHOOK_SECRET)`; insert a `outreach_discovery_runs` row (`status='running'`, `trigger`, `triggered_by`) to get `runRef=id`; call `startActorRun(actor, {...apify_input, maxItems}, APIFY_TOKEN, webhookUrl, runRef, sig)`; update run with `apify_run_id`/`apify_dataset_id`; set `source.last_run_at=now`, `last_run_status='running'`. Webhook URL = `${SUPABASE_URL}/functions/v1/outreach-discovery-webhook`. Return run row. Handle `OPTIONS`/method/errors via `jsonResponse`.
- [ ] **Step 2: Type-check** — `deno check supabase/functions/outreach-discovery-trigger/index.ts`
- [ ] **Step 3: Commit** — `git add supabase/functions/outreach-discovery-trigger && git commit -m "Add outreach discovery trigger function"`

---

## Task 6: `outreach-discovery-webhook` function

**Files:** Create `supabase/functions/outreach-discovery-webhook/index.ts`

- [ ] **Step 1: Implement**
  - `verify_jwt=false`; read `run_ref` + `sig` from query; `verifySignature(run_ref, sig, APIFY_WEBHOOK_SECRET)` else 401.
  - Service-role client (no user). Load the `discovery_run` + its `source`.
  - Parse Apify webhook body for `eventType` + `resource.defaultDatasetId`/status. On FAILED/ABORTED/TIMED_OUT → update run status + `error`, set `source.last_run_status` accordingly, return 200.
  - On SUCCEEDED → `getDatasetItems(datasetId, APIFY_TOKEN, source.max_items)`; for each: `mapItem` + `buildDedupKey`; skip when an `outreach_raw_items.dedup_key` or `outreach_leads.duplicate_check_key` already matches (count duplicates); insert `outreach_raw_items` (`status='new'`).
  - Map `source.source_type` → agent type (`worker_finder` if `worker_finder` else `customer_finder`); run `classifyItems` over new items' `raw_text` in chunks of 20; for `include` items insert `outreach_leads` (pending) + `outreach_messages` (pending) exactly as `run-outreach-agent` does, set `raw_item.lead_id` + `status='lead_created'`; non-include → `status='skipped'`.
  - Update run counts (`items_scraped/items_new/items_duplicate/items_skipped/leads_created`), `status='ingested'`, `ingested_at`, `finished_at`; set `source.last_run_status='ingested'`.
- [ ] **Step 2: Type-check** — `deno check supabase/functions/outreach-discovery-webhook/index.ts`
- [ ] **Step 3: Commit** — `git add supabase/functions/outreach-discovery-webhook && git commit -m "Add outreach discovery webhook ingestion"`

---

## Task 7: `outreach-discovery-cron` dispatcher

**Files:** Create `supabase/functions/outreach-discovery-cron/index.ts`

- [ ] **Step 1: Implement** — `verify_jwt=false`; require header `x-cron-secret === OUTREACH_CRON_SECRET` else 401. Service-role client. Select `outreach_sources` where `schedule_enabled` and (`next_run_at is null or next_run_at <= now()`) and `active` and `apify_actor_id is not null`. For each: insert a `discovery_runs` row (`trigger='scheduled'`), `startActorRun(...)`, update run + `source.next_run_at = computeNextRunAt(cadence, now)`, `last_run_at=now`. Return `{ dispatched: n }`. Wrap each source in try/catch so one failure doesn't abort the batch (record `error`, `status='failed'`).
- [ ] **Step 2: Type-check** — `deno check supabase/functions/outreach-discovery-cron/index.ts`
- [ ] **Step 3: Commit** — `git add supabase/functions/outreach-discovery-cron && git commit -m "Add outreach discovery cron dispatcher"`

---

## Task 8: config.toml

**Files:** Modify `supabase/config.toml`

- [ ] **Step 1: Add**
```toml
[functions.outreach-discovery-webhook]
verify_jwt = false

[functions.outreach-discovery-cron]
verify_jwt = false
```
- [ ] **Step 2: Commit** — `git commit -am "Disable JWT for outreach discovery webhook + cron"`

---

## Task 9: database.types.ts

**Files:** Modify `apps/admin-web/src/lib/database.types.ts`

- [ ] **Step 1:** Add the new columns to `outreach_sources` Row/Insert/Update (`apify_actor_id: string|null`, `apify_input: Json`, `field_mapping: Json`, `default_service_type: string|null`, `max_items: number`, `schedule_cadence: 'off'|'hourly'|'every_6h'|'every_12h'|'daily'|'weekly'`, `schedule_enabled: boolean`, `next_run_at/last_run_at: string|null`, `last_run_status: string|null`).
- [ ] **Step 2:** Add `outreach_discovery_runs` and `outreach_raw_items` table types mirroring the migration (Row/Insert/Update), matching the existing outreach table style.
- [ ] **Step 3: Type-check** — `pnpm check-types --filter=admin-web` → expect pass.
- [ ] **Step 4: Commit** — `git commit -am "Add discovery tables to admin database types"`

---

## Task 10: API hooks (TDD for pure helpers)

**Files:** Create `apps/admin-web/src/lib/api/outreach-sources.ts` + `__tests__/outreach-discovery.test.ts`

- [ ] **Step 1: Failing test** for `nextRunPreview(cadence)` and `buildSourceKey(name)` pure helpers exported from `outreach-sources.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { buildSourceKey, cadenceLabel } from '@/lib/api/outreach-sources'
describe('outreach-sources helpers', () => {
  it('slugifies source key', () => expect(buildSourceKey('Reddit UK Cleaners')).toBe('reddit-uk-cleaners'))
  it('labels cadence', () => expect(cadenceLabel('every_6h')).toBe('Every 6 hours'))
})
```
- [ ] **Step 2: Run, expect FAIL** — `pnpm --filter=admin-web test outreach-discovery`
- [ ] **Step 3: Implement** hooks + helpers: `useOutreachSources`, `useCreateOutreachSource`, `useUpdateOutreachSource`, `useDeleteOutreachSource`, `useRunSourceNow` (invokes `outreach-discovery-trigger`), `useDiscoveryRuns(sourceId?)`; all gated by `requireAdminPermission('outreach.manage')` + `createAdminAuditLog` mirroring `outreach.ts`. Export `buildSourceKey`, `cadenceLabel`, `REDDIT_PRESET` (actor id + input + mapping).
- [ ] **Step 4: Run, expect PASS** — `pnpm --filter=admin-web test outreach-discovery`
- [ ] **Step 5: Commit** — `git commit -am "Add outreach sources/runs API hooks"`

---

## Task 11: Admin UI — nav + pages

**Files:** Create `components/outreach/OutreachNav.tsx`, `pages/outreach/sources.tsx`, `pages/outreach/runs.tsx`; modify `App.tsx`, `admin-route-permissions.ts`, `pages/outreach/leads.tsx`.

- [ ] **Step 1:** `OutreachNav` — pill links Leads (`/outreach/leads`) · Sources (`/outreach/sources`) · Runs (`/outreach/runs`), active state from `useLocation`.
- [ ] **Step 2:** `sources.tsx` — list (name/platform/cadence/active/last-run/leads) with Run now·Edit·Delete; editor form with **Use Reddit preset** button (prefills from `REDDIT_PRESET`); reuse `AdminLoadingState`/`AdminErrorState`/`AdminEmptyState`/`Header`. Mount `OutreachNav`.
- [ ] **Step 3:** `runs.tsx` — recent runs table (status/counts/error/started_at) + link `→ /outreach/leads?run=<id>`. Mount `OutreachNav`.
- [ ] **Step 4:** `App.tsx` — `lazy` import + routes `/outreach/sources`, `/outreach/runs` under `ProtectedRoute permissions={['outreach.manage']}`.
- [ ] **Step 5:** `admin-route-permissions.ts` — add `outreachSources` + `outreachRuns` entries (section `outreach`).
- [ ] **Step 6:** `leads.tsx` — render `<OutreachNav />` at top; read `?run=` query → if present, filter the displayed leads by `metadata.run_id`/raw-item join (pass through `useOutreachLeads`). (Minimal: show a banner "Filtered to run X" + filter client-side on `metadata`.)
- [ ] **Step 7: Type-check + build** — `pnpm check-types --filter=admin-web` then `pnpm build --filter=admin-web` → expect pass.
- [ ] **Step 8: Commit** — `git commit -am "Add outreach sources + runs admin UI"`

---

## Task 12: Docs / env

**Files:** Modify root `.env`/README note or `supabase/.env.example` if present.

- [ ] **Step 1:** Document required secrets: `APIFY_TOKEN`, `APIFY_WEBHOOK_SECRET`, `OUTREACH_CRON_SECRET` (+ existing `OPENAI_API_KEY`, `OUTREACH_AI_MODEL`); and the two GUCs `app.settings.functions_base_url`, `app.settings.outreach_cron_secret`.
- [ ] **Step 2: Commit** — `git commit -am "Document outreach discovery env vars"`

---

## Self-review

**Spec coverage:** sources registry/editor → T10/T11; manual Run now → T5/T10/T11; scheduled → T1(cron)/T7; async trigger+webhook → T5/T6; staging+dedup → T1/T6; runs view → T11; shared cleanup → T2/T3/T4; types/RLS/config/secrets → T1/T8/T9/T12; tests → T2/T3/T10; compliance (pending-only leads) → T6. All covered.

**Placeholder scan:** none — code shown for non-obvious files; UI tasks reference exact components/patterns that already exist in `leads.tsx`.

**Type consistency:** `computeNextRunAt`, `mapItem`, `buildDedupKey`, `signPayload`/`verifySignature`, `requireOutreachAdmin`, `classifyItems` names are consistent across T2–T7. Cadence enum identical in migration (T1), helper (T2), and types (T9).
