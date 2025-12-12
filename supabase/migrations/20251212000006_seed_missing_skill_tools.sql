-- Migration: Seed missing skill tools for all skills
-- Based on the 100 Handy document skill requirements

DO $$
DECLARE
  skill_id_var TEXT;
BEGIN
  -- ============================================================================
  -- ASSEMBLY SKILLS - Tools
  -- ============================================================================

  -- IKEA Assembly (currently has 0 tools)
  SELECT id INTO skill_id_var FROM skills WHERE name = 'IKEA Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Allen keys/Hex keys (various sizes)', true, 1),
      (skill_id_var, 'Phillips screwdriver', true, 2),
      (skill_id_var, 'Flat-head screwdriver', true, 3),
      (skill_id_var, 'Rubber mallet', true, 4),
      (skill_id_var, 'Level', true, 5),
      (skill_id_var, 'Measuring tape', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Office Furniture Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Office Furniture Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdrivers (various sizes)', true, 1),
      (skill_id_var, 'Power drill', true, 2),
      (skill_id_var, 'Allen keys/Hex keys', true, 3),
      (skill_id_var, 'Level', true, 4),
      (skill_id_var, 'Measuring tape', true, 5),
      (skill_id_var, 'Adjustable wrench', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Wardrobe Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Wardrobe Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdrivers (various sizes)', true, 1),
      (skill_id_var, 'Power drill', true, 2),
      (skill_id_var, 'Level', true, 3),
      (skill_id_var, 'Measuring tape', true, 4),
      (skill_id_var, 'Wall anchors and screws', true, 5),
      (skill_id_var, 'Stud finder', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Crib Assembly
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Crib Assembly' AND category = 'Assembly';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdrivers (various sizes)', true, 1),
      (skill_id_var, 'Allen keys/Hex keys', true, 2),
      (skill_id_var, 'Level', true, 3),
      (skill_id_var, 'Measuring tape', true, 4),
      (skill_id_var, 'Torque wrench (for safety)', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- MOUNTING SKILLS - Tools
  -- ============================================================================

  -- Wall Mounting
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Wall Mounting' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Power drill', true, 1),
      (skill_id_var, 'Stud finder', true, 2),
      (skill_id_var, 'Level', true, 3),
      (skill_id_var, 'Measuring tape', true, 4),
      (skill_id_var, 'Wall anchors (various types)', true, 5),
      (skill_id_var, 'Screws and bolts', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Put Up Shelves
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Put Up Shelves' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Power drill', true, 1),
      (skill_id_var, 'Stud finder', true, 2),
      (skill_id_var, 'Level', true, 3),
      (skill_id_var, 'Measuring tape', true, 4),
      (skill_id_var, 'Wall anchors', true, 5),
      (skill_id_var, 'Screwdriver set', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Hanging Pictures and Artwork
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Hanging Pictures and Artwork' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Hammer', true, 1),
      (skill_id_var, 'Level', true, 2),
      (skill_id_var, 'Measuring tape', true, 3),
      (skill_id_var, 'Picture hooks and wire', true, 4),
      (skill_id_var, 'Wall anchors', true, 5),
      (skill_id_var, 'Stud finder', false, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Light Installation (Mounting)
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Installation' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdrivers', true, 1),
      (skill_id_var, 'Wire strippers', true, 2),
      (skill_id_var, 'Voltage tester', true, 3),
      (skill_id_var, 'Ladder', true, 4),
      (skill_id_var, 'Electrical tape', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Install Curtains and Blinds
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Install Curtains and Blinds' AND category = 'Mounting';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Power drill', true, 1),
      (skill_id_var, 'Level', true, 2),
      (skill_id_var, 'Measuring tape', true, 3),
      (skill_id_var, 'Screwdriver set', true, 4),
      (skill_id_var, 'Wall anchors', true, 5),
      (skill_id_var, 'Step ladder', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- HOME REPAIRS SKILLS - Tools
  -- ============================================================================

  -- Minor Home Repairs
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Minor Home Repairs' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Basic toolkit (hammer, screwdrivers, pliers)', true, 1),
      (skill_id_var, 'Power drill', true, 2),
      (skill_id_var, 'Measuring tape', true, 3),
      (skill_id_var, 'Level', true, 4),
      (skill_id_var, 'Utility knife', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Door, Cabinet, and Furniture Repairs
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Door, Cabinet, and Furniture Repairs' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdriver set', true, 1),
      (skill_id_var, 'Wood glue', true, 2),
      (skill_id_var, 'Hinges and hardware', true, 3),
      (skill_id_var, 'Chisel', true, 4),
      (skill_id_var, 'Sandpaper', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Window and Blinds Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Window and Blinds Repair' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Screwdriver set', true, 1),
      (skill_id_var, 'Lubricant spray', true, 2),
      (skill_id_var, 'Replacement cords and parts', true, 3),
      (skill_id_var, 'Pliers', true, 4),
      (skill_id_var, 'Putty knife', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Sealing and Caulking
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Sealing and Caulking' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Caulking gun', true, 1),
      (skill_id_var, 'Silicone sealant', true, 2),
      (skill_id_var, 'Caulk remover tool', true, 3),
      (skill_id_var, 'Utility knife', true, 4),
      (skill_id_var, 'Cleaning supplies', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Flooring and Tiling Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Flooring and Tiling Help' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Tile cutter', true, 1),
      (skill_id_var, 'Grout float', true, 2),
      (skill_id_var, 'Trowel', true, 3),
      (skill_id_var, 'Level', true, 4),
      (skill_id_var, 'Knee pads', true, 5),
      (skill_id_var, 'Spacers', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Light Carpentry
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Carpentry' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Saw (hand or power)', true, 1),
      (skill_id_var, 'Hammer', true, 2),
      (skill_id_var, 'Measuring tape', true, 3),
      (skill_id_var, 'Square', true, 4),
      (skill_id_var, 'Sandpaper', true, 5),
      (skill_id_var, 'Wood glue', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Indoor Painting
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Indoor Painting' AND category = 'Home Repairs';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Paint brushes (various sizes)', true, 1),
      (skill_id_var, 'Paint rollers and trays', true, 2),
      (skill_id_var, 'Drop cloths', true, 3),
      (skill_id_var, 'Painters tape', true, 4),
      (skill_id_var, 'Sandpaper', true, 5),
      (skill_id_var, 'Filler and putty knife', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- PLUMBING SKILLS - Tools
  -- ============================================================================

  -- Leak Fixing
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Leak Fixing' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Adjustable wrench', true, 1),
      (skill_id_var, 'Pipe tape (PTFE)', true, 2),
      (skill_id_var, 'Plumbers putty', true, 3),
      (skill_id_var, 'Bucket', true, 4),
      (skill_id_var, 'Torch/flashlight', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Drain Unblocking
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Drain Unblocking' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Plunger', true, 1),
      (skill_id_var, 'Drain snake/auger', true, 2),
      (skill_id_var, 'Bucket', true, 3),
      (skill_id_var, 'Rubber gloves', true, 4),
      (skill_id_var, 'Drain cleaner (eco-friendly)', false, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Tap Replacement
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Tap Replacement' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Adjustable wrench', true, 1),
      (skill_id_var, 'Basin wrench', true, 2),
      (skill_id_var, 'Pipe tape (PTFE)', true, 3),
      (skill_id_var, 'Screwdriver set', true, 4),
      (skill_id_var, 'Bucket and towels', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Washing Machine Installation
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Washing Machine Installation' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Adjustable wrench', true, 1),
      (skill_id_var, 'Spirit level', true, 2),
      (skill_id_var, 'Pliers', true, 3),
      (skill_id_var, 'Screwdriver', true, 4),
      (skill_id_var, 'Hose clamps', false, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Water Filter Installation
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Water Filter Installation' AND category = 'Plumbing';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Adjustable wrench', true, 1),
      (skill_id_var, 'Pipe cutter', true, 2),
      (skill_id_var, 'Pipe tape (PTFE)', true, 3),
      (skill_id_var, 'Drill (for mounting)', true, 4),
      (skill_id_var, 'Bucket', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- ELECTRICAL SKILLS - Tools
  -- ============================================================================

  -- Light Installation (Electrical)
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Light Installation' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Voltage tester', true, 1),
      (skill_id_var, 'Wire strippers', true, 2),
      (skill_id_var, 'Screwdrivers (insulated)', true, 3),
      (skill_id_var, 'Electrical tape', true, 4),
      (skill_id_var, 'Wire connectors', true, 5),
      (skill_id_var, 'Ladder', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Sockets Installation and Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Sockets Installation and Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Voltage tester', true, 1),
      (skill_id_var, 'Screwdrivers (insulated)', true, 2),
      (skill_id_var, 'Wire strippers', true, 3),
      (skill_id_var, 'Pliers (insulated)', true, 4),
      (skill_id_var, 'Electrical tape', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Switches Installation and Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Switches Installation and Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Voltage tester', true, 1),
      (skill_id_var, 'Screwdrivers (insulated)', true, 2),
      (skill_id_var, 'Wire strippers', true, 3),
      (skill_id_var, 'Wire connectors', true, 4),
      (skill_id_var, 'Electrical tape', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Cables Repair
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Cables Repair' AND category = 'Electrical';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Voltage tester', true, 1),
      (skill_id_var, 'Wire strippers', true, 2),
      (skill_id_var, 'Crimping tool', true, 3),
      (skill_id_var, 'Electrical tape', true, 4),
      (skill_id_var, 'Heat shrink tubing', true, 5),
      (skill_id_var, 'Insulated pliers', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- CLEANING SKILLS - Tools/Supplies
  -- ============================================================================

  -- General Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'General Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Multi-purpose cleaner', true, 1),
      (skill_id_var, 'Vacuum cleaner', true, 2),
      (skill_id_var, 'Mop and bucket', true, 3),
      (skill_id_var, 'Microfiber cloths', true, 4),
      (skill_id_var, 'Rubber gloves', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Deep Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Deep Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Heavy-duty cleaners', true, 1),
      (skill_id_var, 'Steam cleaner', false, 2),
      (skill_id_var, 'Scrub brushes', true, 3),
      (skill_id_var, 'Vacuum with attachments', true, 4),
      (skill_id_var, 'Grout cleaner', true, 5),
      (skill_id_var, 'Rubber gloves', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Party Clean Up
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Party Clean Up' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Trash bags', true, 1),
      (skill_id_var, 'Stain remover', true, 2),
      (skill_id_var, 'Vacuum cleaner', true, 3),
      (skill_id_var, 'Mop and bucket', true, 4),
      (skill_id_var, 'Multi-purpose cleaner', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- End of Tenancy Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'End of Tenancy Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Oven cleaner', true, 1),
      (skill_id_var, 'Limescale remover', true, 2),
      (skill_id_var, 'Carpet cleaner', true, 3),
      (skill_id_var, 'Vacuum with attachments', true, 4),
      (skill_id_var, 'Steam cleaner', false, 5),
      (skill_id_var, 'All-purpose cleaner', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Office Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Office Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Disinfectant cleaner', true, 1),
      (skill_id_var, 'Glass cleaner', true, 2),
      (skill_id_var, 'Vacuum cleaner', true, 3),
      (skill_id_var, 'Microfiber cloths', true, 4),
      (skill_id_var, 'Trash bags', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- AirBnB Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'AirBnB Cleaning' AND category = 'Cleaning';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'All-purpose cleaner', true, 1),
      (skill_id_var, 'Fresh linens (or ability to wash)', true, 2),
      (skill_id_var, 'Vacuum cleaner', true, 3),
      (skill_id_var, 'Bathroom cleaner', true, 4),
      (skill_id_var, 'Glass cleaner', true, 5),
      (skill_id_var, 'Air freshener', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- MOVING SKILLS - Tools
  -- ============================================================================

  -- Van Assisted Moving Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Van Assisted Moving Help' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Moving straps', true, 1),
      (skill_id_var, 'Furniture dolly', true, 2),
      (skill_id_var, 'Moving blankets', true, 3),
      (skill_id_var, 'Work gloves', true, 4),
      (skill_id_var, 'Ratchet straps', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Moving Help
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Moving Help' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Moving straps', true, 1),
      (skill_id_var, 'Furniture dolly', true, 2),
      (skill_id_var, 'Moving blankets', true, 3),
      (skill_id_var, 'Work gloves', true, 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Waste and Furniture Removal
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Waste and Furniture Removal' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Heavy-duty work gloves', true, 1),
      (skill_id_var, 'Hand truck/dolly', true, 2),
      (skill_id_var, 'Basic toolkit (for disassembly)', true, 3),
      (skill_id_var, 'Trash bags', true, 4)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Heavy Lifting and Loading
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Heavy Lifting and Loading' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Lifting straps', true, 1),
      (skill_id_var, 'Furniture dolly', true, 2),
      (skill_id_var, 'Appliance dolly', true, 3),
      (skill_id_var, 'Work gloves', true, 4),
      (skill_id_var, 'Moving blankets', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Packing and Moving
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Packing and Moving' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Packing boxes (various sizes)', true, 1),
      (skill_id_var, 'Packing tape', true, 2),
      (skill_id_var, 'Bubble wrap', true, 3),
      (skill_id_var, 'Packing paper', true, 4),
      (skill_id_var, 'Markers for labeling', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Full Service Movers
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Full Service Movers' AND category = 'Moving';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Full packing supplies', true, 1),
      (skill_id_var, 'Moving truck access', true, 2),
      (skill_id_var, 'Furniture dollies and hand trucks', true, 3),
      (skill_id_var, 'Moving blankets and straps', true, 4),
      (skill_id_var, 'Basic toolkit (for assembly/disassembly)', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================================================
  -- OUTDOOR HELP SKILLS - Tools
  -- ============================================================================

  -- Gardening
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Gardening' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Gardening gloves', true, 1),
      (skill_id_var, 'Trowel', true, 2),
      (skill_id_var, 'Pruning shears', true, 3),
      (skill_id_var, 'Watering can/hose', true, 4),
      (skill_id_var, 'Garden fork', true, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Lawn Care
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Lawn Care' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Lawn mower', true, 1),
      (skill_id_var, 'Edger/strimmer', true, 2),
      (skill_id_var, 'Rake', true, 3),
      (skill_id_var, 'Leaf blower', false, 4),
      (skill_id_var, 'Fertilizer spreader', false, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Landscaping
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Landscaping' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Shovel', true, 1),
      (skill_id_var, 'Wheelbarrow', true, 2),
      (skill_id_var, 'Rake', true, 3),
      (skill_id_var, 'Pruning shears', true, 4),
      (skill_id_var, 'Garden hose', true, 5),
      (skill_id_var, 'Work gloves', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Leaf Raking and Removal
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Leaf Raking and Removal' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Leaf rake', true, 1),
      (skill_id_var, 'Leaf bags', true, 2),
      (skill_id_var, 'Leaf blower', false, 3),
      (skill_id_var, 'Work gloves', true, 4),
      (skill_id_var, 'Tarp', false, 5)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Roof and Gutter Cleaning
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Roof and Gutter Cleaning' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Extension ladder', true, 1),
      (skill_id_var, 'Gutter scoop', true, 2),
      (skill_id_var, 'Work gloves', true, 3),
      (skill_id_var, 'Bucket', true, 4),
      (skill_id_var, 'Garden hose', true, 5),
      (skill_id_var, 'Safety harness', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Branch and Hedge Trimming
  SELECT id INTO skill_id_var FROM skills WHERE name = 'Branch and Hedge Trimming' AND category = 'Outdoor help';
  IF skill_id_var IS NOT NULL THEN
    INSERT INTO skill_tools (skill_id, tool_name, is_required, display_order) VALUES
      (skill_id_var, 'Hedge trimmer', true, 1),
      (skill_id_var, 'Pruning shears', true, 2),
      (skill_id_var, 'Loppers', true, 3),
      (skill_id_var, 'Hand saw', true, 4),
      (skill_id_var, 'Work gloves', true, 5),
      (skill_id_var, 'Safety glasses', true, 6)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
