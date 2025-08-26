import { supabase } from './supabaseClient';

// Define types based on the database schema we saw
export interface Booking {
  id: number;
  customer_id: string;
  handy_id: string | null;
  category_id: number | null;
  task_title: string;
  task_details: string | null;
  scheduled_date: string;
  scheduled_time: string;
  address_id: number | null;
  hourly_rate_cents: number;
  estimated_hours: number;
  status: BookingStatus;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon_url: string | null;
}

export interface Address {
  id: number;
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
  const today = new Date().toISOString().split('T')[0];
  
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

export async function getBookingById(bookingId: number): Promise<BookingWithRelations | null> {
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
