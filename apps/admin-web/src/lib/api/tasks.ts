import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database, BookingStatus } from '@/lib/database.types'

/**
 * Tasks (Bookings) API Hooks
 *
 * Hooks for managing tasks/bookings in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

type Booking = Database['public']['Tables']['bookings']['Row']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export interface TaskWithDetails extends Booking {
  customer: {
    user_id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    phone: string | null
  } | null
  handy: {
    user_id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    rating: number
    phone: string | null
  } | null
  category: {
    id: string
    name: string
  } | null
  address: {
    id: string
    street: string
    city: string | null
    postcode: string
  } | null
}

export interface TaskTimelineItem {
  id: string
  label: string
  detail: string
  created_at: string
}

export interface TaskManagementDetails extends TaskWithDetails {
  payment: {
    id: string
    amount: number
    status: Database['public']['Tables']['payments']['Row']['status']
    created_at: string
  } | null
  review: {
    id: string
    rating: number
    comment: string | null
    created_at: string
  } | null
  timeline: TaskTimelineItem[]
}

export interface TaskFilters {
  search?: string
  status?: BookingStatus
  category_id?: string
  limit?: number
  offset?: number
}

export interface UpdateTaskInput {
  taskId: string
  task_title?: string
  task_details?: string
  status?: BookingStatus
  category_id?: string
  handy_id?: string
  scheduled_date?: string
  scheduled_time?: string
  hourly_rate_cents?: number
  estimated_hours?: number
}

export interface RescheduleTaskInput {
  taskId: string
  scheduled_date: string
  scheduled_time: string
  handy_id?: string
}

// Status display mapping
export const statusDisplayMap: Record<
  BookingStatus,
  { label: string; color: 'blue' | 'yellow' | 'green' | 'red' | 'gray' }
> = {
  pending: { label: 'Open', color: 'blue' },
  accepted: { label: 'Scheduled', color: 'yellow' },
  in_progress: { label: 'In Progress', color: 'yellow' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch list of tasks with optional filtering
 */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async (): Promise<TaskWithDetails[]> => {
      let query = supabase
        .from('bookings')
        .select(
          `
          *,
          customer:profiles!bookings_customer_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            phone
          ),
          handy:profiles!bookings_handy_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            rating,
            phone
          ),
          category:categories (
            id,
            name
          ),
          address:addresses (
            id,
            street,
            city,
            postcode
          )
        `
        )
        .order('created_at', { ascending: false })

      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      // Apply category filter
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      // Apply search filter (task ID, title, or location)
      if (filters.search) {
        const searchTerm = `%${filters.search}%`
        query = query.or(`id.ilike.${searchTerm},task_title.ilike.${searchTerm}`)
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data to handle Supabase's array returns for joins
      return (data || []).map((booking) => ({
        ...booking,
        customer: Array.isArray(booking.customer) ? booking.customer[0] : booking.customer,
        handy: Array.isArray(booking.handy) ? booking.handy[0] : booking.handy,
        category: Array.isArray(booking.category) ? booking.category[0] : booking.category,
        address: Array.isArray(booking.address) ? booking.address[0] : booking.address,
      }))
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Fetch single task by ID with full details
 */
export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async (): Promise<TaskWithDetails | null> => {
      if (!taskId) return null

      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          customer:profiles!bookings_customer_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            phone
          ),
          handy:profiles!bookings_handy_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            rating,
            phone
          ),
          category:categories (
            id,
            name
          ),
          address:addresses (
            id,
            street,
            city,
            postcode
          )
        `
        )
        .eq('id', taskId)
        .single()

      if (error) throw error

      return {
        ...data,
        customer: Array.isArray(data.customer) ? data.customer[0] : data.customer,
        handy: Array.isArray(data.handy) ? data.handy[0] : data.handy,
        category: Array.isArray(data.category) ? data.category[0] : data.category,
        address: Array.isArray(data.address) ? data.address[0] : data.address,
      }
    },
    enabled: !!taskId,
    staleTime: 30 * 1000,
  })
}

export function useTaskManagementDetails(taskId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', 'management-details', taskId],
    queryFn: async (): Promise<TaskManagementDetails | null> => {
      if (!taskId) return null
      await requireAdminPermission('tasks.manage')

      const task = await supabase
        .from('bookings')
        .select(
          `
          *,
          customer:profiles!bookings_customer_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            phone
          ),
          handy:profiles!bookings_handy_profile_fkey (
            user_id,
            first_name,
            last_name,
            avatar_url,
            rating,
            phone
          ),
          category:categories (
            id,
            name
          ),
          address:addresses (
            id,
            street,
            city,
            postcode
          )
        `,
        )
        .eq('id', taskId)
        .single()

      if (task.error) throw task.error

      const [paymentResult, reviewResult] = await Promise.all([
        supabase
          .from('payments')
          .select('id, amount_cents, status, created_at')
          .eq('booking_id', taskId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('reviews')
          .select('id, rating, comment, created_at')
          .eq('booking_id', taskId)
          .maybeSingle(),
      ])

      if (paymentResult.error) throw paymentResult.error
      if (reviewResult.error) throw reviewResult.error

      const booking = task.data
      const customer = Array.isArray(booking.customer) ? booking.customer[0] : booking.customer
      const handy = Array.isArray(booking.handy) ? booking.handy[0] : booking.handy
      const category = Array.isArray(booking.category) ? booking.category[0] : booking.category
      const address = Array.isArray(booking.address) ? booking.address[0] : booking.address

      const timeline: TaskTimelineItem[] = [
        {
          id: `created-${booking.id}`,
          label: 'Booking created',
          detail: `Task opened for ${customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : 'customer'}`.trim(),
          created_at: booking.created_at,
        },
        {
          id: `scheduled-${booking.id}`,
          label: 'Scheduled date',
          detail: `${booking.scheduled_date} ${booking.scheduled_time}`,
          created_at: booking.created_at,
        },
      ]

      if (booking.handy_id && handy) {
        timeline.push({
          id: `provider-${booking.id}`,
          label: 'Provider assigned',
          detail: `${handy.first_name || ''} ${handy.last_name || ''}`.trim() || 'Assigned provider',
          created_at: booking.created_at,
        })
      }

      if (paymentResult.data) {
        timeline.push({
          id: `payment-${paymentResult.data.id}`,
          label: 'Payment',
          detail: `${paymentResult.data.status} - £${(paymentResult.data.amount_cents / 100).toFixed(2)}`,
          created_at: paymentResult.data.created_at,
        })
      }

      if (reviewResult.data) {
        timeline.push({
          id: `review-${reviewResult.data.id}`,
          label: 'Review submitted',
          detail: `${reviewResult.data.rating}/5`,
          created_at: reviewResult.data.created_at,
        })
      }

      timeline.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      return {
        ...booking,
        customer,
        handy,
        category,
        address,
        payment: paymentResult.data
          ? {
              id: String(paymentResult.data.id),
              amount: paymentResult.data.amount_cents / 100,
              status: paymentResult.data.status,
              created_at: paymentResult.data.created_at,
            }
          : null,
        review: reviewResult.data
          ? {
              id: String(reviewResult.data.id),
              rating: reviewResult.data.rating,
              comment: reviewResult.data.comment,
              created_at: reviewResult.data.created_at,
            }
          : null,
        timeline,
      }
    },
    enabled: !!taskId,
    staleTime: 30 * 1000,
  })
}

/**
 * Get tasks count by status
 */
export function useTasksCount(status?: BookingStatus) {
  return useQuery({
    queryKey: ['tasks', 'count', status],
    queryFn: async (): Promise<number> => {
      let query = supabase.from('bookings').select('id', { count: 'exact', head: true })

      if (status) {
        query = query.eq('status', status)
      }

      const { count, error } = await query

      if (error) throw error

      return count || 0
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Get counts for all statuses (for tabs)
 */
export function useTaskStatusCounts() {
  return useQuery({
    queryKey: ['tasks', 'status-counts'],
    queryFn: async () => {
      const statuses: BookingStatus[] = [
        'pending',
        'accepted',
        'in_progress',
        'completed',
        'cancelled',
      ]

      const results = await Promise.all(
        statuses.map(async (status) => {
          const { count, error } = await supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('status', status)

          if (error) throw error
          return { status, count: count || 0 }
        })
      )

      // Also get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })

      if (totalError) throw totalError

      return {
        all: totalCount || 0,
        pending: results.find((r) => r.status === 'pending')?.count || 0,
        accepted: results.find((r) => r.status === 'accepted')?.count || 0,
        in_progress: results.find((r) => r.status === 'in_progress')?.count || 0,
        completed: results.find((r) => r.status === 'completed')?.count || 0,
        cancelled: results.find((r) => r.status === 'cancelled')?.count || 0,
      }
    },
    staleTime: 60 * 1000,
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Update task details
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateTaskInput) => {
      await requireAdminPermission('tasks.manage')
      const updateData: BookingUpdate = {}

      if (input.task_title !== undefined) updateData.task_title = input.task_title
      if (input.task_details !== undefined) updateData.task_details = input.task_details
      if (input.status !== undefined) updateData.status = input.status
      if (input.category_id !== undefined) updateData.category_id = input.category_id
      if (input.handy_id !== undefined) updateData.handy_id = input.handy_id
      if (input.scheduled_date !== undefined) updateData.scheduled_date = input.scheduled_date
      if (input.scheduled_time !== undefined) updateData.scheduled_time = input.scheduled_time
      if (input.hourly_rate_cents !== undefined)
        updateData.hourly_rate_cents = input.hourly_rate_cents
      if (input.estimated_hours !== undefined) updateData.estimated_hours = input.estimated_hours

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'booking.update',
        entityType: 'booking',
        entityId: String(data.id),
        summary: `Updated booking ${data.id}`,
        metadata: {
          changes: updateData,
        },
      })

      return data
    },
    onSuccess: (data) => {
      // Invalidate specific task and list queries
      queryClient.invalidateQueries({ queryKey: ['tasks', data.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/**
 * Reschedule task (update date, time, and optionally handy)
 */
export function useRescheduleTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RescheduleTaskInput) => {
      await requireAdminPermission('tasks.manage')
      const updateData: BookingUpdate = {
        scheduled_date: input.scheduled_date,
        scheduled_time: input.scheduled_time,
      }

      if (input.handy_id !== undefined) {
        updateData.handy_id = input.handy_id
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', input.taskId)
        .select()
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'booking.reschedule',
        entityType: 'booking',
        entityId: String(data.id),
        summary: `Rescheduled booking ${data.id}`,
        metadata: {
          scheduled_date: input.scheduled_date,
          scheduled_time: input.scheduled_time,
          handy_id: input.handy_id,
        },
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Cancel task
 */
export function useCancelTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      await requireAdminPermission('tasks.manage')
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' as BookingStatus })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'booking.cancel',
        entityType: 'booking',
        entityId: String(data.id),
        summary: `Cancelled booking ${data.id}`,
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
