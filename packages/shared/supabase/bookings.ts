import { supabase } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { FormResponse } from './types/forms';
import type { PaymentStatus } from './payments';

// Booking frequency options for recurring bookings
export type BookingFrequency = 'once' | 'weekly' | 'biweekly' | 'monthly';

// Frequency configuration with discounts
export interface FrequencyOption {
  value: BookingFrequency;
  label: string;
  description: string;
  discountPercent: number;
  intervalWeeks: number; // 0 for once, 1 for weekly, 2 for biweekly, 4 for monthly
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Same day, same time every week',
    discountPercent: 15,
    intervalWeeks: 1,
  },
  {
    value: 'biweekly',
    label: 'Every 2 weeks',
    description: 'Same day, same time every 2 weeks',
    discountPercent: 10,
    intervalWeeks: 2,
  },
  {
    value: 'monthly',
    label: 'Every 4 weeks',
    description: 'Same day, same time every 4 weeks',
    discountPercent: 5,
    intervalWeeks: 4,
  },
  {
    value: 'once',
    label: 'Just Once',
    description: 'One-time booking',
    discountPercent: 0,
    intervalWeeks: 0,
  },
];

// Recurring series interface
export interface RecurringBookingSeries {
  id: string;
  customer_id: string;
  handy_id: string;
  category_id: string | null;
  frequency: BookingFrequency;
  discount_percent: number;
  original_scheduled_date: string;
  original_scheduled_time: string;
  occurrences_count: number;
  is_active: boolean;
  cancelled_at: string | null;
  created_at: string;
}

// Define types based on the database schema we saw
export interface Booking {
  id: string; // TEXT nanoid (migrated from bigint)
  customer_id: string;
  handy_id: string | null;
  category_id: string | null;
  task_title: string;
  task_details: string | null;
  scheduled_date: string;
  scheduled_time: string;
  address_id: string | null; // TEXT nanoid (migrated from bigint)
  hourly_rate_cents: number;
  estimated_hours: number;
  status: BookingStatus;
  payment_intent_id?: string | null;
  payment_status?: PaymentStatus | null;
  form_responses: FormResponse; // Category-specific form responses
  created_at: string;
  // Recurring booking fields
  recurring_series_id?: string | null;
  occurrence_number?: number;
  discount_percent?: number;
  discount_amount_cents?: number;
  original_hourly_rate_cents?: number;
  payment_hold_release_failed?: boolean;
}

// Category interface - not exported to avoid conflict with query/index.ts export
// This is only used internally for BookingWithRelations type
interface Category {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  parent_id: string | null;
  level: number;
  display_order: number;
}

export interface Address {
  id: string; // TEXT nanoid (migrated from bigint)
  user_id: string | null;
  street: string;
  apartment: string | null;
  postcode: string;
  city: string | null;
  country: string;
  is_primary: boolean;
  created_at: string;
}

// Handy profile joined via bookings_handy_id_fkey
interface HandyProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export type BookingWithRelations = Booking & {
  category: Category | null;
  address: Address | null;
  handy_profile: HandyProfile | null;
};

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface GetBookingsOptions {
  userId?: string;
  status?: BookingStatus | BookingStatus[];
  limit?: number;
  offset?: number;
  /** Only return bookings on or after this date (YYYY-MM-DD) */
  minDate?: string;
}

