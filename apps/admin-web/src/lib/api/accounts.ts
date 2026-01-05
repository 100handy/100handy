import { useQuery } from '@tanstack/react-query'
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

