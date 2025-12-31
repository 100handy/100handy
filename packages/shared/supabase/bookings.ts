import { supabase } from './supabaseClient';
import type { FormResponse } from './types/forms';

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
  form_responses: FormResponse; // Category-specific form responses
  created_at: string;
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

// Profile interface removed since we're not joining with profiles table

export type BookingWithRelations = Booking & {
  category: Category | null;
  address: Address | null;
};

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface GetBookingsOptions {
  userId?: string;
  status?: BookingStatus | BookingStatus[];
  limit?: number;
  offset?: number;
}

export async function getBookings(options: GetBookingsOptions = {}): Promise<BookingWithRelations[]> {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        category:categories(*),
        address:addresses(*)
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
  return getBookings({
    userId,
    status: ['pending', 'accepted', 'in_progress'],
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
        address:addresses(*)
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
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  try {
    // First, create or get the address
    const { data: addressData, error: addressError } = await supabase
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
        address_id: addressData.id,
        hourly_rate_cents: input.hourly_rate_cents,
        estimated_hours: input.estimated_hours,
        form_responses: input.form_responses || {},
        status: 'pending',
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
  scheduledTime: string
): Promise<boolean> {
  try {
    // Normalize time format to HH:MM for comparison
    const normalizedTime = scheduledTime.slice(0, 5); // Get "HH:MM" part

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('handy_id', handyId)
      .eq('scheduled_date', scheduledDate)
      .in('status', ['pending', 'accepted', 'in_progress']); // Only check non-cancelled/completed bookings

    if (error) {
      console.error('Error checking booking conflict:', error);
      throw new Error(`Failed to check booking conflict: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return false; // No conflict
    }

    // Check if any existing booking overlaps with the requested time
    // For now, we do an exact match on the time (within the same hour)
    const { data: conflictData, error: conflictError } = await supabase
      .from('bookings')
      .select('id, scheduled_time')
      .eq('handy_id', handyId)
      .eq('scheduled_date', scheduledDate)
      .in('status', ['pending', 'accepted', 'in_progress']);

    if (conflictError) {
      console.error('Error checking time conflict:', conflictError);
      throw new Error(`Failed to check time conflict: ${conflictError.message}`);
    }

    // Check if any booking starts at the same time
    const hasConflict = conflictData?.some((booking) => {
      const bookingTime = booking.scheduled_time.slice(0, 5);
      return bookingTime === normalizedTime;
    });

    return hasConflict || false;
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
export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);
      return false;
    }

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
export async function acceptBooking(bookingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'accepted' })
      .eq('id', bookingId)
      .eq('status', 'pending'); // Only accept if currently pending

    if (error) {
      console.error(`Error accepting booking ${bookingId}:`, error);
      return false;
    }

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
  reason?: string
): Promise<boolean> {
  try {
    const updateData: { status: BookingStatus; decline_reason?: string } = {
      status: 'cancelled',
    };

    if (reason) {
      updateData.decline_reason = reason;
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('status', 'pending'); // Only decline if currently pending

    if (error) {
      console.error(`Error declining booking ${bookingId}:`, error);
      return false;
    }

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
export async function startBooking(bookingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('status', 'accepted'); // Only start if currently accepted

    if (error) {
      console.error(`Error starting booking ${bookingId}:`, error);
      return false;
    }

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
  options?: { processPayment?: boolean }
): Promise<{
  success: boolean;
  paymentProcessed?: boolean;
  error?: string;
}> {
  try {
    // First, get the booking to check payment status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, payment_intent_id, payment_status, status')
      .eq('id', bookingId)
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
      .eq('status', 'in_progress');

    if (updateError) {
      console.error(`Error completing booking ${bookingId}:`, updateError);
      return { success: false, error: 'Failed to update booking status' };
    }

    // Process payment if requested and payment intent exists
    if (options?.processPayment && booking.payment_intent_id) {
      try {
        // Import dynamically to avoid circular dependency
        const { processJobCompletionPayment } = await import('./payments');
        const paymentResult = await processJobCompletionPayment(
          bookingId,
          booking.payment_intent_id
        );

        if (!paymentResult.success) {
          // Booking is completed but payment failed - log for manual intervention
          console.error('Payment processing failed for completed booking:', bookingId);
          return {
            success: true,
            paymentProcessed: false,
            error: paymentResult.error,
          };
        }

        return { success: true, paymentProcessed: true };
      } catch (paymentError: any) {
        console.error('Error processing payment:', paymentError);
        return {
          success: true, // Booking is completed
          paymentProcessed: false,
          error: paymentError.message,
        };
      }
    }

    return { success: true, paymentProcessed: false };
  } catch (error: any) {
    console.error('Error in completeBooking:', error);
    return { success: false, error: error.message };
  }
}
