create table if not exists public.push_notification_campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null unique,
  title text not null,
  campaign_kind text not null default 'template' check (campaign_kind in ('template', 'campaign_draft')),
  recipient_group text not null,
  message_title text not null,
  message_body text not null,
  route text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.push_delivery_jobs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.push_notification_campaigns(id) on delete set null,
  campaign_key text not null,
  title text not null,
  recipient_group text not null,
  message_title text not null,
  message_body text not null,
  route text,
  delivery_status text not null default 'queued' check (delivery_status in ('queued', 'processing', 'sent', 'failed')),
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  error_message text,
  triggered_by uuid references auth.users(id) on delete set null,
  triggered_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_push_notification_campaigns_kind
  on public.push_notification_campaigns(campaign_kind, updated_at desc);

create index if not exists idx_push_delivery_jobs_status
  on public.push_delivery_jobs(delivery_status, triggered_at desc);

alter table public.push_notification_campaigns enable row level security;
alter table public.push_delivery_jobs enable row level security;

drop policy if exists "Admins can read push notification campaigns" on public.push_notification_campaigns;
create policy "Admins can read push notification campaigns"
  on public.push_notification_campaigns for select
  using (public.is_admin());

drop policy if exists "Admins can manage push notification campaigns" on public.push_notification_campaigns;
create policy "Admins can manage push notification campaigns"
  on public.push_notification_campaigns for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read push delivery jobs" on public.push_delivery_jobs;
create policy "Admins can read push delivery jobs"
  on public.push_delivery_jobs for select
  using (public.is_admin());

drop policy if exists "Admins can manage push delivery jobs" on public.push_delivery_jobs;
create policy "Admins can manage push delivery jobs"
  on public.push_delivery_jobs for all
  using (public.is_admin())
  with check (public.is_admin());
