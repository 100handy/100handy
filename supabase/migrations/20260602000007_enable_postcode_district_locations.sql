do $$
declare
  constraint_name text;
begin
  select con.conname
  into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
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
check (area_type in ('country', 'nation', 'region', 'city', 'postcode_area', 'postcode_district'));

comment on constraint location_areas_area_type_check on public.location_areas is 'Allowed area hierarchy types including postcode_district import support.';
