import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { bulkDeleteAdminAuthUsers, createAdminAuthUser, deleteAdminAuthUser, fetchAdminAuthUsersByIds } from '@/lib/api/admin-user-management'
import { supabase } from '@/lib/supabase'
import type { Database, UserRole } from '@/lib/database.types'

/**
 * Users API Hooks
 *
 * Hooks for managing user profiles (customers, handys, admins)
 */

// ============================================================================
// Types
// ============================================================================

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface UserWithDetails extends Profile {
  email?: string
  bookings_count?: number
  total_spent?: number
}

export interface UserBookingHistoryItem {
  id: string
  task_title: string
  status: Database['public']['Tables']['bookings']['Row']['status']
  scheduled_date: string
  scheduled_time: string
  amount: number
  provider_name: string
  category_name: string
}

export interface UserPaymentHistoryItem {
  id: string
  booking_id: string
  amount: number
  status: Database['public']['Tables']['payments']['Row']['status']
  created_at: string
}

export interface UserReviewItem {
  id: string
  rating: number
  comment: string | null
  created_at: string
  handy_name: string
}

export interface UserSupportTicketItem {
  id: string
  subject: string
  status: string
  created_at: string
  message_count: number
}

export interface UserProfileDetails extends UserWithDetails {
  booking_history: UserBookingHistoryItem[]
  payment_history: UserPaymentHistoryItem[]
  reviews_given: UserReviewItem[]
  support_tickets: UserSupportTicketItem[]
}

export interface UserFilters {
  search?: string
  role?: UserRole
  accountStatus?: 'active' | 'paused' | 'deleted'
  limit?: number
  offset?: number
}

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  postcode?: string
  role?: UserRole
}

export interface UpdateUserInput {
  userId: string
  firstName?: string
  lastName?: string
  phone?: string
  postcode?: string
  role?: UserRole
  avatar_url?: string
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch list of users with optional filtering
 */
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async (): Promise<UserWithDetails[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          bookings:bookings!bookings_customer_profile_fkey(id)
        `)
        .order('created_at', { ascending: false })

      // Apply role filter
      if (filters.role) {
        query = query.eq('role', filters.role)
      }

      if (filters.accountStatus) {
        query = query.eq('account_status', filters.accountStatus)
      }

      // Apply search filter (name, phone)
      if (filters.search) {
        const searchTerm = `%${filters.search}%`
        query = query.or(
          `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},phone.ilike.${searchTerm}`
        )
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

      // Transform data to include counts
      return (data || []).map((profile) => ({
        ...profile,
        bookings_count: Array.isArray(profile.bookings) ? profile.bookings.length : 0,
      }))
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Fetch single user by ID with full details
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<UserProfileDetails | null> => {
      if (!userId) return null

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (profileError) throw profileError
      if (!profile) return null

      const emailMap = await fetchAdminAuthUsersByIds([userId])

      // Fetch booking stats and history
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          task_title,
          status,
          scheduled_date,
          scheduled_time,
          hourly_rate_cents,
          estimated_hours,
          categories(name),
          provider:profiles!bookings_handy_id_fkey(first_name, last_name)
        `)
        .eq('customer_id', userId)
        .order('scheduled_date', { ascending: false })

      // Fetch total spent from payments
      const { data: payments } = await supabase
        .from('payments')
        .select('id, booking_id, amount_cents, status, created_at')
        .in(
          'booking_id',
          bookings?.map((b) => b.id) || ['__none__']
        )
        .order('created_at', { ascending: false })

      const { data: reviews } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          handy:profiles!reviews_handy_id_fkey(first_name, last_name)
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false })

      const { data: tickets } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          status,
          created_at,
          support_messages(id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const paidPayments = (payments || []).filter((payment) => payment.status === 'paid')
      const totalSpent = paidPayments.reduce((sum, payment) => sum + payment.amount_cents, 0)

      const bookingHistory: UserBookingHistoryItem[] = (bookings || []).map((booking) => {
        const category = Array.isArray(booking.categories) ? booking.categories[0] : booking.categories
        const provider = Array.isArray(booking.provider) ? booking.provider[0] : booking.provider
        return {
          id: String(booking.id),
          task_title: booking.task_title,
          status: booking.status,
          scheduled_date: booking.scheduled_date,
          scheduled_time: booking.scheduled_time,
          amount: ((booking.hourly_rate_cents || 0) * (booking.estimated_hours || 1)) / 100,
          provider_name:
            `${provider?.first_name || ''} ${provider?.last_name || ''}`.trim() || 'Unassigned',
          category_name: category?.name || 'Uncategorised',
        }
      })

      return {
        ...profile,
        email: emailMap.get(userId),
        bookings_count: bookings?.length || 0,
        total_spent: totalSpent / 100, // Convert cents to dollars
        booking_history: bookingHistory,
        payment_history: (payments || []).map((payment) => ({
          id: String(payment.id),
          booking_id: String(payment.booking_id),
          amount: payment.amount_cents / 100,
          status: payment.status,
          created_at: payment.created_at,
        })),
        reviews_given: (reviews || []).map((review) => {
          const handy = Array.isArray(review.handy) ? review.handy[0] : review.handy
          return {
            id: String(review.id),
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            handy_name: `${handy?.first_name || ''} ${handy?.last_name || ''}`.trim() || 'Unknown provider',
          }
        }),
        support_tickets: (tickets || []).map((ticket) => ({
          id: String(ticket.id),
          subject: ticket.subject || 'General Support',
          status: ticket.status || 'open',
          created_at: ticket.created_at,
          message_count: Array.isArray(ticket.support_messages) ? ticket.support_messages.length : 0,
        })),
      }
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  })
}

