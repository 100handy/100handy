alter table public.categories
  add column if not exists route_slug text,
  add column if not exists marketing_title text,
  add column if not exists marketing_description text,
  add column if not exists active boolean not null default true,
  add column if not exists supports_recurring boolean not null default false;

create unique index if not exists idx_categories_route_slug_unique
  on public.categories(route_slug)
  where route_slug is not null;

comment on column public.categories.route_slug is 'Public route slug used by website service/category URLs.';
comment on column public.categories.marketing_title is 'Optional public-facing marketing title for category landing pages.';
comment on column public.categories.marketing_description is 'Optional public-facing marketing description for service/category discovery surfaces.';
comment on column public.categories.active is 'Whether the category is visible on public web and app surfaces.';
comment on column public.categories.supports_recurring is 'Whether bookings in this category can offer recurring frequency options.';

update public.categories
set
  route_slug = case id
    when 'cat_assembly' then 'furniture-assembly'
    when 'cat_mounting' then 'tv-wall-mounting'
    when 'cat_home_repairs' then 'home-repairs'
    when 'cat_plumbing' then 'plumbing'
    when 'cat_electrical' then 'electrical'
    when 'cat_cleaning' then 'cleaning'
    when 'cat_moving' then 'packing-moving'
    when 'cat_outdoor' then 'outdoor'
    else route_slug
  end,
  marketing_title = case id
    when 'cat_assembly' then 'Furniture Assembly'
    when 'cat_mounting' then 'TV & Wall Mounting'
    when 'cat_home_repairs' then 'Home Repairs & Fixes'
    when 'cat_plumbing' then 'Plumbing Services'
    when 'cat_electrical' then 'Electrical Services'
    when 'cat_cleaning' then 'Cleaning Services'
    when 'cat_moving' then 'Packing & Moving'
    when 'cat_outdoor' then 'The Great Outdoors'
    else marketing_title
  end,
  marketing_description = case id
    when 'cat_assembly' then 'From flat-pack builds to full room setups, our vetted Pros handle all your furniture assembly needs quickly and with care.'
    when 'cat_mounting' then 'Professional mounting for TVs, shelves, pictures, light fixtures, curtains, and blinds - secure, level, and built to last.'
    when 'cat_home_repairs' then 'From minor fixes to flooring, doors, windows, and carpentry - our Pros handle all your home maintenance needs.'
    when 'cat_plumbing' then 'Leak fixing, drain unblocking, tap replacement, and appliance installation - handled by experienced plumbers.'
    when 'cat_electrical' then 'Safe, reliable electrical work including lighting, sockets, switches, and cable repairs by certified electricians.'
    when 'cat_cleaning' then 'Standard cleans, deep cleans, end-of-tenancy, office cleaning, and AirBnB turnover - spotless results every time.'
    when 'cat_moving' then 'Man and van, moving help, packing services, heavy lifting, and full-service moves - stress-free relocations.'
    when 'cat_outdoor' then 'Gardening, lawn care, landscaping, leaf removal, gutter cleaning, and hedge trimming - your garden, transformed.'
    else marketing_description
  end
where id in (
  'cat_assembly',
  'cat_mounting',
  'cat_home_repairs',
  'cat_plumbing',
  'cat_electrical',
  'cat_cleaning',
  'cat_moving',
  'cat_outdoor'
);

update public.categories
set supports_recurring = true
where id = 'cat_cleaning'
   or parent_id = 'cat_cleaning';
