import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface ServiceAreaItem {
  id: string
  city: string
  postcodePrefix: string
  locationAreaId: string | null
  enabled: boolean
  notes: string | null
  assignedProviders: number
}

export interface LocationAreaNode {
  id: string
  name: string
  slug: string
  areaType: 'country' | 'nation' | 'region' | 'city' | 'postcode_area' | 'postcode_district'
  parentId: string | null
  countryCode: string
  enabled: boolean
  sortOrder: number
  notes: string | null
  childCount: number
  linkedServiceAreas: number
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

export interface ServiceAreaOverlapWarning {
  id: string
  city: string
  postcodePrefix: string
  enabled: boolean
  reason: string
}

export interface CoverageNationSummary {
  id: string
  name: string
  enabled: boolean
  childAreas: number
  enabledChildAreas: number
  linkedServiceAreas: number
}

async function loadLocationAreaRows() {
  const { data, error } = await supabase
    .from('location_areas')
    .select('id, name, slug, area_type, parent_id, country_code, enabled, sort_order, notes')

  if (error) throw error
  return data ?? []
}

function isDescendant(targetId: string, candidateParentId: string | null, parentMap: Map<string, string | null>) {
  let current = candidateParentId
  while (current) {
    if (current === targetId) return true
    current = parentMap.get(current) ?? null
  }
  return false
}

export function useServiceAreas() {
  return useQuery({
    queryKey: ['admin', 'service-areas'],
    queryFn: async (): Promise<ServiceAreaItem[]> => {
      await requireAdminPermission('locations.manage')

      const { data: areas, error } = await supabase
        .from('service_areas')
        .select('id, city, postcode_prefix, location_area_id, enabled, notes')
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
        locationAreaId: area.location_area_id,
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
      locationAreaId,
    }: {
      id?: string
      city: string
      postcodePrefix: string
      enabled: boolean
      notes?: string
      locationAreaId?: string | null
    }) => {
      await requireAdminPermission('locations.manage')
      const { user } = await requireActiveAdmin()

      const payload = {
        city,
        postcode_prefix: postcodePrefix.toUpperCase().trim(),
        location_area_id: locationAreaId ?? null,
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-areas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-coverage-summary'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-map-data'] })
    },
  })
}

