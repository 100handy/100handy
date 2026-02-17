import { BookingWithRelations } from '@shared/supabase/bookings';
import { getCategoryIcon } from '@/lib/category-icons';

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
  const bookingDate = new Date(date + 'T00:00:00');
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
  
  // Use real name from handy_profile join
  const hp = booking.handy_profile;
  const taskerName = hp
    ? `${hp.first_name ?? ''} ${hp.last_name?.[0] ?? ''}`.trim() || 'Tasker'
    : booking.handy_id ? 'Tasker' : 'Unassigned';

  return {
    icon,
    iconTone,
    title: booking.task_title,
    dateTime,
    taskerName,
    location,
    statusLabel,
    price,
    bookingId: booking.id,
  };
}
