create table if not exists public.media_assets (
  id text primary key default generate_nanoid('media'::text),
  asset_key text not null unique,
  asset_type text not null default 'image' check (asset_type in ('image', 'video', 'document')),
  url text not null,
  title text,
  alt_text text,
  tags text[] not null default '{}',
  usage_scope text not null default 'shared' check (usage_scope in ('shared', 'web', 'mobile', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_media_assets_type on public.media_assets(asset_type, active);
create index if not exists idx_media_assets_scope on public.media_assets(usage_scope, active);

drop trigger if exists media_assets_updated_at on public.media_assets;
create trigger media_assets_updated_at
  before update on public.media_assets
  for each row execute function public.touch_updated_at();

alter table public.media_assets enable row level security;

drop policy if exists "Public read active media assets" on public.media_assets;
create policy "Public read active media assets"
  on public.media_assets for select
  using (active = true);

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets"
  on public.media_assets for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_settings (setting_group, setting_key, value_json)
values
  (
    'brand',
    'brand.logos',
    '{
      "dark": "/logos/100handy-green.png",
      "cream": "/logos/100handy-cream.png",
      "mobile_green": "/logos/100handy-green.png",
      "mobile_cream": "/logos/100handy-cream.png"
    }'::jsonb
  ),
  (
    'services',
    'services.web_images',
    '{
      "hero": "/images/services/hero.jpeg",
      "mainCategoryImages": {
        "Assembly": "/images/services/main/assembly.png",
        "Furniture Assembly": "/images/services/main/assembly.png",
        "Mounting": "/images/services/main/mounting.png",
        "TV & Wall Mounting": "/images/services/main/mounting.png",
        "Home Repairs": "/images/services/main/home-repairs.jpeg",
        "Home Repairs & Fixes": "/images/services/main/home-repairs.jpeg",
        "Plumbing": "/images/services/main/plumbing.jpeg",
        "Plumbers": "/images/services/main/plumbing.jpeg",
        "Electrical": "/images/services/main/electrical.png",
        "Electricians": "/images/services/main/electrical.png",
        "Cleaning": "/images/services/main/cleaning.jpeg",
        "Sparkle Clean": "/images/services/main/cleaning.jpeg",
        "Moving": "/images/services/main/moving.jpeg",
        "Packing & Moving": "/images/services/main/moving.jpeg",
        "Outdoor help": "/images/services/main/outdoor.png",
        "Outdoor Help": "/images/services/main/outdoor.png",
        "The Great Outdoors": "/images/services/main/outdoor.png"
      },
      "categoryHeroImages": {
        "furniture-assembly": "/images/services/assembly/hero.jpeg",
        "tv-wall-mounting": "/images/services/mounting/hero.png",
        "home-repairs": "/images/services/home-repairs/hero.jpeg",
        "plumbing": "/images/services/plumbing/hero.jpeg",
        "electrical": "/images/services/electrical/hero.jpeg",
        "cleaning": "/images/services/cleaning/hero.png",
        "packing-moving": "/images/services/moving/hero.jpeg",
        "outdoor": "/images/services/outdoor/hero.jpeg",
        "handyman": "/images/services/home-repairs/hero.jpeg"
      }
    }'::jsonb
  )
on conflict (setting_key) do update
set value_json = excluded.value_json;
