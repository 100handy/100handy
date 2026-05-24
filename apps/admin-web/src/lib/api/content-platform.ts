import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type SeoSurfaceType = 'page' | 'blog_post'

export interface BlogPostInput {
  id?: string
  slug: string
  title: string
  excerpt: string
  body: string
  cover_image_url: string
  category: string
  author_name: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
}

export interface NavigationItemInput {
  id?: string
  nav_key: string
  parent_id: string | null
  label: string
  href: string
  item_type: 'internal' | 'external'
  location: 'header' | 'footer' | 'support' | 'account'
  audience: 'public' | 'client' | 'professional' | 'admin'
  sort_order: number
  visible: boolean
}

export interface SiteSettingInput {
  setting_group: string
  setting_key: string
  value_json: Record<string, unknown>
}

export interface MediaAssetInput {
  id?: string
  asset_key: string
  asset_type: 'image' | 'video' | 'document'
  url: string
  title: string
  alt_text: string
  tags: string[]
  usage_scope: 'shared' | 'web' | 'mobile' | 'admin'
  active: boolean
}

export interface FaqItemInput {
  id?: string
  faq_group: string
  question: string
  answer: string
  sort_order: number
  visible: boolean
}

export interface EmailTemplateInput {
  id?: string
  template_key: string
  title: string
  template_kind: 'template' | 'campaign_draft'
  recipient_group: string
  subject: string
  preview_text: string
  body: string
  active: boolean
}

export interface AnnouncementInput {
  id?: string
  audience: 'all' | 'client' | 'professional' | 'web'
  placement: 'banner' | 'dashboard' | 'modal' | 'support'
  title: string
  body: string
  cta_label: string
  cta_href: string
  starts_at: string | null
  ends_at: string | null
  active: boolean
}

export interface CategoryFormFieldInput {
  id?: string
  category_id: string
  field_key: string
  field_type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'address' | 'date' | 'time'
  label: string
  description: string
  placeholder: string
  options: Array<Record<string, unknown>> | null
  required: boolean
  min_value: number | null
  max_value: number | null
  min_length: number | null
  max_length: number | null
  pattern: string
  show_if: Record<string, unknown> | null
  display_order: number
  section: string
}

export interface AppContentInput {
  id?: string
  platform: 'shared' | 'ios' | 'android'
  screen_key: string
  section_key: string
  field_key: string
  value: string
  status: 'draft' | 'published' | 'archived'
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['admin', 'blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BlogPostInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        excerpt: input.excerpt || null,
        cover_image_url: input.cover_image_url || null,
        category: input.category || null,
        author_name: input.author_name || null,
        published_at: input.published_at || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('blog_posts')
        .upsert(row, { onConflict: 'slug' })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-posts'] })
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog-posts'] })
    },
  })
}

export function useNavigationItems() {
  return useQuery({
    queryKey: ['admin', 'navigation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('location', { ascending: true })
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveNavigationItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NavigationItemInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('navigation_items')
        .upsert({ ...input, updated_by: user.id }, { onConflict: 'nav_key,location,audience' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-items'] })
    },
  })
}

export function useDeleteNavigationItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('navigation_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'navigation-items'] })
    },
  })
}

export function useSiteSettings(settingKeys?: string[]) {
  return useQuery({
    queryKey: ['admin', 'site-settings', settingKeys?.join(',') ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('site_settings').select('*').order('setting_key', { ascending: true })
      if (settingKeys && settingKeys.length > 0) {
        query = query.in('setting_key', settingKeys)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveSiteSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SiteSettingInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('site_settings')
        .upsert({ ...input, updated_by: user.id }, { onConflict: 'setting_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
    },
  })
}

export function useMediaAssets() {
  return useQuery({
    queryKey: ['admin', 'media-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useFaqItems() {
  return useQuery({
    queryKey: ['admin', 'faq-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('faq_group', { ascending: true })
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveFaqItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: FaqItemInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('faq_items')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq-items'] })
    },
  })
}

export function useDeleteFaqItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faq_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faq-items'] })
    },
  })
}

export function useSaveMediaAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MediaAssetInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        title: input.title || null,
        alt_text: input.alt_text || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('media_assets')
        .upsert(row, { onConflict: 'asset_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-assets'] })
    },
  })
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media_assets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-assets'] })
    },
  })
}

