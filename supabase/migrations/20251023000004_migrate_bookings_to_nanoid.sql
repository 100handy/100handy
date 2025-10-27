-- Migrate bookings table from BIGSERIAL to nanoid
-- bookings depends on categories and addresses (already migrated)

-- Step 0: Drop RLS policies that reference bookings.id in other tables
DROP POLICY IF EXISTS "Booking parties can read payments" ON payments;
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;

-- Step 1: Add new nanoid column
ALTER TABLE bookings ADD COLUMN id_new TEXT;

-- Step 2: Backfill existing rows with nanoid
UPDATE bookings SET id_new = nanoid();

-- Step 3: Make id_new NOT NULL and UNIQUE
ALTER TABLE bookings ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE bookings ADD CONSTRAINT bookings_id_new_unique UNIQUE (id_new);

-- Step 4: Update foreign key references in dependent tables
-- bookings is referenced by: payments.booking_id, reviews.booking_id

-- 4a. payments.booking_id
ALTER TABLE payments ADD COLUMN booking_id_new TEXT;
UPDATE payments p 
  SET booking_id_new = b.id_new 
  FROM bookings b 
  WHERE p.booking_id = b.id;

-- 4b. reviews.booking_id
ALTER TABLE reviews ADD COLUMN booking_id_new TEXT;
UPDATE reviews r 
  SET booking_id_new = b.id_new 
  FROM bookings b 
  WHERE r.booking_id = b.id;

-- Step 5: Drop old foreign key constraints
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_booking_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_fkey;

-- Step 6: Drop old primary key and columns
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_pkey;
ALTER TABLE bookings DROP COLUMN id;
ALTER TABLE payments DROP COLUMN booking_id;
ALTER TABLE reviews DROP COLUMN booking_id;

-- Step 7: Rename new columns to old names
ALTER TABLE bookings RENAME COLUMN id_new TO id;
ALTER TABLE payments RENAME COLUMN booking_id_new TO booking_id;
ALTER TABLE reviews RENAME COLUMN booking_id_new TO booking_id;

-- Step 8: Add new primary key and foreign key constraints
ALTER TABLE bookings ADD PRIMARY KEY (id);
ALTER TABLE payments ADD CONSTRAINT payments_booking_id_fkey 
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_booking_id_fkey 
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Step 9: Recreate RLS policies that were dropped
CREATE POLICY "Booking parties can read payments" ON payments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = payments.booking_id 
        AND (b.customer_id = auth.uid() OR b.handy_id = auth.uid())
    )
  );

CREATE POLICY "Customers can create reviews" ON reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = customer_id 
    AND EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = reviews.booking_id 
        AND b.customer_id = auth.uid() 
        AND b.status = 'completed'::booking_status
    )
  );

-- Step 10: Drop the old sequence
DROP SEQUENCE IF EXISTS bookings_id_seq;

