-- Add missing form fields to match the category specification
-- This migration adds:
-- 1. vehicle_requirement to 6 Home Repairs subcategories
-- 2. location field to 6 Outdoor subcategories

-- ============================================
-- HOME REPAIRS: Add missing vehicle_requirement fields
-- ============================================

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, options, required, display_order, section)
VALUES
  ('ff_door_vehicle', 'cat_door_cabinet_repairs', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details'),
  ('ff_window_vehicle', 'cat_window_blinds_repair', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details'),
  ('ff_sealing_vehicle', 'cat_sealing_caulking', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details'),
  ('ff_flooring_vehicle', 'cat_flooring_tiling', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details'),
  ('ff_carpentry_vehicle', 'cat_light_carpentry', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details'),
  ('ff_painting_vehicle', 'cat_indoor_painting', 'vehicle_requirement', 'radio', 'Vehicle Requirements',
   '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb,
   true, 11, 'task_details');

-- ============================================
-- OUTDOOR: Add missing location fields
-- ============================================

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, required, display_order, section)
VALUES
  ('ff_garden_location', 'cat_gardening', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location'),
  ('ff_lawn_location', 'cat_lawn_care', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location'),
  ('ff_landscape_location', 'cat_landscaping', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location'),
  ('ff_leaf_location', 'cat_leaf_raking', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location'),
  ('ff_gutter_location', 'cat_roof_gutter', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location'),
  ('ff_branch_location', 'cat_branch_hedge', 'location', 'address', 'Location', 'Where is the service needed?', true, 1, 'location');
