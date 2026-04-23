ALTER TABLE public.professional_availability
  ADD COLUMN IF NOT EXISTS recurrence_type TEXT NOT NULL DEFAULT 'weekly'
    CHECK (recurrence_type IN ('none', 'daily', 'weekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS starts_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS ends_on DATE,
  ADD COLUMN IF NOT EXISTS ends_after_occurrences INTEGER
    CHECK (ends_after_occurrences IS NULL OR ends_after_occurrences > 0),
  ADD COLUMN IF NOT EXISTS day_of_month SMALLINT
    CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31));

UPDATE public.professional_availability
SET starts_on = (
  CURRENT_DATE
  - ((EXTRACT(DOW FROM CURRENT_DATE)::INT - day_of_week + 7) % 7)
)
WHERE recurrence_type = 'weekly'
  AND starts_on = CURRENT_DATE;

UPDATE public.professional_availability
SET day_of_month = EXTRACT(DAY FROM starts_on)::SMALLINT
WHERE recurrence_type = 'monthly'
  AND day_of_month IS NULL;

CREATE INDEX IF NOT EXISTS idx_professional_availability_user_start
  ON public.professional_availability(user_id, starts_on);

CREATE INDEX IF NOT EXISTS idx_professional_availability_recurrence
  ON public.professional_availability(recurrence_type, starts_on, ends_on);

COMMENT ON COLUMN public.professional_availability.recurrence_type IS
  'Availability recurrence rule: none, daily, weekly, or monthly';
COMMENT ON COLUMN public.professional_availability.starts_on IS
  'Anchor date for one-time or recurring availability';
COMMENT ON COLUMN public.professional_availability.ends_on IS
  'Optional last active date for recurring availability';
COMMENT ON COLUMN public.professional_availability.ends_after_occurrences IS
  'Optional maximum number of generated occurrences for recurring availability';
COMMENT ON COLUMN public.professional_availability.day_of_month IS
  'Monthly recurrence day number when recurrence_type = monthly';
