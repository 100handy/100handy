-- Add comprehensive admin RLS policies
-- This migration adds admin access policies to all tables
-- and fixes the categories table access issue (CRITICAL)
--
-- ✅ This migration is IDEMPOTENT - safe to re-run without errors
-- Date: 2025-10-27
-- Purpose: Enable admin web dashboard to access all required data

-- =============================================================================
-- HELPER FUNCTION: is_admin()
-- Centralized function to check if current user has admin role
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'::public.user_role
  );
END;
$$;

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

COMMENT ON FUNCTION public.is_admin() IS
  'Helper function to check if the current user has admin role. Used by RLS policies for admin access control.';

-- =============================================================================
-- CATEGORIES TABLE POLICIES (CRITICAL FIX)
-- Currently has RLS enabled but NO policies, so nobody can access
-- This is a BLOCKER for the entire application
-- =============================================================================

DO $$
BEGIN
    -- Allow everyone to read categories (needed for category browsing)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'categories'
        AND policyname = 'Anyone can read categories'
    ) THEN
        CREATE POLICY "Anyone can read categories"
        ON public.categories
        FOR SELECT
        USING (true);

        RAISE NOTICE 'Created policy: Anyone can read categories';
    END IF;

    -- Allow admins to insert categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'categories'
        AND policyname = 'Admins can insert categories'
    ) THEN
        CREATE POLICY "Admins can insert categories"
        ON public.categories
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert categories';
    END IF;

    -- Allow admins to update categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'categories'
        AND policyname = 'Admins can update categories'
    ) THEN
        CREATE POLICY "Admins can update categories"
        ON public.categories
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update categories';
    END IF;

    -- Allow admins to delete categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'categories'
        AND policyname = 'Admins can delete categories'
    ) THEN
        CREATE POLICY "Admins can delete categories"
        ON public.categories
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete categories';
    END IF;
END $$;

-- =============================================================================
-- PROFILES TABLE POLICIES
-- Admins need to read/update all profiles for user management
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND policyname = 'Admins can read all profiles'
    ) THEN
        CREATE POLICY "Admins can read all profiles"
        ON public.profiles
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all profiles';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND policyname = 'Admins can update all profiles'
    ) THEN
        CREATE POLICY "Admins can update all profiles"
        ON public.profiles
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update all profiles';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND policyname = 'Admins can insert profiles'
    ) THEN
        CREATE POLICY "Admins can insert profiles"
        ON public.profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert profiles';
    END IF;
END $$;

-- =============================================================================
-- BOOKINGS TABLE POLICIES
-- Admins need full CRUD access for task management
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Admins can read all bookings'
    ) THEN
        CREATE POLICY "Admins can read all bookings"
        ON public.bookings
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all bookings';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Admins can update all bookings'
    ) THEN
        CREATE POLICY "Admins can update all bookings"
        ON public.bookings
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update all bookings';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Admins can insert bookings'
    ) THEN
        CREATE POLICY "Admins can insert bookings"
        ON public.bookings
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert bookings';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Admins can delete bookings'
    ) THEN
        CREATE POLICY "Admins can delete bookings"
        ON public.bookings
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete bookings';
    END IF;
END $$;

-- =============================================================================
-- PAYMENTS TABLE POLICIES
-- Admins need read/update access for financial oversight
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'payments'
        AND policyname = 'Admins can read all payments'
    ) THEN
        CREATE POLICY "Admins can read all payments"
        ON public.payments
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all payments';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'payments'
        AND policyname = 'Admins can update payments'
    ) THEN
        CREATE POLICY "Admins can update payments"
        ON public.payments
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update payments';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'payments'
        AND policyname = 'Admins can insert payments'
    ) THEN
        CREATE POLICY "Admins can insert payments"
        ON public.payments
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert payments';
    END IF;
END $$;

