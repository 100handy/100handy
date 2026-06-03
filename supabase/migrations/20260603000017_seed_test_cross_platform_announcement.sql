insert into public.announcements (
  id,
  audience,
  placement,
  channel_scope,
  title,
  body,
  cta_label,
  cta_href,
  starts_at,
  ends_at,
  active
)
values (
  'announce_test_june_launch',
  'all',
  'dashboard',
  'both',
  'June Launch Test',
  'This is a live test announcement from the admin system. It should appear on the web homepage and both app dashboards.',
  'Browse services',
  '/services',
  now() - interval '5 minutes',
  null,
  true
)
on conflict (id) do update
set
  audience = excluded.audience,
  placement = excluded.placement,
  channel_scope = excluded.channel_scope,
  title = excluded.title,
  body = excluded.body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  active = excluded.active,
  updated_at = now();
