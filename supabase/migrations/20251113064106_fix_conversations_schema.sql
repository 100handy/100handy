-- Fix conversations schema to support one conversation per client-tasker pair
-- Migration: 20251113064106_fix_conversations_schema.sql

-- Step 1: Add booking_id to conversation_messages table
ALTER TABLE public.conversation_messages
ADD COLUMN IF NOT EXISTS booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL;

-- Step 2: Create index for booking_id in messages
CREATE INDEX IF NOT EXISTS idx_conversation_messages_booking
  ON public.conversation_messages(booking_id);

-- Step 3: Drop any unique constraint on booking_id in conversations table
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the unique constraint on booking_id
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.conversations'::regclass
    AND contype = 'u'
    AND conkey = ARRAY[(SELECT attnum FROM pg_attribute
                        WHERE attrelid = 'public.conversations'::regclass
                        AND attname = 'booking_id')];

    -- Drop it if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.conversations DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

-- Step 4: Make booking_id nullable in conversations (before we drop it)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'conversations'
        AND column_name = 'booking_id'
    ) THEN
        ALTER TABLE public.conversations
        ALTER COLUMN booking_id DROP NOT NULL;
    END IF;
END $$;

-- Step 5: Drop booking_id from conversations table
ALTER TABLE public.conversations
DROP COLUMN IF EXISTS booking_id;

-- Step 6: Add UNIQUE constraint on (client_id, tasker_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.conversations'::regclass
        AND conname = 'conversations_client_id_tasker_id_key'
    ) THEN
        ALTER TABLE public.conversations
        ADD CONSTRAINT conversations_client_id_tasker_id_key UNIQUE (client_id, tasker_id);
    END IF;
END $$;

-- Update table comments
COMMENT ON TABLE public.conversations IS 'Stores conversations between clients and taskers (one per client-tasker pair, reused across all their bookings)';
COMMENT ON TABLE public.conversation_messages IS 'Stores messages within conversations between clients and taskers (booking_id links message to specific booking context)';
