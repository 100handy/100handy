-- Migration: Add business_photos table for professional portfolio photos
-- Each photo is linked to a specific skill the professional offers

CREATE TABLE business_photos (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('photo'),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_skill_id TEXT NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add table comment
COMMENT ON TABLE business_photos IS 'Portfolio photos uploaded by professionals, organized by skill';

-- Enable RLS
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;

-- Professionals can view their own photos
CREATE POLICY "Users can view own photos" ON business_photos
  FOR SELECT USING (auth.uid() = user_id);

-- Professionals can insert their own photos
CREATE POLICY "Users can insert own photos" ON business_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Professionals can update their own photos (for reordering)
CREATE POLICY "Users can update own photos" ON business_photos
  FOR UPDATE USING (auth.uid() = user_id);

-- Professionals can delete their own photos
CREATE POLICY "Users can delete own photos" ON business_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Public can view all photos (for tasker profiles visible to clients)
CREATE POLICY "Public can view all business photos" ON business_photos
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_business_photos_user_skill ON business_photos(user_skill_id);
CREATE INDEX idx_business_photos_user ON business_photos(user_id);
CREATE INDEX idx_business_photos_order ON business_photos(user_skill_id, display_order);
