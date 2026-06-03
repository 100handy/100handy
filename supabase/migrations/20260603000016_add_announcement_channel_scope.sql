alter table public.announcements
  add column if not exists channel_scope text not null default 'both'
  check (channel_scope in ('both', 'web', 'app'));

drop index if exists idx_announcements_target;
create index if not exists idx_announcements_target
  on public.announcements(audience, placement, channel_scope, active);