export async function getBookings(options: GetBookingsOptions = {}): Promise<BookingWithRelations[]> {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        category:categories(*),
        address:addresses(*),
        handy_profile:profiles!bookings_handy_profile_fkey(user_id, first_name, last_name, avatar_url)
      `)
      .order('scheduled_date', { ascending: false })
      .order('scheduled_time', { ascending: true });

    // Filter by user ID (customer)
    if (options.userId) {
      query = query.eq('customer_id', options.userId);
    }

    // Filter by status
    if (options.status) {
      if (Array.isArray(options.status)) {
        query = query.in('status', options.status);
      } else {
        query = query.eq('status', options.status);
      }
    }

    // Filter by minimum date
    if (options.minDate) {
      query = query.gte('scheduled_date', options.minDate);
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBookings:', error);
    throw error;
  }
}

export async function getUpcomingBookings(userId: string): Promise<BookingWithRelations[]> {
  const today = new Date().toISOString().split('T')[0]!;
  return getBookings({
    userId,
    status: ['pending', 'accepted', 'in_progress'],
    minDate: today,
    limit: 50
  });
}

export async function getPastBookings(userId: string): Promise<BookingWithRelations[]> {
  return getBookings({
    userId,
    status: ['completed'],
    limit: 50
  });
}

export async function getCancelledBookings(userId: string): Promise<BookingWithRelations[]> {
  return getBookings({
    userId,
    status: ['cancelled'],
    limit: 50
  });
}

export async function getBookingById(bookingId: string): Promise<BookingWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        category:categories(*),
        address:addresses(*),
        handy_profile:profiles!bookings_handy_profile_fkey(user_id, first_name, last_name, avatar_url)
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
}

export interface CreateBookingInput {
  customer_id: string;
  handy_id: string;
  category_id: string;
  task_title: string;
  task_details?: string;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM:SS or time slot string
  address_street: string;
  address_apartment?: string;
  address_postcode: string;
  address_city?: string;
  address_country: string;
  hourly_rate_cents: number;
  estimated_hours: number;
  form_responses?: FormResponse; // Category-specific form responses
  payment_intent_id?: string; // Stripe PaymentIntent ID (manual capture hold)
  // Recurring booking fields (optional)
  recurring_series_id?: string;
  occurrence_number?: number;
  discount_percent?: number;
  discount_amount_cents?: number;
  original_hourly_rate_cents?: number;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  try {
    // First, check for existing address with same details for this user
    const apartment = input.address_apartment || null;
    let query = supabase
      .from('addresses')
      .select('id')
      .eq('user_id', input.customer_id)
      .eq('street', input.address_street)
      .eq('postcode', input.address_postcode)
      .eq('country', input.address_country);

    // Handle null apartment comparison (SQL NULL != NULL with .eq)
    if (apartment) {
      query = query.eq('apartment', apartment);
    } else {
      query = query.is('apartment', null);
    }

    const { data: existingAddress } = await query.limit(1).maybeSingle();

    let addressId: string;

    if (existingAddress) {
      addressId = existingAddress.id;
    } else {
      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: input.customer_id,
          street: input.address_street,
          apartment: input.address_apartment || null,
          postcode: input.address_postcode,
          city: input.address_city || null,
          country: input.address_country,
          is_primary: false,
        })
        .select()
        .single();

      if (addressError) {
        console.error('Error creating address:', addressError);
        throw new Error(`Failed to create address: ${addressError.message}`);
      }
      addressId = newAddress.id;
    }

    // Then create the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: input.customer_id,
        handy_id: input.handy_id,
        category_id: input.category_id,
        task_title: input.task_title,
        task_details: input.task_details || null,
        scheduled_date: input.scheduled_date,
        scheduled_time: input.scheduled_time,
        address_id: addressId,
        hourly_rate_cents: input.hourly_rate_cents,
        estimated_hours: input.estimated_hours,
        form_responses: input.form_responses || {},
        status: 'pending',
        payment_intent_id: input.payment_intent_id || null,
        payment_status: input.payment_intent_id ? 'authorized' : 'pending',
        // Recurring booking fields
        recurring_series_id: input.recurring_series_id || null,
        occurrence_number: input.occurrence_number || 1,
        discount_percent: input.discount_percent || 0,
        discount_amount_cents: input.discount_amount_cents || 0,
        original_hourly_rate_cents: input.original_hourly_rate_cents || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    return bookingData;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

/**
 * Check if a tasker has any conflicting bookings at the specified date and time
 * @param handyId - The tasker's user ID
 * @param scheduledDate - The date to check (YYYY-MM-DD)
 * @param scheduledTime - The time to check (HH:MM or HH:MM:SS)
 * @returns Promise<boolean> - true if there's a conflict, false if slot is available
 */
export async function checkBookingConflict(
  handyId: string,
  scheduledDate: string,
  scheduledTime: string,
  estimatedHours: number = 1
): Promise<boolean> {
  try {
    // Single query to get all active bookings for this handy on the given date
    const { data, error } = await supabase
      .from('bookings')
      .select('id, scheduled_time, estimated_hours')
      .eq('handy_id', handyId)
      .eq('scheduled_date', scheduledDate)
      .in('status', ['pending', 'accepted', 'in_progress']);

    if (error) {
      console.error('Error checking booking conflict:', error);
      throw new Error(`Failed to check booking conflict: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return false;
    }

    // Parse time string "HH:MM" to minutes since midnight for easy comparison
    const parseTime = (time: string): number => {
      const parts = time.slice(0, 5).split(':').map(Number);
      return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
    };

    const newStart = parseTime(scheduledTime);
    const newEnd = newStart + estimatedHours * 60;

    // Check if any existing booking's time range overlaps with the new one
    const hasConflict = data.some((booking) => {
      const existingStart = parseTime(booking.scheduled_time);
      const existingEnd = existingStart + (booking.estimated_hours || 1) * 60;
      // Two ranges overlap if one starts before the other ends
      return newStart < existingEnd && existingStart < newEnd;
    });

    return hasConflict;
  } catch (error) {
    console.error('Error in checkBookingConflict:', error);
    throw error;
  }
}

