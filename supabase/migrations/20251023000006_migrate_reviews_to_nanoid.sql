-- Migrate reviews table from BIGSERIAL to nanoid
-- reviews depends on bookings (already migrated)

-- Step 1: Add new nanoid column
ALTER TABLE reviews ADD COLUMN id_new TEXT;

-- Step 2: Backfill existing rows with nanoid
UPDATE reviews SET id_new = nanoid();

-- Step 3: Make id_new NOT NULL and UNIQUE
ALTER TABLE reviews ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE reviews ADD CONSTRAINT reviews_id_new_unique UNIQUE (id_new);

-- Step 4: No tables reference reviews.id, so no foreign key updates needed

-- Step 5: Drop old primary key
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE reviews DROP COLUMN id;

-- Step 6: Rename new column to id
ALTER TABLE reviews RENAME COLUMN id_new TO id;

-- Step 7: Add new primary key
ALTER TABLE reviews ADD PRIMARY KEY (id);

-- Step 8: Drop the old sequence
DROP SEQUENCE IF EXISTS reviews_id_seq;

