-- Add hierarchical support to categories table
-- Allows categories to have parent-child relationships

-- Step 1: Add parent_id column
ALTER TABLE categories ADD COLUMN parent_id TEXT;

-- Step 2: Add foreign key constraint (self-referencing)
ALTER TABLE categories
  ADD CONSTRAINT categories_parent_id_fkey
  FOREIGN KEY (parent_id)
  REFERENCES categories(id)
  ON DELETE CASCADE;

-- Step 3: Add check constraint to prevent self-referencing
ALTER TABLE categories
  ADD CONSTRAINT categories_no_self_parent
  CHECK (id != parent_id);

-- Step 4: Add index for better query performance on parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Step 5: Add a level column to track hierarchy depth (optional but useful)
ALTER TABLE categories ADD COLUMN level INTEGER DEFAULT 0 NOT NULL;

-- Step 6: Add display_order column for custom ordering within same parent
ALTER TABLE categories ADD COLUMN display_order INTEGER DEFAULT 0 NOT NULL;

-- Comments for documentation
COMMENT ON COLUMN categories.parent_id IS 'References parent category ID for hierarchical structure. NULL for top-level categories.';
COMMENT ON COLUMN categories.level IS 'Hierarchy depth: 0 for main categories, 1 for subcategories, 2 for sub-subcategories, etc.';
COMMENT ON COLUMN categories.display_order IS 'Order in which categories should be displayed within the same parent level.';