/**
 * Cancel a booking by setting its status to 'cancelled'
 * @param bookingId - The ID of the booking to cancel
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function cancelBooking(bookingId: string, customerId: string): Promise<boolean> {
  try {
    // Read booking to get payment info and verify status
    const { data: booking } = await supabase
      .from('bookings')
      .select('payment_intent_id, payment_status, status')
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .single();

    if (!booking) {
      console.warn(`Booking ${bookingId} not found for customer ${customerId}`);
      return false;
    }

    if (booking.status === 'in_progress') {
      console.warn(`Booking ${bookingId} is in_progress — cannot cancel`);
      return false;
    }

    // Step 1: Update status to cancelled FIRST (atomic check via status filter)
    // This prevents the race condition where hold is released but status update fails
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .in('status', ['pending', 'accepted'])
      .select();

    if (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not cancelled - status may have changed`);
      return false;
    }

    // Step 2: Release payment hold AFTER status is confirmed cancelled
    if (booking.payment_intent_id && booking.payment_status === 'authorized') {
      try {
        const { cancelPaymentIntent, updateBookingPaymentStatus, logPaymentError } = await import('./payments');
        const released = await cancelPaymentIntent(booking.payment_intent_id);
        if (released) {
          await updateBookingPaymentStatus(bookingId, 'cancelled');
        } else {
          await logPaymentError(bookingId, 'hold_release_failed', 'Payment hold was not released on cancellation. Customer hold will auto-expire in 7 days.', {
            paymentIntentId: booking.payment_intent_id,
          });
          await supabase
            .from('bookings')
            .update({ payment_hold_release_failed: true })
            .eq('id', bookingId);
        }
      } catch (e) {
        console.error('Failed to release authorization hold for booking:', bookingId, e);
        try {
          const { logPaymentError } = await import('./payments');
          await logPaymentError(bookingId, 'hold_release_error', String(e), {
            paymentIntentId: booking.payment_intent_id,
          });
        } catch {
          // Already logged to console above
        }
      }
    }

    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'cancelled' },
      })
      .catch(() => undefined);

    return true;
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    return false;
  }
}

// ==========================================
// Professional (Handy) Booking Functions
// ==========================================

// Customer profile for booking display
interface CustomerProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export type BookingWithCustomer = Booking & {
  category: Category | null;
  address: Address | null;
  customer: CustomerProfile | null;
};

export interface GetHandyBookingsOptions {
  handyId: string;
  status?: BookingStatus | BookingStatus[];
  limit?: number;
  offset?: number;
}

/**
 * Get bookings for a professional (handy) by their user ID
 * Includes customer profile info for display
 * Note: Customer profiles are fetched separately since bookings.customer_id
 * references auth.users, not profiles table directly
 */
export async function getBookingsForHandy(
  options: GetHandyBookingsOptions
): Promise<BookingWithCustomer[]> {
  try {
    // Step 1: Fetch bookings without customer profile
    let query = supabase
      .from('bookings')
      .select(`
        *,
        category:categories(*),
        address:addresses(*)
      `)
      .eq('handy_id', options.handyId)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    // Filter by status
    if (options.status) {
      if (Array.isArray(options.status)) {
        query = query.in('status', options.status);
      } else {
        query = query.eq('status', options.status);
      }
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings for handy:', error);
      throw new Error(error.message);
    }

    if (!bookings || bookings.length === 0) {
      return [];
    }

    // Step 2: Get unique customer IDs and fetch their profiles
    const customerIds = [...new Set(bookings.map((b) => b.customer_id).filter(Boolean))];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, avatar_url')
      .in('user_id', customerIds);

    if (profilesError) {
      console.error('Error fetching customer profiles:', profilesError);
      // Continue without profiles rather than failing entirely
    }

    // Step 3: Create a map for quick lookup
    const profileMap = new Map<string, CustomerProfile>();
    if (profiles) {
      profiles.forEach((p) => {
        profileMap.set(p.user_id, p);
      });
    }

    // Step 4: Combine bookings with customer profiles
    const bookingsWithCustomer: BookingWithCustomer[] = bookings.map((booking) => ({
      ...booking,
      customer: profileMap.get(booking.customer_id) || null,
    }));

    return bookingsWithCustomer;
  } catch (error) {
    console.error('Error in getBookingsForHandy:', error);
    throw error;
  }
}

