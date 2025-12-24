-- Add form fields for all subcategories
-- This migration adds dynamic form fields based on the category specification

-- ============================================
-- HELPER: Common field options as JSONB
-- ============================================

-- Task size options
-- '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'

-- Vehicle requirement options
-- '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'

-- ============================================
-- ASSEMBLY SUBCATEGORIES
-- ============================================

-- Furniture assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_furniture_type', 'cat_furniture_assembly', 'furniture_type', 'radio', 'What type of furniture do you need assembled or disassembled?', NULL, '[{"value":"ikea_only","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, 1, 'basic_info'),
  ('ff_furniture_task_size', 'cat_furniture_assembly', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_furniture_vehicle', 'cat_furniture_assembly', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_furniture_details', 'cat_furniture_assembly', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- IKEA assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, display_order, section)
VALUES
  ('ff_ikea_code', 'cat_ikea_assembly', 'ikea_code', 'text', 'IKEA Product Code', 'Enter the IKEA article number (found on product page or receipt)', 'e.g., 203.542.78', NULL, false, 1, 'basic_info'),
  ('ff_ikea_task_size', 'cat_ikea_assembly', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_ikea_vehicle', 'cat_ikea_assembly', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_ikea_details', 'cat_ikea_assembly', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, NULL, false, 100, 'additional_info');

-- Office furniture assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_office_type', 'cat_office_furniture_assembly', 'furniture_type', 'radio', 'What type of furniture do you need assembled or disassembled?', NULL, '[{"value":"ikea_only","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, 1, 'basic_info'),
  ('ff_office_task_size', 'cat_office_furniture_assembly', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_office_vehicle', 'cat_office_furniture_assembly', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_office_details', 'cat_office_furniture_assembly', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Wardrobe assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_wardrobe_type', 'cat_wardrobe_assembly', 'furniture_type', 'radio', 'What type of furniture do you need assembled or disassembled?', NULL, '[{"value":"ikea_only","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, 1, 'basic_info'),
  ('ff_wardrobe_task_size', 'cat_wardrobe_assembly', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_wardrobe_vehicle', 'cat_wardrobe_assembly', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_wardrobe_details', 'cat_wardrobe_assembly', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Crib assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_crib_type', 'cat_crib_assembly', 'furniture_type', 'radio', 'What type of furniture do you need assembled or disassembled?', NULL, '[{"value":"ikea_only","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, 1, 'basic_info'),
  ('ff_crib_task_size', 'cat_crib_assembly', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_crib_vehicle', 'cat_crib_assembly', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_crib_details', 'cat_crib_assembly', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- MOUNTING SUBCATEGORIES
-- ============================================

-- TV mounting (with specific fields)
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_tv_count', 'cat_tv_mounting', 'tv_count', 'select', 'How many TVs do you need to be installed?', NULL, '[{"value":"1","label":"1"},{"value":"2","label":"2"},{"value":"3","label":"3"},{"value":"4","label":"4"},{"value":"5","label":"5"}]'::jsonb, true, 1, 'basic_info'),
  ('ff_tv_helper', 'cat_tv_mounting', 'helper_available', 'radio', 'Will someone be around to help your Tasker lift the TV into place?', 'Larger TVs (60" +) may require a second person for safe mounting.', '[{"value":"available","label":"Someone will be around"},{"value":"not_available","label":"No one will be around. 1 or more TVs above 60\""},{"value":"not_needed","label":"Not needed. No TVs above 60\""},{"value":"unsure","label":"Unsure if needed"}]'::jsonb, true, 2, 'basic_info'),
  ('ff_tv_mount_type', 'cat_tv_mounting', 'mount_type', 'checkbox', 'What type of TV mount do you want to use?', 'Select all that apply.', '[{"value":"fixed","label":"Fixed / low profile"},{"value":"tilting","label":"Tilting"},{"value":"articulating","label":"Articulating / full motion"},{"value":"other","label":"Other / Not sure"}]'::jsonb, true, 3, 'mount_details'),
  ('ff_tv_wall_material', 'cat_tv_mounting', 'wall_material', 'radio', 'What kind of material are your walls made of?', 'You can easily test this by knocking on the wall. A hollow sound means your wall is most likely drywall, plaster, or wood. If you hear no echo, your wall is more likely brick or concrete.', '[{"value":"drywall","label":"Drywall, plaster, or wood"},{"value":"brick","label":"Brick or concrete"},{"value":"metal","label":"Metal"},{"value":"other","label":"Other / not sure"}]'::jsonb, true, 4, 'mount_details'),
  ('ff_tv_addons', 'cat_tv_mounting', 'addon_services', 'checkbox', 'Will you be needing any of the following add-on services?', 'Select all that apply.', '[{"value":"hide_wires","label":"Hide wires behind the wall"},{"value":"speakers","label":"Install speakers or soundbars"},{"value":"device_setup","label":"Device & accessory setup"}]'::jsonb, false, 5, 'addons'),
  ('ff_tv_device_setup', 'cat_tv_mounting', 'device_setup_details', 'textarea', 'Device setup details', 'Please describe the device and accessory setup needed.', NULL, false, 6, 'addons'),
  ('ff_tv_task_size', 'cat_tv_mounting', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_tv_vehicle', 'cat_tv_mounting', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_tv_details', 'cat_tv_mounting', 'additional_details', 'textarea', 'Anything else?', 'Extra details help prepare your Tasker for the job.', NULL, false, 100, 'additional_info');

-- Wall mounting
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_wall_task_size', 'cat_wall_mounting', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_wall_vehicle', 'cat_wall_mounting', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_wall_details', 'cat_wall_mounting', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Put up shelves
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_shelves_task_size', 'cat_shelves', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_shelves_vehicle', 'cat_shelves', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_shelves_details', 'cat_shelves', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Hanging pictures and artwork
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_pictures_task_size', 'cat_pictures_artwork', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_pictures_vehicle', 'cat_pictures_artwork', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_pictures_details', 'cat_pictures_artwork', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Light installation (Mounting)
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_light_m_task_size', 'cat_light_installation', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_light_m_vehicle', 'cat_light_installation', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_light_m_details', 'cat_light_installation', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Install curtains and blinds
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_curtains_task_size', 'cat_curtains_blinds', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_curtains_vehicle', 'cat_curtains_blinds', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_curtains_details', 'cat_curtains_blinds', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- HOME REPAIRS SUBCATEGORIES
-- ============================================

-- Minor home repairs
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_minor_task_size', 'cat_minor_repairs', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_minor_vehicle', 'cat_minor_repairs', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_minor_details', 'cat_minor_repairs', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Door, cabinet, and furniture repairs
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_door_task_size', 'cat_door_cabinet_repairs', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_door_details', 'cat_door_cabinet_repairs', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Window and blinds repair
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_window_task_size', 'cat_window_blinds_repair', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_window_details', 'cat_window_blinds_repair', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Sealing and caulking
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_sealing_task_size', 'cat_sealing_caulking', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_sealing_details', 'cat_sealing_caulking', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Flooring and tiling help
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_flooring_task_size', 'cat_flooring_tiling', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_flooring_details', 'cat_flooring_tiling', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Light carpentry
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_carpentry_task_size', 'cat_light_carpentry', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_carpentry_details', 'cat_light_carpentry', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Indoor painting
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_painting_task_size', 'cat_indoor_painting', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_painting_details', 'cat_indoor_painting', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- PLUMBING SUBCATEGORIES
-- ============================================

-- Leak fixing
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_leak_task_size', 'cat_leak_fixing', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_leak_vehicle', 'cat_leak_fixing', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_leak_details', 'cat_leak_fixing', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Drain unblocking
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_drain_task_size', 'cat_drain_unblocking', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_drain_vehicle', 'cat_drain_unblocking', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_drain_details', 'cat_drain_unblocking', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Tap replacement
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_tap_task_size', 'cat_tap_replacement', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_tap_vehicle', 'cat_tap_replacement', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_tap_details', 'cat_tap_replacement', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Washing machine installation
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_washing_task_size', 'cat_washing_machine', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_washing_vehicle', 'cat_washing_machine', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_washing_details', 'cat_washing_machine', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Water filter installation
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_filter_task_size', 'cat_water_filter', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_filter_vehicle', 'cat_water_filter', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_filter_details', 'cat_water_filter', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- ELECTRICAL SUBCATEGORIES
-- ============================================

-- Light installation (Electrical)
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_elec_light_task_size', 'cat_electrical_light', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_elec_light_vehicle', 'cat_electrical_light', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_elec_light_details', 'cat_electrical_light', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Sockets installation and repair
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_sockets_task_size', 'cat_sockets', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_sockets_vehicle', 'cat_sockets', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_sockets_details', 'cat_sockets', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Switches installation and repair
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_switches_task_size', 'cat_switches', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_switches_vehicle', 'cat_switches', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_switches_details', 'cat_switches', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Cables repair
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_cables_task_size', 'cat_cables', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_cables_vehicle', 'cat_cables', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_cables_details', 'cat_cables', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- CLEANING SUBCATEGORIES
-- ============================================

-- Clean
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_clean_task_size', 'cat_clean', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_clean_details', 'cat_clean', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Deep clean
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_deep_task_size', 'cat_deep_clean', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_deep_details', 'cat_deep_clean', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Party clean up
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_party_task_size', 'cat_party_cleanup', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_party_details', 'cat_party_cleanup', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- End of tenancy
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_tenancy_task_size', 'cat_end_tenancy', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_tenancy_details', 'cat_end_tenancy', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Office cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_office_c_task_size', 'cat_office_cleaning', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_office_c_details', 'cat_office_cleaning', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- AirBnB cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_airbnb_task_size', 'cat_airbnb_cleaning', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_airbnb_details', 'cat_airbnb_cleaning', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- MOVING SUBCATEGORIES
-- ============================================

-- Van assisted moving help
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_van_start', 'cat_van_moving', 'start_address', 'address', 'Start Address', 'Where should the tasker pick up items?', NULL, true, 1, 'location'),
  ('ff_van_end', 'cat_van_moving', 'end_address', 'address', 'End Address', 'Where should the items be delivered?', NULL, true, 2, 'location'),
  ('ff_van_task_size', 'cat_van_moving', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_van_vehicle', 'cat_van_moving', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_van_details', 'cat_van_moving', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Moving help
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_move_start', 'cat_moving_help', 'start_address', 'address', 'Start Address', 'Where should the tasker pick up items?', NULL, true, 1, 'location'),
  ('ff_move_end', 'cat_moving_help', 'end_address', 'address', 'End Address', 'Where should the items be delivered?', NULL, true, 2, 'location'),
  ('ff_move_task_size', 'cat_moving_help', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_move_vehicle', 'cat_moving_help', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_move_details', 'cat_moving_help', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Waste and furniture removal
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_waste_location', 'cat_waste_removal', 'location', 'address', 'Location', 'Where is the pickup location?', NULL, true, 1, 'location'),
  ('ff_waste_task_size', 'cat_waste_removal', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_waste_vehicle', 'cat_waste_removal', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_waste_details', 'cat_waste_removal', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Heavy lifting and loading
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_heavy_location', 'cat_heavy_lifting', 'location', 'address', 'Location', 'Where is the location?', NULL, true, 1, 'location'),
  ('ff_heavy_task_size', 'cat_heavy_lifting', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_heavy_vehicle', 'cat_heavy_lifting', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_heavy_details', 'cat_heavy_lifting', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Packing and moving
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_packing_start', 'cat_packing_moving', 'start_address', 'address', 'Start Address', 'Where should the tasker pick up items?', NULL, true, 1, 'location'),
  ('ff_packing_end', 'cat_packing_moving', 'end_address', 'address', 'End Address', 'Where should the items be delivered?', NULL, true, 2, 'location'),
  ('ff_packing_task_size', 'cat_packing_moving', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_packing_vehicle', 'cat_packing_moving', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_packing_details', 'cat_packing_moving', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Full service movers
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_full_start', 'cat_full_service', 'start_address', 'address', 'Start Address', 'Where should the tasker pick up items?', NULL, true, 1, 'location'),
  ('ff_full_end', 'cat_full_service', 'end_address', 'address', 'End Address', 'Where should the items be delivered?', NULL, true, 2, 'location'),
  ('ff_full_task_size', 'cat_full_service', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_full_vehicle', 'cat_full_service', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_full_details', 'cat_full_service', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- ============================================
-- OUTDOOR HELP SUBCATEGORIES
-- ============================================

-- Gardening
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_garden_task_size', 'cat_gardening', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_garden_vehicle', 'cat_gardening', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_garden_details', 'cat_gardening', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Lawn care
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_lawn_task_size', 'cat_lawn_care', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_lawn_vehicle', 'cat_lawn_care', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_lawn_details', 'cat_lawn_care', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Landscaping
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_landscape_task_size', 'cat_landscaping', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_landscape_vehicle', 'cat_landscaping', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_landscape_details', 'cat_landscaping', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Leaf raking and removal
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_leaf_task_size', 'cat_leaf_raking', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_leaf_vehicle', 'cat_leaf_raking', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_leaf_details', 'cat_leaf_raking', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Roof and gutter cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_gutter_task_size', 'cat_roof_gutter', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_gutter_vehicle', 'cat_roof_gutter', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_gutter_details', 'cat_roof_gutter', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');

-- Branch and hedge trimming
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, options, required, display_order, section)
VALUES
  ('ff_branch_task_size', 'cat_branch_hedge', 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, 10, 'task_details'),
  ('ff_branch_vehicle', 'cat_branch_hedge', 'vehicle_requirement', 'radio', 'Vehicle Requirements', NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, 11, 'task_details'),
  ('ff_branch_details', 'cat_branch_hedge', 'additional_details', 'textarea', 'Tell us about the task', 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, 100, 'additional_info');
