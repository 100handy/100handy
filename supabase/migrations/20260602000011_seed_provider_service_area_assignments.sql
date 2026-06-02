insert into public.provider_service_areas (
  service_area_id,
  provider_id
)
select
  area.id,
  seeded.provider_id::uuid
from public.service_areas area
cross join (
  values
    ('00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000002'),
    ('00000000-0000-0000-0000-000000000003'),
    ('3f9a97bd-4045-453b-a44e-fe1ba7453f45')
) as seeded(provider_id)
where upper(area.postcode_prefix) = 'SW'
on conflict (service_area_id, provider_id) do nothing;
