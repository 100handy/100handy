-- Fix conflicting UNIQUE constraints on reviews table
-- The initial schema created reviews_booking_id_key UNIQUE(booking_id) which only allows
-- one review per booking. The two-way reviews migration added reviews_booking_reviewer_unique
-- UNIQUE(booking_id, reviewer_type) to allow one review per reviewer type, but forgot to
-- drop the old constraint. Both constraints existing together means the old one still blocks
-- a second review on the same booking.

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_key;
