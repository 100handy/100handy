import { BookingWithRelations } from '@shared/supabase/bookings';
import { WrenchIcon, PaintbrushIcon, HammerIcon, HomeIcon, CarIcon, HeartIcon } from 'lucide-react-native';

// Map booking status to TaskCard status tone
export function getStatusTone(status: string): 'scheduled' | 'progress' | 'neutral' {
  switch (status) {
    case 'pending':
    case 'accepted':
      return 'scheduled';
    case 'in_progress':
      return 'progress';
    case 'completed':
    case 'cancelled':
      return 'neutral';
    default:
      return 'neutral';
  }
}

// Map booking status to display label
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Scheduled';
    case 'accepted':
      return 'Confirmed';
    case 'in_progress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

// Map category to icon
export function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  
  if (name.includes('plumbing') || name.includes('pipe') || name.includes('water')) {
    return WrenchIcon;
  }
  if (name.includes('painting') || name.includes('decorating')) {
    return PaintbrushIcon;
  }
  if (name.includes('electrical') || name.includes('electric')) {
    return HammerIcon;
  }
  if (name.includes('cleaning') || name.includes('housekeeping')) {
    return HomeIcon;
  }
  if (name.includes('automotive') || name.includes('car')) {
    return CarIcon;
  }
  if (name.includes('health') || name.includes('care')) {
    return HeartIcon;
  }
  
  // Default icon
  return WrenchIcon;
}

// Map category to icon tone
export function getCategoryIconTone(categoryName: string): 'sage' | 'orange' | 'taupe' {
  const name = categoryName.toLowerCase();
  
  if (name.includes('plumbing') || name.includes('electrical')) {
    return 'orange';
  }
  if (name.includes('painting') || name.includes('cleaning')) {
    return 'sage';
  }
  if (name.includes('automotive') || name.includes('health')) {
    return 'taupe';
  }
  
  return 'sage';
}

// Format date and time for display
export function formatDateTime(date: string, time: string): string {
  const bookingDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateStr: string;
  
  if (bookingDate.toDateString() === today.toDateString()) {
    dateStr = 'Today';
  } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Tomorrow';
  } else {
    dateStr = bookingDate.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Format time (assuming time is in HH:MM format)
  const timeStr = time;
  
  return `${dateStr}, ${timeStr}`;
}

// Format address for display
export function formatAddress(address: BookingWithRelations['address']): string {
  if (!address) return 'Address not available';
  
  const parts = [
    address.street,
    address.apartment,
    address.city,
    address.postcode
  ].filter(Boolean);
  
  return parts.join(', ');
}

// Convert booking to TaskCard props
export function bookingToTaskCardProps(booking: BookingWithRelations) {
  const categoryName = booking.category?.name || 'General';
  const icon = getCategoryIcon(categoryName);
  const iconTone = getCategoryIconTone(categoryName);
  const statusLabel = getStatusLabel(booking.status);
  
  const dateTime = formatDateTime(booking.scheduled_date, booking.scheduled_time);
  const location = formatAddress(booking.address);
  
  // Convert hourly_rate_cents to price string
  const hourlyRate = booking.hourly_rate_cents / 100;
  const price = `£${hourlyRate.toFixed(2)} /hr`;
  
  // TODO: Fetch tasker info from handy_id when profile relation is added
  const taskerName = booking.handy_id ? 'Tasker' : 'Unassigned';
  const taskerRating = 5.0;
  const taskerReviews = 0;
  
  return {
    icon,
    iconTone,
    title: booking.task_title,
    dateTime,
    taskerName,
    taskerRating,
    taskerReviews,
    location,
    statusLabel,
    price,
    bookingId: booking.id,
  };
}
