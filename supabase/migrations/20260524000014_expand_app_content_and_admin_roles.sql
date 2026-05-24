alter table public.profiles
  add column if not exists admin_role text;

update public.profiles
set admin_role = 'super_admin'
where role = 'admin'
  and admin_role is null;

alter table public.profiles
  drop constraint if exists profiles_admin_role_check;

alter table public.profiles
  add constraint profiles_admin_role_check
  check (
    admin_role is null
    or admin_role in (
      'super_admin',
      'content_admin',
      'ops_admin',
      'support_admin',
      'finance_admin',
      'seo_admin'
    )
  );

insert into public.site_pages (page_key, title, slug, template_key, status)
values
  ('cookie-settings', 'Cookie Settings', '/cookie-settings', 'standard', 'published'),
  ('100-handy-star', '100 Handy Star', '/100-handy-star', 'standard', 'published')
on conflict (page_key) do update
set
  title = excluded.title,
  slug = excluded.slug,
  template_key = excluded.template_key,
  status = excluded.status,
  updated_at = now();

insert into public.app_content (platform, screen_key, section_key, field_key, value, status)
values
  ('shared', 'client_home', 'hero', 'title', 'What task do you need done?', 'published'),
  ('shared', 'client_home', 'search', 'placeholder', 'Try: painting, moving, repairs', 'published'),
  ('shared', 'client_home', 'location', 'fallback_line_1', 'Set your location', 'published'),
  ('shared', 'client_home', 'location', 'fallback_line_2', '', 'published'),

  ('shared', 'client_tasks', 'header', 'title', 'Tasks', 'published'),
  ('shared', 'client_tasks', 'tabs', 'upcoming', 'Upcoming', 'published'),
  ('shared', 'client_tasks', 'tabs', 'completed', 'Completed', 'published'),
  ('shared', 'client_tasks', 'auth', 'title', 'Please sign in', 'published'),
  ('shared', 'client_tasks', 'auth', 'body', 'You need to be signed in to view your tasks.', 'published'),
  ('shared', 'client_tasks', 'auth', 'cta', 'Sign In', 'published'),
  ('shared', 'client_tasks', 'loading', 'text', 'Loading tasks...', 'published'),
  ('shared', 'client_tasks', 'error', 'title', 'Error loading tasks', 'published'),
  ('shared', 'client_tasks', 'error', 'body', 'Something went wrong. Please try again.', 'published'),
  ('shared', 'client_tasks', 'error', 'retry', 'Retry', 'published'),
  ('shared', 'client_tasks', 'empty', 'title', 'No Current Tasks', 'published'),
  ('shared', 'client_tasks', 'empty', 'body', 'Let us help you get the job done.\nBook a task and see it here.', 'published'),
  ('shared', 'client_tasks', 'footer', 'hint', 'Tap to view booking details', 'published'),

  ('shared', 'client_taskers', 'header', 'title', 'Pros', 'published'),
  ('shared', 'client_taskers', 'tabs', 'favourite', 'Favourite Pros', 'published'),
  ('shared', 'client_taskers', 'tabs', 'past', 'Past Pros', 'published'),
  ('shared', 'client_taskers', 'auth', 'title', 'Please sign in', 'published'),
  ('shared', 'client_taskers', 'auth', 'body', 'You need to be signed in to view your pros.', 'published'),
  ('shared', 'client_taskers', 'auth', 'cta', 'Sign In', 'published'),
  ('shared', 'client_taskers', 'loading', 'text', 'Loading pros...', 'published'),
  ('shared', 'client_taskers', 'error', 'title', 'Error loading pros', 'published'),
  ('shared', 'client_taskers', 'error', 'body', 'Something went wrong. Please try again.', 'published'),
  ('shared', 'client_taskers', 'error', 'retry', 'Retry', 'published'),
  ('shared', 'client_taskers', 'empty_favourite', 'title', 'No Favourite Pros', 'published'),
  ('shared', 'client_taskers', 'empty_favourite', 'body', 'Browse and book pros to add them\nto your favourites.', 'published'),
  ('shared', 'client_taskers', 'empty_past', 'title', 'No Past Pros', 'published'),
  ('shared', 'client_taskers', 'empty_past', 'body', 'Your previously booked pros\nwill appear here.', 'published'),

  ('shared', 'professional_announcements', 'header', 'title', 'Announcements', 'published'),
  ('shared', 'professional_announcements', 'empty', 'title', 'No new announcements', 'published')
on conflict (platform, screen_key, section_key, field_key) do update
set
  value = excluded.value,
  status = excluded.status,
  updated_at = now();
