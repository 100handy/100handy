import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

/**
 * Categories API Hooks
 *
 * Hooks for managing service categories in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export interface CategoryWithStats extends Category {
  tasks_count: number
}

export interface CategoryFilters {
  search?: string
  limit?: number
  offset?: number
  level?: number
}

export interface CreateCategoryInput {
  name: string
  description?: string
  icon_url?: string
  parent_id?: string | null
  display_order?: number
  route_slug?: string
  marketing_title?: string
  marketing_description?: string
  active?: boolean
  supports_recurring?: boolean
  long_description?: string
  hero_image_url?: string
  content_image_url?: string
  benefits_json?: Array<{ title: string; description: string }>
  tasks_json?: Array<{ title: string; description: string }>
  faqs_json?: Array<{ question: string; answer: string }>
}

export interface UpdateCategoryInput {
  categoryId: string
  name?: string
  description?: string
  icon_url?: string
  parent_id?: string | null
  display_order?: number
  route_slug?: string | null
  marketing_title?: string | null
  marketing_description?: string | null
  active?: boolean
  supports_recurring?: boolean
  long_description?: string | null
  hero_image_url?: string | null
  content_image_url?: string | null
  benefits_json?: Array<{ title: string; description: string }>
  tasks_json?: Array<{ title: string; description: string }>
  faqs_json?: Array<{ question: string; answer: string }>
}

export interface CategoryAreaCoverageCell {
  serviceAreaId: string
  city: string
  postcodePrefix: string
  providerCount: number
  explicitlyEnabled: boolean
  hasOverride: boolean
  enabledInArea: boolean
}

export interface CategoryAreaCoverageRow {
  categoryId: string
  categoryName: string
  active: boolean
  cells: CategoryAreaCoverageCell[]
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch list of categories with task counts
 */
export function useCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: async (): Promise<CategoryWithStats[]> => {
      let query = supabase
        .from('categories')
        .select(
          `
          *,
          bookings:bookings(id)
        `
        )
        .order('level', { ascending: true })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })

      // Apply search filter
      if (filters.search) {
        const searchTerm = `%${filters.search}%`
        query = query.or(
          `name.ilike.${searchTerm},description.ilike.${searchTerm},marketing_title.ilike.${searchTerm},marketing_description.ilike.${searchTerm},route_slug.ilike.${searchTerm}`
        )
      }

      if (filters.level !== undefined) {
        query = query.eq('level', filters.level)
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

      // Transform data to include task counts
      return (data || []).map((category) => ({
        ...category,
        tasks_count: Array.isArray(category.bookings) ? category.bookings.length : 0,
        bookings: undefined, // Remove the raw bookings array
      })) as CategoryWithStats[]
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Fetch single category by ID
 */
export function useCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: async (): Promise<CategoryWithStats | null> => {
      if (!categoryId) return null

      const { data, error } = await supabase
        .from('categories')
        .select(
          `
          *,
          bookings:bookings(id)
        `
        )
        .eq('id', categoryId)
        .single()

      if (error) throw error

      return {
        ...data,
        tasks_count: Array.isArray(data.bookings) ? data.bookings.length : 0,
        bookings: undefined,
      } as CategoryWithStats
    },
    enabled: !!categoryId,
    staleTime: 60 * 1000,
  })
}

/**
 * Get total categories count
 */
