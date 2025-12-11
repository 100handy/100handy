-- Create professional_work_areas table
-- Stores polygon coordinates defining tasker's service area

CREATE TABLE IF NOT EXISTS public.professional_work_areas (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('work_area'::text),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coordinates JSONB NOT NULL, -- Array of {latitude, longitude} objects forming a closed polygon
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One work area per tasker
);

-- Enable RLS
ALTER TABLE public.professional_work_areas ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own work area
CREATE POLICY "Users can insert own work area"
  ON public.professional_work_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own work area
CREATE POLICY "Users can update own work area"
  ON public.professional_work_areas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own work area
CREATE POLICY "Users can delete own work area"
  ON public.professional_work_areas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Clients can view work areas for searching taskers
CREATE POLICY "Anyone can view work areas for search"
  ON public.professional_work_areas
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_professional_work_areas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_professional_work_areas_updated_at
  BEFORE UPDATE ON public.professional_work_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_professional_work_areas_updated_at();

-- Create index for user lookups
CREATE INDEX idx_professional_work_areas_user_id
  ON public.professional_work_areas(user_id);

-- Add comments
COMMENT ON TABLE public.professional_work_areas IS 'Stores polygon coordinates defining tasker service areas';
COMMENT ON COLUMN public.professional_work_areas.coordinates IS 'Array of {latitude: number, longitude: number} objects forming a closed polygon';
