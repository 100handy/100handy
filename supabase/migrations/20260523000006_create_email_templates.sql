create table if not exists public.email_templates (
  id text primary key default generate_nanoid('emailtpl'::text),
  template_key text not null unique,
  title text not null,
  template_kind text not null default 'template' check (template_kind in ('template', 'campaign_draft')),
  recipient_group text not null default 'all',
  subject text not null,
  preview_text text,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_email_templates_kind on public.email_templates(template_kind, active);
create index if not exists idx_email_templates_recipient on public.email_templates(recipient_group);

drop trigger if exists email_templates_updated_at on public.email_templates;
create trigger email_templates_updated_at
  before update on public.email_templates
  for each row execute function public.touch_updated_at();

alter table public.email_templates enable row level security;

drop policy if exists "Admins can read email templates" on public.email_templates;
create policy "Admins can read email templates"
  on public.email_templates for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage email templates" on public.email_templates;
create policy "Admins can manage email templates"
  on public.email_templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.email_templates (
  template_key,
  title,
  template_kind,
  recipient_group,
  subject,
  preview_text,
  body,
  active
)
values
  (
    'welcome-users',
    'Welcome Email',
    'template',
    'new_users',
    'Welcome to 100Handy',
    'Welcome new customers to the platform.',
    'Hi {{first_name}},\n\nWelcome to 100Handy. We''re glad to have you here.\n\nThe 100Handy team',
    true
  ),
  (
    'task-confirmation',
    'Task Confirmation',
    'template',
    'client',
    'Your task is confirmed',
    'Sent after a booking is confirmed.',
    'Hi {{first_name}},\n\nYour task has been confirmed.\n\nBooking ID: {{booking_id}}\n\nThanks,\n100Handy',
    true
  ),
  (
    'new-task-alert',
    'New Task Alert',
    'template',
    'professional',
    'A new task is available',
    'Notifies professionals about a relevant new task.',
    'Hi {{first_name}},\n\nA new task matching your services is available.\n\nOpen the app to review it.\n\n100Handy',
    true
  ),
  (
    'password-reset',
    'Password Reset',
    'template',
    'all',
    'Reset your 100Handy password',
    'Password reset instructions.',
    'We received a request to reset your password.\n\nUse the secure link in the app to continue.',
    true
  )
on conflict (template_key) do update
set
  title = excluded.title,
  template_kind = excluded.template_kind,
  recipient_group = excluded.recipient_group,
  subject = excluded.subject,
  preview_text = excluded.preview_text,
  body = excluded.body,
  active = excluded.active;
