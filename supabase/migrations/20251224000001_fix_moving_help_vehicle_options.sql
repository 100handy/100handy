-- Fix Moving help vehicle_requirement options
-- Spec says Moving help should only have car/truck options (no "not needed")
-- This matches the pattern of "Van assisted moving help"

UPDATE category_form_fields
SET options = '[{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb
WHERE category_id = 'cat_moving_help' AND field_key = 'vehicle_requirement';
