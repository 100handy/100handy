-- Corrected seed data for category-specific form fields
-- Maps specification to actual database category names

-- Category: Furniture Assembly & Installation
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled or disassembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Furniture Assembly & Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Furniture Assembly & Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Furniture Assembly & Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Furniture Assembly & Installation';


-- Category: Desk, Bed & Dresser Assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Desk, Bed & Dresser Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Desk, Bed & Dresser Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Desk, Bed & Dresser Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Desk, Bed & Dresser Assembly';


-- Category: Bookshelf & Storage Assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Bookshelf & Storage Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Bookshelf & Storage Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Bookshelf & Storage Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Bookshelf & Storage Assembly';


-- Category: Office Furniture Assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Office Furniture Assembly';


-- Category: Home Office Furniture Assembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Home Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Home Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Home Office Furniture Assembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Home Office Furniture Assembly';


-- Category: Outdoor & Patio Furniture Setup
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need assembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Outdoor & Patio Furniture Setup';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Outdoor & Patio Furniture Setup';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Outdoor & Patio Furniture Setup';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Outdoor & Patio Furniture Setup';


-- Category: Furniture Disassembly & Reassembly
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'furniture_type', 'radio', 'What type of furniture do you need disassembled?', NULL, NULL, '[{"value":"ikea","label":"IKEA furniture items only"},{"value":"non_ikea","label":"Other furniture items (non-IKEA)"},{"value":"both","label":"Both IKEA and non-IKEA furniture"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'Furniture Disassembly & Reassembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Furniture Disassembly & Reassembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Furniture Disassembly & Reassembly';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Furniture Disassembly & Reassembly';


