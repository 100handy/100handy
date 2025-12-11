-- Create professional_availability table
-- Stores weekly availability time slots for taskers

CREATE TABLE IF NOT EXISTS public.professional_availability (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('avail'::text),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own availability
CREATE POLICY "Users can insert own availability"
  ON public.professional_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own availability
CREATE POLICY "Users can update own availability"
  ON public.professional_availability
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own availability
CREATE POLICY "Users can delete own availability"
  ON public.professional_availability
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Clients can view availability for booking
CREATE POLICY "Anyone can view availability for booking"
  ON public.professional_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_professional_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_professional_availability_updated_at
  BEFORE UPDATE ON public.professional_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_professional_availability_updated_at();

-- Create indexes for faster lookups
CREATE INDEX idx_professional_availability_user_id
  ON public.professional_availability(user_id);
CREATE INDEX idx_professional_availability_day
  ON public.professional_availability(day_of_week);
CREATE INDEX idx_professional_availability_user_day
  ON public.professional_availability(user_id, day_of_week);
CREATE INDEX idx_professional_availability_active
  ON public.professional_availability(is_active) WHERE is_active = true;

-- Add comments
COMMENT ON TABLE public.professional_availability IS 'Stores weekly availability time slots for taskers';
COMMENT ON COLUMN public.professional_availability.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN public.professional_availability.timezone IS 'IANA timezone identifier for proper time handling';
