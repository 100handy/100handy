-- Create conversations system for client-tasker messaging
-- Migration: 20251111113020_create_conversations.sql

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('conv'::text),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tasker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  client_unread_count INTEGER DEFAULT 0,
  tasker_unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, tasker_id)
);

-- Create conversation_messages table
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id TEXT PRIMARY KEY DEFAULT generate_nanoid('msg'::text),
  conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'image')),
  attachment_url TEXT,
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_client
  ON public.conversations(client_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_tasker
  ON public.conversations(tasker_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation
  ON public.conversation_messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_sender
  ON public.conversation_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_booking
  ON public.conversation_messages(booking_id);

-- Function to update last_message_at and unread counts when a new message is added
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message_at = NEW.created_at,
    updated_at = NOW(),
    -- Increment unread count for the recipient
    client_unread_count = CASE
      WHEN NEW.sender_id != client_id AND NEW.message_type != 'system'
      THEN client_unread_count + 1
      ELSE client_unread_count
    END,
    tasker_unread_count = CASE
      WHEN NEW.sender_id != tasker_id AND NEW.message_type != 'system'
      THEN tasker_unread_count + 1
      ELSE tasker_unread_count
    END
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update conversation on new message
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON public.conversation_messages;
CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON public.conversation_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Function to reset unread count when messages are marked as read
CREATE OR REPLACE FUNCTION reset_unread_count()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Determine if the reader is client or tasker
  SELECT CASE
    WHEN NEW.sender_id = (SELECT client_id FROM public.conversations WHERE id = NEW.conversation_id)
    THEN 'tasker'
    ELSE 'client'
  END INTO user_role;

  -- Reset the appropriate unread count
  IF user_role = 'client' THEN
    UPDATE public.conversations
    SET client_unread_count = 0
    WHERE id = NEW.conversation_id;
  ELSE
    UPDATE public.conversations
    SET tasker_unread_count = 0
    WHERE id = NEW.conversation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Conversation participants can read conversations' AND tablename = 'conversations') THEN
    CREATE POLICY "Conversation participants can read conversations"
      ON public.conversations
      FOR SELECT
      USING (
        auth.uid() = client_id OR auth.uid() = tasker_id
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Conversation participants can update conversations' AND tablename = 'conversations') THEN
    CREATE POLICY "Conversation participants can update conversations"
      ON public.conversations
      FOR UPDATE
      USING (
        auth.uid() = client_id OR auth.uid() = tasker_id
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can create conversations' AND tablename = 'conversations') THEN
    CREATE POLICY "System can create conversations"
      ON public.conversations
      FOR INSERT
      WITH CHECK (
        auth.uid() = client_id OR auth.uid() = tasker_id
      );
  END IF;
END $$;

-- RLS Policies for conversation_messages
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Conversation participants can read messages' AND tablename = 'conversation_messages') THEN
    CREATE POLICY "Conversation participants can read messages"
      ON public.conversation_messages
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.conversations
          WHERE id = conversation_id
          AND (auth.uid() = client_id OR auth.uid() = tasker_id)
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Conversation participants can send messages' AND tablename = 'conversation_messages') THEN
    CREATE POLICY "Conversation participants can send messages"
      ON public.conversation_messages
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.conversations
          WHERE id = conversation_id
          AND (auth.uid() = client_id OR auth.uid() = tasker_id)
        )
        AND auth.uid() = sender_id
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Message recipients can mark as read' AND tablename = 'conversation_messages') THEN
    CREATE POLICY "Message recipients can mark as read"
      ON public.conversation_messages
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.conversations
          WHERE id = conversation_id
          AND auth.uid() != sender_id
          AND (auth.uid() = client_id OR auth.uid() = tasker_id)
        )
      );
  END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON TABLE public.conversations TO authenticated;
GRANT ALL ON TABLE public.conversation_messages TO authenticated;

-- Comment on tables
COMMENT ON TABLE public.conversations IS 'Stores conversations between clients and taskers (one per client-tasker pair, reused across all their bookings)';
COMMENT ON TABLE public.conversation_messages IS 'Stores messages within conversations between clients and taskers (booking_id links message to specific booking context)';
