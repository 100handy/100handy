-- Create skill_sets table to store skill expectations
CREATE TABLE IF NOT EXISTS public.skill_sets (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('skill_sets'::text),
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('required', 'additional')),
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, skill_type, description, display_order)
);

-- Create skill_tools table for tools required for each skill
CREATE TABLE IF NOT EXISTS public.skill_tools (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('skill_tools'::text),
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, tool_name)
);

-- Add RLS policies for skill_sets table
ALTER TABLE public.skill_sets ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view skill sets
CREATE POLICY "Anyone can view skill sets"
  ON public.skill_sets
  FOR SELECT
  TO authenticated
  USING (true);

-- Add RLS policies for skill_tools table
ALTER TABLE public.skill_tools ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view skill tools
CREATE POLICY "Anyone can view skill tools"
  ON public.skill_tools
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for faster lookups
CREATE INDEX idx_skill_sets_skill_id ON public.skill_sets(skill_id);
CREATE INDEX idx_skill_sets_type ON public.skill_sets(skill_type);
CREATE INDEX idx_skill_tools_skill_id ON public.skill_tools(skill_id);
CREATE INDEX idx_skill_tools_required ON public.skill_tools(is_required);
