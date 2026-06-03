create table if not exists public.service_area_category_overrides (
  id uuid primary key default gen_random_uuid(),
  service_area_id text not null references public.service_areas(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  enabled boolean not null default true,
  notes text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (service_area_id, category_id)
);

create index if not exists idx_service_area_category_overrides_area
  on public.service_area_category_overrides(service_area_id);

create index if not exists idx_service_area_category_overrides_category
  on public.service_area_category_overrides(category_id);

create or replace function public.update_service_area_category_overrides_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_service_area_category_overrides_updated_at on public.service_area_category_overrides;
create trigger trg_service_area_category_overrides_updated_at
before update on public.service_area_category_overrides
for each row execute function public.update_service_area_category_overrides_updated_at();

alter table public.service_area_category_overrides enable row level security;

drop policy if exists "Admins can manage service area category overrides" on public.service_area_category_overrides;
create policy "Admins can manage service area category overrides"
on public.service_area_category_overrides
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read enabled service area category overrides" on public.service_area_category_overrides;
create policy "Public read enabled service area category overrides"
on public.service_area_category_overrides
for select
to public
using (enabled = true);

comment on table public.service_area_category_overrides is 'Area-level category rollout controls. If rows exist for a category in a service area, only enabled rows are bookable there.';
