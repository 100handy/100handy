-- Add professional profile fields to handy_profiles
-- These were previously stored in AsyncStorage only (tools, vehicles, quick facts, about me)

ALTER TABLE public.handy_profiles
ADD COLUMN IF NOT EXISTS tools jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS vehicles jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS quick_facts jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS about_me text,
ADD COLUMN IF NOT EXISTS sync_calendars boolean DEFAULT true;

COMMENT ON COLUMN handy_profiles.tools IS 'Array of tool names the professional has';
COMMENT ON COLUMN handy_profiles.vehicles IS 'Array of vehicle descriptions';
COMMENT ON COLUMN handy_profiles.quick_facts IS 'Array of quick facts for profile';
COMMENT ON COLUMN handy_profiles.about_me IS 'About me text for profile';
COMMENT ON COLUMN handy_profiles.sync_calendars IS 'Whether to sync with external calendars';
