-- Migration: Seed test user skills for sample professionals
-- Description: Adds skills to the test professionals so they appear in category searches

-- Add TV Mounting skill to user 5 (TV mounting specialist)
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
VALUES ('00000000-0000-0000-0000-000000000005', 'skills_4L2xDmwKA6j1qwlWgLY3d', 2500)
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add Wall Mounting skill to user 5
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
VALUES ('00000000-0000-0000-0000-000000000005', 'skills_z77RwZ32I9QGkSjH972Nh', 2200)
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add Furniture Assembly to user 1 (furniture assembler)
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
VALUES ('00000000-0000-0000-0000-000000000001', 'skills_ahUyQMDjwQNtAOYq3r3TQ', 2000)
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add Home Cleaning to user 2 (cleaner)
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
SELECT '00000000-0000-0000-0000-000000000002', id, 1800
FROM skills WHERE name = 'Home Cleaning'
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add General Repairs to user 3 (handyman)
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
SELECT '00000000-0000-0000-0000-000000000003', id, 2200
FROM skills WHERE name ILIKE '%repair%' LIMIT 3
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add Moving Help to user 4 (moving specialist)
INSERT INTO user_skills (user_id, skill_id, hourly_rate_cents)
SELECT '00000000-0000-0000-0000-000000000004', id, 2000
FROM skills WHERE name ILIKE '%moving%' OR name ILIKE '%lifting%'
ON CONFLICT (user_id, skill_id) DO NOTHING;
