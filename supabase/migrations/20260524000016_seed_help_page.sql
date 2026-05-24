insert into public.site_pages (page_key, title, slug, template_key, status)
values ('help', 'Help Centre', '/help', 'help', 'published')
on conflict (page_key) do update
set
  title = excluded.title,
  slug = excluded.slug,
  template_key = excluded.template_key,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
