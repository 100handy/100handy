import type { CreateBookingInput } from './bookings';

/**
 * Parse a time string "HH:MM" or "HH:MM:SS" to minutes since midnight
 */
export function parseTimeToMinutes(time: string): number {
  const parts = time.slice(0, 5).split(':').map(Number);
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

/**
 * Check if a new booking time overlaps with any existing bookings
 */
export function hasTimeOverlap(
  newTime: string,
  newHours: number,
  existingBookings: Array<{ scheduled_time: string; estimated_hours: number }>
): boolean {
  const newStart = parseTimeToMinutes(newTime);
  const newEnd = newStart + newHours * 60;

  return existingBookings.some((booking) => {
    const existingStart = parseTimeToMinutes(booking.scheduled_time);
    const existingEnd = existingStart + (booking.estimated_hours || 1) * 60;
    return newStart < existingEnd && existingStart < newEnd;
  });
}

/**
 * Validate booking input before creation
 */
export function validateBookingInput(
  input: CreateBookingInput
): { valid: boolean; error?: string } {
  if (input.hourly_rate_cents <= 0) {
    return { valid: false, error: 'Invalid hourly rate: must be greater than zero' };
  }

  if (input.estimated_hours <= 0) {
    return { valid: false, error: 'Invalid estimated hours: must be greater than zero' };
  }

  const today = new Date().toISOString().split('T')[0]!;
  if (input.scheduled_date < today) {
    return { valid: false, error: 'Scheduled date is in the past' };
  }

  return { valid: true };
}
