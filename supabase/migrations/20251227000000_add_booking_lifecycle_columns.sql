-- Add columns for professional booking lifecycle management
-- These columns track job progress and decline reasons

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS decline_reason TEXT,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN bookings.decline_reason IS 'Reason provided by professional when declining a booking request';
COMMENT ON COLUMN bookings.started_at IS 'Timestamp when professional started the job';
COMMENT ON COLUMN bookings.completed_at IS 'Timestamp when professional completed the job';
