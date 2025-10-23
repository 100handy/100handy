-- Add marketing SMS and push notification columns to notification_settings
ALTER TABLE notification_settings 
  ADD COLUMN IF NOT EXISTS marketing_sms BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS marketing_push BOOLEAN DEFAULT FALSE;

-- Update existing rows to set default values
UPDATE notification_settings 
  SET marketing_sms = FALSE, marketing_push = FALSE
  WHERE marketing_sms IS NULL OR marketing_push IS NULL;

