create table if not exists public.location_areas (
  id text primary key default generate_nanoid('location_area'::text),
  name text not null,
  slug text not null,
  area_type text not null check (area_type in ('country', 'nation', 'region', 'city', 'postcode_area')),
  parent_id text references public.location_areas(id) on delete cascade,
  country_code text not null default 'GB',
  enabled boolean not null default true,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parent_id, slug)
);

create index if not exists idx_location_areas_parent_id on public.location_areas(parent_id);
create index if not exists idx_location_areas_type on public.location_areas(area_type);
create index if not exists idx_location_areas_enabled on public.location_areas(enabled);

alter table public.service_areas
add column if not exists location_area_id text references public.location_areas(id) on delete set null;

create index if not exists idx_service_areas_location_area_id on public.service_areas(location_area_id);

create or replace function public.update_location_areas_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_location_areas_updated_at on public.location_areas;
create trigger trg_location_areas_updated_at
before update on public.location_areas
for each row execute function public.update_location_areas_updated_at();

alter table public.location_areas enable row level security;

drop policy if exists "Admins can manage location areas" on public.location_areas;
create policy "Admins can manage location areas"
on public.location_areas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

with seeded as (
  select *
  from (
    values
      ('loc_uk', 'United Kingdom', 'united-kingdom', 'country', null, 'GB', true, 1, 'Top-level UK coverage node'),
      ('loc_eng', 'England', 'england', 'nation', 'loc_uk', 'GB', true, 1, null),
      ('loc_sco', 'Scotland', 'scotland', 'nation', 'loc_uk', 'GB', true, 2, null),
      ('loc_wal', 'Wales', 'wales', 'nation', 'loc_uk', 'GB', true, 3, null),
      ('loc_ni', 'Northern Ireland', 'northern-ireland', 'nation', 'loc_uk', 'GB', true, 4, null),
      ('loc_london_region', 'London', 'london-region', 'region', 'loc_eng', 'GB', true, 1, null),
      ('loc_se', 'South East', 'south-east', 'region', 'loc_eng', 'GB', true, 2, null),
      ('loc_sw', 'South West', 'south-west', 'region', 'loc_eng', 'GB', true, 3, null),
      ('loc_eoe', 'East of England', 'east-of-england', 'region', 'loc_eng', 'GB', true, 4, null),
      ('loc_em', 'East Midlands', 'east-midlands', 'region', 'loc_eng', 'GB', true, 5, null),
      ('loc_wm', 'West Midlands', 'west-midlands', 'region', 'loc_eng', 'GB', true, 6, null),
      ('loc_yh', 'Yorkshire and the Humber', 'yorkshire-and-the-humber', 'region', 'loc_eng', 'GB', true, 7, null),
      ('loc_nw', 'North West', 'north-west', 'region', 'loc_eng', 'GB', true, 8, null),
      ('loc_ne', 'North East', 'north-east', 'region', 'loc_eng', 'GB', true, 9, null),
      ('loc_london_city', 'London', 'london', 'city', 'loc_london_region', 'GB', true, 1, null),
      ('loc_manchester', 'Manchester', 'manchester', 'city', 'loc_nw', 'GB', true, 2, null),
      ('loc_liverpool', 'Liverpool', 'liverpool', 'city', 'loc_nw', 'GB', true, 3, null),
      ('loc_leeds', 'Leeds', 'leeds', 'city', 'loc_yh', 'GB', true, 4, null),
      ('loc_birmingham', 'Birmingham', 'birmingham', 'city', 'loc_wm', 'GB', true, 5, null),
      ('loc_bristol', 'Bristol', 'bristol', 'city', 'loc_sw', 'GB', true, 6, null),
      ('loc_edinburgh', 'Edinburgh', 'edinburgh', 'city', 'loc_sco', 'GB', true, 7, null),
      ('loc_glasgow', 'Glasgow', 'glasgow', 'city', 'loc_sco', 'GB', true, 8, null),
      ('loc_cardiff', 'Cardiff', 'cardiff', 'city', 'loc_wal', 'GB', true, 9, null),
      ('loc_belfast', 'Belfast', 'belfast', 'city', 'loc_ni', 'GB', true, 10, null)
  ) as rows(id, name, slug, area_type, parent_id, country_code, enabled, sort_order, notes)
)
insert into public.location_areas (id, name, slug, area_type, parent_id, country_code, enabled, sort_order, notes)
select id, name, slug, area_type, parent_id, country_code, enabled, sort_order, notes
from seeded
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  area_type = excluded.area_type,
  parent_id = excluded.parent_id,
  country_code = excluded.country_code,
  enabled = excluded.enabled,
  sort_order = excluded.sort_order,
  notes = excluded.notes;

update public.service_areas
set location_area_id = mapping.location_area_id
from (
  values
    ('London', 'loc_london_city'),
    ('Manchester', 'loc_manchester'),
    ('Liverpool', 'loc_liverpool'),
    ('Leeds', 'loc_leeds'),
    ('Birmingham', 'loc_birmingham'),
    ('Bristol', 'loc_bristol'),
    ('Edinburgh', 'loc_edinburgh'),
    ('Glasgow', 'loc_glasgow'),
    ('Cardiff', 'loc_cardiff'),
    ('Belfast', 'loc_belfast')
) as mapping(city, location_area_id)
where public.service_areas.location_area_id is null
  and lower(public.service_areas.city) = lower(mapping.city);

comment on table public.location_areas is 'Hierarchical UK coverage tree for admin-controlled marketplace enablement.';
comment on column public.location_areas.area_type is 'country, nation, region, city, or postcode_area.';
