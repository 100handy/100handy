alter table public.provider_service_areas enable row level security;

drop policy if exists "Public read provider service areas" on public.provider_service_areas;
create policy "Public read provider service areas"
on public.provider_service_areas
for select
to anon, authenticated
using (true);
