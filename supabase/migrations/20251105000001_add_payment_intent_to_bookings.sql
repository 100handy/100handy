-- Add payment_intent_id and payment_status columns to bookings table
-- This enables tracking Stripe payment authorizations and captures

-- Add payment_intent_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
        AND column_name = 'payment_intent_id'
    ) THEN
        ALTER TABLE "public"."bookings"
        ADD COLUMN "payment_intent_id" text;
    END IF;
END $$;

-- Add payment_status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE "public"."bookings"
        ADD COLUMN "payment_status" text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded'));
    END IF;
END $$;

-- Add index for faster lookups by payment_intent_id
CREATE INDEX IF NOT EXISTS "bookings_payment_intent_id_idx"
ON "public"."bookings" USING "btree" ("payment_intent_id");

-- Add comments to explain the columns
COMMENT ON COLUMN "public"."bookings"."payment_intent_id" IS 'Stripe PaymentIntent ID for tracking payment authorization and capture';
COMMENT ON COLUMN "public"."bookings"."payment_status" IS 'Status of the payment: pending (before authorization), authorized (funds on hold), captured (charged), failed, or refunded';
