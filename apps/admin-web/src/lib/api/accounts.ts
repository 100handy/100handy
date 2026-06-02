import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

/**
 * Accounts API Hooks
 *
 * Hooks for managing account status and user location settings
 */

// ============================================================================
// Types
// ============================================================================

export interface UserWithLocation {
  user_id: string
  first_name: string | null
  last_name: string | null
  email?: string
  address: {
    id: string
    street: string
    city: string | null
    postcode: string
    country: string
    is_primary: boolean
    created_at: string
  } | null
}

export interface AccountsSummary {
  totalUsers: number
  usersWithDefaultLocation: number
  handys: number
  clients: number
  pausedUsers: number
  deletedUsers: number
}

export type AccountLifecycleStatus = 'active' | 'paused' | 'deleted'
export type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'ops_admin'
  | 'support_admin'
  | 'finance_admin'
  | 'seo_admin'

export interface AccountStatusUser {
  user_id: string
  first_name: string | null
  last_name: string | null
  email?: string
  role: string
  phone: string | null
  account_status: AccountLifecycleStatus
  status_reason: string | null
  status_updated_at: string
  deleted_at: string | null
  created_at: string
}

export interface AdminAccessUser {
  user_id: string
  first_name: string | null
  last_name: string | null
  email?: string
  account_status: AccountLifecycleStatus
  admin_role: AdminRole | null
  status_reason: string | null
  created_at: string
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch users with their primary address (default location)
 */
export function useUsersWithLocation() {
  return useQuery({
    queryKey: ['accounts', 'users-with-location'],
    queryFn: async (): Promise<UserWithLocation[]> => {
      // Fetch all users who have at least one address
      const { data: addresses, error: addressError } = await supabase
        .from('addresses')
        .select(`
          id,
          user_id,
          street,
          city,
          postcode,
          country,
          is_primary,
          created_at
        `)
        .eq('is_primary', true)
        .order('created_at', { ascending: false })

      if (addressError) throw addressError

      if (!addresses || addresses.length === 0) {
        return []
      }

      // Get unique user IDs
      const userIds = [...new Set(addresses.map((a) => a.user_id).filter(Boolean))] as string[]

      if (userIds.length === 0) {
        return []
      }

      // Fetch profile info for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds)

      if (profilesError) throw profilesError

      // Create a map for quick profile lookup
      const profileMap = new Map<string, { first_name: string | null; last_name: string | null }>()
      for (const profile of profiles || []) {
        profileMap.set(profile.user_id, {
          first_name: profile.first_name,
          last_name: profile.last_name,
        })
      }

      // Try to get emails for users (admin only)
      const emailMap = new Map<string, string>()
      try {
        for (const userId of userIds) {
          const { data: authData } = await supabase.auth.admin.getUserById(userId)
          if (authData?.user?.email) {
            emailMap.set(userId, authData.user.email)
          }
        }
      } catch {
        // Ignore auth errors - emails are optional
      }

      // Combine data
      return addresses
        .filter((addr) => addr.user_id)
        .map((addr) => {
          const userId = addr.user_id as string
          const profile = profileMap.get(userId)

          return {
            user_id: userId,
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            email: emailMap.get(userId),
            address: {
              id: addr.id,
              street: addr.street,
              city: addr.city,
              postcode: addr.postcode,
              country: addr.country,
              is_primary: addr.is_primary,
              created_at: addr.created_at,
            },
          }
        })
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useAccountsSummary() {
  return useQuery({
    queryKey: ['accounts', 'summary'],
    queryFn: async (): Promise<AccountsSummary> => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, role, account_status')

      if (profilesError) throw profilesError

      const { count: defaultLocationCount, error: addressesError } = await supabase
        .from('addresses')
        .select('id', { count: 'exact', head: true })
        .eq('is_primary', true)

      if (addressesError) throw addressesError

      const totalUsers = profiles?.length ?? 0
      const handys = (profiles ?? []).filter((profile) => profile.role === 'handy').length
      const clients = (profiles ?? []).filter((profile) => profile.role === 'customer').length
      const pausedUsers = (profiles ?? []).filter((profile) => profile.account_status === 'paused').length
      const deletedUsers = (profiles ?? []).filter((profile) => profile.account_status === 'deleted').length

      return {
        totalUsers,
        usersWithDefaultLocation: defaultLocationCount ?? 0,
        handys,
        clients,
        pausedUsers,
        deletedUsers,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useAccountStatusUsers(status: AccountLifecycleStatus) {
  return useQuery({
    queryKey: ['accounts', 'status-users', status],
    queryFn: async (): Promise<AccountStatusUser[]> => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(
          'user_id, first_name, last_name, role, phone, account_status, status_reason, status_updated_at, deleted_at, created_at',
        )
        .eq('account_status', status)
        .order('status_updated_at', { ascending: false })

      if (error) throw error

      const emailMap = new Map<string, string>()
      for (const profile of profiles ?? []) {
        try {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id)
          if (authData?.user?.email) {
            emailMap.set(profile.user_id, authData.user.email)
          }
        } catch {
          // optional
        }
      }

      return (profiles ?? []).map((profile) => ({
        ...profile,
        email: emailMap.get(profile.user_id),
      }))
    },
    staleTime: 30 * 1000,
  })
}

export function useAdminAccessUsers() {
  return useQuery({
    queryKey: ['accounts', 'admin-access-users'],
    queryFn: async (): Promise<AdminAccessUser[]> => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, account_status, admin_role, status_reason, created_at')
        .eq('role', 'admin')
        .order('created_at', { ascending: true })

      if (error) throw error

      const emailMap = new Map<string, string>()
      for (const profile of profiles ?? []) {
        try {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id)
          if (authData?.user?.email) {
            emailMap.set(profile.user_id, authData.user.email)
          }
        } catch {
          // optional
        }
      }

      return (profiles ?? []).map((profile) => ({
        ...profile,
        email: emailMap.get(profile.user_id),
      }))
    },
    staleTime: 30 * 1000,
  })
}

export function useUpdateAccountLifecycleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      status,
      reason,
    }: {
      userId: string
      status: AccountLifecycleStatus
      reason?: string | null
    }) => {
      await requireAdminPermission('accounts.manage')
      const payload = {
        account_status: status,
        status_reason: reason || null,
        status_updated_at: new Date().toISOString(),
        deleted_at: status === 'deleted' ? new Date().toISOString() : null,
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', userId)
        .select(
          'user_id, first_name, last_name, role, phone, account_status, status_reason, status_updated_at, deleted_at, created_at',
        )
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'account.lifecycle.update',
        entityType: 'user',
        entityId: userId,
        summary: `Changed account lifecycle to ${status} for ${data.first_name || ''} ${data.last_name || ''}`.trim(),
        metadata: {
          role: data.role,
          status,
          reason: reason || null,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', 'summary'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'status-users'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'admin-access-users'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      adminRole,
    }: {
      userId: string
      adminRole: AdminRole
    }) => {
      await requireAdminPermission('accounts.manage')
      const { data, error } = await supabase
        .from('profiles')
        .update({
          admin_role: adminRole,
          status_updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('role', 'admin')
        .select('user_id, first_name, last_name, account_status, admin_role, status_reason, created_at')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'admin.role.update',
        entityType: 'admin',
        entityId: userId,
        summary: `Changed admin role to ${adminRole} for ${data.first_name || ''} ${data.last_name || ''}`.trim(),
        metadata: {
          adminRole,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', 'admin-access-users'] })
    },
  })
}
