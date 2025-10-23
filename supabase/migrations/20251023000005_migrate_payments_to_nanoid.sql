-- Migrate payments table from BIGSERIAL to nanoid
-- payments depends on bookings (already migrated)

-- Step 1: Add new nanoid column
ALTER TABLE payments ADD COLUMN id_new TEXT;

-- Step 2: Backfill existing rows with nanoid
UPDATE payments SET id_new = nanoid();

-- Step 3: Make id_new NOT NULL and UNIQUE
ALTER TABLE payments ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE payments ADD CONSTRAINT payments_id_new_unique UNIQUE (id_new);

-- Step 4: No tables reference payments.id, so no foreign key updates needed

-- Step 5: Drop old primary key
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE payments DROP COLUMN id;

-- Step 6: Rename new column to id
ALTER TABLE payments RENAME COLUMN id_new TO id;

-- Step 7: Add new primary key
ALTER TABLE payments ADD PRIMARY KEY (id);

-- Step 8: Drop the old sequence
DROP SEQUENCE IF EXISTS payments_id_seq;

