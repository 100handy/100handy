do $$
declare
  constraint_name text;
begin
  select con.conname
  into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = con.connamespace
  where nsp.nspname = 'public'
    and rel.relname = 'location_areas'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%area_type%';

  if constraint_name is not null then
    execute format('alter table public.location_areas drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.location_areas
add constraint location_areas_area_type_check
check (area_type in ('country', 'nation', 'region', 'city', 'borough', 'postcode_area', 'postcode_district'));

with boroughs as (
  select *
  from (
    values
      ('loc_borough_barking_dagenham', 'Barking and Dagenham', 'barking-and-dagenham', 1),
      ('loc_borough_barnet', 'Barnet', 'barnet', 2),
      ('loc_borough_bexley', 'Bexley', 'bexley', 3),
      ('loc_borough_brent', 'Brent', 'brent', 4),
      ('loc_borough_bromley', 'Bromley', 'bromley', 5),
      ('loc_borough_camden', 'Camden', 'camden', 6),
      ('loc_borough_city_of_london', 'City of London', 'city-of-london', 7),
      ('loc_borough_croydon', 'Croydon', 'croydon', 8),
      ('loc_borough_ealing', 'Ealing', 'ealing', 9),
      ('loc_borough_enfield', 'Enfield', 'enfield', 10),
      ('loc_borough_greenwich', 'Greenwich', 'greenwich', 11),
      ('loc_borough_hackney', 'Hackney', 'hackney', 12),
      ('loc_borough_hammersmith_fulham', 'Hammersmith and Fulham', 'hammersmith-and-fulham', 13),
      ('loc_borough_haringey', 'Haringey', 'haringey', 14),
      ('loc_borough_harrow', 'Harrow', 'harrow', 15),
      ('loc_borough_havering', 'Havering', 'havering', 16),
      ('loc_borough_hillingdon', 'Hillingdon', 'hillingdon', 17),
      ('loc_borough_hounslow', 'Hounslow', 'hounslow', 18),
      ('loc_borough_islington', 'Islington', 'islington', 19),
      ('loc_borough_kensington_chelsea', 'Kensington and Chelsea', 'kensington-and-chelsea', 20),
      ('loc_borough_kingston', 'Kingston upon Thames', 'kingston-upon-thames', 21),
      ('loc_borough_lambeth', 'Lambeth', 'lambeth', 22),
      ('loc_borough_lewisham', 'Lewisham', 'lewisham', 23),
      ('loc_borough_merton', 'Merton', 'merton', 24),
      ('loc_borough_newham', 'Newham', 'newham', 25),
      ('loc_borough_redbridge', 'Redbridge', 'redbridge', 26),
      ('loc_borough_richmond', 'Richmond upon Thames', 'richmond-upon-thames', 27),
      ('loc_borough_southwark', 'Southwark', 'southwark', 28),
      ('loc_borough_sutton', 'Sutton', 'sutton', 29),
      ('loc_borough_tower_hamlets', 'Tower Hamlets', 'tower-hamlets', 30),
      ('loc_borough_waltham_forest', 'Waltham Forest', 'waltham-forest', 31),
      ('loc_borough_wandsworth', 'Wandsworth', 'wandsworth', 32),
      ('loc_borough_westminster', 'Westminster', 'westminster', 33)
  ) as rows(id, name, slug, sort_order)
)
insert into public.location_areas (
  id,
  name,
  slug,
  area_type,
  parent_id,
  country_code,
  enabled,
  sort_order,
  notes
)
select
  id,
  name,
  slug,
  'borough',
  'loc_london_city',
  'GB',
  true,
  sort_order,
  'Seeded London borough'
from boroughs
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  area_type = excluded.area_type,
  parent_id = excluded.parent_id,
  enabled = excluded.enabled,
  sort_order = excluded.sort_order,
  notes = excluded.notes;

comment on constraint location_areas_area_type_check on public.location_areas is 'Allowed area hierarchy types including borough and postcode_district support.';
