import { supabase } from './supabaseClient';

// Review types
export type ReviewerType = 'customer' | 'handy';

export interface Review {
  id: string;
  booking_id: string | null;
  customer_id: string | null;
  handy_id: string | null;
  reviewer_type: ReviewerType;
  rating: number;
  comment: string | null;
  private_notes: string | null; // Only for handy reviews, private
  created_at: string;
}

export interface ReviewWithBooking extends Review {
  booking?: {
    id: string;
    task_title: string;
    scheduled_date: string;
    category?: {
      name: string;
    } | null;
  } | null;
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
  privateNotes?: string; // Only for professional reviews
}

// ==========================================
// Customer Review Functions (Public Reviews)
// ==========================================

/**
 * Create a customer review for a professional
 * This is a public review that appears on the professional's profile
 */
export async function createCustomerReview(input: CreateReviewInput): Promise<Review | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Error getting user:', authError);
      return null;
    }

    // Get booking to find handy_id
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('handy_id, customer_id, status')
      .eq('id', input.bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      return null;
    }

    // Verify this is the customer's booking and it's completed
    if (booking.customer_id !== user.id) {
      console.error('User is not the customer for this booking');
      return null;
    }

    if (booking.status !== 'completed') {
      console.error('Booking is not completed');
      return null;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: input.bookingId,
        customer_id: user.id,
        handy_id: booking.handy_id,
        reviewer_type: 'customer',
        rating: input.rating,
        comment: input.comment || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating customer review:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createCustomerReview:', error);
    return null;
  }
}

/**
 * Get reviews for a professional (public, for profile display)
 * Only returns customer reviews (not professional reviews of clients)
 */
export async function getReviewsForProfessional(
  handyId: string,
  limit = 50
): Promise<ReviewWithBooking[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        booking:bookings(id, task_title, scheduled_date, category:categories(name))
      `)
      .eq('handy_id', handyId)
      .eq('reviewer_type', 'customer')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching reviews for professional:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getReviewsForProfessional:', error);
    return [];
  }
}

/**
 * Get average rating for a professional
 */
export async function getProfessionalRating(
  handyId: string
): Promise<{ averageRating: number; totalReviews: number }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('handy_id', handyId)
      .eq('reviewer_type', 'customer');

    if (error) {
      console.error('Error fetching professional rating:', error);
      return { averageRating: 0, totalReviews: 0 };
    }

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: data.length,
    };
  } catch (error) {
    console.error('Error in getProfessionalRating:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
}

// ==========================================
// Professional Review Functions (Private)
// ==========================================

/**
 * Create a professional's review of a client
 * This is a private review, only visible to the professional
 */
export async function createProfessionalReview(input: CreateReviewInput): Promise<Review | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Error getting user:', authError);
      return null;
    }

    // Get booking to find customer_id
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('handy_id, customer_id, status')
      .eq('id', input.bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      return null;
    }

    // Verify this is the professional's booking and it's completed
    if (booking.handy_id !== user.id) {
      console.error('User is not the professional for this booking');
      return null;
    }

    if (booking.status !== 'completed') {
      console.error('Booking is not completed');
      return null;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: input.bookingId,
        customer_id: booking.customer_id,
        handy_id: user.id,
        reviewer_type: 'handy',
        rating: input.rating,
        comment: input.comment || null,
        private_notes: input.privateNotes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating professional review:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createProfessionalReview:', error);
    return null;
  }
}

/**
 * Get client review history for a professional (private)
 * Shows how this professional has rated a specific client
 */
export async function getClientReviewHistory(customerId: string): Promise<ReviewWithBooking[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Error getting user:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        booking:bookings(id, task_title, scheduled_date, category:categories(name))
      `)
      .eq('handy_id', user.id)
      .eq('customer_id', customerId)
      .eq('reviewer_type', 'handy')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client review history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getClientReviewHistory:', error);
    return [];
  }
}

/**
 * Get average rating a professional has given to a client (private)
 */
export async function getClientRatingByProfessional(
  customerId: string
): Promise<{ averageRating: number; totalReviews: number }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('handy_id', user.id)
      .eq('customer_id', customerId)
      .eq('reviewer_type', 'handy');

    if (error) {
      console.error('Error fetching client rating:', error);
      return { averageRating: 0, totalReviews: 0 };
    }

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: data.length,
    };
  } catch (error) {
    console.error('Error in getClientRatingByProfessional:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
}

// ==========================================
// Shared Functions
// ==========================================

/**
 * Check if a review already exists for a booking by a specific reviewer type
 */
export async function hasReviewedBooking(
  bookingId: string,
  reviewerType: ReviewerType
): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return false;
    }

    const column = reviewerType === 'customer' ? 'customer_id' : 'handy_id';

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .eq('reviewer_type', reviewerType)
      .eq(column, user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is fine)
      console.error('Error checking review existence:', error);
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasReviewedBooking:', error);
    return false;
  }
}

/**
 * Get review by booking ID and reviewer type
 */
export async function getReviewByBooking(
  bookingId: string,
  reviewerType: ReviewerType
): Promise<Review | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    const column = reviewerType === 'customer' ? 'customer_id' : 'handy_id';

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('reviewer_type', reviewerType)
      .eq(column, user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching review:', error);
    }

    return data;
  } catch (error) {
    console.error('Error in getReviewByBooking:', error);
    return null;
  }
}

/**
 * Get bookings pending review for the current user
 * Returns completed bookings that haven't been reviewed yet
 */
export async function getBookingsPendingReview(
  reviewerType: ReviewerType,
  limit = 10
): Promise<Array<{
  id: string;
  task_title: string;
  scheduled_date: string;
  completed_at: string | null;
  category?: { name: string } | null;
}>> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return [];
    }

    const column = reviewerType === 'customer' ? 'customer_id' : 'handy_id';

    // Get completed bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, task_title, scheduled_date, completed_at, category:categories(name)')
      .eq(column, user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(limit * 2); // Get more to account for already reviewed

    if (bookingsError || !bookings) {
      console.error('Error fetching bookings:', bookingsError);
      return [];
    }

    // Get existing reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('booking_id')
      .eq(column, user.id)
      .eq('reviewer_type', reviewerType);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return [];
    }

    const reviewedBookingIds = new Set(reviews?.map((r) => r.booking_id) || []);

    // Filter out already reviewed bookings
    const pendingReview = bookings.filter((b) => !reviewedBookingIds.has(b.id));

    // Map to normalize category from array to single object
    return pendingReview.slice(0, limit).map((b) => ({
      ...b,
      category: Array.isArray(b.category) ? b.category[0] || null : b.category,
    }));
  } catch (error) {
    console.error('Error in getBookingsPendingReview:', error);
    return [];
  }
}
