create table if not exists public.navigation_config_revisions (
  id text primary key default generate_nanoid('revision'::text),
  config_key text not null,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  items_json jsonb not null default '[]'::jsonb,
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (config_key, version_number)
);

create unique index if not exists idx_navigation_config_revisions_one_draft
  on public.navigation_config_revisions(config_key)
  where revision_state = 'draft';

create index if not exists idx_navigation_config_revisions_lookup
  on public.navigation_config_revisions(config_key, version_number desc);

drop trigger if exists navigation_config_revisions_updated_at on public.navigation_config_revisions;
create trigger navigation_config_revisions_updated_at
  before update on public.navigation_config_revisions
  for each row execute function public.touch_updated_at();

alter table public.navigation_config_revisions enable row level security;

drop policy if exists "Admins can read navigation config revisions" on public.navigation_config_revisions;
create policy "Admins can read navigation config revisions"
  on public.navigation_config_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert navigation config revisions" on public.navigation_config_revisions;
create policy "Admins can insert navigation config revisions"
  on public.navigation_config_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update navigation config revisions" on public.navigation_config_revisions;
create policy "Admins can update navigation config revisions"
  on public.navigation_config_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete navigation config revisions" on public.navigation_config_revisions;
create policy "Admins can delete navigation config revisions"
  on public.navigation_config_revisions for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.site_settings_revisions (
  id text primary key default generate_nanoid('revision'::text),
  settings_key text not null,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (settings_key, version_number)
);

create unique index if not exists idx_site_settings_revisions_one_draft
  on public.site_settings_revisions(settings_key)
  where revision_state = 'draft';

create index if not exists idx_site_settings_revisions_lookup
  on public.site_settings_revisions(settings_key, version_number desc);

drop trigger if exists site_settings_revisions_updated_at on public.site_settings_revisions;
create trigger site_settings_revisions_updated_at
  before update on public.site_settings_revisions
  for each row execute function public.touch_updated_at();

alter table public.site_settings_revisions enable row level security;

drop policy if exists "Admins can read site settings revisions" on public.site_settings_revisions;
create policy "Admins can read site settings revisions"
  on public.site_settings_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert site settings revisions" on public.site_settings_revisions;
create policy "Admins can insert site settings revisions"
  on public.site_settings_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site settings revisions" on public.site_settings_revisions;
create policy "Admins can update site settings revisions"
  on public.site_settings_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site settings revisions" on public.site_settings_revisions;
create policy "Admins can delete site settings revisions"
  on public.site_settings_revisions for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.announcement_revisions (
  id text primary key default generate_nanoid('revision'::text),
  announcement_key text not null,
  announcement_id text,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  announcement_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (announcement_key, version_number)
);

create unique index if not exists idx_announcement_revisions_one_draft
  on public.announcement_revisions(announcement_key)
  where revision_state = 'draft';

create index if not exists idx_announcement_revisions_lookup
  on public.announcement_revisions(announcement_key, version_number desc);

drop trigger if exists announcement_revisions_updated_at on public.announcement_revisions;
create trigger announcement_revisions_updated_at
  before update on public.announcement_revisions
  for each row execute function public.touch_updated_at();

alter table public.announcement_revisions enable row level security;

drop policy if exists "Admins can read announcement revisions" on public.announcement_revisions;
create policy "Admins can read announcement revisions"
  on public.announcement_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert announcement revisions" on public.announcement_revisions;
create policy "Admins can insert announcement revisions"
  on public.announcement_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update announcement revisions" on public.announcement_revisions;
create policy "Admins can update announcement revisions"
  on public.announcement_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete announcement revisions" on public.announcement_revisions;
create policy "Admins can delete announcement revisions"
  on public.announcement_revisions for delete
  to authenticated
  using (public.is_admin());
