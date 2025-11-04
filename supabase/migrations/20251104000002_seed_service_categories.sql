-- Seed 100Handy Service Categories with Hierarchical Structure
-- Level 0: Main Categories
-- Level 1: Subcategories
-- Level 2: Individual Services

-- ============================================================================
-- MAIN CATEGORY 1: Furniture & Assembly
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Furniture & Assembly', 'We build it so you don't have to. Our skilled handymen handle any assembly task — big or small.', NULL, NULL, 0, 1);

-- Furniture & Assembly Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Furniture & Assembly' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Furniture Assembly & Installation', 1),
    ('Outdoor & Patio Furniture Setup', 2),
    ('Desk, Bed & Dresser Assembly', 3),
    ('Bookshelf & Storage Assembly', 4),
    ('Wardrobe & Closet Setup', 5),
    ('Office Furniture Assembly', 6),
    ('Furniture Disassembly & Reassembly', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 2: Home Cleaning & Maintenance
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Home Cleaning & Maintenance', 'A clean, comfortable home — without the hassle. Whether it's a deep clean or a move-in refresh, we'll make your space shine.', NULL, NULL, 0, 2);

-- Home Cleaning & Maintenance Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Home Cleaning & Maintenance' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Standard & Deep Cleaning', 1),
    ('Move-In / Move-Out Cleaning', 2),
    ('Carpet & Upholstery Cleaning', 3),
    ('Garage, Basement & Attic Cleaning', 4),
    ('Laundry & Folding Help', 5),
    ('Power & Pressure Washing', 6),
    ('Vacation Rental Cleaning', 7),
    ('Car Wash Services', 8),
    ('Disinfection & Sanitization', 9)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 3: Handyman & Home Repairs
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Handyman & Home Repairs', 'Reliable fixes and upgrades for every room in your home. From small repairs to smart home installations — we've got it handled.', NULL, NULL, 0, 3);

-- Handyman & Home Repairs Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Handyman & Home Repairs' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('General Home Repairs', 1),
    ('Door, Cabinet & Furniture Fixes', 2),
    ('Appliance Installation & Maintenance', 3),
    ('Wall & Drywall Repairs', 4),
    ('Flooring & Tiling Help', 5),
    ('Electrical Repairs & Lighting Installation', 6),
    ('Plumbing & Leak Fixes', 7),
    ('Sealing & Caulking', 8),
    ('Smart Home Setup', 9),
    ('Window & Blind Repairs', 10),
    ('Ceiling Fan Installation', 11),
    ('Painting & Wallpapering', 12),
    ('Carpentry & Woodwork', 13),
    ('Baby Proofing Services', 14),
    ('Deck & Fence Restoration', 15),
    ('Doorbell & Home Theater Setup', 16),
    ('Home Maintenance Checkups', 17)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 4: Moving & Heavy Lifting
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Moving & Heavy Lifting', 'Move smarter — not harder. Our movers make relocation simple, fast, and stress-free.', NULL, NULL, 0, 4);

-- Moving & Heavy Lifting Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Moving & Heavy Lifting' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Local & Full-Service Moving', 1),
    ('Truck-Assisted Moves', 2),
    ('Packing & Unpacking Help', 3),
    ('Heavy Lifting Assistance', 4),
    ('Furniture Rearranging', 5),
    ('One-Item Moves', 6),
    ('Junk Pickup & Hauling', 7),
    ('Furniture & Appliance Removal', 8),
    ('Storage Unit Moving', 9),
    ('Couch & Mattress Removal', 10),
    ('Pool Table & Large Item Moving', 11)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 5: Mounting & Installation
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Mounting & Installation', 'Perfectly placed. Safely secured. We handle all your wall mounting and installation needs.', NULL, NULL, 0, 5);

