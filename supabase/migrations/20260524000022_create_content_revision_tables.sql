create table if not exists public.blog_post_revisions (
  id text primary key default generate_nanoid('revision'::text),
  slug text not null,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  post_json jsonb not null default '{}'::jsonb,
  seo_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (slug, version_number)
);

create unique index if not exists idx_blog_post_revisions_one_draft
  on public.blog_post_revisions(slug)
  where revision_state = 'draft';

create index if not exists idx_blog_post_revisions_slug
  on public.blog_post_revisions(slug, version_number desc);

drop trigger if exists blog_post_revisions_updated_at on public.blog_post_revisions;
create trigger blog_post_revisions_updated_at
  before update on public.blog_post_revisions
  for each row execute function public.touch_updated_at();

alter table public.blog_post_revisions enable row level security;

drop policy if exists "Admins can read blog post revisions" on public.blog_post_revisions;
create policy "Admins can read blog post revisions"
  on public.blog_post_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert blog post revisions" on public.blog_post_revisions;
create policy "Admins can insert blog post revisions"
  on public.blog_post_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update blog post revisions" on public.blog_post_revisions;
create policy "Admins can update blog post revisions"
  on public.blog_post_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete blog post revisions" on public.blog_post_revisions;
create policy "Admins can delete blog post revisions"
  on public.blog_post_revisions for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.help_article_revisions (
  id text primary key default generate_nanoid('revision'::text),
  article_key text not null,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  article_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (article_key, version_number)
);

create unique index if not exists idx_help_article_revisions_one_draft
  on public.help_article_revisions(article_key)
  where revision_state = 'draft';

create index if not exists idx_help_article_revisions_key
  on public.help_article_revisions(article_key, version_number desc);

drop trigger if exists help_article_revisions_updated_at on public.help_article_revisions;
create trigger help_article_revisions_updated_at
  before update on public.help_article_revisions
  for each row execute function public.touch_updated_at();

alter table public.help_article_revisions enable row level security;

drop policy if exists "Admins can read help article revisions" on public.help_article_revisions;
create policy "Admins can read help article revisions"
  on public.help_article_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert help article revisions" on public.help_article_revisions;
create policy "Admins can insert help article revisions"
  on public.help_article_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update help article revisions" on public.help_article_revisions;
create policy "Admins can update help article revisions"
  on public.help_article_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete help article revisions" on public.help_article_revisions;
create policy "Admins can delete help article revisions"
  on public.help_article_revisions for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.app_content_screen_revisions (
  id text primary key default generate_nanoid('revision'::text),
  platform text not null check (platform in ('shared', 'ios', 'android')),
  screen_key text not null,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (platform, screen_key, version_number)
);

create unique index if not exists idx_app_content_screen_revisions_one_draft
  on public.app_content_screen_revisions(platform, screen_key)
  where revision_state = 'draft';

create index if not exists idx_app_content_screen_revisions_lookup
  on public.app_content_screen_revisions(platform, screen_key, version_number desc);

drop trigger if exists app_content_screen_revisions_updated_at on public.app_content_screen_revisions;
create trigger app_content_screen_revisions_updated_at
  before update on public.app_content_screen_revisions
  for each row execute function public.touch_updated_at();

alter table public.app_content_screen_revisions enable row level security;

drop policy if exists "Admins can read app content screen revisions" on public.app_content_screen_revisions;
create policy "Admins can read app content screen revisions"
  on public.app_content_screen_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert app content screen revisions" on public.app_content_screen_revisions;
create policy "Admins can insert app content screen revisions"
  on public.app_content_screen_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update app content screen revisions" on public.app_content_screen_revisions;
create policy "Admins can update app content screen revisions"
  on public.app_content_screen_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete app content screen revisions" on public.app_content_screen_revisions;
create policy "Admins can delete app content screen revisions"
  on public.app_content_screen_revisions for delete
  to authenticated
  using (public.is_admin());
