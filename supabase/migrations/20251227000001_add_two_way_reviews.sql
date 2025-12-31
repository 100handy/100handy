-- Add columns for two-way review system
-- reviewer_type: 'customer' (client reviews professional) or 'handy' (professional reviews client)
-- private_notes: Only for professional reviews, visible only to the professional

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS reviewer_type TEXT NOT NULL DEFAULT 'customer'
  CHECK (reviewer_type IN ('customer', 'handy'));

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS private_notes TEXT;

-- Add unique constraint for booking + reviewer_type combo
-- This allows one review per booking per reviewer type (client can review, and pro can review same booking)
ALTER TABLE reviews
ADD CONSTRAINT reviews_booking_reviewer_unique UNIQUE (booking_id, reviewer_type);

-- Add comments for documentation
COMMENT ON COLUMN reviews.reviewer_type IS 'Type of reviewer: customer (client reviews pro) or handy (pro reviews client)';
COMMENT ON COLUMN reviews.private_notes IS 'Private notes by professional about client, only visible to that professional';

-- Update RLS policies to allow professionals to create reviews
-- First, drop existing policies if any
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
DROP POLICY IF EXISTS "Professionals can create reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Users can read their own reviews" ON reviews;
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;  -- IMPORTANT: Drop this to protect private_notes

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Customers can create reviews for completed bookings they made
CREATE POLICY "Customers can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    AND reviewer_type = 'customer'
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reviews.booking_id
      AND b.customer_id = auth.uid()
      AND b.status = 'completed'
    )
  );

-- Professionals can create reviews for completed bookings they worked on
CREATE POLICY "Professionals can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = handy_id
    AND reviewer_type = 'handy'
    AND EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = reviews.booking_id
      AND b.handy_id = auth.uid()
      AND b.status = 'completed'
    )
  );

-- Anyone can read customer reviews (public, for professional profiles)
CREATE POLICY "Anyone can read customer reviews" ON reviews
  FOR SELECT USING (
    reviewer_type = 'customer'
  );

-- Professionals can only read their own reviews of clients (private notes)
CREATE POLICY "Professionals can read their own client reviews" ON reviews
  FOR SELECT USING (
    reviewer_type = 'handy'
    AND auth.uid() = handy_id
  );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (
    (reviewer_type = 'customer' AND auth.uid() = customer_id)
    OR (reviewer_type = 'handy' AND auth.uid() = handy_id)
  );
