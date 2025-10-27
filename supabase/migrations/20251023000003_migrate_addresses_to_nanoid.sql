-- Migrate addresses table from BIGSERIAL to nanoid
-- addresses depends only on auth.users, no migration dependencies

-- Step 1: Add new nanoid column
ALTER TABLE addresses ADD COLUMN id_new TEXT;

-- Step 2: Backfill existing rows with nanoid
UPDATE addresses SET id_new = nanoid();

-- Step 3: Make id_new NOT NULL and UNIQUE
ALTER TABLE addresses ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE addresses ADD CONSTRAINT addresses_id_new_unique UNIQUE (id_new);

-- Step 4: Update foreign key references in dependent tables
-- addresses is referenced by: bookings.address_id

ALTER TABLE bookings ADD COLUMN address_id_new TEXT;
UPDATE bookings b 
  SET address_id_new = a.id_new 
  FROM addresses a 
  WHERE b.address_id = a.id;

-- Step 5: Drop old foreign key constraints
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_address_id_fkey;

-- Step 6: Drop old primary key and columns
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE addresses DROP COLUMN id;
ALTER TABLE bookings DROP COLUMN address_id;

-- Step 7: Rename new columns to old names
ALTER TABLE addresses RENAME COLUMN id_new TO id;
ALTER TABLE bookings RENAME COLUMN address_id_new TO address_id;

-- Step 8: Add new primary key and foreign key constraints
ALTER TABLE addresses ADD PRIMARY KEY (id);
ALTER TABLE bookings ADD CONSTRAINT bookings_address_id_fkey 
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL;

-- Step 9: Drop the old sequence
DROP SEQUENCE IF EXISTS addresses_id_seq;

