create table if not exists public.rollout_presets (
  id text primary key default generate_nanoid('rollout'::text),
  name text not null,
  description text null,
  rollout_month date not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'applied', 'archived')),
  category_states jsonb not null default '[]'::jsonb,
  service_area_states jsonb not null default '[]'::jsonb,
  area_category_states jsonb not null default '[]'::jsonb,
  notes text null,
  created_by uuid null references auth.users(id) on delete set null,
  applied_by uuid null references auth.users(id) on delete set null,
  applied_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_rollout_presets_month_status
  on public.rollout_presets(rollout_month desc, status);

create index if not exists idx_rollout_presets_created_at
  on public.rollout_presets(created_at desc);

drop trigger if exists rollout_presets_updated_at on public.rollout_presets;
create trigger rollout_presets_updated_at
  before update on public.rollout_presets
  for each row execute function public.touch_updated_at();

alter table public.rollout_presets enable row level security;

drop policy if exists "Admins can read rollout presets" on public.rollout_presets;
create policy "Admins can read rollout presets"
  on public.rollout_presets for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert rollout presets" on public.rollout_presets;
create policy "Admins can insert rollout presets"
  on public.rollout_presets for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update rollout presets" on public.rollout_presets;
create policy "Admins can update rollout presets"
  on public.rollout_presets for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete rollout presets" on public.rollout_presets;
create policy "Admins can delete rollout presets"
  on public.rollout_presets for delete
  to authenticated
  using (public.is_admin());

comment on table public.rollout_presets is 'Admin-only monthly rollout snapshots for category, area, and area-category launch planning.';