-- =============================================================================
-- HANDY_PROFILES TABLE POLICIES
-- Admins need full CRUD for handy management
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'handy_profiles'
        AND policyname = 'Admins can read all handy profiles'
    ) THEN
        CREATE POLICY "Admins can read all handy profiles"
        ON public.handy_profiles
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all handy profiles';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'handy_profiles'
        AND policyname = 'Admins can update handy profiles'
    ) THEN
        CREATE POLICY "Admins can update handy profiles"
        ON public.handy_profiles
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update handy profiles';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'handy_profiles'
        AND policyname = 'Admins can insert handy profiles'
    ) THEN
        CREATE POLICY "Admins can insert handy profiles"
        ON public.handy_profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert handy profiles';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'handy_profiles'
        AND policyname = 'Admins can delete handy profiles'
    ) THEN
        CREATE POLICY "Admins can delete handy profiles"
        ON public.handy_profiles
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete handy profiles';
    END IF;
END $$;

-- =============================================================================
-- HANDY_CATEGORIES TABLE POLICIES
-- Admins can manage handy-category associations
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'handy_categories'
        AND policyname = 'Admins can manage handy categories'
    ) THEN
        CREATE POLICY "Admins can manage handy categories"
        ON public.handy_categories
        FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can manage handy categories';
    END IF;
END $$;

-- =============================================================================
-- ADDRESSES TABLE POLICIES
-- Admins can read/update addresses for user management
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'addresses'
        AND policyname = 'Admins can read all addresses'
    ) THEN
        CREATE POLICY "Admins can read all addresses"
        ON public.addresses
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all addresses';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'addresses'
        AND policyname = 'Admins can update addresses'
    ) THEN
        CREATE POLICY "Admins can update addresses"
        ON public.addresses
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update addresses';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'addresses'
        AND policyname = 'Admins can insert addresses'
    ) THEN
        CREATE POLICY "Admins can insert addresses"
        ON public.addresses
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert addresses';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'addresses'
        AND policyname = 'Admins can delete addresses'
    ) THEN
        CREATE POLICY "Admins can delete addresses"
        ON public.addresses
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete addresses';
    END IF;
END $$;

-- =============================================================================
-- REVIEWS TABLE POLICIES
-- Admins can read/update/delete for moderation
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'reviews'
        AND policyname = 'Admins can read all reviews'
    ) THEN
        CREATE POLICY "Admins can read all reviews"
        ON public.reviews
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all reviews';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'reviews'
        AND policyname = 'Admins can update reviews'
    ) THEN
        CREATE POLICY "Admins can update reviews"
        ON public.reviews
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update reviews';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'reviews'
        AND policyname = 'Admins can delete reviews'
    ) THEN
        CREATE POLICY "Admins can delete reviews"
        ON public.reviews
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete reviews';
    END IF;
END $$;

-- =============================================================================
-- FAVORITES TABLE POLICIES
-- Admins can read all favorites
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'favorites'
        AND policyname = 'Admins can read all favorites'
    ) THEN
        CREATE POLICY "Admins can read all favorites"
        ON public.favorites
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all favorites';
    END IF;
END $$;

-- =============================================================================
-- NOTIFICATION_SETTINGS TABLE POLICIES
-- Admins can read/update notification settings
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'notification_settings'
        AND policyname = 'Admins can read all notification settings'
    ) THEN
        CREATE POLICY "Admins can read all notification settings"
        ON public.notification_settings
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all notification settings';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'notification_settings'
        AND policyname = 'Admins can update notification settings'
    ) THEN
        CREATE POLICY "Admins can update notification settings"
        ON public.notification_settings
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update notification settings';
    END IF;
END $$;

-- =============================================================================
-- CONSENTS TABLE POLICIES
-- Admins can read all consents for compliance
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'consents'
        AND policyname = 'Admins can read all consents'
    ) THEN
        CREATE POLICY "Admins can read all consents"
        ON public.consents
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all consents';
    END IF;
END $$;

