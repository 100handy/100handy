import { createClient } from '../supabase';
import type { FormResponse } from '@shared/supabase';
import { cancelPaymentIntent as cancelStripePaymentIntent, capturePayment } from '../stripe/payment';

export interface CreateBookingData {
  customer_id: string;
  handy_id: string;
  category_id: string;
  task_title: string;
  task_details?: string | null;
  scheduled_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format
  address_id: string;
  hourly_rate_cents: number;
  estimated_hours: number;
  form_responses?: FormResponse; // Category-specific form responses
  payment_intent_id?: string; // Stripe PaymentIntent ID
}

export interface UpdateBookingData {
  task_details?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  estimated_hours?: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  handy_id: string;
  category_id: string;
  task_title: string;
  task_details: string | null;
  scheduled_date: string;
  scheduled_time: string;
  address_id: string;
  hourly_rate_cents: number;
  estimated_hours: number;
  form_responses: FormResponse;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  payment_intent_id: string | null;
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cancelled';
  created_at: string;
  // Joined data
  customer_name?: string;
  handy_name?: string;
  category_name?: string;
  address?: {
    street: string;
    apartment: string | null;
    postcode: string;
    city: string | null;
    country: string;
  };
}

/**
 * Get estimated hours from task size form response.
 * Used by both payment authorization and booking creation.
 */
export function getEstimatedHours(taskSize: string | undefined): number {
  switch (taskSize) {
    case 'small': return 1;
    case 'large': return 4;
    default: return 2.5; // medium or unspecified
  }
}

/** Minimum hours for payment authorization hold */
export const MINIMUM_BOOKING_HOURS = 2;

/**
 * Create a new booking
 */
export async function createBooking(bookingData: CreateBookingData): Promise<Booking | null> {
  const supabase = createClient();

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', bookingData.category_id)
    .eq('active', true)
    .maybeSingle();

  if (categoryError) {
    console.error('Error validating booking category:', categoryError);
    throw categoryError;
  }

  if (!category) {
    throw new Error('This service category is currently unavailable.');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: bookingData.customer_id,
      handy_id: bookingData.handy_id,
      category_id: bookingData.category_id,
      task_title: bookingData.task_title,
      task_details: bookingData.task_details || null,
      scheduled_date: bookingData.scheduled_date,
      scheduled_time: bookingData.scheduled_time,
      address_id: bookingData.address_id,
      hourly_rate_cents: bookingData.hourly_rate_cents,
      estimated_hours: bookingData.estimated_hours,
      form_responses: bookingData.form_responses || {},
      status: 'pending',
      payment_intent_id: bookingData.payment_intent_id || null,
      payment_status: bookingData.payment_intent_id ? 'authorized' : 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
}

/**
 * Get a single booking by ID
 * Using manual joins due to PostgREST schema cache not recognizing foreign keys
 * TODO: Switch to automatic joins once schema cache refreshes
 */
export async function getBooking(bookingId: string): Promise<Booking | null> {
  const supabase = createClient();

  // Fetch booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (bookingError) {
    console.error(`Error fetching booking ${bookingId}:`, bookingError);
    return null;
  }

  if (!booking) {
    console.error(`Booking ${bookingId} not found`);
    return null;
  }

  // Fetch related data in parallel
  const [customerResult, handyResult, categoryResult, addressResult] = await Promise.allSettled([
    supabase.from('profiles').select('first_name, last_name').eq('user_id', booking.customer_id).single(),
    supabase.from('profiles').select('first_name, last_name').eq('user_id', booking.handy_id).single(),
    supabase.from('categories').select('name').eq('id', booking.category_id).single(),
    supabase.from('addresses').select('street, apartment, postcode, city, country').eq('id', booking.address_id).single(),
  ]);

  const customer = customerResult.status === 'fulfilled' ? customerResult.value.data : null;
  const handy = handyResult.status === 'fulfilled' ? handyResult.value.data : null;
  const category = categoryResult.status === 'fulfilled' ? categoryResult.value.data : null;
  const address = addressResult.status === 'fulfilled' ? addressResult.value.data : null;

  // Combine data
  return {
    ...booking,
    customer_name: customer ? `${customer.first_name} ${customer.last_name}` : '',
    handy_name: handy ? `${handy.first_name} ${handy.last_name}` : '',
    category_name: category?.name || '',
    address: address || undefined,
  } as Booking;
}

