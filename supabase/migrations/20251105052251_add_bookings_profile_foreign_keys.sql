-- ================================================================
-- Foreign keys already exist - marking as applied
-- ================================================================
-- The constraints bookings_customer_id_fkey and bookings_handy_id_fkey
-- already exist in the remote database
-- This migration is just to keep local/remote in sync
-- ================================================================

SELECT 'Migration already applied - foreign keys exist' AS status;
