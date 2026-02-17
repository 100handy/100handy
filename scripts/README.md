# Admin Setup Scripts

This folder is reserved for admin-only SQL scripts.

## Current status

`create-admin.sql` and `verify-admin.sql` are currently not checked into this repository.
If you need them, create local copies in this folder and run them in Supabase SQL Editor.

## Recommended script names

- `create-admin.sql`: create or update a profile with `admin` role.
- `verify-admin.sql`: verify role assignment, auth/profile consistency, and admin access checks.

## Related locations

- General-purpose SQL scripts now live in `supabase/scripts/`.
- Seed entrypoint is `supabase/seed.sql`.
- Additional seed scripts live in `supabase/seeds/`.
