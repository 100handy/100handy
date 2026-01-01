-- Add referral_code to profiles for refer-a-friend
-- Idempotent: safe to re-run

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referral_code text;

-- Ensure codes are unique when present
CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_unique
ON public.profiles (referral_code)
WHERE referral_code IS NOT NULL;


