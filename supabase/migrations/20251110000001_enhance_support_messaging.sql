-- Enhance support messaging with attachments, message types, and better tracking
-- Migration: 20251110000001_enhance_support_messaging.sql

-- Add new columns to support_messages table
ALTER TABLE public.support_messages
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'interactive')),
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add comment to clarify metadata usage
COMMENT ON COLUMN public.support_messages.metadata IS 'Stores interactive element data like dropdown values, button states, etc.';

-- Add new columns to support_tickets table
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_created
  ON public.support_messages(ticket_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_updated
  ON public.support_tickets(user_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status
  ON public.support_tickets(status);

CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned
  ON public.support_tickets(assigned_to) WHERE assigned_to IS NOT NULL;

-- Create function to update last_message_at when a new message is added
CREATE OR REPLACE FUNCTION update_ticket_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.support_tickets
  SET
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.ticket_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_message_at
DROP TRIGGER IF EXISTS trigger_update_ticket_last_message ON public.support_messages;
CREATE TRIGGER trigger_update_ticket_last_message
  AFTER INSERT ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_last_message();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_support_tickets_updated_at();

-- Update RLS policies to include new columns
-- The existing policies should already cover these new columns,
-- but we'll ensure attachments are handled properly

-- Grant necessary permissions
GRANT ALL ON TABLE public.support_messages TO authenticated;
GRANT ALL ON TABLE public.support_tickets TO authenticated;

-- Create storage bucket for support attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-attachments', 'support-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for support attachments
CREATE POLICY "Users can upload their own support attachments"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'support-attachments' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own support attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'support-attachments' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all support attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'support-attachments' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy for admins to manage support messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Admins can update support messages'
        AND tablename = 'support_messages'
    ) THEN
        CREATE POLICY "Admins can update support messages"
          ON public.support_messages
          FOR UPDATE
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );
    END IF;
END $$;

-- Add policy for admins to update support tickets
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Admins can update all support tickets'
        AND tablename = 'support_tickets'
    ) THEN
        CREATE POLICY "Admins can update all support tickets"
          ON public.support_tickets
          FOR UPDATE
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );
    END IF;
END $$;
