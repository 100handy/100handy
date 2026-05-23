import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

/**
 * Lightweight Supabase client for public CMS reads.
 * Does NOT use cookies, so CMS-backed pages can opt into dynamic rendering
 * without depending on the authenticated app session.
 */
function createCmsClient() {
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

async function getSeoDefaults(): Promise<SeoDefaults> {
  try {
    const supabase = createCmsClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value_json')
      .eq('setting_key', 'seo.defaults')
      .maybeSingle()

    if (error) throw error
    return (data?.value_json as SeoDefaults | undefined) ?? {}
  } catch (error) {
    console.error('[CMS] Failed to fetch SEO defaults:', error)
    return {}
  }
}

function resolveCmsUrl(value?: string | null): string | undefined {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return value

  try {
    return new URL(value, siteUrl).toString()
  } catch {
    return value
  }
}

export interface SeoFallback {
  title: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImageUrl?: string
  canonicalUrl?: string
  robotsIndex?: boolean
  robotsFollow?: boolean
}

/**
 * Fetch all CMS content for a page.
 * Returns a lookup function: content('section.field', 'default value')
 *
 * Usage in RSC pages:
 *   const c = await getPageContent('home')
 *   <h1>{c('hero.title', 'Default Title')}</h1>
 */
export async function getPageContent(
  pageKey: string
): Promise<(key: string, fallback: string) => string> {
  let content: Record<string, string> = {}

  try {
    const supabase = createCmsClient()
    const { data } = await supabase
      .from('site_content')
      .select('section_key, field_key, value')
      .eq('page_key', pageKey)

    for (const row of data ?? []) {
      content[`${row.section_key}.${row.field_key}`] = row.value
    }
  } catch (error) {
    // If fetch fails, fall back to defaults silently
    console.error(`[CMS] Failed to fetch content for page "${pageKey}":`, error)
  }

  return (key: string, fallback: string) => content[key] || fallback
}

export async function getPageSeoMetadata(
  pageKey: string,
  fallback: SeoFallback
): Promise<Metadata> {
  try {
    const defaults = await getSeoDefaults()
    const supabase = createCmsClient()
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
      .eq('surface_type', 'page')
      .eq('surface_key', pageKey)
      .maybeSingle()

    if (error) throw error

    const title = data?.meta_title || fallback.title
    const description = data?.meta_description || fallback.description || defaults.defaultMetaDescription
    const ogTitle = data?.og_title || fallback.ogTitle || title
    const ogDescription = data?.og_description || fallback.ogDescription || description
    const ogImageUrl = resolveCmsUrl(data?.og_image_url || fallback.ogImageUrl || defaults.defaultOgImageUrl)
    const twitterTitle = data?.twitter_title || fallback.twitterTitle || ogTitle
    const twitterDescription = data?.twitter_description || fallback.twitterDescription || ogDescription
    const twitterImageUrl = resolveCmsUrl(data?.twitter_image_url || fallback.twitterImageUrl || ogImageUrl || defaults.defaultOgImageUrl)
    const canonicalUrl = resolveCmsUrl(data?.canonical_url || fallback.canonicalUrl || defaults.canonicalBaseUrl)
    const robotsIndex = data?.robots_index ?? fallback.robotsIndex ?? defaults.robotsIndex ?? true
    const robotsFollow = data?.robots_follow ?? fallback.robotsFollow ?? defaults.robotsFollow ?? true

    return {
      title,
      description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      },
      twitter: {
        card: twitterImageUrl ? 'summary_large_image' : 'summary',
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImageUrl ? [twitterImageUrl] : undefined,
      },
      alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
      robots: {
        index: robotsIndex,
        follow: robotsFollow,
      },
    }
  } catch (error) {
    console.error(`[CMS] Failed to fetch SEO metadata for page "${pageKey}":`, error)
    const defaults = await getSeoDefaults()
    return {
      title: fallback.title,
      description: fallback.description || defaults.defaultMetaDescription,
      openGraph: {
        title: fallback.ogTitle || fallback.title,
        description: fallback.ogDescription || fallback.description || defaults.defaultMetaDescription,
        images: resolveCmsUrl(fallback.ogImageUrl || defaults.defaultOgImageUrl)
          ? [{ url: resolveCmsUrl(fallback.ogImageUrl || defaults.defaultOgImageUrl)! }]
          : undefined,
      },
      twitter: {
        card: fallback.twitterImageUrl || fallback.ogImageUrl || defaults.defaultOgImageUrl ? 'summary_large_image' : 'summary',
        title: fallback.twitterTitle || fallback.ogTitle || fallback.title,
        description: fallback.twitterDescription || fallback.ogDescription || fallback.description || defaults.defaultMetaDescription,
        images: resolveCmsUrl(fallback.twitterImageUrl || defaults.defaultOgImageUrl)
          ? [resolveCmsUrl(fallback.twitterImageUrl || defaults.defaultOgImageUrl)!]
          : resolveCmsUrl(fallback.ogImageUrl || defaults.defaultOgImageUrl)
            ? [resolveCmsUrl(fallback.ogImageUrl || defaults.defaultOgImageUrl)!]
            : undefined,
      },
      alternates: resolveCmsUrl(fallback.canonicalUrl || defaults.canonicalBaseUrl)
        ? { canonical: resolveCmsUrl(fallback.canonicalUrl || defaults.canonicalBaseUrl)! }
        : undefined,
      robots: {
        index: fallback.robotsIndex ?? defaults.robotsIndex ?? true,
        follow: fallback.robotsFollow ?? defaults.robotsFollow ?? true,
      },
    }
  }
}
