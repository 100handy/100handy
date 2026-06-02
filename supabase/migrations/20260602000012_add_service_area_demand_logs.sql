create table if not exists public.service_area_demand_logs (
  id uuid primary key default gen_random_uuid(),
  postcode_normalized text not null,
  postcode_outward text not null,
  category_id text null,
  channel text not null check (channel in ('web', 'mobile')),
  route text null,
  available boolean not null,
  reason text not null,
  matched_area_id text null references public.service_areas(id) on delete set null,
  matched_prefix text null,
  matched_city text null,
  eligible_provider_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_service_area_demand_logs_created_at
  on public.service_area_demand_logs(created_at desc);

create index if not exists idx_service_area_demand_logs_outward
  on public.service_area_demand_logs(postcode_outward);

create index if not exists idx_service_area_demand_logs_available
  on public.service_area_demand_logs(available);

alter table public.service_area_demand_logs enable row level security;

drop policy if exists "Public insert service area demand logs" on public.service_area_demand_logs;
create policy "Public insert service area demand logs"
on public.service_area_demand_logs
for insert
to public
with check (true);

drop policy if exists "Admins can read service area demand logs" on public.service_area_demand_logs;
create policy "Admins can read service area demand logs"
on public.service_area_demand_logs
for select
to authenticated
using (public.is_admin());

comment on table public.service_area_demand_logs is 'Booking and provider-browse availability checks used for coverage analytics and rollout planning.';
