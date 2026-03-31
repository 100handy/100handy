import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { FieldType } from '@/lib/cms/page-registry'

export interface SiteContentRow {
  id: string
  page_key: string
  section_key: string
  field_key: string
  content_type: string
  value: string
  updated_at: string
  updated_by: string | null
}

/**
 * Fetch all content for a given page.
 * Returns a map of "section_key.field_key" -> value
 */
export function usePageContent(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-content', pageKey],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase
        .from('site_content')
        .select('section_key, field_key, value')
        .eq('page_key', pageKey)

      if (error) throw error

      const content: Record<string, string> = {}
      for (const row of data ?? []) {
        content[`${row.section_key}.${row.field_key}`] = row.value
      }
      return content
    },
    enabled: !!pageKey,
  })
}

/**
 * Fetch the last updated timestamp for each page (for the page list)
 */
export function useAllPagesLastUpdated() {
  return useQuery({
    queryKey: ['admin', 'site-content', 'last-updated'],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase
        .from('site_content')
        .select('page_key, updated_at')
        .order('updated_at', { ascending: false })

      if (error) throw error

      const lastUpdated: Record<string, string> = {}
      for (const row of data ?? []) {
        if (!lastUpdated[row.page_key]) {
          lastUpdated[row.page_key] = row.updated_at
        }
      }
      return lastUpdated
    },
  })
}

interface SaveContentParams {
  pageKey: string
  fields: Array<{
    section_key: string
    field_key: string
    content_type: FieldType
    value: string
  }>
}

/**
 * Save (upsert) all content fields for a page
 */
export function useSavePageContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, fields }: SaveContentParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const rows = fields
        .filter((f) => f.value.trim() !== '')
        .map((f) => ({
          page_key: pageKey,
          section_key: f.section_key,
          field_key: f.field_key,
          content_type: f.content_type,
          value: f.value,
          updated_by: user.id,
        }))

      if (rows.length === 0) return

      const { error } = await supabase
        .from('site_content')
        .upsert(rows, { onConflict: 'page_key,section_key,field_key' })

      if (error) throw error
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
    },
  })
}

/**
 * Upload an image to the site-content-images bucket.
 * Returns the public URL.
 */
export async function uploadContentImage(file: File, pageKey: string, fieldKey: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${pageKey}/${fieldKey}-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('site-content-images')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('site-content-images')
    .getPublicUrl(path)

  return data.publicUrl
}
