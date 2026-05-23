-- Content platform core schema
-- Purpose:
--   1. Formalize editable page records around existing public.site_content
--   2. Add centralized SEO metadata
--   3. Add global navigation / site settings tables
--   4. Add first-class content tables for blogs, FAQs, app copy, and announcements

-- ============================================================================
-- Generic updated_at trigger helper
-- ============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Site pages
-- ============================================================================

create table if not exists public.site_pages (
  id text primary key default generate_nanoid('page'::text),
  page_key text not null unique,
  title text not null,
  slug text not null unique,
  template_key text not null default 'standard',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_site_pages_status on public.site_pages(status);
create index if not exists idx_site_pages_template on public.site_pages(template_key);

drop trigger if exists site_pages_updated_at on public.site_pages;
create trigger site_pages_updated_at
  before update on public.site_pages
  for each row execute function public.touch_updated_at();

alter table public.site_pages enable row level security;

drop policy if exists "Public read published site pages" on public.site_pages;
create policy "Public read published site pages"
  on public.site_pages for select
  using (status = 'published');

drop policy if exists "Admins can read site pages" on public.site_pages;
create policy "Admins can read site pages"
  on public.site_pages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert site pages" on public.site_pages;
create policy "Admins can insert site pages"
  on public.site_pages for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site pages" on public.site_pages;
create policy "Admins can update site pages"
  on public.site_pages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site pages" on public.site_pages;
create policy "Admins can delete site pages"
  on public.site_pages for delete
  to authenticated
  using (public.is_admin());

comment on table public.site_pages is
  'Registry of public website pages and their publishing state. public.site_content stores field-level values for these pages.';

-- Backfill pages for any existing CMS content rows before adding FK
insert into public.site_pages (page_key, title, slug, template_key, status, is_system)
select distinct
  sc.page_key,
  initcap(replace(sc.page_key, '-', ' ')),
  case
    when sc.page_key = 'home' then '/'
    else '/' || sc.page_key
  end,
  'standard',
  'published',
  true
from public.site_content sc
on conflict (page_key) do nothing;

-- Seed the first public page set that should become CMS-driven
insert into public.site_pages (page_key, title, slug, template_key, status, is_system)
values
  ('home', 'Home', '/', 'marketing', 'draft', true),
  ('about-us', 'About Us', '/about-us', 'marketing', 'published', true),
  ('for-good', '100 Handy Cares', '/for-good', 'marketing', 'published', true),
  ('careers', 'Careers', '/careers', 'marketing', 'published', true),
  ('contact', 'Contact Us', '/contact', 'marketing', 'published', true),
  ('terms', 'Terms', '/terms', 'legal', 'published', true),
  ('legal', 'Legal', '/legal', 'legal', 'published', true),
  ('blog', 'Blog', '/blog', 'blog-index', 'published', true),
  ('help', 'Help', '/help', 'help', 'draft', true),
  ('help-account', 'Help: Account', '/help/account', 'help', 'draft', true),
  ('help-client', 'Help: Client', '/help/client', 'help', 'draft', true),
  ('help-pro', 'Help: Pro', '/help/pro', 'help', 'draft', true),
  ('help-registration', 'Help: Registration', '/help/registration', 'help', 'draft', true),
  ('help-policies', 'Help: Policies', '/help/policies', 'help', 'draft', true),
  ('help-trust-safety', 'Help: Trust & Safety', '/help/trust-safety', 'help', 'draft', true),
  ('press', 'Press', '/press', 'marketing', 'draft', true),
  ('for-business', 'For Business', '/for-business', 'marketing', 'draft', true),
  ('referral', 'Referral', '/referral', 'marketing', 'draft', true),
  ('all-services', 'All Services', '/all-services', 'services', 'draft', true),
  ('services', 'Services', '/services', 'services', 'draft', true),
  ('cookie-settings', 'Cookie Settings', '/cookie-settings', 'legal', 'draft', true),
  ('elite-taskers', 'Elite Taskers', '/elite-taskers', 'marketing', 'draft', true)
on conflict (page_key) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'site_content_page_key_fkey'
  ) then
    alter table public.site_content
      add constraint site_content_page_key_fkey
      foreign key (page_key) references public.site_pages(page_key)
      on update cascade
      on delete cascade;
  end if;
end $$;

-- ============================================================================
-- SEO metadata
-- ============================================================================

create table if not exists public.seo_metadata (
  id text primary key default generate_nanoid('seo'::text),
  surface_type text not null check (
    surface_type in (
      'page',
      'blog_post',
      'service_category',
      'service_subcategory',
      'location_page',
      'location_service_page',
      'app_screen'
    )
  ),
  surface_key text not null,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image_url text,
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  canonical_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  schema_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique (surface_type, surface_key)
);

create index if not exists idx_seo_metadata_surface on public.seo_metadata(surface_type, surface_key);

