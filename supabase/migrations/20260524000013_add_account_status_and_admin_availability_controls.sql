alter table public.profiles
  add column if not exists account_status text not null default 'active',
  add column if not exists status_reason text,
  add column if not exists status_updated_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_account_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_account_status_check
      check (account_status in ('active', 'paused', 'deleted'));
  end if;
end $$;

create index if not exists profiles_account_status_idx
  on public.profiles(account_status);

create index if not exists profiles_deleted_at_idx
  on public.profiles(deleted_at)
  where deleted_at is not null;

comment on column public.profiles.account_status is
  'Administrative account lifecycle state: active, paused, or deleted (soft-delete marker).';
comment on column public.profiles.status_reason is
  'Optional admin-authored reason for the current account lifecycle state.';
comment on column public.profiles.status_updated_at is
  'Timestamp of the last admin account status change.';
comment on column public.profiles.deleted_at is
  'Soft-delete timestamp when account_status = deleted.';

drop policy if exists "Admins can read all professional availability" on public.professional_availability;
create policy "Admins can read all professional availability"
  on public.professional_availability
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert professional availability" on public.professional_availability;
create policy "Admins can insert professional availability"
  on public.professional_availability
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update professional availability" on public.professional_availability;
create policy "Admins can update professional availability"
  on public.professional_availability
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete professional availability" on public.professional_availability;
create policy "Admins can delete professional availability"
  on public.professional_availability
  for delete
  to authenticated
  using (public.is_admin());
