import { supabase } from './supabaseClient';

export interface EarningsSummary {
  totalEarned: number; // in cents
  sentToBank: number; // in cents
  taskCount: number;
  hoursInvoiced: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  taskTitle: string;
  customerName: string;
  scheduledDate: string;
  amount: number; // in cents
  hours: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

export interface Payout {
  id: string;
  amount: number; // in cents
  status: 'pending' | 'paid' | 'failed';
  paidAt: string | null;
  createdAt: string;
}

/**
 * Get earnings summary for a professional for a specific month
 */
export async function getProfessionalEarnings(
  userId: string,
  year: number,
  month: number // 1-12
): Promise<EarningsSummary> {
  try {
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

    // Get completed bookings for this professional in the given month
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, hourly_rate_cents, estimated_hours, status, payment_status, discount_amount_cents')
      .eq('handy_id', userId)
      .eq('status', 'completed')
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate);

    if (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }

    // Calculate totals
    let totalEarned = 0;
    let sentToBank = 0;
    let taskCount = 0;
    let hoursInvoiced = 0;

    if (bookings) {
      for (const booking of bookings) {
        const grossAmount = booking.hourly_rate_cents * (booking.estimated_hours || 1);
        const discount = booking.discount_amount_cents || 0;
        const bookingAmount = grossAmount - discount;
        totalEarned += bookingAmount;
        hoursInvoiced += booking.estimated_hours || 1;
        taskCount += 1;

        // If payment was captured, it's been sent to bank
        if (booking.payment_status === 'captured') {
          sentToBank += bookingAmount;
        }
      }
    }

    return {
      totalEarned,
      sentToBank,
      taskCount,
      hoursInvoiced,
    };
  } catch (error) {
    console.error('Error in getProfessionalEarnings:', error);
    throw error;
  }
}

/**
 * Get invoices (completed bookings) for a professional for a specific month
 */
export async function getProfessionalInvoices(
  userId: string,
  year: number,
  month: number
): Promise<Invoice[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        task_title,
        scheduled_date,
        hourly_rate_cents,
        estimated_hours,
        discount_amount_cents,
        status,
        payment_status,
        created_at,
        customer:profiles!bookings_customer_profile_fkey(first_name, last_name)
      `)
      .eq('handy_id', userId)
      .in('status', ['completed', 'cancelled'])
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }

    return (bookings || []).map((booking) => {
      // Supabase returns joins as arrays, get the first element
      const customerArr = booking.customer as Array<{ first_name: string | null; last_name: string | null }> | null;
      const customer = customerArr && customerArr.length > 0 ? customerArr[0] : null;
      return {
        id: booking.id,
        bookingId: booking.id,
        taskTitle: booking.task_title,
        customerName: customer
          ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Customer'
          : 'Customer',
        scheduledDate: booking.scheduled_date,
        amount: (booking.hourly_rate_cents * (booking.estimated_hours || 1)) - (booking.discount_amount_cents || 0),
        hours: booking.estimated_hours || 1,
        status: booking.status === 'cancelled'
          ? 'cancelled'
          : booking.payment_status === 'captured'
            ? 'paid'
            : 'pending',
        createdAt: booking.created_at,
      };
    });
  } catch (error) {
    console.error('Error in getProfessionalInvoices:', error);
    throw error;
  }
}

/**
 * Get payouts for a professional for a specific month
 * For now, we aggregate captured payments as payouts since Stripe Connect isn't implemented
 */
export async function getProfessionalPayouts(
  userId: string,
  year: number,
  month: number
): Promise<Payout[]> {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    // Get completed bookings with payment and payout status
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        hourly_rate_cents,
        estimated_hours,
        discount_amount_cents,
        payment_status,
        payout_status,
        scheduled_date,
        created_at
      `)
      .eq('handy_id', userId)
      .eq('status', 'completed')
      .in('payment_status', ['captured', 'pending', 'authorized'])
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching payouts:', error);
      throw error;
    }

    return (bookings || []).map((booking) => ({
      id: `payout_${booking.id}`,
      amount: (booking.hourly_rate_cents * (booking.estimated_hours || 1)) - (booking.discount_amount_cents || 0),
      status: booking.payout_status === 'transferred'
        ? 'paid' as const
        : booking.payout_status === 'failed'
          ? 'failed' as const
          : 'pending' as const,
      paidAt: booking.payout_status === 'transferred' ? booking.scheduled_date : null,
      createdAt: booking.created_at,
    }));
  } catch (error) {
    console.error('Error in getProfessionalPayouts:', error);
    throw error;
  }
}

/**
 * Get available months that have earnings data for a professional
 */
export async function getEarningsMonths(userId: string): Promise<{ year: number; month: number }[]> {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('scheduled_date')
      .eq('handy_id', userId)
      .eq('status', 'completed')
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching earnings months:', error);
      throw error;
    }

    // Extract unique year-month combinations
    const monthsSet = new Set<string>();
    const months: { year: number; month: number }[] = [];

    if (bookings) {
      for (const booking of bookings) {
        const date = new Date(booking.scheduled_date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthsSet.has(key)) {
          monthsSet.add(key);
          months.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          });
        }
      }
    }

    // If no months have data, return current month
    if (months.length === 0) {
      const now = new Date();
      months.push({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
    }

    return months;
  } catch (error) {
    console.error('Error in getEarningsMonths:', error);
    throw error;
  }
}
