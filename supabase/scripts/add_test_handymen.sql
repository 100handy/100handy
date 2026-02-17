-- ================================================================
-- Add Test Handymen to Database
-- ================================================================
-- Run this in Supabase Dashboard > SQL Editor
-- This creates 5 test handymen with profiles and category links
-- ================================================================
-- NOTE: These are test users - they won't be able to log in
-- They're just for displaying in the browse handymen section
-- ================================================================

-- Step 1: Insert test user IDs into auth.users (if they don't exist)
DO $$
BEGIN
  -- Insert John Smith
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'::uuid) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000000', 'john.smith@test.com', '$2a$10$dummyhashfortest', now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated', now(), now(), '', '', '', '');
  END IF;

  -- Insert Sarah Jones
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000002'::uuid) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000000', 'sarah.jones@test.com', '$2a$10$dummyhashfortest', now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated', now(), now(), '', '', '', '');
  END IF;

  -- Insert Mike Wilson
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000003'::uuid) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000000', 'mike.wilson@test.com', '$2a$10$dummyhashfortest', now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated', now(), now(), '', '', '', '');
  END IF;

  -- Insert Emma Davis
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000004'::uuid) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000000', 'emma.davis@test.com', '$2a$10$dummyhashfortest', now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated', now(), now(), '', '', '', '');
  END IF;

  -- Insert James Brown
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000005'::uuid) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000000', 'james.brown@test.com', '$2a$10$dummyhashfortest', now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated', now(), now(), '', '', '', '');
  END IF;
END $$;

-- Step 2: Insert into profiles (only if they don't exist)
INSERT INTO profiles (user_id, role, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, 'handy', 'John', 'Smith', '+447700900001', 'SW1A 1AA', 'https://i.pravatar.cc/150?img=12', 4.9, 156
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid);

INSERT INTO profiles (user_id, role, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed)
SELECT '00000000-0000-0000-0000-000000000002'::uuid, 'handy', 'Sarah', 'Jones', '+447700900002', 'SW1A 1AA', 'https://i.pravatar.cc/150?img=5', 4.8, 98
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000002'::uuid);

INSERT INTO profiles (user_id, role, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed)
SELECT '00000000-0000-0000-0000-000000000003'::uuid, 'handy', 'Mike', 'Wilson', '+447700900003', 'SW1A 1AA', 'https://i.pravatar.cc/150?img=33', 4.7, 112
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid);

INSERT INTO profiles (user_id, role, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed)
SELECT '00000000-0000-0000-0000-000000000004'::uuid, 'handy', 'Emma', 'Davis', '+447700900004', 'W1A 0AX', 'https://i.pravatar.cc/150?img=9', 4.9, 203
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid);

INSERT INTO profiles (user_id, role, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed)
SELECT '00000000-0000-0000-0000-000000000005'::uuid, 'handy', 'James', 'Brown', '+447700900005', 'W1A 0AX', 'https://i.pravatar.cc/150?img=15', 4.6, 87
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000005'::uuid);

-- Step 3: Insert into handy_profiles (only if they don't exist)
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

-- Step 4: Link handymen to categories (only if they don't exist)
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
-- Success! Test handymen have been added to the database.
-- ================================================================
-- You should now see 5 handymen when browsing categories:
-- - John Smith (£45/hr) - Furniture Assembly
-- - Sarah Jones (£35/hr) - Home Cleaning
-- - Mike Wilson (£55/hr) - General Handyman
-- - Emma Davis (£40/hr) - Moving & Furniture
-- - James Brown (£38/hr) - TV Mounting
-- ================================================================