-- Category: TV Wall Mounting
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'tv_count', 'select', 'How many TVs do you need to be installed?', NULL, NULL, '[{"value":1,"label":"1"},{"value":2,"label":"2"},{"value":3,"label":"3"},{"value":4,"label":"4"},{"value":5,"label":"5"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 1, 'basic_info'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'help_available', 'radio', 'Will someone be around to help your Tasker lift the TV into place?', 'Larger TVs (60"+) may require a second person for safe mounting.', NULL, '[{"value":"yes","label":"Someone will be around"},{"value":"no_large","label":"No one will be around. 1 or more TVs above 60\""},{"value":"not_needed","label":"Not needed. No TVs above 60\""},{"value":"unsure","label":"Unsure if needed"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 2, 'basic_info'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'mount_type', 'checkbox', 'What type of TV mount do you want to use?', 'Select all that apply', NULL, '[{"value":"fixed","label":"Fixed / low profile"},{"value":"tilting","label":"Tilting"},{"value":"articulating","label":"Articulating / full motion"},{"value":"other","label":"Other / Not sure"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 3, 'mount_details'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'wall_material', 'radio', 'What kind of material are your walls made of?', 'You can easily test this by knocking on the wall. A hollow sound means drywall, plaster, or wood. No echo means brick or concrete.', NULL, '[{"value":"drywall","label":"Drywall, plaster, or wood"},{"value":"brick","label":"Brick or concrete"},{"value":"metal","label":"Metal"},{"value":"other","label":"Other / not sure"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 4, 'mount_details'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'hide_wires', 'checkbox', 'Hide wires behind the wall', 'Add-on service', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, 5, 'addons'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'install_speakers', 'checkbox', 'Install speakers or soundbars', 'Add-on service', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, 6, 'addons'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'device_setup', 'textarea', 'Device & accessory setup', 'Please describe any device setup needs', 'e.g., Connect streaming devices, set up smart TV features', NULL, false, NULL, NULL, NULL, 500, NULL, 7, 'addons'
  FROM categories WHERE name = 'TV Wall Mounting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'TV Wall Mounting';


-- Category: Mounting & Wall Installation
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Mounting & Wall Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Mounting & Wall Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Mounting & Wall Installation';


-- Category: Door, Cabinet & Furniture Fixes
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Door, Cabinet & Furniture Fixes';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Door, Cabinet & Furniture Fixes';


-- Category: Painting & Wallpapering
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Painting & Wallpapering';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Painting & Wallpapering';


-- Category: Plumbing & Leak Fixes
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Plumbing & Leak Fixes';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Plumbing & Leak Fixes';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Plumbing & Leak Fixes';


-- Category: Electrical Repairs & Lighting Installation
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Electrical Repairs & Lighting Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Electrical Repairs & Lighting Installation';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Electrical Repairs & Lighting Installation';


-- Category: Standard & Deep Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Standard & Deep Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Standard & Deep Cleaning';


-- Category: Move-In / Move-Out Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Move-In / Move-Out Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Move-In / Move-Out Cleaning';


-- Category: Office Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Office Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Office Cleaning';


-- Category: Vacation Rental Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Vacation Rental Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Vacation Rental Cleaning';


-- Category: Carpet & Upholstery Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Carpet & Upholstery Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Carpet & Upholstery Cleaning';


-- Category: Garage, Basement & Attic Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Garage, Basement & Attic Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Garage, Basement & Attic Cleaning';


-- Category: Local & Full-Service Moving
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'start_address', 'address', 'Start address', 'Where should the tasker pick up from?', NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, 1, 'location'
  FROM categories WHERE name = 'Local & Full-Service Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'end_address', 'address', 'End address', 'Where should the tasker deliver to?', NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, 2, 'location'
  FROM categories WHERE name = 'Local & Full-Service Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Local & Full-Service Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Local & Full-Service Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Local & Full-Service Moving';


-- Category: Furniture & Appliance Removal
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Furniture & Appliance Removal';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Furniture & Appliance Removal';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Furniture & Appliance Removal';


-- Category: Furniture Rearranging
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Furniture Rearranging';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Furniture Rearranging';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Furniture Rearranging';


-- Category: Pool Table & Large Item Moving
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Pool Table & Large Item Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Pool Table & Large Item Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Pool Table & Large Item Moving';


-- Category: Storage Unit Moving
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'start_address', 'address', 'Start address', 'Where should the tasker pick up from?', NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, 1, 'location'
  FROM categories WHERE name = 'Storage Unit Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'end_address', 'address', 'End address', 'Where should the tasker deliver to?', NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, 2, 'location'
  FROM categories WHERE name = 'Storage Unit Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Storage Unit Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Storage Unit Moving';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Storage Unit Moving';


-- Category: Gardening & Planting
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Gardening & Planting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Gardening & Planting';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Gardening & Planting';


-- Category: Gutter Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Gutter Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Gutter Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Gutter Cleaning';


-- Category: Outdoor Furniture Setup
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Outdoor Furniture Setup';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Outdoor Furniture Setup';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Outdoor Furniture Setup';


-- Category: Patio & Driveway Cleaning
INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'task_size', 'radio', 'Task Size', 'How long do you estimate this task will take?', NULL, '[{"value":"small","label":"Small - Est. 1 hr"},{"value":"medium","label":"Medium - Est. 2-3 hrs"},{"value":"large","label":"Large - Est. 4+ hrs"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 100, 'task_details'
  FROM categories WHERE name = 'Patio & Driveway Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'vehicle_requirement', 'radio', 'Vehicle Requirement', NULL, NULL, '[{"value":"not_needed","label":"Not needed for task"},{"value":"car","label":"Task requires a car"},{"value":"truck","label":"Task requires a truck"}]'::jsonb, true, NULL, NULL, NULL, NULL, NULL, 101, 'task_details'
  FROM categories WHERE name = 'Patio & Driveway Cleaning';

INSERT INTO category_form_fields (id, category_id, field_key, field_type, label, description, placeholder, options, required, min_value, max_value, min_length, max_length, show_if, display_order, section)
  SELECT 'field_' || gen_random_uuid()::text, id, 'additional_details', 'textarea', 'Tell us about the task', NULL, 'For example, what supplies are needed, where to park, or timing restrictions.', NULL, false, NULL, NULL, NULL, 1000, NULL, 200, 'additional_info'
  FROM categories WHERE name = 'Patio & Driveway Cleaning';


