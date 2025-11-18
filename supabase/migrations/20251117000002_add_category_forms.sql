-- Migration: Add category-specific form configuration system
-- This allows each category to have custom form fields with validation and conditional logic

-- ============================================================================
-- Create category_form_fields table
-- ============================================================================
CREATE TABLE IF NOT EXISTS category_form_fields (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('field'),
  category_id TEXT NOT NULL,

  -- Field configuration
  field_key TEXT NOT NULL, -- Unique key for this field within the category (e.g., 'furniture_type', 'tv_count')
  field_type TEXT NOT NULL CHECK (
    field_type IN ('text', 'select', 'radio', 'checkbox', 'number', 'textarea', 'address', 'date', 'time')
  ),
  label TEXT NOT NULL,
  description TEXT,
  placeholder TEXT,

  -- Options for select/radio/checkbox fields (stored as JSONB array)
  -- Example: [{"value": "ikea", "label": "IKEA furniture only"}, {"value": "non_ikea", "label": "Non-IKEA"}]
  options JSONB,

  -- Validation rules
  required BOOLEAN DEFAULT false,
  min_value INTEGER,
  max_value INTEGER,
  min_length INTEGER,
  max_length INTEGER,
  pattern TEXT, -- Regex pattern for text validation

  -- Conditional logic - show field only if condition is met
  -- Example: {"furniture_type": "ikea"} means show this field only if furniture_type equals "ikea"
  show_if JSONB,

  -- Display configuration
  display_order INTEGER DEFAULT 0,
  section TEXT, -- Group fields into sections (e.g., "Basic Info", "Add-ons", "Details")

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Foreign key
  CONSTRAINT fk_category_form_fields_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE,

  -- Unique constraint: each field_key must be unique within a category
  CONSTRAINT unique_category_field_key
    UNIQUE (category_id, field_key)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_category_form_fields_category
  ON category_form_fields(category_id);

CREATE INDEX IF NOT EXISTS idx_category_form_fields_order
  ON category_form_fields(category_id, display_order);

-- ============================================================================
-- Add form_responses column to bookings table
-- ============================================================================
-- This stores the structured responses from category-specific forms
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS form_responses JSONB DEFAULT '{}'::jsonb;

-- Add index for querying form responses
CREATE INDEX IF NOT EXISTS idx_bookings_form_responses
  ON bookings USING gin(form_responses);

-- Add comment explaining the structure
COMMENT ON COLUMN bookings.form_responses IS 'Structured JSON storage for category-specific form responses. Example: {"tv_count": 2, "mount_type": ["fixed", "tilting"], "wall_material": "drywall", "task_size": "medium", "vehicle_requirement": "not_needed"}';

-- ============================================================================
-- Create function to get all form fields for a category (including inherited from parent)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_category_form_fields(cat_id TEXT)
RETURNS TABLE (
  id TEXT,
  category_id TEXT,
  field_key TEXT,
  field_type TEXT,
  label TEXT,
  description TEXT,
  placeholder TEXT,
  options JSONB,
  required BOOLEAN,
  min_value INTEGER,
  max_value INTEGER,
  min_length INTEGER,
  max_length INTEGER,
  pattern TEXT,
  show_if JSONB,
  display_order INTEGER,
  section TEXT,
  source_category_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_hierarchy AS (
    -- Start with the given category
    SELECT c.id, c.parent_id, c.level, 0 as depth
    FROM categories c
    WHERE c.id = cat_id

    UNION ALL

    -- Recursively get parent categories
    SELECT c.id, c.parent_id, c.level, ch.depth + 1
    FROM categories c
    INNER JOIN category_hierarchy ch ON c.id = ch.parent_id
  )
  SELECT
    cff.id,
    cff.category_id,
    cff.field_key,
    cff.field_type,
    cff.label,
    cff.description,
    cff.placeholder,
    cff.options,
    cff.required,
    cff.min_value,
    cff.max_value,
    cff.min_length,
    cff.max_length,
    cff.pattern,
    cff.show_if,
    cff.display_order,
    cff.section,
    ch.id as source_category_id
  FROM category_form_fields cff
  INNER JOIN category_hierarchy ch ON ch.id = cff.category_id
  ORDER BY ch.depth DESC, cff.display_order ASC; -- Parent fields first, then ordered by display_order
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Enable RLS on category_form_fields
-- ============================================================================
ALTER TABLE category_form_fields ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read form fields (public data)
CREATE POLICY "Anyone can view form fields"
  ON category_form_fields
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can modify form fields
CREATE POLICY "Only admins can insert form fields"
  ON category_form_fields
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update form fields"
  ON category_form_fields
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete form fields"
  ON category_form_fields
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
