CREATE OR REPLACE FUNCTION public.replace_professional_availability_slots(
  p_delete_ids TEXT[],
  p_slots JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_slot JSONB;
  v_day_of_week INTEGER;
  v_start_time TIME;
  v_end_time TIME;
  v_recurrence_type TEXT;
  v_starts_on DATE;
  v_ends_on DATE;
  v_ends_after_occurrences INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  IF p_slots IS NULL THEN
    p_slots := '[]'::jsonb;
  END IF;

  IF jsonb_typeof(p_slots) <> 'array' THEN
    RAISE EXCEPTION 'p_slots must be a JSON array';
  END IF;

  IF p_delete_ids IS NOT NULL AND array_length(p_delete_ids, 1) > 0 THEN
    DELETE FROM public.professional_availability
    WHERE user_id = v_user_id
      AND id = ANY(p_delete_ids);
  END IF;

  FOR v_slot IN SELECT * FROM jsonb_array_elements(p_slots)
  LOOP
    v_day_of_week := (v_slot ->> 'day_of_week')::INTEGER;
    v_start_time := (v_slot ->> 'start_time')::TIME;
    v_end_time := (v_slot ->> 'end_time')::TIME;
    v_recurrence_type := COALESCE(v_slot ->> 'recurrence_type', 'none');
    v_starts_on := (v_slot ->> 'starts_on')::DATE;
    v_ends_on := NULLIF(v_slot ->> 'ends_on', '')::DATE;
    v_ends_after_occurrences := NULLIF(v_slot ->> 'ends_after_occurrences', '')::INTEGER;

    IF v_day_of_week < 0 OR v_day_of_week > 6 THEN
      RAISE EXCEPTION 'Invalid day_of_week: %', v_day_of_week;
    END IF;

    IF v_end_time <= v_start_time THEN
      RAISE EXCEPTION 'end_time must be after start_time';
    END IF;

    IF v_recurrence_type NOT IN ('none', 'daily', 'weekly', 'monthly') THEN
      RAISE EXCEPTION 'Invalid recurrence_type: %', v_recurrence_type;
    END IF;

    IF v_starts_on IS NULL THEN
      RAISE EXCEPTION 'starts_on is required';
    END IF;

    IF v_ends_on IS NOT NULL AND v_ends_on < v_starts_on THEN
      RAISE EXCEPTION 'ends_on must be on or after starts_on';
    END IF;

    IF v_ends_after_occurrences IS NOT NULL AND v_ends_after_occurrences < 1 THEN
      RAISE EXCEPTION 'ends_after_occurrences must be at least 1';
    END IF;

    INSERT INTO public.professional_availability (
      user_id,
      day_of_week,
      start_time,
      end_time,
      recurrence_type,
      starts_on,
      ends_on,
      ends_after_occurrences,
      day_of_month,
      timezone,
      is_active
    )
    VALUES (
      v_user_id,
      v_day_of_week,
      v_start_time,
      v_end_time,
      v_recurrence_type,
      v_starts_on,
      v_ends_on,
      v_ends_after_occurrences,
      CASE WHEN v_recurrence_type = 'monthly' THEN EXTRACT(DAY FROM v_starts_on)::SMALLINT ELSE NULL END,
      COALESCE(v_slot ->> 'timezone', 'Europe/London'),
      TRUE
    );
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.replace_professional_availability_slots(TEXT[], JSONB) TO authenticated;
