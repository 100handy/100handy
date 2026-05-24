alter table public.email_delivery_jobs
  add column if not exists audience_filters jsonb not null default '{}'::jsonb,
  add column if not exists scheduled_for timestamptz,
  add column if not exists test_recipient text;

alter table public.push_delivery_jobs
  add column if not exists audience_filters jsonb not null default '{}'::jsonb,
  add column if not exists scheduled_for timestamptz,
  add column if not exists test_recipient text;

create table if not exists public.notification_audit_events (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email', 'push', 'announcement')),
  action text not null,
  entity_type text not null,
  entity_id text,
  actor_id uuid references auth.users(id) on delete set null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_notification_audit_events_created_at
  on public.notification_audit_events(created_at desc);

create index if not exists idx_notification_audit_events_channel
  on public.notification_audit_events(channel, created_at desc);

alter table public.notification_audit_events enable row level security;

drop policy if exists "Admins can read notification audit events" on public.notification_audit_events;
create policy "Admins can read notification audit events"
  on public.notification_audit_events for select
  using (public.is_admin());

drop policy if exists "Admins can manage notification audit events" on public.notification_audit_events;
create policy "Admins can manage notification audit events"
  on public.notification_audit_events for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read device push tokens" on public.device_push_tokens;
create policy "Admins can read device push tokens"
  on public.device_push_tokens for select
  using (public.is_admin());