-- Mounting & Installation Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Mounting & Installation' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('TV Wall Mounting', 1),
    ('Shelving & Hook Installation', 2),
    ('Mirror, Art & Décor Hanging', 3),
    ('Curtain Rod & Blinds Installation', 4),
    ('Ceiling Fan & Light Fixture Setup', 5),
    ('Holiday & Seasonal Light Hanging', 6),
    ('Smart Device Installation', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 6: Yard & Outdoor Services
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Yard & Outdoor Services', 'A beautiful yard, made effortless. Keep your outdoor spaces healthy, clean, and ready to enjoy.', NULL, NULL, 0, 6);

-- Yard & Outdoor Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Yard & Outdoor Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Lawn Mowing & Care', 1),
    ('Gardening & Planting', 2),
    ('Tree & Hedge Trimming', 3),
    ('Weed Removal & Mulching', 4),
    ('Gutter Cleaning', 5),
    ('Fence & Deck Repair', 6),
    ('Outdoor Furniture Setup', 7),
    ('Patio & Driveway Cleaning', 8),
    ('Hot Tub Cleaning', 9),
    ('Leaf Raking & Removal', 10),
    ('Power Washing', 11),
    ('Shed Maintenance', 12),
    ('Vacation Plant Watering', 13),
    ('Hose Installation', 14),
    ('Outdoor Party & Event Setup', 15)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 7: Errands, Shopping & Delivery
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Errands, Shopping & Delivery', 'We'll handle your errands so you can save time. Fast, flexible help for your everyday tasks, shopping, and deliveries.', NULL, NULL, 0, 7);

-- Errands, Shopping & Delivery Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Errands, Shopping & Delivery' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Grocery Shopping & Delivery', 1),
    ('Takeaway / Restaurant Food Pickup & Delivery', 2),
    ('Large Item & Furniture Delivery', 3),
    ('Prescription Pickup & Drop-Off', 4),
    ('Pet & Baby Supply Delivery', 5),
    ('Parcel, Package & Courier Drop-Off', 6),
    ('Donation or Charity Drop-Offs', 7),
    ('Return & Exchange Drop-Offs', 8),
    ('Coffee, Breakfast, or Meal Delivery', 9),
    ('Wait in Line or Wait for Delivery Services', 10),
    ('Contactless Delivery Options', 11),
    ('General Errand Running', 12)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 8: Personal & Virtual Assistance
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Personal & Virtual Assistance', 'An extra pair of hands — in person or online. Stay organized, productive, and stress-free.', NULL, NULL, 0, 8);

-- Personal & Virtual Assistance Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Personal & Virtual Assistance' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Personal Assistant Support', 1),
    ('Virtual Assistant Services', 2),
    ('Home & Office Organization', 3),
    ('Closet Decluttering', 4),
    ('Event & Party Preparation', 5),
    ('Interior Design Support', 6),
    ('Data Entry & Online Research', 7),
    ('Computer Help & Tech Support', 8)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 9: Family & Baby Prep
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Family & Baby Prep', 'Helping families get ready for life's big changes. From setting up the nursery to safety installations, we make home life easier.', NULL, NULL, 0, 9);

