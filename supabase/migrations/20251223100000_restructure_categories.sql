-- Restructure categories to match the 8-category specification
-- This migration replaces all existing categories with the new structure

-- First, check for any foreign key dependencies and handle them
-- Delete form fields first (they reference categories)
DELETE FROM category_form_fields;

-- Delete all existing categories
DELETE FROM categories;

-- ============================================
-- INSERT 8 MAIN CATEGORIES (Level 0)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_assembly', 'Assembly', 'Furniture and equipment assembly services', NULL, 0, 1),
  ('cat_mounting', 'Mounting', 'Wall mounting and installation services', NULL, 0, 2),
  ('cat_home_repairs', 'Home Repairs', 'General home repair and maintenance services', NULL, 0, 3),
  ('cat_plumbing', 'Plumbing', 'Plumbing repair and installation services', NULL, 0, 4),
  ('cat_electrical', 'Electrical', 'Electrical repair and installation services', NULL, 0, 5),
  ('cat_cleaning', 'Cleaning', 'Cleaning and sanitation services', NULL, 0, 6),
  ('cat_moving', 'Moving', 'Moving, hauling, and heavy lifting services', NULL, 0, 7),
  ('cat_outdoor', 'Outdoor help', 'Outdoor maintenance and gardening services', NULL, 0, 8);

-- ============================================
-- ASSEMBLY SUBCATEGORIES (5)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_furniture_assembly', 'Furniture assembly', 'General furniture assembly and disassembly', 'cat_assembly', 1, 1),
  ('cat_ikea_assembly', 'IKEA assembly', 'IKEA furniture assembly specialist', 'cat_assembly', 1, 2),
  ('cat_office_furniture_assembly', 'Office furniture assembly', 'Office desks, chairs, and furniture assembly', 'cat_assembly', 1, 3),
  ('cat_wardrobe_assembly', 'Wardrobe assembly', 'Wardrobe and closet assembly', 'cat_assembly', 1, 4),
  ('cat_crib_assembly', 'Crib assembly', 'Baby crib and nursery furniture assembly', 'cat_assembly', 1, 5);

-- ============================================
-- MOUNTING SUBCATEGORIES (6)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_tv_mounting', 'TV mounting', 'TV wall mounting and installation', 'cat_mounting', 1, 1),
  ('cat_wall_mounting', 'Wall mounting', 'General wall mounting services', 'cat_mounting', 1, 2),
  ('cat_shelves', 'Put up shelves', 'Shelf installation and mounting', 'cat_mounting', 1, 3),
  ('cat_pictures_artwork', 'Hanging pictures and artwork', 'Picture and artwork hanging', 'cat_mounting', 1, 4),
  ('cat_light_installation', 'Light fixture installation', 'Light fixture mounting and installation', 'cat_mounting', 1, 5),
  ('cat_curtains_blinds', 'Install curtains and blinds', 'Curtain and blind installation', 'cat_mounting', 1, 6);

-- ============================================
-- HOME REPAIRS SUBCATEGORIES (7)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_minor_repairs', 'Minor home repairs', 'Small household repairs and fixes', 'cat_home_repairs', 1, 1),
  ('cat_door_cabinet_repairs', 'Door, cabinet, and furniture repairs', 'Door, cabinet, and furniture repair services', 'cat_home_repairs', 1, 2),
  ('cat_window_blinds_repair', 'Window and blinds repair', 'Window and blind repair services', 'cat_home_repairs', 1, 3),
  ('cat_sealing_caulking', 'Sealing and caulking', 'Sealing and caulking services', 'cat_home_repairs', 1, 4),
  ('cat_flooring_tiling', 'Flooring and tiling help', 'Flooring and tiling assistance', 'cat_home_repairs', 1, 5),
  ('cat_light_carpentry', 'Light carpentry', 'Light carpentry and woodwork', 'cat_home_repairs', 1, 6),
  ('cat_indoor_painting', 'Indoor painting', 'Interior painting services', 'cat_home_repairs', 1, 7);