/**
 * Get users count by role
 */
export function useUsersCount(role?: UserRole) {
  return useQuery({
    queryKey: ['users', 'count', role],
    queryFn: async (): Promise<number> => {
      let query = supabase
        .from('profiles')
        .select('user_id', { count: 'exact', head: true })

      if (role) {
        query = query.eq('role', role)
      }

      const { count, error } = await query

      if (error) throw error

      return count || 0
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new user with auth account and profile
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      await requireAdminPermission('users.manage')
      // 1. Create auth user
      const authUser = await createAdminAuthUser({
        email: input.email,
        password: input.password,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        postcode: input.postcode,
        role: input.role || 'customer',
      })

      // Profile should be created automatically via trigger
      // Wait a moment for trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Verify profile was created
      const { error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (profileError) {
        // If profile wasn't created by trigger, create it manually
        const { error: insertError } = await supabase.from('profiles').insert({
          user_id: authUser.id,
          role: input.role || 'customer',
          admin_role: input.role === 'admin' ? 'super_admin' : null,
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          postcode: input.postcode,
        })

        if (insertError) throw insertError
      } else if (input.role === 'admin') {
        const { error: adminRoleError } = await supabase
          .from('profiles')
          .update({ admin_role: 'super_admin' })
          .eq('user_id', authUser.id)
          .is('admin_role', null)

        if (adminRoleError) throw adminRoleError
      }

      await createAdminAuditLog({
        action: 'user.create',
        entityType: 'user',
        entityId: authUser.id,
        summary: `Created ${input.role || 'customer'} account for ${input.firstName} ${input.lastName}`,
        metadata: {
          role: input.role || 'customer',
          email: input.email,
        },
      })

      return authUser
    },
    onSuccess: () => {
      // Invalidate users list queries
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Update user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      await requireAdminPermission('users.manage')
      const updateData: ProfileUpdate = {}

      if (input.firstName !== undefined) updateData.first_name = input.firstName
      if (input.lastName !== undefined) updateData.last_name = input.lastName
      if (input.phone !== undefined) updateData.phone = input.phone
      if (input.postcode !== undefined) updateData.postcode = input.postcode
      if (input.role !== undefined) updateData.role = input.role
      if (input.role === 'admin') updateData.admin_role = 'super_admin'
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', input.userId)
        .select()
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'user.update',
        entityType: 'user',
        entityId: input.userId,
        summary: `Updated profile for ${data.first_name || ''} ${data.last_name || ''}`.trim(),
        metadata: {
          changes: updateData,
        },
      })

      return data
    },
    onSuccess: (data) => {
      // Invalidate specific user and list queries
      queryClient.invalidateQueries({ queryKey: ['users', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Delete user (soft delete - just removes from auth, RLS handles cascade)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      await requireAdminPermission('users.manage')
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('user_id', userId)
        .single()

      // Delete auth user (cascade will handle profile via ON DELETE CASCADE)
      await deleteAdminAuthUser(userId)

      await createAdminAuditLog({
        action: 'user.delete',
        entityType: 'user',
        entityId: userId,
        summary: `Deleted ${profile?.role || 'user'} account for ${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
      })

      return userId
    },
    onSuccess: () => {
      // Invalidate users list queries
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Delete multiple users in batch
 */
export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      await requireAdminPermission('users.manage')
      // Delete users one by one (Supabase doesn't support batch delete)
      await bulkDeleteAdminAuthUsers(userIds)

      await createAdminAuditLog({
        action: 'user.bulk_delete',
        entityType: 'user',
        summary: `Deleted ${userIds.length} user accounts`,
        metadata: {
          userIds,
        },
      })

      return userIds
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Update user status (active/inactive) - could be implemented via a status field
 * For now, this is a placeholder for future implementation
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      status,
      reason,
    }: {
      userId: string
      status: 'active' | 'paused' | 'deleted'
      reason?: string | null
    }) => {
      await requireAdminPermission('accounts.manage')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          account_status: status,
          status_reason: reason || null,
          status_updated_at: new Date().toISOString(),
          deleted_at: status === 'deleted' ? new Date().toISOString() : null,
        })
        .eq('user_id', userId)
        .select('user_id, first_name, last_name, role, account_status')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'user.account_status.update',
        entityType: 'user',
        entityId: userId,
        summary: `Changed ${data.role} account status to ${status} for ${data.first_name || ''} ${data.last_name || ''}`.trim(),
        metadata: {
          status,
          reason: reason || null,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
