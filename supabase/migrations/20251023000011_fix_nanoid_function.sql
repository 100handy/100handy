-- Fix nanoid function to use fully qualified function name
-- The gen_random_bytes function is in the extensions schema, not public

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
SELECT nanoid() as test_nanoid;