-- ============================================
-- PLUMBING SUBCATEGORIES (5)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_leak_fixing', 'Leak fixing', 'Water leak diagnosis and repair', 'cat_plumbing', 1, 1),
  ('cat_drain_unblocking', 'Drain unblocking', 'Drain cleaning and unblocking', 'cat_plumbing', 1, 2),
  ('cat_tap_replacement', 'Tap replacement', 'Tap and faucet replacement', 'cat_plumbing', 1, 3),
  ('cat_washing_machine', 'Washing machine installation', 'Washing machine installation and connection', 'cat_plumbing', 1, 4),
  ('cat_water_filter', 'Water filter installation', 'Water filter installation and setup', 'cat_plumbing', 1, 5);

-- ============================================
-- ELECTRICAL SUBCATEGORIES (4)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_electrical_light', 'Light installation', 'Electrical light installation', 'cat_electrical', 1, 1),
  ('cat_sockets', 'Sockets installation and repair', 'Power socket installation and repair', 'cat_electrical', 1, 2),
  ('cat_switches', 'Switches installation and repair', 'Light switch installation and repair', 'cat_electrical', 1, 3),
  ('cat_cables', 'Cables repair', 'Electrical cable repair', 'cat_electrical', 1, 4);

-- ============================================
-- CLEANING SUBCATEGORIES (6)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_clean', 'Clean', 'Standard cleaning service', 'cat_cleaning', 1, 1),
  ('cat_deep_clean', 'Deep clean', 'Deep cleaning service', 'cat_cleaning', 1, 2),
  ('cat_party_cleanup', 'Party clean up', 'Post-party cleaning service', 'cat_cleaning', 1, 3),
  ('cat_end_tenancy', 'End of tenancy', 'End of tenancy cleaning', 'cat_cleaning', 1, 4),
  ('cat_office_cleaning', 'Office cleaning', 'Office and commercial cleaning', 'cat_cleaning', 1, 5),
  ('cat_airbnb_cleaning', 'AirBnB cleaning', 'Short-term rental cleaning', 'cat_cleaning', 1, 6);

-- ============================================
-- MOVING SUBCATEGORIES (6)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_van_moving', 'Van assisted moving help', 'Moving help with van', 'cat_moving', 1, 1),
  ('cat_moving_help', 'Moving help', 'General moving assistance', 'cat_moving', 1, 2),
  ('cat_waste_removal', 'Waste and furniture removal', 'Waste and furniture disposal', 'cat_moving', 1, 3),
  ('cat_heavy_lifting', 'Heavy lifting and loading', 'Heavy item lifting and loading', 'cat_moving', 1, 4),
  ('cat_packing_moving', 'Packing and moving', 'Packing and moving services', 'cat_moving', 1, 5),
  ('cat_full_service', 'Full service movers', 'Complete moving service', 'cat_moving', 1, 6);

-- ============================================
-- OUTDOOR HELP SUBCATEGORIES (6)
-- ============================================

INSERT INTO categories (id, name, description, parent_id, level, display_order) VALUES
  ('cat_gardening', 'Gardening', 'General gardening services', 'cat_outdoor', 1, 1),
  ('cat_lawn_care', 'Lawn care', 'Lawn mowing and maintenance', 'cat_outdoor', 1, 2),
  ('cat_landscaping', 'Landscaping', 'Landscaping and garden design', 'cat_outdoor', 1, 3),
  ('cat_leaf_raking', 'Leaf raking and removal', 'Leaf raking and collection', 'cat_outdoor', 1, 4),
  ('cat_roof_gutter', 'Roof and gutter cleaning', 'Roof and gutter cleaning services', 'cat_outdoor', 1, 5),
  ('cat_branch_hedge', 'Branch and hedge trimming', 'Tree and hedge trimming', 'cat_outdoor', 1, 6);
