import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Handys Extended API Hooks
 *
 * Hooks for handy selection process and applicant management
 */

// ============================================================================
// Types
// ============================================================================

export type ApplicantStage =
  | 'Application Review'
  | 'Interview'
  | 'Background Check'
  | 'Onboarding'

export type ApplicantStatus =
  | 'Pending'
  | 'Scheduled'
  | 'Passed'
  | 'Rejected'
  | 'Complete'

export interface HandyApplicant {
  id: string
  name: string
  applicationDate: string
  stage: ApplicantStage
  status: ApplicantStatus
  email?: string
  phone?: string
}

export interface ApplicantStageCount {
  stage: ApplicantStage
  count: number
}

// ============================================================================
// Helper Functions
// ============================================================================

function determineStage(
  verificationStatus: string | null,
  onboardingCompleted: boolean | null
): ApplicantStage {
  if (onboardingCompleted) {
    return 'Onboarding'
  }

  switch (verificationStatus) {
    case 'pending':
      return 'Application Review'
    case 'submitted':
    case 'documents_submitted':
      return 'Background Check'
    case 'interview_scheduled':
      return 'Interview'
    case 'approved':
    case 'verified':
      return 'Onboarding'
    default:
      return 'Application Review'
  }
}

function determineStatus(
  verificationStatus: string | null,
  onboardingCompleted: boolean | null,
  verified: boolean | null
): ApplicantStatus {
  if (onboardingCompleted && verified) {
    return 'Complete'
  }

  if (verificationStatus === 'rejected') {
    return 'Rejected'
  }

  if (verificationStatus === 'approved' || verificationStatus === 'verified') {
    return 'Passed'
  }

  if (verificationStatus === 'interview_scheduled') {
    return 'Scheduled'
  }

  return 'Pending'
}

// ============================================================================
// Handy Applicants Hook
// ============================================================================

export function useHandyApplicants(
  stageFilter?: ApplicantStage,
  statusFilter?: ApplicantStatus,
  searchQuery?: string
) {
  return useQuery({
    queryKey: ['admin', 'handy-applicants', stageFilter, statusFilter, searchQuery],
    queryFn: async (): Promise<HandyApplicant[]> => {
      // Query handy_profiles with their associated profiles
      const { data: handyProfiles, error } = await supabase
        .from('handy_profiles')
        .select(`
          user_id,
          verification_status,
          onboarding_completed,
          verified,
          created_at,
          profiles!handy_profiles_user_id_fkey (
            first_name,
            last_name,
            phone
          ),
          users!handy_profiles_user_id_fkey (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const applicants: HandyApplicant[] = []

      for (const handy of handyProfiles || []) {
        const profile = Array.isArray(handy.profiles)
          ? handy.profiles[0]
          : handy.profiles
        const user = Array.isArray(handy.users)
          ? handy.users[0]
          : handy.users

        const name = profile
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : 'Unknown'

        const stage = determineStage(
          handy.verification_status,
          handy.onboarding_completed
        )

        const status = determineStatus(
          handy.verification_status,
          handy.onboarding_completed,
          handy.verified
        )

        // Apply filters
        if (stageFilter && stage !== stageFilter) {
          continue
        }

        if (statusFilter && status !== statusFilter) {
          continue
        }

        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase()
          if (!name.toLowerCase().includes(searchLower)) {
            continue
          }
        }

        const applicationDate = handy.created_at
          ? new Date(handy.created_at).toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Unknown'

        applicants.push({
          id: handy.user_id,
          name: name || 'Unknown Applicant',
          applicationDate,
          stage,
          status,
          email: user?.email,
          phone: profile?.phone,
        })
      }

      return applicants
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Applicant Stage Counts Hook
// ============================================================================

export function useApplicantStageCounts() {
  return useQuery({
    queryKey: ['admin', 'applicant-stage-counts'],
    queryFn: async (): Promise<ApplicantStageCount[]> => {
      const { data: handyProfiles, error } = await supabase
        .from('handy_profiles')
        .select('verification_status, onboarding_completed')

      if (error) throw error

      const stageCounts: Record<ApplicantStage, number> = {
        'Application Review': 0,
        'Interview': 0,
        'Background Check': 0,
        'Onboarding': 0,
      }

      for (const handy of handyProfiles || []) {
        const stage = determineStage(
          handy.verification_status,
          handy.onboarding_completed
        )
        stageCounts[stage]++
      }

      return [
        { stage: 'Application Review', count: stageCounts['Application Review'] },
        { stage: 'Interview', count: stageCounts['Interview'] },
        { stage: 'Background Check', count: stageCounts['Background Check'] },
        { stage: 'Onboarding', count: stageCounts['Onboarding'] },
      ]
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
