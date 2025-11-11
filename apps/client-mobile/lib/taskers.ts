import type { BookingWithRelations } from '@shared/supabase/bookings';
import type { HandymanProfile } from '@shared/supabase/query';

// Tasker interface matching the UI component expectations
export interface Tasker {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  lastBooked: string;
  availability: string;
}

/**
 * Extract unique handymen from past bookings and format as Tasker data
 */
export function getPastTaskersFromBookings(bookings: BookingWithRelations[]): Tasker[] {
  // Filter for completed bookings that have a handy_id
  const completedBookings = bookings.filter(
    b => (b.status === 'completed' || b.status === 'cancelled') && b.handy_id
  );

  if (completedBookings.length === 0) {
    return [];
  }

  // Group bookings by handy_id and get the most recent booking for each
  const handymanMap = new Map<string, BookingWithRelations>();

  completedBookings.forEach(booking => {
    const handyId = booking.handy_id!;
    const existing = handymanMap.get(handyId);

    if (!existing) {
      handymanMap.set(handyId, booking);
    } else {
      // Keep the most recent booking
      const existingDate = new Date(`${existing.scheduled_date}T${existing.scheduled_time}`);
      const currentDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);

      if (currentDate > existingDate) {
        handymanMap.set(handyId, booking);
      }
    }
  });

  // Transform to Tasker format
  const taskers: Tasker[] = [];

  handymanMap.forEach((booking, handyId) => {
    const categoryName = booking.category?.name || 'General Services';
    const address = booking.address;
    const location = address
      ? [address.city, address.postcode].filter(Boolean).join(', ')
      : 'Location not available';

    const lastBookedDate = new Date(booking.scheduled_date);
    const lastBooked = lastBookedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // TODO: This data should come from the handy_profiles/profiles join
    // For now, using placeholder data
    taskers.push({
      id: handyId,
      name: 'Tasker', // Placeholder - should be from profile
      specialty: categoryName,
      avatarUrl: 'https://i.pravatar.cc/150?u=' + handyId,
      rating: 5.0, // Placeholder - should be from profile
      reviewCount: 0, // Placeholder - should be from profile
      location,
      lastBooked,
      availability: 'Check availability', // Placeholder
    });
  });

  return taskers;
}

/**
 * Transform HandymanProfile to Tasker format (for favorite taskers)
 */
export function handymanProfileToTasker(
  handyman: HandymanProfile,
  lastBooked?: string,
  specialty?: string
): Tasker {
  const name = handyman.display_name || `${handyman.first_name || ''} ${handyman.last_name || ''}`.trim() || 'Handyman';
  const location = handyman.postcode || 'Location not available';

  // Format availability based on verification status
  let availability = 'Check availability';
  if (handyman.verified) {
    availability = 'Available this week';
  }

  return {
    id: handyman.user_id,
    name,
    specialty: specialty || 'General Services',
    avatarUrl: handyman.avatar_url || `https://i.pravatar.cc/150?u=${handyman.user_id}`,
    rating: handyman.rating || 0,
    reviewCount: handyman.review_count || handyman.jobs_completed || 0,
    location,
    lastBooked: lastBooked || 'Not booked yet',
    availability,
  };
}

/**
 * Transform array of HandymanProfiles to Tasker format
 */
export function handymenProfilesToTaskers(handymen: HandymanProfile[]): Tasker[] {
  return handymen.map(handyman => handymanProfileToTasker(handyman));
}
