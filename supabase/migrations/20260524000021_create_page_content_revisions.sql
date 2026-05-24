create table if not exists public.page_content_revisions (
  id text primary key default generate_nanoid('revision'::text),
  page_key text not null references public.site_pages(page_key) on delete cascade,
  version_number integer not null,
  revision_state text not null check (revision_state in ('draft', 'published')),
  page_json jsonb not null default '{}'::jsonb,
  seo_json jsonb not null default '{}'::jsonb,
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  published_at timestamptz,
  published_by uuid references auth.users(id),
  unique (page_key, version_number)
);

create unique index if not exists idx_page_content_revisions_one_draft
  on public.page_content_revisions(page_key)
  where revision_state = 'draft';

create index if not exists idx_page_content_revisions_page
  on public.page_content_revisions(page_key, version_number desc);

drop trigger if exists page_content_revisions_updated_at on public.page_content_revisions;
create trigger page_content_revisions_updated_at
  before update on public.page_content_revisions
  for each row execute function public.touch_updated_at();

alter table public.page_content_revisions enable row level security;

drop policy if exists "Admins can read page content revisions" on public.page_content_revisions;
create policy "Admins can read page content revisions"
  on public.page_content_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert page content revisions" on public.page_content_revisions;
create policy "Admins can insert page content revisions"
  on public.page_content_revisions for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update page content revisions" on public.page_content_revisions;
create policy "Admins can update page content revisions"
  on public.page_content_revisions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete page content revisions" on public.page_content_revisions;
create policy "Admins can delete page content revisions"
  on public.page_content_revisions for delete
  to authenticated
  using (public.is_admin());
