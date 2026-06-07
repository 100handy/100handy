-- Outreach MVP schema
-- Keeps pre-conversion customer and worker leads separate from production
-- bookings, support messages, and in-app conversations.

create table if not exists public.outreach_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  name text not null,
  platform text not null,
  source_type text not null check (source_type in ('customer_finder', 'worker_finder', 'mixed')),
  url text,
  location text,
  service_type text,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.outreach_leads (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.outreach_sources(id) on delete set null,
  lead_type text not null check (lead_type in ('customer', 'worker')),
  source_platform text not null,
  source_url text,
  source_posted_at timestamptz,
  profile_name text,
  profile_url text,
  business_name text,
  location text,
  coverage_area text,
  service_type text not null,
  urgency text check (urgency in ('low', 'medium', 'high')),
  intent_strength text check (intent_strength in ('low', 'medium', 'high')),
  source_confidence text check (source_confidence in ('low', 'medium', 'high')),
  raw_text text not null,
  evidence_text text,
  public_contact_method text check (
    public_contact_method in ('website', 'email', 'phone', 'social_profile', 'profile_only', 'unknown')
  ),
  contact_detail text,
  contact_allowed text not null default 'unknown' check (contact_allowed in ('yes', 'no', 'unknown')),
  ai_score integer check (ai_score between 1 and 10),
  ai_summary text,
  status text not null default 'new' check (
    status in ('new', 'reviewed', 'approved', 'contacted', 'replied', 'rejected', 'closed')
  ),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  do_not_contact_reason text,
  duplicate_check_key text,
  converted_user_id uuid references auth.users(id) on delete set null,
  converted_booking_id text references public.bookings(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.outreach_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.outreach_leads(id) on delete cascade,
  message_type text not null default 'initial' check (message_type in ('initial', 'follow_up', 'reply_note')),
  channel text not null default 'manual' check (
    channel in ('manual', 'email', 'phone', 'website_form', 'social_dm', 'comment', 'other')
  ),
  draft_text text not null,
  personalised_reason text,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  delivery_status text not null default 'not_sent' check (
    delivery_status in ('not_sent', 'queued', 'sent', 'failed', 'replied')
  ),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  sent_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz,
  external_message_url text,
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.outreach_leads(id) on delete cascade,
  message_id uuid references public.outreach_messages(id) on delete set null,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped', 'cancelled')),
  notes text,
  completed_at timestamptz,
  completed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_outreach_sources_platform_active
  on public.outreach_sources(platform, active);

create index if not exists idx_outreach_leads_status_created
  on public.outreach_leads(status, created_at desc);

create index if not exists idx_outreach_leads_approval_status
  on public.outreach_leads(approval_status, created_at desc);

create index if not exists idx_outreach_leads_type_service_location
  on public.outreach_leads(lead_type, service_type, location);

create index if not exists idx_outreach_leads_duplicate_check_key
  on public.outreach_leads(duplicate_check_key)
  where duplicate_check_key is not null;

create index if not exists idx_outreach_messages_lead_created
  on public.outreach_messages(lead_id, created_at desc);

create index if not exists idx_outreach_messages_approval_delivery
  on public.outreach_messages(approval_status, delivery_status, created_at desc);

create index if not exists idx_outreach_follow_ups_status_due
  on public.outreach_follow_ups(status, due_at);

drop trigger if exists outreach_sources_updated_at on public.outreach_sources;
create trigger outreach_sources_updated_at
  before update on public.outreach_sources
  for each row execute function public.touch_updated_at();

drop trigger if exists outreach_leads_updated_at on public.outreach_leads;
create trigger outreach_leads_updated_at
  before update on public.outreach_leads
  for each row execute function public.touch_updated_at();

drop trigger if exists outreach_messages_updated_at on public.outreach_messages;
create trigger outreach_messages_updated_at
  before update on public.outreach_messages
  for each row execute function public.touch_updated_at();

drop trigger if exists outreach_follow_ups_updated_at on public.outreach_follow_ups;
create trigger outreach_follow_ups_updated_at
  before update on public.outreach_follow_ups
  for each row execute function public.touch_updated_at();

alter table public.outreach_sources enable row level security;
alter table public.outreach_leads enable row level security;
alter table public.outreach_messages enable row level security;
alter table public.outreach_follow_ups enable row level security;

drop policy if exists "Admins can manage outreach sources" on public.outreach_sources;
create policy "Admins can manage outreach sources"
  on public.outreach_sources for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage outreach leads" on public.outreach_leads;
create policy "Admins can manage outreach leads"
  on public.outreach_leads for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage outreach messages" on public.outreach_messages;
create policy "Admins can manage outreach messages"
  on public.outreach_messages for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage outreach follow ups" on public.outreach_follow_ups;
create policy "Admins can manage outreach follow ups"
  on public.outreach_follow_ups for all
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.outreach_sources is
  'Approved lead discovery sources for the 100Handy outreach MVP.';
comment on table public.outreach_leads is
  'Customer and worker leads found before they become 100Handy users or bookings.';
comment on table public.outreach_messages is
  'AI-drafted outreach messages queued for human approval or permitted-channel sending.';
comment on table public.outreach_follow_ups is
  'Manual follow-up reminders for outreach leads.';
