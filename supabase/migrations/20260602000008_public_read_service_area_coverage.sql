alter table public.service_areas enable row level security;
alter table public.location_areas enable row level security;

drop policy if exists "Public read enabled service areas" on public.service_areas;
create policy "Public read enabled service areas"
on public.service_areas
for select
to anon, authenticated
using (enabled = true);

drop policy if exists "Public read enabled location areas" on public.location_areas;
create policy "Public read enabled location areas"
on public.location_areas
for select
to anon, authenticated
using (enabled = true);
