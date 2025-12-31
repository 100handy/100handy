-- Add payment fields to bookings table for payment lifecycle tracking
-- This supports the full payment flow: authorize -> capture -> payout

-- Payout tracking fields
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending'
  CHECK (payout_status IN ('pending', 'transferred', 'failed')),
ADD COLUMN IF NOT EXISTS payout_amount_cents INTEGER,
ADD COLUMN IF NOT EXISTS platform_fee_cents INTEGER,
ADD COLUMN IF NOT EXISTS transfer_id TEXT;

-- Add comments for documentation
COMMENT ON COLUMN bookings.payment_intent_id IS 'Stripe PaymentIntent ID for this booking';
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: pending, authorized, captured, failed, cancelled, refunded';
COMMENT ON COLUMN bookings.payout_status IS 'Payout status to professional: pending, transferred, failed';
COMMENT ON COLUMN bookings.payout_amount_cents IS 'Amount transferred to professional in cents (after platform fee)';
COMMENT ON COLUMN bookings.platform_fee_cents IS 'Platform fee deducted from payment in cents';
COMMENT ON COLUMN bookings.transfer_id IS 'Stripe Transfer ID for the payout to professional';

-- Update payment_status check constraint
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

-- Note: payment_status is TEXT without explicit constraint currently
-- If you need to add constraint later:
-- ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check
-- CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded'));
