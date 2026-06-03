create table if not exists public.payment_method_configs (
  id text primary key default generate_nanoid('paycfg'::text),
  display_name text not null,
  provider_key text not null,
  method_type text not null check (method_type in ('gateway', 'payout', 'wallet', 'bank_transfer')),
  status text not null default 'pending' check (status in ('active', 'inactive', 'pending')),
  public_enabled boolean not null default false,
  supported_currencies text[] not null default '{}'::text[],
  config_reference text null,
  notes text null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(provider_key)
);

drop trigger if exists payment_method_configs_updated_at on public.payment_method_configs;
create trigger payment_method_configs_updated_at
  before update on public.payment_method_configs
  for each row execute function public.touch_updated_at();

alter table public.payment_method_configs enable row level security;

drop policy if exists "Admins can read payment method configs" on public.payment_method_configs;
create policy "Admins can read payment method configs"
  on public.payment_method_configs for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert payment method configs" on public.payment_method_configs;
create policy "Admins can insert payment method configs"
  on public.payment_method_configs for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update payment method configs" on public.payment_method_configs;
create policy "Admins can update payment method configs"
  on public.payment_method_configs for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete payment method configs" on public.payment_method_configs;
create policy "Admins can delete payment method configs"
  on public.payment_method_configs for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.service_pricing_rules (
  id text primary key default generate_nanoid('price'::text),
  category_id text not null references public.categories(id) on delete cascade,
  location_area_id text null references public.location_areas(id) on delete set null,
  currency_code text not null default 'GBP',
  rate_kind text not null default 'hourly' check (rate_kind in ('hourly', 'fixed')),
  base_rate_cents integer not null check (base_rate_cents >= 0),
  active boolean not null default true,
  notes text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(category_id, location_area_id, currency_code, rate_kind)
);

drop trigger if exists service_pricing_rules_updated_at on public.service_pricing_rules;
create trigger service_pricing_rules_updated_at
  before update on public.service_pricing_rules
  for each row execute function public.touch_updated_at();

alter table public.service_pricing_rules enable row level security;

drop policy if exists "Admins can read service pricing rules" on public.service_pricing_rules;
create policy "Admins can read service pricing rules"
  on public.service_pricing_rules for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert service pricing rules" on public.service_pricing_rules;
create policy "Admins can insert service pricing rules"
  on public.service_pricing_rules for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update service pricing rules" on public.service_pricing_rules;
create policy "Admins can update service pricing rules"
  on public.service_pricing_rules for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete service pricing rules" on public.service_pricing_rules;
create policy "Admins can delete service pricing rules"
  on public.service_pricing_rules for delete
  to authenticated
  using (public.is_admin());

insert into public.payment_method_configs (display_name, provider_key, method_type, status, public_enabled, supported_currencies, config_reference, notes, sort_order)
values
  ('Stripe Connect', 'stripe_connect', 'gateway', 'active', true, array['GBP'], 'Supabase secrets / Stripe dashboard', 'Primary card and wallet payment gateway.', 10),
  ('Apple Pay', 'apple_pay', 'wallet', 'active', true, array['GBP'], 'Handled through Stripe wallet support', 'Available on supported Apple devices.', 20),
  ('Bank Transfer', 'bank_transfer', 'payout', 'pending', false, array['GBP'], 'Manual / payout ops', 'Use for manual payout fallback only.', 30)
on conflict (provider_key) do update
set
  display_name = excluded.display_name,
  method_type = excluded.method_type,
  status = excluded.status,
  public_enabled = excluded.public_enabled,
  supported_currencies = excluded.supported_currencies,
  config_reference = excluded.config_reference,
  notes = excluded.notes,
  sort_order = excluded.sort_order;
