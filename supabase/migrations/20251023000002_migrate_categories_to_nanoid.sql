-- Migrate categories table from BIGSERIAL to nanoid
-- Categories has no dependencies, so we migrate it first

-- Step 1: Add new nanoid column
ALTER TABLE categories ADD COLUMN id_new TEXT;

-- Step 2: Backfill existing rows with nanoid
UPDATE categories SET id_new = nanoid();

-- Step 3: Make id_new NOT NULL and UNIQUE
ALTER TABLE categories ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE categories ADD CONSTRAINT categories_id_new_unique UNIQUE (id_new);

-- Step 4: Update foreign key references in dependent tables
-- categories is referenced by: bookings.category_id, handy_categories.category_id

-- 4a. bookings.category_id
ALTER TABLE bookings ADD COLUMN category_id_new TEXT;
UPDATE bookings b 
  SET category_id_new = c.id_new 
  FROM categories c 
  WHERE b.category_id = c.id;

-- 4b. handy_categories.category_id
ALTER TABLE handy_categories ADD COLUMN category_id_new TEXT;
UPDATE handy_categories hc 
  SET category_id_new = c.id_new 
  FROM categories c 
  WHERE hc.category_id = c.id;

-- Step 5: Drop old foreign key constraints
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_category_id_fkey;
ALTER TABLE handy_categories DROP CONSTRAINT IF EXISTS handy_categories_category_id_fkey;

-- Step 6: Drop old primary key and columns
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE categories DROP COLUMN id;
ALTER TABLE bookings DROP COLUMN category_id;
ALTER TABLE handy_categories DROP COLUMN category_id;

-- Step 7: Rename new columns to old names
ALTER TABLE categories RENAME COLUMN id_new TO id;
ALTER TABLE bookings RENAME COLUMN category_id_new TO category_id;
ALTER TABLE handy_categories RENAME COLUMN category_id_new TO category_id;

-- Step 8: Add new primary key and foreign key constraints
ALTER TABLE categories ADD PRIMARY KEY (id);
ALTER TABLE bookings ADD CONSTRAINT bookings_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
ALTER TABLE handy_categories ADD CONSTRAINT handy_categories_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Step 9: Drop the old sequence (no longer needed)
DROP SEQUENCE IF EXISTS categories_id_seq;