/**
 * Get pending job requests for a professional
 * These are new requests waiting for accept/decline
 */
export async function getPendingBookingsForHandy(
  handyId: string
): Promise<BookingWithCustomer[]> {
  return getBookingsForHandy({
    handyId,
    status: 'pending',
    limit: 50,
  });
}

/**
 * Get upcoming (accepted/in-progress) jobs for a professional
 */
export async function getUpcomingBookingsForHandy(
  handyId: string
): Promise<BookingWithCustomer[]> {
  return getBookingsForHandy({
    handyId,
    status: ['accepted', 'in_progress'],
    limit: 50,
  });
}

/**
 * Get completed jobs for a professional
 */
export async function getCompletedBookingsForHandy(
  handyId: string
): Promise<BookingWithCustomer[]> {
  return getBookingsForHandy({
    handyId,
    status: 'completed',
    limit: 50,
  });
}

/**
 * Accept a pending booking request
 * Changes status from 'pending' to 'accepted'
 */
export async function acceptBooking(bookingId: string, handyId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'accepted' })
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'pending') // Only accept if currently pending
      .select();

    if (error) {
      console.error(`Error accepting booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not accepted - status may not be pending`);
      return false;
    }

    // Best-effort push notification to the other party.
    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'accepted' },
      })
      .catch(() => undefined);

    return true;
  } catch (error) {
    console.error('Error in acceptBooking:', error);
    return false;
  }
}

/**
 * Decline a pending booking request
 * Changes status to 'cancelled' and optionally stores the reason
 */
export async function declineBooking(
  bookingId: string,
  handyId: string,
  reason?: string
): Promise<boolean> {
  try {
    // Read booking to get payment info
    const { data: booking } = await supabase
      .from('bookings')
      .select('payment_intent_id, payment_status')
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .single();

    if (!booking) {
      console.warn(`Booking ${bookingId} not found for handy ${handyId}`);
      return false;
    }

    // Step 1: Update status to cancelled FIRST
    const updateData: { status: BookingStatus; decline_reason?: string } = {
      status: 'cancelled',
    };
    if (reason) {
      updateData.decline_reason = reason;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'pending')
      .select();

    if (error) {
      console.error(`Error declining booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not declined - status may not be pending`);
      return false;
    }

    // Step 2: Release payment hold AFTER status is confirmed cancelled
    if (booking?.payment_intent_id && booking.payment_status === 'authorized') {
      try {
        const { cancelPaymentIntent, updateBookingPaymentStatus, logPaymentError } = await import('./payments');
        const released = await cancelPaymentIntent(booking.payment_intent_id);
        if (released) {
          await updateBookingPaymentStatus(bookingId, 'cancelled');
        } else {
          await logPaymentError(bookingId, 'hold_release_failed', 'Payment hold was not released on decline. Customer hold will auto-expire in 7 days.', {
            paymentIntentId: booking.payment_intent_id,
          });
          await supabase
            .from('bookings')
            .update({ payment_hold_release_failed: true })
            .eq('id', bookingId);
        }
      } catch (e) {
        console.error('Failed to release authorization hold for declined booking:', bookingId, e);
        try {
          const { logPaymentError } = await import('./payments');
          await logPaymentError(bookingId, 'hold_release_error', String(e), {
            paymentIntentId: booking.payment_intent_id,
          });
        } catch {
          // Already logged to console above
        }
      }
    }

    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'cancelled' },
      })
      .catch(() => undefined);

    return true;
  } catch (error) {
    console.error('Error in declineBooking:', error);
    return false;
  }
}

/**
 * Start a job (mark as in progress)
 * Changes status from 'accepted' to 'in_progress'
 */
export async function startBooking(bookingId: string, handyId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'accepted') // Only start if currently accepted
      .select();

    if (error) {
      console.error(`Error starting booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not started - status may not be accepted`);
      return false;
    }

    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'in_progress' },
      })
      .catch(() => undefined);

    return true;
  } catch (error) {
    console.error('Error in startBooking:', error);
    return false;
  }
}

/**
 * Complete a job
 * Changes status from 'in_progress' to 'completed'
 * Optionally processes payment capture and payout
 */
