-- Add Stripe verification session ID to handy_profiles table
-- This allows linking Stripe Identity webhook events to users

ALTER TABLE public.handy_profiles
ADD COLUMN IF NOT EXISTS stripe_verification_session_id TEXT;

-- Create index for faster webhook lookups
CREATE INDEX IF NOT EXISTS handy_profiles_stripe_verification_session_id_idx
ON public.handy_profiles(stripe_verification_session_id);

-- Comment on new column
COMMENT ON COLUMN public.handy_profiles.stripe_verification_session_id IS 'Stripe Identity verification session ID for webhook event correlation';
