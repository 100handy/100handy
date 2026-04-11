update auth.users as u
set raw_app_meta_data =
  coalesce(u.raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', p.role::text)
from public.profiles as p
where p.user_id = u.id
  and p.role is not null
  and coalesce(u.raw_app_meta_data->>'role', '') is distinct from p.role::text;
