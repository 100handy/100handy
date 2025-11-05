-- ================================================================
-- Update Test Handymen Profiles
-- ================================================================
-- Run this in Supabase Dashboard > SQL Editor
-- This updates the auto-created profiles with correct handyman data
-- ================================================================

-- Update profiles with handyman data
UPDATE profiles SET
  role = 'handy',
  first_name = 'John',
  last_name = 'Smith',
  phone = '+447700900001',
  postcode = 'SW1A 1AA',
  avatar_url = 'https://i.pravatar.cc/150?img=12',
  rating = 4.9,
  jobs_completed = 156
WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;

UPDATE profiles SET
  role = 'handy',
  first_name = 'Sarah',
  last_name = 'Jones',
  phone = '+447700900002',
  postcode = 'SW1A 1AA',
  avatar_url = 'https://i.pravatar.cc/150?img=5',
  rating = 4.8,
  jobs_completed = 98
WHERE user_id = '00000000-0000-0000-0000-000000000002'::uuid;

UPDATE profiles SET
  role = 'handy',
  first_name = 'Mike',
  last_name = 'Wilson',
  phone = '+447700900003',
  postcode = 'SW1A 1AA',
  avatar_url = 'https://i.pravatar.cc/150?img=33',
  rating = 4.7,
  jobs_completed = 112
WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid;

UPDATE profiles SET
  role = 'handy',
  first_name = 'Emma',
  last_name = 'Davis',
  phone = '+447700900004',
  postcode = 'W1A 0AX',
  avatar_url = 'https://i.pravatar.cc/150?img=9',
  rating = 4.9,
  jobs_completed = 203
WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid;

UPDATE profiles SET
  role = 'handy',
  first_name = 'James',
  last_name = 'Brown',
  phone = '+447700900005',
  postcode = 'W1A 0AX',
  avatar_url = 'https://i.pravatar.cc/150?img=15',
  rating = 4.6,
  jobs_completed = 87
WHERE user_id = '00000000-0000-0000-0000-000000000005'::uuid;

-- Insert into handy_profiles
INSERT INTO handy_profiles (user_id, bio, hourly_rate_cents, experience_years, verified)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'Expert furniture assembler with 8+ years experience. Specializing in IKEA, flat-pack, and custom installations.', 4500, 8, true
WHERE NOT EXISTS (SELECT 1 FROM handy_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid);

INSERT INTO handy_profiles (user_id, bio, hourly_rate_cents, experience_years, verified)
SELECT '00000000-0000-0000-0000-000000000002'::uuid, 'Professional cleaner and home organizer. Detail-oriented and efficient service.', 3500, 5, true
WHERE NOT EXISTS (SELECT 1 FROM handy_profiles WHERE user_id = '00000000-0000-0000-0000-000000000002'::uuid);

INSERT INTO handy_profiles (user_id, bio, hourly_rate_cents, experience_years, verified)
SELECT '00000000-0000-0000-0000-000000000003'::uuid, 'Experienced handyman for all home repairs. Plumbing, electrical, and general maintenance.', 5500, 10, false
WHERE NOT EXISTS (SELECT 1 FROM handy_profiles WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid);

INSERT INTO handy_profiles (user_id, bio, hourly_rate_cents, experience_years, verified)
SELECT '00000000-0000-0000-0000-000000000004'::uuid, 'Moving specialist and heavy lifting expert. Safe and careful handling of your belongings.', 4000, 6, true
WHERE NOT EXISTS (SELECT 1 FROM handy_profiles WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid);

INSERT INTO handy_profiles (user_id, bio, hourly_rate_cents, experience_years, verified)
SELECT '00000000-0000-0000-0000-000000000005'::uuid, 'TV mounting and electronics installation professional. Clean cable management guaranteed.', 3800, 4, false
WHERE NOT EXISTS (SELECT 1 FROM handy_profiles WHERE user_id = '00000000-0000-0000-0000-000000000005'::uuid);

-- Link handymen to categories
INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'category_mz1bf2RxO2SrNTRonBr1F'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000001'::uuid AND category_id = 'category_mz1bf2RxO2SrNTRonBr1F');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'category_GSF4ZGyYhRbkgNjKduWfS'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000001'::uuid AND category_id = 'category_GSF4ZGyYhRbkgNjKduWfS');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000002'::uuid, 'category_aBz4iaCiPEwwSKnATa63J'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000002'::uuid AND category_id = 'category_aBz4iaCiPEwwSKnATa63J');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000003'::uuid, 'category_dwCTx9UJIPo3BeZa3ld40'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000003'::uuid AND category_id = 'category_dwCTx9UJIPo3BeZa3ld40');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000004'::uuid, 'category_K1K5U70BEm3fs8cAXiYoI'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000004'::uuid AND category_id = 'category_K1K5U70BEm3fs8cAXiYoI');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000004'::uuid, 'category_mz1bf2RxO2SrNTRonBr1F'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000004'::uuid AND category_id = 'category_mz1bf2RxO2SrNTRonBr1F');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000005'::uuid, 'category_2DXRYwNcxuFpAVnQlnypS'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000005'::uuid AND category_id = 'category_2DXRYwNcxuFpAVnQlnypS');

INSERT INTO handy_categories (handy_id, category_id)
SELECT '00000000-0000-0000-0000-000000000005'::uuid, 'category_pTwrkebrsVx3u0SefMu0Y'
WHERE NOT EXISTS (SELECT 1 FROM handy_categories WHERE handy_id = '00000000-0000-0000-0000-000000000005'::uuid AND category_id = 'category_pTwrkebrsVx3u0SefMu0Y');

-- ================================================================
-- Done! Your test handymen should now be ready.
-- ================================================================