export function useSurfaceSeo(surfaceType: SeoSurfaceType, surfaceKey: string) {
  return useQuery({
    queryKey: ['admin', 'seo', surfaceType, surfaceKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('surface_type', surfaceType)
        .eq('surface_key', surfaceKey)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!surfaceKey,
  })
}

export function useSaveSurfaceSeo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      surfaceType,
      surfaceKey,
      values,
    }: {
      surfaceType: SeoSurfaceType
      surfaceKey: string
      values: {
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
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        surface_type: surfaceType,
        surface_key: surfaceKey,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        og_title: values.og_title || null,
        og_description: values.og_description || null,
        og_image_url: values.og_image_url || null,
        twitter_title: values.twitter_title || null,
        twitter_description: values.twitter_description || null,
        twitter_image_url: values.twitter_image_url || null,
        canonical_url: values.canonical_url || null,
        robots_index: values.robots_index,
        robots_follow: values.robots_follow,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('seo_metadata')
        .upsert(row, { onConflict: 'surface_type,surface_key' })
      if (error) throw error
    },
    onSuccess: (_, { surfaceType, surfaceKey }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'seo', surfaceType, surfaceKey] })
    },
  })
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['admin', 'email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_kind', { ascending: true })
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: EmailTemplateInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        preview_text: input.preview_text || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('email_templates')
        .upsert(row, { onConflict: 'template_key' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] })
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('email_templates').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'email-templates'] })
    },
  })
}

export function useAnnouncements(placement?: AnnouncementInput['placement']) {
  return useQuery({
    queryKey: ['admin', 'announcements', placement ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('updated_at', { ascending: false })
      if (placement) {
        query = query.eq('placement', placement)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useNotificationsSummary() {
  return useQuery({
    queryKey: ['admin', 'notifications-summary'],
    queryFn: async () => {
      const [{ data: templates, error: templatesError }, { data: announcements, error: announcementsError }] =
        await Promise.all([
          supabase.from('email_templates').select('template_kind, active'),
          supabase.from('announcements').select('placement, active'),
        ])

      if (templatesError) throw templatesError
      if (announcementsError) throw announcementsError

      const emailTemplates = (templates ?? []).filter((row) => row.template_kind === 'template')
      const campaignDrafts = (templates ?? []).filter((row) => row.template_kind === 'campaign_draft')
      const activeAnnouncements = (announcements ?? []).filter((row) => row.active)
      const activeBannersAndModals = activeAnnouncements.filter(
        (row) => row.placement === 'banner' || row.placement === 'modal',
      )

      return {
        emailTemplates: emailTemplates.length,
        activeEmailTemplates: emailTemplates.filter((row) => row.active).length,
        campaignDrafts: campaignDrafts.length,
        activeAnnouncements: activeAnnouncements.length,
        activeBannersAndModals: activeBannersAndModals.length,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useSaveAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: AnnouncementInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        cta_label: input.cta_label || null,
        cta_href: input.cta_href || null,
        starts_at: input.starts_at || null,
        ends_at: input.ends_at || null,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('announcements')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements', input.placement] })
    },
  })
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    },
  })
}

export function useAppContentEntries(platform?: AppContentInput['platform'], screenKey?: string) {
  return useQuery({
    queryKey: ['admin', 'app-content', platform ?? 'all', screenKey ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('app_content')
        .select('*')
        .order('platform', { ascending: true })
        .order('screen_key', { ascending: true })
        .order('section_key', { ascending: true })
        .order('field_key', { ascending: true })

      if (platform) query = query.eq('platform', platform)
      if (screenKey) query = query.eq('screen_key', screenKey)

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSaveAppContentEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: AppContentInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const row = {
        ...input,
        updated_by: user.id,
      }

      const { error } = await supabase
        .from('app_content')
        .upsert(row, { onConflict: 'platform,screen_key,section_key,field_key' })

      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', input.platform] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'app-content', input.platform, input.screen_key] })
    },
  })
}

export function useTaskCategories() {
  return useQuery({
    queryKey: ['admin', 'task-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id,name')
        .order('name', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCategoryFormFields(categoryId?: string) {
  return useQuery({
    queryKey: ['admin', 'category-form-fields', categoryId ?? 'none'],
    queryFn: async () => {
      if (!categoryId) return []
      const { data, error } = await supabase
        .from('category_form_fields')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    enabled: !!categoryId,
  })
}

export function useSaveCategoryFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CategoryFormFieldInput) => {
      const row = {
        ...input,
        description: input.description || null,
        placeholder: input.placeholder || null,
        options: input.options,
        min_value: input.min_value,
        max_value: input.max_value,
        min_length: input.min_length,
        max_length: input.max_length,
        pattern: input.pattern || null,
        show_if: input.show_if,
        section: input.section || null,
      }

      const { error } = await supabase
        .from('category_form_fields')
        .upsert(row, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'category-form-fields', input.category_id] })
    },
  })
}

export function useDeleteCategoryFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, categoryId }: { id: string; categoryId: string }) => {
      const { error } = await supabase.from('category_form_fields').delete().eq('id', id)
      if (error) throw error
      return categoryId
    },
    onSuccess: (categoryId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'category-form-fields', categoryId] })
    },
  })
}
