-- Migration: Re-add payment_status CHECK constraint
-- Description: Adds CHECK constraint to bookings.payment_status to ensure data integrity.
-- The original constraint was dropped in 20251227000002 but never re-added with the full set of valid statuses.

ALTER TABLE bookings
ADD CONSTRAINT bookings_payment_status_check
CHECK (payment_status IS NULL OR payment_status IN ('pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded'));