-- Family & Baby Prep Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Family & Baby Prep' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Nursery Setup & Organization', 1),
    ('Baby Proofing & Safety Installations', 2),
    ('Toy & Furniture Assembly', 3),
    ('Baby Food & Supply Delivery', 4),
    ('Room Painting & Decorating', 5),
    ('Family Cleaning & Organization', 6),
    ('Family Shopping Assistance', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 10: Office Services
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Office Services', 'Professional help to keep your workspace running smoothly. Create a productive, organized, and inspiring office environment.', NULL, NULL, 0, 10);

-- Office Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Office Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Office Cleaning', 1),
    ('Office Furniture Assembly', 2),
    ('Office Setup & Organization', 3),
    ('Tech & Equipment Installation', 4),
    ('Moving Office Furniture', 5),
    ('Supply & Snack Delivery', 6),
    ('Administrative Assistance', 7),
    ('Office Interior Design', 8),
    ('Mounting & Wall Installation', 9)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 11: Seasonal Services
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Seasonal Services', 'Ready for every season — from spring cleanups to winter prep.', NULL, NULL, 0, 11);

-- Seasonal Services - Spring & Summer (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Seasonal Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Spring & Summer', 'Spring and summer outdoor services', NULL, parent.id, 1, 1);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Seasonal Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Spring & Summer' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Spring Cleaning', 1),
    ('Gardening & Landscaping Refresh', 2),
    ('Outdoor Furniture Setup', 3),
    ('Patio & Deck Maintenance', 4)
  ) AS services(service, row_number);

-- Seasonal Services - Fall & Winter (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Seasonal Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Fall & Winter', 'Fall and winter preparation services', NULL, parent.id, 1, 2);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Seasonal Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Fall & Winter' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Snow & Ice Removal', 1),
    ('Driveway & Sidewalk Salting', 2),
    ('Pipe & AC Winterization', 3),
    ('Window & Door Insulation', 4),
    ('Storm Door Installation', 5),
    ('Holiday Decoration & Light Hanging', 6),
    ('Christmas Tree Delivery & Removal', 7),
    ('Winter Deck & Fence Maintenance', 8),
    ('Water Heater Maintenance', 9)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 12: Contactless & Online Tasks
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Contactless & Online Tasks', 'Safe, simple, and 100% contact-free options.', NULL, NULL, 0, 12);

-- Contactless & Online Tasks Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Contactless & Online Tasks' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Contactless Deliveries', 1),
    ('Prescription Pickup & Drop-Off', 2),
    ('Contactless Grocery Shopping', 3),
    ('Disinfection & Sanitizing Services', 4),
    ('Virtual Assistance', 5),
    ('Remote Errand Coordination', 6),
    ('Contactless Yard & Home Services', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 13: 100Handy Experiences & At-Home Services
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), '100Handy Experiences & At-Home Services', 'Unique entertainment, wellness, and beauty brought directly to your home. From live music to spa days, dining experiences, and professional grooming.', NULL, NULL, 0, 13);

