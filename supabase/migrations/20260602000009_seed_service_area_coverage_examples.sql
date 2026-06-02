insert into public.service_areas (
  city,
  postcode_prefix,
  location_area_id,
  enabled,
  notes
)
select *
from (
  values
    ('London', 'SW', 'loc_pa_sw', true, 'Seeded coverage row for Central / South West London testing'),
    ('Manchester', 'M', 'loc_pa_m', true, 'Seeded coverage row for Manchester testing'),
    ('Belfast', 'BT', 'loc_pa_bt', true, 'Seeded coverage row for Belfast testing')
) as seeded(city, postcode_prefix, location_area_id, enabled, notes)
where not exists (
  select 1
  from public.service_areas existing
  where upper(existing.postcode_prefix) = upper(seeded.postcode_prefix)
);
