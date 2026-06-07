import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface SeoDefaults {
  defaultMetaDescription?: string
  defaultOgImageUrl?: string
  canonicalBaseUrl?: string
  robotsIndex?: boolean
  robotsFollow?: boolean
}

const PUBLIC_WEB_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.100handy.com'

export function resolvePublicAssetUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return `${PUBLIC_WEB_BASE_URL.replace(/\/$/, '')}${trimmed}`
  }

  return `${PUBLIC_WEB_BASE_URL.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`
}

async function getSeoDefaults(): Promise<SeoDefaults> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value_json')
      .eq('setting_key', 'seo.defaults')
      .maybeSingle()
    if (error) throw error
    return (data?.value_json as SeoDefaults | undefined) ?? {}
  } catch (error) {
    console.error('[CMS] Failed to fetch global SEO defaults:', error)
    return {}
  }
}

export interface BlogPostRecord {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string
  cover_image_url: string | null
  category: string | null
  tags: string[]
  author_name: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
}

export interface NavigationItemRecord {
  id: string
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

export interface SiteSettingRecord {
  setting_group: string
  setting_key: string
  value_json: Record<string, unknown>
}

export interface FooterSection {
  title: string
  links: Array<{ label: string; href: string }>
}

export interface FooterSettings {
  socialLinks: Array<{ href: string; label: string }>
  appDownloads: Array<{ href: string; label: string }>
  followText: string
}

export interface BrandLogoSettings {
  dark: string
  cream: string
  mobile_green?: string
  mobile_cream?: string
}

export interface ServiceWebImageSettings {
  hero?: string
  mainCategoryImages?: Record<string, string>
  categoryHeroImages?: Record<string, string>
}

export interface HeaderSettings {
  signedOutLinks: Array<{ href: string; label: string }>
  proCta: { href: string; label: string }
}

export async function getPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('[CMS] Failed to fetch published blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`[CMS] Failed to fetch blog post "${slug}":`, error)
    return null
  }
}

export async function getSurfaceSeoMetadata(
  surfaceType: 'page' | 'blog_post',
  surfaceKey: string,
  fallback: Metadata
): Promise<Metadata> {
  try {
    const defaults = await getSeoDefaults()
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('seo_metadata')
      .select(`
        meta_title,
        meta_description,
        og_title,
        og_description,
        og_image_url,
        twitter_title,
        twitter_description,
        twitter_image_url,
        canonical_url,
        robots_index,
        robots_follow
      `)
      .eq('surface_type', surfaceType)
      .eq('surface_key', surfaceKey)
      .maybeSingle()

    if (error) throw error
    if (!data) return fallback

    return {
      ...fallback,
      title: data.meta_title || fallback.title,
      description: data.meta_description || fallback.description || defaults.defaultMetaDescription,
      openGraph: {
        ...(fallback.openGraph ?? {}),
        title: data.og_title || fallback.openGraph?.title || data.meta_title || fallback.title,
        description: data.og_description || fallback.openGraph?.description || data.meta_description || fallback.description || defaults.defaultMetaDescription,
        images: data.og_image_url
          ? [{ url: data.og_image_url }]
          : fallback.openGraph?.images || (defaults.defaultOgImageUrl ? [{ url: defaults.defaultOgImageUrl }] : undefined),
      },
      twitter: {
        ...(fallback.twitter ?? {}),
        title: data.twitter_title || fallback.twitter?.title || data.og_title || data.meta_title || fallback.title,
        description: data.twitter_description || fallback.twitter?.description || data.og_description || data.meta_description || fallback.description || defaults.defaultMetaDescription,
        images: data.twitter_image_url ? [data.twitter_image_url] : fallback.twitter?.images || (defaults.defaultOgImageUrl ? [defaults.defaultOgImageUrl] : undefined),
      },
      alternates: data.canonical_url
        ? { canonical: data.canonical_url }
        : fallback.alternates || (defaults.canonicalBaseUrl ? { canonical: defaults.canonicalBaseUrl } : undefined),
      robots: {
        index: data.robots_index ?? defaults.robotsIndex ?? true,
        follow: data.robots_follow ?? defaults.robotsFollow ?? true,
      },
    }
  } catch (error) {
    console.error(`[CMS] Failed to fetch SEO metadata for ${surfaceType}:${surfaceKey}:`, error)
    const defaults = await getSeoDefaults()
    return {
      ...fallback,
      description: fallback.description || defaults.defaultMetaDescription,
      openGraph: {
        ...(fallback.openGraph ?? {}),
        images: fallback.openGraph?.images || (defaults.defaultOgImageUrl ? [{ url: defaults.defaultOgImageUrl }] : undefined),
      },
      twitter: {
        ...(fallback.twitter ?? {}),
        images: fallback.twitter?.images || (defaults.defaultOgImageUrl ? [defaults.defaultOgImageUrl] : undefined),
      },
      alternates: fallback.alternates || (defaults.canonicalBaseUrl ? { canonical: defaults.canonicalBaseUrl } : undefined),
      robots: {
        index: defaults.robotsIndex ?? true,
        follow: defaults.robotsFollow ?? true,
      },
    }
  }
}

