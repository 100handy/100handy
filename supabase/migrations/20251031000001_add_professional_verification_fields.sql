-- Add professional verification fields to handy_profiles table
-- This migration adds fields to store verification data collected during onboarding

-- Add verification fields to handy_profiles
ALTER TABLE public.handy_profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS apartment TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS county TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_document_type TEXT,
ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add check constraint for verification_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'handy_profiles_verification_status_check'
    ) THEN
        ALTER TABLE public.handy_profiles
        ADD CONSTRAINT handy_profiles_verification_status_check
        CHECK (verification_status IN ('pending', 'submitted', 'verified', 'rejected'));
    END IF;
END $$;

-- Add check constraint for verification_document_type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'handy_profiles_document_type_check'
    ) THEN
        ALTER TABLE public.handy_profiles
        ADD CONSTRAINT handy_profiles_document_type_check
        CHECK (verification_document_type IN ('driver_license', 'passport', 'national_id', 'residency_permit', NULL));
    END IF;
END $$;

-- Create index for verification status queries
CREATE INDEX IF NOT EXISTS handy_profiles_verification_status_idx
ON public.handy_profiles(verification_status);

-- Create index for onboarding status queries
CREATE INDEX IF NOT EXISTS handy_profiles_onboarding_completed_idx
ON public.handy_profiles(onboarding_completed);

-- Comment on new columns
COMMENT ON COLUMN public.handy_profiles.date_of_birth IS 'Professional date of birth for verification';
COMMENT ON COLUMN public.handy_profiles.street_address IS 'Professional street address for verification';
COMMENT ON COLUMN public.handy_profiles.apartment IS 'Professional apartment/suite number';
COMMENT ON COLUMN public.handy_profiles.city IS 'Professional city for verification';
COMMENT ON COLUMN public.handy_profiles.county IS 'Professional county for verification';
COMMENT ON COLUMN public.handy_profiles.verification_status IS 'Verification status: pending, submitted, verified, rejected';
COMMENT ON COLUMN public.handy_profiles.verification_document_type IS 'Type of document uploaded for verification';
COMMENT ON COLUMN public.handy_profiles.verification_document_url IS 'URL to uploaded verification document in storage';
COMMENT ON COLUMN public.handy_profiles.verification_submitted_at IS 'Timestamp when verification was submitted';
COMMENT ON COLUMN public.handy_profiles.onboarding_completed IS 'Whether professional has completed onboarding flow';
