import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface ServiceAreaItem {
  id: string
  city: string
  postcodePrefix: string
  enabled: boolean
  notes: string | null
  assignedProviders: number
}

export interface ServiceAreaAssignment {
  id: string
  providerId: string
  providerName: string
  postcode: string | null
  hasWorkArea: boolean
  assignedAt: string
}

export interface ProviderCandidate {
  providerId: string
  providerName: string
  postcode: string | null
  hasWorkArea: boolean
}

export function useServiceAreas() {
  return useQuery({
    queryKey: ['admin', 'service-areas'],
    queryFn: async (): Promise<ServiceAreaItem[]> => {
      await requireAdminPermission('locations.manage')

      const { data: areas, error } = await supabase
        .from('service_areas')
        .select('id, city, postcode_prefix, enabled, notes')
        .order('city', { ascending: true })

      if (error) throw error

      const areaIds = (areas ?? []).map((area) => area.id)
      const counts = new Map<string, number>()

      if (areaIds.length > 0) {
        const { data: assignments, error: assignmentsError } = await supabase
          .from('provider_service_areas')
          .select('service_area_id')
          .in('service_area_id', areaIds)

        if (assignmentsError) throw assignmentsError

        for (const assignment of assignments ?? []) {
          counts.set(assignment.service_area_id, (counts.get(assignment.service_area_id) || 0) + 1)
        }
      }

      return (areas ?? []).map((area) => ({
        id: area.id,
        city: area.city,
        postcodePrefix: area.postcode_prefix,
        enabled: area.enabled,
        notes: area.notes,
        assignedProviders: counts.get(area.id) || 0,
      }))
    },
    staleTime: 30 * 1000,
  })
}