-- ============================================================================
-- SUBCATEGORY: Personal & Social Entertainment Experiences
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Personal & Social Entertainment Experiences', 'Bring the fun home with private entertainment and interactive events. Turn your home into a venue for music, laughter, and celebration.', NULL, parent.id, 1, 1);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Personal & Social Entertainment Experiences' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Private DJ or Musician at Home', 1),
    ('Home Party Entertainment', 2),
    ('Private Karaoke Setup', 3),
    ('Home Cinema or Movie Night Setup', 4),
    ('Themed Party Entertainment', 5),
    ('Magician, Illusionist, or Mentalist for Private Events', 6),
    ('Comedian or Stand-Up Show at Home', 7),
    ('Dancers & Cultural Performers', 8),
    ('Photo Booth Setup with Instant Printing', 9),
    ('Kids'' Party Entertainers', 10),
    ('Pet Party Entertainment & Photography', 11)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Creative & Artistic Experiences
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Creative & Artistic Experiences', 'Explore your creativity with fun, hands-on activities at home. Perfect for individuals, couples, or small groups looking to create and connect.', NULL, parent.id, 1, 2);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Creative & Artistic Experiences' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Paint & Sip Events at Home', 1),
    ('Craft & Art Workshops', 2),
    ('At-Home Cooking Classes', 3),
    ('Mixology & Bartending Classes', 4),
    ('Baking & Dessert Workshops', 5),
    ('Photography or Makeup Masterclasses', 6),
    ('Perfume & Candle-Making Workshops', 7),
    ('Flower Arrangement & Terrarium Building', 8)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Relaxation & Luxury Experiences
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Relaxation & Luxury Experiences', 'Turn your home into a private spa or wellness retreat. Relax, recharge, and indulge in luxury experiences without leaving your space.', NULL, parent.id, 1, 3);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Relaxation & Luxury Experiences' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Private Spa Experience at Home', 1),
    ('Yoga or Meditation Sessions', 2),
    ('Sound Healing & Singing Bowl Therapy', 3),
    ('Couples'' Spa & Relaxation Packages', 4),
    ('Home Wellness Retreat Setup', 5),
    ('Astrology or Tarot Reading', 6)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Food & Dining Experiences
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Food & Dining Experiences', 'Restaurant-quality dining, right at your table. Enjoy exquisite food and drink experiences crafted by professionals in your own home.', NULL, parent.id, 1, 4);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Food & Dining Experiences' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Private Chef Dining Experience', 1),
    ('Wine, Cheese, or Whisky Tastings', 2),
    ('Barbecue or Outdoor Cooking Experiences', 3),
    ('Brunch Setup or Afternoon Tea at Home', 4),
    ('Cultural Dining Experiences', 5),
    ('Dessert & Chocolate Experiences', 6),
    ('Romantic Dinner & Date Night Packages', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Family & Group Entertainment
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Family & Group Entertainment', 'Fun and engaging experiences for families and friends. Make memories together with interactive and creative group activities.', NULL, parent.id, 1, 5);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Family & Group Entertainment' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Board Game or Trivia Night Setup', 1),
    ('Virtual Reality or Gaming Setup at Home', 2),
    ('Home Karaoke Party Package', 3),
    ('DIY Craft or Science Kits for Kids', 4),
    ('Home Theatre Storytime for Children', 5),
    ('Pet-Friendly Entertainment Events', 6)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Fitness & Interactive Fun
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Fitness & Interactive Fun', 'Move, dance, and energise with fitness brought to your home. Group sessions or one-to-one workouts designed for all ages and skill levels.', NULL, parent.id, 1, 6);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Fitness & Interactive Fun' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Dance Classes at Home', 1),
    ('Personal Trainer-Led Workouts', 2),
    ('Couples'' or Family Fitness Sessions', 3),
    ('Martial Arts or Boxing Classes', 4),
    ('Yoga & Pilates Group Sessions', 5),
    ('Wellness & Mindfulness Workshops', 6)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Seasonal & Themed Experiences
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Seasonal & Themed Experiences', 'Celebrate every occasion in style. From festive gatherings to creative workshops, we make every season special.', NULL, parent.id, 1, 7);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Seasonal & Themed Experiences' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Holiday Party Entertainment', 1),
    ('Outdoor Garden Party Setup', 2),
    ('Birthday & Anniversary Experience Packages', 3),
    ('Seasonal Craft Workshops', 4),
    ('Kids'' Holiday Camps & Creative Days at Home', 5)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Photography, Videography & Media
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Photography, Videography & Media', 'Capture your best moments at home. Professional creative services for families, events, and content creators.', NULL, parent.id, 1, 8);

WITH grandparent AS (SELECT id FROM categories WHERE name = '100Handy Experiences & At-Home Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Photography, Videography & Media' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('At-Home Photoshoots', 1),
    ('Professional Video Recording', 2),
    ('Event Photography & Editing Services', 3),
    ('Live Streaming Setup for Private Events', 4),
    ('Mini Studio Setup for Content Creators', 5)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 14: Beauty & Grooming Services
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Beauty & Grooming Services', 'Professional beauty and wellness treatments — all at home. From haircuts to facials, massages to manicures, our beauty experts come to you.', NULL, NULL, 0, 14);

-- ============================================================================
-- SUBCATEGORY: Hair Services
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Hair Services', 'Professional hair services at your home', NULL, parent.id, 1, 1);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Hair Services' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Wash, Haircut & Blow Dry', 1),
    ('Dry Haircut & Styling', 2),
    ('Balayage, Highlights, or Full Colour', 3),
    ('Root Retouch or Toner', 4),
    ('Deep Conditioning / Olaplex Treatments', 5),
    ('Keratin or Brazilian Blow Dry', 6),
    ('Hair Botox & Scalp Treatments', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Hair Removal
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Hair Removal', 'Professional hair removal services at home', NULL, parent.id, 1, 2);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Hair Removal' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Waxing - Full Body', 1),
    ('Threading - Face', 2),
    ('Sugaring - Body or Facial', 3)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Face & Beauty
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Face & Beauty', 'Comprehensive facial and beauty treatments', NULL, parent.id, 1, 3);

-- Lash & Brow Services (Level 2)
WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Lash & Brow Services', 'Eyebrow and eyelash treatments', NULL, parent.id, 2, 1);

WITH greatgrandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     grandparent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = greatgrandparent.id),
     parent AS (SELECT id FROM categories WHERE name = 'Lash & Brow Services' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  3,
  row_number
FROM greatgrandparent, grandparent, parent,
  (VALUES
    ('Eyebrow Shaping', 1),
    ('Brow Tinting & Lamination', 2),
    ('Eyelash Tint, Lift, or Extensions', 3),
    ('Lash Infills or Removal', 4)
  ) AS services(service, row_number);

-- Facials & Skin Care (Level 2)
WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Facials & Skin Care', 'Professional facial treatments', NULL, parent.id, 2, 2);

WITH greatgrandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     grandparent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = greatgrandparent.id),
     parent AS (SELECT id FROM categories WHERE name = 'Facials & Skin Care' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  3,
  row_number
FROM greatgrandparent, grandparent, parent,
  (VALUES
    ('Classic, Deep Cleansing, or Hydrating Facial', 1),
    ('Anti-Ageing & Brightening Treatments', 2),
    ('Steam & Extraction Facial', 3),
    ('Sheet Mask or Home Spa Facial', 4)
  ) AS services(service, row_number);

-- Makeup & Aesthetics (Level 2)
WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Makeup & Aesthetics', 'Professional makeup services', NULL, parent.id, 2, 3);

WITH greatgrandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     grandparent AS (SELECT id FROM categories WHERE name = 'Face & Beauty' AND parent_id = greatgrandparent.id),
     parent AS (SELECT id FROM categories WHERE name = 'Makeup & Aesthetics' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  3,
  row_number
FROM greatgrandparent, grandparent, parent,
  (VALUES
    ('Day or Evening Makeup', 1),
    ('Bridal & Event Makeup', 2),
    ('Skincare Consultations', 3),
    ('Ear Piercing', 4)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Nails
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Nails', 'Professional nail services at home', NULL, parent.id, 1, 4);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Nails' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Classic or Gel Manicure & Pedicure', 1),
    ('BIAB (Builder in a Bottle) Application', 2),
    ('Nail Extensions', 3),
    ('Nail Art & Finishing', 4),
    ('Nail Repair & Removal', 5),
    ('Callus Peel', 6),
    ('Paraffin Wax Treatments', 7)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Body Treatments
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Body Treatments', 'Professional body treatments at home', NULL, parent.id, 1, 5);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Body Treatments' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Full Body Exfoliation', 1),
    ('Body Wrap', 2),
    ('Spray Tanning / Sunless Tanning', 3),
    ('Body Hair Bleaching', 4),
    ('Henna Tattoos & Mehndi Art', 5)
  ) AS services(service, row_number);

-- ============================================================================
-- SUBCATEGORY: Massage & Wellness
-- ============================================================================
WITH parent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Massage & Wellness', 'Professional massage and wellness treatments', NULL, parent.id, 1, 6);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Beauty & Grooming Services' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Massage & Wellness' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Full Body & Swedish Massage', 1),
    ('Deep Tissue & Aromatherapy Massage', 2),
    ('Hot Stone & Pregnancy Massage', 3),
    ('Indian Head & Reflexology', 4),
    ('Reiki & Relaxation Massage', 5)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 15: Men's Grooming & At-Home Treatments
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Men''s Grooming & At-Home Treatments', 'Professional grooming, just for him — in the comfort of home. From haircuts to massages, we bring the barbershop and spa experience to you.', NULL, NULL, 0, 15);

-- Men's Hair & Grooming (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Hair & Grooming', 'Men''s hair and grooming services', NULL, parent.id, 1, 1);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Hair & Grooming' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Men''s Haircut', 1),
    ('Beard Trim & Shape', 2),
    ('Hot Towel Shave', 3),
    ('Skin Fade / Clipper Cut', 4),
    ('Hair & Beard Colour or Grey Blending', 5)
  ) AS services(service, row_number);

