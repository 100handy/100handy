-- Add payment_errors table for tracking payment processing failures
CREATE TABLE IF NOT EXISTS payment_errors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by booking
CREATE INDEX IF NOT EXISTS idx_payment_errors_booking_id ON payment_errors(booking_id);

-- Add payment_hold_release_failed flag to bookings for monitoring failed hold releases
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_hold_release_failed BOOLEAN DEFAULT FALSE;

COMMENT ON TABLE payment_errors IS 'Logs payment processing errors for monitoring and support intervention';
COMMENT ON COLUMN payment_errors.error_type IS 'Type of error: capture_failed, payout_failed, hold_release_failed, hold_release_error, retry_exhausted';
COMMENT ON COLUMN bookings.payment_hold_release_failed IS 'Flag for bookings where payment hold release failed on cancellation/decline';
