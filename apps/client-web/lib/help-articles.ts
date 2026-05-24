import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import { getPageSeoMetadata } from '@/lib/cms'

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export interface HelpArticleRecord {
  article_key: string
  slug: string
  title: string
  breadcrumb: string
  summary: string | null
  sidebar_links_json: Array<{ name?: string; href?: string }>
  body_html: string
  related_links_json: Array<{ label?: string; href?: string }>
}

export async function getPublishedHelpArticle(slug: string): Promise<HelpArticleRecord | null> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('help_articles')
      .select('article_key, slug, title, breadcrumb, summary, sidebar_links_json, body_html, related_links_json')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) throw error
    return data as HelpArticleRecord | null
  } catch (error) {
    console.error(`[help-articles] Failed to fetch ${slug}:`, error)
    return null
  }
}

export async function getHelpArticleMetadata(slug: string, fallbackTitle: string, fallbackDescription: string): Promise<Metadata> {
  return getPageSeoMetadata(`help-${slug}`, {
    title: `${fallbackTitle} | Help | 100 Handy`,
    description: fallbackDescription,
  })
}
