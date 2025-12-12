-- Seed skill sets and tools for all skills based on 100 Handy document
-- This migration uses CTEs to get skill IDs and then inserts skill sets and tools

-- Helper function to get skill ID by name and category
DO $$
DECLARE
  skill_id_var TEXT;
  display_order_var INTEGER;
BEGIN
  -- ============================================================================
  -- ASSEMBLY SKILLS
  -- ============================================================================
  
  -- Furniture Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Furniture Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Ability to read and interpret detailed instruction manuals', 1),
      (skill_id_var, 'required', 'Proficient with hand and power tools', 2),
      (skill_id_var, 'required', 'Strong understanding of hardware components (screws, dowels, brackets, etc.)', 3),
      (skill_id_var, 'required', 'Efficient problem-solving for unclear or missing instructions', 4),
      (skill_id_var, 'required', 'Ensuring stability, alignment, and safety of assembled items', 5),
      (skill_id_var, 'required', 'Time-management and careful organisation of parts', 6)
    ON CONFLICT DO NOTHING;
    
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdrivers (various sizes)', true, 1),
      (skill_id_var, 'Power drill', true, 2),
      (skill_id_var, 'Hammer', true, 3),
      (skill_id_var, 'Level', true, 4),
      (skill_id_var, 'Measuring tape', true, 5),
      (skill_id_var, 'Allen keys/Hex keys', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- IKEA Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'IKEA Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Expert knowledge of IKEA''s unique flat-pack system', 1),
      (skill_id_var, 'required', 'Skilled at interpreting IKEA picture-only instructions', 2),
      (skill_id_var, 'required', 'Advanced familiarity with cam locks, dowels, and IKEA fasteners', 3),
      (skill_id_var, 'required', 'Efficient assembly of popular IKEA items (PAX, MALM, KALLAX, etc.)', 4),
      (skill_id_var, 'required', 'Troubleshooting common IKEA-specific challenges', 5),
      (skill_id_var, 'required', 'Ensuring long-lasting stability despite lightweight materials', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Office Furniture Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Office Furniture Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Proficiency in assembling desks, ergonomic chairs, filing units, and conference tables', 1),
      (skill_id_var, 'required', 'Understanding of adjustable components (height adjustment, cable management systems)', 2),
      (skill_id_var, 'required', 'Prioritising workspace safety and functionality', 3),
      (skill_id_var, 'required', 'Ability to work in business settings with minimal disruption', 4),
      (skill_id_var, 'required', 'Experience with bulk assembly and coordinated office setups', 5),
      (skill_id_var, 'required', 'Ensuring professional, aligned, and robust installation', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Wardrobe Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Wardrobe Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Skilled in handling large, heavy, and multi-panel structures', 1),
      (skill_id_var, 'required', 'Precise alignment of doors, rails, hinges, and shelving', 2),
      (skill_id_var, 'required', 'Experience with sliding-door and hinged-door systems', 3),
      (skill_id_var, 'required', 'Strong structural integrity checks for tall furniture', 4),
      (skill_id_var, 'required', 'Efficient organisation of internal components (drawers, shelves, fittings)', 5),
      (skill_id_var, 'required', 'Securing wardrobes safely to walls when necessary', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Crib Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Crib Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Thorough understanding of baby-furniture safety standards', 1),
      (skill_id_var, 'required', 'Accurate installation of slats, hinges, and adjustable mattress levels', 2),
      (skill_id_var, 'required', 'Careful torque control to avoid over-tightening and weakening the structure', 3),
      (skill_id_var, 'required', 'Ensuring all locks, latches, and safety features are fully functional', 4),
      (skill_id_var, 'required', 'Clean, safe handling of parts designed for infants', 5),
      (skill_id_var, 'required', 'Double-checking stability and strict adherence to manufacturer guidelines', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- MOUNTING SKILLS
  -- ============================================================================
  
  -- TV Mounting
  SELECT id INTO skill_id_var FROM skills WHERE name = 'TV Mounting' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Safe and precise installation of TVs of all sizes', 1),
      (skill_id_var, 'required', 'Knowledge of various bracket types (fixed, tilt, full-motion)', 2),
      (skill_id_var, 'required', 'Stud finding and secure anchor placement', 3),
      (skill_id_var, 'required', 'Cable management and tidy finish', 4),
      (skill_id_var, 'required', 'Understanding of wall types (plasterboard, brick, concrete)', 5)
    ON CONFLICT DO NOTHING;
    
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Power drill', true, 1),
      (skill_id_var, 'Level', true, 2),
      (skill_id_var, 'Stud finder', true, 3),
      (skill_id_var, 'Screwdrivers / Screws', true, 4),
      (skill_id_var, 'Wall anchors', true, 5),
      (skill_id_var, 'Tape measure', true, 6),
      (skill_id_var, 'Drop cloth', true, 7),
      (skill_id_var, '6-foot ladder', true, 8),
      (skill_id_var, 'Hammer drill', false, 9),
      (skill_id_var, 'Laser level', false, 10),
      (skill_id_var, 'Painter''s tape', false, 11)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Wall Mounting
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Wall Mounting' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Mounting shelves, brackets, mirrors, cabinets, and décor', 1),
      (skill_id_var, 'required', 'Proper weight-load assessment', 2),
      (skill_id_var, 'required', 'Experience working with different wall materials', 3),
      (skill_id_var, 'required', 'Accurate measurements for perfect alignment', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Put Up Shelves
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Put Up Shelves' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Levelling, measuring, and installing floating or bracket shelves', 1),
      (skill_id_var, 'required', 'Safe distribution of load-bearing points', 2),
      (skill_id_var, 'required', 'Ensuring long-lasting stability', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Hanging Pictures and Artwork
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Hanging Pictures and Artwork' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Accurate positioning for aesthetic display', 1),
      (skill_id_var, 'required', 'Safe handling of delicate art pieces', 2),
      (skill_id_var, 'required', 'Selection of appropriate hooks, anchors, and wire systems', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Light Installation (Mounting)
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Installation' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Installing ceiling lights, wall lights, chandeliers', 1),
      (skill_id_var, 'required', 'Safe connection to electrical circuits', 2),
      (skill_id_var, 'required', 'Understanding of voltage, load, and electrical safety', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Install Curtains and Blinds
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Install Curtains and Blinds' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Measuring and aligning curtain poles and blind brackets', 1),
      (skill_id_var, 'required', 'Fitting roller, Venetian, vertical, and blackout blinds', 2),
      (skill_id_var, 'required', 'Secure installation on various wall types', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- HOME REPAIRS SKILLS
  -- ============================================================================
  
  -- Minor Home Repairs
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Minor Home Repairs' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Ability to assess small household issues and identify the proper fix', 1),
      (skill_id_var, 'required', 'Skilled in using basic hand and power tools', 2),
      (skill_id_var, 'required', 'Understanding of safety procedures and correct repair techniques', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Door, Cabinet, and Furniture Repairs
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Door, Cabinet, and Furniture Repairs' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Fixing hinges, handles, alignment issues, and soft-close systems', 1),
      (skill_id_var, 'required', 'Replacing broken slats, tracks, and runners', 2),
      (skill_id_var, 'required', 'Restoring smooth movement and functionality', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Window and Blinds Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Window and Blinds Repair' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Diagnosing common window issues such as drafts, rattling, sticking, or poor closure', 1),
      (skill_id_var, 'required', 'Repairing or replacing window handles, latches, and locking mechanisms', 2),
      (skill_id_var, 'required', 'Adjusting hinges for smooth opening and closing', 3),
      (skill_id_var, 'required', 'Fixing misaligned or jammed window frames', 4),
      (skill_id_var, 'required', 'Replacing worn or damaged weatherstrips', 5),
      (skill_id_var, 'required', 'Sealing gaps to improve insulation and energy efficiency', 6),
      (skill_id_var, 'required', 'Fixing broken or tangled lift cords', 7),
      (skill_id_var, 'required', 'Repairing jammed or uneven blinds', 8),
      (skill_id_var, 'required', 'Replacing damaged slats for vertical or horizontal blind types', 9)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Sealing and Caulking
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Sealing and Caulking' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Applying waterproof sealant in kitchens, bathrooms, and windows', 1),
      (skill_id_var, 'required', 'Removing old caulk and preparing clean surfaces', 2),
      (skill_id_var, 'required', 'Precision work for a neat and durable finish', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Flooring and Tiling Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Flooring and Tiling Help' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Assisting with laminate, vinyl, and tile installation', 1),
      (skill_id_var, 'required', 'Cutting, laying, and trimming materials', 2),
      (skill_id_var, 'required', 'Grouting, levelling, and surface preparation', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Light Carpentry
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Carpentry' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Building or repairing basic wooden structures', 1),
      (skill_id_var, 'required', 'Cutting, sanding, and joining timber', 2),
      (skill_id_var, 'required', 'Minor custom woodwork adjustments', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Indoor Painting
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Indoor Painting' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Surface preparation (filling cracks, sanding)', 1),
      (skill_id_var, 'required', 'Neat brush and roller techniques', 2),
      (skill_id_var, 'required', 'Clean edging, even coats, and colour matching', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- PLUMBING SKILLS
  -- ============================================================================
  
  -- Leak Fixing
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Leak Fixing' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Diagnosing water leaks in pipes, faucets, and valves', 1),
      (skill_id_var, 'required', 'Applying temporary or permanent fixes', 2),
      (skill_id_var, 'required', 'Knowledge of basic plumbing seals and fittings', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Drain Unblocking
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Drain Unblocking' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Using plungers, drain snakes, or chemicals safely', 1),
      (skill_id_var, 'required', 'Identifying causes of blockages in kitchen and bathroom drains', 2),
      (skill_id_var, 'required', 'Restoring normal water flow', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Tap Replacement
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Tap Replacement' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Removing old taps and fitting new ones', 1),
      (skill_id_var, 'required', 'Connecting supply lines safely', 2),
      (skill_id_var, 'required', 'Checking for leaks and proper water pressure', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Washing Machine Installation
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Washing Machine Installation' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Connecting water inlet and drainage hoses', 1),
      (skill_id_var, 'required', 'Levelling and securing the machine', 2),
      (skill_id_var, 'required', 'Testing water flow and spin cycle', 3),
      (skill_id_var, 'required', 'Identifying and fixing minor leaks', 4),
      (skill_id_var, 'required', 'Knowledge of plumbing basics', 5),
      (skill_id_var, 'required', 'Safe electrical plug-in and load checks', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Water Filter Installation
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Water Filter Installation' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Installing under-sink or countertop filters', 1),
      (skill_id_var, 'required', 'Connecting filter to water line', 2),
      (skill_id_var, 'required', 'Pressure testing and leak inspection', 3),
      (skill_id_var, 'required', 'Replacing cartridges and maintenance', 4),
      (skill_id_var, 'required', 'Understanding filtration types (carbon, RO, etc.)', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- ELECTRICAL SKILLS
  -- ============================================================================
  
  -- Light Installation (Electrical)
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Installation' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Installing ceiling and wall lights', 1),
      (skill_id_var, 'required', 'Wiring and connecting fixtures safely', 2),
      (skill_id_var, 'required', 'Replacing bulbs, ballasts, and fittings', 3),
      (skill_id_var, 'required', 'Testing electrical continuity', 4),
      (skill_id_var, 'required', 'Ensuring safe mounting and support', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Sockets Installation and Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Sockets Installation and Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Replacing faulty outlets', 1),
      (skill_id_var, 'required', 'Installing new power points', 2),
      (skill_id_var, 'required', 'Checking voltage and load compatibility', 3),
      (skill_id_var, 'required', 'Fixing loose or damaged wiring', 4),
      (skill_id_var, 'required', 'Ensuring compliance with electrical safety standards', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Switches Installation and Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Switches Installation and Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Replacing broken switches', 1),
      (skill_id_var, 'required', 'Installing dimmer switches', 2),
      (skill_id_var, 'required', 'Troubleshooting wiring issues', 3),
      (skill_id_var, 'required', 'Wall-mounting and alignment', 4),
      (skill_id_var, 'required', 'Electrical circuit testing', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Cables Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Cables Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Fixing damaged power cables', 1),
      (skill_id_var, 'required', 'Extending wiring safely', 2),
      (skill_id_var, 'required', 'Insulating exposed wires', 3),
      (skill_id_var, 'required', 'Continuity and safety testing', 4),
      (skill_id_var, 'required', 'Cable management and routing', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- CLEANING SKILLS
  -- ============================================================================
  
  -- General Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'General Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Surface cleaning and dusting', 1),
      (skill_id_var, 'required', 'Sweeping, vacuuming, mopping', 2),
      (skill_id_var, 'required', 'Bathroom and kitchen cleaning', 3),
      (skill_id_var, 'required', 'Trash removal', 4),
      (skill_id_var, 'required', 'Basic sanitizing', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Deep Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Deep Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Cleaning behind/under appliances and furniture', 1),
      (skill_id_var, 'required', 'Tile and grout scrubbing', 2),
      (skill_id_var, 'required', 'Limescale and mould removal', 3),
      (skill_id_var, 'required', 'Oven, fridge, and interior cabinet cleaning', 4),
      (skill_id_var, 'required', 'High-detail sanitation', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Party Clean Up
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Party Clean Up' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Removing rubbish and bottles', 1),
      (skill_id_var, 'required', 'Stain treatment', 2),
      (skill_id_var, 'required', 'Floor cleaning', 3),
      (skill_id_var, 'required', 'Restoring spaces to pre-event condition', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- End of Tenancy Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'End of Tenancy Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Full property deep clean', 1),
      (skill_id_var, 'required', 'Oven and kitchen deep detailing', 2),
      (skill_id_var, 'required', 'Carpet vacuuming and stain removal', 3),
      (skill_id_var, 'required', 'Bathroom descaling', 4),
      (skill_id_var, 'required', 'Meeting landlord/agent checklist standards', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Office Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Office Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Desk and workstation cleaning', 1),
      (skill_id_var, 'required', 'Bins and recycling', 2),
      (skill_id_var, 'required', 'Sanitizing shared areas', 3),
      (skill_id_var, 'required', 'Floor and window care', 4),
      (skill_id_var, 'required', 'Meeting corporate hygiene standards', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- AirBnB Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'AirBnB Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Fast turnaround cleaning', 1),
      (skill_id_var, 'required', 'Linen changing and bed making', 2),
      (skill_id_var, 'required', 'Restocking essentials', 3),
      (skill_id_var, 'required', 'Reporting damages', 4),
      (skill_id_var, 'required', 'Guest-ready staging', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- MOVING SKILLS
  -- ============================================================================
  
  -- Van Assisted Moving Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Van Assisted Moving Help' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Loading and unloading items', 1),
      (skill_id_var, 'required', 'Securing items safely in the van', 2),
      (skill_id_var, 'required', 'Driving assistance', 3),
      (skill_id_var, 'required', 'Planning optimal loading order', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Moving Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Moving Help' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Carrying boxes and furniture', 1),
      (skill_id_var, 'required', 'Protecting fragile items', 2),
      (skill_id_var, 'required', 'Using lifting equipment safely', 3),
      (skill_id_var, 'required', 'Home-to-home transport assistance', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Waste and Furniture Removal
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Waste and Furniture Removal' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Collecting unwanted furniture', 1),
      (skill_id_var, 'required', 'Sorting recycling vs waste', 2),
      (skill_id_var, 'required', 'Safe disposal per regulations', 3),
      (skill_id_var, 'required', 'Dismantling bulky items', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Heavy Lifting and Loading
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Heavy Lifting and Loading' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Team lifting techniques', 1),
      (skill_id_var, 'required', 'Using straps, dollies, trolleys', 2),
      (skill_id_var, 'required', 'Safe handling of heavy/awkward items', 3),
      (skill_id_var, 'required', 'Loading for transport stability', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Packing and Moving
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Packing and Moving' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Wrapping fragile items', 1),
      (skill_id_var, 'required', 'Labelling boxes', 2),
      (skill_id_var, 'required', 'Organising for efficient unloading', 3),
      (skill_id_var, 'required', 'Providing packing materials', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Full Service Movers
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Full Service Movers' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Complete packing and transportation', 1),
      (skill_id_var, 'required', 'Furniture disassembly & reassembly', 2),
      (skill_id_var, 'required', 'House-to-house logistics', 3),
      (skill_id_var, 'required', 'Insurance awareness', 4),
      (skill_id_var, 'required', 'Customer coordination and timing', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- OUTDOOR HELP SKILLS
  -- ============================================================================
  
  -- Gardening
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Gardening' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Plant care and watering', 1),
      (skill_id_var, 'required', 'Weed removal', 2),
      (skill_id_var, 'required', 'Soil preparation', 3),
      (skill_id_var, 'required', 'Small garden maintenance', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Lawn Care
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Lawn Care' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Mowing and edging', 1),
      (skill_id_var, 'required', 'Fertilizing and aeration', 2),
      (skill_id_var, 'required', 'Lawn repair and patching', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Landscaping
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Landscaping' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Planting shrubs, trees, flowers', 1),
      (skill_id_var, 'required', 'Designing garden layouts', 2),
      (skill_id_var, 'required', 'Mulching and soil improvement', 3),
      (skill_id_var, 'required', 'Decorative stone/wood placement', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Leaf Raking and Removal
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Leaf Raking and Removal' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Raking and collecting leaves', 1),
      (skill_id_var, 'required', 'Bagging and disposal', 2),
      (skill_id_var, 'required', 'Clearing pathways and lawns', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Roof and Gutter Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Roof and Gutter Cleaning' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Clearing debris and blockages', 1),
      (skill_id_var, 'required', 'Checking gutter flow', 2),
      (skill_id_var, 'required', 'Removing moss and leaves', 3),
      (skill_id_var, 'required', 'Ladder safety and height work', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Branch and Hedge Trimming
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Branch and Hedge Trimming' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_sets (skill_id, skill_type, description, display_order) VALUES
      (skill_id_var, 'required', 'Shaping hedges and bushes', 1),
      (skill_id_var, 'required', 'Light tree branch trimming', 2),
      (skill_id_var, 'required', 'Cleaning and removing cut debris', 3),
      (skill_id_var, 'required', 'Using trimmers safely', 4)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
