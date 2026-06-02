create table if not exists public.disputes (
  id text primary key default generate_nanoid('dispute'::text),
  booking_id text not null references public.bookings(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  provider_id uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'refunded', 'rejected')),
  subject text not null,
  description text not null,
  resolution_summary text,
  refund_amount_cents integer,
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_disputes_status on public.disputes(status);
create index if not exists idx_disputes_booking_id on public.disputes(booking_id);
create index if not exists idx_disputes_assigned_to on public.disputes(assigned_to);
create index if not exists idx_disputes_customer_id on public.disputes(customer_id);
create index if not exists idx_disputes_provider_id on public.disputes(provider_id);

create table if not exists public.dispute_messages (
  id text primary key default generate_nanoid('dispute_message'::text),
  dispute_id text not null references public.disputes(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  internal_only boolean not null default false,
  attachment_url text,
  attachment_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_dispute_messages_dispute_id on public.dispute_messages(dispute_id, created_at);

create table if not exists public.service_areas (
  id text primary key default generate_nanoid('service_area'::text),
  city text not null,
  postcode_prefix text not null,
  enabled boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city, postcode_prefix)
);

create index if not exists idx_service_areas_enabled on public.service_areas(enabled);
create index if not exists idx_service_areas_city on public.service_areas(city);

create table if not exists public.provider_service_areas (
  id text primary key default generate_nanoid('provider_service_area'::text),
  service_area_id text not null references public.service_areas(id) on delete cascade,
  provider_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (service_area_id, provider_id)
);

create index if not exists idx_provider_service_areas_area_id on public.provider_service_areas(service_area_id);
create index if not exists idx_provider_service_areas_provider_id on public.provider_service_areas(provider_id);

create or replace function public.update_disputes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_disputes_updated_at on public.disputes;
create trigger trg_disputes_updated_at
before update on public.disputes
for each row execute function public.update_disputes_updated_at();

create or replace function public.update_service_areas_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_service_areas_updated_at on public.service_areas;
create trigger trg_service_areas_updated_at
before update on public.service_areas
for each row execute function public.update_service_areas_updated_at();

alter table public.disputes enable row level security;
alter table public.dispute_messages enable row level security;
alter table public.service_areas enable row level security;
alter table public.provider_service_areas enable row level security;

drop policy if exists "Admins can manage disputes" on public.disputes;
create policy "Admins can manage disputes"
on public.disputes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage dispute messages" on public.dispute_messages;
create policy "Admins can manage dispute messages"
on public.dispute_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage service areas" on public.service_areas;
create policy "Admins can manage service areas"
on public.service_areas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage provider service areas" on public.provider_service_areas;
create policy "Admins can manage provider service areas"
on public.provider_service_areas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

comment on table public.disputes is 'Admin-managed booking disputes between customers and providers.';
comment on table public.dispute_messages is 'Conversation and internal notes associated with disputes.';
comment on column public.dispute_messages.internal_only is 'True for admin-only notes not visible to marketplace participants.';
comment on table public.service_areas is 'Admin-managed cities and postcode coverage used to control marketplace availability.';
comment on table public.provider_service_areas is 'Explicit provider assignment to service areas for admin operations.';
