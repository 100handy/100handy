import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

/**
 * Handys API Hooks
 *
 * Hooks for managing handy profiles in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

type Profile = Database['public']['Tables']['profiles']['Row']
type HandyProfile = Database['public']['Tables']['handy_profiles']['Row']

export interface HandyWithDetails extends Profile {
  email?: string
  handy_profile: HandyProfile | null
}

export interface HandyFilters {
  search?: string
  verified?: boolean
  limit?: number
  offset?: number
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch list of handys with optional filtering
 */
export function useHandys(filters: HandyFilters = {}) {
  return useQuery({
    queryKey: ['handys', filters],
    queryFn: async (): Promise<HandyWithDetails[]> => {
      let query = supabase
        .from('profiles')
        .select(
          `
          *,
          handy_profile:handy_profiles (
            user_id,
            bio,
            hourly_rate_cents,
            experience_years,
            verified,
            created_at
          )
        `
        )
        .eq('role', 'handy')
        .order('created_at', { ascending: false })

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

      // Transform and filter by verified status if needed
      let result = (data || []).map((profile) => ({
        ...profile,
        handy_profile: Array.isArray(profile.handy_profile)
          ? profile.handy_profile[0] || null
          : profile.handy_profile,
      }))

      // Filter by verified status if specified
      if (filters.verified !== undefined) {
        result = result.filter(
          (h) => (h.handy_profile?.verified ?? false) === filters.verified
        )
      }

      return result
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Fetch single handy by user ID with full details
 */
export function useHandy(userId: string | undefined) {
  return useQuery({
    queryKey: ['handys', userId],
    queryFn: async (): Promise<HandyWithDetails | null> => {
      if (!userId) return null

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(
          `
          *,
          handy_profile:handy_profiles (
            user_id,
            bio,
            hourly_rate_cents,
            experience_years,
            verified,
            created_at
          )
        `
        )
        .eq('user_id', userId)
        .eq('role', 'handy')
        .single()

      if (profileError) throw profileError

      // Try to fetch email from auth (admin only)
      let email: string | undefined
      try {
        const { data: authData } = await supabase.auth.admin.getUserById(userId)
        email = authData?.user?.email
      } catch {
        // Ignore auth errors - email is optional
      }

      return {
        ...profile,
        email,
        handy_profile: Array.isArray(profile.handy_profile)
          ? profile.handy_profile[0] || null
          : profile.handy_profile,
      }
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  })
}

/**
 * Get handys count
 */
export function useHandysCount() {
  return useQuery({
    queryKey: ['handys', 'count'],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('profiles')
        .select('user_id', { count: 'exact', head: true })
        .eq('role', 'handy')

      if (error) throw error

      return count || 0
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Get available handys for assignment (used in dropdowns)
 */
export function useAvailableHandys() {
  return useQuery({
    queryKey: ['handys', 'available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          user_id,
          first_name,
          last_name,
          rating,
          handy_profile:handy_profiles (
            verified
          )
        `
        )
        .eq('role', 'handy')
        .order('rating', { ascending: false })

      if (error) throw error

      return (data || []).map((profile) => {
        const handyProfile = profile.handy_profile
        const verified = Array.isArray(handyProfile)
          ? (handyProfile[0] as { verified?: boolean } | undefined)?.verified ?? false
          : (handyProfile as { verified?: boolean } | null)?.verified ?? false

        return {
          user_id: profile.user_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
          rating: profile.rating,
          verified,
        }
      })
    },
    staleTime: 60 * 1000,
  })
}

// ============================================================================
// Availability Types
// ============================================================================

export type AvailabilityStatus = 'Available' | 'Partially Available' | 'Unavailable'

export interface HandyWithAvailability {
  user_id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  status: AvailabilityStatus
  statusColor: 'green' | 'yellow' | 'red'
  activeSlots: number
  totalSlots: number
}

/**
 * Fetch handys with their availability status
 * Derives status from professional_availability table
 */
export function useHandysWithAvailability() {
  return useQuery({
    queryKey: ['handys', 'with-availability'],
    queryFn: async (): Promise<HandyWithAvailability[]> => {
      // Step 1: Fetch all handys
      const { data: handys, error: handysError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, avatar_url')
        .eq('role', 'handy')
        .order('created_at', { ascending: false })

      if (handysError) throw handysError

      if (!handys || handys.length === 0) {
        return []
      }

      // Step 2: Fetch availability slots for all handys
      const handyIds = handys.map((h) => h.user_id)

      const { data: availabilitySlots, error: availError } = await supabase
        .from('professional_availability')
        .select('user_id, is_active')
        .in('user_id', handyIds)

      if (availError) throw availError

      // Step 3: Group availability by handy and derive status
      const availabilityMap = new Map<string, { active: number; total: number }>()

      for (const slot of availabilitySlots || []) {
        const current = availabilityMap.get(slot.user_id) || { active: 0, total: 0 }
        current.total++
        if (slot.is_active) {
          current.active++
        }
        availabilityMap.set(slot.user_id, current)
      }

      // Step 4: Transform to result format
      return handys.map((handy) => {
        const availability = availabilityMap.get(handy.user_id) || { active: 0, total: 0 }

        let status: AvailabilityStatus
        let statusColor: 'green' | 'yellow' | 'red'

        if (availability.total === 0 || availability.active === 0) {
          // No slots or no active slots
          status = 'Unavailable'
          statusColor = 'red'
        } else if (availability.active === availability.total) {
          // All slots are active
          status = 'Available'
          statusColor = 'green'
        } else {
          // Some slots active
          status = 'Partially Available'
          statusColor = 'yellow'
        }

        return {
          user_id: handy.user_id,
          first_name: handy.first_name,
          last_name: handy.last_name,
          avatar_url: handy.avatar_url,
          status,
          statusColor,
          activeSlots: availability.active,
          totalSlots: availability.total,
        }
      })
    },
    staleTime: 30 * 1000,
  })
}
