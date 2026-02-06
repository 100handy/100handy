-- Migration: Add recurring bookings support
-- Description: Creates recurring_booking_series table and adds recurring-related columns to bookings table

-- Create enum for booking frequency
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_frequency') THEN
        CREATE TYPE "public"."booking_frequency" AS ENUM (
            'once',
            'weekly',
            'biweekly',
            'monthly'
        );
    END IF;
END $$;

-- Create recurring_booking_series table to track series metadata
CREATE TABLE IF NOT EXISTS "public"."recurring_booking_series" (
    "id" TEXT PRIMARY KEY DEFAULT generate_nanoid(),
    "customer_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "handy_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    "category_id" TEXT REFERENCES categories(id) ON DELETE SET NULL,
    "frequency" booking_frequency NOT NULL DEFAULT 'once',
    "discount_percent" INTEGER NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    "original_scheduled_date" DATE NOT NULL,
    "original_scheduled_time" TIME NOT NULL,
    "occurrences_count" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN DEFAULT true,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Add recurring series reference to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS recurring_series_id TEXT REFERENCES recurring_booking_series(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS occurrence_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
ADD COLUMN IF NOT EXISTS discount_amount_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_hourly_rate_cents INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN bookings.recurring_series_id IS 'Reference to recurring series if this booking is part of a recurring schedule';
COMMENT ON COLUMN bookings.occurrence_number IS 'Which occurrence in the series (1 = first, 2 = second, etc.)';
COMMENT ON COLUMN bookings.discount_percent IS 'Discount percentage applied for recurring booking';
COMMENT ON COLUMN bookings.discount_amount_cents IS 'Calculated discount amount in cents';
COMMENT ON COLUMN bookings.original_hourly_rate_cents IS 'Original hourly rate before discount applied';

COMMENT ON TABLE recurring_booking_series IS 'Tracks metadata for recurring booking series';

-- Enable RLS on new table
ALTER TABLE "public"."recurring_booking_series" ENABLE ROW LEVEL SECURITY;

-- RLS policies for recurring_booking_series
CREATE POLICY "Customers can view own recurring series"
    ON "public"."recurring_booking_series"
    FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create recurring series"
    ON "public"."recurring_booking_series"
    FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own recurring series"
    ON "public"."recurring_booking_series"
    FOR UPDATE
    USING (auth.uid() = customer_id);

CREATE POLICY "Professionals can view assigned series"
    ON "public"."recurring_booking_series"
    FOR SELECT
    USING (auth.uid() = handy_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_series_id ON bookings(recurring_series_id);
CREATE INDEX IF NOT EXISTS idx_recurring_series_customer_id ON recurring_booking_series(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_series_handy_id ON recurring_booking_series(handy_id);
CREATE INDEX IF NOT EXISTS idx_recurring_series_is_active ON recurring_booking_series(is_active);

-- Grants
GRANT ALL ON TABLE "public"."recurring_booking_series" TO "anon";
GRANT ALL ON TABLE "public"."recurring_booking_series" TO "authenticated";
GRANT ALL ON TABLE "public"."recurring_booking_series" TO "service_role";