export function useServiceAreaOverlapCheck(
  postcodePrefix: string,
  currentId?: string | null,
) {
  return useQuery({
    queryKey: ['admin', 'service-area-overlap-check', postcodePrefix, currentId],
    queryFn: async (): Promise<ServiceAreaOverlapWarning[]> => {
      await requireAdminPermission('locations.manage')

      const normalized = postcodePrefix.trim().toUpperCase()
      if (!normalized) return []

      const { data, error } = await supabase
        .from('service_areas')
        .select('id, city, postcode_prefix, enabled')

      if (error) throw error

      return (data ?? [])
        .filter((row) => row.id !== currentId)
        .filter((row) => {
          const existing = row.postcode_prefix.toUpperCase()
          return existing.startsWith(normalized) || normalized.startsWith(existing)
        })
        .map((row) => ({
          id: row.id,
          city: row.city,
          postcodePrefix: row.postcode_prefix,
          enabled: row.enabled,
          reason:
            row.postcode_prefix.toUpperCase() === normalized
              ? 'Exact duplicate prefix'
              : row.postcode_prefix.toUpperCase().startsWith(normalized)
                ? `Existing area ${row.postcode_prefix} sits inside this broader prefix`
                : `This prefix sits inside existing area ${row.postcode_prefix}`,
        }))
    },
    enabled: postcodePrefix.trim().length > 0,
    staleTime: 10 * 1000,
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

export function useLocationAreas() {
  return useQuery({
    queryKey: ['admin', 'location-areas'],
    queryFn: async (): Promise<LocationAreaNode[]> => {
      await requireAdminPermission('locations.manage')

      const [{ data: areas, error: areasError }, { data: serviceAreas, error: serviceAreasError }] = await Promise.all([
        supabase
          .from('location_areas')
          .select('id, name, slug, area_type, parent_id, country_code, enabled, sort_order, notes')
          .order('sort_order', { ascending: true }),
        supabase
          .from('service_areas')
          .select('id, location_area_id'),
      ])

      if (areasError) throw areasError
      if (serviceAreasError) throw serviceAreasError

      const childCounts = new Map<string, number>()
      for (const area of areas ?? []) {
        if (area.parent_id) {
          childCounts.set(area.parent_id, (childCounts.get(area.parent_id) || 0) + 1)
        }
      }

      const serviceAreaCounts = new Map<string, number>()
      for (const serviceArea of serviceAreas ?? []) {
        if (serviceArea.location_area_id) {
          serviceAreaCounts.set(serviceArea.location_area_id, (serviceAreaCounts.get(serviceArea.location_area_id) || 0) + 1)
        }
      }

      return (areas ?? []).map((area) => ({
        id: area.id,
        name: area.name,
        slug: area.slug,
        areaType: area.area_type,
        parentId: area.parent_id,
        countryCode: area.country_code,
        enabled: area.enabled,
        sortOrder: area.sort_order,
        notes: area.notes,
        childCount: childCounts.get(area.id) || 0,
        linkedServiceAreas: serviceAreaCounts.get(area.id) || 0,
      }))
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveLocationArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      name,
      slug,
      areaType,
      parentId,
      enabled,
      sortOrder,
      notes,
    }: {
      id?: string
      name: string
      slug: string
      areaType: LocationAreaNode['areaType']
      parentId?: string | null
      enabled: boolean
      sortOrder?: number
      notes?: string
    }) => {
      await requireAdminPermission('locations.manage')
      const existingAreas = await loadLocationAreaRows()
      const parentMap = new Map(existingAreas.map((area) => [area.id, area.parent_id]))

      if (id && parentId === id) {
        throw new Error('A location area cannot be its own parent')
      }

      if (id && isDescendant(id, parentId ?? null, parentMap)) {
        throw new Error('A location area cannot be moved under one of its own descendants')
      }

      if (areaType === 'country' && parentId) {
        throw new Error('Country areas cannot have a parent')
      }

      const parent = parentId ? existingAreas.find((area) => area.id === parentId) : null
      const allowedParents: Record<LocationAreaNode['areaType'], Array<LocationAreaNode['areaType']>> = {
        country: [],
        nation: ['country'],
        region: ['nation'],
        city: ['region', 'nation'],
        postcode_area: ['city', 'region', 'nation'],
        postcode_district: ['postcode_area', 'city'],
      }

      if (parent && !allowedParents[areaType].includes(parent.area_type as LocationAreaNode['areaType'])) {
        throw new Error(`A ${areaType.replace('_', ' ')} must sit under ${allowedParents[areaType].join(' or ')}`)
      }

      const duplicate = existingAreas.find((area) => area.id !== id && area.parent_id === (parentId ?? null) && area.slug === slug.trim())
      if (duplicate) {
        throw new Error('A sibling location area with this slug already exists')
      }

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        area_type: areaType,
        parent_id: parentId ?? null,
        enabled,
        sort_order: sortOrder ?? 0,
        notes: notes?.trim() || null,
      }

      if (id) {
        const { error } = await supabase.from('location_areas').update(payload).eq('id', id)
        if (error) throw error
        await createAdminAuditLog({
          action: 'location_area.update',
          entityType: 'location_area',
          entityId: id,
          summary: `Updated location area ${name}`,
          metadata: payload,
        })
        return id
      }

      const { data, error } = await supabase.from('location_areas').insert(payload).select('id').single()
      if (error) throw error
      await createAdminAuditLog({
        action: 'location_area.create',
        entityType: 'location_area',
        entityId: data.id,
        summary: `Created location area ${name}`,
        metadata: payload,
      })
      return data.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-areas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-coverage-summary'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-map-data'] })
    },
  })
}

export function useToggleLocationArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      enabled,
    }: {
      id: string
      enabled: boolean
    }) => {
      await requireAdminPermission('locations.manage')

      const { error } = await supabase.from('location_areas').update({ enabled }).eq('id', id)
      if (error) throw error

      await createAdminAuditLog({
        action: enabled ? 'location_area.enable' : 'location_area.disable',
        entityType: 'location_area',
        entityId: id,
        summary: `${enabled ? 'Enabled' : 'Disabled'} location area ${id}`,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-areas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-coverage-summary'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-map-data'] })
    },
  })
}

export function useLocationCoverageSummary() {
  return useQuery({
    queryKey: ['admin', 'location-coverage-summary'],
    queryFn: async (): Promise<CoverageNationSummary[]> => {
      await requireAdminPermission('locations.manage')

      const { data: areas, error } = await supabase
        .from('location_areas')
        .select('id, name, area_type, parent_id, enabled')

      if (error) throw error

      const { data: serviceAreas, error: serviceAreaError } = await supabase
        .from('service_areas')
        .select('location_area_id')

      if (serviceAreaError) throw serviceAreaError

      const nations = (areas ?? []).filter((area) => area.area_type === 'nation')
      const byParent = new Map<string, Array<(typeof areas)[number]>>()
      for (const area of areas ?? []) {
        if (!area.parent_id) continue
        byParent.set(area.parent_id, [...(byParent.get(area.parent_id) || []), area])
      }

      const serviceAreaCounts = new Map<string, number>()
      for (const row of serviceAreas ?? []) {
        if (!row.location_area_id) continue
        serviceAreaCounts.set(row.location_area_id, (serviceAreaCounts.get(row.location_area_id) || 0) + 1)
      }

      const collectDescendants = (id: string): Array<(typeof areas)[number]> => {
        const children = byParent.get(id) || []
        return children.flatMap((child) => [child, ...collectDescendants(child.id)])
      }

      return nations.map((nation) => {
        const descendants = collectDescendants(nation.id)
        const childAreas = descendants.length
        const enabledChildAreas = descendants.filter((child) => child.enabled).length
        const linkedServiceAreas = descendants.reduce((sum, child) => sum + (serviceAreaCounts.get(child.id) || 0), 0)
        return {
          id: nation.id,
          name: nation.name,
          enabled: nation.enabled,
          childAreas,
          enabledChildAreas,
          linkedServiceAreas,
        }
      })
    },
    staleTime: 30 * 1000,
  })
}

