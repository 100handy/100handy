import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { PaymentStatus } from '@/lib/database.types'

export interface FinanceTransaction {
  id: string
  booking_id: string | null
  amount: number
  status: PaymentStatus
  created_at: string
  customer_name: string
  provider_name: string
  task_title: string
  category_name: string
}

export interface FinanceTransactionFilters {
  search?: string
  status?: PaymentStatus | 'all'
}

export function useFinanceTransactions(filters: FinanceTransactionFilters = {}) {
  return useQuery({
    queryKey: ['finance', 'transactions', filters],
    queryFn: async (): Promise<FinanceTransaction[]> => {
      await requireAdminPermission('finance.view')

      let query = supabase
        .from('payments')
        .select(`
          id,
          booking_id,
          amount_cents,
          status,
          created_at,
          booking:bookings(
            id,
            task_title,
            customer:profiles!bookings_customer_profile_fkey(first_name, last_name),
            provider:profiles!bookings_handy_profile_fkey(first_name, last_name),
            category:categories(name)
          )
        `)
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      if (error) throw error

      let rows: FinanceTransaction[] = (data ?? []).map((payment) => {
        const booking = Array.isArray(payment.booking) ? payment.booking[0] : payment.booking
        const customer = Array.isArray(booking?.customer) ? booking?.customer[0] : booking?.customer
        const provider = Array.isArray(booking?.provider) ? booking?.provider[0] : booking?.provider
        const category = Array.isArray(booking?.category) ? booking?.category[0] : booking?.category

        return {
          id: String(payment.id),
          booking_id: payment.booking_id ? String(payment.booking_id) : null,
          amount: payment.amount_cents / 100,
          status: payment.status,
          created_at: payment.created_at,
          customer_name:
            `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim() || 'Unknown customer',
          provider_name:
            `${provider?.first_name || ''} ${provider?.last_name || ''}`.trim() || 'Unassigned',
          task_title: booking?.task_title || 'Unknown booking',
          category_name: category?.name || 'Uncategorised',
        }
      })

      if (filters.search) {
        const searchValue = filters.search.toLowerCase()
        rows = rows.filter((row) =>
          row.id.toLowerCase().includes(searchValue) ||
          row.customer_name.toLowerCase().includes(searchValue) ||
          row.provider_name.toLowerCase().includes(searchValue) ||
          row.task_title.toLowerCase().includes(searchValue),
        )
      }

      return rows
    },
    staleTime: 30 * 1000,
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
      await requireAdminPermission('finance.manage')

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('id, booking_id, amount_cents, status')
        .eq('id', paymentId)
        .maybeSingle()

      if (paymentError) throw paymentError
      if (!payment) throw new Error('Payment not found.')
      if (!payment.booking_id) throw new Error('Cannot refund a payment that is not linked to a booking.')

      const { data: refundResult, error: refundError } = await supabase.functions.invoke('refund-payment', {
        body: {
          bookingId: payment.booking_id,
          reason,
        },
      })

      if (refundError) throw refundError
      if (refundResult?.error) throw new Error(refundResult.error)

      await createAdminAuditLog({
        action: 'payment.refund',
        entityType: 'payment',
        entityId: String(payment.id),
        summary: `Refunded payment ${payment.id}`,
        metadata: {
          bookingId: payment.booking_id,
          amountCents: payment.amount_cents,
          reason,
          refundId: refundResult?.refundId ?? null,
        },
      })

      return {
        ...payment,
        refundId: refundResult?.refundId ?? null,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useFinanceSummary() {
  return useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: async () => {
      await requireAdminPermission('finance.view')
      const { data, error } = await supabase.from('payments').select('amount_cents, status')
      if (error) throw error

      const payments = data ?? []
      return {
        paid: payments.filter((row) => row.status === 'paid').reduce((sum, row) => sum + row.amount_cents, 0) / 100,
        refunded:
          payments.filter((row) => row.status === 'refunded').reduce((sum, row) => sum + row.amount_cents, 0) / 100,
        pending:
          payments.filter((row) => row.status === 'pending').reduce((sum, row) => sum + row.amount_cents, 0) / 100,
        failedCount: payments.filter((row) => row.status === 'failed').length,
      }
    },
    staleTime: 30 * 1000,
  })
}
