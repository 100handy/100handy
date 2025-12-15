-- Add Stripe Connect account fields to handy_profiles
-- This enables professionals to receive payouts via Stripe Connect

-- Add Stripe Connect account ID and status columns
ALTER TABLE public.handy_profiles
ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_connect_status TEXT DEFAULT 'not_started';

-- Create index for lookups by Connect account ID
CREATE INDEX IF NOT EXISTS handy_profiles_stripe_connect_account_id_idx
ON public.handy_profiles(stripe_connect_account_id);

-- Add status constraint (using DO block to handle existing constraint)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'handy_profiles_stripe_connect_status_check'
    ) THEN
        ALTER TABLE public.handy_profiles
        ADD CONSTRAINT handy_profiles_stripe_connect_status_check
        CHECK (stripe_connect_status IN ('not_started', 'pending', 'active', 'restricted', 'disabled'));
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.handy_profiles.stripe_connect_account_id IS 'Stripe Connect Express account ID for receiving payouts';
COMMENT ON COLUMN public.handy_profiles.stripe_connect_status IS 'Status of Stripe Connect account: not_started, pending, active, restricted, disabled';
