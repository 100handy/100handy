create table if not exists public.admin_audit_logs (
  id text primary key default ('audit_' || replace(gen_random_uuid()::text, '-', '')),
  actor_id uuid not null references auth.users(id) on delete cascade,
  actor_admin_role text,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_logs_created_at
  on public.admin_audit_logs(created_at desc);

create index if not exists idx_admin_audit_logs_actor_id
  on public.admin_audit_logs(actor_id, created_at desc);

create index if not exists idx_admin_audit_logs_entity
  on public.admin_audit_logs(entity_type, entity_id, created_at desc);

alter table public.admin_audit_logs enable row level security;

drop policy if exists "Admins can read admin audit logs" on public.admin_audit_logs;
create policy "Admins can read admin audit logs"
  on public.admin_audit_logs for select
  using (public.is_admin());

drop policy if exists "Admins can insert admin audit logs" on public.admin_audit_logs;
create policy "Admins can insert admin audit logs"
  on public.admin_audit_logs for insert
  with check (public.is_admin());

drop policy if exists "Admins can update admin audit logs" on public.admin_audit_logs;
create policy "Admins can update admin audit logs"
  on public.admin_audit_logs for update
  using (public.is_admin())
  with check (public.is_admin());
