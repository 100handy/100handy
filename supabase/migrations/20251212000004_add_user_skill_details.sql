-- Add experience_description and supplies_owned fields to user_skills table
ALTER TABLE public.user_skills
ADD COLUMN IF NOT EXISTS experience_description TEXT,
ADD COLUMN IF NOT EXISTS supplies_owned JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.user_skills.experience_description IS 'User-provided description of their experience with this skill (0-500 characters)';
COMMENT ON COLUMN public.user_skills.supplies_owned IS 'Array of supply IDs/keys that the user has marked as owned (e.g., ["basic_supplies", "mop", "vacuum"])';
