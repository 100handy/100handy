-- Add foreign key from handy_profiles.user_id to profiles.user_id
-- This enables PostgREST to detect the one-to-one relationship between the tables.

ALTER TABLE "public"."handy_profiles"
ADD CONSTRAINT "handy_profiles_profiles_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "public"."profiles"("user_id")
ON DELETE CASCADE;
