import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
}

export interface CreateCategoryInput {
  name: string
  description?: string
  icon_url?: string
}

export interface UpdateCategoryInput {
  categoryId: string
  name?: string
  description?: string
  icon_url?: string
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
        .order('name', { ascending: true })

      // Apply search filter
      if (filters.search) {
        const searchTerm = `%${filters.search}%`
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
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
      const insertData: CategoryInsert = {
        name: input.name,
        description: input.description || null,
        icon_url: input.icon_url || null,
      }

      const { data, error } = await supabase.from('categories').insert(insertData).select().single()

      if (error) throw error

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
      const updateData: CategoryUpdate = {}

      if (input.name !== undefined) updateData.name = input.name
      if (input.description !== undefined) updateData.description = input.description
      if (input.icon_url !== undefined) updateData.icon_url = input.icon_url

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', input.categoryId)
        .select()
        .single()

      if (error) throw error

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
      const { error } = await supabase.from('categories').delete().eq('id', categoryId)

      if (error) throw error

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
      const { error } = await supabase.from('categories').delete().in('id', categoryIds)

      if (error) throw error

      return categoryIds
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
