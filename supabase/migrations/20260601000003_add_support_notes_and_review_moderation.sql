create table if not exists public.support_ticket_internal_notes (
  id text primary key default ('stin_' || replace(gen_random_uuid()::text, '-', '')),
  ticket_id text not null references public.support_tickets(id) on delete cascade,
  admin_id uuid not null references auth.users(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_support_ticket_internal_notes_ticket
  on public.support_ticket_internal_notes(ticket_id, created_at desc);

alter table public.support_ticket_internal_notes enable row level security;

drop policy if exists "Admins can read support ticket internal notes" on public.support_ticket_internal_notes;
create policy "Admins can read support ticket internal notes"
  on public.support_ticket_internal_notes for select
  using (public.is_admin());

drop policy if exists "Admins can manage support ticket internal notes" on public.support_ticket_internal_notes;
create policy "Admins can manage support ticket internal notes"
  on public.support_ticket_internal_notes for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.review_moderation_events (
  id text primary key default ('rme_' || replace(gen_random_uuid()::text, '-', '')),
  review_id text not null references public.reviews(id) on delete cascade,
  admin_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_review_moderation_events_review
  on public.review_moderation_events(review_id, created_at desc);

alter table public.review_moderation_events enable row level security;

drop policy if exists "Admins can read review moderation events" on public.review_moderation_events;
create policy "Admins can read review moderation events"
  on public.review_moderation_events for select
  using (public.is_admin());

drop policy if exists "Admins can manage review moderation events" on public.review_moderation_events;
create policy "Admins can manage review moderation events"
  on public.review_moderation_events for all
  using (public.is_admin())
  with check (public.is_admin());
