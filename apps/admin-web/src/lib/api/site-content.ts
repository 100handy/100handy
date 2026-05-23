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

export interface SitePageRecord {
  id: string
  page_key: string
  title: string
  slug: string
  template_key: string
  status: 'draft' | 'published' | 'archived'
  is_system: boolean
  created_at: string
  updated_at: string
  updated_by: string | null
}

export interface SeoMetadataRecord {
  id: string
  surface_type: 'page' | 'blog_post' | 'service_category' | 'service_subcategory' | 'location_page' | 'location_service_page' | 'app_screen'
  surface_key: string
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image_url: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
  schema_json: Record<string, unknown> | null
  created_at: string
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

export function usePageRecord(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'site-pages', pageKey],
    queryFn: async (): Promise<SitePageRecord | null> => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!pageKey,
  })
}

export function usePageSeo(pageKey: string) {
  return useQuery({
    queryKey: ['admin', 'seo-metadata', 'page', pageKey],
    queryFn: async (): Promise<SeoMetadataRecord | null> => {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('surface_type', 'page')
        .eq('surface_key', pageKey)
        .maybeSingle()

      if (error) throw error
      return data
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

interface SavePageSettingsParams {
  pageKey: string
  page: {
    title: string
    slug: string
    template_key: string
    status: 'draft' | 'published' | 'archived'
  }
  seo: {
    meta_title: string
    meta_description: string
    og_title: string
    og_description: string
    og_image_url: string
    twitter_title: string
    twitter_description: string
    twitter_image_url: string
    canonical_url: string
    robots_index: boolean
    robots_follow: boolean
  }
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

      const { data: existingRows, error: existingError } = await supabase
        .from('site_content')
        .select('section_key, field_key')
        .eq('page_key', pageKey)

      if (existingError) throw existingError

      const existingKeys = new Set(
        (existingRows ?? []).map((row) => `${row.section_key}.${row.field_key}`)
      )

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

      const fieldsToDelete = fields.filter((field) => (
        field.value.trim() === '' &&
        existingKeys.has(`${field.section_key}.${field.field_key}`)
      ))

      if (rows.length > 0) {
        const { error } = await supabase
          .from('site_content')
          .upsert(rows, { onConflict: 'page_key,section_key,field_key' })

        if (error) throw error
      }

      for (const field of fieldsToDelete) {
        const { error } = await supabase
          .from('site_content')
          .delete()
          .eq('page_key', pageKey)
          .eq('section_key', field.section_key)
          .eq('field_key', field.field_key)

        if (error) throw error
      }
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-content', 'last-updated'] })
    },
  })
}

export function useSavePageSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageKey, page, seo }: SavePageSettingsParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const normalizedSlug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`
      const normalizedCanonical = seo.canonical_url.trim()

      const pageRow = {
        page_key: pageKey,
        title: page.title.trim(),
        slug: normalizedSlug,
        template_key: page.template_key.trim() || 'standard',
        status: page.status,
        updated_by: user.id,
      }

      const { error: pageError } = await supabase
        .from('site_pages')
        .upsert(pageRow, { onConflict: 'page_key' })

      if (pageError) throw pageError

      const seoRow = {
        surface_type: 'page' as const,
        surface_key: pageKey,
        meta_title: seo.meta_title.trim() || null,
        meta_description: seo.meta_description.trim() || null,
        og_title: seo.og_title.trim() || null,
        og_description: seo.og_description.trim() || null,
        og_image_url: seo.og_image_url.trim() || null,
        twitter_title: seo.twitter_title.trim() || null,
        twitter_description: seo.twitter_description.trim() || null,
        twitter_image_url: seo.twitter_image_url.trim() || null,
        canonical_url: normalizedCanonical ? normalizedCanonical : null,
        robots_index: seo.robots_index,
        robots_follow: seo.robots_follow,
        updated_by: user.id,
      }

      const hasSeoValues = Object.entries(seoRow).some(([key, value]) => {
        if (['surface_type', 'surface_key', 'updated_by', 'robots_index', 'robots_follow'].includes(key)) {
          return false
        }
        return value !== null && value !== ''
      })

      if (hasSeoValues || !seo.robots_index || !seo.robots_follow) {
        const { error: seoError } = await supabase
          .from('seo_metadata')
          .upsert(seoRow, { onConflict: 'surface_type,surface_key' })

        if (seoError) throw seoError
      } else {
        const { error: deleteError } = await supabase
          .from('seo_metadata')
          .delete()
          .eq('surface_type', 'page')
          .eq('surface_key', pageKey)

        if (deleteError) throw deleteError
      }
    },
    onSuccess: (_, { pageKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-pages', pageKey] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo-metadata', 'page', pageKey] })
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