export async function completeBooking(
  bookingId: string,
  handyId: string,
  options?: { processPayment?: boolean }
): Promise<{
  success: boolean;
  paymentProcessed?: boolean;
  payoutFailed?: boolean;
  error?: string;
}> {
  try {
    // First, get the booking to check payment status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, payment_intent_id, payment_status, status')
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status !== 'in_progress') {
      return { success: false, error: 'Booking is not in progress' };
    }

    // Update booking status to completed
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'in_progress');

    if (updateError) {
      console.error(`Error completing booking ${bookingId}:`, updateError);
      return { success: false, error: 'Failed to update booking status' };
    }

    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'completed' },
      })
      .catch(() => undefined);

    // Process payment if requested and payment intent exists
    if (options?.processPayment && booking.payment_intent_id) {
      try {
        // Import dynamically to avoid circular dependency
        const { retryPaymentProcessing } = await import('./payments');
        const paymentResult = await retryPaymentProcessing(
          bookingId,
          booking.payment_intent_id,
          3 // 3 retry attempts with exponential backoff
        );

        if (!paymentResult.success) {
          // Booking is completed but payment failed after all retries
          console.error('Payment processing failed after retries for booking:', bookingId);
          return {
            success: true,
            paymentProcessed: false,
            payoutFailed: true,
            error: paymentResult.error,
          };
        }

        // Check if capture succeeded but payout failed
        if (paymentResult.captureResult && !paymentResult.payoutResult) {
          return {
            success: true,
            paymentProcessed: false,
            payoutFailed: true,
            error: paymentResult.error,
          };
        }

        return { success: true, paymentProcessed: true };
      } catch (paymentError: unknown) {
        const message = paymentError instanceof Error ? paymentError.message : 'Unknown payment error';
        console.error('Error processing payment:', paymentError);
        return {
          success: true, // Booking is completed
          paymentProcessed: false,
          payoutFailed: true,
          error: message,
        };
      }
    }

    return { success: true, paymentProcessed: false };
  } catch (error: unknown) {
    console.error('Error in completeBooking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Cancel an accepted booking (professional emergency cancellation)
 * Changes status from 'accepted' to 'cancelled' and releases payment hold
 */
export async function cancelAcceptedBooking(
  bookingId: string,
  handyId: string,
  reason?: string
): Promise<boolean> {
  try {
    // Read booking to get payment info
    const { data: booking } = await supabase
      .from('bookings')
      .select('payment_intent_id, payment_status')
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'accepted')
      .single();

    if (!booking) {
      console.warn(`Booking ${bookingId} not found or not in accepted status`);
      return false;
    }

    // Step 1: Update status to cancelled FIRST
    const updateData: { status: BookingStatus; decline_reason?: string } = {
      status: 'cancelled',
    };
    if (reason) {
      updateData.decline_reason = reason;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('handy_id', handyId)
      .eq('status', 'accepted')
      .select();

    if (error) {
      console.error(`Error cancelling accepted booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not cancelled - status may not be accepted`);
      return false;
    }

    // Step 2: Release payment hold AFTER status is confirmed cancelled
    if (booking.payment_intent_id && booking.payment_status === 'authorized') {
      try {
        const { cancelPaymentIntent, updateBookingPaymentStatus, logPaymentError } = await import('./payments');
        const released = await cancelPaymentIntent(booking.payment_intent_id);
        if (released) {
          await updateBookingPaymentStatus(bookingId, 'cancelled');
        } else {
          await logPaymentError(bookingId, 'hold_release_failed', 'Payment hold was not released on professional cancellation.', {
            paymentIntentId: booking.payment_intent_id,
          });
          await supabase
            .from('bookings')
            .update({ payment_hold_release_failed: true })
            .eq('id', bookingId);
        }
      } catch (e) {
        console.error('Failed to release authorization hold:', bookingId, e);
      }
    }

    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'cancelled' },
      })
      .catch(() => undefined);

    return true;
  } catch (error) {
    console.error('Error in cancelAcceptedBooking:', error);
    return false;
  }
}

/**
 * Update booking details (only for pending bookings)
 */
export async function updateBookingDetails(
  bookingId: string,
  customerId: string,
  updates: {
    scheduled_date?: string;
    scheduled_time?: string;
    task_details?: string;
    form_responses?: FormResponse;
  }
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .eq('status', 'pending')
      .select();

    if (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not updated - may not be pending or not owned by user`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateBookingDetails:', error);
    return false;
  }
}

/**
 * Subscribe to booking status changes via Supabase Realtime
 */
export function subscribeToBookingUpdates(
  bookingId: string,
  onUpdate: (booking: Booking) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`booking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`,
      },
      (payload) => {
        onUpdate(payload.new as Booking);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from booking updates
 */
export async function unsubscribeFromBookingUpdates(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}
