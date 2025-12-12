-- Seed comprehensive skills from 100 Handy job categories document
-- This migration adds all missing skills and updates existing ones

-- Assembly category skills
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Assembly', 'Furniture Assembly', 'tool-kit', true),
  ('Assembly', 'IKEA Assembly', 'tool-kit', true),
  ('Assembly', 'Office Furniture Assembly', 'tool-kit', true),
  ('Assembly', 'Wardrobe Assembly', 'tool-kit', false),
  ('Assembly', 'Crib Assembly', 'tool-kit', false)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Mounting category skills
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Mounting', 'TV Mounting', 'drill-svgrepo-com', true),
  ('Mounting', 'Wall Mounting', 'drill-svgrepo-com', true),
  ('Mounting', 'Put Up Shelves', 'drill-svgrepo-com', false),
  ('Mounting', 'Hanging Pictures and Artwork', 'drill-svgrepo-com', false),
  ('Mounting', 'Light Installation', 'drill-svgrepo-com', true),
  ('Mounting', 'Install Curtains and Blinds', 'drill-svgrepo-com', false)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Home Repairs category (separate from Home Improvements)
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Home Repairs', 'Minor Home Repairs', 'construct-outline', true),
  ('Home Repairs', 'Door, Cabinet, and Furniture Repairs', 'construct-outline', false),
  ('Home Repairs', 'Window and Blinds Repair', 'construct-outline', false),
  ('Home Repairs', 'Sealing and Caulking', 'construct-outline', false),
  ('Home Repairs', 'Flooring and Tiling Help', 'construct-outline', false),
  ('Home Repairs', 'Light Carpentry', 'construct-outline', false),
  ('Home Repairs', 'Indoor Painting', 'paint', true)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Plumbing category
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Plumbing', 'Leak Fixing', 'wrench', true),
  ('Plumbing', 'Drain Unblocking', 'wrench', true),
  ('Plumbing', 'Tap Replacement', 'wrench', false),
  ('Plumbing', 'Washing Machine Installation', 'wrench', false),
  ('Plumbing', 'Water Filter Installation', 'wrench', false)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Electrical category
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Electrical', 'Light Installation', 'zap', true),
  ('Electrical', 'Sockets Installation and Repair', 'zap', false),
  ('Electrical', 'Switches Installation and Repair', 'zap', false),
  ('Electrical', 'Cables Repair', 'zap', false)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Cleaning category (update existing and add new)
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Cleaning', 'General Cleaning', 'clean', true),
  ('Cleaning', 'Deep Cleaning', 'clean', true),
  ('Cleaning', 'Party Clean Up', 'clean', false),
  ('Cleaning', 'End of Tenancy Cleaning', 'clean', true),
  ('Cleaning', 'Office Cleaning', 'clean', false),
  ('Cleaning', 'AirBnB Cleaning', 'clean', true)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Moving category (update existing and add new)
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Moving', 'Van Assisted Moving Help', 'truck-svgrepo-com', true),
  ('Moving', 'Moving Help', 'truck-svgrepo-com', true),
  ('Moving', 'Waste and Furniture Removal', 'truck-svgrepo-com', false),
  ('Moving', 'Heavy Lifting and Loading', 'truck-svgrepo-com', true),
  ('Moving', 'Packing and Moving', 'truck-svgrepo-com', false),
  ('Moving', 'Full Service Movers', 'truck-svgrepo-com', true)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Update existing Outdoor Maintenance skills to Outdoor help category FIRST
-- This must happen before inserting new Outdoor help skills to avoid conflicts
UPDATE public.skills 
SET category = 'Outdoor help'
WHERE category = 'Outdoor Maintenance';