-- =============================================================================
-- SUPPORT_TICKETS TABLE POLICIES
-- Upgrade existing read-only policy to full access
-- =============================================================================

DO $$
BEGIN
    -- Admins can update support tickets (upgrade from read-only)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'support_tickets'
        AND policyname = 'Admins can update support tickets'
    ) THEN
        CREATE POLICY "Admins can update support tickets"
        ON public.support_tickets
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update support tickets';
    END IF;

    -- Admins can insert support tickets (for manual ticket creation)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'support_tickets'
        AND policyname = 'Admins can insert support tickets'
    ) THEN
        CREATE POLICY "Admins can insert support tickets"
        ON public.support_tickets
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert support tickets';
    END IF;
END $$;

-- =============================================================================
-- BUSINESS_INFO TABLE POLICIES
-- Admins can read/update business info
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'business_info'
        AND policyname = 'Admins can read all business info'
    ) THEN
        CREATE POLICY "Admins can read all business info"
        ON public.business_info
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all business info';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'business_info'
        AND policyname = 'Admins can update business info'
    ) THEN
        CREATE POLICY "Admins can update business info"
        ON public.business_info
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update business info';
    END IF;
END $$;

-- =============================================================================
-- PROMO_CODES TABLE POLICIES
-- Admins need full CRUD for promotion management
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'promo_codes'
        AND policyname = 'Admins can read all promo codes'
    ) THEN
        CREATE POLICY "Admins can read all promo codes"
        ON public.promo_codes
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all promo codes';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'promo_codes'
        AND policyname = 'Admins can insert promo codes'
    ) THEN
        CREATE POLICY "Admins can insert promo codes"
        ON public.promo_codes
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can insert promo codes';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'promo_codes'
        AND policyname = 'Admins can update promo codes'
    ) THEN
        CREATE POLICY "Admins can update promo codes"
        ON public.promo_codes
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can update promo codes';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'promo_codes'
        AND policyname = 'Admins can delete promo codes'
    ) THEN
        CREATE POLICY "Admins can delete promo codes"
        ON public.promo_codes
        FOR DELETE
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can delete promo codes';
    END IF;
END $$;

-- =============================================================================
-- PROMO_CODE_REDEMPTIONS TABLE POLICIES
-- Admins can read all redemptions
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'promo_code_redemptions'
        AND policyname = 'Admins can read all redemptions'
    ) THEN
        CREATE POLICY "Admins can read all redemptions"
        ON public.promo_code_redemptions
        FOR SELECT
        TO authenticated
        USING (public.is_admin());

        RAISE NOTICE 'Created policy: Admins can read all redemptions';
    END IF;
END $$;

-- =============================================================================
-- PERFORMANCE OPTIMIZATION
-- Add index on role column in profiles for faster admin checks
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role_admin
ON public.profiles(role)
WHERE role = 'admin'::public.user_role;

-- =============================================================================
-- SUMMARY
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Admin RLS Policies Migration Complete';
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Created/verified admin policies for:';
    RAISE NOTICE '  - categories (CRITICAL FIX - was inaccessible)';
    RAISE NOTICE '  - profiles';
    RAISE NOTICE '  - bookings';
    RAISE NOTICE '  - payments';
    RAISE NOTICE '  - handy_profiles';
    RAISE NOTICE '  - handy_categories';
    RAISE NOTICE '  - addresses';
    RAISE NOTICE '  - reviews';
    RAISE NOTICE '  - favorites';
    RAISE NOTICE '  - notification_settings';
    RAISE NOTICE '  - consents';
    RAISE NOTICE '  - support_tickets (upgraded to full access)';
    RAISE NOTICE '  - business_info';
    RAISE NOTICE '  - promo_codes';
    RAISE NOTICE '  - promo_code_redemptions';
    RAISE NOTICE '';
    RAISE NOTICE 'Helper function created: public.is_admin()';
    RAISE NOTICE 'Performance index created: idx_profiles_role_admin';
    RAISE NOTICE '=============================================================================';
END $$;