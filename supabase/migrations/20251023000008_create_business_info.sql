-- Create business_info table for VAT and company information
CREATE TABLE business_info (
  id TEXT PRIMARY KEY DEFAULT nanoid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vat_id TEXT,
  company_name TEXT,
  business_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only view their own business info
CREATE POLICY "Users can view own business info"
  ON business_info
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own business info
CREATE POLICY "Users can insert own business info"
  ON business_info
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own business info
CREATE POLICY "Users can update own business info"
  ON business_info
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own business info
CREATE POLICY "Users can delete own business info"
  ON business_info
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_business_info_user_id ON business_info(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER business_info_updated_at
  BEFORE UPDATE ON business_info
  FOR EACH ROW
  EXECUTE FUNCTION update_business_info_updated_at();