export async function getNavigationItems(
  location: NavigationItemRecord['location'],
  audience: NavigationItemRecord['audience'] = 'public'
): Promise<NavigationItemRecord[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('location', location)
      .eq('audience', audience)
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error(`[CMS] Failed to fetch navigation items for ${location}/${audience}:`, error)
    return []
  }
}

export async function getSiteSetting(settingKey: string): Promise<SiteSettingRecord | null> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_group, setting_key, value_json')
      .eq('setting_key', settingKey)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`[CMS] Failed to fetch site setting "${settingKey}":`, error)
    return null
  }
}

export async function getBrandLogoSettings(fallback: BrandLogoSettings): Promise<BrandLogoSettings> {
  const setting = await getSiteSetting('brand.logos')
  return {
    ...fallback,
    ...(setting?.value_json ?? {}),
  } as BrandLogoSettings
}

export async function getServiceWebImageSettings(fallback: ServiceWebImageSettings): Promise<ServiceWebImageSettings> {
  const setting = await getSiteSetting('services.web_images')
  return {
    ...fallback,
    ...(setting?.value_json ?? {}),
  } as ServiceWebImageSettings
}

export async function getPublicHeaderSettings(fallback: HeaderSettings): Promise<HeaderSettings> {
  const [items, ctaSetting] = await Promise.all([
    getNavigationItems('header', 'public'),
    getSiteSetting('header.pro_cta'),
  ])

  return {
    signedOutLinks: items.length > 0
      ? items.map((item) => ({ href: item.href, label: item.label }))
      : fallback.signedOutLinks,
    proCta: ctaSetting?.value_json && typeof ctaSetting.value_json.href === 'string' && typeof ctaSetting.value_json.label === 'string'
      ? { href: ctaSetting.value_json.href, label: ctaSetting.value_json.label }
      : fallback.proCta,
  }
}

export async function getFooterContent(
  fallbackSections: FooterSection[],
  fallbackSettings: FooterSettings
): Promise<{ sections: FooterSection[]; settings: FooterSettings }> {
  const [items, socialSetting, appSetting, followTextSetting] = await Promise.all([
    getNavigationItems('footer', 'public'),
    getSiteSetting('footer.social_links'),
    getSiteSetting('footer.app_downloads'),
    getSiteSetting('footer.follow_text'),
  ])

  const parentItems = items.filter((item) => !item.parent_id)
  const sections = parentItems.length > 0
    ? parentItems.map((parent) => ({
        title: parent.label,
        links: items
          .filter((item) => item.parent_id === parent.id)
          .map((item) => ({ label: item.label, href: item.href })),
      }))
    : fallbackSections

  const socialLinks = Array.isArray(socialSetting?.value_json?.items)
    ? (socialSetting?.value_json.items as Array<{ href: string; label: string }>)
    : fallbackSettings.socialLinks

  const appDownloads = Array.isArray(appSetting?.value_json?.items)
    ? (appSetting?.value_json.items as Array<{ href: string; label: string }>)
    : fallbackSettings.appDownloads

  const followText = typeof followTextSetting?.value_json?.text === 'string'
    ? (followTextSetting.value_json.text as string)
    : fallbackSettings.followText

  return {
    sections,
    settings: {
      socialLinks,
      appDownloads,
      followText,
    },
  }
}
