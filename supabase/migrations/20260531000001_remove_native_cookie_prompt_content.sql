update public.app_content
set status = 'archived'
where platform = 'shared'
  and screen_key = 'client_profile'
  and section_key = 'privacy';

insert into public.app_content (platform, screen_key, section_key, field_key, value, status)
values
  ('shared', 'client_privacy_settings', 'hero', 'body', 'Manage how your information is shared and used in the app', 'published'),
  ('shared', 'client_privacy_settings', 'toggle_data', 'title', 'Optional Diagnostics', 'published'),
  ('shared', 'client_privacy_settings', 'toggle_data', 'body', 'Allow app diagnostics that help us improve reliability and performance', 'published')
on conflict (platform, screen_key, section_key, field_key) do update
set
  value = excluded.value,
  status = 'published',
  updated_at = now();
