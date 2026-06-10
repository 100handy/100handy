-- Local admin-web E2E seed.
-- Apply after `pnpm dlx supabase db reset` when running `pnpm --dir apps/admin-web test:e2e:local`.

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin-e2e@100handy.test',
  '',
  now(),
  '{"role":"admin"}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
)
on conflict (id) do update set
  email = excluded.email,
  raw_app_meta_data = excluded.raw_app_meta_data,
  updated_at = now();

insert into public.profiles (
  user_id,
  role,
  admin_role,
  first_name,
  last_name,
  account_status
) values (
  '00000000-0000-4000-8000-000000000001',
  'admin',
  'super_admin',
  'E2E',
  'Admin',
  'active'
)
on conflict (user_id) do update set
  role = excluded.role,
  admin_role = excluded.admin_role,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  account_status = excluded.account_status;
