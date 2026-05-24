create table if not exists public.email_delivery_jobs (
  id uuid primary key default gen_random_uuid(),
  template_id text references public.email_templates(id) on delete set null,
  template_key text not null,
  title text not null,
  recipient_group text not null,
  subject text not null,
  preview_text text,
  body text not null,
  delivery_status text not null default 'queued' check (delivery_status in ('queued', 'processing', 'sent', 'failed')),
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  error_message text,
  triggered_by uuid references auth.users(id) on delete set null,
  triggered_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_email_delivery_jobs_status on public.email_delivery_jobs(delivery_status, triggered_at desc);

alter table public.email_delivery_jobs enable row level security;

drop policy if exists "Admins can read email delivery jobs" on public.email_delivery_jobs;
create policy "Admins can read email delivery jobs"
  on public.email_delivery_jobs for select
  using (public.is_admin());

drop policy if exists "Admins can manage email delivery jobs" on public.email_delivery_jobs;
create policy "Admins can manage email delivery jobs"
  on public.email_delivery_jobs for all
  using (public.is_admin())
  with check (public.is_admin());
