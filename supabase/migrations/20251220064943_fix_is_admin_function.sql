-- Fix the is_admin() function to bypass RLS and prevent infinite loop
-- The original function caused a deadlock because:
-- 1. User queries profiles table
-- 2. RLS policy "Admins can read all profiles" checks is_admin()
-- 3. is_admin() queries profiles table
-- 4. RLS triggers again... infinite loop!

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  -- This bypasses RLS when the function runs
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'::public.user_role
  );
END;
$$;
