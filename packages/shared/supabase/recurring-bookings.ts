import { supabase } from './supabaseClient';
import {
  createBooking,
  type CreateBookingInput,
  type Booking,
  type BookingFrequency,
  type RecurringBookingSeries,
  FREQUENCY_OPTIONS,
} from './bookings';

const DEFAULT_RECURRING_OCCURRENCES = 4;

export interface CreateRecurringBookingsInput extends CreateBookingInput {
  frequency: BookingFrequency;
  occurrences_count?: number;
}

export interface CreateRecurringBookingsResult {
  series: RecurringBookingSeries | null;
  bookings: Booking[];
  totalSavings: number;
}

/**
 * Calculate discounted rate and savings amount
 */
export function calculateDiscountedRate(
  hourlyRateCents: number,
  discountPercent: number
): { discountedRateCents: number; discountAmountCents: number } {
  const discountAmountCents = Math.round((hourlyRateCents * discountPercent) / 100);
  const discountedRateCents = hourlyRateCents - discountAmountCents;
  return { discountedRateCents, discountAmountCents };
}

/**
 * Generate future dates for recurring bookings
 */
export function generateRecurringDates(
  startDate: string,
  frequency: BookingFrequency,
  count: number
): string[] {
  const dates: string[] = [startDate];
  const frequencyOption = FREQUENCY_OPTIONS.find((f) => f.value === frequency);

  if (!frequencyOption || frequencyOption.intervalWeeks === 0) {
    return dates; // Just once
  }

  const start = new Date(startDate);
  for (let i = 1; i < count; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(nextDate.getDate() + frequencyOption.intervalWeeks * 7 * i);
    dates.push(nextDate.toISOString().split('T')[0]!);
  }

  return dates;
}

/**
 * Get discount percent for a frequency
 */
export function getDiscountPercent(frequency: BookingFrequency): number {
  const option = FREQUENCY_OPTIONS.find((f) => f.value === frequency);
  return option?.discountPercent ?? 0;
}

/**
 * Create a recurring booking series with all future instances
 */
export async function createRecurringBookings(
  input: CreateRecurringBookingsInput
): Promise<CreateRecurringBookingsResult> {
  const frequencyOption = FREQUENCY_OPTIONS.find((f) => f.value === input.frequency);
  const discountPercent = frequencyOption?.discountPercent || 0;
  const occurrences =
    input.frequency === 'once' ? 1 : input.occurrences_count || DEFAULT_RECURRING_OCCURRENCES;

  // Calculate discounted rate
  const { discountedRateCents, discountAmountCents } = calculateDiscountedRate(
    input.hourly_rate_cents,
    discountPercent
  );

  const createdBookings: Booking[] = [];
  let series: RecurringBookingSeries | null = null;

  try {
    // Step 1: Create the series record (if recurring)
    if (input.frequency !== 'once' && occurrences > 1) {
      const { data: seriesData, error: seriesError } = await supabase
        .from('recurring_booking_series')
        .insert({
          customer_id: input.customer_id,
          handy_id: input.handy_id,
          category_id: input.category_id,
          frequency: input.frequency,
          discount_percent: discountPercent,
          original_scheduled_date: input.scheduled_date,
          original_scheduled_time: input.scheduled_time,
          occurrences_count: occurrences,
          is_active: true,
        })
        .select()
        .single();

      if (seriesError) throw seriesError;
      series = seriesData;
    }

    // Step 2: Generate dates for all occurrences
    const scheduledDates = generateRecurringDates(input.scheduled_date, input.frequency, occurrences);

    // Step 3: Create individual bookings for each occurrence
    for (let i = 0; i < scheduledDates.length; i++) {
      const bookingInput: CreateBookingInput = {
        customer_id: input.customer_id,
        handy_id: input.handy_id,
        category_id: input.category_id,
        task_title: input.task_title,
        task_details: input.task_details,
        scheduled_date: scheduledDates[i]!,
        scheduled_time: input.scheduled_time,
        address_street: input.address_street,
        address_apartment: input.address_apartment,
        address_postcode: input.address_postcode,
        address_city: input.address_city,
        address_country: input.address_country,
        hourly_rate_cents: discountedRateCents, // Apply discounted rate
        estimated_hours: input.estimated_hours,
        form_responses: input.form_responses,
        // Only first booking gets the payment intent
        payment_intent_id: i === 0 ? input.payment_intent_id : undefined,
        // Recurring fields
        recurring_series_id: series?.id,
        occurrence_number: i + 1,
        discount_percent: discountPercent,
        discount_amount_cents: Math.round(discountAmountCents * input.estimated_hours),
        original_hourly_rate_cents: input.hourly_rate_cents,
      };

      const booking = await createBooking(bookingInput);
      createdBookings.push(booking);
    }

    // Calculate total savings
    const totalSavings = createdBookings.reduce((sum, b) => sum + (b.discount_amount_cents || 0), 0);

    return { series, bookings: createdBookings, totalSavings };
  } catch (error) {
    console.error('Error creating recurring bookings:', error);
    throw error;
  }
}

/**
 * Cancel all future bookings in a series
 */
export async function cancelRecurringSeries(seriesId: string): Promise<boolean> {
  try {
    // Mark series as inactive
    const { error: seriesError } = await supabase
      .from('recurring_booking_series')
      .update({ is_active: false, cancelled_at: new Date().toISOString() })
      .eq('id', seriesId);

    if (seriesError) throw seriesError;

    // Cancel all pending/accepted bookings in the series
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('recurring_series_id', seriesId)
      .in('status', ['pending', 'accepted']);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error cancelling recurring series:', error);
    return false;
  }
}

/**
 * Get all bookings in a recurring series
 */
export async function getBookingsInSeries(seriesId: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('recurring_series_id', seriesId)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookings in series:', error);
    throw error;
  }
}

/**
 * Get a recurring series by ID
 */
export async function getRecurringSeries(seriesId: string): Promise<RecurringBookingSeries | null> {
  try {
    const { data, error } = await supabase
      .from('recurring_booking_series')
      .select('*')
      .eq('id', seriesId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recurring series:', error);
    return null;
  }
}