/**
 * Get all bookings for a customer
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = createClient();

  // Fetch bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false });

  if (error) {
    console.error(`Error fetching user bookings for ${userId}:`, error);
    throw error;
  }

  if (!bookings || bookings.length === 0) return [];

  return enrichBookingsWithRelations(supabase, bookings, 'handy');
}

/**
 * Enrich bookings with profile, category, and address data in parallel.
 * @param lookupRole - 'handy' to look up handy profiles, 'customer' to look up customer profiles
 */
async function enrichBookingsWithRelations(
  supabase: ReturnType<typeof createClient>,
  bookings: any[],
  lookupRole: 'handy' | 'customer'
): Promise<Booking[]> {
  const lookupIds = [...new Set(bookings.map(b => lookupRole === 'handy' ? b.handy_id : b.customer_id))];
  const categoryIds = [...new Set(bookings.map(b => b.category_id))];
  const addressIds = [...new Set(bookings.map(b => b.address_id))];

  // Fetch related data in parallel (gracefully degrade on failure)
  const [profilesResult, categoriesResult, addressesResult] = await Promise.allSettled([
    supabase.from('profiles').select('user_id, first_name, last_name').in('user_id', lookupIds),
    supabase.from('categories').select('id, name').in('id', categoryIds),
    supabase.from('addresses').select('id, street, apartment, postcode, city, country').in('id', addressIds),
  ]);

  const profiles = profilesResult.status === 'fulfilled' ? profilesResult.value.data : null;
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value.data : null;
  const addresses = addressesResult.status === 'fulfilled' ? addressesResult.value.data : null;

  // Create lookup maps
  const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
  const categoryMap = new Map(categories?.map(c => [c.id, c]));
  const addressMap = new Map(addresses?.map(a => [a.id, a]));

  return bookings.map(booking => {
    const profileId = lookupRole === 'handy' ? booking.handy_id : booking.customer_id;
    const profile = profileMap.get(profileId);
    const category = categoryMap.get(booking.category_id);
    const address = addressMap.get(booking.address_id);
    const profileName = profile ? `${profile.first_name} ${profile.last_name}` : '';

    return {
      ...booking,
      ...(lookupRole === 'handy' ? { handy_name: profileName } : { customer_name: profileName }),
      category_name: category?.name || '',
      address: address ? {
        street: address.street,
        apartment: address.apartment,
        postcode: address.postcode,
        city: address.city,
        country: address.country,
      } : undefined,
    } as Booking;
  });
}

/**
 * Get all bookings for a handyman
 */
export async function getHandymanBookings(handyId: string): Promise<Booking[]> {
  const supabase = createClient();

  // Fetch bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('handy_id', handyId)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false });

  if (error) {
    console.error(`Error fetching handyman bookings for ${handyId}:`, error);
    throw error;
  }

  if (!bookings || bookings.length === 0) return [];

  return enrichBookingsWithRelations(supabase, bookings, 'customer');
}

/**
 * Update a booking
 */
export async function updateBooking(
  bookingId: string,
  updates: UpdateBookingData
): Promise<Booking | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }

  return data;
}

/**
 * Cancel a booking
 * @param bookingId - The ID of the booking to cancel
 * @param customerId - The customer's user ID (ownership check)
 */