drop trigger if exists seo_metadata_updated_at on public.seo_metadata;
create trigger seo_metadata_updated_at
  before update on public.seo_metadata
  for each row execute function public.touch_updated_at();

alter table public.seo_metadata enable row level security;

drop policy if exists "Public read seo metadata" on public.seo_metadata;
create policy "Public read seo metadata"
  on public.seo_metadata for select
  using (true);

drop policy if exists "Admins can insert seo metadata" on public.seo_metadata;
create policy "Admins can insert seo metadata"
  on public.seo_metadata for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update seo metadata" on public.seo_metadata;
create policy "Admins can update seo metadata"
  on public.seo_metadata for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete seo metadata" on public.seo_metadata;
create policy "Admins can delete seo metadata"
  on public.seo_metadata for delete
  to authenticated
  using (public.is_admin());

comment on table public.seo_metadata is
  'Central metadata store for public pages, blogs, services, locations, and app screens.';

-- ============================================================================
-- Navigation items
-- ============================================================================

create table if not exists public.navigation_items (
  id text primary key default generate_nanoid('nav'::text),
  nav_key text not null,
  parent_id text references public.navigation_items(id) on delete cascade,
  label text not null,
  href text not null,
  item_type text not null default 'internal' check (item_type in ('internal', 'external')),
  location text not null check (location in ('header', 'footer', 'support', 'account')),
  audience text not null default 'public' check (audience in ('public', 'client', 'professional', 'admin')),
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique (nav_key, location, audience)
);

create index if not exists idx_navigation_items_location on public.navigation_items(location, audience, sort_order);

drop trigger if exists navigation_items_updated_at on public.navigation_items;
create trigger navigation_items_updated_at
  before update on public.navigation_items
  for each row execute function public.touch_updated_at();

alter table public.navigation_items enable row level security;

drop policy if exists "Public read navigation items" on public.navigation_items;
create policy "Public read navigation items"
  on public.navigation_items for select
  using (visible = true);

drop policy if exists "Admins can manage navigation items" on public.navigation_items;
create policy "Admins can manage navigation items"
  on public.navigation_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- Site settings
-- ============================================================================

create table if not exists public.site_settings (
  id text primary key default generate_nanoid('setting'::text),
  setting_group text not null,
  setting_key text not null unique,
  value_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_site_settings_group on public.site_settings(setting_group);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- Blog posts
-- ============================================================================

create table if not exists public.blog_posts (
  id text primary key default generate_nanoid('blog'::text),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null default '',
  cover_image_url text,
  category text,
  tags text[] not null default '{}',
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_blog_posts_status on public.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
  on public.blog_posts for select
  using (status = 'published');

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- FAQ items
-- ============================================================================

create table if not exists public.faq_items (
  id text primary key default generate_nanoid('faq'::text),
  faq_group text not null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_faq_items_group on public.faq_items(faq_group, sort_order);

drop trigger if exists faq_items_updated_at on public.faq_items;
create trigger faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.touch_updated_at();

alter table public.faq_items enable row level security;

drop policy if exists "Public read visible faq items" on public.faq_items;
create policy "Public read visible faq items"
  on public.faq_items for select
  using (visible = true);

drop policy if exists "Admins can manage faq items" on public.faq_items;
create policy "Admins can manage faq items"
  on public.faq_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- App content
-- ============================================================================

create table if not exists public.app_content (
  id text primary key default generate_nanoid('appc'::text),
  platform text not null default 'shared' check (platform in ('shared', 'ios', 'android')),
  screen_key text not null,
  section_key text not null,
  field_key text not null,
  value text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique (platform, screen_key, section_key, field_key)
);

create index if not exists idx_app_content_screen on public.app_content(platform, screen_key, status);

drop trigger if exists app_content_updated_at on public.app_content;
create trigger app_content_updated_at
  before update on public.app_content
  for each row execute function public.touch_updated_at();

alter table public.app_content enable row level security;

drop policy if exists "Public read published app content" on public.app_content;
create policy "Public read published app content"
  on public.app_content for select
  using (status = 'published');

drop policy if exists "Admins can manage app content" on public.app_content;
create policy "Admins can manage app content"
  on public.app_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- Announcements
-- ============================================================================

create table if not exists public.announcements (
  id text primary key default generate_nanoid('announce'::text),
  audience text not null default 'all' check (audience in ('all', 'client', 'professional', 'web')),
  placement text not null check (placement in ('banner', 'dashboard', 'modal', 'support')),
  title text not null,
  body text not null,
  cta_label text,
  cta_href text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_announcements_target on public.announcements(audience, placement, active);

drop trigger if exists announcements_updated_at on public.announcements;
create trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.touch_updated_at();

alter table public.announcements enable row level security;

drop policy if exists "Public read active announcements" on public.announcements;
create policy "Public read active announcements"
  on public.announcements for select
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "Admins can manage announcements" on public.announcements;
create policy "Admins can manage announcements"
  on public.announcements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
