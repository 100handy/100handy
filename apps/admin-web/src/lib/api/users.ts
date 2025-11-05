import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export interface UserFilters {
  search?: string
  role?: UserRole
  status?: 'active' | 'inactive'
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
          bookings:bookings!bookings_customer_id_fkey(id)
        `)
        .order('created_at', { ascending: false })

      // Apply role filter
      if (filters.role) {
        query = query.eq('role', filters.role)
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
    queryFn: async (): Promise<UserWithDetails | null> => {
      if (!userId) return null

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError

      // Fetch email from auth.users (admin only)
      const { data: authData } = await supabase.auth.admin.getUserById(userId)

      // Fetch booking stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', userId)

      // Fetch total spent from payments
      const { data: payments } = await supabase
        .from('payments')
        .select('amount_cents')
        .in(
          'booking_id',
          bookings?.map((b) => b.id) || []
        )
        .eq('status', 'paid')

      const totalSpent = payments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0

      return {
        ...profile,
        email: authData?.user?.email,
        bookings_count: bookings?.length || 0,
        total_spent: totalSpent / 100, // Convert cents to dollars
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
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          postcode: input.postcode,
          role: input.role || 'customer',
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Profile should be created automatically via trigger
      // Wait a moment for trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Verify profile was created
      const { error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single()

      if (profileError) {
        // If profile wasn't created by trigger, create it manually
        const { error: insertError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          role: input.role || 'customer',
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          postcode: input.postcode,
        })

        if (insertError) throw insertError
      }

      return authData.user
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
      const updateData: ProfileUpdate = {}

      if (input.firstName !== undefined) updateData.first_name = input.firstName
      if (input.lastName !== undefined) updateData.last_name = input.lastName
      if (input.phone !== undefined) updateData.phone = input.phone
      if (input.postcode !== undefined) updateData.postcode = input.postcode
      if (input.role !== undefined) updateData.role = input.role
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', input.userId)
        .select()
        .single()

      if (error) throw error

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
      // Delete auth user (cascade will handle profile via ON DELETE CASCADE)
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

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
      // Delete users one by one (Supabase doesn't support batch delete)
      const results = await Promise.allSettled(
        userIds.map((userId) => supabase.auth.admin.deleteUser(userId))
      )

      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} user(s)`)
      }

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
    mutationFn: async (_input: { userId: string; status: 'active' | 'inactive' }) => {
      // This would require adding a 'status' field to profiles table
      // For now, we can use the metadata or implement later
      throw new Error('Status update not yet implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
