import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

/**
 * Verification API Hooks
 *
 * Hooks for managing handy verification in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

export interface VerificationRequest {
  userId: string
  userName: string
  verificationType: 'ID Check' | 'Profile Photo' | 'Background Check'
  status: 'Pending Review' | 'Verified' | 'Rejected' | 'Submitted'
  statusColor: string
  dateSubmitted: string
  documentUrl: string | null
  documentType: string | null
}

export interface VerificationStats {
  pendingCount: number
  verifiedCount: number
  rejectedCount: number
  submittedCount: number
}

export interface VerificationSettings {
  governmentIdCheckEnabled: boolean
  livenessCheckEnabled: boolean
  profilePhotoCheckEnabled: boolean
  socialMediaVerificationEnabled: boolean
}

const DEFAULT_VERIFICATION_SETTINGS: VerificationSettings = {
  governmentIdCheckEnabled: true,
  livenessCheckEnabled: true,
  profilePhotoCheckEnabled: false,
  socialMediaVerificationEnabled: false,
}

// ============================================================================
// Status Color Map
// ============================================================================

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const VERIFICATION_SETTINGS_KEY = 'accounts.verification_settings'

export function useVerificationSettings() {
  return useQuery({
    queryKey: ['admin', 'verification-settings'],
    queryFn: async (): Promise<VerificationSettings> => {
      await requireAdminPermission('accounts.manage')

      const { data, error } = await supabase
        .from('site_settings')
        .select('value_json')
        .eq('setting_key', VERIFICATION_SETTINGS_KEY)
        .maybeSingle()

      if (error) throw error

      const value = (data?.value_json as Partial<VerificationSettings> | null) ?? {}
      return {
        ...DEFAULT_VERIFICATION_SETTINGS,
        ...value,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveVerificationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: VerificationSettings) => {
      const { user } = await requireAdminPermission('accounts.manage')

      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            setting_group: 'accounts',
            setting_key: VERIFICATION_SETTINGS_KEY,
            value_json: settings,
            updated_by: user.id,
          },
          { onConflict: 'setting_key' },
        )

      if (error) throw error

      await createAdminAuditLog({
        action: 'verification.settings.update',
        entityType: 'verification_setting',
        entityId: VERIFICATION_SETTINGS_KEY,
        summary: 'Updated verification rules',
        metadata: settings,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verification-settings'] })
    },
  })
}

// ============================================================================
// Verification Requests Hook
// ============================================================================

export function useVerificationRequests(filter?: 'all' | 'pending' | 'submitted' | 'verified' | 'rejected') {
  return useQuery({
    queryKey: ['admin', 'verification-requests', filter],
    queryFn: async (): Promise<VerificationRequest[]> => {
      let query = supabase
        .from('handy_profiles')
        .select(`
          user_id,
          verification_status,
          verification_document_url,
          verification_document_type,
          verification_submitted_at,
          profiles!handy_profiles_profiles_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('verification_submitted_at', { ascending: false, nullsFirst: false })

      // Apply filter
      if (filter && filter !== 'all') {
        query = query.eq('verification_status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((handy) => {
        const profile = Array.isArray(handy.profiles)
          ? handy.profiles[0]
          : handy.profiles

        const firstName = profile?.first_name || 'Unknown'
        const lastName = profile?.last_name || 'User'
        const userName = `${firstName} ${lastName}`.trim()

        // Map status
        let displayStatus: VerificationRequest['status'] = 'Pending Review'
        const rawStatus = handy.verification_status || 'pending'

        switch (rawStatus) {
          case 'verified':
            displayStatus = 'Verified'
            break
          case 'rejected':
            displayStatus = 'Rejected'
            break
          case 'submitted':
            displayStatus = 'Submitted'
            break
          default:
            displayStatus = 'Pending Review'
        }

        // Determine verification type from document type
        let verificationType: VerificationRequest['verificationType'] = 'ID Check'
        if (handy.verification_document_type) {
          if (handy.verification_document_type.includes('passport')) {
            verificationType = 'ID Check'
          } else if (handy.verification_document_type.includes('license')) {
            verificationType = 'ID Check'
          }
        }

        const dateSubmitted = handy.verification_submitted_at
          ? new Date(handy.verification_submitted_at).toISOString().split('T')[0]
          : 'Not submitted'

        return {
          userId: handy.user_id,
          userName,
          verificationType,
          status: displayStatus,
          statusColor: statusColors[rawStatus] || statusColors.pending,
          dateSubmitted,
          documentUrl: handy.verification_document_url || null,
          documentType: handy.verification_document_type || null,
        }
      })
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

// ============================================================================
// Verification Stats Hook
// ============================================================================

export function useVerificationStats() {
  return useQuery({
    queryKey: ['admin', 'verification-stats'],
    queryFn: async (): Promise<VerificationStats> => {
      const { data, error } = await supabase
        .from('handy_profiles')
        .select('verification_status')

      if (error) throw error

      let pendingCount = 0
      let verifiedCount = 0
      let rejectedCount = 0
      let submittedCount = 0

      for (const handy of data || []) {
        switch (handy.verification_status) {
          case 'pending':
            pendingCount += 1
            break
          case 'verified':
            verifiedCount += 1
            break
          case 'rejected':
            rejectedCount += 1
            break
          case 'submitted':
            submittedCount += 1
            break
        }
      }

      return {
        pendingCount,
        verifiedCount,
        rejectedCount,
        submittedCount,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Update Verification Status Mutation
// ============================================================================

export function useUpdateVerificationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string
      status: 'verified' | 'rejected' | 'pending'
    }) => {
      await requireAdminPermission('providers.manage')
      const updates: Record<string, unknown> = {
        verification_status: status,
      }

      // If verified, also set the verified flag
      if (status === 'verified') {
        updates.verified = true
      } else if (status === 'rejected' || status === 'pending') {
        updates.verified = false
      }

      const { error } = await supabase
        .from('handy_profiles')
        .update(updates)
        .eq('user_id', userId)

      if (error) throw error

      await createAdminAuditLog({
        action: 'provider.verification.update',
        entityType: 'provider',
        entityId: userId,
        summary: `Updated provider verification status to ${status}`,
        metadata: {
          status,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verification-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'verification-stats'] })
    },
  })
}

// ============================================================================
// Single Handy Verification Details Hook
// ============================================================================

export interface VerificationDetail {
  userId: string
  userName: string
  email: string | null
  phone: string | null
  status: string
  documentUrl: string | null
  documentType: string | null
  submittedAt: string | null
  bio: string | null
  experienceYears: number
  hourlyRateCents: number
}

export function useVerificationDetail(userId: string) {
  return useQuery({
    queryKey: ['admin', 'verification-detail', userId],
    queryFn: async (): Promise<VerificationDetail | null> => {
      const { data, error } = await supabase
        .from('handy_profiles')
        .select(`
          user_id,
          verification_status,
          verification_document_url,
          verification_document_type,
          verification_submitted_at,
          bio,
          experience_years,
          hourly_rate_cents,
          profiles!handy_profiles_profiles_id_fkey (
            first_name,
            last_name,
            phone
          )
        `)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      if (!data) return null

      const profile = Array.isArray(data.profiles)
        ? data.profiles[0]
        : data.profiles

      const firstName = profile?.first_name || 'Unknown'
      const lastName = profile?.last_name || 'User'

      return {
        userId: data.user_id,
        userName: `${firstName} ${lastName}`.trim(),
        email: null, // Would need to join with auth.users to get email
        phone: profile?.phone || null,
        status: data.verification_status || 'pending',
        documentUrl: data.verification_document_url || null,
        documentType: data.verification_document_type || null,
        submittedAt: data.verification_submitted_at || null,
        bio: data.bio || null,
        experienceYears: data.experience_years || 0,
        hourlyRateCents: data.hourly_rate_cents || 0,
      }
    },
    enabled: !!userId,
  })
}
