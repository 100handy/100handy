-- ================================================================
-- Add Foreign Key Constraint to handy_profiles
-- ================================================================
-- Run this in Supabase Dashboard > SQL Editor
-- This adds the missing foreign key relationship
-- ================================================================

-- Add foreign key constraint from handy_profiles to profiles
ALTER TABLE handy_profiles
ADD CONSTRAINT handy_profiles_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Verify the constraint was added
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name='handy_profiles';