-- Men's Hair Removal (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Hair Removal', 'Men''s hair removal services', NULL, parent.id, 1, 2);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Hair Removal' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Waxing - Chest, Back, Shoulders, Neck', 1),
    ('Nose, Ear & Eyebrow Waxing', 2)
  ) AS services(service, row_number);

-- Men's Face & Skin (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Face & Skin', 'Men''s facial and skin treatments', NULL, parent.id, 1, 3);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Face & Skin' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Men''s Classic or Deep Cleansing Facial', 1),
    ('Hydrating or Anti-Ageing Facial', 2),
    ('Beard Facial', 3)
  ) AS services(service, row_number);

-- Men's Nails & Hands (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Nails & Hands', 'Men''s manicure and nail services', NULL, parent.id, 1, 4);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Nails & Hands' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Men''s Manicure & Pedicure', 1),
    ('Nail Buff & Shine', 2)
  ) AS services(service, row_number);

-- Men's Massage & Therapy (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Massage & Therapy', 'Men''s massage and therapy services', NULL, parent.id, 1, 5);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Massage & Therapy' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Deep Tissue, Sports, or Swedish Massage', 1),
    ('Hot Stone & Relaxation Massage', 2),
    ('Head, Back, or Foot Massage', 3)
  ) AS services(service, row_number);

