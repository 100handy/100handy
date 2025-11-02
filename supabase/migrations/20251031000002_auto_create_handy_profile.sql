-- Update handle_new_user trigger to automatically create handy_profiles
-- This prevents "Auth session missing" errors when professionals sign up

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
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'postcode'
  );

  -- Insert default notification settings
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);

  -- If user is a professional (handy), create handy_profiles entry
  IF COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role) = 'handy'::public.user_role THEN
    INSERT INTO public.handy_profiles (
      user_id,
      hourly_rate_cents,
      experience_years,
      verified,
      verification_status,
      onboarding_completed
    )
    VALUES (
      NEW.id,
      0,
      0,
      false,
      'pending',
      false
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;