-- Outdoor help category (insert new skills that don't exist yet)
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  ('Outdoor help', 'Gardening', 'trees', false),
  ('Outdoor help', 'Lawn Care', 'trees', false),
  ('Outdoor help', 'Landscaping', 'trees', false),
  ('Outdoor help', 'Leaf Raking and Removal', 'trees', false),
  ('Outdoor help', 'Roof and Gutter Cleaning', 'trees', false),
  ('Outdoor help', 'Branch and Hedge Trimming', 'trees', false)
ON CONFLICT (category, name) DO UPDATE SET
  icon_name = EXCLUDED.icon_name,
  is_in_demand = EXCLUDED.is_in_demand;

-- Update descriptions for new skills
UPDATE public.skills SET description = 'Assemble all types of furniture from flat-pack boxes.' WHERE name = 'Furniture Assembly';
UPDATE public.skills SET description = 'Unpack and assemble all types of IKEA furniture.' WHERE name = 'IKEA Assembly';
UPDATE public.skills SET description = 'Assemble office furniture including desks, chairs, and filing cabinets.' WHERE name = 'Office Furniture Assembly';
UPDATE public.skills SET description = 'Assemble wardrobes and closet systems.' WHERE name = 'Wardrobe Assembly';
UPDATE public.skills SET description = 'Assemble cribs and baby furniture with safety standards.' WHERE name = 'Crib Assembly';

UPDATE public.skills SET description = 'Mount TVs securely on walls with proper cable management.' WHERE name = 'TV Mounting';
UPDATE public.skills SET description = 'Mount shelves, brackets, mirrors, cabinets, and décor on walls.' WHERE name = 'Wall Mounting';
UPDATE public.skills SET description = 'Install floating or bracket shelves with proper leveling.' WHERE name = 'Put Up Shelves';
UPDATE public.skills SET description = 'Hang pictures, mirrors, and artwork at perfect heights.' WHERE name = 'Hanging Pictures and Artwork';
UPDATE public.skills SET description = 'Install ceiling lights, wall lights, and chandeliers safely.' WHERE name = 'Light Installation' AND category = 'Mounting';
UPDATE public.skills SET description = 'Install curtain poles, blinds, and window treatments.' WHERE name = 'Install Curtains and Blinds';

UPDATE public.skills SET description = 'Fix small household issues and general repairs.' WHERE name = 'Minor Home Repairs';
UPDATE public.skills SET description = 'Repair doors, cabinets, and furniture including hinges and handles.' WHERE name = 'Door, Cabinet, and Furniture Repairs';
UPDATE public.skills SET description = 'Repair windows, blinds, and window treatments.' WHERE name = 'Window and Blinds Repair';
UPDATE public.skills SET description = 'Apply waterproof sealant in kitchens, bathrooms, and windows.' WHERE name = 'Sealing and Caulking';
UPDATE public.skills SET description = 'Assist with laminate, vinyl, and tile installation.' WHERE name = 'Flooring and Tiling Help';
UPDATE public.skills SET description = 'Build or repair basic wooden structures and custom woodwork.' WHERE name = 'Light Carpentry';
UPDATE public.skills SET description = 'Paint interior walls, ceilings, and trim with proper preparation.' WHERE name = 'Indoor Painting';

UPDATE public.skills SET description = 'Diagnose and fix water leaks in pipes, faucets, and valves.' WHERE name = 'Leak Fixing';
UPDATE public.skills SET description = 'Unblock drains using plungers, drain snakes, or chemicals safely.' WHERE name = 'Drain Unblocking';
UPDATE public.skills SET description = 'Remove old taps and fit new ones with proper connections.' WHERE name = 'Tap Replacement';
UPDATE public.skills SET description = 'Install washing machines with proper water and drainage connections.' WHERE name = 'Washing Machine Installation';
UPDATE public.skills SET description = 'Install under-sink or countertop water filters.' WHERE name = 'Water Filter Installation';

UPDATE public.skills SET description = 'Install ceiling and wall lights with safe electrical connections.' WHERE name = 'Light Installation' AND category = 'Electrical';
UPDATE public.skills SET description = 'Replace faulty outlets and install new power points.' WHERE name = 'Sockets Installation and Repair';
UPDATE public.skills SET description = 'Replace broken switches and install dimmer switches.' WHERE name = 'Switches Installation and Repair';
UPDATE public.skills SET description = 'Fix damaged power cables and extend wiring safely.' WHERE name = 'Cables Repair';

UPDATE public.skills SET description = 'Regular cleaning of homes and offices.' WHERE name = 'General Cleaning';
UPDATE public.skills SET description = 'Thorough cleaning including hard-to-reach areas.' WHERE name = 'Deep Cleaning';
UPDATE public.skills SET description = 'Clean up after parties including rubbish removal and stain treatment.' WHERE name = 'Party Clean Up';
UPDATE public.skills SET description = 'Complete property deep clean meeting landlord standards.' WHERE name = 'End of Tenancy Cleaning';
UPDATE public.skills SET description = 'Clean office spaces including desks, workstations, and shared areas.' WHERE name = 'Office Cleaning';
UPDATE public.skills SET description = 'Fast turnaround cleaning for AirBnB properties with linen changing.' WHERE name = 'AirBnB Cleaning';

UPDATE public.skills SET description = 'Loading and unloading items with van assistance.' WHERE name = 'Van Assisted Moving Help';
UPDATE public.skills SET description = 'Help with loading, unloading, and moving items.' WHERE name = 'Moving Help';
UPDATE public.skills SET description = 'Collect and remove unwanted furniture and waste.' WHERE name = 'Waste and Furniture Removal';
UPDATE public.skills SET description = 'Safely move heavy furniture and appliances with proper techniques.' WHERE name = 'Heavy Lifting and Loading';
UPDATE public.skills SET description = 'Pack items securely and assist with moving.' WHERE name = 'Packing and Moving';
UPDATE public.skills SET description = 'Complete packing, transportation, and furniture assembly service.' WHERE name = 'Full Service Movers';

UPDATE public.skills SET description = 'Plant care, watering, weed removal, and garden maintenance.' WHERE name = 'Gardening';
UPDATE public.skills SET description = 'Mowing, edging, fertilizing, and lawn maintenance.' WHERE name = 'Lawn Care';
UPDATE public.skills SET description = 'Planting shrubs, trees, flowers, and garden design.' WHERE name = 'Landscaping';
UPDATE public.skills SET description = 'Rake and remove leaves from lawns and pathways.' WHERE name = 'Leaf Raking and Removal';
UPDATE public.skills SET description = 'Clear debris, blockages, and clean gutters safely.' WHERE name = 'Roof and Gutter Cleaning';
UPDATE public.skills SET description = 'Trim hedges, bushes, and light tree branch trimming.' WHERE name = 'Branch and Hedge Trimming';
