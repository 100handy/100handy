-- Add FK constraints from bookings to profiles for PostgREST joins
-- These enable queries like: profiles!bookings_customer_profile_fkey

-- Add FK from bookings.customer_id to profiles.user_id
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_customer_profile_fkey
FOREIGN KEY (customer_id) REFERENCES public.profiles(user_id);

-- Add FK from bookings.handy_id to profiles.user_id
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_handy_profile_fkey
FOREIGN KEY (handy_id) REFERENCES public.profiles(user_id);