-- Men's Other Grooming (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Other Grooming', 'Additional men''s grooming services', NULL, parent.id, 1, 6);

WITH grandparent AS (SELECT id FROM categories WHERE name = 'Men''s Grooming & At-Home Treatments' AND parent_id IS NULL),
     parent AS (SELECT id FROM categories WHERE name = 'Other Grooming' AND parent_id = grandparent.id)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  2,
  row_number
FROM grandparent, parent,
  (VALUES
    ('Eyebrow Shaping', 1),
    ('Henna Tattoos', 2),
    ('Body Hair Bleaching', 3)
  ) AS services(service, row_number);

-- ============================================================================
-- MAIN CATEGORY 16: Shared & Unisex Treatments
-- ============================================================================
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
VALUES (generate_nanoid(), 'Shared & Unisex Treatments', 'Beauty and wellness services everyone can enjoy. Perfect for couples, families, or housemates who want to relax together.', NULL, NULL, 0, 16);

-- Shared & Unisex Treatments Services (Level 1)
WITH parent AS (SELECT id FROM categories WHERE name = 'Shared & Unisex Treatments' AND parent_id IS NULL)
INSERT INTO categories (id, name, description, icon_url, parent_id, level, display_order)
SELECT
  generate_nanoid(),
  service,
  NULL,
  NULL,
  parent.id,
  1,
  row_number
FROM parent,
  (VALUES
    ('Haircuts & Blow Drys', 1),
    ('Waxing & Threading', 2),
    ('Facials & Massage (All Types)', 3),
    ('Manicures & Pedicures', 4),
    ('Gel / BIAB Nails', 5),
    ('Spray Tanning', 6),
    ('Henna Design', 7),
    ('Aromatherapy & Relaxation Treatments', 8)
  ) AS services(service, row_number);
