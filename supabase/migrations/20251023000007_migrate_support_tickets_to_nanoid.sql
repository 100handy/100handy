-- Migrate support_tickets and support_messages tables from BIGSERIAL to nanoid

-- Step 0: Drop RLS policies that reference support_tickets.id
DROP POLICY IF EXISTS "Users can create messages in own tickets" ON support_messages;
DROP POLICY IF EXISTS "Users can read own ticket messages" ON support_messages;

-- Migrate support_tickets first
ALTER TABLE support_tickets ADD COLUMN id_new TEXT;
UPDATE support_tickets SET id_new = nanoid();
ALTER TABLE support_tickets ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_id_new_unique UNIQUE (id_new);

-- Update foreign key references in support_messages
ALTER TABLE support_messages ADD COLUMN ticket_id_new TEXT;
UPDATE support_messages sm 
  SET ticket_id_new = st.id_new 
  FROM support_tickets st 
  WHERE sm.ticket_id = st.id;

-- Drop old foreign key constraint
ALTER TABLE support_messages DROP CONSTRAINT IF EXISTS support_messages_ticket_id_fkey;

-- Drop old primary key and columns
ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_pkey;
ALTER TABLE support_tickets DROP COLUMN id;
ALTER TABLE support_messages DROP COLUMN ticket_id;

-- Rename new columns
ALTER TABLE support_tickets RENAME COLUMN id_new TO id;
ALTER TABLE support_messages RENAME COLUMN ticket_id_new TO ticket_id;

-- Add new primary key and foreign key
ALTER TABLE support_tickets ADD PRIMARY KEY (id);
ALTER TABLE support_messages ADD CONSTRAINT support_messages_ticket_id_fkey 
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE;

-- Drop old sequence
DROP SEQUENCE IF EXISTS support_tickets_id_seq;

-- Now migrate support_messages
ALTER TABLE support_messages ADD COLUMN id_new TEXT;
UPDATE support_messages SET id_new = nanoid();
ALTER TABLE support_messages ALTER COLUMN id_new SET NOT NULL;
ALTER TABLE support_messages ADD CONSTRAINT support_messages_id_new_unique UNIQUE (id_new);

-- Drop old primary key
ALTER TABLE support_messages DROP CONSTRAINT IF EXISTS support_messages_pkey;
ALTER TABLE support_messages DROP COLUMN id;

-- Rename new column
ALTER TABLE support_messages RENAME COLUMN id_new TO id;

-- Add new primary key
ALTER TABLE support_messages ADD PRIMARY KEY (id);

-- Drop old sequence
DROP SEQUENCE IF EXISTS support_messages_id_seq;

-- Step 9: Recreate RLS policies that were dropped
CREATE POLICY "Users can create messages in own tickets" ON support_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets t 
      WHERE t.id = support_messages.ticket_id 
        AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own ticket messages" ON support_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets t 
      WHERE t.id = support_messages.ticket_id 
        AND t.user_id = auth.uid()
    )
  );

