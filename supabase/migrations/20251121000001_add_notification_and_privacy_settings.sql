-- Add privacy settings columns to profiles table
-- Note: Notification preferences already exist in the notification_settings table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS privacy_location_sharing BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS privacy_profile_visibility BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS privacy_activity_status BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_data_collection BOOLEAN DEFAULT true;

-- Add comments for documentation
COMMENT ON COLUMN profiles.privacy_location_sharing IS 'User consent for sharing location for task matching';
COMMENT ON COLUMN profiles.privacy_profile_visibility IS 'User consent for profile visibility to taskers';
COMMENT ON COLUMN profiles.privacy_activity_status IS 'User consent for showing activity status on platform';
COMMENT ON COLUMN profiles.privacy_data_collection IS 'User consent for analytics data collection';
