-- Create nanoid function for generating URL-safe unique IDs
-- This replaces BIGSERIAL for better scalability and public-facing IDs

-- Enable pgcrypto extension for random bytes generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create nanoid function
-- Generates a 21-character URL-safe unique ID (default size)
-- Uses alphabet: 0-9, A-Z, a-z (62 characters)
CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21)
RETURNS text AS $$
DECLARE
  id text := '';
  alphabet text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  bytes bytea := extensions.gen_random_bytes(size);
  i int := 0;
BEGIN
  WHILE i < size LOOP
    id := id || substr(alphabet, get_byte(bytes, i) % 62 + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN id;
END
$$ LANGUAGE plpgsql VOLATILE;

-- Test the function
-- SELECT nanoid(); -- Should return a 21-character string like: 'V1StGXR8_Z5jdHi6B-myT'

