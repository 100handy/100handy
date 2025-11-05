-- Add foreign key constraints to bookings table
-- Run this ONLY if foreign keys don't exist

-- Customer foreign key
ALTER TABLE bookings
ADD CONSTRAINT bookings_customer_id_fkey
FOREIGN KEY (customer_id)
REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Handyman foreign key  
ALTER TABLE bookings
ADD CONSTRAINT bookings_handy_id_fkey
FOREIGN KEY (handy_id)
REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Category foreign key
ALTER TABLE bookings
ADD CONSTRAINT bookings_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE RESTRICT;

-- Address foreign key
ALTER TABLE bookings
ADD CONSTRAINT bookings_address_id_fkey
FOREIGN KEY (address_id)
REFERENCES addresses(id)
ON DELETE RESTRICT;
