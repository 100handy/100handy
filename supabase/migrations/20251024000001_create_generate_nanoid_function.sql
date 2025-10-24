-- Create generate_nanoid function with prefix support
-- This function generates a nanoid with an optional prefix
-- Example: generate_nanoid('boost') -> 'boost_V1StGXR8_Z5jdHi6B-myT'

CREATE OR REPLACE FUNCTION generate_nanoid(prefix text, size int DEFAULT 21)
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

  -- Add prefix with underscore separator
  IF prefix IS NOT NULL AND prefix != '' THEN
    RETURN prefix || '_' || id;
  ELSE
    RETURN id;
  END IF;
END
$$ LANGUAGE plpgsql VOLATILE;

-- Test the function
SELECT generate_nanoid('boost') as test_boost_nanoid;
SELECT generate_nanoid('test', 10) as test_short_nanoid;
