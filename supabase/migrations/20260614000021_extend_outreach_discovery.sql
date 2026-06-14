-- Outreach discovery engine: Apify-powered source scraping + scheduling.
-- Extends the outreach MVP with discovery sources, run tracking, and raw item staging.

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

create index if not exists idx_outreach_runs_source_created
  on public.outreach_discovery_runs(source_id, created_at desc);
create index if not exists idx_outreach_runs_apify
  on public.outreach_discovery_runs(apify_run_id) where apify_run_id is not null;
create index if not exists idx_outreach_sources_schedule
  on public.outreach_sources(schedule_enabled, next_run_at) where schedule_enabled;
create index if not exists idx_outreach_raw_items_dedup
  on public.outreach_raw_items(dedup_key) where dedup_key is not null;
create index if not exists idx_outreach_raw_items_source_external
  on public.outreach_raw_items(source_id, external_id);
create index if not exists idx_outreach_raw_items_run_status
  on public.outreach_raw_items(run_id, status);

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

-- Scheduled dispatch: pg_cron ticks every 15 min and pings the cron edge function,
-- which fans out to any sources whose next_run_at is due.
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- The project URL + dispatch secret are read from GUCs configured by ops.
-- If they are absent (e.g. fresh local db), scheduling is skipped with a notice;
-- re-run the cron.schedule() block after setting them. The cron function itself
-- re-validates the secret on every call.
do $$
declare
  base_url text := current_setting('app.settings.functions_base_url', true);
  dispatch_secret text := current_setting('app.settings.outreach_cron_secret', true);
begin
  if base_url is null or dispatch_secret is null then
    raise notice 'outreach cron not scheduled: set app.settings.functions_base_url and app.settings.outreach_cron_secret, then re-run cron.schedule(...)';
    return;
  end if;

  if exists (select 1 from cron.job where jobname = 'outreach-discovery-dispatch') then
    perform cron.unschedule('outreach-discovery-dispatch');
  end if;

  perform cron.schedule(
    'outreach-discovery-dispatch',
    '*/15 * * * *',
    format($cron$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', %L),
        body := '{}'::jsonb
      );
    $cron$, base_url || '/functions/v1/outreach-discovery-cron', dispatch_secret)
  );
end $$;

comment on table public.outreach_discovery_runs is 'One row per Apify discovery actor run for outreach sources.';
comment on table public.outreach_raw_items is 'Staged scraped items pending classification into outreach leads.';
