import { supabase } from './supabaseClient';
import type { BookingStatus } from './bookings';

export type UserRole = 'customer' | 'handy';

export interface NotificationItem {
  id: string;
  type: 'booking_update' | 'new_message';
  title: string;
  body: string;
  route: string;
  createdAt: string;
  read: boolean;
  bookingId?: string;
  bookingStatus?: BookingStatus;
  conversationId?: string;
  senderName?: string;
  senderAvatar?: string | null;
}

function getBookingStatusText(status: BookingStatus, role: UserRole): { title: string; body: string } {
  if (role === 'customer') {
    switch (status) {
      case 'accepted':
        return { title: 'Booking Accepted', body: 'Your tasker has accepted your booking request.' };
      case 'in_progress':
        return { title: 'Task Started', body: 'Your tasker has started working on your task.' };
      case 'completed':
        return { title: 'Task Completed', body: 'Your task has been completed. Leave a review!' };
      case 'cancelled':
        return { title: 'Booking Cancelled', body: 'Your booking has been cancelled.' };
      default:
        return { title: 'Booking Update', body: `Your booking status changed to ${status}.` };
    }
  }
  // Professional
  switch (status) {
    case 'pending':
      return { title: 'New Job Request', body: 'You have a new booking request to review.' };
    case 'accepted':
      return { title: 'Job Confirmed', body: 'You accepted a booking. Check the schedule.' };
    case 'in_progress':
      return { title: 'Job In Progress', body: 'You marked a job as in progress.' };
    case 'completed':
      return { title: 'Job Completed', body: 'Great work! The job has been completed.' };
    case 'cancelled':
      return { title: 'Job Cancelled', body: 'A booking has been cancelled.' };
    default:
      return { title: 'Job Update', body: `Booking status changed to ${status}.` };
  }
}

/**
 * Fetch notification items from bookings and conversations.
 * Merges both sources into a single timeline sorted by date.
 */
export async function getNotifications(
  userId: string,
  role: UserRole
): Promise<NotificationItem[]> {
  const notifications: NotificationItem[] = [];

  // 1. Booking updates — status changes that the user should know about
  const bookingFilter = role === 'customer' ? 'customer_id' : 'handy_id';
  const bookingStatuses: BookingStatus[] =
    role === 'customer'
      ? ['accepted', 'in_progress', 'completed', 'cancelled']
      : ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, status, task_title, scheduled_date, created_at,
      handy_profile:profiles!bookings_handy_profile_fkey(first_name, last_name, avatar_url),
      customer_profile:profiles!bookings_customer_profile_fkey(first_name, last_name, avatar_url)
    `)
    .eq(bookingFilter, userId)
    .in('status', bookingStatuses)
    .order('created_at', { ascending: false })
    .limit(30);

  if (bookings) {
    for (const b of bookings) {
      const status = b.status as BookingStatus;
      const { title, body } = getBookingStatusText(status, role);
      const routePrefix = role === 'customer' ? '/(client)/booking-details' : '/(professional)/job-details';
      const otherProfile = role === 'customer' ? b.handy_profile : b.customer_profile;
      const profileData = Array.isArray(otherProfile) ? otherProfile[0] : otherProfile;
      const otherName = profileData
        ? `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim()
        : undefined;

      notifications.push({
        id: `booking_${b.id}`,
        type: 'booking_update',
        title,
        body: otherName ? `${otherName} — ${b.task_title}` : body,
        route: `${routePrefix}/${b.id}`,
        createdAt: b.created_at,
        read: true, // Booking notifications are considered "read" (no unread tracking)
        bookingId: b.id,
        bookingStatus: status,
      });
    }
  }

  // 2. Conversations with unread messages
  const unreadField = role === 'customer' ? 'client_unread_count' : 'tasker_unread_count';
  const participantField = role === 'customer' ? 'client_id' : 'tasker_id';

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, last_message_at, client_unread_count, tasker_unread_count,
      client:profiles!conversations_client_id_fkey(user_id, first_name, last_name, avatar_url),
      tasker:profiles!conversations_tasker_id_fkey(user_id, first_name, last_name, avatar_url)
    `)
    .eq(participantField, userId)
    .order('last_message_at', { ascending: false })
    .limit(20);

  if (conversations) {
    for (const conv of conversations) {
      const unreadCount = role === 'customer' ? conv.client_unread_count : conv.tasker_unread_count;
      const otherProfile = role === 'customer' ? conv.tasker : conv.client;
      const profileData = Array.isArray(otherProfile) ? otherProfile[0] : otherProfile;
      const senderName = profileData
        ? `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim() || 'User'
        : 'User';
      const chatRoute = role === 'customer'
        ? `/(client)/chat/conversation?conversationId=${conv.id}`
        : `/(professional)/chat/${conv.id}`;

      notifications.push({
        id: `conv_${conv.id}`,
        type: 'new_message',
        title: senderName,
        body: unreadCount > 0
          ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
          : 'No new messages',
        route: chatRoute,
        createdAt: conv.last_message_at,
        read: unreadCount === 0,
        conversationId: conv.id,
        senderName,
        senderAvatar: profileData?.avatar_url ?? null,
      });
    }
  }

  // Sort by date descending
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return notifications;
}

/**
 * Get total unread notification count for badge display.
 * Based on unread conversation message counts.
 */
export async function getUnreadNotificationCount(
  userId: string,
  role: UserRole
): Promise<number> {
  const participantField = role === 'customer' ? 'client_id' : 'tasker_id';
  const unreadField = role === 'customer' ? 'client_unread_count' : 'tasker_unread_count';

  const { data } = await supabase
    .from('conversations')
    .select(unreadField)
    .eq(participantField, userId)
    .gt(unreadField, 0);

  if (!data) return 0;

  return data.reduce((sum, row) => {
    const count = (row as Record<string, number>)[unreadField] ?? 0;
    return sum + count;
  }, 0);
}
