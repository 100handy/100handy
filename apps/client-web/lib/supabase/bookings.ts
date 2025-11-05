import { createClient } from '../supabase';

export interface CreateBookingData {
  customer_id: string;
  handy_id: string;
  category_id: string;
  task_title: string;
  task_details: string | null;
  scheduled_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format
  address_id: string;
  hourly_rate_cents: number;
  estimated_hours: number;
  task_size?: string; // 'small', 'medium', 'large'
  vehicle_requirement?: string; // 'not-needed', 'car', 'truck'
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
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  payment_intent_id: string | null;
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
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
 * Create a new booking
 */
export async function createBooking(bookingData: CreateBookingData): Promise<Booking | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: bookingData.customer_id,
      handy_id: bookingData.handy_id,
      category_id: bookingData.category_id,
      task_title: bookingData.task_title,
      task_details: bookingData.task_details,
      scheduled_date: bookingData.scheduled_date,
      scheduled_time: bookingData.scheduled_time,
      address_id: bookingData.address_id,
      hourly_rate_cents: bookingData.hourly_rate_cents,
      estimated_hours: bookingData.estimated_hours,
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

  // Fetch customer profile
  const { data: customer } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('user_id', booking.customer_id)
    .single();

  // Fetch handyman profile
  const { data: handy } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('user_id', booking.handy_id)
    .single();

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', booking.category_id)
    .single();

  // Fetch address
  const { data: address } = await supabase
    .from('addresses')
    .select('street, apartment, postcode, city, country')
    .eq('id', booking.address_id)
    .single();

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

  // Get all unique IDs
  const handyIds = [...new Set(bookings.map(b => b.handy_id))];
  const categoryIds = [...new Set(bookings.map(b => b.category_id))];
  const addressIds = [...new Set(bookings.map(b => b.address_id))];

  // Fetch related data
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name')
    .in('user_id', handyIds);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .in('id', categoryIds);

  const { data: addresses } = await supabase
    .from('addresses')
    .select('id, street, apartment, postcode, city, country')
    .in('id', addressIds);

  // Create lookup maps
  const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
  const categoryMap = new Map(categories?.map(c => [c.id, c]));
  const addressMap = new Map(addresses?.map(a => [a.id, a]));

  // Combine data
  return bookings.map(booking => {
    const handy = profileMap.get(booking.handy_id);
    const category = categoryMap.get(booking.category_id);
    const address = addressMap.get(booking.address_id);

    return {
      ...booking,
      handy_name: handy ? `${handy.first_name} ${handy.last_name}` : '',
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

  // Get all unique IDs
  const customerIds = [...new Set(bookings.map(b => b.customer_id))];
  const categoryIds = [...new Set(bookings.map(b => b.category_id))];
  const addressIds = [...new Set(bookings.map(b => b.address_id))];

  // Fetch related data
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name')
    .in('user_id', customerIds);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .in('id', categoryIds);

  const { data: addresses } = await supabase
    .from('addresses')
    .select('id, street, apartment, postcode, city, country')
    .in('id', addressIds);

  // Create lookup maps
  const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
  const categoryMap = new Map(categories?.map(c => [c.id, c]));
  const addressMap = new Map(addresses?.map(a => [a.id, a]));

  // Combine data
  return bookings.map(booking => {
    const customer = profileMap.get(booking.customer_id);
    const category = categoryMap.get(booking.category_id);
    const address = addressMap.get(booking.address_id);

    return {
      ...booking,
      customer_name: customer ? `${customer.first_name} ${customer.last_name}` : '',
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
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    return false;
  }

  return true;
}

/**
 * Accept a booking (handyman action)
 */
export async function acceptBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'accepted' })
    .eq('id', bookingId);

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
    .eq('id', bookingId);

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

  // Get all unique IDs
  const handyIds = [...new Set(bookings.map(b => b.handy_id))];
  const categoryIds = [...new Set(bookings.map(b => b.category_id))];
  const addressIds = [...new Set(bookings.map(b => b.address_id))];

  // Fetch related data
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name')
    .in('user_id', handyIds);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .in('id', categoryIds);

  const { data: addresses } = await supabase
    .from('addresses')
    .select('id, street, apartment, postcode, city, country')
    .in('id', addressIds);

  // Create lookup maps
  const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
  const categoryMap = new Map(categories?.map(c => [c.id, c]));
  const addressMap = new Map(addresses?.map(a => [a.id, a]));

  // Combine data
  return bookings.map(booking => {
    const handy = profileMap.get(booking.handy_id);
    const category = categoryMap.get(booking.category_id);
    const address = addressMap.get(booking.address_id);

    return {
      ...booking,
      handy_name: handy ? `${handy.first_name} ${handy.last_name}` : '',
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