export function useServiceAreaAssignments(serviceAreaId: string | null) {
  return useQuery({
    queryKey: ['admin', 'service-area-assignments', serviceAreaId],
    queryFn: async (): Promise<ServiceAreaAssignment[]> => {
      if (!serviceAreaId) return []
      await requireAdminPermission('locations.manage')

      const { data: assignments, error } = await supabase
        .from('provider_service_areas')
        .select('id, provider_id, created_at')
        .eq('service_area_id', serviceAreaId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const providerIds = (assignments ?? []).map((assignment) => assignment.provider_id)
      if (providerIds.length === 0) return []

      const [{ data: profiles, error: profilesError }, { data: workAreas, error: workAreasError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('user_id, first_name, last_name, postcode')
          .in('user_id', providerIds),
        supabase
          .from('professional_work_areas')
          .select('user_id')
          .in('user_id', providerIds),
      ])

      if (profilesError) throw profilesError
      if (workAreasError) throw workAreasError

      const profileMap = new Map((profiles ?? []).map((profile) => [profile.user_id, profile]))
      const workAreaSet = new Set((workAreas ?? []).map((row) => row.user_id))

      return (assignments ?? []).map((assignment) => {
        const profile = profileMap.get(assignment.provider_id)
        return {
          id: assignment.id,
          providerId: assignment.provider_id,
          providerName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown provider',
          postcode: profile?.postcode || null,
          hasWorkArea: workAreaSet.has(assignment.provider_id),
          assignedAt: assignment.created_at,
        }
      })
    },
    enabled: !!serviceAreaId,
    staleTime: 20 * 1000,
  })
}

export function useProviderCandidates(serviceAreaId: string | null) {
  return useQuery({
    queryKey: ['admin', 'provider-candidates', serviceAreaId],
    queryFn: async (): Promise<ProviderCandidate[]> => {
      if (!serviceAreaId) return []
      await requireAdminPermission('locations.manage')

      const [{ data: area, error: areaError }, { data: assigned, error: assignedError }] = await Promise.all([
        supabase.from('service_areas').select('postcode_prefix').eq('id', serviceAreaId).single(),
        supabase.from('provider_service_areas').select('provider_id').eq('service_area_id', serviceAreaId),
      ])

      if (areaError) throw areaError
      if (assignedError) throw assignedError

      const assignedIds = new Set((assigned ?? []).map((row) => row.provider_id))

      const { data: providers, error: providersError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, postcode')
        .eq('role', 'handy')
        .eq('account_status', 'active')
        .ilike('postcode', `${area.postcode_prefix}%`)

      if (providersError) throw providersError

      const candidateIds = (providers ?? []).map((provider) => provider.user_id)
      const { data: workAreas } = candidateIds.length > 0
        ? await supabase.from('professional_work_areas').select('user_id').in('user_id', candidateIds)
        : { data: [] as Array<{ user_id: string }> }

      const workAreaSet = new Set((workAreas ?? []).map((row) => row.user_id))

      return (providers ?? [])
        .filter((provider) => !assignedIds.has(provider.user_id))
        .map((provider) => ({
          providerId: provider.user_id,
          providerName: `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Unknown provider',
          postcode: provider.postcode || null,
          hasWorkArea: workAreaSet.has(provider.user_id),
        }))
    },
    enabled: !!serviceAreaId,
    staleTime: 20 * 1000,
  })
}

export function useSaveServiceArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      city,
      postcodePrefix,
      enabled,
      notes,
    }: {
      id?: string
      city: string
      postcodePrefix: string
      enabled: boolean
      notes?: string
    }) => {
      await requireAdminPermission('locations.manage')
      const { user } = await requireActiveAdmin()

      const payload = {
        city,
        postcode_prefix: postcodePrefix.toUpperCase().trim(),
        enabled,
        notes: notes?.trim() || null,
      }

      if (id) {
        const { error } = await supabase.from('service_areas').update(payload).eq('id', id)
        if (error) throw error
        await createAdminAuditLog({
          action: 'service_area.update',
          entityType: 'service_area',
          entityId: id,
          summary: `Updated service area ${city} ${postcodePrefix.toUpperCase()}`,
          metadata: { userId: user.id, ...payload },
        })
        return id
      }

      const { data, error } = await supabase.from('service_areas').insert(payload).select('id').single()
      if (error) throw error
      await createAdminAuditLog({
        action: 'service_area.create',
        entityType: 'service_area',
        entityId: data.id,
        summary: `Created service area ${city} ${postcodePrefix.toUpperCase()}`,
        metadata: payload,
      })
      return data.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-areas'] })
    },
  })
}

export function useAssignProviderToServiceArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ serviceAreaId, providerId }: { serviceAreaId: string; providerId: string }) => {
      const { user } = await requireActiveAdmin()
      await requireAdminPermission('locations.manage')

      const { error } = await supabase.from('provider_service_areas').insert({
        service_area_id: serviceAreaId,
        provider_id: providerId,
        assigned_by: user.id,
      })

      if (error) throw error

      await createAdminAuditLog({
        action: 'service_area.assign_provider',
        entityType: 'service_area',
        entityId: serviceAreaId,
        summary: `Assigned provider ${providerId} to service area ${serviceAreaId}`,
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-area-assignments', variables.serviceAreaId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'provider-candidates', variables.serviceAreaId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-areas'] })
    },
  })
}

export function useRemoveProviderFromServiceArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      assignmentId,
      serviceAreaId,
      providerId,
    }: {
      assignmentId: string
      serviceAreaId: string
      providerId: string
    }) => {
      await requireAdminPermission('locations.manage')
      const { error } = await supabase.from('provider_service_areas').delete().eq('id', assignmentId)
      if (error) throw error

      await createAdminAuditLog({
        action: 'service_area.unassign_provider',
        entityType: 'service_area',
        entityId: serviceAreaId,
        summary: `Removed provider ${providerId} from service area ${serviceAreaId}`,
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-area-assignments', variables.serviceAreaId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'provider-candidates', variables.serviceAreaId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-areas'] })
    },
  })
}