export function useCategoriesCount() {
  return useQuery({
    queryKey: ['categories', 'count'],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('categories')
        .select('id', { count: 'exact', head: true })

      if (error) throw error

      return count || 0
    },
    staleTime: 60 * 1000,
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      await requireAdminPermission('tasks.manage')
      const insertData: CategoryInsert = {
        name: input.name,
        description: input.description || null,
        icon_url: input.icon_url || null,
        parent_id: input.parent_id ?? null,
        level: input.parent_id ? 1 : 0,
        display_order: input.display_order ?? 0,
        route_slug: input.route_slug || null,
        marketing_title: input.marketing_title || null,
        marketing_description: input.marketing_description || null,
        active: input.active ?? true,
        supports_recurring: input.supports_recurring ?? false,
        long_description: input.long_description || null,
        hero_image_url: input.hero_image_url || null,
        content_image_url: input.content_image_url || null,
        benefits_json: input.benefits_json || [],
        tasks_json: input.tasks_json || [],
        faqs_json: input.faqs_json || [],
      }

      const { data, error } = await supabase.from('categories').insert(insertData).select().single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.create',
        targetType: 'category',
        targetId: data.id,
        summary: `Created category ${data.name}`,
        section: 'tasks',
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

/**
 * Update category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateCategoryInput) => {
      await requireAdminPermission('tasks.manage')
      const updateData: CategoryUpdate = {}

      if (input.name !== undefined) updateData.name = input.name
      if (input.description !== undefined) updateData.description = input.description
      if (input.icon_url !== undefined) updateData.icon_url = input.icon_url
      if (input.parent_id !== undefined) {
        updateData.parent_id = input.parent_id
        updateData.level = input.parent_id ? 1 : 0
      }
      if (input.display_order !== undefined) updateData.display_order = input.display_order
      if (input.route_slug !== undefined) updateData.route_slug = input.route_slug
      if (input.marketing_title !== undefined) updateData.marketing_title = input.marketing_title
      if (input.marketing_description !== undefined) {
        updateData.marketing_description = input.marketing_description
      }
      if (input.active !== undefined) updateData.active = input.active
      if (input.supports_recurring !== undefined) {
        updateData.supports_recurring = input.supports_recurring
      }
      if (input.long_description !== undefined) updateData.long_description = input.long_description
      if (input.hero_image_url !== undefined) updateData.hero_image_url = input.hero_image_url
      if (input.content_image_url !== undefined) {
        updateData.content_image_url = input.content_image_url
      }
      if (input.benefits_json !== undefined) updateData.benefits_json = input.benefits_json
      if (input.tasks_json !== undefined) updateData.tasks_json = input.tasks_json
      if (input.faqs_json !== undefined) updateData.faqs_json = input.faqs_json

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', input.categoryId)
        .select()
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.update',
        targetType: 'category',
        targetId: data.id,
        summary: `Updated category ${data.name}`,
        section: 'tasks',
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useBulkUpdateCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      categoryIds,
      updates,
    }: {
      categoryIds: string[]
      updates: Pick<CategoryUpdate, 'active'>
    }) => {
      await requireAdminPermission('tasks.manage')

      if (categoryIds.length === 0) {
        throw new Error('Select at least one category')
      }

      const { error } = await supabase
        .from('categories')
        .update(updates)
        .in('id', categoryIds)

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.bulk_update',
        targetType: 'category',
        targetId: categoryIds.length === 1 ? categoryIds[0] : null,
        summary: `Updated ${categoryIds.length} categories`,
        detail: updates.active === undefined ? null : `active=${updates.active}`,
        section: 'tasks',
      })

      return { categoryIds, updates }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useCategoryAreaCoverageMatrix() {
  return useQuery({
    queryKey: ['categories', 'coverage-matrix'],
    queryFn: async (): Promise<{ serviceAreas: Array<{ id: string; city: string; postcode_prefix: string }>; rows: CategoryAreaCoverageRow[] }> => {
      await requireAdminPermission('tasks.manage')

      const [
        { data: categories, error: categoriesError },
        { data: serviceAreas, error: serviceAreasError },
        { data: assignments, error: assignmentsError },
        { data: overrides, error: overridesError },
      ] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name, active, level')
          .in('level', [0, 1])
          .order('level', { ascending: true })
          .order('display_order', { ascending: true }),
        supabase
          .from('service_areas')
          .select('id, city, postcode_prefix')
          .eq('enabled', true)
          .order('city', { ascending: true })
          .limit(12),
        supabase
          .from('provider_service_areas')
          .select('service_area_id, provider_id'),
        supabase
          .from('service_area_category_overrides')
          .select('service_area_id, category_id, enabled'),
      ])

      if (categoriesError) throw categoriesError
      if (serviceAreasError) throw serviceAreasError
      if (assignmentsError) throw assignmentsError
      if (overridesError) throw overridesError

      const providerIds = Array.from(new Set((assignments ?? []).map((row) => row.provider_id)))

      const [
        { data: activeProfiles, error: profilesError },
        { data: handyCategories, error: handyCategoriesError },
      ] = await Promise.all([
        providerIds.length > 0
          ? supabase
            .from('profiles')
            .select('user_id')
            .in('user_id', providerIds)
            .eq('role', 'handy')
            .eq('account_status', 'active')
          : Promise.resolve({ data: [], error: null }),
        providerIds.length > 0
          ? supabase
            .from('handy_categories')
            .select('handy_id, category_id')
            .in('handy_id', providerIds)
          : Promise.resolve({ data: [], error: null }),
      ])

      if (profilesError) throw profilesError
      if (handyCategoriesError) throw handyCategoriesError

      const activeProviderIds = new Set((activeProfiles ?? []).map((profile) => profile.user_id))
      const providerIdsByArea = new Map<string, Set<string>>()
      for (const assignment of assignments ?? []) {
        if (!activeProviderIds.has(assignment.provider_id)) continue
        const set = providerIdsByArea.get(assignment.service_area_id) || new Set<string>()
        set.add(assignment.provider_id)
        providerIdsByArea.set(assignment.service_area_id, set)
      }

      const categoryIdsByProvider = new Map<string, Set<string>>()
      for (const row of handyCategories ?? []) {
        const set = categoryIdsByProvider.get(row.handy_id) || new Set<string>()
        set.add(row.category_id)
        categoryIdsByProvider.set(row.handy_id, set)
      }

      const overrideMap = new Map<string, boolean>()
      for (const row of overrides ?? []) {
        overrideMap.set(`${row.service_area_id}:${row.category_id}`, row.enabled)
      }

      const rows: CategoryAreaCoverageRow[] = (categories ?? []).map((category) => ({
        categoryId: category.id,
        categoryName: category.name,
        active: category.active,
        cells: (serviceAreas ?? []).map((area) => {
          const providers = providerIdsByArea.get(area.id) || new Set<string>()
          let providerCount = 0
          for (const providerId of providers) {
            if (categoryIdsByProvider.get(providerId)?.has(category.id)) {
              providerCount += 1
            }
          }
          const overrideKey = `${area.id}:${category.id}`
          const hasOverride = overrideMap.has(overrideKey)
          const explicitlyEnabled = overrideMap.get(overrideKey) ?? false
          return {
            serviceAreaId: area.id,
            city: area.city,
            postcodePrefix: area.postcode_prefix,
            providerCount,
            explicitlyEnabled,
            hasOverride,
            enabledInArea: category.active && (!hasOverride || explicitlyEnabled),
          }
        }),
      }))

      return {
        serviceAreas: serviceAreas ?? [],
        rows,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveServiceAreaCategoryOverride() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      serviceAreaId,
      categoryId,
      enabled,
    }: {
      serviceAreaId: string
      categoryId: string
      enabled: boolean
    }) => {
      await requireAdminPermission('tasks.manage')

      const { error } = await supabase
        .from('service_area_category_overrides')
        .upsert(
          {
            service_area_id: serviceAreaId,
            category_id: categoryId,
            enabled,
          },
          { onConflict: 'service_area_id,category_id' },
        )

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.area_override',
        targetType: 'category',
        targetId: categoryId,
        summary: `${enabled ? 'Enabled' : 'Disabled'} category override for area ${serviceAreaId}`,
        detail: `category=${categoryId}`,
        section: 'tasks',
      })

      return { serviceAreaId, categoryId, enabled }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', 'coverage-matrix'] })
    },
  })
}

/**
 * Delete single category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await requireAdminPermission('tasks.manage')

      const { data: existing, error: existingError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', categoryId)
        .single()

      if (existingError) throw existingError

      const { error } = await supabase.from('categories').delete().eq('id', categoryId)

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.delete',
        targetType: 'category',
        targetId: categoryId,
        summary: `Deleted category ${existing.name}`,
        section: 'tasks',
      })

      return categoryId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

/**
 * Delete multiple categories in batch
 */
export function useDeleteCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryIds: string[]) => {
      await requireAdminPermission('tasks.manage')

      const { error } = await supabase.from('categories').delete().in('id', categoryIds)

      if (error) throw error

      await createAdminAuditLog({
        action: 'category.bulk_delete',
        targetType: 'category',
        targetId: categoryIds.length === 1 ? categoryIds[0] : null,
        summary: `Deleted ${categoryIds.length} categories`,
        section: 'tasks',
      })

      return categoryIds
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
