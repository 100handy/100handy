-- Create device push token storage for Expo Push Notifications
-- Aligns with existing project conventions (text nanoid IDs, RLS enabled)

CREATE TABLE IF NOT EXISTS "public"."device_push_tokens" (
  "id" "text" PRIMARY KEY DEFAULT "public"."generate_nanoid"('push_token'::text),
  "user_id" "uuid" NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
  "expo_push_token" "text" NOT NULL,
  "platform" "text" NOT NULL,
  "device_id" "text",
  "created_at" timestamp with time zone DEFAULT "now"(),
  "updated_at" timestamp with time zone DEFAULT "now"(),
  "last_seen_at" timestamp with time zone DEFAULT "now"(),
  CONSTRAINT "device_push_tokens_platform_check" CHECK (platform = ANY (ARRAY['ios'::text, 'android'::text]))
);

-- Uniqueness + lookup performance
CREATE UNIQUE INDEX IF NOT EXISTS "device_push_tokens_user_token_key"
  ON "public"."device_push_tokens" ("user_id", "expo_push_token");

CREATE INDEX IF NOT EXISTS "device_push_tokens_user_id_idx"
  ON "public"."device_push_tokens" ("user_id");

ALTER TABLE "public"."device_push_tokens" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'device_push_tokens'
      AND policyname = 'Users can manage own device push tokens'
  ) THEN
    CREATE POLICY "Users can manage own device push tokens"
      ON "public"."device_push_tokens"
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

GRANT ALL ON TABLE "public"."device_push_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."device_push_tokens" TO "service_role";


