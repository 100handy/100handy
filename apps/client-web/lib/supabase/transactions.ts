// Transaction history and download functions
import { createClient } from '@/lib/supabase-client';
import type { Transaction } from './types';

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(year?: number): Promise<Transaction[]> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return [];
    }

    // Get bookings for this user
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, task_title, scheduled_date, category_id')
      .eq('customer_id', user.id);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return [];
    }

    const bookingIds = bookings?.map(b => b.id) || [];
    
    if (bookingIds.length === 0) {
      return [];
    }

    // Get payments for these bookings
    let query = supabase
      .from('payments')
      .select('*')
      .in('booking_id', bookingIds)
      .order('created_at', { ascending: false });

    // Filter by year if provided
    if (year) {
      const startDate = `${year}-01-01T00:00:00Z`;
      const endDate = `${year}-12-31T23:59:59Z`;
      query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    const { data: payments, error: paymentsError } = await query;

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return [];
    }

    // Get categories
    const categoryIds = bookings
      ?.map(b => b.category_id)
      .filter((id): id is string => id !== null) || [];
    
    let categories: Record<string, string> = {};
    
    if (categoryIds.length > 0) {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (categoriesData) {
        categories = Object.fromEntries(
          categoriesData.map(c => [c.id, c.name])
        );
      }
    }

    // Combine payment and booking data
    const transactions: Transaction[] = payments?.map(payment => {
      const booking = bookings?.find(b => b.id === payment.booking_id);
      return {
        ...payment,
        task_title: booking?.task_title,
        category_name: booking?.category_id ? categories[booking.category_id] : undefined,
        scheduled_date: booking?.scheduled_date,
      };
    }) || [];

    return transactions;
  } catch (error) {
    console.error('Error in getTransactionHistory:', error);
    return [];
  }
}

/**
 * Get available years for transaction history
 */
export async function getAvailableYears(): Promise<number[]> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return [];
    }

    // Get all bookings for user
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('customer_id', user.id);

    const bookingIds = bookings?.map(b => b.id) || [];
    
    if (bookingIds.length === 0) {
      return [];
    }

    // Get all payments
    const { data: payments } = await supabase
      .from('payments')
      .select('created_at')
      .in('booking_id', bookingIds);

    if (!payments || payments.length === 0) {
      return [];
    }

    // Extract unique years
    const years = new Set(
      payments.map(p => new Date(p.created_at).getFullYear())
    );

    return Array.from(years).sort((a, b) => b - a);
  } catch (error) {
    console.error('Error in getAvailableYears:', error);
    return [];
  }
}

/**
 * Download transactions as CSV
 */
export function downloadTransactionsCSV(transactions: Transaction[], year?: number): void {
  try {
    // Create CSV content
    const headers = ['Date', 'Task Title', 'Category', 'Amount', 'Status'];
    const rows = transactions.map(t => [
      new Date(t.created_at).toLocaleDateString(),
      t.task_title || 'N/A',
      t.category_name || 'N/A',
      `£${(t.amount_cents / 100).toFixed(2)}`,
      t.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions${year ? `-${year}` : ''}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error in downloadTransactionsCSV:', error);
    throw new Error('Failed to download CSV');
  }
}

/**
 * Download transactions as PDF
 * Note: This requires a PDF library. We'll use a simple approach with jsPDF
 */
export async function downloadTransactionsPDF(
  transactions: Transaction[],
  year?: number
): Promise<void> {
  try {
    // Dynamic import to avoid bundling jsPDF if not needed
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Transaction History${year ? ` - ${year}` : ''}`, 20, 20);
    
    // Add table headers
    doc.setFontSize(10);
    let y = 40;
    doc.text('Date', 20, y);
    doc.text('Task Title', 50, y);
    doc.text('Category', 110, y);
    doc.text('Amount', 150, y);
    doc.text('Status', 180, y);
    
    y += 10;
    
    // Add transactions
    transactions.forEach((t, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(new Date(t.created_at).toLocaleDateString(), 20, y);
      doc.text((t.task_title || 'N/A').substring(0, 25), 50, y);
      doc.text((t.category_name || 'N/A').substring(0, 18), 110, y);
      doc.text(`£${(t.amount_cents / 100).toFixed(2)}`, 150, y);
      doc.text(t.status, 180, y);
      
      y += 8;
    });
    
    // Save PDF
    doc.save(`transactions${year ? `-${year}` : ''}.pdf`);
  } catch (error) {
    console.error('Error in downloadTransactionsPDF:', error);
    throw new Error('Failed to download PDF');
  }
}