export function useLocationMapData() {
  return useQuery({
    queryKey: ['admin', 'location-map-data'],
    queryFn: async () => {
      await requireAdminPermission('locations.manage')

      const [areas, serviceAreas] = await Promise.all([
        loadLocationAreaRows(),
        supabase.from('service_areas').select('location_area_id, enabled'),
      ])

      if (serviceAreas.error) throw serviceAreas.error

      const serviceAreaCounts = new Map<string, number>()
      const enabledServiceAreaCounts = new Map<string, number>()
      for (const row of serviceAreas.data ?? []) {
        if (!row.location_area_id) continue
        serviceAreaCounts.set(row.location_area_id, (serviceAreaCounts.get(row.location_area_id) || 0) + 1)
        if (row.enabled) {
          enabledServiceAreaCounts.set(row.location_area_id, (enabledServiceAreaCounts.get(row.location_area_id) || 0) + 1)
        }
      }

      const majorNodes = [
        'loc_eng',
        'loc_sco',
        'loc_wal',
        'loc_ni',
        'loc_london_region',
        'loc_nw',
        'loc_yh',
        'loc_wm',
        'loc_se',
        'loc_sw',
      ]

      return majorNodes
        .map((id) => {
          const area = areas.find((item) => item.id === id)
          if (!area) return null
          return {
            id: area.id,
            name: area.name,
            areaType: area.area_type,
            enabled: area.enabled,
            serviceAreas: serviceAreaCounts.get(area.id) || 0,
            enabledServiceAreas: enabledServiceAreaCounts.get(area.id) || 0,
          }
        })
        .filter(Boolean)
    },
    staleTime: 30 * 1000,
  })
}

export function useBulkImportLocationAreas() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      rows,
      areaType,
      parentId,
    }: {
      rows: Array<{ name: string; slug: string; notes?: string | null; sortOrder?: number }>
      areaType: LocationAreaNode['areaType']
      parentId: string
    }) => {
      await requireAdminPermission('locations.manage')
      if (!parentId) {
        throw new Error('A parent location area is required for bulk import')
      }

      const existingAreas = await loadLocationAreaRows()
      const parent = existingAreas.find((area) => area.id === parentId)
      if (!parent) {
        throw new Error('Selected parent location area no longer exists')
      }

      const allowedParents: Record<LocationAreaNode['areaType'], Array<LocationAreaNode['areaType']>> = {
        country: [],
        nation: ['country'],
        region: ['nation'],
        city: ['region', 'nation'],
        postcode_area: ['city', 'region', 'nation'],
        postcode_district: ['postcode_area', 'city'],
      }

      if (!allowedParents[areaType].includes(parent.area_type as LocationAreaNode['areaType'])) {
        throw new Error(`Bulk import of ${areaType.replace('_', ' ')} rows is not allowed under ${parent.area_type}`)
      }

      const siblingSlugSet = new Set(
        existingAreas
          .filter((area) => area.parent_id === parentId)
          .map((area) => area.slug),
      )

      const payload = rows
        .map((row, index) => {
          const slug = row.slug.trim()
          if (!row.name.trim() || !slug) return null
          if (siblingSlugSet.has(slug)) return null
          siblingSlugSet.add(slug)
          return {
            name: row.name.trim(),
            slug,
            area_type: areaType,
            parent_id: parentId,
            enabled: true,
            sort_order: row.sortOrder ?? index + 1,
            notes: row.notes?.trim() || null,
          }
        })
        .filter(Boolean)

      if (payload.length === 0) {
        throw new Error('No valid rows to import')
      }

      const { error } = await supabase.from('location_areas').insert(payload)
      if (error) throw error

      await createAdminAuditLog({
        action: 'location_area.bulk_import',
        entityType: 'location_area',
        entityId: parentId,
        summary: `Imported ${payload.length} ${areaType.replace('_', ' ')} rows under ${parentId}`,
        metadata: { count: payload.length, areaType, parentId },
      })

      return payload.length
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-areas'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-coverage-summary'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'location-map-data'] })
    },
  })
}
