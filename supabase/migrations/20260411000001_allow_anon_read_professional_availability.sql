-- Fix: Allow unauthenticated users to view professional availability
-- Previously restricted to 'authenticated' role only, which blocked
-- anonymous users from seeing tasker availability before signing up.

DROP POLICY IF EXISTS "Anyone can view availability for booking" ON professional_availability;

CREATE POLICY "Anyone can view availability for booking"
  ON professional_availability
  FOR SELECT
  USING (true);
