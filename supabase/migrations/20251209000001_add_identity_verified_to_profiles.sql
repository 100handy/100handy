-- Add identity_verified column to profiles table for client identity verification
-- This column tracks whether a client user has completed Stripe Identity verification

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT FALSE;

-- Add index for querying verified users
CREATE INDEX IF NOT EXISTS idx_profiles_identity_verified ON profiles(identity_verified);

-- Add comment for documentation
COMMENT ON COLUMN profiles.identity_verified IS 'Whether the user has completed identity verification via Stripe Identity';
