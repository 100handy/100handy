-- Add two_factor_enabled column to profiles table
-- This enables email-based two-factor authentication for users

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'two_factor_enabled'
    ) THEN
        ALTER TABLE "public"."profiles"
        ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;
    END IF;
END $$;

-- Add index for faster lookups of 2FA-enabled users
CREATE INDEX IF NOT EXISTS "profiles_two_factor_enabled_idx"
ON "public"."profiles" USING "btree" ("two_factor_enabled");
