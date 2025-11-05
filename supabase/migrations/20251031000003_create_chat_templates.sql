-- Create chat_templates table
CREATE TABLE IF NOT EXISTS public.chat_templates (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('chat_templates'::text),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL CHECK (template_type IN ('default', 'ongoing')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_type)
);

-- Add RLS policies
ALTER TABLE public.chat_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own templates
CREATE POLICY "Users can view own chat templates"
  ON public.chat_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own templates
CREATE POLICY "Users can insert own chat templates"
  ON public.chat_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own templates
CREATE POLICY "Users can update own chat templates"
  ON public.chat_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete own chat templates"
  ON public.chat_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_chat_templates_updated_at
  BEFORE UPDATE ON public.chat_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_templates_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_chat_templates_user_id ON public.chat_templates(user_id);
CREATE INDEX idx_chat_templates_user_template_type ON public.chat_templates(user_id, template_type);
