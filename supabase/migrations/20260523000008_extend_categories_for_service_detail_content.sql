alter table public.categories
  add column if not exists long_description text,
  add column if not exists hero_image_url text,
  add column if not exists content_image_url text,
  add column if not exists benefits_json jsonb not null default '[]'::jsonb,
  add column if not exists tasks_json jsonb not null default '[]'::jsonb,
  add column if not exists faqs_json jsonb not null default '[]'::jsonb;

comment on column public.categories.long_description is 'Long-form marketing copy for service or category landing pages.';
comment on column public.categories.hero_image_url is 'Hero image override for website service/category landing pages.';
comment on column public.categories.content_image_url is 'Content image used on website service detail and service listing cards.';
comment on column public.categories.benefits_json is 'Structured benefit cards for service detail pages.';
comment on column public.categories.tasks_json is 'Structured tasks list for service detail pages.';
comment on column public.categories.faqs_json is 'Structured FAQs for service detail pages.';
