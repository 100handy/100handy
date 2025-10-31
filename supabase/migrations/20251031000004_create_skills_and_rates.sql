-- Create skills table (predefined skills)
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('skills'::text),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon_name TEXT,
  is_in_demand BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, name)
);

-- Create user_skills table (user's selected skills with rates)
CREATE TABLE IF NOT EXISTS public.user_skills (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('user_skills'::text),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  hourly_rate_cents INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Add RLS policies for skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view skills
CREATE POLICY "Anyone can view skills"
  ON public.skills
  FOR SELECT
  TO authenticated
  USING (true);

-- Add RLS policies for user_skills table
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own skills
CREATE POLICY "Users can view own skills"
  ON public.user_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own skills
CREATE POLICY "Users can insert own skills"
  ON public.user_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own skills
CREATE POLICY "Users can update own skills"
  ON public.user_skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own skills
CREATE POLICY "Users can delete own skills"
  ON public.user_skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_user_skills_updated_at();

-- Create indexes for faster lookups
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX idx_skills_category ON public.skills(category);

-- Insert predefined skills
INSERT INTO public.skills (category, name, icon_name, is_in_demand) VALUES
  -- Assembly
  ('Assembly', 'Furniture Assembly', 'tool-kit', true),
  ('Assembly', 'IKEA Assembly', 'tool-kit', true),
  ('Assembly', 'Bookshelf Assembly', 'tool-kit', false),

  -- Cleaning
  ('Cleaning', 'General Cleaning', 'clean', true),
  ('Cleaning', 'Deep Cleaning', 'clean', true),
  ('Cleaning', 'Move In/Out Cleaning', 'clean', false),

  -- Home Improvements
  ('Home Improvements', 'General Repairs', 'construct-outline', false),
  ('Home Improvements', 'Drywall Repair', 'construct-outline', false),
  ('Home Improvements', 'Minor Plumbing', 'construct-outline', true),

  -- Mounting
  ('Mounting', 'TV Mounting', 'drill-svgrepo-com', true),
  ('Mounting', 'Shelf Mounting', 'drill-svgrepo-com', false),
  ('Mounting', 'Picture Hanging', 'drill-svgrepo-com', false),

  -- Moving
  ('Moving', 'Moving Help', 'truck-svgrepo-com', true),
  ('Moving', 'Heavy Lifting', 'truck-svgrepo-com', true),
  ('Moving', 'Packing', 'truck-svgrepo-com', false),

  -- Outdoor Maintenance
  ('Outdoor Maintenance', 'Lawn Mowing', 'trees', false),
  ('Outdoor Maintenance', 'Gardening', 'trees', false),
  ('Outdoor Maintenance', 'Yard Cleanup', 'trees', false),

  -- Painting
  ('Painting', 'Interior Painting', 'paint', true),
  ('Painting', 'Exterior Painting', 'paint', false),
  ('Painting', 'Touch Up', 'paint', false),

  -- Personal Assistance
  ('Personal Assistance', 'Errands', 'md-paper', false),
  ('Personal Assistance', 'Shopping', 'md-paper', false),
  ('Personal Assistance', 'Organization', 'md-paper', false),

  -- Other
  ('Other', 'Pet Care', 'task', false),
  ('Other', 'Delivery', 'task', false),
  ('Other', 'Wait in Line', 'task', false)
ON CONFLICT (category, name) DO NOTHING;
