-- Site Content CMS table
-- Stores editable text and image content for marketing pages
create table public.site_content (
  id text primary key default generate_nanoid('content'::text),
  page_key text not null,
  section_key text not null,
  field_key text not null,
  content_type text not null check (content_type in ('text', 'rich_text', 'image_url')),
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique(page_key, section_key, field_key)
);

-- Index for fast page lookups
create index idx_site_content_page on public.site_content(page_key);

-- Enable RLS
alter table public.site_content enable row level security;

-- Anyone can read content (public marketing pages)
create policy "Public read access"
  on public.site_content for select
  using (true);

-- Only admins can write content
create policy "Admin insert access"
  on public.site_content for insert
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin update access"
  on public.site_content for update
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin delete access"
  on public.site_content for delete
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- Auto-update updated_at timestamp
create or replace function public.update_site_content_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.update_site_content_timestamp();

-- Storage bucket for CMS images
insert into storage.buckets (id, name, public)
values ('site-content-images', 'site-content-images', true)
on conflict (id) do nothing;

-- Anyone can view site content images
create policy "Public read site content images"
  on storage.objects for select
  using (bucket_id = 'site-content-images');

-- Only admins can upload site content images
create policy "Admin upload site content images"
  on storage.objects for insert
  with check (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- Admins can update/delete site content images
create policy "Admin manage site content images"
  on storage.objects for update
  using (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admin delete site content images"
  on storage.objects for delete
  using (
    bucket_id = 'site-content-images'
    and exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );
