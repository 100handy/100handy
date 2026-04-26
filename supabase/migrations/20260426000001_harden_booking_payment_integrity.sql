-- Harden booking payment integrity by deriving booking rates server-side.
-- Client code may still submit a rate for display continuity, but the database
-- resolves the authoritative rate from professional pricing.

CREATE OR REPLACE FUNCTION public.resolve_booking_hourly_rate(
  p_handy_id UUID,
  p_category_id TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_category_name TEXT;
  v_skill_id TEXT;
  v_skill_rate INTEGER;
  v_profile_rate INTEGER;
BEGIN
  SELECT name INTO v_category_name
  FROM public.categories
  WHERE id = p_category_id;

  IF v_category_name IS NOT NULL THEN
    SELECT id INTO v_skill_id
    FROM public.skills
    WHERE name ILIKE v_category_name
    LIMIT 1;

    IF v_skill_id IS NOT NULL THEN
      SELECT hourly_rate_cents INTO v_skill_rate
      FROM public.user_skills
      WHERE user_id = p_handy_id
        AND skill_id = v_skill_id
        AND is_active = TRUE
        AND hourly_rate_cents > 0
      LIMIT 1;
    END IF;
  END IF;

  IF v_skill_rate IS NOT NULL THEN
    RETURN v_skill_rate;
  END IF;

  SELECT hourly_rate_cents INTO v_profile_rate
  FROM public.handy_profiles
  WHERE user_id = p_handy_id;

  IF v_profile_rate IS NULL OR v_profile_rate <= 0 THEN
    RAISE EXCEPTION 'Professional hourly rate is not configured';
  END IF;

  RETURN v_profile_rate;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_booking_payment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.handy_id IS NULL OR NEW.category_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' AND NEW.payment_intent_id IS NULL THEN
    RAISE EXCEPTION 'Booking payment authorization is required';
  END IF;

  NEW.hourly_rate_cents := public.resolve_booking_hourly_rate(
    NEW.handy_id,
    NEW.category_id::TEXT
  );

  IF NEW.payment_intent_id IS NOT NULL AND COALESCE(NEW.payment_status, 'pending') = 'pending' THEN
    NEW.payment_status := 'authorized';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_booking_payment_integrity_trigger ON public.bookings;

CREATE TRIGGER enforce_booking_payment_integrity_trigger
BEFORE INSERT OR UPDATE OF handy_id, category_id, hourly_rate_cents, payment_intent_id, payment_status
ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.enforce_booking_payment_integrity();