export async function cancelBooking(
  bookingId: string,
  customerId: string
): Promise<{ success: boolean; cancellationFeeCharged: boolean }> {
  const supabase = createClient();

  try {
    // Read booking first to verify ownership and status
    const { data: booking } = await supabase
      .from('bookings')
      .select('payment_intent_id, payment_status, status')
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .single();

    if (!booking) {
      console.warn(`Booking ${bookingId} not found for customer ${customerId}`);
      return { success: false, cancellationFeeCharged: false };
    }

    if (booking.status === 'in_progress') {
      console.warn(`Booking ${bookingId} is in_progress — cannot cancel`);
      return { success: false, cancellationFeeCharged: false };
    }

    // Step 1: Update status to cancelled FIRST (atomic check via status filter)
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .in('status', ['pending', 'accepted'])
      .select('payment_intent_id, payment_status, scheduled_date, scheduled_time, hourly_rate_cents');

    if (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      return { success: false, cancellationFeeCharged: false };
    }

    if (!data || data.length === 0) {
      console.warn(`Booking ${bookingId} not cancelled — status may have changed`);
      return { success: false, cancellationFeeCharged: false };
    }

    const updatedBooking = data[0];
    let cancellationFeeCharged = false;

    // Step 2: Handle payment hold
    if (updatedBooking?.payment_intent_id && updatedBooking.payment_status === 'authorized') {
      // Check if cancellation is within 24 hours of scheduled start
      const isWithin24Hours = (() => {
        if (!updatedBooking.scheduled_date || !updatedBooking.scheduled_time) return false;
        const scheduledStart = new Date(`${updatedBooking.scheduled_date}T${updatedBooking.scheduled_time}`);
        const hoursUntilStart = (scheduledStart.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilStart >= 0 && hoursUntilStart < 24;
      })();

      try {
        if (isWithin24Hours && updatedBooking.hourly_rate_cents > 0) {
          // Charge 1-hour cancellation fee
          const captured = await capturePayment({
            paymentIntentId: updatedBooking.payment_intent_id,
            amount: updatedBooking.hourly_rate_cents,
          });
          if (captured?.success) {
            await supabase
              .from('bookings')
              .update({ payment_status: 'captured' })
              .eq('id', bookingId);
            cancellationFeeCharged = true;
          } else {
            // Capture failed — release hold instead, don't block cancellation
            await logPaymentErrorLocal(supabase, bookingId, 'cancellation_fee_capture_failed',
              'Could not capture cancellation fee. Releasing hold instead.',
              { paymentIntentId: updatedBooking.payment_intent_id });
            const released = await cancelStripePaymentIntent({ paymentIntentId: updatedBooking.payment_intent_id });
            if (released?.success) {
              await supabase
                .from('bookings')
                .update({ payment_status: 'cancelled' })
                .eq('id', bookingId);
            }
          }
        } else {
          // Release the authorization hold
          const released = await cancelStripePaymentIntent({ paymentIntentId: updatedBooking.payment_intent_id });
          if (released?.success) {
            await supabase
              .from('bookings')
              .update({ payment_status: 'cancelled' })
              .eq('id', bookingId);
          } else {
            // Hold release failed — flag for manual review
            await logPaymentErrorLocal(supabase, bookingId, 'hold_release_failed',
              'Payment hold was not released on cancellation. Will auto-expire in ~7 days.',
              { paymentIntentId: updatedBooking.payment_intent_id });
            await supabase
              .from('bookings')
              .update({ payment_hold_release_failed: true })
              .eq('id', bookingId);
          }
        }
      } catch (e) {
        console.error('Failed to process payment for cancelled booking:', bookingId, e);
        await logPaymentErrorLocal(supabase, bookingId, 'hold_release_error', String(e), {
          paymentIntentId: updatedBooking.payment_intent_id,
        });
      }
    }

    // Step 3: Send push notification (fire-and-forget)
    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'booking_status', bookingId, status: 'cancelled' },
      })
      .catch(() => undefined);

    return { success: true, cancellationFeeCharged };
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    return { success: false, cancellationFeeCharged: false };
  }
}

/**
 * Log a payment error to the payment_errors table (best-effort).
 */
async function logPaymentErrorLocal(
  supabase: ReturnType<typeof createClient>,
  bookingId: string,
  errorType: string,
  errorMessage: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await supabase.from('payment_errors').insert({
      booking_id: bookingId,
      error_type: errorType,
      error_message: errorMessage,
      metadata: metadata || {},
    });
  } catch (e) {
    console.error('Failed to log payment error:', e);
  }
}

/**
 * Accept a booking (handyman action)
 */
export async function acceptBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'accepted' })
    .eq('id', bookingId)
    .eq('status', 'pending');

  if (error) {
    console.error(`Error accepting booking ${bookingId}:`, error);
    return false;
  }

  return true;
}

/**
 * Complete a booking
 */
export async function completeBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)
    .eq('status', 'in_progress');

  if (error) {
    console.error(`Error completing booking ${bookingId}:`, error);
    return false;
  }

  return true;
}

/**
 * Get bookings by status for a user
 */
export async function getUserBookingsByStatus(
  userId: string,
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
): Promise<Booking[]> {
  const supabase = createClient();

  // Fetch bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', userId)
    .eq('status', status)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false});

  if (error) {
    console.error(`Error fetching ${status} bookings for user ${userId}:`, error);
    throw error;
  }

  if (!bookings || bookings.length === 0) return [];

  return enrichBookingsWithRelations(supabase, bookings, 'handy');
}

/**
 * Check if customer can leave a review (booking must be completed)
 */
export async function canLeaveReview(bookingId: string, customerId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('status, customer_id')
    .eq('id', bookingId)
    .single();

  if (error || !data) return false;

  // Check if booking is completed and belongs to customer
  if (data.status !== 'completed' || data.customer_id !== customerId) {
    return false;
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .single();

  return !existingReview;
}
