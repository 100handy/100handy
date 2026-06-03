import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type RolloutPresetRow = Database['public']['Tables']['rollout_presets']['Row']
type RolloutPresetInsert = Database['public']['Tables']['rollout_presets']['Insert']

export type RolloutPresetStatus = RolloutPresetRow['status']

export interface RolloutCategoryState {
  categoryId: string
  categoryName: string
  level: number
  active: boolean
}

export interface RolloutServiceAreaState {
  serviceAreaId: string
  city: string
  postcodePrefix: string
  enabled: boolean
}

export interface RolloutAreaCategoryState {
  serviceAreaId: string
  categoryId: string
  enabled: boolean
}

export interface RolloutSnapshot {
  categoryStates: RolloutCategoryState[]
  serviceAreaStates: RolloutServiceAreaState[]
  areaCategoryStates: RolloutAreaCategoryState[]
}

export interface RolloutPreset extends Omit<RolloutPresetRow, 'category_states' | 'service_area_states' | 'area_category_states'>, RolloutSnapshot {}

function parseRolloutPreset(row: RolloutPresetRow): RolloutPreset {
  return {
    ...row,
    categoryStates: (row.category_states as RolloutCategoryState[]) ?? [],
    serviceAreaStates: (row.service_area_states as RolloutServiceAreaState[]) ?? [],
    areaCategoryStates: (row.area_category_states as RolloutAreaCategoryState[]) ?? [],
  }
}

export function useCurrentRolloutSnapshot() {
  return useQuery({
    queryKey: ['rollouts', 'current-snapshot'],
    queryFn: async (): Promise<RolloutSnapshot> => {
      await requireAdminPermission('tasks.manage')

      const [
        { data: categories, error: categoriesError },
        { data: serviceAreas, error: serviceAreasError },
        { data: overrides, error: overridesError },
      ] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name, level, active')
          .in('level', [0, 1])
          .order('level', { ascending: true })
          .order('display_order', { ascending: true })
          .order('name', { ascending: true }),
        supabase
          .from('service_areas')
          .select('id, city, postcode_prefix, enabled')
          .order('city', { ascending: true })
          .order('postcode_prefix', { ascending: true }),
        supabase
          .from('service_area_category_overrides')
          .select('service_area_id, category_id, enabled')
          .order('service_area_id', { ascending: true }),
      ])

      if (categoriesError) throw categoriesError
      if (serviceAreasError) throw serviceAreasError
      if (overridesError) throw overridesError

      return {
        categoryStates: (categories ?? []).map((category) => ({
          categoryId: category.id,
          categoryName: category.name,
          level: category.level,
          active: category.active,
        })),
        serviceAreaStates: (serviceAreas ?? []).map((area) => ({
          serviceAreaId: area.id,
          city: area.city,
          postcodePrefix: area.postcode_prefix,
          enabled: area.enabled,
        })),
        areaCategoryStates: (overrides ?? []).map((row) => ({
          serviceAreaId: row.service_area_id,
          categoryId: row.category_id,
          enabled: row.enabled,
        })),
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useRolloutPresets() {
  return useQuery({
    queryKey: ['rollouts', 'presets'],
    queryFn: async (): Promise<RolloutPreset[]> => {
      await requireAdminPermission('tasks.manage')

      const { data, error } = await supabase
        .from('rollout_presets')
        .select('*')
        .order('rollout_month', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data ?? []).map(parseRolloutPreset)
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveRolloutPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      id?: string
      name: string
      description?: string | null
      rolloutMonth: string
      status: RolloutPresetStatus
      notes?: string | null
      snapshot: RolloutSnapshot
    }) => {
      await requireAdminPermission('tasks.manage')

      const payload: RolloutPresetInsert = {
        name: input.name,
        description: input.description ?? null,
        rollout_month: input.rolloutMonth,
        status: input.status,
        notes: input.notes ?? null,
        category_states: input.snapshot.categoryStates,
        service_area_states: input.snapshot.serviceAreaStates,
        area_category_states: input.snapshot.areaCategoryStates,
      }

      const query = input.id
        ? supabase.from('rollout_presets').update(payload).eq('id', input.id)
        : supabase.from('rollout_presets').insert(payload)

      const { data, error } = await query.select('*').single()
      if (error) throw error

      return parseRolloutPreset(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rollouts'] })
    },
  })
}

export function useApplyRolloutPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preset: RolloutPreset) => {
      await requireAdminPermission('tasks.manage')

      const categoriesToEnable = preset.categoryStates.filter((row) => row.active).map((row) => row.categoryId)
      const categoriesToDisable = preset.categoryStates.filter((row) => !row.active).map((row) => row.categoryId)
      const areasToEnable = preset.serviceAreaStates.filter((row) => row.enabled).map((row) => row.serviceAreaId)
      const areasToDisable = preset.serviceAreaStates.filter((row) => !row.enabled).map((row) => row.serviceAreaId)

      if (categoriesToEnable.length > 0) {
        const { error } = await supabase.from('categories').update({ active: true }).in('id', categoriesToEnable)
        if (error) throw error
      }
      if (categoriesToDisable.length > 0) {
        const { error } = await supabase.from('categories').update({ active: false }).in('id', categoriesToDisable)
        if (error) throw error
      }
      if (areasToEnable.length > 0) {
        const { error } = await supabase.from('service_areas').update({ enabled: true }).in('id', areasToEnable)
        if (error) throw error
      }
      if (areasToDisable.length > 0) {
        const { error } = await supabase.from('service_areas').update({ enabled: false }).in('id', areasToDisable)
        if (error) throw error
      }

      const { error: deleteOverridesError } = await supabase
        .from('service_area_category_overrides')
        .delete()
        .neq('id', '')
      if (deleteOverridesError) throw deleteOverridesError

      if (preset.areaCategoryStates.length > 0) {
        const { error: insertOverridesError } = await supabase
          .from('service_area_category_overrides')
          .insert(
            preset.areaCategoryStates.map((row) => ({
              service_area_id: row.serviceAreaId,
              category_id: row.categoryId,
              enabled: row.enabled,
            })),
          )
        if (insertOverridesError) throw insertOverridesError
      }

      const { data, error } = await supabase
        .from('rollout_presets')
        .update({
          status: 'applied',
          applied_at: new Date().toISOString(),
        })
        .eq('id', preset.id)
        .select('*')
        .single()

      if (error) throw error

      return parseRolloutPreset(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rollouts'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['service-areas'] })
      queryClient.invalidateQueries({ queryKey: ['location-coverage-summary'] })
      queryClient.invalidateQueries({ queryKey: ['categories', 'coverage-matrix'] })
    },
  })
}
