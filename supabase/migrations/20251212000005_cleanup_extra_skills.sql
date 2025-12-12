-- Migration: Clean up extra skills and categories not in the specification document
-- This removes duplicate skills and categories that were seeded but not in the official 100 Handy document

-- First, delete skill_sets and skill_tools for skills that will be deleted (cascade should handle this, but being explicit)
DELETE FROM skill_sets WHERE skill_id IN (
  SELECT id FROM skills WHERE name IN (
    'Bookshelf Assembly',
    'Move In/Out Cleaning',
    'Picture Hanging',
    'Shelf Mounting',
    'Heavy Lifting',
    'Packing',
    'Lawn Mowing',
    'Yard Cleanup'
  )
);

DELETE FROM skill_tools WHERE skill_id IN (
  SELECT id FROM skills WHERE name IN (
    'Bookshelf Assembly',
    'Move In/Out Cleaning',
    'Picture Hanging',
    'Shelf Mounting',
    'Heavy Lifting',
    'Packing',
    'Lawn Mowing',
    'Yard Cleanup'
  )
);

-- Delete duplicate/extra skills not in document
DELETE FROM skills WHERE name IN (
  'Bookshelf Assembly',      -- Assembly: not in doc
  'Move In/Out Cleaning',    -- Cleaning: not in doc
  'Picture Hanging',         -- Mounting: duplicate of "Hanging Pictures and Artwork"
  'Shelf Mounting',          -- Mounting: duplicate of "Put Up Shelves"
  'Heavy Lifting',           -- Moving: duplicate of "Heavy Lifting and Loading"
  'Packing',                 -- Moving: duplicate of "Packing and Moving"
  'Lawn Mowing',             -- Outdoor help: duplicate of "Lawn Care"
  'Yard Cleanup'             -- Outdoor help: not in doc
);

-- Delete skill_sets and skill_tools for extra categories
DELETE FROM skill_sets WHERE skill_id IN (
  SELECT id FROM skills WHERE category IN (
    'Home Improvements',
    'Other',
    'Painting',
    'Personal Assistance'
  )
);

DELETE FROM skill_tools WHERE skill_id IN (
  SELECT id FROM skills WHERE category IN (
    'Home Improvements',
    'Other',
    'Painting',
    'Personal Assistance'
  )
);

-- Delete extra categories and their skills
DELETE FROM skills WHERE category IN (
  'Home Improvements',    -- Not in doc (has: Drywall Repair, General Repairs, Minor Plumbing)
  'Other',                -- Not in doc (has: Delivery, Pet Care, Wait in Line)
  'Painting',             -- Not in doc (has: Exterior Painting, Interior Painting, Touch Up)
  'Personal Assistance'   -- Not in doc (has: Errands, Organization, Shopping)
);
