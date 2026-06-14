# Outreach Discovery Engine (Apify-powered) — Design Spec

**Date:** 2026-06-14
**Status:** Approved
**Sub-project 1 of the Outreach Agents initiative** (Customer Finder + Worker Finder).

## Background

The 100Handy admin app already contains a working **human-in-the-loop outreach MVP**:

- Tables: `outreach_sources`, `outreach_leads`, `outreach_messages`, `outreach_follow_ups` (admin-only RLS).
- Edge functions: `run-outreach-agent` (classify a batch of **pasted** posts/profiles via OpenAI → create leads + draft messages) and `generate-outreach-draft` (regenerate one lead's draft).
- Admin UI `/outreach/leads`: lead queue + filters, lead detail, manual add, "AI finder" (paste text), approve/reject lead, approve message, mark-sent (manual), follow-ups. Guarded by `outreach.manage`, with audit logging.

This covers **Identify → Score → Generate draft → Approve → (manual) Send → Follow-up**. The missing piece is **"Search" / discovery**: today leads only enter by a human pasting text.

## Goal of this sub-project

Add the **discovery / ingestion** step. Admins register **discovery sources** (each = an Apify actor + input config + field mapping + cadence). Sources run **manually or on a schedule** → Apify scrapes → a **completion webhook** ingests the dataset → items are **staged and deduped** → the **existing AI classifier** scores them and creates `outreach_leads` (+ draft messages) in `approval_status='pending'` → everything flows into the **existing approval queue**.

### Decisions (locked)

- **Discovery mechanism:** Apify managed actors (REST API + completion webhooks).
- **Result flow:** async — trigger returns immediately; Apify webhook ingests on completion.
- **Scheduling:** manual "Run now" **and** scheduled runs via `pg_cron` + `pg_net`, using a **cadence enum** (`off | hourly | every_6h | every_12h | daily | weekly`), not raw cron expressions.
- **Presets:** Reddit (customers) wired first; engine is generic (any actor + config).
- **AI provider:** keep OpenAI `gpt-4o-mini` (existing functions, with no-key fallback).
- **Sending:** out of scope here (email auto-send is the next sub-project). Discovery never auto-contacts.

## Scope

**In scope**
- Source registry + editor (Reddit preset), active toggle, delete.
- Manual "Run now" per source.
- Scheduled runs (pg_cron dispatcher + cadence enum).
- Async Apify integration (trigger + completion webhook).
- Raw-item staging + cross-run de-duplication.
- Runs / monitoring view.
- Shared-code cleanup (DRY the duplicated classifier + admin auth across functions).
- `database.types.ts`, RLS, migration, config, secrets, tests.

**Out of scope (later sub-projects)**
- Email auto-send, reply tracking.
- Non-Reddit presets (added via generic config as needed).
- Full cron expressions.

## Data model

### Extend `outreach_sources`
Add columns:
- `apify_actor_id text` — actor to run (e.g. a Reddit scraper actor).
- `apify_input jsonb not null default '{}'` — input passed to the actor run.
- `field_mapping jsonb not null default '{}'` — maps actor output fields → lead fields (`raw_text`, `profile_name`, `business_name`, `source_url`, `location`, `external_id`).
- `default_service_type text`.
- `max_items integer not null default 50` — cost/volume cap per run.
- `schedule_cadence text not null default 'off'` check in (`off`,`hourly`,`every_6h`,`every_12h`,`daily`,`weekly`).
- `schedule_enabled boolean not null default false`.
- `next_run_at timestamptz`, `last_run_at timestamptz`, `last_run_status text`.

### New `outreach_discovery_runs`
One row per actor run.
- `id uuid pk`, `source_id uuid -> outreach_sources (on delete cascade)`.
- `apify_run_id text`, `apify_dataset_id text`.
- `status text` check in (`queued`,`running`,`succeeded`,`failed`,`ingested`,`aborted`,`timed_out`).
- `trigger text` check in (`manual`,`scheduled`).
- `triggered_by uuid -> auth.users (null for scheduled)`.
- Counts: `items_scraped`, `items_new`, `items_duplicate`, `leads_created`, `items_skipped` (int, default 0).
- `error text`, `metadata jsonb default '{}'`.
- `started_at`, `finished_at`, `ingested_at timestamptz`, plus `created_at`/`updated_at`.

### New `outreach_raw_items`
Staging for scraped items (auditability, dedup, retryable classification).
- `id uuid pk`, `run_id uuid -> outreach_discovery_runs (cascade)`, `source_id uuid -> outreach_sources (cascade)`.
- `external_id text` — platform item id (nullable).
- `raw_payload jsonb not null` — original scraped object.
- `raw_text text` — text fed to the classifier.
- `source_url text`.
- `dedup_key text`.
- `status text` check in (`new`,`classified`,`lead_created`,`duplicate`,`skipped`,`error`).
- `lead_id uuid -> outreach_leads (null until promoted)`.
- `created_at timestamptz`.
- Indexes: `dedup_key`, `(source_id, external_id)`, `(run_id, status)`.

All three tables: admin-only RLS mirroring existing outreach policies (`using/with check public.is_admin()`), `touch_updated_at` triggers where an `updated_at` exists. `database.types.ts` updated to match.

## Edge functions (Deno)

### `outreach-discovery-trigger` (JWT verified, admin only)
- Input `{ source_id, trigger?: 'manual' }`.
- Loads + validates source (active, has `apify_actor_id`).
- Starts the Apify actor run: `POST /v2/acts/{actorId}/runs?token=…` with `apify_input` merged with `maxItems`, registering an **ad-hoc completion webhook** to `outreach-discovery-webhook` carrying our `discovery_run` id + an HMAC signature using `APIFY_WEBHOOK_SECRET`.
- Inserts a `outreach_discovery_runs` row (`status='running'`, `apify_run_id`), updates `source.last_run_at`/`last_run_status`.
- Returns the run record. Writes an admin audit log.

### `outreach-discovery-webhook` (`verify_jwt=false`, secret-guarded)
- Verifies the HMAC signature / shared secret from the request.
- Resolves the `discovery_run` by id (or `apify_run_id`).
- On success: fetch dataset items `GET /v2/datasets/{datasetId}/items?token=…&limit=maxItems`.
- For each item: apply `field_mapping` → extract `raw_text`/`profile_name`/`source_url`/`location`/`external_id`; compute `dedup_key`; skip if a matching `dedup_key` already exists in `outreach_raw_items` or `outreach_leads.duplicate_check_key`; otherwise insert `outreach_raw_items` (`status='new'`).
- Run the shared classifier over new items in chunks of ≤20 → create `outreach_leads` (`approval_status='pending'`, `status='reviewed'`) + `outreach_messages` (`approval_status='pending'`, `delivery_status='not_sent'`), set `raw_item.lead_id` and `status='lead_created'`.
- Update run counts + `status='ingested'`, `ingested_at`. All via service role.
- Robustness: `max_items` capped (default 50) keeps OpenAI calls + inserts within edge-function time limits; classify in chunks.

### `outreach-discovery-cron` (`verify_jwt=false`, secret-guarded)
- Dispatcher invoked by `pg_cron` every ~15 min via `pg_net.http_post` with a secret header.
- Selects sources where `schedule_enabled` and `next_run_at <= now()`.
- For each, runs the shared trigger logic with `trigger='scheduled'`, then recomputes `next_run_at` from `schedule_cadence`.

## Shared-code cleanup (improve code we touch)
- `_shared/outreach-classify.ts` — extract `classifyItems` / `fallbackClassify` / helpers (currently duplicated in `run-outreach-agent` and `generate-outreach-draft`); both existing functions + the webhook reuse it.
- `_shared/outreach-auth.ts` — extract the duplicated `requireAdmin` (super_admin/ops_admin check).
- `_shared/apify.ts` — minimal Apify REST client (`startActorRun`, `getDatasetItems`), webhook payload types, and HMAC sign/verify helpers.

## Admin UI

New page **`/outreach/sources`** (`pages/outreach/sources.tsx`) — kept separate from `leads.tsx` (already ~855 lines). A small shared `OutreachNav` component (Leads · Sources · Runs) links the views; sidebar "Outreach" entry still points to `/outreach/leads`.

- **Sources list:** name, platform, cadence, active toggle, last-run status, leads created; actions Run now · Edit · Delete.
- **Source editor:** name, type (`customer`/`worker`/`mixed`), Apify actor id, input JSON, field mapping, default service, location, max items, cadence + enabled. **"Use Reddit preset"** prefills actor + input template + mapping.
- **Runs view** `/outreach/runs` (`pages/outreach/runs.tsx`): recent runs with status, counts, errors, and a link into the leads queue filtered to that run.
- API hooks in a **new** `lib/api/outreach-sources.ts` (`useOutreachSources`, `useCreateSource`, `useUpdateSource`, `useDeleteSource`, `useRunSourceNow`, `useDiscoveryRuns`) — same React-Query + `requireAdminPermission('outreach.manage')` + audit-log pattern as `outreach.ts`. New routes added to `App.tsx` and `admin-route-permissions.ts`.

## Config / secrets / scheduling
- Supabase secrets: `APIFY_TOKEN`, `APIFY_WEBHOOK_SECRET` (+ existing `OPENAI_API_KEY`, `OUTREACH_AI_MODEL`).
- `config.toml`: `verify_jwt=false` for `outreach-discovery-webhook` and `outreach-discovery-cron`; trigger keeps JWT.
- Migration enables `pg_cron` + `pg_net` and registers the dispatcher cron job; project URL + dispatcher secret read from Supabase Vault (documented fallback: hardcode via migration variables if Vault unavailable locally).

## Compliance guardrails (baked in)
- Discovery **never auto-contacts** — leads created `approval_status='pending'`; human approval gate unchanged.
- Classifier rules preserved: don't invent contact details, don't claim the person asked for 100Handy, drafts ≤70 words, set `include=false` / `contact_allowed='no'` for weak/irrelevant items (→ lead `rejected`).
- `max_items` cost caps; dedup prevents re-processing / re-contacting; every run + mutation audited.

## Testing
- Deno unit tests: `apify.ts` field-mapping + HMAC sign/verify; `outreach-classify` shape/fallback.
- Vitest (admin): cadence → `next_run_at` computation and `dedup_key` builder purity (follows existing `__tests__` patterns).

## Risks / notes
- Edge-function time limits: mitigated by `max_items` cap + chunked classification; if volumes grow, move ingestion to a queue (future).
- Apify cost: per-run caps + runs/cost surfaced in the Runs view.
- ToS: Apify operates the scraper but 100Handy is the data controller — the human-approval gate + per-source contact rules are the compliance backbone.
