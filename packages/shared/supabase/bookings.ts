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
