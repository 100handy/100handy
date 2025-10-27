-- Initial schema migration (consolidated from production backup)
-- This represents the production database state as of 2025-10-23
-- 
-- ✅ This migration is IDEMPOTENT - safe to re-run without errors
-- All CREATE statements use IF NOT EXISTS or DO blocks

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Custom Types (idempotent - safe to re-run)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE "public"."booking_status" AS ENUM (
            'pending',
            'accepted',
            'in_progress',
            'completed',
            'cancelled'
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE "public"."payment_status" AS ENUM (
            'pending',
            'paid',
            'failed',
            'refunded'
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "public"."user_role" AS ENUM (
            'customer',
            'handy',
            'admin'
        );
    END IF;
END $$;

-- Functions
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Insert into profiles with additional fields from raw_user_meta_data
  INSERT INTO public.profiles (
    user_id,
    role,
    first_name,
    last_name,
    phone,
    postcode
  )
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role),
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'postcode'
  );

  -- Insert default notification settings
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Tables
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "role" "public"."user_role" DEFAULT 'customer'::"public"."user_role" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "postcode" "text",
    "avatar_url" "text",
    "rating" numeric(3,2) DEFAULT 0,
    "jobs_completed" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."notification_settings" (
    "user_id" "uuid" NOT NULL,
    "push_notifications" boolean DEFAULT true,
    "sms_notifications" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT true,
    "marketing_emails" boolean DEFAULT false,
    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "street" "text" NOT NULL,
    "apartment" "text",
    "postcode" "text" NOT NULL,
    "city" "text",
    "country" "text" DEFAULT 'UK'::"text" NOT NULL,
    "is_primary" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS "public"."addresses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."addresses_id_seq" OWNED BY "public"."addresses"."id";
ALTER TABLE ONLY "public"."addresses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."addresses_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon_url" "text",
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "categories_name_key" UNIQUE ("name")
);

CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";
ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."handy_profiles" (
    "user_id" "uuid" NOT NULL,
    "bio" "text",
    "hourly_rate_cents" integer DEFAULT 0 NOT NULL,
    "experience_years" integer DEFAULT 0,
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "handy_profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "handy_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."handy_categories" (
    "handy_id" "uuid" NOT NULL,
    "category_id" bigint NOT NULL,
    CONSTRAINT "handy_categories_pkey" PRIMARY KEY ("handy_id", "category_id"),
    CONSTRAINT "handy_categories_handy_id_fkey" FOREIGN KEY ("handy_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "handy_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" bigint NOT NULL,
    "customer_id" "uuid",
    "handy_id" "uuid",
    "category_id" bigint,
    "task_title" "text" NOT NULL,
    "task_details" "text",
    "scheduled_date" "date" NOT NULL,
    "scheduled_time" time without time zone NOT NULL,
    "address_id" bigint,
    "hourly_rate_cents" integer NOT NULL,
    "estimated_hours" numeric(3,1) DEFAULT 1.0,
    "status" "public"."booking_status" DEFAULT 'pending'::"public"."booking_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bookings_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id"),
    CONSTRAINT "bookings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id"),
    CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT,
    CONSTRAINT "bookings_handy_id_fkey" FOREIGN KEY ("handy_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT
);

CREATE SEQUENCE IF NOT EXISTS "public"."bookings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."bookings_id_seq" OWNED BY "public"."bookings"."id";
ALTER TABLE ONLY "public"."bookings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bookings_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" bigint NOT NULL,
    "booking_id" bigint,
    "amount_cents" integer NOT NULL,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status" NOT NULL,
    "stripe_payment_intent_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payments_booking_id_key" UNIQUE ("booking_id"),
    CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS "public"."payments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."payments_id_seq" OWNED BY "public"."payments"."id";
ALTER TABLE ONLY "public"."payments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."payments_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" bigint NOT NULL,
    "booking_id" bigint,
    "customer_id" "uuid",
    "handy_id" "uuid",
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "reviews_booking_id_key" UNIQUE ("booking_id"),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE,
    CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "reviews_handy_id_fkey" FOREIGN KEY ("handy_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS "public"."reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."reviews_id_seq" OWNED BY "public"."reviews"."id";
ALTER TABLE ONLY "public"."reviews" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."reviews_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "customer_id" "uuid" NOT NULL,
    "handy_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "favorites_pkey" PRIMARY KEY ("customer_id", "handy_id"),
    CONSTRAINT "favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "favorites_handy_id_fkey" FOREIGN KEY ("handy_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."consents" (
    "user_id" "uuid" NOT NULL,
    "accepted_terms" boolean NOT NULL,
    "accepted_privacy" boolean NOT NULL,
    "accepted_marketing" boolean DEFAULT false,
    "accepted_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "consents_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."support_tickets" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "subject" "text" DEFAULT 'General Support'::"text",
    "status" "text" DEFAULT 'open'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS "public"."support_tickets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."support_tickets_id_seq" OWNED BY "public"."support_tickets"."id";
ALTER TABLE ONLY "public"."support_tickets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."support_tickets_id_seq"'::"regclass");

CREATE TABLE IF NOT EXISTS "public"."support_messages" (
    "id" bigint NOT NULL,
    "ticket_id" bigint,
    "from_user" boolean NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "support_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS "public"."support_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."support_messages_id_seq" OWNED BY "public"."support_messages"."id";
ALTER TABLE ONLY "public"."support_messages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."support_messages_id_seq"'::"regclass");

-- Indexes (idempotent - safe to re-run)
CREATE INDEX IF NOT EXISTS "bookings_customer_idx" ON "public"."bookings" USING "btree" ("customer_id");
CREATE INDEX IF NOT EXISTS "bookings_handy_idx" ON "public"."bookings" USING "btree" ("handy_id");
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "public"."bookings" USING "btree" ("status");
CREATE INDEX IF NOT EXISTS "handy_categories_idx" ON "public"."handy_categories" USING "btree" ("category_id", "handy_id");
CREATE INDEX IF NOT EXISTS "profiles_postcode_idx" ON "public"."profiles" USING "btree" ("postcode");
CREATE INDEX IF NOT EXISTS "profiles_role_idx" ON "public"."profiles" USING "btree" ("role");

-- Enable Row Level Security
ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."consents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."handy_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."handy_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notification_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."support_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."support_tickets" ENABLE ROW LEVEL SECURITY;

-- RLS Policies (idempotent - safe to re-run)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own addresses' AND tablename = 'addresses') THEN
        CREATE POLICY "Users can manage own addresses" ON "public"."addresses" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Booking parties can read bookings' AND tablename = 'bookings') THEN
        CREATE POLICY "Booking parties can read bookings" ON "public"."bookings" FOR SELECT USING ((("auth"."uid"() = "customer_id") OR ("auth"."uid"() = "handy_id")));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Booking parties can update bookings' AND tablename = 'bookings') THEN
        CREATE POLICY "Booking parties can update bookings" ON "public"."bookings" FOR UPDATE USING ((("auth"."uid"() = "customer_id") OR ("auth"."uid"() = "handy_id")));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can create bookings' AND tablename = 'bookings') THEN
        CREATE POLICY "Customers can create bookings" ON "public"."bookings" FOR INSERT WITH CHECK (("auth"."uid"() = "customer_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own consents' AND tablename = 'consents') THEN
        CREATE POLICY "Users can manage own consents" ON "public"."consents" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can manage favorites' AND tablename = 'favorites') THEN
        CREATE POLICY "Customers can manage favorites" ON "public"."favorites" USING (("auth"."uid"() = "customer_id")) WITH CHECK (("auth"."uid"() = "customer_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read handy categories' AND tablename = 'handy_categories') THEN
        CREATE POLICY "Public can read handy categories" ON "public"."handy_categories" FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Handymen can manage own categories' AND tablename = 'handy_categories') THEN
        CREATE POLICY "Handymen can manage own categories" ON "public"."handy_categories" USING (("auth"."uid"() = "handy_id")) WITH CHECK (("auth"."uid"() = "handy_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can read handy profiles' AND tablename = 'handy_profiles') THEN
        CREATE POLICY "Customers can read handy profiles" ON "public"."handy_profiles" FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Handymen can manage own profile' AND tablename = 'handy_profiles') THEN
        CREATE POLICY "Handymen can manage own profile" ON "public"."handy_profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own notification settings' AND tablename = 'notification_settings') THEN
        CREATE POLICY "Users can manage own notification settings" ON "public"."notification_settings" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Booking parties can read payments' AND tablename = 'payments') THEN
        CREATE POLICY "Booking parties can read payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1 FROM "public"."bookings" "b" WHERE (("b"."id" = "payments"."booking_id") AND (("b"."customer_id" = "auth"."uid"()) OR ("b"."handy_id" = "auth"."uid"()))))));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage payments' AND tablename = 'payments') THEN
        CREATE POLICY "Service role can manage payments" ON "public"."payments" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can manage own profile" ON "public"."profiles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can read handy profiles' AND tablename = 'profiles') THEN
        CREATE POLICY "Customers can read handy profiles" ON "public"."profiles" FOR SELECT USING (("role" = 'handy'::"public"."user_role"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Public can read reviews" ON "public"."reviews" FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can create reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Customers can create reviews" ON "public"."reviews" FOR INSERT WITH CHECK ((("auth"."uid"() = "customer_id") AND (EXISTS ( SELECT 1 FROM "public"."bookings" "b" WHERE (("b"."id" = "reviews"."booking_id") AND ("b"."customer_id" = "auth"."uid"()) AND ("b"."status" = 'completed'::"public"."booking_status"))))));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all support messages' AND tablename = 'support_messages') THEN
        CREATE POLICY "Admins can manage all support messages" ON "public"."support_messages" USING ((EXISTS ( SELECT 1 FROM "public"."profiles" "p" WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role"))))) WITH CHECK ((EXISTS ( SELECT 1 FROM "public"."profiles" "p" WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role")))));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create messages in own tickets' AND tablename = 'support_messages') THEN
        CREATE POLICY "Users can create messages in own tickets" ON "public"."support_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM "public"."support_tickets" "t" WHERE (("t"."id" = "support_messages"."ticket_id") AND ("t"."user_id" = "auth"."uid"())))));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own ticket messages' AND tablename = 'support_messages') THEN
        CREATE POLICY "Users can read own ticket messages" ON "public"."support_messages" FOR SELECT USING ((EXISTS ( SELECT 1 FROM "public"."support_tickets" "t" WHERE (("t"."id" = "support_messages"."ticket_id") AND ("t"."user_id" = "auth"."uid"())))));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own support tickets' AND tablename = 'support_tickets') THEN
        CREATE POLICY "Users can manage own support tickets" ON "public"."support_tickets" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read all support tickets' AND tablename = 'support_tickets') THEN
        CREATE POLICY "Admins can read all support tickets" ON "public"."support_tickets" FOR SELECT USING ((EXISTS ( SELECT 1 FROM "public"."profiles" "p" WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role")))));
    END IF;
END $$;

-- Grants
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."consents" TO "anon";
GRANT ALL ON TABLE "public"."consents" TO "authenticated";
GRANT ALL ON TABLE "public"."consents" TO "service_role";

GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";

GRANT ALL ON TABLE "public"."handy_categories" TO "anon";
GRANT ALL ON TABLE "public"."handy_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."handy_categories" TO "service_role";

GRANT ALL ON TABLE "public"."handy_profiles" TO "anon";
GRANT ALL ON TABLE "public"."handy_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."handy_profiles" TO "service_role";

GRANT ALL ON TABLE "public"."notification_settings" TO "anon";
GRANT ALL ON TABLE "public"."notification_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_settings" TO "service_role";

GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."support_messages" TO "anon";
GRANT ALL ON TABLE "public"."support_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."support_messages" TO "service_role";
GRANT ALL ON SEQUENCE "public"."support_messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."support_messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."support_messages_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."support_tickets" TO "anon";
GRANT ALL ON TABLE "public"."support_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."support_tickets" TO "service_role";
GRANT ALL ON SEQUENCE "public"."support_tickets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."support_tickets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."support_tickets_id_seq" TO "service_role";
